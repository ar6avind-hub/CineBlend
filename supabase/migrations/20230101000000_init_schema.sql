-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  email text unique not null,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PLAYLISTS TABLE
create table if not exists public.playlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  cover_image text,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. MOVIES TABLE (Sourced from TMDb)
create table if not exists public.movies (
  id integer primary key, -- TMDb ID
  title text not null,
  poster_path text,
  release_date text,
  runtime integer
);

-- 4. PLAYLIST_MOVIES TABLE (Join table with notes)
create table if not exists public.playlist_movies (
  id uuid default uuid_generate_v4() primary key,
  playlist_id uuid references public.playlists(id) on delete cascade not null,
  movie_id integer references public.movies(id) on delete cascade not null,
  personal_note text,
  sort_order integer default 0,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (playlist_id, movie_id)
);

-- 5. LIKES TABLE
create table if not exists public.likes (
  user_id uuid references public.users(id) on delete cascade not null,
  playlist_id uuid references public.playlists(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, playlist_id)
);

-- 6. FOLLOWS TABLE
create table if not exists public.follows (
  follower_id uuid references public.users(id) on delete cascade not null,
  followed_id uuid references public.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (follower_id, followed_id),
  check (follower_id != followed_id)
);

----------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
----------------------------------------------------------------------------------

alter table public.users enable row level security;
alter table public.playlists enable row level security;
alter table public.movies enable row level security;
alter table public.playlist_movies enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;

-- USERS: Everyone can view users. Users can only update their own profile.
create policy "Public profiles are viewable by everyone." on public.users for select using (true);
create policy "Users can update own profile." on public.users for update using (auth.uid() = id);

-- PLAYLISTS: Everyone can view public playlists. Users can CRUD their own playlists.
create policy "Public playlists are viewable by everyone." on public.playlists for select using (is_public = true or auth.uid() = user_id);
create policy "Users can insert their own playlists." on public.playlists for insert with check (auth.uid() = user_id);
create policy "Users can update their own playlists." on public.playlists for update using (auth.uid() = user_id);
create policy "Users can delete their own playlists." on public.playlists for delete using (auth.uid() = user_id);

-- MOVIES: Everyone can view and insert movies (cached from TMDb).
create policy "Movies are viewable by everyone." on public.movies for select using (true);
create policy "Anyone authenticated can insert movies." on public.movies for insert with check (auth.uid() is not null);

-- PLAYLIST_MOVIES: Everyone can view movies in public playlists. Users can CRUD movies in their own playlists.
create policy "Playlist movies are viewable if playlist is public." on public.playlist_movies for select using (
  exists (select 1 from public.playlists p where p.id = playlist_movies.playlist_id and (p.is_public = true or p.user_id = auth.uid()))
);
create policy "Users can add movies to their own playlists." on public.playlist_movies for insert with check (
  exists (select 1 from public.playlists p where p.id = playlist_movies.playlist_id and p.user_id = auth.uid())
);
create policy "Users can remove movies from their own playlists." on public.playlist_movies for delete using (
  exists (select 1 from public.playlists p where p.id = playlist_movies.playlist_id and p.user_id = auth.uid())
);

-- LIKES: Everyone can view likes on public playlists. Users can CRUD their own likes.
create policy "Likes are viewable by everyone." on public.likes for select using (true);
create policy "Users can insert their own likes." on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can delete their own likes." on public.likes for delete using (auth.uid() = user_id);

-- FOLLOWS: Everyone can view follows. Users can CRUD their own follows.
create policy "Follows are viewable by everyone." on public.follows for select using (true);
create policy "Users can insert their own follows." on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users can delete their own follows." on public.follows for delete using (auth.uid() = follower_id);
