#!/usr/bin/env node
/**
 * Gera src/default-sheets.js a partir do sheets.json atual.
 * As imagens base64 (tokenImage, backgroundImage) são removidas para
 * manter o bundle leve — players re-fazem o upload pelo próprio site.
 * Execute antes de 'npm run build':  node scripts/gen-default-sheets.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const sheetsPath = path.join(root, 'sheets.json');
const outPath = path.join(root, 'src', 'default-sheets.js');

if (!fs.existsSync(sheetsPath)) {
  console.error('sheets.json não encontrado.');
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(sheetsPath, 'utf-8'));
const stripped = raw; // mantém imagens — são fichas padrão visíveis a todos

const js = `// AUTO-GENERATED — não edite manualmente.
// Execute: node scripts/gen-default-sheets.js
export const DEFAULT_SHEETS = ${JSON.stringify(stripped, null, 2)};
`;

fs.writeFileSync(outPath, js, 'utf-8');
console.log(`✓ src/default-sheets.js gerado com ${stripped.length} ficha(s) — ${(Buffer.byteLength(js)/1024).toFixed(1)} KB`);

