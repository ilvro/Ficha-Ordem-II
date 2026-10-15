#!/usr/bin/env node
/**
 * Adiciona ao sheets.json as ameaças mundanas (animais) do livro
 * "Ordem Paranormal - Sobrevivendo ao Horror" (pp. 163-165).
 * Idempotente: fichas com o mesmo id são ignoradas.
 *   node scripts/add-book-animals.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeThreatSheet } from '../src/systems/threat/threat-system.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sheetsPath = path.join(root, 'sheets.json');

const p = (dados, bonus = 0) => ({ dados, bonus });
const ataque = (nome, { x = 1, teste, dano, tipoDano, crit = 20 }) => ({
  nome, alcance: 'corpo', multiplicador: x, teste, dano, tipoDano, critico: `${crit}/x${x}`
});
const agredir = (...ataques) => ({ tipoAcao: 'padrao', nome: 'Agredir', ataques, coluna: 'direita' });
const acao = (tipoAcao, nome, texto) => ({ tipoAcao, nome, texto, ataques: [], coluna: 'direita' });
const secao = (titulo, corpo) => ({ titulo, corpo, estilo: 'normal', coluna: 'esquerda' });

const ANIMAIS = [
  {
    slug: 'ariranha', name: 'ARIRANHA', vd: 20, tamanho: 'Médio',
    intro: 'Característico do Pantanal e de partes do Rio Amazonas, este animal de comportamento brincalhão é um predador corajoso e habilidoso. Vive em bandos familiares, que se protegem mutuamente, sendo capazes de derrotar oponentes muito maiores.',
    sentidos: { percepcao: p(1, 5), iniciativa: p(2, 5), extra: 'Faro, visão na penumbra' },
    defesa: 16, salvaguardas: { fortitude: p(2), reflexos: p(2, 5), vontade: p(1) },
    pvMax: 32, deslocamento: { metros: 12, extras: [{ tipo: 'Natação', metros: 9 }] },
    atributos: { agi: 2, for: 1, int: 0, pre: 1, vig: 2 },
    secoes: [
      secao('EVASÃO', 'Quando sofre um ataque que permite um teste de Reflexos para reduzir o dano à metade, a ariranha não sofre dano algum se passar.'),
      secao('TÁTICAS FAMILIARES', 'A ariranha recebe +2 em testes de ataque e rolagens de dano para cada outra ariranha que esteja atacando o mesmo oponente na mesma rodada.')
    ],
    acoes: [agredir(ataque('MORDIDA', { teste: p(2, 5), dano: '2d4+2', tipoDano: 'Corte' }))]
  },
  {
    slug: 'cavalo', name: 'CAVALO', vd: 10, tamanho: 'Grande',
    intro: 'Mesmo nos dias de hoje, cavalos são empregados em diversas situações. Na cidade, podem ser usados por forças policiais ou como animais de esportes e recreação. No campo, servem como meio de transporte e tração. Embora geralmente pacatos, são capazes de desferir chutes poderosos com seus cascos.',
    sentidos: { percepcao: p(1, 5), iniciativa: p(1, 5), extra: 'Faro, visão na penumbra' },
    defesa: 13, salvaguardas: { fortitude: p(2), reflexos: p(1, 5), vontade: p(1) },
    pvMax: 12, deslocamento: { metros: 15, extras: [] },
    atributos: { agi: 1, for: 3, int: 0, pre: 1, vig: 2 },
    secoes: [
      secao('MONTARIA', 'Um personagem treinado em Adestramento pode usar um cavalo como montaria. Ele conta como um aliado que aumenta seu deslocamento para 15m e fornece uma ação extra por rodada (apenas para se deslocar).')
    ],
    acoes: [agredir(ataque('CASCOS', { teste: p(3, 5), dano: '2d4+3', tipoDano: 'Impacto' }))]
  },
  {
    slug: 'gorila', name: 'GORILA', vd: 40, tamanho: 'Grande',
    intro: 'Territorialista e imponente, o gorila fará de tudo para proteger seu habitat.',
    sentidos: { percepcao: p(1, 5), iniciativa: p(2, 5), extra: 'Faro, visão na penumbra' },
    defesa: 19, salvaguardas: { fortitude: p(3, 5), reflexos: p(2, 5), vontade: p(1) },
    pvMax: 70, deslocamento: { metros: 9, extras: [{ tipo: 'Escalar', metros: 9 }] },
    atributos: { agi: 2, for: 3, int: 0, pre: 1, vig: 3 },
    pericias: [{ nome: 'Atletismo', dados: 3, bonus: 5 }],
    acoes: [
      agredir(ataque('PANCADA', { x: 2, teste: p(2, 10), dano: '1d6+3', tipoDano: 'Impacto' })),
      acao('livre', 'Morder', 'Se o gorila acerta os dois ataques de pancada em um mesmo ser na mesma rodada, ele ataca este ser com sua mordida (teste 2d20+10, dano 1d6+4 corte).')
    ]
  },
  {
    slug: 'enxame-de-tocandiras', name: 'ENXAME DE TOCANDIRAS', vd: 20, tamanho: 'Médio', tipo: 'Animal (Enxame)',
    intro: 'Também chamado de formiga-bala, este pequeno inseto típico da Amazônia é conhecido por sua mordida de dor intensa e debilitante. Encontrada principalmente na selva amazônica, está presente também em outras partes da América do Sul.',
    sentidos: { percepcao: p(1, 5), iniciativa: p(1, 5), extra: 'Visão na penumbra' },
    defesa: 16, salvaguardas: { fortitude: p(1), reflexos: p(1, 5), vontade: p(1) },
    pvMax: 22, deslocamento: { metros: 6, extras: [{ tipo: 'Escalar', metros: 6 }] },
    atributos: { agi: 1, for: 0, int: 0, pre: 1, vig: 0 },
    pericias: [{ nome: 'Atletismo', dados: 3, bonus: 5 }],
    secoes: [
      secao('ENXAME', 'Um enxame é uma aglomeração de criaturas que agem em conjunto. Em termos de regras, pode entrar no espaço ocupado por um ser. No fim do seu turno, o enxame causa 4d4 pontos de dano de perfuração a qualquer ser em seu espaço, automaticamente. Um enxame é imune a manobras de combate e efeitos que afetam apenas uma criatura e não causam dano e sofre apenas metade do dano de ataques com armas. Porém, sofre 50% a mais de dano por efeitos de área.'),
      secao('DOR DEBILITANTE', 'Um ser que sofra dano do enxame sofre –1d20 em todos os testes devido à dor profunda (Fortitude DT 20 evita). Essa penalidade só pode ser removida com uma ação de interlúdio dormir ou com a aplicação de uma dose de antídoto.'),
      secao('POR DENTRO DAS ROUPAS', 'Quando um ser sai do espaço do enxame, leva consigo algumas formigas que entram em suas vestes. O ser continua sofrendo metade do dano de Enxame (2d4) até gastar uma ação de movimento para se livrar delas.')
    ],
    acoes: []
  },
  {
    slug: 'leao', name: 'LEÃO', vd: 60, tamanho: 'Grande',
    intro: 'O assim chamado “rei das selvas”, o leão é um dos maiores predadores das savanas africanas. Outrora comum em circos no Brasil, ainda pode ser encontrado em abrigos de animais selvagens ou em coleções (geralmente ilegais) de animais exóticos.',
    sentidos: { percepcao: p(1, 10), iniciativa: p(3, 10), extra: 'Faro, visão na penumbra' },
    defesa: 18, salvaguardas: { fortitude: p(2, 5), reflexos: p(3, 10), vontade: p(2, 5) },
    pvMax: 80, deslocamento: { metros: 15, extras: [] },
    atributos: { agi: 3, for: 3, int: 0, pre: 2, vig: 2 },
    pericias: [{ nome: 'Atletismo', dados: 3, bonus: 10 }, { nome: 'Furtividade', dados: 3, bonus: 8 }],
    acoes: [
      agredir(
        ataque('GARRAS', { x: 2, crit: 19, teste: p(3, 10), dano: '1d6+4', tipoDano: 'Corte' }),
        ataque('MORDIDA', { teste: p(3, 10), dano: '1d8+4', tipoDano: 'Corte' })
      ),
      acao('livre', 'Agarrão', 'Se o leão acertar um ataque de mordida em um ser Médio ou menor, ele pode tentar agarrar o alvo (teste 3d20+12).'),
      acao('completa', 'Bote', 'O leão faz uma investida e ataca com sua mordida e suas garras. Os três ataques recebem o bônus de +1d20 da investida, mas devem ser feitos contra o mesmo alvo.')
    ]
  },
  {
    slug: 'lobo', name: 'LOBO', vd: 20, tamanho: 'Médio',
    intro: 'Hábeis caçadores em grupo. Ao ouvir seu uivo, saiba que ele nunca estará sozinho.',
    sentidos: { percepcao: p(1, 5), iniciativa: p(3, 5), extra: 'Faro, visão na penumbra' },
    defesa: 15, salvaguardas: { fortitude: p(2, 5), reflexos: p(3, 5), vontade: p(1) },
    pvMax: 18, deslocamento: { metros: 12, extras: [] },
    atributos: { agi: 3, for: 3, int: 0, pre: 1, vig: 2 },
    pericias: [{ nome: 'Sobrevivência', dados: 1, bonus: 10 }],
    secoes: [
      secao('TÁTICAS DE ALCATEIA', 'Quando flanqueia um inimigo, o lobo recebe +1d20 no teste de ataque (além do bônus normal por flanquear, para um total de +2d20) e causa +1d6 pontos de dano com sua mordida.')
    ],
    acoes: [
      agredir(ataque('MORDIDA', { teste: p(3, 5), dano: '1d6+4', tipoDano: 'Corte' })),
      acao('livre', 'Derrubar', 'Se o lobo acerta um ataque de mordida, pode fazer a manobra derrubar (teste 3d20+5).')
    ]
  },
  {
    slug: 'touro', name: 'TOURO', vd: 20, tamanho: 'Grande',
    intro: 'Essa montanha de músculos é famosa pelo seu temperamento imprevisível.',
    sentidos: { percepcao: p(1, 5), iniciativa: p(1), extra: 'Faro, visão na penumbra' },
    defesa: 15, salvaguardas: { fortitude: p(2, 5), reflexos: p(1), vontade: p(1) },
    pvMax: 38, deslocamento: { metros: 12, extras: [] },
    atributos: { agi: 1, for: 3, int: 0, pre: 1, vig: 2 },
    pericias: [{ nome: 'Atletismo', dados: 3, bonus: 10 }],
    acoes: [
      agredir(ataque('CHIFRES', { teste: p(3, 5), dano: '2d6+6', tipoDano: 'Perfuração' })),
      acao('completa', 'Atropelamento', 'O touro percorre até o dobro de seu deslocamento em linha reta. Quando se move dessa forma, o touro pode passar pelo espaço ocupado de quaisquer seres menores que ele. Seres nessa linha sofrem 2d6+6 pontos de dano de impacto e ficam caídos (Reflexos DT 15 reduz à metade e evita a condição). Recarga (movimento).')
    ]
  },
  {
    slug: 'urso-pardo', name: 'URSO PARDO', vd: 60, tamanho: 'Grande',
    intro: 'Um dos mais perigosos ursos, o pardo é um predador imponente e poderoso.',
    sentidos: { percepcao: p(1, 5), iniciativa: p(1, 5), extra: 'Faro, visão na penumbra' },
    defesa: 19, salvaguardas: { fortitude: p(3, 10), reflexos: p(1, 5), vontade: p(2) },
    pvMax: 90, deslocamento: { metros: 12, extras: [] },
    resistencias: ['Balístico', 'Corte', 'Impacto', 'Perfuração'].map(tipo => ({ tipo, valor: 2 })),
    atributos: { agi: 1, for: 3, int: 0, pre: 2, vig: 3 },
    pericias: [{ nome: 'Atletismo', dados: 3, bonus: 10 }],
    acoes: [
      agredir(
        ataque('GARRAS', { x: 2, crit: 19, teste: p(3, 10), dano: '1d6+4', tipoDano: 'Corte' }),
        ataque('MORDIDA', { teste: p(3, 10), dano: '1d8+4', tipoDano: 'Corte' })
      ),
      acao('livre', 'Agarrão', 'Se o urso acertar um ataque de mordida em um ser Médio ou menor, ele pode tentar agarrar o alvo (teste 3d20+12).')
    ]
  }
];

const sheets = JSON.parse(fs.readFileSync(sheetsPath, 'utf8'));
const have = new Set(sheets.map(s => s.id));
let added = 0;
ANIMAIS.forEach((a, i) => {
  const id = `threat-livro-${a.slug}`;
  if (have.has(id)) return;
  const raw = {
    id, name: a.name, categoria: 'mundana', vd: a.vd, tipo: a.tipo || 'Animal', tamanho: a.tamanho,
    folderId: 'folder-threats', favorite: false,
    presenca: { ativa: false },
    sentidos: a.sentidos, defesa: a.defesa, salvaguardas: a.salvaguardas,
    pvMax: a.pvMax, pv: a.pvMax, deslocamento: a.deslocamento, atributos: a.atributos,
    resistencias: a.resistencias || [], pericias: a.pericias || [], secoes: a.secoes || [],
    acoes: a.acoes,
    hasIntro: true, introSide: 'top', introText: a.intro,
    createdAt: Date.now() + i, updatedAt: Date.now() + i
  };
  sheets.push(normalizeThreatSheet(raw));
  added++;
});

fs.writeFileSync(sheetsPath, JSON.stringify(sheets, null, 2), 'utf8');
console.log(`✓ ${added} ficha(s) de animais adicionada(s); total ${sheets.length}`);

