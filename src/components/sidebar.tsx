"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  BrainCircuit, 
  Settings, 
  TrendingUp, 
  Globe, 
  Briefcase,
  Search,
  LogOut,
  ShieldAlert,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Markets", href: "/market", icon: BarChart3 },
  { name: "AI Insights", href: "/ai", icon: BrainCircuit },
  { name: "Predictions", href: "/predictions", icon: Brain },
  { name: "Risk Analysis", href: "/risk", icon: ShieldAlert },
  { name: "Live Global Feed", href: "/global", icon: Globe },
  { name: "Portfolio", href: "/portfolio", icon: Briefcase },
  { name: "Trending", href: "/trending", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Settings },
];

const logoUrl = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1768051423232.png?width=8000&height=8000&resize=contain";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="flex h-full w-64 flex-col bb-bg bb-border border-r">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg">
            <Image
              src={logoUrl}
              alt="Predicta Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Predicta</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-4 px-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search markets..."
              className="w-full rounded-md bg-zinc-900 py-2 pl-9 pr-4 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-700"
            />
          </div>
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="bb-border border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">John Doe</p>
            <p className="truncate text-xs text-zinc-500">Premium Account</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
