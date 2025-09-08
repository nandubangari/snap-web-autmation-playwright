import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/snap.page';


test('has title', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await  loginPage.goto();
  await loginPage.sendMessageToEveryone();
});

