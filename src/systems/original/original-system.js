import { ATRIBUTOS, PERICIAS, ORIGENS, PODERES_GERAIS, CLASSES, PODERES_PARANORMAIS, RITUAIS, CONDICOES } from '../../data/original-data.js';

export { ATRIBUTOS, PERICIAS, ORIGENS, PODERES_GERAIS, CLASSES, PODERES_PARANORMAIS, RITUAIS, CONDICOES };

export const TREINOS_ORIGINAL = [
  { valor: 0, nome: 'Destreinado', icone: './icons/original/untrained.svg' },
  { valor: 5, nome: 'Treinado', icone: './icons/original/trained.svg' },
  { valor: 10, nome: 'Veterano', icone: './icons/original/veteran.svg' },
  { valor: 15, nome: 'Expert', icone: './icons/original/expert.svg' },
];

export const TIERS_TRILHA = [10, 25, 40, 65, 99];

export const ICONES_RECURSO = {
  pv: {
    full: './icons/original/pv-full.svg',
    half: './icons/original/pv-half.svg',
    low: './icons/original/pv-low.svg',
    empty: './icons/original/pv-empty.svg',
  },
  san: {
    full: './icons/original/sanity-full.svg',
    half: './icons/original/sanity-half.svg',
    low: './icons/original/sanity-low.svg',
    empty: './icons/original/sanity-empty.svg',
  },
  pe: {
    full: './icons/original/effort-full.svg',
    half: './icons/original/effort-half.svg',
    empty: './icons/original/effort-empty.svg',
  },
};

export const DEFAULT_ORIGINAL_SHEET = {
  systemMode: 'original',
  name: 'NOVO AGENTE',
  jogador: '',
  origemId: 'acadêmico',
  classeId: 'combatente',
  trilhaId: 'aniquilador',
  trilhaSecundariaId: '',
  trilhaTerciariaId: '',
  trilhaTierAtribuicoes: {},
  nex: 5,
  atributos: { for: 2, agi: 2, vig: 2, int: 1, pre: 1 },
  pv: 22,
  maxPv: 22,
  pvTemp: 0,
  pvMarcas: 0,
  pe: 3,
  maxPe: 3,
  peTemp: 0,
  san: 15,
  maxSan: 15,
  sanTemp: 0,
  sanMarcas: 0,
  defesaOutros: 0,
  deslocamento: '9m (6q)',
  pericias: {},
  skills: [],
  cards: [],
  ataques: [],
  poderesEscolhidos: [],
  poderesCustomizados: [],
  poderesParanormais: [],
  rituaisConhecidos: [],
  inventario: [],
  condicoesAtivas: [],
  history: '',
  tokenImage: '',
  backgroundImage: '',
  backgroundBlur: 0,
  backgroundZoom: 100,
  diceColor: '',
  themeColor: '',
  viewMode: 'cinematic',
  cinematicTokenX: 50,
  cinematicTokenY: 52,
  cinematicTokenScale: 100,
  cinematicOutlineSide: 'left',
  cinematicOutlineIntensity: 0.5,
  cinematicOutlineWidth: 1.8,
  cinematicOutlineFade: 1.5,
  cinematicCollapsed: { abilities: false, items: true, history: true }
};

export function classeAtual(sheet) {
  return CLASSES[sheet.classeId] || CLASSES.combatente;
}

export function classeEhMundana(classeObj) {
  return !!(classeObj && classeObj.mundano);
}

// NEX só existe em passos de 5% (0, 5, ..., 95) e no teto de 99%.
export function snapNex(value) {
  const n = Math.max(0, Math.min(100, Number(value) || 0));
  return n > 95 ? 99 : Math.round(n / 5) * 5;
}

export function passosNex(sheet) {
  const c = classeAtual(sheet);
  const nexBase = (c && typeof c.nexBase === 'number') ? c.nexBase : 5;
  return Math.max(0, Math.floor(((sheet.nex ?? 5) - nexBase) / 5));
}

