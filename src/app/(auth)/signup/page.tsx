import type { Metadata } from "next";

import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join Rentora as a customer or equipment owner — it only takes a minute.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
