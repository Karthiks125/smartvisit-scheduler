#!/bin/bash

echo "🚀 Uploading slots to HAPI FHIR..."

# Ophthalmology slots for Jan 6-9
for date in "2026-01-06" "2026-01-07" "2026-01-08" "2026-01-09"; do
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-test-1\",\"display\":\"OCT - 15min (OHIP covered)\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\",\"display\":\"Ophthalmology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664817\"},\"status\":\"free\",\"start\":\"${date}T09:00:00-05:00\",\"end\":\"${date}T09:15:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-test-2\",\"display\":\"Visual Field - 20min (OHIP covered)\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\",\"display\":\"Ophthalmology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664817\"},\"status\":\"free\",\"start\":\"${date}T09:30:00-05:00\",\"end\":\"${date}T09:50:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-test-3\",\"display\":\"AS-OCT - 15min (Paid)\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\",\"display\":\"Ophthalmology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664817\"},\"status\":\"free\",\"start\":\"${date}T10:00:00-05:00\",\"end\":\"${date}T10:15:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-test-4\",\"display\":\"Optos - 10min (Paid)\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\",\"display\":\"Ophthalmology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664817\"},\"status\":\"free\",\"start\":\"${date}T10:20:00-05:00\",\"end\":\"${date}T10:30:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-consult\",\"display\":\"Ophthalmology Consultation - 30min\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\",\"display\":\"Ophthalmology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664817\"},\"status\":\"free\",\"start\":\"${date}T11:00:00-05:00\",\"end\":\"${date}T11:30:00-05:00\"}" > /dev/null
  
  echo "✅ Uploaded Ophthalmology slots for $date"
done

# Cardiology slots for Jan 6-9
for date in "2026-01-06" "2026-01-07" "2026-01-08" "2026-01-09"; do
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"cardio-test-1\",\"display\":\"ECG - 10min (OHIP covered)\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"cardiology\",\"display\":\"Cardiology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664818\"},\"status\":\"free\",\"start\":\"${date}T09:00:00-05:00\",\"end\":\"${date}T09:10:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"cardio-test-2\",\"display\":\"Echocardiogram - 45min (Paid)\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"cardiology\",\"display\":\"Cardiology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664818\"},\"status\":\"free\",\"start\":\"${date}T09:15:00-05:00\",\"end\":\"${date}T10:00:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"cardio-test-3\",\"display\":\"Stress Test - 60min (OHIP covered)\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"cardiology\",\"display\":\"Cardiology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664818\"},\"status\":\"free\",\"start\":\"${date}T10:15:00-05:00\",\"end\":\"${date}T11:15:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"cardio-consult\",\"display\":\"Cardiology Consultation - 30min\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"cardiology\",\"display\":\"Cardiology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664818\"},\"status\":\"free\",\"start\":\"${date}T11:30:00-05:00\",\"end\":\"${date}T12:00:00-05:00\"}" > /dev/null
  
  echo "✅ Uploaded Cardiology slots for $date"
done

# Gynecology slots for Jan 6-9
for date in "2026-01-06" "2026-01-07" "2026-01-08" "2026-01-09"; do
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"gyn-test-1\",\"display\":\"Pelvic Ultrasound - 30min (OHIP covered)\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"gynecology\",\"display\":\"Gynecology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664863\"},\"status\":\"free\",\"start\":\"${date}T09:00:00-05:00\",\"end\":\"${date}T09:30:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"gyn-test-2\",\"display\":\"Lab Work - 15min (OHIP covered)\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"gynecology\",\"display\":\"Gynecology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664863\"},\"status\":\"free\",\"start\":\"${date}T09:45:00-05:00\",\"end\":\"${date}T10:00:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"gyn-test-3\",\"display\":\"3D Ultrasound - 45min (Paid)\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"gynecology\",\"display\":\"Gynecology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664863\"},\"status\":\"free\",\"start\":\"${date}T10:15:00-05:00\",\"end\":\"${date}T11:00:00-05:00\"}" > /dev/null
  
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"serviceType\":[{\"coding\":[{\"code\":\"gyn-consult\",\"display\":\"Gynecology Consultation - 30min\"}]}],\"specialty\":[{\"coding\":[{\"code\":\"gynecology\",\"display\":\"Gynecology\"}]}],\"schedule\":{\"reference\":\"Schedule/53664863\"},\"status\":\"free\",\"start\":\"${date}T11:15:00-05:00\",\"end\":\"${date}T11:45:00-05:00\"}" > /dev/null
  
  echo "✅ Uploaded Gynecology slots for $date"
done

echo ""
echo "🎉 Done! All 52 slots uploaded."
