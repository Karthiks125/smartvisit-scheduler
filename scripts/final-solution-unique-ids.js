// scripts/final-solution-unique-ids.js
// Complete FHIR resource creation: Practitioners -> Schedules -> Slots

const HAPI_BASE = 'http://18.219.87.205:8080/fhir';

const timestamp = Date.now().toString().slice(-6);

const PRACTITIONERS = {
  ophthalmology: [
    { id: `oph-sarah-${timestamp}`, name: 'Dr. Sarah Johnson' },
    { id: `oph-michael-${timestamp}`, name: 'Dr. Michael Chen' }
  ],
  cardiology: [
    { id: `card-james-${timestamp}`, name: 'Dr. James Wilson' },
    { id: `card-maria-${timestamp}`, name: 'Dr. Maria Garcia' }
  ],
  gynecology: [
    { id: `gyn-emily-${timestamp}`, name: 'Dr. Emily Rodriguez' },
    { id: `gyn-priya-${timestamp}`, name: 'Dr. Priya Patel' }
  ]
};

const SERVICES = {
  ophthalmology: [
    { code: 'ophthal-test-1', display: 'OCT' },
    { code: 'ophthal-test-2', display: 'Visual Field' },
    { code: 'ophthal-test-3', display: 'AS-OCT' },
    { code: 'ophthal-test-4', display: 'Optos' },
    { code: 'ophthal-consult', display: 'Consultation' }
  ],
  cardiology: [
    { code: 'cardio-ekg', display: 'ECG' },
    { code: 'cardio-echo', display: 'Echocardiogram' },
    { code: 'cardio-test-3', display: 'Stress Test' },
    { code: 'cardio-consult', display: 'Consultation' }
  ],
  gynecology: [
    { code: 'gyn-ultrasound', display: 'Pelvic Ultrasound' },
    { code: 'gyn-pap', display: 'Lab Work' },
    { code: 'gyn-consult', display: 'Consultation' }
  ]
};

const DATES = Array.from({length: 10}, (_, i) => {
  const date = new Date('2026-01-06');
  date.setDate(date.getDate() + i);
  return date.toISOString().split('T')[0];
});

function generateTimeSlots() {
  const slots = [];
  for (let hour = 9; hour < 12; hour++) {
    slots.push({ start: `${hour}:00`, end: `${hour}:30` });
    slots.push({ start: `${hour}:30`, end: `${hour + 1}:00` });
  }
  for (let hour = 13; hour < 17; hour++) {
    slots.push({ start: `${hour}:00`, end: `${hour}:30` });
    slots.push({ start: `${hour}:30`, end: `${hour + 1}:00` });
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

// Step 1: Create Practitioner
async function createPractitioner(id, name) {
  const practitioner = {
    resourceType: 'Practitioner',
    id: id,
    name: [{ text: name, family: name.split(' ')[1], given: [name.split(' ')[1]] }],
    active: true
  };
  
  try {
    const response = await fetch(`${HAPI_BASE}/Practitioner/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify(practitioner)
    });
    return response.ok;
  } catch (err) {
    console.error(`❌ Error creating practitioner ${id}: ${err.message}`);
    return false;
  }
}

// Step 2: Create Schedule
async function createSchedule(id, practitionerId, practitionerName) {
  const schedule = {
    resourceType: 'Schedule',
    id: id,
    active: true,
    actor: [{ reference: `Practitioner/${practitionerId}`, display: practitionerName }],
    planningHorizon: {
      start: '2026-01-06T00:00:00-05:00',
      end: '2026-01-15T23:59:59-05:00'
    }
  };
  
  try {
    const response = await fetch(`${HAPI_BASE}/Schedule/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify(schedule)
    });
    return response.ok;
  } catch (err) {
    console.error(`❌ Error creating schedule ${id}: ${err.message}`);
    return false;
  }
}

// Step 3: Create Slot
async function createSlot(scheduleId, date, timeSlot, service) {
  const slot = {
    resourceType: 'Slot',
    schedule: { reference: `Schedule/${scheduleId}` },
    status: 'free',
    start: `${date}T${timeSlot.start}:00-05:00`,
    end: `${date}T${timeSlot.end}:00-05:00`,
    serviceType: [{
      coding: [{
        code: service.code,
        display: service.display
      }]
    }]
  };
  
  try {
    const response = await fetch(`${HAPI_BASE}/Slot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify(slot)
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function populate() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║    🏥 CREATING COMPLETE FHIR RESOURCES               ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  console.log(`🔑 Using timestamp: ${timestamp}\n`);
  
  let totalSlots = 0;
  
  for (const [specialty, practitioners] of Object.entries(PRACTITIONERS)) {
    console.log(`\n🏥 ${specialty.toUpperCase()}`);
    
    for (const practitioner of practitioners) {
      console.log(`\n   👨‍⚕️ ${practitioner.name} (${practitioner.id})`);
      
      // Create Practitioner
      process.stdout.write('      Creating Practitioner...');
      if (await createPractitioner(practitioner.id, practitioner.name)) {
        console.log(' ✅');
      } else {
        console.log(' ❌');
        continue;
      }
      
      // Create Schedule
      process.stdout.write('      Creating Schedule...');
      if (await createSchedule(practitioner.id, practitioner.id, practitioner.name)) {
        console.log(' ✅');
      } else {
        console.log(' ❌');
        continue;
      }
      
      // Create Slots
      process.stdout.write('      Creating Slots...');
      let count = 0;
      
      for (const date of DATES) {
        for (const service of SERVICES[specialty]) {
          for (const timeSlot of TIME_SLOTS) {
            if (await createSlot(practitioner.id, date, timeSlot, service)) {
              count++;
              totalSlots++;
            }
            await new Promise(r => setTimeout(r, 20));
          }
        }
      }
      console.log(` ✅ ${count} slots`);
    }
  }
  
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║                  🎉 COMPLETE!                         ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  console.log(`   ✅ Total slots: ${totalSlots}`);
  console.log(`   📅 Dates: ${DATES.length} (${DATES[0]} to ${DATES[9]})`);
  console.log(`   ⏰ Time slots: ${TIME_SLOTS.length} per day per service`);
  console.log('\n📋 COPY THESE IDs TO YOUR FRONTEND:\n');
  
  for (const [specialty, practitioners] of Object.entries(PRACTITIONERS)) {
    console.log(`  ${specialty}:`);
    practitioners.forEach(p => {
      console.log(`    { id: '${p.id}', name: '${p.name}' }`);
    });
  }
  
  console.log('\n🚀 Update app/orchestrator/page.tsx and lib/fhir-helpers.ts!\n');
}

populate().catch(console.error);
