import type { AuthMethod } from "@/ui/auth/login/login-form";

// NEXT_PUBLIC_* is inlined at build time, so these must be passed as Docker build
// args. Setting them only in the runtime environment leaves the defaults compiled in.

const ALL_AUTH_METHODS = [
  "google",
  "github",
  "email",
  "saml",
  "password",
] as const satisfies readonly AuthMethod[];

const SIGN_UP_AUTH_METHODS = ["email", "google", "github"] as const;

export type SignUpAuthMethod = (typeof SIGN_UP_AUTH_METHODS)[number];

const DEFAULT_AUTH_METHODS: AuthMethod[] = ["google", "email"];

const isAuthMethod = (value: string): value is AuthMethod =>
  (ALL_AUTH_METHODS as readonly string[]).includes(value);

const isSignUpAuthMethod = (value: AuthMethod): value is SignUpAuthMethod =>
  (SIGN_UP_AUTH_METHODS as readonly string[]).includes(value);

function parseAuthMethods(value: string | undefined): AuthMethod[] {
  if (!value) {
    return DEFAULT_AUTH_METHODS;
  }

  const methods = value
    .split(",")
    .map((method) => method.trim().toLowerCase())
    .filter(isAuthMethod);

  return methods.length > 0 ? methods : DEFAULT_AUTH_METHODS;
}

// Comma-separated, e.g. "google,email". Unrecognized entries are dropped.
export const AUTH_METHODS = parseAuthMethods(
  process.env.NEXT_PUBLIC_AUTH_METHODS,
);

export const SIGN_UP_METHODS = AUTH_METHODS.filter(isSignUpAuthMethod);

// Set to "false" on deployments without Stripe, which hides the billing UI and 404s
// the billing routes. Any other value (including unset) leaves billing enabled.
export const BILLING_ENABLED =
  process.env.NEXT_PUBLIC_BILLING_ENABLED !== "false";
