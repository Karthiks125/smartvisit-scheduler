#!/bin/bash

dates=("2026-01-06" "2026-01-07" "2026-01-08" "2026-01-09")

for date in "${dates[@]}"; do
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-test-3\",\"display\":\"AS-OCT - 15min (Paid)\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\",\"display\":\"Ophthalmology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664817\"},\"status\":\"free\",\"start\":\"${date}T09:45:00-05:00\",\"end\":\"${date}T10:00:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-test-4\",\"display\":\"Optos - 10min (Paid)\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\",\"display\":\"Ophthalmology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664817\"},\"status\":\"free\",\"start\":\"${date}T10:45:00-05:00\",\"end\":\"${date}T10:55:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-consult\",\"display\":\"Ophthalmology Consultation - 30min\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\",\"display\":\"Ophthalmology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664817\"},\"status\":\"free\",\"start\":\"${date}T11:30:00-05:00\",\"end\":\"${date}T12:00:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-test-3\",\"display\":\"AS-OCT - 15min (Paid)\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\",\"display\":\"Ophthalmology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664817\"},\"status\":\"free\",\"start\":\"${date}T15:30:00-05:00\",\"end\":\"${date}T15:45:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-test-4\",\"display\":\"Optos - 10min (Paid)\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\",\"display\":\"Ophthalmology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664817\"},\"status\":\"free\",\"start\":\"${date}T16:00:00-05:00\",\"end\":\"${date}T16:10:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-consult\",\"display\":\"Ophthalmology Consultation - 30min\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\",\"display\":\"Ophthalmology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664817\"},\"status\":\"free\",\"start\":\"${date}T16:30:00-05:00\",\"end\":\"${date}T17:00:00-05:00\"}" > /dev/null
  
  echo "✅ Added slots for $date"
done

echo "🎉 All Ophthalmology slots added!"

