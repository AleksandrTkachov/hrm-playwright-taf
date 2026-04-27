import { test } from '@playwright/test';
import type { Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string) {
    await test.step(`Переход на страницу: ${path}`, async () => {
      await this.page.goto(path);
    });
  }

  async waitForPageLoaded() {
    await this.page.waitForLoadState('networkidle');
  }

  async pause() {
    await this.page.pause();
  }
}
