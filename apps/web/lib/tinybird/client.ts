import { NoopTinybird, Tinybird } from "@chronark/zod-bird";

// analytics are optional in this deployment: without a key, NoopTinybird returns
// empty result sets rather than throwing on every pipe query
export const tb = process.env.TINYBIRD_API_KEY
  ? new Tinybird({
      token: process.env.TINYBIRD_API_KEY,
      baseUrl: process.env.TINYBIRD_API_URL as string,
    })
  : new NoopTinybird();
