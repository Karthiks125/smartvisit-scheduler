#!/bin/bash

echo "🩺 Creating Practitioners and Schedules..."

# OPHTHALMOLOGY
echo "=== OPHTHALMOLOGY ==="

# Dr. Sarah Johnson
echo "Creating Dr. Sarah Johnson..."
PRAC1=$(curl -s -X POST https://hapi.fhir.org/baseR4/Practitioner \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Practitioner",
    "name": [{"family": "Johnson", "given": ["Sarah"], "prefix": ["Dr."]}],
    "qualification": [{"code": {"coding": [{"code": "ophthalmology", "display": "Ophthalmology"}]}}]
  }' | grep -o '"id":"[0-9]*"' | head -1 | cut -d'"' -f4)

SCHED1=$(curl -s -X POST https://hapi.fhir.org/baseR4/Schedule \
  -H "Content-Type: application/fhir+json" \
  -d "{
    \"resourceType\": \"Schedule\",
    \"active\": true,
    \"actor\": [{\"reference\": \"Practitioner/$PRAC1\", \"display\": \"Dr. Sarah Johnson\"}],
    \"specialty\": [{\"coding\": [{\"code\": \"ophthalmology\", \"display\": \"Ophthalmology\"}]}]
  }" | grep -o '"id":"[0-9]*"' | head -1 | cut -d'"' -f4)

echo "✓ Dr. Johnson Schedule: $SCHED1"

# Dr. Michael Chen
echo "Creating Dr. Michael Chen..."
PRAC2=$(curl -s -X POST https://hapi.fhir.org/baseR4/Practitioner \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Practitioner",
    "name": [{"family": "Chen", "given": ["Michael"], "prefix": ["Dr."]}],
    "qualification": [{"code": {"coding": [{"code": "ophthalmology", "display": "Ophthalmology"}]}}]
  }' | grep -o '"id":"[0-9]*"' | head -1 | cut -d'"' -f4)

SCHED2=$(curl -s -X POST https://hapi.fhir.org/baseR4/Schedule \
  -H "Content-Type: application/fhir+json" \
  -d "{
    \"resourceType\": \"Schedule\",
    \"active\": true,
    \"actor\": [{\"reference\": \"Practitioner/$PRAC2\", \"display\": \"Dr. Michael Chen\"}],
    \"specialty\": [{\"coding\": [{\"code\": \"ophthalmology\", \"display\": \"Ophthalmology\"}]}]
  }" | grep -o '"id":"[0-9]*"' | head -1 | cut -d'"' -f4)

echo "✓ Dr. Chen Schedule: $SCHED2"

# CARDIOLOGY
echo "=== CARDIOLOGY ==="

# Dr. James Wilson
echo "Creating Dr. James Wilson..."
PRAC3=$(curl -s -X POST https://hapi.fhir.org/baseR4/Practitioner \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Practitioner",
    "name": [{"family": "Wilson", "given": ["James"], "prefix": ["Dr."]}],
    "qualification": [{"code": {"coding": [{"code": "cardiology", "display": "Cardiology"}]}}]
  }' | grep -o '"id":"[0-9]*"' | head -1 | cut -d'"' -f4)

SCHED3=$(curl -s -X POST https://hapi.fhir.org/baseR4/Schedule \
  -H "Content-Type: application/fhir+json" \
  -d "{
    \"resourceType\": \"Schedule\",
    \"active\": true,
    \"actor\": [{\"reference\": \"Practitioner/$PRAC3\", \"display\": \"Dr. James Wilson\"}],
    \"specialty\": [{\"coding\": [{\"code\": \"cardiology\", \"display\": \"Cardiology\"}]}]
  }" | grep -o '"id":"[0-9]*"' | head -1 | cut -d'"' -f4)

echo "✓ Dr. Wilson Schedule: $SCHED3"

