import { DEFAULT_SHEETS } from './default-sheets.js';
const icon=(name,size=19)=>{const paths={
  sheet:'<path d="M6 3h9l4 4v14H6Z"/><path d="M14 3v5h5M9 12h7M9 16h7"/>',
  book:'<path d="M4 5a4 4 0 0 1 4-2h4v17H8a4 4 0 0 0-4 2Z"/><path d="M20 5a4 4 0 0 0-4-2h-4v17h4a4 4 0 0 1 4 2Z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',save:'<path d="M5 3h12l3 3v15H4V3Z"/><path d="M8 3v6h8V3M8 21v-8h8v8"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',filter:'<path d="M4 5h16l-6 7v6l-4 2v-8Z"/>',
  chevron:'<path d="m8 10 4 4 4-4"/>','chevron-left':'<path d="m15 18-6-6 6-6"/>','chevron-right':'<path d="m9 18 6-6-6-6"/>',info:'<circle cx="12" cy="12" r="8"/><path d="M12 11v5M12 8h.01"/>',
  edit:'<path d="m14 5 5 5L8 21H3v-5Z"/>',chat:'<path d="M4 5h16v12H9l-5 4Z"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-5 4 4 2-2 5 4"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
  film:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  grid:'<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  sparkles:'<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
  copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.14.37.37.7.67.96.3.26.68.4 1.08.4H21v4h-.09A1.7 1.7 0 0 0 19.4 15Z"/>',
  history:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
  camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3"/>',
  presentation:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4M7 8l5 4 5-4"/>',
  dossier:'<path d="M4 4h6l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>',
  lock:'<rect class="lock-body" x="4" y="11" width="16" height="11" rx="2"/><path class="lock-shackle" d="M7 11V7a5 5 0 0 1 10 0v4"/><path class="lock-keyhole" d="M12 15v2.5"/>',
  d20:'<path d="m12 2 8 4.5v11L12 22l-8-4.5v-11L12 2Z"/><path d="M12 22V12M12 2v10M20 6.5 12 12 4 6.5M20 17.5 12 12 4 17.5"/>'};

  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${paths[name]||''}</svg>`};

const DICE_STEPS=[4,6,8,10,12,20];
const TRAINING=[['DESTREINADO',4],['TREINADO',6],['ESPECIALISTA',8],['MESTRE',10],['GRÃO MESTRE',12]];
const PROFILE_COLORS={Executor:'#e0150d',Analista:'#2162ff',Vigilante:'#2d863f'};
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
const APTIDAO_FIELDS=['HUMANAS','ARTES','ATUALIDADES','BUROCRACIA','EXATAS','TÁTICA'];
const skillSeed=[
 ['ACROBACIA','DESTREINADO',4,'Físico'],['APTIDÃO (HUMANAS)','TREINADO',6,'Mente'],['ATLETISMO','DESTREINADO',4,'Físico'],['CRIME','TREINADO',6,'Físico'],
 ['DISCIPLINA','TREINADO',6,'Emoção'],['ENGANAÇÃO','TREINADO',6,'Emoção'],['FURTIVIDADE','DESTREINADO',4,'Físico'],['INTIMIDAR','DESTREINADO',4,'Emoção'],
 ['INTUIÇÃO','TREINADO',6,'Emoção'],['LUTA','DESTREINADO',4,'Físico'],['MÁQUINAS','TREINADO',6,'Mente'],['MEDICINA','DESTREINADO',4,'Mente'],
 ['OCULTISMO','TREINADO',6,'Mente'],['PERCEPÇÃO','TREINADO',6,'Mente'],['PERSUASÃO','DESTREINADO',4,'Emoção'],['PESQUISAR','ESPECIALISTA',8,'Mente'],
 ['PONTARIA','DESTREINADO',4,'Físico'],['SOBREVIVÊNCIA','DESTREINADO',4,'Mente'],['TECNOLOGIA','TREINADO',6,'Mente'],['VIGOR','DESTREINADO',4,'Físico']];
const defaultSkills=skillSeed.map(([name,training,skillDie,attribute])=>({name,training,skillDie,attribute,extra:0}));
const defaultCards=[
  {id:'impeto',profileAbility:'Executor',themeLinked:true,schema:'abilities',title:'ÍMPETO',type:'Recurso',content:'Você possui uma barra de [color=#e0150d]**Ímpeto**[/color] com três espaços. Sempre que falha em um teste, você preenche um espaço nessa barra.\n\nVocê pode apagar espaços preenchidos para:\n- 1 Receber +4 em um teste\n- 3 Aumentar um atributo em um passo até o final da cena',accent:'#e0150d',icon:'◆',markers:[{id:'impeto-m',type:'pips',displayStyle:'rectangles',label:'Ímpeto',current:0,maxFormula:'3'}],actions:[]},
  {id:'foco-mental',themeLinked:true,schema:'abilities',title:'FOCO MENTAL',type:'Habilidade',content:'Quando faz um teste mental, você pode gastar 2 PD para receber +4 no teste.',accent:'#e91d25',icon:'◈',markers:[],actions:[{id:'foco-a',name:'Teste mental',expression:'1d8'}]},
  {id:'kit',themeLinked:true,schema:'items',title:'KIT DE INVESTIGAÇÃO',type:'Equipamento',content:'Ferramentas para analisar cenas, coletar amostras e registrar pistas.',accent:'#e91d25',icon:'⌕',markers:[{id:'kit-m',type:'pips',label:'Usos',current:3,maxFormula:'3'}],actions:[]},
  {id:'pistola',themeLinked:true,schema:'items',title:'PISTOLA',type:'Arma',content:'Uma arma de serviço compacta. Dano 1d8.',accent:'#e91d25',icon:'†',markers:[{id:'pistola-m',type:'pips',displayStyle:'rectangles',label:'Munição',current:6,maxFormula:'6'}],actions:[{id:'pistola-a',name:'Ataque de pistola',expression:'1d8'}]}
];
const PROFILE_ABILITIES={
  Executor:defaultCards[0],
  Vigilante:{id:'prontidao',profileAbility:'Vigilante',themeLinked:true,schema:'abilities',title:'PRONTIDÃO',type:'Habilidade de Perfil',content:'Você possui uma [color=#2d863f]**barra de prontidão**[/color] com 3 espaços. No início de cada cena, role 3d6 e anote cada valor nos espaços da barra (qualquer espaço já preenchido é substituído). Você também pode gastar [color=#2d863f]**2 PD**[/color] para preencher um espaço da barra.\n\nQuando você ou um aliado próximo faz um teste, você pode gastar um valor da barra para substituir um dado rolado pelo valor gasto.\nAlternativamente, você também pode gastar dois espaços da barra para, em qualquer ação ou conflito, [color=#2d863f]**agir antes de todos**[/color].',accent:'#2d863f',icon:'◆',markers:[{id:'prontidao-m',type:'slots',displayStyle:'rectangles',label:'Prontidão',current:0,maxFormula:'3',slots:[null,null,null],fillCostResource:'pd',fillCostAmount:2}],actions:[{id:'prontidao-a',name:'Rolar Prontidão',expression:'3d6',targetMarker:'prontidao-m'}]},
  Analista:{id:'avaliacao',profileAbility:'Analista',themeLinked:true,schema:'abilities',title:'AVALIAÇÃO',type:'Habilidade de Perfil',content:'Você pode gastar uma ação e [color=#2162ff]**2 PD**[/color] para observar um ser ou ambiente. Você recebe 2d4 que pode usar em testes relativos àquele ser ou ambiente. Você pode usá-los como quiser, recebendo +2d4 em um teste ou +1d4 em dois testes.\n\nVocê não pode acumular mais do que dois dados bônus por esta habilidade.',accent:'#2162ff',icon:'◈',markers:[{id:'avaliacao-dados',type:'pips',label:'Dados bônus',current:0,maxFormula:'2'}],actions:[]}
};
const defaults={name:'ALAN',occupation:'Cientista',profile:'Executor',level:2,pv:10,maxPv:12,pvTemp:0,pd:16,maxPd:18,pdTemp:0,history:'',tokenImage:'',backgroundImage:'',backgroundBlur:0,backgroundZoom:100,diceColor:'',viewMode:'traditional',cinematicTokenX:50,cinematicTokenY:52,cinematicTokenScale:100,cinematicOutlineSide:'left',cinematicOutlineIntensity:0.5,cinematicOutlineWidth:1.8,cinematicOutlineFade:1.5,cinematicCollapsed:{abilities:false,items:true,history:true},attributes:{Físico:6,Mente:8,Emoção:8},skills:defaultSkills,cards:defaultCards};

const safe=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=value=>/^(https?:\/\/|data:image\/|data:video\/|blob:|\/|\.\/)/i.test(String(value||''))?safe(value):'';
const clone=value=>structuredClone(value);
const makeId=prefix=>`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;

function normalizeCard(card){
 const migratedMarkers=Number(card.markerMax)>0?[{id:makeId('marker'),type:'pips',label:card.markerLabel||'Marcador',current:Number(card.markerCurrent)||0,maxFormula:String(card.markerMax)}]:[];
 const migratedActions=Number(card.rollSides)>0?[{id:makeId('action'),name:card.rollName||'Rolar',expression:`1d${card.rollSides}`}]:[];
 const knownProfile=Object.entries(PROFILE_ABILITIES).find(([,template])=>String(template.title).toUpperCase()===String(card.title).toUpperCase());
 const markers=(Array.isArray(card.markers)?card.markers:migratedMarkers).map(marker=>({...marker,displayStyle:marker.displayStyle||'default'}));
 if(card.id==='impeto'||card.id==='pistola')markers.forEach(marker=>{if(marker.type==='pips'&&marker.displayStyle==='default')marker.displayStyle='rectangles'});
 if(card.id==='prontidao'||(card.profileAbility==='Vigilante'&&String(card.title).toUpperCase()==='PRONTIDÃO')){markers.forEach(marker=>{marker.displayStyle='rectangles';if(marker.type==='pips'||marker.type==='counter'){marker.type='slots';marker.fillCostResource=marker.fillCostResource||'pd';marker.fillCostAmount=marker.fillCostAmount??2;if(!Array.isArray(marker.slots))marker.slots=[null,null,null]}})}
 const actions=(Array.isArray(card.actions)?card.actions:migratedActions).map(action=>({...action}));
 if(card.id==='prontidao'||(card.profileAbility==='Vigilante'&&String(card.title).toUpperCase()==='PRONTIDÃO')){actions.forEach(action=>{if(action.name==='Rolar Prontidão'&&!action.targetMarker)action.targetMarker='prontidao-m'})}
 return {...card,profileAbility:card.profileAbility||knownProfile?.[0],themeLinked:card.themeLinked!==false,markers,actions};
}
function ensureProfileAbility(sheet,profile=sheet.profile){const template=PROFILE_ABILITIES[profile];if(!template)return;const expected=String(template.title).toUpperCase(),existing=sheet.cards?.find(card=>card.profileAbility===profile||String(card.title).toUpperCase()===expected);if(existing){existing.profileAbility=profile;return}sheet.cards.push(normalizeCard(clone(template)))}
function normalizeSheet(raw={}){
 const sheet={...clone(defaults),...raw}; sheet.id=raw.id||makeId('sheet');
 sheet.attributes={...defaults.attributes,...raw.attributes};
 sheet.skills=Array.isArray(raw.skills)?raw.skills:clone(defaultSkills);
 sheet.skills=sheet.skills.map(skill=>{let name=skill.name==='APTIDÃO'?'APTIDÃO (HUMANAS)':skill.name;let training=skill.training;if(training==='VETERANO')training='ESPECIALISTA';if(training==='EXPERT')training='MESTRE';if(training==='MESTRE'&&Number(skill.skillDie)===12)training='GRÃO MESTRE';const found=TRAINING.find(([label])=>label===training)||TRAINING.find(([,die])=>die===Number(skill.skillDie))||TRAINING[0];return {...skill,name,training:found[0],skillDie:found[1],extra:Number(skill.extra)||0}});
 sheet.cards=(Array.isArray(raw.cards)?raw.cards:clone(defaultCards)).map(normalizeCard);
 ensureProfileAbility(sheet);
 ['pv','maxPv','pvTemp','pd','maxPd','pdTemp','level'].forEach(key=>sheet[key]=Math.max(0,Number(sheet[key])||0));
 sheet.viewMode=sheet.viewMode==='cinematic'?'cinematic':'traditional';sheet.cinematicTokenX=Math.max(0,Math.min(100,Number(sheet.cinematicTokenX)||50));sheet.cinematicTokenY=Math.max(0,Math.min(100,Number(sheet.cinematicTokenY)||52));sheet.cinematicTokenScale=Math.max(45,Math.min(220,Number(sheet.cinematicTokenScale)||100));
 sheet.cinematicOutlineSide=['left','right','both','none'].includes(raw.cinematicOutlineSide)?raw.cinematicOutlineSide:(raw.profile==='Executor'?'right':'left');
 sheet.cinematicOutlineIntensity=Math.max(0,Math.min(1,Number(raw.cinematicOutlineIntensity??0.5)));
 sheet.cinematicOutlineWidth=Math.max(0,Math.min(10,Number(raw.cinematicOutlineWidth??1.8)));sheet.cinematicOutlineFade=Math.max(0,Math.min(10,Number(raw.cinematicOutlineFade??1.5)));
 sheet.backgroundBlur=Math.max(0,Math.min(50,Number(raw.backgroundBlur??0)));
 sheet.backgroundZoom=Math.max(20,Math.min(300,Number(raw.backgroundZoom??100)));
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
 // Tenta carregar do servidor local (só funciona no dev / self-hosted)
 try{
  const res=await fetch('./api/sheets',{cache:'no-store'});
  if(res.ok){
   const data=await res.json();
   if(Array.isArray(data)&&data.length>0)loaded=data.map(normalizeSheet);
  }
 }catch{}
 // Fallback: IndexedDB (dados salvos localmente no navegador)
 if(!loaded||!loaded.length){
  try{
   const idbSheets=await idbGet('sheets');
   if(Array.isArray(idbSheets)&&idbSheets.length>0)loaded=idbSheets.map(normalizeSheet);
  }catch{}
 }
 // Fallback: localStorage
 if(!loaded||!loaded.length){
  try{
   const local=JSON.parse(localStorage.getItem(SHEETS_KEY)||'[]');
   if(Array.isArray(local)&&local.length>0)loaded=local.map(normalizeSheet);
  }catch{}
 }
 // Fallback: fichas padrão embutidas no bundle (primeira visita ao site estático)
 if(!loaded||!loaded.length){
  loaded=DEFAULT_SHEETS.map(normalizeSheet);
 }
 sheets=loaded;
 let storedActiveId=null;
 try{storedActiveId=await idbGet('activeSheetId')||localStorage.getItem('ordem-ii-active-sheet')}catch{}
 state=sheets.find(sheet=>sheet.id===storedActiveId)||sheets[0];
 activeSheetId=state.id;
}
let currentRight='abilities',currentView='stats',editMode=false,modeJustChanged=false,editTransitionMode=null,editorMarkers=[],editorActions=[],diceApiPromise,blobBgType='',currentResourceShift=120,mobileTab='agent',sheetDrawerOpen=false,viewSwitchCollapsed=true,presentationMode=true,presentationIndex=0,presentationLockingIn=false,presentationEntering=false;
const CRITICAL_EFFECTS_KEY='ordem-ii-critical-effects-v1';
let criticalEffects={pv:true,pd:true};
try{criticalEffects={...criticalEffects,...JSON.parse(localStorage.getItem(CRITICAL_EFFECTS_KEY)||'{}')}}catch{}
function saveCriticalEffects(){try{localStorage.setItem(CRITICAL_EFFECTS_KEY,JSON.stringify(criticalEffects))}catch{}}
function playModeToggleSound(enteringEdit){
 const ctx=getUiAudioContext();if(!ctx)return;
 const now=ctx.currentTime,osc=ctx.createOscillator(),gain=ctx.createGain();
 osc.type=enteringEdit?'sawtooth':'sine';
 osc.frequency.setValueAtTime(enteringEdit?290:520,now);
 osc.frequency.exponentialRampToValueAtTime(enteringEdit?540:330,now+0.12);
 gain.gain.setValueAtTime(0.0001,now);
 gain.gain.exponentialRampToValueAtTime(0.045,now+0.01);
 gain.gain.exponentialRampToValueAtTime(0.0001,now+0.15);
 osc.connect(gain).connect(ctx.destination);
 osc.start(now);osc.stop(now+0.16);
}

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
function pips(current,max,key,temp=0){const regular=Array.from({length:max},(_,i)=>`<button type="button" class="pip ${i<current?'filled':''}" data-set-resource="${key}:${i+1}" aria-label="${i+1}"></button>`).join('');const temporary=Array.from({length:temp},(_,i)=>`<button type="button" class="pip temporary filled" data-consume-temp="${key}:${i+1}" title="${key.toUpperCase()} temporário ${i+1}/${temp} (Clique para extinguir, Botão direito para todos)"></button>`).join('');return regular+temporary}
const formulaKey=value=>String(value).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function formulaVariables(){return{level:state.level,pv:state.pv,pd:state.pd,maxpv:state.maxPv,maxpd:state.maxPd,fisico:state.attributes.Físico,mente:state.attributes.Mente,emocao:state.attributes.Emoção}}
function evaluateFormula(expression){const vars=formulaVariables(),expanded=String(expression||'0').replace(/@\{([^}]+)\}/g,(_,key)=>String(vars[formulaKey(key)]??0));if(!/^[\d+\-*/().\s]+$/.test(expanded))return 0;try{return Math.max(0,Math.floor(Function(`"use strict";return (${expanded})`)()))}catch{return 0}}
function markerMax(marker){return Math.min(100,evaluateFormula(marker.maxFormula||'0'))}
function renderMarker(card,marker){const max=markerMax(marker),current=Math.min(Number(marker.current)||0,max||999),id=`${card.id}:${marker.id}`,displayStyle=marker.displayStyle||'default';if(marker.type==='toggle')return `<div class="card-marker marker-toggle style-${displayStyle}"><span>${safe(marker.label)}</span><button class="toggle-switch ${current?'on':''}" data-card-marker="${id}:toggle"><i></i>${current?'LIGADO':'DESLIGADO'}</button></div>`;if(marker.type==='bar'&&displayStyle!=='rectangles')return `<div class="card-marker marker-bar style-${displayStyle}"><div><span>${safe(marker.label)}</span><strong>${current}/${max}</strong></div><button class="progress-track" data-card-marker="${id}:1"><i style="width:${max?current/max*100:0}%"></i></button><div class="marker-buttons"><button data-card-marker="${id}:-1">−</button><button data-card-marker="${id}:1">+</button></div></div>`;if(marker.type==='slots'){const slots=Array.isArray(marker.slots)?marker.slots:[],costRes=(marker.fillCostResource||'pd').toLowerCase(),costAmt=Number(marker.fillCostAmount)||0;if(displayStyle==='rectangles'){const slotItems=Array.from({length:max},(_,i)=>{const val=slots[i],filled=val!==undefined&&val!==null&&val!=='';return `<button type="button" class="value-slot ${filled?'filled':'empty'}" data-use-slot="${id}:${i}" title="${filled?`Espaço ${i+1}: [ ${val} ] (Clique para gastar)`:'Espaço vazio (Clique para preencher)'}"><b class="slot-val">${filled?val:''}</b></button>`}).join('');return `<div class="card-marker marker-value-slots style-rectangles"><span>${safe(marker.label)}</span><div class="value-slots-row">${slotItems}</div></div>`}const fillBtn=costAmt>0?`<button type="button" class="btn-slot-fill" data-fill-marker="${id}" title="Gastar ${costAmt} ${costRes.toUpperCase()} para preencher um espaço">+ PREENCHER (${costAmt} ${costRes.toUpperCase()})</button>`:'';const slotItems=Array.from({length:max},(_,i)=>{const val=slots[i],filled=val!==undefined&&val!==null&&val!=='';return `<button type="button" class="value-slot ${filled?'filled':'empty'}" data-use-slot="${id}:${i}" title="${filled?`Espaço ${i+1}: ${val} (Clique para gastar)`:'Espaço vazio (Clique para preencher)'}"><span class="slot-idx">${i+1}</span><b class="slot-val">${filled?val:'−'}</b></button>`}).join('');return `<div class="card-marker marker-value-slots style-${displayStyle}"><div class="value-slots-top"><span>${safe(marker.label)}</span>${fillBtn}</div><div class="value-slots-row">${slotItems}</div></div>`}if(marker.type==='pips'||(marker.type==='bar'&&displayStyle==='rectangles'))return `<div class="card-marker marker-pips style-${displayStyle}"><span>${safe(marker.label)}</span><div class="marker-pips-track marker-slots">${Array.from({length:max},(_,i)=>`<button class="charge ${i<current?'on':''}" data-card-marker-set="${id}:${i+1}"></button>`).join('')}</div><strong>${current}/${max}</strong></div>`;return `<div class="card-marker style-${displayStyle}"><span>${safe(marker.label)}</span><button data-card-marker="${id}:-1">−</button><strong>${current}${max?`/${max}`:''}</strong><button data-card-marker="${id}:1">+</button></div>`}
function cardAccent(card){return card.themeLinked!==false?(PROFILE_COLORS[state.profile]||PROFILE_COLORS.Executor):(card.accent||PROFILE_COLORS[state.profile])}
function visibleCards(schema){return state.cards.filter(card=>card.schema===schema&&(!card.profileAbility||card.profileAbility===state.profile))}
function renderResourceCard(card){const image=safeUrl(card.imageUrl)?`<img class="card-image" src="${safeUrl(card.imageUrl)}" alt="">`:'';const markers=(card.markers||[]).map(marker=>renderMarker(card,marker)).join('');const actions=(card.actions||[]).map(action=>`<button class="card-roll" data-expression="${safe(action.expression)}" data-roll-title="${safe(action.name||card.title)}" data-card-id="${card.id}" data-action-id="${action.id}">${die((String(action.expression).match(/d(4|6|8|10|12|20)/i)||[])[1]||20,'micro',true)}<span>${safe(action.name||'Rolar')}</span><small>${safe(action.expression)}</small></button>`).join('');return `<article class="ability resource-card layout-${safe(card.layout||'standard')} ${card.collapsed?'collapsed':''}" draggable="true" data-card-id="${card.id}" data-filter="${safe((card.title+' '+card.type+' '+card.content).toLowerCase())}" style="--card-accent:${safe(cardAccent(card))}"><div class="card-head">${tornTitle(`${safe(card.icon||'◆')} ${safe(card.title)}`)}<div class="card-actions"><button data-toggle-card="${card.id}">⌃</button><button data-move="${card.id}:-1">↑</button><button data-move="${card.id}:1">↓</button><button data-duplicate-card="${card.id}">⧉</button><button data-edit-card="${card.id}" title="Editar habilidade">${icon('edit',14)}</button></div></div><div class="card-details">${image}<small>Tipo: ${safe(card.type||'Habilidade')}</small>${markers}<p class="card-copy">${formatCardText(card.content)}</p><div class="card-rolls">${actions}</div></div></article>`}
function resourceEditor(key,label){const maxKey=`max${key[0].toUpperCase()}${key.slice(1)}`,tempKey=`${key}Temp`;return `<div class="resource-row" data-resource-key="${key}"><strong class="mini-torn">${label}</strong><b>${state[key]}${state[tempKey]?`<button type="button" class="temp-badge-btn" data-consume-temp="${key}:1" title="Clique para extinguir 1 ${key.toUpperCase()} temporário (Botão direito para extinguir todos)"><em>+${state[tempKey]}</em></button>`:''}</b><div class="pips">${pips(state[key],state[maxKey],key,state[tempKey])}</div>${editMode?`<div class="resource-config"><span>MÁX <button data-resource-adjust="${maxKey}:-1">−</button><i>${state[maxKey]}</i><button data-resource-adjust="${maxKey}:1">+</button></span><span>TEMP <button data-resource-adjust="${tempKey}:-1">−</button><i>${state[tempKey]}</i><button data-resource-adjust="${tempKey}:1">+</button></span></div>`:''}</div>`}
function attributeStepper(name,value){return `<div class="attribute-stepper"><button data-attribute-step="${name}:-1">−</button><b>d${value}</b><button data-attribute-step="${name}:1">+</button></div>`}
function syncTokenOutlineFilter(){const flood=document.querySelector('#token-outline-flood'),morph=document.querySelector('#token-outline-morph'),offset=document.querySelector('#token-outline-offset'),blur=document.querySelector('#token-outline-blur'),color=state.diceColor||PROFILE_COLORS[state.profile]||PROFILE_COLORS.Executor;const side=state.cinematicOutlineSide||'left',intensity=side==='none'?0:Number(state.cinematicOutlineIntensity??0.5),width=Number(state.cinematicOutlineWidth??1.8),fade=Number(state.cinematicOutlineFade??1.5);let dx=0;if(side==='left')dx=-2.5;else if(side==='right')dx=2.5;if(flood){flood.setAttribute('flood-color',color);flood.setAttribute('flood-opacity',String(intensity))}if(morph)morph.setAttribute('radius',String(width));if(offset){offset.setAttribute('dx',String(dx));offset.setAttribute('dy','0')}if(blur)blur.setAttribute('stdDeviation',String(fade));const tokenImg=document.querySelector('.cinematic-character>img');if(tokenImg)tokenImg.classList.toggle('no-outline',side==='none'||intensity<=0||width<=0)}
function applyTheme(){const accent=editMode?'#d98b19':(PROFILE_COLORS[state.profile]||PROFILE_COLORS.Executor);document.documentElement.style.setProperty('--red',accent);document.documentElement.style.setProperty('--red-dark',accent);document.body.dataset.profile=state.profile.toLowerCase();document.body.classList.toggle('editing',editMode);syncTokenOutlineFilter()}

