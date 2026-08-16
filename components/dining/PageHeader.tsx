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

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex items-center gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]",
        transparent
          ? "absolute inset-x-0 bg-transparent"
          : "glass-panel border-b border-primary/12",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full border border-primary/20 bg-background/40 backdrop-blur"
        aria-label="Go back"
        onClick={() => {
          if (backHref) return;
          router.back();
        }}
        render={backHref ? <Link href={backHref} /> : undefined}
      >
        <ArrowLeft aria-hidden="true" />
      </Button>
      {title ? (
        <div className="min-w-0">
          <h1 className="font-heading truncate text-[1.65rem] leading-none">{title}</h1>
          {subtitle ? <p className="eyebrow mt-1.5 opacity-80">{subtitle}</p> : null}
        </div>
      ) : null}
    </header>
  );
}
