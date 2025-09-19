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
    trivia: 'El departamento más grande de Colombia con el 9.6% del territorio nacional',
    coordinates: { lat: -1.2154, lng: -71.9475 }
  },
  {
    id: 'antioquia',
    name: 'Antioquia',
    capital: 'Medellín',
    area: 63612,
    population: 6677930,
    region: 'Andina',
    trivia: 'Segundo departamento más poblado y cuna de la cultura paisa',
    coordinates: { lat: 6.2442, lng: -75.5812 }
  },
  {
    id: 'arauca',
    name: 'Arauca',
    capital: 'Arauca',
    area: 23818,
    population: 273321,
    region: 'Orinoquía',
    trivia: 'Conocido por su cultura llanera y el puente internacional José Antonio Páez',
    coordinates: { lat: 7.0847, lng: -70.7597 }
  },
  {
    id: 'atlantico',
    name: 'Atlántico',
    capital: 'Barranquilla',
    area: 3388,
    population: 2722128,
    region: 'Caribe',
    trivia: 'Sede del Carnaval de Barranquilla, Patrimonio de la Humanidad',
    coordinates: { lat: 10.9878, lng: -74.7889 }
  },
  {
    id: 'bolivar',
    name: 'Bolívar',
    capital: 'Cartagena de Indias',
    area: 25978,
    population: 2180976,
    region: 'Caribe',
    trivia: 'Cartagena es Patrimonio de la Humanidad por la UNESCO desde 1984',
    coordinates: { lat: 10.3910, lng: -75.4794 }
  },
  {
    id: 'boyaca',
    name: 'Boyacá',
    capital: 'Tunja',
    area: 23189,
    population: 1242731,
    region: 'Andina',
    trivia: 'Cuna de la independencia con la Batalla del Puente de Boyacá',
    coordinates: { lat: 5.5353, lng: -73.3678 }
  },
  {
    id: 'caldas',
    name: 'Caldas',
    capital: 'Manizales',
    area: 7888,
    population: 1018453,
    region: 'Andina',
    trivia: 'Parte del Eje Cafetero, Patrimonio Cultural de la Humanidad',
    coordinates: { lat: 5.0689, lng: -75.5174 }
  },
  {
    id: 'caqueta',
    name: 'Caquetá',
    capital: 'Florencia',
    area: 88965,
    population: 410521,
    region: 'Amazonía',
    trivia: 'Puerta de entrada al Amazonas colombiano',
    coordinates: { lat: 1.6144, lng: -75.6062 }
  },
  {
    id: 'casanare',
    name: 'Casanare',
    capital: 'Yopal',
    area: 44640,
    population: 420504,
    region: 'Orinoquía',
    trivia: 'Importante productor de petróleo y ganadería extensiva',
    coordinates: { lat: 5.3378, lng: -72.3959 }
  },
  {
    id: 'cauca',
    name: 'Cauca',
    capital: 'Popayán',
    area: 29308,
    population: 1491937,
    region: 'Pacífico',
    trivia: 'Popayán es conocida como la Ciudad Blanca de Colombia',
    coordinates: { lat: 2.4419, lng: -76.6060 }
  },
  {
    id: 'cesar',
    name: 'Cesar',
    capital: 'Valledupar',
    area: 22905,
    population: 1295387,
    region: 'Caribe',
    trivia: 'Capital mundial del vallenato con su festival anual',
    coordinates: { lat: 10.4631, lng: -73.2532 }
  },
  {
    id: 'choco',
    name: 'Chocó',
    capital: 'Quibdó',
    area: 46530,
    population: 544764,
    region: 'Pacífico',
    trivia: 'Uno de los lugares más lluviosos del mundo',
    coordinates: { lat: 5.6919, lng: -76.6584 }
  },
  {
    id: 'cordoba',
    name: 'Córdoba',
    capital: 'Montería',
    area: 25020,
    population: 1828947,
    region: 'Caribe',
    trivia: 'Famoso por su ganadería y el sombrero vueltiao',
    coordinates: { lat: 8.7479, lng: -75.8814 }
  },
  {
    id: 'cundinamarca',
    name: 'Cundinamarca',
    capital: 'Bogotá',
    area: 24210,
    population: 3242999,
    region: 'Andina',
    trivia: 'Rodea a Bogotá D.C., la capital del país',
    coordinates: { lat: 4.5709, lng: -74.2973 }
  },
  {
    id: 'guainia',
    name: 'Guainía',
    capital: 'Inírida',
    area: 72238,
    population: 50636,
    region: 'Amazonía',
    trivia: 'Famoso por la Estrella Fluvial del Oriente',
    coordinates: { lat: 3.8653, lng: -67.9239 }
  },
  {
    id: 'guaviare',
    name: 'Guaviare',
    capital: 'San José del Guaviare',
    area: 53460,
    population: 86657,
    region: 'Amazonía',
    trivia: 'Hogar de las pinturas rupestres del Chiribiquete',
    coordinates: { lat: 2.5728, lng: -72.6459 }
  },
  {
    id: 'huila',
    name: 'Huila',
    capital: 'Neiva',
    area: 19890,
    population: 1122622,
    region: 'Andina',
    trivia: 'Lugar del desierto de la Tatacoa y San Agustín',
    coordinates: { lat: 2.9273, lng: -75.2819 }
  },
  {
    id: 'la-guajira',
    name: 'La Guajira',
    capital: 'Riohacha',
    area: 20848,
    population: 965718,
    region: 'Caribe',
    trivia: 'Punto más septentrional de Suramérica en Punta Gallinas',
    coordinates: { lat: 11.5444, lng: -72.9072 }
  },
  {
    id: 'magdalena',
    name: 'Magdalena',
    capital: 'Santa Marta',
    area: 23188,
    population: 1427026,
    region: 'Caribe',
    trivia: 'Santa Marta es la ciudad más antigua de Colombia (1525)',
    coordinates: { lat: 11.2408, lng: -74.1990 }
  },
  {
    id: 'meta',
    name: 'Meta',
    capital: 'Villavicencio',
    area: 85635,
    population: 1063454,
    region: 'Orinoquía',
    trivia: 'Puerta del Llano y hogar de Caño Cristales',
    coordinates: { lat: 4.1420, lng: -73.6266 }
  },
  {
    id: 'narino',
    name: 'Nariño',
    capital: 'Pasto',
    area: 33268,
    population: 1630592,
    region: 'Pacífico',
    trivia: 'Hogar del Santuario de Las Lajas y el Carnaval de Negros y Blancos',
    coordinates: { lat: 1.2136, lng: -77.2811 }
  },
  {
    id: 'norte-santander',
    name: 'Norte de Santander',
    capital: 'Cúcuta',
    area: 21658,
    population: 1620318,
    region: 'Andina',
    trivia: 'Frontera con Venezuela y cuna de la Gran Colombia',
    coordinates: { lat: 7.8891, lng: -72.4967 }
  },
  {
    id: 'putumayo',
    name: 'Putumayo',
    capital: 'Mocoa',
    area: 24885,
    population: 359127,
    region: 'Amazonía',
    trivia: 'Conocido por el Valle de Sibundoy y su diversidad étnica',
    coordinates: { lat: 1.1492, lng: -76.6526 }
  },
  {
    id: 'quindio',
    name: 'Quindío',
    capital: 'Armenia',
    area: 1845,
    population: 600765,
    region: 'Andina',
    trivia: 'El departamento más pequeño después de San Andrés',
    coordinates: { lat: 4.5339, lng: -75.6811 }
  },
  {
    id: 'risaralda',
    name: 'Risaralda',
    capital: 'Pereira',
    area: 4140,
    population: 961055,
    region: 'Andina',
    trivia: 'Parte del Eje Cafetero y hogar del Parque del Café',
    coordinates: { lat: 4.8133, lng: -75.6961 }
  },
  {
    id: 'san-andres',
    name: 'San Andrés y Providencia',
    capital: 'San Andrés',
    area: 52,
    population: 63692,
    region: 'Insular',
    trivia: 'El departamento más pequeño y el único insular de Colombia',
    coordinates: { lat: 12.5847, lng: -81.7006 }
  },
  {
    id: 'santander',
    name: 'Santander',
    capital: 'Bucaramanga',
    area: 30537,
    population: 2280908,
    region: 'Andina',
    trivia: 'Hogar del Cañón del Chicamocha y Barichara',
    coordinates: { lat: 7.1193, lng: -73.1227 }
  },
  {
    id: 'sucre',
    name: 'Sucre',
    capital: 'Sincelejo',
    area: 10917,
    population: 949252,
    region: 'Caribe',
    trivia: 'Conocido por las artesanías y las corralejas',
    coordinates: { lat: 9.3047, lng: -75.3978 }
  },
  {
    id: 'tolima',
    name: 'Tolima',
    capital: 'Ibagué',
    area: 23562,
    population: 1339998,
    region: 'Andina',
    trivia: 'Capital musical de Colombia',
    coordinates: { lat: 4.4389, lng: -75.2322 }
  },
  {
    id: 'valle-del-cauca',
    name: 'Valle del Cauca',
    capital: 'Cali',
    area: 22140,
    population: 4475886,
    region: 'Pacífico',
    trivia: 'Cali es la capital mundial de la salsa',
    coordinates: { lat: 3.4516, lng: -76.5320 }
  },
  {
    id: 'vaupes',
    name: 'Vaupés',
    capital: 'Mitú',
    area: 54135,
    population: 44712,
    region: 'Amazonía',
    trivia: 'Rica diversidad étnica con más de 27 pueblos indígenas',
    coordinates: { lat: 1.2555, lng: -70.2348 }
  },
  {
    id: 'vichada',
    name: 'Vichada',
    capital: 'Puerto Carreño',
    area: 100242,
    population: 112958,
    region: 'Orinoquía',
    trivia: 'Segundo departamento más extenso de Colombia',
    coordinates: { lat: 6.1892, lng: -67.4859 }
  },
  {
    id: 'bogota',
    name: 'Bogotá D.C.',
    capital: 'Bogotá',
    area: 1775,
    population: 7743955,
    region: 'Andina',
    trivia: 'Capital de Colombia y tercera ciudad más alta del mundo',
    coordinates: { lat: 4.7110, lng: -74.0721 }
  }
];