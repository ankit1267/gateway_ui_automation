import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { A2AAgentDropdown } from '../../components/connecters/a2a-agent.panel';
import { KnowledgeBaseDropdown } from '../../components/connecters/knowledge-base.panel';
import { ToolSelectionDropdown } from '../../components/connecters/tool-selection.panel';
import { AgentConfigModal } from '../../modals/agent-config.modal';
import { KnowledgeBaseModal } from '../../modals/knowledge-base.modal';
import { PrebuiltToolsConfigModal } from '../../modals/prebuilt-tools-config.modal';
import { AgentDescriptionModal } from '../../modals/agent-description.modal';
import { ToolConfigModal } from '../../modals/tool-config.modal';


export class ConnectersPage {
  private readonly addToolButton: Locator;
  private readonly addToolButtonHasTools: Locator;
  private readonly addAgentButton: Locator;
  private readonly addAgentButtonHasAgents: Locator;
  private readonly addKBButton: Locator;
  private readonly agentList: Locator;
  private readonly agentListContainer: Locator;
  private readonly embedList: Locator;
  private readonly embedToolsContainer: Locator;
  private readonly agentConfig: Locator;
  private readonly addAgentDropdown: Locator;
  private readonly addToolDropdown: Locator;
  private readonly kbDropdown: Locator;
  private readonly kbSearchInput: Locator;
  private readonly kbAddNewButton: Locator;
  readonly a2aDropdown: A2AAgentDropdown;
  readonly knowledgeBaseDropdown: KnowledgeBaseDropdown;
  readonly toolDropdown: ToolSelectionDropdown;
  readonly agentDescriptionModal: AgentDescriptionModal;
  readonly toolConfigModal: ToolConfigModal;

  constructor(public readonly page: Page) { 
    
    this.addToolButton = this.page.getByTestId('embed-list-add-tool-button-empty');
    this.addToolButtonHasTools = this.page.getByTestId('embed-list-add-tool-button');
    this.addAgentButton = this.page.getByTestId('connected-agent-list-add-agent-button-empty');
    this.addAgentButtonHasAgents = this.page.getByTestId('connected-agent-list-add-agent-button');
    this.addKBButton = this.page.getByTestId('knowledgebase-add-button');
    this.agentList = this.page.getByTestId('connected-agent-list-agents-container');
    this.agentListContainer = this.page.getByTestId('connected-agent-list-container');
    this.embedList = this.page.getByTestId('embed-list-container');
    this.embedToolsContainer = this.page.getByTestId('embed-list-tools-container');
    this.agentConfig = this.page.locator('[data-testid^="connected-agent-config-button-"]');
    this.addAgentDropdown = this.page.getByTestId('connected-agent-list-add-agent-dropdown');
    this.addToolDropdown = this.page.getByTestId('embed-list-add-tool-dropdown');
    this.kbDropdown = this.page.getByTestId('knowledgebase-dropdown');
    this.kbSearchInput = this.page.getByTestId('knowledgebase-search-input');
    this.kbAddNewButton = this.page.getByTestId('knowledgebase-add-new-button');
    this.a2aDropdown = new A2AAgentDropdown(this.page);
    this.knowledgeBaseDropdown = new KnowledgeBaseDropdown(this.page);
    this.toolDropdown = new ToolSelectionDropdown(this.page);
    this.agentDescriptionModal = new AgentDescriptionModal(this.page);
    this.toolConfigModal = new ToolConfigModal(this.page);
  }

  get variableModal() {
  return new AgentConfigModal(this.page);
  }

  get knowledgeBaseModal() {
    return new KnowledgeBaseModal(this.page);
  }

  get prebuiltToolsConfigModal() {
    return new PrebuiltToolsConfigModal(this.page);
  }

 
  async clickAddTool() {
    for (let i = 0; i < 4; i++) {
      if (await this.addToolButton.isVisible()) {
        await this.addToolButton.click();
      } else {
        await this.addToolButtonHasTools.click();
      }
      if (await this.toolDropdown.isVisible()) break;
    }
  }

