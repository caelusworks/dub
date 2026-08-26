import { BILLING_ENABLED } from "@/lib/flags";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default function BillingLayout({ children }: { children: ReactNode }) {
  if (!BILLING_ENABLED) {
    notFound();
  }

  return <>{children}</>;
}
