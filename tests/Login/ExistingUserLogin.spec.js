import { test, expect } from '@playwright/test';
import { POmanager } from '../../page_objects/POmanager.js'


// test('@login @users > Existing user logs in successfully', async ({ page }, testInfo ) => {
//     const poManager = new POmanager({
//         page,
//         projectName: testInfo.project.name,
//     });
//     const loginPage = poManager.getLoginPage();
//     const homePage = poManager.getHomePage();

//     await page.goto('https://myezra-staging.ezra.com/sign-in');
//     await expect(this.resetPassword_checkEmail).toBeVisible()
// })




// test('@login @users > User attempts to login with incorrect credentials and validates the system rejects entry', async ({ page }, testInfo) => {

//     const poManager = new POmanager({
//         page,
//         projectName: testInfo.project.name,
//     });

//     const loginPage = poManager.getLoginPage();

//     await page.goto('https://myezra-staging.ezra.com/sign-in');

//     const acceptBtn = page.getByRole('button', { name: /accept/i });
//     if (await acceptBtn.isVisible()) {
//         await acceptBtn.click();
//     }

//     await loginPage.login_badCredentials('ingatest2@gmail.com', 'Test642');

// });



test('@login @users > Existing user logs in successfully', async ({ page }, testInfo) => {

  const poManager = new POmanager({
    page,
    projectName: testInfo.project.name,
  });

  const loginPage = poManager.getLoginPage();
  const homePage = poManager.getHomePage();

  await page.goto('https://myezra-staging.ezra.com/sign-in');

  // 1) Accept cookies if banner appears (Termly)
  const acceptBtn = page.locator('button[data-tid="banner-accept"]');
  if (await acceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await acceptBtn.click();
  }

  // 2) Login (valid credentials)
  await loginPage.emailInput.fill('ingatest2@gmail.com');
  await loginPage.passwordInput.fill('Test_642');
  await loginPage.submitButton.click();

  // 3) Confirm time zone modal if it appears
  const timezoneModalHeader = page.locator('.timezone-modal__header', { hasText: 'Confirm your time zone' });
  if (await timezoneModalHeader.isVisible({ timeout: 3000 }).catch(() => false)) {
    const confirmTzBtn = page.getByRole('button', { name: /confirm/i });
    await confirmTzBtn.click();
  }

  // 4) Assert Home nav link is visible (avoid strict mode by scoping + first)
  const homeNavLink = page.locator('section.navigation a[aria-label="Home"]').first();
  await expect(homeNavLink).toBeVisible({ timeout: 15000 });

});


test('@login @users > User attempts to login with incorrect credentials and validates the system rejects entry', async ({ page }, testInfo) => {

    const poManager = new POmanager({
        page,
        projectName: testInfo.project.name,
    });

    const loginPage = poManager.getLoginPage();

    await page.goto('https://myezra-staging.ezra.com/sign-in');

    const acceptBtn = page.getByRole('button', { name: /accept/i });
    if (await acceptBtn.isVisible()) {
        await acceptBtn.click();
    }

    // await loginPage.login_badCredentials('ingatest2@gmail.com', 'Test642');
    await loginPage.emailInput.fill('ingatest2@gmail.com');
    await loginPage.passwordInput.fill('Test642');
    await loginPage.submitButton.click();
    await expect(loginPage.badCredentialsMessage).toBeVisible()
    await page.waitForTimeout(10000);
});