function getCriticalState(){
 const resource=(current,maximum)=>{const max=Math.max(0,Number(maximum)||0),value=Math.max(0,Number(current)||0),ratio=max>0?Math.min(1,value/max):1,warning=max>0&&ratio<=.5,vignette=max>0&&ratio<=.35,special=max>0&&ratio<=.25,progress=(threshold,floor)=>ratio<=threshold?Math.min(1,floor+(threshold-ratio)/threshold*(1-floor)):0;return{value,max,ratio,warning,vignette,special,critical:special,warningIntensity:progress(.5,.12),vignetteIntensity:progress(.35,.08),specialIntensity:progress(.25,.08)}};
 const pv=resource(state.pv,state.maxPv),pd=resource(state.pd,state.maxPd);
 return{pv,pd,active:pv.critical||pd.critical};
}
function renderCriticalAtmosphere(){return `<div class="critical-atmosphere" data-critical-atmosphere aria-hidden="true"><div class="critical-pd-darkness"></div><div class="critical-pv-vignette"></div><div class="critical-pd-vignette"></div><canvas class="critical-tendrils" data-critical-tendrils></canvas><div class="critical-distortion"></div></div>`}
function renderCriticalSettings(){const row=(key,title,copy)=>`<div class="critical-setting-row"><span><b>${title}</b><small>${copy}</small></span><button type="button" class="critical-effect-toggle ${criticalEffects[key]?'active':''}" data-critical-effect="${key}" aria-pressed="${criticalEffects[key]}"><i></i><em>${criticalEffects[key]?'ATIVO':'DESATIVADO'}</em></button></div>`;return `<div class="modal critical-settings-modal" id="critical-settings-modal"><div class="backdrop critical-settings-backdrop"></div><section><button type="button" class="critical-settings-close">${icon('close')}</button><small>IMERSÃO & ACESSIBILIDADE</small><h2>EFEITOS CRÍTICOS</h2><p>Escolha quais efeitos atmosféricos podem aparecer. As cores e bordas informativas de PV e PD continuam visíveis.</p>${row('pv','ESTADO CRÍTICO DE PV','Vinheta pulsante e batimento cardíaco sincronizado.')}${row('pd','ESTADO CRÍTICO DE PD','Escurecimento, vibração e formas paranormais.')}</section></div>`}

function renderCinematicCard(card){const inlineMarkers=(card.markers||[]).filter(marker=>marker.displayStyle==='rectangles'&&(marker.type==='pips'||marker.type==='bar'||marker.type==='slots')),bodyMarkers=(card.markers||[]).filter(marker=>!inlineMarkers.includes(marker)),actions=(card.actions||[]).map(action=>`<button class="card-roll" data-expression="${safe(action.expression)}" data-roll-title="${safe(action.name||card.title)}" data-card-id="${card.id}" data-action-id="${action.id}">${die((String(action.expression).match(/d(4|6|8|10|12|20)/i)||[])[1]||20,'micro',true)}<span>${safe(action.name||'Rolar')}</span></button>`).join('');return `<article class="cinematic-card ${inlineMarkers.length?'has-inline-marker':''}" data-card-id="${card.id}" style="--card-accent:${safe(cardAccent(card))}"><header><h3>${safe(card.title)}</h3>${inlineMarkers.length?`<div class="cinematic-inline-markers">${inlineMarkers.map(marker=>renderMarker(card,marker)).join('')}</div>`:''}${editMode?`<button class="cinematic-card-edit" data-edit-card="${card.id}" title="Editar">${icon('edit',14)}</button>`:''}</header>${bodyMarkers.map(marker=>renderMarker(card,marker)).join('')}<div class="cinematic-card-copy">${formatCardText(card.content)}</div>${actions?`<div class="card-rolls">${actions}</div>`:''}</article>`}
function cinematicSection(key,title,content,addSchema=''){const collapsed=!!state.cinematicCollapsed?.[key];const isLockable=key==='items'||key==='history';const lockHtml=isLockable?`<i class="cinematic-section-lock" title="Bloqueado no modo apresentação" aria-hidden="true">${icon('lock',15)}</i>`:'';return `<section class="cinematic-section-group ${collapsed?'collapsed':''} ${isLockable?'section-lockable':''}"><div class="cinematic-section-heading"><button class="cinematic-section-toggle" data-cinematic-section-toggle="${key}" aria-expanded="${!collapsed}"><span>${lockHtml}${title}</span>${icon('chevron',18)}</button>${editMode&&addSchema?`<button class="cinematic-section-add" data-cinematic-add="${addSchema}" title="Adicionar">${icon('plus',15)}</button>`:''}</div><div class="cinematic-section-body"><div>${content}</div></div></section>`}
function renderBackgroundLayer(bgIsVideo=false,isCinematic=false){
 const bgUrl=safeUrl(state.backgroundImage)||'';
 if(bgIsVideo){
  return `<div class="sheet-background-layer"><video class="bg-video" autoplay loop muted playsinline></video><div class="bg-overlay"></div></div>`;
 }
 if(bgUrl){
  return `<div class="sheet-background-layer"><div class="bg-image" style="background-image:url('${bgUrl}')"></div><div class="bg-overlay"></div></div>`;
 }
 return `<div class="sheet-background-layer"><div class="bg-image" style="background-image:url('/assets/ordem2-bg.webp')"></div><div class="bg-overlay"></div></div>`;
}

function renderCinematic(trainingOptions,bgIsVideo=false){const accent=PROFILE_COLORS[state.profile]||PROFILE_COLORS.Executor,profileOptions=['Executor','Analista','Vigilante'].map(value=>({value,label:value})),abilities=visibleCards('abilities').map(renderCinematicCard).join('')||'<p class="cinematic-empty">Nenhuma habilidade.</p>',items=visibleCards('items').map(renderCinematicCard).join('')||'<p class="cinematic-empty">Nenhum item.</p>',history=editMode?`<textarea class="cinematic-history" data-field="history" placeholder="História do personagem...">${safe(state.history||'')}</textarea>`:`<p class="cinematic-history-copy">${formatCardText(state.history||'Nenhuma história registrada.')}</p>`,identity=editMode?`<div class="cinematic-identity cinematic-identity-edit">${customSelect({value:state.profile,options:profileOptions,id:'profile',className:'cinematic-profile-select'})}<i></i><input class="cinematic-occupation-input" data-field="occupation" value="${safe(state.occupation)}"><i></i><span class="cinematic-level-label">NÍVEL</span><input class="cinematic-level-input" data-field="level" value="${state.level}" inputmode="numeric"></div>`:`<div class="cinematic-identity-read"><strong>${safe(state.profile)}</strong><i></i><span>${safe(state.occupation)}</span><i></i><em>NÍVEL</em><b>${state.level}</b></div>`,aptidaoOptions=APTIDAO_FIELDS.map(v=>({value:v,label:v})),aptidaoCount=state.skills.filter(s=>s.name.startsWith('APTIDÃO')).length;return `<main class="cinematic-page ${presentationMode?'presentation-active':''} ${presentationLockingIn?'presentation-locking-in':''} ${presentationEntering?'presentation-entering':''} ${editTransitionMode?`edit-trans-${editTransitionMode}`:''} ${modeJustChanged?'mode-enter':''}${bgIsVideo?' has-video-bg':''}" style="--cinematic-accent:${accent};--resource-shift:${currentResourceShift}px;--bg-blur:${state.backgroundBlur??0}px;--bg-zoom:${(state.backgroundZoom??100)/100};">${renderBackgroundLayer(bgIsVideo,true)}<div class="cinematic-frame"><i class="cinematic-frame-line top"><b></b><b></b></i><i class="cinematic-frame-line bottom"><b></b><b></b></i></div><div class="cinematic-contents"><header class="cinematic-header"><div class="cinematic-name">${editMode?`<input data-field="name" value="${safe(state.name)}">`:`<h1>${safe(state.name)}</h1>`}</div>${identity}</header><section class="cinematic-left"><div class="cinematic-attributes"><h2>ATRIBUTOS</h2>${Object.entries(state.attributes).map(([name,value])=>`<div><span>${name}</span><button class="cinematic-attribute-die" data-roll="${name}|${value}">${die(value,'cinematic-attribute')}</button>${editMode?attributeStepper(name,value):''}</div>`).join('')}</div><div class="cinematic-skills"><h2><span>PERÍCIAS</span>${editMode?`<button type="button" class="cinematic-add-aptidao" data-add-aptidao title="Adicionar outra Aptidão">+ APTIDÃO</button>`:''}</h2><div>${state.skills.map((skill,index)=>{const attrDie=state.attributes[skill.attribute]||4,trained=skill.skillDie>4,isAptidao=skill.name.startsWith('APTIDÃO'),aptidaoField=isAptidao?(skill.name.match(/\(([^)]+)\)/)?.[1]||'HUMANAS'):'',nameHtml=editMode&&isAptidao?`<span class="skill-name-aptidao"><span>APTIDÃO</span>${customSelect({value:aptidaoField,options:aptidaoOptions,id:`aptidao-field:${index}`,className:'cinematic-aptidao-select'})}<i class="skill-info-button" data-skill-info="${index}">${icon('info',11)}</i>${aptidaoCount>1?`<button type="button" class="btn-remove-aptidao" data-remove-aptidao="${index}" title="Remover">${icon('trash',11)}</button>`:''}</span>`:`<span>${safe(skill.name)}<i class="skill-info-button" data-skill-info="${index}">${icon('info',11)}</i></span>`;return `<div class="cinematic-skill grade-d${skill.skillDie}" data-roll="${safe(skill.name)}|${skill.skillDie},${attrDie}|${skill.extra||0}" role="button" tabindex="0">${nameHtml}<span class="cinematic-skill-dice">${die(skill.skillDie,'cinematic-skill-die',trained)}<b>+</b>${die(attrDie,'cinematic-skill-die attribute',trained)}<em>${safe(skill.attribute)}</em>${skill.extra?`<strong>${Number(skill.extra)>0?'+':''}${skill.extra}</strong>`:''}</span>${editMode?`<span class="cinematic-skill-edit">${customSelect({value:skill.training,options:trainingOptions,id:`skill-training:${index}`,className:'skill-select training-select'})}${customSelect({value:skill.attribute,options:['Físico','Mente','Emoção'].map(value=>({value,label:value})),id:`skill-attribute:${index}`,className:'skill-select attribute-select'})}<input data-skill-extra="${index}" type="number" value="${skill.extra||0}" title="Bônus extra"></span>`:''}</div>`}).join('')}</div></div></section><section class="cinematic-character" data-cinematic-character>${state.tokenImage?`<img src="${safeUrl(state.tokenImage)}" alt="${safe(state.name)}" draggable="false" data-cinematic-token style="left:${state.cinematicTokenX}%;top:${state.cinematicTokenY}%;--token-scale:${state.cinematicTokenScale/100}" class="${(state.cinematicOutlineSide==='none'||(state.cinematicOutlineIntensity??0.5)<=0||(state.cinematicOutlineWidth??1.8)<=0)?'no-outline':''}">`:`<div class="cinematic-token-empty"><span>${icon('user',54)}</span><p>ADICIONE A IMAGEM DO PERSONAGEM</p></div>`}${editMode?`<div class="cinematic-token-tools"><label>${icon('image',15)} PERSONAGEM<input id="token-upload-cinematic" type="file" accept="image/*"></label>${state.tokenImage?`<button type="button" class="btn-upscale-token" data-upscale-token title="Super-resolução e nitidez avançada">${icon('sparkles',14)} UPSCALE 2X (HD)</button>`:''}<div class="token-side-group" title="Lado da iluminação de recorte"><span>ILUMINAÇÃO</span><button type="button" class="${(state.cinematicOutlineSide||'left')==='left'?'active':''}" data-outline-side="left">ESQ</button><button type="button" class="${state.cinematicOutlineSide==='right'?'active':''}" data-outline-side="right">DIR</button><button type="button" class="${state.cinematicOutlineSide==='both'?'active':''}" data-outline-side="both">360°</button><button type="button" class="${state.cinematicOutlineSide==='none'?'active':''}" data-outline-side="none">OFF</button></div><label title="Intensidade da iluminação">FORÇA <input type="range" min="10" max="95" step="5" value="${Math.round((state.cinematicOutlineIntensity??0.5)*100)}" data-cinematic-outline-intensity></label><label title="Espessura da linha">CONTORNO <input type="range" min="0.5" max="5" step="0.2" value="${state.cinematicOutlineWidth??1.8}" data-cinematic-outline-width></label><label title="Fade / suavidade da borda">FADE <input type="range" min="0.5" max="3.5" step="0.2" value="${state.cinematicOutlineFade??1.5}" data-cinematic-outline-fade></label><label>ESCALA <input type="range" min="45" max="220" value="${state.cinematicTokenScale}" data-cinematic-scale></label><button data-reset-cinematic-token>RECENTRALIZAR</button><label>${icon('image',15)} FUNDO<input id="background-upload" type="file" accept="image/*,video/mp4,video/webm"></label>${state.backgroundImage?'<button type="button" data-reset-background>FUNDO PADRÃO</button>':''}<label title="Desfoque da imagem de fundo (Duplo clique para zerar)">BLUR <input type="range" min="0" max="30" step="1" value="${state.backgroundBlur??0}" data-cinematic-bg-blur><span class="slider-val-hint" id="val-hint-blur">${state.backgroundBlur??0}px</span></label><label title="Escala / Zoom da imagem de fundo (Duplo clique para 100%)">ZOOM BG <input type="range" min="30" max="250" step="5" value="${state.backgroundZoom??100}" data-cinematic-bg-zoom><span class="slider-val-hint" id="val-hint-zoom">${state.backgroundZoom??100}%</span></label>${(state.backgroundBlur>0||(state.backgroundZoom&&state.backgroundZoom!==100))?'<button type="button" data-reset-bg-effects title="Redefinir blur para 0 e zoom para 100%">RESET BG</button>':''}<label>COR DOS DADOS <input id="dice-color" type="color" value="${safe(state.diceColor||PROFILE_COLORS[state.profile])}"></label>${state.diceColor?'<button data-reset-dice-color>COR DO PERFIL</button>':''}<small>Arraste o personagem para reposicionar · Duplo clique nos sliders para redefinir</small></div>`:''}</section><section class="cinematic-right"><div class="cinematic-resources"><div class="cinematic-resource-item resource-pv" data-resource-key="pv"><strong>PV</strong><b>${state.pv}${state.pvTemp?`<button type="button" class="temp-badge-btn" data-consume-temp="pv:1" title="Clique para extinguir 1 PV temporário (Botão direito para extinguir todos)"><em>+${state.pvTemp}</em></button>`:''}</b><span>${pips(state.pv,state.maxPv,'pv',state.pvTemp)}</span>${editMode?`<small class="cinematic-resource-edit">MÁX <button data-resource-adjust="maxPv:-1">−</button>${state.maxPv}<button data-resource-adjust="maxPv:1">+</button> TEMP <button data-resource-adjust="pvTemp:-1">−</button>${state.pvTemp}<button data-resource-adjust="pvTemp:1">+</button></small>`:''}</div><div class="cinematic-resource-item resource-pd" data-resource-key="pd"><strong>PD</strong><b>${state.pd}${state.pdTemp?`<button type="button" class="temp-badge-btn" data-consume-temp="pd:1" title="Clique para extinguir 1 PD temporário (Botão direito para extinguir todos)"><em>+${state.pdTemp}</em></button>`:''}</b><span>${pips(state.pd,state.maxPd,'pd',state.pdTemp)}</span>${editMode?`<small class="cinematic-resource-edit">MÁX <button data-resource-adjust="maxPd:-1">−</button>${state.maxPd}<button data-resource-adjust="maxPd:1">+</button> TEMP <button data-resource-adjust="pdTemp:-1">−</button>${state.pdTemp}<button data-resource-adjust="pdTemp:1">+</button></small>`:''}</div></div><div class="cinematic-scroll"><div class="cinematic-card-column">${cinematicSection('abilities','HABILIDADES',abilities,'abilities')}${cinematicSection('items','ITENS',items,'items')}${cinematicSection('history','HISTÓRIA',history)}</div></div></section></div>${presentationMode?renderPresentationDock():''}</main>`}

function playCardSlideSound(){
 const ctx=getUiAudioContext();if(!ctx)return;
 const now=ctx.currentTime;
 try{
  const osc=ctx.createOscillator(),gain=ctx.createGain();
  osc.type='sine';
  osc.frequency.setValueAtTime(220,now);
  osc.frequency.exponentialRampToValueAtTime(80,now+0.07);
  gain.gain.setValueAtTime(0.0001,now);
  gain.gain.linearRampToValueAtTime(0.035,now+0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001,now+0.08);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);osc.stop(now+0.09);
 }catch(e){}
}

let _cachedConfirmNoise=null,_cachedOpenNoise=null,_cachedGlitchNoise=null,_cachedGlitchCurve=null;
function getConfirmNoiseBuffer(ctx){if(_cachedConfirmNoise&&_cachedConfirmNoise.sampleRate===ctx.sampleRate)return _cachedConfirmNoise;const bufferSize=Math.floor(ctx.sampleRate*0.42),buf=ctx.createBuffer(1,bufferSize,ctx.sampleRate),out=buf.getChannelData(0);for(let i=0;i<bufferSize;i++)out[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.16));return _cachedConfirmNoise=buf}
function getOpenNoiseBuffer(ctx){if(_cachedOpenNoise&&_cachedOpenNoise.sampleRate===ctx.sampleRate)return _cachedOpenNoise;const bufferSize=Math.floor(ctx.sampleRate*0.46),buf=ctx.createBuffer(1,bufferSize,ctx.sampleRate),out=buf.getChannelData(0);for(let i=0;i<bufferSize;i++)out[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.18));return _cachedOpenNoise=buf}
function getGlitchNoiseBuffer(ctx){if(_cachedGlitchNoise&&_cachedGlitchNoise.sampleRate===ctx.sampleRate)return _cachedGlitchNoise;const buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.42),ctx.sampleRate),data=buf.getChannelData(0);for(let i=0;i<data.length;i++){const env=i<2000?i/2000:(i>data.length-3000?(data.length-i)/3000:1);data[i]=(Math.random()*2-1)*env*(i%1700<60?2.5:1)}return _cachedGlitchNoise=buf}
function getGlitchDistCurve(){if(_cachedGlitchCurve)return _cachedGlitchCurve;const curve=new Float32Array(256);for(let i=0;i<256;i++){const x=i/128-1;curve[i]=x*(1.2+Math.abs(x)*3.5)}return _cachedGlitchCurve=curve}

