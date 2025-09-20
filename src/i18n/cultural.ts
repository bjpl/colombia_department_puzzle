/**
 * Colombian Cultural Adaptations and Context
 *
 * This file contains specific cultural adaptations for Colombian Spanish,
 * including regional expressions, cultural context, and educational notes
 * that make the application more culturally appropriate for Colombian users.
 */

import type { CulturalContext, CulturalAdaptation, RegionKey } from './types';

/**
 * Colombian Spanish Expressions by Context
 * These expressions are commonly used in Colombia and make the interface
 * feel more natural to Colombian users.
 */
export const colombianExpressions: CulturalContext = {
  expressions: {
    agreement: [
      'Así es',
      'Claro que sí',
      'Por supuesto',
      'Exacto',
      'Dale',
      'Listo',
      'Bacano',
      'Chevere',
    ],
    disagreement: [
      'No way',
      'Para nada',
      'Ni de riesgos',
      'No señor',
      'Qué va',
    ],
    surprise: [
      '¡Uy no!',
      '¡Ay, Dios mío!',
      '¡No puede ser!',
      '¡Increíble!',
      '¡Qué chimba!',
      '¡Berraco!',
    ],
    encouragement: [
      '¡Dale que vas bien!',
      '¡Venga, que vos podés!',
      '¡Ánimo, parcero!',
      '¡Echale ganas!',
      '¡Ya mero!',
      '¡Sí se puede!',
    ],
  },
  greetings: {
    formal: [
      'Buenos días',
      'Buenas tardes',
      'Buenas noches',
      'Mucho gusto',
      'Es un placer',
    ],
    informal: [
      '¡Hola!',
      '¿Cómo estás?',
      '¿Qué tal?',
      '¿Cómo vas?',
      '¡Hola, parcero!',
      '¿Qué más?',
      '¿Todo bien?',
    ],
    timeOfDay: {
      morning: '¡Buenos días!',
      afternoon: '¡Buenas tardes!',
      evening: '¡Buenas noches!',
      allDay: '¡Buenas!',
    },
  },
  regionalVariations: {
    Caribe: {
      accent: 'Costeño',
      commonExpressions: [
        'Ey, tigre',
        'Qué tal, pana',
        'Bacano',
        'Jajay',
        'Ajá',
        'Klk (¿Qué tal?)',
      ],
      culturalNotes: [
        'Uso del "tú" en lugar de "usted"',
        'Pronunciación relajada de consonantes finales',
        'Influencia del vallenato y cumbia en la cultura',
        'Tradición de carnavales y festivales',
      ],
    },
    Andina: {
      accent: 'Rolo/Paisa',
      commonExpressions: [
        'Parcero',
        '¿Cómo va todo?',
        'Qué pena',
        'Con mucho gusto',
        'Hagamos',
        'Chevere',
      ],
      culturalNotes: [
        'Uso formal del "usted" más común',
        'Pronunciación clara de todas las consonantes',
        'Centro político y económico del país',
        'Tradición cafetera en el eje cafetero',
      ],
    },
    Pacífica: {
      accent: 'Pacífico',
      commonExpressions: [
        'Mi loco',
        'Qué chimba',
        'Está bacano',
        'Mi negro/negra (término cariñoso)',
        'Ajá, sí',
      ],
      culturalNotes: [
        'Fuerte influencia afrodescendiente',
        'Tradición musical de salsa y currulao',
        'Cultura gastronómica única',
        'Biodiversidad excepcional',
      ],
    },
    Orinoquía: {
      accent: 'Llanero',
      commonExpressions: [
        'Compadre',
        'Hermano',
        '¿Cómo amaneció?',
        'Está muy bien',
        'Llanero sí',
      ],
      culturalNotes: [
        'Cultura ganadera tradicional',
        'Tradición del joropo y los cuentos llaneros',
        'Hospitalidad excepcional',
        'Conexión profunda con la naturaleza',
      ],
    },
    Amazonía: {
      accent: 'Amazónico',
      commonExpressions: [
        'Hermano de la selva',
        'Paisano',
        'Con respeto',
        'Bendiciones',
      ],
      culturalNotes: [
        'Influencia de culturas indígenas',
        'Respeto profundo por la naturaleza',
        'Tradiciones ancestrales preservadas',
        'Medicina tradicional y plantas sagradas',
      ],
    },
    Insular: {
      accent: 'Raizal',
      commonExpressions: [
        'Nice to meet you',
        'How are you?',
        'Everything cool',
        'Island people',
      ],
      culturalNotes: [
        'Trilingüismo: español, inglés, creole',
        'Cultura afrocaribeña única',
        'Influencia protestante',
        'Tradiciones marítimas',
      ],
    },
  },
};

