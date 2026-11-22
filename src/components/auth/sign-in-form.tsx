
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

import {
  AuthDivider,
  SocialAuthButtons,
  type SocialProvider,
} from "@/components/auth/social-auth-buttons";

interface SignInValues {
  email: string;
  password: string;
  remember: boolean;
}

type SignInErrors = Partial<Record<keyof SignInValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignInForm() {
  const router = useRouter();

  const [values, setValues] = React.useState<SignInValues>({
    email: "",
    password: "",
    remember: true,
  });

  const [errors, setErrors] = React.useState<SignInErrors>({});
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSocialSubmitting, setIsSocialSubmitting] =
    React.useState(false);

  function update<K extends keyof SignInValues>(
    key: K,
    value: SignInValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) =>
      prev[key] ? { ...prev, [key]: undefined } : prev,
    );
  }

  function validate(): SignInErrors {
    const next: SignInErrors = {};
    const email = values.email.trim();

    if (!email) {
      next.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(email)) {
      next.email = "Enter a valid email address.";
    }

    if (!values.password) {
      next.password = "Password is required.";
    }

    return next;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);

      const { data, error } = await authClient.signIn.email({
        email: values.email.trim(),
        password: values.password,
        rememberMe: values.remember,
        callbackURL: "/",
      });
      console.log("SIGN IN RESPONSE:",{ data, error });

      if (error) {
        toast.error("Sign in failed", {
          description:
            error.message || "Please check your email and password.",
        });
        return;
      
      }

      if (data) {
        toast.success("Welcome back!", {
          description: "You have signed in successfully.",
        });

        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Sign in error:", error);

      toast.error("Something went wrong!", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to sign in. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  

  async function handleSocialClick(provider: SocialProvider) {
    try {
      setIsSocialSubmitting(true);

      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error("Social sign in failed", {
          description:
            error.message || "Please try again.",
        });
        setIsSocialSubmitting(false);
      }
    } catch (error) {
      console.error("Social sign in error:", error);

      toast.error("Social sign in failed", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to sign in with this provider.",
      });

      setIsSocialSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#142B45]">
          Welcome back
        </h1>

        <p className="text-sm text-[#64748B]">
          Sign in to your Rentora account to continue.
        </p>
      </div>

      <SocialAuthButtons
        onProviderClick={handleSocialClick}
      />

      <AuthDivider label="or continue with email" />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="signin-email"
            className="text-sm font-medium text-[#334155]"
          >
            Email address
          </Label>

          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]"
            />

            <Input
              id="signin-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={(event) =>
                update("email", event.target.value)
              }
              aria-invalid={!!errors.email}
              className="h-11 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] pl-9 focus-visible:border-[#16A37A] focus-visible:ring-[#16A37A]/25"
            />
          </div>

          {errors.email && (
            <p
              role="alert"
              className="text-xs font-medium text-[#DC2626]"
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* Password make */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="signin-password"
              className="text-sm font-medium text-[#334155]"
            >
              Password
            </Label>

            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[#16A37A] transition-colors hover:text-[#128A66]"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Lock
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]"
            />

            <Input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={values.password}
              onChange={(event) =>
                update("password", event.target.value)
              }
              aria-invalid={!!errors.password}
              className="h-11 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] pr-11 pl-9 focus-visible:border-[#16A37A] focus-visible:ring-[#16A37A]/25"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-[#94A3B8] transition-colors hover:text-[#334155]"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p
              role="alert"
              className="text-xs font-medium text-[#DC2626]"
            >
              {errors.password}
            </p>
          )}
        </div>

       
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#334155]">
          <Checkbox
            checked={values.remember}
            onCheckedChange={(checked) =>
              update("remember", checked === true)
            }
            className="border-[#CBD5E1] data-checked:border-[#16A37A] data-checked:bg-[#16A37A]"
          />

          Remember me for 30 days
        </label>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting || isSocialSubmitting}
          className="h-11 w-full rounded-xl bg-[#142B45] text-sm font-semibold text-white hover:bg-[#142B45]/90"
        >
          {isSubmitting ? (
            <>
              <Spinner className="size-4" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-[#64748B]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#16A37A] transition-colors hover:text-[#128A66]"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
