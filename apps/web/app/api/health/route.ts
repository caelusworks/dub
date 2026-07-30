// Liveness probe for the container healthcheck. Lives under /api so the middleware
// matcher skips it — otherwise the request's Host (127.0.0.1:3000) would miss
// APP_HOSTNAMES and get treated as a short-link lookup.
export const dynamic = "force-dynamic";

export function GET() {
  return new Response("OK", {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}
