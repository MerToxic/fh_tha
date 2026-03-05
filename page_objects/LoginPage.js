import { expect } from '@playwright/test';
import { testBaseUrls } from '../constants.js';
import { POmanager } from './POmanager.js'

class LoginPage {

  constructor({ page, projectName }){

    this.page = page;
    this.projectName = projectName;
    

    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('button.submit-btn');
    this.googleSignInButton = page.locator('#g_id_signin');
    this.passwordToggle = page.locator('.icon-container');
    this.badCredentialsMessage = page.getByText('The username/password combination is invalid.')
  }

  async openLoginPage(){
    await this.page.goto(location)
}

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }


  async login_badCredentials(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

  

  await POmanager.validateAPIresponse({
    pageFixture: this.page,
    url_includes: '/sign-in',
    methodType: 'POST',
    statusCode: 400,
    pageObjectsToClick: this.submitButton
})

await expect(this.badCredentialsMessage).toBeVisible()

const errorMessage = await this.badCredentialsMessage.innerText()
expect(errorMessage).toContain('Wrong email or password')
}


  async loginWithGoogle() {
    await this.googleSignInButton.click();
  }

  async togglePasswordVisibility() {
    await this.passwordToggle.click();
  }
}


export {
  LoginPage
};