export function estagioAtual(sheet) {
  return Math.floor((sheet.nex ?? 0) / 5) + 1;
}

export function origemAtual(sheet) {
  return ORIGENS.find(o => o.id === sheet.origemId) || ORIGENS[0];
}

export function trilhaAtual(sheet) {
  const c = classeAtual(sheet);
  if (!c || !c.trilhas) return null;
  return c.trilhas.find(t => t.id === sheet.trilhaId) || c.trilhas[0] || null;
}

export function temVersatilidade(sheet) {
  return Array.isArray(sheet.poderesEscolhidos) && sheet.poderesEscolhidos.some(p => p.nome === 'Versatilidade');
}

// Poderes que o jogador ESCOLHE (de classe + gerais) e que ainda não estão na
// ficha. Habilidades de trilha não entram: são fixas e destravam por NEX.
export function poderesDisponiveis(sheet) {
  const c = classeAtual(sheet);
  const ja = new Set((sheet.poderesEscolhidos || []).map(p => p.nome));
  const daClasse = (c?.poderes || [])
    .filter(p => !ja.has(p.nome))
    .map(p => ({ label: p.nome, nome: p.nome, descricao: p.descricao, preRequisito: p.preRequisito, origemTipo: `Poder de ${c.nome}`, bonus: p.bonus || null }));
  const gerais = PODERES_GERAIS
    .filter(p => !ja.has(p.nome))
    .map(p => ({ label: `${p.nome} (Geral)`, nome: p.nome, descricao: p.descricao, preRequisito: p.preRequisito, origemTipo: 'Poder Geral', bonus: p.bonus || null }));
  return [...daClasse, ...gerais];
}

export function temVersatilidadeAmplificada(sheet) {
  return Array.isArray(sheet.poderesParanormais) && sheet.poderesParanormais.some(p => p.nome === 'Versatilidade Amplificada');
}

export function trilhaSecundariaAtual(sheet) {
  const c = classeAtual(sheet);
  if (!c || !c.trilhas || !sheet.trilhaSecundariaId) return null;
  return c.trilhas.find(t => t.id === sheet.trilhaSecundariaId) || null;
}

export function trilhaTerciariaAtual(sheet) {
  const c = classeAtual(sheet);
  if (!c || !c.trilhas || !sheet.trilhaTerciariaId || !temVersatilidadeAmplificada(sheet)) return null;
  return c.trilhas.find(t => t.id === sheet.trilhaTerciariaId) || null;
}

export function trilhaAtribuidaNoTier(sheet, tier) {
  return sheet.trilhaTierAtribuicoes?.[tier] || 'principal';
}

export function progressaoDeTrilhas(sheet) {
  const contadores = { principal: 0, secundaria: 0, terciaria: 0 };
  const trilhaPorAlvo = {
    principal: trilhaAtual(sheet),
    secundaria: trilhaSecundariaAtual(sheet),
    terciaria: trilhaTerciariaAtual(sheet),
  };
  return TIERS_TRILHA.filter(tier => tier <= sheet.nex).map(tier => {
    const alvo = trilhaAtribuidaNoTier(sheet, tier);
    const trilhaObj = trilhaPorAlvo[alvo] || trilhaPorAlvo.principal;
    if (!trilhaObj) return { tier, alvo, trilhaObj: null, poder: null };
    const poderesOrdenados = [...trilhaObj.poderes].sort((a, b) => a.nex - b.nex);
    const idx = contadores[alvo] || 0;
    contadores[alvo] = idx + 1;
    return { tier, alvo, trilhaObj, poder: poderesOrdenados[idx] || null };
  });
}

function somaPorEstagioAlcancado(mapa, estagioAtualVal) {
  if (!mapa) return 0;
  return Object.keys(mapa).reduce((acc, k) => acc + (parseInt(k, 10) <= estagioAtualVal ? mapa[k] : 0), 0);
}

