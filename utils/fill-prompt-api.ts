import type { Page, Request } from '@playwright/test';
import { expect } from '../fixtures/base.fixture';
import { readRequestBody, VERSION_UPDATE_URL_PATTERN } from './request-helpers';

export type PromptFields = {
  role?: string;
  goal?: string;
  instruction?: string;
};

type VerifyFillPromptOptions = {
  minRequestCount?: number;
};

type CapturedPromptUpdate = {
  requestCount: number;
  requestBody: Record<string, unknown>;
  prompt: PromptFields;
};

function parsePromptFromBody(body: Record<string, unknown>): PromptFields {
  const configuration = body.configuration as Record<string, unknown> | undefined;
  const prompt = configuration?.prompt;

  if (!prompt || typeof prompt !== 'object' || Array.isArray(prompt)) {
    throw new Error('Prompt update request does not contain configuration.prompt object');
  }

  const promptObj = prompt as Record<string, unknown>;

  return {
    role: String(promptObj.role ?? ''),
    goal: String(promptObj.goal ?? ''),
    instruction: String(promptObj.instruction ?? ''),
  };
}

async function capturePromptUpdates(
  page: Page,
  action: () => Promise<void>,
  minRequestCount: number,
): Promise<CapturedPromptUpdate> {
  const capturedBodies: Record<string, unknown>[] = [];

  const handleRequest = (request: Request) => {
    if (request.method() !== 'PUT') {
      return;
    }

    if (!VERSION_UPDATE_URL_PATTERN.test(request.url())) {
      return;
    }

    const body = readRequestBody(request);
    const configuration = body.configuration as Record<string, unknown> | undefined;

    if (configuration?.prompt && typeof configuration.prompt === 'object' && !Array.isArray(configuration.prompt)) {
      capturedBodies.push(body);
    }
  };

  page.on('request', handleRequest);

  try {
    await action();
    // Wait for the actual API response instead of arbitrary timeout
    await page.waitForResponse(
      (resp) =>
        VERSION_UPDATE_URL_PATTERN.test(resp.url()) &&
        resp.request().method() === 'PUT' &&
        resp.status() === 200,
      { timeout: 15000 }
    );
  } finally {
    page.off('request', handleRequest);
  }

  if (capturedBodies.length < minRequestCount) {
    throw new Error(
      `Expected at least ${minRequestCount} prompt update request(s), but captured ${capturedBodies.length}`,
    );
  }

  const requestBody = capturedBodies[capturedBodies.length - 1];

  return {
    requestCount: capturedBodies.length,
    requestBody,
    prompt: parsePromptFromBody(requestBody),
  };
}

export async function fillPromptAndVerifyApi(
  page: Page,
  action: () => Promise<void>,
  expected: PromptFields,
  options: VerifyFillPromptOptions = {},
): Promise<CapturedPromptUpdate> {
  const { minRequestCount = 1 } = options;
  const captured = await capturePromptUpdates(page, action, minRequestCount);

  if (expected.role !== undefined) {
    expect(captured.prompt.role, 'Role mismatch in prompt API payload').toBe(expected.role);
  }

  return captured;
}

export async function fillAllPromptFieldsAndVerifyApi(
  page: Page,
  action: () => Promise<void>,
  expected: Required<PromptFields>,
): Promise<CapturedPromptUpdate> {
  const captured = await capturePromptUpdates(page, action, 1);

  expect(captured.prompt.role, 'Role mismatch in prompt API payload').toBe(expected.role);
  expect(captured.prompt.goal, 'Goal mismatch in prompt API payload').toBe(expected.goal);
  expect(captured.prompt.instruction, 'Instruction mismatch in prompt API payload').toBe(expected.instruction);

  return captured;
}
