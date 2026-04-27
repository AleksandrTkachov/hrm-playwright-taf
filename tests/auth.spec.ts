import { test, expect } from '../src/fixtures/baseTest';
import { getAuthenticationData } from '../src/data/helpers';

test.describe('Авторизация', () => {
  test('Пользователь авторизуется с правильными данными', async ({ loginPage, dashboardPage }) => {
    const authData = getAuthenticationData();

    await loginPage.navigate('/');
    await loginPage.loginWithGoogleButton(authData[0].email, authData[0].password);
    await dashboardPage.closeWindowWithUpdates();
    await expect(dashboardPage.sidebar.mainMenu).toBeVisible();
    await dashboardPage.header.userDropdown.click();
    await expect(dashboardPage.header.logOutMenu).toBeVisible();
  });
});

test.describe('Параметризованная авторизация', () => {
  const authUsers = getAuthenticationData();

  for (const user of authUsers.slice(1)) {
    test(`Вход в систему под пользователем: ${user.email}`, async ({ loginPage }) => {
      await loginPage.navigate('/');
      await loginPage.loginWithForCandidatesButton(user.email, user.password);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      switch (true) {
        case !emailRegex.test(user.email):
          await loginPage.getErrorMessage(loginPage.errorMessageForCandidatesWrongEmail);
          break;

        case !user.email.endsWith('@innowise.com'):
          await loginPage.getErrorMessage(loginPage.errorMessageForCandidatesCorporateOnly);
          break;

        default:
          await loginPage.signInButton.click();
          await loginPage.getErrorMessage(loginPage.errorMessageForCandidatesGeneric);
          break;
      }
    });
  }
});
