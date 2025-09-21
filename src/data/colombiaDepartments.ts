export interface Department {
  id: string;
  name: string;
  capital: string;
  area: number; // km²
  population: number;
  region: string;
  trivia: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const colombiaDepartments: Department[] = [
  {
    id: 'amazonas',
    name: 'Amazonas',
    capital: 'Leticia',
    area: 109665,
    population: 79020,
    region: 'Amazonía',
    trivia: 'Largest department covering 9.6% of Colombia, home to over 40 indigenous groups and pink river dolphins in the Amazon River',
    coordinates: { lat: -1.2154, lng: -71.9475 }
  },
  {
    id: 'antioquia',
    name: 'Antioquia',
    capital: 'Medellín',
    area: 63612,
    population: 6677930,
    region: 'Andina',
    trivia: 'Contributes 13% of Colombia\'s GDP, hosts world\'s largest flower festival (Feria de las Flores), and birthplace of "paisa" culture',
    coordinates: { lat: 6.2442, lng: -75.5812 }
  },
  {
    id: 'arauca',
    name: 'Arauca',
    capital: 'Arauca',
    area: 23818,
    population: 273321,
    region: 'Orinoquía',
    trivia: 'Home to José Antonio Páez Bridge (one of South America\'s longest), where plains are so flat you can see storms from 50km away',
    coordinates: { lat: 7.0847, lng: -70.7597 }
  },
  {
    id: 'atlantico',
    name: 'Atlántico',
    capital: 'Barranquilla',
    area: 3388,
    population: 2722128,
    region: 'Caribe',
    trivia: 'Home to Barranquilla Carnival (UNESCO Intangible Heritage 2008), birthplace of Shakira, and Colombia\'s main Caribbean port',
    coordinates: { lat: 10.9878, lng: -74.7889 }
  },
  {
    id: 'bolivar',
    name: 'Bolívar',
    capital: 'Cartagena de Indias',
    area: 25978,
    population: 2180976,
    region: 'Caribe',
    trivia: 'Cartagena features South America\'s most extensive fortifications (UNESCO 1984) and Castillo San Felipe - largest Spanish fort in the Americas',
    coordinates: { lat: 10.3910, lng: -75.4794 }
  },
  {
    id: 'boyaca',
    name: 'Boyacá',
    capital: 'Tunja',
    area: 23189,
    population: 1242731,
    region: 'Andina',
    trivia: '"Land of Freedom" where Battle of Boyacá (Aug 7, 1819) secured Colombian independence, home to Villa de Leyva\'s 14,000 sq meter plaza',
    coordinates: { lat: 5.5353, lng: -73.3678 }
  },
  {
    id: 'caldas',
    name: 'Caldas',
    capital: 'Manizales',
    area: 7888,
    population: 1018453,
    region: 'Andina',
    trivia: 'UNESCO Coffee Cultural Landscape (2011), part of Coffee Triangle producing 47% of Colombia\'s coffee, home to active Nevado del Ruiz volcano',
    coordinates: { lat: 5.0689, lng: -75.5174 }
  },
  {
    id: 'caqueta',
    name: 'Caquetá',
    capital: 'Florencia',
    area: 88965,
    population: 410521,
    region: 'Amazonía',
    trivia: 'Gateway to Colombian Amazon where colonists founded Florencia in 1902, features transition from Andes to Amazon rainforest',
    coordinates: { lat: 1.6144, lng: -75.6062 }
  },
  {
    id: 'casanare',
    name: 'Casanare',
    capital: 'Yopal',
    area: 44640,
    population: 420504,
    region: 'Orinoquía',
    trivia: 'Oil boom transformed Yopal from small town to modern city, heartland of llanero cowboy culture and traditional coleo sport',
    coordinates: { lat: 5.3378, lng: -72.3959 }
  },
  {
    id: 'cauca',
    name: 'Cauca',
    capital: 'Popayán',
    area: 29308,
    population: 1491937,
    region: 'Pacífico',
    trivia: 'Popayán "White City" famous for Easter processions, bambuco music originated here from African slaves, part of Pacific biodiversity hotspot',
    coordinates: { lat: 2.4419, lng: -76.6060 }
  },
  {
    id: 'cesar',
    name: 'Cesar',
    capital: 'Valledupar',
    area: 22905,
    population: 1295387,
    region: 'Caribe',
    trivia: 'Birthplace of vallenato music (UNESCO Intangible Heritage 2015), literally means "born in the valley" between two mountain ranges',
    coordinates: { lat: 10.4631, lng: -73.2532 }
  },
  {
    id: 'choco',
    name: 'Chocó',
    capital: 'Quibdó',
    area: 46530,
    population: 544764,
    region: 'Pacífico',
    trivia: 'Lloró holds world rainfall record at 13,300mm annually - Earth\'s wettest inhabited place, marimba music UNESCO Heritage 2015',
    coordinates: { lat: 5.6919, lng: -76.6584 }
  },
  {
    id: 'cordoba',
    name: 'Córdoba',
    capital: 'Montería',
    area: 25020,
    population: 1828947,
    region: 'Caribe',
    trivia: 'Home to iconic sombrero vueltiao made by Zenú people from caña flecha palm, ancient Zenú engineered sophisticated flood control systems',
    coordinates: { lat: 8.7479, lng: -75.8814 }
  },
  {
    id: 'cundinamarca',
    name: 'Cundinamarca',
    capital: 'Bogotá',
    area: 24210,
    population: 3242999,
    region: 'Andina',
    trivia: 'Home to Zipaquirá Salt Cathedral "First Wonder of Colombia", El Dorado legend origins, and world\'s largest emerald deposits',
    coordinates: { lat: 4.5709, lng: -74.2973 }
  },
  {
    id: 'guainia',
    name: 'Guainía',
    capital: 'Inírida',
    area: 72238,
    population: 50636,
    region: 'Amazonía',
    trivia: 'Features unique Estrella Fluvial del Oriente river formation, Inírida accessible only by aircraft, ancient rock paintings throughout region',
    coordinates: { lat: 3.8653, lng: -67.9239 }
  },
  {
    id: 'guaviare',
    name: 'Guaviare',
    capital: 'San José del Guaviare',
    area: 53460,
    population: 86657,
    region: 'Amazonía',
    trivia: 'Home to 75,000-year-old rock paintings in Chiribiquete (UNESCO World Heritage), gateway to viewing ancient indigenous art',
    coordinates: { lat: 2.5728, lng: -72.6459 }
  },
  {
    id: 'huila',
    name: 'Huila',
    capital: 'Neiva',
    area: 19890,
    population: 1122622,
    region: 'Andina',
    trivia: 'Colombia\'s largest coffee producer (18% national output), birthplace of Magdalena River, San Agustín UNESCO archaeological site',
    coordinates: { lat: 2.9273, lng: -75.2819 }
  },
  {
    id: 'la-guajira',
    name: 'La Guajira',
    capital: 'Riohacha',
    area: 20848,
    population: 965718,
    region: 'Caribe',
    trivia: 'Northernmost point of South America at Punta Gallinas, Wayuu people (270,414 indigenous), produces 70% of Colombia\'s salt in Manaure',
    coordinates: { lat: 11.5444, lng: -72.9072 }
  },
  {
    id: 'magdalena',
    name: 'Magdalena',
    capital: 'Santa Marta',
    area: 23188,
    population: 1427026,
    region: 'Caribe',
    trivia: 'Santa Marta oldest surviving Colombian city (1525), world\'s highest coastal mountain range (Sierra Nevada 5,775m), Simón Bolívar died here',
    coordinates: { lat: 11.2408, lng: -74.1990 }
  },
  {
    id: 'meta',
    name: 'Meta',
    capital: 'Villavicencio',
    area: 85635,
    population: 1063454,
    region: 'Orinoquía',
    trivia: '"Gateway to the Llanos", home to Caño Cristales "River of Five Colors" caused by unique aquatic plants, joropo music capital',
    coordinates: { lat: 4.1420, lng: -73.6266 }
  },
  {
    id: 'narino',
    name: 'Nariño',
    capital: 'Pasto',
    area: 33268,
    population: 1630592,
    region: 'Pacífico',
    trivia: 'Only department bordering Ecuador, home to Las Lajas Sanctuary, Carnaval de Negros y Blancos, humpback whale watching destination',
    coordinates: { lat: 1.2136, lng: -77.2811 }
  },
  {
    id: 'norte-santander',
    name: 'Norte de Santander',
    capital: 'Cúcuta',
    area: 21658,
    population: 1620318,
    region: 'Andina',
    trivia: 'Border with Venezuela, birthplace of Gran Colombia, historic Cúcuta Congress established the union of Colombia, Venezuela, and Ecuador',
    coordinates: { lat: 7.8891, lng: -72.4967 }
  },
  {
    id: 'putumayo',
    name: 'Putumayo',
    capital: 'Mocoa',
    area: 24885,
    population: 359127,
    region: 'Amazonía',
    trivia: 'Sibundoy Valley is high-altitude Amazon oasis, Inga people master traditional instruments, yagé (ayahuasca) ceremonial traditions',
    coordinates: { lat: 1.1492, lng: -76.6526 }
  },
  {
    id: 'quindio',
    name: 'Quindío',
    capital: 'Armenia',
    area: 1845,
    population: 600765,
    region: 'Andina',
    trivia: 'Second smallest department (1,845 km²), heart of Coffee Triangle UNESCO site, home to National Coffee Park theme park',
    coordinates: { lat: 4.5339, lng: -75.6811 }
  },
  {
    id: 'risaralda',
    name: 'Risaralda',
    capital: 'Pereira',
    area: 4140,
    population: 961055,
    region: 'Andina',
    trivia: 'Coffee Triangle component with ideal volcanic soil for coffee, Pereira called "Pearl of Otún", hosts major coffee festivals',
    coordinates: { lat: 4.8133, lng: -75.6961 }
  },
  {
    id: 'san-andres',
    name: 'San Andrés y Providencia',
    capital: 'San Andrés',
    area: 52,
    population: 63692,
    region: 'Insular',
    trivia: 'Smallest department (52 km²), only English-speaking region in Colombia, Raizal Afro-Caribbean culture, Seaflower Biosphere Reserve',
    coordinates: { lat: 12.5847, lng: -81.7006 }
  },
  {
    id: 'santander',
    name: 'Santander',
    capital: 'Bucaramanga',
    area: 30537,
    population: 2280908,
    region: 'Andina',
    trivia: 'Home to spectacular Chicamocha Canyon, colonial Barichara "Most Beautiful Town in Colombia", extreme sports adventure capital',
    coordinates: { lat: 7.1193, lng: -73.1227 }
  },
  {
    id: 'sucre',
    name: 'Sucre',
    capital: 'Sincelejo',
    area: 10917,
    population: 949252,
    region: 'Caribe',
    trivia: 'Youngest Caribbean department (created 1966), named after independence hero Antonio José de Sucre, famous for traditional corralejas festivals',
    coordinates: { lat: 9.3047, lng: -75.3978 }
  },
  {
    id: 'tolima',
    name: 'Tolima',
    capital: 'Ibagué',
    area: 23562,
    population: 1339998,
    region: 'Andina',
    trivia: 'Musical Capital of Colombia, birthplace of National Bambuco Festival (UNESCO Cultural Heritage 2006), Sanjuanero Huilense dance',
    coordinates: { lat: 4.4389, lng: -75.2322 }
  },
  {
    id: 'valle-del-cauca',
    name: 'Valle del Cauca',
    capital: 'Cali',
    area: 22140,
    population: 4475886,
    region: 'Pacífico',
    trivia: 'Cali "World Salsa Capital" and UNESCO City of Gastronomy (2017), Buenaventura handles 60% of Colombia\'s sea trade, produces 75% of sugar',
    coordinates: { lat: 3.4516, lng: -76.5320 }
  },
  {
    id: 'vaupes',
    name: 'Vaupés',
    capital: 'Mitú',
    area: 54135,
    population: 44712,
    region: 'Amazonía',
    trivia: 'World\'s most culturally diverse small region: 27 ethnic groups, 95% indigenous population, Mitú accessible only by airplane',
    coordinates: { lat: 1.2555, lng: -70.2348 }
  },
  {
    id: 'vichada',
    name: 'Vichada',
    capital: 'Puerto Carreño',
    area: 100242,
    population: 112958,
    region: 'Orinoquía',
    trivia: 'Second largest department, one of Colombia\'s least populated, Puerto Carreño accessible mainly by air or river, Orinoco dolphins visible',
    coordinates: { lat: 6.1892, lng: -67.4859 }
  },
  {
    id: 'bogota',
    name: 'Bogotá D.C.',
    capital: 'Bogotá',
    area: 1775,
    population: 7743955,
    region: 'Andina',
    trivia: 'Third highest capital in the world (2,640m), contributes 25% of Colombia\'s GDP, Gold Museum holds world\'s largest pre-Columbian collection',
    coordinates: { lat: 4.7110, lng: -74.0721 }
  }
];