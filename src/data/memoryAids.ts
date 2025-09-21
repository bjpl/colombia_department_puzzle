// Enhanced Memory Aids for Colombian Departments
// Comprehensive mnemonic devices, visual associations, and memorable facts

export interface MemoryAid {
  mnemonic: string;           // Memory phrase or acronym
  visualAssociation: string;   // Visual memory cue
  geographicTrick: string;     // Location-based memory trick
  culturalFact: string;        // Memorable cultural connection
  rhyme?: string;              // Optional rhyme or wordplay
}

export const departmentMemoryAids: Record<string, MemoryAid> = {
  'Amazonas': {
    mnemonic: 'AMAZONAS = A Mighty Amazon Zone Of Natural Amazement in the South',
    visualAssociation: '🌳 Forma de triángulo verde gigante apuntando al sur',
    geographicTrick: 'El más SUR - toca Brasil y Perú - piensa en la selva más grande',
    culturalFact: 'Leticia, su capital, está donde el río Amazonas toca Colombia',
    rhyme: 'Amazonas al sur profundo, donde la selva es otro mundo'
  },
  'Antioquia': {
    mnemonic: 'ANTIOQUIA = Área Notable, Tierra Industrial, Oro Quimbaya, Urbe Industrial Avanzada',
    visualAssociation: '⛰️ Forma de mariposa en el noroeste con Medellín en el centro',
    geographicTrick: 'NOROESTE - El segundo más grande - Entre Chocó y Santander',
    culturalFact: 'Paisas, café y flores - La tierra de Pablo Escobar y Fernando Botero',
    rhyme: 'Antioquia paisa y cafetera, en el noroeste te espera'
  },
  'Arauca': {
    mnemonic: 'ARAUCA = Al Río Arauca Una Comarca Agropecuaria',
    visualAssociation: '🐄 Rectángulo horizontal en el este - frontera con Venezuela',
    geographicTrick: 'ESTE puro - Llanos orientales - Hermano de Casanare al norte',
    culturalFact: 'Tierra llanera de joropo - "Ay mi llanura" es su himno más famoso',
    rhyme: 'Arauca llanera al oriente, donde el joropo es evidente'
  },
  'Atlántico': {
    mnemonic: 'ATLÁNTICO = Al Tamaño Liliputiense Ánimo Notable, Tiene Industrial Centro Oceánico',
    visualAssociation: '🌊 Pequeño triángulo al norte tocando el mar Caribe',
    geographicTrick: 'El más PEQUEÑO del Caribe - Barranquilla domina todo - Boca del Río Magdalena',
    culturalFact: 'Carnaval de Barranquilla - Puerta de Oro de Colombia - Shakira es de aquí',
    rhyme: 'Atlántico chiquito pero matón, con Barranquilla y su carnavalón'
  },
  'Bolívar': {
    mnemonic: 'BOLÍVAR = Bella Obra Libertadora Í-ntegra, Valiente Área Regional',
    visualAssociation: '🏰 Forma irregular grande al norte con Cartagena como joya',
    geographicTrick: 'NORTE con costa - Rodea a Atlántico - Cartagena es la perla',
    culturalFact: 'Cartagena amurallada - Ciudad heroica - Gabriel García Márquez escribió aquí',
    rhyme: 'Bolívar con Cartagena hermosa, ciudad amurallada y gloriosa'
  },
  'Boyacá': {
    mnemonic: 'BOYACÁ = Batalla Original Y Ácida Contra el Agresor',
    visualAssociation: '🎨 Forma de Y invertida en el centro-este - Altiplano',
    geographicTrick: 'CENTRO-ESTE en la cordillera - Encima de Cundinamarca - Tunja está muy alto',
    culturalFact: 'Puente de Boyacá - Aquí nació la libertad - Tierra de ciclistas campeones',
    rhyme: 'Boyacá libertadora en las alturas, con Tunja y sus mil aventuras'
  },
  'Caldas': {
    mnemonic: 'CALDAS = Café Abundante, Laderas Doradas, Agricultura Sobresaliente',
    visualAssociation: '☕ Pequeño rombo en el Eje Cafetero - Centro del café',
    geographicTrick: 'EJE CAFETERO central - Entre Antioquia y Tolima - Manizales en la montaña',
    culturalFact: 'Corazón del Eje Cafetero - Feria de Manizales - Nevado del Ruiz vigila',
    rhyme: 'Caldas cafetero por excelencia, Manizales es su presencia'
  },
  'Caquetá': {
    mnemonic: 'CAQUETÁ = Con Amazonia Queda, Una Extensa Tierra Ágreste',
    visualAssociation: '🌿 Rectángulo verde al sur - Puerta de la Amazonía',
    geographicTrick: 'SUR amazónico - Entre Putumayo y Meta - Florencia florece en la selva',
    culturalFact: 'Portal de la Amazonía - Florencia la capital de la selva urbana',
    rhyme: 'Caquetá selvático al sur, donde Florencia hace su tour'
  },
  'Casanare': {
    mnemonic: 'CASANARE = Con Arauca Sur, A Nuestros Aires Rodea Este',
    visualAssociation: '🦌 Forma de bota acostada en los llanos orientales',
    geographicTrick: 'LLANOS orientales - Debajo de Arauca - Yopal petrolero',
    culturalFact: 'Llano infinito - Coleo y joropo - El petróleo transformó Yopal',
    rhyme: 'Casanare llanero sin igual, con Yopal y su festival'
  },
  'Cauca': {
    mnemonic: 'CAUCA = Costa Amplia Une Cordilleras Ancestrales',
    visualAssociation: '🏔️ Forma de L grande en el suroeste tocando el Pacífico',
    geographicTrick: 'SUROESTE con mar - Entre Valle y Nariño - Popayán la ciudad blanca',
    culturalFact: 'Popayán ciudad blanca - Semana Santa famosa - Tierra indígena ancestral',
    rhyme: 'Cauca con Popayán colonial, del Pacífico al oriental'
  },
  'Cesar': {
    mnemonic: 'CESAR = Con Este Sur Arauca Regional',
    visualAssociation: '🎵 Rectángulo al noreste - Tierra del vallenato',
    geographicTrick: 'NORESTE - Entre La Guajira y Santander - Valledupar vallenata',
    culturalFact: 'Cuna del vallenato - Festival de la Leyenda Vallenata - Diomedes Díaz',
    rhyme: 'Cesar vallenato de corazón, Valledupar es la canción'
  },
  'Chocó': {
    mnemonic: 'CHOCÓ = Costa Húmeda Occidental, Cultura Ósea',
    visualAssociation: '🌧️ Franja vertical en todo el Pacífico occidental',
    geographicTrick: 'TODO el OESTE - Dos mares lo bañan - Quibdó en el Atrato',
    culturalFact: 'El lugar más lluvioso del mundo - Biodiversidad extrema - Oro y platino',
    rhyme: 'Chocó biodiiverso y lluvioso, del Pacífico al mar Caribe hermoso'
  },
  'Córdoba': {
    mnemonic: 'CÓRDOBA = Con Ó-ptima Región, Domina Oro, Buen Agro',
    visualAssociation: '🐮 Forma de hacha al norte - Ganadería extensiva',
    geographicTrick: 'NORTE con costa corta - Al oeste de Sucre - Montería del Sinú',
    culturalFact: 'Sombrero vueltiao - Tierra ganadera - Porro y fandango',
    rhyme: 'Córdoba ganadera sin cesar, con Montería junto al Sinú está'
  },
  'Cundinamarca': {
    mnemonic: 'CUNDINAMARCA = Capital Única Nacional, Distrito Importante, Notable Área Metropolitana, Andina Región Central Avanzada',
    visualAssociation: '🏛️ Forma irregular en el centro con Bogotá como corazón',
    geographicTrick: 'CENTRO absoluto - Rodea a Bogotá - Altiplano cundiboyacense',
    culturalFact: 'Bogotá capital de Colombia - Sabana más poblada - El Dorado está aquí',
    rhyme: 'Cundinamarca central y capital, donde Bogotá es especial'
  },
  'Guainía': {
    mnemonic: 'GUAINÍA = Gran Área Indígena, Natural Í-ntegra Amazónica',
    visualAssociation: '🦜 Forma de pájaro en el extremo este amazónico',
    geographicTrick: 'EXTREMO ESTE - Frontera triple - Inírida de los ríos',
    culturalFact: 'Cerros de Mavicure - Estrella fluvial del oriente - Tierra de ríos negros',
    rhyme: 'Guainía al este profundo, de ríos negros, otro mundo'
  },
  'Guaviare': {
    mnemonic: 'GUAVIARE = Gran Área Verde, Inicios Amazónicos, Ríos Enormes',
    visualAssociation: '🌉 Rectángulo puente entre llanos y selva',
    geographicTrick: 'TRANSICIÓN llanos-selva - Centro-sur - San José puente cultural',
    culturalFact: 'Serranía de la Lindosa - Pinturas rupestres milenarias - Portal amazónico',
    rhyme: 'Guaviare puente natural, entre llanos y selva tropical'
  },
  'Huila': {
    mnemonic: 'HUILA = Hacia Una Inmensa Ladera Andina',
    visualAssociation: '🏔️ Forma de reloj de arena en el sur andino',
    geographicTrick: 'SUR andino - Nace el Magdalena - Neiva en el valle',
    culturalFact: 'Desierto de la Tatacoa - San Agustín arqueológico - Nevado del Huila',
    rhyme: 'Huila donde el Magdalena nace, con Neiva que el calor abraza'
  },
  'La Guajira': {
    mnemonic: 'LA GUAJIRA = La Área Grande, Una Joya Indígena Regional Árida',
    visualAssociation: '🏜️ Península al extremo norte - Forma de cabeza de ave',
    geographicTrick: 'EXTREMO NORTE - Península en el Caribe - Riohacha wayúu',
    culturalFact: 'Wayúu y sus mochilas - Cabo de la Vela místico - Desierto y mar unidos',
    rhyme: 'La Guajira al norte extremo, wayúu del desierto supremo'
  },
  'Magdalena': {
    mnemonic: 'MAGDALENA = Mar Azul, Gran Delta, Abundante Litoral, Enorme Natural Área',
    visualAssociation: '🌴 Triángulo costero al norte - Entre río y mar',
    geographicTrick: 'NORTE caribeño - Entre río y mar - Santa Marta la más antigua',
    culturalFact: 'Santa Marta ciudad más antigua - Sierra Nevada sagrada - Tayrona ancestral',
    rhyme: 'Magdalena con Santa Marta antigua, donde la Sierra Nevada se distingue'
  },
  'Meta': {
    mnemonic: 'META = Más Extensa Tierra Agropecuaria',
    visualAssociation: '🌾 Gran rectángulo en el centro de los llanos',
    geographicTrick: 'CENTRO de llanos - El más grande oriental - Villavicencio puerta',
    culturalFact: 'Puerta al llano - Villavicencio comercial - Mapiripán y Caño Cristales',
    rhyme: 'Meta llanero y central, Villavicencio su portal'
  },
  'Nariño': {
    mnemonic: 'NARIÑO = Notable Área Regional, Ilustre Ñapa Occidental',
    visualAssociation: '🌋 Triángulo en el extremo suroeste - Frontera Ecuador',
    geographicTrick: 'EXTREMO SUROESTE - Frontera con Ecuador - Pasto en las alturas',
    culturalFact: 'Carnaval de Negros y Blancos - Laguna de la Cocha - Volcán Galeras',
    rhyme: 'Nariño al sur occidental, con Pasto y su carnaval'
  },
  'Norte de Santander': {
    mnemonic: 'NORTE DE SANTANDER = Noreste Original, Región Tierra Estratégica / Desarrollo Económico / Sistema Andino, Notable Tierra Antigua, Nueva Democracia, Educación Regional',
    visualAssociation: '⛰️ Forma irregular al noreste - Frontera con Venezuela',
    geographicTrick: 'NORESTE fronterizo - Cúcuta comercial - Puente con Venezuela',
    culturalFact: 'Cúcuta fronteriza - Batalla de Cúcuta - Puente Simón Bolívar',
    rhyme: 'Norte de Santander fronterizo, con Cúcuta el paso preciso'
  },
  'Putumayo': {
    mnemonic: 'PUTUMAYO = Petróleo Único, Tierra Amazónica, Mayo Yoriente',
    visualAssociation: '🛢️ Rectángulo al sur - Frontera triple amazónica',
    geographicTrick: 'SUR fronterizo - Entre Ecuador y Perú - Mocoa piedemonte',
    culturalFact: 'Mocoa del Putumayo - Petróleo y biodiversidad - Medicina ancestral',
    rhyme: 'Putumayo al sur profundo, frontera de triple mundo'
  },
  'Quindío': {
    mnemonic: 'QUINDÍO = Qualité Única, Increíble Natural Destino, Í-ntimo Origen',
    visualAssociation: '☕ El más pequeño andino - Corazón cafetero',
    geographicTrick: 'EL MÁS PEQUEÑO andino - Eje Cafetero - Armenia central',
    culturalFact: 'Palma de cera del Quindío - Valle del Cocora - Parque del Café',
    rhyme: 'Quindío pequeñito y cafetero, con Armenia su eje verdadero'
  },
  'Risaralda': {
    mnemonic: 'RISARALDA = Región Industrial, Santa Area, Rosa Alba, Ladera Dorada Agrícola',
    visualAssociation: '🌹 Pequeño entre montañas - Eje Cafetero occidental',
    geographicTrick: 'EJE CAFETERO oeste - Entre Chocó y Caldas - Pereira comercial',
    culturalFact: 'Pereira comercial - Termales de Santa Rosa - Café y comercio unidos',
    rhyme: 'Risaralda con Pereira pujante, del Eje Cafetero elegante'
  },
  'San Andrés y Providencia': {
    mnemonic: 'SAN ANDRÉS = Sur Archipelago Notable / Azul Natural, Destino Regional, Éxito Soleado',
    visualAssociation: '🏝️ Islas en el mar Caribe - Muy lejos de la costa',
    geographicTrick: 'ISLAS CARIBE - 700km de la costa - Más cerca de Nicaragua',
    culturalFact: 'Mar de 7 colores - Cultura raizal - Reggae y calypso caribeño',
    rhyme: 'San Andrés isla de coral, mar de siete colores sin igual'
  },
  'Santander': {
    mnemonic: 'SANTANDER = Siempre Activo, Notable Tierra Andina, Natural Destino Económico Regional',
    visualAssociation: '⚡ Forma de rayo al noreste andino',
    geographicTrick: 'NORESTE andino - Cañón del Chicamocha - Bucaramanga bonita',
    culturalFact: 'Bucaramanga ciudad bonita - Hormiga culona - Parque Chicamocha',
    rhyme: 'Santander de cañones profundos, Bucaramanga de parques rotundos'
  },
  'Sucre': {
    mnemonic: 'SUCRE = Sur Unido Caribe, Regional Economía',
    visualAssociation: '🎺 Forma triangular al norte - Costa sabanera',
    geographicTrick: 'NORTE costero - Entre Córdoba y Bolívar - Sincelejo sabanero',
    culturalFact: 'Sincelejo de las corralejas - Fiestas del 20 de enero - Morroa artesanal',
    rhyme: 'Sucre sabanero y costero, con Sincelejo corralejero'
  },
  'Tolima': {
    mnemonic: 'TOLIMA = Tierra Original, Libertadora, Ilustre Musical Andina',
    visualAssociation: '🎸 Forma de guitarra en el centro andino',
    geographicTrick: 'CENTRO andino - Corazón de Colombia - Ibagué musical',
    culturalFact: 'Ibagué ciudad musical - Festival Folclórico - Nevado del Tolima',
    rhyme: 'Tolima musical del centro, con Ibagué su epicentro'
  },
  'Valle del Cauca': {
    mnemonic: 'VALLE DEL CAUCA = Verdadera Área Llanera, Linda Economía / Desarrollo Ejemplar, Logros / Centro Azucarero, Único Caleño Avance',
    visualAssociation: '💃 Rectángulo vertical al oeste - Valle entre cordilleras',
    geographicTrick: 'OESTE con Pacífico - Valle del río Cauca - Cali salsa capital',
    culturalFact: 'Cali capital de la salsa - Feria de Cali - Industria azucarera inmensa',
    rhyme: 'Valle del Cauca con Cali salsera, industria y baile a su manera'
  },
  'Vaupés': {
    mnemonic: 'VAUPÉS = Verde Área Única, Poblada Étnicamente Selvática',
    visualAssociation: '🦋 Forma de mariposa en el sureste amazónico',
    geographicTrick: 'SURESTE amazónico - Entre Guaviare y Amazonas - Mitú remoto',
    culturalFact: 'Mitú de los indígenas - Yuruparí sagrado - Selva prístina intacta',
    rhyme: 'Vaupés amazónico ancestral, con Mitú su capital cultural'
  },
  'Vichada': {
    mnemonic: 'VICHADA = Verde Inmensa, Costa Hídrica, Agreste Destino Ambiental',
    visualAssociation: '🦓 El segundo más grande - Forma de caballo al este',
    geographicTrick: 'ESTE puro - Segundo más grande - Puerto Carreño en el Orinoco',
    culturalFact: 'Puerto Carreño triple frontera - Sabanas infinitas - El Tuparro majestuoso',
    rhyme: 'Vichada inmenso oriental, sabanas hasta el final'
  }
};

// Helper function to get memory aid for a department
export function getMemoryAid(departmentName: string): MemoryAid | undefined {
  // Normalize the name to handle variations
  const normalizedName = departmentName
    .replace('Archipiélago de ', '')
    .replace(', Providencia y Santa Catalina', '')
    .trim();

  // Try exact match first
  if (departmentMemoryAids[normalizedName]) {
    return departmentMemoryAids[normalizedName];
  }

  // Try San Andrés variations
  if (normalizedName.includes('San Andrés')) {
    return departmentMemoryAids['San Andrés y Providencia'];
  }

  return undefined;
}

// Get a random memory tip for quick display
export function getRandomMemoryTip(departmentName: string): string {
  const aid = getMemoryAid(departmentName);
  if (!aid) return '';

  const tips = [
    aid.mnemonic,
    aid.visualAssociation,
    aid.geographicTrick,
    aid.culturalFact,
    aid.rhyme
  ].filter(tip => tip);

  return tips[Math.floor(Math.random() * tips.length)] || '';
}