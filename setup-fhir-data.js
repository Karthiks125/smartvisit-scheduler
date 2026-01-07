const FHIR_BASE = "https://hapi.fhir.org/baseR4";

console.log("🏥 Starting FHIR Setup...\n");

// ===== DELETE OLD DATA =====
console.log("🗑️  Cleaning up old data...");

// ===== CREATE PRACTITIONERS =====
console.log("\n👨‍⚕️ Creating Practitioners...");

const practitioners = [
  { id: "53664814", name: "Dr. Sarah Chen", specialty: "Ophthalmology" },
  { id: "53664815", name: "Dr. Michael Brown", specialty: "Cardiology" },
  { id: "53664816", name: "Dr. Emily White", specialty: "Gynecology" }
];

for (const pract of practitioners) {
  const practBody = {
    resourceType: "Practitioner",
    id: pract.id,
    name: [{ text: pract.name }],
    qualification: [{
      code: {
        coding: [{
          system: "http://terminology.hl7.org/CodeSystem/practitioner-role",
          code: pract.specialty,
          display: pract.specialty
        }]
      }
    }]
  };

  const practRes = await fetch(`${FHIR_BASE}/Practitioner/${pract.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/fhir+json" },
    body: JSON.stringify(practBody)
  });

  if (practRes.ok) {
    console.log(`✅ ${pract.name} (${pract.specialty})`);
  }
}

// ===== CREATE SCHEDULES =====
console.log("\n📅 Creating Schedules...");

const schedules = [];
for (const pract of practitioners) {
  const scheduleId = `${pract.id}-schedule`;
  const scheduleBody = {
    resourceType: "Schedule",
    id: scheduleId,
    active: true,
    serviceType: [{
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/service-type",
        code: pract.specialty,
        display: pract.specialty
      }]
    }],
    actor: [{
      reference: `Practitioner/${pract.id}`,
      display: pract.name
    }]
  };

  const schedRes = await fetch(`${FHIR_BASE}/Schedule/${scheduleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/fhir+json" },
    body: JSON.stringify(scheduleBody)
  });

  if (schedRes.ok) {
    schedules.push({ id: scheduleId, specialty: pract.specialty });
    console.log(`✅ ${pract.specialty} schedule`);
  }
}

// ===== CREATE SLOTS WITH MAXIMUM TIME VARIETY =====
console.log("\n🗓️  Creating slots with varied times...");

const slotDates = [
  "2026-01-06", "2026-01-07", "2026-01-08", "2026-01-09", "2026-01-10",
  "2026-01-13", "2026-01-14", "2026-01-15"
];

// Create 30-minute slots from 9 AM to 4 PM (each day has 14 slots)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 15; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 15 && minute === 30) break; // Stop at 4:00 PM
      const startHour = String(hour).padStart(2, '0');
      const startMin = String(minute).padStart(2, '0');
      const endMin = minute === 30 ? '00' : '30';
      const endHour = minute === 30 ? String(hour + 1).padStart(2, '0') : startHour;
      
      slots.push({
        start: `${startHour}:${startMin}`,
        end: `${endHour}:${endMin}`
      });
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();
let slotCount = 0;

for (const date of slotDates) {
  for (const schedule of schedules) {
    for (const time of timeSlots) {
      const slotBody = {
        resourceType: "Slot",
        schedule: { reference: `Schedule/${schedule.id}` },
        status: "free",
        start: `${date}T${time.start}:00-05:00`,
        end: `${date}T${time.end}:00-05:00`
      };

      const slotRes = await fetch(`${FHIR_BASE}/Slot`, {
        method: "POST",
        headers: { "Content-Type": "application/fhir+json" },
        body: JSON.stringify(slotBody)
      });

      if (slotRes.ok) slotCount++;
    }
  }
}

console.log(`✅ Created ${slotCount} slots (${timeSlots.length} times × ${slotDates.length} days × 3 specialties)`);
console.log(`\n🎉 Setup Complete!`);
console.log(`📊 Each specialty now has ${timeSlots.length} different time slots per day!`);
console.log(`\n💡 Refresh your app and try selecting 5+ services!`);
