# AI Instructions — Writing Playwright Tests for GTWY UI Automation

This document defines how new Playwright test files must be written in this repository. It is derived from reverse-engineering the existing 43+ test spec files and all supporting POM classes.

---

## 1. Project Architecture Summary

| Concern | Pattern |
|---|---|
| **Design pattern** | Page Object Model (POM) with component and modal sub-objects |
| **Language** | TypeScript (ESNext, CommonJS) |
| **Test runner** | `@playwright/test` v1.57+ |
| **Auth** | Google OAuth persisted to `auth.json`, loaded via `storageState` |
| **Fixtures** | Custom fixtures in `fixtures/base.fixture.ts` inject `agents` and `sidepanel` page objects |
| **Selectors** | `data-testid` preferred → `id` → `getByRole` → `getByText` (in that order) |
| **Workers** | Single worker (`workers: 1`) — tests run sequentially |
| **Timeouts** | Test: 120s, Expect: 30s, Action: 15s, Navigation: 30s |

---

## 2. Required Test Style — Fixture-based POM

All new tests **must** use the fixture-based POM style:

```typescript
import { test, expect } from '../../fixtures/base.fixture';

test('TC-XX-01: Description', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(process.env.AGENT_NAME!);
  await agent.tabs.openPrompt();
  await agent.prompt.expectRoleVisible();
});
```

**Characteristics:**
- Imports `test` and `expect` from `fixtures/base.fixture`
- Uses destructured fixtures: `{ agents }`, `{ sidepanel }`, `{ agents, page }`, `{ agents, context }`
- All interactions go through POM methods
- No `test.use({ storageState })` needed — fixture handles it
- No manual `new PageObject(page)` instantiation in most cases

### Codegen Conversion Workflow

Developers will provide **raw Playwright Codegen output** (recorded via `npx playwright codegen`). Your job is to convert it into the fixture-based POM style above.

**Codegen input (what the developer gives you):**

```typescript
import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test('test', async ({ page }) => {
  await page.goto('https://app.gtwy.ai/org/abc123/agents/chatbot');
  await page.getByRole('cell', { name: 'My Agent' }).click();
  await page.getByRole('tab', { name: 'Prompt' }).click();
  await page.getByTestId('prompt-textarea').fill('Be helpful');
  await expect(page.getByTestId('prompt-textarea')).toHaveValue('Be helpful');
});
```

**What you must produce (converted output):**

```typescript
import { test, expect } from '../../fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test('TC-PROMPT-01: Fill prompt textarea with custom value', async ({ agents }) => {
  await agents.goto('chatbot');
  const agent = await agents.openAgent(AGENT_NAME);
  await agent.tabs.openPrompt();

  await agent.prompt.fillInstructions('Be helpful');

  const value = await agent.prompt.getInstructionsValue();
  expect(value).toBe('Be helpful');
});
```

**Conversion rules:**

1. Replace `import { test, expect } from '@playwright/test'` → import from `fixtures/base.fixture`
2. Remove `test.use({ storageState: 'auth.json' })` — fixture handles auth
3. Replace `async ({ page })` → `async ({ agents })` or `async ({ sidepanel })` depending on the feature
4. Replace `page.goto(url)` → `agents.goto('api'|'chatbot')` or `sidepanel.goto*()`
5. Replace inline `page.getByRole(...)` / `page.getByTestId(...)` clicks → POM method calls
6. Replace hardcoded names → `process.env.*` variables
7. Add a descriptive `TC-<FEATURE>-<##>:` test name
8. If no POM method exists for an action, **create one** in the appropriate page/modal/component class

---

## 3. Standard Structure for a New Test File

### Template

```typescript
import { test, expect } from '<relative-path>/fixtures/base.fixture';

// ── Test Data ──────────────────────────────────────────────
const AGENT_NAME = process.env.AGENT_NAME!;

// ── Optional: shared setup ─────────────────────────────────
test.beforeEach(async ({ agents }) => {
  await agents.goto('api');               // or 'chatbot'
});

// ── Tests ──────────────────────────────────────────────────
test.describe('Feature Area - Agent Type', () => {

  test('TC-FEAT-01: Clear one-line description', async ({ agents }) => {
    // Arrange
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();

    // Act
    await agent.prompt.fillPrompt('Role', 'Goal', 'Instructions');

    // Assert
    const value = await agent.prompt.getRoleValue();
    expect(value).toBe('Role');

    // Cleanup (if test created data)
    // await agents.deleteAgentByName(agentName);
  });

});
```

### Rules

