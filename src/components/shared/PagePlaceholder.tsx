import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PagePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Styled "coming soon" shell used by every linked route until the real
 * page is implemented, so navigation and active states stay testable.
 */
export function PagePlaceholder({
  title,
  description,
  icon: Icon,
}: PagePlaceholderProps) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-5 px-4 py-20 text-center sm:px-6 lg:px-8">
      <span
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-2xl bg-[#142B45] text-white"
      >
        <Icon className="size-7" />
      </span>

      <span className="inline-flex h-5 items-center rounded-full bg-[#16A37A]/10 px-3 text-xs font-semibold text-[#16A37A]">
        Coming soon
      </span>

      <h1 className="text-3xl font-bold tracking-tight text-[#142B45] sm:text-4xl">
        {title}
      </h1>

      <p className="max-w-xl text-base leading-relaxed text-[#334155]">
        {description}
      </p>

      <Link
        href="/"
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#142B45] transition-colors hover:bg-[#F8FAFC]"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to home
      </Link>
    </main>
  );
}
