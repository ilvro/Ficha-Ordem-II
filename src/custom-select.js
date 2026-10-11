// Dropdown próprio no lugar do <select> nativo, para a lista de opções seguir o
// visual da ficha. O <select> continua no DOM (escondido) como fonte da
// verdade: escolher uma opção define seu valor e dispara "change", então os
// handlers existentes não precisam saber deste componente.
const SELETOR = 'select.original-select, .styled-select select, .ocin-identity-edit select';
const CARET = '<svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const BUSCA_A_PARTIR_DE = 9;

let aberto = null;

export function fecharSelect() {
  if (!aberto) return;
  aberto.pop.remove();
  aberto.btn.setAttribute('aria-expanded', 'false');
  document.removeEventListener('pointerdown', aberto.fora, true);
  window.removeEventListener('resize', fecharSelect);
  window.removeEventListener('scroll', aberto.rolagem, true);
  aberto = null;
}

function rotulo(sel) {
  return sel.selectedOptions[0]?.textContent.trim() || '';
}

function abrir(sel, btn) {
  fecharSelect();
  const pop = document.createElement('div');
  pop.className = 'cselect-pop';
  pop.tabIndex = -1;
  const opcoes = [...sel.options];
  const busca = opcoes.length >= BUSCA_A_PARTIR_DE ? document.createElement('input') : null;
  if (busca) {
    busca.className = 'cselect-search';
    busca.type = 'text';
    busca.placeholder = 'BUSCAR…';
    busca.setAttribute('aria-label', 'Buscar opção');
    pop.appendChild(busca);
  }
  const lista = document.createElement('div');
  lista.className = 'cselect-list';
  lista.setAttribute('role', 'listbox');
  opcoes.forEach(o => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `cselect-opt${o.selected ? ' selected' : ''}${o.value === '' ? ' vazio' : ''}`;
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', String(o.selected));
    item.dataset.value = o.value;
    item.textContent = o.textContent.trim();
    lista.appendChild(item);
  });
  pop.appendChild(lista);

  // O pop-up fica no <body>; herda a cor tema do ponto onde o campo está.
  const estilo = getComputedStyle(btn);
  const tema = estilo.getPropertyValue('--cinematic-accent').trim() || estilo.getPropertyValue('--red').trim();
  if (tema) pop.style.setProperty('--cs-accent', tema);

  document.body.appendChild(pop);
  const r = btn.getBoundingClientRect();
  const largura = Math.min(Math.max(r.width, 220), window.innerWidth - 16);
  const abaixo = window.innerHeight - r.bottom - 12;
  const acima = r.top - 12;
  const paraCima = abaixo < 200 && acima > abaixo;
  pop.style.width = `${largura}px`;
  pop.style.left = `${Math.max(8, Math.min(r.left, window.innerWidth - largura - 8))}px`;
  pop.style.maxHeight = `${Math.max(140, Math.min(340, paraCima ? acima : abaixo))}px`;
  if (paraCima) pop.style.bottom = `${window.innerHeight - r.top + 4}px`;
  else pop.style.top = `${r.bottom + 4}px`;
  pop.classList.toggle('para-cima', paraCima);

  const visiveis = () => [...lista.querySelectorAll('.cselect-opt:not([hidden])')];
  const ativar = item => {
    lista.querySelector('.cselect-opt.active')?.classList.remove('active');
    if (item) { item.classList.add('active'); item.scrollIntoView({ block: 'nearest' }); }
  };
  const escolher = item => {
    if (!item) return;
    const mudou = sel.value !== item.dataset.value;
    sel.value = item.dataset.value;
    btn.querySelector('.cselect-label').textContent = rotulo(sel);
    fecharSelect();
    btn.focus();
    if (mudou) sel.dispatchEvent(new Event('change', { bubbles: true }));
  };

  lista.onclick = e => escolher(e.target.closest('.cselect-opt'));
  lista.onpointermove = e => { const item = e.target.closest('.cselect-opt'); if (item && !item.classList.contains('active')) ativar(item); };
  if (busca) {
    busca.oninput = () => {
      const termo = busca.value.trim().toLowerCase();
      lista.querySelectorAll('.cselect-opt').forEach(item => { item.hidden = !!termo && !item.textContent.toLowerCase().includes(termo); });
      ativar(visiveis()[0]);
      lista.classList.toggle('sem-resultado', !visiveis().length);
    };
  }
  pop.onkeydown = e => {
    const itens = visiveis();
    const i = itens.indexOf(lista.querySelector('.cselect-opt.active'));
    if (e.key === 'ArrowDown') { e.preventDefault(); ativar(itens[Math.min(itens.length - 1, i + 1)]); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); ativar(itens[Math.max(0, i - 1)]); }
    else if (e.key === 'Enter') { e.preventDefault(); escolher(itens[i]); }
    else if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); fecharSelect(); btn.focus(); }
  };

  aberto = {
    pop,
    btn,
    fora: e => { if (!pop.contains(e.target) && !btn.contains(e.target)) fecharSelect(); },
    rolagem: e => { if (!pop.contains(e.target)) fecharSelect(); },
  };
  document.addEventListener('pointerdown', aberto.fora, true);
  window.addEventListener('resize', fecharSelect);
  window.addEventListener('scroll', aberto.rolagem, true);
  btn.setAttribute('aria-expanded', 'true');
  ativar(lista.querySelector('.cselect-opt.selected') || visiveis()[0]);
  (busca || pop).focus();
}

// Chamado depois de cada render: troca os <select> ainda não tratados.
export function enhanceSelects(root = document) {
  fecharSelect();
  root.querySelectorAll(SELETOR).forEach(sel => {
    if (sel.dataset.cselect) return;
    sel.dataset.cselect = '1';
    const wrap = document.createElement('span');
    wrap.className = 'cselect';
    sel.parentNode.insertBefore(wrap, sel);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cselect-btn';
    btn.disabled = sel.disabled;
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    if (sel.title) btn.title = sel.title;
    btn.innerHTML = `<span class="cselect-label"></span>${CARET}`;
    btn.querySelector('.cselect-label').textContent = rotulo(sel);
    btn.onclick = () => (aberto?.btn === btn ? fecharSelect() : abrir(sel, btn));
    btn.onkeydown = e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); abrir(sel, btn); } };
    wrap.append(btn, sel);
    sel.classList.add('cselect-native');
    sel.tabIndex = -1;
    sel.setAttribute('aria-hidden', 'true');
  });
}
