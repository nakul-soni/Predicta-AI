"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, User, Shield, Briefcase } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    // Mock validation
    if (!email || !password || !fullName || !role) {
      setError("Please fill in all fields and select a role");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For mock auth, we'll just redirect to onboarding
      router.push("/onboarding");
    }, 1000);
  }

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Join Predicta to start your financial intelligence journey"
    >
      <div className="grid gap-6">
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName" className="text-zinc-400">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                disabled={isLoading}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-zinc-400">Email address</Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-zinc-400">Professional Role</Label>
              <Select onValueChange={setRole} disabled={isLoading}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white focus:ring-primary">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="investor" className="focus:bg-zinc-800 focus:text-white">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-primary" />
                      <span>Investor</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="analyst" className="focus:bg-zinc-800 focus:text-white">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-primary" />
                      <span>Government Analyst</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="corporate" className="focus:bg-zinc-800 focus:text-white">
                    <div className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-primary" />
                      <span>Corporate User</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" title="Password" className="text-zinc-400">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                disabled={isLoading}
                className="bg-zinc-900 border-zinc-800 text-white focus:ring-primary"
              />
            </div>
            {error && (
              <p className="text-xs font-medium text-red-500">{error}</p>
            )}
            <Button disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
          </div>
        </div>
        <Button variant="outline" type="button" disabled={isLoading} className="border-zinc-800 hover:bg-zinc-900 text-zinc-300">
          <Chrome className="mr-2 h-4 w-4" />
          Google
        </Button>
        <p className="text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="text-primary hover:underline underline-offset-4 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
