/**
 * Visualizações da Ficha de Ameaça (Modo Livro Dossiê - Fase 3)
 * Design oficial de Ordem Paranormal RPG
 */

import { icon } from '../../icons.js';
import {
  calcMachucado,
  estaMachucada,
  calcQuadrados,
  formatPool,
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

function safe(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

  const elemColor = isMundane ? '#ffffff' : elemDestaque.cor;
  const elemDark = isMundane ? '#141620' : (elemDestaqueKey === 'morte' ? '#181920' : (elemDestaqueKey === 'sangue' ? '#260608' : (elemDestaqueKey === 'energia' ? '#1d082c' : '#271905')));
  const elemGlow = isMundane ? 'rgba(255,255,255,0.2)' : `rgba(${hexToRgb(elemColor)}, 0.3)`;

  const machucado = calcMachucado(sheet);
  const hurt = estaMachucada(sheet);
  const quadrados = calcQuadrados(sheet.deslocamento?.metros || 12);
  const hpPct = Math.max(0, Math.min(100, Math.round(((sheet.pv || 0) / (sheet.pvMax || 1)) * 100)));

  // Separação de ações por tipo/coluna
  const acoesEsquerda = (sheet.acoes || []).filter(a => a.coluna !== 'direita');
  const acoesDireita = (sheet.acoes || []).filter(a => a.coluna === 'direita');
  // Se não houver ações na direita, mostra todas na coluna de ações
  const acoesList = sheet.acoes || [];

  return `
    <main class="threat-book-page ${editMode ? 'mode-edit' : ''}" 
      style="--threat-elem-color:${elemColor};--threat-elem-dark:${elemDark};--threat-elem-glow:${elemGlow};">
      
      ${typeof renderBackgroundLayer === 'function' ? renderBackgroundLayer() : ''}

      <article class="threat-dossier-card" aria-label="Ficha de Ameaça: ${safe(sheet.name)}">
        
        <!-- ── BANNER / CABEÇALHO DO LIVRO ── -->
        <header class="threat-banner-header">
          <div class="threat-banner-left">
            <div class="threat-sigil-icon" title="${safe(elemDestaque.nome)}">
              ${icon('threat-sigil', 36)}
            </div>
            <div class="threat-name-wrap">
              <div class="threat-title-row">
                ${editMode ? `
                  <input type="text" class="threat-editable-input threat-name-title" 
                    data-threat-field="name" value="${safe(sheet.name)}" placeholder="NOME DA AMEAÇA" style="font-size:26px;width:100%;max-width:380px;">
                ` : `
                  <h1 class="threat-name-title">${safe(sheet.name)}</h1>
                `}
              </div>
              <div class="threat-subtitle-row">
                ${editMode ? `
                  <input type="text" class="threat-editable-input threat-subtitle-tag" 
                    data-threat-field="subtitulo" value="${safe(sheet.subtitulo)}" placeholder="SUBTÍTULO (EX: MORTE)" style="width:200px;">
                ` : (sheet.subtitulo ? `<span class="threat-subtitle-tag">${safe(sheet.subtitulo)}</span>` : `<span class="threat-subtitle-tag">${safe(isMundane ? 'REALIDADE' : elemDestaque.nome.toUpperCase())}</span>`)}
              </div>
            </div>
          </div>

          <!-- VD BRUSH STAMP (CHALK / DISTRESSED BADGE) -->
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
              ${Object.values(THREAT_ELEMENTS).map(el => {
                const isActive = (sheet.elementos || []).includes(el.id);
                const isDestaque = sheet.elementoDestaque === el.id;
                if (!isActive && !editMode) return '';
                return `
                  <button type="button" 
                    class="threat-book-elem-tag ${isDestaque ? 'highlighted' : ''} ${isActive ? 'active' : ''}" 
                    style="--elem-color:${el.cor};" 
                    data-threat-select-elem="${el.id}"
                    title="${isDestaque ? 'Elemento principal' : 'Clique para destacar este elemento'}">
                    ${safe(el.nome.toUpperCase())}
                  </button>
                  <span class="tag-bullet">•</span>
                `;
              }).join('')}
            ` : `
              <span class="threat-book-plain-tag">MUNDANA</span>
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

        <!-- ── CORPO EDITORIAL EM 2 COLUNAS DO LIVRO ── -->
        <div class="threat-book-columns-layout">
          
          <!-- ── COLUNA ESQUERDA: ESTATÍSTICAS E REGRAS ── -->
          <div class="threat-book-col-left">
            
            <!-- PRESENÇA PERTURBADORA (Apenas Paranormal ou se ativado) -->
            ${(!isMundane && sheet.presenca?.ativa) ? `
              <div class="threat-book-block">
                <div class="threat-book-heading-row">
                  <span class="threat-book-badge">PRESENÇA PERTURBADORA</span>
                  <button type="button" class="threat-book-mini-roll-btn" data-threat-roll-presence title="Rolar dano mental da presença">
                    ${icon('d20', 11)} ROLAR DANO
                  </button>
                </div>
                <div class="threat-book-stat-line">
                  ${editMode ? `
                    <span>DT <input type="number" class="threat-mini-input" data-threat-field="presenca.dt" value="${sheet.presenca.dt}"></span>
                    <span>• <input type="text" class="threat-mini-input" data-threat-field="presenca.dano" value="${safe(sheet.presenca.dano)}"></span>
                    <span><input type="text" class="threat-mini-input" data-threat-field="presenca.tipoDano" value="${safe(sheet.presenca.tipoDano)}"></span>
                    <span>• NEX <input type="number" class="threat-mini-input" data-threat-field="presenca.imuneNex" value="${sheet.presenca.imuneNex}">%+ é imune</span>
                  ` : `
                    <span>DT ${sheet.presenca.dt} • ${safe(sheet.presenca.dano)} ${safe(sheet.presenca.tipoDano)} • NEX ${sheet.presenca.imuneNex}%+ é imune</span>
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
                  <span>Percepção <button type="button" class="threat-die-token" data-threat-roll-sense="percepcao" title="Rolar Percepção">⬡ ${formatPool(sheet.sentidos?.percepcao)}</button></span>
                  <span class="threat-pipe">|</span>
                  <span>Iniciativa <button type="button" class="threat-die-token" data-threat-roll-sense="iniciativa" title="Rolar Iniciativa">⬡ ${formatPool(sheet.sentidos?.iniciativa)}</button></span>
                  ${editMode ? `
                    <button type="button" class="threat-mini-btn" data-threat-edit-senses title="Editar Sentidos">
                      ${icon('edit', 10)}
                    </button>
                  ` : ''}
                </div>
              </div>
              ${sheet.sentidos?.extra ? `<div class="threat-book-upper-note">${safe(sheet.sentidos.extra)}</div>` : ''}
              <div class="threat-book-divider"></div>
            </div>

            <!-- DEFESA E SALVAGUARDAS -->
            <div class="threat-book-block">
              <div class="threat-book-heading-row">
                <span class="threat-book-badge">DEFESA</span>
                ${editMode ? `
                  <input type="number" class="threat-mini-input threat-def-input" data-threat-field="defesa" value="${sheet.defesa}">
                ` : `
                  <strong class="threat-book-big-stat">${sheet.defesa}</strong>
                `}
                ${editMode ? `
                  <button type="button" class="threat-mini-btn" data-threat-edit-saves style="margin-left:auto;" title="Editar Salvaguardas">
                    ${icon('edit', 10)}
                  </button>
                ` : ''}
              </div>
              <div class="threat-book-saves-row">
                <div class="threat-save-entry">FORTITUDE <button type="button" class="threat-die-token" data-threat-roll-save="fortitude">⬡ ${formatPool(sheet.salvaguardas?.fortitude)}</button></div>
                <div class="threat-save-entry">REFLEXOS <button type="button" class="threat-die-token" data-threat-roll-save="reflexos">⬡ ${formatPool(sheet.salvaguardas?.reflexos)}</button></div>
                <div class="threat-save-entry">VONTADE <button type="button" class="threat-die-token" data-threat-roll-save="vontade">⬡ ${formatPool(sheet.salvaguardas?.vontade)}</button></div>
              </div>
              <div class="threat-book-divider"></div>
            </div>

            <!-- PONTOS DE VIDA (PV) E MACHUCADO -->
            <div class="threat-book-block">
              <div class="threat-book-heading-row">
                <span class="threat-book-badge">PONTOS DE VIDA</span>
                <span class="threat-book-hp-label">
                  <b>${sheet.pv}</b> / ${sheet.pvMax} <span class="threat-pipe">|</span> Machucado <b>${machucado}</b>
                </span>
                ${hurt ? `
                  <span class="threat-book-hurt-stamp">! MACHUCADA</span>
                ` : ''}
              </div>

              <!-- Barra discreta de PV com linha central e controles rápidos -->
              <div class="threat-book-hp-bar-wrap">
                <div class="threat-hp-track-book" title="Vida: ${sheet.pv}/${sheet.pvMax} (${hpPct}%)">
                  <div class="threat-hp-fill-book ${hurt ? 'is-hurt' : ''}" style="width:${hpPct}%;"></div>
                  <div class="threat-hp-machucado-line-book" title="Limiar de Machucado (${machucado} PV)"></div>
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

              <!-- Defesas textuais idênticas ao livro -->
              <div class="threat-book-defenses-list">
                ${sheet.imunidades?.length ? `
                  <div class="defense-row">
                    <strong>IMUNIDADES</strong>
                    <span>${sheet.imunidades.join(', ')}</span>
                  </div>
                ` : ''}

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

                ${editMode ? `
                  <button type="button" class="threat-mini-btn" data-threat-manage-defenses style="margin-top:6px;">
                    ${icon('shield', 10)} GERENCIAR RESISTÊNCIAS & IMUNIDADES
                  </button>
                ` : ''}
              </div>
              <div class="threat-book-divider"></div>
            </div>

            <!-- DESLOCAMENTO -->
            <div class="threat-book-block">
              <div class="threat-book-heading-row">
                <span class="threat-book-badge">DESLOCAMENTO</span>
                ${editMode ? `
                  <span class="threat-book-stat-val">
                    <input type="number" class="threat-mini-input" min="0" data-threat-field="deslocamento.metros" value="${sheet.deslocamento?.metros || 9}">m
                    <span class="threat-pipe">|</span> ${quadrados}□
                  </span>
                ` : `
                  <span class="threat-book-stat-val"><b>${sheet.deslocamento?.metros || 9}m</b> <span class="threat-pipe">|</span> <b>${quadrados}□</b></span>
                `}
              </div>
              ${(sheet.deslocamento?.extras || []).map(e => `
                <div class="threat-book-subtext" style="text-transform:uppercase;">${safe(e.tipo)} ${e.metros}m <span class="threat-pipe">|</span> ${Math.round(e.metros / 1.5)}□</div>
              `).join('')}
              <div class="threat-book-divider"></div>
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
                ].map(a => `
                  <div class="threat-book-attr-col" data-threat-roll-attr="${a.key}" title="Rolar ${a.full} (${sheet.atributos?.[a.key] || 0}d20)">
                    <span class="attr-label">${a.label}</span>
                    <span class="attr-hex">
                      ${editMode ? `
                        <input type="number" class="threat-attr-input" min="0" max="15" 
                          data-threat-attr-input="${a.key}" value="${sheet.atributos?.[a.key] ?? 2}" onclick="event.stopPropagation();">
                      ` : `
                        <b>${sheet.atributos?.[a.key] ?? 2}</b>
                      `}
                    </span>
                  </div>
                `).join('')}
              </div>
              <div class="threat-book-divider"></div>
            </div>

            <!-- PERÍCIAS (OPCIONAL) -->
            ${(sheet.pericias?.length || editMode) ? `
              <div class="threat-book-block">
                <div class="threat-book-heading-row">
                  <span class="threat-book-badge">PERÍCIAS</span>
                  <div class="threat-book-skills-inline">
                    ${(sheet.pericias || []).map(p => `
                      <button type="button" class="threat-book-skill-chip" data-threat-roll-pericia="${p.id}" title="${p.condicional ? safe(p.condicional.texto) : ''}">
                        ${safe(p.nome)} <span class="die-token">⬡ ${p.dados}d20${p.bonus >= 0 ? `+${p.bonus}` : p.bonus}</span>
                      </button>
                    `).join('')}
                    ${sheet.pericias?.length === 0 ? `<em style="color:#777;font-size:12px;">Nenhuma</em>` : ''}
                    ${editMode ? `<button type="button" class="threat-mini-btn" data-threat-add-skill>+ ADICIONAR</button>` : ''}
                  </div>
                </div>
                <div class="threat-book-divider"></div>
              </div>
            ` : ''}

            <!-- SEÇÕES LIVRES / HABILIDADES COLUNA ESQUERDA (Ex: Membros Longos, Parte do Cenário, O Sino) -->
            ${(sheet.secoes || []).map(sec => `
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

            ${editMode ? `
              <button type="button" class="threat-mini-btn" data-threat-add-section style="margin-top:8px;">
                + ADICIONAR SEÇÃO OU ENIGMA DE MEDO
              </button>
            ` : ''}

          </div>

          <!-- ── COLUNA DIREITA: AÇÕES E HABILIDADES DO LIVRO ── -->
          <div class="threat-book-col-right">
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
            ${renderActionGroups(acoesList, hurt, editMode)}

            ${acoesList.length === 0 ? `
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
    padrao: '◆',
    movimento: '❖',
    reacao: '✦',
    completa: '◈',
    livre: '◇',
    passiva: '○'
  };
  const sym = actionSymMap[action.tipoAcao] || '◆';

  return `
    <article class="threat-book-action-entry ${isActive ? 'is-frenesi-active' : ''}" 
      data-threat-action-card="${action.id}">
      
      <div class="action-entry-header">
        <span class="action-type-label">${safe(action.tipoAcao?.toUpperCase() || 'PADRÃO')}</span>
        <span class="action-symbol">${sym}</span>
        <h3 class="action-entry-title">${safe(action.nome)}</h3>
        
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
            <strong class="attack-name">${safe(atk.nome)}</strong>
            <span class="attack-reach">${safe(atk.alcance || 'Corpo a corpo')}${atk.multiplicador > 1 ? ` x${atk.multiplicador}` : ''}</span>
          </div>
          <div class="attack-roll-line">
            <button type="button" class="threat-chip-roll-test" data-threat-roll-atk-test="${action.id}:${atk.id}" title="Rolar Teste de Ataque">
              TESTE <b>${atk.teste?.dados || 3}d20${atk.teste?.bonus >= 0 ? `+${atk.teste.bonus}` : atk.teste.bonus}</b>
            </button>
            <span class="threat-pipe">|</span>
            <button type="button" class="threat-chip-roll-dmg" data-threat-roll-atk-dmg="${action.id}:${atk.id}" title="Rolar Dano">
              DANO <b>${safe(atk.dano)} ${safe(atk.tipoDano || '')}</b> ${atk.critico ? `<small>(${safe(atk.critico)})</small>` : ''}
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
  return `
    <!-- Modal de Ação / Habilidade -->
    <div class="threat-modal" id="threat-action-modal" style="display:none;">
      <div class="threat-modal-backdrop" data-close-threat-modal></div>
      <div class="threat-modal-card">
        <header class="threat-modal-header">
          <h2 id="threat-action-modal-title">EDITAR AÇÃO</h2>
          <button type="button" class="threat-edit-btn" data-close-threat-modal>${icon('close', 13)}</button>
        </header>
        <form id="threat-action-form" class="threat-modal-body">
          <input type="hidden" name="actionId" id="threat-action-id">
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="threat-form-group">
              <label>TIPO DE AÇÃO</label>
              <select name="tipoAcao" id="threat-action-type">
                ${ACTION_TYPES.map(t => `<option value="${t.id}">${t.simbolo} ${t.nome}</option>`).join('')}
              </select>
            </div>
            <div class="threat-form-group">
              <label>NOME DA AÇÃO</label>
              <input type="text" name="nome" id="threat-action-name-input" required placeholder="Ex: Agredir, Miasma Fétido...">
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="threat-form-group">
              <label>GATILHO / CONDIÇÃO (OPCIONAL)</label>
              <input type="text" name="gatilho" id="threat-action-trigger" placeholder="Ex: Ao receber dano...">
            </div>
            <div class="threat-form-group">
              <label>GATILHO DE MACHUCADO</label>
              <select name="ativaQuando" id="threat-action-hurt">
                <option value="">Sempre disponível</option>
                <option value="machucado">Ativar automaticamente quando Machucada (Frenesi)</option>
              </select>
            </div>
          </div>

          <!-- Construtor de Ataques dentro da ação -->
          <div class="threat-form-group" style="background:#16192c;border:1px solid #292d47;border-radius:6px;padding:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <label style="margin:0;">ATAQUES DA AÇÃO</label>
              <button type="button" class="threat-edit-btn" id="btn-threat-add-attack-row">+ ADICIONAR ATAQUE</button>
            </div>
            <div id="threat-attacks-container" style="display:flex;flex-direction:column;gap:8px;"></div>
          </div>

          <div class="threat-form-group">
            <label>TEXTO E REGRAS DA AÇÃO</label>
            <textarea name="texto" id="threat-action-text-input" rows="4" placeholder="Descrição do efeito, teste de resistência das vítimas, condições impostas..."></textarea>
          </div>

          <footer class="threat-modal-footer">
            <button type="button" class="threat-edit-btn" data-close-threat-modal>CANCELAR</button>
            <button type="submit" class="threat-edit-btn" style="background:var(--threat-elem-color,#e0150d);color:#fff;border-color:transparent;font-weight:900;">SALVAR AÇÃO</button>
          </footer>
        </form>
      </div>
    </div>

    <!-- Modal de Gerenciamento de Resistências / Imunidades -->
    <div class="threat-modal" id="threat-defenses-modal" style="display:none;">
      <div class="threat-modal-backdrop" data-close-threat-modal></div>
      <div class="threat-modal-card">
        <header class="threat-modal-header">
          <h2>RESISTÊNCIAS, IMUNIDADES E VULNERABILIDADES</h2>
          <button type="button" class="threat-edit-btn" data-close-threat-modal>${icon('close', 13)}</button>
        </header>
        <form id="threat-defenses-form" class="threat-modal-body">
          <div class="threat-form-group">
            <label>IMUNIDADES (SEPARADAS POR VÍRGULA)</label>
            <input type="text" name="imunidades" id="threat-defenses-imunidades" value="${safe((sheet.imunidades || []).join(', '))}" placeholder="Ex: Morte, Dano Mental, Condições...">
          </div>
          <div class="threat-form-group">
            <label>VULNERABILIDADES (SEPARADAS POR VÍRGULA)</label>
            <input type="text" name="vulnerabilidades" id="threat-defenses-vulnerabilidades" value="${safe((sheet.vulnerabilidades || []).join(', '))}" placeholder="Ex: Energia, Fogo...">
          </div>
          <div class="threat-form-group">
            <label>RESISTÊNCIAS (TIPO E VALOR, EX: Balístico 10, Sangue 20)</label>
            <textarea name="resistencias" id="threat-defenses-resistencias" rows="3" placeholder="Balístico 10, Impacto 10, Perfuração 10">${safe((sheet.resistencias || []).map(r => `${r.tipo} ${r.valor}`).join(', '))}</textarea>
          </div>
          <footer class="threat-modal-footer">
            <button type="button" class="threat-edit-btn" data-close-threat-modal>CANCELAR</button>
            <button type="submit" class="threat-edit-btn" style="background:var(--threat-elem-color,#e0150d);color:#fff;border-color:transparent;">SALVAR DEFESAS</button>
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
          <div class="threat-form-group">
            <label>ESTILO DA SEÇÃO</label>
            <select name="estilo" id="threat-section-style">
              <option value="normal">Seção Comum (Ex: Consumir, Habitat, Comportamento)</option>
              <option value="enigma">Enigma de Medo (Caixa de Papel Envelhecido / Regra Especial)</option>
            </select>
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
