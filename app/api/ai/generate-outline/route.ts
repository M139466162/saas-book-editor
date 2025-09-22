import { NextRequest, NextResponse } from 'next/server';
import { mockOutlineResponses } from '@/lib/mocks';

export async function POST(request: NextRequest) {
  try {
    const { subject, audience, numChapters = 8 } = await request.json();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a mock response - in production, call real AI API
    // Example: const response = await callDeepSeekAPI(prompt);
    const mockResponse = mockOutlineResponses[Math.floor(Math.random() * mockOutlineResponses.length)];
    
    // Customize the response based on input
    const customResponse = {
      title: subject || mockResponse.title,
      chapters: mockResponse.chapters.slice(0, numChapters),
      metadata: {
        audience,
        generatedAt: new Date().toISOString(),
        model: 'mock-ai-v1'
      }
    };
    
    return NextResponse.json(customResponse);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate outline' }, 
      { status: 500 }
    );
  }
}