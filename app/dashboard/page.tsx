"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { PlusSquare, Trash2, Edit } from "lucide-react";

export default function Dashboard() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      window.location.href = "/login";
      return;
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setUser(profile || { 
      id: session.user.id, 
      username: session.user.user_metadata?.username || session.user.email?.split('@')[0],
      avatar_url: session.user.user_metadata?.avatar_url
    });

    // Fetch user's playlists
    const { data: userPlaylists } = await supabase
      .from("playlists")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    setPlaylists(userPlaylists || []);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this playlist?")) return;

    try {
      const { error } = await supabase.from("playlists").delete().eq("id", id);
      if (error) throw error;
      
      setPlaylists(playlists.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting playlist:", err);
      alert("Failed to delete playlist.");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen pt-24 text-center text-zinc-400">Loading your dashboard...</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-16 pb-12 border-b border-white/5">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-xl">
          <img 
            src={user?.avatar_url || `https://api.dicebear.com/8.x/notionists/svg?seed=${user?.username}`} 
            alt={user?.username} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">@{user?.username}</h1>
          <p className="text-zinc-400 max-w-xl">
            {user?.bio || "Welcome to your control center. Manage your curations and update your profile."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
            <Link href="/create" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm font-medium">
              <PlusSquare className="w-4 h-4" />
              New Playlist
            </Link>
            <Link href={`/user/${user?.username}`} className="flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-full transition-colors text-sm font-medium">
              View Public Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Playlists Section */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
        <span className="text-sm text-zinc-500 bg-white/5 px-3 py-1 rounded-full">{playlists.length} total</span>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-20 bg-surface/50 rounded-2xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-2">No playlists yet</h3>
          <p className="text-zinc-400 mb-6">Start curating your first movie collection!</p>
          <Link href="/create">
            <button className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-bold rounded-full transition-colors">
              Create a Playlist
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist, i) => (
            <motion.div 
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors group flex flex-col"
            >
              <Link href={`/playlist/${playlist.id}`} className="block relative aspect-video overflow-hidden bg-black flex-shrink-0">
                <img 
                  src={playlist.cover_url || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop"} 
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <div className="flex gap-2">
                    {playlist.tags && playlist.tags.map((tag: string) => (
                      <span key={tag} className="text-xs font-medium text-white/80 bg-white/20 backdrop-blur-md px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              
              <div className="p-5 flex flex-col flex-1">
                <Link href={`/playlist/${playlist.id}`}>
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-accent transition-colors">{playlist.title}</h3>
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{playlist.description}</p>
                </Link>
                
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium">
                    {playlist.movies?.length || 0} movies
                  </span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDelete(playlist.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                      title="Delete Playlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
