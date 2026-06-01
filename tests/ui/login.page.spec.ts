import { test, expect } from '../../fixtures/extended-test';
import { CsvUtil } from "@utils/csv-helper.util";

interface LoginTestData {
  email: string;
  password: string;
  error_message: string;
}

test.describe("Login process tests", () => {
  test("Valid login process for employee user", async ({pm,}) => {
    await pm.loginPage.navigate();
    await pm.loginPage.loginAsEmployee(process.env.USER_LOGIN!, process.env.USER_PASSWORD!);
  });

  const testData = CsvUtil.readCsv<LoginTestData>(
    "test-data/invalid-login-for-candidate.csv",
    { cast: false },
  );

  for (const record of testData) {
    test(`Invalid login For Candidates with email: '${record.email}', password: ${record.password}`, async ({
      pm,
    }) => {
      await pm.loginPage.navigate();
      await pm.loginPage.forCandidatesBtn.click();
      await pm.loginPage.emailInput.fill(record.email);
      await pm.loginPage.passwordInput.fill(record.password);
      await expect(pm.loginPage.emailValidationErrorLabel).toHaveText(
        record.error_message,
      );
    });
  }
});
