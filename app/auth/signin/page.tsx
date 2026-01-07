'use client';

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/orchestrator';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center bg-white p-12 rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full">
        {/* Logo/Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          SmartVisit Scheduler
        </h1>
        <p className="text-gray-600 mb-2 text-lg">
          Intelligent appointment orchestration
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Reduce hospital visits by 40-60% with smart scheduling
        </p>

        {/* Authorization permissions preview */}
        <div className="mb-8 text-left bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm font-semibold text-blue-900 mb-3">This app will request access to:</p>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Read appointment schedules
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Create and modify appointments
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Read patient demographics
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Read practitioner information
            </li>
          </ul>
        </div>

        <button
          onClick={() => signIn('ehr-provider', { callbackUrl })}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          Sign in with EHR System
        </button>
        <p className="text-xs text-gray-400 mt-6">
          🔒 Secure FHIR integration • SMART on FHIR compliant
        </p>
      </div>
    </div>
  );
}
