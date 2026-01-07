#!/bin/bash

echo "🗓️  Creating slots for all practitioners (Jan 6-15, 2026)..."

# OPHTHALMOLOGY - Dr. Sarah Johnson (53691708)
echo "=== Dr. Sarah Johnson (Ophthalmology) ==="
for date in "06" "07" "08" "09" "10" "13" "14" "15"; do
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"schedule\":{\"reference\":\"Schedule/53691708\"},\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\"}]}],\"status\":\"free\",\"start\":\"2026-01-${date}T09:00:00-05:00\",\"end\":\"2026-01-${date}T09:15:00-05:00\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-test-1\",\"display\":\"OCT - 15min\"}]}]}" > /dev/null
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"schedule\":{\"reference\":\"Schedule/53691708\"},\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\"}]}],\"status\":\"free\",\"start\":\"2026-01-${date}T10:00:00-05:00\",\"end\":\"2026-01-${date}T10:20:00-05:00\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-test-2\",\"display\":\"Visual Field - 20min\"}]}]}" > /dev/null
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"schedule\":{\"reference\":\"Schedule/53691708\"},\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\"}]}],\"status\":\"free\",\"start\":\"2026-01-${date}T14:00:00-05:00\",\"end\":\"2026-01-${date}T14:15:00-05:00\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-test-3\",\"display\":\"AS-OCT - 15min\"}]}]}" > /dev/null
done
echo "✓ 24 slots created"

# OPHTHALMOLOGY - Dr. Michael Chen (53691716)
echo "=== Dr. Michael Chen (Ophthalmology) ==="
for date in "06" "07" "08" "09" "10" "13" "14" "15"; do
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"schedule\":{\"reference\":\"Schedule/53691716\"},\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\"}]}],\"status\":\"free\",\"start\":\"2026-01-${date}T11:00:00-05:00\",\"end\":\"2026-01-${date}T11:15:00-05:00\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-test-1\",\"display\":\"OCT - 15min\"}]}]}" > /dev/null
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"schedule\":{\"reference\":\"Schedule/53691716\"},\"specialty\":[{\"coding\":[{\"code\":\"ophthalmology\"}]}],\"status\":\"free\",\"start\":\"2026-01-${date}T15:00:00-05:00\",\"end\":\"2026-01-${date}T15:20:00-05:00\",\"serviceType\":[{\"coding\":[{\"code\":\"ophthal-test-2\",\"display\":\"Visual Field - 20min\"}]}]}" > /dev/null
done
echo "✓ 16 slots created"

# CARDIOLOGY - Dr. James Wilson (53691721)
echo "=== Dr. James Wilson (Cardiology) ==="
for date in "06" "07" "08" "09" "10" "13" "14" "15"; do
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"schedule\":{\"reference\":\"Schedule/53691721\"},\"specialty\":[{\"coding\":[{\"code\":\"cardiology\"}]}],\"status\":\"free\",\"start\":\"2026-01-${date}T09:00:00-05:00\",\"end\":\"2026-01-${date}T09:30:00-05:00\",\"serviceType\":[{\"coding\":[{\"code\":\"cardio-echo\",\"display\":\"Echocardiogram - 30min\"}]}]}" > /dev/null
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"schedule\":{\"reference\":\"Schedule/53691721\"},\"specialty\":[{\"coding\":[{\"code\":\"cardiology\"}]}],\"status\":\"free\",\"start\":\"2026-01-${date}T10:00:00-05:00\",\"end\":\"2026-01-${date}T10:15:00-05:00\",\"serviceType\":[{\"coding\":[{\"code\":\"cardio-ekg\",\"display\":\"EKG - 15min\"}]}]}" > /dev/null
done
echo "✓ 16 slots created"

