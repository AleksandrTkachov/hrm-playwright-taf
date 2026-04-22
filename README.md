# HRM Automation Framework (Playwright + TypeScript)

This is an Enterprise-level test automation framework designed for a Human Resource Management (HRM) system. It prioritizes scalability, security, and maintainability by using modern design patterns and strictly typed configurations.

---

## 🏗 Architecture & Design Patterns

The framework follows a multi-layered architecture:
- **Page Object Model (POM)**: Encapsulates page-specific logic and locators.
- **Page Manager (App Object)**: Provides a single entry point for all Page Objects via the `pm` fixture, preventing redundant object instantiation.
- **Base Entities**: Abstract `BasePage` and `BaseComponent` classes to share common logic across the framework.
- **Custom Fixtures**: Extended Playwright `test` and `expect` to automatically inject the `PageManager` into test scripts.

---

## 🛠 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.x or higher (recommended: v20.x LTS)
- **npm**: v9.x or higher

---

## 📥 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd hrm_ts_playwright

2. **Install dependencies:**
   ```bash
   npm install

3. **Secrets Management (dotenvx):**
    
    This project uses dotenvx for encrypted environment variables.
   - You **must** have the **.env.keys** file in the root directory to run tests (ask your Lead QA for the key file).

   - **Important:** .env.keys is excluded from Git via .gitignore. **Do not commit it.**

---

## 🚀 Running Tests

All execution commands are handled via **npm scripts**. To pass additional Playwright flags (like `--project` or `--retries`), use the `--` separator.

| Command | Description |
| :--- | :--- |
| `npm run test:stage` | Run all tests on **Stage** environment (headless). |
| `npm run test:prod` | Run all tests on **Production** environment (headless). |
| `npm run test:ui` | Launch Playwright **UI Mode** (recommended for development). |
| `npm run test:stage -- --headed` | Run tests on Stage with a **visible browser**. |
| `npm run test:stage -- -g @smoke` | Run only tests tagged with **@smoke**. |

---

## 🔐 Environment Management

We manage environment variables securely using `dotenvx` in the `/env` directory.

* **Edit Secrets:** `npm run env:edit` (decrypts and opens the environment file).
* **Add a Variable:** `npx dotenvx set MY_VAR=value -f env/.env.stage`
* **Security:** Files like `.env.stage` are encrypted. The private decryption keys are stored locally in `.env.keys`. 

> [!CAUTION]
> Never commit `.env.keys` to the repository. It is ignored by default via `.gitignore`.

---

## 📁 Project Structure

```text
.
├── env/                # Encrypted environment configurations (.env.stage)
├── fixtures/           # Custom Playwright fixtures (base.fixture.ts)
├── managers/           # Entity managers (PageManager.ts)
├── pages/              # Page Object classes
│   ├── base_entities/  # Abstract BasePage and BaseComponent classes
│   └── login.page.ts   # Specific Page Object implementations
├── tests/              # Test suites
│   └── ui/             # UI-specific test scripts
├── playwright.config.ts# Global Playwright configuration
└── tsconfig.json       # TypeScript config with Path Aliases (@pages, @fixtures)