function playSelectionConfirmSound(){
 const ctx=getUiAudioContext();if(!ctx)return;
 const now=ctx.currentTime;
 const subOsc=ctx.createOscillator(),subGain=ctx.createGain();
 subOsc.type='sine';
 subOsc.frequency.setValueAtTime(82,now);
 subOsc.frequency.exponentialRampToValueAtTime(26,now+0.48);
 subGain.gain.setValueAtTime(0.0001,now);
 subGain.gain.linearRampToValueAtTime(0.48,now+0.018);
 subGain.gain.exponentialRampToValueAtTime(0.0001,now+0.58);
 subOsc.connect(subGain).connect(ctx.destination);
 subOsc.start(now);subOsc.stop(now+0.6);

 const clickOsc=ctx.createOscillator(),clickGain=ctx.createGain();
 clickOsc.type='triangle';
 clickOsc.frequency.setValueAtTime(120,now);
 clickOsc.frequency.exponentialRampToValueAtTime(38,now+0.09);
 clickGain.gain.setValueAtTime(0.0001,now);
 clickGain.gain.linearRampToValueAtTime(0.32,now+0.006);
 clickGain.gain.exponentialRampToValueAtTime(0.0001,now+0.12);
 clickOsc.connect(clickGain).connect(ctx.destination);
 clickOsc.start(now);clickOsc.stop(now+0.14);

 try{
  const noise=ctx.createBufferSource();
  noise.buffer=getConfirmNoiseBuffer(ctx);
  const filter=ctx.createBiquadFilter();
  filter.type='lowpass';
  filter.frequency.setValueAtTime(340,now);
  filter.frequency.exponentialRampToValueAtTime(55,now+0.38);
  filter.Q.setValueAtTime(2.2,now);
  const noiseGain=ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001,now);
  noiseGain.gain.linearRampToValueAtTime(0.2,now+0.02);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001,now+0.4);
  noise.connect(filter).connect(noiseGain).connect(ctx.destination);
  noise.start(now);noise.stop(now+0.42);
 }catch(e){}
}

function playUnlockSound(){
 const ctx=getUiAudioContext();if(!ctx)return;
 const now=ctx.currentTime;
 try{
  const o1=ctx.createOscillator(),g1=ctx.createGain();
  o1.type='triangle';o1.frequency.setValueAtTime(2400,now);
  o1.frequency.exponentialRampToValueAtTime(1100,now+0.025);
  g1.gain.setValueAtTime(0.0001,now);
  g1.gain.linearRampToValueAtTime(0.12,now+0.004);
  g1.gain.exponentialRampToValueAtTime(0.0001,now+0.04);
  o1.connect(g1).connect(ctx.destination);
  o1.start(now);o1.stop(now+0.045);

  const o2=ctx.createOscillator(),g2=ctx.createGain();
  o2.type='sine';o2.frequency.setValueAtTime(1600,now+0.045);
  o2.frequency.exponentialRampToValueAtTime(420,now+0.13);
  g2.gain.setValueAtTime(0.0001,now+0.045);
  g2.gain.linearRampToValueAtTime(0.16,now+0.05);
  g2.gain.exponentialRampToValueAtTime(0.0001,now+0.15);
  o2.connect(g2).connect(ctx.destination);
  o2.start(now+0.045);o2.stop(now+0.16);
 }catch(e){}
}

function playLockRattleSound(){
 const ctx=getUiAudioContext();if(!ctx)return;
 const now=ctx.currentTime;
 try{
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type='square';o.frequency.setValueAtTime(320,now);
  o.frequency.setValueAtTime(460,now+0.02);
  o.frequency.setValueAtTime(240,now+0.045);
  g.gain.setValueAtTime(0.0001,now);
  g.gain.linearRampToValueAtTime(0.04,now+0.005);
  g.gain.exponentialRampToValueAtTime(0.0001,now+0.07);
  o.connect(g).connect(ctx.destination);
  o.start(now);o.stop(now+0.08);
 }catch(e){}
}

function playPresentationOpenSound(){
 const ctx=getUiAudioContext();if(!ctx)return;
 const now=ctx.currentTime;
 try{
  const subOsc=ctx.createOscillator(),subGain=ctx.createGain();
  subOsc.type='sine';
  subOsc.frequency.setValueAtTime(32,now);
  subOsc.frequency.exponentialRampToValueAtTime(74,now+0.22);
  subOsc.frequency.exponentialRampToValueAtTime(36,now+0.52);
  subGain.gain.setValueAtTime(0.0001,now);
  subGain.gain.linearRampToValueAtTime(0.42,now+0.03);
  subGain.gain.exponentialRampToValueAtTime(0.0001,now+0.56);
  subOsc.connect(subGain).connect(ctx.destination);
  subOsc.start(now);subOsc.stop(now+0.58);

  const clickOsc=ctx.createOscillator(),clickGain=ctx.createGain();
  clickOsc.type='triangle';
  clickOsc.frequency.setValueAtTime(42,now);
  clickOsc.frequency.exponentialRampToValueAtTime(135,now+0.08);
  clickGain.gain.setValueAtTime(0.0001,now);
  clickGain.gain.linearRampToValueAtTime(0.28,now+0.01);
  clickGain.gain.exponentialRampToValueAtTime(0.0001,now+0.12);
  clickOsc.connect(clickGain).connect(ctx.destination);
  clickOsc.start(now);clickOsc.stop(now+0.14);

  const noise=ctx.createBufferSource();
  noise.buffer=getOpenNoiseBuffer(ctx);
  const filter=ctx.createBiquadFilter();
  filter.type='lowpass';
  filter.frequency.setValueAtTime(95,now);
  filter.frequency.exponentialRampToValueAtTime(380,now+0.2);
  filter.frequency.exponentialRampToValueAtTime(70,now+0.42);
  filter.Q.setValueAtTime(2.4,now);
  const noiseGain=ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001,now);
  noiseGain.gain.linearRampToValueAtTime(0.22,now+0.03);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001,now+0.44);
  noise.connect(filter).connect(noiseGain).connect(ctx.destination);
  noise.start(now);noise.stop(now+0.46);
 }catch(e){}
}

let presentationDirection=0;
function openPresentationMode(){
 if(presentationLockingIn)return;
 state.viewMode='cinematic';
 presentationIndex=Math.max(0,sheets.findIndex(s=>s.id===state.id));
 presentationMode=true;
 presentationEntering=true;
 presentationLockingIn=false;
 presentationDirection=0;
 state=sheets[presentationIndex];
 activeSheetId=state.id;
 playPresentationOpenSound();
 render();
 setTimeout(()=>{
  presentationEntering=false;
  const page=document.querySelector('.cinematic-page');
  if(page)page.classList.remove('presentation-entering');
 },560);
}
function closePresentationMode(){
 if(presentationLockingIn)return;
 confirmPresentationAgent(sheets[presentationIndex]);
}
function cyclePresentation(direction){
 if(presentationLockingIn||sheets.length<=1)return;
 presentationDirection=direction;
 presentationIndex=(presentationIndex+direction+sheets.length)%sheets.length;
 triggerGlitchTransition(()=>{
  state=sheets[presentationIndex];
  activeSheetId=state.id;
  render();
 });
}

function confirmPresentationAgent(chosenSheet){
 if(!chosenSheet||presentationLockingIn)return;
 presentationLockingIn=true;
 playSelectionConfirmSound();
 playUnlockSound();
 const page=document.querySelector('.cinematic-page');
 const currCard=document.querySelector('[data-presentation-curr]');
 if(page)page.classList.add('presentation-locking-in');
 if(currCard)currCard.classList.add('locking-in');
 const thumb=currCard?.querySelector('.cp-card-thumb');
 if(thumb&&!thumb.querySelector('.pcard-lockin-overlay')){
  const overlay=document.createElement('div');
  overlay.className='pcard-lockin-overlay';
  overlay.innerHTML=`<div class="pcard-lockin-stamp"><strong>✓ RECEPTÁCULO CONFIRMADO</strong><small>SINCRONIZANDO FICHA...</small></div>`;
  thumb.appendChild(overlay);
 }
 setTimeout(()=>{
  presentationLockingIn=false;
  presentationMode=false;
  state=chosenSheet;
  activeSheetId=state.id;
  state.viewMode='cinematic';
  save(false);
  render();
 },540);
}

function renderPresentationDock(){
 const total=sheets.length;
 if(!total)return '';
 const prevIdx=(presentationIndex-1+total)%total,currIdx=presentationIndex,nextIdx=(presentationIndex+1+total)%total;
 const prevSheet=sheets[prevIdx],currSheet=sheets[currIdx],nextSheet=sheets[nextIdx];
 const prevAccent=PROFILE_COLORS[prevSheet.profile]||'#e0150d';
 const currAccent=PROFILE_COLORS[currSheet.profile]||'#e0150d';
 const nextAccent=PROFILE_COLORS[nextSheet.profile]||'#e0150d';
 const hasMultiple=total>1;
 const dirClass=presentationDirection===1?'dir-next':(presentationDirection===-1?'dir-prev':'');
 return `<section class="cinematic-presentation-dock" style="--agent-accent:${currAccent}"><header class="cp-dock-top"><span class="cp-dock-badge">${icon('dossier',11)} SELEÇÃO DE RECEPTÁCULO</span><span class="cp-dock-hint"><kbd>←</kbd> <kbd>→</kbd> Navegar · <b>Duplo clique</b> para Confirmar</span><span class="cp-dock-counter">${currIdx+1} / ${total}</span></header><div class="cp-dock-carousel ${dirClass}" id="presentation-stage" style="--prev-accent:${prevAccent};--curr-accent:${currAccent};--next-accent:${nextAccent};">${hasMultiple?`<button type="button" class="cp-arrow prev" data-presentation-prev title="Receptáculo anterior (←)">${icon('chevron-left',18)}</button><article class="cp-card card-side card-prev" data-presentation-pick="${prevIdx}" style="--agent-accent:${prevAccent}" title="Ver ${safe(prevSheet.name)}"><div class="cp-card-topbar"><span class="cp-card-tag">ANTERIOR</span><span class="cp-card-profile">${safe(prevSheet.profile)}</span></div><div class="cp-card-thumb">${prevSheet.tokenImage?`<img src="${safeUrl(prevSheet.tokenImage)}" alt="${safe(prevSheet.name)}">`:`<div class="cp-avatar-ph">${safe((prevSheet.name||'?').slice(0,1))}</div>`}</div><div class="cp-card-summary"><strong>${safe(prevSheet.name)}</strong><small>${safe(prevSheet.occupation||'Investigador')}</small></div></article>`:''}<article class="cp-card card-curr ${presentationLockingIn?'locking-in':''}" data-presentation-curr style="--agent-accent:${currAccent}"><div class="cp-card-topbar"><span class="cp-card-tag" title="Duplo clique para confirmar receptáculo">DUPLO CLIQUE PARA CONFIRMAR</span><span class="cp-card-profile">${safe(currSheet.profile)}</span></div><div class="cp-card-thumb">${currSheet.tokenImage?`<img src="${safeUrl(currSheet.tokenImage)}" alt="${safe(currSheet.name)}">`:`<div class="cp-avatar-ph">${safe((currSheet.name||'?').slice(0,1))}</div>`}${presentationLockingIn?`<div class="pcard-lockin-overlay"><div class="pcard-lockin-stamp"><strong>✓ RECEPTÁCULO CONFIRMADO</strong><small>SINCRONIZANDO FICHA...</small></div></div>`:''}</div><div class="cp-card-summary"><div class="cp-summary-header"><strong>${safe(currSheet.name)}</strong><span class="cp-level-badge">NV ${currSheet.level||1}</span></div><small>${safe(currSheet.occupation||'Investigador')} · ${safe(currSheet.profile)}</small><div class="cp-pill-row"><span class="cp-stat-pill">FÍS <b>${currSheet.attributes?.['Físico']||4}</b></span><span class="cp-stat-pill">MEN <b>${currSheet.attributes?.['Mente']||4}</b></span><span class="cp-stat-pill">EMO <b>${currSheet.attributes?.['Emoção']||4}</b></span><span class="cp-res-pill pv">PV ${currSheet.pv}/${currSheet.maxPv}</span><span class="cp-res-pill pd">PD ${currSheet.pd}/${currSheet.maxPd}</span></div><button type="button" class="btn-select-cp-agent" data-confirm-agent="${currSheet.id}" title="Confirmar receptáculo (Duplo clique ou Enter)"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg><span>CONFIRMAR RECEPTÁCULO</span></button></div></article>${hasMultiple?`<article class="cp-card card-side card-next" data-presentation-pick="${nextIdx}" style="--agent-accent:${nextAccent}" title="Ver ${safe(nextSheet.name)}"><div class="cp-card-topbar"><span class="cp-card-tag">PRÓXIMO</span><span class="cp-card-profile">${safe(nextSheet.profile)}</span></div><div class="cp-card-thumb">${nextSheet.tokenImage?`<img src="${safeUrl(nextSheet.tokenImage)}" alt="${safe(nextSheet.name)}">`:`<div class="cp-avatar-ph">${safe((nextSheet.name||'?').slice(0,1))}</div>`}</div><div class="cp-card-summary"><strong>${safe(nextSheet.name)}</strong><small>${safe(nextSheet.occupation||'Investigador')}</small></div></article><button type="button" class="cp-arrow next" data-presentation-next title="Próximo receptáculo (→)">${icon('chevron-right',18)}</button>`:''}</div></section>`;
}

function bindPresentationEvents(){
 document.querySelectorAll('[data-open-presentation]').forEach(btn=>btn.onclick=()=>{
  sheetDrawerOpen=false;
  viewSwitchCollapsed=true;
  openPresentationMode();
 });
 document.querySelectorAll('[data-close-presentation]').forEach(btn=>btn.onclick=()=>closePresentationMode());
 document.querySelectorAll('[data-presentation-prev]').forEach(btn=>btn.onclick=()=>cyclePresentation(-1));
 document.querySelectorAll('[data-presentation-next]').forEach(btn=>btn.onclick=()=>cyclePresentation(1));
 document.querySelectorAll('[data-presentation-pick]').forEach(card=>{
  card.onclick=e=>{
   e.stopPropagation();
   if(presentationLockingIn)return;
   const idx=Number(card.dataset.presentationPick);
   if(!isNaN(idx)){
    if(card.classList.contains('card-next'))cyclePresentation(1);
    else if(card.classList.contains('card-prev'))cyclePresentation(-1);
    else{
     const diff=(idx-presentationIndex+sheets.length)%sheets.length;
     cyclePresentation(diff===1?1:-1);
    }
   }
  };
 });
 document.querySelectorAll('[data-confirm-agent]').forEach(btn=>{
  btn.onclick=e=>{
   e.stopPropagation();
   const id=btn.dataset.confirmAgent,target=sheets.find(s=>s.id===id)||sheets[presentationIndex];
   confirmPresentationAgent(target);
  };
 });
 const currCard=document.querySelector('[data-presentation-curr]');
 if(currCard){
  currCard.ondblclick=e=>{
   e.stopPropagation();
   confirmPresentationAgent(sheets[presentationIndex]);
  };
 }
 const stage=document.querySelector('#presentation-stage');
 if(stage){
  let tStartX=0,tStartY=0,tStartTime=0;
  stage.ontouchstart=e=>{
   if(presentationLockingIn)return;
   const t=e.touches[0];
   tStartX=t.clientX;tStartY=t.clientY;tStartTime=Date.now();
  };
  stage.ontouchend=e=>{
   if(presentationLockingIn||!tStartTime)return;
   const t=e.changedTouches[0],dx=t.clientX-tStartX,dy=t.clientY-tStartY,dt=Date.now()-tStartTime;
   tStartTime=0;
   if(dt<400&&Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy)*1.2){
    if(dx<0)cyclePresentation(1);else cyclePresentation(-1);
   }
  };
 }
}


function readMedia(file,key){if(!file)return;const type=file.type;if(type.startsWith('video/')||type==='image/gif'){if(state[key]?.startsWith('blob:'))URL.revokeObjectURL(state[key]);blobBgType=type.startsWith('video/')?'video':'gif';state[key]=URL.createObjectURL(file);render()}else{blobBgType='';readImage(file,key,1920)}}

