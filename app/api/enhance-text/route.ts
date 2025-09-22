import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, apiKey } = await request.json();
    
    if (!text || !apiKey) {
      return NextResponse.json({ error: 'Text and API key are required' }, { status: 400 });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-distill-llama-70b', // Free DeepSeek model
        messages: [
          {
            role: 'system',
            content: 'You are a professional writing assistant. Enhance the provided text by improving clarity, flow, grammar, and style while maintaining the original meaning and tone. Return only the enhanced text without explanations.'
          },
          {
            role: 'user',
            content: `Please enhance this text: ${text}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const enhancedText = data.choices[0]?.message?.content || text;

    return NextResponse.json({ enhancedText });

  } catch (error) {
    console.error('Text enhancement error:', error);
    return NextResponse.json({ error: 'Failed to enhance text' }, { status: 500 });
  }
}