  async clickAddAgent() {
    for (let i = 0; i < 4; i++) {
      if (await this.addAgentButton.isVisible()) {
        await this.addAgentButton.click();
      } else {
        await this.addAgentButtonHasAgents.click();
      }
      if (await this.addAgentDropdown.isVisible()) break;
    }
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

   async openEmbedToolConfig() {
        const toolItem = this.embedToolsContainer
            .locator('[data-testid^="render-embed-item-"]')
            .first();
        await toolItem.hover();
        await toolItem.getByTitle('Config').click();
   }

   async removeEmbedToolIfExists() {
        if (!await this.embedToolsContainer.isVisible()) return;
        const toolItem = this.embedToolsContainer
            .locator('[data-testid^="render-embed-item-"]').first();
        if (!await toolItem.isVisible()) return;
        await toolItem.hover();
        await toolItem.getByTitle('Remove').click();
        const confirmBtn = this.page.getByTestId('DELETE_TOOL_MODAL').getByTestId('delete-modal-confirm-button');
        await expect(confirmBtn).toBeVisible();
        await confirmBtn.click();
   }

   async clickConnectedAgent(agentName: string) {
        await this.agentList.getByText(agentName, { exact: true }).click();
   }

   async removeConnectedAgentIfExists(agentName: string) {
        if (!await this.agentList.isVisible()) return;
        const agentText = this.agentList.getByText(agentName, { exact: true });
        if (!await agentText.isVisible()) return;
        await agentText.hover();
        await this.agentList.getByTitle('Remove').click();
        const removeAgentBtn = this.page.getByRole('button', { name: 'Remove Agent' });
        await expect(removeAgentBtn).toBeVisible();
        await removeAgentBtn.click();
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

   // --- Agent items by bridge ID ---

   getAgentItem(bridgeId: string): Locator {
       return this.page.getByTestId(`connected-agent-item-${bridgeId}`);
   }

   async clickAgentConfigById(bridgeId: string) {
       await this.page.getByTestId(`connected-agent-config-button-${bridgeId}`).click();
   }

   async deleteAgentById(bridgeId: string) {
       await this.page.getByTestId(`connected-agent-delete-button-${bridgeId}`).click();
   }

   async clickAddAgentWhenHasAgents() {
       await this.addAgentButtonHasAgents.click();
   }

   // --- Tool (embed) items ---

   getPrebuiltTool(toolValue: string): Locator {
       return this.page.getByTestId(`embed-list-prebuilt-tool-${toolValue}`);
   }

   async clickPrebuiltToolConfig(toolValue: string) {
       await this.page.getByTestId(`embed-list-prebuilt-tool-config-button-${toolValue}`).click();
   }

   async deletePrebuiltTool(toolValue: string) {
       await this.page.getByTestId(`embed-list-prebuilt-tool-delete-button-${toolValue}`).click();
   }

   async confirmDeletePrebuiltTool() {
       await this.page
           .getByTestId('DELETE_PREBUILT_TOOL_MODAL')
           .getByTestId('delete-modal-confirm-button')
           .click();
   }

   async deletePrebuiltToolIfExists(toolValue: string) {
       const tool = this.getPrebuiltTool(toolValue);
       if (await tool.isVisible()) {
           await this.deletePrebuiltTool(toolValue);
           await this.confirmDeletePrebuiltTool();
       }
   }

   async clickAddToolWhenHasTools() {
       await this.addToolButtonHasTools.click();
   }

   // --- Knowledgebase items ---

   getKbCard(kbId: string): Locator {
       return this.page.getByTestId(`knowledgebase-card-${kbId}`);
   }

   async editKbById(kbId: string) {
       await this.page.getByTestId(`knowledgebase-edit-button-${kbId}`).click();
   }

   async deleteKbById(kbId: string) {
       await this.page.getByTestId(`knowledgebase-delete-button-${kbId}`).click();
   }

   getKbDropdownItem(kbId: string): Locator {
       return this.page.getByTestId(`knowledgebase-dropdown-item-${kbId}`);
   }

   async selectKbFromDropdown(kbId: string) {
       await this.getKbDropdownItem(kbId).click();
   }

   async searchKb(query: string) {
       await this.kbSearchInput.fill(query);
   }

   async clickAddNewKb() {
       await this.kbAddNewButton.click();
   }

   // --- Visibility checks ---

   async isAgentListVisible(): Promise<boolean> {
       return this.agentList.isVisible();
   }

   async isEmbedListVisible(): Promise<boolean> {
       return this.embedList.isVisible();
   }

   async isKbDropdownVisible(): Promise<boolean> {
       return this.kbDropdown.isVisible();
   }

   // --- Info tooltip and tutorial video ---

   async hoverInfoTooltipIcon() {
       await this.page.getByTestId('info-tooltip-trigger').first().hover();
   }

   async clickInfoTooltipVideoButton() {
       await this.page.getByTestId('info-tooltip-video-button').click();
   }

   async expectTutorialVideoVisible() {
       await expect(
           this.page
               .locator('[data-testid="tutorial-video-iframe"]')
               .contentFrame()
               .getByRole('region', { name: 'Interactive demo' })
       ).toBeVisible();
   }
}
