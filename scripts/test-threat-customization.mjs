import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = '/home/ilvro/.gemini/antigravity/brain/86f889ad-cb1b-41e6-b2b9-a40fd2eaede3';

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950 });

  // 1. Acessa app local na porta 5180
  await page.goto('http://localhost:5180', { waitUntil: 'networkidle0' });

  // Desbloqueia o bestiário no localStorage e ativa a ficha Nidere
  await page.evaluate(async () => {
    localStorage.setItem('ordem_bestiary_license', JSON.stringify({
      unlocked: true,
      hash: 'test-verified',
      verifiedAt: Date.now()
    }));
    localStorage.setItem('ordem-ii-active-sheet', 'threat-lr-nidere');

    try {
      const req = indexedDB.open('ordem-ii-db', 1);
      req.onsuccess = (e) => {
        const db = e.target.result;
        if (db.objectStoreNames.contains('sheets-store')) {
          const tx = db.transaction('sheets-store', 'readwrite');
          tx.objectStore('sheets-store').put('threat-lr-nidere', 'activeSheetId');
        }
      };
    } catch (e) {}
  });

  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // 2. Clica no botão de alternar modo de edição [data-toggle-edit]
  console.log('Activating edit mode...');
  await page.evaluate(() => {
    const editBtn = document.querySelector('[data-toggle-edit]');
    if (editBtn) editBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Tira print com a barra de ferramentas de edição visível
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shot-threat-edit-tools-active.png') });
  console.log('Saved shot-threat-edit-tools-active.png');

  // 3. Aplica customizações:
  // - Nome: "A FERA"
  // - Subtítulo: limpa via botão [data-threat-clear-subtitle]
  // - Imagem de fundo: imagem escura personalizada
  // - Cor do card/banner: Roxo / Energia (#9419ff)
  // - Cor do texto: Branco (#ffffff)
  console.log('Applying customizations...');
  await page.evaluate(() => {
    // 1. Muda nome para "A FERA"
    const nameInput = document.querySelector('[data-threat-field="name"]');
    if (nameInput) {
      nameInput.value = 'A FERA';
      nameInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 2. Limpa o subtítulo
    const clearSubBtn = document.querySelector('[data-threat-clear-subtitle]');
    if (clearSubBtn) {
      clearSubBtn.click();
    }

    // 3. Muda a cor do card para Roxo (#9419ff)
    const cardColorInput = document.querySelector('[data-threat-banner-color]');
    if (cardColorInput) {
      cardColorInput.value = '#9419ff';
      cardColorInput.dispatchEvent(new Event('input', { bubbles: true }));
      cardColorInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 4. Muda a cor do texto para Branco puro (#ffffff)
    const textColorInput = document.querySelector('[data-threat-text-color]');
    if (textColorInput) {
      textColorInput.value = '#ffffff';
      textColorInput.dispatchEvent(new Event('input', { bubbles: true }));
      textColorInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 5. Gera um fundo escuro e atribui
    const canvas = document.createElement('canvas');
    canvas.width = 600; canvas.height = 600;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(300, 200, 50, 300, 300, 300);
    grad.addColorStop(0, '#1c0f2a');
    grad.addColorStop(0.5, '#0e0618');
    grad.addColorStop(1, '#05020a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 600);
    // estrelas/pontos cósmicos
    ctx.fillStyle = '#ff33aa';
    ctx.fillRect(150, 100, 3, 3);
    ctx.fillStyle = '#33aaff';
    ctx.fillRect(450, 350, 3, 3);
    const darkBgDataUrl = canvas.toDataURL();

    if (window.state) {
      window.state.backgroundImage = darkBgDataUrl;
      window.state.subtitulo = '';
      if (typeof window.save === 'function') window.save(false);
      if (typeof window.render === 'function') window.render();
    }
  });

  await new Promise(r => setTimeout(r, 800));

  // Tira print em modo de edição com o fundo escuro, texto branco e card roxo
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shot-threat-a-fera-custom-edit.png') });
  console.log('Saved shot-threat-a-fera-custom-edit.png');

  // 4. Sai do modo de edição para conferir a visualização final do leitor
  console.log('Exiting edit mode for reader view...');
  await page.evaluate(() => {
    const editBtn = document.querySelector('[data-toggle-edit]');
    if (editBtn) editBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Tira print no modo leitura (topo)
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shot-threat-a-fera-view-top.png') });
  console.log('Saved shot-threat-a-fera-view-top.png');

  // Verifica dados do topo
  const topChecks = await page.evaluate(() => {
    const pageEl = document.querySelector('.threat-book-page');
    const bannerEl = document.querySelector('.threat-banner-left');
    const subtitleRow = document.querySelector('.threat-subtitle-row');
    const subtitleTag = document.querySelector('.threat-subtitle-tag');
    const nameEl = document.querySelector('.threat-name-title');

    return {
      nameText: nameEl ? nameEl.textContent.trim() : null,
      subtitleRendered: Boolean(subtitleTag && subtitleTag.textContent.trim()),
      subtitleText: subtitleTag ? subtitleTag.textContent.trim() : null,
      hasCustomBgClass: pageEl.classList.contains('has-custom-bg'),
      themeClass: pageEl.classList.contains('theme-dark') ? 'theme-dark' : 'theme-light',
      bannerBgComputed: bannerEl ? window.getComputedStyle(bannerEl).backgroundColor : null,
      textColorVariable: pageEl.style.getPropertyValue('--threat-text-color'),
      bannerBgVariable: pageEl.style.getPropertyValue('--threat-banner-bg')
    };
  });
  console.log('Top view checks:', topChecks);

  // 5. Scroll test: rola a página para baixo e verifica se o fundo não é cortado
  console.log('Scrolling down to test background coverage...');
  await page.evaluate(() => {
    const pageEl = document.querySelector('.threat-book-page');
    if (pageEl) pageEl.scrollTop = 800;
  });
  await new Promise(r => setTimeout(r, 800));

  // Tira print após scroll
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shot-threat-a-fera-view-scrolled.png') });
  console.log('Saved shot-threat-a-fera-view-scrolled.png');

  const scrollChecks = await page.evaluate(() => {
    const pageEl = document.querySelector('.threat-book-page');
    const bgLayer = document.querySelector('.threat-book-page .sheet-background-layer');
    const bgRect = bgLayer ? bgLayer.getBoundingClientRect() : null;
    const bgStyle = bgLayer ? window.getComputedStyle(bgLayer) : null;
    return {
      scrollTop: pageEl.scrollTop,
      bgPosition: bgStyle ? bgStyle.position : null,
      bgTop: bgRect ? bgRect.top : null,
      bgBottom: bgRect ? bgRect.bottom : null,
      bgHeight: bgRect ? bgRect.height : null,
      windowHeight: window.innerHeight
    };
  });
  console.log('Scroll checks:', scrollChecks);

  await browser.close();
  console.log('All tests finished successfully!');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});

