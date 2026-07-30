import { PageWidthWrapper } from "@/ui/layout/page-width-wrapper";
import { Suspense } from "react";
import { ProgramsNavTabs } from "./programs-nav-tabs";

export default function AdminProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageWidthWrapper className="pb-12 pt-4">
      <div className="overflow-hidden rounded-xl border border-border-subtle bg-neutral-100">
        <Suspense>
          <ProgramsNavTabs />
          <div className="-mx-px -mb-px space-y-4 rounded-xl border border-border-subtle bg-white p-4">
            {children}
          </div>
        </Suspense>
      </div>
    </PageWidthWrapper>
  );
}
