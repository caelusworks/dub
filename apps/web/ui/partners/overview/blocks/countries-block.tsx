import { editQueryString } from "@/lib/analytics/utils";
import useProgram from "@/lib/swr/use-program";
import useWorkspace from "@/lib/swr/use-workspace";
import { AnalyticsContext } from "@/ui/analytics/analytics-provider";
import { CountryFlag } from "@/ui/shared/country-flag";
import { ArrowRight, Link4, LoadingSpinner, useRouterStuff } from "@dub/ui";
import { COUNTRIES, currencyFormatter, fetcher, nFormatter } from "@dub/utils";
import Link from "next/link";
import { useContext } from "react";
import useSWR from "swr";
import { ExceededEventsLimit } from "../exceeded-events-limit";
import { ProgramOverviewBlock } from "../program-overview-block";

export function CountriesBlock() {
  const { slug: workspaceSlug, exceededEvents } = useWorkspace();
  const { program } = useProgram();

  const { getQueryString } = useRouterStuff();

  const { queryString } = useContext(AnalyticsContext);

  const { data, isLoading, error } = useSWR<
    {
      country: string;
      leads: number;
      saleAmount: number;
    }[]
  >(
    !exceededEvents &&
      `/api/analytics?${editQueryString(queryString, {
        groupBy: "countries",
        event: program?.primaryRewardEvent === "lead" ? "leads" : "sales",
      })}`,
    fetcher,
  );

  return (
    <ProgramOverviewBlock
      title={`Top countries by ${program?.primaryRewardEvent === "lead" ? "leads" : "revenue"}`}
      viewAllHref={`/${workspaceSlug}/program/analytics${getQueryString(
        undefined,
        {
          include: ["interval", "start", "end"],
        },
      )}`}
    >
      <div className="flex h-auto flex-col divide-y divide-border-subtle @2xl:h-60">
        {exceededEvents ? (
          <ExceededEventsLimit />
        ) : isLoading ? (
          <div className="flex size-full items-center justify-center py-4">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex size-full items-center justify-center py-4 text-xs text-content-subtle">
            Failed to load data
          </div>
        ) : data?.length === 0 ? (
          <div className="flex size-full items-center justify-center py-4 text-xs text-content-subtle">
            No countries found
          </div>
        ) : (
          data?.slice(0, 6).map(({ country, leads, saleAmount }) => (
            <Link
              key={country}
              href={`/${workspaceSlug}/program/analytics${getQueryString(
                { country },
                {
                  include: ["interval", "start", "end"],
                },
              )}`}
              className="group flex h-10 items-center justify-between text-xs font-medium text-content-default"
            >
              <div className="flex min-w-0 items-center gap-2">
                {country === "(direct)" ? (
                  <Link4 className="size-4" />
                ) : (
                  <CountryFlag countryCode={country} />
                )}
                <span className="min-w-0 truncate">
                  {COUNTRIES?.[country] ?? country}
                </span>
                <ArrowRight className="size-2.5 -translate-x-0.5 text-content-emphasis opacity-0 transition-[opacity,transform] group-hover:translate-x-0 group-hover:opacity-100 [&_*]:stroke-2" />
              </div>

              <span>
                {program?.primaryRewardEvent === "lead"
                  ? nFormatter(leads, { full: true })
                  : currencyFormatter(saleAmount)}
              </span>
            </Link>
          ))
        )}
      </div>
    </ProgramOverviewBlock>
  );
}
