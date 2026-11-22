
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Image as ImageIcon,
  Lock,
  Mail,
  User,
  X,
} from "lucide-react";

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

import { toast } from "sonner";

interface SignUpValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
}

type SignUpErrors = Partial<Record<keyof SignUpValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export function SignUpForm() {
  const router = useRouter();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [values, setValues] = React.useState<SignUpValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState("");
  const [imageError, setImageError] = React.useState("");

  const [errors, setErrors] = React.useState<SignUpErrors>({});
  const [submitError, setSubmitError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  
  React.useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

  function update<K extends keyof SignUpValues>(
    key: K,
    value: SignUpValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) =>
      prev[key] ? { ...prev, [key]: undefined } : prev,
    );

    setSubmitError("");
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    setImageError("");
    setSubmitError("");

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setSelectedImage(null);
      event.target.value = "";
      setImageError("Only JPG, PNG, WEBP and GIF images are allowed.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setSelectedImage(null);
      event.target.value = "";
      setImageError("Image size must be less than 5 MB.");
      return;
    }

    setSelectedImage(file);
  }

  function removeImage() {
    setSelectedImage(null);
    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function validate(): SignUpErrors {
    const next: SignUpErrors = {};

    const name = values.name.trim();
    const email = values.email.trim();

    if (!name) {
      next.name = "Full name is required.";
    } else if (name.length < 2) {
      next.name = "Name must be at least 2 characters.";
    }

    if (!email) {
      next.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(email)) {
      next.email = "Enter a valid email address.";
    }

    if (!values.password) {
      next.password = "Password is required.";
    } else if (values.password.length < MIN_PASSWORD_LENGTH) {
      next.password = "Password must be at least 8 characters.";
    }

    if (!values.confirmPassword) {
      next.confirmPassword = "Please confirm your password.";
    } else if (values.confirmPassword !== values.password) {
      next.confirmPassword = "Passwords do not match.";
    }

    if (!values.agreed) {
      next.agreed = "You must accept the terms to continue.";
    }

    return next;
  }

  async function uploadProfileImage(): Promise<string | undefined> {
    if (!selectedImage) return undefined;

    const formData = new FormData();
    formData.append("image", selectedImage);

    const response = await fetch(
      `${API_URL}/api/uploads/profile-image`,
      {
        method: "POST",
        body: formData,
      },
    );

    const result: {
      success?: boolean;
      message?: string;
      data?: {
        image?: string;
      };
    } = await response.json();

    if (!response.ok || !result.success || !result.data?.image) {
      throw new Error(result.message || "Profile image upload failed.");
    }

    return result.data.image;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextErrors = validate();

    setErrors(nextErrors);
    setSubmitError("");

    if (imageError) return;

    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);

      // Step 1: Upload image to Cloudinary (only if selected).
      let imageUrl: string | undefined;

      if (selectedImage) {
        imageUrl = await uploadProfileImage();
      }

      // Step 2: Create account using the Cloudinary image URL.
      const { data, error } = await authClient.signUp.email({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        image: imageUrl,
        callbackURL: "/",
      });

      if (error) {
        toast.error("Signup failed", {
          description: error.message || "Please try again.",
        });
        return;
      }

      if (data) {
        toast.success("Account created successfully!", {
          description: "Welcome to Rentora!",
        });

        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Signup error:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSocialClick(provider: SocialProvider) {
    setSubmitError("");

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        setSubmitError(
          error.message || "Social sign-up failed. Please try again.",
        );
      }
    } catch (error) {
      console.error("Social signup error:", error);
      setSubmitError("Unable to sign up with this provider.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#142B45]">
          Create your account
        </h1>

        <p className="text-sm text-[#64748B]">
          Join Rentora as a customer or equipment owner — it only takes a
          minute.
        </p>
      </div>

      <SocialAuthButtons onProviderClick={handleSocialClick} />

      <AuthDivider label="or sign up with email" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-name" className="text-sm font-medium text-[#334155]">
            Full name
          </Label>

          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />

            <Input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              aria-invalid={!!errors.name}
              className="h-11 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] pl-9 focus-visible:border-[#16A37A]"
            />
          </div>

          {errors.name && (
            <p className="text-xs font-medium text-[#DC2626]" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-email" className="text-sm font-medium text-[#334155]">
            Email address
          </Label>

          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />

            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              aria-invalid={!!errors.email}
              className="h-11 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] pl-9 focus-visible:border-[#16A37A]"
            />
          </div>

          {errors.email && (
            <p className="text-xs font-medium text-[#DC2626]" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Profile Image */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-image" className="text-sm font-medium text-[#334155]">
            Profile image{" "}
            <span className="font-normal text-[#94A3B8]">(optional)</span>
          </Label>

          <div className="flex items-center gap-3">
            {previewUrl ? (
              <div className="relative size-16 shrink-0">
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="size-16 rounded-full border border-[#E2E8F0] object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  aria-label="Remove selected image"
                  className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white"
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-dashed border-[#CBD5E1] bg-[#F8FAFC]">
                <ImageIcon className="size-6 text-[#94A3B8]" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <Input
                ref={fileInputRef}
                id="signup-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                aria-invalid={!!imageError}
                className="h-11 cursor-pointer rounded-xl border-[#E2E8F0] bg-[#F8FAFC] text-xs file:mr-3 file:rounded-md file:border-0 file:bg-[#142B45] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
              />

              <p className="mt-1 text-xs text-[#94A3B8]">
                JPG, PNG, WEBP or GIF. Maximum 5 MB.
              </p>
            </div>
          </div>

          {selectedImage && (
            <p className="text-xs text-[#16A37A]">
              Selected: {selectedImage.name}
            </p>
          )}

          {imageError && (
            <p className="text-xs font-medium text-[#DC2626]" role="alert">
              {imageError}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-password" className="text-sm font-medium text-[#334155]">
            Password
          </Label>

          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />

            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={values.password}
              onChange={(event) => update("password", event.target.value)}
              aria-invalid={!!errors.password}
              className="h-11 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] pr-11 pl-9 focus-visible:border-[#16A37A]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-[#94A3B8]"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {errors.password ? (
            <p className="text-xs font-medium text-[#DC2626]" role="alert">
              {errors.password}
            </p>
          ) : (
            <p className="text-xs text-[#94A3B8]">
              Use 8+ characters with a mix of letters and numbers.
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-confirm-password" className="text-sm font-medium text-[#334155]">
            Confirm password
          </Label>

          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />

            <Input
              id="signup-confirm-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={values.confirmPassword}
              onChange={(event) => update("confirmPassword", event.target.value)}
              aria-invalid={!!errors.confirmPassword}
              className="h-11 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] pr-11 pl-9 focus-visible:border-[#16A37A]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-[#94A3B8]"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-xs font-medium text-[#DC2626]" role="alert">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex flex-col gap-1.5">
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[#334155]">
            <Checkbox
              checked={values.agreed}
              onCheckedChange={(checked) => update("agreed", checked === true)}
              className="mt-0.5 border-[#CBD5E1] data-checked:border-[#16A37A] data-checked:bg-[#16A37A]"
            />

            <span>
              I agree to the{" "}
              <Link href="#" className="font-medium text-[#16A37A] hover:text-[#128A66]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="font-medium text-[#16A37A] hover:text-[#128A66]">
                Privacy Policy
              </Link>
            </span>
          </label>

          {errors.agreed && (
            <p className="text-xs font-medium text-[#DC2626]" role="alert">
              {errors.agreed}
            </p>
          )}
        </div>

        {/* API Error */}
        {submitError && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {submitError}
          </p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-xl bg-[#142B45] text-sm font-semibold text-white hover:bg-[#142B45]/90"
        >
          {isSubmitting ? (
            <>
              <Spinner className="size-4" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-[#64748B]">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold text-[#16A37A] transition-colors hover:text-[#128A66]"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
