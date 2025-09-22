import { Book, Chapter, Section, Template } from './types';

// Mock seed data for templates
export const mockTemplates: Template[] = [
  {
    id: 'template-howto',
    name: 'How-to Guide',
    title: 'How-to Guide',
    description: 'Step-by-step guide structure with practical exercises and clear learning outcomes',
    category: 'how-to',
    tags: ['practical', 'step-by-step', 'educational', 'beginner-friendly'],
    estimatedTime: '2-3 weeks',
    chapterCount: 8,
    chapters: [
      { title: 'Introduction & Overview', pitch: 'Set expectations and promise outcomes' },
      { title: 'Getting Started', pitch: 'Foundation concepts and setup' },
      { title: 'Core Principles', pitch: 'Essential knowledge before diving deep' },
      { title: 'Step-by-Step Process', pitch: 'Main methodology broken down' },
      { title: 'Advanced Techniques', pitch: 'Pro tips and optimization' },
      { title: 'Common Pitfalls', pitch: 'What to avoid and troubleshooting' },
      { title: 'Real-world Examples', pitch: 'Case studies and applications' },
      { title: 'Next Steps & Resources', pitch: 'Where to go from here' }
    ],
    structure: {
      chapters: [
        { 
          title: 'Introduction & Overview', 
          description: 'Set expectations and promise outcomes',
          sections: [
            { title: 'What you\'ll learn' },
            { title: 'Prerequisites' },
            { title: 'How to use this guide' }
          ]
        },
        { title: 'Getting Started', description: 'Foundation concepts and setup' },
        { title: 'Core Principles', description: 'Essential knowledge before diving deep' },
        { title: 'Step-by-Step Process', description: 'Main methodology broken down' },
        { title: 'Advanced Techniques', description: 'Pro tips and optimization' },
        { title: 'Common Pitfalls', description: 'What to avoid and troubleshooting' },
        { title: 'Real-world Examples', description: 'Case studies and applications' },
        { title: 'Next Steps & Resources', description: 'Where to go from here' }
      ]
    }
  },
  {
    id: 'template-business',
    name: 'Business Playbook',
    title: 'Business Playbook',
    description: 'Strategic guide for business transformation with proven frameworks',
    category: 'business',
    tags: ['strategy', 'leadership', 'growth', 'transformation'],
    estimatedTime: '4-6 weeks',
    chapterCount: 10,
    chapters: [
      { title: 'Vision & Strategy', pitch: 'Define your north star' },
      { title: 'Market Analysis', pitch: 'Understanding the landscape' },
      { title: 'Team Building', pitch: 'Assembling the right people' },
      { title: 'Product Development', pitch: 'Building what matters' },
      { title: 'Marketing & Growth', pitch: 'Reaching your audience' },
      { title: 'Operations & Systems', pitch: 'Scaling efficiently' },
      { title: 'Financial Planning', pitch: 'Managing resources wisely' },
      { title: 'Risk Management', pitch: 'Preparing for challenges' },
      { title: 'Performance Metrics', pitch: 'Measuring what matters' },
      { title: 'Future Planning', pitch: 'Staying ahead of the curve' }
    ],
    structure: {
      chapters: [
        { title: 'Vision & Strategy', description: 'Define your north star' },
        { title: 'Market Analysis', description: 'Understanding the landscape' },
        { title: 'Team Building', description: 'Assembling the right people' },
        { title: 'Product Development', description: 'Building what matters' },
        { title: 'Marketing & Growth', description: 'Reaching your audience' },
        { title: 'Operations & Systems', description: 'Scaling efficiently' },
        { title: 'Financial Planning', description: 'Managing resources wisely' },
        { title: 'Risk Management', description: 'Preparing for challenges' },
        { title: 'Performance Metrics', description: 'Measuring what matters' },
        { title: 'Future Planning', description: 'Staying ahead of the curve' }
      ]
    }
  },
  {
    id: 'template-novel',
    name: 'Novel Structure',
    title: 'Novel Structure',
    description: 'Three-act structure for fiction writing with character development',
    category: 'fiction',
    tags: ['fiction', 'creative-writing', 'story-structure', 'character-development'],
    estimatedTime: '8-12 weeks',
    chapterCount: 12,
    chapters: [
      { title: 'Opening Hook', pitch: 'Grab readers from the first page' },
      { title: 'Character Introduction', pitch: 'Meet our protagonist and world' },
      { title: 'Inciting Incident', pitch: 'The event that changes everything' },
      { title: 'Rising Action I', pitch: 'Building tension and stakes' },
      { title: 'First Plot Point', pitch: 'No turning back now' },
      { title: 'Rising Action II', pitch: 'Complications and obstacles' },
      { title: 'Midpoint', pitch: 'Everything changes perspective' },
      { title: 'Rising Action III', pitch: 'The squeeze tightens' },
      { title: 'Climax', pitch: 'The final confrontation' },
      { title: 'Falling Action', pitch: 'Consequences and aftermath' },
      { title: 'Resolution', pitch: 'New equilibrium established' },
      { title: 'Epilogue', pitch: 'Where are they now?' }
    ],
    structure: {
      chapters: [
        { title: 'Opening Hook', description: 'Grab readers from the first page' },
        { title: 'Character Introduction', description: 'Meet our protagonist and world' },
        { title: 'Inciting Incident', description: 'The event that changes everything' },
        { title: 'Rising Action I', description: 'Building tension and stakes' },
        { title: 'First Plot Point', description: 'No turning back now' },
        { title: 'Rising Action II', description: 'Complications and obstacles' },
        { title: 'Midpoint', description: 'Everything changes perspective' },
        { title: 'Rising Action III', description: 'The squeeze tightens' },
        { title: 'Climax', description: 'The final confrontation' },
        { title: 'Falling Action', description: 'Consequences and aftermath' },
        { title: 'Resolution', description: 'New equilibrium established' },
        { title: 'Epilogue', description: 'Where are they now?' }
      ]
    }
  },
  {
    id: 'template-memoir',
    name: 'Personal Memoir',
    title: 'Personal Memoir',
    description: 'Transform your life experiences into compelling narrative',
    category: 'memoir',
    tags: ['personal-story', 'memoir', 'life-lessons', 'narrative'],
    estimatedTime: '6-8 weeks',
    chapterCount: 10,
    chapters: [
      { title: 'Early Foundations', pitch: 'Where it all began' },
      { title: 'Formative Years', pitch: 'The experiences that shaped you' },
      { title: 'First Challenges', pitch: 'When life got complicated' },
      { title: 'Growth & Discovery', pitch: 'Finding your path' },
      { title: 'Major Turning Point', pitch: 'The moment everything changed' },
      { title: 'Struggles & Setbacks', pitch: 'The low points and lessons' },
      { title: 'Breakthrough Moments', pitch: 'When clarity emerged' },
      { title: 'New Perspectives', pitch: 'How your worldview evolved' },
      { title: 'Current Chapter', pitch: 'Where you are today' },
      { title: 'Wisdom & Reflections', pitch: 'What you\'ve learned' }
    ],
    structure: {
      chapters: [
        { title: 'Early Foundations', description: 'Where it all began' },
        { title: 'Formative Years', description: 'The experiences that shaped you' },
        { title: 'First Challenges', description: 'When life got complicated' },
        { title: 'Growth & Discovery', description: 'Finding your path' },
        { title: 'Major Turning Point', description: 'The moment everything changed' },
        { title: 'Struggles & Setbacks', description: 'The low points and lessons' },
        { title: 'Breakthrough Moments', description: 'When clarity emerged' },
        { title: 'New Perspectives', description: 'How your worldview evolved' },
        { title: 'Current Chapter', description: 'Where you are today' },
        { title: 'Wisdom & Reflections', description: 'What you\'ve learned' }
      ]
    }
  },
  {
    id: 'template-academic',
    name: 'Academic Research',
    title: 'Academic Research',
    description: 'Comprehensive structure for academic writing and research presentation',
    category: 'academic',
    tags: ['research', 'academic', 'thesis', 'scholarly'],
    estimatedTime: '10-16 weeks',
    chapterCount: 8,
    chapters: [
      { title: 'Introduction & Literature Review', pitch: 'Setting the academic foundation' },
      { title: 'Methodology', pitch: 'How the research was conducted' },
      { title: 'Theoretical Framework', pitch: 'The conceptual foundation' },
      { title: 'Data Analysis', pitch: 'What the numbers reveal' },
      { title: 'Findings & Results', pitch: 'Key discoveries' },
      { title: 'Discussion', pitch: 'What it all means' },
      { title: 'Implications', pitch: 'Why this matters' },
      { title: 'Conclusion & Future Research', pitch: 'Wrapping up and looking ahead' }
    ],
    structure: {
      chapters: [
        { title: 'Introduction & Literature Review', description: 'Setting the academic foundation' },
        { title: 'Methodology', description: 'How the research was conducted' },
        { title: 'Theoretical Framework', description: 'The conceptual foundation' },
        { title: 'Data Analysis', description: 'What the numbers reveal' },
        { title: 'Findings & Results', description: 'Key discoveries' },
        { title: 'Discussion', description: 'What it all means' },
        { title: 'Implications', description: 'Why this matters' },
        { title: 'Conclusion & Future Research', description: 'Wrapping up and looking ahead' }
      ]
    }
  },
  {
    id: 'template-selfhelp',
    name: 'Self-Help Guide',
    title: 'Self-Help Guide',
    description: 'Transformational guide with practical exercises and mindset shifts',
    category: 'self-help',
    tags: ['personal-growth', 'transformation', 'mindset', 'practical'],
    estimatedTime: '4-6 weeks',
    chapterCount: 9,
    chapters: [
      { title: 'The Current State', pitch: 'Where you are right now' },
      { title: 'The Vision', pitch: 'Where you want to be' },
      { title: 'Mindset Fundamentals', pitch: 'Changing how you think' },
      { title: 'Core Principles', pitch: 'Universal laws of change' },
      { title: 'Practical Tools', pitch: 'Daily habits and exercises' },
      { title: 'Overcoming Obstacles', pitch: 'When progress gets tough' },
      { title: 'Building Momentum', pitch: 'Creating lasting change' },
      { title: 'Advanced Strategies', pitch: 'Accelerating your growth' },
      { title: 'Living the New You', pitch: 'Maintaining transformation' }
    ],
    structure: {
      chapters: [
        { title: 'The Current State', description: 'Where you are right now' },
        { title: 'The Vision', description: 'Where you want to be' },
        { title: 'Mindset Fundamentals', description: 'Changing how you think' },
        { title: 'Core Principles', description: 'Universal laws of change' },
        { title: 'Practical Tools', description: 'Daily habits and exercises' },
        { title: 'Overcoming Obstacles', description: 'When progress gets tough' },
        { title: 'Building Momentum', description: 'Creating lasting change' },
        { title: 'Advanced Strategies', description: 'Accelerating your growth' },
        { title: 'Living the New You', description: 'Maintaining transformation' }
      ]
    }
  }
];

