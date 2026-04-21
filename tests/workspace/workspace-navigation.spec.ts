import { test, expect } from '../../fixtures/base.fixture';
import { WorkspacePage } from '../../pages/workspace.page';


test('API Agents text is visible', async ({ page }) => {
  const workspacePage = new WorkspacePage(page);
  await workspacePage.goto();
  await workspacePage.selectWorkspace(process.env.WORKSPACE_NAME!);
  await expect(page.getByRole('heading', { name: 'API Agents' })).toBeVisible();
});

test('Chatbot Agents text is visible', async ({ page }) => {
  const workspacePage = new WorkspacePage(page);
  await workspacePage.goto();
  await workspacePage.selectWorkspace(process.env.WORKSPACE_NAME!);
  await page.getByRole('button', { name: 'Chatbot', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Chatbot Agents' })).toBeVisible();
});


test('User Details page should not show 404', async ({ page }) => {
  const workspacePage = new WorkspacePage(page);
  await workspacePage.goto();
  await workspacePage.openWorkspaceDropdown();
  await page.getByRole('button', { name: 'User Details' }).click();

  // Wait for navigation
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { name: '404' })).not.toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/page not found/i)).not.toBeVisible({ timeout: 10000 });

});

test('update org name',async({page})=>{
  const workspacePage = new WorkspacePage(page);
  const newName = `Tilakraj Singh ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}`;
  await workspacePage.goto();
  await workspacePage.selectWorkspace(process.env.WORKSPACE_NAME!);
  await workspacePage.clickWorkspaceButton();
  await workspacePage.clickUserDetails();
  await expect(page).toHaveURL(/\/org\/\d+\/userDetails/);
  await page.waitForLoadState('networkidle');
  await workspacePage.clickEditUserDetails();
  await workspacePage.fillNameUserDetails(newName);
  await workspacePage.clickUpdateButton();
  await workspacePage.expectSnackBarVisible();
  await page.reload();

  // Navigate back to User Details after reload (reload goes to dashboard, not User Details)
  await workspacePage.clickWorkspaceButton();
  await workspacePage.clickUserDetails();
  await expect(page).toHaveURL(/\/org\/\d+\/userDetails/);
  await page.waitForLoadState('networkidle');
  // Verify name persisted
  await expect(page.getByText(newName).first()).toBeVisible();
})