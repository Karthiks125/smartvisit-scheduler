import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirect_uri = searchParams.get('redirect_uri');
  const state = searchParams.get('state');
  
  const approvalPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>EHR Authorization</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 480px;
          width: 100%;
          padding: 40px;
        }
        h1 { 
          color: #1a202c;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .subtitle {
          color: #4a5568;
          font-size: 16px;
          margin-bottom: 32px;
        }
        .scope-list {
          margin-bottom: 32px;
        }
        .scope-item {
          background: #f7fafc;
          border-left: 4px solid #4299e1;
          padding: 16px;
          margin-bottom: 12px;
          border-radius: 6px;
          font-size: 15px;
          color: #2d3748;
        }
        .approve-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .approve-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }
        .approve-btn:active {
          transform: translateY(0);
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Authorization Request</h1>
        <p class="subtitle">Multi-Visit Orchestrator is requesting access to:</p>
        
        <div class="scope-list">
          <div class="scope-item">Read appointment schedules</div>
          <div class="scope-item">Create and modify appointments</div>
          <div class="scope-item">Read patient demographics</div>
          <div class="scope-item">Read practitioner information</div>
        </div>
        
        <button class="approve-btn" onclick="approve()">Approve Access</button>
      </div>
      
      <script>
        function approve() {
          window.location.href = '${redirect_uri}?code=mock-auth-${Date.now()}&state=${state}';
        }
      </script>
    </body>
    </html>
  `;
  
  return new NextResponse(approvalPage, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
