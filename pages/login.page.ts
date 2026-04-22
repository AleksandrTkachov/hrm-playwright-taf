import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base_entities/base.page";

export class LoginPage extends BasePage {
  protected readonly PAGE_PATH = "/sign-in";

  readonly continueWithGoogleBtn: Locator;
  readonly forCandidatesBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.continueWithGoogleBtn = page.getByRole("button", {
      name: "Continue with Google",
    });
    this.forCandidatesBtn = page.getByRole("button", {
      name: "For candidates",
    });
  }
}
