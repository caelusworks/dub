"use client";

import { X } from "@/ui/shared/icons";
import { cn } from "@dub/utils";
import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import {
  PageContentHeader,
  PageContentHeaderProps,
} from "./page-content-header";
import { ToggleSidePanelButton } from "./toggle-side-panel-button";

export const PageContentWithSidePanelContext = createContext<{
  isSidePanelOpen: boolean;
  setIsSidePanelOpen: Dispatch<SetStateAction<boolean>>;
}>({
  isSidePanelOpen: false,
  setIsSidePanelOpen: () => {},
});

export function PageContentWithSidePanel({
  className,
  contentWrapperClassName,
  sidePanel,
  children,
  controls,
  individualScrolling,
  ...headerProps
}: PropsWithChildren<
  {
    className?: string;
    contentWrapperClassName?: string;
    sidePanel?: {
      title: ReactNode;
      content: ReactNode;
      controls?: ReactNode;
      defaultOpen?: boolean;
    };
    individualScrolling?: boolean;
  } & PageContentHeaderProps
>) {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(
    sidePanel?.defaultOpen ?? false,
  );

  return (
    <PageContentWithSidePanelContext.Provider
      value={{ isSidePanelOpen, setIsSidePanelOpen }}
    >
      <div
        className={cn(
          "relative grid min-h-[var(--page-height)] grid-cols-[minmax(340px,1fr)_minmax(0,min-content)] rounded-t-[inherit] bg-neutral-100 @container/page-content [--page-height:calc(100dvh-var(--page-top-margin)-var(--page-bottom-margin)-1px)] lg:bg-white",
          individualScrolling && "h-[var(--page-height)]",
          className,
        )}
      >
        <div className="flex min-h-0 flex-col">
          <PageContentHeader
            {...headerProps}
            controls={
              <>
                {controls}
                {sidePanel && (
                  <ToggleSidePanelButton
                    isOpen={isSidePanelOpen}
                    onClick={() => setIsSidePanelOpen((o) => !o)}
                  />
                )}
              </>
            }
          />
          <div
            className={cn(
              "grow rounded-t-[inherit] bg-white pt-3 lg:pt-5",
              individualScrolling && "min-h-0 overflow-y-auto scrollbar-hide",
              contentWrapperClassName,
            )}
          >
            {children}
          </div>
        </div>

        {/* Right side panel - Profile */}
        {sidePanel && (
          <div
            className={cn(
              "absolute right-0 top-0 h-full min-h-0 w-0 overflow-hidden bg-white shadow-lg transition-[width]",
              "@[960px]/page-content:relative @[960px]/page-content:shadow-none",
              isSidePanelOpen &&
                "z-10 w-full @[960px]/page-content:z-auto sm:w-[340px]",
            )}
          >
            <div className="flex size-full min-h-0 w-full flex-col border-l border-border-subtle sm:w-[340px]">
              <div className="box-content flex h-12 shrink-0 items-center justify-between gap-4 border-b border-border-subtle px-4 sm:h-16 sm:px-6">
                <h2 className="text-lg font-semibold leading-7 text-content-emphasis">
                  {sidePanel.title}
                </h2>
                <div className="flex items-center gap-2">
                  {sidePanel.controls}
                  <button
                    type="button"
                    onClick={() => setIsSidePanelOpen(false)}
                    className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 @[960px]/page-content:hidden"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
              <div className="flex grow flex-col gap-4 overflow-y-scroll bg-bg-muted p-6 scrollbar-hide">
                {sidePanel.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContentWithSidePanelContext.Provider>
  );
}
