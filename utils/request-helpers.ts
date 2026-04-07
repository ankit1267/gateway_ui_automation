/**
 * Shared request parsing helpers used across API verification utilities.
 */

export function readRequestBody(request: { postDataJSON: () => unknown; postData: () => string | null }): Record<string, unknown> {
  try {
    const body = request.postDataJSON();
    if (body && typeof body === 'object' && !Array.isArray(body)) {
      return body as Record<string, unknown>;
    }
  } catch {
    const raw = request.postData();
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return {};
    }
  }

  return {};
}

export function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

export const VERSION_UPDATE_URL_PATTERN = /\/api\/versions\/[a-f0-9]+(?:\?|$)/i;