1. **Always import from `fixtures/base.fixture`** — never from `@playwright/test` directly.
2. **Use `test.describe` blocks** to group related tests by feature.
3. **Use `test.beforeEach`** when multiple tests share the same navigation step.
4. **Use `test.afterEach`** only when cleanup must run even if the test fails.
5. **Declare test data** as `const` at the top of the file, outside `test.describe`.
6. **Use environment variables** for agent names, workspace names, and org IDs — never hardcode them.
7. **One behavioral assertion focus per test** — keep tests small and focused.

---

## 4. Fixture Usage

### Available Fixtures

| Fixture | Type | What It Provides |
|---|---|---|
| `agents` | `AgentsPage` | Navigate to agent list, create/open/delete agents |
| `sidepanel` | `SidepanelPage` | Navigate to sidepanel pages (KB, API keys, metrics, etc.) |
| `page` | `Page` | Raw Playwright page (available by default) |
| `context` | `BrowserContext` | For multi-tab tests (e.g., new tab opens) |

### Usage Patterns

```typescript
// Agent-related tests
test('...', async ({ agents }) => {
  await agents.goto('api');
  const agent = await agents.openAgent(AGENT_NAME);
  // agent.tabs, agent.prompt, agent.model, agent.settings, etc.
});

// Sidepanel/configuration tests
test('...', async ({ sidepanel }) => {
  await sidepanel.gotoKnowledgeBase();
  await sidepanel.knowledgeBasePage.clickCreate();
});

// Tests that need raw page access alongside fixtures
test('...', async ({ agents, page }) => {
  // Use agents for POM, page for low-level assertions
});

// Multi-tab tests
test('...', async ({ agents, context }) => {
  const [newTab] = await Promise.all([
    context.waitForEvent('page'),
    agent.integrationGuide.clickCreateApiAuthKey(),
  ]);
  await newTab.waitForLoadState();
  const authKeyPage = new AuthKeyPage(newTab);
});
```

---

## 5. Page Object Interaction Rules

### Navigation Chain

```
agents.goto('api'|'chatbot')
  → agents.openAgent(name)           → returns AgentPage
    → agent.tabs.openPrompt()
    → agent.tabs.openModel()
    → agent.tabs.openConnectors()
    → agent.tabs.openSettings()
    → agent.tabs.openIntegrationGuide()
    → agent.tabs.openMemory()

agents.clickCreateNewAgent()
  → agents.createAgentModal.fillPurpose(...)
  → agents.clickCreateNewAgentSubmit()  → returns AgentPage
```

```
sidepanel.gotoKnowledgeBase()
sidepanel.gotoApiKeys()
sidepanel.gotoPauthKey()
sidepanel.gotoMetrics()
sidepanel.gotoWorkspaceSetting()
// ... etc
```

### Key Rules

1. **Never call `page.goto()` directly** — use `agents.goto()` or `sidepanel.goto*()` methods.
2. **Never instantiate page objects manually in fixture-based tests** — they are composed inside `AgentPage` and `SidepanelPage`.
3. **Access sub-pages through composition**: `agent.prompt`, `agent.model`, `agent.settings`, `agent.connectors`, `agent.chatbot`, `agent.history`, `agent.playground`, `agent.integrationGuide`, `agent.memory`.
4. **Access components through composition**: `agent.header`, `agent.tabs`, `agents.sidebar`, `agents.createAgentModal`.
5. **Access modals through the page that owns them**: `agent.connectors.knowledgeBaseModal`, `agent.connectors.variableModal`.

### POM Method Naming Conventions

| Action | Method Pattern | Example |
|---|---|---|
| Click button | `click<Element>()` | `clickCreate()`, `clickSave()` |
| Fill input | `fill<Field>(value)` | `fillPrompt(role, goal, inst)` |
| Select option | `select<Thing>(value)` | `selectServiceProvider('Openai')` |
| Toggle checkbox | `toggle<Thing>()` / `check<Thing>()` / `uncheck<Thing>()` | `toggleGuardrails()` |
| Get value | `get<Field>Value()` | `getRoleValue()` |
| Expect visible | `expect<Thing>Visible()` | `expectRoleVisible()` |
| Expect not visible | `expect<Thing>NotVisible()` | `expectAgentSetupGuideNotVisible()` |
| Open section | `open<Section>()` | `openInstructionsSection()` |
| Delete | `delete<Thing>(identifier)` | `deleteAgentByName(name)` |
| Wait | `waitFor<State>()` | `waitForVisible()` |

---

## 6. Selector Rules

### Priority Order (STRICT)

