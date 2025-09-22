import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey } = await request.json();
    
    if (!prompt || !apiKey) {
      return NextResponse.json({ error: 'Prompt and API key are required' }, { status: 400 });
    }

    // Using a placeholder API endpoint for Sunra AI
    // This would need to be updated with the actual Sunra API endpoint and format
    const response = await fetch('https://sunra.ai/api/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        width: 1024,
        height: 1024,
        steps: 20,
        guidance_scale: 7.5
      })
    });

    if (!response.ok) {
      throw new Error(`Sunra API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Assuming the API returns an image URL or base64
    const imageUrl = data.image_url || data.url;

    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}