/**
 * Regras, normalização e helpers matemáticos para Fichas de Ameaças
 */

import { DEFAULT_THREAT_SHEET, THREAT_ELEMENTS, THREAT_SOURCES } from './threat-data.js';
export { DEFAULT_THREAT_SHEET };

function makeId(prefix = 'threat') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

/**
 * Dados dos testes são derivados dos atributos da ameaça:
 *   Fortitude -> Vigor, Reflexos -> Agilidade, Vontade -> Presença,
 *   Percepção -> Presença, Iniciativa -> Agilidade.
 * Um teste pode ter `manual: true` para manter dados diferentes do atributo (exceções do livro).
 */
export const DERIVED_DICE_MAP = {
  salvaguardas: { fortitude: 'vig', reflexos: 'agi', vontade: 'pre' },
  sentidos: { percepcao: 'pre', iniciativa: 'agi' }
};

export const ATTR_LABELS = { agi: 'Agilidade', for: 'Força', int: 'Intelecto', pre: 'Presença', vig: 'Vigor' };

export function derivedDiceFor(sheet, group, key) {
  const attr = DERIVED_DICE_MAP[group]?.[key];
  return Math.max(1, Number(sheet?.atributos?.[attr]) || 0);
}

/** Atualiza (in-place) os dados dos testes que seguem o atributo. */
export function applyDerivedDice(sheet) {
  if (!sheet) return sheet;
  Object.entries(DERIVED_DICE_MAP).forEach(([group, keys]) => {
    if (!sheet[group]) return;
    Object.keys(keys).forEach(key => {
      const pool = sheet[group][key];
      if (!pool || pool.manual) return;
      pool.dados = derivedDiceFor(sheet, group, key);
    });
  });
  return sheet;
}

/**
 * Calcula os Pontos de Vida do limiar de Machucado (metade do PV máximo arredondado para baixo, ou valor manual).
 */
export function calcMachucado(sheet) {
  if (!sheet) return 0;
  if (sheet.machucadoOverride !== null && sheet.machucadoOverride !== undefined && !isNaN(Number(sheet.machucadoOverride))) {
    return Math.max(0, Number(sheet.machucadoOverride));
  }
  return Math.floor((Number(sheet.pvMax) || 0) / 2);
}

/**
 * Verifica se a criatura está no estado Machucado.
 */
export function estaMachucada(sheet) {
  if (!sheet) return false;
  const pvAtual = Number(sheet.pv) || 0;
  return pvAtual <= calcMachucado(sheet) && pvAtual > 0;
}

/**
 * Converte metros de deslocamento em quadrados (1 quadrado = 1,5m no grid).
 */
export function calcQuadrados(metros) {
  const m = Number(metros) || 0;
  return Math.floor(m / 1.5);
}

/**
 * Formata um pool de dados { dados, bonus } para string legível como "3d20+10" ou "2d20".
 */
export function formatPool(pool) {
  if (!pool) return '1d20';
  const d = Math.max(1, Number(pool.dados) || 1);
  const b = Number(pool.bonus) || 0;
  if (b === 0) return `${d}d20`;
  return `${d}d20${b > 0 ? `+${b}` : b}`;
}

/**
 * Formata um pool de dados com glifo de hexágono/d20 como no livro: "3⬡+10" ou "2⬡".
 */
export function formatPoolGlyph(pool) {
  if (!pool) return '1⬡';
  const d = Math.max(1, Number(pool.dados) || 1);
  const b = Number(pool.bonus) || 0;
  if (b === 0) return `${d}⬡`;
  return `${d}⬡${b > 0 ? `+${b}` : b}`;
}

/**
 * Faz o parse de strings como "3d20+10", "3⬡+10", "2d20-5", "4d20" em { dados, bonus }.
 */
export function parsePool(str) {
  if (!str || typeof str !== 'string') return { dados: 1, bonus: 0 };
  const cleaned = str.replace(/⬡/g, 'd20').replace(/\s+/g, '');
  const match = cleaned.match(/^(\d+)d20([+-]\d+)?$/i);
  if (match) {
    return {
      dados: Math.max(1, parseInt(match[1], 10)),
      bonus: match[2] ? parseInt(match[2], 10) : 0
    };
  }
  // Fallback: se apenas número (bônus puro)
  const numOnly = parseInt(cleaned, 10);
  if (!isNaN(numOnly)) {
    return { dados: 1, bonus: numOnly };
  }
  return { dados: 1, bonus: 0 };
}

