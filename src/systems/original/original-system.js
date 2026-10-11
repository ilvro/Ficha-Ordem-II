import { ATRIBUTOS, PERICIAS, ORIGENS, PODERES_GERAIS, CLASSES, PODERES_PARANORMAIS, RITUAIS, CONDICOES } from '../../data/original-data.js';

export { ATRIBUTOS, PERICIAS, ORIGENS, PODERES_GERAIS, CLASSES, PODERES_PARANORMAIS, RITUAIS, CONDICOES };

export const TREINOS_ORIGINAL = [
  { valor: 0, nome: 'Destreinado', icone: './icons/original/untrained.svg' },
  { valor: 5, nome: 'Treinado', icone: './icons/original/trained.svg' },
  { valor: 10, nome: 'Veterano', icone: './icons/original/veteran.svg' },
  { valor: 15, nome: 'Expert', icone: './icons/original/expert.svg' },
];

export const TIERS_TRILHA = [10, 25, 40, 65, 99];

// NEX em que a tabela de classe concede "Aumento de atributo".
export const NEX_AUMENTO_ATRIBUTO = [20, 45, 80, 95];

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
  nivelTrilhaTerciaria: 1,
  versatilidadeRecusada: {},
  usaPD: false,
  aumentosAtributo: {},
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

// Sobreviventes não têm NEX: evoluem em estágios (1 a 5). Internamente o
// estágio N é guardado como nex = (N - 1) * 5, alinhado à tabelaNex da classe.
export const ESTAGIO_MAX = 5;

export function nexDoEstagio(estagio) {
  return (Math.max(1, Math.min(ESTAGIO_MAX, Math.round(Number(estagio) || 1))) - 1) * 5;
}

// Mantém o NEX dentro da faixa da classe: estágios 1–5 para sobreviventes,
// NEX 5%–99% para as demais (quem deixa de ser sobrevivente vira NEX 5%).
export function ajustarNexDaClasse(sheet) {
  const c = classeAtual(sheet);
  const nex = Number(sheet.nex) || 0;
  if (classeEhMundana(c)) sheet.nex = nexDoEstagio(Math.floor(nex / 5) + 1);
  else sheet.nex = Math.max(5, snapNex(nex));
  // Recusas de Versatilidade em NEX que a ficha deixou de ter voltam a valer
  // como pergunta quando o personagem subir de novo.
  if (sheet.versatilidadeRecusada) {
    Object.keys(sheet.versatilidadeRecusada).forEach(t => { if (Number(t) > sheet.nex) delete sheet.versatilidadeRecusada[t]; });
  }
  return sheet.nex;
}

// Todos os níveis que a classe percorre, como valores de NEX: estágios 1–5
// (0, 5, …, 20) para sobreviventes; 5%, 10%, …, 95%, 99% para as demais.
export function niveisDaClasse(sheet) {
  if (classeEhMundana(classeAtual(sheet))) return Array.from({ length: ESTAGIO_MAX }, (_, i) => i * 5);
  return [...Array.from({ length: 19 }, (_, i) => (i + 1) * 5), 99];
}

// "Estágio 3" para sobreviventes, "NEX 40%" para as demais classes.
export function rotuloNivel(sheet, nex = sheet.nex) {
  const n = Number(nex) || 0;
  return classeEhMundana(classeAtual(sheet)) ? `Estágio ${Math.floor(n / 5) + 1}` : `NEX ${n}%`;
}

// A trilha só é escolhida em NEX 10% (sobreviventes: no 2º estágio).
export function trilhaLiberada(sheet) {
  const nex = Number(sheet.nex) || 0;
  return nex >= (classeEhMundana(classeAtual(sheet)) ? nexDoEstagio(2) : TIERS_TRILHA[0]);
}

export function passosNex(sheet) {
  const c = classeAtual(sheet);
  const nexBase = (c && typeof c.nexBase === 'number') ? c.nexBase : 5;
  const nex = sheet.nex ?? 5;
  // NEX 99% é o nível seguinte a 95% (conta como 100 na progressão).
  return Math.max(0, Math.floor(((nex >= 99 ? 100 : nex) - nexBase) / 5));
}

export function estagioAtual(sheet) {
  return Math.floor((sheet.nex ?? 0) / 5) + 1;
}

export function origemAtual(sheet) {
  return ORIGENS.find(o => o.id === sheet.origemId) || ORIGENS[0];
}

export function trilhaAtual(sheet) {
  const c = classeAtual(sheet);
  if (!c || !c.trilhas || !trilhaLiberada(sheet)) return null;
  return c.trilhas.find(t => t.id === sheet.trilhaId) || c.trilhas[0] || null;
}

