/**
 * Navegador de Pastas e Workspace Sidebar (Fase 2)
 * Componentes de interface e gerenciamento de navegação hierárquica de fichas
 */

import { icon } from '../icons.js';
import { visibleSheets, buildFolderTree, isCharacterSheet, isThreatSheet } from './selectors.js';
import { THREAT_ELEMENTS } from '../systems/threat/threat-data.js';

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
 * Renderiza os botões compactos de filtro de escopo no topo do Rail lateral
 */
export function renderRailScopePills(activeScope = 'all', sheets = []) {
  const charsCount = sheets.filter(isCharacterSheet).length;
  const threatsCount = sheets.filter(isThreatSheet).length;
  const totalCount = sheets.length;

  return `
    <div class="rail-scope-pills" role="tablist" aria-label="Escopo de fichas">
      <button type="button" 
        class="rail-scope-btn scope-all ${activeScope === 'all' ? 'active' : ''}" 
        data-sidebar-scope="all" 
        title="Ver todas as fichas (${totalCount})"
        aria-label="Todas as fichas">
        ${icon('globe', 15)}
        <span class="rail-scope-badge">${totalCount}</span>
      </button>
      <button type="button" 
        class="rail-scope-btn scope-characters ${activeScope === 'characters' ? 'active' : ''}" 
        data-sidebar-scope="characters" 
        title="Apenas Personagens (${charsCount})"
        aria-label="Personagens">
        ${icon('user', 15)}
        <span class="rail-scope-badge">${charsCount}</span>
      </button>
      <button type="button" 
        class="rail-scope-btn scope-threats ${activeScope === 'threats' ? 'active' : ''}" 
        data-sidebar-scope="threats" 
        title="Apenas Ameaças (${threatsCount})"
        aria-label="Ameaças">
        ${icon('skull', 15)}
        <span class="rail-scope-badge">${threatsCount}</span>
      </button>
    </div>
  `;
}

/**
 * Renderiza a lista de avatares no Switcher vertical do Rail
 */
export function renderRailSwitcher(sheets = [], folders = [], activeSheetId = '', options = {}) {
  const { scope = 'all', visibleFolderIds = [], safeUrl = s => s } = options;

  const filtered = visibleSheets(sheets, folders, {
    scope,
    visibleFolderIds: Array.isArray(visibleFolderIds) && visibleFolderIds.length > 0 ? visibleFolderIds : undefined
  });

  const items = filtered.map(sheet => {
    const isActive = sheet.id === activeSheetId;
    const isThreat = sheet.systemMode === 'threat';
    const isOriginal = sheet.systemMode === 'original';

    let elemColor = '';
    let vdBadge = '';
    let avatarClass = `sheet-avatar ${isActive ? 'active' : ''}`;
    let tooltipTitle = `${safe(sheet.name)} (${isOriginal ? 'Ordem RPG' : 'Ordem II'})`;

    if (isThreat) {
      const elem = (sheet.elementos || [])[0] || 'sangue';
      elemColor = THREAT_ELEMENTS[elem]?.cor || '#993ce8';
      avatarClass += ' threat-avatar';
      vdBadge = `<span class="threat-vd-pill" style="border-color:${elemColor};color:${elemColor};">VD ${sheet.vd || 60}</span>`;
      tooltipTitle = `${safe(sheet.name)} (Ameaça · VD ${sheet.vd || 60})`;
    }

    const favStar = sheet.favorite ? `<span class="avatar-fav-star" title="Favorita">★</span>` : '';

    const avatarContent = sheet.tokenImage
      ? `<img src="${safeUrl(sheet.tokenImage)}" alt="${safe(sheet.name)}" draggable="false">`
      : safe((sheet.name || '?').slice(0, 1).toUpperCase());

    const inlineStyle = elemColor ? `style="--threat-elem-color:${elemColor};border-color:${elemColor};"` : '';

    return `
      <button type="button" 
        class="${avatarClass}" 
        data-sheet-id="${sheet.id}" 
        draggable="true" 
        title="${tooltipTitle}" 
        aria-label="${tooltipTitle}"
        ${inlineStyle}>
        ${avatarContent}
        ${vdBadge}
        ${favStar}
      </button>
    `;
  }).join('');

  return `
    <div class="sheet-switcher">
      ${items}
      <button class="nav-btn dashed" data-new-sheet title="Adicionar ficha (+)">
        ${icon('plus')}
      </button>
    </div>
  `;
}

/**
 * Renderiza o painel expandido do Navegador de Fichas e Pastas
 */
