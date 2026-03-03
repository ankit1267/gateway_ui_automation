import type { Page, Locator } from '@playwright/test';

export class MetricsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;
  readonly chartSectionHeading: Locator;
  readonly chartContainer: Locator;
  readonly groupByButton: Locator;
  readonly agentFilterButton: Locator;
  readonly timeRangeButton: Locator;
  readonly datePickerModal: Locator;
  readonly datePickerStartInput: Locator;
  readonly datePickerEndInput: Locator;
  readonly datePickerApplyButton: Locator;
  readonly datePickerCancelButton: Locator;
  readonly datePickerClearButton: Locator;
  readonly datePickerCloseButton: Locator;
  readonly tokenUsageSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: 'Metrics Dashboard' });
    this.pageDescription = page.getByText('Monitor your application');
    this.chartSectionHeading = page.getByRole('heading', { name: 'Metrics Visualization' });
    this.chartContainer = page.locator('.h-96');

    this.groupByButton = page.locator('#metrics-filter-group-by-button');
    this.agentFilterButton = page.locator('#metrics-filter-agent-button');
    this.timeRangeButton = page.locator('#metrics-filter-time-range-button');

    this.datePickerModal = page.locator('#date-range-picker-modal');
    this.datePickerStartInput = this.datePickerModal.locator('input[type="date"]').first();
    this.datePickerEndInput = this.datePickerModal.locator('input[type="date"]').last();
    this.datePickerApplyButton = page.locator('#date-range-picker-apply-button');
    this.datePickerCancelButton = page.locator('#date-range-picker-cancel-button');
    this.datePickerClearButton = page.locator('#date-range-picker-clear-button');
    this.datePickerCloseButton = page.locator('#date-range-picker-close-button');
    this.tokenUsageSection = page.locator('.bg-base-100.shadow-md.rounded-lg').last();
  }

  async goto() {
    const orgId = process.env.ORG_ID;
    if (!orgId) throw new Error('ORG_ID env variable is not set');
    await this.page.goto(`/org/${orgId}/metrics`);
  }

  async waitForPage() {
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async openGroupByDropdown() {
    await this.groupByButton.click();
  }

  async selectGroupByOption(index: number) {
    await this.openGroupByDropdown();
    await this.page.locator(`#metrics-filter-group-by-option-${index}`).click();
  }

  async getGroupByText(): Promise<string> {
    return this.groupByButton.innerText();
  }

  async openAgentFilter() {
    await this.agentFilterButton.click();
  }

  async selectAgent(agentName: string) {
    await this.openAgentFilter();
    await this.page.getByRole('link', { name: agentName, exact: true }).click();
  }

  async selectAllAgents() {
    await this.openAgentFilter();
    await this.page.locator('#metrics-filter-agent-all').click();
  }

  async getAgentFilterText(): Promise<string> {
    return this.agentFilterButton.innerText();
  }

  async openTimeRangeDropdown() {
    await this.timeRangeButton.click();
  }

  async selectTimeRange(index: number) {
    await this.openTimeRangeDropdown();
    await this.page.locator(`#metrics-filter-time-range-option-${index}`).click();
  }

  async selectCustomDateRange() {
    await this.openTimeRangeDropdown();
    await this.page.locator('#metrics-filter-time-range-custom').click();
  }

  async getTimeRangeText(): Promise<string> {
    return this.timeRangeButton.innerText();
  }

  async fillDateRange(startDate: string, endDate: string) {
    await this.datePickerStartInput.fill(startDate);
    await this.datePickerEndInput.fill(endDate);
  }

  async applyDateRange() {
    await this.datePickerApplyButton.click();
  }

  async cancelDatePicker() {
    await this.datePickerCancelButton.click();
  }

  async clearDatePicker() {
    await this.datePickerClearButton.click();
  }

  async closeDatePicker() {
    await this.datePickerCloseButton.click();
  }

  async isDatePickerApplyDisabled(): Promise<boolean> {
    return this.datePickerApplyButton.isDisabled();
  }

  async selectCustomDates(startDate: string, endDate: string) {
    await this.selectCustomDateRange();
    await this.fillDateRange(startDate, endDate);
    await this.applyDateRange();
  }

  async isChartVisible(): Promise<boolean> {
    return this.chartContainer.isVisible();
  }
}
