import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Mock token endpoint called');
    
    return NextResponse.json({
      access_token: 'mock-access-token-' + Date.now(),
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'patient/*.read openid fhirUser',
      id_token: 'mock-id-token-' + Date.now()
    });
  } catch (error) {
    console.error('Mock token error:', error);
    return NextResponse.json(
      { error: 'Token generation failed' }, 
      { status: 500 }
    );
  }
}

export const runtime = 'edge';

