🏥 Overview
SmartVisit Scheduler is a proof-of-concept healthcare application that demonstrates how HL7 FHIR (Fast Healthcare Interoperability Resources) standards can enable intelligent appointment bundling. Instead of patients making 3-5 separate hospital visits for related diagnostic tests and consultations, the system generates optimized schedules that minimize visits while maintaining practitioner continuity.
Live Demo: https://smartvisit-scheduler.vercel.app
✨ Key Features

FHIR R4 Compliant: Standard-based integration with EMR systems
Intelligent Scheduling Algorithm: Generates 1-visit and 2-visit options
Practitioner Continuity: All appointments with the same physician
Multi-Specialty Support: Ophthalmology, Cardiology, Gynecology
Real-Time Availability: Queries live FHIR Schedule/Slot resources
Insurance Integration: Coverage status for each service
Consultation Logic: Automatically schedules consultations after diagnostic tests
Mobile Responsive: Works seamlessly on all devices

🏗️ Architecture
┌─────────────────┐
│   Next.js App   │  ← User Interface (React/TypeScript)
│  (Vercel Host)  │
└────────┬────────┘
         │
         │ HTTPS/REST
         │
         ▼
┌─────────────────┐
│  FHIR Server    │  ← HAPI FHIR (Open Source)
│  (Custom Host)  │     Stores: Patients, Practitioners,
└─────────────────┘     Schedules, Slots, Appointments
Technology Stack
Frontend:

Next.js 15 (React 18)
TypeScript
Tailwind CSS
NextAuth.js (SMART on FHIR ready)

Backend/Data:

HAPI FHIR Server (Java-based reference implementation)
FHIR R4 Resources: Patient, Practitioner, Schedule, Slot, Appointment, HealthcareService
RESTful API with JSON

Infrastructure:

AWS EC2 (FHIR Server hosting)
DuckDNS (Dynamic DNS with HTTPS)
Vercel (Frontend deployment)
GitHub (Version control & CI/CD)

🔐 PHIPA Compliance & Privacy Considerations
Current Status: Demonstration/Proof-of-Concept
This application uses synthetic/dummy patient data for demonstration purposes. It is NOT currently handling real Protected Health Information (PHI).
PHIPA Compliance Roadmap for Production Deployment
PHIPA (Personal Health Information Protection Act) is Ontario's health privacy law. To make this production-ready for Canadian healthcare:
✅ Technical Safeguards Required:

Data Encryption

✅ HTTPS/TLS 1.2+ for data in transit (already implemented)
⚠️ Need: AES-256 encryption for data at rest
⚠️ Need: Encrypted database backups


Authentication & Authorization

✅ SMART on FHIR OAuth 2.0 framework (ready to implement)
⚠️ Need: Multi-factor authentication (MFA)
⚠️ Need: Role-based access control (RBAC)
⚠️ Need: Session timeout and automatic logout


Audit Logging

⚠️ Need: Comprehensive audit trails for all PHI access
⚠️ Need: Immutable logs with WHO accessed WHAT and WHEN
⚠️ Need: Log retention for minimum 10 years (PHIPA requirement)


Data Residency

⚠️ Need: Canadian data center hosting (AWS Canada Central, Azure Canada)
⚠️ Need: Data Processing Agreement (DPA) with cloud providers
⚠️ Current: Demo uses US-based infrastructure


Access Controls

⚠️ Need: Principle of least privilege
⚠️ Need: User access reviews and deprovisioning procedures
⚠️ Need: Break-glass emergency access procedures



✅ Administrative Safeguards Required:

Privacy Impact Assessment (PIA)

Required before production deployment
Documents data flows, risks, and mitigation strategies


Business Associate Agreements (BAAs)

With all third-party vendors handling PHI
Cloud providers, monitoring services, etc.


Policies & Procedures

Privacy policies compliant with PHIPA
Incident response plan
Breach notification procedures (within 24 hours)
Staff training on privacy requirements


Consent Management

Patient consent for data collection and use
Right to access, correct, and delete personal information
Consent withdrawal mechanisms



✅ Physical Safeguards Required:

Secure Infrastructure

Canadian data centers with SOC 2 Type II certification
Physical security controls
Disaster recovery and business continuity plans



How This Application Addresses Privacy:
Current Demo Implementation:

✅ Uses synthetic patient data only (no real PHI)
✅ HTTPS encryption for all communications
✅ FHIR standard-based architecture (privacy-by-design)
✅ No permanent storage of patient data in frontend
✅ Stateless session management

Production Path to PHIPA Compliance:
typescript// Example: Adding audit logging for PHIPA compliance
async function logHealthDataAccess(userId: string, action: string, resourceId: string) {
  await auditLog.create({
    timestamp: new Date(),
    userId,
    action, // "READ", "CREATE", "UPDATE", "DELETE"
    resourceType: "Patient",
    resourceId,
    ipAddress: req.headers['x-forwarded-for'],
    userAgent: req.headers['user-agent'],
    outcome: "SUCCESS"
  });
}

