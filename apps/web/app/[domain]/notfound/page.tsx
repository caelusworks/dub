import { prisma } from "@/lib/prisma";
import { BubbleIcon } from "@/ui/placeholders/bubble-icon";
import { ButtonLink } from "@/ui/placeholders/button-link";
import { CTA } from "@/ui/placeholders/cta";
import { FeaturesSection } from "@/ui/placeholders/features-section";
import { Hero } from "@/ui/placeholders/hero";
import { LearnMoreButton } from "@/ui/placeholders/learn-more-button";
import { GlobeSearch } from "@dub/ui";
import { cn, constructMetadata } from "@dub/utils";
import { redirect } from "next/navigation";

export const revalidate = false; // cache indefinitely

export const metadata = constructMetadata({
  title: "Link Not Found",
  description:
    "This link does not exist on Dub. Please check the URL and try again.",
  image: "https://assets.dub.co/misc/notfoundlink.jpg",
  noIndex: true,
});

const UTM_PARAMS = {
  utm_source: "Link Not Found",
  utm_medium: "Link Not Found Page",
};

export function generateStaticParams() {
  return [];
}

export default async function NotFoundLinkPage(props: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await props.params;
  const domainData = await prisma.domain.findUnique({
    where: {
      slug: domain,
    },
  });

  if (domainData?.notFoundUrl) {
    redirect(domainData.notFoundUrl);
  }

  return (
    <main className="flex min-h-screen flex-col justify-between">
      <Hero>
        <div className="relative mx-auto flex w-full max-w-md flex-col items-center">
          <BubbleIcon>
            <GlobeSearch className="size-12" />
          </BubbleIcon>
          <h1
            className={cn(
              "mt-10 text-center font-display text-4xl font-medium text-neutral-900 sm:text-5xl sm:leading-[1.15]",
              "animate-slide-up-fade [--offset:20px] [animation-duration:1s] [animation-fill-mode:both] motion-reduce:animate-fade-in",
            )}
          >
            Link not found
          </h1>
          <p
            className={cn(
              "mt-5 text-pretty text-base text-neutral-700 sm:text-xl",
              "animate-slide-up-fade [--offset:10px] [animation-delay:200ms] [animation-duration:1s] [animation-fill-mode:both] motion-reduce:animate-fade-in",
            )}
          >
            This link does not exist on Dub. Please check the URL and try again.
          </p>
        </div>

        <div
          className={cn(
            "relative mx-auto mt-8 flex max-w-fit flex-col items-center gap-4 xs:flex-row",
            "animate-slide-up-fade [--offset:5px] [animation-delay:300ms] [animation-duration:1s] [animation-fill-mode:both] motion-reduce:animate-fade-in",
          )}
        >
          <ButtonLink variant="primary" href="https://app.dub.co/register">
            Try Dub today
          </ButtonLink>
          <LearnMoreButton utmParams={UTM_PARAMS} />
        </div>
      </Hero>
      <div className="mt-20">
        <FeaturesSection utmParams={UTM_PARAMS} />
      </div>
      <div className="mt-32">
        <CTA utmParams={UTM_PARAMS} />
      </div>
    </main>
  );
}
