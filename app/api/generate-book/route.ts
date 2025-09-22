import { NextRequest, NextResponse } from 'next/server';

// Helper function to generate cover image
async function generateCoverImage(title: string, description: string | undefined, apiKey: string): Promise<string | null> {
  try {
    const coverPrompt = `Professional book cover design for "${title}", ${description || 'modern professional design'}, clean typography, high quality, commercial book cover style`;
    
    const response = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''}/api/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: coverPrompt, apiKey })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.imageUrl;
    }
    return null;
  } catch (error) {
    console.error('Cover generation error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, template, apiKey, sunraApiKey } = await request.json();
    
    if (!title || !apiKey) {
      return NextResponse.json({ error: 'Title and OpenRouter API key are required' }, { status: 400 });
    }

    console.log('📚 Generating complete book:', title);

    // Step 1: Generate book outline and content with optimized prompt
    const outlineResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-distill-llama-70b',
        messages: [
          {
            role: 'system',
            content: `You are an expert book writer. Generate a complete, detailed book with chapters and rich content. 
            IMPORTANT: Return ONLY a valid JSON object with this exact structure:
            {
              "title": "Book Title",
              "subtitle": "Book Subtitle",
              "chapters": [
                {
                  "title": "Chapter Title",
                  "content": "Full chapter content (minimum 500 words per chapter, well-structured with multiple paragraphs)",
                  "order": 1
                },
                {
                  "title": "Chapter 2 Title", 
                  "content": "Second chapter content...",
                  "order": 2
                }
              ]
            }
            
            Generate 6-8 chapters with substantial, detailed content. Each chapter should be engaging and provide real value. Include practical examples, actionable insights, and clear structure with multiple paragraphs.`
          },
          {
            role: 'user',
            content: `Generate a complete book about: "${title}". 
            ${description ? `Additional context: ${description}` : ''}
            ${template ? `Style/template reference: ${template}` : ''}
            
            Create a comprehensive book with 6-8 chapters. Make each chapter substantial (500+ words) with:
            - Clear introduction
            - Main content with examples
            - Practical takeaways
            - Smooth transitions
            
            Focus on providing immediate value and actionable content.`
          }
        ],
        max_tokens: 6000, // Increased for more content
        temperature: 0.8, // Slightly more creative
        top_p: 0.9
      })
    });

    if (!outlineResponse.ok) {
      throw new Error(`OpenRouter API error: ${outlineResponse.statusText}`);
    }

    const outlineData = await outlineResponse.json();
    let bookData;
    
    try {
      // Try to parse the JSON response
      const content = outlineData.choices[0]?.message?.content?.trim();
      
      if (!content) {
        throw new Error('No content received from API');
      }
      
      // Handle different response formats
      if (content.includes('```json')) {
        const startIndex = content.indexOf('```json') + 7;
        const endIndex = content.indexOf('```', startIndex);
        const jsonString = content.substring(startIndex, endIndex).trim();
        bookData = JSON.parse(jsonString);
      } else if (content.startsWith('{')) {
        bookData = JSON.parse(content);
      } else {
        // If response doesn't contain JSON, create a structured book
        throw new Error('Invalid response format');
      }

      // Validate the structure
      if (!bookData.title || !bookData.chapters || !Array.isArray(bookData.chapters)) {
        throw new Error('Invalid book structure');
      }

      // Ensure we have at least some chapters
      if (bookData.chapters.length === 0) {
        throw new Error('No chapters generated');
      }

    } catch (parseError) {
      console.error('Failed to parse book data:', parseError);
      
      // Enhanced fallback with better default content
      const chapterTitles = [
        'Introduction: Getting Started',
        'Understanding the Basics',
        'Core Concepts and Principles', 
        'Practical Applications',
        'Advanced Techniques',
        'Real-World Examples',
        'Best Practices',
        'Conclusion and Next Steps'
      ];

      bookData = {
        title: title,
        subtitle: description || `A comprehensive guide to ${title.toLowerCase()}`,
        chapters: chapterTitles.map((chapterTitle, index) => ({
          title: chapterTitle,
          content: `This chapter covers ${chapterTitle.toLowerCase()}. Here you'll learn essential concepts and practical approaches that will help you master this topic.

Key topics include:
• Understanding the fundamental principles
• Practical implementation strategies  
• Common challenges and solutions
• Expert tips and best practices

By the end of this chapter, you'll have a solid foundation to build upon and apply these concepts in real-world scenarios.

Remember to take notes and practice the techniques discussed here. The combination of theory and practical application is key to truly mastering any subject.

This content serves as a starting point that you can expand and customize based on your specific needs and expertise.`,
          order: index + 1
        }))
      };
    }

    // Step 2: Generate cover image concurrently if Sunra API key is provided
    let coverUrl = null;
    const coverPromise = sunraApiKey ? generateCoverImage(title, description, sunraApiKey) : Promise.resolve(null);
    
    // Wait for cover generation (with timeout)
    try {
      const coverResult = await Promise.race([
        coverPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Cover generation timeout')), 15000) // 15 second timeout
        )
      ]);
      coverUrl = coverResult as string | null;
    } catch (error) {
      console.warn('Cover generation failed or timed out:', error);
      // Continue without cover
    }

    // Step 3: Return complete book data
    const completeBook = {
      id: crypto.randomUUID(),
      title: bookData.title || title,
      subtitle: bookData.subtitle,
      author: 'Generated by MindScribe Pro',
      language: 'fr',
      audience: 'general',
      coverUrl: coverUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chapters: bookData.chapters.map((chapter: any, index: number) => ({
        id: crypto.randomUUID(),
        title: chapter.title,
        content: chapter.content,
        order: chapter.order || index + 1,
        pitch: chapter.content.substring(0, 100) + '...'
      }))
    };

    console.log('✅ Book generated successfully:', completeBook.title);
    return NextResponse.json({ book: completeBook });

  } catch (error) {
    console.error('Book generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate book', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}