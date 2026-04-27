import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ProductsPage } from '../pages/productsPage';

test.describe('Тесты продуктов', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('admin', 'admin123');
    productsPage = new ProductsPage(page);
  });

  test('Отображение списка продуктов', async () => {
    await expect(productsPage.productCards).toHaveCount(3);
  });

  test('Добавление продукта в корзину', async () => {
    const initialCount = await productsPage.getCartCount();
    await productsPage.addProductToCart('Ноутбук Pro');
    await expect(productsPage.cartCount).toHaveText((initialCount + 1).toString());
  });

  test('Переход в корзину', async () => {
    await productsPage.addProductToCart('Ноутбук Pro');
    await productsPage.goToCart();
    await expect(productsPage.page).toHaveURL(/cart.html/);
  });
});
