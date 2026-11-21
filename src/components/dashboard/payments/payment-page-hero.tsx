import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "cn";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface HeroBreadcrumb {
  label: string;
  href: string;
}

interface PaymentPageHeroProps {
  breadcrumbs: HeroBreadcrumb[];
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Compact dashboard page introduction: breadcrumb, brand icon tile, title,
 * subtitle, optional pill and a contextual action area.
 */
export function PaymentPageHero({
  breadcrumbs,
  title,
  subtitle,
  icon: Icon,
  badge,
  actions,
  className,
}: PaymentPageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)] sm:p-6",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-[#16A37A]/10 blur-2xl"
      />

      <div className="relative">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <BreadcrumbItem key={crumb.label}>
                  {isLast ? (
                    <BreadcrumbPage className="font-medium">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={crumb.href} />}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}

                  {!isLast && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#142B45] text-white shadow-sm"
            >
              <Icon className="size-5" />
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {title}
                </h1>

                {badge && (
                  <span className="inline-flex h-6 items-center rounded-full bg-[#16A37A]/10 px-2.5 text-xs font-semibold text-[#0F7A57] ring-1 ring-[#16A37A]/25 dark:text-[#34D399]">
                    {badge}
                  </span>
                )}
              </div>

              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            </div>
          </div>

          {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