/**
 * Cultural Adaptations for Specific Departments
 * Provides cultural context and notes for departments that have
 * unique cultural significance or naming conventions.
 */
export const departmentCulturalAdaptations: CulturalAdaptation[] = [
  {
    departmentName: 'San Andrés y Providencia',
    culturalNote: 'Único territorio insular de Colombia, hogar de la cultura raizal con tradiciones afrocaribeñas únicas.',
    alternativeNames: ['San Andrés', 'Islas de San Andrés'],
    pronunciation: 'San An-drés y Pro-vi-den-cia',
    culturalSignificance: 'Centro de la cultura raizal colombiana, patrimonio cultural inmaterial de la UNESCO.',
  },
  {
    departmentName: 'Norte de Santander',
    culturalNote: 'Puerta de entrada a Venezuela, cuna de muchos próceres de la independencia colombiana.',
    alternativeNames: ['Norte de Santander', 'Nortesantandereano'],
    pronunciation: 'Nor-te de San-tan-der',
    culturalSignificance: 'Ciudad fronteriza con gran intercambio comercial y cultural con Venezuela.',
  },
  {
    departmentName: 'Valle del Cauca',
    culturalNote: 'Capital mundial de la salsa, tierra de la caña de azúcar y centro industrial del suroccidente.',
    alternativeNames: ['Valle', 'Valle del Cauca'],
    pronunciation: 'Va-lle del Cau-ca',
    culturalSignificance: 'Cuna de la salsa en Colombia, festival mundial de salsa en Cali.',
  },
  {
    departmentName: 'Bogotá D.C.',
    culturalNote: 'Distrito Capital, sede del gobierno nacional y centro político, económico y cultural del país.',
    alternativeNames: ['Bogotá', 'La Capital', 'D.C.'],
    pronunciation: 'Bo-go-tá De-Cé',
    culturalSignificance: 'Capital de Colombia desde 1819, centro neurálgico del país.',
  },
  {
    departmentName: 'Antioquia',
    culturalNote: 'Tierra paisa, cuna del emprendimiento colombiano y centro de la cultura cafetera.',
    alternativeNames: ['Antioquia', 'Tierra Paisa'],
    pronunciation: 'An-tio-quia',
    culturalSignificance: 'Centro industrial y minero, famoso por su cultura emprendedora y el acento paisa.',
  },
  {
    departmentName: 'La Guajira',
    culturalNote: 'Tierra del pueblo wayuu, península desértica con cultura indígena ancestral.',
    alternativeNames: ['Guajira', 'La Guajira'],
    pronunciation: 'La Gua-ji-ra',
    culturalSignificance: 'Hogar del pueblo wayuu, tradiciones indígenas y punto más septentrional de Suramérica.',
  },
  {
    departmentName: 'Chocó',
    culturalNote: 'Biodiversidad excepcional, cultura afrodescendiente y tradiciones del Pacífico colombiano.',
    alternativeNames: ['Chocó'],
    pronunciation: 'Cho-có',
    culturalSignificance: 'Uno de los lugares más biodiversos del planeta, cultura afropacífica única.',
  },
  {
    departmentName: 'Amazonas',
    culturalNote: 'Corazón de la selva amazónica colombiana, hogar de múltiples culturas indígenas.',
    alternativeNames: ['Amazonas'],
    pronunciation: 'A-ma-zo-nas',
    culturalSignificance: 'Portal colombiano a la Amazonía, conservación de culturas ancestrales.',
  },
];

/**
 * Educational Facts about Colombian Geography
 * Culturally relevant information that enhances the learning experience
 */
