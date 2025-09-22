# MindScribe Pro

A modern, web-based book planning and writing tool with AI assistance. Built with Next.js 14, TypeScript, and Tailwind CSS for a polished, Apple-style user experience.

## 🚀 Features

### ✅ Completed
- **Clean Dashboard**: Book grid with search, progress tracking, and command palette (⌘K)
- **Local-First Storage**: Data persistence with Zustand + localStorage
- **Mock AI Services**: Outline generation and text rewriting endpoints
- **Apple-Style Design**: SF Pro fonts, 8px grid system, subtle animations
- **Command Palette**: Keyboard-first navigation with ⌘K shortcut
- **Responsive Layout**: Works on desktop and mobile devices
- **API Integration Ready**: Mock endpoints for DeepSeek/Gemini testing

### 🔄 In Progress
- Templates gallery page
- 3-panel Book Editor (gamma.app-style)
- Rich text editor with Tiptap
- Settings page with API key management

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + custom design system
- **State Management**: Zustand with persistence
- **Data Fetching**: React Query
- **Animations**: Framer Motion
- **Text Editor**: Tiptap (planned)
- **Icons**: Lucide React

## 🎨 Design System

### Colors
- **Background**: `#0B0C0E` (deep dark)
- **Surface**: `#111316` (cards, panels)
- **Panel**: `#14171B` (secondary surfaces)
- **Border**: `#262A2F` (subtle divisions)
- **Accent**: `#0A84FF` (iOS blue)
- **Success**: `#34C759` (iOS green)
- **Warning**: `#FFD60A` (iOS yellow)
- **Danger**: `#FF453A` (iOS red)

### Typography
- **Display**: SF Pro Display (headings)
- **Text**: SF Pro Text (body)
- **Mono**: SF Mono (code)

### Layout
- **Grid**: 8px base unit
- **Radius**: 1rem (cards), 0.75rem (inputs)
- **Motion**: 120-160ms ease transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone and install
cd mindscribe-pro
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:3001
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test:e2e # Run Playwright tests (planned)
npm run clean    # Clean build artifacts
```

## 📁 Project Structure

```
mindscribe-pro/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── books/         # Book CRUD endpoints
│   │   ├── ai/            # Mock AI services
│   │   └── integrations/  # API testing endpoints
│   ├── page.tsx           # Dashboard
│   ├── settings/          # Settings page (planned)
│   ├── templates/         # Templates gallery (planned)
│   ├── book/[id]/         # Book editor (planned)
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # Base UI components
│   ├── BookCard.tsx       # Book display card
│   ├── CommandPalette.tsx # ⌘K command interface
│   └── ...
├── lib/                   # Core utilities
│   ├── types.ts           # TypeScript definitions
│   ├── store.ts           # Zustand state management
│   ├── mocks.ts           # Mock data and responses
│   └── utils.ts           # Helper functions
├── styles/
│   └── globals.css        # Global styles + design system
└── ...config files
```

## 🔌 API Routes

### Books
- `GET /api/books` - List all books
- `POST /api/books` - Create new book
- `GET /api/books/[id]` - Get book by ID
- `PUT /api/books/[id]` - Update book
- `DELETE /api/books/[id]` - Delete book

### AI Services (Mock)
- `POST /api/ai/generate-outline` - Generate book outline
- `POST /api/ai/rewrite` - Rewrite text with tone adjustment

### Integrations (Mock)
- `POST /api/integrations/deepseek/test` - Test DeepSeek API key
- `POST /api/integrations/gemini/test` - Test Gemini API key

## 🎯 Usage Examples

### Create a New Book
1. Click "New Book" button or use ⌘K → "New Book"
2. Enter title and optional details
3. Book appears in dashboard grid

### Command Palette
- Press ⌘K (Ctrl+K on Windows) to open
- Type to search commands
- Arrow keys to navigate, Enter to execute
- ESC to close

### Search Books
- Use search input on dashboard
- Searches title, subtitle, and author
- Real-time filtering

## 🔮 Planned Features

### Templates Page
- Gallery of pre-built book structures
- Categories: How-to, Business, Fiction, etc.
- One-click book creation from template

### Book Editor
- **Left Panel**: Table of contents (draggable)
- **Center**: Chapter/section cards with rich editor
- **Right Panel**: AI assistant suggestions
- Gamma.app-inspired interface
- Real-time collaboration ready

### Rich Text Editor
- Tiptap-powered editor with:
  - Slash menu (/) for quick blocks
  - Markdown shortcuts
  - Citation support
  - Image placeholders
  - Export options

### Settings Page
- API key management (masked inputs)
- Connection testing with status badges
- Editor preferences
- Export settings

### Advanced Features
- Version history
- Real AI integration (DeepSeek, Gemini)
- Export to PDF, EPUB, Markdown
- Collaboration and sharing
- Analytics and insights

## 🚧 Development Notes

### Replacing Mock Services

The app currently uses mock AI services. To integrate real APIs:

1. **DeepSeek Integration**:
```typescript
// In /api/ai/generate-outline/route.ts
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  })
});
```

2. **Gemini Integration**:
```typescript
// In /api/ai/rewrite/route.ts
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  })
});
```

### Database Migration

Currently using localStorage via Zustand. For production:

1. **Replace with PostgreSQL/MongoDB**:
```typescript
// In lib/store.ts - replace persist middleware
// Add database queries in API routes
```

2. **Add user authentication**:
```typescript
// NextAuth.js or Clerk integration
// Protect API routes
// User-specific data isolation
```

## 📝 License

MIT - see LICENSE file for details.

---

**Built with ❤️ for writers and content creators**

The interface prioritizes clarity, speed, and a distraction-free writing experience. Every interaction is designed to feel native and responsive, following Apple's Human Interface Guidelines for web applications.
