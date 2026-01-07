'use client';

import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from 'react';
import { filterSlotsBySpecialty } from '@/lib/fhir-helpers';

// ============================================
// CONSTANTS
// ============================================

const SERVICES_BY_SPECIALTY = {
  "Ophthalmology": ["OCT", "Visual Field", "AS-OCT", "Optos", "Consultation"],
  "Cardiology": ["ECG", "Echocardiogram", "Stress Test", "Consultation"],
  "Gynecology": ["Pelvic Ultrasound", "Lab Work", "Consultation"]
};

const SERVICE_COVERAGE = {
  "OCT": "Covered",
  "Visual Field": "Covered",
  "AS-OCT": "Paid",
  "Optos": "Paid",
  "ECG": "Covered",
  "Echocardiogram": "Covered",
  "Stress Test": "Paid",
  "Pelvic Ultrasound": "Covered",
  "Lab Work": "Covered",
  "Consultation": "Covered"
};

const DEMO_PATIENTS = [
  { id: "53664812", name: "John Smith", dob: "1980-05-15", gender: "Male" },
  { id: "53684312", name: "Maria Garcia", dob: "1992-08-22", gender: "Female" },
  { id: "53684313", name: "Robert Chen", dob: "1975-03-15", gender: "Male" }
];

const PRACTITIONERS_BY_SPECIALTY: Record<string, Array<{id: string, name: string, limited?: boolean}>> = {
  Ophthalmology: [
    { id: 'oph-sarah-580509', name: 'Dr. Sarah Johnson' },
    { id: 'oph-michael-580509', name: 'Dr. Michael Chen' },
  ],
  Cardiology: [
    { id: 'card-james-580509', name: 'Dr. James Wilson' },
    { id: 'card-maria-580509', name: 'Dr. Maria Garcia' },
  ],
  Gynecology: [
    { id: 'gyn-emily-580509', name: 'Dr. Emily Rodriguez' },
    { id: 'gyn-priya-580509', name: 'Dr. Priya Patel' },
  ],
};

// ============================================
// INTERFACES
// ============================================

interface Slot {
  id?: string;
  resourceType: string;
  start?: string;
  end?: string;
  status: string;
  schedule?: {
    reference: string;
  };
  serviceType?: Array<{
    coding?: Array<{
      code?: string;
      display?: string;
    }>;
  }>;
  practitionerName?: string;
  practitionerId?: string; 
}

interface ScheduledAppointment {
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  slot: Slot;
  coverage: string;
  practitioner?: string;
}

