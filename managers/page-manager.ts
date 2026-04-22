import { Page } from "@playwright/test";
import { LoginPage } from "@pages/login.page";

export class PageManager {
  private readonly _page: Page;
  private _loginPage: LoginPage | undefined;

  constructor(page: Page) {
    this._page = page;
  }

  public get loginPage() {
    return (this._loginPage ??= new LoginPage(this._page));
  }
}