| Priority | Method | When |
|---|---|---|
| 1 | `page.getByTestId('...')` | Always preferred when `data-testid` exists |
| 2 | `page.locator('#element-id')` | When element has `id` but no `data-testid` |
| 3 | `page.getByRole('button', { name: '...' })` | Semantic elements without testid |
| 4 | `page.getByText('...')` | Visible text as last resort |
| **NEVER** | CSS class selectors (`.class-name`) | Fragile — breaks on styling changes |
| **NEVER** | XPath | Hard to maintain |

### Selector Placement

- **All selectors live in the POM constructor** — never in test files.
- **Tests must not contain raw selectors** — call POM methods instead.
- Exception: one-off assertions in tests may use `page.getByRole('alert')` or `page.getByText(...)` when no POM method exists.

### Modal Selectors

- Modal dialog containers use `MODAL_TYPE` enum values as `data-testid` (UPPER_SNAKE_CASE):
  ```typescript
  this.modal = page.getByTestId('DELETE_MODAL');
  ```
- Inner elements use kebab-case `data-testid`:
  ```typescript
  this.confirmButton = page.getByTestId('delete-modal-confirm-button');
  ```

### Scoped Selectors

When elements are inside a container, scope the selector:
```typescript
// GOOD — scoped to modal
this.createButton = this.modal.getByTestId('version-description-create-button');

// BAD — could match duplicate testids outside modal
this.createButton = page.getByTestId('version-description-create-button');
```

---

## 7. Naming Conventions

### Test Files

| Pattern | Example |
|---|---|
| Feature name in kebab-case | `prompt-diff.spec.ts` |
| Negative tests | `workspace.negative.spec.ts`, `model-config-negative-edge.spec.ts` |
| One feature per file | `version.spec.ts`, `provider.spec.ts` |

### Test Names

Two formats exist in the codebase — **Format A is preferred**:

```typescript
// Format A (preferred) — with test ID
test('TC-MODEL-01: Verify model list loads for Mistral', ...)

// Format B — descriptive only
test('Prompt fields are visible after creating a new agent', ...)
```

- Use `TC-<FEATURE>-<##>` prefix when tests form a numbered suite.
- The description should state what is being verified, not how.
- Use tags for categorization: `@regression` prefix when needed.

### Page Objects

| Type | Convention | Example |
|---|---|---|
| Page class | `PascalCase` + `Page` | `PromptPage`, `ModelPage` |
| Modal class | `PascalCase` + `Modal` | `DeleteModal`, `ApiKeyModal` |
| Component class | `PascalCase` descriptive | `AgentHeaderNav`, `Sidebar` |
| File name | `kebab-case` + type suffix | `prompt.page.ts`, `delete.modal.ts`, `sidebar.component.ts` |

### Variables

```typescript
// Environment variables — UPPER_SNAKE_CASE
const AGENT_NAME = process.env.AGENT_NAME!;
const TESTING_AGENT = process.env.TESTING_AGENT!;

// Inline test data — UPPER_SNAKE_CASE for constants
const AGENT_PURPOSE = 'Sales agent that answers product questions.';
const KB_NAME = 'Resume';

// Local references — camelCase
const agent = await agents.openAgent(AGENT_NAME);
const modal = agent.connectors.variableModal;
```

---

## 8. Actions and Assertions Patterns

### Actions

```typescript
// Navigate
await agents.goto('api');
await sidepanel.gotoKnowledgeBase();

// Open an agent and switch tabs
const agent = await agents.openAgent(AGENT_NAME);
await agent.tabs.openModel();

// Fill fields
await agent.prompt.fillPrompt('Role', 'Goal', 'Instructions');
await agent.model.fillAdvancedParameter('max_tokens', '38216');

// Click
await agent.header.clickPublish();
await agent.model.clickConfigureApiKey();

// Select
await agent.model.selectServiceProvider('Openai');
await agent.model.selectApiKey('Mistral api key');

// Toggle
await agent.settings.toggleGuardrails();
await agent.memory.checkGptMemoryToggle();
```

### Assertions

```typescript
// Visibility — use POM expect methods when available
await agent.prompt.expectRoleVisible();
await agent.model.expectModelsVisible(['gpt-4o-mini', 'gpt-5']);

// Visibility — use Playwright expect when POM method doesn't exist
await expect(agent.settings.addGuardrailBtn).toBeVisible({ timeout: 10_000 });
await expect(agent.settings.addGuardrailBtn).toBeHidden({ timeout: 10_000 });

// Value
const role = await agent.prompt.getRoleValue();
expect(role).toBe('AI Bot');

// Contains
const systemPrompt = await agent.prompt.getSystemPromptValue();
expect(systemPrompt).toContain('Guidelines:');

// Regex
expect(systemPrompt).toMatch(/Guidelines:|Act like a chatbot/);

// Checked state
await expect(agent.settings.bridgeTypeApi).toBeChecked({ timeout: 10_000 });
await expect(agent.settings.guardrailsToggle).not.toBeChecked();

// Disabled state
await expect(publishDialog.getByTestId('agent-summary-save-button')).toBeDisabled({ timeout: 15000 });

// Alert/toast
await expect(page.getByRole('alert').filter({ hasText: 'New version created' })).toBeVisible();

// Polling (wait for async content)
await expect.poll(async () => {
  const text = await textarea.inputValue();
  return text && text.trim().length > 20;
}).toBeTruthy();
```

