import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { A2AAgentDropdown } from '../../components/connecters/a2a-agent.panel';
import { KnowledgeBaseDropdown } from '../../components/connecters/knowledge-base.panel';
import { ToolSelectionDropdown } from '../../components/connecters/tool-selection.panel';
import { AgentConfigModal } from '../../modals/agent-config.modal';
import { KnowledgeBaseModal } from '../../modals/knowledge-base.modal';


export class ConnectersPage {
  private readonly addToolButton: Locator;
  private readonly addAgentButton: Locator;
  private readonly addKBButton: Locator;
  private readonly agentList: Locator;
  private readonly embedList: Locator;
  private readonly agentConfig: Locator;
  readonly a2aDropdown: A2AAgentDropdown;
  readonly knowledgeBaseDropdown: KnowledgeBaseDropdown;
  readonly toolDropdown: ToolSelectionDropdown;

  constructor(public readonly page: Page) { 
    
    this.addToolButton = this.page.getByTestId('embed-list-add-tool-button-empty');
    this.addAgentButton = this.page.getByTestId('connected-agent-list-add-agent-button-empty');
    this.addKBButton = this.page.getByTestId('knowledgebase-add-button');
    this.agentList = this.page.getByTestId('connected-agent-list-agents-container')
    this.embedList = this.page.getByTestId('embed-list-container');
    this.agentConfig = this.page.locator('[data-testid^="connected-agent-config-button-"]');
    this.a2aDropdown = new A2AAgentDropdown(this.page);
    this.knowledgeBaseDropdown = new KnowledgeBaseDropdown(this.page);
    this.toolDropdown = new ToolSelectionDropdown(this.page);
  }

  get variableModal() {
  return new AgentConfigModal(this.page);
  }

  get knowledgeBaseModal() {
    return new KnowledgeBaseModal(this.page);
  }

 
  async clickAddTool() {
    await this.addToolButton.click();
  }

  async clickAddAgent() {
    await this.addAgentButton.click();
  }

  async clickAddKB() {
    await this.addKBButton.click();
  }

  async clickAgentConfig() {
    await this.agentConfig.click();
  }

   async expectEmbedVisible(toolName: string) {
        await expect(this.embedList).toBeVisible({ timeout: 15000 });
        await expect(this.embedList).toContainText(toolName);
    }

    async removeTool() {
        const removeIcon = this.embedList.getByTitle('Remove');
        const removeToolBtn = this.page.getByRole('button', { name: 'Remove Tool' });
        await expect(removeIcon).toBeVisible();
        await removeIcon.click();
        await expect(removeToolBtn).toBeVisible();
        await removeToolBtn.click();
    }

   async expectAgentVisible(agentName: string) {
        await expect(this.agentList).toBeVisible({ timeout: 15000 });
        await expect(this.agentList).toContainText(agentName);
    }

    async removeAgent() {
        const removeIcon = this.agentList.getByTitle('Remove');
        const removeAgentBtn = this.page.getByRole('button', { name: 'Remove Agent' });
        await expect(removeIcon).toBeVisible();
        await removeIcon.click();
        await expect(removeAgentBtn).toBeVisible();
        await removeAgentBtn.click();
   }

   async expectKBVisible(kbName: string) {
       const kb = this.page.getByText(kbName, { exact: true });
       await expect(kb).toBeVisible({ timeout: 15000 });
    }

    async removeKB() {
        const removeIcon = this.page.getByTitle('Remove');
        const removeKBBtn = this.page.getByText('Remove', { exact: true });
        await expect(removeIcon).toBeVisible();
        await removeIcon.click();
        await expect(removeKBBtn).toBeVisible();
        await removeKBBtn.click();
   }

   

  

}
