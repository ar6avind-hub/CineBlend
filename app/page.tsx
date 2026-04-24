import { mockPlaylists } from "@/lib/mock-data";
import PlaylistCard from "@/components/ui/playlist-card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 pb-20 pt-32 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-accent/10 via-surface/30 to-background pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
        
        <h1 className="relative z-10 max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 text-balance">
           Your Life, Directed. <br className="hidden md:block" />
           Your Taste, <span className="text-accent underline decoration-white/20 underline-offset-8">Curated.</span>
        </h1>
        <p className="relative z-10 max-w-2xl text-lg md:text-xl text-zinc-400 mb-10 text-balance">
          Go beyond algorithmic recommendations. Build, discover, and share deeply personal movie playlists based on moods, eras, and unforgettable moments.
        </p>
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/register" className="h-12 px-8 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors shadow-xl shadow-white/5 flex items-center justify-center gap-2">
            Start Curating for Free
          </Link>
          <Link href="/explore" className="h-12 px-8 rounded-full bg-surface-light border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
            Explore Playlists
          </Link>
        </div>
      </section>

      {/* Featured Curations */}
      <section className="px-4 md:px-6 py-12 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Featured Curations</h2>
            <p className="text-zinc-400">Discover handpicked collections from top cinephiles.</p>
          </div>
          <button className="hidden md:block text-accent font-medium hover:text-white transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} {...playlist} />
          ))}
        </div>
      </section>
    </div>
  );
}
