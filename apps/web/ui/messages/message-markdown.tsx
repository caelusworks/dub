import { cn } from "@dub/utils";
import ReactMarkdown from "react-markdown";
import "react-medium-image-zoom/dist/styles.css";
import remarkGfm from "remark-gfm";
import { ZoomImage } from "../shared/zoom-image";

export function MessageMarkdown({
  children,
  components,
  invert = false,
}: {
  children: string;
  components?: any;
  invert?: boolean;
}) {
  return (
    <ReactMarkdown
      className={cn(
        "prose prose-sm prose-neutral max-w-none transition-all",
        "prose-headings:border-b prose-headings:pb-2 prose-headings:font-semibold",
        "prose-h1:mb-4 prose-h1:mt-8 prose-h1:text-2xl prose-h1:font-bold",
        "prose-h2:mb-3 prose-h2:mt-6 prose-h2:text-xl prose-h2:font-semibold",
        "prose-h3:mb-2 prose-h3:mt-4 prose-h3:text-lg prose-h3:font-semibold",
        "prose-h4:mb-1 prose-h4:mt-3 prose-h4:text-base prose-h4:font-semibold",
        "prose-p:m-2.5 prose-p:mb-4 prose-p:leading-5",
        "prose-a:font-medium prose-a:underline prose-a:underline-offset-2",
        "prose-strong:font-semibold",
        "prose-em:italic",
        "prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-xs",
        "prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:py-3 prose-pre:pl-3 prose-pre:pr-9",
        "prose-pre:code:bg-transparent prose-pre:code:p-0 prose-pre:code:text-sm",
        "prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic",
        "prose-ul:list-disc prose-ul:pl-8",
        "prose-ol:list-decimal prose-ol:pl-8",
        "prose-li:mb-1 prose-li:leading-5",
        "prose-hr:my-8",
        "prose-img:border-1 prose-img:rounded-lg",
        invert
          ? [
              "prose-headings:border-neutral-600 prose-headings:text-white",
              "prose-p:text-neutral-200",
              "prose-a:text-neutral-300 hover:prose-a:text-neutral-100",
              "prose-strong:text-white",
              "prose-em:text-neutral-200",
              "prose-code:bg-neutral-800 prose-code:text-neutral-100",
              "prose-pre:border-neutral-600 prose-pre:bg-neutral-800",
              "prose-blockquote:border-neutral-500 prose-blockquote:text-neutral-300",
              "prose-ul:text-neutral-200",
              "prose-ol:text-neutral-200",
              "prose-hr:border-neutral-600",
              "prose-img:border-neutral-600",
            ]
          : [
              "prose-headings:border-neutral-200 prose-headings:text-neutral-900",
              "prose-p:text-neutral-700",
              "prose-a:text-neutral-600 hover:prose-a:text-neutral-700",
              "prose-strong:text-neutral-900",
              "prose-em:text-neutral-700",
              "prose-code:bg-neutral-100 prose-code:text-neutral-800",
              "prose-pre:border-neutral-200 prose-pre:bg-neutral-50",
              "prose-blockquote:border-neutral-300 prose-blockquote:text-neutral-600",
              "prose-ul:text-neutral-700",
              "prose-ol:text-neutral-700",
              "prose-hr:border-neutral-200",
              "prose-img:border-neutral-200",
            ],
      )}
      allowedElements={[
        "p",
        "a",
        "code",
        "pre",
        "strong",
        "em",
        "ul",
        "ol",
        "li",
        "blockquote",
        "hr",
      ]}
      components={{
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer" />
        ),
        img: ({ node, ...props }) => <ZoomImage {...props} />,
        p: ({ node, children, ...props }) => {
          // Check if paragraph only contains images (which render as divs via ZoomImage)
          // to avoid invalid <p><div></div></p> nesting
          const hasOnlyImages = node?.children?.every(
            (child: any) => child.tagName === "img",
          );

          if (hasOnlyImages) {
            return <div {...props}>{children}</div>;
          }

          return <p {...props}>{children}</p>;
        },
        ...components,
      }}
      remarkPlugins={[remarkGfm] as any}
    >
      {children}
    </ReactMarkdown>
  );
}
