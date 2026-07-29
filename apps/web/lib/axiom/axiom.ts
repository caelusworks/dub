import { Axiom } from "@axiomhq/js";

// logging to Axiom is opt-in (see isAxiomEnabled in ./server); the placeholder just
// stops the SDK warning on every request when it isn't configured
export const axiomClient = new Axiom({
  token: process.env.AXIOM_TOKEN || "unset",
});
