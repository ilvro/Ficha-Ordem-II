/**
 * Dados, constantes e enums para o Sistema de Ameaças (Criaturas e NPCs de Ordem Paranormal)
 */

export const THREAT_ELEMENTS = {
  sangue: { id: 'sangue', nome: 'Sangue', cor: '#e0150d', texto: '#ffffff' },
  morte: { id: 'morte', nome: 'Morte', cor: '#181922', texto: '#ffffff' },
  energia: { id: 'energia', nome: 'Energia', cor: '#993ce8', texto: '#ffffff' },
  conhecimento: { id: 'conhecimento', nome: 'Conhecimento', cor: '#cca02b', texto: '#ffffff' },
  medo: { id: 'medo', nome: 'Medo', cor: '#d5d7e0', texto: '#11131a' }
};

export const ACTION_TYPES = [
  { id: 'padrao', nome: 'Padrão', simbolo: '◆', desc: 'Ação Padrão (ataques e habilidades principais)' },
  { id: 'movimento', nome: 'Movimento', simbolo: '❖', desc: 'Ação de Movimento (deslocamentos e manobras)' },
  { id: 'completa', nome: 'Completa', simbolo: '◈', desc: 'Ação Completa' },
  { id: 'reacao', nome: 'Reação', simbolo: '✦', desc: 'Reação (respostas a ações inimigas)' },
  { id: 'livre', nome: 'Livre', simbolo: '◇', desc: 'Ação Livre' },
  { id: 'passiva', nome: 'Passiva', simbolo: '○', desc: 'Habilidade Passiva contínua' }
];

export const THREAT_SIZES = [
  'Minúsculo',
  'Pequeno',
  'Médio',
  'Grande',
  'Enorme',
  'Colossal'
];

export const THREAT_RANGES = [
  { id: 'corpo', nome: 'Corpo a corpo' },
  { id: 'curto', nome: 'Curto' },
  { id: 'medio', nome: 'Médio' },
  { id: 'longo', nome: 'Longo' },
  { id: 'extremo', nome: 'Extremo' }
];

export const DAMAGE_TYPES = [
  'Balístico',
  'Corte',
  'Impacto',
  'Perfuração',
  'Fogo',
  'Frio',
  'Eletricidade',
  'Químico',
  'Mental',
  'Medo',
  'Morte',
  'Sangue',
  'Energia',
  'Conhecimento'
];

export const CREATURE_TYPES_PARANORMAL = [
  'Criatura',
  'Relíquia'
];

export const CREATURE_TYPES_MUNDANE = [
  'Humano',
  'Animal',
  'Veículo'
];

export const DEFAULT_THREAT_SHEET = {
  name: 'Nova Ameaça',
  systemMode: 'threat',
  folderId: 'folder-threats',
  favorite: false,
  categoria: 'paranormal', // 'paranormal' | 'mundana'
  subtitulo: '',
  vd: 60,
  elementos: ['sangue'],
  elementoDestaque: 'sangue',
  tipo: 'Criatura',
  tamanho: 'Médio',
  sigiloId: 'padrao-1',

  presenca: {
    ativa: true,
    dt: 19,
    dano: '3d6',
    tipoDano: 'mental',
    imuneNex: 35,
    texto: ''
  },

  sentidos: {
    percepcao: { dados: 3, bonus: 10 },
    iniciativa: { dados: 3, bonus: 0 },
    extra: 'Percepção às cegas'
  },

  defesa: 21,
  salvaguardas: {
    fortitude: { dados: 3, bonus: 10 },
    reflexos: { dados: 2, bonus: 5 },
    vontade: { dados: 2, bonus: 0 }
  },

  pv: 105,
  pvMax: 105,
  pvTemp: 0,
  machucadoOverride: null,
  imunidades: [],
  resistencias: [
    { tipo: 'Balístico', valor: 10 },
    { tipo: 'Impacto', valor: 10 },
    { tipo: 'Perfuração', valor: 10 }
  ],
  vulnerabilidades: [],

  atributos: {
    agi: 2,
    for: 3,
    int: 1,
    pre: 2,
    vig: 3
  },

  deslocamento: {
    metros: 12,
    extras: []
  },

  pericias: [],
  secoes: [],

  acoes: [
    {
      id: 'act-1',
      tipoAcao: 'padrao',
      nome: 'Agredir',
      gatilho: '',
      custo: '',
      usos: null,
      ataques: [
        {
          id: 'atk-1',
          nome: 'Pancada',
          alcance: 'corpo',
          multiplicador: 2,
          teste: { dados: 3, bonus: 10 },
          dano: '2d8+6',
          tipoDano: 'Impacto',
          critico: '20/x2'
        }
      ],
      texto: '',
      coluna: 'esquerda',
      ativaQuando: null,
      fase: null
    }
  ],

  viewMode: 'livro', // 'livro' | 'cinematic'
  tokenImage: '',
  backgroundImage: '',
  backgroundBlur: 0,
  backgroundZoom: 100,
  cinematicTokenX: 50,
  cinematicTokenY: 52,
  cinematicTokenScale: 100,
  cinematicOutlineSide: 'left',
  cinematicOutlineIntensity: 0.5,
  cinematicOutlineWidth: 1.8,
  cinematicOutlineFade: 1.5,
  themeColor: '',
  diceColor: '',

  hasIntro: false,
  introTitle: '',
  introText: '',
  introImage: '',
  introSide: 'left', // 'left' | 'right'

  condicoesAtivas: [],
  notasMestre: '',
  tipografia: {
    escala: 100,
    alto_contraste: false
  }
};

