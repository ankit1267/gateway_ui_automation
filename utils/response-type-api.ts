import type { Page, Request } from '@playwright/test';

export type ResponseTypeValue = 'default' | 'text' | 'json_object' | 'json_schema' | 'widget';

type VerifyResponseTypeOptions = {
  minRequestCount?: number;
};

type CapturedResponseTypeUpdate = {
  requestCount: number;
  requestBody: Record<string, unknown>;
  responseType: ResponseTypeValue;
};

const VERSION_UPDATE_URL_PATTERN = /\/api\/versions\/[a-f0-9]+(?:\?|$)/i;

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

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function asResponseType(value: unknown): ResponseTypeValue | undefined {
  const valid: ResponseTypeValue[] = ['default', 'text', 'json_object', 'json_schema', 'widget'];

  if (typeof value === 'string' && valid.includes(value as ResponseTypeValue)) {
    return value as ResponseTypeValue;
  }

  const valueObj = asRecord(value);
  const typeFromObject = valueObj?.type;

  if (typeof typeFromObject === 'string' && valid.includes(typeFromObject as ResponseTypeValue)) {
    if (typeFromObject === 'json_schema' && valueObj?.is_template === true) {
      // MCP verification showed widget selection can be persisted as json_schema template payload.
      return 'widget';
    }

    return typeFromObject as ResponseTypeValue;
  }

  return undefined;
}

function parseResponseTypeFromBody(body: Record<string, unknown>): ResponseTypeValue {
  const configuration = asRecord(body.configuration);
  if (!configuration) {
    throw new Error('Response type update request does not contain configuration object');
  }

  const prompt = asRecord(configuration.prompt);
  const responseFormat = asRecord(configuration.response_format);
  const responseFormatCamel = asRecord(configuration.responseFormat);

  const candidates: unknown[] = [
    prompt?.type,
    prompt?.response_type,
    prompt?.responseType,
    configuration.response_type,
    configuration.responseType,
    responseFormat?.type,
    responseFormat?.response_type,
    responseFormatCamel?.type,
  ];

  for (const candidate of candidates) {
    const parsed = asResponseType(candidate);
    if (parsed) {
      return parsed;
    }
  }

  throw new Error(
    'Response type update request does not contain a recognized response type key in configuration payload',
  );
}

async function captureResponseTypeUpdates(
  page: Page,
  action: () => Promise<void>,
  minRequestCount: number,
): Promise<CapturedResponseTypeUpdate> {
  const capturedBodies: Record<string, unknown>[] = [];

  const handleRequest = (request: Request) => {
    if (request.method() !== 'PUT' || !VERSION_UPDATE_URL_PATTERN.test(request.url())) {
      return;
    }

    const body = readRequestBody(request);

    try {
      parseResponseTypeFromBody(body);
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
      `Expected at least ${minRequestCount} response type update request(s), but captured ${capturedBodies.length}`,
    );
  }

  const requestBody = capturedBodies[capturedBodies.length - 1];

  return {
    requestCount: capturedBodies.length,
    requestBody,
    responseType: parseResponseTypeFromBody(requestBody),
  };
}

export async function selectResponseTypeAndVerifyApi(
  page: Page,
  action: () => Promise<void>,
  expectedResponseType: ResponseTypeValue,
  options: VerifyResponseTypeOptions = {},
): Promise<CapturedResponseTypeUpdate> {
  const { minRequestCount = 1 } = options;

  const captured = await captureResponseTypeUpdates(page, action, minRequestCount);

  if (captured.responseType !== expectedResponseType) {
    throw new Error(
      `Response type mismatch in API payload. Expected: "${expectedResponseType}". Actual: "${captured.responseType}"`,
    );
  }

  return captured;
}
