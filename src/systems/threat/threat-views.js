/**
 * Visualizações da Ficha de Ameaça (Modo Livro Dossiê - Fase 3)
 * Design oficial de Ordem Paranormal RPG
 */

import { icon } from '../../icons.js';
import { die } from '../../dice-icon.js';
import {
  calcMachucado,
  estaMachucada,
  calcQuadrados,
  formatPool,
  formatPoolGlyph,
  normalizeThreatSheet
} from './threat-system.js';
import {
  THREAT_ELEMENTS,
  ACTION_TYPES,
  THREAT_SIZES,
  DAMAGE_TYPES,
  CREATURE_TYPES_PARANORMAL,
  CREATURE_TYPES_MUNDANE
} from './threat-data.js';
import {
  getBalance,
  evaluateSheet,
  ELEMENT_VULNERABILITY_HINTS
} from './threat-balance.js';

function formatDiePool(pool) {
  if (!pool) return `<span class="threat-pool-group"><b>1</b>${die(20, 'threat-tabletop-die')}</span>`;
  const d = Math.max(1, Number(pool.dados) || 1);
  const b = Number(pool.bonus) || 0;
  const bStr = b > 0 ? `+${b}` : (b < 0 ? `${b}` : '');
  return `<span class="threat-pool-group"><b>${d}</b>${die(20, 'threat-tabletop-die')}${bStr ? `<b class="threat-bonus-val">${bStr}</b>` : ''}</span>`;
}

function formatDamageFormula(formula) {
  if (!formula) return '';
  return safe(formula);
}

