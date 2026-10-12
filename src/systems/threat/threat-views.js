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
              ${icon('threat-sigil', 32)}
            </div>
            <div class="threat-name-wrap">
              <div class="threat-title-row">
                ${editMode ? `
                  <input type="text" class="threat-editable-input threat-name-title" 
                    data-threat-field="name" value="${safe(sheet.name)}" placeholder="NOME DA AMEAÇA" style="font-size:24px;width:100%;max-width:380px;">
                ` : `
                  <h1 class="threat-name-title">${safe(sheet.name)}</h1>
                `}
                ${editMode ? `
                  <input type="text" class="threat-editable-input threat-subtitle-tag" 
                    data-threat-field="subtitulo" value="${safe(sheet.subtitulo)}" placeholder="SUBTÍTULO (EX: SANGUE)" style="width:180px;">
                ` : (sheet.subtitulo ? `<span class="threat-subtitle-tag">${safe(sheet.subtitulo)}</span>` : '')}
              </div>
            </div>
          </div>

          <div class="threat-vd-badge-box">
            <span class="threat-vd-label">VALOR DE DESAFIO</span>
            ${editMode ? `
              <div style="display:flex;align-items:center;gap:4px;">
                <span style="font-weight:900;color:var(--threat-elem-color);font-size:20px;">VD</span>
                <input type="number" class="threat-editable-input" min="0" max="999" 
                  data-threat-field="vd" value="${sheet.vd}" style="width:65px;font-size:20px;font-weight:900;">
              </div>
            ` : `
              <span class="threat-vd-number">VD ${sheet.vd}</span>
            `}
          </div>
        </header>

        <!-- ── BARRA DE TAGS E METADADOS ── -->
        <nav class="threat-tags-bar" aria-label="Metadados da Ameaça">
          <div class="threat-tags-left">
            ${!isMundane ? `
              ${Object.values(THREAT_ELEMENTS).map(el => {
                const isActive = (sheet.elementos || []).includes(el.id);
                const isDestaque = sheet.elementoDestaque === el.id;
                if (!isActive && !editMode) return '';
                return `
                  <button type="button" 
                    class="threat-elem-pill ${isDestaque ? 'highlighted' : ''}" 
                    style="--elem-color:${el.cor};" 
                    data-threat-select-elem="${el.id}"
                    title="${isDestaque ? 'Elemento principal' : 'Clique para destacar este elemento'}">
                    ${safe(el.nome)}
                  </button>
                `;
              }).join('')}
            ` : `
              <span class="threat-meta-pill" style="border-color:#555977;color:#fff;">AMEAÇA DA REALIDADE (MUNDANA)</span>
            `}

            ${editMode ? `
              <select class="threat-editable-input" data-threat-field="tipo" style="font-size:11px;padding:2px 6px;">
                ${(isMundane ? CREATURE_TYPES_MUNDANE : CREATURE_TYPES_PARANORMAL).map(t => `
                  <option value="${safe(t)}" ${sheet.tipo === t ? 'selected' : ''}>${safe(t)}</option>
                `).join('')}
              </select>
              <select class="threat-editable-input" data-threat-field="tamanho" style="font-size:11px;padding:2px 6px;">
                ${THREAT_SIZES.map(s => `
                  <option value="${safe(s)}" ${sheet.tamanho === s ? 'selected' : ''}>${safe(s)}</option>
                `).join('')}
              </select>
            ` : `
              <span class="threat-meta-pill">${safe(sheet.tipo || 'Criatura')}</span>
              <span class="threat-meta-pill">${safe(sheet.tamanho || 'Médio')}</span>
            `}
          </div>

          <div style="display:flex;align-items:center;gap:8px;">
            ${editMode ? `
              <button type="button" class="threat-edit-btn" data-threat-toggle-categoria>
                ${isMundane ? 'MUDAR PARA PARANORMAL' : 'MUDAR PARA MUNDANA'}
              </button>
            ` : ''}
          </div>
        </nav>

        <!-- ── GRID DE 2 COLUNAS DO LIVRO ── -->
        <div class="threat-columns-layout">
          
          <!-- ── COLUNA ESQUERDA: ESTATÍSTICAS E VITAIS ── -->
          <div class="threat-col">
            
            <!-- PRESENÇA PERTURBADORA (Apenas Paranormal ou se ativado) -->
            ${(!isMundane && sheet.presenca?.ativa) ? `
              <section class="threat-presenca-card">
                <div class="threat-presenca-header">
                  <strong>${icon('alert', 14)} PRESENÇA PERTURBADORA</strong>
                  <button type="button" class="threat-presenca-roll-btn" data-threat-roll-presence title="Rolar dano mental da presença">
                    ${icon('d20', 13)} ROLAR DANO
                  </button>
                </div>
                <div class="threat-presenca-stats">
                  ${editMode ? `
                    <span>DT <input type="number" class="threat-editable-input" data-threat-field="presenca.dt" value="${sheet.presenca.dt}" style="width:50px;"></span>
                    <span>DANO <input type="text" class="threat-editable-input" data-threat-field="presenca.dano" value="${safe(sheet.presenca.dano)}" style="width:65px;"></span>
                    <span>TIPO <input type="text" class="threat-editable-input" data-threat-field="presenca.tipoDano" value="${safe(sheet.presenca.tipoDano)}" style="width:80px;"></span>
                    <span>IMUNE NEX <input type="number" class="threat-editable-input" data-threat-field="presenca.imuneNex" value="${sheet.presenca.imuneNex}" style="width:55px;">%+</span>
                  ` : `
                    <span class="stat-badge">DT ${sheet.presenca.dt}</span>
                    <span class="stat-badge">${safe(sheet.presenca.dano)} ${safe(sheet.presenca.tipoDano)}</span>
                    <span style="font-weight:700;">NEX ${sheet.presenca.imuneNex}%+ é imune</span>
                  `}
                </div>
                ${sheet.presenca.texto ? `<small style="display:block;margin-top:6px;color:#a4a9c6;">${safe(sheet.presenca.texto)}</small>` : ''}
              </section>
            ` : ''}

            <!-- SENTIDOS -->
            <section class="threat-info-row">
              <span class="threat-info-label">SENTIDOS</span>
              <button type="button" class="threat-roll-chip" data-threat-roll-sense="percepcao" title="Rolar Percepção">
                ${icon('eye', 13)} Percepção <b>${formatPool(sheet.sentidos?.percepcao)}</b>
              </button>
              <button type="button" class="threat-roll-chip" data-threat-roll-sense="iniciativa" title="Rolar Iniciativa">
                ${icon('zap', 13)} Iniciativa <b>${formatPool(sheet.sentidos?.iniciativa)}</b>
              </button>
              ${sheet.sentidos?.extra ? `<span style="font-size:11px;color:#9ca1bd;font-weight:600;">${safe(sheet.sentidos.extra)}</span>` : ''}
              ${editMode ? `
                <button type="button" class="threat-edit-btn" data-threat-edit-senses style="margin-left:auto;">
                  ${icon('edit', 11)} EDITAR
                </button>
              ` : ''}
            </section>

            <!-- DEFESA E SALVAGUARDAS -->
            <section class="threat-info-row" style="background:#111322;">
              <span class="threat-info-label">DEFESA</span>
              ${editMode ? `
                <input type="number" class="threat-editable-input" data-threat-field="defesa" value="${sheet.defesa}" style="width:60px;font-weight:900;">
              ` : `
                <span style="font-size:18px;font-weight:900;color:#fff;margin-right:6px;">${sheet.defesa}</span>
              `}
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <button type="button" class="threat-roll-chip" data-threat-roll-save="fortitude" title="Rolar Fortitude">
                  Fort <b>${formatPool(sheet.salvaguardas?.fortitude)}</b>
                </button>
                <button type="button" class="threat-roll-chip" data-threat-roll-save="reflexos" title="Rolar Reflexos">
                  Ref <b>${formatPool(sheet.salvaguardas?.reflexos)}</b>
                </button>
                <button type="button" class="threat-roll-chip" data-threat-roll-save="vontade" title="Rolar Vontade">
                  Von <b>${formatPool(sheet.salvaguardas?.vontade)}</b>
                </button>
              </div>
              ${editMode ? `
                <button type="button" class="threat-edit-btn" data-threat-edit-saves style="margin-left:auto;">
                  ${icon('edit', 11)}
                </button>
              ` : ''}
            </section>

            <!-- PONTOS DE VIDA (PV) E MACHUCADO -->
            <section class="threat-vitals-card">
              <div class="threat-vitals-header">
                <span class="threat-vitals-title">PONTOS DE VIDA</span>
                <div class="threat-pv-numbers">
                  <span class="threat-pv-current">${sheet.pv}</span>
                  <span class="threat-pv-max">/ ${sheet.pvMax}</span>
                  <span class="threat-machucado-threshold" title="Limiar de machucado: metade do PV máximo">
                    Machucado: <b>${machucado}</b>
                  </span>
                  ${hurt ? `
                    <span class="threat-hurt-stamp">${icon('alert', 11)} MACHUCADA</span>
                  ` : ''}
                </div>
              </div>

              <!-- Barra com Marcação Central de Machucado -->
              <div class="threat-hp-track" title="Vida: ${sheet.pv}/${sheet.pvMax} (${hpPct}%)">
                <div class="threat-hp-fill ${hurt ? 'is-hurt' : ''}" style="width:${hpPct}%;"></div>
                <div class="threat-hp-machucado-line" title="Linha de Machucado"></div>
              </div>

              <!-- Controles Rápidos de PV -->
              <div class="threat-pv-steppers">
                <span style="font-size:9.5px;font-weight:800;color:#787e9c;letter-spacing:0.08em;margin-right:2px;">DANO:</span>
                <button type="button" class="threat-step-btn btn-damage" data-threat-pv-delta="-10">-10</button>
                <button type="button" class="threat-step-btn btn-damage" data-threat-pv-delta="-5">-5</button>
                <button type="button" class="threat-step-btn btn-damage" data-threat-pv-delta="-1">-1</button>
                <span style="font-size:9.5px;font-weight:800;color:#787e9c;letter-spacing:0.08em;margin:0 4px 0 6px;">CURA:</span>
                <button type="button" class="threat-step-btn btn-heal" data-threat-pv-delta="1">+1</button>
                <button type="button" class="threat-step-btn btn-heal" data-threat-pv-delta="5">+5</button>
                <button type="button" class="threat-step-btn btn-heal" data-threat-pv-delta="10">+10</button>
                
                ${sheet.pvTemp ? `
                  <button type="button" class="threat-step-btn" data-threat-clear-temp style="border-color:#e5a93b;color:#e5a93b;margin-left:auto;">
                    +${sheet.pvTemp} TEMP
                  </button>
                ` : `
                  <button type="button" class="threat-step-btn" data-threat-add-temp style="margin-left:auto;">
                    + PV TEMP
                  </button>
                `}
              </div>

              <!-- Resistências, Imunidades e Vulnerabilidades -->
              <div class="threat-defenses-list">
                ${sheet.imunidades?.length ? `
                  <div class="threat-defense-line">
                    <strong>IMUNIDADES</strong>
                    <div class="threat-defense-chips">
                      ${sheet.imunidades.map(im => `<span class="threat-defense-chip immune">${safe(im)}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}

                ${sheet.resistencias?.length ? `
                  <div class="threat-defense-line">
                    <strong>RESISTÊNCIAS</strong>
                    <div class="threat-defense-chips">
                      ${sheet.resistencias.map(r => `<span class="threat-defense-chip resist">${safe(r.tipo)} ${r.valor}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}

                ${sheet.vulnerabilidades?.length ? `
                  <div class="threat-defense-line">
                    <strong>VULNERABILIDADES</strong>
                    <div class="threat-defense-chips">
                      ${sheet.vulnerabilidades.map(v => `<span class="threat-defense-chip vuln">${safe(v)}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}

                ${editMode ? `
                  <button type="button" class="threat-edit-btn" data-threat-manage-defenses style="align-self:flex-start;margin-top:4px;">
                    ${icon('shield', 11)} GERENCIAR RESISTÊNCIAS & IMUNIDADES
                  </button>
                ` : ''}
              </div>
            </section>

            <!-- ATRIBUTOS EM HEXÁGONOS -->
            <section>
              <div class="threat-section-head">
                <h2>ATRIBUTOS</h2>
                <small style="color:#787e9c;font-size:10px;">Clique no atributo para rolar</small>
              </div>
              <div class="threat-attributes-row">
                ${[
                  { key: 'agi', label: 'AGI', full: 'Agilidade' },
                  { key: 'for', label: 'FOR', full: 'Força' },
                  { key: 'int', label: 'INT', full: 'Intelecto' },
                  { key: 'pre', label: 'PRE', full: 'Presença' },
                  { key: 'vig', label: 'VIG', full: 'Vigor' }
                ].map(attr => `
                  <div class="threat-attr-hex" data-threat-roll-attr="${attr.key}" title="Rolar ${attr.full} (${sheet.atributos?.[attr.key] || 0}d20)">
                    <small>${attr.label}</small>
                    ${editMode ? `
                      <input type="number" class="threat-editable-input" min="0" max="15" 
                        data-threat-attr-input="${attr.key}" value="${sheet.atributos?.[attr.key] ?? 2}" 
                        style="width:40px;font-size:16px;text-align:center;padding:1px;" onclick="event.stopPropagation();">
                    ` : `
                      <b>${sheet.atributos?.[attr.key] ?? 2}</b>
                    `}
                  </div>
                `).join('')}
              </div>
            </section>

            <!-- DESLOCAMENTO -->
            <section class="threat-speed-box">
              <span class="threat-info-label">DESLOCAMENTO</span>
              <div class="threat-speed-main">
                ${editMode ? `
                  <input type="number" class="threat-editable-input" min="0" 
                    data-threat-field="deslocamento.metros" value="${sheet.deslocamento?.metros || 12}" style="width:55px;"> m
                ` : `
                  <b>${sheet.deslocamento?.metros || 12}m</b>
                `}
                <span class="threat-speed-squares">| ${quadrados}□</span>
                ${(sheet.deslocamento?.extras || []).map(e => `
                  <span style="color:#aeb3d0;margin-left:6px;">· ${safe(e.tipo)} ${e.metros}m</span>
                `).join('')}
              </div>
            </section>

            <!-- PERÍCIAS (OPCIONAL) -->
            ${(sheet.pericias?.length || editMode) ? `
              <section>
                <div class="threat-section-head">
                  <h2>PERÍCIAS</h2>
                  ${editMode ? `<button type="button" class="head-action-btn" data-threat-add-skill>+ ADICIONAR</button>` : ''}
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                  ${(sheet.pericias || []).map(p => `
                    <button type="button" class="threat-roll-chip" data-threat-roll-pericia="${p.id}" title="${p.condicional ? safe(p.condicional.texto) : ''}">
                      ${safe(p.nome)} <b>${p.dados}d20${p.bonus >= 0 ? `+${p.bonus}` : p.bonus}</b>
                      ${p.condicional ? `<small style="color:#d4952c;">(+${p.condicional.bonus})</small>` : ''}
                    </button>
                  `).join('')}
                  ${sheet.pericias?.length === 0 ? `<small style="color:#636885;padding:4px 0;">Nenhuma perícia adicionada.</small>` : ''}
                </div>
              </section>
            ` : ''}

            <!-- SEÇÕES LIVRES / ENIGMAS DE MEDO (Coluna Esquerda) -->
            ${(sheet.secoes || []).map(sec => `
              <section class="${sec.estilo === 'enigma' ? 'threat-enigma-card' : 'threat-section-card'}">
                <div style="display:flex;align-items:center;justify-content:space-between;">
                  <h3>${safe(sec.titulo)}</h3>
                  ${editMode ? `
                    <div style="display:flex;gap:4px;">
                      <button type="button" class="threat-edit-btn" data-threat-edit-section="${sec.id}">${icon('edit', 11)}</button>
                      <button type="button" class="threat-edit-btn danger" data-threat-del-section="${sec.id}">${icon('trash', 11)}</button>
                    </div>
                  ` : ''}
                </div>
                <p>${safe(sec.corpo)}</p>
              </section>
            `).join('')}

            ${editMode ? `
              <button type="button" class="threat-edit-btn" data-threat-add-section style="align-self:flex-start;">
                + ADICIONAR SEÇÃO OU ENIGMA DE MEDO
              </button>
            ` : ''}

          </div>

          <!-- ── COLUNA DIREITA: AÇÕES E HABILIDADES ── -->
          <div class="threat-col threat-actions-column">
            <div class="threat-section-head">
              <h2>AÇÕES & HABILIDADES</h2>
              ${editMode ? `
                <button type="button" class="head-action-btn" data-threat-add-action>
                  ${icon('plus', 12)} NOVA AÇÃO
                </button>
              ` : ''}
            </div>

            ${renderActionGroups(acoesList, hurt, editMode)}

            ${acoesList.length === 0 ? `
              <div style="text-align:center;padding:36px 16px;background:#121422;border:1px dashed #262940;border-radius:6px;color:#717696;">
                <p style="margin:0 0 6px 0;font-weight:700;">Nenhuma ação cadastrada</p>
                <small>Clique no botão de edição para adicionar ataques e habilidades.</small>
              </div>
            ` : ''}
          </div>

        </div>

      </article>

      <!-- ── MODAIS DE EDIÇÃO DA AMEAÇA ── -->
      ${renderThreatModals(sheet)}

    </main>
  `;
}

/**
 * Renderiza grupos de ações organizados por tipo
 */
function renderActionGroups(actions = [], isHurt = false, editMode = false) {
  const groups = [
    { type: 'padrao', label: 'Ações Padrão', sym: '◆' },
    { type: 'movimento', label: 'Ações de Movimento', sym: '❖' },
    { type: 'reacao', label: 'Reações', sym: '✦' },
    { type: 'completa', label: 'Ações Completas', sym: '◈' },
    { type: 'livre', label: 'Ações Livres', sym: '◇' },
    { type: 'passiva', label: 'Habilidades Passivas', sym: '○' }
  ];

  return groups.map(g => {
    const groupActions = actions.filter(a => a.tipoAcao === g.type);
    if (!groupActions.length) return '';

    return `
      <div class="threat-action-group">
        <div class="threat-action-group-heading">
          <span class="sym">${g.sym}</span>
          <span>${g.label}</span>
        </div>
        ${groupActions.map(action => renderActionCard(action, isHurt, editMode)).join('')}
      </div>
    `;
  }).join('');
}

/**
 * Renderiza um card individual de ação ou habilidade
 */
function renderActionCard(action, isHurt = false, editMode = false) {
  const isHurtTrigger = action.ativaQuando === 'machucado';
  const isActive = isHurtTrigger && isHurt;

  return `
    <article class="threat-action-card ${isHurtTrigger ? 'action-hurt-triggered' : ''} ${isActive ? 'is-active' : ''}" 
      data-threat-action-card="${action.id}">
      
      <div class="threat-action-topbar">
        <div class="threat-action-title-wrap">
          <span class="threat-action-type-pill">${safe(action.tipoAcao)}</span>
          <h3 class="threat-action-name">${safe(action.nome)}</h3>
          ${action.gatilho ? `<small style="color:#e5a93b;font-weight:700;">(${safe(action.gatilho)})</small>` : ''}
        </div>

        <div style="display:flex;align-items:center;gap:6px;">
          ${isActive ? `
            <span class="threat-action-badge-active">ATIVO (FRENESI)</span>
          ` : (isHurtTrigger ? `<span style="font-size:8.5px;color:#8589aa;font-weight:700;">QUANDO MACHUCADA</span>` : '')}

          ${action.usos ? `
            <span style="font-size:9px;background:#1e2238;color:#aeb5d6;padding:2px 6px;border-radius:3px;font-weight:800;">
              ${action.usos.atual} / ${action.usos.max} USOS
            </span>
          ` : ''}

          ${editMode ? `
            <button type="button" class="threat-edit-btn" data-threat-edit-action="${action.id}" title="Editar ação">
              ${icon('edit', 11)}
            </button>
            <button type="button" class="threat-edit-btn danger" data-threat-del-action="${action.id}" title="Excluir ação">
              ${icon('trash', 11)}
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Ataques da Ação -->
      ${(action.ataques || []).map(atk => `
        <div class="threat-attack-item">
          <div class="threat-attack-header">
            <span class="threat-attack-title">${safe(atk.nome)}</span>
            <span class="threat-attack-range">
              ${safe(atk.alcance)} ${atk.multiplicador > 1 ? `x${atk.multiplicador}` : ''}
            </span>
          </div>
          <div class="threat-attack-chips-row">
            <button type="button" class="threat-attack-roll-btn" 
              data-threat-roll-atk-test="${action.id}:${atk.id}" 
              title="Rolar Teste de Ataque: ${formatPool(atk.teste)}">
              ${icon('d20', 12)} TESTE <b>${formatPool(atk.teste)}</b>
            </button>
            <button type="button" class="threat-attack-roll-btn damage-btn" 
              data-threat-roll-atk-dmg="${action.id}:${atk.id}" 
              title="Rolar Dano: ${safe(atk.dano)} (${safe(atk.tipoDano)})">
              ${icon('zap', 12)} DANO <b>${safe(atk.dano)} ${safe(atk.tipoDano)}</b>
            </button>
            ${atk.critico ? `<span style="font-size:10px;color:#7c82a2;font-weight:700;">${safe(atk.critico)}</span>` : ''}
          </div>
        </div>
      `).join('')}

      <!-- Texto / Descrição Rica -->
      ${action.texto ? `
        <div class="threat-action-text">${safe(action.texto)}</div>
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
