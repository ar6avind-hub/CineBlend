# CineBlend Development Roadmap

This roadmap outlines the systematic path from our current Minimum Viable Product (MVP) to a fully-featured, community-driven platform.

## Phase 1: MVP Stabilization (COMPLETED)
- [x] Next.js frontend scaffolding and aesthetic design system.
- [x] TMDb API integration for rapid movie lookups.
- [x] Supabase Auth (Email & Password system configured to bypass rate limits).
- [x] PostgreSQL Database schema with JSONB arrays for fast playlist inserts.
- [x] Public Playlist pages with rich Open Graph metadata and WhatsApp/Twitter share buttons.
- [x] Private Explore Feed routing.
- [x] Vercel Deployment configuration.

## Phase 2: User Engagement & Profiles (Next 30 Days)
- **Edit & Delete Playlists:** Allow users to update tags, descriptions, or remove movies from existing playlists via the UI.
- **Dedicated User Profile Pages (`/user/[username]`):** Public pages showcasing a specific user's bio, avatar, and their grid of public playlists.
- **"Like" System:** Add a heart button to playlists. Track likes in a `likes` relational table and update the integer counter on the `playlists` table.
- **Personalized Dashboard:** A private `/dashboard` where users can view their own playlists, edit their bio, and upload custom avatars.

## Phase 3: Community & Social Features (Next 90 Days)
- **Follow System:** Allow users to follow their favorite curators.
- **Following Feed:** A dedicated tab on the `/explore` page showing *only* playlists from followed users.
- **Watch Tracking:** Allow users to flag movies inside a playlist as "Watched" so they don't lose track of what they've seen.
- **Comments Section:** A simple, moderated comment section at the bottom of popular playlists to drive community discussion.

## Phase 4: Advanced Discovery & AI (Future Scope)
- **Advanced Filtering:** Allow users to filter the `/explore` page by specific tags (e.g., "Sci-Fi", "Comfort", "A24").
- **Collaborative Playlists:** Allow multiple users to add movies to the same list.
- **AI-Assisted Curation:** "I'm feeling stressed and want a movie that looks like a painting but isn't boring." -> Suggest 3 movies to add to your list.
