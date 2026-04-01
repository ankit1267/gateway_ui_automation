import type { Page, Response } from '@playwright/test';
import { expect } from '../fixtures/base.fixture';

interface ApiResponseFilter {
  payloadField?: string;
  payloadValue?: any;
}

/**
 * Waits for PUT /api/versions/ API response with optional payload filtering.
 * Used to capture agent update API calls triggered by UI actions.
 * 
 * @param page - Playwright Page object
 * @param filter - Optional filter to match specific payload fields/values
 * @param timeout - Maximum wait time in milliseconds (default: 15000)
 * @returns Promise resolving to the captured API Response
 * 
 * @example
 * // Wait for any agent update API
 * const response = await waitForAgentUpdateApi(page);
 * 
 * // Wait for API with 'service' field in payload
 * const response = await waitForAgentUpdateApi(page, { payloadField: 'service' });
 * 
 * // Wait for API with specific payload value
 * const response = await waitForAgentUpdateApi(page, { 
 *   payloadField: 'auto_model_select', 
 *   payloadValue: true 
 * });
 */
export async function waitForAgentUpdateApi(
  page: Page,
  filter?: ApiResponseFilter,
  timeout: number = 15000
): Promise<Response> {
  return page.waitForResponse(
    (resp) => {
      if (
        resp.url().includes('/api/versions/') &&
        resp.request().method() === 'PUT' &&
        resp.status() === 200
      ) {
        if (!filter) return true;

        const postData = resp.request().postData();
        if (!postData) return false;

        try {
          const payload = JSON.parse(postData);
          
          if (filter.payloadField !== undefined) {
            // Support dot notation for nested fields
            const fieldPath = filter.payloadField.split('.');
            let actualValue = payload;
            
            for (const key of fieldPath) {
              actualValue = actualValue?.[key];
            }
            
            const fieldExists = actualValue !== undefined;
            if (!fieldExists) return false;
            
            if (filter.payloadValue !== undefined) {
              return actualValue === filter.payloadValue;
            }
            return true;
          }
          
          return true;
        } catch {
          return false;
        }
      }
      return false;
    },
    { timeout }
  );
}

/**
 * Verifies fields in the API response body using dot notation for nested fields.
 * Automatically checks that response.success is true.
 * 
 * @param response - The API Response object to verify
 * @param expectedFields - Object with dot-notation field paths and expected values
 * 
 * @example
 * await verifyAgentUpdateResponse(response, {
 *   'agent.service': 'openai',
 *   'agent.auto_model_select': true
 * });
 */
export async function verifyAgentUpdateResponse(
  response: Response,
  expectedFields: Record<string, any>
): Promise<void> {
  const responseBody = await response.json();
  
  expect(responseBody.success).toBe(true);
  
  for (const [field, value] of Object.entries(expectedFields)) {
    const fieldPath = field.split('.');
    let actualValue = responseBody;
    
    for (const key of fieldPath) {
      actualValue = actualValue?.[key];
    }
    
    expect(actualValue).toBe(value);
  }
}

/**
 * Verifies fields in the API request payload using dot notation for nested fields.
 * Can check for undefined values or use 'defined' keyword to check field existence.
 * 
 * @param response - The API Response object (used to access request data)
 * @param expectedFields - Object with dot-notation field paths and expected values
 * 
 * @example
 * await verifyAgentUpdateRequest(response, {
 *   'configuration.max_tokens': 128000,
 *   'configuration.stop': undefined,
 *   'configuration.model': 'defined'
 * });
 */
export async function verifyAgentUpdateRequest(
  response: Response,
  expectedFields: Record<string, any>
): Promise<void> {
  const postData = response.request().postData();
  if (!postData) {
    throw new Error('No request payload found');
  }
  
  const requestBody = JSON.parse(postData);
  
  for (const [field, value] of Object.entries(expectedFields)) {
    const fieldPath = field.split('.');
    let actualValue = requestBody;
    
    for (const key of fieldPath) {
      actualValue = actualValue?.[key];
    }
    
    if (value === undefined) {
      expect(actualValue).toBeUndefined();
    } else if (value === 'defined') {
      expect(actualValue).toBeDefined();
    } else {
      expect(actualValue).toBe(value);
    }
  }
}

/**
 * Executes service provider selection and verifies the API call in one atomic operation.
 * Uses Promise.all to ensure the listener is set up before the action triggers.
 * 
 * @param page - Playwright Page object
 * @param selectServiceProviderFn - Function that triggers the service provider selection
 * @param expectedService - Expected service name in the API response (lowercase)
 * @returns Promise resolving to the captured API Response
 * 
 * @example
 * await selectServiceProviderWithApi(
 *   page,
 *   () => agent.model.selectServiceProvider('Openai'),
 *   'openai'
 * );
 */
export async function selectServiceProviderWithApi(
  page: Page,
  selectServiceProviderFn: () => Promise<void>,
  expectedService: string
): Promise<Response> {
  const [response] = await Promise.all([
    waitForAgentUpdateApi(page, { payloadField: 'service' }),
    selectServiceProviderFn()
  ]);
  
  await verifyAgentUpdateResponse(response, {
    'agent.service': expectedService
  });
  
  return response;
}

/**
 * Toggles auto-select model and verifies the API call sets the correct value.
 * Filters by payload containing 'auto_model_select' field to avoid capturing wrong API calls.
 * 
 * @param page - Playwright Page object
 * @param toggleFn - Function that triggers the toggle action
 * @param expectedValue - Expected boolean value for auto_model_select in response
 * @returns Promise resolving to the captured API Response
 * 
 * @example
 * await toggleAutoSelectModelWithApi(
 *   page,
 *   () => agent.model.checkAutoSelectModelToggle(),
 *   true
 * );
 */
export async function toggleAutoSelectModelWithApi(
  page: Page,
  toggleFn: () => Promise<void>,
  expectedValue: boolean
): Promise<Response> {
  const [response] = await Promise.all([
    waitForAgentUpdateApi(page, { payloadField: 'auto_model_select' }),
    toggleFn()
  ]);
  
  await verifyAgentUpdateResponse(response, {
    'agent.auto_model_select': expectedValue
  });
  
  return response;
}

/**
 * Updates an advanced parameter and verifies the request payload contains the correct value.
 * Useful for testing parameter changes like max_tokens, stop, etc.
 * 
 * @param page - Playwright Page object
 * @param updateFn - Function that triggers the parameter update
 * @param expectedField - Field name in configuration object (e.g., 'max_tokens', 'stop')
 * @param expectedValue - Expected value in the request payload
 * @returns Promise resolving to the captured API Response
 * 
 * @example
 * await updateParameterWithApi(
 *   page,
 *   () => model.clickAdvancedParameterMaxBtn('max_tokens'),
 *   'max_tokens',
 *   128000
 * );
 */
export async function updateParameterWithApi(
  page: Page,
  updateFn: () => Promise<void>,
  expectedField: string,
  expectedValue: any
): Promise<Response> {
  const response = await Promise.all([
    waitForAgentUpdateApi(page),
    updateFn()
  ]).then(([resp]) => resp);
  
  await verifyAgentUpdateRequest(response, {
    [`configuration.${expectedField}`]: expectedValue
  });
  
  return response;
}
