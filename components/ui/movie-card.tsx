"use client";

import { motion } from "framer-motion";

interface MovieCardProps {
  title: string;
  year: number;
  poster: string;
  note: string;
}

export default function MovieCard({ title, year, poster, note }: MovieCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row gap-6 p-4 rounded-xl hover:bg-surface-light/50 transition-colors border border-transparent hover:border-white/5"
    >
      <div className="flex-shrink-0 w-24 md:w-32 rounded-lg overflow-hidden shadow-lg border border-white/5 relative aspect-[2/3]">
        <img src={poster} alt={title} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex flex-col py-2">
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <span className="text-zinc-500 font-medium text-sm">({year})</span>
        </div>
        
        <div className="mt-3 relative">
          <div className="absolute -left-3 top-0 bottom-0 w-1 bg-accent/20 rounded-full"></div>
          <p className="text-zinc-300 text-base leading-relaxed italic pr-4">
            &quot;{note}&quot;
          </p>
        </div>
        <div className="mt-auto pt-4 flex gap-3">
          <button className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
