/**
 * Componentes de Interface para Bloqueio e Validação de Titularidade do Bestiário
 * Ordem Paranormal RPG — Jambô Editora
 */

import { icon } from '../../icons.js';
import { getBestiaryLicense, isBestiaryUnlocked } from '../../services/bestiary-license.js';

function safe(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Renderiza a pill de status da licença para o cabeçalho de filtros ou navegação.
 */
export function renderLicenseStatusPill() {
  const license = getBestiaryLicense();
  const unlocked = Boolean(license && license.unlocked);

  if (unlocked) {
    const buyerDisplay = license.buyerName ? safe(license.buyerName.split(' ')[0]) : 'Jambô';
    return `
      <button type="button" 
        class="nav-license-pill unlocked" 
        data-open-bestiary-license-modal 
        title="Bestiário Oficial Desbloqueado (${safe(license.buyerName)} - ${safe(license.buyerEmail)}) · Clique para gerenciar">
        <span class="pill-dot"></span>
        ${icon('check-circle', 11)}
        <span>LIVRO VALIDADO (${buyerDisplay.toUpperCase()})</span>
      </button>
    `;
  }

  return `
    <button type="button" 
      class="nav-license-pill locked" 
      data-open-bestiary-unlock 
      title="Bestiário Oficial Bloqueado · Valide seu PDF oficial da Jambô Editora para desbloquear">
      ${icon('lock', 11)}
      <span>VALIDAR LIVRO (PDF)</span>
    </button>
  `;
}

/**
 * Renderiza o banner de aviso no topo do Navegador quando em escopo de ameaças e bloqueado.
 */
export function renderNavigatorLockBanner() {
  return `
    <div class="nav-threat-lock-banner">
      <div class="nav-threat-lock-info">
        <div class="nav-threat-lock-icon">
          ${icon('lock', 16)}
        </div>
        <div class="nav-threat-lock-texts">
          <b>BESTIÁRIO OFICIAL PROTEGIDO</b>
          <p>Valide seu PDF oficial da Jambô Editora para liberar todas as criaturas oficiais.</p>
        </div>
      </div>
      <button type="button" class="nav-threat-unlock-action-btn" data-open-bestiary-unlock>
        ${icon('upload', 12)}
        <span>DESBLOQUEAR</span>
      </button>
    </div>
  `;
}

/**
 * Renderiza a área de drag & drop e seleção de arquivo PDF para reutilização
 */
export function renderPdfDropzone(idPrefix = 'modal') {
  return `
    <div class="bestiary-dropzone" data-bestiary-dropzone="${idPrefix}">
      <input type="file" accept=".pdf,application/pdf" class="bestiary-file-input" data-bestiary-file-input="${idPrefix}" style="display:none;" id="bestiary-file-input-${idPrefix}">
      
      <div class="dropzone-content">
        <div class="dropzone-icon">
          ${icon('upload', 32)}
        </div>
        <div class="dropzone-titles">
          <h4>Arraste seu PDF oficial aqui</h4>
          <p>ou clique para selecionar o arquivo</p>
        </div>
        <label for="bestiary-file-input-${idPrefix}" class="dropzone-browse-btn">
          ${icon('book', 14)}
          <span>SELECIONAR ARQUIVO PDF</span>
        </label>
      </div>

      <div class="dropzone-status" data-dropzone-status="${idPrefix}" style="display:none;"></div>
    </div>
  `;
}

/**
 * Renderiza a visualização de Dossiê Censurado / Confidencial quando
 * o usuário tenta abrir uma criatura oficial sem ter validado o PDF.
 */
export function renderLockedThreatDossier(sheet, options = {}) {
  const { safeUrl = s => s } = options;
  const isMundane = sheet.categoria === 'mundana';
  const categoryLabel = isMundane ? 'AMEAÇA DA REALIDADE' : 'CRIATURA PARANORMAL';

  return `
    <div class="threat-book-page threat-locked-page">
      <article class="threat-dossier-card threat-locked-card" aria-label="Ameaça Bloqueada: ${safe(sheet.name)}">
        
        <!-- BARRA BRANCA DO LIVRO -->
        <div class="threat-book-top-bar" aria-hidden="true"></div>

        <!-- CARIMBO DE ACESSO RESTRITO -->
        <div class="threat-censored-stamp" aria-hidden="true">
          <span>ARQUIVO CONFIDENCIAL</span>
          <small>ACESSO RESTRITO // ORDEM PARANORMAL</small>
        </div>

        <header class="threat-locked-header">
          <div class="threat-locked-title-group">
            <span class="threat-locked-tag">${categoryLabel}</span>
            <h1 class="threat-locked-name">${safe(sheet.name)}</h1>
            <div class="threat-locked-meta">
              <span class="threat-locked-vd">VALOR DE DESAFIO ${sheet.vd || 60}</span>
              <span class="threat-locked-origin">PROPRIEDADE DA JAMBÔ EDITORA</span>
            </div>
          </div>
        </header>

        <!-- CARTÃO CENTRAL DE VALIDAÇÃO DE TITULARIDADE -->
        <section class="threat-locked-clearance-box">
          <div class="clearance-badge-icon">
            ${icon('lock', 28)}
          </div>
          
          <h2 class="clearance-title">TITULARIDADE DO LIVRO NECESSÁRIA</h2>
          <p class="clearance-desc">
            Esta criatura faz parte do bestiário oficial publicado pela <b>Jambô Editora</b>. 
            Para respeitar os direitos autorais e liberar os atributos, ataques, rituais e habilidades deste dossiê (e de todas as ameaças oficiais), envie o seu PDF legítimo de <b>Ordem Paranormal RPG</b>.
          </p>

          <div class="clearance-books-accepted">
            <span class="accepted-badge">📘 Livro de Regras</span>
            <span class="accepted-badge">📕 Sobrevivendo ao Horror</span>
          </div>

          ${renderPdfDropzone('dossier')}

          <div class="clearance-privacy-notice">
            ${icon('shield', 13)}
            <span><b>Processamento 100% Local:</b> O arquivo é analisado estritamente na memória do seu navegador pela marca d'água da sua compra. Nenhum dado é enviado para a internet.</span>
          </div>
        </section>

        <!-- TARJAS DE CENSURA SIMULANDO OS DADOS DA FICHA -->
        <div class="threat-redacted-preview" aria-hidden="true">
          <div class="redacted-row">
            <span class="redacted-bar w-120"></span>
            <span class="redacted-bar w-80"></span>
            <span class="redacted-bar w-160"></span>
          </div>
          <div class="redacted-row">
            <span class="redacted-block h-60"></span>
            <span class="redacted-block h-60"></span>
            <span class="redacted-block h-60"></span>
          </div>
          <div class="redacted-row">
            <span class="redacted-bar w-200"></span>
            <span class="redacted-bar w-140"></span>
          </div>
          <div class="redacted-row">
            <span class="redacted-bar w-full"></span>
          </div>
          <div class="redacted-row">
            <span class="redacted-bar w-full"></span>
          </div>
        </div>

      </article>
    </div>
  `;
}

/**
 * Renderiza o modal global de Desbloqueio do Bestiário com PDF
 */
export function renderBestiaryUnlockModalHtml() {
  return `
    <div class="modal bestiary-unlock-modal" id="bestiary-unlock-modal" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="bestiary-unlock-title">
      <div class="backdrop" data-close-bestiary-modal></div>
      <section class="bestiary-modal-container">
        <button type="button" class="modal-close-btn" data-close-bestiary-modal aria-label="Fechar">${icon('close', 14)}</button>

        <div class="bestiary-modal-header">
          <div class="bestiary-modal-icon">
            ${icon('book', 24)}
          </div>
          <div class="bestiary-modal-headings">
            <small class="bestiary-modal-eyebrow">DIREITOS AUTORAIS &amp; PARCERIA</small>
            <h2 id="bestiary-unlock-title">DESBLOQUEAR BESTIÁRIO OFICIAL</h2>
            <p>Ordem Paranormal RPG · Jambô Editora</p>
          </div>
        </div>

        <div class="bestiary-modal-body">
          <p class="bestiary-modal-intro">
            As fichas e mecânicas das criaturas oficiais de Ordem Paranormal são protegidas por direitos autorais da <b>Jambô Editora</b>. 
            Para ter acesso permanente ao catálogo completo de ameaças, valide a posse do seu livro oficial enviando o PDF que você baixou na sua conta da Jambô.
          </p>

          <div class="bestiary-books-pills">
            <div class="book-pill">
              <span class="book-pill-icon">📘</span>
              <div class="book-pill-text">
                <b>Livro de Regras</b>
                <small>Ordem Paranormal RPG (Básico)</small>
              </div>
            </div>
            <div class="book-pill">
              <span class="book-pill-icon">📕</span>
              <div class="book-pill-text">
                <b>Sobrevivendo ao Horror</b>
                <small>Suplemento Oficial</small>
              </div>
            </div>
          </div>

          ${renderPdfDropzone('modal')}

          <div class="bestiary-modal-security">
            ${icon('shield', 15)}
            <div>
              <b>Segurança &amp; Privacidade Garantidas:</b>
              <p>A checagem é realizada <b>100% no seu navegador</b> via PDF.js. O sistema lê apenas a marca d'água no rodapé da página para registrar a licença localmente. Seu arquivo ou dados pessoais <b>jamais</b> saem do seu dispositivo.</p>
            </div>
          </div>
        </div>

        <div class="bestiary-modal-footer">
          <button type="button" class="bestiary-btn-secondary" data-close-bestiary-modal>CANCELAR</button>
        </div>
      </section>
    </div>
  `;
}

/**
 * Renderiza o modal de Gerenciamento da Licença Ativa (para ver dados ou bloquear novamente)
 */
export function renderBestiaryManageModalHtml(license) {
  if (!license || !license.unlocked) return '';

  const verifiedDate = license.verifiedAt ? new Date(license.verifiedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recente';

  return `
    <div class="modal bestiary-manage-modal" id="bestiary-manage-modal" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="bestiary-manage-title">
      <div class="backdrop" data-close-manage-modal></div>
      <section class="bestiary-modal-container">
        <button type="button" class="modal-close-btn" data-close-manage-modal aria-label="Fechar">${icon('close', 14)}</button>

        <div class="bestiary-modal-header verified-theme">
          <div class="bestiary-modal-icon verified">
            ${icon('check-circle', 24)}
          </div>
          <div class="bestiary-modal-headings">
            <small class="bestiary-modal-eyebrow text-success">ACESSO AUTORIZADO</small>
            <h2 id="bestiary-manage-title">BESTIÁRIO OFICIAL VALIDADO</h2>
            <p>Licença de uso pessoal registrada no navegador</p>
          </div>
        </div>

        <div class="bestiary-modal-body">
          <div class="license-info-card">
            <div class="license-info-row">
              <span class="label">Titular Licenciado:</span>
              <span class="value font-bold">${safe(license.buyerName || 'Membro da Ordem')}</span>
            </div>
            ${license.buyerEmail ? `
              <div class="license-info-row">
                <span class="label">E-mail de Cadastro:</span>
                <span class="value">${safe(license.buyerEmail)}</span>
              </div>
            ` : ''}
            <div class="license-info-row">
              <span class="label">Obra Reconhecida:</span>
              <span class="value text-accent">${safe(license.detectedBook || 'Ordem Paranormal RPG')}</span>
            </div>
            ${license.fileName ? `
              <div class="license-info-row">
                <span class="label">Arquivo Verificado:</span>
                <span class="value text-muted">${safe(license.fileName)}</span>
              </div>
            ` : ''}
            <div class="license-info-row">
              <span class="label">Data de Verificação:</span>
              <span class="value text-muted">${safe(verifiedDate)}</span>
            </div>
          </div>

          <div class="bestiary-manage-notice">
            ${icon('info', 14)}
            <span>Todas as 97 ameaças e criaturas oficiais do catálogo estão liberadas para suas campanhas e fichas.</span>
          </div>
        </div>

        <div class="bestiary-modal-footer space-between">
          <button type="button" class="bestiary-btn-danger" data-revoke-bestiary-license title="Bloqueia o bestiário novamente para testar a validação">
            ${icon('lock', 12)}
            <span>BLOQUEAR NOVAMENTE (TESTAR)</span>
          </button>
          <button type="button" class="bestiary-btn-primary" data-close-manage-modal>CONCLUÍDO</button>
        </div>
      </section>
    </div>
  `;
}

