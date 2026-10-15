/**
 * Rebalanceamento completo de uma ameaça quando o VD ou a dificuldade mudam.
 *
 * Além das estatísticas (PV, Defesa, testes, DT, presença, resistências, ataques), o motor
 * LÊ o texto de cada ação e habilidade e reescreve os números que dependem do poder da criatura:
 *   - dados de dano ("4d10+10 pontos de dano", "dano de 2d6")      -> escala com o dano esperado
 *   - dano fixo ("causando 40 pontos de dano")                     -> escala com o dano esperado
 *   - cura e regeneração ("recupera 50 PV", "cura 2d10 pontos de vida", "Cura Acelerada 20")
 *   - PV citados no texto ("20 PV", "perde 50 pontos de vida")     -> escala com os PV
 *   - DT de testes de resistência ("Fortitude DT 40")              -> soma a diferença de DT
 *   - bônus de teste citados ("teste 5d20+50")                     -> soma a diferença de ataque
 *   - Defesa citada ("Defesa 30") e resistência a dano ("RD 20")
 * Durações, distâncias, quantidades de alvos e dados de teste (d20) ficam intactos.
 *
 * A escala é RELATIVA: compara a tabela do VD/dificuldade de origem com a do destino,
 * então uma criatura que já era mais forte ou mais fraca que a média continua assim.
 */

import { getBalance } from './threat-balance.js';
import { applyDerivedDice } from './threat-system.js';

const clone = obj => JSON.parse(JSON.stringify(obj));

// ── Dados ──────────────────────────────────────────────────────────────────

const DICE_RE = /^(\d+)d(\d+)(?:\s*([+–-])\s*(\d+))?$/i;

export function parseDice(expr) {
  const m = String(expr || '').trim().match(DICE_RE);
  if (!m) return null;
  const k = m[4] ? Number(m[4]) * (m[3] === '+' ? 1 : -1) : 0;
  return { n: Number(m[1]), f: Number(m[2]), k };
}

export function diceAvg({ n, f, k }) {
  return n * (f + 1) / 2 + k;
}

export function formatDice({ n, f, k }) {
  return `${n}d${f}${k > 0 ? `+${k}` : (k < 0 ? `${k}` : '')}`;
}

/** Multiplica a média de uma expressão de dados mantendo o tipo do dado */
export function scaleDice(expr, ratio) {
  const d = parseDice(expr);
  if (!d || Math.abs(ratio - 1) < 0.02) return String(expr).replace(/\s+/g, '');
  const half = (d.f + 1) / 2;
  const target = diceAvg(d) * ratio;
  let n = Math.max(1, Math.round(d.n * ratio));
  let k = Math.round(target - n * half);
  if (k < 0) {
    // Dados demais para a média desejada: reduz a quantidade
    n = Math.max(1, Math.floor(target / half));
    k = Math.max(0, Math.round(target - n * half));
  }
  return formatDice({ n, f: d.f, k });
}

function scaleInt(value, ratio, { minimum = 1, roundTo = 1 } = {}) {
  const raw = Number(value) * ratio;
  const r = roundTo > 1 ? Math.round(raw / roundTo) * roundTo : Math.round(raw);
  return Math.max(minimum, r);
}

function scaleAmount(token, ratio) {
  if (/d\d/i.test(token)) return scaleDice(token, ratio);
  const v = Number(token);
  if (!Number.isFinite(v) || v < 3) return token;
  return String(scaleInt(v, ratio, { minimum: 1, roundTo: v >= 30 ? 5 : 1 }));
}

// ── Referências da tabela ─────────────────────────────────────────────────

function rdRef(vd) {
  return 5 * Math.max(1, Math.round(1 + (Math.max(10, Math.min(400, vd)) / 400) * 5));
}

function avgOfPresence(p) {
  return p ? p.dados * (p.faces + 1) / 2 : 0;
}

/** NEX a partir do qual a presença não afeta mais: segue a progressão do livro (VD 20 = 25%, VD 100 = 45%, VD 300 = 90%) */
export function nexImuneRef(vd) {
  return Math.max(25, Math.min(99, Math.round((20 + Number(vd) / 4) / 5) * 5));
}

/** Maior atributo esperado para um VD (média do bestiário: VD 20 ≈ 3, VD 200 ≈ 4, VD 400 ≈ 6) */
export function attrRef(vd) {
  return 3.2 + (Math.max(10, Math.min(400, Number(vd))) - 20) * 0.0067;
}

