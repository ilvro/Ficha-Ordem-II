/**
 * Visualizações preliminares do Sistema de Ameaças (Fase 1)
 */

import { calcMachucado } from './threat-system.js';
import { THREAT_ELEMENTS } from './threat-data.js';

function safe(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderThreatPlaceholder(sheet, editMode = false) {
  const machucado = calcMachucado(sheet);
  const elem = (sheet.elementos || [])[0] || 'sangue';
  const corElemento = THREAT_ELEMENTS[elem]?.cor || '#993ce8';

  return `
    <main class="page threat-page threat-placeholder-page" style="display:flex;align-items:center;justify-content:center;min-height:100vh;padding:40px 20px;background:#0c0d16;color:#e1e3ec;">
      <section style="max-width:680px;width:100%;background:#131524;border:1px solid #292c42;border-radius:10px;padding:32px;box-shadow:0 12px 36px rgba(0,0,0,0.6);border-top:4px solid ${corElemento};">
        <header style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;border-bottom:1px solid #24273c;padding-bottom:18px;margin-bottom:20px;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <span style="background:${corElemento};color:#fff;font-size:10px;font-weight:900;padding:2px 8px;border-radius:3px;text-transform:uppercase;letter-spacing:0.08em;">
                ${safe(sheet.categoria || 'Paranormal')}
              </span>
              <span style="color:#8589a3;font-size:12px;font-weight:700;text-transform:uppercase;">
                ${safe((sheet.elementos || []).join(' · ') || 'Sem elemento')}
              </span>
            </div>
            <h1 style="margin:0;font-size:28px;font-family:Georgia,serif;color:#fff;letter-spacing:0.02em;">
              ${safe(sheet.name || 'Nova Ameaça')}
            </h1>
            ${sheet.subtitulo ? `<small style="color:#a1a5bd;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">${safe(sheet.subtitulo)}</small>` : ''}
          </div>
          <div style="text-align:right;">
            <span style="display:block;font-size:10px;color:#8589a3;font-weight:800;letter-spacing:0.12em;">VALOR DE DESAFIO</span>
            <b style="font-size:32px;color:${corElemento};font-family:Georgia,serif;line-height:1;">VD ${sheet.vd || 60}</b>
          </div>
        </header>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:12px;margin-bottom:24px;">
          <div style="background:#1a1c2e;border:1px solid #2a2e47;border-radius:6px;padding:12px;">
            <small style="color:#777b94;font-size:9px;font-weight:800;display:block;margin-bottom:4px;">PONTOS DE VIDA</small>
            <b style="font-size:18px;color:#ff5e67;">${sheet.pv} / ${sheet.pvMax}</b>
            <span style="display:block;font-size:10px;color:#a0a4be;margin-top:2px;">Machucado: ${machucado}</span>
          </div>
          <div style="background:#1a1c2e;border:1px solid #2a2e47;border-radius:6px;padding:12px;">
            <small style="color:#777b94;font-size:9px;font-weight:800;display:block;margin-bottom:4px;">DEFESA</small>
            <b style="font-size:18px;color:#fff;">${sheet.defesa || 20}</b>
            <span style="display:block;font-size:10px;color:#a0a4be;margin-top:2px;">Tamanho: ${safe(sheet.tamanho || 'Médio')}</span>
          </div>
          <div style="background:#1a1c2e;border:1px solid #2a2e47;border-radius:6px;padding:12px;">
            <small style="color:#777b94;font-size:9px;font-weight:800;display:block;margin-bottom:4px;">DESLOCAMENTO</small>
            <b style="font-size:18px;color:#fff;">${sheet.deslocamento?.metros || 12}m</b>
            <span style="display:block;font-size:10px;color:#a0a4be;margin-top:2px;">${Math.floor((sheet.deslocamento?.metros || 12) / 1.5)} quadrados</span>
          </div>
        </div>

        <div style="background:#161829;border:1px dashed #30344f;border-radius:8px;padding:18px;text-align:center;">
          <h3 style="margin:0 0 6px 0;font-size:14px;color:#e5a11c;font-weight:800;letter-spacing:0.06em;">
            ✓ FASE 1 CONCLUÍDA: FUNDAÇÃO E MODELO DE DADOS
          </h3>
          <p style="margin:0;font-size:12px;color:#9296b0;line-height:1.5;">
            Os modelos de dados de Ameaça, pastas no workspace e persistência no banco de dados estão ativos e testados.
            O layout gráfico completo com o design oficial do livro será renderizado na <b>Fase 3</b>.
          </p>
        </div>
      </section>
    </main>
  `;
}

