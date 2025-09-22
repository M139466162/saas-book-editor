export type UUID = string;

export interface Book {
  id: UUID;
  title: string;
  subtitle?: string;
  author?: string;
  coverUrl?: string;
  language: string; // "fr" | "en" | ...
  audience: string; // "general" | "ya" | ...
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: UUID;
  bookId: UUID;
  title: string;
  order: number;
  pitch?: string; // short promise/angle for the chapter
}

export interface Section {
  id: UUID;
  chapterId: UUID;
  heading?: string;
  bodyMd: string; // markdown content
  order: number;
  issues?: string[]; // QA markers (stub)
}

export interface Settings {
  deepseekApiKey?: string;
  geminiApiKey?: string;
  openRouterApiKey?: string;
  sunraApiKey?: string;
  defaultLanguage: string;
  defaultTone: "neutral" | "friendly" | "professional";
  defaultReadingLevel: "A2" | "B1" | "B2" | "C1";
  defaultTrimSize: "A4" | "A5" | "6x9";
}

export interface Template {
  id: UUID;
  name: string;
  title: string; // Keep for backwards compatibility
  description: string;
  category: 'how-to' | 'business' | 'fiction' | 'memoir' | 'academic' | 'self-help';
  tags: string[];
  estimatedTime: string;
  chapterCount: number;
  chapters: { title: string; pitch?: string; description?: string; sections?: { title: string }[] }[];
  structure: {
    chapters: { title: string; description?: string; sections?: { title: string }[] }[];
  };
}

export interface CommandPaletteItem {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  action: () => void;
  category?: string;
}