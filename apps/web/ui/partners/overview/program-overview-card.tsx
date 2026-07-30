import { cn } from "@dub/utils";
import { PropsWithChildren } from "react";

export function ProgramOverviewCard({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "rounded-[0.625rem] border border-border-subtle bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}
