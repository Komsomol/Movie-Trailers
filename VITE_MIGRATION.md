# Vite Migration Guide

## Overview

This document describes the migration from a traditional Express + Pug SSR application to a modern Vite + React SPA with Express API backend.

---

## Architecture Changes

### Before (SSR with Pug)
```
┌─────────────────────┐
│   Express Server    │
│  (Port 3030)        │
│                     │
│  ┌──────────────┐   │
│  │ Pug Templates│   │
│  │ (SSR)        │   │
│  └──────────────┘   │
│                     │
│  ┌──────────────┐   │
│  │ Static Files │   │
│  │ (CSS/JS)     │   │
│  └──────────────┘   │
└─────────────────────┘
```

### After (Vite + React SPA)
```
Development:
┌──────────────────┐      ┌──────────────────┐
│  Vite Dev Server │──────│ Express API      │
│  (Port 5173)     │ Proxy│ (Port 3030)      │
│                  │      │                  │
│  React SPA       │      │  /api endpoints  │
│  Hot Reload      │      │  /health         │
└──────────────────┘      └──────────────────┘

Production:
┌─────────────────────────┐
│   Express Server        │
│   (Port 3030)           │
│                         │
│  ┌──────────────────┐   │
│  │ API Endpoints    │   │
│  │ /api, /health    │   │
│  └──────────────────┘   │
│                         │
│  ┌──────────────────┐   │
│  │ Static Vite Build│   │
│  │ (React SPA)      │   │
│  └──────────────────┘   │
└─────────────────────────┘
```

---

## Project Structure

```
Movie-Trailers/
├── client/                    # Vite + React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Header.jsx
│   │   │   ├── TrailerCard.jsx
│   │   │   ├── TrailerList.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   ├── App.css           # App styles
│   │   └── index.css         # Global styles
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   ├── package.json          # Frontend dependencies
│   └── .eslintrc.cjs         # ESLint config
│
├── __tests__/                # Backend tests
├── data/                     # Channel configurations
├── public/                   # Old static files (legacy)
├── routes/                   # Express routes
├── utils/                    # Utility modules
│   ├── logger.js            # Winston logger
│   └── cache.js             # Node-cache setup
│
├── app.js                    # Original Express app
├── app.improved.js           # Improved Express app
├── getContent.js             # Original content fetcher
├── getContent.improved.js    # Improved with caching
├── filterTrailers.js         # Original filter
├── filterTrailers.improved.js # Improved with date-fns
│
├── package.json              # Root package.json
├── .env.example              # Environment template
├── AI_CONTEXT.md             # Project documentation
├── IMPROVEMENTS.md           # Code improvements log
└── VITE_MIGRATION.md         # This file
```

---

## Component Architecture

### Component Tree
```
App
├── Header
│   └── Refresh Button
├── Main Content
│   ├── Loading (conditional)
│   ├── ErrorMessage (conditional)
│   ├── No Trailers Message (conditional)
│   └── TrailerList (conditional)
│       └── TrailerCard (multiple)
│           ├── Video Embed
│           └── Trailer Info
└── Footer
```

### Component Responsibilities

**App.jsx** - Main application container
- Fetches trailer data from `/api`
- Manages loading and error states
- Handles refresh logic

**Header.jsx** - Application header
- Displays title and subtitle
- Refresh button with loading state

**TrailerList.jsx** - Grid container
- Maps over trailers array
- Renders TrailerCard components

**TrailerCard.jsx** - Individual trailer display
- YouTube iframe embed
- Trailer metadata (title, channel, date)
- Links to YouTube

**Loading.jsx** - Loading indicator
- Animated spinner
- Loading message

**ErrorMessage.jsx** - Error display
- Error message
- Retry button

---

## Key Features

### 1. Modern React Patterns
- Functional components with hooks
- PropTypes for type checking
- Responsive design with CSS Grid
- Clean, maintainable code structure

### 2. Performance Optimizations
- Lazy loading iframes
- CSS animations with GPU acceleration
- Efficient re-rendering
- Image error handling

### 3. Developer Experience
- Hot Module Replacement (HMR)
- Fast Vite dev server
- ESLint integration
- Component-based architecture

### 4. Production Ready
- Optimized build process
- Code splitting
- Minification
- Tree shaking

---

## Development Workflow

### Setup
```bash
# Install all dependencies
npm install
npm run client:install

# Create .env file
cp .env.example .env
# Add your YouTube API key
```

