import { test } from '@playwright/test';
import { AgentsPage } from '../../pages/AgentsPage';
import { ChatbotCreateSidebar } from '../../pages/ChatbotCreateSidebar';
import { ChatbotConfigurePage } from '../../pages/ChatbotConfigurePage';
import { ChatbotPlayground } from '../../pages/ChatbotPlayground';

test.use({ storageState: 'auth.json' });

test('Create and publish chatbot on GTWY', async ({ page }) => {

  const agents = new AgentsPage(page);
  const sidebar = new ChatbotCreateSidebar(page);
  const configure = new ChatbotConfigurePage(page);
  const playground = new ChatbotPlayground(page);

  await agents.open('57294');
  await agents.createNewChatbot();

  await sidebar.fillPurpose('A developer assistant chatbot');
  await sidebar.submit();

  await configure.setResponseType();
  await configure.configureModel();
  await configure.addSpringBootConnector();
  await configure.publish();

  await playground.ask('What is response body in Spring Boot?');
  await playground.expectAnswerContains('Spring');
});
