export const FHIR_CONFIG = {
  baseUrl: "http://hapi.fhir.org/baseR4",
  demoPatients: [
    { id: "53664812", name: "John Smith", dob: "1980-05-15", gender: "Male" },
    { id: "53684312", name: "Maria Garcia", dob: "1992-08-22", gender: "Female" },
    { id: "53684313", name: "Robert Chen", dob: "1975-03-15", gender: "Male" }
  ]
};

export const SPECIALTIES = ["Ophthalmology", "Cardiology", "Gynecology"] as const;
