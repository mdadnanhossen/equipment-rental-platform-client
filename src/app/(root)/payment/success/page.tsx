import { Suspense } from "react";
import PaymentSuccessClient from "./success-client";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading payment details...
        </div>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}