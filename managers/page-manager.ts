import { Page } from "@playwright/test";
import { LoginPage } from "@pages/login.page";
import { KeyclockLoginPage } from "@pages/keyclock.login.page";

export class PageManager {
  private readonly _page: Page;
  private _loginPage: LoginPage | undefined;
  private _keyclockLoginPage: KeyclockLoginPage | undefined;

  constructor(page: Page) {
    this._page = page;
  }

  public get loginPage() {
    return (this._loginPage ??= new LoginPage(this._page));
  }

  public get keyclockLoginPage() {
    return (this._keyclockLoginPage ??= new KeyclockLoginPage(this._page));
  }
}
