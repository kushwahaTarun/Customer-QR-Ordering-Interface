"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  backHref,
  transparent = false,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  transparent?: boolean;
}) {
  const router = useRouter();

  const back = (
    <Button
      variant="ghost"
      size="icon-sm"
      className="rounded-full bg-background/40 backdrop-blur"
      aria-label="Go back"
      onClick={() => {
        if (backHref) return;
        router.back();
      }}
      render={backHref ? <Link href={backHref} /> : undefined}
    >
      <ArrowLeft />
    </Button>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex items-center gap-3 px-4 py-3",
        transparent
          ? "absolute inset-x-0 bg-transparent"
          : "border-b border-border/60 bg-background/85 backdrop-blur-xl",
      )}
    >
      {back}
      {title ? (
        <div className="min-w-0">
          <h1 className="font-heading truncate text-xl leading-none">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
