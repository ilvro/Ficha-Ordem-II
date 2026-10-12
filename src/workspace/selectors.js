/**
 * Seletores puros e utilitários de consulta para Fichas e Pastas
 */

export function isCharacterSheet(sheet) {
  return !!sheet && sheet.systemMode !== 'threat';
}

export function isThreatSheet(sheet) {
  return !!sheet && sheet.systemMode === 'threat';
}

export function getFolderById(folders = [], id) {
  return folders.find(f => f.id === id) || null;
}

export function getRootFolders(folders = []) {
  return folders.filter(f => !f.parentId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getSubfolders(folders = [], parentId) {
  return folders.filter(f => f.parentId === parentId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getSheetsInFolder(sheets = [], folderId) {
  if (!folderId) return [];
  return sheets.filter(s => s && s.folderId === folderId);
}

/**
 * Retorna todos os IDs de pastas descendentes de uma dada pasta pai.
 */
export function getAllDescendantFolderIds(folders = [], parentId) {
  const ids = [];
  const queue = [parentId];
  while (queue.length > 0) {
    const curr = queue.shift();
    const children = folders.filter(f => f.parentId === curr);
    children.forEach(c => {
      ids.push(c.id);
      queue.push(c.id);
    });
  }
  return ids;
}

/**
 * Filtra e ordena as fichas de acordo com o escopo, busca e opções fornecidas.
 */
export function visibleSheets(sheets = [], folders = [], options = {}) {
  let list = Array.isArray(sheets) ? [...sheets] : [];

  // 1. Filtro estrito: apenas personagens (usado pelo Modo Apresentação)
  if (options.apenasPersonagens) {
    list = list.filter(isCharacterSheet);
  } else if (options.apenasAmeacas) {
    list = list.filter(isThreatSheet);
  }

  // 2. Filtro por sistema
  if (options.systemMode && options.systemMode !== 'all') {
    list = list.filter(s => s.systemMode === options.systemMode);
  }

  // 3. Filtro por escopo de pasta
  const scope = options.scope || options.escopo;
  if (scope && scope !== 'all') {
    if (scope === 'characters' || scope === 'personagens' || scope === 'folder-characters') {
      const charFolderIds = ['folder-characters', ...getAllDescendantFolderIds(folders, 'folder-characters')];
      list = list.filter(s => isCharacterSheet(s) || charFolderIds.includes(s.folderId));
    } else if (scope === 'threats' || scope === 'ameacas' || scope === 'folder-threats') {
      const threatFolderIds = ['folder-threats', ...getAllDescendantFolderIds(folders, 'folder-threats')];
      list = list.filter(s => isThreatSheet(s) || threatFolderIds.includes(s.folderId));
    } else {
      // Escopo de uma pasta específica ou suas subpastas
      const folderIds = [scope, ...(options.includeSubfolders !== false ? getAllDescendantFolderIds(folders, scope) : [])];
      list = list.filter(s => folderIds.includes(s.folderId));
    }
  }

  // 4. Filtro por pastas ativas/visíveis (se especificado conjunto)
  if (Array.isArray(options.visibleFolderIds) && options.visibleFolderIds.length > 0) {
    list = list.filter(s => options.visibleFolderIds.includes(s.folderId));
  }

  // 5. Favoritas apenas
  if (options.favoriteOnly) {
    list = list.filter(s => !!s.favorite);
  }

  // 6. Busca textual instantânea (nome, elemento, tipo, ocupação, classe, VD)
  if (options.search && typeof options.search === 'string') {
    const q = options.search.trim().toLowerCase();
    if (q) {
      list = list.filter(s => {
        const name = (s.name || '').toLowerCase();
        const occ = (s.occupation || '').toLowerCase();
        const profile = (s.profile || '').toLowerCase();
        const classe = (s.classeId || '').toLowerCase();
        const subtitulo = (s.subtitulo || '').toLowerCase();
        const vd = String(s.vd || '');
        const elem = Array.isArray(s.elementos) ? s.elementos.join(' ').toLowerCase() : '';
        const tipo = (s.tipo || '').toLowerCase();

        return (
          name.includes(q) ||
          occ.includes(q) ||
          profile.includes(q) ||
          classe.includes(q) ||
          subtitulo.includes(q) ||
          vd.includes(q) ||
          elem.includes(q) ||
          tipo.includes(q)
        );
      });
    }
  }

  // 7. Ordenação
  if (options.sort === 'name') {
    list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR', { sensitivity: 'base' }));
  } else if (options.sort === 'vd') {
    list.sort((a, b) => (Number(b.vd) || 0) - (Number(a.vd) || 0));
  } else if (options.sort === 'recent') {
    list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }
  // Se 'manual', preserva a ordem nativa do array `sheets`

  return list;
}

/**
 * Constrói a estrutura em árvore das pastas com suas fichas e contadores.
 */
export function buildFolderTree(folders = [], sheets = [], options = {}) {
  const fList = normalizeFoldersTree(folders);
  const sList = Array.isArray(sheets) ? sheets : [];

  function buildNode(folder) {
    const directSheets = sList.filter(s => s && s.folderId === folder.id);
    const childrenFolders = fList.filter(f => f.parentId === folder.id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const childrenNodes = childrenFolders.map(buildNode);

    const totalSheets = directSheets.length + childrenNodes.reduce((acc, c) => acc + c.totalSheets, 0);

    return {
      folder,
      sheets: directSheets,
      children: childrenNodes,
      totalSheets
    };
  }

  const rootFolders = fList.filter(f => !f.parentId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return rootFolders.map(buildNode);
}

function normalizeFoldersTree(folders) {
  if (!Array.isArray(folders)) return [];
  return folders.map(f => ({ ...f }));
}
