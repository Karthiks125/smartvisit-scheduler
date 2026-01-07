"use client";

import { useEffect, useState } from "react";
import { fetchPatient, fetchPractitioners, fetchAvailableSlots } from "@/lib/fhir-helpers";
import { FHIR_CONFIG } from "@/constants";

interface PatientData {
  patient: any;
  practitioners: any[];
  slots: any[];
}

export default function TestFHIR() {
  const [data, setData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function test() {
      try {
        const patient = await fetchPatient(FHIR_CONFIG.patientId);
        const practitioners = await fetchPractitioners();
        const slots = await fetchAvailableSlots();
        
        setData({ patient, practitioners, slots });
      } catch (error) {
        console.error("Error fetching FHIR data:", error);
      } finally {
        setLoading(false);
      }
    }
    test();
  }, []);

  if (loading) return <div className="p-8 text-xl text-white">Loading...</div>;

  if (!data) return <div className="p-8 text-xl text-red-400">Error loading data</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-8 text-white">✅ FHIR Connection Test</h1>
      
      <div className="space-y-6">
        <div className="bg-green-600 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2">
            Patient: {data.patient?.name?.[0]?.given?.join(" ")} {data.patient?.name?.[0]?.family}
          </h2>
          <p className="text-green-100 text-lg">ID: {data.patient?.id}</p>
        </div>

        <div className="bg-blue-600 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-3">
            Practitioners: {data.practitioners?.length}
          </h2>
          <div className="space-y-2">
            {data.practitioners?.map((p: any) => (
              <p key={p.id} className="text-blue-100 text-lg">
                • {p.name?.[0]?.prefix?.[0]} {p.name?.[0]?.given?.join(" ")} {p.name?.[0]?.family}
              </p>
            ))}
          </div>
        </div>

        <div className="bg-purple-600 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2">
            Available Slots: {data.slots?.length}
          </h2>
          <p className="text-purple-100 text-lg">Date Range: Jan 6-8, 2026</p>
        </div>
      </div>
    </div>
  );
}

