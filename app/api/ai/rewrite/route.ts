import { NextRequest, NextResponse } from 'next/server';
import { mockRewriteResponses } from '@/lib/mocks';

export async function POST(request: NextRequest) {
  try {
    const { text, tone = 'neutral', targetAudience = 'general' } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In production, call real AI API here:
    // const response = await callDeepSeekAPI({
    //   model: 'deepseek-chat',
    //   messages: [{
    //     role: 'system',
    //     content: `Rewrite the following text in a ${tone} tone for ${targetAudience} audience.`
    //   }, {
    //     role: 'user',
    //     content: text
    //   }],
    //   temperature: 0.3
    // });
    
    const baseResponse = mockRewriteResponses[tone] || mockRewriteResponses.neutral;
    
    // Simple mock transformation based on original text length
    const rewrittenText = text.length > 100 
      ? `${baseResponse} Here's an expanded version that builds upon your original ideas while maintaining the ${tone} voice you requested.`
      : `${baseResponse} This concise version captures the essence of your message.`;
    
    return NextResponse.json({
      originalText: text,
      rewrittenText,
      tone,
      targetAudience,
      metadata: {
        model: 'mock-ai-v1',
        generatedAt: new Date().toISOString(),
        originalLength: text.length,
        newLength: rewrittenText.length
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to rewrite text' }, 
      { status: 500 }
    );
  }
}