# RAG Chat Frontend

A modern, responsive chat interface for RAG (Retrieval-Augmented Generation) backends, built with Next.js, Redux, and Bootstrap. Designed to look and feel like DeepSeek's chat interface with a sleek dark theme.


## Tech Stack

- **Framework**: Next.js 14 with App Router
- **State Management**: Redux Toolkit
- **UI Framework**: React Bootstrap 5
- **Styling**: Custom CSS with Bootstrap theming
- **Language**: TypeScript
- **Icons**: Bootstrap Icons

## Getting Started


### Installation

1. **Clone and install dependencies:**
```bash
npm install
# or
yarn install
```

2. **Environment Setup:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Development Server Configuration
PORT=3000

# API Configuration  
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_X_API_KEY=0dabf354ce8f4f10bef0903494a42d97
```

3. **Run the development server:**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## API Integration

This frontend is designed to work with RAG chat backends that provide the following endpoints:


## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and theme
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── ClientProvider.tsx # Redux provider wrapper
├── components/            # React components
│   ├── ChatContainer.tsx  # Main chat container
│   ├── MessageList.tsx    # Message display area
│   ├── MessageInput.tsx   # Message input component
│   ├── MessageBubble.tsx  # Individual message bubble
│   └── Sidebar.tsx        # Navigation sidebar
├── store/                 # Redux store
│   ├── index.ts          # Store configuration
│   └── reducers/
│       └── **.ts  # Chat state management
|   └── actions.ts  # Chat state management
├── services/             # API services
│   └── api.ts           # API client and methods
└── types/               # TypeScript definitions
    └── chat.ts         # Chat-related types
```

## Key Features
 
### 💬 Chat Interface
- Real-time message
- Markdown rendering with syntax highlighting
- Message history with timestamps
- User and assistant message distinction
- Typing indicators for streaming responses

### 📱 Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interface
- Adaptive layouts for all screen sizes
 

## Customization

 
```

### API Configuration
Update API endpoints in `src/services/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
```
 
## Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features
1. Define types in `src/types/`
2. Add Redux actions/reducers in `src/store/slices/`
3. Create components in `src/components/`
4. Add API methods in `src/services/api.ts`
5. Update styling in `src/app/globals.css`
  
### Environment Variables
Set these in your production environment:
- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `NEXT_PUBLIC_X_API_KEY` - Your backend API URL
- `NODE_ENV=production`
