import { Page, expect } from '@playwright/test';
import { ConnectorSelectors } from '../../selectors/api_agent/connector.selectors';
import { ApiAgentCreateSelectors } from '../../selectors/api_agent/apiAgent.selectors';

export class ConnectorPage {
  constructor(private page: Page) {}

  // -------------------------
  // NAVIGATION
  // -------------------------
  async openAgent(agentName: string) {
    await this.page
      .locator(ApiAgentCreateSelectors.agentTable)
      .getByText(agentName, { exact: true })
      .click();
  }

  async openConnectorsTab() {
    await this.page
      .getByRole('tab', { name: 'Connectors' })
      .click();
  }

  // -------------------------
  // ADD TOOL FLOW
  // -------------------------
  async addTool() {
    await this.page
      .locator(ConnectorSelectors.addFirstToolButton)
      .click();
  }

  async clickAddNewTools() {
    const addNewTools = this.page.locator(
    ConnectorSelectors.addNewToolsText
  );

  await addNewTools.waitFor({ state: 'visible', timeout: 15000 });
  await addNewTools.click();
  }

  async selectTool(toolName: string) {
  const toolOption = this.page
    .locator(ConnectorSelectors.suggestionDropdown)
    .getByText(toolName, { exact: true });

  await toolOption.waitFor({ state: 'visible', timeout: 15000 });
  await toolOption.click();
}

async selectAgent(agentName: string) {
  const agentOption = this.page
    .locator(ConnectorSelectors.suggestionDropdownAgent)
    .getByText(agentName, { exact: true });

  await agentOption.waitFor({ state: 'visible', timeout: 15000 });
  await agentOption.click();
}

async selectKnowledgeBase(k_base: string) {
  const kbOption = this.page
    .locator(ConnectorSelectors.suggestionDropdownKB)
    .getByText(k_base, { exact: true });

  await kbOption.waitFor({ state: 'visible', timeout: 15000 });
  await kbOption.click();
}




  // -------------------------
  // ADD AGENT 
  // -------------------------
  async addConnectedAgent() {
    await this.page
      .locator(ConnectorSelectors.addFirstAgentButton)
      .click();
  }

  //add knowledge base
   async addKnowledgeBase() {
    await this.page
      .locator(ConnectorSelectors.addFirstKnowledgeBase)
      .click();
  }

  async removeTool() {
  const removeIcon = this.page.getByTitle('Remove');
  const removeToolBtn = this.page.getByRole('button', { name: 'Remove Tool' });

  await removeIcon.waitFor({ state: 'visible' });
  await removeIcon.click();

  await removeToolBtn.waitFor({ state: 'visible' });
  await removeToolBtn.click();
 }

async removeAgent() {
  const removeIcon = this.page.getByTitle('Remove');
  const removeAgentBtn = this.page.getByRole('button', { name: 'Remove Agent' });

  await removeIcon.waitFor({ state: 'visible' });
  await removeIcon.click();

  await removeAgentBtn.waitFor({ state: 'visible' });
  await removeAgentBtn.click();
}

async removeKB() {
  const removeIcon = this.page.getByTitle('Remove');
  const confirmRemoveBtn = this.page.getByText('Remove', { exact: true });

  await removeIcon.waitFor({ state: 'visible' });
  await removeIcon.click();

  await confirmRemoveBtn.waitFor({ state: 'visible' });
  await confirmRemoveBtn.click();
}

  // -------------------------
  // ASSERTIONS
  // -------------------------
  async expectViaSocketVisible() {
    await expect(
      this.page.locator(ConnectorSelectors.embedHeader)
    ).toBeVisible();
  }

  async expectEmbedRendered(toolName: string) {
    const container = this.page.locator(
      ConnectorSelectors.embedContainer
    );

    await expect(container).toBeVisible({ timeout: 15000 });
    await expect(container).toContainText(toolName);
  }
  async expectAgentContainer(agentName:string){
     const container = this.page.locator(
      ConnectorSelectors.agentContainer
    );

    await expect(container).toBeVisible({ timeout: 15000 });
    await expect(container).toContainText(agentName);
  }
  async expectKB(k_base:string){
     const container = this.page.getByText(k_base, { exact: true })

    await expect(container).toBeVisible({ timeout: 15000 });
    await expect(container).toContainText(k_base);
  }
}
