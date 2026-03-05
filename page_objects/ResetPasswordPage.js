import { expect } from '@playwright/test';
import { testBaseUrls } from '../constants.js';
import { POmanager } from './POmanager.js'


class ResetPasswordPage {
  constructor({ page, projectName }){
    this.page = page;
    this.projectName = projectName; 

    // Page elements
    this.title = page.locator('h1:has-text("Reset your password")');
    

    // Form
    this.emailInput = page.locator('#email');

    // Button
    this.submitButton = page.locator('button.submit-btn');

    // Error message
    this.emailError = page.locator('.error-message.email');
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async submit() {
    await this.submitButton.click();
  }

  async requestReset(email) {
    await this.fillEmail(email);
    await this.submit();
  }

  async getEmailError() {
    return await this.emailError.textContent();
  }
}


export {
  ResetPasswordPage
};