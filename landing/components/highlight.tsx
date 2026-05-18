import { cn } from "@/lib/utils";

export function Highlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("highlight", className)}>{children}</span>;
}

export function Scribble({ children }: { children: React.ReactNode }) {
  return <span className="scribble">{children}</span>;
}
