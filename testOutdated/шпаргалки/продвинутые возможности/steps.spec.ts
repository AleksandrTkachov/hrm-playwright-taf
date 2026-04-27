import { test, expect } from '@playwright/test';

test.describe('Тестирование формы регистрации', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/steps');
  });

  test('Проверка полного цикла регистрации', async ({ page }) => {
    // Тест проверяет полный цикл работы с формой:
    // 1. Начальное состояние
    // 2. Негативные сценарии
    // 3. Успешную регистрацию
    // 4. Проверку профиля
    // 5. Выход из системы

    await test.step('ПРЕДУСЛОВИЯ: Проверить начальное состояние формы', async () => {
      // Что проверяем:
      // - Все поля формы пустые
      // - Сообщения об ошибке и успехе скрыты
      // - Секция профиля не отображается
      await expect(page.locator('#username')).toBeEmpty();
      await expect(page.locator('#email')).toBeEmpty();
      await expect(page.locator('#password')).toBeEmpty();
      await expect(page.locator('#error-message')).toBeHidden();
      await expect(page.locator('#success-message')).toBeHidden();
      await expect(page.locator('.profile-section')).toBeHidden();
    });

    await test.step('ШАГ 1: Попытка регистрации с пустыми полями', async () => {
      // Что выполняем:
      // - Нажимаем кнопку без заполнения полей
      // Что проверяем:
      // - Появилось сообщение о необходимости заполнить все поля
      // - Сообщение об успехе осталось скрытым
      await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

      await expect(page.locator('#error-message')).toBeVisible();
      await expect(page.locator('#error-message')).toHaveText(
        'Все поля обязательны для заполнения',
      );
      await expect(page.locator('#success-message')).toBeHidden();
    });

    await test.step('ШАГ 2: Попытка регистрации с некорректными данными', async () => {
      // Что выполняем:
      // - Заполняем имя пользователя
      // - Вводим email без @
      // - Вводим слишком короткий пароль
      // Что проверяем:
      // - Соответствующие сообщения об ошибках
      await page.locator('#username').fill('testuser');
      await page.locator('#email').fill('invalid-email');
      await page.locator('#password').fill('123');
      await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

      await expect(page.locator('#error-message')).toBeVisible();
      await expect(page.locator('#error-message')).toContainText(
        'Пароль должен быть не менее 6 символов',
      );
    });

    await test.step('ШАГ 3: Успешная регистрация', async () => {
      // Что выполняем:
      // - Заполняем все поля корректными данными
      // Что проверяем:
      // - Исчезло сообщение об ошибке
      // - Появилось сообщение об успехе
      // - Отобразилась секция профиля
      await page.locator('#email').fill('test@example.com');
      await page.locator('#password').fill('securepassword123');
      await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

      await expect(page.locator('#error-message')).toBeHidden();
      await expect(page.locator('#success-message')).toBeVisible();
      await expect(page.locator('#welcome-user')).toHaveText('testuser');
      await expect(page.locator('.profile-section')).toBeVisible();
    });

    await test.step('ШАГ 4: Проверка данных профиля', async () => {
      // Что проверяем:
      // - Данные в профиле соответствуют введенным при регистрации
      await expect(page.locator('#profile-username')).toHaveText('testuser');
      await expect(page.locator('#profile-email')).toHaveText('test@example.com');
    });

    await test.step('ШАГ 5: Выход из системы', async () => {
      // Что выполняем:
      // - Нажимаем кнопку выхода
      // Что проверяем:
      // - Форма регистрации сброшена
      // - Секция профиля скрыта
      await page.getByRole('button', { name: 'Выйти' }).click();

      await expect(page.locator('.profile-section')).toBeHidden();
      await expect(page.locator('#username')).toBeEmpty();
      await expect(page.locator('#auth-form')).toBeVisible();
    });
  });

  test.describe('Параметризованные тесты регистрации', () => {
    const testCases = [
      {
        title: 'Короткий пароль (5 символов)',
        data: { username: 'user1', email: 'user1@test.com', password: '12345' },
        expectedError: 'Пароль должен быть не менее 6 символов',
      },
    ];

    for (const testCase of testCases) {
      test(testCase.title, async ({ page }) => {
        await test.step('ЗАПОЛНЕНИЕ: Ввести тестовые данные', async () => {
          await page.locator('#username').fill(testCase.data.username);
          await page.locator('#email').fill(testCase.data.email);
          await page.locator('#password').fill(testCase.data.password);
        });

        await test.step('ДЕЙСТВИЕ: Отправить форму', async () => {
          await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
        });

        await test.step('ПРОВЕРКА: Сообщение об ошибке', async () => {
          await expect(page.locator('#error-message')).toBeVisible();
          await expect(page.locator('#error-message')).toContainText(testCase.expectedError);
        });
      });
    }
  });

  test('Вложенные шаги с группами проверок', async ({ page }) => {
    await test.step('ГРУППА: Проверки валидации формы', async () => {
      await test.step('ПУСТЫЕ ПОЛЯ: Отправка пустой формы', async () => {
        await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
        await expect(page.locator('#error-message')).toHaveText(/Все поля обязательны/);
      });

      await test.step('ЧАСТИЧНО ЗАПОЛНЕННАЯ: Только имя пользователя', async () => {
        await page.locator('#username').fill('partialuser');
        await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
        await expect(page.locator('#error-message')).toHaveText(/Все поля обязательны/);
      });
    });

    await test.step('ГРУППА: Проверки успешных сценариев', async () => {
      await test.step('КОРРЕКТНЫЕ ДАННЫЕ: Полное заполнение формы', async () => {
        await page.locator('#username').fill('validuser');
        await page.locator('#email').fill('valid@example.com');
        await page.locator('#password').fill('validpassword123');
        await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
        await expect(page.locator('#success-message')).toBeVisible();
      });
    });
  });
});
