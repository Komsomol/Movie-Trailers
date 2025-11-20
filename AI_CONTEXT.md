# Movie Trailers Aggregator - AI Context

## Project Overview
A Node.js/Express application that aggregates movie trailers from multiple YouTube channels (studios) and displays them in a unified interface. The app filters for official trailers from major studios like Disney, Marvel, Warner Bros, Netflix, etc.

## Architecture

### Core Flow
1. **Channel List** (`data/channels.js`) - Contains 40+ movie studio YouTube channels
2. **Content Fetching** (`getContent.js`) - Orchestrates the data fetching process
3. **Channel Details** (`getChannelDetails.js`) - Gets channel info from YouTube API
4. **Video Fetching** (`getVideosFromChannel.js`) - Retrieves recent videos from each channel
5. **Filtering** (`filterTrailers.js`) - Filters for official trailers only
6. **Display** - Renders via Pug templates

### Key Files

#### Backend
- `app.js` - Express server setup, CORS config, serves on port 3030
- `routes/routes.js` - Two endpoints:
  - `GET /` - Renders Pug template with trailers
  - `GET /api` - Returns JSON data
- `getContent.js` - Main controller, validates API key, fetches from all channels in parallel
- `getData.js` - Per-channel data pipeline
- `filterTrailers.js` - Filters videos by keywords and date range

#### Frontend
- `public/index.pug` - Main template
- `public/css/main.css` - Styles
- `public/js/main.js` - Client-side JavaScript

#### Data
- `data/channels.js` - Channel configuration (name, channelURL, channelID)
- `data/data.json` - Cache/storage file

### Current Technology Stack
- **Runtime**: Node.js
- **Framework**: Express 4.17.1
- **Template Engine**: Pug 3.0.0
- **HTTP Client**: node-fetch 2.6.1, got 11.8.1
- **Date Handling**: moment 2.19.3
- **Process Manager**: PM2 5.3.1
- **Other**: compression, cors, body-parser, dotenv

### Filtering Logic
**Includes**:
- Videos with "official trailer" in title
- Published within last 10 days

**Excludes**:
- blu-ray, season, episode, marvel comics, teaser trailer, teaser, red band

### API Integration
- **YouTube Data API v3** required
- API key stored in `.env` as `YT_API_KEY`
- Validates API key before fetching data
- Quota limit: 10,000 units/day
- Fetches max 50 videos per channel

### Environment Configuration
- **Production**: `NODE_ENV=production node app.js`
- **Port**: 3030 (default) or process.env.PORT
- **CORS**: Configured for `http://localhost:3000`
- **Heroku**: Previously deployed at tommytrailers.herokuapp.com

## Code Quality Issues Identified

### 1. **Outdated Dependencies**
- moment (deprecated, should use date-fns or dayjs)
- node-fetch v2 (should update to native fetch or v3)
- dotenv v4 (very old, current is v16+)
- Several security vulnerabilities likely present

### 2. **Error Handling**
- Generic error messages
- Errors returned instead of thrown in many places
- No structured logging
- Missing try-catch in some async operations

### 3. **Performance Issues**
- No caching mechanism for API responses
- Fetches all channels on every request
- No rate limiting for API calls
- Moment.js is heavy (544KB)

### 4. **Code Quality**
- Mixed ES5/ES6 syntax
- Inconsistent error handling patterns
- No TypeScript types
- No input validation
- Hardcoded values (10 days, 50 videos)
- No tests whatsoever

### 5. **Security**
- CORS only allows localhost:3000 (restrictive)
- No rate limiting on endpoints
- No input sanitization
- API key validation is basic

### 6. **Reliability**
- No retry logic for failed API calls
- No circuit breaker pattern
- Single point of failure (YouTube API)
- No graceful degradation

## Suggested Improvements

### High Priority
1. **Update all dependencies** to latest secure versions
2. **Replace moment.js** with date-fns (96% smaller)
3. **Add comprehensive test suite** (Jest + Supertest)
4. **Implement caching** (Redis or in-memory with node-cache)
5. **Add proper error handling** and logging (winston/pino)
6. **Environment validation** with joi or zod

### Medium Priority
1. **Rate limiting** for API endpoints (express-rate-limit)
2. **API retry logic** with exponential backoff
3. **Health check endpoint** for monitoring
4. **Structured logging** with correlation IDs
5. **TypeScript migration** for type safety
6. **Code splitting** and lazy loading

### Low Priority
1. **Monitoring/metrics** (Prometheus, New Relic)
2. **Database integration** for caching and history
3. **Admin panel** for managing channels
4. **Webhook support** for real-time updates
5. **GraphQL API** as alternative to REST

## Migration to Vite

### Current State
- Pure backend Express app
- Server-side rendering with Pug
- Static files served from `/public`

### Proposed Architecture
1. **Backend**: Keep Express as API server (port 3030)
2. **Frontend**: Migrate to Vite + React/Vue (port 5173)
3. **Development**: Vite dev server proxies API calls to Express
4. **Production**: Vite builds static files, Express serves them

### Migration Steps
1. Set up Vite frontend project
2. Convert Pug templates to React/Vue components
3. Create API client for `/api` endpoint
4. Configure Vite proxy for development
5. Update build process for production
6. Migrate static assets

## Testing Strategy

### Unit Tests
- `filterTrailers.js` - Filter logic with various inputs
- Date range checking
- Keyword matching (includes/excludes)
- API validation function

### Integration Tests
- `getContent.js` - Full data pipeline
- API endpoint responses
- Error handling scenarios
- Cache behavior

### E2E Tests
- Full request/response cycle
- UI rendering (after Vite migration)
- Error states display

## Git Status (Starting Point)
- Modified: `data/channels.js`
- Modified: `filterTrailers.js`
- Branch: master
- Recent changes: Added new channels, improved YT API checks

## Next Steps
1. Update package.json dependencies
2. Add test framework and write tests
3. Refactor for better error handling
4. Set up Vite frontend
5. Migrate to modern best practices
