import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Rentora",
  description: "Equipment rental marketplace",
};

/**
 * Root layout: required top-most layout. It defines the `<html>` and
 * `<body>` tags that wrap every route group — `(root)`, `(auth)` and
 * `(dashboard)`.
 */
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
