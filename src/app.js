const icon=(name,size=19)=>{const paths={
  sheet:'<path d="M6 3h9l4 4v14H6Z"/><path d="M14 3v5h5M9 12h7M9 16h7"/>',
  book:'<path d="M4 5a4 4 0 0 1 4-2h4v17H8a4 4 0 0 0-4 2Z"/><path d="M20 5a4 4 0 0 0-4-2h-4v17h4a4 4 0 0 1 4 2Z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',save:'<path d="M5 3h12l3 3v15H4V3Z"/><path d="M8 3v6h8V3M8 21v-8h8v8"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',filter:'<path d="M4 5h16l-6 7v6l-4 2v-8Z"/>',
  chevron:'<path d="m8 10 4 4 4-4"/>',info:'<circle cx="12" cy="12" r="8"/><path d="M12 11v5M12 8h.01"/>',
  edit:'<path d="m14 5 5 5L8 21H3v-5Z"/>',chat:'<path d="M4 5h16v12H9l-5 4Z"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-5 4 4 2-2 5 4"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
  film:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  grid:'<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>'};
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${paths[name]||''}</svg>`};

const DICE_STEPS=[4,6,8,10,12,20];
const TRAINING=[['DESTREINADO',4],['TREINADO',6],['ESPECIALISTA',8],['MESTRE',10],['GRÃO MESTRE',12]];
const PROFILE_COLORS={Executor:'#e0150d',Analista:'#2162ff',Vigilante:'#63bd42'};
const SKILL_INFO={
 'ACROBACIA':['Movimentos de ginástica e parkour, andar de skate ou patins.','Físico'],
 'APTIDÃO (HUMANAS)':['Conhecimento em um campo específico. ARTES: música, dança, escrita, pintura, atuação e outras formas de arte. ATUALIDADES: esporte, entretenimento e cultura popular. BUROCRACIA: direito, política, economia, contabilidade e estruturas governamentais e corporativas. EXATAS: matemática, física, química, biologia, astronomia e geologia. HUMANAS: história, geografia, filosofia, sociologia, teologia e linguística. TÁTICA: educação militar e estratégica.','Mente'],
 'APTIDÃO':['Conhecimento em um campo específico: Artes, Atualidades, Burocracia, Exatas, Humanas ou Tática.','Mente'],
 'ATLETISMO':['Correr, saltar, escalar, nadar e remar.','Físico'],
 'CRIME':['Furtar objetos, abrir fechaduras e falsificar documentos.','Físico'],
 'DISCIPLINA':['Estudar, meditar e resistir a traumas e sustos.','Emoção'],
 'ENGANAÇÃO':['Mentir, disfarçar-se e seduzir.','Emoção'],
 'FURTIVIDADE':['Esconder-se e andar sem ser visto ou ouvido.','Físico'],
 'INTIMIDAR':['Assustar pessoas e coagi-las a fazerem o que você quer.','Emoção'],
 'INTIMIDAÇÃO':['Assustar pessoas e coagi-las a fazerem o que você quer.','Emoção'],
 'INTUIÇÃO':['“Sexto sentido” para analisar pessoas e ambientes.','Emoção'],
 'LUTA':['Atacar desarmado ou com armas corpo a corpo.','Físico'],
 'MÁQUINAS':['Operar e consertar máquinas e dirigir veículos motorizados.','Mente'],
 'MEDICINA':['Primeiros socorros, tratamentos e necropsias.','Mente'],
 'OCULTISMO':['Conhecimento sobre o paranormal.','Mente'],
 'PERCEPÇÃO':['Notar coisas através de visão, audição e olfato e revistar lugares.','Mente'],
 'PERSUASÃO':['Convencer pessoas com argumentos e lábia.','Emoção'],
 'PESQUISAR':['Pesquisar documentos e bancos de dados e analisar evidências.','Mente'],
 'PESQUISA':['Pesquisar documentos e bancos de dados e analisar evidências.','Mente'],
 'PONTARIA':['Atacar com armas de arremesso ou de disparo.','Físico'],
 'SOBREVIVÊNCIA':['Montar acampamento, rastrear e acalmar animais ferozes.','Mente'],
 'TECNOLOGIA':['Operar dispositivos tecnológicos e hackear redes.','Mente'],
 'VIGOR':['Manter o fôlego, resistir a venenos e suportar ferimentos.','Físico']
};
const skillSeed=[
 ['ACROBACIA','DESTREINADO',4,'Físico'],['APTIDÃO (HUMANAS)','TREINADO',6,'Mente'],['ATLETISMO','DESTREINADO',4,'Físico'],['CRIME','TREINADO',6,'Físico'],
 ['DISCIPLINA','TREINADO',6,'Emoção'],['ENGANAÇÃO','TREINADO',6,'Emoção'],['FURTIVIDADE','DESTREINADO',4,'Físico'],['INTIMIDAR','DESTREINADO',4,'Emoção'],
 ['INTUIÇÃO','TREINADO',6,'Emoção'],['LUTA','DESTREINADO',4,'Físico'],['MÁQUINAS','TREINADO',6,'Mente'],['MEDICINA','DESTREINADO',4,'Mente'],
 ['OCULTISMO','TREINADO',6,'Mente'],['PERCEPÇÃO','TREINADO',6,'Mente'],['PERSUASÃO','DESTREINADO',4,'Emoção'],['PESQUISAR','ESPECIALISTA',8,'Mente'],
 ['PONTARIA','DESTREINADO',4,'Físico'],['SOBREVIVÊNCIA','DESTREINADO',4,'Mente'],['TECNOLOGIA','TREINADO',6,'Mente'],['VIGOR','DESTREINADO',4,'Físico']];
const defaultSkills=skillSeed.map(([name,training,skillDie,attribute])=>({name,training,skillDie,attribute,extra:0}));
const defaultCards=[
 {id:'impeto',profileAbility:'Executor',themeLinked:true,schema:'abilities',title:'ÍMPETO',type:'Recurso',content:'Você possui uma barra de Ímpeto com três espaços. Sempre que falha em um teste, você preenche um espaço nessa barra.\n\nVocê pode apagar espaços preenchidos para:\n- 1 Receber +4 em um teste\n- 3 Aumentar um atributo em um passo até o final da cena',accent:'#e0150d',icon:'◆',markers:[{id:'impeto-m',type:'pips',displayStyle:'rectangles',label:'Ímpeto',current:0,maxFormula:'3'}],actions:[]},
 {id:'foco-mental',themeLinked:true,schema:'abilities',title:'FOCO MENTAL',type:'Habilidade',content:'Quando faz um teste mental, você pode gastar 2 PD para receber +4 no teste.',accent:'#e91d25',icon:'◈',markers:[],actions:[{id:'foco-a',name:'Teste mental',expression:'1d8'}]},
 {id:'kit',themeLinked:true,schema:'items',title:'KIT DE INVESTIGAÇÃO',type:'Equipamento',content:'Ferramentas para analisar cenas, coletar amostras e registrar pistas.',accent:'#e91d25',icon:'⌕',markers:[{id:'kit-m',type:'pips',label:'Usos',current:3,maxFormula:'3'}],actions:[]},
 {id:'pistola',themeLinked:true,schema:'items',title:'PISTOLA',type:'Arma',content:'Uma arma de serviço compacta. Dano 1d8.',accent:'#e91d25',icon:'†',markers:[{id:'pistola-m',type:'pips',displayStyle:'rectangles',label:'Munição',current:6,maxFormula:'6'}],actions:[{id:'pistola-a',name:'Ataque de pistola',expression:'1d8'}]}
];
const PROFILE_ABILITIES={
 Executor:defaultCards[0],
 Vigilante:{id:'prontidao',profileAbility:'Vigilante',themeLinked:true,schema:'abilities',title:'PRONTIDÃO',type:'Habilidade de Perfil',content:'No início de qualquer conflito, você pode gastar **3 PD**. Se fizer isso, **ganha uma rodada** na qual pode agir antes dos demais personagens e NPCs.',accent:'#63bd42',icon:'◆',markers:[],actions:[]},
 Analista:{id:'avaliacao',profileAbility:'Analista',themeLinked:true,schema:'abilities',title:'AVALIAÇÃO',type:'Habilidade de Perfil',content:'Você pode gastar uma ação e **2 PD** para observar um ser ou ambiente. Você recebe 2d4 que pode usar em testes relativos àquele ser ou ambiente. Você pode usá-los como quiser, recebendo +2d4 em um teste ou +1d4 em dois testes.\n\nVocê não pode acumular mais do que dois dados bônus por esta habilidade.',accent:'#2162ff',icon:'◈',markers:[{id:'avaliacao-dados',type:'pips',label:'Dados bônus',current:0,maxFormula:'2'}],actions:[]}
};
const defaults={name:'ALAN',occupation:'Cientista',profile:'Executor',level:2,pv:10,maxPv:12,pvTemp:0,pd:16,maxPd:18,pdTemp:0,history:'',tokenImage:'',backgroundImage:'',diceColor:'',viewMode:'traditional',cinematicTokenX:50,cinematicTokenY:52,cinematicTokenScale:100,cinematicCollapsed:{abilities:false,items:false,history:false},attributes:{Físico:6,Mente:8,Emoção:8},skills:defaultSkills,cards:defaultCards};
const safe=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=value=>/^(https?:\/\/|data:image\/|data:video\/)/i.test(String(value||''))?safe(value):'';
const clone=value=>structuredClone(value);
const makeId=prefix=>`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;

function normalizeCard(card){
 const migratedMarkers=Number(card.markerMax)>0?[{id:makeId('marker'),type:'pips',label:card.markerLabel||'Marcador',current:Number(card.markerCurrent)||0,maxFormula:String(card.markerMax)}]:[];
 const migratedActions=Number(card.rollSides)>0?[{id:makeId('action'),name:card.rollName||'Rolar',expression:`1d${card.rollSides}`}]:[];
 const knownProfile=Object.entries(PROFILE_ABILITIES).find(([,template])=>String(template.title).toUpperCase()===String(card.title).toUpperCase());
 const markers=(Array.isArray(card.markers)?card.markers:migratedMarkers).map(marker=>({...marker,displayStyle:marker.displayStyle||'default'}));
 if(card.id==='impeto'||card.id==='pistola')markers.forEach(marker=>{if(marker.type==='pips'&&marker.displayStyle==='default')marker.displayStyle='rectangles'});
 return {...card,profileAbility:card.profileAbility||knownProfile?.[0],themeLinked:card.themeLinked!==false,markers,actions:Array.isArray(card.actions)?card.actions:migratedActions};
}
function ensureProfileAbility(sheet,profile=sheet.profile){const template=PROFILE_ABILITIES[profile];if(!template)return;const expected=String(template.title).toUpperCase(),existing=sheet.cards?.find(card=>card.profileAbility===profile||String(card.title).toUpperCase()===expected);if(existing){existing.profileAbility=profile;return}sheet.cards.push(normalizeCard(clone(template)))}
function normalizeSheet(raw={}){
 const sheet={...clone(defaults),...raw}; sheet.id=raw.id||makeId('sheet');
 sheet.attributes={...defaults.attributes,...raw.attributes};
 sheet.skills=Array.isArray(raw.skills)?raw.skills:clone(defaultSkills);
 sheet.skills=sheet.skills.map(skill=>{let training=skill.training;if(training==='VETERANO')training='ESPECIALISTA';if(training==='EXPERT')training='MESTRE';if(training==='MESTRE'&&Number(skill.skillDie)===12)training='GRÃO MESTRE';const found=TRAINING.find(([label])=>label===training)||TRAINING.find(([,die])=>die===Number(skill.skillDie))||TRAINING[0];return {...skill,training:found[0],skillDie:found[1],extra:Number(skill.extra)||0}});
 sheet.cards=(Array.isArray(raw.cards)?raw.cards:clone(defaultCards)).map(normalizeCard);
 ensureProfileAbility(sheet);
 ['pv','maxPv','pvTemp','pd','maxPd','pdTemp','level'].forEach(key=>sheet[key]=Math.max(0,Number(sheet[key])||0));
 sheet.viewMode=sheet.viewMode==='cinematic'?'cinematic':'traditional';sheet.cinematicTokenX=Math.max(0,Math.min(100,Number(sheet.cinematicTokenX)||50));sheet.cinematicTokenY=Math.max(0,Math.min(100,Number(sheet.cinematicTokenY)||52));sheet.cinematicTokenScale=Math.max(45,Math.min(220,Number(sheet.cinematicTokenScale)||100));
 sheet.cinematicCollapsed={...defaults.cinematicCollapsed,...sheet.cinematicCollapsed};
 return sheet;
}
const DB_NAME='ordem-ii-db',DB_STORE='sheets-store';
function openDb(){
 return new Promise(resolve=>{
  if(!window.indexedDB)return resolve(null);
  const req=indexedDB.open(DB_NAME,1);
  req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(DB_STORE))db.createObjectStore(DB_STORE)};
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>resolve(null);
 });
}
async function idbGet(key){
 try{
  const db=await openDb();
  if(!db)return null;
  return new Promise(resolve=>{
   const tx=db.transaction(DB_STORE,'readonly'),store=tx.objectStore(DB_STORE),req=store.get(key);
   req.onsuccess=()=>resolve(req.result??null);
   req.onerror=()=>resolve(null);
  });
 }catch{return null}
}
async function idbSet(key,value){
 try{
  const db=await openDb();
  if(!db)return false;
  return new Promise(resolve=>{
   const tx=db.transaction(DB_STORE,'readwrite'),store=tx.objectStore(DB_STORE);
   store.put(value,key);
   tx.oncomplete=()=>resolve(true);
   tx.onerror=()=>resolve(false);
  });
 }catch{return false}
}
const SHEETS_KEY='ordem-ii-sheets-v1';
let sheets=[];
let state=normalizeSheet();
let activeSheetId=state.id;

