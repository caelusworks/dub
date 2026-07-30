import { capitalize, cn } from "@dub/utils";
import { Link2 } from "lucide-react";
import { CursorRays } from "../../../icons";

const data = {
  clicks: {
    color: "#3B82F6",
    value: "12.5K",
  },
  leads: {
    color: "#A855F7",
    value: "8.2K",
  },
  sales: {
    color: "#14B8A6",
    value: "$12K",
  },
};

const CUSTOMER = {
  name: "Danielle Wilson",
  email: "danielle@dub.co",
  avatarIndex: 8,
  origin: "dub.sh",
  country: "US",
  details: {
    "Lifetime value": "$12.5k",
    Account: "Pro",
    Subscription: "2y 10m",
  },
};

export function AnalyticsGraphic({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none relative size-full", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 339 168"
        className="h-auto w-full [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
      >
        <path
          stroke="#00BBA7"
          strokeWidth="2"
          d="m345 1-60.533 76.487a8 8 0 0 1-9.732 2.25l-25.53-12.241a8 8 0 0 0-9.214 1.657l-62.736 64.993a8 8 0 0 1-6.695 2.388L67.303 124.331a8 8 0 0 0-5.193 1.17L-3.166 166.5"
        />
        <circle cx="259.333" cy="72" r="3" fill="#00BBA7" />
        <circle
          cx="259.333"
          cy="72"
          r="4"
          stroke="#3EC5B8"
          strokeOpacity="0.3"
          strokeWidth="2"
        />
      </svg>
      <div className="absolute bottom-0 left-5 flex items-start gap-2">
        {/* Data */}
        <div className="w-[172px] rounded-lg border border-border-default bg-bg-default p-0">
          <div className="p-1.5">
            <div className="hidden items-center gap-2 rounded border border-border-subtle bg-bg-subtle p-2 text-xs font-medium leading-none text-content-default sm:flex">
              <Link2 className="size-3 rotate-90" />
              d.to/try
            </div>
            <div className="mt-1 px-1.5 pb-0.5 text-[0.8125rem] font-medium text-content-default sm:mt-2">
              Apr 2025
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-border-default p-3">
            {(["clicks", "leads", "sales"] as const).map((key) => (
              <div
                className="flex items-center justify-between gap-2"
                key={key}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="size-2 rounded-sm border border-black/20 bg-current opacity-70"
                    style={{ color: data[key].color }}
                  />
                  <div className="text-xs font-medium leading-none text-content-subtle">
                    {capitalize(key)}
                  </div>
                </div>
                <span className="text-xs leading-none text-content-emphasis">
                  {key === "sales" ? "$" : ""}
                  {data[key].value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer */}
        <div className="relative">
          <div className="absolute left-0 top-0 rounded-lg border border-border-default bg-bg-default py-0.5">
            <div className="px-3 py-2.5">
              <div className="flex justify-between gap-2">
                <div
                  className="size-11 rounded-full bg-bg-emphasis"
                  style={{
                    backgroundImage:
                      "url(https://assets.dub.co/home/people.png)",
                    backgroundSize: "3600%", // 36 images
                    backgroundPositionX: CUSTOMER.avatarIndex * 100 + "%",
                  }}
                />
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-default px-1.5 py-0.5 text-xs text-content-default">
                    <CursorRays className="size-3.5 text-content-default" />
                    {CUSTOMER.origin}
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-default px-1.5 py-0.5 text-xs text-content-default">
                    <img
                      src={`https://flag.vercel.app/m/${CUSTOMER.country}.svg`}
                      className="relative h-2.5 w-3 rounded-sm"
                    />
                    {CUSTOMER.country}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-[0.8125rem] font-medium text-content-emphasis">
                {CUSTOMER.name}
              </div>
              <div className="mt-px text-xs text-content-subtle">
                {CUSTOMER.email}
              </div>
            </div>
            <div className="flex flex-col gap-2.5 border-t border-border-default px-3 pb-2.5 pt-3">
              {Object.entries(CUSTOMER.details as Record<string, string>).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="relative flex items-center justify-between gap-2 text-xs leading-none"
                  >
                    <span className="truncate font-medium text-content-muted">
                      {key}
                    </span>
                    <span className="text-content-default">{value}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
