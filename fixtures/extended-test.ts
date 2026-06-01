import { test as base, expect } from "@playwright/test";
import { PageManager } from "../managers/page-manager";
import * as fs from "fs";
import * as path from "path";

interface ExtendedFixtures {
  pm: PageManager;
}

// ==========================================
// HELPERS
// ==========================================

// 1. Navigation & Paint Timings collection
async function getAdvancedPerformanceMetrics(page: any) {
  try {
    return await page.evaluate(() => {
      const [navigation] = performance.getEntriesByType("navigation") as any[];
      const paintEntries = performance.getEntriesByType("paint");

      if (!navigation) return null;

      const fp = paintEntries.find((e) => e.name === "first-paint")?.startTime || 0;
      const fcp = paintEntries.find((e) => e.name === "first-contentful-paint")?.startTime || 0;

      return {
        ttfb: Math.round(navigation.responseStart - navigation.requestStart),
        fp: Math.round(fp),
        fcp: Math.round(fcp),
        domReady: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
        loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
      };
    });
  } catch {
    return null;
  }
}

// 2. Color grading according to Google standards
function getMetricGrade(value: number, type: "ttfb" | "fcp" | "load"): string {
  if (value < 0) return "⚪ N/A";
  if (value === 0 && type === "fcp") return "🟢 GOOD";

  const thresholds = {
    ttfb: { good: 800, poor: 1800 },
    fcp: { good: 1800, poor: 3000 },
    load: { good: 2500, poor: 5000 },
  };
  if (value <= thresholds[type].good) return "🟢 GOOD";
  if (value <= thresholds[type].poor) return "🟡 WARN";
  return "🔴 POOR";
}

// 3. Text Waterfall Graph generating
function generateWaterfallChart(m: any): string {
  const ttfb = Math.max(0, m.ttfb);
  const fp = Math.max(0, m.fp);
  const fcp = Math.max(0, m.fcp);
  const domReady = Math.max(0, m.domReady);
  const loadTime = Math.max(0, m.loadTime);

  // Scale the graph by the largest component so that the proportions never exceed 100%.
  const maxTime = Math.max(1, loadTime, ttfb, fp, fcp, domReady);
  const barLength = 25;

  const makeBar = (time: number) => {
    const validTime = Math.max(0, time);
    // Strictly limit the number of characters within the range from 0 to 25
    const filled = Math.min(barLength, Math.max(0, Math.round((validTime / maxTime) * barLength)));
    const empty = Math.max(0, barLength - filled);
    return "█".repeat(filled) + "░".repeat(empty);
  };

  return [
    `=== Page: ${loadTime} ms total load time ===`,
    `1. Server response (TTFB)   : [${makeBar(ttfb)}] ${ttfb} ms`,
    `2. First Layout (FP)      : [${makeBar(fp)}] ${fp} ms`,
    `3. Text rendering (FCP) : [${makeBar(fcp)}] ${fcp} ms`,
    `4. Assembling the DOM tree      : [${makeBar(domReady)}] ${domReady} ms`,
    `5. Full load : [${makeBar(loadTime)}] ${loadTime} ms`,
  ].join("\n");
}

// 4. TEXT COVERAGE ANALYZER (New feature without libraries)
function parseCoverageToTable(coverageEntries: any[]): string {
  const rows: string[] = [
    "┌────────────────────────────────────────────────────────┬─────────────┐",
    "│ Script/File Name                                       │ Coverage %  │",
    "├────────────────────────────────────────────────────────┼─────────────┤",
  ];

  const appEntries = coverageEntries.filter(
    (entry) =>
      entry.url.includes("sign-in") ||
      entry.url.includes("dashboard") ||
      entry.url.includes("/src/") ||
      entry.url.includes(".js"),
  );

  if (appEntries.length === 0) {
    return "There is no coverage data for the application's source code (tests may not have been run in Chromium).";
  }

  for (const entry of appEntries) {
    const fileName = entry.url.split("/").pop()?.split("?")[0] || entry.url;
    if (!fileName || fileName.startsWith("http")) continue;

    const truncatedName = fileName.padEnd(54).substring(0, 54);

    let totalBytes = 0;
    let coveredBytes = 0;

    for (const func of entry.functions) {
      for (const range of func.ranges) {
        const rangeLength = range.endOffset - range.startOffset;
        totalBytes += rangeLength;
        if (range.count > 0) {
          coveredBytes += rangeLength;
        }
      }
    }

    const percentage = totalBytes > 0 ? Math.round((coveredBytes / totalBytes) * 100) : 0;
    const percentageStr = `${percentage}%`.padStart(11);

    rows.push(`│ ${truncatedName} │ ${percentageStr} │`);
  }

  rows.push("└────────────────────────────────────────────────────────┴─────────────┘");
  return rows.join("\n");
}

