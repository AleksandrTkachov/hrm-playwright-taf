import { Locator, Page } from '@playwright/test';

export class Header {
  readonly header: Locator;
  readonly logo: Locator;
  readonly searchField: Locator;
  readonly notificationBell: Locator;
  readonly userDropdown: Locator;
  readonly logOutMenu: Locator;

  constructor(private readonly page: Page) {
    this.header = page.locator('header');
    this.logo = page.locator('div').nth(3);
    this.searchField = page.getByRole('combobox', { name: 'Search' });
    this.notificationBell = page.getByRole('link').nth(1);
    this.userDropdown = page
      .locator('div')
      .filter({ hasText: /^Manul-Odomashenny KotofeiAXO$/ })
      .nth(1);
    this.logOutMenu = page.getByRole('menuitem', { name: 'Log out' });
  }

  async goTo(tabName: string) {
    await this.page.getByRole('link', { name: tabName }).click();
  }
}
