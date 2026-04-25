import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Film } from "lucide-react";
import { Metadata } from "next";

// Add Revalidate so it checks for updates occasionally, but remains fast.
export const revalidate = 60;

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  return {
    title: `${params.username}'s Curations | CineBlend`,
    description: `Check out ${params.username}'s movie playlists on CineBlend.`,
  };
}

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Decode username in case of URL encoding
  const username = decodeURIComponent(params.username);

  // Fetch the profile by username
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    return (
      <div className="min-h-screen pt-32 text-center text-white flex flex-col items-center justify-center">
        <Film className="w-16 h-16 text-zinc-700 mb-4" />
        <h1 className="text-3xl font-bold mb-2">User Not Found</h1>
        <p className="text-zinc-400 mb-8">The curator you are looking for doesn't exist.</p>
        <Link href="/explore">
          <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors font-medium">
            Go back to Explore
          </button>
        </Link>
      </div>
    );
  }

  // Fetch public playlists created by this user
  const { data: playlists } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-16 pb-12 border-b border-white/5">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl mb-6">
          <img 
            src={profile.avatar_url || `https://api.dicebear.com/8.x/notionists/svg?seed=${profile.username}`} 
            alt={profile.username} 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">@{profile.username}</h1>
        <p className="text-zinc-400 max-w-2xl text-lg mb-6">
          {profile.bio || "This user is a person of mystery, letting their film taste speak for itself."}
        </p>
        <div className="flex gap-6 text-sm font-medium text-zinc-500">
          <div className="flex flex-col items-center">
            <span className="text-xl text-white font-bold">{playlists?.length || 0}</span>
            <span>Playlists</span>
          </div>
        </div>
      </div>

      {/* Playlists Grid */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Public Playlists</h2>
      </div>

      {!playlists || playlists.length === 0 ? (
        <div className="text-center py-20 bg-surface/30 rounded-2xl border border-white/5">
          <Film className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No public curations</h3>
          <p className="text-zinc-400">@{profile.username} hasn't shared any playlists publicly yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <div 
              key={playlist.id}
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
                  <span className="text-xs text-zinc-500 font-medium flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5" />
                    {playlist.movies?.length || 0} movies
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
