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
    // action() includes blur + expectSavedVisible which already waits for each PUT.
    // Poll briefly for the minimum captured request count (requests fire during action).
    await expect(async () => {
      expect(capturedBodies.length).toBeGreaterThanOrEqual(minRequestCount);
    }).toPass({ timeout: 10000 });
  } finally {
    page.off('request', handleRequest);
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
  // Each field (role, goal, instruction) triggers a separate PUT on blur.
  // Wait for all 3 requests so we verify the final state.
  const captured = await capturePromptUpdates(page, action, 3);

  expect(captured.prompt.role, 'Role mismatch in prompt API payload').toBe(expected.role);
  expect(captured.prompt.goal, 'Goal mismatch in prompt API payload').toBe(expected.goal);
  expect(captured.prompt.instruction, 'Instruction mismatch in prompt API payload').toBe(expected.instruction);

  return captured;
}