/** Calcula as razões e diferenças entre a configuração de origem e a de destino */
export function buildScale(from, to) {
  const a = getBalance(from.vd, from.preset, from.slider || 0);
  const b = getBalance(to.vd, to.preset, to.slider || 0);
  const pa = avgOfPresence(a.presenca), pb = avgOfPresence(b.presenca);
  return {
    a, b,
    ratioPv: b.pv / Math.max(1, a.pv),
    ratioDmg: b.danoMedio / Math.max(1, a.danoMedio),
    ratioPresenca: pa && pb ? pb / pa : (b.danoMedio / Math.max(1, a.danoMedio)),
    ratioRd: rdRef(to.vd) / rdRef(from.vd),
    dDef: b.defesa - a.defesa,
    dAtk: b.ataque.bonus - a.ataque.bonus,
    dDt: b.dt - a.dt,
    dNex: nexImuneRef(to.vd) - nexImuneRef(from.vd),
    ratioAttr: attrRef(to.vd) / attrRef(from.vd),
    dtPiso: b.dt,
    dSaves: [b.resForte.bonus - a.resForte.bonus, b.resMedia.bonus - a.resMedia.bonus, b.resFraca.bonus - a.resFraca.bonus]
  };
}

// ── Leitura inteligente de textos ─────────────────────────────────────────

const DICE_SRC = String.raw`\d+d(?!20\b)\d+(?:\s?[+–-]\s?\d+)?`;

/**
 * Regras de leitura. Cada regra encontra um número dentro da frase (grupo 1) e diz
 * como ele deve mudar. A ordem define a prioridade quando dois trechos se sobrepõem.
 */
function buildRules(sc) {
  return [
    {
      id: 'cura',
      label: 'CURA',
      re: new RegExp(String.raw`(?:recuper\w*|cur(?:a|ar|ando|am)\b|regener\w*|restaur\w*)\s+(?:até\s+)?(${DICE_SRC}|\d+)\s*(?:PV\b|pontos?\s+de\s+vida)`, 'dgi'),
      apply: tok => scaleAmount(tok, sc.ratioPv)
    },
    {
      id: 'cura-acelerada',
      label: 'CURA ACELERADA',
      re: /Cura\s+Acelerada\s+(\d+)/dgi,
      apply: tok => scaleAmount(tok, sc.ratioPv)
    },
    {
      id: 'dano',
      label: 'DANO',
      re: new RegExp(String.raw`(?<![\w])(${DICE_SRC})(?=\s+(?:pontos?\s+de\s+)?dano\b|\s+de\s+dano\b)`, 'dgi'),
      apply: tok => scaleDice(tok, sc.ratioDmg)
    },
    {
      id: 'dano-de',
      label: 'DANO',
      re: new RegExp(String.raw`dano\s+(?:de\s+|igual\s+a\s+|adicional\s+de\s+)?(${DICE_SRC})`, 'dgi'),
      apply: tok => scaleDice(tok, sc.ratioDmg)
    },
    {
      id: 'dano-fixo',
      label: 'DANO',
      re: /(?<![\w+–-])(\d+)(?=\s+pontos?\s+de\s+dano\b)/dgi,
      apply: tok => scaleAmount(tok, sc.ratioDmg)
    },
    {
      id: 'rd',
      label: 'RD',
      re: /(?:resist[êe]ncia\s+a\s+dano|\bRD)\s+(\d+)/dgi,
      apply: tok => String(scaleInt(tok, sc.ratioRd, { minimum: 5, roundTo: 5 }))
    },
    {
      id: 'pv-totais',
      label: 'PV',
      re: /PV\s+totais\s+em\s+(\d+)/dgi,
      apply: tok => scaleAmount(tok, sc.ratioPv)
    },
    {
      id: 'pv',
      label: 'PV',
      re: /(?<![\w+–-])(\d+)\s*(?:PV\b|pontos?\s+de\s+vida)/dgi,
      apply: tok => scaleAmount(tok, sc.ratioPv)
    },
    {
      id: 'pv-prefixo',
      label: 'PV',
      re: /\bPV\s+(\d+)/dgi,
      apply: tok => scaleAmount(tok, sc.ratioPv)
    },
    {
      id: 'dt',
      label: 'DT',
      re: /\bDT\s*(\d+)/dgi,
      apply: tok => (Number(tok) >= 10 ? String(Math.max(sc.dtPiso, Number(tok) + sc.dDt)) : tok)
    },
    {
      id: 'defesa',
      label: 'DEFESA',
      re: /\bDefesa\s+(\d+)/dgi,
      apply: tok => String(Math.max(5, Number(tok) + sc.dDef))
    },
    {
      id: 'atributo',
      label: 'ATRIBUTO',
      re: /(?:Agilidade|For[çc]a|Intelecto|Presen[çc]a|Vigor|AGI|FOR|INT|PRE|VIG)\s+(?:muda\s+para|passa\s+a\s+ser|aumenta\s+para)\s+(\d+)/dgi,
      apply: tok => String(scaleInt(tok, sc.ratioAttr, { minimum: 1 }))
    },
    {
      id: 'teste-resistencia',
      label: 'TESTE',
      re: /(?:Fortitude|Reflexos|Vontade|Percep[çc][ãa]o|Iniciativa)\s+(?:muda|passa)\s+para\s+(\d+d20\s*\+\s*\d+)/dgi,
      apply: tok => {
        const m = tok.match(/(\d+)d20\s*\+\s*(\d+)/i);
        const dados = Math.max(1, Math.round(Number(m[1]) * sc.ratioAttr));
        return `${dados}d20+${Math.max(0, Number(m[2]) + sc.dSaves[0])}`;
      }
    },
    {
      id: 'pool',
      label: 'TESTE',
      re: /\b\d+d20\s*\+\s*(\d+)/dgi,
      apply: tok => String(Math.max(0, Number(tok) + sc.dAtk))
    },
    {
      id: 'teste',
      label: 'TESTE',
      re: /\bteste[^\d\n]{0,18}\d+d20\s*\+\s*(\d+)/dgi,
      apply: tok => String(Math.max(0, Number(tok) + sc.dAtk))
    }
  ];
}

