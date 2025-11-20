# Movie Trailers Aggregator - AI Context Document

**Project Directory**: `/Users/farhad/Documents/GitHub/Movie-Trailers`

## Project Overview

A full-stack web application that aggregates and displays official movie trailers from 47+ major film studios by fetching data from their YouTube channels. The app filters trailers from the last 30 days and presents them in a clean, editorial-style interface matching the voidkat.com design aesthetic.

## Architecture

### Stack
- **Backend**: Node.js + Express (Port 3030)
- **Frontend**: Vue 3 + Vite (Port 5173)
- **State Management**: Pinia
- **Styling**: Custom CSS with voidkat.com theme
- **Data Source**: YouTube Data API v3

### Key Design Decisions
1. **API Key Security**: YouTube API key stored in backend `.env`, never exposed to client
2. **Caching**: 5-minute TTL cache to reduce API quota usage
3. **Error Handling**: Graceful degradation with Promise.allSettled for channel failures
4. **Performance**: Lazy loading, image optimization, consolidated watchers
5. **Time Range**: 30-day lookback for trailers (configurable)
6. **Pagination**: 20 trailers per page

## Directory Structure

```
/Users/farhad/Documents/GitHub/Movie-Trailers/
├── client/                      # Vue 3 Frontend
│   ├── src/
│   │   ├── components/          # Vue components
│   │   │   ├── Header.vue       # Site header with refresh button
│   │   │   ├── TrailerList.vue  # Grid of trailer cards
│   │   │   ├── TrailerCard.vue  # Individual trailer card (click to play)
│   │   │   ├── VideoModal.vue   # Modal for playing trailers (lazy loaded)
│   │   │   ├── StudioFilter.vue # Floating filter dropdown (top-right)
│   │   │   ├── Pagination.vue   # Page navigation controls
│   │   │   ├── Loading.vue      # Loading spinner
│   │   │   └── ErrorMessage.vue # Error display with retry
│   │   ├── stores/
│   │   │   └── trailerStore.js  # Pinia store (state management)
│   │   ├── App.vue              # Root component
│   │   ├── App.css              # Main styles (voidkat.com theme)
│   │   └── main.js              # Vue app initialization
│   ├── index.html               # HTML entry point
│   └── package.json             # Frontend dependencies
├── data/
│   └── channels.js              # 47 YouTube channel configurations
├── utils/
│   ├── logger.js                # Winston logger
│   └── cache.js                 # node-cache wrapper
├── routes/
│   └── routes.js                # Express API routes
├── app.improved.js              # Main Express server
├── getContent.improved.js       # Orchestrates data fetching from all channels
├── getData.improved.js          # Fetches data for single channel
├── filterTrailers.improved.js   # Filters videos by keywords and date
├── getChannelDetails.js         # Gets channel metadata
├── .env                         # Environment variables (YT_API_KEY)
└── package.json                 # Backend dependencies
```

## Data Flow

1. **Client Request**: Vue app calls `/api` endpoint
2. **Cache Check**: Backend checks 5-min cache, returns if valid
3. **API Validation**: Validates YouTube API key
4. **Parallel Fetching**: Fetches from all 47 channels in parallel using `Promise.allSettled`
5. **Filtering**: Each channel's videos filtered by:
   - Must contain "official trailer" in title (case-insensitive)
   - Must NOT contain: blu-ray, season, episode, teaser, red band
   - Must be within last 30 days
6. **Processing**: Flatten, sort by date (newest first), deduplicate
7. **Caching**: Store results for 5 minutes
8. **Response**: Return JSON array of trailer objects

## API Endpoints

### `GET /api`
Returns array of trailer objects:
```javascript
[
  {
    channel: "Warner Bros. Pictures",
    name: "Dune: Part Three - Official Trailer",
    date: "Thursday, January 15th, 2025",
    dateString: "2025-01-15T10:30:00.000Z",
    link: "VIDEO_ID",
    thumbnail: "https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg"
  },
  // ... more trailers
]
```

