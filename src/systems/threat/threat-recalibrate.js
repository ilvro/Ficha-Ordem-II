/**
 * Modo "Recalibrar ficha existente" do Wizard de Ameaças.
 * Mostra a prévia de tudo que muda ao trocar o VD ou a dificuldade e aplica o rebalanceamento completo
 * (estatísticas, ataques e os números escritos dentro de ações e habilidades).
 */
import { normalizeThreatSheet } from './threat-system.js';
import { rebalanceSheet, PRESET_LABELS } from './threat-rebalance.js';
import { icon } from '../../icons.js';

const VDS = [20, 40, 60, 80, 100, 140, 180, 240, 320, 400];

function safe(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Uma ficha "tem conteúdo" quando já foi montada além do modelo inicial */
export function fichaTemConteudo(sheet) {
  const acoes = sheet.acoes || [];
  return (sheet.secoes || []).length > 0
    || acoes.length > 1
    || acoes.some(a => (a.texto || '').trim().length > 0)
    || (sheet.name && sheet.name !== 'Nova Ameaça' && sheet.name !== 'Nova Criatura');
}

export function estadoRecalInicial(sheet) {
  const origem = sheet.balanco || { vd: Number(sheet.vd) || 60, preset: 'editora', slider: 0 };
  return {
    origem: { ...origem },
    destino: { vd: Number(sheet.vd) || origem.vd, preset: origem.preset, slider: 0 },
    reescreverTextos: true,
    resistencias: true
  };
}

export function calcularRecal(sheet, r) {
  return rebalanceSheet(normalizeThreatSheet(sheet), r.destino, r.origem, {
    reescreverTextos: r.reescreverTextos,
    resistencias: r.resistencias
  });
}

export function aplicarRecal(sheet, r) {
  const { sheet: novo } = calcularRecal(sheet, r);
  Object.assign(sheet, novo);
  return sheet;
}

export function renderEscolha() {
  return `
    <p class="wiz-lead">Esta ficha já tem conteúdo. Escolha como o Wizard deve trabalhar.</p>
    <div class="wiz-options">
      <button type="button" class="wiz-option" data-twiz-modo="recalibrar">
        <b>RECALIBRAR FICHA EXISTENTE</b>
        <em class="wiz-option-tag" style="background:var(--threat-elem-color,#e0150d);color:#fff;">RECOMENDADO</em>
        <span>Muda o VD ou a dificuldade e ajusta a ficha inteira: PV, Defesa, testes, ataques e os números escritos nas ações e habilidades (dano, cura, DT). Nada é apagado.</span>
      </button>
      <button type="button" class="wiz-option" data-twiz-modo="criar">
        <b>CRIAR DO ZERO</b>
        <em class="wiz-option-tag" style="background:#3d4157;color:#fff;">SUBSTITUI TUDO</em>
        <span>Refaz estatísticas, ações e seções a partir de um arquétipo. O conteúdo atual é substituído.</span>
      </button>
    </div>
  `;
}

function presetBtn(attr, id, atual) {
  return `<button type="button" class="threat-vd-chip ${atual === id ? 'selected' : ''}" ${attr}="${id}">${PRESET_LABELS[id].toUpperCase()}</button>`;
}

export function renderRecalibrar(sheet, r) {
  const mudou = r.destino.vd !== r.origem.vd || r.destino.preset !== r.origem.preset || r.destino.slider !== 0 || (r.origem.slider || 0) !== 0;
  return `
    <p class="wiz-lead">Escolha o novo <b>VD</b> e a <b>dificuldade</b>. A prévia mostra tudo que será alterado antes de aplicar.</p>

    <div class="recal-grid">
      <div class="recal-card">
        <div class="recal-card-head">
          <label>VALOR DE DESAFIO</label>
          <span class="recal-from">de <b>${r.origem.vd}</b> para <b id="recal-vd-val">${r.destino.vd}</b></span>
        </div>
        <div class="threat-vd-chips-row">
          ${VDS.map(v => `<button type="button" class="threat-vd-chip ${r.destino.vd === v ? 'selected' : ''}" data-twiz-recal-vd-chip="${v}">${v}</button>`).join('')}
        </div>
        <div class="recal-slider-row">
          <input type="range" min="10" max="400" step="5" value="${r.destino.vd}" data-twiz-recal-vd>
          <input type="number" min="10" max="400" value="${r.destino.vd}" data-twiz-recal-vd>
        </div>
      </div>

      <div class="recal-card">
        <div class="recal-card-head">
          <label>DIFICULDADE</label>
          <span class="recal-from">ficha atual: <b>${PRESET_LABELS[r.origem.preset]}</b></span>
        </div>
        <div class="threat-vd-chips-row">
          ${['leve', 'equilibrada', 'editora'].map(p => presetBtn('data-twiz-recal-preset', p, r.destino.preset)).join('')}
        </div>
        <div class="recal-slider-row">
          <small>AJUSTE FINO DE PV E DANO</small>
          <input type="range" min="-20" max="20" step="5" value="${r.destino.slider}" data-twiz-recal-slider>
          <b id="recal-slider-val">${r.destino.slider > 0 ? '+' : ''}${r.destino.slider}%</b>
        </div>
      </div>
    </div>

    <div class="recal-options">
      <label class="recal-check"><input type="checkbox" data-twiz-recal-chk="reescreverTextos" ${r.reescreverTextos ? 'checked' : ''}><span>Reescrever números dentro de ações, habilidades e enigmas (dano, cura, PV, DT)</span></label>
      <label class="recal-check"><input type="checkbox" data-twiz-recal-chk="resistencias" ${r.resistencias ? 'checked' : ''}><span>Ajustar resistências a dano</span></label>
      <details class="recal-origin">
        <summary>A ficha foi criada para outra dificuldade?</summary>
        <div class="threat-vd-chips-row" style="margin-top:8px;">
          ${['leve', 'equilibrada', 'editora'].map(p => presetBtn('data-twiz-recal-from-preset', p, r.origem.preset)).join('')}
        </div>
        <small>Serve de ponto de partida para calcular o quanto cada número muda. Fichas do livro usam "Oficial".</small>
      </details>
    </div>

    <div id="recal-preview" class="recal-preview">${renderRecalPreview(sheet, r, mudou)}</div>
  `;
}

export function renderRecalPreview(sheet, r, mudouForcado) {
  const { log } = calcularRecal(sheet, r);
  const total = log.stats.length + log.ataques.length + log.textos.length;
  if (!total) {
    return `<div class="recal-empty">Nenhuma mudança com esses valores. Altere o VD ou a dificuldade.</div>`;
  }
  const stats = log.stats.map(s => `
    <li class="stat"><span>${safe(s.label)}</span><b>${safe(s.before)}</b><i>${icon('chevron-right', 11)}</i><b class="after">${safe(s.after)}</b></li>`).join('');
  const ataques = log.ataques.map(a => `
    <li>
      <span>${safe(a.acao)} · ${safe(a.ataque)}</span>
      <em>teste ${safe(a.testeAntes)} → <b class="after">${safe(a.testeDepois)}</b></em>
      <em>dano ${safe(a.danoAntes)} → <b class="after">${safe(a.danoDepois)}</b> ${safe(a.tipoDano)}</em>
    </li>`).join('');
  const textos = log.textos.map(t => `
    <li>
      <span>${safe(t.tipo)} · ${safe(t.nome)}</span>
      <div class="recal-chips">${t.edits.map(e => `<em class="recal-chip"><small>${safe(e.label)}</small>${safe(e.from)} → <b class="after">${safe(e.to)}</b></em>`).join('')}</div>
    </li>`).join('');
  return `
    <div class="recal-summary"><b>${total}</b> ajustes: ${log.stats.length} estatísticas, ${log.ataques.length} ataques, ${log.textos.length} textos de habilidades.</div>
    <div class="recal-lists">
      ${stats ? `<section><h4>ESTATÍSTICAS</h4><ul class="recal-list">${stats}</ul></section>` : ''}
      ${ataques ? `<section><h4>ATAQUES</h4><ul class="recal-list">${ataques}</ul></section>` : ''}
      ${textos ? `<section><h4>AÇÕES E HABILIDADES</h4><ul class="recal-list">${textos}</ul></section>` : ''}
    </div>
  `;
}