---

## 9. Waiting and Navigation Patterns

### GOOD — Implicit waits via assertions

```typescript
// Playwright auto-waits for elements in expect()
await expect(button).toBeVisible({ timeout: 15000 });

// POM methods encapsulate waits
await modal.waitForVisible();
await agent.prompt.expectRoleVisible();
```

### GOOD — waitFor for modals and dynamic content

```typescript
await this.modal.waitFor({ state: 'visible' });
await page.waitForLoadState();
await page.waitForLoadState('networkidle');  // Use sparingly
```

### GOOD — Multi-tab handling

```typescript
const [newTab] = await Promise.all([
  context.waitForEvent('page'),
  agent.integrationGuide.clickCreateApiAuthKey(),
]);
await newTab.waitForLoadState();
```

### GOOD — Dialog handling

```typescript
page.once('dialog', async dialog => {
  expect(dialog.message()).toMatch(/description/i);
  await dialog.dismiss();
});
await agent.header.createNewVersion();
```

### BAD — Hard waits (NEVER use in new tests)

```typescript
// NEVER DO THIS — found in legacy tests, do not replicate
await page.waitForTimeout(5000);
await page.waitForTimeout(10000);
```

### GOOD — Retry loops for flaky UI elements

```typescript
// Retry click pattern (used for dropdowns that don't always open)
for (let i = 0; i < 5; i++) {
  await agent.connectors.clickAddAgent();
  if (await agent.connectors.a2aDropdown.isVisible()) {
    await agent.connectors.a2aDropdown.selectAgent(A2A_AGENT);
    break;
  }
}
```

---

## 10. Test Data Management

### Environment Variables (from `.env` or GitHub Secrets)

```typescript
const AGENT_NAME = process.env.AGENT_NAME!;          // Pre-existing API agent
const TESTING_AGENT = process.env.TESTING_AGENT!;     // Pre-existing test agent
const CHATBOT_AGENT = process.env.CHATBOT_AGENT!;     // Pre-existing chatbot
const WORKSPACE_NAME = process.env.WORKSPACE_NAME!;   // Workspace name
const ORG_ID = process.env.ORG_ID!;                   // Organization ID
```

- Always use `!` non-null assertion — env vars are guaranteed at runtime.
- Use `process.env.X || 'default'` only when a sensible default exists.

### Inline Test Data

```typescript
const AGENT_PURPOSE = 'Sales agent for product questions.';
const KB_NAME = 'Resume';
const API_KEY_VALUE = 'AIzaSyCW9iewaNI64Z8RP58oHksojNFl6R96WmA';
```

---

## 11. Cleanup Pattern

Tests that create entities **must clean them up**:

```typescript
// Pattern 1: Cleanup inline at end of test
test('Create and verify agent', async ({ agents }) => {
  await agents.goto('api');
  await agents.clickCreateNewAgent();
  const agent = await agents.clickCreateNewAgentSubmit();

  // ... test logic ...

  // Cleanup
  const agentName = await agent.header.getAgentNameText();
  await agents.goto('api');
  await agents.deleteAgentByName(agentName);
});

// Pattern 2: Cleanup in afterEach (when test may fail before cleanup)
let createdName: string;

test.afterEach(async ({ agents }) => {
  if (createdName) {
    await agents.goto('api');
    await agents.deleteAgentByName(createdName);
  }
});

// Pattern 3: Cleanup in afterEach for sidepanel resources
test.afterEach(async ({ agents }) => {
  await agents.goto('api');
  await agents.sidebar.openKnowledgeBase();
  await agents.knowledgeBasePage.deleteKnowledgeBaseByName('Wikipedia');
});
```

---

## 12. Anti-Patterns and Risks to Avoid

### CRITICAL — Never Do

