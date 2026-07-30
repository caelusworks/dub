"use client";

import { TREMENDOUS_MAX_PAYOUT_AMOUNT_CENTS } from "@/lib/tremendous/constants";
import { AlertCircleFill } from "@/ui/shared/icons";
import {
  AnimatedSizeContainer,
  Badge,
  Button,
  Gift,
  MoneyBill,
  Tooltip,
  useMediaQuery,
} from "@dub/ui";
import { cn, currencyFormatter } from "@dub/utils/src";
import { OTPInput } from "input-otp";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import type { ComponentType, Dispatch, FormEvent, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useEmbedToken } from "../use-embed-token";
import { useReferralsEmbedData } from "./page-client";

type GiftCardPanel = "collapsed" | "email" | "verify";

function PayoutMethodButton({
  text,
  variant,
  className,
  disabled,
  disabledTooltip,
  onClick,
}: {
  text: string;
  variant: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
  disabledTooltip?: string;
  onClick?: () => void;
}) {
  if (disabledTooltip) {
    return (
      <Tooltip
        content={disabledTooltip}
        contentClassName="text-content-default dark:prose-invert dark:prose-a:text-neutral-400 dark:hover:prose-a:text-neutral-300"
      >
        <div
          className={cn(
            "flex cursor-not-allowed items-center justify-center whitespace-nowrap rounded-lg border border-border-subtle bg-bg-subtle text-sm text-content-subtle",
            className,
          )}
        >
          {text}
        </div>
      </Tooltip>
    );
  }

  return (
    <Button
      className={className}
      text={text}
      variant={variant}
      disabled={disabled}
      onClick={onClick}
    />
  );
}

function SettingsErrorAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="border-border-error mb-3 flex items-start gap-2 rounded-lg border bg-bg-error px-3 py-2.5 text-content-error"
    >
      <AlertCircleFill className="mt-0.5 size-4 shrink-0" />
      <p className="text-sm font-medium leading-5">{message}</p>
    </div>
  );
}

function TremendousEmailForm({
  initialEmail,
  onSuccess,
  errorMessage,
  setErrorMessage,
}: {
  initialEmail: string;
  onSuccess: (email: string) => void;
  errorMessage: string | null;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
}) {
  const token = useEmbedToken();
  const [email, setEmail] = useState(initialEmail);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage("Please enter an email address.");
      return;
    }

    setIsSendingOtp(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/embed/referrals/tremendous/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result.error?.message ?? "Something went wrong. Please try again.",
        );
        return;
      }

      onSuccess(email);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div className="border-t border-border-subtle bg-bg-muted p-3">
      {errorMessage && <SettingsErrorAlert message={errorMessage} />}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-3"
        noValidate={false}
      >
        <div className="min-w-0 flex-1 space-y-1.5">
          <label
            htmlFor="tremendous-email"
            className="block text-sm font-medium text-content-emphasis"
          >
            Email
          </label>
          <input
            id="tremendous-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage(null);
            }}
            placeholder="panic@thedis.co"
            required
            className="h-9 w-full rounded-lg border border-border-subtle bg-bg-default px-3 text-sm text-content-default focus:border-border-emphasis focus:outline-none focus:ring-neutral-500 dark:focus:border-neutral-400 dark:focus:ring-neutral-400"
          />
        </div>
        <Button
          type="submit"
          text={isSendingOtp ? "Saving..." : "Save"}
          className="h-9 w-fit shrink-0 rounded-lg px-4"
          loading={isSendingOtp}
        />
      </form>
    </div>
  );
}

