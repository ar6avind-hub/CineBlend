# Database Schema (Supabase / PostgreSQL)

CineBlend utilizes PostgreSQL via Supabase. To keep the MVP fast and highly performant, movie data is denormalized directly into the `playlists` table using a `JSONB` array rather than enforcing strict relational joins for every single movie fetch. 

## 1. `users` (Managed by Supabase Auth)
- Handled automatically by Supabase Authentication (`auth.users`).
- Handles Email/Password hashes securely.

## 2. `profiles`
Created automatically via an `on_auth_user_created` trigger whenever a new user signs up.
- `id` (uuid, primary key, references `auth.users(id)`)
- `username` (text, unique)
- `avatar_url` (text, nullable)
- `bio` (text, nullable)
- `created_at` (timestamp)

## 3. `playlists`
The core table containing all curation data.
- `id` (uuid, primary key, default `uuid_generate_v4()`)
- `user_id` (uuid, foreign key references `profiles(id)`)
- `title` (text, required)
- `description` (text, required)
- `cover_url` (text, optional fallback to default placeholder)
- `tags` (text array or simple string)
- `movies` (JSONB) — Stores the array of selected movies fetched from TMDb, including the user's `customNote` for each movie.
- `likes` (integer, default 0)
- `is_public` (boolean, default true)
- `created_at` (timestamp)

## Row Level Security (RLS) Policies
- **Profiles:** `select` is public. `update` restricted to `auth.uid() = id`.
- **Playlists:** `select` is public (allowing non-users to view shared links). `insert`, `update`, `delete` are restricted to `auth.uid() = user_id`.
