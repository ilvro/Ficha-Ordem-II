// Compêndio do sistema original (Ordem Paranormal RPG): origens, classes e
// trilhas, poderes, poderes paranormais, rituais e condições, com busca e
// filtros. O mesmo modal serve de seletor ("modo escolha") quando aberto pelos
// botões de adicionar poder/ritual da ficha.
import {
  ORIGENS,
  PERICIAS,
  CLASSES,
  PODERES_GERAIS,
  PODERES_PARANORMAIS,
  RITUAIS,
  CONDICOES,
  classeAtual,
  bonusLabel,
  poderesDisponiveis
} from './original-system.js';

const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = value => String(value ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const ELEMENT_COLORS = {
  Sangue: '#e0150d',
  Morte: '#70707a',
  Energia: '#a230ed',
  Conhecimento: '#e5a11c',
  Medo: '#d5d7e0'
};
const ELEMENTOS = ['Sangue', 'Morte', 'Energia', 'Conhecimento', 'Medo'];

const TABS = [
  { id: 'origens', label: 'Origens', pickTitle: '' },
  { id: 'classes', label: 'Classes & Trilhas', pickTitle: '' },
  { id: 'poderes', label: 'Poderes', pickTitle: 'ESCOLHER PODER' },
  { id: 'paranormais', label: 'Poderes Paranormais', pickTitle: 'ESCOLHER PODER PARANORMAL' },
  { id: 'rituais', label: 'Rituais', pickTitle: 'APRENDER RITUAL' },
  { id: 'condicoes', label: 'Condições', pickTitle: '' }
];

let ctx = null;
let overlay = null;
const ui = { tab: 'origens', busca: '', elemento: 'todos', circulo: 'todos', grupo: 'todos', pick: false };
// Classes e trilhas recolhidas na aba "Classes & Trilhas" (chaves de collapseKey).
const collapsed = new Set();

// options: { getSheet, isOriginal, isLocked, onChange }
export function initOriginalCompendium(options) {
  ctx = options;
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-open-compendium]');
    if (!trigger || !ctx.isOriginal()) return;
    e.preventDefault();
    const pick = trigger.hasAttribute('data-compendium-pick') && !ctx.isLocked();
    openOriginalCompendium({ tab: trigger.dataset.openCompendium || undefined, pick });
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !overlay?.classList.contains('open')) return;
    e.stopPropagation();
    closeOriginalCompendium();
  }, true);
}

export function openOriginalCompendium({ tab, pick = false } = {}) {
  ensureOverlay();
  if (tab && TABS.some(t => t.id === tab)) ui.tab = tab;
  ui.pick = pick;
  ui.busca = '';
  ui.elemento = 'todos';
  ui.circulo = 'todos';
  ui.grupo = 'todos';
  const input = overlay.querySelector('.oc-search input');
  input.value = '';
  overlay.classList.add('open');
  renderCompendium();
  overlay.querySelector('.oc-body').scrollTop = 0;
  if (!window.matchMedia('(pointer:coarse)').matches) input.focus();
}

export function closeOriginalCompendium() {
  overlay?.classList.remove('open');
}