function renderBottomNav(){
 const tabs=[
  {id:'agent',label:'AGENTE',svg:'<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M3 21a9 9 0 0 1 18 0"/>'},
  {id:'stats',label:'STATS',svg:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 17h7m-3.5-3.5v7"/>'},
  {id:'cards',label:'CARTAS',svg:'<rect x="2" y="3" width="13" height="18" rx="2"/><path d="M16 8h4m-2-2v4M16 16h4"/>'},
  {id:'history',label:'HISTÓRIA',svg:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'},
 ];
 return `<nav class="mobile-bottom-nav">
  <button class="mobile-drawer-btn" data-sheet-drawer aria-label="Fichas">${state.tokenImage?`<img src="${safeUrl(state.tokenImage)}" alt="" class="mobile-avatar-thumb">`:icon('sheet',20)}</button>
  ${tabs.map(t=>`<button class="mobile-tab-btn ${mobileTab===t.id?'active':''}" data-mobile-tab="${t.id}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${t.svg}</svg><span>${t.label}</span></button>`).join('')}
  <button class="mobile-tab-btn ${editMode?'active edit-active':''}" data-toggle-edit aria-label="Editar">${editMode?icon('close',20):icon('edit',20)}<span>${editMode?'FECHAR':'EDITAR'}</span></button>
 </nav>`;
}

function renderSheetDrawer(){
 if(!sheetDrawerOpen)return'';
 return `<div class="sheet-drawer-backdrop" data-close-drawer></div>
 <aside class="sheet-drawer">
  <div class="sheet-drawer-header"><span>FICHAS</span><button data-close-drawer>${icon('close',16)}</button></div>
  <div class="sheet-drawer-list">
   ${sheets.map(sheet=>`<button class="sheet-drawer-item ${sheet.id===state.id?'active':''}" data-sheet-id="${sheet.id}">${sheet.tokenImage?`<img src="${safeUrl(sheet.tokenImage)}" alt="">`:''}<span>${safe(sheet.name||'AGENTE')}</span></button>`).join('')}
   <button class="sheet-drawer-item new" data-new-sheet>${icon('plus',16)}<span>NOVA FICHA</span></button>
  </div>
  <div class="sheet-drawer-footer">
    <button type="button" data-open-presentation>${icon('presentation',15)} APRESENTAÇÃO</button>
    <button type="button" data-export-cinematic-image>${icon('camera',15)} FOTO HD</button>
    <button type="button" data-open-roll-log>${icon('history',15)} LOG (${rollLog.length})</button>
   <button data-export-json>${icon('download',15)} EXPORTAR</button>
   <button data-import-json>${icon('upload',15)} IMPORTAR</button>
   <button data-save-sheet>${icon('save',15)} SALVAR</button>
   <input type="file" id="json-file-input" accept=".json,application/json" style="display:none">
  </div>
 </aside>`;
}

let rollLog = [];
try {
 const saved = sessionStorage.getItem('ordem-ii-roll-log');
 if (saved) rollLog = JSON.parse(saved);
} catch {}
let rollLogOpen = false;

function addRollLogEntry(entry) {
 const d = new Date();
 const timeStr = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
 rollLog.unshift({
  id: makeId('roll'),
  characterName: state.name || 'Agente',
  profile: state.profile || 'Executor',
  title: entry.title || 'Rolagem',
  dice: entry.dice || [],
  modifier: Number(entry.modifier) || 0,
  total: entry.total,
  timestamp: timeStr
 });
 if (rollLog.length > 50) rollLog.length = 50;
 try { sessionStorage.setItem('ordem-ii-roll-log', JSON.stringify(rollLog)); } catch {}
 updateRollLogUi();
}

function updateRollLogUi() {
 document.querySelectorAll('.roll-log-badge').forEach(badge => {
  badge.textContent = rollLog.length ? String(rollLog.length) : '';
  badge.classList.toggle('visible', rollLog.length > 0);
 });
 const body = document.querySelector('#roll-log-body');
 if (body) {
  body.innerHTML = renderRollLogItemsHtml();
  bindRollLogItemEvents(body);
 }
 const countEl = document.querySelector('#roll-log-count');
 if (countEl) {
  countEl.textContent = `${rollLog.length} ${rollLog.length === 1 ? 'rolagem' : 'rolagens'} registradas`;
 }
}

function renderRollLogItemsHtml() {
 if (!rollLog.length) {
  return `<div class="roll-log-empty">
   <div class="roll-log-empty-icon">${icon('d20', 36)}</div>
   <h4>NENHUMA ROLAGEM AINDA</h4>
   <p>Role atributos, perícias ou ações para registrar o histórico nesta sessão.</p>
  </div>`;
 }
 return rollLog.map(entry => {
  const modStr = entry.modifier ? ` ${entry.modifier > 0 ? '+' : '−'} ${Math.abs(entry.modifier)}` : '';
  const diceStr = (entry.dice || []).map(d => `<span class="roll-die-pill" data-sides="${d.sides}"><b>${d.value}</b><small>d${d.sides}</small></span>`).join('<i class="roll-plus">+</i>');
  const accentColor = PROFILE_COLORS[entry.profile] || '#e0150d';
  const copyText = `🎲 [${entry.characterName}] ${entry.title}: ${entry.total} (${(entry.dice || []).map(d => `d${d.sides}:${d.value}`).join(', ')}${modStr})`;
  return `<article class="roll-log-item" style="--item-accent:${accentColor}">
   <div class="roll-log-item-top">
    <div class="roll-log-agent">
     <span class="roll-log-char-name">${safe(entry.characterName)}</span>
     <span class="roll-log-time">${entry.timestamp}</span>
    </div>
    <button type="button" class="btn-copy-single-roll" data-copy-roll="${safe(copyText)}" title="Copiar para Discord/WhatsApp">${icon('copy', 13)}</button>
   </div>
   <div class="roll-log-item-middle">
    <h4 class="roll-log-item-title">${safe(entry.title)}</h4>
    <div class="roll-log-total"><b>${entry.total}</b></div>
   </div>
   <div class="roll-log-item-breakdown">
    ${diceStr}
    ${entry.modifier ? `<span class="roll-mod-pill">${entry.modifier > 0 ? '+' : '−'}${Math.abs(entry.modifier)}</span>` : ''}
   </div>
  </article>`;
 }).join('');
}

function renderRollLogDrawer() {
 return `
 <div class="roll-log-backdrop ${rollLogOpen ? 'open' : ''}" data-close-roll-log></div>
 <aside class="roll-log-drawer ${rollLogOpen ? 'open' : ''}">
  <header class="roll-log-header">
   <div class="roll-log-header-title">
    <span class="roll-log-icon">${icon('d20', 18)}</span>
    <div>
     <h3>HISTÓRICO DE ROLAGENS</h3>
     <small id="roll-log-count">${rollLog.length} ${rollLog.length === 1 ? 'rolagem' : 'rolagens'} registradas</small>
    </div>
   </div>
   <div class="roll-log-header-actions">
    ${rollLog.length ? `<button type="button" class="btn-log-action" data-copy-all-rolls title="Copiar todo o histórico">${icon('copy', 13)}<span>COPIAR</span></button><button type="button" class="btn-log-action" data-clear-roll-log title="Limpar histórico">${icon('trash', 13)}</button>` : ''}
    <button type="button" class="btn-close-roll-log" data-close-roll-log title="Fechar">${icon('close', 16)}</button>
   </div>
  </header>
  <div class="roll-log-body" id="roll-log-body">
   ${renderRollLogItemsHtml()}
  </div>
 </aside>`;
}

function toggleRollLog(force) {
 rollLogOpen = (typeof force === 'boolean') ? force : !rollLogOpen;
 const drawer = document.querySelector('.roll-log-drawer');
 const backdrop = document.querySelector('.roll-log-backdrop');
 if (drawer && backdrop) {
  drawer.classList.toggle('open', rollLogOpen);
  backdrop.classList.toggle('open', rollLogOpen);
 }
}

function bindRollLogItemEvents(container = document) {
 container.querySelectorAll('[data-copy-roll]').forEach(btn => {
  btn.onclick = e => {
   e.stopPropagation();
   const text = btn.dataset.copyRoll;
   if (text) {
    navigator.clipboard.writeText(text).catch(() => {});
    const toast = document.querySelector('#save-toast');
    if (toast) {
     toast.textContent = 'ROLAGEM COPIADA!';
     toast.classList.add('show');
     setTimeout(() => { toast.classList.remove('show'); toast.textContent = 'SALVO'; }, 1300);
    }
   }
  };
 });
}

function render(){document.querySelectorAll('.cinematic-ghost-exit').forEach(el=>el.remove());const previousScroll={sheet:app.querySelector('.sheet-main')?.scrollTop||0,right:app.querySelector('.right-panel')?.scrollTop||0,cinematicRight:app.querySelector('.cinematic-scroll')?.scrollTop||0,cinematicSkills:app.querySelector('.cinematic-skills>div')?.scrollTop||0,sheetSwitcher:app.querySelector('.sheet-switcher')?.scrollTop||0};applyTheme();const bgIsVideo=!!(state.backgroundImage&&state.backgroundImage.startsWith('data:video/'));const trainingOptions=TRAINING.map(([label,value])=>({value:label,label,html:`${die(value,'menu-die',value>4)}<span>d${value} — ${label}</span>`})),aptidaoOptions=APTIDAO_FIELDS.map(value=>({value,label:value})),aptidaoCount=state.skills.filter(s=>s.name.startsWith('APTIDÃO')).length;app.innerHTML=`

	  <aside class="nav-rail compact-rail"><button class="nav-btn active main-sheet-icon" title="Ficha principal">${state.tokenImage?`<img src="${safeUrl(state.tokenImage)}" alt="">`:icon('sheet')}</button><button class="nav-btn" data-compendium title="Compêndio (em breve)">${icon('book')}</button><button type="button" class="nav-btn" data-open-presentation title="Modo de Apresentação / Seleção de Agentes (Dossiês)">${icon('presentation',18)}</button><button type="button" class="nav-btn btn-nav-roll-log" data-open-roll-log title="Histórico de rolagens (H)">${icon('history',18)}<span class="roll-log-badge ${rollLog.length?'visible':''}" id="nav-roll-badge">${rollLog.length||''}</span></button><div class="nav-separator"></div><div class="sheet-switcher">${sheets.map(sheet=>`<button class="sheet-avatar ${sheet.id===state.id?'active':''}" data-sheet-id="${sheet.id}" draggable="true" title="${safe(sheet.name)}">${sheet.tokenImage?`<img src="${safeUrl(sheet.tokenImage)}" alt="${safe(sheet.name)}">`:safe((sheet.name||'?').slice(0,1).toUpperCase())}</button>`).join('')}<button class="nav-btn dashed" data-new-sheet title="Adicionar ficha">${icon('plus')}</button></div><span class="nav-spacer"></span><button class="nav-btn" data-export-cinematic-image title="Exportar imagem da ficha cinematográfica (PNG HD)">${icon('camera')}</button><button class="nav-btn" data-export-json title="Exportar ficha em JSON">${icon('download')}</button><button class="nav-btn" data-import-json title="Importar ficha em JSON">${icon('upload')}</button><input type="file" id="json-file-input" accept=".json,application/json" style="display:none"><button class="nav-btn" data-save-sheet title="Salvar ficha (disco e navegador)">${icon('save')}</button><button class="nav-btn" data-critical-settings title="Configurar efeitos críticos">${icon('settings')}</button></aside>

  ${state.viewMode==='cinematic'?renderCinematic(trainingOptions,bgIsVideo):`<main class="page ${editTransitionMode?`edit-trans-${editTransitionMode}`:''} mobile-tab-${mobileTab} ${modeJustChanged?'mode-enter':''}${bgIsVideo?' has-video-bg':''}" style="--bg-blur:${state.backgroundBlur??0}px;--bg-zoom:${(state.backgroundZoom??100)/100};">${renderBackgroundLayer(bgIsVideo,false)}<aside class="character-side">
  <section class="character-card ${state.tokenImage?'has-token':''}"><div class="silhouette" ${state.tokenImage?`style="background-image:url('${safeUrl(state.tokenImage)}')"`:''}>${state.tokenImage?'':'<span></span>'}${editMode?`<label class="token-upload">${icon('image',18)} TROCAR IMAGEM<input id="token-upload" type="file" accept="image/*"></label>`:''}</div><input data-field="name" value="${safe(state.name)}" aria-label="Nome do personagem" ${editMode?'':'readonly'}></section>
  ${tornTitle('STATUS')}<section class="resources">${resourceEditor('pv','PV')}${resourceEditor('pd','PD')}</section>
  <label class="token-banner ${editMode?'editable':''}">TOKEN${editMode?'<input id="token-upload-secondary" type="file" accept="image/*">':''}</label>
  ${editMode?`<div class="visual-settings"><label>BACKGROUND<input id="background-upload" type="file" accept="image/*,video/mp4,video/webm"></label>${state.backgroundImage?'<button type="button" data-reset-background>PADRÃO</button>':''}<label class="dice-color-setting">COR DOS DADOS<input id="dice-color" type="color" value="${safe(state.diceColor||PROFILE_COLORS[state.profile])}"></label>${state.diceColor?'<button data-reset-dice-color>PERFIL</button>':''}<label class="range-setting" title="Desfoque da imagem de fundo (Duplo clique para zerar)"><span>BLUR</span><input type="range" min="0" max="30" step="1" value="${state.backgroundBlur??0}" data-cinematic-bg-blur><span class="slider-val-hint" id="val-hint-blur">${state.backgroundBlur??0}px</span></label><label class="range-setting" title="Escala / Zoom da imagem de fundo (Duplo clique para 100%)"><span>ZOOM</span><input type="range" min="30" max="250" step="5" value="${state.backgroundZoom??100}" data-cinematic-bg-zoom><span class="slider-val-hint" id="val-hint-zoom">${state.backgroundZoom??100}%</span></label>${(state.backgroundBlur>0||(state.backgroundZoom&&state.backgroundZoom!==100))?'<button type="button" data-reset-bg-effects title="Redefinir blur para 0 e zoom para 100%">RESET BG</button>':''}</div>`:''}
 </aside><section class="sheet-main"><nav class="paper-tabs"><button class="paper-tab ${currentView==='stats'?'active':''}" data-view="stats">ESTATÍSTICAS</button><button class="paper-tab ${currentView==='history'?'active':''}" data-view="history">HISTÓRIA</button></nav>
 <div id="stats-view" class="view-panel ${currentView==='stats'?'active':''}"><section class="attribute-grid">${Object.entries(state.attributes).map(([name,value])=>`<article class="attribute-card"><span>${name}</span><button class="attribute-die" data-roll="${name}|${value}">${die(value)}</button>${editMode?attributeStepper(name,value):''}</article>`).join('')}</section>
 ${tornTitle('INFORMAÇÕES DO PERSONAGEM',true)}<section class="info-grid"><label><span>OCUPAÇÃO</span><input data-field="occupation" value="${safe(state.occupation)}" ${editMode?'':'readonly'}></label><label><span>PERFIL</span>${customSelect({value:state.profile,options:['Executor','Analista','Vigilante'].map(value=>({value,label:value})),id:'profile',className:'profile-select',disabled:!editMode})}</label><label><span>NÍVEL</span><input class="center" data-field="level" value="${state.level}" inputmode="numeric" ${editMode?'':'readonly'}></label></section>
 <div class="skills-header-row">${tornTitle('PERÍCIAS')}${editMode?`<button type="button" class="btn-add-aptidao" data-add-aptidao title="Adicionar especialização de Aptidão">+ APTIDÃO</button>`:''}</div><section class="skills-table"><header><span>PERÍCIA ↕</span><span>NÍVEL DE TREINAMENTO ↕</span><span>ATRIBUTO ↕</span><span>EXTRA ↕</span></header><div class="skill-rows">${state.skills.map((skill,index)=>{const trained=skill.skillDie>4,attrDie=state.attributes[skill.attribute]||4,isAptidao=skill.name.startsWith('APTIDÃO'),aptidaoField=isAptidao?(skill.name.match(/\(([^)]+)\)/)?.[1]||'HUMANAS'):'',nameCol=editMode&&isAptidao?`<span class="skill-name skill-name-aptidao"><span>APTIDÃO</span>${customSelect({value:aptidaoField,options:aptidaoOptions,id:`aptidao-field:${index}`,className:'aptidao-select'})}<button class="skill-info-button" data-skill-info="${index}" aria-label="Informações sobre ${safe(skill.name)}">${icon('info',15)}</button>${aptidaoCount>1?`<button type="button" class="btn-remove-aptidao" data-remove-aptidao="${index}" title="Remover">${icon('trash',13)}</button>`:''}</span>`:`<span class="skill-name">${safe(skill.name)} <button class="skill-info-button" data-skill-info="${index}" aria-label="Informações sobre ${safe(skill.name)}">${icon('info',15)}</button></span>`;return `<div class="skill-row grade-d${skill.skillDie} ${trained?'trained':''}" data-roll="${safe(skill.name)}|${skill.skillDie},${attrDie}|${skill.extra||0}">${nameCol}<span class="training">${die(skill.skillDie,'small',trained)}${customSelect({value:skill.training,options:trainingOptions,id:`skill-training:${index}`,className:'skill-select training-select',disabled:!editMode})}</span><span class="attribute-ref">${die(attrDie,'small gem',trained)}${customSelect({value:skill.attribute,options:['Físico','Mente','Emoção'].map(value=>({value,label:value})),id:`skill-attribute:${index}`,className:'skill-select attribute-select',disabled:!editMode})}</span><span class="extra">${editMode?`<input data-skill-extra="${index}" type="number" value="${skill.extra||0}">`:`${Number(skill.extra)>=0?'+':''}${skill.extra||0}`}</span></div>`}).join('')}</div></section></div>
 <section id="history-view" class="view-panel ${currentView==='history'?'active':''}">${tornTitle('HISTÓRIA DO PERSONAGEM',true)}<textarea data-field="history" placeholder="Escreva aqui a história, motivações e vínculos do agente..." ${editMode?'':'readonly'}>${safe(state.history||'')}</textarea></section></section>
 <aside class="right-panel"><nav class="right-tabs"><button class="${currentRight==='items'?'active':''}" data-right="items">ITENS</button><button class="${currentRight==='abilities'?'active':''}" data-right="abilities">HABILIDADES</button></nav><div class="right-tools"><div>${icon('search',15)}<input id="filter" placeholder="Filtrar cards..."></div><button title="Filtrar">${icon('filter',17)}</button><button class="add" title="Criar card">${icon('plus',17)}<span>CRIAR CARD</span></button></div><section id="abilities" class="right-content ${currentRight==='abilities'?'active':''}">${visibleCards('abilities').map(renderResourceCard).join('')||'<p class="empty-cards">Nenhuma habilidade. Use + para criar.</p>'}</section><section id="items" class="right-content ${currentRight==='items'?'active':''}">${visibleCards('items').map(renderResourceCard).join('')||'<p class="empty-cards">Nenhum item. Use + para criar.</p>'}</section></aside></main>`}
	 ${state.viewMode==='cinematic'?renderCriticalAtmosphere():''}
	 <div class="view-mode-switch ${viewSwitchCollapsed?'collapsed':'expanded'}">${viewSwitchCollapsed?`<button type="button" class="view-mode-trigger" data-toggle-view-switch title="Alternar modo de exibição (Clique para expandir)">${state.viewMode==='cinematic'?icon('film',14):icon('grid',14)}<span>${state.viewMode==='cinematic'?'CINEMA':'PADRÃO'}</span><i class="switch-arrow">▾</i></button>`:`<button type="button" class="${state.viewMode==='traditional'?'active':''}" data-display-mode="traditional">${icon('grid',14)}<span>TRADICIONAL</span></button><button type="button" class="${state.viewMode==='cinematic'?'active':''}" data-display-mode="cinematic">${icon('film',14)}<span>CINEMATOGRÁFICO</span></button><button type="button" data-open-presentation title="Modo de Apresentação">${icon('presentation',14)}<span>APRESENTAÇÃO</span></button><button type="button" class="btn-collapse-switch" data-toggle-view-switch title="Recolher menu">${icon('chevron',12)}</button>`}</div>
 ${editMode?`<div class="edit-status active"><span></span>MODO DE EDIÇÃO — TEMA ÂMBAR</div>`:''}<div class="floating"><button class="${editMode?'active':''}" data-toggle-edit title="${editMode?'Fechar edição':'Editar ficha'}">${editMode?icon('close'):icon('edit')}</button></div><div class="save-toast" id="save-toast">SALVO</div>

 <div id="dice-stage"><canvas id="dice-canvas"></canvas><div id="dice-stage-result"></div></div>
	 <div class="modal skill-info-modal" id="skill-info-modal"><div class="backdrop skill-info-backdrop"></div><section><button class="skill-info-close">${icon('close')}</button><small>PERÍCIA</small><h2 id="skill-info-title"></h2><p id="skill-info-copy"></p><footer id="skill-info-attribute"></footer></section></div>
	 ${renderCriticalSettings()}
 <div class="modal slot-fill-modal" id="slot-fill-modal"><div class="backdrop slot-fill-backdrop"></div><section><button type="button" class="slot-fill-close">${icon('close')}</button><small id="slot-fill-subtitle">PREENCHER ESPAÇO</small><h2 id="slot-fill-title">VALOR DO DADO</h2><p id="slot-fill-info"></p><div class="slot-fill-actions"><button type="button" class="btn-slot-roll" id="btn-slot-roll-die">${icon('d20',15)} ROLAR 1d6</button><div class="slot-quick-numbers"><button type="button" data-pick-val="1">1</button><button type="button" data-pick-val="2">2</button><button type="button" data-pick-val="3">3</button><button type="button" data-pick-val="4">4</button><button type="button" data-pick-val="5">5</button><button type="button" data-pick-val="6">6</button></div><div class="slot-manual-entry"><label>OUTRO VALOR<input type="number" id="slot-manual-val" min="1" max="99" placeholder="Ex: 4"></label><button type="button" id="btn-slot-confirm-manual">CONFIRMAR</button></div></div></section></div>
 <div class="modal card-editor" id="card-editor"><div class="backdrop editor-backdrop"></div><form id="card-form"><header><div><small>EDITOR DE CARD</small><h2 id="editor-title">NOVA HABILIDADE</h2></div><button type="button" class="editor-close">${icon('close')}</button></header><div class="editor-grid"><label class="span-2">TÍTULO<input name="title" maxlength="64" required></label><label>COLEÇÃO${customSelect({value:'abilities',options:[{value:'abilities',label:'Habilidades'},{value:'items',label:'Itens'}],id:'editor-schema',formName:'schema',className:'editor-select'})}</label><label>TIPO<input name="type" placeholder="Habilidade"></label><label>ÍCONE<input name="icon" maxlength="3" placeholder="◆"></label><label>COR<input name="accent" type="color" value="#e91d25"></label><label>USAR COR${customSelect({value:'profile',options:[{value:'profile',label:'Do perfil'},{value:'custom',label:'Personalizada'}],id:'editor-color-mode',formName:'colorMode',className:'editor-select'})}</label><label>APRESENTAÇÃO${customSelect({value:'standard',options:[{value:'standard',label:'Padrão'},{value:'compact',label:'Compacto'},{value:'featured',label:'Destaque'}],id:'editor-layout',formName:'layout',className:'editor-select'})}</label><label>INICIAR${customSelect({value:'false',options:[{value:'false',label:'Expandido'},{value:'true',label:'Recolhido'}],id:'editor-collapsed',formName:'collapsed',className:'editor-select'})}</label><label class="span-2">URL DA IMAGEM<input name="imageUrl" type="url" placeholder="https://..."></label><label class="span-2 content-editor-label">CONTEÚDO<div class="rich-toolbar"><button type="button" data-format="bold"><b>B</b></button><button type="button" data-format="italic"><i>I</i></button><button type="button" data-format="underline"><u>U</u></button><span class="color-picker" title="Cor do texto"><input id="content-color" type="color" value="#67a2ff"><span>A</span></span><button type="button" data-format="color">APLICAR COR</button></div><textarea name="content" rows="5" placeholder="Descrição e regras do card..."></textarea></label>
 <section class="span-2 builder-section"><header><div><b>MARCADORES</b><small>Contador, barra, cargas ou liga/desliga. Fórmulas aceitam @{level}, @{pv} e atributos.</small></div><button type="button" data-add-marker>+ ADICIONAR</button></header><div id="marker-builder"></div></section>
  <section class="span-2 builder-section"><header><div><b>AÇÕES</b><small>Expressões como 2d6 + 1d8 + @{level}.</small></div><button type="button" data-add-action>+ ADICIONAR</button></header><div id="action-builder"></div></section></div><footer><button type="button" class="delete-card">EXCLUIR</button><span></span><button type="button" class="editor-close secondary">CANCELAR</button><button type="submit">SALVAR CARD</button></footer></form></div>
 ${renderBottomNav()}
 ${renderSheetDrawer()}
 ${renderRollLogDrawer()}
	 `;bind();syncCriticalAtmosphere();const bgVideoEl=app.querySelector('.bg-video');if(bgVideoEl&&state.backgroundImage){if(!bgVideoEl.src)bgVideoEl.src=state.backgroundImage;bgVideoEl.play().catch(()=>{})}const sheetMain=app.querySelector('.sheet-main'),rightPanel=app.querySelector('.right-panel'),cinematicRight=app.querySelector('.cinematic-scroll'),cinematicSkills=app.querySelector('.cinematic-skills>div'),sheetSwitcher=app.querySelector('.sheet-switcher');if(sheetMain)sheetMain.scrollTop=previousScroll.sheet;if(rightPanel)rightPanel.scrollTop=previousScroll.right;if(cinematicRight)cinematicRight.scrollTop=previousScroll.cinematicRight;if(cinematicSkills)cinematicSkills.scrollTop=previousScroll.cinematicSkills;if(sheetSwitcher)sheetSwitcher.scrollTop=previousScroll.sheetSwitcher;modeJustChanged=false;editTransitionMode=null}


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
 if(!showToast) return;

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

let activeContextMenuSheetId = null;
function showSheetContextMenu(e, sheetId) {
 e.preventDefault();
 e.stopPropagation();
 activeContextMenuSheetId = sheetId;
 let menu = document.querySelector('#sheet-context-menu');
 if (!menu) {
  menu = document.createElement('div');
  menu.id = 'sheet-context-menu';
  menu.className = 'custom-context-menu';
  document.body.appendChild(menu);
 }
 const target = sheets.find(s => s.id === sheetId);
 const name = target?.name || 'esta ficha';
 menu.innerHTML = `
  <div class="custom-context-menu-header">${safe(name)}</div>
  <button type="button" data-action="clone-sheet">${icon('copy', 14)} <span>Clonar ficha</span></button>
  <div class="custom-context-menu-separator"></div>
  <button type="button" data-action="delete-sheet" class="menu-danger">${icon('trash', 14)} <span>Deletar ficha</span></button>
 `;
 menu.hidden = false;
 const x = Math.min(window.innerWidth - 180, Math.max(10, e.clientX + 4));
 const y = Math.min(window.innerHeight - 110, Math.max(10, e.clientY + 4));
 menu.style.left = `${x}px`;
 menu.style.top = `${y}px`;

 menu.querySelector('[data-action="clone-sheet"]').onclick = (ev) => {
  ev.stopPropagation();
  closeSheetContextMenu();
  cloneSheet(sheetId);
 };

 menu.querySelector('[data-action="delete-sheet"]').onclick = (ev) => {
  ev.stopPropagation();
  closeSheetContextMenu();
  deleteSheet(sheetId);
 };
}

function closeSheetContextMenu() {
 const menu = document.querySelector('#sheet-context-menu');
 if (menu) menu.hidden = true;
 activeContextMenuSheetId = null;
}

function cloneSheet(sheetId) {
 const target = sheets.find(s => s.id === sheetId);
 if (!target) return;
 save(false);
 const cloned = clone(target);
 cloned.id = makeId('sheet');
 cloned.name = `${target.name || 'AGENTE'} (Cópia)`;

 if (Array.isArray(cloned.cards)) {
  cloned.cards = cloned.cards.map(card => {
   const c = clone(card);
   c.id = makeId('card');
   const markerIdMap = new Map();
   if (Array.isArray(c.markers)) {
    c.markers.forEach(m => {
     const oldId = m.id;
     m.id = makeId('marker');
     if (oldId) markerIdMap.set(oldId, m.id);
    });
   }
   if (Array.isArray(c.actions)) {
    c.actions.forEach(a => {
     a.id = makeId('action');
     if (a.targetMarker && markerIdMap.has(a.targetMarker)) {
      a.targetMarker = markerIdMap.get(a.targetMarker);
     }
    });
   }
   return c;
  });
 }

 const targetIndex = sheets.findIndex(s => s.id === sheetId);
 if (targetIndex >= 0) {
  sheets.splice(targetIndex + 1, 0, cloned);
 } else {
  sheets.push(cloned);
 }

 const doSwitch = () => {
  state = cloned;
  activeSheetId = cloned.id;
  render();
 };

 if (state.viewMode === 'cinematic') {
  triggerGlitchTransition(doSwitch);
 } else {
  doSwitch();
 }

 save(true, `FICHA CLONADA: ${cloned.name.toUpperCase()}`);
}

function deleteSheet(sheetId) {
 if (sheets.length <= 1) {
  const toast = document.querySelector('#save-toast');
  if (toast) {
   toast.textContent = 'NÃO É POSSÍVEL EXCLUIR A ÚNICA FICHA';
   toast.classList.add('show');
   setTimeout(() => toast.classList.remove('show'), 1500);
  }
  return;
 }
 const target = sheets.find(s => s.id === sheetId);
 const name = target?.name || 'esta ficha';
 if (!confirm(`Deseja realmente excluir a ficha "${name}"?`)) return;

 const wasActive = (state.id === sheetId);
 sheets = sheets.filter(s => s.id !== sheetId);
 if (wasActive) {
  state = sheets[0];
  activeSheetId = state.id;
 }
 render();
 save(true, 'FICHA EXCLUÍDA');
}

function bindSheetInteractions() {
 const avatars = document.querySelectorAll('.sheet-avatar');
 avatars.forEach(avatar => {
  avatar.oncontextmenu = (e) => showSheetContextMenu(e, avatar.dataset.sheetId);

  avatar.ondragstart = (e) => {
   e.dataTransfer.setData('text/sheet-id', avatar.dataset.sheetId);
   e.dataTransfer.effectAllowed = 'move';
   avatar.classList.add('dragging');
  };

  avatar.ondragend = () => {
   avatar.classList.remove('dragging');
   avatars.forEach(a => a.classList.remove('drag-over-top', 'drag-over-bottom'));
  };

  avatar.ondragover = (e) => {
   e.preventDefault();
   e.dataTransfer.dropEffect = 'move';
   const rect = avatar.getBoundingClientRect();
   const isTop = e.clientY < (rect.top + rect.height / 2);
   avatar.classList.toggle('drag-over-top', isTop);
   avatar.classList.toggle('drag-over-bottom', !isTop);
  };

  avatar.ondragleave = () => {
   avatar.classList.remove('drag-over-top', 'drag-over-bottom');
  };

  avatar.ondrop = (e) => {
   e.preventDefault();
   avatar.classList.remove('drag-over-top', 'drag-over-bottom');
   const fromId = e.dataTransfer.getData('text/sheet-id');
   const toId = avatar.dataset.sheetId;
   if (!fromId || !toId || fromId === toId) return;

   const fromIndex = sheets.findIndex(s => s.id === fromId);
   const toIndex = sheets.findIndex(s => s.id === toId);
   if (fromIndex < 0 || toIndex < 0) return;

   const rect = avatar.getBoundingClientRect();
   const isTop = e.clientY < (rect.top + rect.height / 2);

   const [moved] = sheets.splice(fromIndex, 1);
   let targetIndex = sheets.findIndex(s => s.id === toId);
   if (!isTop) targetIndex += 1;
   sheets.splice(targetIndex, 0, moved);
   render();
  };
 });
}
function parseRollExpression(expression){const vars=formulaVariables();let expanded=String(expression||'').replace(/@\{([^}]+)\}/g,(_,key)=>String(vars[formulaKey(key)]??0));const dice=[];expanded=expanded.replace(/(\d*)d(4|6|8|10|12|20)/gi,(_,count,sides)=>{for(let i=0;i<Math.min(12,Number(count)||1);i++)dice.push(Number(sides));return '0'});let modifier=0;try{if(/^[\d+\-*/().\s]+$/.test(expanded))modifier=Math.floor(Function(`"use strict";return (${expanded||0})`)())}catch{}return{dice,modifier}}
async function roll(name,sides,modifier=0){const list=Array.isArray(sides)?sides:String(sides).split(',').map(Number).filter(side=>DICE_STEPS.includes(side));if(!list.length)return null;const soundContext=getUiAudioContext(),{rollDice3d}=await getDiceApi(),color=state.diceColor||PROFILE_COLORS[state.profile]||PROFILE_COLORS.Executor;const res=await rollDice3d(list.map(side=>({sides:side,color})),name,Number(modifier)||0,soundContext);if(res&&Array.isArray(res.values)){addRollLogEntry({title:name,dice:res.breakdown||res.values.map((v,i)=>({sides:list[i]||20,value:v})),modifier:Number(modifier)||0,total:res.total})}return res}

async function rollExpression(name,expression){const parsed=parseRollExpression(expression);return roll(name,parsed.dice,parsed.modifier)}
function setSelectVisual(id,value){const select=document.querySelector(`[data-select-id="${id}"]`);if(!select)return;const option=[...select.querySelectorAll('.select-option')].find(item=>String(item.dataset.selectValue)===String(value));select.querySelector('.select-display').textContent=option?.dataset.triggerLabel||value;select.querySelectorAll('.select-option').forEach(item=>{item.classList.toggle('selected',item===option);item.querySelector('b').textContent=item===option?'✓':''});if(select.dataset.formName)select.previousElementSibling.value=value}
function renderCardBuilders(){const markerBuilder=document.querySelector('#marker-builder'),actionBuilder=document.querySelector('#action-builder');if(!markerBuilder||!actionBuilder)return;markerBuilder.innerHTML=editorMarkers.map((marker,index)=>`<article class="builder-row"><div class="builder-row-head"><b>MARCADOR ${index+1}</b><button type="button" data-remove-marker="${index}">${icon('trash',15)}</button></div><div class="marker-types">${[['counter','CONTADOR'],['bar','BARRA'],['pips','CARGAS'],['slots','SLOTS'],['toggle','LIGA/DESLIGA']].map(([type,label])=>`<button type="button" class="${marker.type===type?'active':''}" data-marker-type="${index}:${type}">${label}</button>`).join('')}</div>${marker.type==='pips'||marker.type==='bar'||marker.type==='slots'?`<div class="marker-display-styles"><span>ESTILO VISUAL</span><button type="button" class="${(marker.displayStyle||'default')==='default'?'active':''}" data-marker-style="${index}:default">ATUAL</button><button type="button" class="${marker.displayStyle==='rectangles'?'active':''}" data-marker-style="${index}:rectangles">RETANGULAR</button></div>`:''}<div class="builder-fields"><label>LABEL<input data-marker-field="${index}:label" value="${safe(marker.label)}"></label><label>ATUAL<input type="number" min="0" data-marker-field="${index}:current" value="${Number(marker.current)||0}"></label>${marker.type!=='toggle'?`<label>MÁXIMO / FÓRMULA<input data-marker-field="${index}:maxFormula" value="${safe(marker.maxFormula||'0')}" placeholder="@{level} + 2"></label>`:''}${marker.type==='slots'?`<label>RECURSO PREENCHER<select data-marker-field="${index}:fillCostResource"><option value="none" ${(!marker.fillCostResource||marker.fillCostResource==='none')?'selected':''}>Nenhum</option><option value="pd" ${marker.fillCostResource==='pd'?'selected':''}>PD</option><option value="pv" ${marker.fillCostResource==='pv'?'selected':''}>PV</option></select></label><label>CUSTO RECURSO<input type="number" min="0" data-marker-field="${index}:fillCostAmount" value="${Number(marker.fillCostAmount)||0}"></label>`:''}</div></article>`).join('')||'<p class="builder-empty">Nenhum marcador neste card.</p>';actionBuilder.innerHTML=editorActions.map((action,index)=>{const slotsMarkers=editorMarkers.filter(m=>m.type==='slots');return `<article class="builder-row action-row"><div class="builder-fields"><label>NOME<input data-action-field="${index}:name" value="${safe(action.name)}" placeholder="Ataque"></label><label>EXPRESSÃO<input data-action-field="${index}:expression" value="${safe(action.expression)}" placeholder="3d6"></label>${slotsMarkers.length?`<label>PREENCHER MARCADOR<select data-action-field="${index}:targetMarker"><option value="">Nenhum</option>${slotsMarkers.map((m,i)=>`<option value="${safe(m.id||`marker-${i}`)}" ${action.targetMarker===(m.id||`marker-${i}`)?'selected':''}>${safe(m.label||`Slots ${i+1}`)}</option>`).join('')}</select></label>`:''}<button type="button" data-remove-action="${index}">${icon('trash',16)}</button></div></article>`}).join('')||'<p class="builder-empty">Nenhuma ação de rolagem neste card.</p>';bindBuilderEvents()}
function bindBuilderEvents(){document.querySelectorAll('[data-marker-type]').forEach(el=>el.onclick=()=>{const[index,type]=el.dataset.markerType.split(':');editorMarkers[index].type=type;if(type==='slots'&&!editorMarkers[index].fillCostResource)editorMarkers[index].fillCostResource='pd';renderCardBuilders()});document.querySelectorAll('[data-marker-style]').forEach(el=>el.onclick=()=>{const[index,displayStyle]=el.dataset.markerStyle.split(':');editorMarkers[index].displayStyle=displayStyle;renderCardBuilders()});document.querySelectorAll('[data-remove-marker]').forEach(el=>el.onclick=()=>{editorMarkers.splice(Number(el.dataset.removeMarker),1);renderCardBuilders()});document.querySelectorAll('[data-remove-action]').forEach(el=>el.onclick=()=>{editorActions.splice(Number(el.dataset.removeAction),1);renderCardBuilders()});document.querySelectorAll('[data-marker-field]').forEach(el=>{const handler=()=>{const[index,key]=el.dataset.markerField.split(':');editorMarkers[index][key]=['current','fillCostAmount'].includes(key)?Number(el.value)||0:el.value};el.oninput=handler;el.onchange=handler});document.querySelectorAll('[data-action-field]').forEach(el=>{const handler=()=>{const[index,key]=el.dataset.actionField.split(':');editorActions[index][key]=el.value};el.oninput=handler;el.onchange=handler})}
function openCardEditor(cardId=null){const modal=document.querySelector('#card-editor'),form=document.querySelector('#card-form'),card=state.cards.find(item=>item.id===cardId);form.reset();form.dataset.cardId=cardId||'';document.querySelector('#editor-title').textContent=card?'EDITAR CARD':`NOVO ${currentRight==='items'?'ITEM':'RECURSO'}`;setSelectVisual('editor-schema',card?.schema||currentRight);setSelectVisual('editor-layout',card?.layout||'standard');setSelectVisual('editor-collapsed',String(card?.collapsed||false));setSelectVisual('editor-color-mode',card?.themeLinked===false?'custom':'profile');form.elements.title.value=card?.title||'';form.elements.type.value=card?.type||(currentRight==='items'?'Equipamento':'Habilidade');form.elements.icon.value=card?.icon||'◆';form.elements.accent.value=card?.accent||PROFILE_COLORS[state.profile]||'#e91d25';form.elements.imageUrl.value=card?.imageUrl||'';form.elements.content.value=card?.content||'';editorMarkers=clone(card?.markers||[]);editorActions=clone(card?.actions||[]);form.querySelector('.delete-card').hidden=!card;renderCardBuilders();modal.classList.remove('closing');modal.classList.add('open')}
function closeCardEditor(){const modal=document.querySelector('#card-editor');if(!modal)return;modal.classList.add('closing');setTimeout(()=>modal.classList.remove('open','closing'),160)}
function openSkillInfo(index){const skill=state.skills[index],modal=document.querySelector('#skill-info-modal'),upper=String(skill.name).toUpperCase(),info=SKILL_INFO[upper]||(upper.startsWith('APTIDÃO')?SKILL_INFO['APTIDÃO (HUMANAS)']:null)||SKILL_INFO['APTIDÃO']||['Use esta perícia em testes relacionados à sua especialidade.',skill.attribute];document.querySelector('#skill-info-title').textContent=skill.name;document.querySelector('#skill-info-copy').textContent=info[0];document.querySelector('#skill-info-attribute').textContent=`ATRIBUTO SUGERIDO · ${info[1]||skill.attribute}`;modal.classList.add('open')}
function closeSkillInfo(){document.querySelector('#skill-info-modal')?.classList.remove('open')}
let activeSlotTarget=null;
function openSlotModal(card,marker,slotIndex=0){const modal=document.querySelector('#slot-fill-modal');if(!modal)return;activeSlotTarget={card,marker,slotIndex};const costRes=(marker.fillCostResource||'pd').toLowerCase(),costAmt=Number(marker.fillCostAmount)||0,currentVal=state[costRes]??0;document.querySelector('#slot-fill-title').textContent=`ESPAÇO ${slotIndex+1} · ${marker.label||'SLOT'}`;document.querySelector('#slot-fill-info').innerHTML=costAmt>0?`Custo: <strong>${costAmt} ${costRes.toUpperCase()}</strong> (Você possui ${currentVal} ${costRes.toUpperCase()} disponíveis).`:`Preencha este espaço com o valor desejado.`;document.querySelector('#slot-manual-val').value='';modal.classList.add('open')}
function closeSlotModal(){document.querySelector('#slot-fill-modal')?.classList.remove('open');activeSlotTarget=null}
function triggerResourceShake(key){if(!key)return;playGlitchSound();const targets=document.querySelectorAll(`[data-resource-key="${key.toLowerCase()}"]`);targets.forEach(target=>{target.classList.remove('resource-glitch-shake');void target.offsetWidth;target.classList.add('resource-glitch-shake');target.addEventListener('animationend',()=>target.classList.remove('resource-glitch-shake'),{once:true});setTimeout(()=>target.classList.remove('resource-glitch-shake'),420)})}
function applySlotValue(value){if(!activeSlotTarget||value===null||value===undefined||value==='')return;const{card,marker,slotIndex}=activeSlotTarget,costRes=(marker.fillCostResource||'pd').toLowerCase(),costAmt=Number(marker.fillCostAmount)||0;let spentResource=null;if(costAmt>0){const currentVal=state[costRes]??0;if(currentVal<costAmt){const toast=document.querySelector('#save-toast');if(toast){toast.textContent=`${costRes.toUpperCase()} INSUFICIENTE (NECESSÁRIO ${costAmt})`;toast.classList.add('show');setTimeout(()=>{toast.classList.remove('show');toast.textContent='SALVO'},1800)}return}state[costRes]-=costAmt;spentResource=costRes;playResourceSound(false)}if(!Array.isArray(marker.slots))marker.slots=[];marker.slots[slotIndex]=Number(value)||value;marker.current=marker.slots.filter(v=>v!==null&&v!==undefined&&v!=='').length;closeSlotModal();save(false);render();if(spentResource)triggerResourceShake(spentResource);const toast=document.querySelector('#save-toast');if(toast){toast.textContent=costAmt>0?`-${costAmt} ${costRes.toUpperCase()} · ESPAÇO ${slotIndex+1} PREENCHIDO COM [ ${value} ]!`:`ESPAÇO ${slotIndex+1} PREENCHIDO COM [ ${value} ]!`;toast.classList.add('show');setTimeout(()=>{toast.classList.remove('show');toast.textContent='SALVO'},1800)}}
async function upscaleAndEnhanceImage(source,options={}){if(!source)return null;const{scale=2,sharpness=1.0,denoiseAlpha=true}=options;return new Promise((resolve,reject)=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{try{const origW=img.naturalWidth||img.width,origH=img.naturalHeight||img.height;const actualScale=Math.min(scale,2560/Math.max(origW,origH));const targetW=Math.max(1,Math.round(origW*actualScale)),targetH=Math.max(1,Math.round(origH*actualScale));const canvas=document.createElement('canvas');canvas.width=targetW;canvas.height=targetH;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(img,0,0,targetW,targetH);const imgData=ctx.getImageData(0,0,targetW,targetH),data=imgData.data;const w=targetW,h=targetH,total=w*h;const Y=new Float32Array(total),outY=new Float32Array(total),Cb=new Float32Array(total),Cr=new Float32Array(total);for(let i=0;i<total;i++){const idx=i*4,r=data[idx],g=data[idx+1],b=data[idx+2];Y[i]=0.299*r+0.587*g+0.114*b;Cb[i]=-0.1687*r-0.3313*g+0.5*b+128.0;Cr[i]=0.5*r-0.4187*g-0.0813*b+128.0}const strength=Math.max(0.4,Math.min(2.0,sharpness));const cFactor=1.0+1.2*strength,crossFactor=0.2*strength,diagFactor=0.1*strength;for(let y=1;y<h-1;y++){const row=y*w,rowUp=(y-1)*w,rowDown=(y+1)*w;for(let x=1;x<w-1;x++){const idx=row+x;const c=Y[idx],u=Y[rowUp+x],d=Y[rowDown+x],l=Y[idx-1],r=Y[idx+1];const ul=Y[rowUp+x-1],ur=Y[rowUp+x+1],dl=Y[rowDown+x-1],dr=Y[rowDown+x+1];let min=c<u?c:u;if(d<min)min=d;if(l<min)min=l;if(r<min)min=r;if(ul<min)min=ul;if(ur<min)min=ur;if(dl<min)min=dl;if(dr<min)min=dr;let max=c>u?c:u;if(d>max)max=d;if(l>max)max=l;if(r>max)max=r;if(ul>max)max=ul;if(ur>max)max=ur;if(dl>max)max=dl;if(dr>max)max=dr;const cross=u+d+l+r,diag=ul+ur+dl+dr;const sharp=c*cFactor-crossFactor*cross-diagFactor*diag;outY[idx]=sharp<min?min:(sharp>max?max:sharp)}}for(let i=0;i<total;i++){const idx=i*4,a=data[idx+3];if(denoiseAlpha&&a<14){data[idx]=0;data[idx+1]=0;data[idx+2]=0;data[idx+3]=0;continue}const yVal=outY[i]||Y[i],cbVal=Cb[i]-128.0,crVal=Cr[i]-128.0;const r=yVal+1.402*crVal,g=yVal-0.34414*cbVal-0.71414*crVal,b=yVal+1.772*cbVal;data[idx]=r<0?0:(r>255?255:Math.round(r));data[idx+1]=g<0?0:(g>255?255:Math.round(g));data[idx+2]=b<0?0:(b>255?255:Math.round(b))}ctx.putImageData(imgData,0,0);resolve(canvas.toDataURL('image/webp',0.96))}catch(err){reject(err)}};img.onerror=reject;img.src=source})}
function readImage(file,key,maxDimension=2048){if(!file||!file.type.startsWith('image/'))return;const reader=new FileReader();reader.onload=()=>{const image=new Image();image.onload=()=>{const maxDim=maxDimension||2048,scale=Math.min(1,maxDim/Math.max(image.width,image.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(image,0,0,canvas.width,canvas.height);state[key]=canvas.toDataURL('image/webp',.96);save(false);render()};image.src=reader.result};reader.readAsDataURL(file)}
let uiAudioContext;
function getUiAudioContext(){const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return null;uiAudioContext??=new Context();uiAudioContext.resume?.();return uiAudioContext}
function playResourceSound(increased){const context=getUiAudioContext();if(!context)return;const now=context.currentTime,oscillator=context.createOscillator(),gain=context.createGain();oscillator.type='triangle';oscillator.frequency.setValueAtTime(increased?390:310,now);oscillator.frequency.exponentialRampToValueAtTime(increased?610:190,now+.09);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.055,now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+.12);oscillator.connect(gain).connect(context.destination);oscillator.start(now);oscillator.stop(now+.13)}
function playGlitchSound(){const ctx=getUiAudioContext();if(!ctx)return;try{const now=ctx.currentTime,buf=getGlitchNoiseBuffer(ctx);const src=ctx.createBufferSource(),bpf=ctx.createBiquadFilter(),dist=ctx.createWaveShaper(),gain=ctx.createGain();bpf.type='bandpass';bpf.frequency.setValueAtTime(1800,now);bpf.frequency.exponentialRampToValueAtTime(600,now+.12);bpf.Q.setValueAtTime(0.6,now);dist.curve=getGlitchDistCurve();gain.gain.setValueAtTime(0.0001,now);gain.gain.linearRampToValueAtTime(0.38,now+.008);gain.gain.exponentialRampToValueAtTime(0.22,now+.05);gain.gain.exponentialRampToValueAtTime(0.001,now+.42);src.buffer=buf;src.connect(bpf).connect(dist).connect(gain).connect(ctx.destination);src.start(now)}catch(e){}}

let criticalHeartbeatTimer=0,criticalHeartbeatActive=false,criticalHeartbeatIntensity=0,criticalPdAudio=null;
let criticalTendrilRaf=0,criticalTendrilCanvas=null,criticalTendrilIntensity=0,criticalTendrilTargetIntensity=0,criticalTendrils=[],criticalTendrilStopTimer=0;
const reducedMotionQuery=window.matchMedia?.('(prefers-reduced-motion: reduce)');

function emitCriticalHeartbeat(){
 if(!criticalHeartbeatActive)return;
 const atmosphere=document.querySelector('[data-critical-atmosphere]');
 atmosphere?.classList.remove('heartbeat-beat');document.body.classList.remove('critical-heartbeat-beat');
 if(atmosphere){void atmosphere.offsetWidth;atmosphere.classList.add('heartbeat-beat');document.body.classList.add('critical-heartbeat-beat');setTimeout(()=>{atmosphere.classList.remove('heartbeat-beat');document.body.classList.remove('critical-heartbeat-beat')},390)}
 const context=uiAudioContext;if(!context||context.state!=='running')return;
 const now=context.currentTime,intensity=criticalHeartbeatIntensity;
 [.01,.16].forEach((delay,index)=>{
  const oscillator=context.createOscillator(),filter=context.createBiquadFilter(),gain=context.createGain(),start=now+delay;
  oscillator.type='sine';oscillator.frequency.setValueAtTime(index?58:67,start);oscillator.frequency.exponentialRampToValueAtTime(index?38:43,start+.14);
  filter.type='lowpass';filter.frequency.value=118;filter.Q.value=.75;
  gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime((index?.026:.04)+intensity*.018,start+.018);gain.gain.exponentialRampToValueAtTime(.0001,start+.24);
  oscillator.connect(filter).connect(gain).connect(context.destination);oscillator.start(start);oscillator.stop(start+.26);
 });
}
function scheduleCriticalHeartbeat(immediate=false){
 clearTimeout(criticalHeartbeatTimer);
 if(!criticalHeartbeatActive)return;
 if(immediate)emitCriticalHeartbeat();
 const delay=1180-criticalHeartbeatIntensity*330;
 criticalHeartbeatTimer=setTimeout(()=>scheduleCriticalHeartbeat(true),delay);
}
function setCriticalHeartbeat(active,intensity){
 criticalHeartbeatIntensity=Math.max(0,Math.min(1,intensity||0));
 if(!active){criticalHeartbeatActive=false;clearTimeout(criticalHeartbeatTimer);document.querySelector('[data-critical-atmosphere]')?.classList.remove('heartbeat-beat');document.body.classList.remove('critical-heartbeat-beat');return}
 if(!criticalHeartbeatActive){criticalHeartbeatActive=true;scheduleCriticalHeartbeat(true)}
}
function stopCriticalPdAudio(){
 if(!criticalPdAudio)return;
 const audio=criticalPdAudio;criticalPdAudio=null;
 try{const now=audio.context.currentTime;audio.master.gain.cancelScheduledValues(now);audio.master.gain.setValueAtTime(Math.max(.0001,audio.master.gain.value),now);audio.master.gain.exponentialRampToValueAtTime(.0001,now+.28);setTimeout(()=>audio.sources.forEach(source=>{try{source.stop()}catch{}}),320)}catch{}
}
function setCriticalPdAudio(active,intensity){
 const context=uiAudioContext;
 if(!active||!context||context.state!=='running'){stopCriticalPdAudio();return}
 const level=Math.max(0,Math.min(1,intensity||0));
 if(!criticalPdAudio){
  const master=context.createGain(),lowpass=context.createBiquadFilter(),sources=[];
  master.gain.value=.0001;lowpass.type='lowpass';lowpass.frequency.value=1450;lowpass.Q.value=.8;master.connect(lowpass).connect(context.destination);
  [[72,'sine',.72],[75.4,'triangle',.38],[930,'sine',.085]].forEach(([frequency,type,volume])=>{const oscillator=context.createOscillator(),gain=context.createGain();oscillator.type=type;oscillator.frequency.value=frequency;gain.gain.value=volume;oscillator.connect(gain).connect(master);oscillator.start();sources.push(oscillator)});
  criticalPdAudio={context,master,sources};
 }
 const now=context.currentTime,target=.0045+level*.0085;
 criticalPdAudio.master.gain.cancelScheduledValues(now);criticalPdAudio.master.gain.setTargetAtTime(target,now,.22);
}

function stopCriticalTendrils(){
 clearTimeout(criticalTendrilStopTimer);criticalTendrilStopTimer=0;
 cancelAnimationFrame(criticalTendrilRaf);criticalTendrilRaf=0;
 if(criticalTendrilCanvas){const context=criticalTendrilCanvas.getContext('2d');context?.clearRect(0,0,criticalTendrilCanvas.width,criticalTendrilCanvas.height)}
 document.querySelector('[data-critical-atmosphere]')?.classList.remove('critical-pd-retracting');
 criticalTendrilCanvas=null;criticalTendrilIntensity=0;criticalTendrilTargetIntensity=0;criticalTendrils=[];
}
function retractCriticalTendrils(){
 if(!criticalTendrilCanvas)return;
 if(reducedMotionQuery?.matches){stopCriticalTendrils();return}
 if(criticalTendrilStopTimer)return;
 criticalTendrilTargetIntensity=0;criticalTendrils.forEach(tendril=>tendril.targetPresence=0);
 document.querySelector('[data-critical-atmosphere]')?.classList.add('critical-pd-retracting');
 criticalTendrilStopTimer=setTimeout(()=>{criticalTendrilStopTimer=0;if(criticalTendrilTargetIntensity<=0)stopCriticalTendrils()},1100);
}
function layoutCriticalTendril(tendril,width,height){const short=Math.min(width,height),depth=tendril.originDepth||30;if(tendril.side===0){tendril.x=-depth;tendril.y=tendril.position*height}else if(tendril.side===1){tendril.x=width+depth;tendril.y=tendril.position*height}else if(tendril.side===2){tendril.x=tendril.position*width;tendril.y=-depth}else{tendril.x=tendril.position*width;tendril.y=height+depth}const baseAngles=[0,Math.PI,Math.PI/2,-Math.PI/2],angle=baseAngles[tendril.side]+tendril.angleOffset;tendril.dx=Math.cos(angle);tendril.dy=Math.sin(angle);tendril.px=-tendril.dy;tendril.py=tendril.dx;tendril.length=short*tendril.lengthRatio;tendril.amplitude=short*tendril.amplitudeRatio;tendril.baseWidth=short*tendril.widthRatio;return tendril}
function createCriticalTendril(width,height,index){
 const counts=[0,0,0,0];criticalTendrils.filter(t=>t.targetPresence>0).forEach(t=>counts[t.side]++);const weights=counts.map(count=>1/Math.pow(count+1,1.65)),total=weights.reduce((sum,value)=>sum+value,0);let pick=Math.random()*total,side=0;for(;side<3;side++){pick-=weights[side];if(pick<=0)break}const position=.025+Math.random()*.95,r1=Math.random(),r2=Math.random(),r3=Math.random(),r4=Math.random(),tendril={side,position,originDepth:22+Math.random()*34,angleOffset:(Math.random()-.5)*1.28,curveBias:(Math.random()-.5)*.31,kinkPhase:Math.random()*Math.PI*2,kinkStrength:.035+Math.random()*.075,lengthRatio:.36+r2*.42,amplitudeRatio:.026+.06*r3,widthRatio:.032+.055*r4,frequency:.95+r2*2.35,phase:r1*Math.PI*2,speed:.00026+r3*.0004,branches:r4>.68?2:(r4>.24?1:0),shade:Math.floor(Math.random()*3),presence:0,targetPresence:1};return layoutCriticalTendril(tendril,width,height)
}
function reconcileCriticalTendrils(width,height,intensity){
 const desired=Math.round(8+Math.max(0,Math.min(1,intensity))*20),active=criticalTendrils.filter(t=>t.targetPresence>0);
 if(active.length<desired){let missing=desired-active.length;while(missing-->0)criticalTendrils.push(createCriticalTendril(width,height,criticalTendrils.length))}
 else if(active.length>desired)active.slice(desired).reverse().forEach(tendril=>tendril.targetPresence=0);
 criticalTendrils.forEach(tendril=>layoutCriticalTendril(tendril,width,height));
}
function makeCriticalTendrils(width,height,intensity){criticalTendrils=[];reconcileCriticalTendrils(width,height,intensity);return criticalTendrils
}
function traceOrganicRibbon(context,points,baseWidth,phase,time){
 const left=[],right=[],last=points.length-1,snap=value=>Math.round(value/2.5)*2.5;
 points.forEach((point,index)=>{const previous=points[Math.max(0,index-1)],next=points[Math.min(last,index+1)],vx=next.x-previous.x,vy=next.y-previous.y,length=Math.hypot(vx,vy)||1,nx=-vy/length,ny=vx/length,progress=index/last,taper=Math.pow(Math.max(0,1-progress),.72),breath=.9+.1*Math.sin(time*.001+phase+progress*4.7),notch=index%4===0?.84:(index%3===0?1.1:1),width=Math.max(.45,baseWidth*taper*breath*notch);left.push({x:snap(point.x+nx*width),y:snap(point.y+ny*width)});right.push({x:snap(point.x-nx*width),y:snap(point.y-ny*width)})});
 context.beginPath();context.moveTo(left[0].x,left[0].y);left.slice(1).forEach(point=>context.lineTo(point.x,point.y));right.reverse().forEach(point=>context.lineTo(point.x,point.y));context.closePath();
}
function drawCriticalTendrils(canvas,time=0){
 const context=canvas.getContext('2d'),width=canvas.clientWidth,height=canvas.clientHeight,dpr=Math.min(2,window.devicePixelRatio||1);if(!context||!width||!height)return;
 if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);context.setTransform(dpr,0,0,dpr,0,0);if(criticalTendrilStopTimer)criticalTendrils.forEach(tendril=>layoutCriticalTendril(tendril,width,height));else reconcileCriticalTendrils(width,height,criticalTendrilTargetIntensity)}else context.setTransform(dpr,0,0,dpr,0,0);
 context.clearRect(0,0,width,height);context.globalCompositeOperation='source-over';
 criticalTendrils.forEach(tendril=>{
  const presenceEase=tendril.targetPresence>0?.075:.11;tendril.presence+=(tendril.targetPresence-tendril.presence)*presenceEase;if(Math.abs(tendril.targetPresence-tendril.presence)<.002)tendril.presence=tendril.targetPresence;const reveal=tendril.presence;if(reveal<=.002)return;context.save();context.globalAlpha=Math.pow(reveal,.8);
  const points=[],growth=.04+reveal*.96+.055*Math.sin(time*.00031+tendril.phase)*reveal,renderLength=tendril.length,renderWidth=tendril.baseWidth*(.18+reveal*.82);
  for(let step=0;step<=22;step++){const progress=step/22,taper=Math.sin(progress*Math.PI),wave=Math.sin(progress*tendril.frequency*Math.PI+tendril.phase+time*tendril.speed)*tendril.amplitude*taper,slowSway=Math.sin(time*tendril.speed*.43+tendril.phase*.7)*tendril.amplitude*.42*progress,tipCurl=Math.sin(progress*Math.PI*.76+tendril.phase*.4-time*tendril.speed*.22)*tendril.amplitude*.5*progress*progress,curve=tendril.curveBias*renderLength*Math.pow(progress,1.45),kink=Math.sin(progress*Math.PI*3+tendril.kinkPhase)*renderLength*tendril.kinkStrength*taper,forwardKink=Math.cos(progress*Math.PI*2.4+tendril.kinkPhase)*tendril.amplitude*.22*taper,lateral=(wave+slowSway+tipCurl)*reveal+curve+kink;points.push({x:tendril.x+tendril.dx*(renderLength*growth*progress+forwardKink)+tendril.px*lateral,y:tendril.y+tendril.dy*(renderLength*growth*progress+forwardKink)+tendril.py*lateral})}
  const tip=points.at(-1),body=context.createLinearGradient(tendril.x,tendril.y,tip.x,tip.y),palette=tendril.shade===0?['#030106','#1a071f','#2a0b31']:tendril.shade===1?['#050108','#26082d','#16031c']:['#08010b','#310a35','#200625'];body.addColorStop(0,palette[0]);body.addColorStop(.64,palette[1]);body.addColorStop(1,palette[2]);
  traceOrganicRibbon(context,points,renderWidth,tendril.phase,time);context.fillStyle=body;context.shadowColor='rgba(8,0,15,.96)';context.shadowBlur=13+criticalTendrilIntensity*15;context.fill();context.shadowBlur=0;context.strokeStyle='rgba(91,27,99,.58)';context.lineJoin='miter';context.lineWidth=1.2+criticalTendrilIntensity*.9;context.stroke();
  context.globalAlpha*=.38;context.strokeStyle='rgba(137,67,150,.58)';context.lineWidth=Math.max(1,renderWidth*.055);context.lineCap='square';context.beginPath();context.moveTo(points[1].x,points[1].y);for(let index=2;index<points.length;index++)context.lineTo(points[index].x,points[index].y);context.stroke();
  for(let branch=0;branch<tendril.branches;branch++){const branchReveal=Math.max(0,Math.min(1,reveal*1.35-branch*.28));if(branchReveal<=.02)continue;const at=10+branch*7,origin=points[Math.min(at,points.length-4)],next=points[Math.min(at+2,points.length-2)],vx=next.x-origin.x,vy=next.y-origin.y,vlen=Math.hypot(vx,vy)||1,direction=branch%2?1:-1,nx=-vy/vlen*direction,ny=vx/vlen*direction,branchLength=renderLength*(.16+branch*.055)*branchReveal,branchPoints=[];for(let step=0;step<=17;step++){const progress=step/17,curl=Math.sin(progress*Math.PI*1.3+tendril.phase+time*tendril.speed*.8)*tendril.amplitude*.18*Math.sin(progress*Math.PI);branchPoints.push({x:origin.x+(vx/vlen*.34+nx*.94)*branchLength*progress+(-ny)*curl,y:origin.y+(vy/vlen*.34+ny*.94)*branchLength*progress+nx*curl})}traceOrganicRibbon(context,branchPoints,renderWidth*(.38-branch*.07),tendril.phase+branch,time);context.fillStyle=body;context.fill();context.strokeStyle='rgba(77,30,96,.48)';context.lineWidth=1;context.stroke()}
  context.restore();
 });
 criticalTendrils=criticalTendrils.filter(tendril=>tendril.targetPresence>0||tendril.presence>.002);
 context.globalAlpha=1;context.shadowBlur=0;
}
function startCriticalTendrils(canvas,intensity){
 const nextIntensity=Math.max(0,Math.min(1,intensity||0));
 clearTimeout(criticalTendrilStopTimer);criticalTendrilStopTimer=0;document.querySelector('[data-critical-atmosphere]')?.classList.remove('critical-pd-retracting');
 const dpr=Math.min(2,window.devicePixelRatio||1),sameSize=canvas.width===Math.round(canvas.clientWidth*dpr)&&canvas.height===Math.round(canvas.clientHeight*dpr);
 if(criticalTendrilCanvas===canvas){criticalTendrilTargetIntensity=nextIntensity;reconcileCriticalTendrils(canvas.clientWidth,canvas.clientHeight,nextIntensity);if(criticalTendrilRaf||reducedMotionQuery?.matches){if(reducedMotionQuery?.matches){criticalTendrilIntensity=nextIntensity;criticalTendrils.forEach(t=>t.presence=t.targetPresence);drawCriticalTendrils(canvas,0)}return}}
 else{stopCriticalTendrils();criticalTendrilCanvas=canvas;criticalTendrilIntensity=Math.min(.02,nextIntensity);criticalTendrilTargetIntensity=nextIntensity;criticalTendrils=makeCriticalTendrils(canvas.clientWidth,canvas.clientHeight,nextIntensity)}
 let lastFrame=0;const animate=time=>{if(criticalTendrilCanvas!==canvas)return;criticalTendrilIntensity+=(criticalTendrilTargetIntensity-criticalTendrilIntensity)*.055;if(Math.abs(criticalTendrilTargetIntensity-criticalTendrilIntensity)<.001)criticalTendrilIntensity=criticalTendrilTargetIntensity;if(time-lastFrame>24){try{drawCriticalTendrils(canvas,time)}catch(error){console.error('Erro ao desenhar efeito crítico de PD:',error)}lastFrame=time}criticalTendrilRaf=requestAnimationFrame(animate)};
 if(reducedMotionQuery?.matches){criticalTendrilIntensity=nextIntensity;criticalTendrils.forEach(t=>t.presence=t.targetPresence);drawCriticalTendrils(canvas,0)}else criticalTendrilRaf=requestAnimationFrame(animate);
}
function syncCriticalAtmosphere(){
 const critical=getCriticalState(),cinematic=state.viewMode==='cinematic',visible=!document.hidden;
 document.body.style.setProperty('--pv-warning-strength',(.18+critical.pv.warningIntensity*.35).toFixed(3));document.body.style.setProperty('--pd-warning-strength',(.18+critical.pd.warningIntensity*.35).toFixed(3));
 document.body.classList.toggle('warning-pv-state',critical.pv.warning);document.body.classList.toggle('warning-pd-state',critical.pd.warning);document.body.classList.toggle('critical-pv-state',critical.pv.special);document.body.classList.toggle('critical-pd-state',critical.pd.special);document.body.classList.toggle('critical-pd-effects',cinematic&&criticalEffects.pd&&critical.pd.special);document.body.classList.toggle('critical-pv-zero',critical.pv.special&&critical.pv.value===0);document.body.classList.toggle('critical-pd-zero',critical.pd.special&&critical.pd.value===0);
 const atmosphere=document.querySelector('[data-critical-atmosphere]');
 if(atmosphere){const pvAtmosphere=criticalEffects.pv&&critical.pv.vignette,pdAtmosphere=criticalEffects.pd&&critical.pd.vignette,pvSpecial=criticalEffects.pv&&critical.pv.special,pdSpecial=criticalEffects.pd&&critical.pd.special;atmosphere.classList.toggle('critical-pv',pvAtmosphere);atmosphere.classList.toggle('critical-pd',pdAtmosphere);atmosphere.classList.toggle('critical-pv-special',pvSpecial);atmosphere.classList.toggle('critical-pd-special',pdSpecial);atmosphere.classList.toggle('critical-combined',pvAtmosphere&&pdAtmosphere);atmosphere.style.setProperty('--pv-vignette-rest',(.1+critical.pv.vignetteIntensity*.6).toFixed(3));atmosphere.style.setProperty('--pv-vignette-peak',(.28+critical.pv.specialIntensity*.65).toFixed(3));atmosphere.style.setProperty('--pv-vignette-echo',(.2+critical.pv.specialIntensity*.54).toFixed(3));atmosphere.style.setProperty('--pd-vignette-opacity',(.11+critical.pd.vignetteIntensity*.57).toFixed(3));if(pdSpecial)atmosphere.style.setProperty('--pd-tendril-opacity',(.06+critical.pd.specialIntensity*.9).toFixed(3));atmosphere.style.setProperty('--pd-distortion-opacity',(.04+critical.pd.specialIntensity*.25).toFixed(3));atmosphere.style.setProperty('--pd-darkness-opacity',(.06+critical.pd.vignetteIntensity*.42).toFixed(3));const canvas=atmosphere.querySelector('[data-critical-tendrils]');if(pdSpecial&&canvas)startCriticalTendrils(canvas,critical.pd.specialIntensity);else if(criticalTendrilCanvas===canvas)retractCriticalTendrils();else stopCriticalTendrils()}else stopCriticalTendrils();
 const audioActive=cinematic&&visible;setCriticalHeartbeat(audioActive&&criticalEffects.pv&&critical.pv.special,critical.pv.specialIntensity);setCriticalPdAudio(audioActive&&criticalEffects.pd&&critical.pd.special,critical.pd.specialIntensity);
}
let _glitchActive=false;
function triggerGlitchTransition(callback){document.querySelectorAll('.cinematic-ghost-exit').forEach(el=>el.remove());_glitchActive=true;playGlitchSound();const oldContents=document.querySelector('.cinematic-contents');let oldClone=null;if(oldContents){oldClone=oldContents.cloneNode(true);oldClone.className='cinematic-contents cinematic-ghost-exit';const oldScrollables=oldContents.querySelectorAll('.cinematic-scroll, .cinematic-skills>div');const cloneScrollables=oldClone.querySelectorAll('.cinematic-scroll, .cinematic-skills>div');oldScrollables.forEach((el,i)=>{if(cloneScrollables[i])cloneScrollables[i].scrollTop=el.scrollTop});oldClone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));oldClone.querySelectorAll('[data-cinematic-token]').forEach(el=>el.removeAttribute('data-cinematic-token'));oldClone.querySelectorAll('input,button,select,textarea').forEach(el=>el.disabled=true)}try{callback()}catch(err){console.error('Glitch transition callback error:',err)}const page=document.querySelector('.cinematic-page'),newContents=document.querySelector('.cinematic-contents');if(page&&oldClone){page.appendChild(oldClone);setTimeout(()=>{oldClone.remove()},240)}if(newContents){newContents.classList.add('glitch-enter');const done=()=>{newContents.classList.remove('glitch-enter');_glitchActive=false};newContents.addEventListener('animationend',done,{once:true});setTimeout(()=>{newContents.classList.remove('glitch-enter');_glitchActive=false},420)}else{_glitchActive=false}}

function applyTextFormat(type){const textarea=document.querySelector('#card-form textarea[name="content"]');if(!textarea)return;const start=textarea.selectionStart,end=textarea.selectionEnd,selected=textarea.value.slice(start,end)||'texto';let before='',after='';if(type==='bold'){before='**';after='**'}if(type==='italic'){before='*';after='*'}if(type==='underline'){before='[u]';after='[/u]'}if(type==='color'){before=`[color=${document.querySelector('#content-color').value}]`;after='[/color]'}textarea.setRangeText(`${before}${selected}${after}`,start,end,'select');textarea.focus()}
const tokenAlphaProfileCache=new Map();
function getTokenAlphaProfile(token){if(!token)return null;const key=token.currentSrc||token.src||token.getAttribute('src');if(key&&tokenAlphaProfileCache.has(key))return tokenAlphaProfileCache.get(key);if(!token.complete||!token.naturalWidth)return null;try{const scale=Math.min(1,180/Math.max(token.naturalWidth,token.naturalHeight)),width=Math.max(1,Math.round(token.naturalWidth*scale)),height=Math.max(1,Math.round(token.naturalHeight*scale)),canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(token,0,0,width,height);const pixels=context.getImageData(0,0,width,height).data,rows=Array.from({length:height},()=>[width,-1]);let globalMin=width,globalMax=-1;for(let y=0;y<height;y++){const rowOffset=y*width*4,rowEntry=rows[y];for(let x=0;x<width;x++){if(pixels[rowOffset+x*4+3]>22){if(x<rowEntry[0])rowEntry[0]=x;if(x>rowEntry[1])rowEntry[1]=x;if(x<globalMin)globalMin=x;if(x>globalMax)globalMax=x}}}const profile={width,height,rows,globalMin:globalMax>=0?globalMin:0,globalMax:globalMax>=0?globalMax:width};if(key)tokenAlphaProfileCache.set(key,profile);return profile}catch{return null}}
function tokenRangeAtY(profile,tokenRect,pageY){if(!profile)return null;const naturalY=(pageY-tokenRect.top)/tokenRect.height*profile.height,band=Math.max(2,Math.ceil(24/tokenRect.height*profile.height));if(naturalY<-band||naturalY>profile.height+band)return null;let min=profile.width,max=-1;const startY=Math.max(0,Math.floor(naturalY-band)),endY=Math.min(profile.height-1,Math.ceil(naturalY+band));for(let y=startY;y<=endY;y++){const r=profile.rows[y];if(r[0]<min)min=r[0];if(r[1]>max)max=r[1]}return max<0?null:{left:tokenRect.left+min/profile.width*tokenRect.width,right:tokenRect.left+(max+1)/profile.width*tokenRect.width}}
let cinematicLineMaskRaf=0;
function syncCinematicLineMask(){const page=document.querySelector('.cinematic-page'),frame=document.querySelector('.cinematic-frame'),token=document.querySelector('[data-cinematic-token]'),rightPanel=document.querySelector('.cinematic-right');if(!frame||!page)return;if(!token){frame.querySelectorAll('.cinematic-frame-line').forEach(line=>line.classList.remove('masked'));currentResourceShift=120;page.style.setProperty('--resource-shift','120px');return}if(cinematicLineMaskRaf)cancelAnimationFrame(cinematicLineMaskRaf);cinematicLineMaskRaf=requestAnimationFrame(()=>{cinematicLineMaskRaf=0;const frameRect=frame.getBoundingClientRect(),tokenRect=token.getBoundingClientRect();if(!tokenRect.width||!tokenRect.height)return;const profile=getTokenAlphaProfile(token);const lines=Array.from(frame.querySelectorAll('.cinematic-frame-line'));const lineTops=lines.map(line=>line.getBoundingClientRect().top);const rightRect=rightPanel?rightPanel.getBoundingClientRect():null;lines.forEach((line,i)=>{const lineY=lineTops[i],range=tokenRangeAtY(profile,tokenRect,lineY);if(!range){line.classList.remove('masked');return}const buffer=22,left=Math.max(0,range.left-frameRect.left-buffer),right=Math.min(frameRect.width,range.right-frameRect.left+buffer);line.style.setProperty('--line-cut-left',`${left}px`);line.style.setProperty('--line-cut-right',`${right}px`);line.classList.add('masked')});if(rightRect){const visibleRight=profile?tokenRect.left+(profile.globalMax+1)/profile.width*tokenRect.width:tokenRect.right,shift=Math.max(0,Math.min(150,rightRect.left-visibleRight-24));currentResourceShift=shift;page.style.setProperty('--resource-shift',`${shift}px`)}})}
function bindCinematicToken(){syncTokenOutlineFilter();const area=document.querySelector('[data-cinematic-character]'),token=document.querySelector('[data-cinematic-token]'),scale=document.querySelector('[data-cinematic-scale]');if(token){token.addEventListener('load',syncCinematicLineMask,{once:true});syncCinematicLineMask()}if(scale)scale.oninput=()=>{state.cinematicTokenScale=Number(scale.value);if(token)token.style.setProperty('--token-scale',state.cinematicTokenScale/100);syncCinematicLineMask()};if(scale)scale.onchange=()=>save(false);document.querySelectorAll('[data-outline-side]').forEach(btn=>{btn.onclick=()=>{state.cinematicOutlineSide=btn.dataset.outlineSide;document.querySelectorAll('[data-outline-side]').forEach(b=>b.classList.toggle('active',b===btn));syncTokenOutlineFilter();save(false)}});const outlineIntensity=document.querySelector('[data-cinematic-outline-intensity]');if(outlineIntensity){outlineIntensity.oninput=()=>{state.cinematicOutlineIntensity=Number(outlineIntensity.value)/100;syncTokenOutlineFilter()};outlineIntensity.onchange=()=>save(false)}const outlineWidth=document.querySelector('[data-cinematic-outline-width]');if(outlineWidth){outlineWidth.oninput=()=>{state.cinematicOutlineWidth=Number(outlineWidth.value);syncTokenOutlineFilter()};outlineWidth.onchange=()=>save(false)}const outlineFade=document.querySelector('[data-cinematic-outline-fade]');if(outlineFade){outlineFade.oninput=()=>{state.cinematicOutlineFade=Number(outlineFade.value);syncTokenOutlineFilter()};outlineFade.onchange=()=>save(false)}const btnUpscale=document.querySelector('[data-upscale-token]');if(btnUpscale){btnUpscale.onclick=async()=>{if(!state.tokenImage)return;const orig=btnUpscale.innerHTML;btnUpscale.disabled=true;btnUpscale.innerHTML=`${icon('sparkles',14)} PROCESSANDO...`;try{const enhanced=await upscaleAndEnhanceImage(state.tokenImage,{scale:2,sharpness:1.1});if(enhanced){state.tokenImage=enhanced;save(false);render();const toast=document.querySelector('#save-toast');if(toast){toast.textContent='TOKEN EM ALTA DEFINIÇÃO (2X HD)!';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1500)}}}catch(e){console.error(e);alert('Erro ao processar upscaling.')}finally{if(btnUpscale){btnUpscale.disabled=false;btnUpscale.innerHTML=orig}}}}document.querySelector('[data-reset-cinematic-token]')?.addEventListener('click',()=>{state.cinematicTokenX=50;state.cinematicTokenY=52;state.cinematicTokenScale=100;save();render()});if(!editMode||!area||!token)return;token.onpointerdown=event=>{event.preventDefault();const rect=area.getBoundingClientRect(),startX=event.clientX,startY=event.clientY,originX=state.cinematicTokenX,originY=state.cinematicTokenY;token.setPointerCapture(event.pointerId);token.classList.add('dragging');token.onpointermove=move=>{state.cinematicTokenX=Math.max(0,Math.min(100,originX+(move.clientX-startX)/rect.width*100));state.cinematicTokenY=Math.max(0,Math.min(100,originY+(move.clientY-startY)/rect.height*100));token.style.left=`${state.cinematicTokenX}%`;token.style.top=`${state.cinematicTokenY}%`;syncCinematicLineMask()};token.onpointerup=()=>{token.classList.remove('dragging');token.onpointermove=null;syncCinematicLineMask();save(false)}}}
function updateResourceUi(key){const current=state[key],temp=state[`${key}Temp`]||0,isPv=key.toLowerCase()==='pv',cinDiv=document.querySelectorAll('.cinematic-resources>div')[isPv?0:1],tempBadge=temp?`<button type="button" class="temp-badge-btn" data-consume-temp="${key}:1" title="Clique para extinguir 1 ${key.toUpperCase()} temporário (Botão direito para extinguir todos)"><em>+${temp}</em></button>`:'';if(cinDiv){const b=cinDiv.querySelector('b');if(b)b.innerHTML=`${current}${tempBadge}`;const pips=cinDiv.querySelectorAll('.pip:not(.temporary)');pips.forEach((pip,i)=>pip.classList.toggle('filled',i<current))}document.querySelectorAll(`.resource-row [data-set-resource^="${key}:"]`).forEach(pip=>{const val=Number(pip.dataset.setResource.split(':')[1]);pip.classList.toggle('filled',val<=current)});document.querySelectorAll('.resource-row').forEach(row=>{if(row.querySelector(`[data-set-resource^="${key}:"]`)){const b=row.querySelector('b');if(b)b.innerHTML=`${current}${tempBadge}`}});syncCriticalAtmosphere()}
function updateMarkerUi(cardId,markerId){const card=state.cards.find(c=>c.id===cardId),marker=card?.markers.find(m=>m.id===markerId);if(!marker)return;const max=markerMax(marker),current=Math.min(Number(marker.current)||0,max||999),id=`${cardId}:${markerId}`;document.querySelectorAll(`[data-card-marker^="${id}:"],[data-card-marker-set^="${id}:"]`).forEach(el=>{const container=el.closest('.card-marker');if(!container)return;const toggle=container.querySelector('.toggle-switch');if(toggle){toggle.classList.toggle('on',!!current);toggle.innerHTML=`<i></i>${current?'LIGADO':'DESLIGADO'}`}const track=container.querySelector('.progress-track i');if(track)track.style.width=`${max?current/max*100:0}%`;const charges=container.querySelectorAll('.charge');charges.forEach((btn,i)=>btn.classList.toggle('on',i<current));const strong=container.querySelector('strong');if(strong){if(container.classList.contains('marker-bar')||container.classList.contains('marker-pips')){strong.textContent=`${current}/${max}`}else if(!container.classList.contains('marker-toggle')){strong.textContent=`${current}${max?`/${max}`:''}`}}})}
let isExportingCinematicImage=false;
async function exportCinematicImage(){
 if(isExportingCinematicImage)return;
 isExportingCinematicImage=true;
 const toast=document.querySelector('#save-toast');
 const showToastMsg=(msg,duration=2200)=>{
  if(toast){toast.textContent=msg;toast.classList.add('show');setTimeout(()=>{toast.classList.remove('show');toast.textContent='SALVO'},duration)}
 };
 showToastMsg('RENDERIZANDO IMAGEM HD...',4500);
 const prevViewMode=state.viewMode,prevEditMode=editMode;
 let switched=false;
 try{
  if(state.viewMode!=='cinematic'){state.viewMode='cinematic';switched=true}
  if(editMode){editMode=false;switched=true}
  if(switched){render();await new Promise(r=>setTimeout(r,120))}
  const cinematicPage=document.querySelector('.cinematic-page');
  if(!cinematicPage){showToastMsg('ERRO: FICHA NÃO ENCONTRADA',2200);return}
  document.body.classList.add('exporting-cinematic');
  cinematicPage.classList.add('is-exporting');
  const svgDefs=document.querySelector('#token-svg-defs');
  let clonedDefs=null;
  if(svgDefs){
   clonedDefs=svgDefs.cloneNode(true);
   clonedDefs.id='token-svg-defs-capture';
   cinematicPage.appendChild(clonedDefs);
  }
  const videoEl=cinematicPage.querySelector('.bg-video');
  let videoCanvas=null;
  if(videoEl&&videoEl.videoWidth>0){
   try{
    videoCanvas=document.createElement('canvas');
    videoCanvas.width=videoEl.videoWidth;
    videoCanvas.height=videoEl.videoHeight;
    videoCanvas.className='bg-video bg-video-snapshot';
    const vCtx=videoCanvas.getContext('2d');
    vCtx.drawImage(videoEl,0,0,videoCanvas.width,videoCanvas.height);
    videoEl.style.display='none';
    videoEl.parentNode.insertBefore(videoCanvas,videoEl);
   }catch(e){console.warn('Snapshot video bg error:',e)}
  }
  const {toPng}=await import('html-to-image');
  const filter=(node)=>{
   if(node.nodeType!==1)return true;
   const cl=node.classList;
   if(!cl)return true;
   return !(
    cl.contains('cinematic-agent-bar')||
    cl.contains('btn-export-image-cinematic')||
    cl.contains('floating')||
    cl.contains('view-mode-switch')||
    cl.contains('edit-status')||
    cl.contains('mobile-bottom-nav')||
    cl.contains('sheet-drawer')||
    cl.contains('sheet-drawer-backdrop')||
    cl.contains('roll-log-drawer')||
    cl.contains('roll-log-backdrop')||
    cl.contains('save-toast')||
    cl.contains('rotate-prompt')||
    cl.contains('cinematic-token-tools')||
    cl.contains('cinematic-card-edit')||
    cl.contains('cinematic-section-add')||
    cl.contains('cinematic-add-aptidao')||
    cl.contains('btn-remove-aptidao')||
    cl.contains('skill-info-button')
   );
  };
  await new Promise(r=>setTimeout(r,80));
  const dataUrl=await toPng(cinematicPage,{
   pixelRatio:2,
   quality:0.98,
   filter,
   style:{margin:'0',marginLeft:'0'}
  });
  const cleanName=(state.name||'Agente').trim().replace(/[/\\?%*:|"<>]/g,'-');
  const filename=`${cleanName} - Ficha Cinematográfica.png`;
  const link=document.createElement('a');
  link.href=dataUrl;
  link.download=filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToastMsg('FOTO HD EXPORTADA COM SUCESSO!',2500);
 }catch(error){
  console.error('Erro ao exportar imagem:',error);
  showToastMsg('ERRO AO EXPORTAR IMAGEM',2500);
 }finally{
  const cinematicPage=document.querySelector('.cinematic-page');
  if(cinematicPage){
   cinematicPage.classList.remove('is-exporting');
   const clonedDefs=cinematicPage.querySelector('#token-svg-defs-capture');
   if(clonedDefs)clonedDefs.remove();
   const videoCanvas=cinematicPage.querySelector('.bg-video-snapshot');
   if(videoCanvas){
    videoCanvas.remove();
    const videoEl=cinematicPage.querySelector('.bg-video');
    if(videoEl)videoEl.style.display='';
   }
  }
  document.body.classList.remove('exporting-cinematic');
  if(state.viewMode!==prevViewMode||editMode!==prevEditMode){
   state.viewMode=prevViewMode;
   editMode=prevEditMode;
   render();
  }
  isExportingCinematicImage=false;
 }
}

function bind(){
 function notifyPresentationLocked(){const toast=document.querySelector('#save-toast');if(toast){toast.textContent='SELECIONE O PERSONAGEM PRIMEIRO';toast.classList.add('show');setTimeout(()=>{toast.classList.remove('show');toast.textContent='SALVO'},1500)}}
 document.querySelector('[data-critical-settings]')?.addEventListener('click',()=>document.querySelector('#critical-settings-modal')?.classList.add('open'));
 document.querySelectorAll('.critical-settings-close,.critical-settings-backdrop').forEach(el=>el.onclick=()=>document.querySelector('#critical-settings-modal')?.classList.remove('open'));
 document.querySelectorAll('[data-critical-effect]').forEach(button=>button.onclick=()=>{const key=button.dataset.criticalEffect;criticalEffects[key]=!criticalEffects[key];saveCriticalEffects();button.classList.toggle('active',criticalEffects[key]);button.setAttribute('aria-pressed',String(criticalEffects[key]));const label=button.querySelector('em');if(label)label.textContent=criticalEffects[key]?'ATIVO':'DESATIVADO';syncCriticalAtmosphere()});
 document.querySelectorAll('[data-field]').forEach(el=>el.onchange=e=>{if(presentationMode){notifyPresentationLocked();return;}const key=e.target.dataset.field;state[key]=key==='level'?Math.max(0,Number(e.target.value)||0):e.target.value;save(false);render()});
 document.querySelectorAll('[data-set-resource]').forEach(el=>el.onclick=()=>{if(presentationMode){notifyPresentationLocked();return;}const[key,val]=el.dataset.setResource.split(':'),previous=state[key];state[key]=state[key]===Number(val)?Number(val)-1:Number(val);if(key==='pv'||key==='pd')playResourceSound(state[key]>previous);save(false);updateResourceUi(key)});
  document.querySelectorAll('[data-consume-temp]').forEach(el=>{el.onclick=e=>{e.preventDefault();e.stopPropagation();if(presentationMode){notifyPresentationLocked();return;}const[key,valStr]=el.dataset.consumeTemp.split(':'),tempKey=`${key}Temp`,current=Number(state[tempKey])||0;if(current<=0)return;const isBadge=el.classList.contains('temp-badge-btn'),val=Number(valStr);let next;if(isBadge){next=Math.max(0,current-1)}else{next=current===val?Math.max(0,val-1):Math.max(0,val)}if(next===current)next=Math.max(0,current-1);state[tempKey]=next;playResourceSound(false);save(false);render();const toast=document.querySelector('#save-toast');if(toast){toast.textContent=next===0?`${key.toUpperCase()} TEMPORÁRIO EXTINTO`:`${key.toUpperCase()} TEMPORÁRIO: +${next}`;toast.classList.add('show');setTimeout(()=>{toast.classList.remove('show');toast.textContent='SALVO'},1500)}};el.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();if(presentationMode){notifyPresentationLocked();return;}const[key]=el.dataset.consumeTemp.split(':'),tempKey=`${key}Temp`,current=Number(state[tempKey])||0;if(current<=0)return;state[tempKey]=0;playResourceSound(false);save(false);render();const toast=document.querySelector('#save-toast');if(toast){toast.textContent=`${key.toUpperCase()} TEMPORÁRIO EXTINTO`;toast.classList.add('show');setTimeout(()=>{toast.classList.remove('show');toast.textContent='SALVO'},1500)}}});
 document.querySelectorAll('[data-resource-adjust]').forEach(el=>el.onclick=()=>{if(presentationMode){notifyPresentationLocked();return;}const[key,delta]=el.dataset.resourceAdjust.split(':');state[key]=Math.max(0,Number(state[key]||0)+Number(delta));if(key==='maxPv')state.pv=Math.min(state.pv,state[key]);if(key==='maxPd')state.pd=Math.min(state.pd,state[key]);if(key.toLowerCase().includes('pv')||key.toLowerCase().includes('pd'))playResourceSound(Number(delta)>0);save(false);render()});
 document.querySelectorAll('[data-attribute-step]').forEach(el=>el.onclick=()=>{if(presentationMode){notifyPresentationLocked();return;}const[name,delta]=el.dataset.attributeStep.split(':'),at=DICE_STEPS.indexOf(state.attributes[name]);state.attributes[name]=DICE_STEPS[Math.max(0,Math.min(DICE_STEPS.length-1,at+Number(delta)))];save(false);render()});
 document.querySelectorAll('[data-skill-extra]').forEach(el=>el.onchange=()=>{state.skills[Number(el.dataset.skillExtra)].extra=Number(el.value)||0;save(false)});
 document.querySelectorAll('[data-roll]').forEach(el=>el.onclick=e=>{if(e.target.closest('.custom-select,.extra input,[data-skill-extra],.card-actions,.skill-info-button,[data-remove-aptidao],[data-add-aptidao],.btn-remove-aptidao'))return;if(presentationMode){notifyPresentationLocked();return;}const[name,sides,bonus]=el.dataset.roll.split('|');roll(name,sides,bonus)});
  document.querySelectorAll('[data-expression]').forEach(el=>el.onclick=async()=>{if(presentationMode){notifyPresentationLocked();return;}const cardId=el.dataset.cardId,actionId=el.dataset.actionId,card=cardId?state.cards.find(c=>c.id===cardId):null,action=card?.actions?.find(a=>a.id===actionId),res=await rollExpression(el.dataset.rollTitle,el.dataset.expression);if(!res||!Array.isArray(res.values)||!card)return;const targetMarker=card.markers?.find(m=>m.id===action?.targetMarker)||card.markers?.find(m=>m.type==='slots');if(targetMarker&&targetMarker.type==='slots'){const max=markerMax(targetMarker);if(!Array.isArray(targetMarker.slots))targetMarker.slots=[];targetMarker.slots=res.values.slice(0,max);while(targetMarker.slots.length<max)targetMarker.slots.push(null);targetMarker.current=targetMarker.slots.filter(v=>v!==null&&v!==undefined&&v!=='').length;save(false);render();const toast=document.querySelector('#save-toast');if(toast){toast.textContent=`${(targetMarker.label||'Slots').toUpperCase()} PREENCHIDA COM [ ${targetMarker.slots.filter(v=>v!==null).join(', ')} ]!`;toast.classList.add('show');setTimeout(()=>{toast.classList.remove('show');toast.textContent='SALVO'},2200)}}});
  document.querySelectorAll('[data-card-marker]').forEach(el=>el.onclick=()=>{if(presentationMode){notifyPresentationLocked();return;}const[cardId,markerId,action]=el.dataset.cardMarker.split(':'),marker=state.cards.find(c=>c.id===cardId)?.markers.find(m=>m.id===markerId);if(!marker)return;const max=markerMax(marker);marker.current=action==='toggle'?(marker.current?0:1):Math.max(0,Math.min(max||999,(Number(marker.current)||0)+Number(action)));save(false);updateMarkerUi(cardId,markerId)});
  document.querySelectorAll('[data-card-marker-set]').forEach(el=>el.onclick=()=>{if(presentationMode){notifyPresentationLocked();return;}const[cardId,markerId,value]=el.dataset.cardMarkerSet.split(':'),marker=state.cards.find(c=>c.id===cardId)?.markers.find(m=>m.id===markerId);if(marker){marker.current=marker.current===Number(value)?Number(value)-1:Number(value);save(false);updateMarkerUi(cardId,markerId)}});
  document.querySelectorAll('[data-use-slot]').forEach(el=>{el.onclick=()=>{if(presentationMode){notifyPresentationLocked();return;}const[cardId,markerId,slotIdxStr]=el.dataset.useSlot.split(':'),slotIndex=Number(slotIdxStr),card=state.cards.find(c=>c.id===cardId),marker=card?.markers.find(m=>m.id===markerId);if(!card||!marker)return;if(!Array.isArray(marker.slots))marker.slots=[];const val=marker.slots[slotIndex];if(val!==null&&val!==undefined&&val!==''){marker.slots[slotIndex]=null;marker.current=marker.slots.filter(v=>v!==null&&v!==undefined&&v!=='').length;playResourceSound(false);save(false);render();const toast=document.querySelector('#save-toast');if(toast){toast.textContent=`VALOR [ ${val} ] UTILIZADO!`;toast.classList.add('show');setTimeout(()=>{toast.classList.remove('show');toast.textContent='SALVO'},1800)}}else{openSlotModal(card,marker,slotIndex)}};el.oncontextmenu=e=>{e.preventDefault();if(presentationMode){notifyPresentationLocked();return;}const[cardId,markerId,slotIdxStr]=el.dataset.useSlot.split(':'),slotIndex=Number(slotIdxStr),card=state.cards.find(c=>c.id===cardId),marker=card?.markers.find(m=>m.id===markerId);if(card&&marker)openSlotModal(card,marker,slotIndex)}});
  document.querySelectorAll('[data-fill-marker]').forEach(el=>el.onclick=()=>{if(presentationMode){notifyPresentationLocked();return;}const[cardId,markerId]=el.dataset.fillMarker.split(':'),card=state.cards.find(c=>c.id===cardId),marker=card?.markers.find(m=>m.id===markerId);if(!card||!marker)return;const max=markerMax(marker);if(!Array.isArray(marker.slots))marker.slots=[];let targetIdx=-1;for(let i=0;i<max;i++){if(marker.slots[i]===null||marker.slots[i]===undefined||marker.slots[i]===''){targetIdx=i;break}}if(targetIdx===-1)targetIdx=0;openSlotModal(card,marker,targetIdx)});
  document.querySelectorAll('.slot-fill-close,.slot-fill-backdrop').forEach(el=>el.onclick=closeSlotModal);
  document.querySelectorAll('[data-pick-val]').forEach(el=>el.onclick=()=>applySlotValue(Number(el.dataset.pickVal)));
  const btnSlotRoll=document.querySelector('#btn-slot-roll-die');if(btnSlotRoll){btnSlotRoll.onclick=async()=>{const savedTarget=activeSlotTarget;document.querySelector('#slot-fill-modal')?.classList.remove('open');const res=await roll('Preencher Espaço',[6],0);if(res&&Array.isArray(res.values)&&res.values.length>0){activeSlotTarget=savedTarget;applySlotValue(res.values[0])}else{activeSlotTarget=null}}};
  const btnConfirmManual=document.querySelector('#btn-slot-confirm-manual');if(btnConfirmManual){btnConfirmManual.onclick=()=>{const input=document.querySelector('#slot-manual-val');if(input&&input.value!=='')applySlotValue(Number(input.value)||input.value)}};
  const inputManual=document.querySelector('#slot-manual-val');if(inputManual){inputManual.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();if(inputManual.value!=='')applySlotValue(Number(inputManual.value)||inputManual.value)}}};
  document.querySelectorAll('.custom-select').forEach(select=>{const trigger=select.querySelector('.select-trigger');trigger.onclick=e=>{e.stopPropagation();document.querySelectorAll('.custom-select.open').forEach(other=>other!==select&&other.classList.remove('open'));select.classList.toggle('open');setTimeout(()=>document.addEventListener('click',()=>select.classList.remove('open'),{once:true}))};select.querySelectorAll('.select-option').forEach(option=>option.onclick=e=>{e.stopPropagation();const value=option.dataset.selectValue,id=select.dataset.selectId;setSelectVisual(id,value);select.classList.remove('open');if(id==='profile'){state.profile=value;ensureProfileAbility(state,value)}else if(id.startsWith('skill-training:')){const skill=state.skills[Number(id.split(':')[1])],entry=TRAINING.find(([label])=>label===value);skill.training=value;skill.skillDie=entry[1]}else if(id.startsWith('skill-attribute:'))state.skills[Number(id.split(':')[1])].attribute=value;else if(id.startsWith('aptidao-field:')){const idx=Number(id.split(':')[1]);if(state.skills[idx])state.skills[idx].name=`APTIDÃO (${value})`}else return;save(false);render()})});
  document.querySelectorAll('[data-add-aptidao]').forEach(el=>el.onclick=()=>{const usedFields=new Set();state.skills.forEach(s=>{if(s.name.startsWith('APTIDÃO')){const m=s.name.match(/\(([^)]+)\)/);if(m)usedFields.add(m[1].toUpperCase())}});const nextField=APTIDAO_FIELDS.find(f=>!usedFields.has(f))||'ARTES';const newSkill={name:`APTIDÃO (${nextField})`,training:'DESTREINADO',skillDie:4,attribute:'Mente',extra:0};let lastIdx=-1;state.skills.forEach((s,idx)=>{if(s.name.startsWith('APTIDÃO'))lastIdx=idx});if(lastIdx>=0)state.skills.splice(lastIdx+1,0,newSkill);else state.skills.push(newSkill);save(false);render()});
  document.querySelectorAll('[data-remove-aptidao]').forEach(el=>el.onclick=e=>{e.stopPropagation();const idx=Number(el.dataset.removeAptidao);const count=state.skills.filter(s=>s.name.startsWith('APTIDÃO')).length;if(count>1&&!isNaN(idx)&&state.skills[idx]){state.skills.splice(idx,1);save(false);render()}});
  document.querySelectorAll('[data-view]').forEach(el=>el.onclick=()=>{if(el.dataset.view===currentView)return;const old=document.querySelector(`#${currentView}-view`),next=document.querySelector(`#${el.dataset.view}-view`);document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===el));old.classList.add('leaving');setTimeout(()=>{old.classList.remove('active','leaving');next.classList.add('active','entering');setTimeout(()=>next.classList.remove('entering'),300);currentView=el.dataset.view},180)});
  document.querySelectorAll('[data-toggle-edit]').forEach(el=>{
   el.onclick=()=>{
    if(presentationMode){notifyPresentationLocked();return;}
    editTransitionMode=editMode?'into-view':'into-edit';
    editMode=!editMode;
    playModeToggleSound(editMode);
    save(false);
    render();
   };
  });
  document.querySelectorAll('[data-export-cinematic-image]').forEach(el=>{
   el.onclick=()=>exportCinematicImage();
  });
  document.querySelectorAll('[data-right]').forEach(el=>el.onclick=()=>{const nextRight=el.dataset.right;if(nextRight===currentRight)return;const oldPanel=document.querySelector(`#${currentRight}`),newPanel=document.querySelector(`#${nextRight}`);document.querySelectorAll('[data-right]').forEach(button=>button.classList.toggle('active',button===el));oldPanel.classList.add('leaving');setTimeout(()=>{oldPanel.classList.remove('active','leaving');newPanel.classList.add('active','entering');setTimeout(()=>newPanel.classList.remove('entering'),280);currentRight=nextRight},180)});
  const filter=document.querySelector('#filter');if(filter)filter.oninput=e=>document.querySelectorAll('.right-content.active [data-filter]').forEach(x=>x.hidden=!x.dataset.filter.includes(e.target.value.toLowerCase()));const traditionalAdd=document.querySelector('.right-tools .add');if(traditionalAdd)traditionalAdd.onclick=()=>openCardEditor();document.querySelectorAll('[data-cinematic-add]').forEach(el=>el.onclick=()=>{currentRight=el.dataset.cinematicAdd;openCardEditor()});document.querySelectorAll('[data-cinematic-section-toggle]').forEach(el=>el.onclick=()=>{const key=el.dataset.cinematicSectionToggle;if(presentationMode&&(key==='items'||key==='history')){playLockRattleSound();notifyPresentationLocked();const lockEl=el.querySelector('.cinematic-section-lock');if(lockEl){lockEl.classList.remove('lock-denied');void lockEl.offsetWidth;lockEl.classList.add('lock-denied')}return;}const group=el.closest('.cinematic-section-group');state.cinematicCollapsed[key]=!state.cinematicCollapsed[key];group.classList.toggle('collapsed',state.cinematicCollapsed[key]);el.setAttribute('aria-expanded',String(!state.cinematicCollapsed[key]));save(false)});
  document.querySelectorAll('[data-edit-card]').forEach(el=>el.onclick=()=>openCardEditor(el.dataset.editCard));document.querySelectorAll('[data-toggle-card]').forEach(el=>el.onclick=()=>{const c=state.cards.find(x=>x.id===el.dataset.toggleCard);c.collapsed=!c.collapsed;save(false);render()});
  document.querySelectorAll('[data-duplicate-card]').forEach(el=>el.onclick=()=>{const c=state.cards.find(x=>x.id===el.dataset.duplicateCard),copy={...clone(c),id:makeId('card'),title:`${c.title} — CÓPIA`};copy.markers.forEach(m=>m.id=makeId('marker'));copy.actions.forEach(a=>a.id=makeId('action'));state.cards.splice(state.cards.indexOf(c)+1,0,copy);save(false);render()});
  document.querySelectorAll('[data-move]').forEach(el=>el.onclick=()=>{const[id,delta]=el.dataset.move.split(':'),from=state.cards.findIndex(c=>c.id===id),to=Math.max(0,Math.min(state.cards.length-1,from+Number(delta)));if(from!==to){const[c]=state.cards.splice(from,1);state.cards.splice(to,0,c);save(false);render()}});
  document.querySelectorAll('.resource-card').forEach(card=>{card.ondragstart=e=>e.dataTransfer.setData('text/card-id',card.dataset.cardId);card.ondragover=e=>e.preventDefault();card.ondrop=e=>{e.preventDefault();const from=state.cards.findIndex(c=>c.id===e.dataTransfer.getData('text/card-id')),to=state.cards.findIndex(c=>c.id===card.dataset.cardId);if(from>=0&&to>=0&&from!==to){const[moved]=state.cards.splice(from,1);state.cards.splice(to,0,moved);save(false);render()}}});
  document.querySelectorAll('.editor-close,.editor-backdrop').forEach(el=>el.onclick=closeCardEditor);document.querySelectorAll('[data-format]').forEach(el=>el.onclick=()=>applyTextFormat(el.dataset.format));document.querySelectorAll('[data-skill-info]').forEach(el=>el.onclick=e=>{e.stopPropagation();openSkillInfo(Number(el.dataset.skillInfo))});document.querySelectorAll('.skill-info-close,.skill-info-backdrop').forEach(el=>el.onclick=closeSkillInfo);document.querySelector('[data-add-marker]').onclick=()=>{if(editorMarkers.length<5){editorMarkers.push({id:makeId('marker'),type:'counter',displayStyle:'default',label:`Marcador ${editorMarkers.length+1}`,current:0,maxFormula:'@{level} + 2'});renderCardBuilders()}};document.querySelector('[data-add-action]').onclick=()=>{if(editorActions.length<7){editorActions.push({id:makeId('action'),name:`Ação ${editorActions.length+1}`,expression:'1d8'});renderCardBuilders()}};
  document.querySelector('#card-form').onsubmit=e=>{e.preventDefault();const form=e.currentTarget,data=Object.fromEntries(new FormData(form)),existing=state.cards.find(c=>c.id===form.dataset.cardId),card=existing||{id:makeId('card')};Object.assign(card,{schema:data.schema,title:data.title.trim()||'SEM TÍTULO',type:data.type.trim()||'Habilidade',icon:data.icon.trim()||'◆',accent:data.accent,themeLinked:data.colorMode==='profile',layout:data.layout,collapsed:data.collapsed==='true',imageUrl:data.imageUrl.trim(),content:data.content.trim(),markers:clone(editorMarkers),actions:clone(editorActions)});card.markers.forEach(marker=>{marker.current=Math.min(Number(marker.current)||0,marker.type==='toggle'?1:markerMax(marker)||999);if(marker.type==='slots'&&!Array.isArray(marker.slots)){const max=markerMax(marker);marker.slots=Array.from({length:max},()=>null)}});if(!existing)state.cards.push(card);currentRight=card.schema;save(false);closeCardEditor();render()};
  document.querySelector('.delete-card').onclick=()=>{const id=document.querySelector('#card-form').dataset.cardId;if(id){state.cards=state.cards.filter(c=>c.id!==id);save(false);closeCardEditor();render()}};
  document.querySelectorAll('#token-upload,#token-upload-secondary,#token-upload-cinematic').forEach(input=>input.onchange=()=>readImage(input.files[0],'tokenImage',2048));const backgroundUpload=document.querySelector('#background-upload');if(backgroundUpload)backgroundUpload.onchange=()=>readMedia(backgroundUpload.files[0],'backgroundImage');document.querySelectorAll('[data-reset-background]').forEach(el=>el.onclick=()=>{state.backgroundImage='';state.backgroundBlur=0;state.backgroundZoom=100;save(false);render()});document.querySelectorAll('[data-reset-bg-effects]').forEach(el=>el.onclick=()=>{state.backgroundBlur=0;state.backgroundZoom=100;save(false);render()});document.querySelectorAll('[data-cinematic-bg-blur]').forEach(input=>{input.oninput=()=>{const val=Math.max(0,Math.min(50,Number(input.value)||0));state.backgroundBlur=val;document.querySelectorAll('.page,.cinematic-page').forEach(page=>page.style.setProperty('--bg-blur',`${val}px`));const hint=input.parentElement?.querySelector('.slider-val-hint')||document.querySelector('#val-hint-blur');if(hint)hint.textContent=`${val}px`};input.onchange=()=>save(false);input.ondblclick=()=>{state.backgroundBlur=0;save(false);render()}});document.querySelectorAll('[data-cinematic-bg-zoom]').forEach(input=>{input.oninput=()=>{const val=Math.max(20,Math.min(300,Number(input.value)||100));state.backgroundZoom=val;document.querySelectorAll('.page,.cinematic-page').forEach(page=>page.style.setProperty('--bg-zoom',`${val/100}`));const hint=input.parentElement?.querySelector('.slider-val-hint')||document.querySelector('#val-hint-zoom');if(hint)hint.textContent=`${val}%`};input.onchange=()=>save(false);input.ondblclick=()=>{state.backgroundZoom=100;save(false);render()}});const diceColor=document.querySelector('#dice-color');if(diceColor)diceColor.onchange=()=>{state.diceColor=diceColor.value;save(false);render()};document.querySelectorAll('[data-reset-dice-color]').forEach(el=>el.onclick=()=>{state.diceColor='';save(false);render()});
    document.querySelectorAll('[data-sheet-id]').forEach(el=>el.onclick=()=>{const targetId=el.dataset.sheetId;sheetDrawerOpen=false;if(targetId===state.id){render();return;}save(false);const doSwitch=()=>{state=sheets.find(sheet=>sheet.id===targetId)||state;activeSheetId=state.id;if(presentationMode){presentationIndex=Math.max(0,sheets.findIndex(s=>s.id===state.id))}render()};if(state.viewMode==='cinematic'){triggerGlitchTransition(doSwitch)}else{doSwitch()}});
    document.querySelectorAll('[data-new-sheet]').forEach(el=>el.onclick=()=>{if(presentationMode){notifyPresentationLocked();return;}save(false);const sheet=normalizeSheet({name:`AGENTE ${sheets.length+1}`});sheets.push(sheet);state=sheet;activeSheetId=sheet.id;editMode=true;render();const switcher=document.querySelector('.sheet-switcher');if(switcher)switcher.scrollTop=switcher.scrollHeight});
    document.querySelectorAll('[data-save-sheet]').forEach(el=>el.onclick=()=>save(true,'SALVO'));
    document.querySelectorAll('[data-export-json]').forEach(el=>el.onclick=()=>exportJsonSheet());
    document.querySelectorAll('[data-import-json]').forEach(el=>el.onclick=()=>{document.querySelector('#json-file-input')?.click()});
    document.querySelectorAll('#json-file-input').forEach(input=>{input.onchange=()=>{if(input.files[0])importJsonSheet(input.files[0]);input.value=''}});
    document.querySelectorAll('[data-compendium]').forEach(el=>el.onclick=()=>{const toast=document.querySelector('#save-toast');if(toast){toast.textContent='COMPÊNDIO — EM BREVE';toast.classList.add('show');setTimeout(()=>{toast.classList.remove('show');toast.textContent='SALVO'},1300)}});

  document.querySelectorAll('[data-display-mode]').forEach(el=>el.onclick=()=>{if(el.dataset.displayMode===state.viewMode)return;state.viewMode=el.dataset.displayMode;if(state.viewMode==='cinematic')viewSwitchCollapsed=true;modeJustChanged=true;render()});
  document.querySelectorAll('[data-toggle-view-switch]').forEach(el=>el.onclick=e=>{e.stopPropagation();viewSwitchCollapsed=!viewSwitchCollapsed;render()});

  // ── Modo de Apresentação (Dossiês de Agentes) ───────────────────────────────
  bindPresentationEvents();

  bindCinematicToken();bindSheetInteractions();
 // ── Mobile bottom nav ──────────────────────────────────────────────────────
 document.querySelectorAll('[data-mobile-tab]').forEach(el=>el.onclick=()=>{mobileTab=el.dataset.mobileTab;render()});
 document.querySelectorAll('[data-sheet-drawer]').forEach(el=>el.onclick=()=>{sheetDrawerOpen=!sheetDrawerOpen;render()});
 document.querySelectorAll('[data-close-drawer]').forEach(el=>el.onclick=()=>{sheetDrawerOpen=false;render()});
 // ── Histórico de rolagens ──────────────────────────────────────────────────
 document.querySelectorAll('[data-open-roll-log]').forEach(el=>el.onclick=()=>toggleRollLog(true));
 document.querySelectorAll('[data-close-roll-log]').forEach(el=>el.onclick=()=>toggleRollLog(false));
 document.querySelectorAll('[data-clear-roll-log]').forEach(el=>el.onclick=()=>{
  rollLog=[];
  try{sessionStorage.removeItem('ordem-ii-roll-log')}catch{}
  updateRollLogUi();
  const toast=document.querySelector('#save-toast');
  if(toast){toast.textContent='HISTÓRICO LIMPO';toast.classList.add('show');setTimeout(()=>{toast.classList.remove('show');toast.textContent='SALVO'},1300)}
  render();
 });
 document.querySelectorAll('[data-copy-all-rolls]').forEach(el=>el.onclick=()=>{
  if(!rollLog.length)return;
  const text='🎲 **Histórico de Rolagens (Ordem Paranormal II)**\n'+rollLog.map(r=>{
   const modStr=r.modifier?` ${r.modifier>0?'+':'−'} ${Math.abs(r.modifier)}`:'';
   const diceStr=(r.dice||[]).map(d=>`d${d.sides}:${d.value}`).join(', ');
   return `• [${r.timestamp}] **${r.characterName}** | ${r.title}: **${r.total}** (${diceStr}${modStr})`;
  }).join('\n');
  navigator.clipboard.writeText(text).catch(()=>{});
  const toast=document.querySelector('#save-toast');
  if(toast){toast.textContent='HISTÓRICO COMPLETO COPIADO!';toast.classList.add('show');setTimeout(()=>{toast.classList.remove('show');toast.textContent='SALVO'},1500)}
 });
 bindRollLogItemEvents();
}
document.addEventListener('click',e=>{closeSheetContextMenu();if(!viewSwitchCollapsed&&!e.target.closest('.view-mode-switch')){viewSwitchCollapsed=true;render()}});

document.addEventListener('keydown',e=>{
 if(presentationMode){
  if(e.key==='Escape'){closePresentationMode();return;}
  if(e.key==='ArrowLeft'){cyclePresentation(-1);return;}
  if(e.key==='ArrowRight'){cyclePresentation(1);return;}
  if(e.key==='Enter'||e.key===' '){e.preventDefault();confirmPresentationAgent(sheets[presentationIndex]);return;}
  return;
 }
 if(e.key==='Escape'){closeSheetContextMenu();closeSlotModal();closeCardEditor();closeSkillInfo();toggleRollLog(false);document.querySelector('#critical-settings-modal')?.classList.remove('open')}
 if((e.key==='h'||e.key==='H')&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){toggleRollLog()}
});

let resizeRaf=0;
window.addEventListener('resize',()=>{
 closeSheetContextMenu();
 if(resizeRaf)cancelAnimationFrame(resizeRaf);
 resizeRaf=requestAnimationFrame(()=>{
  resizeRaf=0;
  syncCinematicLineMask();
  syncCriticalAtmosphere();
 });
},{passive:true});
document.addEventListener('visibilitychange',syncCriticalAtmosphere);
document.addEventListener('pointerdown',()=>{const context=getUiAudioContext();if(context?.state==='running')syncCriticalAtmosphere();else context?.resume?.().then(syncCriticalAtmosphere).catch(()=>{})},{once:true,capture:true});
await loadInitialSheets();
state.viewMode = 'cinematic';
presentationMode = true;
presentationIndex = Math.max(0, sheets.findIndex(sheet => sheet.id === state.id));
state = sheets[presentationIndex];
activeSheetId = state.id;
render();