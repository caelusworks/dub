import { cn } from "@dub/utils";
import Markdown from "react-markdown";

export function BlockMarkdown({
  className,
  children,
}: {
  className?: string;
  children: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none",
        "prose-bullet:text-red-500 prose-headings:leading-tight",
        "prose-a:font-medium prose-a:text-neutral-500 hover:prose-a:text-neutral-600",
        "prose-ul:pl-[1.5em] marker:prose-ul:text-neutral-700 [&_ul>li]:pl-0",
        className,
      )}
      dir="auto"
    >
      <Markdown
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}
