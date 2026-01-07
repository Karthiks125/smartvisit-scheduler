export type Specialty = "Ophthalmology" | "Cardiology" | "Gynecology";
export type SlotStatus = "free" | "busy" | "busy-unavailable" | "busy-tentative";

export interface FHIRSlot {
  id: string;
  resourceType: "Slot";
  schedule: { reference: string };
  status: SlotStatus;
  start: string;
  end: string;
  serviceType?: Array<{ text: string }>;
  comment?: string;
}

export interface ParsedSlot extends FHIRSlot {
  serviceName: string;
  duration: string;
  coverage: string;
  specialty: Specialty;
  date: string;
  startTime: string;
  endTime: string;
}

export interface SelectedService {
  specialty: Specialty;
  serviceType: string;
}

export interface ScheduleOption {
  id: number;
  totalVisits: number;
  visitDates: string[];
  appointments: Array<{
    slotId: string;
    date: string;
    specialty: Specialty;
    serviceName: string;
    startTime: string;
    endTime: string;
    duration: string;
    coverage: string;
  }>;
}
