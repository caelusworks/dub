"use client";

import { PartnerComments } from "@/ui/partners/partner-comments";
import { useParams } from "next/navigation";

export default function ProgramPartnerCommentsPage() {
  const { partnerId } = useParams() as { partnerId: string };

  return (
    <>
      <h2 className="text-lg font-semibold text-content-emphasis">Comments</h2>
      <PartnerComments partnerId={partnerId} />
    </>
  );
}
