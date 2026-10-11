import { die } from '../../dice-icon.js';

export const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Os textos do livro escrevem bônus e penalidades de dado como "+O", "–O" ou
// "+OO" (+1d20, –1d20, +2d20). Aqui cada "O" vira o ícone de d20 da ficha.
export function rich(value) {
  return safe(value).replace(/(?<![A-Za-zÀ-ú0-9])([+\-–−])(O{1,3})(?![A-Za-zÀ-ú0-9])/g, (_, sinal, dados) =>
    `<span class="dado-bonus" title="${sinal}${dados.length}d20">${sinal}${die(20, 'text-die').repeat(dados.length)}</span>`);
}
