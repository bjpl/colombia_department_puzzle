// Regional Educational Narratives for Colombian Regions
// Rich contextual stories that connect departments within each region

export interface RegionalNarrative {
  region: string;
  title: string;
  introduction: string;
  keyThemes: string[];
  departments: string[];
  culturalIdentity: string;
  economicProfile: string;
  geographicFeatures: string;
  historicalContext: string;
  uniqueCharacteristics: string[];
  educationalHighlights: string[];
}

export const regionalNarratives: RegionalNarrative[] = [
  {
    region: 'Andina',
    title: 'The Andean Heartland - Colombia\'s Economic and Cultural Core',
    introduction: 'The Andean region forms Colombia\'s backbone, where three mighty cordilleras create diverse climates from snow-capped peaks to fertile valleys. Home to 70% of Colombia\'s population and contributing over 60% of national GDP.',
    keyThemes: ['Coffee culture', 'Independence history', 'Industrial development', 'Cultural diversity'],
    departments: ['Antioquia', 'Boyacá', 'Caldas', 'Cundinamarca', 'Huila', 'Norte de Santander', 'Quindío', 'Risaralda', 'Santander', 'Tolima'],
    culturalIdentity: 'The Paisa culture of Antioquia\'s entrepreneurial spirit, the Coffee Triangle\'s UNESCO heritage, and Boyacá\'s independence legacy create a rich tapestry. From Medellín\'s innovation to Bogotá\'s cosmopolitan culture, this region defines modern Colombia.',
    economicProfile: 'Economic powerhouse producing 60% of Colombia\'s coffee, housing major industries in Medellín and Bogotá, significant mining operations, and the nation\'s financial center. The Coffee Cultural Landscape alone attracts millions in tourism revenue.',
    geographicFeatures: 'Three Andean mountain ranges (cordilleras) create varied climates and ecosystems. From Nevado del Ruiz\'s glaciers to Chicamocha Canyon\'s depths, the region spans all thermal floors from páramo to tropical valleys.',
    historicalContext: 'Birthplace of Colombian independence at Puente de Boyacá (1819). The region saw the rise of pre-Columbian Muisca civilization, Spanish colonial development, and became the cradle of the modern Colombian state.',
    uniqueCharacteristics: [
      'UNESCO Coffee Cultural Landscape spanning Caldas, Quindío, and Risaralda',
      'Medellín\'s transformation from violence to innovation hub',
      'Chicamocha Canyon - second deepest in the world',
      'Salt Cathedral of Zipaquirá - First Wonder of Colombia',
      'Highest concentration of universities and research centers'
    ],
    educationalHighlights: [
      'Battle of Boyacá secured independence for five nations',
      'Coffee production techniques recognized as world heritage',
      'Muisca civilization\'s El Dorado legend originated here',
      'Home to Colombia\'s only metro system in Medellín',
      'Produces 13% of national GDP from Antioquia alone'
    ]
  },
  {
    region: 'Caribe',
    title: 'The Caribbean Coast - Where Colombia Meets the Sea',
    introduction: 'Sun-drenched beaches, colonial fortresses, and vibrant festivals define Colombia\'s Caribbean region. This cultural melting pot blends indigenous, African, and Spanish heritage into unique music, cuisine, and traditions.',
    keyThemes: ['Maritime heritage', 'Afro-Colombian culture', 'Music traditions', 'Colonial history'],
    departments: ['Atlántico', 'Bolívar', 'César', 'Córdoba', 'La Guajira', 'Magdalena', 'Sucre'],
    culturalIdentity: 'Home to UNESCO-recognized Barranquilla Carnival, birthplace of cumbia and vallenato music, and the Wayuu people\'s ancient traditions. The costeño identity celebrates life through music, dance, and festivities year-round.',
    economicProfile: 'Major ports in Barranquilla, Cartagena, and Santa Marta handle 90% of Colombia\'s maritime trade. Tourism, mining (coal in César and La Guajira), agriculture, and petrochemicals drive the economy. Cartagena alone receives 3 million tourists annually.',
    geographicFeatures: 'From La Guajira\'s desert to the Sierra Nevada de Santa Marta (world\'s highest coastal mountain range at 5,775m), the region offers extreme geographic diversity. Extensive coastline, river deltas, and unique ecosystems like the Ciénaga Grande.',
    historicalContext: 'First point of Spanish colonization (Santa Marta, 1525), Cartagena became the main slave port and treasure fleet departure point. The region played crucial roles in independence and witnessed the death of Simón Bolívar in Santa Marta.',
    uniqueCharacteristics: [
      'Cartagena\'s fortifications - largest Spanish military architecture in Americas',
      'Sierra Nevada de Santa Marta - highest coastal mountain range globally',
      'Wayuu people - largest indigenous group (270,000+) with matrilineal society',
      'Birthplace of three UNESCO-recognized cultural traditions',
      'Punta Gallinas - northernmost point of South America'
    ],
    educationalHighlights: [
      'Barranquilla Carnival - UNESCO Masterpiece of Oral Heritage',
      'Vallenato music - UNESCO Intangible Cultural Heritage',
      'Palenque de San Basilio - first free African town in Americas',
      'La Guajira produces 70% of Colombia\'s salt',
      'Three major river systems meet the Caribbean here'
    ]
  },
  {
    region: 'Pacífica',
    title: 'The Pacific Realm - Earth\'s Biodiversity Hotspot',
    introduction: 'The world\'s rainiest region harbors incredible biodiversity and rich Afro-Colombian culture. Where the Andes meet the Pacific, unique ecosystems and cultural traditions have evolved in spectacular isolation.',
    keyThemes: ['Extreme biodiversity', 'Afro-Colombian heritage', 'Environmental conservation', 'Maritime economy'],
    departments: ['Cauca', 'Chocó', 'Nariño', 'Valle del Cauca'],
    culturalIdentity: 'Strong Afro-Colombian traditions (82% in Chocó) preserve African heritage through marimba music (UNESCO recognized), traditional medicine, and oral traditions. Pacific culture celebrates resilience, community, and harmony with nature.',
    economicProfile: 'Buenaventura port handles 60% of Colombia\'s sea trade. Valle del Cauca produces 75% of national sugar and hosts major industries. Despite rich resources (gold, platinum, biodiversity), the region faces development challenges.',
    geographicFeatures: 'Chocó holds the world rainfall record (13,300mm annually at Lloró). The Chocó-Darién biodiversity hotspot contains more plant species per hectare than anywhere on Earth. Pacific coastline stretches over 1,300km.',
    historicalContext: 'Colonial gold mining brought enslaved Africans who established maroon communities. The region remained isolated, preserving unique cultural and biological diversity. Modern challenges include balancing development with conservation.',
    uniqueCharacteristics: [
      'Lloró - wettest place on Earth with 13,300mm annual rainfall',
      'Highest biodiversity per area globally (7,000-8,000 species)',
      'Marimba music - UNESCO Intangible Heritage',
      'Humpback whale sanctuary (June-November migration)',
      '96% of Chocó is collectively-owned indigenous/Afro-Colombian land'
    ],
    educationalHighlights: [
      'Contains 10% of world\'s biodiversity in 2% of landmass',
      'Cali recognized as UNESCO City of Gastronomy and "World Salsa Capital"',
      'Traditional knowledge systems preserve 3,000+ medicinal plants',
      'Las Siete Sabias - new 75,000-acre protected area (2024)',
      'Unique tri-ecosystem convergence: Pacific, Andes, Amazon'
    ]
  },
  {
    region: 'Orinoquía',
    title: 'The Eastern Plains - Land of Cowboys and Oil',
    introduction: 'Vast tropical savannas stretch to the horizon, where llanero cowboys maintain centuries-old traditions. The Orinoco River basin shapes a unique culture of horsemen, folk music, and petroleum wealth.',
    keyThemes: ['Llanero culture', 'Oil industry', 'Cattle ranching', 'River systems'],
    departments: ['Arauca', 'Casanare', 'Meta', 'Vichada'],
    culturalIdentity: 'Llanero culture celebrates freedom, horsemanship, and connection to the land through joropo music, coleo sport, and oral traditions. Venezuelan influence creates a cross-border cultural region united by the plains.',
    economicProfile: 'Oil production transformed the region from traditional cattle ranching. Petroleum provides significant national revenue while extensive cattle operations continue. Emerging ecotourism around natural wonders like Caño Cristales.',
    geographicFeatures: 'Vast grass plains (llanos) experience extreme seasonal changes between flooding and drought. The Orinoco River system connects to the Atlantic. Caño Cristales displays unique five-color phenomenon from aquatic plants.',
    historicalContext: 'Strategic in independence wars with llanero cavalry. Traditional cattle culture dates to colonial period. Oil discoveries in 1980s brought rapid development and social changes. Indigenous groups maintain ancestral territories.',
    uniqueCharacteristics: [
      'Caño Cristales - "River of Five Colors" unique globally',
      'Largest cattle ranches in Colombia (some over 50,000 hectares)',
      'Joropo music and dance traditions shared with Venezuela',
      'Coleo - traditional sport of grabbing bulls by tail',
      'Extreme seasonal changes create dramatic landscape transformations'
    ],
    educationalHighlights: [
      'Meta River connects Orinoco basin to Atlantic Ocean',
      'Oil boom transformed Yopal and Arauca into modern cities',
      'Traditional knowledge predicts weather through animal behavior',
      'Home to 30% of Colombia\'s cattle population',
      'International Joropo Tournament celebrates cross-border culture'
    ]
  },
  {
    region: 'Amazonía',
    title: 'The Amazon Frontier - Earth\'s Lungs and Cultural Diversity',
    introduction: 'Colombia\'s Amazon holds secrets of ancient civilizations and uncontacted tribes. This biodiversity treasure encompasses 42% of national territory but only 3% of population, preserving invaluable ecological and cultural heritage.',
    keyThemes: ['Indigenous wisdom', 'Biodiversity conservation', 'River transportation', 'Cultural preservation'],
    departments: ['Amazonas', 'Caquetá', 'Guainía', 'Guaviare', 'Putumayo', 'Vaupés'],
    culturalIdentity: 'Over 60 indigenous groups preserve languages, medicinal knowledge, and sustainable practices developed over millennia. From Vaupés\' 27 ethnic groups to Putumayo\'s shamanic traditions, cultural diversity matches biological richness.',
    economicProfile: 'Subsistence and commercial fishing, sustainable forest products, indigenous crafts, and emerging ecotourism. Challenges include balancing conservation with development, illegal activities, and providing services to remote communities.',
    geographicFeatures: 'World\'s largest rainforest system, mighty rivers serving as highways, unique formations like Guainía\'s Estrella Fluvial. Chiribiquete\'s tepuis hold 75,000-year-old rock art. Most areas accessible only by river or air.',
    historicalContext: 'Ancient civilizations left massive earthworks and rock art. Rubber boom brought exploitation and violence. Modern times see indigenous rights recognition, with 27 million hectares as indigenous reserves.',
    uniqueCharacteristics: [
      'Vaupés - 95% indigenous population with 27 ethnic groups',
      'Chiribiquete - 75,000-year-old rock paintings, "Sistine Chapel of Amazon"',
      'Pink river dolphins unique to Amazon basin',
      'Over 40 indigenous languages actively spoken',
      'Putumayo\'s Sibundoy Valley - high-altitude Amazon oasis'
    ],
    educationalHighlights: [
      'Contains estimated 10% of Earth\'s species',
      'Traditional knowledge includes 4,000+ medicinal plants',
      'Leticia - only Colombian Amazon port, tri-border with Brazil/Peru',
      'Indigenous territories cover 27 million hectares (26% of Colombia)',
      'Rock art at Chiribiquete spans 20,000+ years of human presence'
    ]
  },
  {
    region: 'Insular',
    title: 'The Caribbean Islands - Colombia\'s Bilingual Paradise',
    introduction: 'San Andrés and Providencia represent Colombia\'s Caribbean island culture, where English, Spanish, and Creole blend. These coral islands maintain unique Raizal Afro-Caribbean traditions distinct from mainland Colombia.',
    keyThemes: ['Raizal culture', 'Marine biodiversity', 'Trilingual heritage', 'Island economy'],
    departments: ['San Andrés y Providencia'],
    culturalIdentity: 'Raizal people maintain Protestant faith, English language, and Caribbean customs from British colonial influence. Music includes calypso, reggae, and traditional island rhythms. Architecture features colorful wooden houses on stilts.',
    economicProfile: 'Tourism drives 70% of economy with duty-free shopping and beach resorts. Fishing, particularly for export, remains important. Challenges include water scarcity, waste management, and balancing development with environmental protection.',
    geographicFeatures: 'Part of world\'s third-largest coral reef system. Old Providence\'s McBean Lagoon declared national natural park. Limited freshwater resources, vulnerable to climate change. Strategic location near Nicaragua creates territorial complexities.',
    historicalContext: 'Originally settled by English Puritans (1629), later becoming pirate haven. Shifted between English and Spanish control. Colombia gained sovereignty in 1822, but English language and Protestant faith persisted.',
    uniqueCharacteristics: [
      'Only English-speaking region in Colombia',
      'Smallest department at just 52 km²',
      'Seaflower Biosphere Reserve protects 10% of Caribbean coral reefs',
      'Trilingual population speaks English, Spanish, and Creole',
      'Johnny Cay - uninhabited island paradise just 1.5km from San Andrés'
    ],
    educationalHighlights: [
      'Raizal population maintains distinct Afro-Caribbean culture',
      'Part of Seaflower Biosphere Reserve - UNESCO recognized',
      'Strategic location led to International Court ruling with Nicaragua',
      'Traditional music blends British, African, and Spanish influences',
      'Sustainable fishing practices preserved through generations'
    ]
  }
];

// Helper function to get narrative by region
export function getRegionalNarrative(region: string): RegionalNarrative | undefined {
  return regionalNarratives.find(n => n.region === region);
}

// Get a random educational fact about a region
export function getRandomRegionalFact(region: string): string {
  const narrative = getRegionalNarrative(region);
  if (!narrative) return '';

  const allFacts = [
    ...narrative.uniqueCharacteristics,
    ...narrative.educationalHighlights
  ];

  return allFacts[Math.floor(Math.random() * allFacts.length)] || '';
}