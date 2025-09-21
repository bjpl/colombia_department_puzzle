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
    mnemonic: 'AMAZONAS = Ancient Many Amazon Nations, Ancient Societies',
    visualAssociation: '🐬 Triángulo verde con delfines rosados en el río Amazonas - 40+ grupos indígenas',
    geographicTrick: 'El MÁS GRANDE (9.6% del país) - frontera triple Brasil/Perú - solo por aire o río',
    culturalFact: 'Hogar de 40+ etnias indígenas, delfines rosados del Amazonas, y 3,000+ especies de plantas identificadas',
    rhyme: 'Amazonas gigante y biodiverso, 40 etnias en universo'
  },
  'Antioquia': {
    mnemonic: 'ANTIOQUIA = Amazing Nationwide Transformation, Innovation, Outstanding Quality, Unlimited Achievement',
    visualAssociation: '🌺 Mariposa irregular en el noroeste - Medellín "Ciudad de la Eterna Primavera"',
    geographicTrick: 'NOROESTE - 13% del PIB nacional - Primer metro de Colombia - Entre dos océanos',
    culturalFact: 'Feria de las Flores (festival mundial), Fernando Botero, Medellín única ciudad con metro y metrocable, herencia vasca 15%',
    rhyme: 'Antioquia de flores eternas, con paisas y montañas alternas'
  },
  'Arauca': {
    mnemonic: 'ARAUCA = Amazing Rivers And Unlimited Cattle Areas',
    visualAssociation: '🌉 Puente José Antonio Páez (uno de los más largos de Sudamérica) - llanuras infinitas',
    geographicTrick: 'FRONTERA venezolana - Tormentas visibles desde 50km - Petróleo desde 1980s',
    culturalFact: 'Puente José Antonio Páez internacional, cultura llanera-venezolana, joropo con arpa y maracas, caballos salvajes libres',
    rhyme: 'Arauca del puente gigante, con llaneros y petróleo abundante'
  },
  'Atlántico': {
    mnemonic: 'ATLÁNTICO = Amazing Traditional Lively Area, Nonstop Traditional International Carnival Occasion',
    visualAssociation: '🎭 Delta del Magdalena con figuras de carnaval: Marimonda, Congo, y Rey Momo',
    geographicTrick: 'MÁS PEQUEÑO pero MÁS DENSO - Desembocadura Magdalena - Tercer puerto marítimo',
    culturalFact: 'Carnaval UNESCO (2008), cuna del merecumbé, Shakira nativa, Santa Verónica parapente, Barranquilla "Puerta de Oro"',
    rhyme: 'Atlántico pequeño y alegre, con carnaval que siempre celebre'
  },
  'Bolívar': {
    mnemonic: 'BOLÍVAR = Beautiful Outstanding Legacy, International Victory, Amazing Regional',
    visualAssociation: '🏴‍☠️ Castillo San Felipe (fortaleza más grande de América) defendiendo contra piratas',
    geographicTrick: 'PATRIMONIO UNESCO 1984 - Murallas de 11km - Resistió Francis Drake y Vernon',
    culturalFact: 'Puerto Hormiga (7000 AC primera comunidad), Castillo San Felipe fortaleza mayor de América, García Márquez inspirado aquí',
    rhyme: 'Bolívar heroico y colonial, con Cartagena patrimonial'
  },
  'Boyacá': {
    mnemonic: 'BOYACÁ = Birthplace Of Yesterday\'s Amazing Colombian Achievement',
    visualAssociation: '🌉 Puente de Boyacá donde nació la libertad - Villa de Leyva plaza gigante (14,000 m²)',
    geographicTrick: 'TIERRA DE LA LIBERTAD - 7 de agosto 1819 - Páramos 25% del territorio',
    culturalFact: 'Batalla de Boyacá independencia, Villa de Leyva plaza mayor de Latinoamérica, FIC festival cultural desde 1973, Lago Tota más grande',
    rhyme: 'Boyacá cuna de la libertad, con páramos y gran ciudad'
  },
  'Caldas': {
    mnemonic: 'CALDAS = Coffee And Landscapes Declared Amazing Scenery',
    visualAssociation: '🌋 Nevado del Ruiz vigilando plantaciones de café - "Ciudad de Puertas Abiertas"',
    geographicTrick: 'PAISAJE CULTURAL UNESCO 2011 - 47% producción nacional café 1950s - Carnaval del Diablo Riosucio',
    culturalFact: 'Paisaje Cultural Cafetero UNESCO, Feria de Manizales enero, Carnaval del Diablo cada 2 años, Manizales "Puertas Abiertas"',
    rhyme: 'Caldas del café y el volcán, con feria que nunca se irán'
  },
  'Caquetá': {
    mnemonic: 'CAQUETÁ = Colombian Amazon, Quality Unique Environmental Territory Area',
    visualAssociation: '🛶 Canoas tradicionales en ríos amazónicos - transición Andes-Amazon',
    geographicTrick: 'PUERTA AL AMAZONAS - Florencia fundada 1902 - Canoas transporte común',
    culturalFact: 'Portal del Amazonas colombiano, Florencia fundada por colonos, transporte en canoa tradicional, especies únicas endémicas',
    rhyme: 'Caquetá puerta amazónica, con Florencia su crónica'
  },
  'Casanare': {
    mnemonic: 'CASANARE = Cattle Areas, Sports And New Achievement, Ranching Excellence',
    visualAssociation: '🤠 Coleo llanero (derribo del toro por la cola) - Yopal ciudad petrolera moderna',
    geographicTrick: 'CORAZÓN LLANERO - Boom petrolero 1970s-80s - Ganadería generacional',
    culturalFact: 'Epicentro cultura llanera, coleo deporte tradicional, Yopal transformado por petróleo, estaciones extremas húmeda/seca',
    rhyme: 'Casanare del coleo y el llano, con petróleo de la mano'
  },
  'Cauca': {
    mnemonic: 'CAUCA = Coast And Unique Cultural Ancestry',
    visualAssociation: '🎵 Marimba del Pacífico (UNESCO 2015) con poblaciones afrocolombianas',
    geographicTrick: 'PACÍFICO + ANDES - Masivo Colombiano - Currulao y bambuco origen',
    culturalFact: 'Música marimba UNESCO, bambuco origen esclavos africanos, Masivo Colombiano nacimiento Magdalena, cultura multicultural',
    rhyme: 'Cauca de marimba y montaña, con culturas que se acompañan'
  },
  'Cesar': {
    mnemonic: 'CESAR = Cultural Expression, Sounds And Rhythms',
    visualAssociation: '🪗 Acordeón alemán + caja africana + guacharaca indígena = vallenato perfecto',
    geographicTrick: 'VALLENATO UNESCO 2015 - "Nacido en el valle" - Sierra Nevada + Serranía Perijá',
    culturalFact: 'Vallenato UNESCO Patrimonio, fusión 3 culturas instrumentos, Festival Leyenda desde 1968, Rey Vallenato anual',
    rhyme: 'Cesar del vallenato ancestral, con festival internacional'
  },
  'Chocó': {
    mnemonic: 'CHOCÓ = Champion Humid Outstanding, Cultural Origin',
    visualAssociation: '🌧️ Lloró (13,300mm lluvia récord) + marimba UNESCO + 82.1% afrocolombianos',
    geographicTrick: 'LUGAR MÁS LLUVIOSO MUNDIAL - 7,000 especies - 96% tierra colectiva indígena/afro',
    culturalFact: 'Lloró récord mundial lluvia, marimba UNESCO 2015, 82.1% población afro, biodiversidad 25% especies endémicas',
    rhyme: 'Chocó del récord pluvial, con marimba cultural'
  },
  'Córdoba': {
    mnemonic: 'CÓRDOBA = Con Ó-ptima Región, Domina Oro, Buen Agro',
    visualAssociation: '🐮 Forma irregular alargada al norte - Ganadería extensiva',
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
    visualAssociation: '🦜 Forma irregular en el extremo este amazónico',
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
    visualAssociation: '🏔️ Forma alargada diagonal en el sur andino',
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
    visualAssociation: '🌴 Forma irregular costero al norte - Entre río y mar',
    geographicTrick: 'NORTE caribeño - Entre río y mar - Santa Marta la más antigua',
    culturalFact: 'Santa Marta ciudad más antigua - Sierra Nevada sagrada - Tayrona ancestral',
    rhyme: 'Magdalena con Santa Marta antigua, donde la Sierra Nevada se distingue'
  },
  'Meta': {
    mnemonic: 'META = Most Extraordinary Tourism Attraction',
    visualAssociation: '🌈 Caño Cristales "Río de 5 Colores" - plantas acuáticas únicas crean colores',
    geographicTrick: 'CAÑO CRISTALES ÚNICO MUNDIAL - Puerta del Llano - Orinoco conexión Atlántico',
    culturalFact: 'Caño Cristales río 5 colores plantas únicas, Villavicencio "Puerta del Llano", Meta conecta Orinoco-Atlántico, festival llanero mayor',
    rhyme: 'Meta del río multicolor, Villavicencio su esplendor'
  },
  'Nariño': {
    mnemonic: 'NARIÑO = Natural Area, Remarkable International Neighbor, Outstanding',
    visualAssociation: '🐋 Ballenas jorobadas (junio-noviembre) + único departamento frontera Ecuador',
    geographicTrick: 'ÚNICA FRONTERA ECUADOR - Manatí Pacífico hábitat - Proyectos binacionales 2024',
    culturalFact: 'Único departamento frontera Ecuador, santuario ballenas jorobadas, hábitat manatí Pacífico, proyectos conservación binacionales 2024',
    rhyme: 'Nariño del Ecuador frontera, con ballenas y costa sera'
  },
  'Norte de Santander': {
    mnemonic: 'NORTE DE SANTANDER = Northern Department, Strategic Area, Notable Trading, Amazing National Development, Economic Region',
    visualAssociation: '🌉 Puente Simón Bolívar internacional + cuna Gran Colombia',
    geographicTrick: 'CUNA GRAN COLOMBIA - Puente Simón Bolívar frontera - Batalla Cúcuta histórica',
    culturalFact: 'Cúcuta cuna Gran Colombia, Puente Simón Bolívar internacional, batalla histórica Cúcuta independencia, paso comercial Venezuela',
    rhyme: 'Norte de Santander fronterizo, con Cúcuta histórico preciso'
  },
  'Putumayo': {
    mnemonic: 'PUTUMAYO = Powerful Unique Territory, Amazing Medicine, Amazing Yagé Origin',
    visualAssociation: '🌿 Valle de Sibundoy oasis alta montaña + yagé ceremonias ancestrales',
    geographicTrick: 'VALLE SIBUNDOY OASIS - Yagé ceremonial siglos - Inga maestros instrumentos',
    culturalFact: 'Valle Sibundoy oasis alta montaña Amazonas, Inga maestros instrumentos tradicionales, yagé ceremonias espirituales siglos, microclima único',
    rhyme: 'Putumayo del valle sagrado, con yagé ceremonial heredado'
  },
  'Quindío': {
    mnemonic: 'QUINDÍO = Quality Unique Natural Department, International Outstanding',
    visualAssociation: '🌴 Palma de cera Quindío (árbol nacional) Valle Cocora + Parque Nacional del Café',
    geographicTrick: 'SEGUNDO MÁS PEQUEÑO (1,845 km²) - Palma cera árbol nacional - UNESCO Coffee Triangle',
    culturalFact: 'Segundo departamento más pequeño, palma cera Quindío árbol nacional Colombia, Valle Cocora paisaje icónico, Parque Nacional del Café tema',
    rhyme: 'Quindío de palmas gigantes, con café y paisajes elegantes'
  },
  'Risaralda': {
    mnemonic: 'RISARALDA = Regional Industrial, Strategic Area, Rich Agriculture, Landscape Development Area',
    visualAssociation: '🏔️ Pereira "Perla del Otún" suelo volcánico ideal café + festivals cafeteros',
    geographicTrick: 'COFFEE TRIANGLE COMPONENT - Suelo volcánico ideal - Pereira "Perla del Otún"',
    culturalFact: 'Componente Coffee Triangle UNESCO, suelo volcánico ideal cultivo café, Pereira "Perla del Otún", festivals cafeteros mayores',
    rhyme: 'Risaralda perla del Otún, con café volcánico común'
  },
  'San Andrés y Providencia': {
    mnemonic: 'SAN ANDRÉS = Smallest Area, Notable Department, Raizal English Speaking',
    visualAssociation: '🗣️ Única región anglófona Colombia + cultura raizal afrocaribeña + Reserva Seaflower',
    geographicTrick: 'MÁS PEQUEÑO (52 km²) - Única región anglófona - Reserva Biosfera Seaflower',
    culturalFact: 'Departamento más pequeño Colombia, única región anglófona, cultura raizal afrocaribeña, Reserva Biosfera Seaflower protege corales',
    rhyme: 'San Andrés anglófono y coral, cultura raizal sin igual'
  },
  'Santander': {
    mnemonic: 'SANTANDER = Spectacular Adventure, Natural Territory, Amazing Natural Destination, Extreme Recreation',
    visualAssociation: '🏞️ Cañón Chicamocha espectacular + Barichara "Pueblo Más Bello" + deportes extremos',
    geographicTrick: 'CAÑÓN CHICAMOCHA ESPECTACULAR - Barichara colonial "Más Bello" - Capital deportes extremos',
    culturalFact: 'Cañón Chicamocha espectacular, Barichara "Pueblo Más Bello Colombia" colonial, capital deportes extremos aventura',
    rhyme: 'Santander del cañón profundo, Barichara pueblo del mundo'
  },
  'Sucre': {
    mnemonic: 'SUCRE = Smallest Unique Caribbean Region, Established',
    visualAssociation: '🎊 Departamento más joven Caribe (1966) + héroe Antonio José de Sucre + corralejas',
    geographicTrick: 'MÁS JOVEN CARIBE (1966) - Nombrado héroe Sucre - Corralejas tradicionales',
    culturalFact: 'Departamento caribeño más joven creado 1966, nombrado héroe independencia Antonio José de Sucre, famoso corralejas festivales tradicionales',
    rhyme: 'Sucre del héroe y tradición, corralejas su emoción'
  },
  'Tolima': {
    mnemonic: 'TOLIMA = Top Outstanding Land, International Musical Achievement',
    visualAssociation: '🎵 Ibagué "Capital Musical Colombia" + Festival Nacional Bambuco UNESCO + Sanjuanero Huilense',
    geographicTrick: 'CAPITAL MUSICAL COLOMBIA - Festival Bambuco UNESCO 2006 - Sanjuanero Huilense danza',
    culturalFact: 'Ibagué Capital Musical Colombia, Festival Nacional Bambuco UNESCO Patrimonio Cultural 2006, cuna danza Sanjuanero Huilense',
    rhyme: 'Tolima capital musical, con bambuco patrimonial'
  },
  'Valle del Cauca': {
    mnemonic: 'VALLE DEL CAUCA = Vast Area, Largest Latin Export, Dynamic Economy, Capital Amazing, Unique Commercial Achievement',
    visualAssociation: '💃 Cali "Capital Mundial Salsa" + UNESCO Gastronomía + Buenaventura 60% comercio marítimo',
    geographicTrick: 'CALI CAPITAL MUNDIAL SALSA - UNESCO Ciudad Gastronomía 2017 - Buenaventura 60% comercio mar',
    culturalFact: 'Cali Capital Mundial Salsa, UNESCO Ciudad Gastronomía 2017, Buenaventura maneja 60% comercio marítimo Colombia, produce 75% azúcar',
    rhyme: 'Valle del Cauca salsero total, con Buenaventura comercial'
  },
  'Vaupés': {
    mnemonic: 'VAUPÉS = Very Amazing Unique Place, Ethnically Spectacular',
    visualAssociation: '🏘️ 27 grupos étnicos + 95% población indígena + malocas tradicionales + solo acceso aéreo',
    geographicTrick: 'REGIÓN MÁS DIVERSA CULTURALMENTE - 27 etnias - 95% indígena - Solo acceso aéreo',
    culturalFact: 'Región más diversa culturalmente mundo: 27 grupos étnicos, 95% población indígena, malocas comunales tradicionales, Mitú solo acceso aéreo',
    rhyme: 'Vaupés de culturas sin par, solo por aire llegar'
  },
  'Vichada': {
    mnemonic: 'VICHADA = Vast Immense, Challenging Habitat, Amazing Destination Area',
    visualAssociation: '🐬 Delfines Orinoco visibles + segundo más grande + menos poblado + acceso aéreo/fluvial',
    geographicTrick: 'SEGUNDO MÁS GRANDE - Menos poblado Colombia - Delfines Orinoco visibles capital',
    culturalFact: 'Segundo departamento más grande Colombia, uno de los menos poblados, Puerto Carreño acceso aéreo/fluvial, delfines Orinoco visibles',
    rhyme: 'Vichada gigante y remoto, con delfines del Orinoco'
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