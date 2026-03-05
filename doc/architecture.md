# GTWY UI Automation — Technical Architecture

## 1. Overview

This framework provides end-to-end UI automation for the **GTWY.ai** platform using **Playwright** and **TypeScript**. It follows the **Page Object Model (POM)** design pattern and uses `data-testid` attributes as the primary selector strategy for stable, refactor-proof element targeting.

**Key characteristics:**

- **Language:** TypeScript (ESNext target, CommonJS modules)
- **Test runner:** `@playwright/test`
- **Pattern:** Page Object Model with component and modal abstractions
- **Selectors:** `data-testid` preferred; `getByRole` / `locator` used only when no testid exists
- **Auth:** Google OAuth via persistent browser context with session reuse (`auth.json`)
- **CI:** GitHub Actions with HTML report deployed to GitHub Pages

---

## 2. Folder Structure

```
gateway_ui_automation/
├── auth/                        # Authentication setup
│   └── global-setup.ts          # Playwright globalSetup — handles login & session persistence
├── components/                  # Reusable UI component abstractions
│   ├── agent/                   # Agent-level components (header nav, sidebar, tabs, version dropdown)
│   ├── canvas/                  # Canvas-related components (inside prompt helper)
│   ├── command/                 # Command palette components (it is related to search functionality)
│   ├── common/                  # Shared components (page header)
│   ├── connecters/              # Connector panel components
│   ├── navbar/                  # Top navigation bar
│   ├── prompt/                  # Prompt helper panel, pre-tool dropdown
│   ├── sidebar/                 # Global sidebar navigation
│   └── testcase/                # Test case components (inside playground sidebar)
├── doc/                         # Documentation
│   └── architecture.md          # ← This file
├── fixtures/                    # Playwright custom fixtures
│   └── base.fixture.ts          # Extended test object with shared page objects
├── modals/                      # Modal dialog abstractions (25 modals)
│   ├── create-new-bridge.modal.ts
│   ├── delete.modal.ts
│   ├── knowledge-base.modal.ts
│   ├── version-description.modal.ts
│   └── ...
├── pages/                       # Page Object classes
│   ├── agent/                   # Agent-detail pages (prompt, model, settings, history, etc.)
│   ├── chat-pages/              # Chatbot iframe pages
│   ├── sidepanel/               # Sidepanel pages (agents list, API keys, metrics, etc.)
│   ├── login.page.ts            # Login page
│   └── workspace.page.ts        # Workspace page
├── tests/                       # Test spec files organized by feature
│   ├── api-agent/               # API agent tests (prompt, model, connector, etc.)
│   ├── chatbot-agent/           # Chatbot agent tests
│   ├── configuration/           # Configuration tests
│   ├── security_access/         # Security & access tests
│   ├── workspace/               # Workspace tests
│   └── ...
├── utils/                       # Shared utility functions
│   └── navigation.ts            # URL navigation helpers
├── .github/workflows/           # CI pipeline definitions
│   └── playwright.yml           # GitHub Actions workflow
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── .env                         # Environment variables (not committed)
```

### Directory Purposes

| Directory | Purpose |
|---|---|
| `auth/` | Global setup for OAuth login and `auth.json` session persistence |
| `components/` | Reusable POM classes for UI fragments that appear across multiple pages |
| `fixtures/` | Custom Playwright fixtures that inject pre-built page objects into tests |
| `modals/` | One class per modal dialog — each wraps the modal's `data-testid` selectors |
| `pages/` | Full-page POM classes; compose components and expose page-level actions |
| `tests/` | Spec files grouped by feature area; each file contains related `test()` blocks |
| `utils/` | Stateless helper functions (navigation, data generation) |

---

## 3. Page Object Model Architecture

### 3.1 Layer Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Test Specs (.spec.ts)                │
│  tests/api-agent/prompt/prompt.spec.ts                  │
│  tests/chatbot-agent/publish.spec.ts                    │
└──────────────────────────┬──────────────────────────────┘
                           │ uses
┌──────────────────────────▼──────────────────────────────┐
│               Custom Fixtures (fixtures/)                │
│  base.fixture.ts → injects AgentsPage, SidepanelPage    │
└──────────────────────────┬──────────────────────────────┘
                           │ creates