export function renderWorkspaceNavigator(folders = [], sheets = [], activeSheetId = '', options = {}) {
  const {
    open = false,
    pinned = false,
    searchQuery = '',
    scope = 'all',
    visibleFolderIds = [],
    recentSheetIds = [],
    safeUrl = s => s
  } = options;

  const totalSheets = sheets.length;
  const charsCount = sheets.filter(isCharacterSheet).length;
  const threatsCount = sheets.filter(isThreatSheet).length;

  const favorites = sheets.filter(s => s && s.favorite);
  const recents = (recentSheetIds || [])
    .map(id => sheets.find(s => s.id === id))
    .filter(Boolean)
    .slice(0, 6);

  const isSearching = Boolean(searchQuery && searchQuery.trim());
  const tree = buildFolderTree(folders, sheets);

  return `
    ${open && !pinned ? `<div class="workspace-navigator-backdrop" data-close-navigator></div>` : ''}
    <aside class="workspace-navigator ${open ? 'open' : ''} ${pinned ? 'pinned' : ''}" id="workspace-navigator" aria-label="Navegador de fichas e pastas">
      <header class="nav-panel-header">
        <div class="nav-panel-title-wrap">
          ${icon('folder', 18)}
          <h2 class="nav-panel-title">NAVEGADOR</h2>
        </div>
        <div class="nav-panel-actions">
          <button type="button" class="nav-panel-icon-btn ${pinned ? 'active' : ''}" data-nav-pin title="${pinned ? 'Desafixar painel' : 'Fixar painel no layout'}">
            ${icon('pin', 14)}
          </button>
          <button type="button" class="nav-panel-icon-btn" data-close-navigator title="Fechar navegador (Esc)">
            ${icon('close', 14)}
          </button>
        </div>
      </header>

      <div class="nav-search-wrap">
        <div class="nav-search-box">
          ${icon('search', 14)}
          <input type="text" 
            placeholder="Buscar fichas, elementos, VD..." 
            value="${safe(searchQuery)}" 
            data-nav-search-input 
            aria-label="Buscar fichas"
            autocomplete="off">
          ${searchQuery ? `<button type="button" class="nav-panel-icon-btn" data-nav-clear-search title="Limpar busca">${icon('close', 12)}</button>` : `<kbd class="nav-search-kbd" data-open-quick-switcher title="Atalho global">Ctrl+K</kbd>`}
        </div>
      </div>

      <nav class="nav-scope-tabs">
        <button type="button" class="nav-scope-tab tab-all ${scope === 'all' ? 'active' : ''}" data-nav-scope-tab="all">
          <span>TODAS</span>
          <span class="nav-scope-count">(${totalSheets})</span>
        </button>
        <button type="button" class="nav-scope-tab tab-characters ${scope === 'characters' ? 'active' : ''}" data-nav-scope-tab="characters">
          <span>PERSONAGENS</span>
          <span class="nav-scope-count">(${charsCount})</span>
        </button>
        <button type="button" class="nav-scope-tab tab-threats ${scope === 'threats' ? 'active' : ''}" data-nav-scope-tab="threats">
          <span>AMEAÇAS</span>
          <span class="nav-scope-count">(${threatsCount})</span>
        </button>
      </nav>

      <div class="nav-toolbar">
        <button type="button" class="nav-toolbar-btn" data-nav-create-folder title="Criar nova pasta personalizada">
          ${icon('folder-plus', 13)}
          <span>NOVA PASTA</span>
        </button>
        <div style="display:flex;gap:4px;">
          <button type="button" class="nav-toolbar-btn" data-nav-collapse-all title="Recolher todas as pastas">
            <span>RECOLHER</span>
          </button>
          <button type="button" class="nav-toolbar-btn" data-nav-expand-all title="Expandir todas as pastas">
            <span>EXPANDIR</span>
          </button>
        </div>
      </div>

      <div class="nav-tree-scroll">
        ${renderNavigatorTreeContent(folders, sheets, activeSheetId, { searchQuery, scope, visibleFolderIds, recentSheetIds, safeUrl })}
      </div>
    </aside>
  `;
}

/**
 * Renderiza o conteúdo da árvore do navegador (pastas, favoritos, recentes ou busca)
 */
