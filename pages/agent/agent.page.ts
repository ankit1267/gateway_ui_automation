import { Page } from "@playwright/test";
import { AgentTabs } from "../../components/agent/agent-tabs.component";
import { ConnectersPage } from "./connector.page";
import { AgentHeaderNav } from "../../components/agent/agent-header-nav.component";
import { ChatbotPage } from "../chat-pages/chatbot.page";
import { HistoryPage } from "./history.page";
import { expect } from "../../fixtures/base.fixture";
import { ModelPage } from "./model.page";
import { IntegrationGuidePage } from "./integration-guide.page";
import { SettingsPage } from "./settings.page";
import { PromptPage } from "./prompt.page";
import { PlaygroundPage } from "../chat-pages/playground.page";

export class AgentPage {
  readonly tabs: AgentTabs;
  readonly connectors: ConnectersPage;
  readonly header: AgentHeaderNav;
  readonly chatbot: ChatbotPage;
  readonly history: HistoryPage;
  readonly model: ModelPage;
  readonly integrationGuide: IntegrationGuidePage;
  readonly settings: SettingsPage;
  readonly prompt: PromptPage;
  readonly playground: PlaygroundPage;

  constructor(private readonly page: Page) {
    this.tabs = new AgentTabs(page);
    this.connectors = new ConnectersPage(page);
    this.header = new AgentHeaderNav(page);
    this.chatbot = new ChatbotPage(page);
    this.history = new HistoryPage(page);
    this.model = new ModelPage(page);
    this.integrationGuide = new IntegrationGuidePage(page);
    this.settings = new SettingsPage(page);
    this.prompt = new PromptPage(page);
    this.playground = new PlaygroundPage(page);
  }

  async blurInput() {
    await this.page.locator('body').click();
  }
  async invalidAgentNameAlert(expectedMessage: string) {
    await expect(this.page.getByRole('alert').filter({ hasText: expectedMessage })).toBeVisible();
  }
}