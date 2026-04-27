import { Locator, Page } from '@playwright/test';

export class Sidebar {
  readonly mainMenu: Locator;
  readonly myPage: Locator;
  readonly companyStructure: Locator;
  readonly employeeList: Locator;
  readonly timeOff: Locator;
  readonly analytics: Locator;
  readonly timesheet: Locator;
  readonly employeeRegistration: Locator;
  readonly projects: Locator;

  constructor(private readonly page: Page) {
    this.mainMenu = page.getByRole('link', { name: 'Main' });
    this.myPage = page.getByRole('link', { name: 'My page' });
    this.companyStructure = page.getByRole('link', { name: 'Company structure' });
    this.employeeList = page.getByRole('link', { name: 'Employee list' });
    this.timeOff = page.getByRole('link', { name: 'Time off' });
    this.analytics = page.getByRole('link', { name: 'Analytics' });
    this.timesheet = page.getByRole('link', { name: 'Timesheet' });
    this.employeeRegistration = page.getByRole('link', { name: 'Employee registration' });
    this.projects = page.getByRole('link', { name: 'Projects' });
  }

  async goTo(tabName: string) {
    await this.page.getByRole('link', { name: tabName }).click();
  }
}