/**
 * Normaliza um objeto cru de ficha de ameaça com garantia de integridade de campos.
 */
export function normalizeThreatSheet(raw = {}) {
  const sheet = {
    ...clone(DEFAULT_THREAT_SHEET),
    ...raw
  };

  sheet.id = String(raw.id || makeId('threat'));
  sheet.systemMode = 'threat';
  sheet.folderId = String(raw.folderId || 'folder-threats');
  sheet.favorite = Boolean(raw.favorite);
  const isDefaultOfficial = (raw.fonte === 'livro-de-regras' || raw.fonte === 'sobrevivendo-ao-horror') ||
    (raw.id && (/^threat-(livro|lr|sh)-/.test(String(raw.id)) || raw.id === 'threat-mv8mkgff-k582' || raw.id === 'threat-o-uivar-100'));
  sheet.fonte = THREAT_SOURCES.includes(raw.fonte) ? raw.fonte : (isDefaultOfficial ? 'livro-de-regras' : 'homebrew');
  sheet.isCustom = raw.isCustom !== undefined ? Boolean(raw.isCustom) : !isDefaultOfficial;
  sheet.createdAt = raw.createdAt || Date.now();
  sheet.updatedAt = raw.updatedAt || Date.now();

  sheet.categoria = raw.categoria === 'mundana' ? 'mundana' : 'paranormal';
  sheet.name = String(raw.name || (sheet.categoria === 'mundana' ? 'Novo NPC/Animal' : 'Nova Criatura')).trim();
  sheet.subtitulo = String(raw.subtitulo || '').trim();
  sheet.vd = Math.max(0, Number(raw.vd) || 60);

  // Elementos
  const validElems = Object.keys(THREAT_ELEMENTS).filter(e => e !== 'mundana');
  if (sheet.categoria === 'mundana') {
    sheet.elementos = [];
    sheet.elementoDestaque = 'mundana';
  } else {
    if (Array.isArray(raw.elementos) && raw.elementos.length > 0) {
      sheet.elementos = raw.elementos.filter(e => validElems.includes(e));
    } else {
      sheet.elementos = ['sangue'];
    }
    sheet.elementoDestaque = raw.elementoDestaque && validElems.includes(raw.elementoDestaque)
      ? raw.elementoDestaque
      : (sheet.elementos[0] || 'sangue');
  }

  sheet.tipo = String(raw.tipo || (sheet.categoria === 'mundana' ? 'Humano' : 'Criatura')).trim();
  sheet.sigiloId = raw.sigiloId || '';
  sheet.sigilImage = raw.sigilImage || '';

  // Presença Perturbadora
  const pRaw = raw.presenca || {};
  sheet.presenca = {
    ativa: sheet.categoria === 'paranormal' ? (pRaw.ativa !== false) : Boolean(pRaw.ativa),
    dt: Math.max(0, Number(pRaw.dt) || 19),
    dano: String(pRaw.dano || '3d6').trim(),
    tipoDano: String(pRaw.tipoDano || 'mental').trim(),
    imuneNex: pRaw.imuneNex === 0 || pRaw.imuneNex === '0' ? 0 : Math.max(0, Number(pRaw.imuneNex) || 35),
    texto: String(pRaw.texto || '').trim()
  };

  // Sentidos
  const sRaw = raw.sentidos || {};
  sheet.sentidos = {
    percepcao: {
      dados: Math.max(1, Number(sRaw.percepcao?.dados) || 2),
      bonus: Number(sRaw.percepcao?.bonus) || 0,
      manual: Boolean(sRaw.percepcao?.manual)
    },
    iniciativa: {
      dados: Math.max(1, Number(sRaw.iniciativa?.dados) || 2),
      bonus: Number(sRaw.iniciativa?.bonus) || 0,
      manual: Boolean(sRaw.iniciativa?.manual)
    },
    extra: String(sRaw.extra || '').trim()
  };

  // Defesa & Salvaguardas
  sheet.defesa = Math.max(0, Number(raw.defesa) || 20);
  const savRaw = raw.salvaguardas || {};
  sheet.salvaguardas = {
    fortitude: {
      dados: Math.max(1, Number(savRaw.fortitude?.dados) || 2),
      bonus: Number(savRaw.fortitude?.bonus) || 0,
      manual: Boolean(savRaw.fortitude?.manual)
    },
    reflexos: {
      dados: Math.max(1, Number(savRaw.reflexos?.dados) || 2),
      bonus: Number(savRaw.reflexos?.bonus) || 0,
      manual: Boolean(savRaw.reflexos?.manual)
    },
    vontade: {
      dados: Math.max(1, Number(savRaw.vontade?.dados) || 2),
      bonus: Number(savRaw.vontade?.bonus) || 0,
      manual: Boolean(savRaw.vontade?.manual)
    }
  };

  // Pontos de Vida
  sheet.pvMax = Math.max(1, Number(raw.pvMax ?? raw.pv) || 100);
  const pvNum = Number(raw.pv);
  sheet.pv = Math.max(0, Math.min(sheet.pvMax, (!isNaN(pvNum) && raw.pv !== null && raw.pv !== undefined) ? pvNum : sheet.pvMax));
  sheet.pvTemp = Math.max(0, Number(raw.pvTemp) || 0);
  sheet.machucadoOverride = raw.machucadoOverride !== null && raw.machucadoOverride !== undefined && !isNaN(Number(raw.machucadoOverride))
    ? Number(raw.machucadoOverride)
    : null;

  sheet.imunidades = Array.isArray(raw.imunidades) ? raw.imunidades.map(String) : [];
  sheet.resistencias = Array.isArray(raw.resistencias)
    ? raw.resistencias.map(r => ({ tipo: String(r.tipo || ''), valor: Number(r.valor) || 0 }))
    : [];
  sheet.vulnerabilidades = Array.isArray(raw.vulnerabilidades) ? raw.vulnerabilidades.map(String) : [];

  // Atributos
  const aRaw = raw.atributos || {};
  const parseAttr = (v, defaultVal = 2) => {
    if (v === 0 || v === '0' || v === '-' || v === null) return 0;
    const n = Number(v);
    return isNaN(n) ? defaultVal : Math.max(0, n);
  };
  sheet.atributos = {
    agi: parseAttr(aRaw.agi, 2),
    for: parseAttr(aRaw.for, (aRaw.for === 0 || aRaw.for === '0' || aRaw.for === '-' || aRaw.for === null ? 0 : 2)),
    int: parseAttr(aRaw.int, 1),
    pre: parseAttr(aRaw.pre, 2),
    vig: parseAttr(aRaw.vig, 2)
  };

  // Dados dos testes de resistência e sentidos seguem os atributos (salvo exceções manuais)
  applyDerivedDice(sheet);

  // Deslocamento
  const dRaw = raw.deslocamento || {};
  sheet.deslocamento = {
    tipo: String(dRaw.tipo || '').trim(),
    metros: Math.max(0, Number(dRaw.metros) || 12),
    extras: Array.isArray(dRaw.extras)
      ? dRaw.extras.map(e => ({ tipo: String(e.tipo || ''), metros: Number(e.metros) || 0 }))
      : []
  };

  // Perícias
  sheet.pericias = Array.isArray(raw.pericias)
    ? raw.pericias.map(p => ({
        id: p.id || makeId('pericia'),
        nome: String(p.nome || '').trim(),
        dados: Math.max(1, Number(p.dados) || 1),
        bonus: Number(p.bonus) || 0,
        condicional: p.condicional ? { texto: String(p.condicional.texto || ''), bonus: Number(p.condicional.bonus) || 0 } : null
      }))
    : [];

  // Seções Livres / Enigmas
  sheet.secoes = Array.isArray(raw.secoes)
    ? raw.secoes.map(s => ({
        id: s.id || makeId('sec'),
        titulo: String(s.titulo || '').trim(),
        corpo: String(s.corpo || '').trim(),
        estilo: s.estilo === 'enigma' ? 'enigma' : 'normal',
        coluna: s.coluna === 'direita' ? 'direita' : 'esquerda'
      }))
    : [];

  // Ações & Habilidades
  sheet.acoes = Array.isArray(raw.acoes)
    ? raw.acoes.map(a => ({
        id: a.id || makeId('action'),
        tipoAcao: ['padrao', 'movimento', 'completa', 'reacao', 'livre', 'passiva'].includes(a.tipoAcao) ? a.tipoAcao : 'padrao',
        nome: String(a.nome || 'Ação').trim(),
        gatilho: String(a.gatilho || '').trim(),
        custo: String(a.custo || '').trim(),
        coluna: a.coluna === 'esquerda' ? 'esquerda' : 'direita',
        usos: a.usos ? { atual: Number(a.usos.atual) || 0, max: Number(a.usos.max) || 1 } : null,
        ataques: Array.isArray(a.ataques)
          ? a.ataques.map(atk => ({
              id: atk.id || makeId('atk'),
              nome: String(atk.nome || '').trim(),
              alcance: atk.alcance || 'corpo',
              multiplicador: Number(atk.multiplicador) || 1,
              teste: { dados: Math.max(1, Number(atk.teste?.dados) || 2), bonus: Number(atk.teste?.bonus) || 0 },
              dano: String(atk.dano || '').trim(),
              tipoDano: String(atk.tipoDano || 'Impacto').trim(),
              critico: String(atk.critico || '20/x2').trim()
            }))
          : [],
        texto: String(a.texto || '').trim(),
        coluna: a.coluna === 'direita' ? 'direita' : 'esquerda',
        ativaQuando: a.ativaQuando === 'machucado' ? 'machucado' : null,
        fase: a.fase || null
      }))
    : clone(DEFAULT_THREAT_SHEET.acoes);

  // Visual
  sheet.viewMode = raw.viewMode === 'cinematic' ? 'cinematic' : 'livro';
  sheet.tokenImage = raw.tokenImage || '';
  sheet.backgroundImage = raw.backgroundImage || '';
  sheet.backgroundBlur = Math.max(0, Math.min(50, Number(raw.backgroundBlur) || 0));
  sheet.backgroundZoom = Math.max(20, Math.min(300, Number(raw.backgroundZoom) || 100));

  sheet.cinematicTokenX = Math.max(0, Math.min(100, Number(raw.cinematicTokenX) || 50));
  sheet.cinematicTokenY = Math.max(0, Math.min(100, Number(raw.cinematicTokenY) || 52));
  sheet.cinematicTokenScale = Math.max(45, Math.min(220, Number(raw.cinematicTokenScale) || 100));
  sheet.cinematicOutlineSide = ['left', 'right', 'both', 'none'].includes(raw.cinematicOutlineSide)
    ? raw.cinematicOutlineSide
    : 'left';
  sheet.cinematicOutlineIntensity = Math.max(0, Math.min(1, Number(raw.cinematicOutlineIntensity ?? 0.5)));
  sheet.cinematicOutlineWidth = Math.max(0, Math.min(10, Number(raw.cinematicOutlineWidth ?? 1.8)));
  sheet.cinematicOutlineFade = Math.max(0, Math.min(10, Number(raw.cinematicOutlineFade ?? 1.5)));
  sheet.themeColor = raw.themeColor || (sheet.categoria === 'mundana' ? '#ffffff' : '');
  sheet.diceColor = raw.diceColor || '';

  // Introdução & Arte Narrativa do Livro
  sheet.hasIntro = Boolean(raw.hasIntro || raw.introText);
  sheet.introTitle = String(raw.introTitle || '').trim();
  sheet.introText = String(raw.introText || '').trim();
  sheet.introImage = raw.introImage || '';
  sheet.introSide = ['top', 'left', 'right'].includes(raw.introSide)
    ? raw.introSide
    : (sheet.categoria === 'mundana' ? 'top' : 'left');

  // Referência do último rebalanceamento (VD e dificuldade para os quais os números foram calibrados)
  sheet.balanco = raw.balanco && typeof raw.balanco === 'object'
    ? {
        vd: Math.max(10, Math.min(400, Number(raw.balanco.vd) || sheet.vd)),
        preset: ['leve', 'equilibrada', 'editora'].includes(raw.balanco.preset) ? raw.balanco.preset : 'editora',
        slider: Math.max(-20, Math.min(20, Number(raw.balanco.slider) || 0))
      }
    : null;

  // Mesa
  sheet.condicoesAtivas = Array.isArray(raw.condicoesAtivas) ? raw.condicoesAtivas.map(String) : [];
  sheet.notasMestre = String(raw.notasMestre || '').trim();
  sheet.tipografia = {
    escala: Math.max(80, Math.min(150, Number(raw.tipografia?.escala) || 100)),
    alto_contraste: Boolean(raw.tipografia?.alto_contraste)
  };

  return sheet;
}