// Homebrew: Versatilidade é um poder de classe que pode ser escolhido várias
// vezes — cada escolha concede a próxima habilidade de uma segunda trilha.
export function contarVersatilidade(sheet) {
  return Array.isArray(sheet.poderesEscolhidos) ? sheet.poderesEscolhidos.filter(p => p.nome === 'Versatilidade').length : 0;
}

export function temVersatilidade(sheet) {
  return contarVersatilidade(sheet) > 0;
}

export function temAprimoramentoDeOrigem(sheet) {
  return temPoderEscolhido(sheet, 'Aprimoramento de Origem');
}

// Aprimoramento da origem atual, se a ficha tiver o poder de classe.
export function aprimoramentoDeOrigemAtual(sheet) {
  if (!temAprimoramentoDeOrigem(sheet)) return null;
  return origemAtual(sheet)?.aprimoramento || null;
}

// Poderes que o jogador ESCOLHE (de classe + gerais) e que ainda não estão na
// ficha. Habilidades de trilha não entram: são fixas e destravam por NEX.
export function poderesDisponiveis(sheet) {
  const c = classeAtual(sheet);
  const ja = new Set((sheet.poderesEscolhidos || []).map(p => p.nome));
  const daClasse = (c?.poderes || [])
    .filter(p => (p.repetivel || !ja.has(p.nome)) && poderValeNaRegra(p, sheet))
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
  if (!c || !c.trilhas || !sheet.trilhaSecundariaId || !temVersatilidade(sheet)) return null;
  if (sheet.trilhaSecundariaId === trilhaAtual(sheet)?.id) return null;
  return c.trilhas.find(t => t.id === sheet.trilhaSecundariaId) || null;
}

export function trilhaTerciariaAtual(sheet) {
  const c = classeAtual(sheet);
  if (!c || !c.trilhas || !sheet.trilhaTerciariaId || !temVersatilidadeAmplificada(sheet)) return null;
  if ([trilhaAtual(sheet)?.id, sheet.trilhaSecundariaId].includes(sheet.trilhaTerciariaId)) return null;
  return c.trilhas.find(t => t.id === sheet.trilhaTerciariaId) || null;
}

// Quantas habilidades das trilhas extras a ficha tem. Cada Versatilidade vale
// um nível; Versatilidade Amplificada vale mais um, que vai para a trilha
// secundária ou abre uma terceira trilha (que pode receber outros níveis).
export function niveisDeTrilhasExtras(sheet) {
  const total = contarVersatilidade(sheet) + (temVersatilidadeAmplificada(sheet) ? 1 : 0);
  let terciaria = 0;
  if (trilhaTerciariaAtual(sheet)) {
    terciaria = Math.max(1, Math.min(Number(sheet.nivelTrilhaTerciaria) || 1, Math.max(1, total - 1)));
  }
  return { total, secundaria: Math.max(0, total - terciaria), terciaria };
}

// Habilidades de trilha que a ficha possui: as da trilha principal destravam
// por NEX; as das trilhas extras somam-se a elas, na ordem, uma por nível.
export function progressaoDeTrilhas(sheet) {
  const nex = Number(sheet.nex) || 0;
  const itens = [];
  const principal = trilhaAtual(sheet);
  if (principal) {
    principal.poderes.filter(p => p.nex <= nex).forEach(poder => itens.push({ tier: poder.nex, alvo: 'principal', trilhaObj: principal, poder }));
  }
  if (classeEhMundana(classeAtual(sheet))) return itens;
  const niveis = niveisDeTrilhasExtras(sheet);
  [['secundaria', trilhaSecundariaAtual(sheet)], ['terciaria', trilhaTerciariaAtual(sheet)]].forEach(([alvo, trilhaObj]) => {
    if (!trilhaObj) return;
    [...trilhaObj.poderes].sort((x, y) => x.nex - y.nex)
      .slice(0, niveis[alvo])
      .filter(p => p.nex <= nex)
      .forEach(poder => itens.push({ tier: poder.nex, alvo, trilhaObj, poder }));
  });
  return itens;
}

// Homebrew: nos NEX em que a trilha avança (25%, 40%, 65%, 99%) o personagem
// também ganha um poder de classe, que pode virar Versatilidade. Devolve o
// primeiro desses NEX em que a ficha ainda não decidiu, ou null.
export function pendenciaDeTrilha(sheet) {
  const c = classeAtual(sheet);
  if (classeEhMundana(c)) return null;
  const principal = trilhaAtual(sheet);
  if (!principal) return null;
  const nex = Number(sheet.nex) || 0;
  const abertos = TIERS_TRILHA.filter(t => t > TIERS_TRILHA[0] && t <= nex && !sheet.versatilidadeRecusada?.[t]);
  const tier = abertos[contarVersatilidade(sheet)];
  if (!tier) return null;
  const ordenar = t => [...t.poderes].sort((x, y) => x.nex - y.nex);
  const secundaria = trilhaSecundariaAtual(sheet);
  return {
    tier,
    principal,
    poderPrincipal: principal.poderes.find(p => p.nex === tier) || null,
    secundaria,
    proximoPoderSecundaria: secundaria ? (ordenar(secundaria)[niveisDeTrilhasExtras(sheet).secundaria] || null) : null,
    opcoes: (c.trilhas || []).filter(t => t.id !== principal.id).map(t => ({ id: t.id, nome: t.nome, primeiroPoder: ordenar(t)[0]?.nome || '' })),
  };
}

