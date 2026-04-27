import { test, expect } from '@playwright/test';

// Тесты для формы входа
test.describe('Параметризованные тесты формы входа', () => {
  const loginTestCases = [
    {
      username: 'admin',
      password: 'admin123',
      expected: 'Успешный вход!',
    },
    {
      username: '',
      password: 'anypassword',
      expected: 'Все поля обязательны',
    },
    {
      username: 'testuser',
      password: '123',
      expected: 'Пароль должен быть не менее 6 символов',
    },
  ];

  // Нужно реализовать параметризованный тест на основе массива loginTestCases
  // Шаги теста:
  // 1. Перейти на страницу формы входа
  // 2. Заполнить поле имени пользователя (если не пустое)
  // 3. Заполнить поле пароля
  // 4. Нажать кнопку "Войти"
  // 5. Проверить сообщение системы
  // 6. Проверить класс сообщения (success/error)
  loginTestCases.forEach(({ username, password, expected }) => {
    test(`Тест входа: ${username || 'пусто'}/${password} → ${expected}`, async ({ page }) => {
      await page.goto('https://osstep.github.io/parametrize');

      await test.step('Заполнить форму входа', async () => {
        if (username) {
          await page.getByRole('textbox', { name: 'Имя пользователя' }).fill(username);
        }
        await page.getByRole('textbox', { name: 'Пароль' }).fill(password);
      });

      await test.step('Отправить форму', async () => {
        await page.click('#login-btn');
      });

      await test.step('Проверить результат', async () => {
        const message = page.locator('#message');
        await expect(message).toBeVisible();
        await expect(message).toHaveText(expected);

        const expectedClass = expected === 'Успешный вход!' ? 'success' : 'error';
        await expect(message).toHaveClass(new RegExp(expectedClass));
      });
    });
  });
});

// Тесты для калькулятора
test.describe('Параметризованные тесты калькулятора', () => {
  const calculatorTestCases = [
    { a: 5, b: 3, operation: 'add', expected: 8 },
    { a: 10, b: 0, operation: 'add', expected: 10 },
    { a: 4, b: 5, operation: 'multiply', expected: 20 },
  ];
  // Нужно реализовать параметризованный тест на основе массива calculatorTestCases
  // Шаги теста:
  // 1. Перейти на страницу калькулятора
  // 2. Ввести первое число
  // 3. Ввести второе число
  // 4. Нажать кнопку операции (сложение/умножение)
  // 5. Проверить результат вычисления
  calculatorTestCases.forEach(({ a, b, operation, expected }) => {
    test(`Операция ${operation} для ${a} и ${b} → ${expected}`, async ({ page }) => {
      await page.goto('https://osstep.github.io/parametrize');

      await test.step('Ввести числа', async () => {
        await page.fill('#num1', a.toString());
        await page.fill('#num2', b.toString());
      });

      await test.step('Выполнить операцию', async () => {
        const button = operation === 'add' ? '#add-btn' : '#multiply-btn';
        await page.click(button);
      });

      await test.step('Проверить результат', async () => {
        const resultText = await page.locator('#result').innerText();
        expect(resultText).toBe(`Результат: ${expected}`);
      });
    });
  });
});
