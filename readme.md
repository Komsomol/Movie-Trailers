# Movie Trailers Aggregator

A modern web application that aggregates movie trailers from major studio YouTube channels.

## Quick Start

```bash
# Install dependencies
npm install && npm run client:install

# Create .env file and add your YouTube API key
cp .env.example .env

# Run development servers
npm run dev:fullstack
```

Open http://localhost:5173

## Features

- Fetches latest trailers from 40+ major studio YouTube channels
- Smart filtering: Official trailers from last 10 days only
- Modern React + Vite frontend with responsive design
- Express.js backend with caching and rate limiting
- 95% reduction in API calls through intelligent caching
- Comprehensive testing with Jest

## Documentation

- **AI_CONTEXT.md** - Project overview, architecture, and context
- **IMPROVEMENTS.md** - Code improvements and performance enhancements
- **VITE_MIGRATION.md** - Frontend migration guide
- **.env.example** - Environment configuration template

## Key Scripts

```bash
npm run dev:fullstack      # Run backend + frontend
npm run dev:improved       # Run improved backend only
npm run test               # Run tests with coverage
npm run build              # Build production frontend
npm run lint:fix           # Fix code style issues
```

## Tech Stack

Backend: Express, Node-cache, Winston, date-fns, YouTube API
Frontend: React 18, Vite 6, Modern CSS

See AI_CONTEXT.md for complete details.