/**
 * Reescreve os números de um texto. Retorna o novo texto e a lista de trocas.
 */
export function rewriteText(text, sc) {
  const src = String(text || '');
  if (!src) return { text: src, edits: [] };

  const spans = [];
  buildRules(sc).forEach((rule, priority) => {
    for (const m of src.matchAll(rule.re)) {
      const idx = m.indices?.[1];
      if (!idx) continue;
      const from = m[1];
      const to = rule.apply(from);
      if (to === from.replace(/\s+/g, '') || to === from) continue;
      spans.push({ s: idx[0], e: idx[1], from, to, label: rule.label, priority });
    }
  });

  // Resolve sobreposições: vence a regra de maior prioridade (menor índice)
  spans.sort((x, y) => x.priority - y.priority || x.s - y.s);
  const accepted = [];
  spans.forEach(sp => {
    if (!accepted.some(o => sp.s < o.e && sp.e > o.s)) accepted.push(sp);
  });
  accepted.sort((x, y) => x.s - y.s);

  let out = '';
  let cursor = 0;
  accepted.forEach(sp => {
    out += src.slice(cursor, sp.s) + sp.to;
    cursor = sp.e;
  });
  out += src.slice(cursor);
  return { text: out, edits: accepted.map(({ from, to, label }) => ({ from, to, label })) };
}

// ── Ficha inteira ──────────────────────────────────────────────────────────

function roundPv(value) {
  const v = Math.max(1, Math.round(value));
  return v >= 35 ? Math.round(v / 5) * 5 : v;
}

/**
 * Calcula a ficha rebalanceada sem alterar a original.
 * @param {object} sheet ficha de ameaça normalizada
 * @param {{vd:number, preset:string, slider?:number}} to destino
 * @param {{vd:number, preset:string, slider?:number}} [from] origem (padrão: o VD atual da ficha, nível "editora")
 * @param {{reescreverTextos?:boolean, resistencias?:boolean}} [opts]
 */
