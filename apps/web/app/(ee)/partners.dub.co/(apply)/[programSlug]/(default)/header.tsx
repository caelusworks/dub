"use client";

import { Button, useScroll, Wordmark } from "@dub/ui";
import { cn } from "@dub/utils";
import { PartnerGroup } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function ApplyHeader({
  group,
  showLogin = true,
  showApply = true,
}: {
  group: Pick<PartnerGroup, "logo" | "wordmark">;
  showLogin?: boolean;
  showApply?: boolean;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const scrolled = useScroll(0);

  const { programSlug, groupSlug } = useParams();

  const partnerGroupSlug = groupSlug ? `/${groupSlug}` : "";

  return (
    <header
      className={
        "sticky top-0 z-10 mx-px flex items-center justify-between bg-white/90 px-6 py-4 backdrop-blur-sm"
      }
    >
      {/* Bottom border when scrolled */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-px bg-neutral-200 opacity-0 transition-opacity duration-300 [mask-image:linear-gradient(90deg,transparent,black,transparent)]",
          scrolled && "opacity-100",
        )}
      />

      <Link
        href={`/${programSlug}${partnerGroupSlug}`}
        className="my-0.5 block animate-fade-in"
      >
        {group.wordmark || group.logo ? (
          <img
            className="max-h-7 max-w-32"
            src={(group.wordmark ?? group.logo) as string}
          />
        ) : (
          <Wordmark className="h-7" />
        )}
      </Link>

      <div className="flex items-center gap-2">
        {showLogin && !session?.user && status !== "loading" && (
          <Link href={`/${programSlug}/login?next=${pathname}`}>
            <Button
              type="button"
              variant="secondary"
              text="Log in"
              className="h-8 w-fit animate-fade-in text-neutral-600"
            />
          </Link>
        )}
        {showApply && (
          <Link href={`/${programSlug}${partnerGroupSlug}/apply`}>
            <Button
              type="button"
              text="Apply"
              className="h-8 w-fit animate-fade-in border-[var(--brand)] bg-[var(--brand)] hover:bg-[var(--brand)] hover:ring-[var(--brand-ring)]"
            />
          </Link>
        )}
      </div>
    </header>
  );
}
