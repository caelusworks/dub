"use client";

import { useLocalStorage, useMediaQuery } from "@dub/ui";
import { Gift } from "@dub/ui/icons";
import { cn } from "@dub/utils/src";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AffiliateProgramPopup } from "./affiliate-program-popup";

export function ReferButton({
  affiliatePopupEnabled = false,
}: {
  affiliatePopupEnabled?: boolean;
}) {
  const { width } = useMediaQuery();
  const [linkRef, setLinkRef] = useState<HTMLAnchorElement | null>(null);

  return (
    <>
      <Link
        ref={affiliatePopupEnabled ? setLinkRef : undefined}
        href="/account/settings/referrals"
        className={cn(
          "flex size-11 shrink-0 animate-fade-in items-center justify-center rounded-lg transition-colors duration-150 hover:bg-bg-inverted/5 active:bg-bg-inverted/10",
          "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
        )}
      >
        <Gift className="size-5 text-content-default" />
      </Link>
      {affiliatePopupEnabled && width && width >= 768 && (
        <AffiliateProgramPopupWrapper referenceElement={linkRef} />
      )}
    </>
  );
}

function AffiliateProgramPopupWrapper({
  referenceElement,
}: {
  referenceElement: HTMLAnchorElement | null;
}) {
  const router = useRouter();

  const [show, setShow] = useLocalStorage(`show-affiliate-program-popup`, true);

  if (!show) return null;

  return (
    <AffiliateProgramPopup
      referenceElement={referenceElement}
      onCTA={() => {
        setShow(false);
        router.push("/account/settings/referrals");
      }}
      onDismiss={() => setShow(false)}
    />
  );
}
