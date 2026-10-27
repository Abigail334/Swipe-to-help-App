import { test, expect } from '@playwright/test';

test.describe('SwipeToHelp E2E Flow', () => {
  test('loads home page and swipe feed', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=SwipeToHelp')).toBeVisible();
    await expect(page.locator('text=Swipe Feed')).toBeVisible();
  });

  test('navigates to upload tab and shows sample options', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Upload Bill');
    await expect(page.locator('text=Sample Electric Bill')).toBeVisible();
  });
});