┌──────────────────────────▼──────────────────────────────┐
│                    Pages (pages/)                         │
│  AgentsPage, PromptPage, ModelPage, SettingsPage, ...    │
│  Each page composes components & modals                  │
└────────┬─────────────────────────────┬──────────────────┘
         │ composes                    │ composes
┌────────▼────────┐          ┌────────▼────────┐
│  Components     │          │    Modals        │
│  (components/)  │          │   (modals/)      │
│  Sidebar        │          │  DeleteModal     │
│  AgentHeaderNav │          │  ApiKeyModal     │
│  PromptHelper   │          │  KnowledgeBase   │
└─────────────────┘          └─────────────────┘
```

### 3.2 How Pages Are Built

A page class bundles together all the smaller pieces (components, modals, sub-pages) that belong to it. Tests access them as properties — no need to create them manually.

```typescript
// pages/agent/agent.page.ts
export class AgentPage {
  readonly header: AgentHeaderNav;   // top bar (name, publish, revert)
  readonly tabs: AgentTabs;          // tab switcher (Prompt, Model, etc.)
  readonly prompt: PromptPage;       // Prompt tab content
  readonly model: ModelPage;         // Model tab content

  constructor(page: Page) {
    this.header = new AgentHeaderNav(page);
    this.tabs   = new AgentTabs(page);
    this.prompt = new PromptPage(page);
    this.model  = new ModelPage(page);
  }
}
```

### 3.3 Top-Level Pages

`AgentsPage` and `SidepanelPage` are the two entry points that fixtures inject into tests. They hold all sub-pages and provide `goto*()` methods for navigation.

```typescript
// pages/sidepanel/sidepanel.page.ts
export class SidepanelPage {
  readonly apiKeysPage: ApiKeysPage;
  readonly knowledgeBasePage: KnowledgeBasePage;
  readonly metricsPage: MetricsPage;
  // ... 15+ sub-pages

  async gotoApiKeys() {
    await this.page.goto(`/org/${process.env.ORG_ID}/apikeys`);
  }
}
```

### 3.4 Selector Organization

Every POM class defines its selectors in the constructor, keeping them co-located and easy to update:

```typescript
export class DeleteModal {
  private readonly modal: Locator;
  private readonly confirmButton: Locator;
  private readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.modal         = page.getByTestId('DELETE_MODAL');
    this.confirmButton = page.getByTestId('delete-modal-confirm-button');
    this.cancelButton  = page.getByTestId('delete-modal-cancel-button');
  }
}
```

---

## 4. Test Structure

### 4.1 Anatomy of a Test File

```typescript
// tests/api-agent/prompt/prompt.spec.ts
import { test, expect } from '../../../fixtures/base.fixture';
import { AgentsPage } from '../../../pages/sidepanel/agents.page';
import { AgentPage } from '../../../pages/agent/agent.page';

// Helper functions for shared setup steps
async function openCreateAgentDialog(agents: AgentsPage) {
  await agents.goto('api');
  await agents.clickCreateNewAgent();
}

test.describe('Prompt tab - API Agent', () => {

  test('Prompt fields are visible after creating a new agent', async ({ agents }) => {
    await openCreateAgentDialog(agents);
    const agent = await agents.clickCreateNewAgentSubmit();
    await agent.tabs.openPrompt();

    await agent.prompt.expectRoleVisible();
    await agent.prompt.clickGoal();
    await agent.prompt.expectInstructionsVisible();

    // Cleanup
    const agentName = await agent.header.getAgentNameText();
    await agents.goto('api');
    await agents.deleteAgentByName(agentName);
  });
});
```

### 4.2 Conventions

- **One `test.describe` per feature area** per file
- **Shared setup** extracted into helper functions at the top of the file
- **Cleanup** at the end of each test to restore state
- **Test IDs** follow the pattern `TC-FEATURE-##` in test names
- **Fixtures** inject pre-built page objects — tests never call `new Page()` directly

### 4.3 Custom Fixtures