**Error Response** (API validation fails):
```javascript
{
  apiValid: false,
  error: { message: "API key error description" }
}
```

## Configuration Files

### `data/channels.js`
Array of 47 studio channel configurations:
```javascript
{
  name: 'Studio Name',
  channelURL: 'YouTubeHandle',
  channelID: 'UC...' // YouTube channel ID
}
```

### `.env`
```
YT_API_KEY=your_youtube_api_key_here
```

### `filterTrailers.improved.js`
```javascript
// Configurable values:
const daysRange = 30; // Lookback period
const EXCLUDED_KEYWORDS = ['blu-ray', 'season', 'episode', ...];
const SEARCH_KEYWORDS = ['official trailer'];
```

### `trailerStore.js`
```javascript
const TRAILERS_PER_PAGE = 20; // Pagination size
const CACHE_TTL = 300; // 5 minutes (backend)
```

## Frontend State (Pinia Store)

### State
- `trailers`: Array of all fetched trailers
- `loading`: Boolean for loading state
- `error`: Error message string or null
- `selectedStudio`: Current filter ('all' or studio name)
- `currentPage`: Current page number

### Getters
- `filteredTrailers`: Trailers filtered by selected studio
- `studioCounts`: Array of studios with trailer counts
- `paginatedTrailers`: Current page of trailers (20 per page)
- `totalPages`: Total number of pages

### Actions
- `fetchTrailers()`: Fetch from `/api`
- `setSelectedStudio(studio)`: Change filter, reset to page 1
- `setCurrentPage(page)`: Navigate to page

## UI/UX Features

1. **Studio Filter**: Floating dropdown (top-right) to filter by studio
2. **Pagination**: Next/Previous + numbered pages (smart ellipsis)
3. **Click-to-Play**: Trailers open in modal with YouTube player
4. **Auto-Close Modal**: Modal closes automatically when video ends
5. **Lazy Loading**: VideoModal component loaded on-demand
6. **Image Optimization**:
   - First 2 images: `fetchpriority="high"`, `loading="eager"`
   - Rest: `fetchpriority="low"`, `loading="lazy"`
   - Async decoding
7. **Error Handling**: Graceful error display with retry button
8. **Responsive**: Mobile-optimized grid and controls

## Design Theme (voidkat.com)

### Colors
```css
--bg-primary: #ffffff;
--accent-primary: #f92300; /* Orange-red */
--text-primary: #0d0d0d;
--text-secondary: rgba(0, 0, 0, 0.59);
--border-medium: rgba(0, 0, 0, 0.2);
```

### Typography
- **Body**: Merriweather (serif), Georgia fallback
- **Headings**: Open Sans (sans-serif)
- **Line height**: 1.78 (high readability)

### Style
Clean, minimal, editorial blog aesthetic with professional content focus.

## Performance Optimizations

1. **Backend**:
   - Date range calculated once per channel (not per video)
   - Early exit pattern for non-matching titles
   - Single date parsing per video
   - Promise.allSettled for parallel requests
   - 5-minute cache to reduce API calls

2. **Frontend**:
   - Lazy loading VideoModal component
   - Getter reuse in Pinia store (avoid duplicate filtering)
   - Consolidated watchers (single watcher vs. multiple)
   - Image fetchpriority optimization
   - Async image decoding

3. **Network**:
   - Font preconnect for Google Fonts
   - WOFF2 font format
   - Image lazy loading below fold

## Build & Deployment

### Development
```bash
npm run dev:fullstack    # Runs both backend + frontend
npm run dev:improved     # Backend only (port 3030)
npm run client:dev       # Frontend only (port 5173)
```

### Production Build
```bash
npm run build            # Builds client to client/dist/
npm run start:improved   # Runs production backend
```

### Environment Variables Required
- `YT_API_KEY`: YouTube Data API v3 key (required)
- `NODE_ENV`: Set to "production" for production mode