function safe(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeUrl(str) {
  if (!str) return '';
  return String(str).replace(/[<>"']/g, '');
}

/**
 * Renderiza a ficha completa de Ameaça no Modo Livro
 */
export function renderThreatBook(rawSheet, editMode = false, options = {}) {
  const sheet = normalizeThreatSheet(rawSheet);
  const { safeUrl = s => s, renderBackgroundLayer } = options;

  const isMundane = sheet.categoria === 'mundana';
  const elemDestaqueKey = sheet.elementoDestaque || (sheet.elementos || [])[0] || 'sangue';
  const elemDestaque = THREAT_ELEMENTS[elemDestaqueKey] || THREAT_ELEMENTS.sangue;
  const secondaryElements = (sheet.elementos || []).filter(e => e !== elemDestaqueKey);
  const availableComplementary = Object.keys(THREAT_ELEMENTS).filter(e => e !== elemDestaqueKey && !secondaryElements.includes(e));

  const elemColor = sheet.themeColor || (isMundane ? '#ffffff' : elemDestaque.cor);
  const elemDark = isMundane ? '#141620' : (elemDestaqueKey === 'morte' ? '#08080c' : (elemDestaqueKey === 'sangue' ? '#260608' : (elemDestaqueKey === 'energia' ? '#1d082c' : '#2b2108')));
  const elemGlow = isMundane ? 'rgba(255,255,255,0.2)' : `rgba(${hexToRgb(elemColor)}, 0.3)`;

  let activeSigilSrc = '';
  if (sheet.sigilImage) {
    activeSigilSrc = sheet.sigilImage;
  } else if (sheet.sigiloId && sheet.sigiloId !== 'escudo' && THREAT_ELEMENTS[sheet.sigiloId]) {
    activeSigilSrc = `/assets/elements/${sheet.sigiloId}.png`;
  } else if (!isMundane && sheet.sigiloId !== 'escudo') {
    activeSigilSrc = `/assets/elements/${elemDestaqueKey}.png`;
  }

  const machucado = calcMachucado(sheet);
  const hurt = estaMachucada(sheet);
  const quadrados = calcQuadrados(sheet.deslocamento?.metros || 12);
  const hpPct = Math.max(0, Math.min(100, Math.round(((sheet.pv || 0) / (sheet.pvMax || 1)) * 100)));

  const balSug = getBalance(sheet.vd || 60, 'equilibrada');
  const evalBal = evaluateSheet(sheet, 'equilibrada');
  const elemWeakHint = (!isMundane && ELEMENT_VULNERABILITY_HINTS[elemDestaqueKey]) ? ELEMENT_VULNERABILITY_HINTS[elemDestaqueKey] : null;

  // Separação de seções e ações por coluna do livro
  const secoesEsquerda = (sheet.secoes || []).filter(s => s.coluna !== 'direita');
  const secoesDireita = (sheet.secoes || []).filter(s => s.coluna === 'direita');
  const acoesEsquerda = (sheet.acoes || []).filter(a => a.coluna === 'esquerda');
  const acoesDireita = (sheet.acoes || []).filter(a => a.coluna !== 'esquerda');

  return `
    <main class="threat-book-page threat-page-${elemDestaqueKey} element-theme-${elemDestaqueKey} ${editMode ? 'mode-edit' : ''}" 
      data-element="${elemDestaqueKey}"
      style="--threat-elem-color:${elemColor};--threat-elem-dark:${elemDark};--threat-elem-glow:${elemGlow};">
      
      ${typeof renderBackgroundLayer === 'function' ? renderBackgroundLayer() : ''}

      <article class="threat-dossier-card" aria-label="Ficha de Ameaça: ${safe(sheet.name)}">
        
        <!-- MARCA D'ÁGUA / ILUSTRAÇÃO DA CRIATURA NO FUNDO -->
        ${sheet.tokenImage ? `
          <div class="threat-creature-watermark" style="background-image:url('${safeUrl(sheet.tokenImage)}');" aria-hidden="true"></div>
        ` : ''}

        <!-- ── BARRA BRANCA DECORATIVA SUPERIOR DO LIVRO ── -->
        <div class="threat-book-top-bar" aria-hidden="true"></div>

        ${editMode ? `
          <!-- ── BARRA DO ASSISTENTE DE BALANCEAMENTO E WIZARD (MODO EDIÇÃO) ── -->
          <div class="threat-assistant-bar">
            <div class="threat-assistant-left">
              <button type="button" class="threat-assistant-btn btn-balance" data-threat-open-balance title="Abrir Assistente de Balanceamento por VD">
                ⚖️ BALANCEAMENTO (VD ${sheet.vd})
              </button>
              <button type="button" class="threat-assistant-btn btn-wizard" data-threat-open-wizard title="Abrir Wizard de Criação / Recalibração">
                🧙 WIZARD DE CRIAÇÃO
              </button>
              <button type="button" class="threat-assistant-btn btn-bg" data-threat-open-bg title="Mudar plano de fundo ou arte da criatura">
                🖼️ PLANO DE FUNDO
              </button>
            </div>
            <div class="threat-assistant-right">
              <span class="threat-assistant-summary">
                4 agentes NEX ~<b>${Math.max(5, Math.round(sheet.vd / 4))}%</b> • PV Sugerido: <b>${balSug.pv}</b> • Defesa: <b>${balSug.defesa}</b> • DT: <b>${balSug.dt}</b>
              </span>
            </div>
          </div>
        ` : ''}

        <!-- ── CORPO EDITORIAL EM 2 COLUNAS DO LIVRO ── -->
        <div class="threat-book-columns-layout">
          
          <!-- ── COLUNA ESQUERDA: CABEÇALHO, ESTATÍSTICAS E REGRAS ── -->
          <div class="threat-book-col-left">

            <!-- ── BANNER / CABEÇALHO DO LIVRO (INTEGRADO NO TOPO DA COLUNA ESQUERDA) ── -->
            <header class="threat-banner-header">
              <div class="threat-banner-left element-banner-${elemDestaqueKey}">
                <div class="threat-sigil-icon ${editMode ? 'editable' : ''}" 
                     ${editMode ? 'data-threat-open-sigil-modal' : ''} 
                     title="${editMode ? 'Clique para alterar o símbolo ou enviar um personalizado' : safe(elemDestaque.nome)}">
                  ${activeSigilSrc ? `
                    <img src="${safeUrl(activeSigilSrc)}" class="threat-element-sigil-img" alt="${safe(elemDestaque.nome)}" draggable="false">
                  ` : icon('shield', 36)}
                  ${editMode ? `
                    <div class="threat-sigil-edit-overlay">
                      ${icon('camera', 13)}
                      <span>MUDAR</span>
                    </div>
                  ` : ''}
                </div>
                <div class="threat-name-wrap">
                  <div class="threat-title-row">
                    ${editMode ? `
                      <input type="text" class="threat-editable-input threat-name-title" 
                        data-threat-field="name" value="${safe(sheet.name)}" placeholder="NOME DA AMEAÇA">
                    ` : `
                      <h1 class="threat-name-title">${safe(sheet.name)}</h1>
                    `}
                  </div>
                  <div class="threat-subtitle-row">
                    ${editMode ? `
                      <input type="text" class="threat-editable-input threat-subtitle-tag" 
                        data-threat-field="subtitulo" value="${safe(sheet.subtitulo)}" placeholder="SUBTÍTULO (EX: ENERGIA)">
                    ` : (sheet.subtitulo ? `<span class="threat-subtitle-tag">${safe(sheet.subtitulo)}</span>` : `<span class="threat-subtitle-tag">${safe(isMundane ? 'REALIDADE' : elemDestaque.nome.toUpperCase())}</span>`)}
                  </div>
                </div>
              </div>

              <!-- VD STAMP DO LIVRO (SEM CÍRCULO ESTRANHO) -->
              <div class="threat-book-vd-stamp" title="Valor de Desafio: ${sheet.vd}">
                <span class="vd-text">VD</span>
                ${editMode ? `
                  <input type="number" class="threat-vd-input" min="0" max="999" 
                    data-threat-field="vd" value="${sheet.vd}">
                ` : `
                  <strong class="vd-number">${sheet.vd}</strong>
                `}
              </div>
            </header>

            <!-- ── BARRA DE TAGS E METADADOS DO LIVRO (CRIATURA • TAMANHO) ── -->
            <div class="threat-meta-line">
              <div class="threat-meta-tags-group">
                ${!isMundane ? `
                  ${editMode ? `
                    <div class="threat-edit-elements-bar">
                      <!-- Seletor do Elemento Principal -->
                      <div class="threat-primary-badge-wrap" title="Elemento Principal (determina a cor do tema, fraqueza e sigilo)">
                        <span class="threat-element-role-label">PRINCIPAL:</span>
                        <label class="threat-primary-elem-select-btn" style="--elem-color:${elemDestaque.cor};">
                          <img src="/assets/elements/${elemDestaqueKey}.png" class="threat-mini-sigil" alt="" draggable="false">
                          <span>${safe(elemDestaque.nome.toUpperCase())}</span>
                          <select class="threat-ghost-select" data-threat-select-primary-elem title="Mudar Elemento Principal">
                            ${Object.values(THREAT_ELEMENTS).map(el => `
                              <option value="${el.id}" ${sheet.elementoDestaque === el.id ? 'selected' : ''}>
                                ${safe(el.nome.toUpperCase())}
                              </option>
                            `).join('')}
                          </select>
                        </label>
                      </div>

                      <span class="tag-bullet">•</span>

                      <!-- Elementos Complementares Ativos -->
                      <div class="threat-comp-elements-wrap">
                        <span class="threat-element-role-label">COMPLEMENTAR:</span>
                        ${secondaryElements.map(elKey => {
                          const el = THREAT_ELEMENTS[elKey];
                          if (!el) return '';
                          return `
                            <span class="threat-comp-active-pill" style="--elem-color:${el.cor};" title="Elemento complementar ativo">
                              ${safe(el.nome.toUpperCase())}
                              <button type="button" class="threat-comp-remove-btn" data-threat-del-comp="${el.id}" title="Remover complemento ${el.nome}">×</button>
                            </span>
                          `;
                        }).join('')}

                        <!-- Botões Rápidos para Adicionar Elemento Complementar -->
                        ${availableComplementary.map(elKey => {
                          const el = THREAT_ELEMENTS[elKey];
                          if (!el) return '';
                          return `
                            <button type="button" class="threat-comp-add-pill" style="--elem-color:${el.cor};" data-threat-add-comp="${el.id}" title="Adicionar ${el.nome} como elemento complementar">
                              + ${safe(el.nome.toUpperCase())}
                            </button>
                          `;
                        }).join('')}
                      </div>

                      <span class="tag-bullet">•</span>

                      <!-- Personalização da Cor do Tema -->
                      <div class="threat-theme-color-wrap" title="Personalizar cor de destaque da Ameaça">
                        <span class="threat-element-role-label">COR TEMA:</span>
                        <label class="threat-theme-color-chip" style="--elem-color:${elemColor};" title="Escolher cor personalizada">
                          <input type="color" data-threat-theme-color value="${elemColor}">
                          <span class="color-dot" style="background:${elemColor};"></span>
                          <span>${sheet.themeColor ? sheet.themeColor.toUpperCase() : 'ELEMENTO'}</span>
                        </label>
                        ${sheet.themeColor ? `
                          <button type="button" class="threat-comp-remove-btn" data-threat-reset-theme-color title="Restaurar cor padrão do elemento">↺</button>
                        ` : ''}
                      </div>

                      <span class="tag-bullet">•</span>

                      <!-- Botão de Símbolo da Ameaça -->
                      <div class="threat-sigil-btn-wrap">
                        <button type="button" class="threat-mini-sigil-btn" data-threat-open-sigil-modal title="Alterar o símbolo da Ameaça">
                          ${activeSigilSrc ? `<img src="${safeUrl(activeSigilSrc)}" class="threat-mini-sigil" alt="">` : icon('shield', 12)}
                          <span>SÍMBOLO</span>
                          ${sheet.sigilImage || (sheet.sigiloId && sheet.sigiloId !== elemDestaqueKey) ? `
                            <span class="threat-custom-badge" title="Símbolo personalizado">★</span>
                          ` : ''}
                        </button>
                      </div>
                    </div>
                    <span class="tag-bullet">•</span>
                  ` : `
                    ${secondaryElements.map(elKey => {
                      const el = THREAT_ELEMENTS[elKey];
                      if (!el) return '';
                      const isMedo = el.id === 'medo';
                      return `<span class="threat-meta-elem-pill element-pill-${el.id}">${isMedo ? `<img src="/assets/elements/medo.png" class="threat-pill-sigil-icon" alt="" draggable="false">` : ''}${safe(el.nome.toUpperCase())}</span>`;
                    }).join('')}
                    ${secondaryElements.length ? `<span class="tag-bullet">•</span>` : ''}
                  `}
                ` : `
                  <span class="threat-book-plain-tag">MUNDANA</span>
                  ${editMode ? `
                    <div class="threat-edit-elements-bar" style="margin-left:6px;display:inline-flex;gap:6px;">
                      <div class="threat-theme-color-wrap" title="Personalizar cor de destaque da Ameaça">
                        <span class="threat-element-role-label">COR TEMA:</span>
                        <label class="threat-theme-color-chip" style="--elem-color:${elemColor};" title="Escolher cor personalizada">
                          <input type="color" data-threat-theme-color value="${elemColor}">
                          <span class="color-dot" style="background:${elemColor};"></span>
                          <span>${sheet.themeColor ? sheet.themeColor.toUpperCase() : 'PADRÃO'}</span>
                        </label>
                        ${sheet.themeColor ? `
                          <button type="button" class="threat-comp-remove-btn" data-threat-reset-theme-color title="Restaurar cor padrão">↺</button>
                        ` : ''}
                      </div>
                      <div class="threat-sigil-btn-wrap">
                        <button type="button" class="threat-mini-sigil-btn" data-threat-open-sigil-modal title="Alterar o símbolo da Ameaça">
                          ${activeSigilSrc ? `<img src="${safeUrl(activeSigilSrc)}" class="threat-mini-sigil" alt="">` : icon('shield', 12)}
                          <span>SÍMBOLO</span>
                        </button>
                      </div>
                    </div>
                  ` : ''}
                  <span class="tag-bullet">•</span>
                `}

                ${editMode ? `
                  <select class="threat-book-select" data-threat-field="tipo">
                    ${(isMundane ? CREATURE_TYPES_MUNDANE : CREATURE_TYPES_PARANORMAL).map(t => `
                      <option value="${safe(t)}" ${sheet.tipo === t ? 'selected' : ''}>${safe(t.toUpperCase())}</option>
                    `).join('')}
                  </select>
                  <span class="tag-bullet">•</span>
                  <select class="threat-book-select" data-threat-field="tamanho">
                    ${THREAT_SIZES.map(s => `
                      <option value="${safe(s)}" ${sheet.tamanho === s ? 'selected' : ''}>${safe(s.toUpperCase())}</option>
                    `).join('')}
                  </select>
                ` : `
                  <span class="threat-book-plain-tag">${safe(sheet.tipo?.toUpperCase() || 'CRIATURA')}</span>
                  <span class="tag-bullet">•</span>
                  <span class="threat-book-plain-tag">${safe(sheet.tamanho?.toUpperCase() || 'MÉDIO')}</span>
                `}
              </div>

              ${editMode ? `
                <div class="threat-meta-actions">
                  <button type="button" class="threat-meta-toggle-btn" data-threat-toggle-categoria>
                    ${isMundane ? 'MUDAR PARA PARANORMAL' : 'MUDAR PARA MUNDANA'}
                  </button>
                </div>
              ` : ''}
            </div>

            <div class="threat-book-top-divider"></div>
            
            <!-- PRESENÇA PERTURBADORA (Apenas Paranormal ou se ativado) -->
            ${(!isMundane && sheet.presenca?.ativa) ? `
              <div class="threat-book-block">
                <div class="threat-book-heading-row">
                  <span class="threat-book-badge">PRESENÇA PERTURBADORA</span>
                  ${editMode ? `
                    <button type="button" class="threat-chip-sug" data-threat-apply-sug="presence:${balSug.dt}:${balSug.presenca ? `${balSug.presenca.dados}d${balSug.presenca.faces}` : '3d6'}:${balSug.imuneNex}" title="Aplicar DT ${balSug.dt}, Dano ${balSug.presenca ? `${balSug.presenca.dados}d${balSug.presenca.faces}` : '3d6'} e NEX ${balSug.imuneNex}% sugeridos para VD ${sheet.vd}">
                      💡 DT ${balSug.dt} (${balSug.presenca ? `${balSug.presenca.dados}d${balSug.presenca.faces}` : '3d6'})
                    </button>
                  ` : ''}
                </div>
                <div class="threat-book-stat-line">
                  ${editMode ? `
                    <span>DT <input type="number" class="threat-mini-input" data-threat-field="presenca.dt" value="${sheet.presenca.dt}"></span>
                    <span>• <input type="text" class="threat-mini-input" data-threat-field="presenca.dano" value="${safe(sheet.presenca.dano)}"></span>
                    <span><input type="text" class="threat-mini-input" data-threat-field="presenca.tipoDano" value="${safe(sheet.presenca.tipoDano)}"></span>
                    <span>• NEX <input type="number" class="threat-mini-input" data-threat-field="presenca.imuneNex" value="${sheet.presenca.imuneNex}">%+ é imune</span>
                  ` : `
                    <span>DT ${sheet.presenca.dt} • <button type="button" class="threat-chip-roll-dmg threat-presence-chip" data-threat-roll-presence title="Rolar Dano Mental (${safe(sheet.presenca.dano)})">${safe(sheet.presenca.dano)} ${safe(sheet.presenca.tipoDano)}</button> • NEX ${sheet.presenca.imuneNex}%+ é imune</span>
                  `}
                </div>
                ${sheet.presenca.texto ? `<div class="threat-book-prose">${safe(sheet.presenca.texto)}</div>` : ''}
                <div class="threat-book-divider"></div>
              </div>
            ` : ''}

            <!-- SENTIDOS -->
            <div class="threat-book-block">
              <div class="threat-book-heading-row">
                <span class="threat-book-badge">SENTIDOS</span>
                <div class="threat-book-inline-stats">
                  <span class="threat-sense-entry" onclick="if(event.target.closest('[data-threat-roll-sense]'))return;this.querySelector('[data-threat-roll-sense]')?.click();" title="Rolar Percepção"><span>Percepção</span> <button type="button" class="threat-die-token" data-threat-roll-sense="percepcao" title="Rolar Percepção">${formatDiePool(sheet.sentidos?.percepcao)}</button></span>
                  <span class="threat-pipe">|</span>
                  <span class="threat-sense-entry" onclick="if(event.target.closest('[data-threat-roll-sense]'))return;this.querySelector('[data-threat-roll-sense]')?.click();" title="Rolar Iniciativa"><span>Iniciativa</span> <button type="button" class="threat-die-token" data-threat-roll-sense="iniciativa" title="Rolar Iniciativa">${formatDiePool(sheet.sentidos?.iniciativa)}</button></span>
                  ${editMode ? `
                    <button type="button" class="threat-mini-btn" data-threat-edit-senses title="Editar Sentidos">
                      ${icon('edit', 10)}
                    </button>
                  ` : ''}
                </div>
              </div>
              ${sheet.sentidos?.extra ? `<div class="threat-book-upper-note">${safe(sheet.sentidos.extra)}</div>` : ''}
            </div>

            <!-- DEFESA E SALVAGUARDAS -->
            <div class="threat-book-block">
              <div class="threat-book-heading-row">
                <span class="threat-book-badge">DEFESA</span>
                ${editMode ? `
                  <input type="number" class="threat-mini-input threat-def-input" data-threat-field="defesa" value="${sheet.defesa}">
                  <button type="button" class="threat-chip-sug" data-threat-apply-sug="defesa:${balSug.defesa}" title="Aplicar Defesa ${balSug.defesa} sugerida pelo VD ${sheet.vd}">
                    💡 ${balSug.defesa}
                  </button>
                ` : `
                  <span class="threat-book-badge-val">${sheet.defesa}</span>
                `}
                ${editMode ? `
                  <div style="margin-left:auto;display:flex;align-items:center;gap:6px;">
                    <button type="button" class="threat-chip-sug" data-threat-apply-sug="saves:${balSug.resForte.dados}:${balSug.resForte.bonus}:${balSug.resMedia.dados}:${balSug.resMedia.bonus}:${balSug.resFraca.dados}:${balSug.resFraca.bonus}" title="Sugerir Salvaguardas (+${balSug.resForte.bonus}/+${balSug.resMedia.bonus}/+${balSug.resFraca.bonus})">
                      💡 Sugerir (+${balSug.resForte.bonus}/+${balSug.resMedia.bonus}/+${balSug.resFraca.bonus})
                    </button>
                    <button type="button" class="threat-mini-btn" data-threat-edit-saves title="Editar Salvaguardas">
                      ${icon('edit', 10)}
                    </button>
                  </div>
                ` : ''}
              </div>
              <div class="threat-book-saves-row">
                <div class="threat-save-entry" onclick="if(event.target.closest('[data-threat-roll-save]'))return;this.querySelector('[data-threat-roll-save]')?.click();" title="Rolar Fortitude"><span>FORTITUDE</span> <button type="button" class="threat-die-token" data-threat-roll-save="fortitude" title="Rolar Fortitude">${formatDiePool(sheet.salvaguardas?.fortitude)}</button></div>
                <div class="threat-save-entry" onclick="if(event.target.closest('[data-threat-roll-save]'))return;this.querySelector('[data-threat-roll-save]')?.click();" title="Rolar Reflexos"><span>REFLEXOS</span> <button type="button" class="threat-die-token" data-threat-roll-save="reflexos" title="Rolar Reflexos">${formatDiePool(sheet.salvaguardas?.reflexos)}</button></div>
                <div class="threat-save-entry" onclick="if(event.target.closest('[data-threat-roll-save]'))return;this.querySelector('[data-threat-roll-save]')?.click();" title="Rolar Vontade"><span>VONTADE</span> <button type="button" class="threat-die-token" data-threat-roll-save="vontade" title="Rolar Vontade">${formatDiePool(sheet.salvaguardas?.vontade)}</button></div>
              </div>
              <div class="threat-book-divider"></div>
            </div>

            <!-- PONTOS DE VIDA (PV) E MACHUCADO -->
            <div class="threat-book-block">
              <div class="threat-book-heading-row">
                <span class="threat-book-badge">PONTOS DE VIDA</span>
                ${editMode ? `
                  <span class="threat-book-badge-val" style="display:flex;align-items:center;gap:4px;">
                    <input type="number" class="threat-mini-input" style="width:65px;" data-threat-field="pvMax" value="${sheet.pvMax || sheet.pv}" title="PV Máximo">
                    <button type="button" class="threat-chip-sug" data-threat-apply-sug="pv:${balSug.pv}" title="Aplicar PV ${balSug.pv} sugerido pelo VD ${sheet.vd}">
                      💡 ${balSug.pv} PV
                    </button>
                  </span>
                ` : `
                  <span class="threat-book-badge-val">${sheet.pv}</span>
                `}
                <span class="threat-book-hp-sub">
                  <span class="threat-pipe">|</span> Machucado <b>${machucado}</b>
                  ${(!editMode && sheet.pv !== sheet.pvMax) ? `<span class="threat-hp-max-sub">/ ${sheet.pvMax}</span>` : ''}
                </span>
                ${hurt ? `
                  <span class="threat-book-hurt-stamp">! MACHUCADA</span>
                ` : ''}
              </div>

              <!-- Barra discreta de PV do livro e controles rápidos -->
              <div class="threat-book-hp-bar-wrap">
                <div class="threat-hp-track-book" title="Vida: ${sheet.pv}/${sheet.pvMax} (${hpPct}%)">
                  <div class="threat-hp-fill-book ${hurt ? 'is-hurt' : ''}" style="width:${hpPct}%;"></div>
                </div>
                <div class="threat-hp-steppers-book">
                  <span class="stepper-label">DANO:</span>
                  <button type="button" class="btn-step-dmg" data-threat-pv-delta="-10">-10</button>
                  <button type="button" class="btn-step-dmg" data-threat-pv-delta="-5">-5</button>
                  <button type="button" class="btn-step-dmg" data-threat-pv-delta="-1">-1</button>
                  <span class="stepper-label">CURA:</span>
                  <button type="button" class="btn-step-heal" data-threat-pv-delta="1">+1</button>
                  <button type="button" class="btn-step-heal" data-threat-pv-delta="5">+5</button>
                  <button type="button" class="btn-step-heal" data-threat-pv-delta="10">+10</button>
                  ${sheet.pvTemp ? `
                    <button type="button" class="btn-temp active" data-threat-clear-temp title="Clique para zerar">+${sheet.pvTemp} TEMP</button>
                  ` : `
                    <button type="button" class="btn-temp" data-threat-add-temp>+ TEMP</button>
                  `}
                </div>
              </div>

              <!-- Defesas do Livro ou Cards Interativos no Modo Edição -->
              ${!editMode ? `
                <div class="threat-book-defenses-list">
                  ${sheet.resistencias?.length ? `
                    <div class="defense-row">
                      <strong>RESISTÊNCIAS</strong>
                      <span>${sheet.resistencias.map(r => `${r.tipo} ${r.valor}`).join(', ')}</span>
                    </div>
                  ` : ''}

                  ${sheet.vulnerabilidades?.length ? `
                    <div class="defense-row">
                      <strong>VULNERABILIDADES</strong>
                      <span>${sheet.vulnerabilidades.join(', ')}</span>
                    </div>
                  ` : ''}

                  ${sheet.imunidades?.length ? `
                    <div class="defense-row">
                      <strong>IMUNIDADES</strong>
                      <span>${sheet.imunidades.join(', ')}</span>
                    </div>
                  ` : ''}
                </div>
              ` : `
                <div class="threat-book-defenses-list edit-mode">
                  <!-- Resistências -->
                  <div class="threat-defense-group">
                    <div class="threat-defense-group-header">
                      <strong>RESISTÊNCIAS</strong>
                      <button type="button" class="threat-mini-btn" data-threat-add-defense-trigger="res">+ ADICIONAR</button>
                    </div>
                    <div class="threat-defense-cards-row">
                      ${(sheet.resistencias || []).map((r, idx) => `
                        <div class="threat-defense-card card-res">
                          <span class="threat-card-tag">${safe(r.tipo)}</span>
                          <input type="number" class="threat-card-num-input" min="0" max="99" value="${r.valor || 0}" data-threat-edit-res-idx="${idx}" title="Valor de RD">
                          <button type="button" class="threat-card-del-btn" data-threat-del-res="${idx}" title="Remover resistência">×</button>
                        </div>
                      `).join('')}
                      ${!(sheet.resistencias?.length) ? `<span class="threat-defense-empty">Nenhuma</span>` : ''}
                    </div>
                  </div>

                  <!-- Vulnerabilidades -->
                  <div class="threat-defense-group">
                    <div class="threat-defense-group-header">
                      <strong>VULNERABILIDADES</strong>
                      <button type="button" class="threat-mini-btn" data-threat-add-defense-trigger="vuln">+ ADICIONAR</button>
                    </div>
                    <div class="threat-defense-cards-row">
                      ${(sheet.vulnerabilidades || []).map((v, idx) => `
                        <div class="threat-defense-card card-vuln">
                          <span class="threat-card-tag">${safe(v)}</span>
                          <button type="button" class="threat-card-del-btn" data-threat-del-vuln="${idx}" title="Remover vulnerabilidade">×</button>
                        </div>
                      `).join('')}
                      ${!(sheet.vulnerabilidades?.length) ? `<span class="threat-defense-empty">Nenhuma</span>` : ''}
                    </div>
                  </div>

                  <!-- Imunidades -->
                  <div class="threat-defense-group">
                    <div class="threat-defense-group-header">
                      <strong>IMUNIDADES</strong>
                      <button type="button" class="threat-mini-btn" data-threat-add-defense-trigger="imun">+ ADICIONAR</button>
                    </div>
                    <div class="threat-defense-cards-row">
                      ${(sheet.imunidades || []).map((imun, idx) => `
                        <div class="threat-defense-card card-imun">
                          <span class="threat-card-tag">${safe(imun)}</span>
                          <button type="button" class="threat-card-del-btn" data-threat-del-imun="${idx}" title="Remover imunidade">×</button>
                        </div>
                      `).join('')}
                      ${!(sheet.imunidades?.length) ? `<span class="threat-defense-empty">Nenhuma</span>` : ''}
                    </div>
                  </div>
                </div>
              `}
              <div class="threat-book-divider"></div>
            </div>

            <!-- DESLOCAMENTO -->
            <div class="threat-book-block">
              <div class="threat-book-heading-row">
                <span class="threat-book-badge">DESLOCAMENTO</span>
                ${editMode ? `
                  <span class="threat-book-badge-val">
                    <input type="text" class="threat-mini-input" style="width:50px;text-align:left;" data-threat-field="deslocamento.tipo" value="${safe(sheet.deslocamento?.tipo || '')}" placeholder="Tipo">
                    <input type="number" class="threat-mini-input" min="0" data-threat-field="deslocamento.metros" value="${sheet.deslocamento?.metros || 9}">m
                    <span class="threat-pipe">|</span> ${quadrados}□
                  </span>
                ` : `
                  <span class="threat-book-badge-val">${sheet.deslocamento?.tipo ? `${safe(sheet.deslocamento.tipo)} ` : ''}${sheet.deslocamento?.metros || 9}m | ${quadrados}□</span>
                `}
              </div>
              ${(sheet.deslocamento?.extras || []).filter(e => {
                const sameType = (e.tipo || '').toLowerCase() === (sheet.deslocamento?.tipo || '').toLowerCase();
                const sameMetros = Number(e.metros) === Number(sheet.deslocamento?.metros);
                return !(sameType && sameMetros);
              }).map(e => `
                <div class="threat-book-subtext" style="text-transform:uppercase;">${safe(e.tipo)} ${e.metros}m <span class="threat-pipe">|</span> ${Math.round(e.metros / 1.5)}□</div>
              `).join('')}
            </div>

            <!-- ATRIBUTOS EM LINHA HORIZONTAL IDÊNTICA AO LIVRO -->
            <div class="threat-book-block">
              <div class="threat-book-attr-row">
                ${[
                  { key: 'agi', label: 'AGI', full: 'Agilidade' },
                  { key: 'for', label: 'FOR', full: 'Força' },
                  { key: 'int', label: 'INT', full: 'Intelecto' },
                  { key: 'pre', label: 'PRE', full: 'Presença' },
                  { key: 'vig', label: 'VIG', full: 'Vigor' }
                ].map(a => {
                  const val = sheet.atributos?.[a.key];
                  const isForZero = (a.key === 'for' && (val === 0 || val === '-' || val === null || val === undefined));
                  const displayVal = isForZero ? '-' : (val ?? 2);
                  return `
                    <div class="threat-book-attr-col" data-threat-roll-attr="${a.key}" title="Rolar ${a.full} (${sheet.atributos?.[a.key] || 0}d20)">
                      <span class="attr-label">${a.label}</span>
                      <span class="attr-hex">
                        ${editMode ? `
                          <input type="number" class="threat-attr-input" min="0" max="15" 
                            data-threat-attr-input="${a.key}" value="${sheet.atributos?.[a.key] ?? 2}" onclick="event.stopPropagation();">
                        ` : `
                          <b>${displayVal}</b>
                        `}
                      </span>
                    </div>
                  `;
                }).join('')}
              </div>
              <div class="threat-book-divider"></div>
            </div>

            <!-- PERÍCIAS (OPCIONAL) -->
            ${(sheet.pericias?.length || editMode) ? `
              <div class="threat-book-block">
                <div class="threat-book-heading-row" style="align-items:flex-start;">
                  <span class="threat-book-badge">PERÍCIAS</span>
                  <div class="threat-book-skills-inline">
                    ${(sheet.pericias || []).map(p => {
                      const condHtml = p.condicional ? ` <small class="threat-skill-cond">(${p.condicional.dados || p.dados}${die(20, 'threat-tabletop-die')}+${(p.bonus || 0) + (p.condicional.bonus || 0)} ${safe(p.condicional.texto)})</small>` : '';
                      return `
                        <button type="button" class="threat-book-skill-chip" data-threat-roll-pericia="${p.id}" title="${p.condicional ? safe(p.condicional.texto) : ''}">
                          ${safe(p.nome)} <span class="die-token">${formatDiePool(p)}</span>${condHtml}
                        </button>
                      `;
                    }).join(', ')}
                    ${sheet.pericias?.length === 0 ? `<em style="color:#777;font-size:12px;">Nenhuma</em>` : ''}
                    ${editMode ? `<button type="button" class="threat-mini-btn" data-threat-add-skill>+ ADICIONAR</button>` : ''}
                  </div>
                </div>
                <div class="threat-book-divider"></div>
              </div>
            ` : ''}

            <!-- SEÇÕES LIVRES / HABILIDADES COLUNA ESQUERDA (Ex: Membros Longos, Parte do Cenário, O Sino) -->
            ${secoesEsquerda.map(sec => `
              <div class="threat-book-block ${sec.estilo === 'enigma' ? 'is-enigma-card' : ''}">
                <div class="threat-book-heading-row" style="justify-content:space-between;">
                  <span class="threat-book-badge ${sec.estilo === 'enigma' ? 'tag-enigma' : ''}">${safe(sec.titulo)}</span>
                  ${editMode ? `
                    <div class="threat-ctrl-btns">
                      <button type="button" class="threat-mini-btn" data-threat-edit-section="${sec.id}">${icon('edit', 10)}</button>
                      <button type="button" class="threat-mini-btn danger" data-threat-del-section="${sec.id}">${icon('trash', 10)}</button>
                    </div>
                  ` : ''}
                </div>
                <div class="threat-book-text-body">${formatCardText(sec.corpo)}</div>
                ${sec.estilo !== 'enigma' ? `<div class="threat-book-divider"></div>` : ''}
              </div>
            `).join('')}

            <!-- AÇÕES DA COLUNA ESQUERDA (SE HOUVER) -->
            ${acoesEsquerda.length ? `
              <div class="threat-book-block">
                <div class="threat-book-heading-row">
                  <span class="threat-book-badge">AÇÕES</span>
                </div>
                <div class="threat-book-divider"></div>
                ${renderActionGroups(acoesEsquerda, hurt, editMode)}
              </div>
            ` : ''}

            ${editMode ? `
              <button type="button" class="threat-mini-btn" data-threat-add-section style="margin-top:8px;">
                + ADICIONAR SEÇÃO OU ENIGMA DE MEDO
              </button>
            ` : ''}

          </div>

          <!-- ── COLUNA DIREITA: SEÇÕES E AÇÕES DO LIVRO ── -->
          <div class="threat-book-col-right">
            
            <!-- SEÇÕES LIVRES DA COLUNA DIREITA (Ex: INEVITÁVEL FIM, O SINO, FRENESI DE SANGUE) -->
            ${secoesDireita.map(sec => `
              <div class="threat-book-block ${sec.estilo === 'enigma' ? 'is-enigma-card' : ''}">
                <div class="threat-book-heading-row" style="justify-content:space-between;">
                  <span class="threat-book-badge ${sec.estilo === 'enigma' ? 'tag-enigma' : ''}">${safe(sec.titulo)}</span>
                  ${editMode ? `
                    <div class="threat-ctrl-btns">
                      <button type="button" class="threat-mini-btn" data-threat-edit-section="${sec.id}">${icon('edit', 10)}</button>
                      <button type="button" class="threat-mini-btn danger" data-threat-del-section="${sec.id}">${icon('trash', 10)}</button>
                    </div>
                  ` : ''}
                </div>
                <div class="threat-book-text-body">${formatCardText(sec.corpo)}</div>
                ${sec.estilo !== 'enigma' ? `<div class="threat-book-divider"></div>` : ''}
              </div>
            `).join('')}

            <div class="threat-book-block">
              <div class="threat-book-heading-row" style="justify-content:space-between;">
                <span class="threat-book-badge">AÇÕES</span>
                ${editMode ? `
                  <button type="button" class="threat-mini-btn" data-threat-add-action>
                    ${icon('plus', 10)} NOVA AÇÃO
                  </button>
                ` : ''}
              </div>
              <div class="threat-book-divider"></div>
            </div>

            <!-- LISTAGEM DE AÇÕES NO ESTILO TIPOGRÁFICO DO LIVRO -->
            ${renderActionGroups(acoesDireita, hurt, editMode)}

            ${(acoesDireita.length === 0 && acoesEsquerda.length === 0) ? `
              <div style="padding:28px 12px;text-align:center;color:#6d718a;border:1px dashed #2b2e45;border-radius:4px;">
                <p style="margin:0 0 4px 0;font-weight:700;">Nenhuma ação cadastrada</p>
                <small>Clique em "+ NOVA AÇÃO" para adicionar ataques e habilidades.</small>
              </div>
            ` : ''}
          </div>

        </div>

        <!-- ── BARRA BRANCA DECORATIVA INFERIOR DO LIVRO ── -->
        <footer class="threat-book-bottom-bar"></footer>

      </article>

      <!-- ── MODAIS DE EDIÇÃO DA AMEAÇA ── -->
      ${renderThreatModals(sheet)}

    </main>
  `;
}

/**
 * Formata texto com markdown básico e quebras de linha para o livro
 */
function formatCardText(val) {
  if (!val) return '';
  let str = safe(val);
  str = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  str = str.replace(/\*(.*?)\*/g, '<em>$1</em>');
  str = str.replace(/\n/g, '<br>');
  return str;
}

/**
 * Renderiza ações em formato tipográfico idêntico ao livro
 */
function renderActionGroups(actions = [], isHurt = false, editMode = false) {
  return actions.map(action => renderActionCard(action, isHurt, editMode)).join('');
}

/**
 * Renderiza um card individual de ação ou habilidade estilo livro
 */
function renderActionCard(action, isHurt = false, editMode = false) {
  const isHurtTrigger = action.ativaQuando === 'machucado';
  const isActive = isHurtTrigger && isHurt;

  const actionSymMap = {
    padrao: (action.ataques && action.ataques.length) ? '◆' : '❖',
    movimento: '❖',
    reacao: '❖',
    completa: '❖',
    livre: '❖',
    passiva: '○'
  };
  const sym = actionSymMap[action.tipoAcao] || '❖';

  const actionLabelMap = {
    padrao: 'PADRÃO',
    movimento: 'MOVIMENTO',
    completa: 'COMPLETA',
    reacao: 'REAÇÃO',
    livre: 'LIVRE',
    passiva: 'PASSIVA'
  };
  const actionLabel = actionLabelMap[action.tipoAcao] || safe(action.tipoAcao?.toUpperCase() || 'PADRÃO');

  return `
    <article class="threat-book-action-entry ${isActive ? 'is-frenesi-active' : ''}" 
      data-threat-action-card="${action.id}">
      
      <div class="action-entry-header">
        <span class="action-type-label">${actionLabel}</span>
        <span class="action-symbol">${sym}</span>
        <h3 class="action-entry-title">${safe(action.nome?.toUpperCase())}</h3>
        
        ${isActive ? `
          <span class="action-frenesi-badge">ATIVO (FRENESI)</span>
        ` : (isHurtTrigger ? `<span class="action-frenesi-hint">QUANDO MACHUCADA</span>` : '')}

        ${action.gatilho ? `<em class="action-trigger">(${safe(action.gatilho)})</em>` : ''}

        ${editMode ? `
          <div class="action-entry-ctrls">
            <button type="button" class="threat-mini-btn" data-threat-edit-action="${action.id}" title="Editar ação">
              ${icon('edit', 10)}
            </button>
            <button type="button" class="threat-mini-btn danger" data-threat-del-action="${action.id}" title="Excluir ação">
              ${icon('trash', 10)}
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Ataques da Ação -->
      ${(action.ataques || []).map(atk => `
        <div class="action-attack-block">
          <div class="attack-title-line">
            <strong class="attack-name">${safe(atk.nome?.toUpperCase())}</strong>
            <em class="attack-reach">${safe(atk.alcance || 'Corpo a corpo')}${atk.multiplicador > 1 ? ` x${atk.multiplicador}` : ''}</em>
          </div>
          <div class="attack-roll-line">
            <span class="attack-roll-label">TESTE</span>
            <button type="button" class="threat-chip-roll-test" data-threat-roll-atk-test="${action.id}:${atk.id}" title="Rolar Teste de Ataque">
              ${formatDiePool(atk.teste)}
            </button>
            <span class="threat-pipe">|</span>
            <span class="attack-roll-label">DANO</span>
            <button type="button" class="threat-chip-roll-dmg" data-threat-roll-atk-dmg="${action.id}:${atk.id}" title="Rolar Dano">
              ${formatDamageFormula(atk.dano)} ${safe(atk.tipoDano || '')}${atk.critico ? ` <small>(${safe(atk.critico)})</small>` : ''}
            </button>
          </div>
        </div>
      `).join('')}

      <!-- Descrição da Ação -->
      ${action.texto ? `
        <div class="action-entry-text">${formatCardText(action.texto)}</div>
      ` : ''}

    </article>
  `;
}

/**
 * Renderiza os modais de edição de ações, defesas e seções
 */
function renderThreatModals(sheet) {
  const isMundane = sheet.categoria === 'mundana';
  const elemDestaqueKey = sheet.elementoDestaque || (sheet.elementos || [])[0] || 'sangue';
  const elemDestaque = THREAT_ELEMENTS[elemDestaqueKey] || THREAT_ELEMENTS.sangue;
  const elemColor = sheet.themeColor || (isMundane ? '#ffffff' : elemDestaque.cor);
  let activeSigilSrc = '';
  if (sheet.sigilImage) {
    activeSigilSrc = sheet.sigilImage;
  } else if (sheet.sigiloId && sheet.sigiloId !== 'escudo' && THREAT_ELEMENTS[sheet.sigiloId]) {
    activeSigilSrc = `/assets/elements/${sheet.sigiloId}.png`;
  } else if (!isMundane && sheet.sigiloId !== 'escudo') {
    activeSigilSrc = `/assets/elements/${elemDestaqueKey}.png`;
  }

  return `
    <!-- Modal de Ação / Habilidade da Ameaça (Fiel à Ficha Cinematográfica de Ordem II) -->
    <div class="modal card-editor threat-card-editor" id="threat-action-modal">
      <div class="backdrop editor-backdrop" data-close-threat-modal></div>
      <form id="threat-action-form">
        <input type="hidden" name="actionId" id="threat-action-id">

        <header>
          <div>
            <small style="color:var(--threat-elem-color, #e0150d);">EDITOR DE AÇÃO · AMEAÇA</small>
            <h2 id="threat-action-modal-title">EDITAR AÇÃO</h2>
          </div>
          <button type="button" class="editor-close" data-close-threat-modal title="Fechar">${icon('close')}</button>
        </header>

        <div class="editor-grid">
          <!-- Nome da Ação -->
          <label class="span-2">
            NOME DA AÇÃO / HABILIDADE
            <input type="text" name="nome" id="threat-action-name-input" required maxlength="64" placeholder="Ex: Agredir, Miasma Fétido, Eco Espiral...">
          </label>

          <!-- Tipo de Ação -->
          <label>
            TIPO DE AÇÃO
            <select name="tipoAcao" id="threat-action-type">
              ${ACTION_TYPES.map(t => `<option value="${t.id}">${t.simbolo} ${t.nome.toUpperCase()}</option>`).join('')}
            </select>
          </label>

          <!-- Gatilho / Condição -->
          <label>
            GATILHO / CONDIÇÃO (OPCIONAL)
            <input type="text" name="gatilho" id="threat-action-trigger" placeholder="Ex: Ao receber dano, 1x por rodada...">
          </label>

          <!-- Gatilho de Machucado -->
          <label>
            GATILHO DE MACHUCADO (FRENESI)
            <select name="ativaQuando" id="threat-action-hurt">
              <option value="">Sempre disponível</option>
              <option value="machucado">Ativar automaticamente quando Machucada (Frenesi)</option>
            </select>
          </label>

          <!-- Coluna no Livro -->
          <label>
            COLUNA NO LIVRO
            <select name="coluna" id="threat-action-column">
              <option value="direita">Coluna Direita (Ações - Padrão)</option>
              <option value="esquerda">Coluna Esquerda (Abaixo das Estatísticas)</option>
            </select>
          </label>

          <!-- Texto e Regras com Barra de Formatação Rica (Idêntica à Ficha Cinematográfica) -->
          <label class="span-2 content-editor-label">
            DESCRIÇÃO E REGRAS DA AÇÃO
            <div class="rich-toolbar">
              <button type="button" data-threat-format="bold" title="Negrito"><b>B</b></button>
              <button type="button" data-threat-format="italic" title="Itálico"><i>I</i></button>
              <button type="button" data-threat-format="underline" title="Sublinhado"><u>U</u></button>
              <span class="color-picker" title="Cor do texto">
                <input id="threat-action-color" type="color" value="#cca02b">
                <span>A</span>
              </span>
              <button type="button" data-threat-format="color">APLICAR COR</button>
            </div>
            <textarea name="texto" id="threat-action-text-input" rows="5" placeholder="Descrição dos efeitos, testes de resistência exigidos, condições impostas e regras..."></textarea>
          </label>

          <!-- Seção Construtor de Ataques (Estilo .builder-section de Ordem 2) -->
          <section class="span-2 builder-section">
            <header>
              <div>
                <b>ATAQUES DA AÇÃO</b>
                <small>Testes de d20 (dados + bônus), expressões de dano, tipo e crítico.</small>
              </div>
              <button type="button" id="btn-threat-add-attack-row">+ ADICIONAR ATAQUE</button>
            </header>
            <div id="threat-attacks-container"></div>
          </section>
        </div>

        <footer>
          <button type="button" class="delete-card" id="threat-action-delete-btn">EXCLUIR</button>
          <span></span>
          <button type="button" class="editor-close secondary" data-close-threat-modal>CANCELAR</button>
          <button type="submit" style="background:var(--threat-elem-color, #e0150d);color:#fff;">SALVAR AÇÃO</button>
        </footer>
      </form>
    </div>

    <!-- Modal para Adicionar Card de Resistência / Vulnerabilidade / Imunidade -->
    <div class="threat-modal" id="threat-defense-card-modal" style="display:none;">
      <div class="threat-modal-backdrop" data-close-threat-modal></div>
      <div class="threat-modal-card" style="max-width:480px;">
        <header class="threat-modal-header">
          <h2 id="threat-def-card-modal-title">ADICIONAR RESISTÊNCIA</h2>
          <button type="button" class="threat-modal-close-btn" data-close-threat-modal>${icon('close', 13)}</button>
        </header>
        <form id="threat-defense-card-form" class="threat-modal-body">
          <input type="hidden" id="threat-def-card-category" value="res">
          
          <label style="font:800 10.5px 'Hanken Grotesk',sans-serif;color:#a3a7c2;letter-spacing:.08em;margin-bottom:6px;display:block;">
            TAGS RÁPIDAS
          </label>
          <div class="threat-defense-tags-picker" id="threat-def-quick-tags"></div>

          <div class="threat-form-group" style="margin-top:14px;">
            <label>NOME / TAG PERSONALIZADA</label>
            <input type="text" id="threat-def-card-tag-input" required placeholder="Ex: Balístico, Fogo, Dano Mental...">
          </div>

          <div class="threat-form-group" id="threat-def-card-val-group">
            <label>VALOR DE RESISTÊNCIA (RD)</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="number" id="threat-def-card-val-input" min="1" max="99" value="10" style="width:90px;">
              <div class="threat-vd-chips-row">
                <button type="button" class="threat-vd-chip" data-def-quick-rd="5">RD 5</button>
                <button type="button" class="threat-vd-chip" data-def-quick-rd="10">RD 10</button>
                <button type="button" class="threat-vd-chip" data-def-quick-rd="15">RD 15</button>
                <button type="button" class="threat-vd-chip" data-def-quick-rd="20">RD 20</button>
              </div>
            </div>
          </div>

          <footer class="threat-modal-footer">
            <button type="button" class="threat-edit-btn" data-close-threat-modal>CANCELAR</button>
            <button type="submit" class="threat-edit-btn" style="background:var(--threat-elem-color,#e0150d);color:#fff;border-color:transparent;font-weight:800;">+ ADICIONAR CARD</button>
          </footer>
        </form>
      </div>
    </div>

    <!-- Modal de Seção Livre / Enigma de Medo -->
    <div class="threat-modal" id="threat-section-modal" style="display:none;">
      <div class="threat-modal-backdrop" data-close-threat-modal></div>
      <div class="threat-modal-card">
        <header class="threat-modal-header">
          <h2 id="threat-section-modal-title">NOVA SEÇÃO / ENIGMA</h2>
          <button type="button" class="threat-edit-btn" data-close-threat-modal>${icon('close', 13)}</button>
        </header>
        <form id="threat-section-form" class="threat-modal-body">
          <input type="hidden" name="sectionId" id="threat-section-id">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="threat-form-group">
              <label>ESTILO DA SEÇÃO</label>
              <select name="estilo" id="threat-section-style">
                <option value="normal">Seção Comum (Ex: Consumir, Habitat, Comportamento)</option>
                <option value="enigma">Enigma de Medo (Caixa de Papel Envelhecido / Regra Especial)</option>
              </select>
            </div>
            <div class="threat-form-group">
              <label>COLUNA NO LIVRO</label>
              <select name="coluna" id="threat-section-column">
                <option value="esquerda">Coluna Esquerda (Abaixo das Estatísticas - Padrão)</option>
                <option value="direita">Coluna Direita (Acima de Ações)</option>
              </select>
            </div>
          </div>
          <div class="threat-form-group">
            <label>TÍTULO DA SEÇÃO</label>
            <input type="text" name="titulo" id="threat-section-title-input" required placeholder="Ex: Enigma de Medo, Quadros, Presa...">
          </div>
          <div class="threat-form-group">
            <label>CONTEÚDO</label>
            <textarea name="corpo" id="threat-section-body-input" rows="6" required placeholder="Texto detalhado da regra ou enigma..."></textarea>
          </div>
          <footer class="threat-modal-footer">
            <button type="button" class="threat-edit-btn" data-close-threat-modal>CANCELAR</button>
            <button type="submit" class="threat-edit-btn" style="background:var(--threat-elem-color,#e0150d);color:#fff;border-color:transparent;">SALVAR SEÇÃO</button>
          </footer>
        </form>
      </div>
    </div>

    <!-- Modal de Salvaguardas -->
    <div class="threat-modal" id="threat-saves-modal" style="display:none;">
      <div class="threat-modal-backdrop" data-close-threat-modal></div>
      <div class="threat-modal-card">
        <header class="threat-modal-header">
          <h2>EDITAR SALVAGUARDAS</h2>
          <button type="button" class="threat-edit-btn" data-close-threat-modal>${icon('close', 13)}</button>
        </header>
        <form id="threat-saves-form" class="threat-modal-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="threat-form-group">
              <label>FORTITUDE (DADOS)</label>
              <input type="number" min="1" max="10" id="threat-save-fort-dados" value="${sheet.salvaguardas?.fortitude?.dados ?? 3}">
            </div>
            <div class="threat-form-group">
              <label>FORTITUDE (BÔNUS)</label>
              <input type="number" id="threat-save-fort-bonus" value="${sheet.salvaguardas?.fortitude?.bonus ?? 10}">
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="threat-form-group">
              <label>REFLEXOS (DADOS)</label>
              <input type="number" min="1" max="10" id="threat-save-ref-dados" value="${sheet.salvaguardas?.reflexos?.dados ?? 2}">
            </div>
            <div class="threat-form-group">
              <label>REFLEXOS (BÔNUS)</label>
              <input type="number" id="threat-save-ref-bonus" value="${sheet.salvaguardas?.reflexos?.bonus ?? 5}">
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="threat-form-group">
              <label>VONTADE (DADOS)</label>
              <input type="number" min="1" max="10" id="threat-save-von-dados" value="${sheet.salvaguardas?.vontade?.dados ?? 2}">
            </div>
            <div class="threat-form-group">
              <label>VONTADE (BÔNUS)</label>
              <input type="number" id="threat-save-von-bonus" value="${sheet.salvaguardas?.vontade?.bonus ?? 0}">
            </div>
          </div>
          <footer class="threat-modal-footer">
            <button type="button" class="threat-edit-btn" data-close-threat-modal>CANCELAR</button>
            <button type="submit" class="threat-edit-btn" style="background:var(--threat-elem-color,#e0150d);color:#fff;border-color:transparent;">SALVAR SALVAGUARDAS</button>
          </footer>
        </form>
      </div>
    </div>

    <!-- Modal de Sentidos -->
    <div class="threat-modal" id="threat-senses-modal" style="display:none;">
      <div class="threat-modal-backdrop" data-close-threat-modal></div>
      <div class="threat-modal-card">
        <header class="threat-modal-header">
          <h2>EDITAR SENTIDOS</h2>
          <button type="button" class="threat-edit-btn" data-close-threat-modal>${icon('close', 13)}</button>
        </header>
        <form id="threat-senses-form" class="threat-modal-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="threat-form-group">
              <label>PERCEPÇÃO (DADOS)</label>
              <input type="number" min="1" max="10" id="threat-sense-perc-dados" value="${sheet.sentidos?.percepcao?.dados ?? 3}">
            </div>
            <div class="threat-form-group">
              <label>PERCEPÇÃO (BÔNUS)</label>
              <input type="number" id="threat-sense-perc-bonus" value="${sheet.sentidos?.percepcao?.bonus ?? 10}">
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="threat-form-group">
              <label>INICIATIVA (DADOS)</label>
              <input type="number" min="1" max="10" id="threat-sense-inic-dados" value="${sheet.sentidos?.iniciativa?.dados ?? 3}">
            </div>
            <div class="threat-form-group">
              <label>INICIATIVA (BÔNUS)</label>
              <input type="number" id="threat-sense-inic-bonus" value="${sheet.sentidos?.iniciativa?.bonus ?? 0}">
            </div>
          </div>
          <div class="threat-form-group">
            <label>SENTIDOS ESPECIAIS (EX: Percepção às cegas, Faro aguçado)</label>
            <input type="text" id="threat-sense-extra" value="${safe(sheet.sentidos?.extra || '')}">
          </div>
          <footer class="threat-modal-footer">
            <button type="button" class="threat-edit-btn" data-close-threat-modal>CANCELAR</button>
            <button type="submit" class="threat-edit-btn" style="background:var(--threat-elem-color,#e0150d);color:#fff;border-color:transparent;">SALVAR SENTIDOS</button>
          </footer>
        </form>
      </div>
    </div>

    <!-- Modal do Assistente de Balanceamento -->
    ${renderBalanceModal(sheet)}
  `;
}

/**
 * Renderiza o modal completo do Assistente de Balanceamento
 */
function renderBalanceModal(sheet) {
  const bal = getBalance(sheet.vd || 60, 'equilibrada');
  const evalBal = evaluateSheet(sheet, 'equilibrada');
  const elemWeak = ELEMENT_VULNERABILITY_HINTS[sheet.elementoDestaque];
  const isMundane = sheet.categoria === 'mundana';
  const elemDestaqueKey = sheet.elementoDestaque || (sheet.elementos || [])[0] || 'sangue';
  const elemDestaque = THREAT_ELEMENTS[elemDestaqueKey] || THREAT_ELEMENTS.sangue;
  const elemColor = sheet.themeColor || (isMundane ? '#ffffff' : elemDestaque.cor);
  let activeSigilSrc = '';
  if (sheet.sigilImage) {
    activeSigilSrc = sheet.sigilImage;
  } else if (sheet.sigiloId && sheet.sigiloId !== 'escudo' && THREAT_ELEMENTS[sheet.sigiloId]) {
    activeSigilSrc = `/assets/elements/${sheet.sigiloId}.png`;
  } else if (!isMundane && sheet.sigiloId !== 'escudo') {
    activeSigilSrc = `/assets/elements/${elemDestaqueKey}.png`;
  }

  return `
    <div class="threat-modal" id="threat-balance-modal" style="display:none;">
      <div class="threat-modal-backdrop" data-close-threat-modal></div>
      <div class="threat-modal-card threat-balance-modal-card">
        
        <header class="threat-modal-header">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:22px;">⚖️</span>
            <div>
              <h2 style="margin:0;font-size:16px;">ASSISTENTE DE BALANCEAMENTO</h2>
              <small style="color:#8c92b2;display:block;font-size:11px;">Parâmetros matemáticos calibrados para Valor de Desafio (VD)</small>
            </div>
          </div>
          <button type="button" class="threat-edit-btn" data-close-threat-modal>${icon('close', 13)}</button>
        </header>

        <div class="threat-modal-body threat-bal-modal-body">
          
          <!-- CONTROLES SUPERIORES: VD, PRESET E SLIDER -->
          <div class="threat-bal-top-controls">
            
            <div class="threat-bal-control-group">
              <label>VALOR DE DESAFIO (VD)</label>
              <div style="display:flex;align-items:center;gap:8px;">
                <input type="number" id="threat-bal-vd-input" min="10" max="400" value="${sheet.vd}" class="threat-bal-vd-field">
                <span class="threat-bal-vd-note">(4 agentes NEX ~${Math.max(5, Math.round(sheet.vd / 4))}%)</span>
              </div>
              <div class="threat-bal-vd-quick-chips">
                ${[20, 40, 60, 80, 100, 140, 180, 240, 320, 400].map(v => `
                  <button type="button" class="threat-bal-vd-pill ${sheet.vd === v ? 'active' : ''}" data-bal-quick-vd="${v}">${v}</button>
                `).join('')}
              </div>
            </div>

            <div class="threat-bal-control-group">
              <label>BALANCEAMENTO</label>
              <div class="threat-bal-preset-toggles">
                <button type="button" class="threat-bal-preset-btn" data-threat-bal-preset="leve">
                  Fácil (Narrativo)
                </button>
                <button type="button" class="threat-bal-preset-btn active" data-threat-bal-preset="equilibrada">
                  Equilibrado (Recomendado)
                </button>
                <button type="button" class="threat-bal-preset-btn" data-threat-bal-preset="editora">
                  Difícil (Tabela Oficial de Balanceamento da Jambô)
                </button>
              </div>
            </div>

            <div class="threat-bal-control-group">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <label>AJUSTE DE DIFICULDADE</label>
                <b id="threat-bal-slider-val" style="color:var(--threat-elem-color,#e0150d);font-size:11px;">0% (Padrão)</b>
              </div>
              <input type="range" id="threat-bal-slider" min="-20" max="20" step="5" value="0" class="threat-bal-slider">
            </div>

          </div>

          <!-- COMPARATIVO VISUAL DAS ESTATÍSTICAS -->
          <div class="threat-bal-dashboard">
            
            <!-- PV -->
            <div class="threat-bal-card">
              <div class="threat-bal-card-head">
                <span class="threat-bal-card-title">PONTOS DE VIDA</span>
                <span id="bal-modal-pv-status" class="threat-bal-status status-${evalBal.pv.status}">
                  ${evalBal.pv.status === 'dentro' ? 'DENTRO DA FAIXA' : (evalBal.pv.status === 'abaixo' ? 'ABAIXO DA MÉDIA' : 'ACIMA DA MÉDIA')}
                </span>
              </div>
              <div class="threat-bal-card-nums">
                <div class="num-col">
                  <small>ATUAL</small>
                  <strong>${sheet.pvMax || sheet.pv}</strong>
                </div>
                <div class="num-sep">➔</div>
                <div class="num-col highlight">
                  <small>SUGERIDO</small>
                  <strong id="bal-modal-pv">${bal.pv}</strong>
                </div>
              </div>
              <div class="threat-bal-card-foot">
                <small>Machucado: <b id="bal-modal-machucado">${bal.machucado}</b></small>
                <button type="button" class="threat-mini-btn" data-threat-apply-bal="pv">APLICAR PV</button>
              </div>
            </div>

            <!-- DEFESA -->
            <div class="threat-bal-card">
              <div class="threat-bal-card-head">
                <span class="threat-bal-card-title">DEFESA</span>
                <span id="bal-modal-defesa-status" class="threat-bal-status status-${evalBal.defesa.status}">
                  ${evalBal.defesa.status === 'dentro' ? 'DENTRO DA FAIXA' : (evalBal.defesa.status === 'abaixo' ? 'ABAIXO DA MÉDIA' : 'ACIMA DA MÉDIA')}
                </span>
              </div>
              <div class="threat-bal-card-nums">
                <div class="num-col">
                  <small>ATUAL</small>
                  <strong>${sheet.defesa}</strong>
                </div>
                <div class="num-sep">➔</div>
                <div class="num-col highlight">
                  <small>SUGERIDO</small>
                  <strong id="bal-modal-defesa">${bal.defesa}</strong>
                </div>
              </div>
              <div class="threat-bal-card-foot">
                <small>Acerto agentes ~55%</small>
                <button type="button" class="threat-mini-btn" data-threat-apply-bal="defesa">APLICAR DEFESA</button>
              </div>
            </div>

            <!-- SALVAGUARDAS -->
            <div class="threat-bal-card">
              <div class="threat-bal-card-head">
                <span class="threat-bal-card-title">SALVAGUARDAS</span>
                <span class="threat-bal-status status-dentro">3 PATAMARES</span>
              </div>
              <div class="threat-bal-saves-breakdown">
                <div><span>Forte:</span> <b id="bal-modal-res-forte">+${bal.resForte.bonus}</b> (${bal.resForte.dados}d20)</div>
                <div><span>Média:</span> <b id="bal-modal-res-media">+${bal.resMedia.bonus}</b> (${bal.resMedia.dados}d20)</div>
                <div><span>Fraca:</span> <b id="bal-modal-res-fraca">+${bal.resFraca.bonus}</b> (${bal.resFraca.dados}d20)</div>
              </div>
              <div class="threat-bal-card-foot">
                <small>Atual: +${sheet.salvaguardas?.fortitude?.bonus || 0} / +${sheet.salvaguardas?.reflexos?.bonus || 0} / +${sheet.salvaguardas?.vontade?.bonus || 0}</small>
                <button type="button" class="threat-mini-btn" data-threat-apply-bal="salvaguardas">APLICAR SALVAGUARDAS</button>
              </div>
            </div>

            <!-- PRESENÇA PERTURBADORA & DT -->
            <div class="threat-bal-card">
              <div class="threat-bal-card-head">
                <span class="threat-bal-card-title">PRESENÇA & DT GERAL</span>
                <span class="threat-bal-status status-dentro">NEX <span id="bal-modal-nex-status">${bal.imuneNex}</span>%+</span>
              </div>
              <div class="threat-bal-saves-breakdown">
                <div><span>DT Recomendada:</span> <b id="bal-modal-dt">DT ${bal.dt}</b></div>
                <div><span>Dano Mental:</span> <b id="bal-modal-dmg">${bal.presenca ? `${bal.presenca.dados}d${bal.presenca.faces}` : '3d6'}</b></div>
                <div><span>Imunidade:</span> <b id="bal-modal-nex">NEX ${bal.imuneNex}%</b></div>
              </div>
              <div class="threat-bal-card-foot">
                <small>Atual: DT ${sheet.presenca?.dt || '-'}</small>
                <button type="button" class="threat-mini-btn" data-threat-apply-bal="presenca">APLICAR PRESENÇA</button>
              </div>
            </div>

          </div>

          <!-- DANO E ATAQUE RECOMENDADO -->
          <div class="threat-bal-combat-row">
            <div class="combat-col">
              <small>ATAQUE PRINCIPAL SUGERIDO</small>
              <strong id="bal-modal-atk">+${bal.ataque.bonus} <span style="font-size:12px;font-weight:400;color:#9aa0bc;">(${bal.ataque.dados}d20)</span></strong>
            </div>
            <div class="combat-col">
              <small>DANO MÉDIO POR TURNO</small>
              <strong id="bal-modal-dano-medio">~${bal.danoMedio}</strong>
            </div>
            <div class="combat-col wide">
              <small>FÓRMULAS DE DADOS RECOMENDADAS (CLIQUE PARA APLICAR NO 1º ATAQUE)</small>
              <div class="threat-bal-formulas-row" id="bal-modal-formulas-container">
                ${(bal.sugestoesDano || []).map(f => `
                  <button type="button" class="threat-bal-formula-pill" data-threat-copy-formula="${f}" title="Aplicar no primeiro ataque">${f}</button>
                `).join('')}
              </div>
            </div>
          </div>

        </div>

        <footer class="threat-modal-footer" style="justify-content:space-between;">
          <button type="button" class="threat-edit-btn" data-close-threat-modal>FECHAR</button>
          <button type="submit" class="threat-edit-btn" data-threat-apply-bal="tudo" style="background:var(--threat-elem-color,#e0150d);color:#fff;border-color:transparent;font-weight:900;">
            ⚡ APLICAR TODAS AS SUGESTÕES
          </button>
        </footer>

      </div>
    </div>

    <!-- Modal de Plano de Fundo e Marca d'Água da Ameaça -->
    <div class="threat-modal" id="threat-bg-modal" style="display:none;">
      <div class="threat-modal-backdrop" data-close-threat-modal></div>
      <div class="threat-modal-card" style="max-width:620px;">
        <header class="threat-modal-header">
          <h2>🖼️ PLANO DE FUNDO DA AMEAÇA</h2>
          <button type="button" class="threat-modal-close-btn" data-close-threat-modal title="Fechar">✕</button>
        </header>

        <div class="threat-modal-body" style="gap:20px;">
          
          <!-- SEÇÃO 1: PLANO DE FUNDO DA PÁGINA (IMAGEM OU VÍDEO) -->
          <div class="threat-bg-modal-section">
            <h3 class="threat-bg-section-title">1. PLANO DE FUNDO DA PÁGINA (GERAL)</h3>
            <p class="threat-bg-section-desc">
              Por padrão, a ficha utiliza a névoa e gradientes paranormais atmosféricos do elemento principal (<b>${safe((THREAT_ELEMENTS[sheet.elementoDestaque || 'sangue'] || THREAT_ELEMENTS.sangue).nome.toUpperCase())}</b>). Você pode fazer upload de uma imagem personalizada, vídeo animado ou usar a textura oficial do livro.
            </p>

            <div class="threat-bg-status-row">
              <span>Status atual:</span>
              <strong class="${sheet.backgroundImage ? 'status-custom' : 'status-default'}">
                ${sheet.backgroundImage ? 'IMAGEM / VÍDEO PERSONALIZADO' : `PADRÃO DO ELEMENTO (${safe((THREAT_ELEMENTS[sheet.elementoDestaque || 'sangue'] || THREAT_ELEMENTS.sangue).nome.toUpperCase())})`}
              </strong>
            </div>

            <div class="threat-bg-action-buttons">
              <input type="file" id="threat-bg-file-input" accept="image/*,video/mp4,video/webm" style="display:none;">
              <label for="threat-bg-file-input" class="threat-action-pill-btn upload" title="Carregar imagem ou vídeo do seu computador">
                📁 CARREGAR IMAGEM / VÍDEO
              </label>

              <button type="button" class="threat-action-pill-btn reset" data-threat-reset-bg title="Restaurar o gradiente atmosférico do elemento">
                ⚡ RESTAURAR PADRÃO DO ELEMENTO
              </button>

              <button type="button" class="threat-action-pill-btn preset" data-threat-preset-bg="/assets/ordem2-bg.webp" title="Aplicar textura de pergaminho oficial do livro">
                📜 TEXTURA DO LIVRO
              </button>
            </div>

            ${sheet.backgroundImage ? `
              <div class="threat-bg-slider-controls">
                <div class="threat-bg-slider-group">
                  <label>DESFOQUE (BLUR): <span class="slider-val-hint" id="threat-blur-val">${sheet.backgroundBlur ?? 0}px</span></label>
                  <input type="range" min="0" max="30" step="1" value="${sheet.backgroundBlur ?? 0}" data-threat-bg-blur>
                </div>
                <div class="threat-bg-slider-group">
                  <label>ZOOM / ESCALA: <span class="slider-val-hint" id="threat-zoom-val">${sheet.backgroundZoom ?? 100}%</span></label>
                  <input type="range" min="30" max="250" step="5" value="${sheet.backgroundZoom ?? 100}" data-threat-bg-zoom>
                </div>
                <button type="button" class="threat-mini-btn" data-threat-reset-bg-effects>RESETAR AJUSTES</button>
              </div>
            ` : ''}
          </div>

          <hr class="threat-modal-divider">

          <!-- SEÇÃO 2: ILUSTRAÇÃO / MARCA D'ÁGUA DA CRIATURA NO CARD -->
          <div class="threat-bg-modal-section">
            <h3 class="threat-bg-section-title">2. ILUSTRAÇÃO DA CRIATURA (MARCA D'ÁGUA)</h3>
            <p class="threat-bg-section-desc">
              Arte translúcida da criatura exibida no fundo da coluna direita da ficha, exatamente como na diagramação do livro de regras.
            </p>

            <div class="threat-token-preview-row">
              ${sheet.tokenImage ? `
                <div class="threat-token-thumb-wrap">
                  <img src="${safeUrl(sheet.tokenImage)}" class="threat-token-thumb" alt="Ilustração da Ameaça">
                </div>
              ` : `
                <div class="threat-token-thumb-placeholder">
                  <span>SEM ILUSTRAÇÃO</span>
                </div>
              `}

              <div class="threat-token-controls">
                <input type="file" id="threat-token-file-input" accept="image/*" style="display:none;">
                <label for="threat-token-file-input" class="threat-action-pill-btn upload">
                  📁 UPLOAD DA ILUSTRAÇÃO
                </label>
                ${sheet.tokenImage ? `
                  <button type="button" class="threat-action-pill-btn remove" data-threat-remove-token>
                    🗑️ REMOVER ILUSTRAÇÃO
                  </button>
                ` : ''}
              </div>
            </div>
          </div>

          <hr class="threat-modal-divider">

          <!-- SEÇÃO 3: COR DO TEMA & SÍMBOLO DA AMEAÇA -->
          <div class="threat-bg-modal-section">
            <h3 class="threat-bg-section-title">3. COR DO TEMA & SÍMBOLO ELEMENTAL</h3>
            <p class="threat-bg-section-desc">
              Personalize a cor de destaque da criatura (aplicada em bordas, títulos, dados e menus) ou escolha um símbolo próprio.
            </p>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:center;">
              <div>
                <label style="font:800 9.5px 'Hanken Grotesk',sans-serif;color:#8c92b2;letter-spacing:.12em;display:block;margin-bottom:6px;">
                  COR DO TEMA
                </label>
                <div style="display:flex;align-items:center;gap:8px;">
                  <input type="color" data-threat-theme-color value="${elemColor}" style="width:40px;height:34px;padding:2px;background:#1a1c2e;border:1px solid #333959;border-radius:4px;cursor:pointer;">
                  <span style="font-family:monospace;font-size:12px;color:#fff;">${elemColor.toUpperCase()}</span>
                  ${sheet.themeColor ? `
                    <button type="button" class="threat-mini-btn" data-threat-reset-theme-color title="Restaurar cor padrão do elemento">↺ RESET</button>
                  ` : ''}
                </div>
              </div>

              <div>
                <label style="font:800 9.5px 'Hanken Grotesk',sans-serif;color:#8c92b2;letter-spacing:.12em;display:block;margin-bottom:6px;">
                  SÍMBOLO DO CABEÇALHO
                </label>
                <button type="button" class="threat-edit-btn" data-threat-open-sigil-modal style="display:flex;align-items:center;gap:8px;background:#202336;">
                  ${activeSigilSrc ? `<img src="${safeUrl(activeSigilSrc)}" style="width:20px;height:20px;object-fit:contain;" alt="">` : icon('shield', 14)}
                  <span>CONFIGURAR SÍMBOLO</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        <footer class="threat-modal-footer">
          <button type="button" class="threat-edit-btn" data-close-threat-modal>CONCLUÍDO</button>
        </footer>
      </div>
    </div>

    <!-- Modal de Escolha e Upload de Símbolo da Ameaça -->
    <div class="threat-modal" id="threat-sigil-modal" style="display:none;">
      <div class="threat-modal-backdrop" data-close-threat-modal></div>
      <div class="threat-modal-card" style="max-width:520px;">
        <header class="threat-modal-header">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:16px;">🔯</span>
            <h2 style="font-family:Georgia,serif;font-size:16px;margin:0;">SÍMBOLO DA AMEAÇA</h2>
          </div>
          <button type="button" class="threat-modal-close-btn" data-close-threat-modal title="Fechar">✕</button>
        </header>

        <div class="threat-modal-body" style="gap:16px;">
          <p style="font-size:11.5px;color:#a3a7c2;margin:0;line-height:1.5;">
            Escolha o símbolo elemental que estampa o cabeçalho da criatura ou envie uma arte/runa personalizada (PNG, SVG, WebP).
          </p>

          <!-- Símbolos Oficiais dos Elementos -->
          <div>
            <label style="font:800 9.5px 'Hanken Grotesk',sans-serif;color:#8c92b2;letter-spacing:.12em;display:block;margin-bottom:8px;">
              SÍMBOLOS OFICIAIS DO OUTRO LADO
            </label>
            <div class="threat-sigils-grid">
              ${Object.values(THREAT_ELEMENTS).map(el => {
                const isSelected = !sheet.sigilImage && (sheet.sigiloId === el.id || (!sheet.sigiloId && elemDestaqueKey === el.id));
                return `
                  <button type="button" class="threat-sigil-choice-btn ${isSelected ? 'active' : ''}" data-threat-pick-sigil="${el.id}" style="--sigil-color:${el.cor};">
                    <img src="/assets/elements/${el.id}.png" alt="${safe(el.nome)}" draggable="false">
                    <span>${safe(el.nome.toUpperCase())}</span>
                  </button>
                `;
              }).join('')}
              <button type="button" class="threat-sigil-choice-btn ${(!sheet.sigilImage && sheet.sigiloId === 'escudo') ? 'active' : ''}" data-threat-pick-sigil="escudo" style="--sigil-color:#ffffff;">
                <div style="width:36px;height:36px;display:grid;place-items:center;">${icon('shield', 28)}</div>
                <span>ESCUDO</span>
              </button>
            </div>
          </div>

          <hr class="threat-modal-divider" style="margin:4px 0;border:0;border-top:1px solid #282a3c;">

          <!-- Upload de Símbolo Personalizado -->
          <div>
            <label style="font:800 9.5px 'Hanken Grotesk',sans-serif;color:#8c92b2;letter-spacing:.12em;display:block;margin-bottom:8px;">
              ARTE OU RUNA PERSONALIZADA
            </label>
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
              <label class="threat-edit-btn" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;background:#202336;">
                📁 FAZER UPLOAD DE IMAGEM
                <input type="file" id="threat-sigil-file-input" accept="image/*" style="display:none;">
              </label>
              ${sheet.sigilImage ? `
                <button type="button" class="threat-mini-btn danger" data-threat-clear-custom-sigil>
                  REMOVER PERSONALIZADO
                </button>
              ` : ''}
            </div>
            ${sheet.sigilImage ? `
              <div style="margin-top:10px;display:flex;align-items:center;gap:10px;background:#131522;padding:8px 12px;border-radius:6px;border:1px solid #2c304d;">
                <img src="${safeUrl(sheet.sigilImage)}" style="width:36px;height:36px;object-fit:contain;" alt="">
                <small style="color:#7ee787;font-weight:700;">Símbolo personalizado ativo</small>
              </div>
            ` : ''}
          </div>
        </div>

        <footer class="threat-modal-footer">
          <button type="button" class="threat-edit-btn" data-close-threat-modal>FECHAR</button>
          <button type="button" class="threat-edit-btn" data-threat-reset-sigil style="background:#262a42;color:#d5d7e8;">RESTAURAR PADRÃO</button>
        </footer>
      </div>
    </div>
  `;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  const num = parseInt(clean, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}