# Dr. Maria Garcia
echo "Creating Dr. Maria Garcia..."
PRAC4=$(curl -s -X POST https://hapi.fhir.org/baseR4/Practitioner \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Practitioner",
    "name": [{"family": "Garcia", "given": ["Maria"], "prefix": ["Dr."]}],
    "qualification": [{"code": {"coding": [{"code": "cardiology", "display": "Cardiology"}]}}]
  }' | grep -o '"id":"[0-9]*"' | head -1 | cut -d'"' -f4)

SCHED4=$(curl -s -X POST https://hapi.fhir.org/baseR4/Schedule \
  -H "Content-Type: application/fhir+json" \
  -d "{
    \"resourceType\": \"Schedule\",
    \"active\": true,
    \"actor\": [{\"reference\": \"Practitioner/$PRAC4\", \"display\": \"Dr. Maria Garcia\"}],
    \"specialty\": [{\"coding\": [{\"code\": \"cardiology\", \"display\": \"Cardiology\"}]}]
  }" | grep -o '"id":"[0-9]*"' | head -1 | cut -d'"' -f4)

echo "✓ Dr. Garcia Schedule: $SCHED4"

# GYNECOLOGY
echo "=== GYNECOLOGY ==="

# Dr. Emily Rodriguez
echo "Creating Dr. Emily Rodriguez..."
PRAC5=$(curl -s -X POST https://hapi.fhir.org/baseR4/Practitioner \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Practitioner",
    "name": [{"family": "Rodriguez", "given": ["Emily"], "prefix": ["Dr."]}],
    "qualification": [{"code": {"coding": [{"code": "gynecology", "display": "Gynecology"}]}}]
  }' | grep -o '"id":"[0-9]*"' | head -1 | cut -d'"' -f4)

SCHED5=$(curl -s -X POST https://hapi.fhir.org/baseR4/Schedule \
  -H "Content-Type: application/fhir+json" \
  -d "{
    \"resourceType\": \"Schedule\",
    \"active\": true,
    \"actor\": [{\"reference\": \"Practitioner/$PRAC5\", \"display\": \"Dr. Emily Rodriguez\"}],
    \"specialty\": [{\"coding\": [{\"code\": \"gynecology\", \"display\": \"Gynecology\"}]}]
  }" | grep -o '"id":"[0-9]*"' | head -1 | cut -d'"' -f4)

echo "✓ Dr. Rodriguez Schedule: $SCHED5"

# Dr. Priya Patel
echo "Creating Dr. Priya Patel..."
PRAC6=$(curl -s -X POST https://hapi.fhir.org/baseR4/Practitioner \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Practitioner",
    "name": [{"family": "Patel", "given": ["Priya"], "prefix": ["Dr."]}],
    "qualification": [{"code": {"coding": [{"code": "gynecology", "display": "Gynecology"}]}}]
  }' | grep -o '"id":"[0-9]*"' | head -1 | cut -d'"' -f4)

SCHED6=$(curl -s -X POST https://hapi.fhir.org/baseR4/Schedule \
  -H "Content-Type: application/fhir+json" \
  -d "{
    \"resourceType\": \"Schedule\",
    \"active\": true,
    \"actor\": [{\"reference\": \"Practitioner/$PRAC6\", \"display\": \"Dr. Priya Patel\"}],
    \"specialty\": [{\"coding\": [{\"code\": \"gynecology\", \"display\": \"Gynecology\"}]}]
  }" | grep -o '"id":"[0-9]*"' | head -1 | cut -d'"' -f4)

echo "✓ Dr. Patel Schedule: $SCHED6"

# Save all schedule IDs
cat > schedules.txt << SCHEDULES
OPHTHALMOLOGY_JOHNSON=$SCHED1
OPHTHALMOLOGY_CHEN=$SCHED2
CARDIOLOGY_WILSON=$SCHED3
CARDIOLOGY_GARCIA=$SCHED4
GYNECOLOGY_RODRIGUEZ=$SCHED5
GYNECOLOGY_PATEL=$SCHED6
SCHEDULES

echo ""
echo "✅ All practitioners and schedules created!"
echo "📋 Schedule IDs saved to schedules.txt"
cat schedules.txt
