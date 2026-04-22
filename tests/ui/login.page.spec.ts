import { test, expect } from "@fixtures/base.fixture";

test('Login tests', async ({pm}) => {
    await pm.loginPage.navigate();
    await pm.loginPage.continueWithGoogleBtn.click();
})