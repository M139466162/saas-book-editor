import { NextRequest, NextResponse } from 'next/server';
import { mockIntegrationStatus } from '@/lib/mocks';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }
    
    // Simulate API test delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // In production, test the actual API:
    // try {
    //   const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    //   return NextResponse.json({ 
    //     ok: response.ok, 
    //     model: 'gemini-pro',
    //     latencyMs: Date.now() - startTime 
    //   });
    // } catch (error) {
    //   return NextResponse.json({ ok: false, error: error.message });
    // }
    
    // Mock successful response
    return NextResponse.json(mockIntegrationStatus.gemini);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Failed to test connection' }, 
      { status: 500 }
    );
  }
}