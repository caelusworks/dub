import { capitalize, cn, nFormatter } from "@dub/utils";

export const PARTNERS = [
  {
    name: "Lauren Anderson",
    country: "US",
    revenue: 1_800,
    payouts: 550,
  },
  {
    name: "Mia Taylor",
    country: "US",
    revenue: 22_600,
    payouts: 6_800,
  },
  {
    name: "Sophie Laurent",
    country: "CA",
    revenue: 11_000,
    payouts: 3_300,
  },
  {
    name: "Hiroshi Tanaka",
    country: "JP",
    revenue: 19_200,
    payouts: 5_700,
  },
  {
    name: "Elias Weber",
    country: "DE",
    revenue: 783,
    payouts: 235,
  },
  {
    name: "Liam Carter",
    country: "US",
    revenue: 30_000,
    payouts: 9_200,
  },
];

export function PartnersGraphic({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none relative size-full dark:opacity-80",
        className,
      )}
      aria-hidden
    >
      <div className="absolute left-0 top-0 grid grid-cols-[repeat(2,180px)]">
        {PARTNERS.map((partner, idx) => (
          <div key={idx} className="h-[60px] w-[180px] p-[3px]">
            <div className="flex size-full select-none overflow-hidden rounded border border-border-subtle bg-bg-default">
              {partner && (
                <>
                  <div
                    key={idx}
                    className="aspect-square h-full bg-bg-emphasis"
                    style={{
                      backgroundImage:
                        "url(https://assets.dub.co/partners/partner-images.jpg)",
                      backgroundSize: "1400%", // 14 images
                      backgroundPositionX: (14 - (idx % 14)) * 100 + "%",
                    }}
                  />
                  <div className="flex h-full flex-col justify-between border-l border-border-subtle px-2 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <img
                        alt="US Flag"
                        src={`https://flag.vercel.app/m/${partner.country}.svg`}
                        className="h-2.5 w-3 rounded-sm border-[0.5px] border-black/15"
                      />
                      <span className="text-[9px] font-medium text-content-default">
                        {partner.name}
                      </span>
                    </div>
                    <div className="flex divide-x divide-border-subtle">
                      {(["revenue", "payouts"] as const).map((key, idx) => (
                        <div
                          key={key}
                          className={cn(
                            "flex flex-col",
                            idx === 0 ? "pr-4" : "pl-4",
                          )}
                        >
                          <span className="text-[6px] font-medium text-content-muted">
                            {capitalize(key)}
                          </span>
                          <span className="text-[9px] font-medium text-content-default">
                            ${nFormatter(partner[key])}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