### Development
```bash
# Run both backend and frontend
npm run dev:fullstack

# Or run separately:
# Terminal 1 - Backend
npm run dev:improved

# Terminal 2 - Frontend
npm run client:dev
```

### Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:3030/api
- Health Check: http://localhost:3030/health

### Testing
```bash
# Run backend tests
npm test

# Run with coverage
npm run test:watch
```

### Building for Production
```bash
# Build frontend
npm run build

# This creates /dist folder with optimized React app
```

---

## Production Deployment

### Option 1: Serve Static Files from Express

Update `app.improved.js` to serve the built React app:

```javascript
// After other middleware, before routes
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));

  // Serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}
```

### Option 2: Separate Deployment
- Deploy React build to CDN (Netlify, Vercel, Cloudflare)
- Deploy Express API to server (Heroku, Railway, AWS)
- Update CORS settings accordingly

---

## API Integration

### Backend Endpoints

**GET /api**
Returns array of trailer objects:
```json
[
  {
    "channel": "Warner Bros.",
    "name": "Movie Title - Official Trailer",
    "date": "January 15, 2025",
    "dateString": "2025-01-15T12:00:00.000Z",
    "link": "abc123xyz",
    "thumbnail": "https://..."
  }
]
```

**GET /health**
Returns server health status:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-19T...",
  "uptime": 1234.56,
  "environment": "development"
}
```

### Frontend API Client

Located in `App.jsx`:
```javascript
const fetchTrailers = async () => {
  const response = await fetch('/api');
  const data = await response.json();
  // Handle data
};
```

In development, Vite proxies `/api` to `localhost:3030`.

---

## Migration Benefits

### Performance
- **Faster Development**: HMR for instant updates
- **Faster Production**: Optimized Vite build
- **Better Caching**: Static assets with hashing
- **Code Splitting**: Smaller initial bundle

### Developer Experience
- **Modern Tooling**: Vite, React, ESLint
- **Component Reusability**: Modular architecture
- **Type Safety**: PropTypes validation
- **Better Debugging**: React DevTools support

### Maintainability
- **Clear Separation**: Frontend/Backend concerns
- **Testable Components**: Easy to unit test
- **Modern Practices**: Hooks, functional components
- **Documentation**: Well-commented code

### Scalability
- **Easy to Extend**: Add new components
- **State Management Ready**: Easy to add Redux/Context
- **API-First**: Backend can serve multiple clients
- **Mobile Support**: Responsive design built-in

---

## Environment Variables

### Backend (.env)
```bash
YT_API_KEY=your_youtube_api_key
NODE_ENV=development
PORT=3030
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:5173
CACHE_TTL=300
TRAILER_DATE_RANGE=10
```

### Frontend (Vite)
No environment variables needed in development (uses proxy).

For production with separate deployment, create `.env.production`:
```bash
VITE_API_URL=https://your-api-domain.com
```

And update fetch calls:
```javascript
const API_URL = import.meta.env.VITE_API_URL || '';
fetch(`${API_URL}/api`);
```

---

## Troubleshooting

### Port Conflicts
```bash
# Change Vite port in vite.config.js
server: {
  port: 5174  // Use different port
}
```

### CORS Issues
Ensure backend CORS is configured:
```javascript
// In app.improved.js
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
app.use(cors(corsOptions));
```

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules client/node_modules
npm install
npm run client:install
```

### API Not Loading
Check that:
1. Backend is running on port 3030
2. Vite proxy is configured correctly
3. .env file has YT_API_KEY set

---

## Next Steps

### Potential Enhancements
1. **State Management**: Add Redux or Context API
2. **Routing**: Add React Router for multiple pages
3. **Animations**: Add Framer Motion for transitions
4. **PWA**: Make it a Progressive Web App
5. **Search/Filter**: Add client-side filtering
6. **Favorites**: Add local storage for favorites
7. **Dark/Light Mode**: Theme switcher
8. **Infinite Scroll**: Load more trailers

### Testing Frontend
```bash
# Install testing libraries
cd client
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom

# Add test script to client/package.json
"test": "vitest"
```

---

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [YouTube API Reference](https://developers.google.com/youtube/v3)

---

## Support

For issues or questions:
1. Check `AI_CONTEXT.md` for project overview
2. Check `IMPROVEMENTS.md` for code improvements
3. Review component JSDoc comments
4. Check console for error messages
