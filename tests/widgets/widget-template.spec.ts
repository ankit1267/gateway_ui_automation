import { test, expect } from '../../fixtures/base.fixture';

test.describe.serial('Widgets - Template Card', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoWidgets();
    await sidepanel.widgetsPage.waitForPage();
  });

  test('TC-WIDGET-TEMPLATE-01: Search filters widgets by template name', async ({ sidepanel }) => {
    const widgetName = await sidepanel.widgetsPage.getFirstWidgetCardName();

    await sidepanel.widgetsPage.clickSearchInput();
    await sidepanel.widgetsPage.expectCommandPaletteVisible();

    await sidepanel.widgetsPage.fillCommandPaletteSearch(widgetName);
    await sidepanel.widgetsPage.expectSearchResultVisible(widgetName);

    await sidepanel.widgetsPage.closeCommandPalette();
    await sidepanel.widgetsPage.expectCommandPaletteNotVisible();
  });

  test('TC-WIDGET-TEMPLATE-02: Template card shows preview area, name, description and relative time', async ({ sidepanel }) => {
    const widgetName = await sidepanel.widgetsPage.getFirstWidgetCardName();

    await sidepanel.widgetsPage.expectCardPreviewAreaVisible(widgetName);
    await sidepanel.widgetsPage.expectCardNameVisible(widgetName);
    await sidepanel.widgetsPage.expectCardDescriptionVisible(widgetName);
    await sidepanel.widgetsPage.expectCardRelativeTimeVisible(widgetName);
  });

  test('TC-WIDGET-TEMPLATE-03: Play button visible on hover and date format changes', async ({ sidepanel }) => {
    const widgetName = await sidepanel.widgetsPage.getFirstWidgetCardName();

    await sidepanel.widgetsPage.hoverCardAndExpectPlayButtonVisible(widgetName);
    await sidepanel.widgetsPage.hoverCardAndExpectDateFormat(widgetName);
  });

  test('TC-WIDGET-TEMPLATE-04: Preview button opens Template Preview modal with close button', async ({ sidepanel }) => {
    const widgetName = await sidepanel.widgetsPage.getFirstWidgetCardName();

    await sidepanel.widgetsPage.clickCardPreviewButton(widgetName);

    await sidepanel.widgetsPage.expectTemplatePreviewModalVisible();
    await sidepanel.widgetsPage.expectTemplatePreviewCloseButtonVisible();

    await sidepanel.widgetsPage.clickTemplatePreviewClose();
    await sidepanel.widgetsPage.expectTemplatePreviewModalNotVisible();
  });

});
