import { Index } from "@upstash/vector";

// constructed at module scope and throws on a missing token, which fails `next build`
// at page-data collection; only used by dub's internal AI support chat
export const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL || "http://localhost",
  token: process.env.UPSTASH_VECTOR_REST_TOKEN || "unset",
});
