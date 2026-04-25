import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data } = await supabase.from('playlists').select('title, description, cover_url').eq('id', params.id).single();
  
  if (!data) return { title: 'Playlist Not Found | CineBlend' };
  
  const title = `${data.title} | CineBlend`;
  const description = data.description || "Check out this curated movie playlist on CineBlend!";
  const image = data.cover_url || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      siteName: "CineBlend",
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    }
  };
}

export default function PlaylistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
