"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PlaylistCard from "@/components/ui/playlist-card";
import { createClient } from "@/lib/supabase/client";

export default function ExplorePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "My Playlists", "Community"];

  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        router.push("/login");
        return;
      }
      
      setUser(session.user);

      // Fetch all playlists with their curator profiles
      const { data, error } = await supabase
        .from('playlists')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false });

      if (data && !error) {
        // Map the data to match our PlaylistCard props
        const formattedPlaylists = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          coverUrl: p.cover_url,
          tags: p.tags || [],
          likes: p.likes || 0,
          movieCount: p.movies ? p.movies.length : 0,
          curator: {
            username: p.profiles?.username || "Unknown",
            avatar: p.profiles?.avatar_url || `https://api.dicebear.com/8.x/notionists/svg?seed=unknown`
          },
          user_id: p.user_id
        }));
        setPlaylists(formattedPlaylists);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Filter logic
  const filteredPlaylists = playlists.filter(playlist => {
    if (activeFilter === "All") return true;
    if (activeFilter === "My Playlists") {
      return user && playlist.user_id === user.id;
    }
    if (activeFilter === "Community") {
      return !user || playlist.user_id !== user.id;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-10">
      <h1 className="text-4xl font-bold text-white mb-8">Explore Playlists</h1>
      
      {/* Category Pills */}
      <div className="flex flex-wrap gap-3 mb-10 pb-4 overflow-x-auto hide-scrollbar">
        {categories.map((category) => {
          // Hide "My Playlists" if not logged in
          if (category === "My Playlists" && !user) return null;
          
          const isActive = activeFilter === category;
          return (
            <button 
              key={category} 
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                isActive 
                  ? "bg-white text-black" 
                  : "bg-surface-light border border-white/10 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          )
        })}
      </div>

      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {activeFilter === "All" ? "All Playlists" : activeFilter}
            </h2>
            <div className="h-[1px] flex-1 bg-white/10 ml-4"></div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-20 text-zinc-500">Loading playlists...</div>
          ) : filteredPlaylists.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              <p>No playlists found for this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} {...playlist} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
