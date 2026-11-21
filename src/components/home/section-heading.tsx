import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  /** Optional right-hand action (e.g. "View all" link). */
  action?: ReactNode;
  align?: "center" | "start";
  /** "dark" = ink text for light sections, "light" = white text for navy sections. */
  tone?: "dark" | "light";
  /** Optional `id` for the heading, referenced by `aria-labelledby`. */
  headingId?: string;
}

/** Shared eyebrow + heading + description block used by every section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "center",
  tone = "dark",
  headingId,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        centered ? "items-center text-center" : "gap-5",
        !centered && "sm:flex-row sm:items-end sm:justify-between",
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        <p
          className={cn(
            "flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em]",
            tone === "dark" ? "text-[#0D9488]" : "text-[#5EEAD4]",
            !centered && "justify-start",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "h-px w-7",
              tone === "dark" ? "bg-[#14B8A6]" : "bg-[#5EEAD4]",
            )}
          />
          {eyebrow}
        </p>

        <h2
          id={headingId}
          className={cn(
            "mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl",
            tone === "dark" ? "text-[#0B1220]" : "text-white",
          )}
        >
          {title}
        </h2>

        {description ? (
          <p
            className={cn(
              "mt-4 text-base leading-relaxed text-pretty",
              tone === "dark" ? "text-[#475569]" : "text-[#94A3B8]",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
