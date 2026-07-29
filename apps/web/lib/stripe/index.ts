import Stripe from "stripe";
import { StripeMode } from "../types";

export const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2025-05-28.basil",
  appInfo: {
    name: "Dub.co",
    version: "0.1.0",
  },
});

const secretMap: Record<StripeMode, string | undefined> = {
  live: process.env.STRIPE_APP_SECRET_KEY,
  test: process.env.STRIPE_APP_SECRET_KEY_TEST,
  sandbox: process.env.STRIPE_APP_SECRET_KEY_SANDBOX,
};

// Stripe Integration App client
export const stripeAppClient = ({ mode }: { mode?: StripeMode }) => {
  const appSecretKey = secretMap[mode ?? "live"];

  // several importer modules construct this at module scope, and Stripe throws on a
  // falsy key — which fails `next build` at page-data collection when billing is unused
  return new Stripe(appSecretKey || "sk_unset", {
    apiVersion: "2025-05-28.basil",
    appInfo: {
      name: "Dub.co",
      version: "0.1.0",
    },
  });
};

export function isStripeRateLimitError(
  error: unknown,
): error is Stripe.errors.StripeError {
  if (!(error instanceof Stripe.errors.StripeError)) {
    return false;
  }

  return (
    error instanceof Stripe.errors.StripeRateLimitError ||
    error.statusCode === 429 ||
    error.code === "lock_timeout"
  );
}
