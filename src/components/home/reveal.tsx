"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Extra classes for the animated wrapper (layout only). */
  className?: string;
  /** Entrance delay in milliseconds for staggered grids. */
  delay?: number;
}

/**
 * Subtle scroll-into-view entrance animation built on IntersectionObserver
 * and CSS transitions — no animation dependency required. Content is always
 * present in the DOM (only opacity/transform change), reduced-motion users
 * see it immediately via `motion-reduce:` utilities, and the observer only
 * updates state from its async callback.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: RevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Extremely old browsers: reveal on the next frame instead of hiding.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={cn(
        "home-reveal translate-y-4 opacity-0 transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        visible && "translate-y-0 opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