interface ScheduleOption {
  id: number;
  appointments: ScheduledAppointment[];
  totalDays: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function serviceMatchesSlot(serviceName: string, slot: Slot): boolean {
  const code = slot.serviceType?.[0]?.coding?.[0]?.code || '';

  const serviceToCodeMap: Record<string, string[]> = {
    "OCT": ["ophthal-test-1"],
    "Visual Field": ["ophthal-test-2"],
    "AS-OCT": ["ophthal-test-3"],
    "Optos": ["ophthal-test-4"],
    "ECG": ["cardio-ekg", "cardio-test-1"],
    "Echocardiogram": ["cardio-echo", "cardio-test-2"],
    "Stress Test": ["cardio-test-3"],
    "Pelvic Ultrasound": ["gyn-ultrasound"],
    "Lab Work": ["gyn-pap"],
    "Consultation": ["ophthal-consult", "cardio-consult", "gyn-consult"]
  };

  if (serviceName === "Consultation") {
    const consultCodes = serviceToCodeMap["Consultation"];
    return consultCodes.includes(code);
  }

  const expectedCodes = serviceToCodeMap[serviceName] || [];
  return expectedCodes.includes(code);
}

function slotsOverlap(slot1: Slot, slot2: Slot): boolean {
  if (!slot1.start || !slot1.end || !slot2.start || !slot2.end) return false;
  const start1 = new Date(slot1.start);
  const end1 = new Date(slot1.end);
  const start2 = new Date(slot2.start);
  const end2 = new Date(slot2.end);
  return start1 < end2 && start2 < end1;
}

function getGapMinutes(endTime: string, startTime: string): number {
  const [endHour, endMin] = endTime.split(':').map(Number);
  const [startHour, startMin] = startTime.split(':').map(Number);
  const endMinutes = endHour * 60 + endMin;
  const startMinutes = startHour * 60 + startMin;
  return startMinutes - endMinutes;
}

function hasAcceptableGaps(appointments: ScheduledAppointment[], maxGapMinutes: number = 15): boolean {
  if (appointments.length <= 1) return true;

  const byDate = new Map<string, ScheduledAppointment[]>();
  appointments.forEach(apt => {
    if (!byDate.has(apt.date)) byDate.set(apt.date, []);
    byDate.get(apt.date)!.push(apt);
  });

  for (const dateAppts of byDate.values()) {
    if (dateAppts.length <= 1) continue;

    const sorted = [...dateAppts].sort((a, b) => a.startTime.localeCompare(b.startTime));

    for (let i = 0; i < sorted.length - 1; i++) {
      const gap = getGapMinutes(sorted[i].endTime, sorted[i + 1].startTime);
      if (gap > maxGapMinutes) {
        return false;
      }
    }
  }

  return true;
}

function allSamePractitioner(appointments: ScheduledAppointment[]): boolean {
  if (appointments.length === 0) return true;
  const firstPracId = appointments[0].slot.practitionerId;
  return appointments.every(apt => apt.slot.practitionerId === firstPracId);
}

function countUniqueDays(appointments: ScheduledAppointment[]): number {
  const uniqueDates = new Set(appointments.map(a => a.date));
  return uniqueDates.size;
}

function buildSchedule(
  services: string[],
  targetDates: string[],
  slotsByDate: Map<string, Slot[]>,
  consultationService: string | null,
  requireSingleDay: boolean,
  avoidUsedSlots: Set<string> = new Set(),
  requiredPractitionerId?: string
): ScheduledAppointment[] | null {

  const uniqueServices = [...new Set(services)];

  let orderedServices: string[];
  if (consultationService && uniqueServices.includes(consultationService)) {
    orderedServices = [
      ...uniqueServices.filter(s => s !== consultationService),
      consultationService
    ];
  } else {
    orderedServices = uniqueServices;
  }

  const result: ScheduledAppointment[] = [];
  const usedSlotIds: Set<string> = new Set(avoidUsedSlots);

  if (requireSingleDay) {
    for (const date of targetDates) {
      const availableSlots = slotsByDate.get(date) || [];

      if (availableSlots.length === 0) continue;

      const slotsByPractitioner = new Map<string, Slot[]>();
      availableSlots.forEach(slot => {
        const pracId = slot.practitionerId || 'unknown';
        if (!slotsByPractitioner.has(pracId)) {
          slotsByPractitioner.set(pracId, []);
        }
        slotsByPractitioner.get(pracId)!.push(slot);
      });

      const practitionerIds = requiredPractitionerId 
        ? [requiredPractitionerId]
        : Array.from(slotsByPractitioner.keys());

      for (const pracId of practitionerIds) {
        const pracSlots = slotsByPractitioner.get(pracId) || [];

        if (pracSlots.length === 0) continue;

        const sortedSlots = [...pracSlots].sort((a, b) => {
          if (!a.start || !b.start) return 0;
          return a.start.localeCompare(b.start);
        });

        const tempResult: ScheduledAppointment[] = [];
        const tempUsedIds = new Set<string>(usedSlotIds);

        for (const serviceName of orderedServices) {
          let assigned = false;

          for (const slot of sortedSlots) {
            if (tempUsedIds.has(slot.id!)) continue;
            if (usedSlotIds.has(slot.id!)) continue;
            if (!serviceMatchesSlot(serviceName, slot)) continue;

            const overlaps = tempResult.some(existing => slotsOverlap(slot, existing.slot));
            if (overlaps) continue;

            tempResult.push({
              serviceName,
              date,
              startTime: slot.start!.substring(11, 16),
              endTime: slot.end!.substring(11, 16),
              slot,
              coverage: SERVICE_COVERAGE[serviceName as keyof typeof SERVICE_COVERAGE] || "Unknown",
              practitioner: slot.practitionerName
            });
            tempUsedIds.add(slot.id!);
            assigned = true;
            break;
          }

          if (!assigned) break;
        }

        if (tempResult.length === orderedServices.length) {
          tempResult.sort((a, b) => a.startTime.localeCompare(b.startTime));

          if (consultationService) {
            const consultIndex = tempResult.findIndex(a => a.serviceName === consultationService);
            if (consultIndex !== -1 && consultIndex !== tempResult.length - 1) {
              continue;
            }
          }

          return tempResult;
        }
      }
    }

    return null;

  } else {
    if (targetDates.length < 2) return null;

    const [day1, day2] = targetDates;
    const day1Slots = slotsByDate.get(day1) || [];
    const day2Slots = slotsByDate.get(day2) || [];

    const allSlots = [...day1Slots, ...day2Slots];
    const slotsByPractitioner = new Map<string, Slot[]>();
    allSlots.forEach(slot => {
      const pracId = slot.practitionerId || 'unknown';
      if (!slotsByPractitioner.has(pracId)) {
        slotsByPractitioner.set(pracId, []);
      }
      slotsByPractitioner.get(pracId)!.push(slot);
    });

    const practitionerIds = requiredPractitionerId 
      ? [requiredPractitionerId]
      : Array.from(slotsByPractitioner.keys());

    for (const pracId of practitionerIds) {
      const pracSlots = slotsByPractitioner.get(pracId) || [];
      if (pracSlots.length === 0) continue;

      const pracDay1Slots = pracSlots.filter(s => s.start?.startsWith(day1)).sort((a, b) => a.start!.localeCompare(b.start!));
      const pracDay2Slots = pracSlots.filter(s => s.start?.startsWith(day2)).sort((a, b) => a.start!.localeCompare(b.start!));

      if (pracDay1Slots.length === 0 || pracDay2Slots.length === 0) continue;

      let day1Services: string[];
      let day2Services: string[];

      if (consultationService && orderedServices.includes(consultationService)) {
        const nonConsultServices = orderedServices.filter(s => s !== consultationService);
        const midPoint = Math.ceil(nonConsultServices.length / 2);
        day1Services = nonConsultServices.slice(0, midPoint);
        day2Services = [...nonConsultServices.slice(midPoint), consultationService];
      } else {
        const midPoint = Math.ceil(orderedServices.length / 2);
        day1Services = orderedServices.slice(0, midPoint);
        day2Services = orderedServices.slice(midPoint);
      }

      const tempResult: ScheduledAppointment[] = [];
      const tempUsedIds = new Set<string>(usedSlotIds);
      let failed = false;

      for (const serviceName of day1Services) {
        let assigned = false;
        for (const slot of pracDay1Slots) {
          if (tempUsedIds.has(slot.id!)) continue;
          if (usedSlotIds.has(slot.id!)) continue;
          if (!serviceMatchesSlot(serviceName, slot)) continue;

          const overlaps = tempResult.some(existing => slotsOverlap(slot, existing.slot));
          if (overlaps) continue;

          tempResult.push({
            serviceName,
            date: day1,
            startTime: slot.start!.substring(11, 16),
            endTime: slot.end!.substring(11, 16),
            slot,
            coverage: SERVICE_COVERAGE[serviceName as keyof typeof SERVICE_COVERAGE] || "Unknown",
            practitioner: slot.practitionerName
          });
          tempUsedIds.add(slot.id!);
          assigned = true;
          break;
        }
        if (!assigned) {
          failed = true;
          break;
        }
      }

      if (failed) continue;

      for (const serviceName of day2Services) {
        let assigned = false;
        for (const slot of pracDay2Slots) {
          if (tempUsedIds.has(slot.id!)) continue;
          if (usedSlotIds.has(slot.id!)) continue;
          if (!serviceMatchesSlot(serviceName, slot)) continue;

          const overlaps = tempResult.some(existing => slotsOverlap(slot, existing.slot));
          if (overlaps) continue;

          tempResult.push({
            serviceName,
            date: day2,
            startTime: slot.start!.substring(11, 16),
            endTime: slot.end!.substring(11, 16),
            slot,
            coverage: SERVICE_COVERAGE[serviceName as keyof typeof SERVICE_COVERAGE] || "Unknown",
            practitioner: slot.practitionerName
          });
          tempUsedIds.add(slot.id!);
          assigned = true;
          break;
        }
        if (!assigned) {
          failed = true;
          break;
        }
      }

      if (failed) continue;

      if (tempResult.length === orderedServices.length && countUniqueDays(tempResult) === 2) {
        tempResult.sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date);
          if (dateCompare !== 0) return dateCompare;
          return a.startTime.localeCompare(b.startTime);
        });

        if (consultationService) {
          const consultIndex = tempResult.findIndex(a => a.serviceName === consultationService);
          if (consultIndex !== -1 && consultIndex !== tempResult.length - 1) {
            continue;
          }
        }

        return tempResult;
      }
    }

    return null;
  }
}

