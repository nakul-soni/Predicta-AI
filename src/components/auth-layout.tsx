"use client";

import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 md:p-8">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-2">
            <img 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1768051423232.png?width=8000&height=8000&resize=contain" 
              alt="Predicta Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
            <p className="text-sm text-zinc-500">{subtitle}</p>
          </div>
        </div>
        
        <div className="bb-card rounded-xl p-6 shadow-2xl">
          {children}
        </div>

        <p className="text-center text-xs text-zinc-600">
          By continuing, you agree to Predicta's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
