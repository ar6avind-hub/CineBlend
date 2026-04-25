# Growth, SEO & Launch Strategy

## SEO Strategy
To ensure CineBlend scales organically via search engines, the platform must transition from purely dynamic routes to statically generated (SSG) pages where possible.

1. **Dynamic Metadata (Implemented):** 
   - `generateMetadata` in `app/playlist/[id]/layout.tsx` guarantees that WhatsApp, Discord, X, and Google read the actual title and description of a user's playlist, rather than a generic fallback.
2. **Server-Side Rendering (SSR):**
   - Playlists are accessible without authentication, meaning Google's crawlers can index user-created content. 
   - Search query: `"Rainy day comfort movies site:cineblend.vercel.app"` will eventually surface real user playlists.
3. **Semantic HTML:**
   - Enforce `<h1>` for Playlist Titles, `<h2>` for movie titles, and clean, descriptive alt text for TMDb posters.

## Launch Strategy (Zero-Budget)

1. **The "Seed" Phase:**
   - Create 15-20 incredibly high-quality, niche playlists yourself (e.g., "The A24 Starter Pack", "Sci-Fi that respects your intelligence").
   - Populate the `/explore` page so the platform doesn't look like a ghost town on Day 1.
2. **Community Integration (Reddit/Discord):**
   - Do NOT just drop links. Go to `r/movies` or `r/Letterboxd` when users ask for recommendations, and reply with: *"I actually made a playlist specifically for this vibe..."* linking directly to a CineBlend playlist.
3. **Product Hunt Launch:**
   - Focus the pitch on the *emotional* curation aspect, differentiating from algorithmic giants like Netflix and IMDb.
4. **The Viral Loop:**
   - The native WhatsApp and X share buttons on public playlists drive the core growth loop. Curator shares to group chat -> friend views playlist -> friend sees "Start Curating for Free" CTA on the Navbar -> friend creates account.

## Future Scaling Plan
As traffic grows, the platform will need to handle heavier loads and more complex social interactions.
- **Caching:** Implement Redis (via Upstash) to cache the top 100 most popular playlists on the `/explore` page.
- **Edge Functions:** Move heavy database aggregations (like calculating weekly trending playlists) to Supabase Edge Functions.
- **Storage:** Transition custom avatar uploads to Supabase Storage buckets rather than relying purely on external dicebear/preset URLs.
