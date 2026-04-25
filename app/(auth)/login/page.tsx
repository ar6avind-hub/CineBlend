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
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            avatar_url: selectedAvatar,
          },
          // Keep the redirect URL just in case they click the link instead of using the code
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setStep("OTP");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        // Successful login!
        router.push("/explore");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred.");
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
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to CineBlend</h1>
          <p className="text-zinc-400 text-sm">
            {step === "EMAIL" ? "Sign in or Create an Account" : "Enter Verification Code"}
          </p>
        </div>

        {step === "OTP" ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-center mb-6">
              <p className="text-sm text-zinc-300">
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">6-Digit Code</label>
              <input 
                type="text" 
                required 
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-lg h-12 px-4 text-white focus:ring-1 focus:ring-accent focus:border-accent transition-colors outline-none text-center text-xl tracking-[0.5em] font-mono"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            {errorMsg && (
              <p className="text-red-400 text-sm">{errorMsg}</p>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading || otp.length !== 6}
              className="w-full h-12 bg-white text-black font-bold rounded-lg mt-6 hover:bg-zinc-200 transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </button>
            
            <button 
              type="button"
              onClick={() => setStep("EMAIL")}
              className="w-full text-zinc-500 text-sm hover:text-white transition-colors mt-4"
            >
              Use a different email
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendOtp} className="space-y-4">
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

            {errorMsg && (
              <p className="text-red-400 text-sm">{errorMsg}</p>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading || !email}
              className="w-full h-12 bg-white text-black font-bold rounded-lg mt-6 hover:bg-zinc-200 transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? "Sending Code..." : "Send Login Code"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
