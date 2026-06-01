import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base_entities/base.page";
import { KeyclockLoginPage } from "./keyclock.login.page";
import { step } from "../utils/steps.decorator";

export class LoginPage extends BasePage {
  protected readonly PAGE_PATH = "/sign-in";

  readonly continueWithGoogleBtn: Locator;
  readonly forCandidatesBtn: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly emailValidationErrorLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.continueWithGoogleBtn = page.getByRole("button", {
      name: "Continue with Google",
    });
    this.forCandidatesBtn = page.getByRole("button", {
      name: "For candidates",
    });
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.emailValidationErrorLabel = page.locator(
      "//p[@id='mui-5-helper-text']",
    );
  }

  @step()
  async clickForCandidatesButton() {
    await this.forCandidatesBtn.click();
  }

  @step()
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  @step("Enter the password", { secure: true })
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  @step()
  async loginAsEmployee(username: string, password: string) {
    const keyclockLoginPage = new KeyclockLoginPage(this.page);
    await this.continueWithGoogleBtn.click();
    await keyclockLoginPage.keyclockLogin(username, password); 
  }
}
