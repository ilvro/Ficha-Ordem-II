import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 2 });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

  // Clear client storage to load fresh sheets from server /api/sheets
  await page.evaluate(async () => {
    localStorage.clear();
    const dbs = await window.indexedDB.databases?.() || [];
    for (const db of dbs) {
      if (db.name) window.indexedDB.deleteDatabase(db.name);
    }
  });

  // Reload page to fetch clean state
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Switch to O Uivar
  console.log('Capturing O UIVAR (Normal)...');
  await page.evaluate((id) => {
    localStorage.setItem('ordem-ii-active-sheet', id);
  }, 'threat-o-uivar-100');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'screenshot_uivar_book.png' });
  console.log('✓ screenshot_uivar_book.png salvo');

  // Hover over Fortitude roll token to demonstrate interactive box reveal
  console.log('Capturing O UIVAR (Hover on Fortitude)...');
  await page.hover('[data-threat-roll-save="fortitude"]');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'screenshot_uivar_hover.png' });
  console.log('✓ screenshot_uivar_hover.png salvo');

  await browser.close();
})();

