import {
  ATRIBUTOS,
  PERICIAS,
  ORIGENS,
  CLASSES,
  PODERES_GERAIS,
  PODERES_PARANORMAIS,
  RITUAIS,
  CONDICOES,
  TREINOS_ORIGINAL,
  classeAtual,
  passosNex,
  snapNex,
  estagioAtual,
  origemAtual,
  trilhaAtual,
  trilhaSecundariaAtual,
  progressaoDeTrilhas,
  temVersatilidade,
  temVersatilidadeAmplificada,
  niveisDeTrilhasExtras,
  aprimoramentoDeOrigemAtual,
  classeEhMundana,
  NEX_AUMENTO_ATRIBUTO,
  ESTAGIO_MAX,
  rotuloNivel,
  niveisDaClasse,
  trilhaLiberada,
  pendenciaDeTrilha,
  calcPvMax,
  calcPeMax,
  calcSanMax,
  calcPePorTurno,
  calcDefesa,
  calcDtRituais,
  calcCargaMax,
  calcCargaAtual,
  getPatente,
  bonusPoderesPorPericia,
  bonusLabel,
  periciasTreinadasDaOrigem,
  getIconeRecurso
} from './original-system.js';
import { ELEMENT_COLORS } from './original-compendium.js';

import { safe, rich } from './original-text.js';

