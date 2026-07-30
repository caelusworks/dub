"use client";

import useBounty from "@/lib/swr/use-bounty";
import useWorkspace from "@/lib/swr/use-workspace";
import { ChevronRight, Trophy } from "@dub/ui";
import Link from "next/link";
import { redirect } from "next/navigation";

export function BountyHeaderTitle() {
  const { bounty, loading } = useBounty();
  const { slug: workspaceSlug } = useWorkspace();

  if (loading) {
    return <div className="h-7 w-32 animate-pulse rounded-md bg-neutral-200" />;
  }

  if (!bounty && !loading) {
    redirect(`/${workspaceSlug}/program/bounties`);
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/${workspaceSlug}/program/bounties`}
        aria-label="Back to bounties"
        title="Back to bounties"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-subtle transition-[transform,background-color] duration-150 hover:bg-bg-emphasis active:scale-95"
      >
        <Trophy className="size-4" />
      </Link>

      <div className="flex items-center gap-1.5">
        <ChevronRight className="size-2.5 shrink-0 text-content-subtle [&_*]:stroke-2" />
        <span className="text-lg font-semibold leading-7 text-neutral-900">
          Bounty details
        </span>
      </div>
    </div>
  );
}
