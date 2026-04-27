import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Тесты авторизации', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Успешный вход', async () => {
    await loginPage.login('admin', 'admin123');
    await expect(loginPage.page).toHaveURL(/products.html/);
  });

  test('Неудачный вход с пустыми полями', async () => {
    await loginPage.clickLogin();
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain('Все поля обязательны');
  });

  test('Неудачный вход с неверными данными', async () => {
    await loginPage.login('wrong', 'credentials');
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain('Неверные учетные данные');
  });
});
