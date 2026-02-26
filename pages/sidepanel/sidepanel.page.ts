import { Page } from "@playwright/test";
import { AuthKeyPage } from "./auth-key.page";
import { ApiKeysPage } from "./api-key.page";
import { KnowledgeBasePage } from "./knowledge-base.page";
import { expect } from "@playwright/test";  

export class SidepanelPage {
  readonly page: Page;
  readonly authKeyPage: AuthKeyPage;
  readonly apiKeysPage: ApiKeysPage;
  readonly knowledgeBasePage: KnowledgeBasePage;

  constructor(page: Page) {
    this.page = page;
    this.authKeyPage = new AuthKeyPage(page);
    this.apiKeysPage = new ApiKeysPage(page);
    this.knowledgeBasePage = new KnowledgeBasePage(page);
  }
}