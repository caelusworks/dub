"use client";

import {
  PartnerBountyProps,
  PartnerBountySubmission,
  ProgramEnrollmentProps,
} from "@/lib/types";
import { BountyDescription } from "@/ui/partners/bounties/bounty-description";
import {
  PerformanceBountyProgress,
  SubmissionBountyProgress,
} from "@/ui/partners/bounties/bounty-performance";
import { BountyRewardCriteria } from "@/ui/partners/bounties/bounty-reward-criteria";
import { BountyRewardDescription } from "@/ui/partners/bounties/bounty-reward-description";
import { BountyStatusBadge } from "@/ui/partners/bounties/bounty-status-badge";
import { BountySubmissionRequirements } from "@/ui/partners/bounties/bounty-submission-requirements";
import { BountyThumbnailImage } from "@/ui/partners/bounties/bounty-thumbnail-image";
import { ChevronRight, Trophy } from "@dub/ui";
import { PlatformType } from "@prisma/client";
import { useState } from "react";
import {
  BountyEndDate,
  BountyRewardsTable,
} from "../../../../partners.dub.co/(dashboard)/programs/[programSlug]/(enrolled)/bounties/bounty-card";
import { EmbedBountySubmissionDetail } from "./submission-detail";
import { EmbedBountySubmissionForm } from "./submission-form";
import { EmbedBountySubmissionsTable } from "./submissions-table";

export type EmbedBountyView =
  | { mode: "detail" }
  | { mode: "submission-form"; periodNumber: number }
  | { mode: "submission-view"; periodNumber: number };

export function EmbedBountyDetail({
  bounty: initialBounty,
  partnerPlatforms,
  programEnrollment,
  view,
  setView,
  onBack,
  onBountyUpdate,
}: {
  bounty: PartnerBountyProps;
  partnerPlatforms: Array<{
    type: PlatformType;
    identifier: string;
    verifiedAt: Date | null;
  }>;
  programEnrollment: Pick<ProgramEnrollmentProps, "createdAt">;
  view: EmbedBountyView;
  setView: (v: EmbedBountyView) => void;
  onBack: () => void;
  onBountyUpdate?: (bounty: PartnerBountyProps) => void;
}) {
  const [bounty, setBounty] = useState<PartnerBountyProps>(initialBounty);

  const hasRewards = bounty.submissions.some((s) => s.commission != null);

  const handleSubmissionSuccess = (newSubmission: PartnerBountySubmission) => {
    const normalized: PartnerBountySubmission = {
      ...newSubmission,
      commission: newSubmission.commission ?? null,
    };
    setBounty((prev) => {
      const existing = prev.submissions.find(
        (s) => s.periodNumber === normalized.periodNumber,
      );
      const updatedSubmissions = existing
        ? prev.submissions.map((s) =>
            s.periodNumber === normalized.periodNumber ? normalized : s,
          )
        : [...prev.submissions, normalized];
      const updated = { ...prev, submissions: updatedSubmissions };

      onBountyUpdate?.(updated);
      return updated;
    });
    setView({
      mode: "submission-view",
      periodNumber: newSubmission.periodNumber,
    });
  };

  const existingSubmission =
    view.mode === "submission-form"
      ? (bounty.submissions.find((s) => s.periodNumber === view.periodNumber) ??
        null)
      : null;

  const viewSubmission =
    view.mode === "submission-view"
      ? bounty.submissions.find((s) => s.periodNumber === view.periodNumber)
      : undefined;

  if (view.mode === "submission-form") {
    return (
      <EmbedBountySubmissionForm
        bounty={bounty}
        partnerPlatforms={partnerPlatforms}
        periodNumber={
          (view as { mode: "submission-form"; periodNumber: number })
            .periodNumber
        }
        existingSubmission={existingSubmission}
        onCancel={() => setView({ mode: "detail" })}
        onBackToRoot={onBack}
        onSuccess={handleSubmissionSuccess}
      />
    );
  }

  if (view.mode === "submission-view" && viewSubmission) {
    return (
      <EmbedBountySubmissionDetail
        bounty={bounty}
        submission={viewSubmission}
        periodNumber={
          (view as { mode: "submission-view"; periodNumber: number })
            .periodNumber
        }
        onBack={() => setView({ mode: "detail" })}
        onBackToRoot={onBack}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-bg-default">
      <div className="flex items-center gap-1.5 px-4 py-2">
        <button
          type="button"
          aria-label="Back to bounties"
          title="Back to bounties"
          onClick={onBack}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-subtle transition-[transform,background-color] duration-150 hover:bg-bg-emphasis active:scale-95"
        >
          <Trophy className="size-4" />
        </button>
        <ChevronRight className="size-2.5 shrink-0 text-content-muted [&_*]:stroke-2" />
        <span className="text-sm font-semibold text-content-emphasis">
          Bounty details
        </span>
      </div>

      <div className="border-t border-border-subtle" />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:divide-x lg:divide-border-subtle">
        <div className="flex flex-col gap-6 p-5">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-content-emphasis">
              Progress
            </h2>
            <div className="flex w-full flex-col gap-4 rounded-xl border border-border-subtle bg-bg-default px-5 pb-4 pt-6">
              {bounty.type === "performance" ? (
                <PerformanceBountyProgress
                  bounty={bounty}
                  labelClassName="text-sm"
                />
              ) : (
                <SubmissionBountyProgress
                  bounty={bounty}
                  labelClassName="text-sm"
                />
              )}
            </div>
          </div>

          {bounty.type === "performance" ? null : (
            // (
            //   <EmbedBountyPerformanceSection
            //     bounty={bounty}
            //     programEnrollment={programEnrollment}
            //   />
            // )
            <EmbedBountySubmissionsTable
              bounty={bounty}
              onSubmit={(periodNumber) =>
                setView({ mode: "submission-form", periodNumber })
              }
              onView={(periodNumber) =>
                setView({ mode: "submission-view", periodNumber })
              }
            />
          )}

          <div className="flex flex-col gap-6 text-sm">
            <BountySubmissionRequirements bounty={bounty} />
            <BountyRewardCriteria bounty={bounty} />
            <BountyDescription bounty={bounty} embed />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border-subtle p-5 lg:border-t-0">
          <div className="relative flex h-[132px] items-center justify-center overflow-hidden rounded-lg bg-bg-subtle">
            <div className="relative size-full">
              <BountyThumbnailImage bounty={bounty} />
            </div>
            <BountyStatusBadge bounty={bounty} />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-content-emphasis">
              {bounty.name}
            </h3>

            <BountyEndDate bounty={bounty} />
            <BountyRewardDescription bounty={bounty} className="font-medium" />
          </div>

          {hasRewards && (
            <BountyRewardsTable bounty={bounty} className="border-t pt-4" />
          )}
        </div>
      </div>
    </div>
  );
}