// ==========================================
// EXTENSION OF THE PLAYWRIGHT TEST CLASS
// ==========================================

export const test = base.extend<ExtendedFixtures>({
  pm: async ({ page }, use) => {
    const pm = new PageManager(page);
    await use(pm);
  },

  page: async ({ page }, use, testInfo) => {
    const consoleErrors: string[] = [];
    const networkErrors: string[] = [];
    const isChromium = page.context().browser()?.browserType().name() === "chromium";

    // --- BEFORE HOOKS ---
    if (isChromium) {
      await page.coverage.startJSCoverage({ resetOnNavigation: false });
    }

    page.on("pageerror", (err) => {
      consoleErrors.push(`[JS Exception] ${err.stack || err.message}`);
    });

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(`[Console Error] ${msg.text()}`);
      }
    });

    page.on("requestfailed", (request) => {
      networkErrors.push(
        `[NET FAIL] ${request.method()} ${request.url()} | Reason: ${request.failure()?.errorText}`,
      );
    });

    page.on("response", (response) => {
      if (response.status() >= 400) {
        networkErrors.push(
          `[HTTP ${response.status()}] ${response.request().method()} ${response.url()}`,
        );
      }
    });

    // --- TEST EXECUTION ---
    await use(page);

    // --- AFTER HOOKS ---
    try {
      await page.waitForLoadState("load", { timeout: 5000 });
    } catch {
      console.warn("⚠️ Web Vitals metrics not collected: page took longer than 5 seconds to load.");
    }

    // 1. Web Vitals Processing
    const metrics = await getAdvancedPerformanceMetrics(page);
    if (metrics) {
      const ttfbGrade = getMetricGrade(metrics.ttfb, "ttfb");
      const fcpGrade = getMetricGrade(metrics.fcp, "fcp");
      const loadGrade = getMetricGrade(metrics.load, "load");

      testInfo.annotations.push({
        type: "📊 Speed audit summary",
        description: `Сервер: ${ttfbGrade} (${metrics.ttfb}ms) | UX контент: ${fcpGrade} (${metrics.fcp}ms) | Итог: ${loadGrade}`,
      });

      const waterfall = generateWaterfallChart(metrics);
      await testInfo.attach("📈 Waterfall Timeline", {
        body: waterfall,
        contentType: "text/plain",
      });
    }

    // 2. Coverage
    if (isChromium) {
      const coverage = await page.coverage.stopJSCoverage();
      const coverageTable = parseCoverageToTable(coverage);

      await testInfo.attach("📊 Code Coverage Summary Audit", {
        body: coverageTable,
        contentType: "text/plain",
      });
    }

    // 3. Attach logs when crashing
    if (testInfo.status !== testInfo.expectedStatus) {
      if (consoleErrors.length > 0) {
        await testInfo.attach("🛑 Browser errors (Console & Exceptions)", {
          body: consoleErrors.join("\n"),
          contentType: "text/plain",
        });
      }
      if (networkErrors.length > 0) {
        await testInfo.attach("🌐 Network errors (API & HTTP Failures)", {
          body: networkErrors.join("\n"),
          contentType: "text/plain",
        });
      }
    }
  },
});

export { expect };