function temPoderEscolhido(sheet, nome) {
  return Array.isArray(sheet.poderesEscolhidos) && sheet.poderesEscolhidos.some(p => p.nome === nome);
}

export function calcPvMax(sheet) {
  const c = classeAtual(sheet);
  const steps = passosNex(sheet);
  const vig = Number(sheet.atributos?.vig) || 0;
  const somaAtributo = c.escalaAtributoPorNex === false ? 0 : vig;
  const t = trilhaAtual(sheet);
  const estagio = estagioAtual(sheet);

  let progressaoPv = steps * (c.pv.porNex + somaAtributo);
  if (t && t.pvSubstituiProgressao) {
    progressaoPv = somaPorEstagioAlcancado(t.pvSubstituiProgressao, estagio);
  }

  const bonusTrilha = (t && t.pvBonusPorEstagio) ? somaPorEstagioAlcancado(t.pvBonusPorEstagio, estagio) : 0;
  const bonusSaude = temPoderEscolhido(sheet, 'Saúde Aprimorada') ? 5 : 0;
  const bonus = Number(sheet.bonusTransicao?.pv) || 0;

  return c.pv.base + vig + progressaoPv + bonusTrilha + bonusSaude + bonus;
}

export function calcPeMax(sheet) {
  const c = classeAtual(sheet);
  const steps = passosNex(sheet);
  const pre = Number(sheet.atributos?.pre) || 0;
  const somaAtributo = c.escalaAtributoPorNex === false ? 0 : pre;
  const bonusEsforco = temPoderEscolhido(sheet, 'Esforço Aprimorado') ? 5 : 0;
  const bonus = Number(sheet.bonusTransicao?.pe) || 0;

  return c.pe.base + pre + steps * (c.pe.porNex + somaAtributo) + bonusEsforco + bonus;
}

export function calcSanMax(sheet) {
  const c = classeAtual(sheet);
  const steps = passosNex(sheet);
  const bonusSanidade = temPoderEscolhido(sheet, 'Sanidade Aprimorada') ? 5 : 0;
  return c.san.base + steps * c.san.porNex + bonusSanidade;
}

export function calcPePorTurno(sheet) {
  const c = classeAtual(sheet);
  if (classeEhMundana(c)) return 2;
  return 2 + passosNex(sheet);
}

export function calcDefesa(sheet) {
  const agi = Number(sheet.atributos?.agi) || 0;
  const outros = Number(sheet.defesaOutros) || 0;
  return 10 + agi + outros;
}

export function calcDtRituais(sheet) {
  const peTurno = calcPePorTurno(sheet);
  const pre = Number(sheet.atributos?.pre) || 0;
  return 10 + peTurno + pre;
}

export function calcCargaMax(sheet) {
  const forca = Number(sheet.atributos?.for) || 0;
  return forca <= 0 ? 2 : forca * 5;
}

export function calcCargaAtual(sheet) {
  if (!Array.isArray(sheet.inventario)) return 0;
  return sheet.inventario.reduce((acc, it) => acc + ((Number(it.espaco) || 1) * (Number(it.qtd) || 1)), 0);
}

export function getPatente(sheet) {
  const nex = Number(sheet.nex) || 0;
  if (nex <= 15) return 'Recruta';
  if (nex <= 35) return 'Operador';
  if (nex <= 60) return 'Agente Especial';
  if (nex <= 80) return 'Oficial de Operações';
  return 'Agente de Elite';
}

export function contarNexImpar(nex) {
  let count = 0;
  for (let n = 5; n <= nex; n += 10) count++;
  return count;
}

export function valorBonusPoder(sheet, bonus) {
  if (!bonus) return 0;
  if (bonus.formula === 'fixo') return Number(bonus.valor) || 0;
  if (bonus.formula === 'porNex5') return Math.floor((Number(sheet.nex) || 0) / 5) * (Number(bonus.valor) || 0);
  if (bonus.formula === 'porNexImpar') return contarNexImpar(Number(sheet.nex) || 0) * (Number(bonus.valor) || 0);
  return 0;
}

