"use client";

import { useMessagesContext } from "@/ui/messages/messages-context";
import { ChevronLeft, Msgs } from "@dub/ui/icons";

export function PartnerMessagesPageClient() {
  const { setCurrentPanel } = useMessagesContext();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 items-center gap-2 border-b border-border-subtle px-4 sm:h-16 sm:px-6">
        <button
          type="button"
          onClick={() => {
            setCurrentPanel("index");
          }}
          className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 @[800px]/page:hidden"
        >
          <ChevronLeft className="size-3.5" />
        </button>
      </div>

      <div className="flex grow flex-col items-center justify-center gap-4">
        <Msgs className="size-10 text-content-muted" />
        <p className="text-sm font-medium text-content-muted">
          Select or compose a message
        </p>
      </div>
    </div>
  );
}