export const colombianGeographyFacts = {
  general: [
    'Colombia es el único país sudamericano con costas en dos océanos: Pacífico y Atlántico.',
    'Tiene 32 departamentos y 1 distrito capital (Bogotá D.C.).',
    'Es el segundo país más biodiverso del mundo después de Brasil.',
    'Cuenta con todos los pisos térmicos: tropical, templado, frío y páramo.',
    'Es el principal productor mundial de esmeraldas.',
    'Tiene la mayor diversidad de aves del planeta.',
  ],
  regions: {
    Caribe: [
      'Cuna del vallenato y la cumbia.',
      'Hogar de ciudades coloniales como Cartagena.',
      'Región de extensas sabanas y ganadería.',
      'Puerto principal: Cartagena de Indias.',
    ],
    Pacífica: [
      'Una de las regiones más lluviosas del mundo.',
      'Biodiversidad marina excepcional.',
      'Centro de la cultura afrodescendiente.',
      'Música tradicional: currulao y chirimía.',
    ],
    Andina: [
      'Cordillera de los Andes dividida en tres ramales.',
      'Centro económico y político del país.',
      'Región del Eje Cafetero, patrimonio de la humanidad.',
      'Altiplanos de Bogotá y Cundinamarca.',
    ],
    Orinoquía: [
      'Llanos orientales, región ganadera por excelencia.',
      'Cultura llanera y música joropo.',
      'Importante producción petrolera.',
      'Sabanas inundables y fauna única.',
    ],
    Amazonía: [
      'Pulmón del mundo y reserva de biodiversidad.',
      'Hogar de más de 100 etnias indígenas.',
      'Ríos navegables como el Amazonas, Caquetá y Putumayo.',
      'Medicina tradicional y plantas medicinales.',
    ],
    Insular: [
      'Único territorio insular de Colombia.',
      'Barrera de coral de 32 kilómetros.',
      'Cultura trilingüe: español, inglés y creole.',
      'Reserva de biosfera de la UNESCO.',
    ],
  },
};

/**
 * Colombian Spanish Grammar and Usage Notes
 * Helpful information for proper Colombian Spanish usage in the interface
 */
export const colombianGrammarNotes = {
  voseo: {
    note: 'En algunas regiones de Colombia se usa "vos" en lugar de "tú"',
    examples: [
      'Vos podés hacerlo (en lugar de: Tú puedes hacerlo)',
      '¿Cómo estás vos? (en lugar de: ¿Cómo estás tú?)',
    ],
    regions: ['Antioquia', 'Valle del Cauca', 'Quindío', 'Risaralda', 'Caldas'],
  },
  ustedeo: {
    note: 'El uso de "usted" es muy común, incluso en contextos informales',
    examples: [
      '¿Cómo está usted? (formal e informal)',
      'Usted puede intentarlo de nuevo',
    ],
    regions: ['Bogotá', 'Cundinamarca', 'Boyacá', 'Santander'],
  },
  diminutives: {
    note: 'Uso frecuente de diminutivos para expresar cariño o cortesía',
    examples: [
      'Un momentico (un momento)',
      'Ahorita (ahora)',
      'Cerquita (cerca)',
      'Poquito (poco)',
    ],
  },
  timeExpressions: {
    note: 'Expresiones de tiempo específicas del español colombiano',
    examples: [
      'Ahorita = en un momento',
      'Ya = ahora mismo',
      'Antier = anteayer',
      'Al rato = más tarde',
    ],
  },
};

/**
 * Helper function to get cultural notes for a department
 */
export function getDepartmentCulturalNote(departmentName: string): string | null {
  const adaptation = departmentCulturalAdaptations.find(
    adaptation => adaptation.departmentName === departmentName
  );
  return adaptation?.culturalNote || null;
}

/**
 * Helper function to get regional expressions
 */
export function getRegionalExpressions(region: RegionKey): string[] {
  return colombianExpressions.regionalVariations[region]?.commonExpressions || [];
}

/**
 * Helper function to get appropriate greeting based on time
 */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return colombianExpressions.greetings.timeOfDay.morning;
  if (hour < 18) return colombianExpressions.greetings.timeOfDay.afternoon;
  return colombianExpressions.greetings.timeOfDay.evening;
}

/**
 * Helper function to get random encouragement phrase
 */
export function getRandomEncouragement(): string {
  const encouragements = colombianExpressions.expressions.encouragement;
  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

/**
 * Helper function to get random positive expression
 */
export function getRandomPositiveExpression(): string {
  const agreements = colombianExpressions.expressions.agreement;
  return agreements[Math.floor(Math.random() * agreements.length)];
}

export default {
  colombianExpressions,
  departmentCulturalAdaptations,
  colombianGeographyFacts,
  colombianGrammarNotes,
  getDepartmentCulturalNote,
  getRegionalExpressions,
  getTimeBasedGreeting,
  getRandomEncouragement,
  getRandomPositiveExpression,
};