export function renderNavigatorTreeContent(folders = [], sheets = [], activeSheetId = '', options = {}) {
  const {
    searchQuery = '',
    scope = 'all',
    visibleFolderIds = [],
    recentSheetIds = [],
    safeUrl = s => s
  } = options;

  const favorites = sheets.filter(s => s && s.favorite);
  const recents = (recentSheetIds || [])
    .map(id => sheets.find(s => s.id === id))
    .filter(Boolean)
    .slice(0, 6);

  const isSearching = Boolean(searchQuery && searchQuery.trim());
  const tree = buildFolderTree(folders, sheets);

  if (isSearching) {
    return renderSearchResults(sheets, folders, searchQuery, activeSheetId, safeUrl);
  }

  let html = '';
  if (favorites.length > 0) html += renderSpecialSection('FAVORITAS', favorites, activeSheetId, 'star', safeUrl);
  if (recents.length > 0) html += renderSpecialSection('RECENTES', recents, activeSheetId, 'clock', safeUrl);
  html += renderTreeNodes(tree, activeSheetId, visibleFolderIds, scope, safeUrl);
  return html;
}

/**
 * Renderiza uma seção especial de favoritos ou recentes
 */
function renderSpecialSection(title, sheetList, activeSheetId, iconName, safeUrl) {
  return `
    <section class="nav-special-section">
      <div class="nav-special-header">
        <span style="display:flex;align-items:center;gap:4px;">
          ${icon(iconName === 'star' ? 'star-filled' : 'clock', 12)}
          <b>${title}</b>
        </span>
        <small>(${sheetList.length})</small>
      </div>
      <div class="nav-special-list">
        ${sheetList.map(sheet => renderSheetRow(sheet, sheet.id === activeSheetId, safeUrl)).join('')}
      </div>
    </section>
  `;
}

/**
 * Renderiza nós de árvore recursivamente
 */