/**
 * Converte a ficha de ameaça em texto limpo / Markdown no formato do livro para exportação/cópia rápida.
 */
export function ameacaParaTextoLivro(sheet) {
  if (!sheet) return '';
  const s = normalizeThreatSheet(sheet);
  const mach = calcMachucado(s);
  const quad = calcQuadrados(s.deslocamento?.metros);

  let out = `**${s.name.toUpperCase()}**`;
  if (s.subtitulo) out += ` · ${s.subtitulo.toUpperCase()}`;
  out += ` (VD ${s.vd})\n`;

  const tags = [];
  if (s.elementos?.length) tags.push(s.elementos.map(e => e.toUpperCase()).join(' · '));
  if (s.tipo) tags.push(s.tipo.toUpperCase());
  if (s.tamanho) tags.push(s.tamanho.toUpperCase());
  if (tags.length) out += `${tags.join(' · ')}\n\n`;

  if (s.presenca?.ativa) {
    out += `**PRESENÇA PERTURBADORA** DT ${s.presenca.dt} · ${s.presenca.dano} ${s.presenca.tipoDano} · NEX ${s.presenca.imuneNex}%+ é imune\n`;
  }

  out += `**SENTIDOS** Percepção ${formatPool(s.sentidos.percepcao)} · Iniciativa ${formatPool(s.sentidos.iniciativa)}`;
  if (s.sentidos.extra) out += ` · ${s.sentidos.extra}`;
  out += '\n';

  out += `**DEFESA** ${s.defesa} · Fortitude ${formatPool(s.salvaguardas.fortitude)} · Reflexos ${formatPool(s.salvaguardas.reflexos)} · Vontade ${formatPool(s.salvaguardas.vontade)}\n`;

  out += `**PONTOS DE VIDA** ${s.pvMax} | ${mach} machucado\n`;
  if (s.imunidades?.length) out += `**IMUNIDADES** ${s.imunidades.join(', ')}\n`;
  if (s.resistencias?.length) out += `**RESISTÊNCIAS** ${s.resistencias.map(r => `${r.tipo} ${r.valor}`).join(', ')}\n`;
  if (s.vulnerabilidades?.length) out += `**VULNERABILIDADES** ${s.vulnerabilidades.join(', ')}\n`;

  out += `**ATRIBUTOS** AGI ${s.atributos.agi} · FOR ${s.atributos.for} · INT ${s.atributos.int} · PRE ${s.atributos.pre} · VIG ${s.atributos.vig}\n`;
  out += `**DESLOCAMENTO** ${s.deslocamento.metros}m | ${quad}□`;
  if (s.deslocamento.extras?.length) {
    out += ` (${s.deslocamento.extras.map(e => `${e.tipo} ${e.metros}m`).join(', ')})`;
  }
  out += '\n\n';

  if (s.acoes?.length) {
    out += `**AÇÕES**\n`;
    s.acoes.forEach(a => {
      out += `• **${a.tipoAcao.toUpperCase()} ◆ ${a.nome.toUpperCase()}**`;
      if (a.ataques?.length) {
        a.ataques.forEach(atk => {
          out += ` · ${atk.nome} (${atk.alcance}): Teste ${formatPool(atk.teste)} | Dano ${atk.dano} ${atk.tipoDano}`;
        });
      }
      if (a.texto) out += `\n  ${a.texto}`;
      out += '\n';
    });
  }

  return out;
}