function originalIcon(name, size = 16) {
  const paths = {
    sword: '<path d="M14.5 4l5.5 5.5-11 11H3.5v-5.5l11-11z"/><path d="M13 5.5l5.5 5.5"/><path d="M3.5 20.5l4-4"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    bag: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    skull: '<circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M8 20v2h8v-2"/><path d="M12.5 2a7.5 7.5 0 0 0-7.5 7.5c0 2.6 1.4 4.8 3.5 6.1V18h8v-2.4c2.1-1.3 3.5-3.5 3.5-6.1A7.5 7.5 0 0 0 12.5 2z"/>',
    brain: '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2Z"/>',
    d20: '<path d="m12 2 8 4.5v11L12 22l-8-4.5v-11L12 2Z"/><path d="M12 22V12M12 2v10M20 6.5 12 12 4 6.5M20 17.5 12 12 4 17.5"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    info: '<circle cx="12" cy="12" r="8"/><path d="M12 11v5M12 8h.01"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-5 4 4 2-2 5 4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    lock: '<rect class="lock-body" x="4" y="11" width="16" height="11" rx="2"/><path class="lock-shackle" d="M7 11V7a5 5 0 0 1 10 0v4"/><path class="lock-keyhole" d="M12 15v2.5"/>',
    sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`;
}

export function renderTraditionalOriginal(state, editMode, options = {}) {
  const { currentRight = 'habilidades', filterQuery = '', safeUrl, renderBackgroundLayer, accent = '#e0150d' } = options;
  const bgIsVideo = !!(state.backgroundImage && state.backgroundImage.startsWith('data:video/'));

  const classe = classeAtual(state);
  const nex = Number(state.nex) || 0;
  const estagio = estagioAtual(state);
  const passos = passosNex(state);
  const origem = origemAtual(state);
  const trilha = trilhaAtual(state);
  const trilhaSec = trilhaSecundariaAtual(state);
  const patente = getPatente(state);
  const defesa = calcDefesa(state);
  const pePorTurno = calcPePorTurno(state);
  const dtRituais = calcDtRituais(state);
  const cargaMax = calcCargaMax(state);
  const cargaAtual = calcCargaAtual(state);
  const bonusPoderes = bonusPoderesPorPericia(state);
  const treinadasOrigem = periciasTreinadasDaOrigem(state);

  const pvMax = calcPvMax(state);
  const peMax = calcPeMax(state);
  const sanMax = calcSanMax(state);

  const pvAtual = Math.min(Number(state.pv ?? pvMax), pvMax);
  const peAtual = Math.min(Number(state.pe ?? peMax), peMax);
  const sanAtual = Math.min(Number(state.san ?? sanMax), sanMax);

  const pvPct = pvMax > 0 ? Math.max(0, Math.min(100, (pvAtual / pvMax) * 100)) : 0;
  const pePct = peMax > 0 ? Math.max(0, Math.min(100, (peAtual / peMax) * 100)) : 0;
  const sanPct = sanMax > 0 ? Math.max(0, Math.min(100, (sanAtual / sanMax) * 100)) : 0;

  const mundana = classeEhMundana(classe);

  const iconPv = getIconeRecurso('pv', pvAtual, pvMax);
  const iconPe = getIconeRecurso('pe', peAtual, peMax);
  const iconSan = getIconeRecurso('san', sanAtual, sanMax);

  const classesList = Object.keys(CLASSES).map(k => ({ id: k, nome: CLASSES[k].nome }));
  const origensList = ORIGENS.map(o => ({ id: o.id, nome: o.nome }));
  const trilhasList = (classe.trilhas || []).map(t => ({ id: t.id, nome: t.nome }));

  return `
    <main class="traditional-dossier-page original-system-dossier ${bgIsVideo ? 'has-video-bg' : ''}" style="--bg-blur:${state.backgroundBlur ?? 0}px;--bg-zoom:${(state.backgroundZoom ?? 100) / 100};">
      ${renderBackgroundLayer ? renderBackgroundLayer(bgIsVideo, false) : ''}

      <!-- CABEÇALHO DO AGENTE (DOSSIÊ CANÔNICO) -->
      <header class="dossier-hero original-hero">
        <div class="dossier-photo-col">
          <div class="dossier-photo-card ${state.tokenImage ? 'has-token' : ''}">
            <div class="dossier-photo-inner" ${state.tokenImage ? `style="background-image:url('${safeUrl(state.tokenImage)}')"` : ''}>
              ${state.tokenImage ? '' : `<div class="dossier-photo-ph">${originalIcon('user', 42)}<span>FOTO DO AGENTE</span></div>`}
            </div>
            ${editMode ? `<label class="dossier-upload-btn">${originalIcon('image', 14)} TROCAR FOTO<input id="token-upload" type="file" accept="image/*"></label>` : ''}
          </div>
        </div>

        <div class="dossier-info-col">
          <div class="dossier-meta-row">
            <span class="dossier-profile-pill original-system-pill">ORDEM PARANORMAL RPG · d20</span>
            <span class="dossier-meta-file">PATENTE: <b>${safe(patente)}</b></span>
            <button type="button" class="btn-open-compendium" data-open-compendium>COMPÊNDIO</button>
            ${editMode ? `
              <label class="dossier-chip" title="Cor tema da ficha">TEMA<input type="color" data-theme-color value="${safe(accent)}"></label>
              ${state.themeColor ? '<button type="button" class="dossier-chip-btn" data-reset-theme-color title="Voltar à cor da classe">CLASSE</button>' : ''}
            ` : ''}
          </div>

          <div class="dossier-name-row">
            ${editMode
              ? `<input class="dossier-name-input" data-original-field="name" value="${safe(state.name)}" placeholder="NOME DO AGENTE">`
              : `<h1 class="dossier-name-display">${safe(state.name || 'AGENTE SEM NOME')}</h1>`
            }
          </div>

          <div class="dossier-creds-row original-creds-grid">
            <div class="dossier-field">
              <small>CLASSE</small>
              <select data-original-field="classeId" ${editMode ? '' : 'disabled'} class="original-select">
                ${classesList.map(c => `<option value="${c.id}" ${c.id === state.classeId ? 'selected' : ''}>${c.nome}</option>`).join('')}
              </select>
            </div>
            <div class="dossier-field">
              <small>ORIGEM</small>
              <select data-original-field="origemId" ${editMode ? '' : 'disabled'} class="original-select">
                ${origensList.map(o => `<option value="${o.id}" ${o.id === state.origemId ? 'selected' : ''}>${o.nome}</option>`).join('')}
              </select>
            </div>
            <div class="dossier-field">
              <small>TRILHA</small>
              ${trilhaLiberada(state) ? `
              <select data-original-field="trilhaId" ${editMode ? '' : 'disabled'} class="original-select">
                ${trilhasList.map(t => `<option value="${t.id}" ${t.id === state.trilhaId ? 'selected' : ''}>${t.nome}</option>`).join('')}
              </select>` : `
              <select data-original-field="trilhaId" disabled class="original-select" title="A trilha ainda não pode ser escolhida">
                <option value="${safe(state.trilhaId || '')}" selected>${mundana ? '— a partir do Estágio 2 —' : '— a partir de NEX 10% —'}</option>
              </select>`}
            </div>
            ${renderNexTrack(state, editMode)}
          </div>

          <!-- SUB-BARRA DE COMBATE DERIVADO -->
          <div class="original-derived-bar">
            <div class="derived-stat-box" title="Defesa básica (10 + Agilidade + Outros)">
              <small>DEFESA</small>
              <b>${defesa}</b>
              ${editMode ? `<span class="defesa-edit-extra">+ OUTROS <input type="number" data-original-field="defesaOutros" value="${state.defesaOutros || 0}"></span>` : ''}
            </div>
            <div class="derived-stat-box" title="Limite de PE por turno">
              <small>PE / TURNO</small>
              <b>${pePorTurno}</b>
            </div>
            <div class="derived-stat-box" title="Dificuldade do Teste para resistir aos seus rituais">
              <small>DT RITUAIS</small>
              <b>${dtRituais}</b>
            </div>
            <div class="derived-stat-box" title="Deslocamento">
              <small>DESLOCAMENTO</small>
              <input type="text" data-original-field="deslocamento" value="${safe(state.deslocamento || '9m (6q)')}" ${editMode ? '' : 'readonly'}>
            </div>
          </div>
        </div>

        <!-- MONITORES VITAIS: PV, SAN E PE -->
        <div class="dossier-vitals-col original-vitals-col">
          <div class="dossier-vitals-header">
            <span>MONITORES VITAIS</span>
            <i class="vitals-pulse"></i>
          </div>

          <div class="original-vitals-bars">
            <!-- VIDA (PV) -->
            <div class="original-resource-card resource-pv">
              <div class="res-head">
                <div class="res-badge">
                  <span class="res-sigil-tag pv">PV</span>
                  <strong>VIDA</strong>
                </div>
                <div class="res-vals-and-actions">
                  <div class="res-vals">
                    <input type="number" class="res-input-current" data-res-adjust="pv" value="${pvAtual}" title="PV Atual">
                    <span class="res-sep">/</span>
                    <span class="res-max">${pvMax}</span>
                    ${state.pvTemp ? `<button type="button" class="temp-badge-btn" data-consume-temp="pv:1" title="Clique para consumir 1 PV Temporário"><em>+${state.pvTemp}</em></button>` : ''}
                  </div>
                  <div class="res-step-group">
                    <button type="button" class="btn-res-step minus" data-res-delta="pv:-1" title="Reduzir 1 PV">−</button>
                    <button type="button" class="btn-res-step plus" data-res-delta="pv:1" title="Aumentar 1 PV">+</button>
                  </div>
                </div>
              </div>
              <div class="res-track">
                <div class="res-fill" style="width:${pvPct}%;"></div>
              </div>
              ${editMode ? `
                <div class="res-edit-row">
                  <label class="temp-label">TEMP: <input type="number" data-original-field="pvTemp" value="${state.pvTemp || 0}"></label>
                </div>
              ` : ''}
            </div>

            <!-- SANIDADE (SAN) -->
            <div class="original-resource-card resource-san">
              <div class="res-head">
                <div class="res-badge">
                  <span class="res-sigil-tag san">SAN</span>
                  <strong>SANIDADE</strong>
                </div>
                <div class="res-vals-and-actions">
                  <div class="res-vals">
                    <input type="number" class="res-input-current" data-res-adjust="san" value="${sanAtual}" title="SAN Atual">
                    <span class="res-sep">/</span>
                    <span class="res-max">${sanMax}</span>
                    ${state.sanTemp ? `<button type="button" class="temp-badge-btn" data-consume-temp="san:1" title="Clique para consumir 1 SAN Temporária"><em>+${state.sanTemp}</em></button>` : ''}
                  </div>
                  <div class="res-step-group">
                    <button type="button" class="btn-res-step minus" data-res-delta="san:-1" title="Reduzir 1 SAN">−</button>
                    <button type="button" class="btn-res-step plus" data-res-delta="san:1" title="Aumentar 1 SAN">+</button>
                  </div>
                </div>
              </div>
              <div class="res-track">
                <div class="res-fill" style="width:${sanPct}%;"></div>
              </div>
              ${editMode ? `
                <div class="res-edit-row">
                  <label class="temp-label">TEMP: <input type="number" data-original-field="sanTemp" value="${state.sanTemp || 0}"></label>
                </div>
              ` : ''}
            </div>

            <!-- ESFORÇO (PE) -->
            <div class="original-resource-card resource-pe">
              <div class="res-head">
                <div class="res-badge">
                  <span class="res-sigil-tag pe">PE</span>
                  <strong>ESFORÇO</strong>
                </div>
                <div class="res-vals-and-actions">
                  <div class="res-vals">
                    <input type="number" class="res-input-current" data-res-adjust="pe" value="${peAtual}" title="PE Atual">
                    <span class="res-sep">/</span>
                    <span class="res-max">${peMax}</span>
                    ${state.peTemp ? `<button type="button" class="temp-badge-btn" data-consume-temp="pe:1" title="Clique para consumir 1 PE Temporário"><em>+${state.peTemp}</em></button>` : ''}
                  </div>
                  <div class="res-step-group">
                    <button type="button" class="btn-res-step minus" data-res-delta="pe:-1" title="Reduzir 1 PE">−</button>
                    <button type="button" class="btn-res-step plus" data-res-delta="pe:1" title="Aumentar 1 PE">+</button>
                  </div>
                </div>
              </div>
              <div class="res-track">
                <div class="res-fill" style="width:${pePct}%;"></div>
              </div>
              ${editMode ? `
                <div class="res-edit-row">
                  <label class="temp-label">TEMP: <input type="number" data-original-field="peTemp" value="${state.peTemp || 0}"></label>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </header>

      <!-- CORPO PRINCIPAL -->
      <div class="dossier-body original-body">
        <section class="dossier-main-col">
          <!-- SEÇÃO I: ATRIBUTOS (PENTÁGONO) -->
          <div class="dossier-block original-attr-block">
            <div class="dossier-block-header">
              <span class="block-tag">SEÇÃO I</span>
              <h2>PENTÁGONO DE ATRIBUTOS (D20)</h2>
              <small class="header-hint">Clique no valor para rolar dados de Atributo</small>
            </div>

            <div class="original-attr-cluster-wrapper">
              <div class="attr-cluster">
                <img src="./assets/original/attributes.png" alt="Pentágono de Atributos" class="attr-imagem" draggable="false">

                <!-- AGI -->
                <div class="attr-item attr-item-agi">
                  ${editMode ? `<button type="button" class="attr-btn" data-attr-step="agi:-1">◀</button>` : ''}
                  <button type="button" class="attr-roll-btn" data-original-roll-attr="agi" title="Rolar Agilidade (${state.atributos.agi}d20)">
                    <span class="attr-val-display">${state.atributos.agi}</span>
                  </button>
                  ${editMode ? `<button type="button" class="attr-btn" data-attr-step="agi:1">▶</button>` : ''}
                </div>

                <!-- FOR -->
                <div class="attr-item attr-item-for">
                  ${editMode ? `<button type="button" class="attr-btn" data-attr-step="for:-1">◀</button>` : ''}
                  <button type="button" class="attr-roll-btn" data-original-roll-attr="for" title="Rolar Força (${state.atributos.for}d20)">
                    <span class="attr-val-display">${state.atributos.for}</span>
                  </button>
                  ${editMode ? `<button type="button" class="attr-btn" data-attr-step="for:1">▶</button>` : ''}
                </div>

                <!-- INT -->
                <div class="attr-item attr-item-int">
                  ${editMode ? `<button type="button" class="attr-btn" data-attr-step="int:-1">◀</button>` : ''}
                  <button type="button" class="attr-roll-btn" data-original-roll-attr="int" title="Rolar Intelecto (${state.atributos.int}d20)">
                    <span class="attr-val-display">${state.atributos.int}</span>
                  </button>
                  ${editMode ? `<button type="button" class="attr-btn" data-attr-step="int:1">▶</button>` : ''}
                </div>

                <!-- PRE -->
                <div class="attr-item attr-item-pre">
                  ${editMode ? `<button type="button" class="attr-btn" data-attr-step="pre:-1">◀</button>` : ''}
                  <button type="button" class="attr-roll-btn" data-original-roll-attr="pre" title="Rolar Presença (${state.atributos.pre}d20)">
                    <span class="attr-val-display">${state.atributos.pre}</span>
                  </button>
                  ${editMode ? `<button type="button" class="attr-btn" data-attr-step="pre:1">▶</button>` : ''}
                </div>

                <!-- VIG -->
                <div class="attr-item attr-item-vig">
                  ${editMode ? `<button type="button" class="attr-btn" data-attr-step="vig:-1">◀</button>` : ''}
                  <button type="button" class="attr-roll-btn" data-original-roll-attr="vig" title="Rolar Vigor (${state.atributos.vig}d20)">
                    <span class="attr-val-display">${state.atributos.vig}</span>
                  </button>
                  ${editMode ? `<button type="button" class="attr-btn" data-attr-step="vig:1">▶</button>` : ''}
                </div>
              </div>
            </div>
          </div>

          <!-- SEÇÃO II: PERÍCIAS (28 PERÍCIAS CLÁSSICAS) -->
          <div class="dossier-block original-skills-block">
            <div class="dossier-block-header">
              <span class="block-tag">SEÇÃO II</span>
              <h2>REGISTRO DE PERÍCIAS (28)</h2>
              <div class="skills-filter-wrap">
                <input type="text" id="filter-original-skills" placeholder="Filtrar perícia..." value="${safe(filterQuery)}">
              </div>
            </div>

            <div class="original-skills-table">
              <header class="original-skills-head">
                <span class="col-nome">PERÍCIA</span>
                <span class="col-treino">TREINAMENTO</span>
                <span class="col-attr">ATRIBUTO</span>
                <span class="col-extra">EXTRA</span>
                <span class="col-total">TOTAL</span>
                <span class="col-action">ROLAR</span>
              </header>

              <div class="original-skills-body">
                ${PERICIAS
                  .filter(p => !filterQuery || p.nome.toLowerCase().includes(filterQuery.toLowerCase()))
                  .map(p => {
                    const st = state.pericias?.[p.id] || { treino: 0, extra: 0 };
                    const treinoValor = Number(st.treino || 0);
                    const attrVal = Number(state.atributos?.[p.atributo] ?? 1);
                    const bonusPoder = bonusPoderes[p.id] || 0;
                    const total = treinoValor + Number(st.extra || 0) + bonusPoder;
                    const isOrigem = treinadasOrigem.includes(p.id);
                    const treinoAtual = TREINOS_ORIGINAL.find(t => t.valor === treinoValor) || TREINOS_ORIGINAL[0];
                    const isTrained = treinoValor > 0;
                    const treinoClass = treinoValor === 15 ? 'expert' : (treinoValor === 10 ? 'veterano' : (treinoValor === 5 ? 'treinado' : 'destreinado'));

                    return `
                      <div class="original-skill-row ${isTrained ? 'is-trained' : 'is-untrained'} treino-${treinoClass}" data-original-pericia="${p.id}">
                        <div class="col-nome">
                          <span class="skill-title">${p.nome}</span>
                          ${isOrigem ? `<span class="badge-origem" title="Treinada por Origem">ORIGEM</span>` : ''}
                          ${p.somementeTreinado ? `<span class="badge-somente-treinado" title="Somente Treinada">TREINADA</span>` : ''}
                        </div>

                        <div class="col-treino">
                          ${editMode ? `
                            <button type="button" class="btn-treino-badge treino-${treinoClass}" data-cycle-treino="${p.id}" title="Alternar Treinamento (+0 ➔ +5 ➔ +10 ➔ +15)">
                              <img src="${treinoAtual.icone}" alt="${treinoAtual.nome}" class="treino-mini-icon">
                              <span class="treino-badge-name">${treinoAtual.nome.toUpperCase()}</span>
                              <small class="treino-badge-val">+${treinoAtual.valor}</small>
                            </button>
                            <select data-skill-treino="${p.id}" class="skill-treino-select">
                              ${TREINOS_ORIGINAL.map(t => `<option value="${t.valor}" ${t.valor === treinoValor ? 'selected' : ''}>${t.nome} (+${t.valor})</option>`).join('')}
                            </select>
                          ` : `
                            <span class="treino-badge-static treino-${treinoClass}">
                              <img src="${treinoAtual.icone}" alt="${treinoAtual.nome}" class="treino-mini-icon">
                              <span class="treino-badge-name">${treinoAtual.nome.toUpperCase()}</span>
                              <small class="treino-badge-val">+${treinoAtual.valor}</small>
                            </span>
                          `}
                        </div>

                        <div class="col-attr">
                          <span class="attr-ref-tag">${p.atributo.toUpperCase()} (${attrVal}d20)</span>
                        </div>

                        <div class="col-extra">
                          ${editMode
                            ? `<input type="number" data-skill-extra="${p.id}" value="${st.extra || 0}" class="extra-input">`
                            : `<span>${st.extra ? (st.extra > 0 ? `+${st.extra}` : st.extra) : '0'}</span>`
                          }
                        </div>

                        <div class="col-total">
                          <strong class="total-val">${total >= 0 ? `+${total}` : total}</strong>
                        </div>

                        <div class="col-action">
                          <button type="button" class="btn-roll-original-skill" data-roll-skill="${p.id}" title="Rolar ${p.nome} (${attrVal}d20 + ${total})">
                            ${originalIcon('d20', 14)} <span>ROLAR</span>
                          </button>
                        </div>
                      </div>
                    `;
                  }).join('')}
              </div>
            </div>
          </div>
        </section>

        <!-- COLUNA LATERAL DE ABAS -->
        <aside class="dossier-side-col original-side-col">
          <div class="dossier-tabs-nav right-tabs">
            <button type="button" class="dossier-tab-btn ${currentRight === 'habilidades' ? 'active' : ''}" data-original-tab="habilidades">HABILIDADES</button>
            <button type="button" class="dossier-tab-btn ${currentRight === 'rituais' ? 'active' : ''}" data-original-tab="rituais">RITUAIS (${state.rituaisConhecidos?.length || 0})</button>
            <button type="button" class="dossier-tab-btn ${currentRight === 'combate' ? 'active' : ''}" data-original-tab="combate">COMBATE</button>
            <button type="button" class="dossier-tab-btn ${currentRight === 'inventario' ? 'active' : ''}" data-original-tab="inventario">INVENTÁRIO (${cargaAtual}/${cargaMax})</button>
            <button type="button" class="dossier-tab-btn ${currentRight === 'historia' ? 'active' : ''}" data-original-tab="historia">HISTÓRIA</button>
          </div>

          <!-- ABA: HABILIDADES -->
          <section id="tab-habilidades" class="right-content ${currentRight === 'habilidades' ? 'active' : ''}">
            <div class="original-section-group">
              <h3>PODER DE ORIGEM: ${safe(origem.nome)}</h3>
              <div class="original-card origin-card">
                <div class="card-head">
                  <strong>${safe(origem.poder?.nome || 'Habilidade de Origem')}</strong>
                  ${origem.poder?.bonus ? `<span class="badge-bonus">✦ ${rich(bonusLabel(state, origem.poder.bonus))}</span>` : ''}
                </div>
                <p class="card-desc">${rich(origem.poder?.descricao || origem.descricao || '')}</p>
              </div>
              ${originExtraCards(state, origem)}

              <h3 style="margin-top:16px;">HABILIDADES DE CLASSE</h3>
              ${renderProgressionList(state, editMode)}

              <h3 style="margin-top:16px;">TRILHAS</h3>
              ${renderTrilhas(state, editMode)}

              <h3 style="margin-top:16px;">PODERES ESCOLHIDOS</h3>
              <div class="card-list">
                ${chosenPowerCards(state, true, '<p class="empty-cards">Nenhum poder escolhido ainda.</p>')}
              </div>
              ${pickerButton('poderes', 'ADICIONAR PODER')}

              <h3 style="margin-top:16px;">PODERES PARANORMAIS</h3>
              <div class="card-list">
                ${(state.poderesParanormais || []).map((p, i) => `
                  <div class="original-card paranormal-card" style="border-left: 3px solid ${ELEMENT_COLORS[p.elemento] || '#e0150d'}">
                    <div class="card-head">
                      <strong>${safe(p.nome)} <small>(${safe(p.elemento)})</small></strong>
                      <button type="button" class="btn-remove-item" data-remove-paranormal="${i}">${originalIcon('trash', 13)}</button>
                    </div>
                    <p class="card-desc">${rich(p.descricao)}</p>
                  </div>
                `).join('') || '<p class="empty-cards">Nenhum poder paranormal aprendido.</p>'}
              </div>
              ${pickerButton('paranormais', 'ADICIONAR PODER PARANORMAL')}
            </div>
          </section>

          <!-- ABA: RITUAIS -->
          <section id="tab-rituais" class="right-content ${currentRight === 'rituais' ? 'active' : ''}">
            <div class="original-section-group">
              <div class="rituals-header-bar">
                <div class="rituals-dt-pill">
                  <small>DT DE RESISTÊNCIA</small>
                  <b>${dtRituais}</b>
                </div>
                <div class="rituals-header-actions">
                  <button type="button" class="btn-learn-ritual btn-ghost" data-open-compendium="rituais">COMPÊNDIO</button>
                  <button type="button" class="btn-learn-ritual" data-open-compendium="rituais" data-compendium-pick>+ APRENDER RITUAL</button>
                </div>
              </div>

              <div class="card-list rituals-card-list">
                ${(state.rituaisConhecidos || []).map(rId => {
                  const ritual = RITUAIS.find(r => r.id === rId);
                  if (!ritual) return '';
                  const color = ELEMENT_COLORS[ritual.elemento] || '#fff';
                  return `
                    <div class="original-card ritual-card" style="border-left: 3px solid ${color};">
                      <div class="card-head">
                        <div class="ritual-title-group">
                          <span class="ritual-circle-badge" style="background:${color}22;color:${color}">${ritual.circulo}º CÍRCULO</span>
                          <strong style="color:${color}">${safe(ritual.nome)}</strong>
                          <span class="ritual-element-tag">${safe(ritual.elemento)}</span>
                        </div>
                        <button type="button" class="btn-remove-item" data-remove-ritual="${ritual.id}">${originalIcon('trash', 13)}</button>
                      </div>
                      <div class="ritual-meta-grid">
                        <div><small>EXECUÇÃO</small><span>${safe(ritual.execucao || 'Padrão')}</span></div>
                        <div><small>ALCANCE</small><span>${safe(ritual.alcance || 'Curto')}</span></div>
                        <div><small>DURAÇÃO</small><span>${safe(ritual.duracao || 'Instantânea')}</span></div>
                        <div><small>RESISTÊNCIA</small><span>${safe(ritual.resistencia || 'Nenhuma')}</span></div>
                      </div>
                      <p class="card-desc">${rich(ritual.descricao)}</p>
                      <div class="card-foot">
                        <button type="button" class="btn-cast-ritual" data-cast-ritual="${ritual.id}" data-ritual-cost="${ritual.custoPE}">
                          ${originalIcon('flame', 14)} CONJURAR (${ritual.custoPE} PE)
                        </button>
                      </div>
                    </div>
                  `;
                }).join('') || '<p class="empty-cards">Nenhum ritual aprendido. Escolha no menu acima para aprender.</p>'}
              </div>
            </div>
          </section>

          <!-- ABA: COMBATE -->
          <section id="tab-combate" class="right-content ${currentRight === 'combate' ? 'active' : ''}">
            <div class="original-section-group">
              <div class="powers-header-row">
                <h3>ARMAS & ATAQUES</h3>
                <button type="button" class="btn-add-power" id="btn-add-attack">+ ADICIONAR ATAQUE</button>
              </div>

              <div class="card-list">
                ${(state.ataques || []).map((atk, idx) => `
                  <div class="original-card attack-card">
                    <div class="card-head">
                      <div class="attack-title-col">
                        ${editMode
                          ? `<input type="text" class="card-inline-input" data-attack-field="${idx}:nome" value="${safe(atk.nome)}" placeholder="Nome da Arma">`
                          : `<strong>${safe(atk.nome || 'Ataque')}</strong>`
                        }
                      </div>
                      <button type="button" class="btn-remove-item" data-remove-attack="${idx}">${originalIcon('trash', 13)}</button>
                    </div>

                    <div class="attack-stats-row">
                      <div class="stat-cell">
                        <small>TESTE</small>
                        <input type="text" data-attack-field="${idx}:ataque" value="${safe(atk.ataque || '3d20+5')}" placeholder="ex: 3d20+5" ${editMode ? '' : 'readonly'}>
                      </div>
                      <div class="stat-cell">
                        <small>DANO</small>
                        <input type="text" data-attack-field="${idx}:dano" value="${safe(atk.dano || '1d8+2')}" placeholder="ex: 1d8+2" ${editMode ? '' : 'readonly'}>
                      </div>
                      <div class="stat-cell">
                        <small>CRÍTICO</small>
                        <input type="text" data-attack-field="${idx}:critico" value="${safe(atk.critico || '19/x2')}" placeholder="ex: 19/x2" ${editMode ? '' : 'readonly'}>
                      </div>
                    </div>

                    <div class="attack-roll-buttons">
                      <button type="button" class="btn-roll-atk" data-roll-attack="${idx}">
                        ${originalIcon('sword', 14)} ATACAR
                      </button>
                      <button type="button" class="btn-roll-dmg" data-roll-damage="${idx}">
                        ${originalIcon('d20', 14)} DANO (${safe(atk.dano || '1d8')})
                      </button>
                    </div>
                  </div>
                `).join('') || '<p class="empty-cards">Nenhuma arma cadastrada. Clique em "+ ADICIONAR ATAQUE" para cadastrar.</p>'}
              </div>
            </div>
          </section>

          <!-- ABA: INVENTÁRIO -->
          <section id="tab-inventario" class="right-content ${currentRight === 'inventario' ? 'active' : ''}">
            <div class="original-section-group">
              <div class="inventory-capacity-bar ${cargaAtual > cargaMax ? 'overloaded' : ''}">
                <div class="inv-cap-info">
                  <span>CARGA TOTAL</span>
                  <b>${cargaAtual} / ${cargaMax} ESPAÇOS</b>
                </div>
                <button type="button" class="btn-add-power" id="btn-add-inventory-item">+ ADICIONAR ITEM</button>
              </div>

              <div class="card-list">
                ${(state.inventario || []).map((it, idx) => `
                  <div class="original-card inventory-card">
                    <div class="card-head">
                      <div class="inv-head-title">
                        ${editMode
                          ? `<input type="text" class="card-inline-input" data-inv-field="${idx}:nome" value="${safe(it.nome)}" placeholder="Nome do item">`
                          : `<strong>${safe(it.nome || 'Item')}</strong>`
                        }
                      </div>
                      <button type="button" class="btn-remove-item" data-remove-inventory="${idx}">${originalIcon('trash', 13)}</button>
                    </div>

                    <div class="inv-meta-row">
                      <label>ESPAÇOS: <input type="number" min="0" data-inv-field="${idx}:espaco" value="${it.espaco ?? 1}" ${editMode ? '' : 'readonly'}></label>
                      <label>QUANTIDADE: <input type="number" min="1" data-inv-field="${idx}:qtd" value="${it.qtd ?? 1}" ${editMode ? '' : 'readonly'}></label>
                      <label>CATEGORIA:
                        <select data-inv-field="${idx}:categoria" ${editMode ? '' : 'disabled'}>
                          <option value="0" ${it.categoria === '0' ? 'selected' : ''}>0</option>
                          <option value="I" ${it.categoria === 'I' ? 'selected' : ''}>I</option>
                          <option value="II" ${it.categoria === 'II' ? 'selected' : ''}>II</option>
                          <option value="III" ${it.categoria === 'III' ? 'selected' : ''}>III</option>
                          <option value="IV" ${it.categoria === 'IV' ? 'selected' : ''}>IV</option>
                        </select>
                      </label>
                    </div>

                    <textarea data-inv-field="${idx}:descricao" placeholder="Descrição do item..." ${editMode ? '' : 'readonly'} class="inv-desc-input">${safe(it.descricao || '')}</textarea>
                  </div>
                `).join('') || '<p class="empty-cards">Inventário vazio. Clique em "+ ADICIONAR ITEM" para registrar equipamentos.</p>'}
              </div>
            </div>
          </section>

          <!-- ABA: HISTÓRIA -->
          <section id="tab-historia" class="right-content ${currentRight === 'historia' ? 'active' : ''}">
            <div class="dossier-history-card">
              <div class="dossier-history-head">
                <span>RELATÓRIO DE ANTECEDENTES & INVESTIGAÇÕES</span>
              </div>
              <textarea data-original-field="history" placeholder="Histórico, anotações e contatos do agente..." ${editMode ? '' : 'readonly'}>${safe(state.history || '')}</textarea>
            </div>
          </section>
        </aside>
      </div>
    </main>
  `;
}

// Trilho de NEX (ou de estágios, para sobreviventes): um segmento por nível,
// com os níveis de habilidade de trilha em destaque. Sobe-se um nível por vez
// nos botões − / +, ou clicando direto no segmento desejado.
function renderNexTrack(state, editMode) {
  const classe = classeAtual(state);
  const mundana = classeEhMundana(classe);
  const nex = Number(state.nex) || 0;
  const niveis = niveisDaClasse(state);
  const idx = Math.max(0, niveis.indexOf(nex));
  const ganho = n => (classe.tabelaNex || []).find(item => item.nex === n)?.texto || '';
  const marcos = new Set((classe.tabelaNex || []).filter(item => /trilha/i.test(item.texto)).map(item => item.nex));
  const proximo = niveis[idx + 1];
  const passo = (delta, rotulo, simbolo) => editMode
    ? `<button type="button" class="nex-step-btn" data-nex-step="${delta}" aria-label="${rotulo}" ${niveis[idx + delta] === undefined ? 'disabled' : ''}>${simbolo}</button>`
    : '';
  return `
    <div class="dossier-field field-nex-control ${editMode ? 'is-editing' : ''}">
      <div class="nex-readout">
        <small>${mundana ? 'ESTÁGIO' : 'NEX · NÍVEL DE EXPOSIÇÃO'}</small>
        <div class="nex-stepper">
          ${passo(-1, 'Descer um nível', '−')}
          <b class="nex-value">${mundana ? `${idx + 1}<i>/${niveis.length}</i>` : `${nex}<i>%</i>`}</b>
          ${passo(1, 'Subir um nível', '+')}
        </div>
      </div>
      <div class="nex-track-wrap">
        <div class="nex-track" style="--nex-segs:${niveis.length}">
          ${niveis.map((n, i) => {
            const cls = `nex-seg ${i < idx ? 'filled' : ''} ${i === idx ? 'current' : ''} ${marcos.has(n) ? 'marco' : ''}`;
            const dica = safe(`${rotuloNivel(state, n)}${ganho(n) ? ` — ${ganho(n).replace(/([+–−-])(O+)(?![A-Za-zÀ-ú0-9])/g, (_, sinal, dados) => `${sinal}${dados.length}d20`)}` : ''}`);
            return editMode
              ? `<button type="button" class="${cls}" data-nex-set="${n}" title="${dica}" aria-label="${dica}"></button>`
              : `<span class="${cls}" title="${dica}"></span>`;
          }).join('')}
        </div>
        <p class="nex-next">${proximo === undefined
          ? 'NÍVEL MÁXIMO'
          : `PRÓXIMO <b>${safe(rotuloNivel(state, proximo).toUpperCase())}</b> ${rich(ganho(proximo))}`}</p>
      </div>
    </div>`;
}

// Botão que abre o Compêndio em modo escolha, já na aba certa.
function pickerButton(tab, label) {
  return `<button type="button" class="btn-open-picker" data-open-compendium="${tab}" data-compendium-pick>${originalIcon('plus', 13)} ${label}</button>`;
}

function chosenPowerCards(state, canRemove, emptyNote) {
  return (state.poderesEscolhidos || []).map((p, i) => `
    <div class="original-card chosen-power-card">
      <div class="card-head">
        <strong>${safe(p.nome)}</strong>
        ${canRemove ? `<button type="button" class="btn-remove-item" data-remove-chosen-power="${i}">${originalIcon('trash', 13)}</button>` : ''}
      </div>
      ${p.origemTipo ? `<span class="card-meta">${safe(p.origemTipo)}</span>` : ''}
      ${p.preRequisito ? `<span class="card-meta card-prereq">Pré-requisito: ${safe(p.preRequisito)}</span>` : ''}
      ${p.bonus ? `<span class="badge-bonus">✦ ${rich(bonusLabel(state, p.bonus))}</span>` : ''}
      <p class="card-desc">${rich(p.descricao)}</p>
    </div>
  `).join('') || emptyNote;
}

// Habilidades de origem adicionais e, se a ficha tiver o poder de classe
// "Aprimoramento de Origem", o aprimoramento da origem (homebrew).
function originExtraCards(state, origem) {
  const extras = (origem.poderesExtras || []).map(p => `
    <div class="original-card origin-card" style="margin-top:8px;">
      <div class="card-head">
        <strong>${safe(p.nome)}</strong>
      </div>
      ${p.alternativa ? `<span class="card-meta">Alternativa a ${safe(origem.poder?.nome || 'poder de origem')} — escolha um dos dois</span>` : ''}
      <p class="card-desc">${rich(p.descricao)}</p>
    </div>
  `).join('');
  const ap = aprimoramentoDeOrigemAtual(state);
  if (!ap) return extras;
  const per = PERICIAS.find(p => p.id === ap.pericia);
  return extras + `
    <div class="original-card origin-card" style="margin-top:8px;">
      <div class="card-head">
        <strong>${safe(ap.poder?.nome || 'Aprimoramento de Origem')}</strong>
        <span class="badge-bonus">✦ Perícia: ${safe(per ? per.nome : ap.pericia)}</span>
      </div>
      <span class="card-meta">Aprimoramento de Origem — se já for treinado na perícia, escolha outra</span>
      ${ap.poder ? `<p class="card-desc">${rich(ap.poder.descricao)}</p>` : ''}
    </div>
  `;
}

// Pergunta feita quando o personagem chega a um NEX de habilidade de trilha:
// a trilha principal avança e o poder de classe do mesmo NEX pode virar
// Versatilidade (segunda trilha). Usada no card da aba e no pop-up.
export function renderDecisaoTrilha(state, { modal = false } = {}) {
  const p = pendenciaDeTrilha(state);
  if (!p) return '';
  const versatilidade = p.secundaria
    ? `<button type="button" class="trilha-decisao-opt" data-trilha-decisao="versatilidade">
         <b>Avançar a segunda trilha</b>
         <span>${safe(p.secundaria.nome)}${p.proximoPoderSecundaria ? ` — ${safe(p.proximoPoderSecundaria.nome)}` : ''}</span>
       </button>`
    : `<div class="trilha-decisao-opt is-select">
         <b>Começar uma segunda trilha</b>
         <label class="styled-select"><select data-trilha-decisao-select>
           ${p.opcoes.map(o => `<option value="${o.id}">${safe(o.nome)}${o.primeiroPoder ? ` — ${safe(o.primeiroPoder)}` : ''}</option>`).join('')}
         </select></label>
         <button type="button" class="trilha-decisao-confirm" data-trilha-decisao="versatilidade">ESCOLHER</button>
       </div>`;
  return `
    <div class="trilha-decisao ${modal ? 'in-modal' : 'original-card'}">
      <small>NEX ${p.tier}% · HABILIDADE DE TRILHA</small>
      <h4>O que você quer evoluir?</h4>
      <p>${p.poderPrincipal ? `Sua trilha principal (${safe(p.principal.nome)}) avançou: <b>${safe(p.poderPrincipal.nome)}</b>. ` : ''}Este NEX também dá um poder de classe, que você pode usar em <b>Versatilidade</b>.</p>
      <button type="button" class="trilha-decisao-opt" data-trilha-decisao="recusar">
        <b>Só a trilha principal</b>
        <span>Usar o poder de classe em outro poder</span>
      </button>
      ${versatilidade}
      ${modal ? `<button type="button" class="trilha-decisao-later" data-trilha-decisao="depois">Decidir depois</button>` : ''}
    </div>`;
}

// Pop-up de escolha de trilha, ao chegar em NEX 10% (ou no Estágio 2).
export function renderEscolhaDeTrilha(state) {
  const classe = classeAtual(state);
  const atual = trilhaAtual(state);
  if (!atual) return '';
  return `
    <div class="trilha-decisao in-modal">
      <small>${safe(rotuloNivel(state).toUpperCase())} · ESCOLHA DE TRILHA</small>
      <h4>Qual trilha você vai seguir?</h4>
      <label class="styled-select"><select data-trilha-inicial-select>
        ${(classe.trilhas || []).map(t => `<option value="${t.id}" ${t.id === atual.id ? 'selected' : ''}>${safe(t.nome)}</option>`).join('')}
      </select></label>
      <p data-trilha-inicial-desc>${safe(atual.descricao || '')}</p>
      <button type="button" class="trilha-decisao-confirm" data-trilha-inicial-confirm>CONFIRMAR TRILHA</button>
    </div>`;
}

// Trilha principal + trilhas extras da Versatilidade (homebrew): cada vez que
// Versatilidade é escolhida, a ficha ganha a próxima habilidade da 2ª trilha.
function renderTrilhas(state, editMode) {
  const classe = classeAtual(state);
  const itens = progressaoDeTrilhas(state);
  const principal = trilhaAtual(state);
  const niveis = niveisDeTrilhasExtras(state);
  const extras = !classeEhMundana(classe) && (temVersatilidade(state) || temVersatilidadeAmplificada(state));
  const usadas = [principal?.id, state.trilhaSecundariaId, state.trilhaTerciariaId];
  const seletor = (campo, atual, vazio) => `
    <select data-original-field="${campo}" ${editMode ? '' : 'disabled'} class="original-select">
      <option value="">${vazio}</option>
      ${(classe.trilhas || []).filter(t => t.id === atual || !usadas.includes(t.id)).map(t => `<option value="${t.id}" ${t.id === atual ? 'selected' : ''}>${safe(t.nome)}</option>`).join('')}
    </select>`;
  const cards = alvo => itens.filter(i => i.alvo === alvo).map(i => `
    <div class="original-card progression-card">
      <div class="card-head">
        <span class="nex-tag">${safe(rotuloNivel(state, i.poder.nex).toUpperCase())}</span>
        <strong>${safe(i.poder.nome)}</strong>
      </div>
      <span class="card-meta">${safe(i.trilhaObj.nome)}</span>
      <p class="card-desc">${rich(i.poder.descricao)}</p>
    </div>
  `).join('');

  const semTrilha = trilhaLiberada(state)
    ? 'Nenhuma habilidade de trilha destravada ainda.'
    : (classeEhMundana(classe) ? 'A trilha é escolhida no Estágio 2.' : 'A trilha é escolhida em NEX 10%.');
  let html = renderDecisaoTrilha(state) + `<div class="progression-cards">${cards('principal') || `<p class="empty-cards">${semTrilha}</p>`}</div>`;
  if (!extras) return html;

  html += `
    <div class="dossier-field" style="margin-top:10px;">
      <small>TRILHA SECUNDÁRIA (VERSATILIDADE) — ${niveis.secundaria} ${niveis.secundaria === 1 ? 'NÍVEL' : 'NÍVEIS'}</small>
      ${seletor('trilhaSecundariaId', state.trilhaSecundariaId, '— escolha a segunda trilha —')}
    </div>
    <div class="progression-cards">${cards('secundaria')}</div>`;
  if (temVersatilidadeAmplificada(state)) {
    html += `
    <div class="dossier-field" style="margin-top:10px;">
      <small>TERCEIRA TRILHA (VERSATILIDADE AMPLIFICADA)</small>
      ${seletor('trilhaTerciariaId', state.trilhaTerciariaId, '— nenhuma: +1 nível na trilha secundária —')}
    </div>
    ${niveis.terciaria && niveis.total > 2 ? `
    <div class="dossier-field">
      <small>NÍVEIS NA TERCEIRA TRILHA</small>
      <select data-original-field="nivelTrilhaTerciaria" ${editMode ? '' : 'disabled'} class="original-select">
        ${Array.from({ length: niveis.total - 1 }, (_, k) => k + 1).map(n => `<option value="${n}" ${n === niveis.terciaria ? 'selected' : ''}>${n}</option>`).join('')}
      </select>
    </div>` : ''}
    <div class="progression-cards">${cards('terciaria')}</div>`;
  }
  return html;
}

function renderProgressionList(state, editMode = false) {
  const classe = classeAtual(state);
  const nex = Number(state.nex) || 0;
  // Homebrew: aumento de atributo não é retroativo — informar onde foi cada
  // aumento faz PV (Vigor) e PE (Presença) contarem só dali em diante.
  const aumentoSelect = item => {
    if (classeEhMundana(classe) || !NEX_AUMENTO_ATRIBUTO.includes(item.nex) || !/aumento de atributo/i.test(item.texto)) return '';
    const atual = state.aumentosAtributo?.[item.nex] || '';
    return `
          <select data-aumento-atributo="${item.nex}" ${editMode ? '' : 'disabled'} class="original-select" title="Atributo aumentado neste NEX (PV e PE não são retroativos)">
            <option value="">Atributo: não informado</option>
            ${ATRIBUTOS.map(a => `<option value="${a.id}" ${a.id === atual ? 'selected' : ''}>+1 ${safe(a.nome)}</option>`).join('')}
          </select>`;
  };

  const list = (classe.tabelaNex || []).filter(item => item.nex <= nex);
  if (!list.length) return '<p class="empty-cards">Nenhuma habilidade destravada ainda.</p>';

  return `
    <div class="progression-cards">
      ${list.map(item => `
        <div class="original-card progression-card">
          <div class="card-head">
            <span class="nex-tag">${safe(rotuloNivel(state, item.nex).toUpperCase())}</span>
            <strong>${rich(item.texto)}</strong>
          </div>${aumentoSelect(item)}
        </div>
      `).join('')}
    </div>
  `;
}

export function renderCinematicOriginal(state, editMode, options = {}) {
  const { safeUrl, renderBackgroundLayer, presentationMode, renderPresentationDock, die, pageClass = '', accent = '#e0150d', resourceShift = 120 } = options;
  const bgIsVideo = !!(state.backgroundImage && state.backgroundImage.startsWith('data:video/'));

  const origem = origemAtual(state) || ORIGENS[0];
  const classe = classeAtual(state);
  const nex = Number(state.nex) || 0;
  const bonusPoderes = bonusPoderesPorPericia(state);
  const lockIcon = '<i class="cinematic-section-lock" title="Bloqueado no modo apresentação" aria-hidden="true">' + originalIcon('lock', 15) + '</i>';
  const isCollapsed = key => (presentationMode && (key === 'items' || key === 'history')) || !!state.cinematicCollapsed?.[key];
  const pvMax = calcPvMax(state);
  const peMax = calcPeMax(state);
  const sanMax = calcSanMax(state);

  const pvAtual = Math.min(Number(state.pv ?? pvMax), pvMax);
  const peAtual = Math.min(Number(state.pe ?? peMax), peMax);
  const sanAtual = Math.min(Number(state.san ?? sanMax), sanMax);

  return `
    <main class="cinematic-page original-cinematic ${pageClass} ${bgIsVideo ? 'has-video-bg' : ''}" style="--cinematic-accent:${accent};--resource-shift:${resourceShift}px;--bg-blur:${state.backgroundBlur ?? 0}px;--bg-zoom:${(state.backgroundZoom ?? 100) / 100};">
      ${renderBackgroundLayer ? renderBackgroundLayer(bgIsVideo, true) : ''}
      <div class="cinematic-frame"><i class="cinematic-frame-line top"><b></b><b></b></i><i class="cinematic-frame-line bottom"><b></b><b></b></i></div>

      <div class="cinematic-contents">
        <!-- HEADER CINEMATOGRÁFICO -->
        <header class="cinematic-header">
          <div class="cinematic-name">
            ${editMode ? `<input data-original-field="name" value="${safe(state.name)}">` : `<h1>${safe(state.name)}</h1>`}
          </div>
          ${editMode ? `
            <div class="cinematic-identity-read ocin-identity-edit">
              <select data-original-field="classeId" class="original-select">
                ${Object.keys(CLASSES).map(cId => `<option value="${cId}" ${cId === state.classeId ? 'selected' : ''}>${CLASSES[cId].nome}</option>`).join('')}
              </select>
              <i></i>
              ${classeEhMundana(classe) ? `
              <em>ESTÁGIO</em>
              <input type="number" data-original-field="estagio" value="${estagioAtual(state)}" min="1" max="${ESTAGIO_MAX}" step="1" inputmode="numeric">
              ` : `
              <em>NEX</em>
              <input type="number" data-original-field="nex" value="${nex}" min="5" max="99" step="5" inputmode="numeric">
              <em>%</em>`}
            </div>
          ` : `
            <div class="cinematic-identity-read ocin-identity">
              <strong>${safe(classe.nome)}</strong>
              <i></i>
              <span>${safe(origem.nome)}</span>
              <i></i>
              ${classeEhMundana(classe) ? `<em>ESTÁGIO</em>
              <b>${estagioAtual(state)}</b>` : `<em>NEX</em>
              <b>${nex}%</b>`}
            </div>
          `}
        </header>

        <!-- COLUNA ESQUERDA: ATRIBUTOS & PERÍCIAS -->
        <section class="cinematic-left original-cinematic-left">
          <div class="ocin-attributes">
            <h2><span>ATRIBUTOS</span></h2>
            <div class="ocin-attr-row ${editMode ? 'editing' : ''}">
              ${ATRIBUTOS.map(a => {
                const val = state.atributos?.[a.id] ?? 1;
                return `
                  <div class="ocin-attr">
                    <button type="button" class="ocin-attr-die" data-original-roll-attr="${a.id}" title="Rolar ${safe(a.nome || a.abrev)}">
                      <b>${val}</b>
                      <span>${a.abrev}</span>
                    </button>
                    ${editMode ? `
                      <div class="attr-stepper">
                        <button type="button" data-attr-step="${a.id}:-1">◀</button>
                        <button type="button" data-attr-step="${a.id}:1">▶</button>
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="ocin-skills">
            <h2><span>PERÍCIAS</span></h2>
            <div class="ocin-skills-grid" style="--ocin-skill-rows:${Math.ceil(PERICIAS.length / 2)}">
              ${PERICIAS.map(p => {
                const st = state.pericias?.[p.id] || { treino: 0, extra: 0 };
                const attrVal = Number(state.atributos?.[p.atributo] ?? 1);
                const treinoValor = Number(st.treino || 0);
                const total = treinoValor + Number(st.extra || 0) + (bonusPoderes[p.id] || 0);
                const treinoClass = treinoValor === 15 ? 'expert' : (treinoValor === 10 ? 'veterano' : (treinoValor === 5 ? 'treinado' : 'destreinado'));
                return `
                  <div class="ocin-skill treino-${treinoClass}" data-roll-skill="${p.id}" role="button" tabindex="0" title="${safe(p.nome)} · ${attrVal > 0 ? `${attrVal}d20` : '2d20 (menor)'} ${total >= 0 ? '+' : '−'}${Math.abs(total)}">
                    <span class="ocin-skill-name">${safe(p.nome)}</span>
                    <em class="ocin-skill-dice ${attrVal > 0 ? '' : 'pior'}"><small>${p.atributo.toUpperCase()}</small><span>${die(20, 'ocin-skill-die').repeat(attrVal > 0 ? attrVal : 2)}</span>${attrVal > 0 ? '' : '<i>▾</i>'}</em>
                    <b>${total >= 0 ? '+' : '−'}${Math.abs(total)}</b>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </section>

        <!-- CENTRO: TOKEN DO AGENTE -->
        <section class="cinematic-character" data-cinematic-character>
          ${state.tokenImage
            ? `<img src="${safeUrl(state.tokenImage)}" alt="${safe(state.name)}" draggable="false" data-cinematic-token style="left:${state.cinematicTokenX}%;top:${state.cinematicTokenY}%;--token-scale:${state.cinematicTokenScale / 100}">`
            : `<div class="cinematic-token-empty"><span>${originalIcon('user', 54)}</span><p>ADICIONE A IMAGEM DO PERSONAGEM</p></div>`
          }
          ${editMode ? `
            <div class="cinematic-token-tools">
              <label>${originalIcon('image', 15)} PERSONAGEM<input id="token-upload-cinematic" type="file" accept="image/*"></label>
              ${state.tokenImage ? `<button type="button" class="btn-upscale-token" data-upscale-token title="Super-resolução e nitidez avançada">${originalIcon('sparkles', 14)} UPSCALE 2X (HD)</button>` : ''}
              <div class="token-side-group" title="Lado da iluminação de recorte">
                <span>ILUMINAÇÃO</span>
                <button type="button" class="${(state.cinematicOutlineSide || 'left') === 'left' ? 'active' : ''}" data-outline-side="left">ESQ</button>
                <button type="button" class="${state.cinematicOutlineSide === 'right' ? 'active' : ''}" data-outline-side="right">DIR</button>
                <button type="button" class="${state.cinematicOutlineSide === 'both' ? 'active' : ''}" data-outline-side="both">360°</button>
                <button type="button" class="${state.cinematicOutlineSide === 'none' ? 'active' : ''}" data-outline-side="none">OFF</button>
              </div>
              <label title="Intensidade da iluminação">FORÇA <input type="range" min="10" max="95" step="5" value="${Math.round((state.cinematicOutlineIntensity ?? 0.5) * 100)}" data-cinematic-outline-intensity></label>
              <label title="Espessura da linha">CONTORNO <input type="range" min="0.5" max="5" step="0.2" value="${state.cinematicOutlineWidth ?? 1.8}" data-cinematic-outline-width></label>
              <label title="Fade / suavidade da borda">FADE <input type="range" min="0.5" max="3.5" step="0.2" value="${state.cinematicOutlineFade ?? 1.5}" data-cinematic-outline-fade></label>
              <label>ESCALA <input type="range" min="45" max="220" value="${state.cinematicTokenScale}" data-cinematic-scale></label>
              <button type="button" data-reset-cinematic-token>RECENTRALIZAR</button>
              <label>${originalIcon('image', 15)} FUNDO<input id="background-upload" type="file" accept="image/*,video/mp4,video/webm"></label>
              ${state.backgroundImage ? '<button type="button" data-reset-background>FUNDO PADRÃO</button>' : ''}
              <label title="Desfoque da imagem de fundo">BLUR <input type="range" min="0" max="30" step="1" value="${state.backgroundBlur ?? 0}" data-cinematic-bg-blur><span class="slider-val-hint" id="val-hint-blur">${state.backgroundBlur ?? 0}px</span></label>
              <label title="Escala / Zoom da imagem de fundo">ZOOM BG <input type="range" min="30" max="250" step="5" value="${state.backgroundZoom ?? 100}" data-cinematic-bg-zoom><span class="slider-val-hint" id="val-hint-zoom">${state.backgroundZoom ?? 100}%</span></label>
              ${(state.backgroundBlur > 0 || (state.backgroundZoom && state.backgroundZoom !== 100)) ? '<button type="button" data-reset-bg-effects title="Redefinir blur para 0 e zoom para 100%">RESET BG</button>' : ''}
              <label>COR TEMA <input type="color" data-theme-color value="${safe(accent)}"></label>
              ${state.themeColor ? '<button type="button" data-reset-theme-color>TEMA DA CLASSE</button>' : ''}
              <label>COR DOS DADOS <input id="dice-color" type="color" value="${safe(state.diceColor || accent)}"></label>
              ${state.diceColor ? '<button type="button" data-reset-dice-color>COR DA CLASSE</button>' : ''}
              <small>Arraste o personagem para reposicionar · Duplo clique nos sliders para redefinir</small>
            </div>
          ` : ''}
        </section>

        <!-- COLUNA DIREITA: RECURSOS (PV, SAN, PE) -->
        <section class="cinematic-right original-cinematic-right">
          <div class="cinematic-resources original-cin-vitals">
            <!-- PV -->
            <div class="cinematic-resource-item resource-pv" data-resource-key="pv">
              <strong>PV</strong>
              <b>${pvAtual}${state.pvTemp ? `<button type="button" class="temp-badge-btn" data-consume-temp="pv:1" title="Clique para extinguir 1 PV temporário"><em>+${state.pvTemp}</em></button>` : ''}</b>
              <div class="original-cin-bar-wrap">
                <div class="original-cin-bar-top">
                  <small>/ ${pvMax}</small>
                  <div class="cin-res-quick">
                    <button type="button" data-res-delta="pv:-1" title="-1 PV">−</button>
                    <button type="button" data-res-delta="pv:1" title="+1 PV">+</button>
                  </div>
                </div>
                <div class="cin-progress-track"><i style="width:${pvMax > 0 ? (pvAtual / pvMax) * 100 : 0}%;"></i></div>
              </div>
            </div>

            <!-- SAN -->
            <div class="cinematic-resource-item resource-san" data-resource-key="san">
              <strong>SAN</strong>
              <b>${sanAtual}${state.sanTemp ? `<button type="button" class="temp-badge-btn" data-consume-temp="san:1" title="Clique para extinguir 1 SAN temporária"><em>+${state.sanTemp}</em></button>` : ''}</b>
              <div class="original-cin-bar-wrap">
                <div class="original-cin-bar-top">
                  <small>/ ${sanMax}</small>
                  <div class="cin-res-quick">
                    <button type="button" data-res-delta="san:-1" title="-1 SAN">−</button>
                    <button type="button" data-res-delta="san:1" title="+1 SAN">+</button>
                  </div>
                </div>
                <div class="cin-progress-track"><i style="width:${sanMax > 0 ? (sanAtual / sanMax) * 100 : 0}%;"></i></div>
              </div>
            </div>

            <!-- PE -->
            <div class="cinematic-resource-item resource-pe" data-resource-key="pe">
              <strong>PE</strong>
              <b>${peAtual}${state.peTemp ? `<button type="button" class="temp-badge-btn" data-consume-temp="pe:1" title="Clique para extinguir 1 PE temporário"><em>+${state.peTemp}</em></button>` : ''}</b>
              <div class="original-cin-bar-wrap">
                <div class="original-cin-bar-top">
                  <small>/ ${peMax}</small>
                  <div class="cin-res-quick">
                    <button type="button" data-res-delta="pe:-1" title="-1 PE">−</button>
                    <button type="button" data-res-delta="pe:1" title="+1 PE">+</button>
                  </div>
                </div>
                <div class="cin-progress-track"><i style="width:${peMax > 0 ? (peAtual / peMax) * 100 : 0}%;"></i></div>
              </div>
            </div>
          </div>

          <div class="cinematic-scroll">
            <!-- COMBATE & ARMAS -->
            <section class="cinematic-section-group ${isCollapsed('combat') ? 'collapsed' : ''}" data-section-key="combat">
              <div class="cinematic-section-heading">
                <button class="cinematic-section-toggle" data-cinematic-section-toggle="combat" aria-expanded="${!isCollapsed('combat')}">
                  <span>ARMAS & ATAQUES (${state.ataques?.length || 0})</span>
                  ${originalIcon('sword', 15)}
                </button>
                ${editMode ? `<button type="button" class="cinematic-section-add" id="btn-add-attack" title="Adicionar arma">${originalIcon('plus', 14)}</button>` : ''}
              </div>
              <div class="cinematic-section-body">
                <div>
                  ${(state.ataques || []).map((atk, idx) => `
                    <div class="original-card attack-card" style="margin-bottom:8px;">
                      <div class="card-head">
                        <strong>${editMode ? `<input data-attack-field="${idx}:nome" value="${safe(atk.nome)}" class="input-inline">` : safe(atk.nome)}</strong>
                        <div class="atk-card-actions">
                          <button type="button" class="card-roll" data-roll-attack="${idx}" title="Rolar Teste de Ataque">
                            ${originalIcon('d20', 14)} <span>${safe(atk.ataque || 'Ataque')}</span>
                          </button>
                          <button type="button" class="card-roll damage-btn" data-roll-damage="${idx}" title="Rolar Dano">
                            ${originalIcon('flame', 14)} <span>${safe(atk.dano || 'Dano')}</span>
                          </button>
                          ${editMode ? `<button type="button" class="btn-remove-item" data-remove-attack="${idx}">${originalIcon('trash', 13)}</button>` : ''}
                        </div>
                      </div>
                      <div class="atk-tags">
                        <span>CRÍT: ${editMode ? `<input data-attack-field="${idx}:critico" value="${safe(atk.critico || '20/x2')}" style="width:55px;">` : safe(atk.critico || '20/x2')}</span>
                        <span>ALC: ${editMode ? `<input data-attack-field="${idx}:alcance" value="${safe(atk.alcance || 'Curto')}" style="width:55px;">` : safe(atk.alcance || 'Curto')}</span>
                        <span>TIPO: ${editMode ? `<input data-attack-field="${idx}:tipo" value="${safe(atk.tipo || 'Balístico')}" style="width:65px;">` : safe(atk.tipo || 'Balístico')}</span>
                      </div>
                    </div>
                  `).join('') || '<p class="empty-cards">Nenhuma arma cadastrada.</p>'}
                </div>
              </div>
            </section>

            <!-- HABILIDADES & PODERES -->
            <section class="cinematic-section-group ${isCollapsed('abilities') ? 'collapsed' : ''}" data-section-key="abilities">
              <div class="cinematic-section-heading">
                <button class="cinematic-section-toggle" data-cinematic-section-toggle="abilities" aria-expanded="${!isCollapsed('abilities')}">
                  <span>HABILIDADES & PODERES</span>
                  ${originalIcon('skull', 15)}
                </button>
              </div>
              <div class="cinematic-section-body">
                <div>
                  ${presentationMode ? '' : `<button type="button" class="btn-open-compendium" data-open-compendium style="margin-bottom:8px;">COMPÊNDIO</button>`}
                  ${origem.poder ? `
                    <div class="original-card origin-card" style="margin-bottom:8px;">
                      <div class="card-head">
                        <strong>${safe(origem.poder.nome || 'Habilidade de Origem')} <small>(${safe(origem.nome)})</small></strong>
                      </div>
                      <p class="card-desc" style="font-size:11px;">${rich(origem.poder.descricao || '')}</p>
                    </div>
                  ` : ''}
                  ${originExtraCards(state, origem)}

                  ${renderProgressionList(state, editMode)}
                  ${renderTrilhas(state, editMode)}

                  ${chosenPowerCards(state, editMode, '')}
                  ${editMode ? pickerButton('poderes', 'ADICIONAR PODER') : ''}

                  ${(state.poderesParanormais || []).map((p, i) => `
                    <div class="original-card paranormal-card" style="border-left: 3px solid ${ELEMENT_COLORS[p.elemento] || '#e0150d'};margin-bottom:8px;">
                      <div class="card-head">
                        <strong style="color:${ELEMENT_COLORS[p.elemento] || '#e0150d'}">${safe(p.nome)} <small>(${safe(p.elemento)})</small></strong>
                        ${editMode ? `<button type="button" class="btn-remove-item" data-remove-paranormal="${i}">${originalIcon('trash', 13)}</button>` : ''}
                      </div>
                      <p class="card-desc" style="font-size:11px;">${rich(p.descricao)}</p>
                    </div>
                  `).join('')}

                  ${editMode ? pickerButton('paranormais', 'ADICIONAR PODER PARANORMAL') : ''}
                </div>
              </div>
            </section>

            <!-- RITUAIS -->
            <section class="cinematic-section-group ${isCollapsed('rituals') ? 'collapsed' : ''}" data-section-key="rituals">
              <div class="cinematic-section-heading">
                <button class="cinematic-section-toggle" data-cinematic-section-toggle="rituals" aria-expanded="${!isCollapsed('rituals')}">
                  <span>RITUAIS CONHECIDOS (${state.rituaisConhecidos?.length || 0})</span>
                  ${originalIcon('flame', 15)}
                </button>
              </div>
              <div class="cinematic-section-body">
                <div>
                  ${(state.rituaisConhecidos || []).map(rId => {
                    const ritual = RITUAIS.find(r => r.id === rId);
                    if (!ritual) return '';
                    const color = ELEMENT_COLORS[ritual.elemento] || '#e0150d';
                    return `
                      <div class="original-card ritual-card" style="border-left: 3px solid ${color};margin-bottom:8px;">
                        <div class="card-head">
                          <strong style="color:${color}">${safe(ritual.nome)}</strong>
                          <div style="display:flex;align-items:center;gap:6px;">
                            <span class="ritual-element-tag">${ritual.custoPE} PE</span>
                            ${editMode ? `<button type="button" class="btn-remove-item" data-remove-ritual="${ritual.id}">${originalIcon('trash', 13)}</button>` : ''}
                          </div>
                        </div>
                        <p class="card-desc" style="font-size:11px;">${rich(ritual.descricao)}</p>
                        <button type="button" class="btn-cast-ritual" data-cast-ritual="${ritual.id}" data-ritual-cost="${ritual.custoPE}">
                          CONJURAR
                        </button>
                      </div>
                    `;
                  }).join('') || '<p class="empty-cards">Nenhum ritual conhecido.</p>'}

                  ${editMode ? pickerButton('rituais', 'APRENDER RITUAL') : ''}
                </div>
              </div>
            </section>

            <!-- ITENS & INVENTÁRIO -->
            <section class="cinematic-section-group ${isCollapsed('items') ? 'collapsed' : ''} section-lockable" data-section-key="items">
              <div class="cinematic-section-heading">
                <button class="cinematic-section-toggle" data-cinematic-section-toggle="items" aria-expanded="${!isCollapsed('items')}">
                  <span>${lockIcon}INVENTÁRIO (${state.inventario?.length || 0} ITENS)</span>
                  ${originalIcon('bag', 15)}
                </button>
                ${editMode ? `<button type="button" class="cinematic-section-add" id="btn-add-inventory-item" title="Adicionar item">${originalIcon('plus', 14)}</button>` : ''}
              </div>
              <div class="cinematic-section-body">
                <div>
                  ${(state.inventario || []).map((item, idx) => `
                    <div class="original-card inv-card" style="margin-bottom:8px;">
                      <div class="card-head">
                        <strong>${editMode ? `<input data-inv-field="${idx}:nome" value="${safe(item.nome)}" class="input-inline">` : safe(item.nome)}</strong>
                        <div style="display:flex;align-items:center;gap:6px;">
                          <span class="inv-espaco-tag">${item.espaco || 1} ESP</span>
                          ${editMode ? `<button type="button" class="btn-remove-item" data-remove-inventory="${idx}">${originalIcon('trash', 13)}</button>` : ''}
                        </div>
                      </div>
                      ${editMode ? `
                        <div class="inv-edit-row" style="display:flex;gap:8px;font-size:11px;margin-top:4px;">
                          <label>QTD <input type="number" data-inv-field="${idx}:qtd" value="${item.qtd || 1}" style="width:40px;"></label>
                          <label>ESP <input type="number" data-inv-field="${idx}:espaco" value="${item.espaco || 1}" style="width:40px;"></label>
                          <label>CAT <input data-inv-field="${idx}:categoria" value="${safe(item.categoria || '0')}" style="width:40px;"></label>
                        </div>
                      ` : ''}
                    </div>
                  `).join('') || '<p class="empty-cards">Mochila vazia.</p>'}
                </div>
              </div>
            </section>

            <!-- HISTÓRIA & DOSSIÊ -->
            <section class="cinematic-section-group ${isCollapsed('history') ? 'collapsed' : ''} section-lockable" data-section-key="history">
              <div class="cinematic-section-heading">
                <button class="cinematic-section-toggle" data-cinematic-section-toggle="history" aria-expanded="${!isCollapsed('history')}">
                  <span>${lockIcon}HISTÓRIA & ANOTAÇÕES</span>
                  ${originalIcon('info', 15)}
                </button>
              </div>
              <div class="cinematic-section-body">
                <div>
                  <textarea data-original-field="history" placeholder="Histórico, anotações e contatos do agente..." ${editMode ? '' : 'readonly'} class="cinematic-history-area" style="width:100%;min-height:90px;background:rgba(16,18,28,0.7);color:#ececf2;border:1px solid #282a3d;border-radius:4px;padding:8px;font-size:12px;resize:vertical;">${safe(state.history || '')}</textarea>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
      ${presentationMode && renderPresentationDock ? renderPresentationDock() : ''}
    </main>
  `;
}

