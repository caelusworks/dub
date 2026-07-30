import { ReactNode } from "react";

export default function InvitesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-bg-emphasis sm:p-2">
      <div className="relative flex min-h-[calc(100vh-1rem)] flex-col bg-bg-default sm:rounded-xl">
        {children}
      </div>
    </div>
  );
}
