/**
 * Assistente de Balanceamento de Ameaças (Ordem Paranormal RPG)
 * Baseado nos parâmetros oficiais por Valor de Desafio (VD 10 a 400)
 */

export const BALANCE_BASE = [
  // [vd, pv, defesa, ataque[dados, bonus], danoMedio, resForte[d,b], resMedia[d,b], resFraca[d,b], dt, presenca[nDados,faces]|null]
  [10,  15,   14, [1, 5],   6,   [1, 5],  [1, 0],  [1, 0],  13, null],
  [20,  35,   16, [2, 5],   12,  [2, 5],  [1, 0],  [1, 0],  14, [2, 6]],
  [40,  70,   19, [2, 10],  17,  [2, 5],  [1, 5],  [1, 0],  15, [2, 8]],
  [60,  105,  21, [3, 10],  26,  [3, 10], [2, 5],  [2, 0],  19, [3, 6]],
  [80,  140,  23, [3, 10],  32,  [3, 10], [2, 5],  [2, 0],  20, [3, 8]],
  [100, 200,  25, [3, 15],  38,  [3, 10], [2, 5],  [2, 0],  21, [4, 6]],
  [120, 240,  28, [3, 15],  62,  [4, 10], [3, 10], [2, 5],  23, [4, 6]],
  [140, 280,  31, [4, 15],  69,  [4, 10], [3, 10], [2, 5],  24, [4, 8]],
  [160, 320,  34, [4, 20],  77,  [4, 10], [3, 10], [2, 5],  25, [4, 8]],
  [180, 360,  36, [4, 20],  104, [4, 15], [3, 15], [2, 10], 28, [6, 6]],
  [200, 400,  38, [4, 25],  113, [4, 15], [3, 15], [2, 10], 29, [6, 6]],
  [220, 550,  40, [5, 25],  122, [4, 15], [3, 15], [2, 10], 30, [7, 6]],
  [240, 600,  42, [5, 30],  131, [4, 20], [4, 15], [3, 10], 31, [6, 8]],
  [260, 650,  44, [5, 30],  140, [4, 20], [4, 15], [3, 10], 37, [8, 6]],
  [280, 700,  46, [5, 30],  150, [5, 20], [4, 15], [3, 10], 38, [8, 6]],
  [300, 750,  48, [5, 35],  159, [5, 25], [4, 20], [3, 15], 39, [7, 8]],
  [320, 800,  50, [5, 35],  192, [5, 25], [5, 20], [4, 15], 40, [9, 6]],
  [340, 1020, 53, [5, 35],  202, [5, 25], [5, 20], [4, 15], 41, [10, 6]],
  [360, 1080, 56, [5, 40],  212, [5, 30], [5, 25], [4, 20], 42, [8, 8]],
  [380, 1140, 58, [5, 40],  223, [5, 30], [5, 25], [5, 20], 43, [9, 8]],
  [400, 1200, 60, [5, 45],  233, [5, 35], [5, 30], [5, 25], 44, [10, 8]],
];

/**
 * Sugestões de fraquezas naturais por elemento
 */
export const ELEMENT_VULNERABILITY_HINTS = {
  sangue: { fraqueza: 'Corte', dica: 'Sangue é vulnerável a dano de Corte e ao elemento Morte.' },
  morte: { fraqueza: 'Balístico', dica: 'Morte é vulnerável a dano Balístico e ao elemento Energia.' },
  conhecimento: { fraqueza: 'Perfuração', dica: 'Conhecimento é vulnerável a dano de Perfuração e ao elemento Sangue.' },
  energia: { fraqueza: 'Impacto', dica: 'Energia é vulnerável a dano de Impacto e ao elemento Conhecimento.' },
  medo: { fraqueza: 'Enigma de Medo', dica: 'Medo não possui fraqueza física; superada resolvendo o Enigma de Medo.' }
};

/**
 * Interpola linearmente entre duas linhas de dados da tabela
 */
