import useWorkspace from "@/lib/swr/use-workspace";
import { CommissionResponse } from "@/lib/types";
import { AnalyticsContext } from "@/ui/analytics/analytics-provider";
import { PartnerAvatar } from "@/ui/partners/partner-avatar";
import { ArrowRight, LoadingSpinner, StatusBadge } from "@dub/ui";
import { currencyFormatter, fetcher } from "@dub/utils";
import Link from "next/link";
import { useContext } from "react";
import useSWR from "swr";
import { CommissionStatusBadges } from "../../commission-status-badges";
import { ProgramOverviewBlock } from "../program-overview-block";

export function CommissionsBlock() {
  const { slug: workspaceSlug } = useWorkspace();

  const { queryString } = useContext(AnalyticsContext);

  const { data, error, isLoading } = useSWR<CommissionResponse[]>(
    `/api/commissions?${queryString}`,
    fetcher,
    {
      keepPreviousData: true,
    },
  );

  return (
    <ProgramOverviewBlock
      title="Recent commissions"
      viewAllHref={`/${workspaceSlug}/program/commissions`}
    >
      <div className="flex h-auto flex-col divide-y divide-border-subtle @2xl:h-60">
        {isLoading ? (
          <div className="flex size-full items-center justify-center py-4">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex size-full items-center justify-center py-4 text-xs text-content-subtle">
            Failed to load data
          </div>
        ) : data?.length === 0 ? (
          <div className="flex size-full items-center justify-center py-4 text-xs text-content-subtle">
            No commissions found
          </div>
        ) : (
          data?.slice(0, 6).map(({ id, partner, status, earnings }) => {
            const badge = CommissionStatusBadges[status];

            return (
              <Link
                key={id}
                href={`/${workspaceSlug}/program/commissions/${id}`}
                className="group flex h-10 items-center justify-between text-xs font-medium text-content-default"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <PartnerAvatar partner={partner} className="size-4" />
                  <span className="min-w-0 truncate">{partner.name}</span>
                  <ArrowRight className="size-2.5 -translate-x-0.5 text-content-emphasis opacity-0 transition-[opacity,transform] group-hover:translate-x-0 group-hover:opacity-100 [&_*]:stroke-2" />
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge
                    icon={null}
                    variant={badge.variant}
                    className="py-0.5"
                  >
                    {badge.label}
                  </StatusBadge>

                  <span className="min-w-12 text-right">
                    {currencyFormatter(earnings)}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </ProgramOverviewBlock>
  );
}
