import type { Page, Request } from '@playwright/test';

type VerifyJsonSchemaResponseOptions = {
  minRequestCount?: number;
  expectedSchemaName?: string;
  requireJsonSchema?: boolean;
};

export type CapturedJsonSchemaResponseUpdate = {
  requestCount: number;
  requestBody: Record<string, unknown>;
  responseType: Record<string, unknown>;
};

const VERSION_UPDATE_URL_PATTERN = /\/api\/versions\/[a-f0-9]+(?:\?|$)/i;

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function readRequestBody(request: { postDataJSON: () => unknown; postData: () => string | null }): Record<string, unknown> {
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

function parseJsonSchemaResponseTypeFromBody(body: Record<string, unknown>): Record<string, unknown> {
  const configuration = asRecord(body.configuration);
  if (!configuration) {
    throw new Error('JSON schema response update request does not contain configuration object');
  }

  const responseTypeValue = configuration.response_type ?? configuration.responseType;
  const responseType = asRecord(responseTypeValue);

  if (!responseType) {
    throw new Error('JSON schema response update request does not contain response_type object');
  }

  if (responseType.type !== 'json_schema') {
    throw new Error(`Expected response_type.type to be "json_schema" but got "${String(responseType.type)}"`);
  }

  return responseType;
}

async function captureJsonSchemaResponseUpdates(
  page: Page,
  action: () => Promise<void>,
  minRequestCount: number,
): Promise<CapturedJsonSchemaResponseUpdate> {
  const capturedBodies: Record<string, unknown>[] = [];

  const handleRequest = (request: Request) => {
    if (request.method() !== 'PUT' || !VERSION_UPDATE_URL_PATTERN.test(request.url())) {
      return;
    }

    const body = readRequestBody(request);

    try {
      parseJsonSchemaResponseTypeFromBody(body);
      capturedBodies.push(body);
    } catch {
      // Ignore unrelated version update requests.
    }
  };

  page.on('request', handleRequest);

  try {
    await action();
  } finally {
    page.off('request', handleRequest);
  }

  if (capturedBodies.length < minRequestCount) {
    throw new Error(
      `Expected at least ${minRequestCount} JSON schema response update request(s), but captured ${capturedBodies.length}`,
    );
  }

  const requestBody = capturedBodies[capturedBodies.length - 1];

  return {
    requestCount: capturedBodies.length,
    requestBody,
    responseType: parseJsonSchemaResponseTypeFromBody(requestBody),
  };
}

export async function verifyJsonSchemaResponseApiUpdate(
  page: Page,
  action: () => Promise<void>,
  options: VerifyJsonSchemaResponseOptions = {},
): Promise<CapturedJsonSchemaResponseUpdate> {
  const { minRequestCount = 1, expectedSchemaName, requireJsonSchema = false } = options;

  const captured = await captureJsonSchemaResponseUpdates(page, action, minRequestCount);

  const jsonSchema = asRecord(captured.responseType.json_schema);

  if (requireJsonSchema && !jsonSchema) {
    throw new Error('Expected response_type.json_schema object in API payload, but it was missing');
  }

  if (expectedSchemaName) {
    const actualName = String(jsonSchema?.name ?? '');
    if (actualName !== expectedSchemaName) {
      throw new Error(`Schema name mismatch in API payload. Expected: "${expectedSchemaName}". Actual: "${actualName}"`);
    }
  }

  return captured;
}
