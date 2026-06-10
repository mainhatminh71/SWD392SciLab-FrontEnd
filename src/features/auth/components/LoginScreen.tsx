"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Atom, Shield } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import RegisterScreen from "@/features/auth/components/RegisterScreen";
import { routes } from "@/shared/constants/routes";

export default function LoginScreen() {
  const router = useRouter();
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Login:", { email, password, rememberMe });
    setIsLoading(false);
    router.push(routes.student.dashboard);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Google login");
    setIsGoogleLoading(false);
    router.push(routes.student.dashboard);
  };

  const handleAdminLogin = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Admin login");
    setIsLoading(false);
    router.push("/admin/users");
  };

  if (showRegister) {
    return (
      <RegisterScreen
        onNavigateToLogin={() => setShowRegister(false)}
        onRegisterSuccess={() => router.push(routes.student.dashboard)}
      />
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left — editorial hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-raised border-r border-border">
        <div className="flex flex-col justify-between py-12 px-16 xl:px-24 w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-[var(--radius-card)] flex items-center justify-center">
              <Atom className="w-6 h-6 text-primary-foreground" strokeWidth={1.75} />
            </div>
            <span className="font-heading text-2xl text-foreground">ScholarTrend</span>
          </div>

          <div className="space-y-8 max-w-lg">
            <span className="inline-block rounded-[var(--radius-input)] bg-accent px-4 py-2 text-sm text-accent-foreground">
              Research Intelligence Platform
            </span>

            <h1 className="font-heading text-5xl xl:text-6xl text-foreground leading-tight">
              Unlock Scientific
              <br />
              Publication Insights
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Track emerging research trends, discover breakthrough papers, and stay
              ahead in your field with calm, focused analytics.
            </p>

            <div className="space-y-6 pt-4">
              {[
                {
                  title: "Real-time Trend Analysis",
                  desc: "Monitor publication patterns across 50M+ research papers",
                },
                {
                  title: "AI-Powered Discovery",
                  desc: "Uncover hidden connections and emerging research areas",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[var(--radius-card)] bg-accent flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
            {[
              { value: "50M+", label: "Research Papers" },
              { value: "10K+", label: "Active Researchers" },
              { value: "500+", label: "Universities" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-heading text-3xl text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-[480px]">
          <div className="mb-10 flex flex-col items-center text-center lg:hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-[var(--radius-card)] flex items-center justify-center">
                <Atom className="w-5 h-5 text-primary-foreground" strokeWidth={1.75} />
              </div>
              <span className="font-heading text-2xl text-foreground">ScholarTrend</span>
            </div>
          </div>

          <div className="mb-8 space-y-2 text-center">
            <h2 className="font-heading text-4xl text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground">
              Track scientific publication trends and discover research insights.
            </p>
          </div>

          <Card>
            <CardHeader className="border-b border-border/60 pb-8 pt-8 px-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@university.edu"
                    className="h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={isLoading || isGoogleLoading}
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-tag hover:underline font-medium"
                    disabled={isLoading || isGoogleLoading}
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardHeader>

            <CardContent className="px-8 pt-6 pb-8 space-y-5">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  "Continue with Google"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push(routes.auth.register)}
                  className="text-tag hover:underline font-medium"
                  disabled={isLoading || isGoogleLoading}
                >
                  Create Account
                </button>
              </p>

              <Button
                type="button"
                variant="secondary"
                className="w-full h-11"
                onClick={handleAdminLogin}
                disabled={isLoading || isGoogleLoading}
              >
                <Shield className="w-4 h-4" strokeWidth={1.75} />
                Admin Login
              </Button>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="#" className="text-tag hover:underline">Terms of Service</a> and{" "}
            <a href="#" className="text-tag hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
