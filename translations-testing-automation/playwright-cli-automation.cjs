const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5174';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots-trial3');

// CSV test cases
const testCases = [
  {
    page: 'Landing',
    section: 'Hero Section',
    string: 'Learn More',
    language: 'es',
    misc: 'Highlight button only',
    filename: '1-landing-hero-section-spanish-learn-more.png'
  },
  {
    page: 'Landing',
    section: 'Features',
    string: 'Track glucose levels continuously',
    language: 'fr',
    misc: 'Highlight full text',
    filename: '2-landing-features-french-track-glucose.png'
  },
  {
    page: 'Auth',
    section: 'Login Form',
    string: "Don't have an account?",
    language: 'fr',
    misc: 'Highlight text only',
    filename: '3-auth-login-form-french-dont-have-account.png'
  },
  {
    page: 'Dashboard',
    section: 'Activity Feed',
    string: 'BasalDelivery',
    language: 'de',
    misc: 'Highlight all instances',
    filename: '4-dashboard-activity-feed-german-basaldelivery.png'
  },
  {
    page: 'Dashboard',
    section: 'Glucose Chart',
    string: 'value',
    language: 'fr',
    misc: 'Highlight tooltip text',
    filename: '5-dashboard-glucose-chart-french-value-tooltip.png'
  }
];

// Language codes to full names for dropdown selection
const languageMap = {
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'en': 'English'
};

async function switchLanguage(page, langCode) {
  // Click on language dropdown button
  const langDropdown = page.locator('button:has-text("English"), button:has-text("Español"), button:has-text("Français"), button:has-text("Deutsch")').first();
  await langDropdown.click();
  await page.waitForTimeout(500);
  
  // Select the target language using getByRole for menuitem
  const targetLang = languageMap[langCode];
  await page.getByRole('menuitem', { name: new RegExp(targetLang) }).click();
  await page.waitForTimeout(1000);
}

async function highlightElement(page, selector, highlightAll = false) {
  await page.evaluate(({ selector, highlightAll }) => {
    // Remove any existing highlights
    document.querySelectorAll('*').forEach(el => {
      el.style.outline = '';
      el.style.outlineOffset = '';
      el.style.boxShadow = '';
    });

    // Find elements matching the selector/text
    const allElements = document.querySelectorAll('*');
    let count = 0;
    allElements.forEach(el => {
      const directText = Array.from(el.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent)
        .join('');
      
      if (directText.includes(selector) || (el.textContent && el.textContent.trim() === selector)) {
        if (highlightAll || count === 0) {
          el.style.outline = '3px solid red';
          el.style.outlineOffset = '2px';
          el.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
          count++;
        }
      }
    });
    return count;
  }, { selector, highlightAll });
}

async function runTestCase(browser, testCase, index) {
  console.log(`\n--- Running test case ${index + 1}: ${testCase.filename} ---`);
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to the appropriate page
    let url = BASE_URL;
    if (testCase.page === 'Auth') {
      url = `${BASE_URL}/auth`;
    } else if (testCase.page === 'Dashboard') {
      // Need to login first for dashboard
      await page.goto(`${BASE_URL}/auth`);
      await page.waitForTimeout(1000);
      
      // Click demo patient account button
      await page.locator('button:has-text("Demo Patient Account"), button:has-text("Compte Patient Démo")').click();
      await page.waitForTimeout(2000);
      url = page.url(); // Should be on dashboard now
    } else {
      url = BASE_URL;
    }
    
    if (testCase.page !== 'Dashboard') {
      await page.goto(url);
      await page.waitForTimeout(1000);
    }
    
    // Switch to the target language
    await switchLanguage(page, testCase.language);
    
    // Handle specific test cases
    if (testCase.section === 'Features') {
      // Scroll down to see features section
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(500);
    }
    
    if (testCase.section === 'Activity Feed') {
      // Scroll down to see activity feed
      await page.evaluate(() => window.scrollBy(0, 400));
      await page.waitForTimeout(500);
    }
    
    if (testCase.section === 'Glucose Chart' && testCase.string === 'value') {
      // Hover over the chart area to show tooltip - use the recharts container
      // The chart is inside a div with class containing 'recharts' or we can target the main content area
      const chartArea = page.locator('.recharts-wrapper, .recharts-surface').first();
      try {
        await chartArea.hover({ position: { x: 200, y: 100 }, timeout: 5000 });
      } catch (e) {
        // Fallback: hover over the main content area where the chart is
        await page.mouse.move(450, 380);
      }
      await page.waitForTimeout(1000);
    }
    
    // Highlight the target element(s)
    const highlightAll = testCase.misc.includes('all instances');
    await highlightElement(page, testCase.string, highlightAll);
    
    // Take screenshot
    const screenshotPath = path.join(SCREENSHOT_DIR, testCase.filename);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Screenshot saved: ${screenshotPath}`);
    
  } catch (error) {
    console.error(`Error in test case ${index + 1}:`, error.message);
  } finally {
    await context.close();
  }
}

async function main() {
  console.log('Starting Playwright CLI automation...');
  console.log(`Screenshots will be saved to: ${SCREENSHOT_DIR}`);
  
  // Ensure screenshot directory exists
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    for (let i = 0; i < testCases.length; i++) {
      await runTestCase(browser, testCases[i], i);
    }
  } finally {
    await browser.close();
  }
  
  console.log('\n=== Automation complete! ===');
  console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);
}

main().catch(console.error);