function renderTreeNodes(nodes = [], activeSheetId = '', visibleFolderIds = [], scope = 'all', safeUrl) {
  return nodes.map(node => {
    const { folder, sheets: nodeSheets, children, totalSheets } = node;

    // Filtra o nó se o escopo for incompatível
    if (scope === 'characters' && folder.kind === 'threats') return '';
    if (scope === 'threats' && folder.kind === 'characters') return '';

    const isCollapsed = Boolean(folder.collapsed);
    const isVisibleInRail = visibleFolderIds.length === 0 || visibleFolderIds.includes(folder.id);
    const folderIconName = folder.icon || (folder.id === 'folder-threats' ? 'skull' : (folder.id === 'folder-characters' ? 'user' : 'folder'));

    return `
      <div class="nav-folder-item" data-folder-item-id="${folder.id}">
        <div class="nav-folder-header" 
          data-folder-header-id="${folder.id}" 
          title="${safe(folder.name)} (${totalSheets} fichas)"
          draggable="${!folder.system}">
          <div class="nav-folder-info" data-folder-click-toggle="${folder.id}">
            <button type="button" class="nav-folder-toggle ${!isCollapsed ? 'expanded' : ''}" data-toggle-folder-id="${folder.id}" aria-label="Expandir/recolher">
              ${icon('chevron-right', 11)}
            </button>
            <span class="nav-folder-icon" style="color:${safe(folder.color || '#3187ff')};">
              ${icon(folderIconName, 14)}
            </span>
            <span class="nav-folder-name">${safe(folder.name)}</span>
            <span class="nav-folder-count">(${totalSheets})</span>
          </div>
          <div class="nav-folder-actions">
            <button type="button" 
              class="nav-folder-action-btn ${!isVisibleInRail ? 'visibility-hidden' : ''}" 
              data-toggle-visibility-folder="${folder.id}" 
              title="${isVisibleInRail ? 'Visível no rail lateral (Clique para ocultar)' : 'Oculto no rail (Clique para exibir)'}">
              ${icon(isVisibleInRail ? 'eye' : 'eye-off', 12)}
            </button>
            <button type="button" class="nav-folder-action-btn" data-folder-menu-btn="${folder.id}" title="Mais opções da pasta">
              ${icon('more-vertical', 12)}
            </button>
          </div>
        </div>

        ${!isCollapsed ? `
          <div class="nav-folder-contents" data-folder-drop-zone="${folder.id}">
            ${children.length > 0 ? renderTreeNodes(children, activeSheetId, visibleFolderIds, scope, safeUrl) : ''}
            ${nodeSheets.map(sheet => renderSheetRow(sheet, sheet.id === activeSheetId, safeUrl)).join('')}
            ${nodeSheets.length === 0 && children.length === 0 ? `<small style="display:block;padding:4px 8px;color:#5a5f7d;font-size:10px;">Pasta vazia</small>` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

/**
 * Renderiza uma linha individual de ficha na lista ou árvore
 */
function renderSheetRow(sheet, isActive, safeUrl, folderBreadcrumb = '') {
  if (!sheet) return '';
  const isThreat = sheet.systemMode === 'threat';
  const isOriginal = sheet.systemMode === 'original';

  let badge = '<span class="nav-sheet-badge badge-ordem2">ORDEM II</span>';
  if (isOriginal) {
    badge = '<span class="nav-sheet-badge badge-original">ORDEM RPG</span>';
  } else if (isThreat) {
    badge = `<span class="nav-sheet-badge badge-threat">VD ${sheet.vd || 60}</span>`;
  }

  const avatar = sheet.tokenImage
    ? `<img src="${safeUrl(sheet.tokenImage)}" alt="${safe(sheet.name)}">`
    : safe((sheet.name || '?').slice(0, 1).toUpperCase());

  return `
    <div class="nav-sheet-item ${isActive ? 'active' : ''}" 
      data-nav-sheet-row="${sheet.id}" 
      draggable="true" 
      title="${safe(sheet.name)}">
      <div class="nav-sheet-main" data-select-sheet-id="${sheet.id}">
        <div class="nav-sheet-avatar">
          ${avatar}
        </div>
        <div style="min-width:0;flex:1;">
          <span class="nav-sheet-name">${safe(sheet.name || 'Sem nome')}</span>
          ${folderBreadcrumb ? `<div class="nav-search-breadcrumb">${safe(folderBreadcrumb)}</div>` : ''}
        </div>
        ${badge}
      </div>
      <div class="nav-sheet-actions">
        <button type="button" 
          class="nav-sheet-fav-btn ${sheet.favorite ? 'is-fav' : ''}" 
          data-toggle-fav-sheet="${sheet.id}" 
          title="${sheet.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
          ${icon(sheet.favorite ? 'star-filled' : 'star', 12)}
        </button>
        <button type="button" 
          class="nav-folder-action-btn" 
          data-sheet-menu-btn="${sheet.id}" 
          title="Opções da ficha">
          ${icon('more-vertical', 12)}
        </button>
      </div>
    </div>
  `;
}

/**
 * Renderiza resultados de busca instantânea planos com breadcrumb de pasta
 */
function renderSearchResults(sheets = [], folders = [], query = '', activeSheetId = '', safeUrl) {
  const q = query.trim().toLowerCase();
  const folderMap = new Map(folders.map(f => [f.id, f.name]));

  const results = visibleSheets(sheets, folders, { search: q });

  if (results.length === 0) {
    return `
      <div style="text-align:center;padding:32px 16px;color:#6d728e;">
        ${icon('search', 28)}
        <p style="margin:8px 0 0 0;font-size:12px;font-weight:700;">Nenhuma ficha encontrada</p>
        <small style="font-size:10px;">Tente buscar por outro termo ou nome</small>
      </div>
    `;
  }

  return `
    <div class="nav-search-results">
      <small style="display:block;padding:4px 8px;color:#7e839e;font-size:10px;font-weight:800;letter-spacing:0.06em;">
        ${results.length} ${results.length === 1 ? 'RESULTADO ENCONTRADO' : 'RESULTADOS ENCONTRADOS'}
      </small>
      ${results.map(sheet => {
        const folderName = folderMap.get(sheet.folderId) || 'Personagens';
        return renderSheetRow(sheet, sheet.id === activeSheetId, safeUrl, folderName);
      }).join('')}
    </div>
  `;
}

/**
 * Renderiza apenas os itens de resultado do Quick Switcher
 */
export function renderQuickSwitcherResults(sheets = [], folders = [], query = '', selectedIndex = 0, safeUrl = s => s) {
  const folderMap = new Map(folders.map(f => [f.id, f.name]));
  const q = (query || '').trim().toLowerCase();

  const results = q ? visibleSheets(sheets, folders, { search: q }) : sheets.slice(0, 8);

  const items = results.map((sheet, index) => {
    const isSelected = index === selectedIndex;
    const isThreat = sheet.systemMode === 'threat';
    const isOriginal = sheet.systemMode === 'original';
    const folderName = folderMap.get(sheet.folderId) || (isThreat ? 'Ameaças' : 'Personagens');

    let tag = isOriginal ? 'Ordem RPG' : (isThreat ? `Ameaça · VD ${sheet.vd || 60}` : 'Ordem II');

    const avatar = sheet.tokenImage
      ? `<img src="${safeUrl(sheet.tokenImage)}" alt="${safe(sheet.name)}">`
      : safe((sheet.name || '?').slice(0, 1).toUpperCase());

    return `
      <div class="quick-switcher-item ${isSelected ? 'selected' : ''}" data-qs-pick-index="${index}" data-qs-sheet-id="${sheet.id}">
        <div class="quick-switcher-item-main">
          <div class="quick-switcher-avatar">${avatar}</div>
          <div class="quick-switcher-item-info">
            <div class="quick-switcher-item-name">${safe(sheet.name || 'Sem nome')}</div>
            <div class="quick-switcher-item-sub">${safe(folderName)} · ${safe(tag)}</div>
          </div>
        </div>
        <kbd class="nav-search-kbd">Enter</kbd>
      </div>
    `;
  }).join('');

  return {
    count: results.length,
    results,
    html: items || `<p style="text-align:center;color:#6b708e;padding:20px;font-size:12px;">Nenhuma ficha corresponde à busca.</p>`
  };
}

/**
 * Renderiza o Quick Switcher / Paleta de Comandos (Ctrl+K)
 */
export function renderQuickSwitcherModal(sheets = [], folders = [], query = '', selectedIndex = 0, safeUrl = s => s) {
  const { count, html } = renderQuickSwitcherResults(sheets, folders, query, selectedIndex, safeUrl);

  return `
    <div class="quick-switcher-modal" id="quick-switcher-modal">
      <div class="quick-switcher-backdrop" data-close-quick-switcher></div>
      <div class="quick-switcher-card">
        <div class="quick-switcher-header">
          ${icon('search', 16)}
          <input type="text" 
            placeholder="Digite para buscar qualquer ficha ou pasta..." 
            value="${safe(query)}" 
            data-qs-input 
            autofocus 
            autocomplete="off">
          <button type="button" class="nav-panel-icon-btn" data-close-quick-switcher>${icon('close', 14)}</button>
        </div>
        <div class="quick-switcher-results">
          ${html}
        </div>
        <div class="quick-switcher-footer">
          <div class="quick-switcher-hints">
            <span><kbd>↑</kbd> <kbd>↓</kbd> Navegar</span>
            <span><kbd>↵</kbd> Abrir</span>
            <span><kbd>Esc</kbd> Fechar</span>
          </div>
          <span class="quick-switcher-count" style="font-weight:700;">${count} fichas</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderiza o Drawer Mobile atualizado com Árvore de Pastas
 */
export function renderMobileSheetDrawer(sheets = [], folders = [], activeSheetId = '', options = {}) {
  const { open = false, searchQuery = '', rollLogCount = 0, safeUrl = s => s } = options;
  if (!open) return '';

  const isSearching = Boolean(searchQuery && searchQuery.trim());
  const tree = buildFolderTree(folders, sheets);

  return `
    <div class="sheet-drawer-backdrop" data-close-drawer></div>
    <aside class="sheet-drawer">
      <div class="sheet-drawer-header">
        <span style="display:flex;align-items:center;gap:6px;">
          ${icon('folder', 16)}
          <b>FICHAS & PASTAS</b>
        </span>
        <button data-close-drawer>${icon('close', 16)}</button>
      </div>

      <div class="nav-search-wrap" style="background:#131524;">
        <div class="nav-search-box">
          ${icon('search', 14)}
          <input type="text" placeholder="Buscar fichas..." value="${safe(searchQuery)}" data-mobile-search-input>
          ${searchQuery ? `<button type="button" class="nav-panel-icon-btn" data-mobile-clear-search>${icon('close', 12)}</button>` : ''}
        </div>
      </div>

      <div class="sheet-drawer-list" style="padding:10px;">
        ${isSearching 
          ? renderSearchResults(sheets, folders, searchQuery, activeSheetId, safeUrl)
          : renderTreeNodes(tree, activeSheetId, [], 'all', safeUrl)
        }
      </div>

      <div class="sheet-drawer-footer">
        <button type="button" data-new-sheet class="primary" style="grid-column:span 2;background:var(--red);color:#fff;font-weight:800;">
          ${icon('plus', 15)} NOVA FICHA
        </button>
        <button type="button" data-open-presentation>${icon('presentation', 15)} APRESENTAÇÃO</button>
        <button type="button" data-open-roll-log>${icon('history', 15)} LOG (${rollLogCount})</button>
        <button type="button" data-export-cinematic-image>${icon('camera', 15)} FOTO HD</button>
        <button type="button" data-save-sheet>${icon('save', 15)} SALVAR</button>
      </div>
    </aside>
  `;
}
