import { PropsWithChildren } from "react";

export function SettingsRow({
  heading,
  description,
  id,
  children,
}: PropsWithChildren<{
  heading: string;
  description: string;
  id?: string;
}>) {
  return (
    <div
      id={id}
      className="grid scroll-mt-12 grid-cols-1 gap-10 px-6 py-8 @2xl/page:grid-cols-2 lg:gap-16"
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold leading-none text-content-emphasis">
          {heading}
        </h3>
        <p className="text-sm text-content-subtle">{description}</p>
      </div>

      <div>{children}</div>
    </div>
  );
}
