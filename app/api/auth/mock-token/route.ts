import { NextResponse } from 'next/server';

export async function POST() {
  console.log('Token endpoint called');
  
  return NextResponse.json({
    access_token: 'mock-token-' + Date.now(),
    token_type: 'Bearer',
    expires_in: 3600,
    scope: 'patient/*.read openid fhirUser'
    // Don't return id_token since we can't generate a valid JWT
  });
}
