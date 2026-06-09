"use client";

import { useState } from "react";
import { Loader2, Atom, Check, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

interface RegisterScreenProps {
  onNavigateToLogin?: () => void;
  onRegisterSuccess?: () => void;
}

export default function RegisterScreen({ onNavigateToLogin, onRegisterSuccess }: RegisterScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  });

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(password);
  const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  const validateForm = () => {
    const newErrors = {
      email: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    };

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!displayName) {
      newErrors.displayName = "Display name is required";
    } else if (displayName.length < 2) {
      newErrors.displayName = "Display name must be at least 2 characters";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Register:", { email, displayName, password });
    setIsLoading(false);
    if (onRegisterSuccess) {
      onRegisterSuccess();
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Google register");
    setIsGoogleLoading(false);
    if (onRegisterSuccess) {
      onRegisterSuccess();
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzY2llbnRpZmljJTIwcmVzZWFyY2glMjBkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGFuYWx5dGljc3xlbnwxfHx8fDE3ODA5MzUwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-[0.07]"></div>

        <div className="relative z-10 flex flex-col justify-between py-12 px-16 xl:px-24 w-full">
          {/* Logo at top */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Atom className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-bold text-gray-900 tracking-tight">SciLab</span>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <div className="inline-block">
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg backdrop-blur-sm border border-primary/20">
                <span className="text-sm font-medium">Research Intelligence Platform</span>
              </div>
            </div>

            <h1 className="text-5xl xl:text-6xl font-semibold text-gray-900 leading-tight">
              Unlock Scientific
              <br />
              Publication Insights
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Track emerging research trends, discover breakthrough papers, and stay ahead in your field with AI-powered analytics.
            </p>

            <div className="pt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Real-time Trend Analysis</h3>
                  <p className="text-gray-600 mt-1">Monitor publication patterns across 50M+ research papers</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AI-Powered Discovery</h3>
                  <p className="text-gray-600 mt-1">Uncover hidden connections and emerging research areas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200/50">
            <div>
              <div className="text-3xl font-bold text-gray-900">50M+</div>
              <div className="text-sm text-gray-600 mt-1">Research Papers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600 mt-1">Active Researchers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600 mt-1">Universities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Card */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50/50 lg:px-12">
        <div className="w-full max-w-[580px]">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Atom className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <span className="text-3xl font-bold text-gray-900 tracking-tight">SciLab</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Create Your SciLab Account</h2>
              <p className="text-gray-500 text-lg max-w-sm mx-auto">Join researchers and academics discovering publication trends.</p>
            </div>
          </div>

          <Card className="shadow-[0_8px_40px_rgb(0,0,0,0.08)] border-gray-200/50 rounded-3xl bg-white/95 backdrop-blur-xl">
            <CardHeader className="border-b border-gray-100 pb-8 pt-10 px-8 sm:px-12">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@university.edu"
                    className={`h-12 px-4 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    disabled={isLoading || isGoogleLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Dr. Jane Smith"
                    className={`h-12 px-4 ${errors.displayName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      if (errors.displayName) setErrors({ ...errors, displayName: "" });
                    }}
                    disabled={isLoading || isGoogleLoading}
                  />
                  {errors.displayName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.displayName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    className={`h-12 px-4 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    disabled={isLoading || isGoogleLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}

                  {password && !errors.password && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              i < passwordStrength ? strengthColor[passwordStrength - 1] : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-sm flex items-center gap-1 ${
                        passwordStrength >= 4 ? "text-green-600" : passwordStrength >= 3 ? "text-blue-600" : passwordStrength >= 2 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {passwordStrength >= 4 ? <Check className="w-4 h-4" /> : null}
                        Password strength: {strengthText[passwordStrength] || "Very Weak"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    className={`h-12 px-4 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                    }}
                    disabled={isLoading || isGoogleLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                  {confirmPassword && !errors.confirmPassword && password === confirmPassword && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Passwords match
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            </CardHeader>

            <CardContent className="px-8 sm:px-12 pt-6 pb-10">
              <div className="space-y-5">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 text-base font-medium border-gray-300 hover:bg-gray-50 transition-colors"
                  onClick={handleGoogleRegister}
                  disabled={isLoading || isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>

                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={onNavigateToLogin}
                      className="text-primary hover:text-primary/80 transition-colors font-medium"
                      disabled={isLoading || isGoogleLoading}
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
