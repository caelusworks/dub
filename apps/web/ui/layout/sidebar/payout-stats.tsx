"use client";

import usePartnerPayoutsCount from "@/lib/swr/use-partner-payouts-count";
import usePartnerProfile from "@/lib/swr/use-partner-profile";
import { ConnectPayoutButton } from "@/ui/partners/payouts/connect-payout-button";
import { AlertCircleFill } from "@/ui/shared/icons";
import {
  AnimatedSizeContainer,
  ChevronRight,
  MoneyBills2,
  Tooltip,
} from "@dub/ui";
import { currencyFormatter } from "@dub/utils";
import { PayoutStatus } from "@prisma/client";
import Link from "next/link";
import { memo } from "react";

export const PayoutStats = memo(() => {
  const { partner } = usePartnerProfile();

  const { payoutsCount } = usePartnerPayoutsCount({
    groupBy: "status",
  });

  return (
    <AnimatedSizeContainer height>
      <div className="grid gap-3 border-t border-border-subtle p-3">
        <Link
          className="group flex items-center justify-between gap-2"
          href="/payouts"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-content-default">
            <MoneyBills2 className="size-4" />
            Payouts
          </div>
          <ChevronRight className="size-3 text-content-muted transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-content-default [&_*]:stroke-2" />
        </Link>

        <div className="flex flex-col gap-4">
          <div className="grid gap-1 text-xs">
            <p className="font-medium text-content-subtle">Upcoming payouts</p>
            <div className="flex items-center gap-1">
              {partner && !partner.payoutsEnabledAt && (
                <Tooltip
                  content="You need to [connect your payout account](/payouts?settings=true) to be able to receive payouts from the programs you are enrolled in. [Learn more](https://dub.co/help/article/receiving-payouts)"
                  side="right"
                >
                  <div>
                    <AlertCircleFill className="size-3 text-content-default" />
                  </div>
                </Tooltip>
              )}
              {payoutsCount ? (
                <p className="font-medium text-content-default">
                  {currencyFormatter(
                    payoutsCount
                      ?.filter(
                        (payout) =>
                          payout.status === PayoutStatus.pending ||
                          payout.status === PayoutStatus.processing,
                      )
                      ?.reduce((acc, p) => acc + p.amount, 0) || 0,
                  )}
                </p>
              ) : (
                <div className="h-5 w-24 animate-pulse rounded-md bg-neutral-200" />
              )}
            </div>
          </div>
          <div className="grid gap-1 text-xs">
            <p className="font-medium text-content-subtle">Received payouts</p>
            {payoutsCount ? (
              <p className="font-medium text-content-default">
                {currencyFormatter(
                  payoutsCount
                    ?.filter(
                      (payout) =>
                        payout.status === PayoutStatus.processed ||
                        payout.status === PayoutStatus.sent ||
                        payout.status === PayoutStatus.completed,
                    )
                    ?.reduce((acc, p) => acc + p.amount, 0) ?? 0,
                )}
              </p>
            ) : (
              <div className="h-5 w-24 animate-pulse rounded-md bg-neutral-200" />
            )}
          </div>
        </div>
        {partner && !partner.payoutsEnabledAt && (
          <ConnectPayoutButton className="mt-4 h-8 w-full" />
        )}
      </div>
    </AnimatedSizeContainer>
  );
});
