import type { Page, Request } from '@playwright/test';

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

const VERSION_UPDATE_URL_PATTERN = /\/api\/versions\/[a-f0-9]+(?:\?|$)/i;

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
    await page.waitForTimeout(5000);
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

  if (expected.role !== undefined && captured.prompt.role !== expected.role) {
    throw new Error(`Role mismatch in prompt API payload. Expected: "${expected.role}". Actual: "${captured.prompt.role}"`);
  }

  return captured;
}

export async function fillAllPromptFieldsAndVerifyApi(
  page: Page,
  action: () => Promise<void>,
  expected: Required<PromptFields>,
): Promise<CapturedPromptUpdate> {
  const captured = await capturePromptUpdates(page, action, 1);

  if (captured.prompt.role !== expected.role) {
    throw new Error(`Role mismatch. Expected: "${expected.role}". Actual: "${captured.prompt.role}"`);
  }

  if (captured.prompt.goal !== expected.goal) {
    throw new Error(`Goal mismatch. Expected: "${expected.goal}". Actual: "${captured.prompt.goal}"`);
  }

  if (captured.prompt.instruction !== expected.instruction) {
    throw new Error(`Instruction mismatch. Expected: "${expected.instruction}". Actual: "${captured.prompt.instruction}"`);
  }

  return captured;
}
