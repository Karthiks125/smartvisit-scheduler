// lib/fhir-helpers.ts

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
}

// YOUR UNIQUE PRACTITIONER IDs - MUST MATCH page.tsx
const PRACTITIONERS_BY_SPECIALTY: Record<string, string[]> = {
  "Ophthalmology": ["oph-sarah-580509", "oph-michael-580509"],
  "Cardiology": ["card-james-580509", "card-maria-580509"],
  "Gynecology": ["gyn-emily-580509", "gyn-priya-580509"]
};

export async function filterSlotsBySpecialty(
  specialty: string, 
  startDate: string, 
  endDate: string,
  accessToken?: string
): Promise<Slot[]> {

  const baseUrl = 'http://18.219.87.205:8080/fhir';

  const headers: Record<string, string> = {
    'Accept': 'application/fhir+json'
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  console.log(`\n🔍 Fetching ${specialty} slots from ${startDate} to ${endDate}`);

  try {
    // Get practitioner IDs for this specialty
    const practitionerIds = PRACTITIONERS_BY_SPECIALTY[specialty] || [];

    if (practitionerIds.length === 0) {
      console.error(`❌ No practitioners defined for ${specialty}`);
      return [];
    }

    console.log(`👥 Fetching slots for practitioners: [${practitionerIds.join(', ')}]`);

    // Fetch slots for EACH practitioner separately
    const allSlots: Slot[] = [];

    for (const pracId of practitionerIds) {
      const url = `${baseUrl}/Slot?schedule=Schedule/${pracId}&status=free&_count=200&start=ge${startDate}&start=le${endDate}`;
      console.log(`📞 Query for ${pracId}: ${url}`);

      const response = await fetch(url, { headers });

      if (!response.ok) {
        console.error(`❌ FHIR query failed for ${pracId}: ${response.status}`);
        continue;
      }

      const bundle = await response.json();
      const slots = bundle.entry?.map((e: any) => e.resource) || [];

      console.log(`   ✅ Found ${slots.length} slots for ${pracId}`);
      allSlots.push(...slots);
    }

    console.log(`📦 Total ${specialty} slots: ${allSlots.length}`);

    // Show service codes for debugging
    if (allSlots.length > 0) {
      const allCodes = [...new Set(allSlots.map((s: any) => 
        s.serviceType?.[0]?.coding?.[0]?.code
      ))];
      console.log(`📋 Service codes: [${allCodes.join(', ')}]`);
    } else {
      console.log(`\n⚠️ NO SLOTS FOUND FOR ${specialty}!`);
      console.log(`💡 Make sure you ran: node scripts/final-solution-unique-ids.js`);
      console.log(`💡 Practitioner IDs: [${practitionerIds.join(', ')}]`);
    }

    return allSlots;

  } catch (error) {
    console.error('❌ Error fetching slots:', error);
    return [];
  }
}
