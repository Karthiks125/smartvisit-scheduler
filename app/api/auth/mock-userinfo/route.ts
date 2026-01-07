import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Mock userinfo endpoint called');
    
    return NextResponse.json({
      sub: 'practitioner-123',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      fhirUser: 'Practitioner/53664817'
    });
  } catch (error) {
    console.error('Mock userinfo error:', error);
    return NextResponse.json(
      { error: 'User info fetch failed' }, 
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
