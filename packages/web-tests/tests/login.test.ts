import { test, expect } from '@playwright/test';

test('login page shows google auth button', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  const header = page.getByText('Sign in to your account');

  await expect(header).toBeVisible();

  const button = page.getByRole('button', {
    name: /Sign in with Google/i,
  });

  await expect(button).toBeVisible();
});
