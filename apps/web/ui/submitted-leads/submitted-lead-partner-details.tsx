import { SubmittedLeadProps } from "@/lib/types";
import { PartnerAvatar } from "@/ui/partners/partner-avatar";
import Link from "next/link";
import { useParams } from "next/navigation";

interface SubmittedLeadPartnerDetailsProps {
  lead: SubmittedLeadProps;
}

export function SubmittedLeadPartnerDetails({
  lead,
}: SubmittedLeadPartnerDetailsProps) {
  const { slug } = useParams();

  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-white p-4">
      <h3 className="mb-2.5 text-sm font-semibold text-content-emphasis">
        Partner
      </h3>
      <Link
        href={`/${slug}/program/partners/${lead.partner.id}`}
        target="_blank"
        className="flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <PartnerAvatar
          partner={lead.partner}
          className="size-5 border border-neutral-100"
        />
        <div className="cursor-alias text-sm font-semibold text-content-emphasis decoration-dotted hover:underline">
          {lead.partner.name}
        </div>
      </Link>
    </div>
  );
}
