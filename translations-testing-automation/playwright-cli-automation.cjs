const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ─── Configuration ───────────────────────────────────────────────
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const CSV_FILE = path.join(__dirname, 'sample_medtronic_workflow.csv');
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const AUTH_STATE_FILE = path.join(__dirname, 'auth-state.json');
const DEMO_EMAIL = process.env.DEMO_EMAIL || 'patient@example.com';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'demo123';

const ROUTE_MAP = {
  'landing': '/',
  'auth': '/auth',
  'dashboard': '/dashboard',
};

const LANGUAGE_MAP = {
  'spanish': 'es',
  'french': 'fr',
  'german': 'de',
  'english': 'en',
};

const LANGUAGE_LABELS = {
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'en': 'English',
};

// ─── CSV Parser (no external dependency) ─────────────────────────
function parseCSV(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8').trim();
  const lines = content.split('\n');
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] || '').trim();
    });
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}

// ─── Filename generator ──────────────────────────────────────────
function generateFilename(row, index) {
  const page = (row['Screen/Page'] || '').toLowerCase().replace(/\s+/g, '-');
  const section = (row['Section'] || '').toLowerCase().replace(/\s+/g, '-');
  const language = (row['Language'] || '').toLowerCase();
  const str = (row['String'] || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  return `${index + 1}-${page}-${section}-${language}-${str}.png`;
}

// ─── Highlight function ──────────────────────────────────────────
async function highlightElements(page, targetString, misc) {
  const highlightAll = (misc || '').toLowerCase().includes('all instances');

  const count = await page.evaluate(({ targetString, highlightAll }) => {
    // Remove existing overlays
    document.querySelectorAll('.qa-highlight-overlay').forEach(el => el.remove());

    // Build search variants: exact string, with space inserted at camelCase boundaries
    const searchVariants = [targetString];
    // Add camelCase split variant (e.g. "BasalDelivery" -> "Basal Delivery")
    const camelSplit = targetString.replace(/([a-z])([A-Z])/g, '$1 $2');
    if (camelSplit !== targetString) {
      searchVariants.push(camelSplit);
    }

    function isVisible(el) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      const style = window.getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      return true;
    }

    const matches = [];

    for (const searchStr of searchVariants) {
      // Collect all text nodes
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent && node.textContent.includes(searchStr)) {
          const el = node.parentElement;
          if (!el || !isVisible(el)) continue;
          matches.push({ el, textLen: node.textContent.length });
        }
      }

      if (matches.length === 0) {
        // Fallback: case-insensitive partial match on element textContent
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          const text = el.textContent || '';
          if (text.toLowerCase().includes(searchStr.toLowerCase()) && isVisible(el)) {
            matches.push({ el, textLen: text.length });
          }
        }
      }

      if (matches.length > 0) break; // Found matches with this variant
    }

    if (matches.length === 0) return 0;

    // Sort by text length (smallest = most specific match)
    matches.sort((a, b) => a.textLen - b.textLen);

    // Deduplicate by element reference
    const seen = new Set();
    const unique = [];
    for (const m of matches) {
      if (!seen.has(m.el)) {
        seen.add(m.el);
        unique.push(m);
      }
    }

    // For "highlight all", filter out ancestor elements when a more specific
    // descendant is already in the list to avoid redundant large highlights
    let filtered = unique;
    if (highlightAll && unique.length > 1) {
      filtered = unique.filter(m => {
        return !unique.some(other => other !== m && m.el.contains(other.el) && m.el !== other.el);
      });
    }

    const toHighlight = highlightAll ? filtered : [unique[0]];

    for (const match of toHighlight) {
      // Scroll into view
      match.el.scrollIntoView({ block: 'center', behavior: 'instant' });
    }

    // Recalculate positions after scrolling
    let highlightCount = 0;
    for (const match of toHighlight) {
      const rect = match.el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      const overlay = document.createElement('div');
      overlay.className = 'qa-highlight-overlay';
      overlay.style.cssText = [
        'position: fixed',
        `top: ${rect.top - 3}px`,
        `left: ${rect.left - 3}px`,
        `width: ${rect.width + 6}px`,
        `height: ${rect.height + 6}px`,
        'border: 3px solid red',
        'box-shadow: 0 0 10px rgba(255, 0, 0, 0.5)',
        'z-index: 999999',
        'pointer-events: none',
        'border-radius: 4px',
      ].join('; ');
      document.body.appendChild(overlay);
      highlightCount++;
    }
    return highlightCount;
  }, { targetString, highlightAll });

  // Wait for rendering
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
  return count;
}

