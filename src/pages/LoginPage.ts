import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class LoginPage extends BasePage {
  readonly usernameInputGoogle: Locator;
  readonly passwordInputGoogle: Locator;
  readonly usernameInputForCandidates: Locator;
  readonly passwordInputForCandidates: Locator;
  readonly continueWithGoogleButton: Locator;
  readonly forCandidatesButton: Locator;
  readonly signInButton: Locator;
  readonly errorMessageForGoogle: Locator;
  readonly errorMessageForCandidatesGeneric: Locator;
  readonly errorMessageForCandidatesWrongEmail: Locator;
  readonly errorMessageForCandidatesCorporateOnly: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInputGoogle = page.getByRole('textbox', { name: 'username' });
    this.passwordInputGoogle = page.getByRole('textbox', { name: 'password' });
    this.usernameInputForCandidates = page.getByRole('textbox', { name: 'Email' });
    this.passwordInputForCandidates = page.getByRole('textbox', { name: 'password' });
    this.continueWithGoogleButton = page.getByRole('button', { name: 'Continue with Google' });
    this.forCandidatesButton = page.getByRole('button', { name: 'For Candidates' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.errorMessageForGoogle = page.getByText('Invalid username or password.');
    this.errorMessageForCandidatesGeneric = page.getByText('Incorrect email or password');
    this.errorMessageForCandidatesWrongEmail = page.getByText('The email is wrong');
    this.errorMessageForCandidatesCorporateOnly = page.getByText(
      'Corporate email addresses only - @innowise.com',
    );
  }

  async loginWithGoogleButton(user: string, pass: string) {
    await this.continueWithGoogleButton.click();
    await this.usernameInputGoogle.fill(user);
    await this.passwordInputGoogle.fill(pass);
    await this.signInButton.click();
  }

  async loginWithForCandidatesButton(user: string, pass: string) {
    await this.forCandidatesButton.click();
    await this.usernameInputForCandidates.fill(user);
    await this.passwordInputForCandidates.fill(pass);
  }

  async getErrorMessage(locator: Locator) {
    await expect(locator).toBeVisible();
  }
}
