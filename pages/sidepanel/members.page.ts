import type { Page, Locator } from '@playwright/test';

export class MembersPage {
  readonly page: Page;
  readonly userProxyContainer: Locator;
  readonly inviteUserButton: Locator;
  readonly inviteModalContainer: Locator;
  readonly inviteModalHeading: Locator;
  readonly inviteModalDescription: Locator;
  readonly inviteEmailInput: Locator;
  readonly inviteCancelButton: Locator;
  readonly inviteSendButton: Locator;
  readonly inviteLoadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userProxyContainer = page.locator('#userProxyContainer');
    this.inviteUserButton = page.locator('#main-slider-invite-user-button');
    this.inviteModalContainer = page.locator('#invite-user-modal-container');
    this.inviteModalHeading = page.getByRole('heading', { name: 'Invite Team Member' });
    this.inviteModalDescription = page.getByText('Send an invitation to join your organization');
    this.inviteEmailInput = page.getByTestId('invite-user-email-input');
    this.inviteCancelButton = page.getByTestId('invite-user-cancel-button');
    this.inviteSendButton = page.getByTestId('invite-user-send-button');
    this.inviteLoadingSpinner = page.locator('#invite-user-modal-container .loading-spinner');
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/invite`);
    await this.page.waitForURL(`/org/${orgId}/invite`);
  }

  async waitForPage() {
    await this.userProxyContainer.waitFor({ state: 'attached' });
  }

  async isContainerAttached(): Promise<boolean> {
    return (await this.userProxyContainer.count()) > 0;
  }

  async openInviteModal() {
    await this.inviteUserButton.click();
    await this.inviteModalContainer.waitFor({ state: 'visible' });
  }

  async fillEmail(email: string) {
    await this.inviteEmailInput.fill(email);
  }

  async clearEmail() {
    await this.inviteEmailInput.clear();
  }

  async getEmailValue(): Promise<string> {
    return this.inviteEmailInput.inputValue();
  }

  async clickCancel() {
    await this.inviteCancelButton.click();
  }

  async clickSendInvite() {
    await this.inviteSendButton.click();
  }

  async isInviteModalVisible(): Promise<boolean> {
    return this.inviteModalContainer.isVisible();
  }

  async isSendButtonDisabled(): Promise<boolean> {
    return this.inviteSendButton.isDisabled();
  }

  async isCancelButtonDisabled(): Promise<boolean> {
    return this.inviteCancelButton.isDisabled();
  }
}
