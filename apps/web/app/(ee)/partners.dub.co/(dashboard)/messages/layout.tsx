"use client";

import { useProgramMessages } from "@/lib/messages/hooks/use-program-messages";
import { NavButton } from "@/ui/layout/page-content/nav-button";
import { MessagesContext, MessagesPanel } from "@/ui/messages/messages-context";
import { MessagesList } from "@/ui/messages/messages-list";
import { ProgramSelector } from "@/ui/partners/program-selector";
import { Button, InfoTooltip, useRouterStuff } from "@dub/ui";
import { Msgs, Pen2 } from "@dub/ui/icons";
import { useParams, useRouter } from "next/navigation";
import { CSSProperties, ReactNode, useEffect, useState } from "react";

export default function MessagesLayout({ children }: { children: ReactNode }) {
  const { programSlug } = useParams() as { programSlug?: string };

  const router = useRouter();
  const { searchParams } = useRouterStuff();

  const { programMessages, isLoading, error } = useProgramMessages({
    query: { messagesLimit: 1 },
  });

  const [currentPanel, setCurrentPanel] = useState<MessagesPanel>(
    programSlug ? "main" : "index",
  );

  useEffect(() => {
    searchParams.get("new") && setCurrentPanel("main");
  }, [searchParams.get("new")]);

  return (
    <MessagesContext.Provider value={{ currentPanel, setCurrentPanel }}>
      <div className="h-[calc(100dvh-var(--page-top-margin)-var(--page-bottom-margin)-1px)] w-full overflow-hidden rounded-t-[inherit] bg-white @container/page">
        <div
          className="grid h-full translate-x-[calc(var(--current-panel)*-100%)] grid-cols-[100%_100%] @[800px]/page:translate-x-0 @[800px]/page:grid-cols-[min-content_minmax(340px,1fr)]"
          style={
            {
              "--current-panel": { index: 0, main: 1 }[currentPanel],
            } as CSSProperties
          }
        >
          {/* Left panel - 800px/messages list */}
          <div className="flex w-full flex-col overflow-hidden @[800px]/page:w-[280px] @[960px]/page:w-[340px]">
            <div className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-border-subtle px-4 sm:h-16 sm:px-6">
              <div className="flex min-w-0 items-center gap-4">
                <NavButton />
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold leading-7 text-content-emphasis">
                    Messages
                  </h1>
                  <InfoTooltip
                    content={
                      "Use the messaging center to communicate with the programs you partner with and stay up to date with their latest updates. [Learn more](https://dub.co/help/article/communicating-with-programs)"
                    }
                  />
                </div>
              </div>
              <ProgramSelector
                selectedProgramSlug={programSlug ?? null}
                setSelectedProgramSlug={(slug) =>
                  router.push(`/messages/${slug}`)
                }
                trigger={
                  <Button
                    type="button"
                    variant="secondary"
                    icon={<Pen2 className="size-4" />}
                    className="size-8 rounded-lg p-0"
                  />
                }
                matchTriggerWidth={false}
                optionClassName="sm:max-w-[320px]"
              />
            </div>
            <div className="grow overflow-y-auto scrollbar-hide">
              {programMessages?.length || isLoading ? (
                <MessagesList
                  groupedMessages={programMessages?.map(
                    ({ program, messages }) => ({
                      id: program.slug,
                      name: program.name,
                      image: program.logo,
                      messages,
                      href: `/messages/${program.slug}`,
                      unread: messages.some(
                        (message) =>
                          !message.senderPartnerId && !message.readInApp,
                      ),
                    }),
                  )}
                  activeId={programSlug}
                />
              ) : error ? (
                <div className="flex size-full items-center justify-center text-sm text-content-subtle">
                  Failed to load messages
                </div>
              ) : (
                <div className="flex size-full flex-col items-center justify-center px-4">
                  <Msgs className="size-10 text-black" />
                  <div className="mt-6 max-w-64 text-center">
                    <span className="text-base font-semibold text-content-emphasis">
                      You don't have any messages
                    </span>
                    <p className="text-sm font-medium text-content-subtle">
                      When you receive a new message, it will appear here. You
                      can also start a conversation at any time.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="size-full min-h-0 border-border-subtle @[800px]/page:border-l">
            {children}
          </div>
        </div>
      </div>
    </MessagesContext.Provider>
  );
}