export function bonusLabel(sheet, bonus) {
  if (!bonus) return '';
  if (typeof bonus === 'string') return bonus;
  if (bonus.pericia) {
    const per = PERICIAS.find(p => p.id === bonus.pericia);
    const nomePer = per ? per.nome : bonus.pericia;
    if (bonus.formula === 'fixo') return `+${bonus.valor} em ${nomePer}`;
    return `+${valorBonusPoder(sheet, bonus)} em ${nomePer} (escala com NEX)`;
  }
  return '';
}

export function bonusPoderesPorPericia(sheet) {
  const soma = {};
  function considerar(fonte) {
    if (!fonte || !fonte.bonus || !fonte.bonus.pericia) return;
    const v = valorBonusPoder(sheet, fonte.bonus);
    if (v) soma[fonte.bonus.pericia] = (soma[fonte.bonus.pericia] || 0) + v;
  }
  const o = origemAtual(sheet);
  if (o) considerar(o.poder);
  if (Array.isArray(sheet.poderesEscolhidos)) sheet.poderesEscolhidos.forEach(considerar);
  if (Array.isArray(sheet.poderesParanormais)) sheet.poderesParanormais.forEach(considerar);
  if (Array.isArray(sheet.poderesCustomizados)) sheet.poderesCustomizados.forEach(considerar);

  const t = trilhaAtual(sheet);
  const tSec = trilhaSecundariaAtual(sheet);
  const mundana = classeEhMundana(classeAtual(sheet));
  if (t && (mundana || !temVersatilidade(sheet))) {
    t.poderes.filter(p => p.nex <= sheet.nex).forEach(considerar);
  } else if (t && tSec) {
    progressaoDeTrilhas(sheet).forEach(item => considerar(item.poder));
  } else if (t) {
    t.poderes.filter(p => p.nex <= sheet.nex).forEach(considerar);
  }
  return soma;
}

export function periciasTreinadasDaOrigem(sheet) {
  const o = origemAtual(sheet);
  return o ? (o.pericias || []) : [];
}

