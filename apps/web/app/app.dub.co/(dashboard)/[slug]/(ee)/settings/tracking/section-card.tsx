import { PropsWithChildren, ReactNode } from "react";

export function SectionCard({
  number,
  title,
  children,
}: PropsWithChildren<{
  number: number;
  title: string;
  children?: ReactNode;
}>) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex items-center gap-3 p-6">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-content-emphasis">
          {number}
        </div>
        <h2 className="text-lg font-semibold leading-7 tracking-[-0.02em] text-content-emphasis">
          {title}
        </h2>
      </div>
      <div className="border-t border-neutral-200">{children}</div>
    </div>
  );
}
