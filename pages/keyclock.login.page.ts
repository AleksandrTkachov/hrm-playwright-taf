import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./base_entities/base.component";

export class KeyclockLoginPage extends BaseComponent {
  readonly usernameOrEmailTextbox: Locator;
  readonly passwordTextbox: Locator;
  readonly signInBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameOrEmailTextbox = page.locator("//input[@id='username']");
    this.passwordTextbox = page.locator("//input[@id='password']");
    this.signInBtn = page.locator("//input[@id='kc-login']");
  }

  async keyclockLogin(username: string, password: string) {
    await this.usernameOrEmailTextbox.fill(username);
    await this.passwordTextbox.fill(password);
    await this.signInBtn.click();
  }
}
