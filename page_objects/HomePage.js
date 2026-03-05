import { expect } from '@playwright/test';
import { testBaseUrls } from '../constants.js';
import { POmanager } from './POmanager.js'


class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor({ page, projectName }){
    this.page = page;    
    this.projectName = projectName; 

    // --- Left navigation / layout ---
    this.logo = page.locator('svg#logo'); // <svg id="logo" ...>
    this.homeNavLink = page.locator('a[aria-label="Home"]'); // router-link for Home
    this.desktopLogoutButton = page.locator('button.desktop-logout');

    // --- Main header / tabs area ---
    this.appointmentsTabTitle = page.getByRole('heading', { name: /appointments/i });
    this.myTasksTabTitle = page.getByRole('heading', { name: /my tasks/i });

    // "Book a scan" is a button in UI
    this.bookAScanButton = page.getByRole('button', { name: /book a scan/i });

    // --- Main content containers (from DOM) ---
    this.appointmentsSection = page.locator('.my-appointments');
    this.myTasksSection = page.locator('.member-tasks.my-tasks');

    // Optional: toast container (useful for assertions)
    this.toast = page.locator('.toast');
  }

  // ---------- Navigation / page state ----------
  async goto() {
    // change path if needed; based on your screenshot this is post-login Home/Dashboard
    await this.page.goto('/home');
  }

  async waitForLoaded() {
    // best: wait on something stable on the authenticated home page
    await this.logo.waitFor({ state: 'visible' });
    await this.appointmentsSection.waitFor({ state: 'visible' });
  }

  // ---------- Actions ----------
  async clickHomeNav() {
    await this.homeNavLink.click();
  }

  async clickBookAScan() {
    await this.bookAScanButton.click();
  }

  async logout() {
    await this.desktopLogoutButton.click();
  }

  // ---------- Read helpers / assertions ----------
  async isAppointmentsVisible() {
    return await this.appointmentsSection.isVisible();
  }

  async isMyTasksVisible() {
    return await this.myTasksSection.isVisible();
  }

  async getToastText() {
    // returns null if toast is not visible / empty
    if (!(await this.toast.isVisible())) return null;
    return (await this.toast.textContent())?.trim() ?? null;
  }
}

export {
  HomePage
};