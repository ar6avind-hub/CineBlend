"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CreatePlaylistPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [tags, setTags] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsLoadingAuth(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (isLoadingAuth) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Sign in required</h1>
        <p className="text-zinc-400 mb-6 text-center">You must be logged in to create a playlist.</p>
        <button 
          onClick={() => router.push("/login")}
          className="h-10 px-6 rounded-full bg-white text-black font-semibold"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const addMovie = (movie: any) => {
    if (!selectedMovies.find(m => m.id === movie.id)) {
      setSelectedMovies([...selectedMovies, { ...movie, customNote: "" }]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const updateMovieNote = (id: string | number, note: string) => {
    setSelectedMovies(selectedMovies.map(m => m.id === id ? { ...m, customNote: note } : m));
  };

  const removeMovie = (id: string | number) => {
    setSelectedMovies(selectedMovies.filter(m => m.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    
    const finalImage = coverUrl.trim() || (selectedMovies.length > 0 && selectedMovies[0].poster_path 
      ? `https://image.tmdb.org/t/p/w500${selectedMovies[0].poster_path}` 
      : "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop");
    
    try {
      const { error } = await supabase.from('playlists').insert({
        title,
        description,
        cover_url: finalImage,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        movies: selectedMovies,
        user_id: user.id
      });

      if (error) throw error;
      
      router.push("/explore");
    } catch (err: any) {
      console.error("Error creating playlist", err);
      setErrorMessage(err.message || "Failed to create playlist. Check the database.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Create Playlist</h1>
        <p className="text-zinc-400 mb-10">Curate your next masterpiece.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 bg-surface-light border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold text-white">Basic Info</h2>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Title</label>
              <input 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="E.g., Rainy Night Comfort Films"
                className="w-full bg-background border border-white/10 rounded-xl h-12 px-4 text-white focus:ring-1 focus:ring-accent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
              <textarea 
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What is this playlist about?"
                rows={3}
                className="w-full bg-background border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-accent outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Tags (Comma separated)</label>
                <input 
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="cozy, sci-fi"
                  className="w-full bg-background border border-white/10 rounded-xl h-12 px-4 text-white focus:ring-1 focus:ring-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Cover URL (Optional)</label>
                <input 
                  value={coverUrl}
                  onChange={e => setCoverUrl(e.target.value)}
                  placeholder="Leave empty for auto-cover"
                  className="w-full bg-background border border-white/10 rounded-xl h-12 px-4 text-white focus:ring-1 focus:ring-accent outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-surface-light border border-white/10 p-6 rounded-2xl relative">
            <h2 className="text-xl font-semibold text-white">Add Movies</h2>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for movies to add..."
                className="w-full bg-background border border-white/10 rounded-xl h-12 pl-10 pr-4 text-white focus:ring-1 focus:ring-accent outline-none"
              />
            </div>

            {/* Search Results Dropdown */}
            {searchQuery.trim() && (
              <div className="absolute z-10 w-[calc(100%-3rem)] left-6 top-[130px] bg-background border border-white/10 rounded-xl max-h-60 overflow-y-auto shadow-2xl">
                {isSearching ? (
                  <div className="p-4 text-center text-zinc-400">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((movie) => (
                    <div 
                      key={movie.id} 
                      onClick={() => addMovie(movie)}
                      className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0"
                    >
                      {movie.poster_path ? (
                        <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} className="w-10 h-14 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-14 bg-white/10 rounded flex items-center justify-center">?</div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{movie.title}</h4>
                        <p className="text-zinc-500 text-sm">{movie.release_date?.substring(0, 4)}</p>
                      </div>
                      <Plus className="w-5 h-5 text-accent" />
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-zinc-400">No movies found.</div>
                )}
              </div>
            )}

            {/* Selected Movies List */}
            {selectedMovies.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-zinc-400">Selected Movies ({selectedMovies.length})</h3>
                {selectedMovies.map((movie, idx) => (
                  <div key={movie.id} className="flex items-center gap-3 bg-background p-3 rounded-xl border border-white/5">
                    <span className="text-zinc-600 font-bold w-6 text-center">{idx + 1}</span>
                    {movie.poster_path ? (
                      <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} className="w-10 h-14 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-14 bg-white/10 rounded flex items-center justify-center">?</div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{movie.title}</h4>
                      <p className="text-zinc-500 text-sm mb-2">{movie.release_date?.substring(0, 4)}</p>
                      <input 
                        type="text" 
                        placeholder="Why did you add this movie? (Optional Curator Note)"
                        value={movie.customNote}
                        onChange={(e) => updateMovieNote(movie.id, e.target.value)}
                        className="w-full bg-surface border border-white/10 rounded-lg h-9 px-3 text-sm text-white focus:ring-1 focus:ring-accent outline-none"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeMovie(movie.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center">
              {errorMessage}
            </div>
          )}

          <button 
            type="submit"
            disabled={selectedMovies.length === 0 || !title || !description || isSubmitting}
            className="w-full h-12 bg-white text-black font-bold rounded-xl mt-6 hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? "Creating..." : "Create Playlist"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
