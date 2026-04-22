import { Page, Locator } from "@playwright/test";
import { BaseComponent } from "./base.component";

export abstract class BasePage extends BaseComponent {
  protected abstract readonly PAGE_PATH: string;

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.page.goto(this.PAGE_PATH);
  }
}
