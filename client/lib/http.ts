import { SERVER_URL } from "@/constants";

type JsonInit = RequestInit & { json?: unknown };

/**
 * Wraps fetch() for our API: prefixes SERVER_URL and, when `json` is given,
 * serializes it and sets the JSON content-type header (pass `body` directly
 * instead for non-JSON payloads like FormData). Callers keep their own
 * ok-check/error-handling since it varies per endpoint (throw vs. return an
 * {errors} shape vs. return undefined).
 */
export function apiFetch(path: string, init: JsonInit = {}) {
  const { json, headers, body, ...rest } = init;

  return fetch(`${SERVER_URL}${path}`, {
    ...rest,
    headers:
      json !== undefined
        ? { "Content-Type": "application/json", ...headers }
        : headers,
    body: json !== undefined ? JSON.stringify(json) : body,
  });
}
