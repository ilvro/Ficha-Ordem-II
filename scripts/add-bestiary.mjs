#!/usr/bin/env node
/**
 * Importa para o sheets.json as fichas dos bestiários:
 *   - Ordem Paranormal RPG – Livro de Regras (cap. Ameaças)   -> fonte "livro-de-regras"
 *   - Sobrevivendo ao Horror (cap. 3)                          -> fonte "sobrevivendo-ao-horror"
 * Os dados (com arte e background) ficam em scripts/data/bestiary.json.
 * A fonte da ficha é gravada em sheet.fonte e NÃO aparece na ficha (uso futuro: filtros).
 * Idempotente: substitui fichas com ids "threat-lr-*" / "threat-sh-*" e marca as demais.
 *   node scripts/add-bestiary.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeThreatSheet } from '../src/systems/threat/threat-system.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sheetsPath = path.join(root, 'sheets.json');
const data = JSON.parse(fs.readFileSync(path.join(root, 'scripts/data/bestiary.json'), 'utf8'));
const sheets = JSON.parse(fs.readFileSync(sheetsPath, 'utf8'));

const isBook = s => /^threat-(lr|sh)-/.test(s.id || '');
const kept = sheets.filter(s => !isBook(s));

// Fichas anteriores: animais do livro Sobrevivendo ao Horror e criações próprias
kept.forEach(s => {
  if (s.systemMode !== 'threat') return;
  s.fonte = /^threat-livro-/.test(s.id) ? 'sobrevivendo-ao-horror' : (s.fonte || 'homebrew');
});

const base = Date.now();
const novas = data.map((raw, i) => normalizeThreatSheet({ ...raw, createdAt: base + i, updatedAt: base + i }));
const result = [...kept, ...novas];
fs.writeFileSync(sheetsPath, JSON.stringify(result, null, 2), 'utf8');

const cont = f => novas.filter(s => s.fonte === f).length;
console.log(`✓ ${novas.length} fichas importadas (livro-de-regras: ${cont('livro-de-regras')}, sobrevivendo-ao-horror: ${cont('sobrevivendo-ao-horror')}); total ${result.length}`);
