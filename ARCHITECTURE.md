# Architecture Documentation

## Project Structure

This React application follows a clean, modular architecture that separates concerns and promotes maintainability.

```
src/
├── components/           # Reusable UI components
│   ├── ChatInput.js     # Message input with auto-resize
│   ├── DiagramSelector.js # Diagram selection dropdown
│   ├── ImageModal.js    # Full-screen image viewer
│   ├── Message.js       # Individual chat message
│   ├── TypingIndicator.js # Loading animation
│   ├── WelcomeMessage.js # Welcome screen
│   ├── index.js         # Component exports
│   └── *.css           # Component-specific styles
├── hooks/               # Custom React hooks
│   ├── useChat.js       # Chat state management
│   ├── useDiagrams.js   # Diagram loading logic
│   ├── useScrollToBottom.js # Auto-scroll functionality
│   └── index.js         # Hook exports
├── services/            # API and external services
│   └── api.js          # Backend API integration
├── styles/              # Global styles
│   └── global.css      # App-wide CSS
├── utils/               # Utility functions and constants
│   └── constants.js    # Environment-based configuration
├── App.js              # Main application component
└── index.js            # React application entry point
```

## Component Architecture

### Core Components

- **App.js**: Main orchestrator that combines all components and hooks
- **Message**: Handles rendering of individual chat messages with markdown support
- **DiagramSelector**: Manages diagram selection dropdown with loading states
- **ChatInput**: Auto-expanding textarea with form submission
- **ImageModal**: Full-screen image viewer with click-outside-to-close
- **TypingIndicator**: Animated loading indicator for pending responses
- **WelcomeMessage**: Initial welcome screen when no messages exist

### Custom Hooks

- **useChat**: Manages chat messages, loading state, and message sending logic
- **useDiagrams**: Handles diagram loading and selection state
- **useScrollToBottom**: Auto-scrolls to bottom when new messages arrive

### Styling Strategy

- **Global styles** in `styles/global.css` for app-wide layout and themes
- **Component-specific styles** co-located with each component
- **Consistent design system** using Citi bank-inspired professional colors
- **Responsive design** with mobile-first approach

## State Management

The application uses React hooks for state management:

- Local component state for UI interactions
- Custom hooks for complex logic extraction
- Props drilling for component communication
- No external state management library needed due to app simplicity

## API Integration

- **services/api.js**: Centralized API functions
- **REST API** communication with JSON payloads
- **Error handling** with user-friendly error messages
- **Loading states** for better user experience

## Key Features

1. **Modular Architecture**: Each component has a single responsibility
2. **Type Safety**: PropTypes validation on all components
3. **Performance**: React.memo for expensive components
4. **Accessibility**: Semantic HTML and keyboard navigation
5. **Responsive**: Mobile-friendly design
6. **Clean Code**: Consistent naming and organization

## Development Guidelines

1. **Component Creation**: Keep components small and focused
2. **Hook Usage**: Extract complex logic into custom hooks
3. **Styling**: Use component-specific CSS files
4. **Props**: Always add PropTypes validation
5. **Imports**: Use index.js files for cleaner imports
6. **Testing**: Components should be easily testable in isolation

## Configuration

Environment variables are centralized in `utils/constants.js`:
- Agent name and branding
- API endpoints
- UI text and placeholders
- Feature flags

This architecture supports easy maintenance, testing, and feature additions while keeping the codebase clean and understandable.