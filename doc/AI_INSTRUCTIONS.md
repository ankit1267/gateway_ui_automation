# AI Instructions — Playwright Test Generation

---

## Strict AI Rules

- **Never guess.** If intent, constraints, or compatibility with the system are unclear, ask questions before acting.
- **Never write raw selectors in test files.** All selectors belong in POM classes.
- **Always use existing POM methods** if one exists for the action. Check page/modal/component classes first.
- **Never use `page.waitForTimeout()`.** Use `expect().toBeVisible()` or `waitFor()` instead.
- **Prefer `data-testid`** over any other locator strategy.
- **Do not invent new selectors** unless no existing POM method or locator covers the element.
- **Never import from `@playwright/test`** directly. Always import from `fixtures/base.fixture`.
- **Never hardcode** agent names, workspace names, or org IDs. Use `process.env.*`.
- **If the request conflicts with these rules, pause and ask** before proceeding.

---

## 1. Project Architecture

| Concern | Value |
|---|---|
| **Pattern** | Page Object Model (POM) with component and modal sub-objects |
| **Language** | TypeScript |
| **Runner** | `@playwright/test` |
| **Auth** | `auth.json` via `storageState` (handled by fixtures) |
| **Fixtures** | `fixtures/base.fixture.ts` injects `agents` and `sidepanel` |
| **Selector priority** | `data-testid` > `id` > `getByRole` > `getByText` |
| **Execution** | Single worker, sequential |

---

## 2. Codegen to POM Conversion

The developer provides raw Playwright Codegen output. Convert it to fixture-based POM style.

**Codegen input:**

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

**Converted output:**

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

1. `import from '@playwright/test'` &rarr; `import from 'fixtures/base.fixture'`
2. Remove `test.use({ storageState })` &mdash; fixture handles auth
3. `async ({ page })` &rarr; `async ({ agents })` or `async ({ sidepanel })`
4. `page.goto(url)` &rarr; `agents.goto('api'|'chatbot')` or `sidepanel.goto*()`
5. Inline selectors &rarr; POM method calls
6. Hardcoded names &rarr; `process.env.*`
7. Add `TC-<FEATURE>-<##>:` test name
8. If no POM method exists, **create one** in the appropriate class

---

## 3. Test File Template

```typescript
import { test, expect } from '<relative-path>/fixtures/base.fixture';

const AGENT_NAME = process.env.AGENT_NAME!;

test.beforeEach(async ({ agents }) => {
  await agents.goto('api');
});

test.describe('Feature Area - Agent Type', () => {

  test('TC-FEAT-01: Description of what is verified', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openPrompt();
    await agent.prompt.fillPrompt('Role', 'Goal', 'Instructions');
    const value = await agent.prompt.getRoleValue();
    expect(value).toBe('Role');
  });

});
```

**Rules:**
- Import from `fixtures/base.fixture` only
- Group tests in `test.describe` blocks
- Use `test.beforeEach` for shared navigation
- Use `test.afterEach` for cleanup that must run even on failure
- Declare test data as `const` at top of file using `process.env.*`
- One assertion focus per test

---

## 4. Available Fixtures

| Fixture | Type | Use for |
|---|---|---|
| `agents` | `AgentsPage` | Agent list, create/open/delete agents |
| `sidepanel` | `SidepanelPage` | KB, API keys, metrics, workspace settings |
| `page` | `Page` | Raw Playwright page (low-level assertions only) |
| `context` | `BrowserContext` | Multi-tab tests |

---

## 5. POM Interaction Rules

### Navigation

```
agents.goto('api'|'chatbot')
  -> agents.openAgent(name)            -> AgentPage
    -> agent.tabs.openPrompt()
    -> agent.tabs.openModel()
    -> agent.tabs.openConnectors()
    -> agent.tabs.openSettings()
    -> agent.tabs.openIntegrationGuide()
    -> agent.tabs.openMemory()

agents.clickCreateNewAgent()
  -> agents.createAgentModal.fillPurpose(...)
  -> agents.clickCreateNewAgentSubmit() -> AgentPage

sidepanel.gotoKnowledgeBase()
sidepanel.gotoApiKeys()
sidepanel.gotoPauthKey()
sidepanel.gotoMetrics()
sidepanel.gotoWorkspaceSetting()
```

### Access Rules

- **Sub-pages:** `agent.prompt`, `agent.model`, `agent.settings`, `agent.connectors`, `agent.chatbot`, `agent.history`, `agent.playground`, `agent.integrationGuide`, `agent.memory`
- **Components:** `agent.header`, `agent.tabs`, `agents.sidebar`, `agents.createAgentModal`
- **Modals:** `agent.connectors.knowledgeBaseModal`, `agent.connectors.variableModal`
- Never call `page.goto()` directly
- Never instantiate page objects manually

### POM Method Naming

