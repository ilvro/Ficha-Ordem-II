import { THREAT_ELEMENTS } from './threat-data.js';
import { normalizeThreatSheet, calcMachucado } from './threat-system.js';
import { icon } from '../../icons.js';

/**
 * Utilitário para escapar strings HTML
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Gera o SVG dos atributos: cinco hexágonos em anel ao redor do rótulo central
 * (mesmo desenho das fichas do livro). Sem brilho nem sombra nos textos.
 * Posições: AGI no topo, depois INT, VIG, PRE e FOR em sentido horário.
 */
export function renderAttributePentagonSvg(rawAttrs = {}, options = {}) {
  const attrsData = rawAttrs || {};
  const cx = 110, cy = 110;
  const ringR = 69;      // raio do anel onde ficam os centros dos hexágonos
  const hexR = 29;       // raio de cada hexágono
  const strokeColor = options.strokeColor || '#b01818';
  const hexFill = options.bgPetal || '#0c0e12';
  const width = options.width || 210;
  const height = options.height || 210;

  const hexPoints = (x, y, r) => Array.from({ length: 6 }, (_, k) => {
    const a = (-90 + k * 60) * Math.PI / 180;
    return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');

  const attrList = [
    { label: 'AGI', val: Number(attrsData.agi ?? 1), angle: 0 },
    { label: 'INT', val: Number(attrsData.int ?? 1), angle: 72 },
    { label: 'VIG', val: Number(attrsData.vig ?? 1), angle: 144 },
    { label: 'PRE', val: Number(attrsData.pre ?? 1), angle: 216 },
    { label: 'FOR', val: Number(attrsData.for ?? 1), angle: 288 }
  ];

  const centers = attrList.map(a => {
    const rad = (a.angle - 90) * Math.PI / 180;
    return { ...a, x: cx + ringR * Math.cos(rad), y: cy + ringR * Math.sin(rad) };
  });

  // Linhas finas ligando os hexágonos ao centro
  const spokes = centers.map(c => `<line x1="${cx}" y1="${cy}" x2="${c.x.toFixed(1)}" y2="${c.y.toFixed(1)}" stroke="${strokeColor}" stroke-width="1.5" opacity="0.55"/>`).join('');

  const hexes = centers.map(c => `
      <polygon points="${hexPoints(c.x, c.y, hexR)}" fill="${hexFill}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
      <text x="${c.x.toFixed(1)}" y="${(c.y + 3).toFixed(1)}" text-anchor="middle" fill="#ffffff" font-family="'Hanken Grotesk', sans-serif" font-size="23" font-weight="800">${c.val}</text>
      <text x="${c.x.toFixed(1)}" y="${(c.y + 17).toFixed(1)}" text-anchor="middle" fill="#b9bcc8" font-family="'Hanken Grotesk', sans-serif" font-size="9" font-weight="700" letter-spacing="1">${c.label}</text>
  `).join('');

  return `
    <svg class="threat-miro-pentagon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" width="${width}" height="${height}">
      ${spokes}
      <circle cx="${cx}" cy="${cy}" r="17" fill="${hexFill}" stroke="${strokeColor}" stroke-width="2"/>
      ${hexes}
    </svg>
  `;
}

/**
 * Formata rolagem de dados no padrão Miro: ex. 2d20+5, 1d20, 3d20+10
 */
function formatDicePool(dados, bonus) {
  const d = Math.max(1, Number(dados) || 1);
  const b = Number(bonus) || 0;
  if (!b) return `${d}d20`;
  return `${d}d20${b > 0 ? `+${b}` : b}`;
}

/**
 * Renderiza o Card Compacto para MIRO / VTT
 */
export function renderThreatMiroCardHtml(rawSheet, options = {}) {
  const sheet = normalizeThreatSheet(rawSheet);
  const isMundane = sheet.categoria === 'mundana';
  const elemDestaqueKey = isMundane ? 'mundana' : (sheet.elementoDestaque || (sheet.elementos || [])[0] || 'sangue');
  const elemDestaque = THREAT_ELEMENTS[elemDestaqueKey] || { cor: '#ffffff' };
  const themeColor = sheet.themeColor || (isMundane ? '#ffffff' : elemDestaque.cor);

  // Imagem de destaque (token ou arte narrativa)
  const portraitUrl = sheet.introImage || sheet.tokenImage || '';

  // Defesas
  const fort = formatDicePool(sheet.salvaguardas?.fortitude?.dados, sheet.salvaguardas?.fortitude?.bonus);
  const ref = formatDicePool(sheet.salvaguardas?.reflexos?.dados, sheet.salvaguardas?.reflexos?.bonus);
  const von = formatDicePool(sheet.salvaguardas?.vontade?.dados, sheet.salvaguardas?.vontade?.bonus);

  // Sentidos
  const percep = formatDicePool(sheet.sentidos?.percepcao?.dados, sheet.sentidos?.percepcao?.bonus);
  const inic = formatDicePool(sheet.sentidos?.iniciativa?.dados, sheet.sentidos?.iniciativa?.bonus);
  const sentidosExtras = sheet.sentidos?.outros ? ` / ${sheet.sentidos.outros.toUpperCase()}` : '';

  // Perícias
  const periciasList = (sheet.pericias || []).map(p => `${p.nome.toUpperCase()} ${formatDicePool(p.dados, p.bonus)}`).join(' | ');

  // Resistências, Vulnerabilidades, Imunidades
  const resList = (sheet.resistencias || []).map(r => `${r.tipo.toUpperCase()} ${r.valor}`).join(', ');
  const vulnList = (sheet.vulnerabilidades || []).join(', ').toUpperCase();
  const imunList = (sheet.imunidades || []).join(', ').toUpperCase();

  // Presença perturbadora
  const presenca = sheet.presenca?.ativa ? sheet.presenca : null;

  // Ações e Seções
  const acoes = sheet.acoes || [];
  const secoes = sheet.secoes || [];

  return `
    <div class="threat-miro-card" id="threat-miro-card-root">
      <div class="threat-miro-grid-bg"></div>

      <div class="threat-miro-content">
        <!-- CABEÇALHO -->
        <header class="threat-miro-header">
          ${portraitUrl ? `
            <div class="threat-miro-portrait-wrap">
              <img src="${portraitUrl}" class="threat-miro-portrait-img" alt="${escapeHtml(sheet.name)}" crossorigin="anonymous">
            </div>
          ` : ''}

          <div class="threat-miro-header-info">
            <h1 class="threat-miro-title" style="color:${themeColor};">${escapeHtml(sheet.name)}</h1>
            <div class="threat-miro-badge">${escapeHtml(sheet.name.toUpperCase())} | VD ${sheet.vd}</div>

            ${sheet.introText ? `
              <p class="threat-miro-intro">${escapeHtml(sheet.introText.split('\n')[0])}</p>
            ` : ''}

            <div class="threat-miro-meta">
              ${escapeHtml((sheet.tipo || (isMundane ? 'ANIMAL' : 'CRIATURA')).toUpperCase())} / ${escapeHtml((sheet.tamanho || 'MÉDIO').toUpperCase())}${!isMundane && sheet.elementos?.length ? ` / ${sheet.elementos.join(' / ').toUpperCase()}` : ''}
            </div>

            <!-- BADGES DE PV, DEFESA E DESLOCAMENTO -->
            <div class="threat-miro-badges-row">
              <span class="threat-miro-pill pill-pv">PV ${sheet.pv || sheet.pvMax}/${sheet.pvMax}</span>
              <span class="threat-miro-pill pill-def">DEFESA ${sheet.defesa}</span>
              <span class="threat-miro-pill pill-desl">DESL. ${sheet.deslocamento?.metros || 12}M | ${sheet.deslocamento?.quadrados || 8}Q</span>
            </div>
          </div>
        </header>

        <!-- LINHAS COMPACTAS DE SENTIDOS E DEFESAS -->
        <div class="threat-miro-stats-block">
          <div class="threat-miro-stat-line">
            <strong>SENTIDOS</strong> | PERCEPÇÃO ${percep} | INICIATIVA ${inic}${sentidosExtras}
          </div>
          <div class="threat-miro-stat-line">
            <strong>DEFESAS</strong> | FORTITUDE ${fort} | REFLEXOS ${ref} | VONTADE ${von}
          </div>
          ${periciasList ? `
            <div class="threat-miro-stat-line">
              <strong>PERÍCIAS</strong> | ${periciasList}
            </div>
          ` : ''}
          ${resList ? `
            <div class="threat-miro-stat-line">
              <strong>RESISTÊNCIAS</strong> | ${resList}
            </div>
          ` : ''}
          ${vulnList ? `
            <div class="threat-miro-stat-line">
              <strong>VULNERABILIDADES</strong> | ${vulnList}
            </div>
          ` : ''}
          ${imunList ? `
            <div class="threat-miro-stat-line">
              <strong>IMUNIDADES</strong> | ${imunList}
            </div>
          ` : ''}
          ${presenca ? `
            <div class="threat-miro-stat-line">
              <strong>PRESENÇA PERTURBADORA</strong> | DT ${presenca.dt} | ${escapeHtml(presenca.dano)} ${escapeHtml(presenca.tipoDano)} | NEX ${presenca.imuneNex}%+ é imune
            </div>
          ` : ''}
        </div>

        <!-- GRADE INFERIOR: ATRIBUTOS + AÇÕES + HABILIDADES -->
        <div class="threat-miro-combat-grid">
          <!-- Coluna 1: Pentágono de Atributos -->
          <div class="threat-miro-col-attrs">
            ${renderAttributePentagonSvg(sheet.atributos, { 
              strokeColor: themeColor === '#ffffff' ? '#b01818' : themeColor, 
              fillColor: themeColor === '#ffffff' ? '#b01818' : themeColor,
              width: 220,
              height: 220
            })}
          </div>

          <!-- Coluna 2: Ataques e Ações de Combate -->
          <div class="threat-miro-col-actions">
            ${acoes.map(acao => {
              const ataques = acao.ataques || [];
              if (ataques.length > 0) {
                return ataques.map(atk => {
                  const critStr = (atk.margemCritica && atk.margemCritica < 20)
                    ? ` ${atk.margemCritica}${atk.multiplicador > 1 ? `/x${atk.multiplicador}` : ''}`
                    : (atk.multiplicador > 1 ? ` x${atk.multiplicador}` : '');
                  return `
                    <div class="threat-miro-entry">
                      <div class="threat-miro-entry-title">
                        ${escapeHtml((atk.nome || 'ATAQUE').toUpperCase())} | ${escapeHtml((atk.tipoAlcance || 'Corpo a corpo').toUpperCase())}${critStr}
                      </div>
                      <div class="threat-miro-entry-sub">
                        ${formatDicePool(atk.dados, atk.bonus)} | Dano ${escapeHtml(atk.dano || '1d6')} ${escapeHtml(atk.tipoDano || '')}
                      </div>
                    </div>
                  `;
                }).join('');
              } else {
                return `
                  <div class="threat-miro-entry">
                    <div class="threat-miro-entry-title">
                      ${escapeHtml(acao.nome.toUpperCase())} (${escapeHtml(acao.tipoAcao.toUpperCase())})
                    </div>
                    ${acao.texto ? `<div class="threat-miro-entry-body">${escapeHtml(acao.texto)}</div>` : ''}
                  </div>
                `;
              }
            }).join('')}
          </div>

          <!-- Coluna 3: Características e Habilidades (Passivas / Seções) -->
          <div class="threat-miro-col-traits">
            ${secoes.length > 0 ? secoes.map(sec => `
              <div class="threat-miro-entry">
                <div class="threat-miro-entry-title">${escapeHtml(sec.titulo.toUpperCase())}</div>
                <div class="threat-miro-entry-body">${escapeHtml(sec.corpo)}</div>
              </div>
            `).join('') : `
              <div class="threat-miro-entry">
                <div class="threat-miro-entry-body" style="opacity:0.6;font-style:italic;">Nenhuma característica adicional.</div>
              </div>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Exporta a ficha completa em PNG HD (Estilo Livro Oficial)
 */
export async function exportThreatFullImage(rawSheet, options = {}) {
  const sheet = normalizeThreatSheet(rawSheet);
  const showToastMsg = options.showToastMsg || console.log;

  showToastMsg('RENDERIZANDO FICHA COMPLETA HD...', 4000);

  const threatPage = document.querySelector('.threat-book-page');
  if (!threatPage) {
    showToastMsg('ERRO: FICHA NÃO ENCONTRADA NA TELA', 2500);
    return;
  }

  document.body.classList.add('threat-exporting');
  threatPage.classList.add('is-exporting-full');

  try {
    const { toPng } = await import('html-to-image');

    const filter = (node) => {
      if (node.nodeType !== 1) return true;
      const cl = node.classList;
      if (!cl) return true;
      return !(
        cl.contains('threat-assistant-bar') ||
        cl.contains('threat-attr-step-btn') ||
        cl.contains('threat-hp-steppers-book') ||
        cl.contains('threat-modal') ||
        cl.contains('modal') ||
        cl.contains('threat-export-trigger-btn') ||
        cl.contains('threat-sigil-edit-overlay') ||
        cl.contains('threat-intro-edit-bar') ||
        cl.contains('threat-intro-artwork-overlay') ||
        cl.contains('threat-intro-artwork-ph') ||
        cl.contains('btn-add-section') ||
        cl.contains('threat-add-action-btn') ||
        cl.contains('threat-card-add-trigger') ||
        cl.contains('threat-card-remove-btn') ||
        cl.contains('threat-btn-edit-action') ||
        cl.contains('nav-rail') ||
        cl.contains('save-toast')
      );
    };

    await new Promise(r => setTimeout(r, 120));

    const dataUrl = await toPng(threatPage, {
      pixelRatio: 2,
      quality: 0.98,
      filter,
      style: {
        margin: '0',
        padding: '32px'
      }
    });

    const cleanName = (sheet.name || 'Ameaca').trim().replace(/[/\\?%*:|"<>]/g, '-');
    const filename = `${cleanName} - Ficha Completa.png`;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToastMsg('FICHA COMPLETA EXPORTADA COM SUCESSO!', 2500);
  } catch (err) {
    console.error('Erro ao exportar ficha completa:', err);
    showToastMsg('ERRO AO EXPORTAR FICHA', 2500);
  } finally {
    document.body.classList.remove('threat-exporting');
    threatPage.classList.remove('is-exporting-full');
  }
}

/**
 * Exporta o Card Compacto para MIRO em PNG HD
 */
export async function exportThreatMiroCard(rawSheet, options = {}) {
  const sheet = normalizeThreatSheet(rawSheet);
  const showToastMsg = options.showToastMsg || console.log;

  showToastMsg('GERANDO CARD COMPACTO PARA MIRO...', 4000);

  // Cria um container offscreen no DOM para renderizar o Card Miro
  const container = document.createElement('div');
  container.className = 'threat-miro-export-sandbox';
  container.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1000;pointer-events:none;';
  container.innerHTML = renderThreatMiroCardHtml(sheet, options);
  document.body.appendChild(container);

  try {
    const cardEl = container.querySelector('.threat-miro-card');
    if (!cardEl) throw new Error('Card Miro não renderizado');

    // Aguarda carregar imagens se houver
    const imgs = cardEl.querySelectorAll('img');
    await Promise.all(Array.from(imgs).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    await new Promise(r => setTimeout(r, 150));

    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(cardEl, {
      pixelRatio: 2,
      quality: 0.98
    });

    const cleanName = (sheet.name || 'Ameaca').trim().replace(/[/\\?%*:|"<>]/g, '-');
    const filename = `${cleanName} - Miro Card.png`;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToastMsg('CARD MIRO EXPORTADO COM SUCESSO!', 2500);
  } catch (err) {
    console.error('Erro ao exportar card Miro:', err);
    showToastMsg('ERRO AO EXPORTAR CARD MIRO', 2500);
  } finally {
    container.remove();
  }
}

/**
 * Abre o Modal com as opções de exportação: Ficha Completa ou Card Miro
 */
export function openThreatExportModal(rawSheet, options = {}) {
  const sheet = normalizeThreatSheet(rawSheet);
  const existingModal = document.getElementById('threat-export-dialog-modal');
  if (existingModal) existingModal.remove();

  const modalHtml = `
    <div class="modal threat-modal threat-export-modal open" id="threat-export-dialog-modal">
      <div class="backdrop editor-backdrop" data-threat-close-export></div>
      <section class="threat-export-modal-box">
        <header class="threat-export-modal-header">
          <div>
            <small style="color:var(--threat-elem-color, #e0150d);letter-spacing:.15em;font-weight:800;">EXPORTAR IMAGEM</small>
            <h2>EXPORTAR AMEAÇA</h2>
          </div>
          <button type="button" class="editor-close" data-threat-close-export title="Fechar">${icon('close')}</button>
        </header>

        <p class="threat-export-lead">
          Escolha o formato de imagem desejado para <b>${escapeHtml(sheet.name)}</b> (VD ${sheet.vd}):
        </p>

        <div class="threat-export-cards-grid">
          <!-- OPÇÃO 1: FICHA COMPLETA -->
          <div class="threat-export-choice-card" data-threat-export-action="full">
            <div class="choice-icon">${icon('book', 26)}</div>
            <div class="choice-content">
              <h3>Ficha Completa (Livro HD)</h3>
              <p>Diagramação oficial idêntica ao livro <em>Sobrevivendo ao Horror</em> com texturas completas do elemento, seções e todas as ações detalhadas em alta definição.</p>
              <button type="button" class="btn-export-choice btn-choice-full">
                ${icon('camera', 14)} BAIXAR COMPLETO (PNG HD)
              </button>
            </div>
          </div>

          <!-- OPÇÃO 2: CARD COMPACTO MIRO -->
          <div class="threat-export-choice-card" data-threat-export-action="miro">
            <div class="choice-icon">${icon('folder', 26)}</div>
            <div class="choice-content">
              <h3>Card Compacto (Miro / VTT)</h3>
              <p>Formato compacto com fundo escuro, grid milimétrico do Miro, pentágono de atributos e resumo de combate ideal para tabuleiros virtuais e notas.</p>
              <button type="button" class="btn-export-choice btn-choice-miro">
                ${icon('download', 14)} BAIXAR CARD MIRO (PNG HD)
              </button>
            </div>
          </div>
        </div>

        <!-- PRÉVIA INTERATIVA DO CARD MIRO -->
        <div class="threat-export-preview-accordion">
          <button type="button" class="btn-toggle-preview" id="btn-toggle-miro-preview">
            <span>${icon('eye', 14)} Visualizar prévia do card Miro</span>
            <span class="preview-arrow">▼</span>
          </button>
          <div class="threat-export-preview-viewport" id="threat-miro-preview-viewport" style="display:none;">
            ${renderThreatMiroCardHtml(sheet)}
          </div>
        </div>

        <footer class="threat-export-modal-footer">
          <button type="button" class="editor-close secondary" data-threat-close-export>CANCELAR</button>
        </footer>
      </section>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modalEl = document.getElementById('threat-export-dialog-modal');
  if (!modalEl) return;

  const closeModal = () => modalEl.remove();

  modalEl.querySelectorAll('[data-threat-close-export]').forEach(btn => {
    btn.onclick = closeModal;
  });

  // Ação de exportar completo
  modalEl.querySelector('[data-threat-export-action="full"] .btn-choice-full').onclick = async () => {
    closeModal();
    await exportThreatFullImage(sheet, options);
  };

  // Ação de exportar miro
  modalEl.querySelector('[data-threat-export-action="miro"] .btn-choice-miro').onclick = async () => {
    closeModal();
    await exportThreatMiroCard(sheet, options);
  };

  // Alternar prévia
  const toggleBtn = modalEl.querySelector('#btn-toggle-miro-preview');
  const previewVp = modalEl.querySelector('#threat-miro-preview-viewport');
  if (toggleBtn && previewVp) {
    toggleBtn.onclick = () => {
      const isHidden = previewVp.style.display === 'none';
      previewVp.style.display = isHidden ? 'block' : 'none';
      toggleBtn.querySelector('.preview-arrow').textContent = isHidden ? '▲' : '▼';
    };
  }
}
