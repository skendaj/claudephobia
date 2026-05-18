import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-ink/10 bg-cream-2/80 px-2 py-0.5 text-[11px] font-medium text-graphite",
        className
      )}
      {...props}
    />
  );
}