```typescript
// fixtures/base.fixture.ts
import { test as base } from '@playwright/test';

type Fixtures = {
  agents: AgentsPage;
  sidepanel: SidepanelPage;
};

export const test = base.extend<Fixtures>({
  storageState: 'auth.json',
  agents: async ({ page }, use) => {
    await use(new AgentsPage(page));
  },
  sidepanel: async ({ page }, use) => {
    await use(new SidepanelPage(page));
  }
});

export const expect = test.expect;
```

Tests import `test` and `expect` from the fixture file instead of `@playwright/test` directly.

---

## 5. Selector Strategy

### 5.1 Priority Order

| Priority | Method | When to Use |
|---|---|---|
| **1 (preferred)** | `page.getByTestId('...')` | Always — when a `data-testid` exists on the element |
| 2 | `page.locator('#element-id')` | Only for elements with `id` but no `data-testid` |
| 3 | `page.getByRole(...)` | Semantic elements (headings, buttons) without testid |
| 4 | `page.getByText(...)` | Visible text content when no better selector exists |
| **Avoid** | CSS class selectors | Classes change frequently — never use for test selectors |
| **Avoid** | XPath | Fragile, hard to maintain |

---

## 6. Test Data Management

### 6.1 Environment Variables

Test data is externalized via `.env` and GitHub Secrets:

```bash
# .env (local development)
BASE_URL=https://app.gtwy.ai
ORG_ID=your-org-id
WORKSPACE_NAME=your-workspace
AGENT_NAME=test-agent
CHATBOT_AGENT=chatbot-agent-id
TESTING_AGENT=testing-agent-id
```

### 6.2 Inline Test Data

Short-lived test data is declared as constants at the top of each spec file:

```typescript
const AGENT_PURPOSE = 'Sales agent that can answer questions about products.';
```

### 6.3 Cleanup Pattern

Tests create and destroy their own data to avoid cross-test contamination:

```typescript
test('Create and verify agent', async ({ agents }) => {
  // Create
  await agents.clickCreateNewAgent();
  const agent = await agents.clickCreateNewAgentSubmit();

  // ... assertions ...

  // Cleanup
  const agentName = await agent.header.getAgentNameText();
  await agents.goto('api');
  await agents.deleteAgentByName(agentName);
});
```

---

## 7. Authentication & Session Reuse

### 7.1 Flow Diagram

```
┌──────────────┐     auth.json exists?     ┌────────────────┐
│ global-setup │────── YES ───────────────▶│  Skip login     │
│  (auth/)     │                           │  Reuse session  │
│              │────── NO ────┐            └────────────────┘
└──────────────┘              │
                              ▼
                 ┌────────────────────────┐
                 │ Launch persistent       │
                 │ Chrome context          │
                 │ → Navigate to login URL │
                 │ → Wait for OAuth        │
                 │ → Save auth.json        │
                 └────────────────────────┘
```

### 7.2 Implementation

```typescript
// auth/global-setup.ts
async function globalSetup() {
  const authFile = process.env.PLAYWRIGHT_AUTH_STATE || 'auth.json';

  // Skip if session already cached
  if (fs.existsSync(authFile)) return;

  // Launch persistent context for Google OAuth
  const context = await chromium.launchPersistentContext(
    process.env.PLAYWRIGHT_USER_DATA_DIR!,
    { channel: 'chrome', headless: false }
  );

  const page = await context.newPage();
  await page.goto(process.env.PLAYWRIGHT_LOGIN_URL!);
  await page.waitForURL(process.env.PLAYWRIGHT_SUCCESS_URL || '**/org');

  // Persist cookies & localStorage
  await context.storageState({ path: authFile });
  await context.close();
}
```

### 7.3 Session Injection

Every test and fixture automatically loads `auth.json`:

```typescript
// playwright.config.ts
use: { storageState: 'auth.json' }

// fixtures/base.fixture.ts
export const test = base.extend<Fixtures>({
  storageState: 'auth.json',
  // ...
});
```

---

## 8. Flaky Test Prevention

