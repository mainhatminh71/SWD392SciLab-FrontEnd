"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import {
  AlertCircle,
  Atom,
  BarChart3,
  Check,
  FlaskConical,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { registerAccount } from "@/features/auth/api/register.api";
import {
  getAuthErrorMessage,
  getAuthFieldErrors,
} from "@/features/auth/api/auth-errors";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { routes } from "@/shared/constants/routes";
import {
  type RegisterFormValues,
  validateRegisterForm,
} from "@/shared/schemas/register.schema";

interface RegisterScreenProps {
  onNavigateToLogin?: () => void;
  onRegisterSuccess?: () => void;
}

const defaultValues: RegisterFormValues = {
  email: "",
  displayName: "",
  password: "",
  confirmPassword: "",
};

const strengthText = ["Very weak", "Weak", "Fair", "Good", "Strong"];
const strengthColor = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-sky-500",
  "bg-emerald-500",
];

function calculatePasswordStrength(password: string) {
  return [
    password.length >= 8,
    password.length >= 12,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^a-zA-Z\d]/.test(password),
  ].filter(Boolean).length;
}

export default function RegisterScreen({
  onNavigateToLogin,
  onRegisterSuccess,
}: RegisterScreenProps) {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const {
    formState: { errors, isSubmitting },
    clearErrors,
    handleSubmit,
    register,
    setError,
    control,
  } = useForm<RegisterFormValues>({ defaultValues, mode: "onBlur" });

  const password = useWatch({ control, name: "password" }) ?? "";
  const confirmPassword = useWatch({ control, name: "confirmPassword" }) ?? "";
  const passwordStrength = calculatePasswordStrength(password);
  const isBusy = isSubmitting || isGoogleLoading;
  const passwordStatus =
    password && !errors.password
      ? `Password strength: ${strengthText[passwordStrength - 1] ?? "Very weak"}`
      : "";

  const navigateToLogin = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
      return;
    }

    router.push(routes.auth.login);
  };

  const onSubmit = handleSubmit(async (values) => {
    clearErrors();
    setGlobalError("");
    setStatusMessage("Creating your SciLab account.");

    const validationErrors = validateRegisterForm(values);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field as keyof RegisterFormValues, { message });
      });
      setStatusMessage("Please fix the highlighted fields.");
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      await registerAccount(values);
      setStatusMessage("Account created. Opening your dashboard.");
      toast.success("SciLab account created.");

      if (onRegisterSuccess) {
        onRegisterSuccess();
      } else {
        router.push(routes.student.dashboard);
      }
    } catch (error) {
      const fieldErrors = getAuthFieldErrors(error);
      Object.entries(fieldErrors).forEach(([field, message]) => {
        setError(field as keyof RegisterFormValues, { message });
      });

      const message = getAuthErrorMessage(error);
      setGlobalError(message);
      setStatusMessage(message);
      toast.error(message);
    }
  });

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    setGlobalError("");
    setStatusMessage("Google registration is waiting for backend support.");

    await new Promise((resolve) => setTimeout(resolve, 500));

    const message =
      "Google registration is pending backend integration. Please create an account with email for now.";
    setGlobalError(message);
    setStatusMessage(message);
    toast.info("Google registration is pending backend integration.");
    setIsGoogleLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f5ef] text-slate-950 lg:flex">
      <aside className="hidden lg:flex lg:w-1/2">
        <div className="relative flex w-full flex-col justify-between overflow-hidden bg-[#263238] px-16 py-12 text-white xl:px-24">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#263238] via-[#37474f]/95 to-[#6d4c41]/90" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-300 text-slate-950 shadow-lg shadow-black/20">
              <Atom className="h-7 w-7" strokeWidth={2.3} />
            </div>
            <span className="text-3xl font-bold tracking-tight">SciLab</span>
          </div>

          <div className="relative max-w-xl space-y-7">
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-amber-100">
              <FlaskConical className="h-4 w-4" />
              Metadata and trend tracking
            </div>

            <h1 className="text-5xl font-semibold leading-tight xl:text-6xl">
              Create your research workspace
            </h1>

            <p className="max-w-lg text-xl leading-relaxed text-slate-100">
              Follow journals, bookmark publication metadata, and compare topic
              trends from one SciLab account.
            </p>

            <div className="grid gap-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-300/15 text-emerald-100">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Trend analysis</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-200">
                    Compare publication patterns by keyword, topic, and year.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-300/15 text-sky-100">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Saved discovery</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-200">
                    Keep useful journals and articles close for dashboard review.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-3 gap-5 border-t border-white/15 pt-7 text-sm text-slate-200">
            <div>Journal search</div>
            <div>Article bookmarks</div>
            <div>Role-aware access</div>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-[560px]">
          <div className="mb-8 text-center">
            <div className="mb-6 inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-amber-200 shadow-lg shadow-slate-900/15">
                <Atom className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <span className="text-3xl font-bold tracking-tight">SciLab</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Create your account
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-slate-600">
              Start tracking publication metadata and research trends.
            </p>
          </div>

          <Card className="rounded-lg border-slate-200 bg-white shadow-[0_16px_50px_rgb(15,23,42,0.10)]">
            <CardHeader className="border-b border-slate-100 px-6 py-7 sm:px-10">
              {globalError ? (
                <Alert
                  variant="destructive"
                  className="mb-5"
                  aria-live="polite"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Registration issue</AlertTitle>
                  <AlertDescription>{globalError}</AlertDescription>
                </Alert>
              ) : null}

              <form onSubmit={onSubmit} className="space-y-5" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@university.edu"
                    className="h-12 px-4"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    disabled={isBusy}
                    {...register("email", {
                      onChange: () => {
                        clearErrors("email");
                        setGlobalError("");
                      },
                    })}
                  />
                  {errors.email ? (
                    <p
                      id="email-error"
                      className="flex items-center gap-1 text-sm text-red-600"
                    >
                      <X className="h-4 w-4" />
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Smith"
                    className="h-12 px-4"
                    aria-invalid={!!errors.displayName}
                    aria-describedby={
                      errors.displayName ? "displayName-error" : undefined
                    }
                    disabled={isBusy}
                    {...register("displayName", {
                      onChange: () => {
                        clearErrors("displayName");
                        setGlobalError("");
                      },
                    })}
                  />
                  {errors.displayName ? (
                    <p
                      id="displayName-error"
                      className="flex items-center gap-1 text-sm text-red-600"
                    >
                      <X className="h-4 w-4" />
                      {errors.displayName.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    className="h-12 px-4"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : "password-status"
                    }
                    disabled={isBusy}
                    {...register("password", {
                      onChange: () => {
                        clearErrors("password");
                        setGlobalError("");
                      },
                    })}
                  />
                  {errors.password ? (
                    <p
                      id="password-error"
                      className="flex items-center gap-1 text-sm text-red-600"
                    >
                      <X className="h-4 w-4" />
                      {errors.password.message}
                    </p>
                  ) : null}

                  {password && !errors.password ? (
                    <div className="space-y-2">
                      <div className="flex gap-1" aria-hidden="true">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div
                            key={index}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              index < passwordStrength
                                ? strengthColor[passwordStrength - 1]
                                : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        id="password-status"
                        className="flex items-center gap-1 text-sm text-slate-600"
                      >
                        {passwordStrength >= 4 ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : null}
                        {passwordStatus}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    className="h-12 px-4"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={
                      errors.confirmPassword
                        ? "confirmPassword-error"
                        : "confirmPassword-status"
                    }
                    disabled={isBusy}
                    {...register("confirmPassword", {
                      onChange: () => {
                        clearErrors("confirmPassword");
                        setGlobalError("");
                      },
                    })}
                  />
                  {errors.confirmPassword ? (
                    <p
                      id="confirmPassword-error"
                      className="flex items-center gap-1 text-sm text-red-600"
                    >
                      <X className="h-4 w-4" />
                      {errors.confirmPassword.message}
                    </p>
                  ) : null}
                  {confirmPassword &&
                  !errors.confirmPassword &&
                  password === confirmPassword ? (
                    <p
                      id="confirmPassword-status"
                      className="flex items-center gap-1 text-sm text-emerald-700"
                    >
                      <Check className="h-4 w-4" />
                      Passwords match.
                    </p>
                  ) : null}
                </div>

                <div aria-live="polite" className="sr-only">
                  {statusMessage}
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full text-base font-medium shadow-md shadow-slate-900/10"
                  disabled={isBusy}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </CardHeader>

            <CardContent className="px-6 py-7 sm:px-10">
              <div className="space-y-5">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 font-medium text-slate-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full text-base font-medium"
                  onClick={handleGoogleRegister}
                  disabled={isBusy}
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting
                    </>
                  ) : (
                    <>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border text-xs font-semibold text-slate-700">
                        G
                      </span>
                      Continue with Google
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={navigateToLogin}
                    className="font-medium text-slate-950 underline-offset-4 transition-colors hover:text-amber-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30"
                    disabled={isBusy}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm leading-6 text-slate-500">
            By creating an account, you agree to SciLab access policies for
            research metadata and dashboard features.
          </p>
        </div>
      </main>
    </div>
  );
}
