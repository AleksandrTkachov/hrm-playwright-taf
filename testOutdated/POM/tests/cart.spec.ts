import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ProductsPage } from '../pages/productsPage';
import { CartPage } from '../pages/cartPage';

test.describe('Тесты корзины', () => {
  let cartPage: CartPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('admin', 'admin123');

    productsPage = new ProductsPage(page);
    await productsPage.addProductToCart('Ноутбук Pro');
    await productsPage.addProductToCart('Смартфон X');

    cartPage = new CartPage(page);
    await cartPage.navigate();
  });

  test('Отображение добавленных товаров', async () => {
    await expect(cartPage.cartItems).toHaveCount(2);
    await expect(cartPage.cartTotal).toContainText('$1798');
  });

  test('Удаление товара из корзины', async () => {
    await cartPage.removeItem('Смартфон X');
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartTotal).toContainText('$999');
  });

  test('Возврат к списку продуктов', async () => {
    await cartPage.goBackToProducts();
    await expect(cartPage.page).toHaveURL(/products.html/);
  });
});
