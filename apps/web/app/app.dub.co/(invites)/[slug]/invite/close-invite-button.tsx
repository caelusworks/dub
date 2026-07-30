import { X } from "@/ui/shared/icons";
import { Button } from "@dub/ui";
import Link from "next/link";

export function CloseInviteButton({
  goToOnboarding,
  variant = "x",
}: {
  goToOnboarding?: boolean;
  variant?: "x" | "full";
}) {
  return (
    <Link href={goToOnboarding ? "/onboarding" : "/"}>
      <Button
        variant={variant === "x" ? "outline" : "primary"}
        icon={
          variant === "x" ? (
            <X className="size-5 text-content-subtle" />
          ) : undefined
        }
        className={
          variant === "x"
            ? "size-8 p-0 active:scale-95"
            : "h-9 w-fit rounded-lg"
        }
        text={variant === "x" ? undefined : "Go back"}
      />
    </Link>
  );
}
