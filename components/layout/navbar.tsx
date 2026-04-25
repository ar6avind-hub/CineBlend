"use client";

import { motion } from "framer-motion";
import { Search, PlusSquare, LogOut, Film } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch initial session and profile
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser(profile);
        } else {
          setUser({
            id: session.user.id,
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url
          });
        }
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            setUser(profile);
          } else {
            setUser({
              id: session.user.id,
              username: session.user.user_metadata?.username || session.user.email?.split('@')[0],
              avatar_url: session.user.user_metadata?.avatar_url
            });
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent via-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-all">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-2xl text-white">Cine<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Blend</span></span>
        </Link>

        {/* Global Search */}
        <div className="hidden md:flex ml-8 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search playlists, users, or movies..." 
              className="w-full h-10 bg-surface-light border border-white/5 rounded-full pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-5">
          <Link href="/explore" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Explore</Link>
          <div className="w-px h-4 bg-white/10 hidden sm:block"></div>
          
          <Link href="/create">
            <button className="flex items-center gap-2 h-9 px-4 rounded-full bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all border border-white/5">
              <PlusSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </button>
          </Link>

          {user ? (
            <div className="flex items-center gap-4 ml-2">
              <div className="flex items-center gap-2 bg-surface border border-white/5 rounded-full py-1 pr-4 pl-1 shadow-inner">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                  <img src={user.avatar_url || `https://api.dicebear.com/8.x/notionists/svg?seed=${user.username}`} alt={user.username} className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-bold text-white hidden md:block">@{user.username}</span>
              </div>
              <button onClick={handleLogout} className="text-zinc-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/5" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" />
                </svg>
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
