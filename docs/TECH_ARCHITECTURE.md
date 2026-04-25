# Tech Architecture & Structure

## Tech Stack
- **Frontend Framework:** Next.js (App Router)
- **UI Library:** React, Tailwind CSS, Framer Motion
- **Icons & Graphics:** Lucide React, SVG Gradients
- **Backend/Auth/Database:** Supabase (PostgreSQL)
- **External APIs:** TMDb (The Movie Database) for posters, search, and metadata
- **Hosting:** Vercel

## Folder Structure

```
cinelist/
├── app/                        # Next.js App Router
│   ├── (auth)/login/page.tsx   # Login & Registration Flow
│   ├── create/page.tsx         # Playlist Creation Page
│   ├── explore/page.tsx        # Community Discovery Feed
│   ├── playlist/[id]/          # Dynamic Public Playlist Pages
│   │   ├── page.tsx            # Playlist Content
│   │   └── layout.tsx          # Open Graph Server Metadata
│   ├── layout.tsx              # Root Layout
│   └── page.tsx                # Landing Page
│
├── components/                 # Reusable UI Components
│   ├── layout/navbar.tsx       # Global Navigation & Search
│   └── ui/                     # Movie Cards, Playlist Cards
│
├── lib/                        # Core Utilities
│   └── supabase/client.ts      # Supabase Browser Client Configuration
│
├── docs/                       # Project Documentation
│   └── ...                     # Architecture, Strategy, Schema
│
└── supabase/                   # Database configurations
    └── migrations/             # SQL Schema files
```

## Authentication Flow
1. User navigates to `/login`.
2. Standard Email and Password authentication via `supabase.auth.signInWithPassword` or `signUp`.
3. Supabase issues an HTTP-only secure cookie and JWT token.
4. On refresh, `components/layout/navbar.tsx` verifies the session and gracefully falls back to the local session if the user profile hasn't finished syncing.
5. The `/explore` and `/create` pages use `supabase.auth.getSession()` to enforce private access, executing a hard redirect to `/login` if unauthenticated.

## API Integration (TMDb)
- Movie searches in `/create` hit the TMDb API (`https://api.themoviedb.org/3/search/movie`) to fetch real-time titles, release years, and poster paths.
- Data is passed into the `playlists` table as a JSONB array, drastically reducing relational complexity while maintaining speed for the MVP.
