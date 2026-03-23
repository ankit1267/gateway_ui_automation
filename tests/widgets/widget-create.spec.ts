import { test } from '../../fixtures/base.fixture';

test.describe.serial('Widgets - Create Widget', () => {

  test('TC-WIDGET-CREATE-01: Create widget and verify it is saved', async ({ sidepanel }) => {
    await sidepanel.gotoWidgets();
    await sidepanel.widgetsPage.waitForPage();

    await sidepanel.widgetsPage.clickCreateWidget();

    await sidepanel.widgetsPage.sendChatMessage('car page');
    await sidepanel.widgetsPage.waitForGeneration();

    await sidepanel.widgetsPage.clickSaveWidgetInChat();
    await sidepanel.widgetsPage.expectSaveWidgetModalVisible();

    await sidepanel.widgetsPage.fillSaveWidgetName('car page');
    await sidepanel.widgetsPage.clickSaveWidgetModalSave();

    await sidepanel.widgetsPage.expectSaveSuccessToast();

    await sidepanel.gotoWidgets();
    await sidepanel.widgetsPage.waitForPage();

    await sidepanel.widgetsPage.expectWidgetInGrid('car page');
  });

});