function interpolateRow(r1, r2, t) {
  const interp = (a, b) => Math.round(a + (b - a) * t);
  const interpPool = (p1, p2) => [
    p1[0], // Mantém quantidade de dados íntegra (não quebra probabilidade)
    Math.max(0, interp(p1[1], p2[1]))
  ];

  return [
    interp(r1[0], r2[0]),
    interp(r1[1], r2[1]),
    interp(r1[2], r2[2]),
    interpPool(r1[3], r2[3]),
    interp(r1[4], r2[4]),
    interpPool(r1[5], r2[5]),
    interpPool(r1[6], r2[6]),
    interpPool(r1[7], r2[7]),
    interp(r1[8], r2[8]),
    r1[9] && r2[9] ? [interp(r1[9][0], r2[9][0]), r1[9][1]] : (r2[9] || r1[9])
  ];
}

/**
 * Encontra a linha para um determinado VD, interpolando se necessário
 */
function getBaseRowForVd(vd) {
  const target = Math.max(10, Math.min(400, Number(vd) || 10));
  for (let i = 0; i < BALANCE_BASE.length; i++) {
    if (BALANCE_BASE[i][0] === target) return [...BALANCE_BASE[i]];
    if (BALANCE_BASE[i][0] > target) {
      if (i === 0) return [...BALANCE_BASE[0]];
      const prev = BALANCE_BASE[i - 1];
      const next = BALANCE_BASE[i];
      const t = (target - prev[0]) / (next[0] - prev[0]);
      return interpolateRow(prev, next, t);
    }
  }
  return [...BALANCE_BASE[BALANCE_BASE.length - 1]];
}

/**
 * Aplica modificadores de predefinição sobre a linha base
 * @param {Array} row - Linha base [vd, pv, def, atk, dano, resForte, resMedia, resFraca, dt, presenca]
 * @param {'editora'|'equilibrada'|'leve'} preset
 * @param {number} slider - Ajuste percentual de dificuldade (-20 a +20)
 */
export function applyPreset(row, preset = 'equilibrada', slider = 0) {
  const [vd, rawPv, rawDef, rawAtk, rawDmg, rawResForte, rawResMedia, rawResFraca, rawDt, rawPresenca] = row;
  const multSlider = 1 + (slider / 100);

  if (preset === 'editora') {
    const pv = Math.round(rawPv * multSlider);
    const dano = Math.round(rawDmg * multSlider);
    return {
      vd,
      pv,
      defesa: rawDef,
      ataque: { dados: rawAtk[0], bonus: rawAtk[1] },
      danoMedio: dano,
      resForte: { dados: rawResForte[0], bonus: rawResForte[1] },
      resMedia: { dados: rawResMedia[0], bonus: rawResMedia[1] },
      resFraca: { dados: rawResFraca[0], bonus: rawResFraca[1] },
      dt: rawDt,
      presenca: rawPresenca ? { dados: rawPresenca[0], faces: rawPresenca[1] } : null
    };
  }

  if (preset === 'leve') {
    // Leve: PV x0.65, Def -4, Atk bonus -10, dano x0.55, Res -10 só se >= +10, DT -4
    const pv = Math.round(rawPv * 0.65 * multSlider);
    const defesa = Math.max(10, rawDef - 4);
    const ataqueBonus = Math.max(0, rawAtk[1] - 10);
    const danoMedio = Math.max(4, Math.round(rawDmg * 0.55 * multSlider));
    const dt = Math.max(10, rawDt - 4);

    const modRes = (r) => ({
      dados: r[0],
      bonus: r[1] >= 10 ? Math.max(0, r[1] - 10) : r[1]
    });

    let presenca = null;
    if (rawPresenca) {
      const q = Math.max(1, Math.round(rawPresenca[0] * 0.7));
      presenca = { dados: q, faces: rawPresenca[1] };
    }

    return {
      vd,
      pv,
      defesa,
      ataque: { dados: rawAtk[0], bonus: ataqueBonus },
      danoMedio,
      resForte: modRes(rawResForte),
      resMedia: modRes(rawResMedia),
      resFraca: modRes(rawResFraca),
      dt,
      presenca
    };
  }

  // Padrão: Equilibrada
  // PV x0.8 (arredondado a 5 se >= 35), Def -2, Atk bonus -5, dano x0.75, Res -5 só se >= +10, DT -2, Presença ~85%
  let pv = Math.round(rawPv * 0.8 * multSlider);
  if (pv >= 35) pv = Math.round(pv / 5) * 5;

  const defesa = Math.max(10, rawDef - 2);
  const ataqueBonus = Math.max(0, rawAtk[1] - 5);
  const danoMedio = Math.max(5, Math.round(rawDmg * 0.75 * multSlider));
  const dt = Math.max(10, rawDt - 2);

  const modRes = (r) => ({
    dados: r[0],
    bonus: r[1] >= 10 ? Math.max(0, r[1] - 5) : r[1]
  });

  let presenca = null;
  if (rawPresenca) {
    const q = Math.max(1, Math.round(rawPresenca[0] * 0.85));
    presenca = { dados: q, faces: rawPresenca[1] };
  }

  return {
    vd,
    pv,
    defesa,
    ataque: { dados: rawAtk[0], bonus: ataqueBonus },
    danoMedio,
    resForte: modRes(rawResForte),
    resMedia: modRes(rawResMedia),
    resFraca: modRes(rawResFraca),
    dt,
    presenca
  };
}

