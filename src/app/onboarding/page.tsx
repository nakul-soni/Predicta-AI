"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Globe, Newspaper, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { id: "en", name: "English", flag: "🇺🇸" },
  { id: "es", name: "Spanish", flag: "🇪🇸" },
  { id: "fr", name: "French", flag: "🇫🇷" },
  { id: "de", name: "German", flag: "🇩🇪" },
  { id: "zh", name: "Mandarin", flag: "🇨🇳" },
  { id: "ja", name: "Japanese", flag: "🇯🇵" },
  { id: "ar", name: "Arabic", flag: "🇸🇦" },
  { id: "pt", name: "Portuguese", flag: "🇧🇷" },
];

const interests = [
  { id: "macro", name: "Macro Economics", icon: "📈" },
  { id: "crypto", name: "Cryptocurrency", icon: "🪙" },
  { id: "stocks", name: "Stock Market", icon: "📊" },
  { id: "ai", name: "Artificial Intelligence", icon: "🤖" },
  { id: "energy", name: "Energy & Commodities", icon: "🛢️" },
  { id: "tech", name: "Tech Industry", icon: "💻" },
  { id: "geo", name: "Geopolitics", icon: "🌍" },
  { id: "esg", name: "ESG & Sustainability", icon: "🌱" },
  { id: "startup", name: "Startups & VC", icon: "🚀" },
  { id: "forex", name: "Forex", icon: "💱" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleLanguage = (id: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      // Finish onboarding
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-12">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400">
            Step {step} of 2
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {step === 1 ? "Choose your languages" : "Select your interests"}
          </h1>
          <p className="text-zinc-500 max-w-md">
            {step === 1 
              ? "We'll translate financial news and reports into your preferred languages." 
              : "Tell us what you're tracking so we can personalize your AI insights."}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {step === 1 ? (
            languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => toggleLanguage(lang.id)}
                className={cn(
                  "relative group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200",
                  selectedLanguages.includes(lang.id)
                    ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                )}
              >
                <span className="text-4xl">{lang.flag}</span>
                <span className="font-semibold text-sm">{lang.name}</span>
                {selectedLanguages.includes(lang.id) && (
                  <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>
            ))
          ) : (
            interests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={cn(
                  "relative group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 aspect-square",
                  selectedInterests.includes(interest.id)
                    ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                )}
              >
                <span className="text-4xl">{interest.icon}</span>
                <span className="font-semibold text-xs text-center">{interest.name}</span>
                {selectedInterests.includes(interest.id) && (
                  <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        <div className="flex justify-center pt-8">
          <Button 
            onClick={handleNext}
            disabled={step === 1 ? selectedLanguages.length === 0 : selectedInterests.length === 0}
            className="h-14 px-12 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-lg flex items-center gap-2 transition-transform active:scale-95"
          >
            {step === 1 ? "Next Step" : "Get Started"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
