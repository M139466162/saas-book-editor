import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Test connection to Sunra AI
    // Since we don't have the exact API documentation, we'll use a generic test
    const response = await fetch('https://sunra.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }
  } catch (error) {
    console.error('Sunra AI test error:', error);
    return NextResponse.json({ error: 'Connection failed' }, { status: 500 });
  }
}