export function rebalanceSheet(sheet, to, from, opts = {}) {
  const { reescreverTextos = true, resistencias = true } = opts;
  const origem = from || sheet.balanco || { vd: sheet.vd, preset: 'editora', slider: 0 };
  const sc = buildScale(origem, to);
  const out = clone(sheet);
  const log = { stats: [], ataques: [], textos: [] };
  const note = (label, before, after) => {
    if (String(before) !== String(after)) log.stats.push({ label, before: String(before), after: String(after) });
  };

  out.vd = to.vd;
  note('VD', sheet.vd, out.vd);

  // PV
  const pvAntes = sheet.pvMax;
  out.pvMax = roundPv(sheet.pvMax * sc.ratioPv);
  out.pv = out.pvMax;
  out.pvTemp = 0;
  if (sheet.machucadoOverride !== null && sheet.machucadoOverride !== undefined) {
    out.machucadoOverride = Math.max(1, Math.round(sheet.machucadoOverride * sc.ratioPv));
  }
  note('Pontos de vida', pvAntes, out.pvMax);

  // Atributos: escalam com o VD; os dados de Fortitude, Reflexos, Vontade, Percepção e Iniciativa os acompanham
  Object.keys(out.atributos || {}).forEach(k => {
    const antes = sheet.atributos[k];
    if (antes > 0) out.atributos[k] = Math.max(1, Math.round(antes * sc.ratioAttr));
    note(`Atributo ${k.toUpperCase()}`, antes, out.atributos[k]);
  });
  applyDerivedDice(out);

  // Defesa
  out.defesa = Math.max(5, sheet.defesa + sc.dDef);
  note('Defesa', sheet.defesa, out.defesa);

  // Testes de resistência: o maior bônus recebe o ajuste do "forte", e assim por diante
  const chaves = ['fortitude', 'reflexos', 'vontade'];
  const ordem = [...chaves].sort((a, b) => (sheet.salvaguardas?.[b]?.bonus || 0) - (sheet.salvaguardas?.[a]?.bonus || 0));
  ordem.forEach((k, rank) => {
    const antes = sheet.salvaguardas?.[k]?.bonus || 0;
    out.salvaguardas[k].bonus = Math.max(0, antes + sc.dSaves[rank]);
    note(`Teste de ${k === 'fortitude' ? 'Fortitude' : (k === 'reflexos' ? 'Reflexos' : 'Vontade')}`, `+${antes}`, `+${out.salvaguardas[k].bonus}`);
  });

  // Sentidos e perícias acompanham o bônus de ataque
  ['percepcao', 'iniciativa'].forEach(k => {
    const antes = sheet.sentidos?.[k]?.bonus || 0;
    out.sentidos[k].bonus = Math.max(0, antes + sc.dAtk);
    note(k === 'percepcao' ? 'Percepção' : 'Iniciativa', `+${antes}`, `+${out.sentidos[k].bonus}`);
  });
  (out.pericias || []).forEach((p, i) => {
    const antes = sheet.pericias[i].bonus || 0;
    p.bonus = Math.max(0, antes + sc.dAtk);
    note(`Perícia ${p.nome}`, `+${antes}`, `+${p.bonus}`);
  });

  // Presença Perturbadora
  if (out.presenca?.ativa) {
    const pr = out.presenca;
    const dtAntes = pr.dt;
    pr.dt = Math.max(5, pr.dt + sc.dDt);
    note('DT da presença', dtAntes, pr.dt);
    const danoAntes = pr.dano;
    pr.dano = scaleDice(pr.dano, sc.ratioPresenca);
    note('Dano da presença', danoAntes, pr.dano);
    if (pr.imuneNex > 0) {
      const nexAntes = pr.imuneNex;
      pr.imuneNex = Math.max(5, Math.min(99, pr.imuneNex + sc.dNex));
      note('Imune a partir de NEX', `${nexAntes}%`, `${pr.imuneNex}%`);
    }
    if (reescreverTextos && pr.texto) {
      const r = rewriteText(pr.texto, sc);
      if (r.edits.length) { log.textos.push({ tipo: 'Presença', nome: 'Presença perturbadora', edits: r.edits }); pr.texto = r.text; }
    }
  }

  // Resistências a dano
  if (resistencias) {
    (out.resistencias || []).forEach((r, i) => {
      const antes = sheet.resistencias[i].valor;
      r.valor = scaleInt(antes, sc.ratioRd, { minimum: 5, roundTo: 5 });
      note(`Resistência a ${r.tipo}`, antes, r.valor);
    });
  }

  // Ataques e textos das ações
  (out.acoes || []).forEach((acao, ai) => {
    (acao.ataques || []).forEach((atk, ti) => {
      const antes = sheet.acoes[ai].ataques[ti];
      atk.teste.bonus = Math.max(0, antes.teste.bonus + sc.dAtk);
      atk.dano = scaleDice(antes.dano, sc.ratioDmg);
      if (atk.teste.bonus !== antes.teste.bonus || atk.dano !== String(antes.dano).replace(/\s+/g, '')) {
        log.ataques.push({
          acao: acao.nome,
          ataque: atk.nome,
          testeAntes: `+${antes.teste.bonus}`,
          testeDepois: `+${atk.teste.bonus}`,
          danoAntes: antes.dano,
          danoDepois: atk.dano,
          tipoDano: atk.tipoDano
        });
      }
    });
    if (reescreverTextos) {
      ['texto', 'gatilho'].forEach(campo => {
        if (!acao[campo]) return;
        const r = rewriteText(acao[campo], sc);
        if (r.edits.length) {
          log.textos.push({ tipo: 'Ação', nome: acao.nome, edits: r.edits });
          acao[campo] = r.text;
        }
      });
    }
  });

  // Seções livres, enigmas e habilidades
  if (reescreverTextos) {
    (out.secoes || []).forEach(sec => {
      if (!sec.corpo) return;
      const r = rewriteText(sec.corpo, sc);
      if (r.edits.length) {
        log.textos.push({ tipo: sec.estilo === 'enigma' ? 'Enigma' : 'Seção', nome: sec.titulo, edits: r.edits });
        sec.corpo = r.text;
      }
    });
  }

  out.balanco = { vd: to.vd, preset: to.preset, slider: to.slider || 0 };
  return { sheet: out, log, escala: sc };
}

export const PRESET_LABELS = {
  leve: 'Leve',
  equilibrada: 'Equilibrada',
  editora: 'Oficial'
};
