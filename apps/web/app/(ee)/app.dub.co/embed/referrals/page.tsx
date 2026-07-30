import { HeroBackground } from "@/ui/partners/hero-background";
import { Button, Copy } from "@dub/ui";
import { Suspense } from "react";
import { DynamicHeightMessenger } from "./dynamic-height-messenger";
import { getReferralsEmbedData } from "./get-referrals-embed-data";
import { ReferralsEmbedPageClient } from "./page-client";
import { parseThemeOptions, ThemeOptions } from "./theme-options";

export default async function ReferralsEmbedPage(props: {
  searchParams: Promise<{
    token: string;
    themeOptions?: string;
    dynamicHeight?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const {
    token,
    themeOptions: themeOptionsRaw,
    dynamicHeight: dynamicHeightRaw,
  } = searchParams;

  const themeOptions = parseThemeOptions(themeOptionsRaw);
  const dynamicHeight = !!dynamicHeightRaw && dynamicHeightRaw !== "false";

  return (
    <>
      <Suspense fallback={<EmbedInlineLoading themeOptions={themeOptions} />}>
        <ReferralsEmbedRSC
          token={token}
          themeOptions={themeOptions}
          dynamicHeight={dynamicHeight}
        />
      </Suspense>
      {dynamicHeight && <DynamicHeightMessenger />}
    </>
  );
}

async function ReferralsEmbedRSC({
  token,
  themeOptions,
  dynamicHeight,
}: {
  token: string;
  themeOptions: ThemeOptions;
  dynamicHeight: boolean;
}) {
  const embedData = await getReferralsEmbedData(token);

  return (
    <ReferralsEmbedPageClient
      {...embedData}
      themeOptions={themeOptions}
      dynamicHeight={dynamicHeight}
    />
  );
}

function EmbedInlineLoading({ themeOptions }: { themeOptions: ThemeOptions }) {
  return (
    <div
      style={{ backgroundColor: themeOptions.backgroundColor || "transparent" }}
      className="flex min-h-screen flex-col"
    >
      <div className="p-5">
        <div className="relative flex flex-col overflow-hidden rounded-lg border border-border-default p-4 md:p-6">
          <HeroBackground color="#737373" />
          <span className="text-base font-semibold text-content-emphasis">
            Referral link
          </span>
          <div className="relative mt-3 flex flex-col items-center gap-2 xs:flex-row">
            <div className="h-10 w-full rounded-md border border-border-default bg-bg-muted xs:w-72" />
            <Button
              icon={<Copy className="size-4" />}
              text="Copy link"
              className="xs:w-fit"
              disabled
            />
          </div>
          <span className="mt-12 text-base font-semibold text-content-emphasis">
            Rewards
          </span>
          <div className="mt-2 h-20 w-[28rem] rounded-md border border-border-subtle bg-bg-default" />
        </div>
        <div className="mt-4 grid gap-2 sm:h-32 sm:grid-cols-3">
          <div className="h-full w-full rounded-lg border border-border-subtle bg-bg-muted sm:col-span-2" />
          <div className="h-full w-full rounded-lg border border-border-subtle bg-bg-muted" />
        </div>
        <div className="mt-4">
          <div className="h-10 w-full rounded-lg border border-border-subtle bg-bg-muted" />
          <div className="my-4 h-80 w-full rounded-lg border border-border-muted p-2" />
        </div>
      </div>
    </div>
  );
}