| Action | Pattern | Example |
|---|---|---|
| Click | `click<Element>()` | `clickSave()` |
| Fill | `fill<Field>(value)` | `fillPrompt(role, goal, inst)` |
| Select | `select<Thing>(value)` | `selectServiceProvider('Openai')` |
| Toggle | `check/uncheck/toggle<Thing>()` | `toggleGuardrails()` |
| Get value | `get<Field>Value()` | `getRoleValue()` |
| Assert visible | `expect<Thing>Visible()` | `expectRoleVisible()` |
| Assert hidden | `expect<Thing>NotVisible()` | `expectAgentSetupGuideNotVisible()` |
| Open | `open<Section>()` | `openInstructionsSection()` |
| Delete | `delete<Thing>(id)` | `deleteAgentByName(name)` |

---

## 6. Selector Rules

### Priority (strict order)

| Priority | Method | When |
|---|---|---|
| 1 | `page.getByTestId('...')` | Always preferred |
| 2 | `page.locator('#id')` | Has `id` but no `data-testid` |
| 3 | `page.getByRole(...)` | Semantic element without testid |
| 4 | `page.getByText(...)` | Last resort |
| NEVER | CSS class / XPath | Forbidden |

### Placement

- All selectors go in POM constructors, never in test files
- Scope selectors to parent container: `this.modal.getByTestId(...)`
- Modal containers use UPPER_SNAKE_CASE testid: `'DELETE_MODAL'`
- Inner elements use kebab-case testid: `'delete-modal-confirm-button'`

---

## 7. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Test file | `kebab-case.spec.ts` | `prompt-diff.spec.ts` |
| Test name | `TC-<FEATURE>-<##>: Description` | `TC-MODEL-01: Verify model list` |
| Page class | `PascalCase` + `Page` | `PromptPage` |
| Modal class | `PascalCase` + `Modal` | `DeleteModal` |
| Component class | `PascalCase` | `AgentHeaderNav` |
| POM file | `kebab-case` + type suffix | `prompt.page.ts` |
| Env vars | `UPPER_SNAKE_CASE` | `process.env.AGENT_NAME!` |
| Constants | `UPPER_SNAKE_CASE` | `const KB_NAME = 'Resume'` |
| Local vars | `camelCase` | `const agent = ...` |

---

## 8. Cleanup

- Tests that create data **must** clean it up
- Use inline cleanup at end of test, or `test.afterEach` if test may fail before cleanup
- Pattern: get created name -> navigate back -> delete by name

---

## 9. Chatbot Iframe

- Access chatbot via `agent.chatbot` POM only
- Never access the iframe directly
- Key methods: `sendMessage()`, `expectResponse()`, `openNewThread()`, `clickCopyButton()`

---

## 10. Anti-Patterns (NEVER do these)

| Forbidden | Use instead |
|---|---|
| `page.waitForTimeout(N)` | `expect().toBeVisible()` or `waitFor()` |
| `page.locator('.css-class')` | `page.getByTestId(...)` |
| `page.locator('div > span:nth-child(2)')` | `page.getByTestId(...)` |
| Raw selectors in test files | POM method calls |
| `import from '@playwright/test'` | `import from 'fixtures/base.fixture'` |
| Hardcoded agent/workspace names | `process.env.*` |
| `page.waitForLoadState('networkidle')` | Specific element waits |
| Manual `new PageObject(page)` in tests | Use fixture-injected objects |

---

## 11. Reference Example

```typescript
import { test, expect } from '../../../fixtures/base.fixture';

const AGENT_NAME = process.env.TESTING_AGENT!;

test.describe('Memory - API Agent', () => {

  test.beforeEach(async ({ agents }) => {
    await agents.goto('api');
  });

  test('TC-MEM-01: Memory toggle persists after tab switch', async ({ agents }) => {
    const agent = await agents.openAgent(AGENT_NAME);
    await agent.tabs.openMemory();
    await agent.memory.checkGptMemoryToggle();
    await agent.memory.expectGptMemoryContextTextareaVisible();

    await agent.tabs.openPrompt();
    await agent.tabs.openMemory();

    await agent.memory.expectGptMemoryContextTextareaVisible();

    await agent.memory.uncheckGptMemoryToggle();
    await agent.memory.expectGptMemoryContextTextareaNotVisible();
  });

});
```

---

## 12. Pre-Submit Checklist

- [ ] Import from `fixtures/base.fixture`
- [ ] Test data uses `process.env.*`
- [ ] All interactions use POM methods
- [ ] No raw selectors in test file
- [ ] No `page.waitForTimeout()`
- [ ] No CSS class selectors
- [ ] Test cleans up created data
- [ ] Test name has `TC-<FEATURE>-<##>:` prefix
- [ ] Tests grouped in `test.describe`
- [ ] File is `kebab-case.spec.ts`
- [ ] File in correct `tests/<feature>/` directory