function ensureOverlay() {
  if (overlay) return;
  overlay = document.createElement('div');
  overlay.className = 'oc-overlay';
  overlay.innerHTML = `
    <div class="oc-backdrop" data-oc-close></div>
    <section class="oc-box" role="dialog" aria-modal="true" aria-label="Compêndio">
      <header class="oc-head">
        <div>
          <small>ORDEM PARANORMAL RPG</small>
          <h2></h2>
        </div>
        <button type="button" class="oc-close" data-oc-close aria-label="Fechar">✕</button>
      </header>
      <nav class="oc-tabs"></nav>
      <label class="oc-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input type="search" placeholder="Buscar..." autocomplete="off" spellcheck="false">
      </label>
      <div class="oc-filters"></div>
      <div class="oc-body"></div>
    </section>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('.oc-search input').addEventListener('input', e => {
    ui.busca = e.target.value;
    renderCompendium();
    overlay.querySelector('.oc-body').scrollTop = 0;
  });

  overlay.addEventListener('click', e => {
    const el = e.target.closest('[data-oc-close],[data-oc-tab],[data-oc-el],[data-oc-circ],[data-oc-grupo],[data-oc-add],[data-oc-toggle]');
    if (!el) return;
    if (el.hasAttribute('data-oc-close')) { closeOriginalCompendium(); return; }
    if (el.dataset.ocAdd) { addToSheet(el.dataset.ocAdd); return; }
    if (el.dataset.ocToggle) {
      const key = el.dataset.ocToggle;
      if (collapsed.has(key)) collapsed.delete(key); else collapsed.add(key);
      const body = overlay.querySelector('.oc-body');
      const scroll = body.scrollTop;
      renderCompendium();
      body.scrollTop = scroll;
      return;
    }
    if (el.dataset.ocTab) {
      ui.tab = el.dataset.ocTab;
      ui.elemento = 'todos';
      ui.circulo = 'todos';
      ui.grupo = 'todos';
    } else if (el.dataset.ocEl) ui.elemento = el.dataset.ocEl;
    else if (el.dataset.ocCirc) ui.circulo = el.dataset.ocCirc === 'todos' ? 'todos' : Number(el.dataset.ocCirc);
    else if (el.dataset.ocGrupo) ui.grupo = el.dataset.ocGrupo;
    renderCompendium();
    overlay.querySelector('.oc-body').scrollTop = 0;
  });
}

function addToSheet(key) {
  const sheet = ctx.getSheet();
  const sep = key.indexOf(':');
  const tipo = key.slice(0, sep);
  const id = key.slice(sep + 1);
  if (tipo === 'poder') {
    const power = poderesDisponiveis(sheet).find(p => p.nome === id);
    if (!power) return;
    const { label, ...escolhido } = power;
    if (!Array.isArray(sheet.poderesEscolhidos)) sheet.poderesEscolhidos = [];
    sheet.poderesEscolhidos.push(escolhido);
  } else if (tipo === 'paranormal') {
    const power = PODERES_PARANORMAIS.find(p => p.nome === id);
    if (!power) return;
    if (!Array.isArray(sheet.poderesParanormais)) sheet.poderesParanormais = [];
    if (sheet.poderesParanormais.some(p => p.nome === id)) return;
    sheet.poderesParanormais.push(JSON.parse(JSON.stringify(power)));
  } else if (tipo === 'ritual') {
    if (!RITUAIS.some(r => r.id === id)) return;
    if (!Array.isArray(sheet.rituaisConhecidos)) sheet.rituaisConhecidos = [];
    if (sheet.rituaisConhecidos.includes(id)) return;
    sheet.rituaisConhecidos.push(id);
  } else return;
  ctx.onChange();
  const body = overlay.querySelector('.oc-body');
  const scroll = body.scrollTop;
  renderCompendium();
  body.scrollTop = scroll;
}

/* ---------------------------------------------------------------- render */

function chip(attr, value, label, active, color) {
  return `<button type="button" class="oc-chip ${active ? 'active' : ''}" data-oc-${attr}="${safe(value)}" ${color ? `style="--chip:${color}"` : ''}>${safe(label)}</button>`;
}

function elementoChips() {
  return `<div class="oc-chip-row">
    ${chip('el', 'todos', 'Todos', ui.elemento === 'todos')}
    ${ELEMENTOS.map(el => chip('el', el, el, ui.elemento === el, ELEMENT_COLORS[el])).join('')}
  </div>`;
}

function circuloChips() {
  return `<div class="oc-chip-row">
    ${chip('circ', 'todos', 'Todos os círculos', ui.circulo === 'todos')}
    ${[1, 2, 3, 4].map(n => chip('circ', n, `${n}º Círculo`, ui.circulo === n)).join('')}
  </div>`;
}

// Botão/selo de escolha de um card (só no modo escolha).
function pickControl(tipo, id, owned, label) {
  if (!ui.pick) return '';
  if (owned) return '<span class="oc-owned">✓ NA FICHA</span>';
  return `<button type="button" class="oc-add" data-oc-add="${tipo}:${safe(id)}">+ ${label}</button>`;
}

function bonusBadge(bonus) {
  const texto = bonus ? bonusLabel(ctx.getSheet(), bonus) : '';
  return texto ? `<span class="badge-bonus">✦ ${safe(texto)}</span>` : '';
}

function emptyNote(texto) {
  return `<p class="empty-cards">${texto}</p>`;
}

function renderOrigens(bate) {
  const itens = ORIGENS.filter(o => bate(o.nome) || bate(o.poder?.nome));
  return {
    count: itens.length,
    html: itens.map(o => `
      <article class="original-card oc-card">
        <div class="card-head"><strong class="oc-title">${safe(o.nome)}</strong></div>
        ${o.descricao ? `<p class="card-desc">${safe(o.descricao)}</p>` : ''}
        ${(o.pericias || []).length ? `<div class="oc-tags">${o.pericias.map(pid => {
          const p = PERICIAS.find(x => x.id === pid);
          return `<span class="oc-tag">${safe(p ? p.nome : pid)}</span>`;
        }).join('')}</div>` : ''}
        ${o.poder ? `
          <div class="oc-sub">
            <div class="card-head"><strong>${safe(o.poder.nome)}</strong>${bonusBadge(o.poder.bonus)}</div>
            <p class="card-desc">${safe(o.poder.descricao)}</p>
          </div>
        ` : ''}
      </article>
    `).join('') || emptyNote('Nenhuma origem encontrada.')
  };
}

// Cabeçalho clicável com seta, que recolhe/expande uma classe ou trilha.
function collapseHead(key, titleHtml, metaHtml = '') {
  const isCollapsed = collapsed.has(key);
  return `
    <button type="button" class="card-head oc-collapse-head" data-oc-toggle="${safe(key)}" aria-expanded="${!isCollapsed}">
      <span class="oc-collapse-title"><i class="oc-arrow" aria-hidden="true"></i>${titleHtml}</span>
      ${metaHtml}
    </button>
  `;
}

function renderClasses(bate) {
  let count = 0;
  const html = Object.values(CLASSES).map(c => {
    const classeBate = bate(c.nome);
    const trilhas = (c.trilhas || []).filter(t => classeBate || bate(t.nome) || (t.poderes || []).some(p => bate(p.nome)));
    if (!classeBate && !trilhas.length) return '';
    count += 1;
    const classeKey = `classe:${c.nome}`;
    return `
      <article class="original-card oc-card ${collapsed.has(classeKey) ? 'collapsed' : ''}">
        ${collapseHead(classeKey, `<strong class="oc-title">${safe(c.nome)}</strong>`, `<span class="card-meta">${c.mundano ? 'Estágio 1–5' : `NEX ${c.nexBase || 5}%–99%`}</span>`)}
        ${collapsed.has(classeKey) ? '' : `
          ${c.resumo || c.descricao ? `<p class="card-desc">${safe(c.resumo || c.descricao)}</p>` : ''}
          <h4 class="oc-subtitle">TRILHAS</h4>
          ${trilhas.map(t => {
            const trilhaKey = `trilha:${c.nome}/${t.nome}`;
            return `
              <div class="oc-sub ${collapsed.has(trilhaKey) ? 'collapsed' : ''}">
                ${collapseHead(trilhaKey, `<strong>${safe(t.nome)}</strong>`)}
                ${collapsed.has(trilhaKey) ? '' : `
                  ${t.descricao ? `<p class="card-desc">${safe(t.descricao)}</p>` : ''}
                  ${(t.poderes || []).map(p => `
                    <div class="oc-trail-power">
                      <div class="card-head">
                        <span><span class="nex-tag">${c.mundano ? `ESTÁGIO ${Math.floor(p.nex / 5) + 1}` : `NEX ${p.nex}%`}</span> <strong>${safe(p.nome)}</strong></span>
                        ${bonusBadge(p.bonus)}
                      </div>
                      <p class="card-desc">${safe(p.descricao)}</p>
                    </div>
                  `).join('')}
                `}
              </div>
            `;
          }).join('') || emptyNote('Nenhuma trilha encontrada.')}
        `}
      </article>
    `;
  }).join('');
  return { count, html: html || emptyNote('Nada encontrado.') };
}

function renderPoderes(bate) {
  const sheet = ctx.getSheet();
  const minhaClasseId = Object.keys(CLASSES).find(id => CLASSES[id] === classeAtual(sheet));
  const escolhidos = new Set((sheet.poderesEscolhidos || []).map(p => p.nome));
  // No modo escolha só entram os poderes que a ficha pode pegar: os da própria
  // classe e os gerais.
  const classeIds = ui.pick ? [minhaClasseId] : Object.keys(CLASSES);
  const grupos = [
    ...classeIds.map(id => ({ id, label: CLASSES[id].nome, origem: `Poder de ${CLASSES[id].nome}`, poderes: CLASSES[id].poderes || [] })),
    { id: 'gerais', label: 'Gerais', origem: 'Poder Geral', poderes: PODERES_GERAIS }
  ];
  if (!grupos.some(g => g.id === ui.grupo)) ui.grupo = 'todos';
  const itens = grupos
    .filter(g => ui.grupo === 'todos' || g.id === ui.grupo)
    .flatMap(g => g.poderes.filter(p => bate(p.nome)).map(p => ({ p, g })));
  return {
    count: itens.length,
    filters: `<div class="oc-chip-row">
      ${chip('grupo', 'todos', 'Todos', ui.grupo === 'todos')}
      ${grupos.map(g => chip('grupo', g.id, g.label, ui.grupo === g.id)).join('')}
    </div>`,
    html: itens.map(({ p, g }) => {
      const owned = escolhidos.has(p.nome);
      return `
        <article class="original-card oc-card ${ui.pick && owned ? 'owned' : ''}">
          <div class="card-head">
            <strong class="oc-title">${safe(p.nome)}</strong>
            ${pickControl('poder', p.nome, owned, 'ADICIONAR')}
          </div>
          <span class="card-meta">${safe(g.origem)}</span>
          ${p.preRequisito ? `<span class="card-meta card-prereq">Pré-requisito: ${safe(p.preRequisito)}</span>` : ''}
          ${bonusBadge(p.bonus)}
          <p class="card-desc">${safe(p.descricao)}</p>
        </article>
      `;
    }).join('') || emptyNote('Nenhum poder encontrado.')
  };
}

function renderParanormais(bate) {
  const sheet = ctx.getSheet();
  const conhecidos = new Set((sheet.poderesParanormais || []).map(p => p.nome));
  const itens = PODERES_PARANORMAIS.filter(p => bate(p.nome) && (ui.elemento === 'todos' || p.elemento === ui.elemento));
  return {
    count: itens.length,
    filters: elementoChips(),
    html: itens.map(p => {
      const color = ELEMENT_COLORS[p.elemento] || '#e0150d';
      const owned = conhecidos.has(p.nome);
      return `
        <article class="original-card oc-card ${ui.pick && owned ? 'owned' : ''}" style="--el:${color}">
          <div class="card-head">
            <div class="ritual-title-group">
              <span class="oc-element">${safe(p.elemento)}</span>
              <strong class="oc-title">${safe(p.nome)}</strong>
            </div>
            ${pickControl('paranormal', p.nome, owned, 'ADICIONAR')}
          </div>
          ${p.custoSAN ? `<span class="card-meta">Custo: ${safe(p.custoSAN)} SAN</span>` : ''}
          ${bonusBadge(p.bonus)}
          <p class="card-desc">${safe(p.descricao)}</p>
        </article>
      `;
    }).join('') || emptyNote('Nenhum poder paranormal encontrado.')
  };
}

function renderRituais(bate) {
  const sheet = ctx.getSheet();
  const conhecidos = new Set(sheet.rituaisConhecidos || []);
  const itens = RITUAIS
    .filter(r => bate(r.nome)
      && (ui.elemento === 'todos' || r.elemento === ui.elemento || r.elementoSecundario === ui.elemento)
      && (ui.circulo === 'todos' || r.circulo === ui.circulo))
    .sort((a, b) => a.circulo - b.circulo);
  return {
    count: itens.length,
    filters: elementoChips() + circuloChips(),
    html: itens.map(r => {
      const color = ELEMENT_COLORS[r.elemento] || '#e0150d';
      const owned = conhecidos.has(r.id);
      const campos = [
        ['EXECUÇÃO', r.execucao],
        ['ALCANCE', r.alcance],
        ['ALVO', r.alvo],
        ['ÁREA', r.area],
        ['DURAÇÃO', r.duracao],
        ['RESISTÊNCIA', r.resistencia]
      ].filter(([, valor]) => valor);
      return `
        <article class="original-card oc-card ${ui.pick && owned ? 'owned' : ''}" style="--el:${color}">
          <div class="card-head">
            <div class="ritual-title-group">
              <span class="oc-element">${safe(r.elementoSecundario ? `${r.elemento} / ${r.elementoSecundario}` : r.elemento)} · ${r.circulo}º CÍRCULO</span>
              <strong class="oc-title">${safe(r.nome)}</strong>
              ${r.custoPE ? `<span class="ritual-element-tag">${safe(r.custoPE)} PE</span>` : ''}
            </div>
            ${pickControl('ritual', r.id, owned, 'APRENDER')}
          </div>
          ${campos.length ? `<div class="oc-ritual-meta">${campos.map(([label, valor]) => `<div><small>${label}</small><span>${safe(valor)}</span></div>`).join('')}</div>` : ''}
          <p class="card-desc">${safe(r.descricao)}</p>
          ${r.discente ? `<p class="oc-upgrade"><b>Discente (+${safe(r.discente.custoPE)} PE):</b> ${safe(r.discente.descricao)}</p>` : ''}
          ${r.verdadeiro ? `<p class="oc-upgrade"><b>Verdadeiro (+${safe(r.verdadeiro.custoPE)} PE):</b> ${safe(r.verdadeiro.descricao)}</p>` : ''}
        </article>
      `;
    }).join('') || emptyNote('Nenhum ritual encontrado.')
  };
}

function renderCondicoes(bate) {
  const itens = CONDICOES.filter(c => bate(c));
  return {
    count: itens.length,
    html: itens.length
      ? `<div class="oc-tags oc-conditions">${itens.map(c => `<span class="oc-tag">${safe(c)}</span>`).join('')}</div>`
      : emptyNote('Nenhuma condição encontrada.')
  };
}

const RENDERERS = {
  origens: renderOrigens,
  classes: renderClasses,
  poderes: renderPoderes,
  paranormais: renderParanormais,
  rituais: renderRituais,
  condicoes: renderCondicoes
};

function renderCompendium() {
  const busca = norm(ui.busca.trim());
  const bate = texto => !busca || norm(texto).includes(busca);
  const tab = TABS.find(t => t.id === ui.tab) || TABS[0];
  const result = RENDERERS[tab.id](bate);

  overlay.classList.toggle('pick-mode', ui.pick);
  overlay.querySelector('.oc-head h2').textContent = ui.pick ? tab.pickTitle : 'COMPÊNDIO';
  overlay.querySelector('.oc-tabs').innerHTML = TABS.map(t => `<button type="button" class="${t.id === tab.id ? 'active' : ''}" data-oc-tab="${t.id}">${safe(t.label)}</button>`).join('');
  overlay.querySelector('.oc-search input').placeholder = `Buscar em ${tab.label.toLowerCase()}...`;
  overlay.querySelector('.oc-filters').innerHTML = `${result.filters || ''}<span class="oc-count">${result.count} ${result.count === 1 ? 'RESULTADO' : 'RESULTADOS'}</span>`;
  overlay.querySelector('.oc-body').innerHTML = result.html;
}
