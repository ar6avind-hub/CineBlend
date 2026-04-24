"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // In actual implementation: await supabase.auth.signUp({ email, password, options: { data: { username } } })
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface-light border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create an Account</h1>
          <p className="text-zinc-400 text-sm">Join CineBlend to start curating</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Username</label>
            <input 
              type="text" 
              required 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg h-12 px-4 text-white focus:ring-1 focus:ring-accent focus:border-accent transition-colors outline-none"
              placeholder="cinephile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg h-12 px-4 text-white focus:ring-1 focus:ring-accent focus:border-accent transition-colors outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg h-12 px-4 text-white focus:ring-1 focus:ring-accent focus:border-accent transition-colors outline-none"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-accent text-black font-bold rounded-lg mt-6 hover:bg-accent/80 transition-colors flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          Already have an account? <a href="/login" className="text-white font-medium hover:underline">Sign In</a>
        </div>
      </motion.div>
    </div>
  );
}