function TremendousOtpVerifyForm({
  email,
  onSuccess,
  errorMessage,
  setErrorMessage,
}: {
  email: string;
  onSuccess: () => void;
  errorMessage: string | null;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
}) {
  const router = useRouter();
  const token = useEmbedToken();
  const { isMobile } = useMediaQuery();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyOtp = async () => {
    if (code.length !== 6) {
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        "/api/embed/referrals/tremendous/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, code }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result.error?.message ?? "Something went wrong. Please try again.",
        );
        setCode("");
        return;
      }

      router.refresh();
      onSuccess();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="border-t border-border-subtle bg-bg-muted p-3">
      {errorMessage && <SettingsErrorAlert message={errorMessage} />}
      <p className="text-sm text-content-subtle">
        Enter the six digit verification code sent to{" "}
        <span className="font-medium text-content-default">{email}</span>
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <OTPInput
          maxLength={6}
          value={code}
          onChange={(value) => {
            setCode(value);
            setErrorMessage(null);
          }}
          autoFocus={!isMobile}
          render={({ slots }) => (
            <div className="flex items-center gap-1.5">
              {slots.map(({ char, isActive, hasFakeCaret }, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "relative flex size-10 items-center justify-center text-lg font-medium",
                    "rounded-lg border border-border-default bg-bg-default text-content-emphasis transition-all",
                    isActive &&
                      "z-10 border-border-emphasis ring-2 ring-border-emphasis",
                  )}
                >
                  {char}
                  {hasFakeCaret && (
                    <div className="pointer-events-none absolute inset-0 flex animate-caret-blink items-center justify-center">
                      <div className="h-4 w-px bg-content-emphasis" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          onComplete={verifyOtp}
        />
        <Button
          text={isVerifying ? "Verifying..." : "Verify"}
          className="h-9 w-fit shrink-0 rounded-lg"
          loading={isVerifying}
          disabled={code.length !== 6}
          onClick={verifyOtp}
        />
      </div>
    </div>
  );
}

function PayoutMethodCard({
  label,
  icon: Icon,
  isConnected,
  showRecommendedBadge,
  buttonText,
  disabled,
  disabledTooltip,
  onClick,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  isConnected: boolean;
  showRecommendedBadge?: boolean;
  buttonText?: string;
  disabled?: boolean;
  disabledTooltip?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center rounded-lg border border-border-subtle p-3",
        !isConnected && "bg-bg-muted",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border-muted bg-bg-default">
          <Icon className="size-[18px] text-content-emphasis" />
        </div>
        <h2 className="text-sm font-semibold text-content-emphasis">{label}</h2>
        {showRecommendedBadge && (
          <Badge
            variant="blue"
            className="rounded-md px-1 py-0 text-xs font-semibold"
          >
            Recommended
          </Badge>
        )}

        {isConnected && (
          <Badge
            variant="green"
            className="rounded-md px-1 py-0 text-xs font-semibold"
          >
            Connected
          </Badge>
        )}
      </div>

      <PayoutMethodButton
        className="h-8 w-fit shrink-0 rounded-lg px-3 py-2"
        text={buttonText ?? (isConnected ? "Edit" : "Connect")}
        variant={isConnected ? "secondary" : "primary"}
        disabled={disabled}
        disabledTooltip={disabledTooltip}
        onClick={onClick}
      />
    </div>
  );
}

function TremendousGiftCardOption({
  isConnected,
  hasAnyConnected,
  tremendousEmail,
}: {
  isConnected: boolean;
  hasAnyConnected: boolean;
  tremendousEmail: string | null;
}) {
  const [panel, setPanel] = useState<GiftCardPanel>("collapsed");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const disabled = (hasAnyConnected && !isConnected) || isConnected;
  const disabledTooltip = isConnected
    ? `Your payouts are currently connected to ${tremendousEmail ?? "your email"}. Please contact support if you need to update your payout email.`
    : disabled
      ? "This payout method is unavailable because you already have another payout method connected."
      : undefined;

  const isExpanded = panel !== "collapsed";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border-subtle",
        !isConnected && "bg-bg-muted",
        hasAnyConnected && !isConnected && "opacity-50",
      )}
    >
      <div className="flex items-center gap-3 p-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border-muted bg-bg-default">
            <Gift className="size-[18px] text-content-emphasis" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-content-emphasis">
                Gift Cards
              </h2>
              {!hasAnyConnected && (
                <Badge
                  variant="blue"
                  className="rounded-md px-1 py-0 text-xs font-semibold"
                >
                  Recommended
                </Badge>
              )}
              {isConnected && (
                <Badge
                  variant="green"
                  className="rounded-md px-1 py-0 text-xs font-semibold"
                >
                  Connected
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-content-subtle">
              Gift card payouts are limited to{" "}
              {currencyFormatter(TREMENDOUS_MAX_PAYOUT_AMOUNT_CENTS)} per
              payout.
            </p>
          </div>
        </div>

        {!isExpanded ? (
          <PayoutMethodButton
            text={isConnected ? "Edit" : "Connect"}
            className="h-8 w-fit shrink-0 rounded-lg px-3 py-2"
            variant={isConnected ? "secondary" : "primary"}
            disabled={disabled}
            disabledTooltip={disabledTooltip}
            onClick={() => {
              setPanel("email");
              setErrorMessage(null);
            }}
          />
        ) : (
          <Button
            text="Cancel"
            className="h-8 w-fit shrink-0 rounded-lg px-3 py-2"
            variant="secondary"
            onClick={() => {
              setPanel("collapsed");
              setErrorMessage(null);
            }}
          />
        )}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {isExpanded && (
          <motion.div
            key={panel}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatedSizeContainer height>
              {panel === "email" ? (
                <TremendousEmailForm
                  initialEmail={tremendousEmail ?? ""}
                  onSuccess={(email) => {
                    setVerifiedEmail(email);
                    setPanel("verify");
                    setErrorMessage(null);
                  }}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                />
              ) : (
                <TremendousOtpVerifyForm
                  email={verifiedEmail}
                  onSuccess={() => {
                    setPanel("collapsed");
                    setErrorMessage(null);
                  }}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                />
              )}
            </AnimatedSizeContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CashPayoutMethod({
  isConnected,
  hasAnyConnected,
}: {
  isConnected: boolean;
  hasAnyConnected: boolean;
}) {
  const disabled = hasAnyConnected && !isConnected;

  return (
    <PayoutMethodCard
      label="Cash"
      icon={MoneyBill}
      isConnected={isConnected}
      buttonText={isConnected ? "Settings" : "Connect"}
      disabled={disabled}
      disabledTooltip={
        disabled
          ? "This payout method is unavailable because you already have another payout method connected."
          : undefined
      }
      onClick={() => {
        window.open("https://partners.dub.co/payouts?settings=true", "_blank");
      }}
    />
  );
}

export function ReferralsEmbedSettings() {
  const { partner } = useReferralsEmbedData();

  const hasAnyConnected = Boolean(partner.defaultPayoutMethod);
  const isGiftCardConnected = partner.defaultPayoutMethod === "tremendous";
  const isCashConnected = hasAnyConnected && !isGiftCardConnected;

  return (
    <div className="space-y-4 rounded-lg border border-border-muted bg-bg-default p-4 sm:p-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-content-emphasis">
          Payout method
        </h3>
        <p className="text-sm text-content-subtle">
          Select your payout method.{" "}
          <span className="font-medium text-content-default">
            This can&apos;t be changed after a method is connected.
          </span>
        </p>
      </div>

      <div className="space-y-4">
        <TremendousGiftCardOption
          isConnected={isGiftCardConnected}
          hasAnyConnected={hasAnyConnected}
          tremendousEmail={partner.tremendousEmail}
        />
        <CashPayoutMethod
          isConnected={isCashConnected}
          hasAnyConnected={hasAnyConnected}
        />
      </div>
    </div>
  );
}
