import { Page } from '@playwright/test';
import { ChatbotPage } from '../pages/chat-pages/chatbot.page';

export interface ChatbotQueryOptions {
  message: string;
  expectedResponse?: RegExp;
  responseTimeout?: number;
  finalWaitTimeout?: number;
}

export async function queryChatbot(
  chatbot: ChatbotPage,
  page: Page,
  options: ChatbotQueryOptions
) {
  const {
    message,
    expectedResponse,
    responseTimeout = 90000,
    finalWaitTimeout = 20000,
  } = options;

  await page.waitForTimeout(4000);
  // await chatbot.isCopyButtonVisible();
  // await chatbot.openNewThread();
  // await page.waitForTimeout(3000);
  await chatbot.sendMessage(message);

  await chatbot.waitForResponseComplete(responseTimeout);

  if (expectedResponse) {
    await chatbot.expectResponse(expectedResponse);
  }

  await page.waitForTimeout(finalWaitTimeout);
}