| Strategy | Implementation |
|---|---|
| **`data-testid` selectors** | Immune to CSS class and text changes |
| **Explicit waits** | `waitFor({ state: 'visible' })` instead of `page.waitForTimeout()` |
| **Action timeouts** | `actionTimeout: 15_000` for click/fill; `navigationTimeout: 30_000` |
| **Expect timeouts** | `expect.timeout: 30_000` gives assertions time to resolve |
| **SlowMo** | `slowMo: 1000` reduces race conditions between UI renders and actions |
| **Single worker** | `workers: 1` prevents parallel test interference on shared state |
| **Retry on failure** | `trace: 'on-first-retry'` captures full trace for debugging retries |
| **Test isolation** | Each test creates and cleans up its own data |
| **Modal waits** | Every modal class has `waitForVisible()` before interaction |

### Anti-Patterns to Avoid

```typescript
// BAD — arbitrary sleep
await page.waitForTimeout(3000);

// GOOD — wait for specific condition
await modal.waitForVisible();
await expect(button).toBeEnabled();
```

---

## 9. CI/CD Integration

### 9.1 GitHub Actions Pipeline

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: workflow_dispatch          # Manual trigger

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 60
    env:
      BASE_URL: ${{ secrets.BASE_URL }}
      ORG_ID: ${{ secrets.ORG_ID }}
      # ... other secrets
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4    # Upload report
        with:
          name: playwright-report
          path: playwright-report/

  deploy:                                   # Deploy report to GitHub Pages
    needs: test
    steps:
      - uses: actions/deploy-pages@v4
      - run: curl -X POST <webhook-url> ... # Notify team with report URL
```

### 9.2 Pipeline Flow

```
workflow_dispatch
  │
  ├─ Checkout → Install Node → npm ci
  ├─ Install Playwright browsers
  ├─ Run tests (headless, single worker)
  ├─ Upload HTML report as artifact
  ├─ Deploy report to GitHub Pages
  └─ Send report URL via webhook notification
```

---

## 10. Reporting & Debugging

### 10.1 Artifacts Captured

| Artifact | When | Configuration |
|---|---|---|
| **HTML Report** | Always | `reporter: [['html', { open: 'on-failure' }]]` |
| **Screenshots** | On failure | `screenshot: 'only-on-failure'` |
| **Videos** | On failure | `video: 'retain-on-failure'` |
| **Traces** | On first retry | `trace: 'on-first-retry'` |

### 10.2 Viewing Reports

```bash
# Local — open HTML report
npx playwright show-report

# CI — reports are deployed to GitHub Pages
# URL is sent via webhook after each run
```

### 10.3 Debugging Locally

```bash
# Run with browser visible
npx playwright test --headed

# Run with Playwright Inspector (step-through debugger)
npx playwright test --debug

# Run a single test file
npx playwright test tests/api-agent/prompt/prompt.spec.ts

# View trace file from a failed run
npx playwright show-trace test-results/<test-name>/trace.zip
```

---

## 11. Best Practices

- **Always use `data-testid`** — request frontend devs to add one if missing
- **Scope selectors** to parent containers when elements share a testid pattern
- **One class per page/modal/component** — all locators in the constructor
- **Expose actions, not locators** — tests call `modal.close()`, not `modal.closeButton.click()`
- **Import from fixtures**, not from `@playwright/test` directly
- **No hardcoded URLs or names** — use `process.env.*` and POM navigation
- **Clean up** — delete created agents/resources at test end
- **One assertion focus per test** — test one behavior, assert clearly

---

## Appendix: Configuration Reference

### playwright.config.ts

| Setting | Value | Purpose |
|---|---|---|
| `globalSetup` | `./Auth/global-setup.ts` | OAuth login before all tests |
| `timeout` | `120_000` (2 min) | Max time per test |
| `expect.timeout` | `30_000` | Max time for `expect()` assertions |
| `workers` | `1` | Sequential execution for stability |
| `storageState` | `auth.json` | Reuse authenticated session |
| `trace` | `on-first-retry` | Capture trace on retry |
| `screenshot` | `only-on-failure` | Auto-screenshot on failure |
| `video` | `retain-on-failure` | Record video, keep on failure |
| `slowMo` | `1000` | 1s delay between actions |
| `actionTimeout` | `15_000` | Max time for click/fill/press |
| `navigationTimeout` | `30_000` | Max time for page navigation |
| `headless` | `true` | No browser UI in CI |