| Anti-Pattern | Why | Fix |
|---|---|---|
| `await page.waitForTimeout(N)` | Wastes time or races | Use `expect().toBeVisible()` or `waitFor()` |
| `page.locator('.css-class')` | Breaks on style changes | Use `data-testid` or `id` |
| `page.locator('div > span:nth-child(2)')` | Fragile DOM structure | Use `data-testid` |
| Inline selectors in test files | Hard to maintain | Put selectors in POM classes |
| Importing from `@playwright/test` directly | Bypasses fixtures | Import from `fixtures/base.fixture` |
| Hardcoded agent/workspace names | Breaks in other envs | Use `process.env.*` |
| `page.waitForLoadState('networkidle')` | Unreliable in SPAs | Use specific element waits |

### WARNING — Legacy Patterns Found (do not replicate)

```typescript
// LEGACY: raw locators in tests (found in chatbot-agent/, workspace/, auth tests)
await page.getByRole('button', { name: '+ Create New Chatbot Agent' }).click();
await page.locator('#default-agent-sidebar').getByRole('button', { name: 'Create Agent' }).click();

// CORRECT: use POM methods
await agents.clickCreateNewAgent();
const agent = await agents.clickCreateNewAgentSubmit();

// LEGACY: CSS class selectors (found in authKey.spec.ts, tone.spec.ts)
await page.locator('.Toastify__toast--success', { hasText: '...' }).waitFor();
await page.locator('.tooltip > a').first().click();

// CORRECT: use data-testid or getByRole
await expect(page.getByRole('alert').filter({ hasText: '...' })).toBeVisible();
```

---

## 13. Helper Functions in Tests

When multiple tests in a file share setup steps, extract them as `async function` at the top of the file:

```typescript
/** Navigate to agent list and open the Create Agent modal. */
async function openCreateAgentDialog(agents: AgentsPage): Promise<void> {
  await agents.goto('api');
  await agents.clickCreateNewAgent();
}

/** Submit the modal and navigate to the Prompt tab. */
async function submitAndOpenPrompt(agents: AgentsPage): Promise<AgentPage> {
  const agent = await agents.clickCreateNewAgentSubmit();
  await agent.tabs.openPrompt();
  return agent;
}
```

Rules:
- Add JSDoc comments explaining the step.
- Type the return value.
- Keep them specific to the file — do not create shared utility helpers in test files.

---

## 14. Chatbot Iframe Interactions

The chatbot runs inside an iframe. Use the `agent.chatbot` POM:

```typescript
const chatbot = agent.chatbot;

// Start new conversation
await chatbot.openNewThread();

// Check readiness
await chatbot.isHomeVisible();

// Send message and wait for response
await chatbot.sendMessage('hello');
await chatbot.expectResponse(/Function executed/i);

// Response actions
await chatbot.expectCopyButtonVisible();
await chatbot.clickCopyButton();
await chatbot.clickGoodResponseButton();
await chatbot.clickBadResponseButton();
```

**Never access the iframe directly in new tests** — use POM methods.

---

## 15. Complete Example — New Test File

### Scenario: Verify that memory toggle persists after tab switch

```typescript
// tests/api-agent/memory/memory-persist.spec.ts
import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.TESTING_AGENT!;

test.describe('Memory - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-MEM-01: Memory toggle state persists after tab switch', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openMemory();

    // Enable memory
    await agent.memory.checkGptMemoryToggle();
    await agent.memory.expectGptMemoryContextTextareaVisible();

    // Switch tab and return
    await agent.tabs.openPrompt();
    await agent.tabs.openMemory();

    // Assert persistence
    await agent.memory.expectGptMemoryContextTextareaVisible();

    // Restore original state
    await agent.memory.uncheckGptMemoryToggle();
    await agent.memory.expectGptMemoryContextTextareaNotVisible();
  });

});
```

### Why this example is correct

- Imports from `fixtures/base.fixture`
- Uses `test.describe` for grouping
- Uses `test.beforeEach` for shared navigation
- Test ID follows `TC-<FEATURE>-<##>` pattern
- All interactions via POM methods — zero raw selectors
- Restores state at end (cleanup)
- Descriptive test name states what is verified
- No `waitForTimeout` — relies on POM waits

---

## 16. Checklist Before Submitting a New Test

- [ ] Import `test` and `expect` from `fixtures/base.fixture`
- [ ] Test data uses `process.env.*` — no hardcoded names
- [ ] All interactions go through POM methods
- [ ] No raw selectors in test file (or minimal, justified exceptions)
- [ ] No `page.waitForTimeout()` calls
- [ ] No CSS class selectors
- [ ] Test cleans up any data it creates
- [ ] Test name includes `TC-<FEATURE>-<##>:` prefix or clear description
- [ ] Tests are grouped in `test.describe` blocks
- [ ] File name follows `kebab-case.spec.ts` pattern
- [ ] File is placed in the correct `tests/<feature>/` subdirectory
