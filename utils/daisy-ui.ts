import type { Page } from '@playwright/test';

/**
 * Locks a DaisyUI dropdown open so it won't close on blur/focus-loss.
 * Works with both <details>-based and focus/CSS-based DaisyUI dropdowns.
 *
 * Call this AFTER the dropdown is confirmed visible.
 *
 * @param page  Playwright Page
 * @param testId  The data-testid of the dropdown element to lock
 */
export async function lockDaisyDropdown(page: Page, testId: string) {
  await page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`);
    if (!el) return;

    // 1. <details>-based dropdown: keep `open` attribute pinned
    const details = el.closest('details') ?? el.querySelector('details');
    if (details) {
      details.setAttribute('open', '');
      details.addEventListener('toggle', () => {
        if (!details.open) details.open = true;
      });
    }

    // 2. Force element visible via inline style (covers CSS-focus dropdowns)
    (el as HTMLElement).style.display = '';
    (el as HTMLElement).style.visibility = 'visible';
    (el as HTMLElement).style.opacity = '1';

    // 3. Swallow blur events on the dropdown and its children
    const stopBlur = (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
    };
    el.addEventListener('blur', stopBlur, true);
    el.addEventListener('focusout', stopBlur, true);
  }, testId);
}
