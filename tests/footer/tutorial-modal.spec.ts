import { test, expect } from '../../fixtures/base.fixture';

test.describe('GTWY Tutorial Modal', () => {

  test.beforeEach(async ({ sidepanel }) => {
    await sidepanel.gotoAgents();
  });

  test('TC-TUTORIAL-01: Tutorial modal opens and displays tutorial items', async ({ sidepanel }) => {
    await sidepanel.tutorialModalPage.clickTutorialButton();
    await sidepanel.tutorialModalPage.expectModalVisible();
    await sidepanel.tutorialModalPage.expectTutorialItemsHaveTitleAndDescription();
  });

  test('TC-TUTORIAL-02: Tutorial modal closes via close button', async ({ sidepanel }) => {
    await sidepanel.tutorialModalPage.clickTutorialButton();
    await sidepanel.tutorialModalPage.expectModalVisible();
    await sidepanel.tutorialModalPage.clickCloseButton();
    await sidepanel.tutorialModalPage.expectModalNotVisible();
  });

  test('TC-TUTORIAL-03: Watch button expands video section', async ({ sidepanel }) => {
    await sidepanel.tutorialModalPage.clickTutorialButton();
    await sidepanel.tutorialModalPage.expectModalVisible();
    await sidepanel.tutorialModalPage.expectVideoSectionCollapsed(0);
    await sidepanel.tutorialModalPage.clickWatchButton(0);
    await sidepanel.tutorialModalPage.expectVideoSectionExpanded(0);
  });

  test('TC-TUTORIAL-04: Close Video button collapses video section', async ({ sidepanel }) => {
    await sidepanel.tutorialModalPage.clickTutorialButton();
    await sidepanel.tutorialModalPage.expectModalVisible();
    await sidepanel.tutorialModalPage.clickWatchButton(0);
    await sidepanel.tutorialModalPage.expectVideoSectionExpanded(0);
    await sidepanel.tutorialModalPage.clickCloseVideoButton(0);
    await sidepanel.tutorialModalPage.expectVideoSectionCollapsed(0);
  });

  test('TC-TUTORIAL-05: Toggle chevron expands and collapses video section', async ({ sidepanel }) => {
    await sidepanel.tutorialModalPage.clickTutorialButton();
    await sidepanel.tutorialModalPage.expectModalVisible();
    await sidepanel.tutorialModalPage.clickToggle(0);
    await sidepanel.tutorialModalPage.expectVideoSectionExpanded(0);
    await sidepanel.tutorialModalPage.clickToggle(0);
    await sidepanel.tutorialModalPage.expectVideoSectionCollapsed(0);
  });

  test('TC-TUTORIAL-06: All tutorial items have Watch buttons and toggles', async ({ sidepanel }) => {
    await sidepanel.tutorialModalPage.clickTutorialButton();
    await sidepanel.tutorialModalPage.expectModalVisible();
    await sidepanel.tutorialModalPage.expectAllWatchButtonsVisible();
    await sidepanel.tutorialModalPage.expectAllTogglesVisible();
  });

  test('TC-TUTORIAL-07: Expanding one tutorial collapses the previously expanded one', async ({ sidepanel }) => {
    await sidepanel.tutorialModalPage.clickTutorialButton();
    await sidepanel.tutorialModalPage.expectModalVisible();

    const count = await sidepanel.tutorialModalPage.getTutorialItemCount();
    if (count >= 2) {
      await sidepanel.tutorialModalPage.clickWatchButton(0);
      await sidepanel.tutorialModalPage.expectVideoSectionExpanded(0);

      await sidepanel.tutorialModalPage.clickToggle(1);
      await sidepanel.tutorialModalPage.expectVideoSectionExpanded(1);
      await sidepanel.tutorialModalPage.expectVideoSectionCollapsed(0);
    }
  });

});