// Usa o poder de classe do NEX pendente em Versatilidade.
export function aplicarVersatilidade(sheet, trilhaSecundariaId) {
  const c = classeAtual(sheet);
  const poder = (c.poderes || []).find(p => p.nome === 'Versatilidade');
  if (!poder) return false;
  if (!sheet.trilhaSecundariaId || sheet.trilhaSecundariaId === trilhaAtual(sheet)?.id) {
    if (!trilhaSecundariaId || trilhaSecundariaId === trilhaAtual(sheet)?.id) return false;
    sheet.trilhaSecundariaId = trilhaSecundariaId;
  }
  if (!Array.isArray(sheet.poderesEscolhidos)) sheet.poderesEscolhidos = [];
  sheet.poderesEscolhidos.push({ nome: poder.nome, descricao: poder.descricao, preRequisito: poder.preRequisito, origemTipo: `Poder de ${c.nome}`, bonus: null });
  return true;
}

export function recusarVersatilidade(sheet, tier) {
  if (!sheet.versatilidadeRecusada) sheet.versatilidadeRecusada = {};
  sheet.versatilidadeRecusada[tier] = true;
}

// Homebrew: aumentos de atributo não são retroativos. Se a ficha informa em
// qual NEX cada aumento foi para o atributo, os níveis anteriores usam o valor
// antigo; aumentos não informados contam como se o atributo sempre fosse o atual.
function atributoNoNex(sheet, attr, nexDoNivel) {
  const atual = Number(sheet.atributos?.[attr]) || 0;
  if (classeEhMundana(classeAtual(sheet))) return atual;
  const nex = Number(sheet.nex) || 0;
  const posteriores = NEX_AUMENTO_ATRIBUTO.filter(n => n <= nex && n > nexDoNivel && sheet.aumentosAtributo?.[n] === attr).length;
  return Math.max(0, atual - posteriores);
}

// Soma do atributo ganho em cada nível depois do primeiro.
function somaAtributoPorNivel(sheet, attr) {
  const c = classeAtual(sheet);
  const nexBase = (c && typeof c.nexBase === 'number') ? c.nexBase : 5;
  let soma = 0;
  for (let i = 1; i <= passosNex(sheet); i++) soma += atributoNoNex(sheet, attr, Math.min(99, nexBase + i * 5));
  return soma;
}

function bonusFixoPorNex(sheet, recurso) {
  const nex = Number(sheet.nex) || 0;
  return (classeAtual(sheet).bonusPorNex || []).reduce((acc, b) => acc + (b.nex <= nex ? (Number(b[recurso]) || 0) : 0), 0);
}

function somaPorEstagioAlcancado(mapa, estagioAtualVal) {
  if (!mapa) return 0;
  return Object.keys(mapa).reduce((acc, k) => acc + (parseInt(k, 10) <= estagioAtualVal ? mapa[k] : 0), 0);
}

function temPoderEscolhido(sheet, nome) {
  return Array.isArray(sheet.poderesEscolhidos) && sheet.poderesEscolhidos.some(p => p.nome === nome);
}

// Regra opcional "Jogando sem Sanidade": PE e SAN dão lugar aos Pontos de
// Determinação. Na ficha o PD ocupa o lugar do PE (mesmos campos `pe`/`peTemp`
// e as mesmas mecânicas de gasto e limite por turno) e a Sanidade deixa de existir.
export function usaPD(sheet) {
  return !!sheet?.usaPD;
}

// Poderes marcados com "regra" só valem em uma das regras de recursos.
export function poderValeNaRegra(poder, sheet) {
  return !poder.regra || poder.regra === (usaPD(sheet) ? 'pd' : 'pesan');
}