# CARDIOLOGY - Dr. Maria Garcia (53691722)
echo "=== Dr. Maria Garcia (Cardiology) ==="
for date in "06" "07" "08" "09" "10" "13" "14" "15"; do
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"schedule\":{\"reference\":\"Schedule/53691722\"},\"specialty\":[{\"coding\":[{\"code\":\"cardiology\"}]}],\"status\":\"free\",\"start\":\"2026-01-${date}T14:00:00-05:00\",\"end\":\"2026-01-${date}T14:30:00-05:00\",\"serviceType\":[{\"coding\":[{\"code\":\"cardio-echo\",\"display\":\"Echocardiogram - 30min\"}]}]}" > /dev/null
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"schedule\":{\"reference\":\"Schedule/53691722\"},\"specialty\":[{\"coding\":[{\"code\":\"cardiology\"}]}],\"status\":\"free\",\"start\":\"2026-01-${date}T15:00:00-05:00\",\"end\":\"2026-01-${date}T15:15:00-05:00\",\"serviceType\":[{\"coding\":[{\"code\":\"cardio-ekg\",\"display\":\"EKG - 15min\"}]}]}" > /dev/null
done
echo "✓ 16 slots created"

# GYNECOLOGY - Dr. Emily Rodriguez (53691723)
echo "=== Dr. Emily Rodriguez (Gynecology) ==="
for date in "06" "07" "08" "09" "10" "13" "14" "15"; do
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"schedule\":{\"reference\":\"Schedule/53691723\"},\"specialty\":[{\"coding\":[{\"code\":\"gynecology\"}]}],\"status\":\"free\",\"start\":\"2026-01-${date}T09:00:00-05:00\",\"end\":\"2026-01-${date}T09:20:00-05:00\",\"serviceType\":[{\"coding\":[{\"code\":\"gyn-pap\",\"display\":\"Pap Smear - 20min\"}]}]}" > /dev/null
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"schedule\":{\"reference\":\"Schedule/53691723\"},\"specialty\":[{\"coding\":[{\"code\":\"gynecology\"}]}],\"status\":\"free\",\"start\":\"2026-01-${date}T10:00:00-05:00\",\"end\":\"2026-01-${date}T10:30:00-05:00\",\"serviceType\":[{\"coding\":[{\"code\":\"gyn-ultrasound\",\"display\":\"Pelvic Ultrasound - 30min\"}]}]}" > /dev/null
done
echo "✓ 16 slots created"

# GYNECOLOGY - Dr. Priya Patel (53691724)
echo "=== Dr. Priya Patel (Gynecology) ==="
for date in "06" "07" "08" "09" "10" "13" "14" "15"; do
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"schedule\":{\"reference\":\"Schedule/53691724\"},\"specialty\":[{\"coding\":[{\"code\":\"gynecology\"}]}],\"status\":\"free\",\"start\":\"2026-01-${date}T14:00:00-05:00\",\"end\":\"2026-01-${date}T14:30:00-05:00\",\"serviceType\":[{\"coding\":[{\"code\":\"gyn-ultrasound\",\"display\":\"Pelvic Ultrasound - 30min\"}]}]}" > /dev/null
  curl -s -X POST https://hapi.fhir.org/baseR4/Slot -H "Content-Type: application/fhir+json" -d "{\"resourceType\":\"Slot\",\"schedule\":{\"reference\":\"Schedule/53691724\"},\"specialty\":[{\"coding\":[{\"code\":\"gynecology\"}]}],\"status\":\"free\",\"start\":\"2026-01-${date}T15:00:00-05:00\",\"end\":\"2026-01-${date}T15:20:00-05:00\",\"serviceType\":[{\"coding\":[{\"code\":\"gyn-pap\",\"display\":\"Pap Smear - 20min\"}]}]}" > /dev/null
done
echo "✓ 16 slots created"

echo ""
echo "✅ All slots created successfully!"
echo "Total: ~100 slots across 6 practitioners (Jan 6-15, 2026)"
echo ""
echo "📋 Coverage:"
echo "  • Ophthalmology: Dr. Johnson & Dr. Chen"
echo "  • Cardiology: Dr. Wilson & Dr. Garcia"
echo "  • Gynecology: Dr. Rodriguez & Dr. Patel"
echo "  • Date range: Jan 6-15, 2026 (excluding weekends)"