export function normalizeOriginalSheet(raw = {}) {
  const sheet = { ...DEFAULT_ORIGINAL_SHEET, ...raw };
  sheet.id = raw.id || `sheet-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  sheet.systemMode = 'original';

  sheet.atributos = {
    for: Number(raw.atributos?.for ?? 2),
    agi: Number(raw.atributos?.agi ?? 2),
    vig: Number(raw.atributos?.vig ?? 2),
    int: Number(raw.atributos?.int ?? 1),
    pre: Number(raw.atributos?.pre ?? 1),
  };

  const pericias = {};
  PERICIAS.forEach(p => {
    const existing = raw.pericias?.[p.id];
    pericias[p.id] = {
      treino: Number(existing?.treino ?? 0),
      extra: Number(existing?.extra ?? 0),
    };
  });
  sheet.pericias = pericias;

  sheet.origemId = raw.origemId || ORIGENS[0].id;
  sheet.classeId = raw.classeId || 'combatente';
  sheet.trilhaId = raw.trilhaId || CLASSES[sheet.classeId]?.trilhas?.[0]?.id || '';
  sheet.trilhaSecundariaId = raw.trilhaSecundariaId || '';
  sheet.trilhaTerciariaId = raw.trilhaTerciariaId || '';
  sheet.trilhaTierAtribuicoes = raw.trilhaTierAtribuicoes || {};
  sheet.nex = Math.max(0, Math.min(99, Number(raw.nex ?? 5)));

  sheet.maxPv = calcPvMax(sheet);
  sheet.pv = raw.pv !== undefined ? Number(raw.pv) : sheet.maxPv;
  sheet.pvTemp = Number(raw.pvTemp) || 0;
  sheet.pvMarcas = Number(raw.pvMarcas) || 0;

  sheet.maxPe = calcPeMax(sheet);
  sheet.pe = raw.pe !== undefined ? Number(raw.pe) : sheet.maxPe;
  sheet.peTemp = Number(raw.peTemp) || 0;

  sheet.maxSan = calcSanMax(sheet);
  sheet.san = raw.san !== undefined ? Number(raw.san) : sheet.maxSan;
  sheet.sanTemp = Number(raw.sanTemp) || 0;
  sheet.sanMarcas = Number(raw.sanMarcas) || 0;

  sheet.defesaOutros = Number(raw.defesaOutros) || 0;
  sheet.deslocamento = raw.deslocamento || '9m (6q)';

  sheet.skills = Array.isArray(raw.skills) ? raw.skills : [];
  sheet.cards = Array.isArray(raw.cards) ? raw.cards : [];
  sheet.ataques = Array.isArray(raw.ataques) ? raw.ataques : [];
  sheet.poderesEscolhidos = Array.isArray(raw.poderesEscolhidos) ? raw.poderesEscolhidos : [];
  sheet.poderesParanormais = Array.isArray(raw.poderesParanormais) ? raw.poderesParanormais : [];
  sheet.poderesCustomizados = Array.isArray(raw.poderesCustomizados) ? raw.poderesCustomizados : [];
  sheet.rituaisConhecidos = Array.isArray(raw.rituaisConhecidos) ? raw.rituaisConhecidos : [];
  sheet.inventario = Array.isArray(raw.inventario) ? raw.inventario : [];
  sheet.condicoesAtivas = Array.isArray(raw.condicoesAtivas) ? raw.condicoesAtivas : [];

  sheet.diceColor = typeof raw.diceColor === 'string' ? raw.diceColor : '';
  sheet.themeColor = typeof raw.themeColor === 'string' ? raw.themeColor : '';
  sheet.viewMode = raw.viewMode === 'traditional' ? 'traditional' : 'cinematic';
  sheet.cinematicTokenX = Math.max(0, Math.min(100, Number(raw.cinematicTokenX ?? 50)));
  sheet.cinematicTokenY = Math.max(0, Math.min(100, Number(raw.cinematicTokenY ?? 52)));
  sheet.cinematicTokenScale = Math.max(45, Math.min(220, Number(raw.cinematicTokenScale ?? 100)));
  sheet.cinematicOutlineSide = ['left', 'right', 'both', 'none'].includes(raw.cinematicOutlineSide) ? raw.cinematicOutlineSide : 'left';
  sheet.cinematicOutlineIntensity = Math.max(0, Math.min(1, Number(raw.cinematicOutlineIntensity ?? 0.5)));
  sheet.cinematicOutlineWidth = Math.max(0, Math.min(10, Number(raw.cinematicOutlineWidth ?? 1.8)));
  sheet.cinematicOutlineFade = Math.max(0, Math.min(10, Number(raw.cinematicOutlineFade ?? 1.5)));
  sheet.backgroundBlur = Math.max(0, Math.min(50, Number(raw.backgroundBlur ?? 0)));
  sheet.backgroundZoom = Math.max(20, Math.min(300, Number(raw.backgroundZoom ?? 100)));
  sheet.cinematicCollapsed = { abilities: false, combat: false, rituals: false, items: true, history: true, ...(raw.cinematicCollapsed || {}) };

  return sheet;
}

export function getIconeRecurso(tipo, atual, max) {
  const icons = ICONES_RECURSO[tipo];
  if (!icons) return '';
  if (atual <= 0) return icons.empty || icons.low || icons.full;
  const pct = max > 0 ? (atual / max) : 0;
  if (tipo === 'pe') {
    return pct > 0.5 ? icons.full : (pct > 0 ? icons.half : icons.empty);
  }
  return pct > 0.5 ? icons.full : (pct >= 0.25 ? icons.half : icons.low);
}