// Example: Canadian data residency enforcement
const fhirServerConfig = {
  region: 'ca-central-1', // AWS Canada Central
  encryption: 'AES-256',
  backupRetention: '10-years',
  auditLogging: true
};
```

### Overcoming PHIPA Challenges:

1. **Challenge**: Real-time data synchronization across EMRs
   - **Solution**: FHIR subscriptions for event-driven updates
   - **Solution**: Batch synchronization during off-peak hours
   - **Solution**: Cache with short TTL (time-to-live)

2. **Challenge**: Patient consent tracking
   - **Solution**: FHIR Consent resources
   - **Solution**: Consent directives in each API call
   - **Solution**: Granular permissions per data element

3. **Challenge**: Cross-border data transfer
   - **Solution**: Deploy entirely within Canadian infrastructure
   - **Solution**: Use Canadian cloud regions (AWS ca-central-1, Azure Canada Central)
   - **Solution**: Ensure all vendors sign DPAs with PHIPA clauses

4. **Challenge**: Third-party service integration
   - **Solution**: On-premise deployment option for sensitive environments
   - **Solution**: Federated architecture (data stays in hospital systems)
   - **Solution**: De-identification pipeline for analytics

### Recommended Production Architecture (PHIPA-Compliant):
```
┌──────────────────┐
│  Hospital EMR    │ ← Source of Truth (Epic, Cerner, etc.)
│ (On-Premise CA)  │
└────────┬─────────┘
         │
         │ FHIR API (TLS 1.3)
         │ + OAuth 2.0 + MFA
         │
         ▼
┌──────────────────┐
│ SmartVisit App   │ ← Next.js (Vercel Canada or AWS ca-central-1)
│ (Canada Hosted)  │    - No PHI storage
└────────┬─────────┘    - Session tokens only
         │              - Audit logging
         │
         ▼
┌──────────────────┐
│  Audit Database  │ ← Immutable logs (10-year retention)
│ (Canada Region)  │    - WHO accessed WHAT WHEN
└──────────────────┘    - Encrypted at rest
🚀 Getting Started
Prerequisites

Node.js 18+ and npm
Git
FHIR Server (HAPI FHIR or hospital EMR with FHIR API)

Installation

Clone the repository

bashgit clone https://github.com/yourusername/smartvisit-scheduler.git
cd smartvisit-scheduler

Install dependencies

bashnpm install

Configure environment variables

bashcp .env.example .env.local
Edit .env.local:
env# FHIR Server Configuration
NEXT_PUBLIC_FHIR_SERVER_URL=https://your-fhir-server.com/fhir
FHIR_CLIENT_ID=your_client_id
FHIR_CLIENT_SECRET=your_client_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

Populate FHIR Server with test data

bashnode scripts/populate-fhir-slots.js

Run development server

bashnpm run dev
Open http://localhost:3000
Production Deployment
Deploy to Vercel:
bash# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
Set environment variables in Vercel dashboard:

NEXT_PUBLIC_FHIR_SERVER_URL
NEXTAUTH_URL
NEXTAUTH_SECRET

📊 FHIR Resources Used
ResourcePurposePatientPatient demographics and identifiersPractitionerHealthcare provider informationScheduleProvider availability schedulesSlotSpecific available time slotsAppointmentBooked appointmentsHealthcareServiceService types and codes
🔧 Configuration
Adding New Specialties
Edit app/orchestrator/page.tsx:
typescriptconst SERVICES_BY_SPECIALTY = {
  "Ophthalmology": ["OCT", "Visual Field", "AS-OCT", "Optos", "Consultation"],
  "Cardiology": ["ECG", "Echocardiogram", "Stress Test", "Consultation"],
  "YourSpecialty": ["Test1", "Test2", "Consultation"] // Add here
};

const PRACTITIONERS_BY_SPECIALTY = {
  "YourSpecialty": [
    { id: "prac-id-1", name: "Dr. Name" },
    { id: "prac-id-2", name: "Dr. Name 2" }
  ]
};
Customizing Service Codes
Edit lib/fhir-helpers.ts:
typescriptconst serviceToCodeMap: Record<string, string[]> = {
  "Your Service": ["your-fhir-code"],
  // Map service display names to FHIR service type codes
};
🧪 Testing
bash# Run tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests (requires Playwright)
npm run test:e2e
📈 Performance

Initial load: < 2s
FHIR query response: < 500ms
Schedule generation: < 1s for 1000+ slots
Mobile-optimized: Lighthouse score 95+

🤝 Contributing
This is a proof-of-concept project. Contributions are welcome!

Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit changes (git commit -m 'Add AmazingFeature')
Push to branch (git push origin feature/AmazingFeature)
Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
⚠️ Disclaimer
This is a proof-of-concept demonstration application using synthetic data.

NOT approved for production use with real patient data
NOT PHIPA/HIPAA compliant in current form
Requires significant additional safeguards for production deployment
For demonstration and educational purposes only

For production deployment handling real Protected Health Information (PHI), consult with:

Privacy officers and legal counsel
Healthcare compliance experts
Security auditors
Your organization's IT security team

🔗 Resources

HL7 FHIR Documentation
HAPI FHIR
SMART on FHIR
PHIPA Overview
Healthcare Privacy Best Practices

📧 Contact
Your Name - www.linkedin.com/in/karthik-sankar125

Built with ❤️ for better healthcare experiences