// ─── Section scoping helper ──────────────────────────────────────
async function scrollToSection(page, sectionName) {
  await page.evaluate((sectionName) => {
    // Try to find a heading matching the section name
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (const h of headings) {
      if (h.textContent && h.textContent.toLowerCase().includes(sectionName.toLowerCase())) {
        h.scrollIntoView({ block: 'center', behavior: 'instant' });
        return;
      }
    }

    // Fallback: find any element containing the section text as a label/title
    const allEls = document.querySelectorAll('section, div, article');
    for (const el of allEls) {
      const firstChild = el.querySelector('h1, h2, h3, h4, h5, h6, [class*="title"], [class*="header"]');
      if (firstChild && firstChild.textContent && firstChild.textContent.toLowerCase().includes(sectionName.toLowerCase())) {
        el.scrollIntoView({ block: 'center', behavior: 'instant' });
        return;
      }
    }
  }, sectionName);
}

// ─── Language switching via UI ────────────────────────────────────
async function switchLanguage(page, langCode) {
  if (langCode === 'en') return; // default language, no switch needed

  const targetLabel = LANGUAGE_LABELS[langCode];
  if (!targetLabel) {
    console.warn(`  Unknown language code: ${langCode}`);
    return;
  }

  // Click the language dropdown trigger (Globe button)
  // The LanguageDropdown uses a Globe icon inside a Button
  const globeButton = page.locator('button:has(svg.lucide-globe)').first();
  await globeButton.waitFor({ state: 'visible', timeout: 5000 });
  await globeButton.click();

  // Wait for dropdown content to appear and click the target language
  const langOption = page.locator(`[role="menuitem"]:has-text("${targetLabel}")`);
  await langOption.waitFor({ state: 'visible', timeout: 5000 });
  await langOption.click();

  // Wait for translations to load
  await page.waitForTimeout(1500);
}