### Deployment Options
1. **Vercel/Netlify**: Deploy full-stack, add YT_API_KEY to env vars
2. **VPS/Server**: Build client, serve `client/dist/` as static files, proxy `/api` to Node backend
3. **Subdomain**: `trailers.voidkat.com` (recommended)
4. **Path**: `voidkat.com/trailers`

### Nginx Example
```nginx
location /trailers {
    root /var/www/voidkat.com;
    try_files $uri $uri/ /trailers/index.html;
}

location /trailers/api {
    proxy_pass http://localhost:3030/api;
}
```

## Studio Coverage (47 Channels)

Major Studios: Warner Bros, Universal, Paramount, Disney, Sony, Netflix, MGM, Lionsgate, 20th Century Fox

Indie/Art House: A24, Neon, Annapurna, Focus Features, Searchlight Pictures, IFC Films

Animation: Illumination, DreamWorks Animation, Disney Pixar

Streaming: Apple TV, HBO, Amazon Studios

Specialty: Miramax, Magnolia Pictures, Film Movement, Sony Pictures Classics, Bleecker Street, Participant

## Common Tasks

### Add New Studio Channel
1. Get YouTube channel ID (starts with "UC")
2. Add to `data/channels.js`:
```javascript
{
  name: 'Studio Name',
  channelURL: 'YouTubeHandle',
  channelID: 'UCxxxxxxxxxx'
}
```

### Change Time Range
Edit `filterTrailers.improved.js`:
```javascript
const getTrailersOnly = (file, channelName, daysRange = 30) // Change 30 to desired days
```

### Change Trailers Per Page
Edit `client/src/stores/trailerStore.js`:
```javascript
const TRAILERS_PER_PAGE = 20; // Change to desired number
```

### Modify Filter Keywords
Edit `filterTrailers.improved.js`:
```javascript
const EXCLUDED_KEYWORDS = ['blu-ray', 'season', ...]; // Add/remove keywords
const SEARCH_KEYWORDS = ['official trailer']; // Must contain these
```

## Troubleshooting

### No Trailers Returned
1. Check YouTube API key is valid
2. Check API quota (10,000 units/day default)
3. Verify channels haven't changed IDs
4. Check date range (30 days may have no trailers)

### Duplicate Trailers
- Handled by deduplication in `getContent.improved.js` (lines 128-137)
- Uses Map with `channel:name` as key

### API Quota Exceeded
- Reduce cache TTL to 5+ minutes
- Reduce number of channels
- Increase YouTube API quota limit

### Styling Issues
- Check Google Fonts loaded (Merriweather + Open Sans)
- Verify CSS variables in `:root`
- Check browser console for missing resources

## Security Notes

✅ **Secure**:
- API key in backend `.env` (never exposed to client)
- `.env` in `.gitignore`
- Backend makes all YouTube API calls
- Client only calls backend `/api`

❌ **Never Do**:
- Put API key in frontend code
- Commit `.env` to git
- Make YouTube API calls from client
- Expose API endpoints without rate limiting

## Git Workflow

```bash
# Current status shows modified files:
git status
# M data/channels.js
# M filterTrailers.js

# Before committing:
git add .
git commit -m "feat: add new studios and extend to 30-day range"
git push
```

## Testing

Run backend tests:
```bash
npm test           # Run all tests
npm run test:watch # Watch mode
```

## Monitoring

- Backend logs via Winston (console + file)
- Check server output for:
  - API validation status
  - Channel fetch success/failures
  - Cache hits/misses
  - Trailer counts per studio
  - Deduplication stats

## Future Enhancements

Potential improvements:
1. Admin panel to manage channels
2. Search/filter by trailer name
3. Favorites/watchlist functionality
4. Email notifications for new trailers
5. Genre categorization
6. Release date tracking
7. Analytics dashboard

---

**Last Updated**: 2025-01-19
**Node Version**: >=18.0.0
**NPM Version**: >=9.0.0