/**
 * Sugere até 3 expressões naturais de dano em dados cuja média se aproxima de `mean`
 */
export function suggestDamage(mean) {
  const m = Math.max(4, Math.round(mean));
  const results = [];

  // d6 (média face: 3.5), d8 (4.5), d10 (5.5), d12 (6.5)
  const configs = [
    { faces: 6, avg: 3.5 },
    { faces: 8, avg: 4.5 },
    { faces: 10, avg: 5.5 },
    { faces: 12, avg: 6.5 }
  ];

  for (const c of configs) {
    const maxDice = Math.min(10, Math.max(1, Math.floor(m / c.avg)));
    const bonus = Math.round(m - (maxDice * c.avg));
    const bonusStr = bonus > 0 ? `+${bonus}` : (bonus < 0 ? `${bonus}` : '');
    const formula = `${maxDice}d${c.faces}${bonusStr}`;
    if (!results.includes(formula)) results.push(formula);
    if (results.length >= 3) break;
  }

  return results.length ? results : [`${Math.max(1, Math.round(m / 4.5))}d8`];
}

/**
 * Retorna as sugestões consolidadas para um VD
 */
export function getBalance(vd, preset = 'equilibrada', slider = 0) {
  const row = getBaseRowForVd(vd);
  const bal = applyPreset(row, preset, slider);
  bal.sugestoesDano = suggestDamage(bal.danoMedio);
  bal.machucado = Math.floor(bal.pv / 2);
  bal.imuneNex = Math.min(99, Math.max(5, Math.round((bal.vd / 20) * 5)));
  return bal;
}

/**
 * Avalia as estatísticas atuais de uma ficha contra as sugestões do seu VD
 */
export function evaluateSheet(sheet, preset = 'equilibrada') {
  const vd = sheet.vd || 60;
  const sug = getBalance(vd, preset);

  const evalField = (curr, exp, tolerance = 0.15) => {
    const c = Number(curr) || 0;
    const e = Number(exp) || 1;
    const diff = c - e;
    const pct = diff / e;
    let status = 'dentro';
    if (pct < -tolerance) status = 'abaixo';
    else if (pct > tolerance) status = 'acima';
    return { atual: c, sugerido: e, diff, status };
  };

  return {
    vd,
    preset,
    pv: evalField(sheet.pvMax || sheet.pv, sug.pv, 0.2),
    defesa: evalField(sheet.defesa, sug.defesa, 0.15),
    dtPresenca: sheet.presenca?.ativa ? evalField(sheet.presenca?.dt, sug.dt, 0.15) : null,
    fortitude: evalField(sheet.salvaguardas?.fortitude?.bonus, sug.resForte.bonus, 0.25),
    reflexos: evalField(sheet.salvaguardas?.reflexos?.bonus, sug.resMedia.bonus, 0.25),
    vontade: evalField(sheet.salvaguardas?.vontade?.bonus, sug.resFraca.bonus, 0.25),
    sugestoes: sug
  };
}

