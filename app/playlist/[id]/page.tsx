"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MovieCard from "@/components/ui/movie-card";

export default function PlaylistDetail({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [playlist, setPlaylist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*, profiles(username, avatar_url)')
        .eq('id', params.id)
        .single();
      
      if (data && !error) {
        setPlaylist({
          id: data.id,
          title: data.title,
          description: data.description,
          coverUrl: data.cover_url,
          tags: data.tags || [],
          likes: data.likes || 0,
          movieCount: data.movies ? data.movies.length : 0,
          movies: data.movies || [],
          curator: {
            username: data.profiles?.username || "Unknown",
            avatar: data.profiles?.avatar_url || `https://api.dicebear.com/8.x/notionists/svg?seed=unknown`
          }
        });
      }
      setIsLoading(false);
    };

    fetchPlaylist();
  }, [params.id]);

  if (isLoading) {
    return <div className="text-white text-center py-20">Loading playlist...</div>;
  }

  if (!playlist) {
    return <div className="text-white text-center py-20">Playlist not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Profile Section */}
      <section className="relative pt-20 pb-12 px-4 md:px-6 overflow-hidden border-b border-white/5">
        <div 
          className="absolute inset-0 opacity-20 blur-3xl"
          style={{ backgroundImage: `url(${playlist.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />

        <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col md:flex-row gap-8 items-end">
          <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
             <img src={playlist.coverUrl} alt={playlist.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1 pb-2">
            <div className="flex gap-2 mb-3">
              {playlist.tags.map((tag: string) => (
                <span key={tag} className="px-2.5 py-1 text-xs font-semibold bg-white/10 rounded-md backdrop-blur-sm tracking-wide text-zinc-300">
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 text-balance">
              {playlist.title}
            </h1>
            <p className="text-zinc-300 text-lg md:text-xl max-w-2xl text-balance mb-6">
              {playlist.description}
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={playlist.curator.avatar} alt={playlist.curator.username} className="w-8 h-8 rounded-full border border-white/20" />
                <span className="font-semibold text-white">@{playlist.curator.username}</span>
              </div>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 font-medium">{playlist.movieCount} Films</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 font-medium">{playlist.likes} Likes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Action Bar */}
      <div className="max-w-5xl mx-auto w-full px-4 md:px-6 py-4 border-b border-white/5">
         {/* Action buttons removed as requested */}
      </div>

      {/* Movies List */}
      <section className="max-w-5xl mx-auto w-full px-4 md:px-6 py-12">
        <div className="flex flex-col gap-6">
          {playlist.movies.map((movie: any, index: number) => {
            const formattedMovie = movie.poster_path ? {
              id: movie.id.toString(),
              title: movie.title,
              year: parseInt(movie.release_date?.substring(0, 4) || "0"),
              poster: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`,
              note: movie.customNote || movie.overview,
            } : movie;

            return (
              <div key={formattedMovie.id} className="flex gap-4">
                 <div className="text-zinc-600 font-bold text-xl w-6 pt-4 text-center">
                   {index + 1}
                 </div>
                 <div className="flex-1">
                   <MovieCard {...formattedMovie} />
                 </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  );
}
