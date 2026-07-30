"use client";
import useWorkspace from "@/lib/swr/use-workspace";
import { useTrialLimitActivateModal } from "@/ui/modals/trial-limit-activate-modal";
import { Lock } from "@dub/ui";
import { isWorkspaceBillingTrialActive } from "@dub/utils";
import Link from "next/link";

export function ExceededEventsLimit() {
  const { slug, trialEndsAt } = useWorkspace();
  const { openTrialLimitModal, TrialLimitActivateModal } =
    useTrialLimitActivateModal();
  const trialActive = isWorkspaceBillingTrialActive(trialEndsAt);

  return (
    <>
      <TrialLimitActivateModal />
      <div className="mx-auto flex size-full max-w-xs flex-col items-center justify-center gap-2">
        <Lock className="size-6 text-content-subtle" />
        <h1 className="text-sm font-medium text-content-emphasis">
          Stats Locked
        </h1>
        <p className="text-center text-sm text-content-subtle">
          You have exceeded the events limit on your current plan.{" "}
          {trialActive ? (
            <button
              type="button"
              onClick={() => openTrialLimitModal("clicks")}
              className="underline decoration-dotted underline-offset-2 transition-colors hover:text-content-emphasis"
            >
              Start paid plan to keep using Dub.
            </button>
          ) : (
            <Link
              href={`/${slug}/settings/billing`}
              className="underline decoration-dotted underline-offset-2 transition-colors hover:text-content-emphasis"
            >
              Upgrade to keep using Dub.
            </Link>
          )}
        </p>
      </div>
    </>
  );
}