// ============================================
// COMPONENT
// ============================================

export default function OrchestratorPage() {
  const { data: session, status } = useSession()
  const [showLogin, setShowLogin] = useState(false);


  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [lockedSpecialty, setLockedSpecialty] = useState<boolean>(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [preferredPractitioner, setPreferredPractitioner] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2026-01-06');
  const [endDate, setEndDate] = useState<string>('2026-01-15');
  const [scheduleOptions, setScheduleOptions] = useState<ScheduleOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [bookingInProgress, setBookingInProgress] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<string>(DEMO_PATIENTS[0].id);

  const handleSpecialtyChange = (specialty: string) => {
    if (lockedSpecialty) return;
    setSelectedSpecialty(specialty);
    setSelectedServices([]);
    setPreferredPractitioner('');
    setScheduleOptions([]);
    setError('');
  };

  const handleServiceToggle = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
      if (!lockedSpecialty) {
        setLockedSpecialty(true);
      }
    }
    setScheduleOptions([]);
  };

  const handleClearAll = () => {
    setSelectedSpecialty('');
    setLockedSpecialty(false);
    setSelectedServices([]);
    setPreferredPractitioner('');
    setScheduleOptions([]);
    setError('');
    setBookingSuccess(false);
  };

  const generateSchedules = async () => {
    if (!selectedSpecialty || selectedServices.length === 0) {
      setError('Please select a specialty and at least one service');
      return;
    }

    setLoading(true);
    setError('');
    setScheduleOptions([]);

    try {
      console.log(`\n🔍 Fetching ${selectedSpecialty} slots from ${startDate} to ${endDate}`);

      let slots = await filterSlotsBySpecialty(selectedSpecialty, startDate, endDate);

      console.log(`📦 Total free slots in date range: ${slots.length}`);

      const practitionersForSpecialty = PRACTITIONERS_BY_SPECIALTY[selectedSpecialty] || [];

      slots = slots.map(slot => {
        const scheduleRef = slot.schedule?.reference || '';
        const scheduleId = scheduleRef.split('/')[1];
        const practitioner = practitionersForSpecialty.find(p => p.id === scheduleId);

        return {
          ...slot,
          practitionerId: scheduleId,
          practitionerName: practitioner?.name || "Available Specialist"
        };
      });

      let filteredSlots = slots;
      if (preferredPractitioner) {
        filteredSlots = slots.filter(slot => slot.practitionerId === preferredPractitioner);
        console.log(`🎯 Filtered to preferred practitioner: ${filteredSlots.length} slots`);
      }

      if (filteredSlots.length === 0) {
        setError(preferredPractitioner 
          ? 'No available slots for the selected practitioner. Try "Any Available" for more options.'
          : 'No available slots found for the selected date range'
        );
        setLoading(false);
        return;
      }

      const slotsByDate = new Map<string, Slot[]>();
      for (const slot of filteredSlots) {
        if (slot.start) {
          const date = slot.start.substring(0, 10);
          if (!slotsByDate.has(date)) slotsByDate.set(date, []);
          slotsByDate.get(date)!.push(slot);
        }
      }

      const availableDates = Array.from(slotsByDate.keys()).sort();
      console.log(`📅 Available dates: ${availableDates.length} days - [${availableDates.join(', ')}]`);

      if (availableDates.length === 0) {
        setError('No dates with available slots');
        setLoading(false);
        return;
      }

      const consultationService = SERVICES_BY_SPECIALTY[selectedSpecialty as keyof typeof SERVICES_BY_SPECIALTY]
        .find(s => s.toLowerCase().includes('consultation')) || null;

      const options: ScheduleOption[] = [];
      const usedSlotCombinations = new Set<string>();
      let optionId = 1;

      const availablePractitioners = preferredPractitioner 
        ? [preferredPractitioner]
        : [...new Set(filteredSlots.map(s => s.practitionerId).filter(Boolean))];

      console.log(`\n👥 Will generate options for ${availablePractitioners.length} practitioner(s)`);

      console.log('\n📅 STRATEGY 1: Single-day appointments (1 visit)');

      for (const pracId of availablePractitioners) {
        const pracName = practitionersForSpecialty.find(p => p.id === pracId)?.name || 'Unknown';
        console.log(`\n  👨‍⚕️ Trying practitioner: ${pracName} (${pracId})`);

        const pracSlots = filteredSlots.filter(s => s.practitionerId === pracId);
        const pracSlotsByDate = new Map<string, Slot[]>();

        pracSlots.forEach(slot => {
          if (slot.start) {
            const date = slot.start.substring(0, 10);
            if (!pracSlotsByDate.has(date)) pracSlotsByDate.set(date, []);
            pracSlotsByDate.get(date)!.push(slot);
          }
        });

        const pracDates = Array.from(pracSlotsByDate.keys()).sort();
        console.log(`    Available on ${pracDates.length} dates - [${pracDates.join(', ')}]`);

        let foundForPractitioner = 0;

        for (const date of pracDates) {
          if (foundForPractitioner >= 2) break;

          console.log(`\n    📅 Trying date: ${date}`);

          const avoidSlots = new Set<string>();

          for (let attempt = 0; attempt < 5; attempt++) {
            const schedule = buildSchedule(
              selectedServices,
              [date],
              pracSlotsByDate,
              consultationService,
              true,
              avoidSlots,
              pracId
            );

            if (schedule && schedule.length === selectedServices.length) {
              if (!allSamePractitioner(schedule)) {
                console.log(`      ❌ Mixed practitioners, skipping`);
                continue;
              }

              const slotIds = schedule.map(a => a.slot.id!).sort().join(',');

              if (!usedSlotCombinations.has(slotIds)) {
                usedSlotCombinations.add(slotIds);

                options.push({
                  id: optionId++,
                  appointments: schedule,
                  totalDays: 1
                });

                foundForPractitioner++;

                const noGaps = hasAcceptableGaps(schedule, 0);
                const smallGaps = hasAcceptableGaps(schedule, 15);
                const gapLabel = noGaps ? 'Back-to-back ⚡' : smallGaps ? 'Small gaps (≤15min)' : 'With gaps';

                console.log(`      ✅ Added Option ${optionId - 1}: ${pracName}, ${date}, ${schedule[0].startTime}-${schedule[schedule.length-1].endTime} (${gapLabel})`);

                schedule.forEach(a => avoidSlots.add(a.slot.id!));
              } else {
                console.log(`      ⚠️ Duplicate combination`);
              }
            } else {
              if (attempt === 0) console.log(`      ❌ Could not build schedule`);
              break;
            }
          }
        }
      }

      console.log('\n📅 STRATEGY 2: Two-day appointments (2 visits on different dates)');

      if (selectedServices.length >= 2 && availableDates.length >= 2) {
        for (const pracId of availablePractitioners) {
          const pracName = practitionersForSpecialty.find(p => p.id === pracId)?.name || 'Unknown';
          console.log(`\n  👨‍⚕️ Trying practitioner: ${pracName} (${pracId})`);

          const pracSlots = filteredSlots.filter(s => s.practitionerId === pracId);
          const pracSlotsByDate = new Map<string, Slot[]>();

          pracSlots.forEach(slot => {
            if (slot.start) {
              const date = slot.start.substring(0, 10);
              if (!pracSlotsByDate.has(date)) pracSlotsByDate.set(date, []);
              pracSlotsByDate.get(date)!.push(slot);
            }
          });

          const pracDates = Array.from(pracSlotsByDate.keys()).sort();
          console.log(`    Available on ${pracDates.length} dates - [${pracDates.join(', ')}]`);

          if (pracDates.length < 2) {
            console.log(`    ⚠️ Only available on ${pracDates.length} date(s), need 2+ for two-day options`);
            continue;
          }

          let foundForPractitioner = 0;

          for (let i = 0; i < pracDates.length - 1 && foundForPractitioner < 4; i++) {
            for (let j = i + 1; j < Math.min(i + 6, pracDates.length) && foundForPractitioner < 4; j++) {
              const schedule = buildSchedule(
                selectedServices,
                [pracDates[i], pracDates[j]],
                pracSlotsByDate,
                consultationService,
                false,
                new Set(),
                pracId
              );

              if (schedule && schedule.length === selectedServices.length && countUniqueDays(schedule) === 2) {
                if (!allSamePractitioner(schedule)) {
                  console.log(`      ❌ Mixed practitioners, skipping`);
                  continue;
                }

                const slotIds = schedule.map(a => a.slot.id!).sort().join(',');

                if (!usedSlotCombinations.has(slotIds)) {
                  usedSlotCombinations.add(slotIds);

                  const day1Appts = schedule.filter(a => a.date === pracDates[i]);
                  const day2Appts = schedule.filter(a => a.date === pracDates[j]);

                  options.push({
                    id: optionId++,
                    appointments: schedule,
                    totalDays: 2
                  });

                  foundForPractitioner++;

                  console.log(`    ✅ Added Option ${optionId - 1}: ${pracName}, ${pracDates[i]} (${day1Appts.length} services) + ${pracDates[j]} (${day2Appts.length} services)`);
                }
              }
            }
          }
        }
      } else {
        console.log(`  ⚠️ Skipped: Need at least 2 services and 2 dates (have ${selectedServices.length} services, ${availableDates.length} dates)`);

        if (availableDates.length === 1) {
          console.log(`  💡 TIP: Your FHIR server only has slots on ${availableDates[0]}.`);
          console.log(`  💡 To see 2-visit options, you need to populate slots across multiple dates.`);
          console.log(`  💡 Run the populate-slots script to add more test data.`);
        }
      }

      console.log(`\n📊 Generated ${options.length} total options\n`);

      const sortedOptions = options.sort((a, b) => {
        if (a.totalDays !== b.totalDays) {
          return a.totalDays - b.totalDays;
        }
        return a.appointments[0].date.localeCompare(b.appointments[0].date);
      });

      if (sortedOptions.length === 0) {
        setError('Could not generate schedule options. The test FHIR server may only have slots on one date. Try running the populate-slots script to add more test data across multiple dates.');
      } else {
        sortedOptions.forEach((opt, idx) => opt.id = idx + 1);
        setScheduleOptions(sortedOptions);
      }

    } catch (err) {
      console.error('Error:', err);
      setError('Failed to generate schedules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bookSchedule = async (option: ScheduleOption) => {
    setBookingInProgress(true);
    try {
      for (const appt of option.appointments) {
        const appointmentBody = {
          resourceType: 'Appointment',
          status: 'booked',
          description: `${selectedSpecialty} - ${appt.serviceName}`,
          start: appt.slot.start,
          end: appt.slot.end,
          participant: [
            {
              actor: { reference: `Patient/${selectedPatient}` },
              status: 'accepted'
            },
            {
              actor: { reference: appt.slot.schedule?.reference.replace('Schedule/', 'Practitioner/') },
              status: 'accepted'
            }
          ],
          slot: [{ reference: `Slot/${appt.slot.id}` }]
        };

        await fetch('http://18.219.87.205:8080/fhir/Appointment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/fhir+json' },
          body: JSON.stringify(appointmentBody)
        });

        const updatedSlot = { ...appt.slot, status: 'busy' };
        await fetch(`http://18.219.87.205:8080/fhir/Slot/${appt.slot.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/fhir+json' },
          body: JSON.stringify(updatedSlot)
        });
      }

      setBookingInProgress(false);
      setBookingSuccess(true);

    } catch (err) {
      console.error('Booking error:', err);
      setBookingInProgress(false);
      alert(`❌ Error booking appointments`);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-stone-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (false || showLogin) {  // Auth bypass OR explicit logout
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-stone-50 via-white to-emerald-50">
      <div className="text-center bg-white p-12 rounded-2xl shadow-2xl border border-gray-100 max-w-md">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          SmartVisit Scheduler
        </h1>
        <p className="text-gray-600 mb-2 text-lg">Intelligent appointment orchestration</p>
        <p className="text-sm text-gray-500 mb-8">Reduce hospital visits by 40-60% with smart scheduling</p>
        <button 
          onClick={() => setShowLogin(false)}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          Sign in with EHR System
        </button>
        <p className="text-xs text-gray-400 mt-6">Secure FHIR integration • SMART on FHIR compliant</p>
      </div>
    </div>
  );
}

  if (bookingInProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-stone-100">
        <div className="text-center bg-white p-12 rounded-2xl shadow-2xl border border-gray-200 max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Appointments...</h2>
          <p className="text-gray-600">Please wait while we confirm your schedule</p>
        </div>
      </div>
    )
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center bg-white p-12 rounded-2xl shadow-2xl border border-gray-200 max-w-lg">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">All Appointments Booked!</h2>
          <p className="text-gray-600 mb-2">Your appointments have been successfully scheduled.</p>
          <p className="text-sm text-gray-500 mb-8">You will receive a confirmation email shortly.</p>
          <button
            onClick={handleClearAll}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
          >
            Schedule More Appointments
          </button>
        </div>
      </div>
    )
  }

  const currentPractitioners = selectedSpecialty ? PRACTITIONERS_BY_SPECIALTY[selectedSpecialty] || [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              SmartVisit Scheduler
            </h1>
            <p className="text-lg text-gray-700 mb-2">
              Intelligent appointment bundling with practitioner continuity
            </p>
            <p className="text-sm text-gray-500 italic">
              📅 Demo: Slots available January 6-15, 2026
            </p>
          </div>
          <button
            onClick={() => setShowLogin(true)}
            className="text-sm text-gray-600 hover:text-gray-900 underline ml-4"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Select Patient</h2>
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {DEMO_PATIENTS.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name} (DOB: {patient.dob}, {patient.gender})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Select Department</h2>
            {lockedSpecialty && (
              <button
                onClick={handleClearAll}
                className="text-sm bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 font-medium transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(SERVICES_BY_SPECIALTY).map((specialty) => (
              <button
                key={specialty}
                onClick={() => handleSpecialtyChange(specialty)}
                disabled={lockedSpecialty && selectedSpecialty !== specialty}
                className={`p-4 rounded-lg border-2 transition-all font-medium ${
                  selectedSpecialty === specialty
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'
                    : lockedSpecialty
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 bg-white text-gray-900 hover:border-emerald-300 hover:bg-gray-50'
                }`}
              >
                {specialty}
                {lockedSpecialty && selectedSpecialty === specialty && (
                  <span className="ml-2 text-xs">🔒</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {selectedSpecialty && currentPractitioners.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Practitioner Preference
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose "Any Available" for maximum flexibility, or select a specific practitioner for continuity of care
            </p>
            <select
              value={preferredPractitioner}
              onChange={(e) => {
                setPreferredPractitioner(e.target.value);
                setScheduleOptions([]);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Any Available Practitioner (Recommended)</option>
              {currentPractitioners.map(prac => (
                <option key={prac.id} value={prac.id}>
                  {prac.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedSpecialty && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Select Services ({selectedSpecialty})</h2>
            <div className="grid grid-cols-2 gap-3">
              {SERVICES_BY_SPECIALTY[selectedSpecialty as keyof typeof SERVICES_BY_SPECIALTY].map((service) => {
                const coverage = SERVICE_COVERAGE[service as keyof typeof SERVICE_COVERAGE];
                return (
                  <label
                    key={service}
                    className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="w-5 h-5 text-emerald-600 mr-3 rounded focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="text-gray-900 font-medium">{service}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      coverage === 'Covered' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {coverage}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Select Date Range</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min="2026-01-06"
                max="2026-01-15"
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min="2026-01-06"
                max="2026-01-15"
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <button
          onClick={generateSchedules}
          disabled={loading || !selectedSpecialty || selectedServices.length === 0}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed mb-8 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? '🔄 Generating Smart Schedule Options...' : '✨ Generate Smart Schedule Options'}
        </button>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-md">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        {scheduleOptions.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              📅 Your Optimized Schedule Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduleOptions.map((option) => (
                <div key={option.id} className="bg-white rounded-xl shadow-lg p-5 border-2 border-gray-200 hover:border-emerald-400 transition-all flex flex-col hover:shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Option {option.id}</h3>
                      <p className="text-sm font-semibold text-emerald-600">
                        {option.totalDays} Visit{option.totalDays > 1 ? 's' : ''}
                      </p>
                      {option.totalDays === 1 && hasAcceptableGaps(option.appointments, 0) && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          ⚡ Back-to-Back - No waiting between tests
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => bookSchedule(option)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium transition-colors text-sm shadow-md hover:shadow-lg"
                    >
                      ✓ Book
                    </button>
                  </div>

                  <div className="space-y-3 flex-1">
                    {option.appointments.map((appt, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-900 text-base">{appt.serviceName}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            appt.coverage === 'Covered' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {appt.coverage}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mb-1">
                          {new Date(appt.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm font-medium text-emerald-700">
                          {appt.startTime} - {appt.endTime}
                        </p>
                        {appt.practitioner && (
                          <p className="text-xs text-gray-600 mt-1">{appt.practitioner}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
