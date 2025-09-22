import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Book, Chapter, Section, Settings, Template } from './types';
import { mockTemplates } from './mocks';

// Books store
interface BooksState {
  books: Book[];
  currentBook: Book | null;
  chapters: Chapter[];
  sections: Section[];
  addBook: (book: Book) => void;
  createBook: (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => Book;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  setCurrentBook: (book: Book | null) => void;
  addChapter: (chapter: Chapter) => void;
  updateChapter: (id: string, updates: Partial<Chapter>) => void;
  deleteChapter: (id: string) => void;
  addSection: (section: Section) => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  deleteSection: (id: string) => void;
  getChaptersByBookId: (bookId: string) => Chapter[];
  getSectionsByChapterId: (chapterId: string) => Section[];
}

export const useBooksStore = create<BooksState>()(
  persist(
    (set, get) => ({
      books: [],
      currentBook: null,
      chapters: [],
      sections: [],
      
      addBook: (book) => set((state) => ({ 
        books: [...state.books, book] 
      })),
      
      createBook: (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newBook: Book = {
          ...bookData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({ books: [...state.books, newBook] }));
        return newBook;
      },
      
      updateBook: (id, updates) => set((state) => ({
        books: state.books.map(book => 
          book.id === id ? { ...book, ...updates } : book
        ),
        currentBook: state.currentBook?.id === id 
          ? { ...state.currentBook, ...updates } 
          : state.currentBook
      })),
      
      deleteBook: (id) => set((state) => ({
        books: state.books.filter(book => book.id !== id),
        chapters: state.chapters.filter(chapter => chapter.bookId !== id),
        sections: state.sections.filter(section => {
          const chapterIds = state.chapters
            .filter(chapter => chapter.bookId === id)
            .map(chapter => chapter.id);
          return !chapterIds.includes(section.chapterId);
        }),
        currentBook: state.currentBook?.id === id ? null : state.currentBook
      })),
      
      setCurrentBook: (book) => set({ currentBook: book }),
      
      addChapter: (chapter) => set((state) => ({
        chapters: [...state.chapters, chapter]
      })),
      
      updateChapter: (id, updates) => set((state) => ({
        chapters: state.chapters.map(chapter =>
          chapter.id === id ? { ...chapter, ...updates } : chapter
        )
      })),
      
      deleteChapter: (id) => set((state) => ({
        chapters: state.chapters.filter(chapter => chapter.id !== id),
        sections: state.sections.filter(section => section.chapterId !== id)
      })),
      
      addSection: (section) => set((state) => ({
        sections: [...state.sections, section]
      })),
      
      updateSection: (id, updates) => set((state) => ({
        sections: state.sections.map(section =>
          section.id === id ? { ...section, ...updates } : section
        )
      })),
      
      deleteSection: (id) => set((state) => ({
        sections: state.sections.filter(section => section.id !== id)
      })),
      
      getChaptersByBookId: (bookId) => {
        return get().chapters
          .filter(chapter => chapter.bookId === bookId)
          .sort((a, b) => a.order - b.order);
      },
      
      getSectionsByChapterId: (chapterId) => {
        return get().sections
          .filter(section => section.chapterId === chapterId)
          .sort((a, b) => a.order - b.order);
      }
    }),
    {
      name: 'mindscribe-books'
    }
  )
);

// Settings store
interface SettingsState extends Settings {
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  defaultLanguage: 'fr',
  defaultTone: 'neutral',
  defaultReadingLevel: 'B2',
  defaultTrimSize: '6x9',
  openRouterApiKey: '',
  sunraApiKey: ''
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      updateSettings: (updates) => set((state) => ({ ...state, ...updates })),
      
      resetSettings: () => set(defaultSettings)
    }),
    {
      name: 'mindscribe-settings'
    }
  )
);

// Templates store (read-only for MVP)
interface TemplatesState {
  templates: Template[];
  searchTemplates: (query: string) => Template[];
}

export const useTemplatesStore = create<TemplatesState>((set, get) => ({
  templates: mockTemplates,
  
  searchTemplates: (query) => {
    const templates = get().templates;
    if (!query) return templates;
    
    return templates.filter(template =>
      template.name.toLowerCase().includes(query.toLowerCase()) ||
      template.description.toLowerCase().includes(query.toLowerCase()) ||
      template.category.toLowerCase().includes(query.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
}));

// Chapters store
interface ChaptersState {
  chapters: Chapter[];
  createChapter: (chapter: Omit<Chapter, 'id'>) => Chapter;
  updateChapter: (id: string, updates: Partial<Chapter>) => void;
  deleteChapter: (id: string) => void;
  getChaptersByBook: (bookId: string) => Chapter[];
}

export const useChaptersStore = create<ChaptersState>()(
  persist(
    (set, get) => ({
      chapters: [],
      
      createChapter: (chapterData) => {
        const newChapter: Chapter = {
          ...chapterData,
          id: crypto.randomUUID(),
        };
        set((state) => ({ chapters: [...state.chapters, newChapter] }));
        return newChapter;
      },
      
      updateChapter: (id, updates) => set((state) => ({
        chapters: state.chapters.map(chapter =>
          chapter.id === id ? { ...chapter, ...updates } : chapter
        )
      })),
      
      deleteChapter: (id) => set((state) => ({
        chapters: state.chapters.filter(chapter => chapter.id !== id)
      })),
      
      getChaptersByBook: (bookId) => {
        return get().chapters.filter(c => c.bookId === bookId).sort((a, b) => a.order - b.order);
      }
    }),
    { name: 'chapters-storage' }
  )
);

// Sections store  
interface SectionsState {
  sections: Section[];
  createSection: (section: Omit<Section, 'id'>) => Section;
  updateSection: (id: string, updates: Partial<Section>) => void;
  deleteSection: (id: string) => void;
  getSectionsByChapter: (chapterId: string) => Section[];
}

export const useSectionsStore = create<SectionsState>()(
  persist(
    (set, get) => ({
      sections: [],
      
      createSection: (sectionData) => {
        const newSection: Section = {
          ...sectionData,
          id: crypto.randomUUID(),
        };
        set((state) => ({ sections: [...state.sections, newSection] }));
        return newSection;
      },
      
      updateSection: (id, updates) => set((state) => ({
        sections: state.sections.map(section =>
          section.id === id ? { ...section, ...updates } : section
        )
      })),
      
      deleteSection: (id) => set((state) => ({
        sections: state.sections.filter(section => section.id !== id)
      })),
      
      getSectionsByChapter: (chapterId) => {
        return get().sections.filter(s => s.chapterId === chapterId).sort((a, b) => a.order - b.order);
      }
    }),
    { name: 'sections-storage' }
  )
);

// UI state store
interface UIState {
  commandPaletteOpen: boolean;
  assistantPanelOpen: boolean;
  currentTone: 'neutral' | 'friendly' | 'professional';
  isGenerating: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  setAssistantPanelOpen: (open: boolean) => void;
  setCurrentTone: (tone: 'neutral' | 'friendly' | 'professional') => void;
  setIsGenerating: (generating: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  commandPaletteOpen: false,
  assistantPanelOpen: true,
  currentTone: 'neutral',
  isGenerating: false,
  
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setAssistantPanelOpen: (open) => set({ assistantPanelOpen: open }),
  setCurrentTone: (tone) => set({ currentTone: tone }),
  setIsGenerating: (generating) => set({ isGenerating: generating })
}));