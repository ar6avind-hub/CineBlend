"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PRESET_AVATARS = [
  "https://api.dicebear.com/8.x/notionists/svg?seed=Felix",
  "https://api.dicebear.com/8.x/notionists/svg?seed=Aneka",
  "https://api.dicebear.com/8.x/notionists/svg?seed=Jasper",
  "https://api.dicebear.com/8.x/notionists/svg?seed=Luna",
];

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (isLogin) {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      } else {
        // Create Account
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split("@")[0],
              avatar_url: selectedAvatar,
            },
          },
        });

        if (error) throw error;
      }

      // Successful login/signup
      router.push("/explore");
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface-light border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className="text-zinc-400 text-sm">
            {isLogin ? "Sign in to continue curating" : "Join CineBlend today"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {/* Only show Avatar and Username on Registration */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Choose an Avatar</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {PRESET_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                        selectedAvatar === avatar ? "border-accent scale-110" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-full bg-surface" />
                    </button>
                  ))}
                  
                  {/* Custom Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed transition-all ${
                      !PRESET_AVATARS.includes(selectedAvatar) ? "border-accent text-accent" : "border-white/20 text-zinc-400 hover:border-white/50"
                    }`}
                  >
                    {!PRESET_AVATARS.includes(selectedAvatar) ? (
                      <img src={selectedAvatar} alt="Custom" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Username</label>
                <input 
                  type="text" 
                  required={!isLogin}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-lg h-12 px-4 text-white focus:ring-1 focus:ring-accent focus:border-accent transition-colors outline-none"
                  placeholder="cinephile"
                />
              </div>
            </>
          )}

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
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg h-12 px-4 text-white focus:ring-1 focus:ring-accent focus:border-accent transition-colors outline-none"
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <p className="text-red-400 text-sm">{errorMsg}</p>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading || !email || !password || (!isLogin && !username)}
            className="w-full h-12 bg-white text-black font-bold rounded-lg mt-6 hover:bg-zinc-200 transition-colors flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg("");
            }}
            className="text-white font-medium hover:underline"
          >
            {isLogin ? "Create one" : "Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
