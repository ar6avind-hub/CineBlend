"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface PlaylistCardProps {
  id: string;
  title: string;
  movieCount: number;
  curator: { username: string; avatar: string };
  coverUrl: string;
}

export default function PlaylistCard({ id, title, movieCount, curator, coverUrl }: PlaylistCardProps) {
  return (
    <Link href={`/playlist/${id}`} className="block">
      <motion.div 
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group relative flex flex-col gap-3 cursor-pointer"
      >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-light border border-white/5 shadow-2xl">
        <img 
          src={coverUrl} 
          alt={title} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-4">
          <div className="flex items-center gap-2 backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
            <span className="text-white/90 text-xs font-semibold tracking-wide">
              {movieCount} Films
            </span>
          </div>
        </div>
        
        {/* Play Button Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-accent/90 text-black w-12 h-12 rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <div className="px-1">
        <h3 className="text-foreground font-bold text-lg leading-snug group-hover:text-accent transition-colors truncate">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <img src={curator.avatar} alt={curator.username} className="w-5 h-5 rounded-full bg-surface-light" />
          <p className="text-zinc-400 text-sm font-medium">@{curator.username}</p>
        </div>
      </div>
      </motion.div>
    </Link>
  );
}