async function loadInitialSheets(){
 let loaded=null;
 try{
  const res=await fetch('/api/sheets',{cache:'no-store'});
  if(res.ok){
   const data=await res.json();
   if(Array.isArray(data)&&data.length>0)loaded=data.map(normalizeSheet);
  }
 }catch{}
 if(!loaded||!loaded.length){
  try{
   const idbSheets=await idbGet('sheets');
   if(Array.isArray(idbSheets)&&idbSheets.length>0)loaded=idbSheets.map(normalizeSheet);
  }catch{}
 }
 if(!loaded||!loaded.length){
  try{
   const local=JSON.parse(localStorage.getItem(SHEETS_KEY)||'[]');
   if(Array.isArray(local)&&local.length>0)loaded=local.map(normalizeSheet);
  }catch{}
 }
 if(!loaded||!loaded.length){
  let legacy={};
  try{legacy=JSON.parse(localStorage.getItem('ordem-ii-alpha-sheet-v2')||'{}')}catch{}
  loaded=[normalizeSheet(legacy)];
 }
 sheets=loaded;
 let storedActiveId=null;
 try{storedActiveId=await idbGet('activeSheetId')||localStorage.getItem('ordem-ii-active-sheet')}catch{}
 state=sheets.find(sheet=>sheet.id===storedActiveId)||sheets[0];
 activeSheetId=state.id;
 idbSet('sheets',sheets);
 idbSet('activeSheetId',activeSheetId);
 try{localStorage.setItem(SHEETS_KEY,JSON.stringify(sheets));localStorage.setItem('ordem-ii-active-sheet',activeSheetId)}catch{}
}
let currentRight='abilities',currentView='stats',editMode=false,modeJustChanged=false,editorMarkers=[],editorActions=[],diceApiPromise,blobBgType='',currentResourceShift=120;
const getDiceApi=()=>diceApiPromise??=import('./dice3d.js');
const app=document.querySelector('#app');
const diceGeometry={
 4:{points:'50,5 94,88 6,88',facets:'M50 5 L50 54 M6 88 L50 54 L94 88',highlights:'M50 5 L50 54 L6 88 Z',shadows:'M50 54 L94 88 L6 88 Z'},
 6:{points:'50,4 94,27 94,73 50,96 6,73 6,27',facets:'M6 27 L50 50 L94 27 M50 50 V96',highlights:'M50 4 L94 27 L50 50 L6 27 Z',shadows:'M50 50 L94 27 V73 L50 96 Z'},
 8:{points:'50,4 94,25 94,75 50,96 6,75 6,25',facets:'M50 4 L94 75 H6 Z',highlights:'M50 4 L6 75 V25 Z',shadows:'M50 4 L94 25 V75 Z M6 75 H94 L50 96 Z'},
 10:{points:'50,4 94,34 94,66 50,96 6,66 6,34',facets:'M50 4 L82 70 L50 88 L18 70 Z M6 66 L18 70 M82 70 L94 66 M50 88 V96',highlights:'M50 4 L18 70 L6 66 V34 Z',shadows:'M50 4 L94 34 V66 L82 70 Z M6 66 L50 88 L94 66 L50 96 Z'},
 12:{points:'50,4 77,13 94,36 94,64 77,87 50,96 23,87 6,64 6,36 23,13',facets:'M50 22 L77 42 L67 74 H33 L23 42 Z M50 4 V22 M94 36 L77 42 M77 87 L67 74 M23 87 L33 74 M6 36 L23 42',highlights:'M50 4 V22 L23 42 L6 36 L23 13 Z',shadows:'M77 42 L94 36 V64 L77 87 L67 74 Z M33 74 H67 L77 87 L50 96 L23 87 Z'},
 20:{points:'50,4 94,25 94,75 50,96 6,75 6,25',facets:'M50 4 V12 M6 25 L50 12 L94 25 L84 74 L94 75 M84 74 L50 96 L16 74 L6 75 M6 25 L16 74 M16 74 L50 12 L84 74 Z',highlights:'M50 4 L50 12 L6 25 Z M6 25 L50 12 L16 74 Z',shadows:'M50 12 L94 25 L84 74 Z M16 74 H84 L50 96 Z M84 74 L94 25 V75 L50 96 Z'}};
