import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Sidebar } from './components/sidebar';
import { Header } from './components/Header';

export class DashboardPage extends BasePage {
  readonly windowWithUpdates: Locator;
  readonly windowWithUpdatesCloseButton: Locator;
  readonly consentWindow: Locator;
  readonly consentWindowButton: Locator;
  readonly sidebar: Sidebar;
  readonly header: Header;

  constructor(page: Page) {
    super(page);
    this.windowWithUpdates = page.getByRole('banner');
    this.windowWithUpdatesCloseButton = page.getByRole('button');
    this.consentWindow = page.getByRole('checkbox', { name: 'I consent to the processing' });
    this.consentWindowButton = page.getByRole('button', { name: 'Confirm' });
    this.sidebar = new Sidebar(page);
    this.header = new Header(page);
  }

  async closeWindowWithUpdates() {
    await this.windowWithUpdates.click();
    await this.windowWithUpdatesCloseButton.click();
  }
}