// ─── Authentication ──────────────────────────────────────────────
async function authenticate(browser) {
  console.log('Authenticating with demo patient account...');
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/auth`, { waitUntil: 'domcontentloaded' });

  // Wait for the auth page to render
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });

  // Fill login form with rememberMe checked so auth persists in localStorage
  await page.fill('input[type="email"]', DEMO_EMAIL);
  await page.fill('input[type="password"]', DEMO_PASSWORD);
  await page.check('#remember');
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await page.waitForSelector('h1', { timeout: 10000 });

  // Wait a bit to ensure localStorage is fully written
  await page.waitForTimeout(1000);

  console.log('Authentication successful, saving state...');
  await context.storageState({ path: AUTH_STATE_FILE });
  await context.close();
}

// ─── Run a single test case ──────────────────────────────────────
async function runTestCase(browser, testCase, index, authState) {
  const pageName = (testCase['Screen/Page'] || '').toLowerCase();
  const section = testCase['Section'] || '';
  const targetString = testCase['String'] || '';
  const language = (testCase['Language'] || 'english').toLowerCase();
  const misc = testCase['Misc'] || '';
  const langCode = LANGUAGE_MAP[language] || 'en';
  const route = ROUTE_MAP[pageName] || '/';
  const filename = generateFilename(testCase, index);
  const needsAuth = pageName === 'dashboard';

  console.log(`\n--- Test Case ${index + 1} ---`);
  console.log(`  Page: ${pageName} (${route})`);
  console.log(`  Section: ${section}`);
  console.log(`  String: "${targetString}"`);
  console.log(`  Language: ${language} (${langCode})`);
  console.log(`  Misc: ${misc}`);
  console.log(`  Filename: ${filename}`);

  const contextOptions = {
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  };

  if (needsAuth && authState) {
    contextOptions.storageState = authState;
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  try {
    // Navigate to page
    const url = `${BASE_URL}${route}`;
    console.log(`  Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // For dashboard pages, handle auth redirect if storageState didn't work
    if (needsAuth) {
      // Check if we got redirected to auth page
      await page.waitForTimeout(2000);
      if (page.url().includes('/auth')) {
        console.log('  Auth state not preserved, logging in directly...');
        await page.waitForSelector('input[type="email"]', { timeout: 10000 });
        await page.fill('input[type="email"]', DEMO_EMAIL);
        await page.fill('input[type="password"]', DEMO_PASSWORD);
        await page.check('#remember');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/dashboard', { timeout: 15000 });
      }
    }

    // Disable animations after navigation
    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }',
    });

    // Wait for page-ready locator
    if (pageName === 'dashboard') {
      await page.waitForSelector('h1', { timeout: 10000 });
      // Wait for dashboard data to load
      await page.waitForTimeout(2000);
    } else if (pageName === 'auth') {
      await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    } else {
      await page.waitForSelector('h1', { timeout: 10000 });
    }

    // Switch language
    await switchLanguage(page, langCode);

    // Scroll to section
    await scrollToSection(page, section);
    await page.waitForTimeout(500);

    // Special handling for tooltip text on Glucose Chart
    if (misc.toLowerCase().includes('tooltip')) {
      // Hover over the chart area to trigger tooltip
      const chartContainer = page.locator('.recharts-responsive-container').first();
      if (await chartContainer.isVisible()) {
        const box = await chartContainer.boundingBox();
        if (box) {
          // Hover at the center of the chart
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.waitForTimeout(1000);
        }
      }
    }

    // Highlight the target element(s)
    const highlightCount = await highlightElements(page, targetString, misc);
    console.log(`  Highlighted ${highlightCount} element(s)`);

    if (highlightCount === 0) {
      console.warn(`  WARNING: No elements found matching "${targetString}"`);
    }

    // Take viewport-only screenshot
    const screenshotPath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`  Screenshot saved: ${screenshotPath}`);

  } catch (error) {
    console.error(`  ERROR: ${error.message}`);
    // Take a screenshot anyway for debugging
    const errorPath = path.join(SCREENSHOT_DIR, `error-${filename}`);
    try {
      await page.screenshot({ path: errorPath, fullPage: false });
      console.log(`  Error screenshot saved: ${errorPath}`);
    } catch (e) {
      // ignore screenshot errors
    }
  } finally {
    await context.close();
  }
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  console.log('=== Playwright CLI Automation ===');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`CSV File: ${CSV_FILE}`);
  console.log(`Screenshots Dir: ${SCREENSHOT_DIR}`);

  // Create screenshots directory
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  // Parse CSV
  const testCases = parseCSV(CSV_FILE);
  console.log(`\nFound ${testCases.length} test case(s) in CSV`);

  if (testCases.length === 0) {
    console.error('No test cases found. Exiting.');
    process.exit(1);
  }

  // Print test cases summary
  testCases.forEach((tc, i) => {
    console.log(`  ${i + 1}. [${tc['Screen/Page']}] ${tc['Section']} - "${tc['String']}" (${tc['Language']})`);
  });

  // Launch browser
  const browser = await chromium.launch({ headless: true });

  // Check if any test needs dashboard (auth required)
  const needsAuth = testCases.some(tc =>
    (tc['Screen/Page'] || '').toLowerCase() === 'dashboard'
  );

  let authState = null;
  if (needsAuth) {
    await authenticate(browser);
    authState = AUTH_STATE_FILE;
  }

  // Run each test case
  for (let i = 0; i < testCases.length; i++) {
    await runTestCase(browser, testCases[i], i, authState);
  }

  // Cleanup
  await browser.close();
  if (fs.existsSync(AUTH_STATE_FILE)) {
    fs.unlinkSync(AUTH_STATE_FILE);
  }

  console.log('\n=== Automation Complete ===');
  console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);

  // List saved screenshots
  const files = fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png'));
  console.log(`Total screenshots: ${files.length}`);
  files.forEach(f => console.log(`  - ${f}`));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