const die=(value,kind='',trained=false)=>{const g=diceGeometry[Number(value)]||diceGeometry[20];return `<span class="die-svg ${kind} ${trained?'trained':''}" data-sides="${value}"><svg viewBox="0 0 100 100" aria-label="d${value}"><polygon class="die-face" points="${g.points}"/><path class="die-highlight" d="${g.highlights}"/><path class="die-shadow" d="${g.shadows}"/><path class="die-facets" d="${g.facets}"/><text x="50" y="55" text-anchor="middle" dominant-baseline="middle">${value}</text></svg></span>`};
function formatCardText(value){let text=safe(value);text=text.replace(/(\+?)\s*(\d*)d(4|6|8|10|12|20)\b/gi,(_,plus,count,sides)=>`${plus?'<span class="dice-plus">+</span>':''}${Array.from({length:Math.min(12,Number(count)||1)},()=>die(Number(sides),'inline-die',Number(sides)>4)).join('')}`);text=text.replace(/\*\*(.+?)\*\*/gs,'<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>').replace(/\[u\](.+?)\[\/u\]/gis,'<u>$1</u>').replace(/\[color=(#[0-9a-f]{6})\](.+?)\[\/color\]/gis,'<span style="color:$1">$2</span>');return text.replace(/\n/g,'<br>')}
const displayOption=option=>option.html||safe(option.label);
function customSelect({value,options,id,className='',disabled=false,formName=''}){const selected=options.find(option=>String(option.value)===String(value))||{label:value};return `${formName?`<input type="hidden" name="${formName}" value="${safe(value)}">`:''}<div class="custom-select ${className} ${disabled?'disabled':''}" data-select-id="${id}" ${formName?`data-form-name="${formName}"`:''}><button type="button" class="select-trigger" ${disabled?'disabled':''}><span class="select-display">${safe(selected.triggerLabel||selected.label)}</span>${icon('chevron',17)}</button><div class="select-menu">${options.map(option=>`<button type="button" class="select-option ${String(option.value)===String(value)?'selected':''}" data-select-value="${safe(option.value)}" data-trigger-label="${safe(option.triggerLabel||option.label)}"><span class="option-content">${displayOption(option)}</span><b>${String(option.value)===String(value)?'✓':''}</b></button>`).join('')}</div></div>`}
function tornTitle(text,wide=false){return `<div class="section-line"><h2 class="torn ${wide?'wide':''}">${text}</h2></div>`}
function pips(current,max,key,temp=0){const regular=Array.from({length:max},(_,i)=>`<button class="pip ${i<current?'filled':''}" data-set-resource="${key}:${i+1}" aria-label="${i+1}"></button>`).join('');const temporary=Array.from({length:temp},()=>`<span class="pip temporary filled" title="${temp} temporário"></span>`).join('');return regular+temporary}
const formulaKey=value=>String(value).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function formulaVariables(){return{level:state.level,pv:state.pv,pd:state.pd,maxpv:state.maxPv,maxpd:state.maxPd,fisico:state.attributes.Físico,mente:state.attributes.Mente,emocao:state.attributes.Emoção}}
function evaluateFormula(expression){const vars=formulaVariables(),expanded=String(expression||'0').replace(/@\{([^}]+)\}/g,(_,key)=>String(vars[formulaKey(key)]??0));if(!/^[\d+\-*/().\s]+$/.test(expanded))return 0;try{return Math.max(0,Math.floor(Function(`"use strict";return (${expanded})`)()))}catch{return 0}}
function markerMax(marker){return Math.min(100,evaluateFormula(marker.maxFormula||'0'))}
function renderMarker(card,marker){const max=markerMax(marker),current=Math.min(Number(marker.current)||0,max||999),id=`${card.id}:${marker.id}`,displayStyle=marker.displayStyle||'default';if(marker.type==='toggle')return `<div class="card-marker marker-toggle style-${displayStyle}"><span>${safe(marker.label)}</span><button class="toggle-switch ${current?'on':''}" data-card-marker="${id}:toggle"><i></i>${current?'LIGADO':'DESLIGADO'}</button></div>`;if(marker.type==='bar'&&displayStyle!=='rectangles')return `<div class="card-marker marker-bar style-${displayStyle}"><div><span>${safe(marker.label)}</span><strong>${current}/${max}</strong></div><button class="progress-track" data-card-marker="${id}:1"><i style="width:${max?current/max*100:0}%"></i></button><div class="marker-buttons"><button data-card-marker="${id}:-1">−</button><button data-card-marker="${id}:1">+</button></div></div>`;if(marker.type==='pips'||(marker.type==='bar'&&displayStyle==='rectangles'))return `<div class="card-marker marker-pips style-${displayStyle}"><span>${safe(marker.label)}</span><div class="marker-slots">${Array.from({length:max},(_,i)=>`<button class="charge ${i<current?'on':''}" data-card-marker-set="${id}:${i+1}"></button>`).join('')}</div><strong>${current}/${max}</strong></div>`;return `<div class="card-marker style-${displayStyle}"><span>${safe(marker.label)}</span><button data-card-marker="${id}:-1">−</button><strong>${current}${max?`/${max}`:''}</strong><button data-card-marker="${id}:1">+</button></div>`}
function cardAccent(card){return card.themeLinked!==false?(PROFILE_COLORS[state.profile]||PROFILE_COLORS.Executor):(card.accent||PROFILE_COLORS[state.profile])}
function visibleCards(schema){return state.cards.filter(card=>card.schema===schema&&(!card.profileAbility||card.profileAbility===state.profile))}
function renderResourceCard(card){const image=safeUrl(card.imageUrl)?`<img class="card-image" src="${safeUrl(card.imageUrl)}" alt="">`:'';const markers=(card.markers||[]).map(marker=>renderMarker(card,marker)).join('');const actions=(card.actions||[]).map(action=>`<button class="card-roll" data-expression="${safe(action.expression)}" data-roll-title="${safe(action.name||card.title)}">${die((String(action.expression).match(/d(4|6|8|10|12|20)/i)||[])[1]||20,'micro',true)}<span>${safe(action.name||'Rolar')}</span><small>${safe(action.expression)}</small></button>`).join('');return `<article class="ability resource-card layout-${safe(card.layout||'standard')} ${card.collapsed?'collapsed':''}" draggable="true" data-card-id="${card.id}" data-filter="${safe((card.title+' '+card.type+' '+card.content).toLowerCase())}" style="--card-accent:${safe(cardAccent(card))}"><div class="card-head">${tornTitle(`${safe(card.icon||'◆')} ${safe(card.title)}`)}<div class="card-actions"><button data-toggle-card="${card.id}">⌃</button><button data-move="${card.id}:-1">↑</button><button data-move="${card.id}:1">↓</button><button data-duplicate-card="${card.id}">⧉</button><button data-edit-card="${card.id}" title="Editar habilidade">${icon('edit',14)}</button></div></div><div class="card-details">${image}<small>Tipo: ${safe(card.type||'Habilidade')}</small>${markers}<p class="card-copy">${formatCardText(card.content)}</p><div class="card-rolls">${actions}</div></div></article>`}
function resourceEditor(key,label){const maxKey=`max${key[0].toUpperCase()}${key.slice(1)}`,tempKey=`${key}Temp`;return `<div class="resource-row"><strong class="mini-torn">${label}</strong><b>${state[key]}${state[tempKey]?` <em>+${state[tempKey]}</em>`:''}</b><div class="pips">${pips(state[key],state[maxKey],key,state[tempKey])}</div>${editMode?`<div class="resource-config"><span>MÁX <button data-resource-adjust="${maxKey}:-1">−</button><i>${state[maxKey]}</i><button data-resource-adjust="${maxKey}:1">+</button></span><span>TEMP <button data-resource-adjust="${tempKey}:-1">−</button><i>${state[tempKey]}</i><button data-resource-adjust="${tempKey}:1">+</button></span></div>`:''}</div>`}
function attributeStepper(name,value){return `<div class="attribute-stepper"><button data-attribute-step="${name}:-1">−</button><b>d${value}</b><button data-attribute-step="${name}:1">+</button></div>`}
function applyTheme(){const accent=editMode?'#d98b19':(PROFILE_COLORS[state.profile]||PROFILE_COLORS.Executor);document.documentElement.style.setProperty('--red',accent);document.documentElement.style.setProperty('--red-dark',accent);document.body.dataset.profile=state.profile.toLowerCase();document.body.classList.toggle('editing',editMode)}

function renderCinematicCard(card){const inlineMarkers=(card.markers||[]).filter(marker=>marker.displayStyle==='rectangles'&&(marker.type==='pips'||marker.type==='bar')),bodyMarkers=(card.markers||[]).filter(marker=>!inlineMarkers.includes(marker)),actions=(card.actions||[]).map(action=>`<button class="card-roll" data-expression="${safe(action.expression)}" data-roll-title="${safe(action.name||card.title)}">${die((String(action.expression).match(/d(4|6|8|10|12|20)/i)||[])[1]||20,'micro',true)}<span>${safe(action.name||'Rolar')}</span></button>`).join('');return `<article class="cinematic-card ${inlineMarkers.length?'has-inline-marker':''}" data-card-id="${card.id}" style="--card-accent:${safe(cardAccent(card))}"><header><h3>${safe(card.title)}</h3>${inlineMarkers.length?`<div class="cinematic-inline-markers">${inlineMarkers.map(marker=>renderMarker(card,marker)).join('')}</div>`:''}${editMode?`<button class="cinematic-card-edit" data-edit-card="${card.id}" title="Editar">${icon('edit',14)}</button>`:''}</header>${bodyMarkers.map(marker=>renderMarker(card,marker)).join('')}<div class="cinematic-card-copy">${formatCardText(card.content)}</div>${actions?`<div class="card-rolls">${actions}</div>`:''}</article>`}
function cinematicSection(key,title,content,addSchema=''){const collapsed=!!state.cinematicCollapsed?.[key];return `<section class="cinematic-section-group ${collapsed?'collapsed':''}"><div class="cinematic-section-heading"><button class="cinematic-section-toggle" data-cinematic-section-toggle="${key}" aria-expanded="${!collapsed}"><span>${title}</span>${icon('chevron',18)}</button>${editMode&&addSchema?`<button class="cinematic-section-add" data-cinematic-add="${addSchema}" title="Adicionar">${icon('plus',15)}</button>`:''}</div><div class="cinematic-section-body"><div>${content}</div></div></section>`}
function renderCinematic(trainingOptions,bgIsVideo=false){const accent=PROFILE_COLORS[state.profile]||PROFILE_COLORS.Executor,profileOptions=['Executor','Analista','Vigilante'].map(value=>({value,label:value})),abilities=visibleCards('abilities').map(renderCinematicCard).join('')||'<p class="cinematic-empty">Nenhuma habilidade.</p>',items=visibleCards('items').map(renderCinematicCard).join('')||'<p class="cinematic-empty">Nenhum item.</p>',history=editMode?`<textarea class="cinematic-history" data-field="history" placeholder="História do personagem...">${safe(state.history||'')}</textarea>`:`<p class="cinematic-history-copy">${formatCardText(state.history||'Nenhuma história registrada.')}</p>`,identity=editMode?`<div class="cinematic-identity cinematic-identity-edit">${customSelect({value:state.profile,options:profileOptions,id:'profile',className:'cinematic-profile-select'})}<i></i><input class="cinematic-occupation-input" data-field="occupation" value="${safe(state.occupation)}"><i></i><span class="cinematic-level-label">NÍVEL</span><input class="cinematic-level-input" data-field="level" value="${state.level}" inputmode="numeric"></div>`:`<div class="cinematic-identity-read"><strong>${safe(state.profile)}</strong><i></i><span>${safe(state.occupation)}</span><i></i><em>NÍVEL</em><b>${state.level}</b></div>`;return `<main class="cinematic-page ${modeJustChanged?'mode-enter':''}${bgIsVideo?' has-video-bg':''}" style="--cinematic-accent:${accent};--resource-shift:${currentResourceShift}px">${bgIsVideo?'<video class="bg-video" autoplay loop muted playsinline></video><div class="bg-overlay"></div>':''}<div class="cinematic-frame"><i class="cinematic-frame-line top"><b></b><b></b></i><i class="cinematic-frame-line bottom"><b></b><b></b></i></div><header class="cinematic-header"><div class="cinematic-name">${editMode?`<input data-field="name" value="${safe(state.name)}">`:`<h1>${safe(state.name)}</h1>`}</div>${identity}</header>
 <section class="cinematic-left"><div class="cinematic-attributes"><h2>ATRIBUTOS</h2>${Object.entries(state.attributes).map(([name,value])=>`<div><span>${name}</span><button class="cinematic-attribute-die" data-roll="${name}|${value}">${die(value,'cinematic-attribute')}</button>${editMode?attributeStepper(name,value):''}</div>`).join('')}</div><div class="cinematic-skills"><h2>PERÍCIAS</h2><div>${state.skills.map((skill,index)=>{const attrDie=state.attributes[skill.attribute]||4,trained=skill.skillDie>4;return `<div class="cinematic-skill grade-d${skill.skillDie}" data-roll="${safe(skill.name)}|${skill.skillDie},${attrDie}|${skill.extra||0}" role="button" tabindex="0"><span>${safe(skill.name)}<i class="skill-info-button" data-skill-info="${index}">${icon('info',11)}</i></span><span class="cinematic-skill-dice">${die(skill.skillDie,'cinematic-skill-die',trained)}<b>+</b>${die(attrDie,'cinematic-skill-die attribute',trained)}<em>${safe(skill.attribute)}</em>${skill.extra?`<strong>${Number(skill.extra)>0?'+':''}${skill.extra}</strong>`:''}</span>${editMode?`<span class="cinematic-skill-edit">${customSelect({value:skill.training,options:trainingOptions,id:`skill-training:${index}`,className:'skill-select training-select'})}${customSelect({value:skill.attribute,options:['Físico','Mente','Emoção'].map(value=>({value,label:value})),id:`skill-attribute:${index}`,className:'skill-select attribute-select'})}<input data-skill-extra="${index}" type="number" value="${skill.extra||0}" title="Bônus extra"></span>`:''}</div>`}).join('')}</div></div></section>
 <section class="cinematic-character" data-cinematic-character>${state.tokenImage?`<img src="${safeUrl(state.tokenImage)}" alt="${safe(state.name)}" draggable="false" data-cinematic-token style="left:${state.cinematicTokenX}%;top:${state.cinematicTokenY}%;--token-scale:${state.cinematicTokenScale/100}">`:`<div class="cinematic-token-empty"><span>${icon('user',54)}</span><p>ADICIONE A IMAGEM DO PERSONAGEM</p></div>`}${editMode?`<div class="cinematic-token-tools"><label>${icon('image',15)} PERSONAGEM<input id="token-upload-cinematic" type="file" accept="image/*"></label><label>ESCALA <input type="range" min="45" max="220" value="${state.cinematicTokenScale}" data-cinematic-scale></label><button data-reset-cinematic-token>RECENTRALIZAR</button><label>${icon('image',15)} FUNDO<input id="background-upload" type="file" accept="image/*,video/mp4,video/webm"></label>${state.backgroundImage?'<button data-reset-background>FUNDO PADRÃO</button>':''}<label>COR DOS DADOS <input id="dice-color" type="color" value="${safe(state.diceColor||PROFILE_COLORS[state.profile])}"></label>${state.diceColor?'<button data-reset-dice-color>COR DO PERFIL</button>':''}<small>Arraste o personagem para reposicionar</small></div>`:''}</section>
 <section class="cinematic-right"><div class="cinematic-resources"><div><strong>PV</strong><b>${state.pv}${state.pvTemp?`<em>+${state.pvTemp}</em>`:''}</b><span>${pips(state.pv,state.maxPv,'pv',state.pvTemp)}</span>${editMode?`<small class="cinematic-resource-edit">MÁX <button data-resource-adjust="maxPv:-1">−</button>${state.maxPv}<button data-resource-adjust="maxPv:1">+</button> TEMP <button data-resource-adjust="pvTemp:-1">−</button>${state.pvTemp}<button data-resource-adjust="pvTemp:1">+</button></small>`:''}</div><div><strong>PD</strong><b>${state.pd}${state.pdTemp?`<em>+${state.pdTemp}</em>`:''}</b><span>${pips(state.pd,state.maxPd,'pd',state.pdTemp)}</span>${editMode?`<small class="cinematic-resource-edit">MÁX <button data-resource-adjust="maxPd:-1">−</button>${state.maxPd}<button data-resource-adjust="maxPd:1">+</button> TEMP <button data-resource-adjust="pdTemp:-1">−</button>${state.pdTemp}<button data-resource-adjust="pdTemp:1">+</button></small>`:''}</div></div><div class="cinematic-scroll"><div class="cinematic-card-column">${cinematicSection('abilities','HABILIDADES',abilities,'abilities')}${cinematicSection('items','ITENS',items,'items')}${cinematicSection('history','HISTÓRIA',history)}</div></div></section></main>`}

function readMedia(file,key){if(!file)return;const type=file.type;if(type.startsWith('video/')||type==='image/gif'){if(state[key]?.startsWith('blob:'))URL.revokeObjectURL(state[key]);blobBgType=type.startsWith('video/')?'video':'gif';state[key]=URL.createObjectURL(file);render()}else{blobBgType='';readImage(file,key,1920)}}
function render(){const previousScroll={sheet:app.querySelector('.sheet-main')?.scrollTop||0,right:app.querySelector('.right-panel')?.scrollTop||0,cinematicRight:app.querySelector('.cinematic-scroll')?.scrollTop||0,cinematicSkills:app.querySelector('.cinematic-skills>div')?.scrollTop||0};applyTheme();const bgIsVideo=!!(state.backgroundImage&&state.backgroundImage.startsWith('data:video/'));const trainingOptions=TRAINING.map(([label,value])=>({value:label,label,html:`${die(value,'menu-die',value>4)}<span>d${value} — ${label}</span>`}));app.innerHTML=`
 <aside class="nav-rail compact-rail"><button class="nav-btn active main-sheet-icon" title="Ficha principal">${state.tokenImage?`<img src="${safeUrl(state.tokenImage)}" alt="">`:icon('sheet')}</button><button class="nav-btn" data-compendium title="Compêndio (em breve)">${icon('book')}</button><div class="nav-separator"></div><div class="sheet-switcher">${sheets.map(sheet=>`<button class="sheet-avatar ${sheet.id===state.id?'active':''}" data-sheet-id="${sheet.id}" title="${safe(sheet.name)}">${sheet.tokenImage?`<img src="${safeUrl(sheet.tokenImage)}" alt="${safe(sheet.name)}">`:safe((sheet.name||'?').slice(0,1).toUpperCase())}</button>`).join('')}<button class="nav-btn dashed" data-new-sheet title="Adicionar ficha">${icon('plus')}</button></div><span class="nav-spacer"></span><button class="nav-btn" data-export-json title="Exportar ficha em JSON">${icon('download')}</button><button class="nav-btn" data-import-json title="Importar ficha em JSON">${icon('upload')}</button><input type="file" id="json-file-input" accept=".json,application/json" style="display:none"><button class="nav-btn" data-save-sheet title="Salvar ficha (disco e navegador)">${icon('save')}</button></aside>
  ${state.viewMode==='cinematic'?renderCinematic(trainingOptions,bgIsVideo):`<main class="page ${modeJustChanged?'mode-enter':''}${bgIsVideo?' has-video-bg':''}">${bgIsVideo?'<video class="bg-video" autoplay loop muted playsinline></video><div class="bg-overlay"></div>':''}<aside class="character-side">
  <section class="character-card ${state.tokenImage?'has-token':''}"><div class="silhouette" ${state.tokenImage?`style="background-image:url('${safeUrl(state.tokenImage)}')"`:''}>${state.tokenImage?'':'<span></span>'}${editMode?`<label class="token-upload">${icon('image',18)} TROCAR IMAGEM<input id="token-upload" type="file" accept="image/*"></label>`:''}</div><input data-field="name" value="${safe(state.name)}" aria-label="Nome do personagem" ${editMode?'':'readonly'}></section>
  ${tornTitle('STATUS')}<section class="resources">${resourceEditor('pv','PV')}${resourceEditor('pd','PD')}</section>
  <label class="token-banner ${editMode?'editable':''}">TOKEN${editMode?'<input id="token-upload-secondary" type="file" accept="image/*">':''}</label>
  ${editMode?`<div class="visual-settings"><label>BACKGROUND<input id="background-upload" type="file" accept="image/*,video/mp4,video/webm"></label>${state.backgroundImage?'<button data-reset-background>PADRÃO</button>':''}<label class="dice-color-setting">COR DOS DADOS<input id="dice-color" type="color" value="${safe(state.diceColor||PROFILE_COLORS[state.profile])}"></label>${state.diceColor?'<button data-reset-dice-color>PERFIL</button>':''}</div>`:''}
 </aside><section class="sheet-main"><nav class="paper-tabs"><button class="paper-tab ${currentView==='stats'?'active':''}" data-view="stats">ESTATÍSTICAS</button><button class="paper-tab ${currentView==='history'?'active':''}" data-view="history">HISTÓRIA</button></nav>
 <div id="stats-view" class="view-panel ${currentView==='stats'?'active':''}"><section class="attribute-grid">${Object.entries(state.attributes).map(([name,value])=>`<article class="attribute-card"><span>${name}</span><button class="attribute-die" data-roll="${name}|${value}">${die(value)}</button>${editMode?attributeStepper(name,value):''}</article>`).join('')}</section>
 ${tornTitle('INFORMAÇÕES DO PERSONAGEM',true)}<section class="info-grid"><label><span>OCUPAÇÃO</span><input data-field="occupation" value="${safe(state.occupation)}" ${editMode?'':'readonly'}></label><label><span>PERFIL</span>${customSelect({value:state.profile,options:['Executor','Analista','Vigilante'].map(value=>({value,label:value})),id:'profile',className:'profile-select',disabled:!editMode})}</label><label><span>NÍVEL</span><input class="center" data-field="level" value="${state.level}" inputmode="numeric" ${editMode?'':'readonly'}></label></section>
 ${tornTitle('PERÍCIAS')}<section class="skills-table"><header><span>PERÍCIA ↕</span><span>NÍVEL DE TREINAMENTO ↕</span><span>ATRIBUTO ↕</span><span>EXTRA ↕</span></header><div class="skill-rows">${state.skills.map((skill,index)=>{const trained=skill.skillDie>4,attrDie=state.attributes[skill.attribute]||4;return `<div class="skill-row grade-d${skill.skillDie} ${trained?'trained':''}" data-roll="${safe(skill.name)}|${skill.skillDie},${attrDie}|${skill.extra||0}"><span class="skill-name">${safe(skill.name)} <button class="skill-info-button" data-skill-info="${index}" aria-label="Informações sobre ${safe(skill.name)}">${icon('info',15)}</button></span><span class="training">${die(skill.skillDie,'small',trained)}${customSelect({value:skill.training,options:trainingOptions,id:`skill-training:${index}`,className:'skill-select training-select',disabled:!editMode})}</span><span class="attribute-ref">${die(attrDie,'small gem',trained)}${customSelect({value:skill.attribute,options:['Físico','Mente','Emoção'].map(value=>({value,label:value})),id:`skill-attribute:${index}`,className:'skill-select attribute-select',disabled:!editMode})}</span><span class="extra">${editMode?`<input data-skill-extra="${index}" type="number" value="${skill.extra||0}">`:`${Number(skill.extra)>=0?'+':''}${skill.extra||0}`}</span></div>`}).join('')}</div></section></div>
 <section id="history-view" class="view-panel ${currentView==='history'?'active':''}">${tornTitle('HISTÓRIA DO PERSONAGEM',true)}<textarea data-field="history" placeholder="Escreva aqui a história, motivações e vínculos do agente..." ${editMode?'':'readonly'}>${safe(state.history||'')}</textarea></section></section>
 <aside class="right-panel"><nav class="right-tabs"><button class="${currentRight==='items'?'active':''}" data-right="items">ITENS</button><button class="${currentRight==='abilities'?'active':''}" data-right="abilities">HABILIDADES</button></nav><div class="right-tools"><div>${icon('search',15)}<input id="filter" placeholder="Filtrar cards..."></div><button title="Filtrar">${icon('filter',17)}</button><button class="add" title="Criar card">${icon('plus',17)}<span>CRIAR CARD</span></button></div><section id="abilities" class="right-content ${currentRight==='abilities'?'active':''}">${visibleCards('abilities').map(renderResourceCard).join('')||'<p class="empty-cards">Nenhuma habilidade. Use + para criar.</p>'}</section><section id="items" class="right-content ${currentRight==='items'?'active':''}">${visibleCards('items').map(renderResourceCard).join('')||'<p class="empty-cards">Nenhum item. Use + para criar.</p>'}</section></aside></main>`}
 <div class="view-mode-switch"><button class="${state.viewMode==='traditional'?'active':''}" data-display-mode="traditional">${icon('grid',15)}<span>TRADICIONAL</span></button><button class="${state.viewMode==='cinematic'?'active':''}" data-display-mode="cinematic">${icon('film',15)}<span>CINEMATOGRÁFICO</span></button></div>
 <div class="edit-status ${editMode?'active':''}"><span></span>${editMode?'MODO DE EDIÇÃO — TEMA ÂMBAR':'MODO DE VISUALIZAÇÃO'}</div><div class="floating"><button class="${editMode?'active':''}" data-toggle-edit>${editMode?icon('close'):icon('edit')}</button><button>${icon('chat')}</button></div><div class="save-toast" id="save-toast">SALVO</div>
 <div id="dice-stage"><canvas id="dice-canvas"></canvas><div id="dice-stage-result"></div></div>
 <div class="modal skill-info-modal" id="skill-info-modal"><div class="backdrop skill-info-backdrop"></div><section><button class="skill-info-close">${icon('close')}</button><small>PERÍCIA</small><h2 id="skill-info-title"></h2><p id="skill-info-copy"></p><footer id="skill-info-attribute"></footer></section></div>
 <div class="modal card-editor" id="card-editor"><div class="backdrop editor-backdrop"></div><form id="card-form"><header><div><small>EDITOR DE CARD</small><h2 id="editor-title">NOVA HABILIDADE</h2></div><button type="button" class="editor-close">${icon('close')}</button></header><div class="editor-grid"><label class="span-2">TÍTULO<input name="title" maxlength="64" required></label><label>COLEÇÃO${customSelect({value:'abilities',options:[{value:'abilities',label:'Habilidades'},{value:'items',label:'Itens'}],id:'editor-schema',formName:'schema',className:'editor-select'})}</label><label>TIPO<input name="type" placeholder="Habilidade"></label><label>ÍCONE<input name="icon" maxlength="3" placeholder="◆"></label><label>COR<input name="accent" type="color" value="#e91d25"></label><label>USAR COR${customSelect({value:'profile',options:[{value:'profile',label:'Do perfil'},{value:'custom',label:'Personalizada'}],id:'editor-color-mode',formName:'colorMode',className:'editor-select'})}</label><label>APRESENTAÇÃO${customSelect({value:'standard',options:[{value:'standard',label:'Padrão'},{value:'compact',label:'Compacto'},{value:'featured',label:'Destaque'}],id:'editor-layout',formName:'layout',className:'editor-select'})}</label><label>INICIAR${customSelect({value:'false',options:[{value:'false',label:'Expandido'},{value:'true',label:'Recolhido'}],id:'editor-collapsed',formName:'collapsed',className:'editor-select'})}</label><label class="span-2">URL DA IMAGEM<input name="imageUrl" type="url" placeholder="https://..."></label><label class="span-2 content-editor-label">CONTEÚDO<div class="rich-toolbar"><button type="button" data-format="bold"><b>B</b></button><button type="button" data-format="italic"><i>I</i></button><button type="button" data-format="underline"><u>U</u></button><span class="color-picker" title="Cor do texto"><input id="content-color" type="color" value="#67a2ff"><span>A</span></span><button type="button" data-format="color">APLICAR COR</button></div><textarea name="content" rows="5" placeholder="Descrição e regras do card..."></textarea></label>
 <section class="span-2 builder-section"><header><div><b>MARCADORES</b><small>Contador, barra, cargas ou liga/desliga. Fórmulas aceitam @{level}, @{pv} e atributos.</small></div><button type="button" data-add-marker>+ ADICIONAR</button></header><div id="marker-builder"></div></section>
 <section class="span-2 builder-section"><header><div><b>AÇÕES</b><small>Expressões como 2d6 + 1d8 + @{level}.</small></div><button type="button" data-add-action>+ ADICIONAR</button></header><div id="action-builder"></div></section></div><footer><button type="button" class="delete-card">EXCLUIR</button><span></span><button type="button" class="editor-close secondary">CANCELAR</button><button type="submit">SALVAR CARD</button></footer></form></div>`;const activePage=app.querySelector('.page,.cinematic-page');if(state.backgroundImage&&activePage&&!bgIsVideo)activePage.style.backgroundImage=`linear-gradient(rgba(7,9,15,.78),rgba(5,6,10,.92)),url("${state.backgroundImage}")`;bind();const bgVideoEl=app.querySelector('.bg-video');if(bgVideoEl){bgVideoEl.src=state.backgroundImage;bgVideoEl.play().catch(()=>{})}const sheetMain=app.querySelector('.sheet-main'),rightPanel=app.querySelector('.right-panel'),cinematicRight=app.querySelector('.cinematic-scroll'),cinematicSkills=app.querySelector('.cinematic-skills>div');if(sheetMain)sheetMain.scrollTop=previousScroll.sheet;if(rightPanel)rightPanel.scrollTop=previousScroll.right;if(cinematicRight)cinematicRight.scrollTop=previousScroll.cinematicRight;if(cinematicSkills)cinematicSkills.scrollTop=previousScroll.cinematicSkills;modeJustChanged=false}

function collectActiveInputs(){
 document.querySelectorAll('[data-field]').forEach(el=>{
  const key=el.dataset.field;
  if(key&&el.value!==undefined){
   state[key]=key==='level'?Math.max(0,Number(el.value)||0):el.value;
  }
 });
 document.querySelectorAll('[data-skill-extra]').forEach(el=>{
  const idx=Number(el.dataset.skillExtra);
  if(!isNaN(idx)&&state.skills[idx]){
   state.skills[idx].extra=Number(el.value)||0;
  }
 });
}

function save(showToast=true,toastMsg='SALVO'){
 collectActiveInputs();
 const index=sheets.findIndex(sheet=>sheet.id===state.id);
 if(index>=0)sheets[index]=state; else sheets.push(state);

 try{
  fetch('/api/sheets',{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify(sheets)
  }).catch(()=>{});
 }catch{}

 try{
  idbSet('sheets',sheets);
  idbSet('activeSheetId',state.id);
 }catch{}

 try{
  localStorage.setItem('ordem-ii-active-sheet',state.id);
  localStorage.setItem(SHEETS_KEY,JSON.stringify(sheets));
 }catch{
  try{
   const light=sheets.map(s=>({
    ...s,
    tokenImage:(s.tokenImage&&s.tokenImage.length>20000)?'':s.tokenImage,
    backgroundImage:(s.backgroundImage&&s.backgroundImage.length>20000)?'':s.backgroundImage
   }));
   localStorage.setItem(SHEETS_KEY,JSON.stringify(light));
  }catch{}
 }

 if(showToast){
  const toast=document.querySelector('#save-toast');
  if(toast){
   toast.textContent=toastMsg;
   toast.classList.add('show');
   setTimeout(()=>toast.classList.remove('show'),1100);
  }
 }
}

function exportJsonSheet(){
 collectActiveInputs();
 const index=sheets.findIndex(sheet=>sheet.id===state.id);
 if(index>=0)sheets[index]=state;
 const dataStr='data:text/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(state,null,2));
 const a=document.createElement('a');
 const safeName=(state.name||'agente').trim().toLowerCase().replace(/[^\w\d\-_]+/g,'_')||'agente';
 a.setAttribute('href',dataStr);
 a.setAttribute('download',`${safeName}_ficha.json`);
 document.body.appendChild(a);
 a.click();
 a.remove();
 const toast=document.querySelector('#save-toast');
 if(toast){
  toast.textContent='FICHA EXPORTADA';
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),1100);
 }
}

function importJsonSheet(file){
 if(!file)return;
 const reader=new FileReader();
 reader.onload=()=>{
  try{
   const parsed=JSON.parse(reader.result);
   if(Array.isArray(parsed)){
    if(!parsed.length)throw new Error('Arquivo vazio');
    const imported=parsed.map(normalizeSheet);
    sheets.push(...imported);
    state=imported[imported.length-1];
    activeSheetId=state.id;
   }else if(parsed&&typeof parsed==='object'){
    const imported=normalizeSheet(parsed);
    if(sheets.some(s=>s.id===imported.id))imported.id=makeId('sheet');
    sheets.push(imported);
    state=imported;
    activeSheetId=state.id;
   }else{
    throw new Error('Formato inválido');
   }
   save(true,'FICHA IMPORTADA!');
   render();
  }catch(err){
   alert('Erro ao importar JSON: '+(err.message||'formato inválido'));
  }
 };
 reader.readAsText(file);
}
function parseRollExpression(expression){const vars=formulaVariables();let expanded=String(expression||'').replace(/@\{([^}]+)\}/g,(_,key)=>String(vars[formulaKey(key)]??0));const dice=[];expanded=expanded.replace(/(\d*)d(4|6|8|10|12|20)/gi,(_,count,sides)=>{for(let i=0;i<Math.min(12,Number(count)||1);i++)dice.push(Number(sides));return '0'});let modifier=0;try{if(/^[\d+\-*/().\s]+$/.test(expanded))modifier=Math.floor(Function(`"use strict";return (${expanded||0})`)())}catch{}return{dice,modifier}}
async function roll(name,sides,modifier=0){const list=Array.isArray(sides)?sides:String(sides).split(',').map(Number).filter(side=>DICE_STEPS.includes(side));if(!list.length)return;const soundContext=getUiAudioContext(),{rollDice3d}=await getDiceApi(),color=state.diceColor||PROFILE_COLORS[state.profile]||PROFILE_COLORS.Executor;rollDice3d(list.map(side=>({sides:side,color})),name,Number(modifier)||0,soundContext)}
async function rollExpression(name,expression){const parsed=parseRollExpression(expression);return roll(name,parsed.dice,parsed.modifier)}
function setSelectVisual(id,value){const select=document.querySelector(`[data-select-id="${id}"]`);if(!select)return;const option=[...select.querySelectorAll('.select-option')].find(item=>String(item.dataset.selectValue)===String(value));select.querySelector('.select-display').textContent=option?.dataset.triggerLabel||value;select.querySelectorAll('.select-option').forEach(item=>{item.classList.toggle('selected',item===option);item.querySelector('b').textContent=item===option?'✓':''});if(select.dataset.formName)select.previousElementSibling.value=value}
function renderCardBuilders(){const markerBuilder=document.querySelector('#marker-builder'),actionBuilder=document.querySelector('#action-builder');if(!markerBuilder||!actionBuilder)return;markerBuilder.innerHTML=editorMarkers.map((marker,index)=>`<article class="builder-row"><div class="builder-row-head"><b>MARCADOR ${index+1}</b><button type="button" data-remove-marker="${index}">${icon('trash',15)}</button></div><div class="marker-types">${[['counter','CONTADOR'],['bar','BARRA'],['pips','CARGAS'],['toggle','LIGA/DESLIGA']].map(([type,label])=>`<button type="button" class="${marker.type===type?'active':''}" data-marker-type="${index}:${type}">${label}</button>`).join('')}</div>${marker.type==='pips'||marker.type==='bar'?`<div class="marker-display-styles"><span>ESTILO VISUAL</span><button type="button" class="${(marker.displayStyle||'default')==='default'?'active':''}" data-marker-style="${index}:default">ATUAL</button><button type="button" class="${marker.displayStyle==='rectangles'?'active':''}" data-marker-style="${index}:rectangles">RETANGULAR</button></div>`:''}<div class="builder-fields"><label>LABEL<input data-marker-field="${index}:label" value="${safe(marker.label)}"></label><label>ATUAL<input type="number" min="0" data-marker-field="${index}:current" value="${Number(marker.current)||0}"></label>${marker.type!=='toggle'?`<label>MÁXIMO / FÓRMULA<input data-marker-field="${index}:maxFormula" value="${safe(marker.maxFormula||'0')}" placeholder="@{level} + 2"></label>`:''}</div></article>`).join('')||'<p class="builder-empty">Nenhum marcador neste card.</p>';actionBuilder.innerHTML=editorActions.map((action,index)=>`<article class="builder-row action-row"><div class="builder-fields"><label>NOME<input data-action-field="${index}:name" value="${safe(action.name)}" placeholder="Ataque"></label><label>EXPRESSÃO<input data-action-field="${index}:expression" value="${safe(action.expression)}" placeholder="1d8 + @{level}"></label><button type="button" data-remove-action="${index}">${icon('trash',16)}</button></div></article>`).join('')||'<p class="builder-empty">Nenhuma ação de rolagem neste card.</p>';bindBuilderEvents()}
function bindBuilderEvents(){document.querySelectorAll('[data-marker-type]').forEach(el=>el.onclick=()=>{const[index,type]=el.dataset.markerType.split(':');editorMarkers[index].type=type;renderCardBuilders()});document.querySelectorAll('[data-marker-style]').forEach(el=>el.onclick=()=>{const[index,displayStyle]=el.dataset.markerStyle.split(':');editorMarkers[index].displayStyle=displayStyle;renderCardBuilders()});document.querySelectorAll('[data-remove-marker]').forEach(el=>el.onclick=()=>{editorMarkers.splice(Number(el.dataset.removeMarker),1);renderCardBuilders()});document.querySelectorAll('[data-remove-action]').forEach(el=>el.onclick=()=>{editorActions.splice(Number(el.dataset.removeAction),1);renderCardBuilders()});document.querySelectorAll('[data-marker-field]').forEach(el=>el.oninput=()=>{const[index,key]=el.dataset.markerField.split(':');editorMarkers[index][key]=key==='current'?Number(el.value)||0:el.value});document.querySelectorAll('[data-action-field]').forEach(el=>el.oninput=()=>{const[index,key]=el.dataset.actionField.split(':');editorActions[index][key]=el.value})}
function openCardEditor(cardId=null){const modal=document.querySelector('#card-editor'),form=document.querySelector('#card-form'),card=state.cards.find(item=>item.id===cardId);form.reset();form.dataset.cardId=cardId||'';document.querySelector('#editor-title').textContent=card?'EDITAR CARD':`NOVO ${currentRight==='items'?'ITEM':'RECURSO'}`;setSelectVisual('editor-schema',card?.schema||currentRight);setSelectVisual('editor-layout',card?.layout||'standard');setSelectVisual('editor-collapsed',String(card?.collapsed||false));setSelectVisual('editor-color-mode',card?.themeLinked===false?'custom':'profile');form.elements.title.value=card?.title||'';form.elements.type.value=card?.type||(currentRight==='items'?'Equipamento':'Habilidade');form.elements.icon.value=card?.icon||'◆';form.elements.accent.value=card?.accent||PROFILE_COLORS[state.profile]||'#e91d25';form.elements.imageUrl.value=card?.imageUrl||'';form.elements.content.value=card?.content||'';editorMarkers=clone(card?.markers||[]);editorActions=clone(card?.actions||[]);form.querySelector('.delete-card').hidden=!card;renderCardBuilders();modal.classList.remove('closing');modal.classList.add('open')}
function closeCardEditor(){const modal=document.querySelector('#card-editor');if(!modal)return;modal.classList.add('closing');setTimeout(()=>modal.classList.remove('open','closing'),160)}
function openSkillInfo(index){const skill=state.skills[index],modal=document.querySelector('#skill-info-modal'),info=SKILL_INFO[String(skill.name).toUpperCase()]||['Use esta perícia em testes relacionados à sua especialidade.',skill.attribute];document.querySelector('#skill-info-title').textContent=skill.name;document.querySelector('#skill-info-copy').textContent=info[0];document.querySelector('#skill-info-attribute').textContent=`ATRIBUTO SUGERIDO · ${info[1]||skill.attribute}`;modal.classList.add('open')}
function closeSkillInfo(){document.querySelector('#skill-info-modal')?.classList.remove('open')}
function readImage(file,key,maxDimension){if(!file||!file.type.startsWith('image/'))return;const reader=new FileReader();reader.onload=()=>{const image=new Image();image.onload=()=>{const scale=Math.min(1,maxDimension/Math.max(image.width,image.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);state[key]=canvas.toDataURL('image/webp',.84);save();render()};image.src=reader.result};reader.readAsDataURL(file)}
let uiAudioContext;
function getUiAudioContext(){const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return null;uiAudioContext??=new Context();uiAudioContext.resume?.();return uiAudioContext}
function playResourceSound(increased){const context=getUiAudioContext();if(!context)return;const now=context.currentTime,oscillator=context.createOscillator(),gain=context.createGain();oscillator.type='triangle';oscillator.frequency.setValueAtTime(increased?390:310,now);oscillator.frequency.exponentialRampToValueAtTime(increased?610:190,now+.09);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.055,now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+.12);oscillator.connect(gain).connect(context.destination);oscillator.start(now);oscillator.stop(now+.13)}
function applyTextFormat(type){const textarea=document.querySelector('#card-form textarea[name="content"]');if(!textarea)return;const start=textarea.selectionStart,end=textarea.selectionEnd,selected=textarea.value.slice(start,end)||'texto';let before='',after='';if(type==='bold'){before='**';after='**'}if(type==='italic'){before='*';after='*'}if(type==='underline'){before='[u]';after='[/u]'}if(type==='color'){before=`[color=${document.querySelector('#content-color').value}]`;after='[/color]'}textarea.setRangeText(`${before}${selected}${after}`,start,end,'select');textarea.focus()}
const tokenAlphaProfiles=new WeakMap();
function getTokenAlphaProfile(token){if(tokenAlphaProfiles.has(token))return tokenAlphaProfiles.get(token);if(!token.complete||!token.naturalWidth)return null;try{const scale=Math.min(1,440/Math.max(token.naturalWidth,token.naturalHeight)),width=Math.max(1,Math.round(token.naturalWidth*scale)),height=Math.max(1,Math.round(token.naturalHeight*scale)),canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(token,0,0,width,height);const pixels=context.getImageData(0,0,width,height).data,rows=Array.from({length:height},()=>[width,-1]);let globalMin=width,globalMax=-1;for(let y=0;y<height;y++)for(let x=0;x<width;x++){if(pixels[(y*width+x)*4+3]>22){rows[y][0]=Math.min(rows[y][0],x);rows[y][1]=Math.max(rows[y][1],x);globalMin=Math.min(globalMin,x);globalMax=Math.max(globalMax,x)}}const profile={width,height,rows,globalMin:globalMax>=0?globalMin:0,globalMax:globalMax>=0?globalMax:width};tokenAlphaProfiles.set(token,profile);return profile}catch{return null}}
function tokenRangeAtY(profile,tokenRect,pageY){if(!profile)return null;const naturalY=(pageY-tokenRect.top)/tokenRect.height*profile.height,band=Math.max(2,Math.ceil(24/tokenRect.height*profile.height));if(naturalY<-band||naturalY>profile.height+band)return null;let min=profile.width,max=-1;for(let y=Math.max(0,Math.floor(naturalY-band));y<=Math.min(profile.height-1,Math.ceil(naturalY+band));y++){min=Math.min(min,profile.rows[y][0]);max=Math.max(max,profile.rows[y][1])}return max<0?null:{left:tokenRect.left+min/profile.width*tokenRect.width,right:tokenRect.left+(max+1)/profile.width*tokenRect.width}}
function syncCinematicLineMask(){const page=document.querySelector('.cinematic-page'),frame=document.querySelector('.cinematic-frame'),token=document.querySelector('[data-cinematic-token]'),rightPanel=document.querySelector('.cinematic-right');if(!frame||!page)return;if(!token){frame.querySelectorAll('.cinematic-frame-line').forEach(line=>line.classList.remove('masked'));currentResourceShift=120;page.style.setProperty('--resource-shift','120px');return}requestAnimationFrame(()=>{const frameRect=frame.getBoundingClientRect(),tokenRect=token.getBoundingClientRect(),profile=getTokenAlphaProfile(token);if(!tokenRect.width||!tokenRect.height)return;frame.querySelectorAll('.cinematic-frame-line').forEach(line=>{const lineY=line.getBoundingClientRect().top,range=tokenRangeAtY(profile,tokenRect,lineY);if(!range){line.classList.remove('masked');return}const buffer=22,left=Math.max(0,range.left-frameRect.left-buffer),right=Math.min(frameRect.width,range.right-frameRect.left+buffer);line.style.setProperty('--line-cut-left',`${left}px`);line.style.setProperty('--line-cut-right',`${right}px`);line.classList.add('masked')});if(rightPanel){const rightRect=rightPanel.getBoundingClientRect(),visibleRight=profile?tokenRect.left+(profile.globalMax+1)/profile.width*tokenRect.width:tokenRect.right,shift=Math.max(0,Math.min(150,rightRect.left-visibleRight-24));currentResourceShift=shift;page.style.setProperty('--resource-shift',`${shift}px`)}})}
window.addEventListener('resize',syncCinematicLineMask);
function bindCinematicToken(){const area=document.querySelector('[data-cinematic-character]'),token=document.querySelector('[data-cinematic-token]'),scale=document.querySelector('[data-cinematic-scale]');if(token){token.addEventListener('load',syncCinematicLineMask,{once:true});syncCinematicLineMask()}if(scale)scale.oninput=()=>{state.cinematicTokenScale=Number(scale.value);if(token)token.style.setProperty('--token-scale',state.cinematicTokenScale/100);syncCinematicLineMask()};if(scale)scale.onchange=()=>save(false);document.querySelector('[data-reset-cinematic-token]')?.addEventListener('click',()=>{state.cinematicTokenX=50;state.cinematicTokenY=52;state.cinematicTokenScale=100;save();render()});if(!editMode||!area||!token)return;token.onpointerdown=event=>{event.preventDefault();const rect=area.getBoundingClientRect(),startX=event.clientX,startY=event.clientY,originX=state.cinematicTokenX,originY=state.cinematicTokenY;token.setPointerCapture(event.pointerId);token.classList.add('dragging');token.onpointermove=move=>{state.cinematicTokenX=Math.max(0,Math.min(100,originX+(move.clientX-startX)/rect.width*100));state.cinematicTokenY=Math.max(0,Math.min(100,originY+(move.clientY-startY)/rect.height*100));token.style.left=`${state.cinematicTokenX}%`;token.style.top=`${state.cinematicTokenY}%`;syncCinematicLineMask()};token.onpointerup=()=>{token.classList.remove('dragging');token.onpointermove=null;syncCinematicLineMask();save(false)}}}
function updateResourceUi(key){const current=state[key],temp=state[`${key}Temp`]||0,isPv=key.toLowerCase()==='pv',cinDiv=document.querySelectorAll('.cinematic-resources>div')[isPv?0:1];if(cinDiv){const b=cinDiv.querySelector('b');if(b)b.innerHTML=`${current}${temp?`<em>+${temp}</em>`:''}`;const pips=cinDiv.querySelectorAll('.pip:not(.temporary)');pips.forEach((pip,i)=>pip.classList.toggle('filled',i<current))}document.querySelectorAll(`.resource-row [data-set-resource^="${key}:"]`).forEach(pip=>{const val=Number(pip.dataset.setResource.split(':')[1]);pip.classList.toggle('filled',val<=current)});document.querySelectorAll('.resource-row').forEach(row=>{if(row.querySelector(`[data-set-resource^="${key}:"]`)){const b=row.querySelector('b');if(b)b.innerHTML=`${current}${temp?`<em>+${temp}</em>`:''}`}})}
function updateMarkerUi(cardId,markerId){const card=state.cards.find(c=>c.id===cardId),marker=card?.markers.find(m=>m.id===markerId);if(!marker)return;const max=markerMax(marker),current=Math.min(Number(marker.current)||0,max||999),id=`${cardId}:${markerId}`;document.querySelectorAll(`[data-card-marker^="${id}:"],[data-card-marker-set^="${id}:"]`).forEach(el=>{const container=el.closest('.card-marker');if(!container)return;const toggle=container.querySelector('.toggle-switch');if(toggle){toggle.classList.toggle('on',!!current);toggle.innerHTML=`<i></i>${current?'LIGADO':'DESLIGADO'}`}const track=container.querySelector('.progress-track i');if(track)track.style.width=`${max?current/max*100:0}%`;const charges=container.querySelectorAll('.charge');charges.forEach((btn,i)=>btn.classList.toggle('on',i<current));const strong=container.querySelector('strong');if(strong){if(container.classList.contains('marker-bar')||container.classList.contains('marker-pips')){strong.textContent=`${current}/${max}`}else if(!container.classList.contains('marker-toggle')){strong.textContent=`${current}${max?`/${max}`:''}`}}})}
function bind(){
 document.querySelectorAll('[data-field]').forEach(el=>el.onchange=e=>{const key=e.target.dataset.field;state[key]=key==='level'?Math.max(0,Number(e.target.value)||0):e.target.value;save();render()});
 document.querySelectorAll('[data-set-resource]').forEach(el=>el.onclick=()=>{const[key,val]=el.dataset.setResource.split(':'),previous=state[key];state[key]=state[key]===Number(val)?Number(val)-1:Number(val);if(key==='pv'||key==='pd')playResourceSound(state[key]>previous);save(false);updateResourceUi(key)});
 document.querySelectorAll('[data-resource-adjust]').forEach(el=>el.onclick=()=>{const[key,delta]=el.dataset.resourceAdjust.split(':');state[key]=Math.max(0,Number(state[key]||0)+Number(delta));if(key==='maxPv')state.pv=Math.min(state.pv,state[key]);if(key==='maxPd')state.pd=Math.min(state.pd,state[key]);if(key.toLowerCase().includes('pv')||key.toLowerCase().includes('pd'))playResourceSound(Number(delta)>0);save(false);render()});
 document.querySelectorAll('[data-attribute-step]').forEach(el=>el.onclick=()=>{const[name,delta]=el.dataset.attributeStep.split(':'),at=DICE_STEPS.indexOf(state.attributes[name]);state.attributes[name]=DICE_STEPS[Math.max(0,Math.min(DICE_STEPS.length-1,at+Number(delta)))];save();render()});
 document.querySelectorAll('[data-skill-extra]').forEach(el=>el.onchange=()=>{state.skills[Number(el.dataset.skillExtra)].extra=Number(el.value)||0;save()});
 document.querySelectorAll('[data-roll]').forEach(el=>el.onclick=e=>{if(e.target.closest('.custom-select,.extra input,[data-skill-extra],.card-actions,.skill-info-button'))return;const[name,sides,bonus]=el.dataset.roll.split('|');roll(name,sides,bonus)});
 document.querySelectorAll('[data-expression]').forEach(el=>el.onclick=()=>rollExpression(el.dataset.rollTitle,el.dataset.expression));
 document.querySelectorAll('[data-card-marker]').forEach(el=>el.onclick=()=>{const[cardId,markerId,action]=el.dataset.cardMarker.split(':'),marker=state.cards.find(c=>c.id===cardId)?.markers.find(m=>m.id===markerId);if(!marker)return;const max=markerMax(marker);marker.current=action==='toggle'?(marker.current?0:1):Math.max(0,Math.min(max||999,(Number(marker.current)||0)+Number(action)));save(false);updateMarkerUi(cardId,markerId)});
 document.querySelectorAll('[data-card-marker-set]').forEach(el=>el.onclick=()=>{const[cardId,markerId,value]=el.dataset.cardMarkerSet.split(':'),marker=state.cards.find(c=>c.id===cardId)?.markers.find(m=>m.id===markerId);if(marker){marker.current=marker.current===Number(value)?Number(value)-1:Number(value);save(false);updateMarkerUi(cardId,markerId)}});
 document.querySelectorAll('.custom-select').forEach(select=>{const trigger=select.querySelector('.select-trigger');trigger.onclick=e=>{e.stopPropagation();document.querySelectorAll('.custom-select.open').forEach(other=>other!==select&&other.classList.remove('open'));select.classList.toggle('open');setTimeout(()=>document.addEventListener('click',()=>select.classList.remove('open'),{once:true}))};select.querySelectorAll('.select-option').forEach(option=>option.onclick=e=>{e.stopPropagation();const value=option.dataset.selectValue,id=select.dataset.selectId;setSelectVisual(id,value);select.classList.remove('open');if(id==='profile'){state.profile=value;ensureProfileAbility(state,value)}else if(id.startsWith('skill-training:')){const skill=state.skills[Number(id.split(':')[1])],entry=TRAINING.find(([label])=>label===value);skill.training=value;skill.skillDie=entry[1]}else if(id.startsWith('skill-attribute:'))state.skills[Number(id.split(':')[1])].attribute=value;else return;save();render()})});
 document.querySelectorAll('[data-view]').forEach(el=>el.onclick=()=>{if(el.dataset.view===currentView)return;const old=document.querySelector(`#${currentView}-view`),next=document.querySelector(`#${el.dataset.view}-view`);document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===el));old.classList.add('leaving');setTimeout(()=>{old.classList.remove('active','leaving');next.classList.add('active','entering');setTimeout(()=>next.classList.remove('entering'),300);currentView=el.dataset.view},180)});
 document.querySelector('[data-toggle-edit]').onclick=()=>{editMode=!editMode;save(false);render()};
 document.querySelectorAll('[data-right]').forEach(el=>el.onclick=()=>{const nextRight=el.dataset.right;if(nextRight===currentRight)return;const oldPanel=document.querySelector(`#${currentRight}`),newPanel=document.querySelector(`#${nextRight}`);document.querySelectorAll('[data-right]').forEach(button=>button.classList.toggle('active',button===el));oldPanel.classList.add('leaving');setTimeout(()=>{oldPanel.classList.remove('active','leaving');newPanel.classList.add('active','entering');setTimeout(()=>newPanel.classList.remove('entering'),280);currentRight=nextRight},180)});
 const filter=document.querySelector('#filter');if(filter)filter.oninput=e=>document.querySelectorAll('.right-content.active [data-filter]').forEach(x=>x.hidden=!x.dataset.filter.includes(e.target.value.toLowerCase()));const traditionalAdd=document.querySelector('.right-tools .add');if(traditionalAdd)traditionalAdd.onclick=()=>openCardEditor();document.querySelectorAll('[data-cinematic-add]').forEach(el=>el.onclick=()=>{currentRight=el.dataset.cinematicAdd;openCardEditor()});document.querySelectorAll('[data-cinematic-section-toggle]').forEach(el=>el.onclick=()=>{const key=el.dataset.cinematicSectionToggle,group=el.closest('.cinematic-section-group');state.cinematicCollapsed[key]=!state.cinematicCollapsed[key];group.classList.toggle('collapsed',state.cinematicCollapsed[key]);el.setAttribute('aria-expanded',String(!state.cinematicCollapsed[key]));save(false)});
 document.querySelectorAll('[data-edit-card]').forEach(el=>el.onclick=()=>openCardEditor(el.dataset.editCard));document.querySelectorAll('[data-toggle-card]').forEach(el=>el.onclick=()=>{const c=state.cards.find(x=>x.id===el.dataset.toggleCard);c.collapsed=!c.collapsed;save();render()});
 document.querySelectorAll('[data-duplicate-card]').forEach(el=>el.onclick=()=>{const c=state.cards.find(x=>x.id===el.dataset.duplicateCard),copy={...clone(c),id:makeId('card'),title:`${c.title} — CÓPIA`};copy.markers.forEach(m=>m.id=makeId('marker'));copy.actions.forEach(a=>a.id=makeId('action'));state.cards.splice(state.cards.indexOf(c)+1,0,copy);save();render()});
 document.querySelectorAll('[data-move]').forEach(el=>el.onclick=()=>{const[id,delta]=el.dataset.move.split(':'),from=state.cards.findIndex(c=>c.id===id),to=Math.max(0,Math.min(state.cards.length-1,from+Number(delta)));if(from!==to){const[c]=state.cards.splice(from,1);state.cards.splice(to,0,c);save();render()}});
 document.querySelectorAll('.resource-card').forEach(card=>{card.ondragstart=e=>e.dataTransfer.setData('text/card-id',card.dataset.cardId);card.ondragover=e=>e.preventDefault();card.ondrop=e=>{e.preventDefault();const from=state.cards.findIndex(c=>c.id===e.dataTransfer.getData('text/card-id')),to=state.cards.findIndex(c=>c.id===card.dataset.cardId);if(from>=0&&to>=0&&from!==to){const[moved]=state.cards.splice(from,1);state.cards.splice(to,0,moved);save();render()}}});
 document.querySelectorAll('.editor-close,.editor-backdrop').forEach(el=>el.onclick=closeCardEditor);document.querySelectorAll('[data-format]').forEach(el=>el.onclick=()=>applyTextFormat(el.dataset.format));document.querySelectorAll('[data-skill-info]').forEach(el=>el.onclick=e=>{e.stopPropagation();openSkillInfo(Number(el.dataset.skillInfo))});document.querySelectorAll('.skill-info-close,.skill-info-backdrop').forEach(el=>el.onclick=closeSkillInfo);document.querySelector('[data-add-marker]').onclick=()=>{if(editorMarkers.length<5){editorMarkers.push({id:makeId('marker'),type:'counter',displayStyle:'default',label:`Marcador ${editorMarkers.length+1}`,current:0,maxFormula:'@{level} + 2'});renderCardBuilders()}};document.querySelector('[data-add-action]').onclick=()=>{if(editorActions.length<7){editorActions.push({id:makeId('action'),name:`Ação ${editorActions.length+1}`,expression:'1d8'});renderCardBuilders()}};
 document.querySelector('#card-form').onsubmit=e=>{e.preventDefault();const form=e.currentTarget,data=Object.fromEntries(new FormData(form)),existing=state.cards.find(c=>c.id===form.dataset.cardId),card=existing||{id:makeId('card')};Object.assign(card,{schema:data.schema,title:data.title.trim()||'SEM TÍTULO',type:data.type.trim()||'Habilidade',icon:data.icon.trim()||'◆',accent:data.accent,themeLinked:data.colorMode==='profile',layout:data.layout,collapsed:data.collapsed==='true',imageUrl:data.imageUrl.trim(),content:data.content.trim(),markers:clone(editorMarkers),actions:clone(editorActions)});card.markers.forEach(marker=>marker.current=Math.min(Number(marker.current)||0,marker.type==='toggle'?1:markerMax(marker)||999));if(!existing)state.cards.push(card);currentRight=card.schema;save();closeCardEditor();render()};
 document.querySelector('.delete-card').onclick=()=>{const id=document.querySelector('#card-form').dataset.cardId;if(id){state.cards=state.cards.filter(c=>c.id!==id);save();closeCardEditor();render()}};
 document.querySelectorAll('#token-upload,#token-upload-secondary,#token-upload-cinematic').forEach(input=>input.onchange=()=>readImage(input.files[0],'tokenImage',1024));const backgroundUpload=document.querySelector('#background-upload');if(backgroundUpload)backgroundUpload.onchange=()=>readMedia(backgroundUpload.files[0],'backgroundImage');document.querySelector('[data-reset-background]')?.addEventListener('click',()=>{state.backgroundImage='';save();render()});const diceColor=document.querySelector('#dice-color');if(diceColor)diceColor.onchange=()=>{state.diceColor=diceColor.value;save();render()};document.querySelector('[data-reset-dice-color]')?.addEventListener('click',()=>{state.diceColor='';save();render()});
 document.querySelectorAll('[data-sheet-id]').forEach(el=>el.onclick=()=>{save(false);state=sheets.find(sheet=>sheet.id===el.dataset.sheetId);activeSheetId=state.id;localStorage.setItem('ordem-ii-active-sheet',state.id);render()});
  document.querySelector('[data-new-sheet]').onclick=()=> {save(false);const sheet=normalizeSheet({name:`AGENTE ${sheets.length+1}`});sheets.push(sheet);state=sheet;activeSheetId=sheet.id;editMode=true;save();render()};document.querySelector('[data-save-sheet]').onclick=()=>save(true,'SALVO');document.querySelector('[data-export-json]')?.addEventListener('click',()=>exportJsonSheet());const jsonFileInput=document.querySelector('#json-file-input');document.querySelector('[data-import-json]')?.addEventListener('click',()=>jsonFileInput?.click());if(jsonFileInput)jsonFileInput.onchange=()=>{if(jsonFileInput.files[0])importJsonSheet(jsonFileInput.files[0]);jsonFileInput.value=''};document.querySelector('[data-compendium]').onclick=()=>{const toast=document.querySelector('#save-toast');toast.textContent='COMPÊNDIO — EM BREVE';toast.classList.add('show');setTimeout(()=>{toast.classList.remove('show');toast.textContent='SALVO'},1300)};document.querySelectorAll('[data-display-mode]').forEach(el=>el.onclick=()=>{if(el.dataset.displayMode===state.viewMode)return;state.viewMode=el.dataset.displayMode;modeJustChanged=true;save(false);render()});bindCinematicToken();
}
window.addEventListener('beforeunload',()=>save(false));
await loadInitialSheets();
render();
