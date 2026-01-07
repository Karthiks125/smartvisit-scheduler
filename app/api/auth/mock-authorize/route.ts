import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectUri = url.searchParams.get('redirect_uri');
  const state = url.searchParams.get('state');
  
  if (!redirectUri || !state) {
    console.error('Missing params:', { redirectUri, state });
    return new NextResponse('Missing parameters', { status: 400 });
  }

  const code = 'mock-code-' + Date.now();
  const callback = `${redirectUri}?code=${code}&state=${state}`;
  
  console.log('Redirecting to:', callback);
  
  return NextResponse.redirect(callback);
}
