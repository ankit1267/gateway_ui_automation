import type { Page, Request } from '@playwright/test';
import { expect } from '../fixtures/base.fixture';
import { readRequestBody, asRecord, VERSION_UPDATE_URL_PATTERN } from './request-helpers';

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
    // Only wait for response if we expect at least 1 request
    if (minRequestCount > 0) {
      await page.waitForResponse(
        (resp) =>
          VERSION_UPDATE_URL_PATTERN.test(resp.url()) &&
          resp.request().method() === 'PUT' &&
          resp.status() === 200,
        { timeout: 10000 }
      );
    }
  } catch {
    // Timeout or error - no API call was made, which is OK if minRequestCount is 0
  } finally {
    page.off('request', handleRequest);
  }

  if (capturedBodies.length < minRequestCount) {
    // If no requests were captured but minRequestCount is 0, return empty result
    if (capturedBodies.length === 0 && minRequestCount === 0) {
      return {
        requestCount: 0,
        requestBody: {} as Record<string, unknown>,
        responseType: {} as Record<string, unknown>,
      };
    }
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

  if (requireJsonSchema) {
    expect(jsonSchema, 'Expected response_type.json_schema object in API payload').toBeDefined();
  }

  if (expectedSchemaName) {
    const actualName = String(jsonSchema?.name ?? '');
    expect(actualName, 'Schema name mismatch in API payload').toBe(expectedSchemaName);
  }

  return captured;
}
