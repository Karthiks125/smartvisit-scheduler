import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectUri = searchParams.get('redirect_uri');
  const state = searchParams.get('state');
  
  if (!redirectUri || !state) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  // Generate mock authorization code
  const code = 'mock-auth-code-' + Math.random().toString(36).substring(7);
  
  // Redirect back to callback with code
  const callbackUrl = `${redirectUri}?code=${code}&state=${state}`;
  
  return NextResponse.redirect(callbackUrl);
}
