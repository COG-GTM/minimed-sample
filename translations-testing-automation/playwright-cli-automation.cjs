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
  // First, find and scroll to the element(s)
  const scrollResult = await page.evaluate(({ selector, highlightAll }) => {
    // Remove any existing highlight overlays
    document.querySelectorAll('.devin-highlight-overlay').forEach(el => el.remove());

    // Find elements matching the selector/text
    const allElements = document.querySelectorAll('*');
    const matchedElements = [];
    
    allElements.forEach(el => {
      // Skip script, style, and our overlay elements
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.classList.contains('devin-highlight-overlay')) {
        return;
      }
      
      const directText = Array.from(el.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .join('');
      
      const fullText = el.textContent ? el.textContent.trim() : '';
      
      // Check if this element directly contains the text (not just via children)
      if (directText.includes(selector) || fullText === selector) {
        // Prefer elements that are visible and have a bounding box
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          matchedElements.push({ el, directMatch: directText.includes(selector) });
        }
      }
    });
    
    // Sort to prefer direct text matches and smaller (more specific) elements
    matchedElements.sort((a, b) => {
      if (a.directMatch && !b.directMatch) return -1;
      if (!a.directMatch && b.directMatch) return 1;
      const rectA = a.el.getBoundingClientRect();
      const rectB = b.el.getBoundingClientRect();
      return (rectA.width * rectA.height) - (rectB.width * rectB.height);
    });
    
    // Get elements to highlight
    const elementsToHighlight = highlightAll ? matchedElements : matchedElements.slice(0, 1);
    
    // Scroll the first element into view
    if (elementsToHighlight.length > 0) {
      elementsToHighlight[0].el.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
    
    return elementsToHighlight.length;
  }, { selector, highlightAll });
  
  // Wait for scroll to complete
  await page.waitForTimeout(300);
  
  // Now create overlays after scroll (recalculate positions)
  const count = await page.evaluate(({ selector, highlightAll }) => {
    // Find elements again after scroll
    const allElements = document.querySelectorAll('*');
    const matchedElements = [];
    
    allElements.forEach(el => {
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.classList.contains('devin-highlight-overlay')) {
        return;
      }
      
      const directText = Array.from(el.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .join('');
      
      const fullText = el.textContent ? el.textContent.trim() : '';
      
      if (directText.includes(selector) || fullText === selector) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          matchedElements.push({ el, rect, directMatch: directText.includes(selector) });
        }
      }
    });
    
    matchedElements.sort((a, b) => {
      if (a.directMatch && !b.directMatch) return -1;
      if (!a.directMatch && b.directMatch) return 1;
      return (a.rect.width * a.rect.height) - (b.rect.width * b.rect.height);
    });
    
    const elementsToHighlight = highlightAll ? matchedElements : matchedElements.slice(0, 1);
    
    // Create overlay boxes with fresh bounding box calculations
    elementsToHighlight.forEach((item) => {
      const rect = item.el.getBoundingClientRect();
      
      // Only create overlay if element is in viewport
      if (rect.top >= -50 && rect.top < window.innerHeight + 50) {
        const overlay = document.createElement('div');
        overlay.className = 'devin-highlight-overlay';
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
          box-sizing: border-box;
        `;
        document.body.appendChild(overlay);
      }
    });
    
    return document.querySelectorAll('.devin-highlight-overlay').length;
  }, { selector, highlightAll });
  
  console.log(`  Highlighted ${count} element(s) for "${selector}"`);
  
  // Wait for paint
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  
  return count;
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
      // Find the glucose chart (the AreaChart, not the PieChart)
      // The glucose chart is in the card with "24-Hour Glucose Trend" or its French translation
      const glucoseChartCard = page.locator('.recharts-wrapper').first();
      
      try {
        // Get the bounding box of the chart
        const box = await glucoseChartCard.boundingBox();
        if (box) {
          // Sweep across the chart to find a data point and trigger tooltip
          let tooltipFound = false;
          const yPos = box.y + box.height * 0.4; // 40% from top of chart
          
          for (let i = 0; i < 30 && !tooltipFound; i++) {
            const xPos = box.x + (box.width * (i + 5) / 40); // Sweep from left to right
            await page.mouse.move(xPos, yPos);
            await page.waitForTimeout(100);
            
            // Check if tooltip appeared
            const tooltipVisible = await page.locator('.recharts-tooltip-wrapper').isVisible().catch(() => false);
            if (tooltipVisible) {
              tooltipFound = true;
              console.log(`  Tooltip found at position ${i}`);
            }
          }
          
          if (!tooltipFound) {
            console.log('  Warning: Could not trigger tooltip by sweeping');
          }
        }
      } catch (e) {
        console.log(`  Error triggering tooltip: ${e.message}`);
      }
      
      await page.waitForTimeout(500);
      
      // Now highlight the tooltip content instead of searching for "value" globally
      // The tooltip contains the glucose value, so highlight the entire tooltip
      const tooltipHighlighted = await page.evaluate(() => {
        document.querySelectorAll('.devin-highlight-overlay').forEach(el => el.remove());
        
        const tooltip = document.querySelector('.recharts-tooltip-wrapper');
        if (tooltip) {
          const rect = tooltip.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            const overlay = document.createElement('div');
            overlay.className = 'devin-highlight-overlay';
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
              box-sizing: border-box;
            `;
            document.body.appendChild(overlay);
            return true;
          }
        }
        return false;
      });
      
      if (tooltipHighlighted) {
        console.log(`  Highlighted tooltip for "value"`);
        // Take screenshot immediately while tooltip is visible
        const screenshotPath = path.join(SCREENSHOT_DIR, testCase.filename);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`Screenshot saved: ${screenshotPath}`);
        await context.close();
        return; // Exit early since we handled this case specially
      }
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