// Troca a regra de recursos da ficha. Com PD, Sanidade Aprimorada e Esforço
// Aprimorado viram Determinação Aprimorada; na volta, ela vira Esforço
// Aprimorado (não há como saber qual das duas era). Os pontos recomeçam cheios.
export function definirRegraDeRecursos(sheet, comPD) {
  sheet.usaPD = !!comPD;
  const c = classeAtual(sheet);
  const trocas = sheet.usaPD
    ? { 'Sanidade Aprimorada': 'Determinação Aprimorada', 'Esforço Aprimorado': 'Determinação Aprimorada' }
    : { 'Determinação Aprimorada': 'Esforço Aprimorado' };
  const vistos = new Set();
  sheet.poderesEscolhidos = (sheet.poderesEscolhidos || []).map(p => {
    const novo = (c.poderes || []).find(x => x.nome === trocas[p.nome]);
    return novo ? { ...p, nome: novo.nome, descricao: novo.descricao, preRequisito: novo.preRequisito, bonus: novo.bonus || null } : p;
  }).filter(p => {
    if (!Object.values(trocas).includes(p.nome)) return true;
    if (vistos.has(p.nome)) return false;
    vistos.add(p.nome);
    return true;
  });
  sheet.pv = calcPvMax(sheet);
  sheet.pe = calcPeMax(sheet);
  sheet.peTemp = 0;
  sheet.san = calcSanMax(sheet);
}

export function calcPvMax(sheet) {
  const c = classeAtual(sheet);
  const steps = passosNex(sheet);
  const vig = Number(sheet.atributos?.vig) || 0;
  const nexBase = typeof c.nexBase === 'number' ? c.nexBase : 5;
  const t = trilhaAtual(sheet);
  const estagio = estagioAtual(sheet);

  let progressaoPv = steps * c.pv.porNex + (c.escalaAtributoPorNex === false ? 0 : somaAtributoPorNivel(sheet, 'vig'));
  if (t && t.pvSubstituiProgressao) {
    progressaoPv = somaPorEstagioAlcancado(t.pvSubstituiProgressao, estagio);
  }

  const bonusTrilha = (t && t.pvBonusPorEstagio) ? somaPorEstagioAlcancado(t.pvBonusPorEstagio, estagio) : 0;
  const bonusSaude = temPoderEscolhido(sheet, 'Saúde Aprimorada') ? 5 : 0;
  const bonus = Number(sheet.bonusTransicao?.pv) || 0;

  return c.pv.base + (vig ? atributoNoNex(sheet, 'vig', nexBase) : 0) + progressaoPv + bonusTrilha + bonusSaude + bonus + bonusFixoPorNex(sheet, 'pv');
}

export function calcPeMax(sheet) {
  const c = classeAtual(sheet);
  const steps = passosNex(sheet);
  const pre = Number(sheet.atributos?.pre) || 0;
  const nexBase = typeof c.nexBase === 'number' ? c.nexBase : 5;
  const recurso = usaPD(sheet) && c.pd ? c.pd : c.pe;
  const progressaoPe = steps * recurso.porNex + (c.escalaAtributoPorNex === false ? 0 : somaAtributoPorNivel(sheet, 'pre'));
  const bonusEsforco = usaPD(sheet)
    ? (temPoderEscolhido(sheet, 'Determinação Aprimorada') ? 3 : 0)
    : (temPoderEscolhido(sheet, 'Esforço Aprimorado') ? 5 : 0);
  const bonus = Number(sheet.bonusTransicao?.pe) || 0;

  return recurso.base + (pre ? atributoNoNex(sheet, 'pre', nexBase) : 0) + progressaoPe + bonusEsforco + bonus + bonusFixoPorNex(sheet, 'pe');
}

export function calcSanMax(sheet) {
  if (usaPD(sheet)) return 0;
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

  progressaoDeTrilhas(sheet).forEach(item => considerar(item.poder));
  return soma;
}

export function periciasTreinadasDaOrigem(sheet) {
  const o = origemAtual(sheet);
  if (!o) return [];
  const extra = aprimoramentoDeOrigemAtual(sheet)?.pericia;
  return extra ? [...(o.pericias || []), extra] : (o.pericias || []);
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
  sheet.nivelTrilhaTerciaria = Math.max(1, Number(raw.nivelTrilhaTerciaria) || 1);
  sheet.aumentosAtributo = (raw.aumentosAtributo && typeof raw.aumentosAtributo === 'object') ? { ...raw.aumentosAtributo } : {};
  delete sheet.trilhaTierAtribuicoes;
  sheet.usaPD = !!raw.usaPD;
  // Fichas antigas não são questionadas sobre os NEX que já passaram.
  sheet.versatilidadeRecusada = (raw.versatilidadeRecusada && typeof raw.versatilidadeRecusada === 'object')
    ? { ...raw.versatilidadeRecusada }
    : Object.fromEntries(TIERS_TRILHA.filter(t => t <= (Number(raw.nex) || 0)).map(t => [t, true]));
  sheet.nex = Math.max(0, Math.min(99, Number(raw.nex ?? 5)));
  ajustarNexDaClasse(sheet);

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

