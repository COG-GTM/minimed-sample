const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const CSV_FILE = path.join(__dirname, 'sample_medtronic_workflow.csv');

// Route mapping
const ROUTE_MAP = {
  'Landing': '/',
  'Auth': '/auth',
  'Dashboard': '/dashboard'
};

// Language mapping
const LANGUAGE_MAP = {
  'Spanish': { code: 'es', label: 'Español' },
  'French': { code: 'fr', label: 'Français' },
  'German': { code: 'de', label: 'Deutsch' },
  'English': { code: 'en', label: 'English' }
};

// Create screenshots directory if it doesn't exist
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Parse CSV file manually (simple parser for this format)
function parseCSV(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle CSV with potential commas in quoted fields
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = values[idx] || '';
    });
    records.push(record);
  }
  
  return records;
}

// Generate screenshot filename
function generateFilename(index, row) {
  const page = row['Screen/Page'].toLowerCase().replace(/\s+/g, '-');
  const section = row['Section'].toLowerCase().replace(/\s+/g, '-');
  const language = row['Language'].toLowerCase();
  const stringSlug = row['String'].toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 20);
  return `${index + 1}-${page}-${section}-${language}-${stringSlug}.png`;
}

// Highlight element function - injects overlay divs
async function highlightElements(page, targetString, highlightAll = false) {
  return await page.evaluate(({ targetString, highlightAll }) => {
    // Remove any existing highlights
    document.querySelectorAll('.playwright-highlight-overlay').forEach(el => el.remove());
    
    // Find all text nodes containing the target string
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (node.textContent && node.textContent.includes(targetString)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );
    
    const matchingElements = [];
    let node;
    while (node = walker.nextNode()) {
      const parent = node.parentElement;
      if (parent && parent.offsetWidth > 0 && parent.offsetHeight > 0) {
        // Check if element is visible
        const style = window.getComputedStyle(parent);
        if (style.display !== 'none' && style.visibility !== 'hidden') {
          matchingElements.push(parent);
        }
      }
    }
    
    // Also check for elements with matching text content directly
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
        if (el.textContent && el.textContent.includes(targetString)) {
          const style = window.getComputedStyle(el);
          if (style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0 && el.offsetHeight > 0) {
            if (!matchingElements.includes(el)) {
              matchingElements.push(el);
            }
          }
        }
      }
    });
    
    if (matchingElements.length === 0) {
      console.log('No elements found matching:', targetString);
      return 0;
    }
    
    // Sort by size (prefer smaller elements)
    matchingElements.sort((a, b) => {
      const areaA = a.offsetWidth * a.offsetHeight;
      const areaB = b.offsetWidth * b.offsetHeight;
      return areaA - areaB;
    });
    
    // Determine which elements to highlight
    const elementsToHighlight = highlightAll ? matchingElements : [matchingElements[0]];
    
    // Scroll first element into view
    elementsToHighlight[0].scrollIntoView({ behavior: 'instant', block: 'center' });
    
    // Create highlight overlays
    elementsToHighlight.forEach(el => {
      const rect = el.getBoundingClientRect();
      
      const overlay = document.createElement('div');
      overlay.className = 'playwright-highlight-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: ${rect.top - 3}px;
        left: ${rect.left - 3}px;
        width: ${rect.width + 6}px;
        height: ${rect.height + 6}px;
        border: 3px solid red;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
        pointer-events: none;
        z-index: 999999;
        border-radius: 4px;
      `;
      document.body.appendChild(overlay);
    });
    
    return elementsToHighlight.length;
  }, { targetString, highlightAll });
}

// Switch language using the dropdown
async function switchLanguage(page, languageLabel) {
  try {
    // Find and click the language dropdown trigger (button with Globe icon and current language)
    const languageButton = await page.locator('button:has(svg.lucide-globe)').first();
    await languageButton.click();
    
    // Wait for dropdown to appear
    await page.waitForTimeout(300);
    
    // Click the target language option
    const languageOption = await page.locator(`[role="menuitem"]:has-text("${languageLabel}")`).first();
    await languageOption.click();
    
    // Wait for language to update
    await page.waitForTimeout(500);
    
    console.log(`  Switched language to: ${languageLabel}`);
    return true;
  } catch (error) {
    console.log(`  Warning: Could not switch language to ${languageLabel}: ${error.message}`);
    return false;
  }
}

// Login to dashboard
async function loginToDashboard(page) {
  try {
    // Navigate to auth page
    await page.goto(`${BASE_URL}/auth`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    
    // Click Demo Patient Account button
    const demoButton = await page.locator('button:has-text("Demo Patient Account")').first();
    await demoButton.click();
    
    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    console.log('  Logged in successfully');
    return true;
  } catch (error) {
    console.log(`  Warning: Login failed: ${error.message}`);
    return false;
  }
}

// Run a single test case
async function runTestCase(browser, testCase, index, authState) {
  const { 'Screen/Page': screenPage, Section: section, String: targetString, Language: language, Misc: misc } = testCase;
  
  console.log(`\nTest Case ${index + 1}: ${screenPage} - ${section} - "${targetString}" (${language})`);
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    ...(authState ? { storageState: authState } : {})
  });
  
  const page = await context.newPage();
  
  try {
    // Disable animations for deterministic screenshots
    await page.addStyleTag({ 
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }' 
    });
    
    // Get the route
    const route = ROUTE_MAP[screenPage] || '/';
    const url = `${BASE_URL}${route}`;
    
    // For Dashboard, we need to login first
    if (screenPage === 'Dashboard' && !authState) {
      const loggedIn = await loginToDashboard(page);
      if (!loggedIn) {
        throw new Error('Failed to login to dashboard');
      }
    } else {
      // Navigate to the page
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);
    }
    
    // Switch language if not English
    const langInfo = LANGUAGE_MAP[language];
    if (langInfo && langInfo.code !== 'en') {
      await switchLanguage(page, langInfo.label);
      // Wait for translations to load
      await page.waitForTimeout(1000);
    }
    
    // Determine if we should highlight all instances
    const highlightAll = misc && misc.toLowerCase().includes('all instances');
    
    // Highlight the target element
    const highlightCount = await highlightElements(page, targetString, highlightAll);
    console.log(`  Found and highlighted ${highlightCount} element(s) matching "${targetString}"`);
    
    // Wait for rendering
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
    await page.waitForTimeout(300);
    
    // Take screenshot
    const filename = generateFilename(index, testCase);
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filepath });
    console.log(`  Screenshot saved: ${filename}`);
    
    return { success: true, filename, highlightCount };
  } catch (error) {
    console.error(`  Error: ${error.message}`);
    return { success: false, error: error.message };
  } finally {
    await context.close();
  }
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('Playwright QA Automation - MiniMed Dashboard');
  console.log('='.repeat(60));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Screenshot Directory: ${SCREENSHOT_DIR}`);
  console.log('');
  
  // Parse CSV
  const testCases = parseCSV(CSV_FILE);
  console.log(`Found ${testCases.length} test cases in CSV`);
  
  // Launch browser
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = [];
  
  try {
    for (let i = 0; i < testCases.length; i++) {
      const result = await runTestCase(browser, testCases[i], i, null);
      results.push({ ...testCases[i], ...result });
    }
  } finally {
    await browser.close();
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`Total: ${results.length}`);
  console.log(`Successful: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);
  
  if (failed.length > 0) {
    console.log('\nFailed test cases:');
    failed.forEach(f => {
      console.log(`  - ${f['Screen/Page']} / ${f.Section} / "${f.String}": ${f.error}`);
    });
  }
  
  console.log('\nScreenshots saved to:', SCREENSHOT_DIR);
}

// Run
main().catch(console.error);