// Mock AI responses for outline generation
export const mockOutlineResponses = [
  {
    title: 'The Complete Guide to Modern Web Development',
    chapters: [
      'Introduction to Web Technologies',
      'HTML5 and Semantic Markup',
      'CSS3 and Modern Styling',
      'JavaScript Fundamentals',
      'React and Component Architecture',
      'Node.js and Server-Side Development',
      'Database Integration',
      'Deployment and DevOps',
      'Performance Optimization',
      'Future Trends'
    ]
  },
  {
    title: 'Mastering Remote Team Leadership',
    chapters: [
      'The Remote Revolution',
      'Building Trust Virtually',
      'Communication Strategies',
      'Tool Selection and Setup',
      'Managing Performance',
      'Team Culture and Engagement',
      'Conflict Resolution',
      'Work-Life Balance',
      'Scaling Remote Teams',
      'The Future of Work'
    ]
  }
];

// Mock AI responses for content rewriting
export const mockRewriteResponses: Record<string, string> = {
  neutral: 'This is a neutral version of the content with clear, direct language and factual presentation.',
  friendly: 'Hey there! This is a more conversational take on the same content - warmer, more personal, and easier to connect with.',
  professional: 'This represents the professional iteration of the content, utilizing formal language structures and industry-appropriate terminology.'
};

// Mock suggestions for the assistant panel
export const mockSuggestions = [
  'Add a compelling opening hook',
  'Include a relevant statistic',
  'Provide a concrete example',
  'Add a transitional paragraph',
  'Clarify technical terminology',
  'Insert a thought-provoking question',
  'Add supporting evidence',
  'Create a summary bullet list'
];

// Mock integration test responses
export const mockIntegrationStatus = {
  deepseek: { ok: true, model: 'deepseek-chat', latencyMs: 127 },
  gemini: { ok: true, model: 'gemini-pro', latencyMs: 89 }
};