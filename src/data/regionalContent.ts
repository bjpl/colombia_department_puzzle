// Colombian Geography Content Data
// Comprehensive geographic information about Colombian departments and regions

export interface GeographyFact {
  id: string;
  title: string;
  description: string;
  category: 'physical' | 'political' | 'cultural' | 'economic' | 'historical';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  region: string;
  relatedDepartments: string[];
}

export interface DepartmentCard {
  departmentId: string;
  departmentName: string;
  capital: string;
  region: string;
  hint: string;
  funFact: string;
}

export interface TriviaQuestion {
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface DailyGeography {
  fact: GeographyFact;
  flashcard: DepartmentCard;
  trivia: TriviaQuestion;
  date: string;
}

export interface RegionData {
  regionName: string;
  departments: string[];
  facts: GeographyFact[];
  flashcards: DepartmentCard[];
  trivia: TriviaQuestion[];
  characteristics: {
    climate: string[];
    geography: string[];
    economy: string[];
  };
}

// Andean Region - Colombian Highlands
const andinaData: RegionData = {
  regionName: "Andina",
  departments: ["antioquia", "boyaca", "caldas", "cundinamarca", "huila", "norte-santander", "quindio", "risaralda", "santander", "tolima", "bogota"],
  facts: [
    {
      id: "andes-mountains",
      title: "Cordillera de los Andes",
      description: "The Andes mountain range splits into three cordilleras in Colombia: Oriental, Central, and Occidental",
      category: "physical",
      difficulty: "intermediate",
      region: "Andina",
      relatedDepartments: ["boyaca", "cundinamarca", "santander"]
    },
    {
      id: "coffee-triangle",
      title: "Eje Cafetero",
      description: "The Coffee Triangle includes Caldas, Quindío, and Risaralda, declared UNESCO World Heritage for its coffee cultural landscape",
      category: "cultural",
      difficulty: "beginner",
      region: "Andina",
      relatedDepartments: ["caldas", "quindio", "risaralda"]
    },
    {
      id: "magdalena-river",
      title: "Río Magdalena",
      description: "Colombia's principal river, flowing north through the Andean region to the Caribbean Sea",
      category: "physical",
      difficulty: "beginner",
      region: "Andina",
      relatedDepartments: ["huila", "tolima", "cundinamarca"]
    },
    {
      id: "boyaca-independence",
      title: "Batalla de Boyacá",
      description: "The decisive battle for Colombian independence was fought in Boyacá on August 7, 1819",
      category: "historical",
      difficulty: "intermediate",
      region: "Andina",
      relatedDepartments: ["boyaca"]
    },
    {
      id: "paisa-culture",
      title: "Cultura Paisa",
      description: "Antioquia is the heart of Paisa culture, known for entrepreneurship, coffee, and distinctive accent",
      category: "cultural",
      difficulty: "intermediate",
      region: "Andina",
      relatedDepartments: ["antioquia"]
    }
  ],
  flashcards: [
    {
      departmentId: "antioquia",
      departmentName: "Antioquia",
      capital: "Medellín",
      region: "Andina",
      hint: "City of Eternal Spring, known for innovation",
      funFact: "Second most populated department and birthplace of Paisa culture"
    },
    {
      departmentId: "boyaca",
      departmentName: "Boyacá",
      capital: "Tunja",
      region: "Andina",
      hint: "Birthplace of Colombian independence",
      funFact: "Site of the decisive Battle of Boyacá in 1819"
    },
    {
      departmentId: "caldas",
      departmentName: "Caldas",
      capital: "Manizales",
      region: "Andina",
      hint: "Part of the Coffee Triangle",
      funFact: "UNESCO World Heritage site for its coffee cultural landscape"
    },
    {
      departmentId: "cundinamarca",
      departmentName: "Cundinamarca",
      capital: "Bogotá",
      region: "Andina",
      hint: "Surrounds the national capital",
      funFact: "The department that surrounds Bogotá D.C."
    },
    {
      departmentId: "huila",
      departmentName: "Huila",
      capital: "Neiva",
      region: "Andina",
      hint: "Home to the Tatacoa Desert",
      funFact: "Contains both desert landscapes and archaeological sites like San Agustín"
    },
    {
      departmentId: "norte-santander",
      departmentName: "Norte de Santander",
      capital: "Cúcuta",
      region: "Andina",
      hint: "Border with Venezuela",
      funFact: "Important frontier city and birthplace of Gran Colombia"
    },
    {
      departmentId: "quindio",
      departmentName: "Quindío",
      capital: "Armenia",
      region: "Andina",
      hint: "Smallest mainland department",
      funFact: "The smallest department after San Andrés, heart of coffee culture"
    },
    {
      departmentId: "risaralda",
      departmentName: "Risaralda",
      capital: "Pereira",
      region: "Andina",
      hint: "Coffee Triangle's third corner",
      funFact: "Home to the Coffee Theme Park (Parque del Café)"
    },
    {
      departmentId: "santander",
      departmentName: "Santander",
      capital: "Bucaramanga",
      region: "Andina",
      hint: "Canyon and colonial town famous",
      funFact: "Home to Chicamocha Canyon and beautiful Barichara"
    },
    {
      departmentId: "tolima",
      departmentName: "Tolima",
      capital: "Ibagué",
      region: "Andina",
      hint: "Musical capital of Colombia",
      funFact: "Known as the musical capital and home to many festivals"
    },
    {
      departmentId: "bogota",
      departmentName: "Bogotá D.C.",
      capital: "Bogotá",
      region: "Andina",
      hint: "National capital and highest major city",
      funFact: "Third highest capital city in the world at 2,640 meters above sea level"
    }
  ],
  trivia: [
    {
      question: "Which three departments form the famous Coffee Triangle (Eje Cafetero)?",
      correctAnswer: "Caldas, Quindío, and Risaralda",
      wrongAnswers: ["Antioquia, Caldas, and Tolima", "Huila, Nariño, and Cauca", "Boyacá, Cundinamarca, and Santander"],
      explanation: "The Coffee Triangle consists of Caldas, Quindío, and Risaralda, declared UNESCO World Heritage for its coffee cultural landscape.",
      difficulty: "easy",
      category: "cultural"
    },
    {
      question: "In which department was the decisive battle for Colombian independence fought?",
      correctAnswer: "Boyacá",
      wrongAnswers: ["Cundinamarca", "Santander", "Norte de Santander"],
      explanation: "The Battle of Boyacá was fought on August 7, 1819, securing Colombian independence from Spanish rule.",
      difficulty: "medium",
      category: "historical"
    },
    {
      question: "What is the highest capital city in Colombia?",
      correctAnswer: "Bogotá",
      wrongAnswers: ["Tunja", "Manizales", "Popayán"],
      explanation: "Bogotá sits at 2,640 meters above sea level, making it the third highest capital city in the world.",
      difficulty: "easy",
      category: "physical"
    },
    {
      question: "Which river is known as Colombia's principal waterway?",
      correctAnswer: "Río Magdalena",
      wrongAnswers: ["Río Cauca", "Río Atrato", "Río Meta"],
      explanation: "The Magdalena River flows northward through the heart of Colombia to the Caribbean Sea.",
      difficulty: "easy",
      category: "physical"
    },
    {
      question: "Which department is known as the heart of Paisa culture?",
      correctAnswer: "Antioquia",
      wrongAnswers: ["Caldas", "Risaralda", "Quindío"],
      explanation: "Antioquia, with its capital Medellín, is the birthplace and center of Paisa culture, known for entrepreneurship and distinctive traditions.",
      difficulty: "medium",
      category: "cultural"
    }
  ],
  characteristics: {
    climate: ["Temperate mountain climate", "Perpetual spring in some cities", "Cool temperatures due to altitude", "Distinct wet and dry seasons"],
    geography: ["Three Andean mountain ranges", "High plateaus and valleys", "River valleys and basins", "Volcanic activity in some areas"],
    economy: ["Coffee production", "Manufacturing and industry", "Financial services", "Mining (coal, emeralds)", "Agriculture and livestock"]
  }
};

// Caribbean Region - Northern Coast
const caribeData: RegionData = {
  regionName: "Caribe",
  departments: ["atlantico", "bolivar", "cesar", "cordoba", "la-guajira", "magdalena", "sucre", "san-andres"],
  facts: [
    {
      id: "caribbean-coast",
      title: "Costa Caribe",
      description: "Colombia's Caribbean coast stretches over 1,600 kilometers along the Caribbean Sea",
      category: "physical",
      difficulty: "beginner",
      region: "Caribe",
      relatedDepartments: ["atlantico", "bolivar", "magdalena", "la-guajira"]
    },
    {
      id: "cartagena-heritage",
      title: "Cartagena Heritage",
      description: "Cartagena's walled city has been a UNESCO World Heritage Site since 1984",
      category: "cultural",
      difficulty: "beginner",
      region: "Caribe",
      relatedDepartments: ["bolivar"]
    },
    {
      id: "barranquilla-carnival",
      title: "Carnaval de Barranquilla",
      description: "Barranquilla's Carnival is a UNESCO Masterpiece of Oral and Intangible Heritage of Humanity",
      category: "cultural",
      difficulty: "intermediate",
      region: "Caribe",
      relatedDepartments: ["atlantico"]
    },
    {
      id: "vallenato-music",
      title: "Vallenato Music",
      description: "Vallenato music originated in the Cesar department, particularly around Valledupar",
      category: "cultural",
      difficulty: "intermediate",
      region: "Caribe",
      relatedDepartments: ["cesar"]
    },
    {
      id: "punta-gallinas",
      title: "Punta Gallinas",
      description: "The northernmost point of South America is located in La Guajira department",
      category: "physical",
      difficulty: "advanced",
      region: "Caribe",
      relatedDepartments: ["la-guajira"]
    }
  ],
  flashcards: [
    {
      departmentId: "atlantico",
      departmentName: "Atlántico",
      capital: "Barranquilla",
      region: "Caribe",
      hint: "Home to UNESCO carnival",
      funFact: "Barranquilla's Carnival is UNESCO Intangible Cultural Heritage"
    },
    {
      departmentId: "bolivar",
      departmentName: "Bolívar",
      capital: "Cartagena de Indias",
      region: "Caribe",
      hint: "Walled colonial city",
      funFact: "UNESCO World Heritage Site since 1984"
    },
    {
      departmentId: "cesar",
      departmentName: "Cesar",
      capital: "Valledupar",
      region: "Caribe",
      hint: "Birthplace of vallenato music",
      funFact: "World capital of vallenato with annual festival"
    },
    {
      departmentId: "cordoba",
      departmentName: "Córdoba",
      capital: "Montería",
      region: "Caribe",
      hint: "Famous for cattle and handicrafts",
      funFact: "Known for cattle ranching and the traditional sombrero vueltiao"
    },
    {
      departmentId: "la-guajira",
      departmentName: "La Guajira",
      capital: "Riohacha",
      region: "Caribe",
      hint: "Northernmost point of South America",
      funFact: "Contains Punta Gallinas, the continent's northernmost point"
    },
    {
      departmentId: "magdalena",
      departmentName: "Magdalena",
      capital: "Santa Marta",
      region: "Caribe",
      hint: "Oldest city in Colombia",
      funFact: "Santa Marta was founded in 1525, making it Colombia's oldest city"
    },
    {
      departmentId: "sucre",
      departmentName: "Sucre",
      capital: "Sincelejo",
      region: "Caribe",
      hint: "Known for handicrafts and corralejas",
      funFact: "Famous for traditional crafts and the exciting corralejas festivals"
    },
    {
      departmentId: "san-andres",
      departmentName: "San Andrés y Providencia",
      capital: "San Andrés",
      region: "Insular",
      hint: "Colombia's only island department",
      funFact: "The smallest department and only insular territory of Colombia"
    }
  ],
  trivia: [
    {
      question: "Which Colombian city hosts a UNESCO-recognized carnival?",
      correctAnswer: "Barranquilla",
      wrongAnswers: ["Cartagena", "Santa Marta", "Valledupar"],
      explanation: "Barranquilla's Carnival is recognized by UNESCO as a Masterpiece of Oral and Intangible Heritage of Humanity.",
      difficulty: "medium",
      category: "cultural"
    },
    {
      question: "What is the northernmost point of South America?",
      correctAnswer: "Punta Gallinas",
      wrongAnswers: ["Cabo de la Vela", "Punta Espada", "Punta Arenas"],
      explanation: "Punta Gallinas in La Guajira department is the northernmost point of the South American continent.",
      difficulty: "hard",
      category: "physical"
    },
    {
      question: "Which is the oldest city in Colombia?",
      correctAnswer: "Santa Marta",
      wrongAnswers: ["Cartagena", "Barranquilla", "Riohacha"],
      explanation: "Santa Marta was founded in 1525, making it the oldest surviving city in Colombia.",
      difficulty: "medium",
      category: "historical"
    }
  ],
  characteristics: {
    climate: ["Tropical hot climate", "High temperatures year-round", "Distinct wet and dry seasons", "Trade wind influence"],
    geography: ["Extensive Caribbean coastline", "Coastal plains and deltas", "Sierra Nevada mountains", "Desert regions in La Guajira"],
    economy: ["Tourism and hospitality", "Port activities and shipping", "Agriculture (bananas, palm oil)", "Mining (coal, salt)", "Cattle ranching"]
  }
};

// Pacific Region - Western Coast
const pacificoData: RegionData = {
  regionName: "Pacífico",
  departments: ["cauca", "choco", "narino", "valle-del-cauca"],
  facts: [
    {
      id: "pacific-biodiversity",
      title: "Pacific Biodiversity",
      description: "The Pacific region contains some of the world's most biodiverse rainforests",
      category: "physical",
      difficulty: "intermediate",
      region: "Pacífico",
      relatedDepartments: ["choco", "cauca", "narino"]
    },
    {
      id: "choco-rainfall",
      title: "Chocó Rainfall",
      description: "Chocó is one of the rainiest places on Earth, with some areas receiving over 10 meters of rain annually",
      category: "physical",
      difficulty: "advanced",
      region: "Pacífico",
      relatedDepartments: ["choco"]
    },
    {
      id: "cali-salsa",
      title: "Cali Salsa Capital",
      description: "Cali is recognized as the world capital of salsa music and dance",
      category: "cultural",
      difficulty: "beginner",
      region: "Pacífico",
      relatedDepartments: ["valle-del-cauca"]
    },
    {
      id: "santuario-lajas",
      title: "Santuario de Las Lajas",
      description: "The Las Lajas Sanctuary in Nariño is built into a canyon and is one of Colombia's most spectacular churches",
      category: "cultural",
      difficulty: "intermediate",
      region: "Pacífico",
      relatedDepartments: ["narino"]
    },
    {
      id: "popayan-holy-week",
      title: "Popayán Holy Week",
      description: "Popayán's Holy Week processions are UNESCO Intangible Cultural Heritage",
      category: "cultural",
      difficulty: "intermediate",
      region: "Pacífico",
      relatedDepartments: ["cauca"]
    }
  ],
  flashcards: [
    {
      departmentId: "cauca",
      departmentName: "Cauca",
      capital: "Popayán",
      region: "Pacífico",
      hint: "The White City of Colombia",
      funFact: "Known as the White City for its colonial architecture and Holy Week processions"
    },
    {
      departmentId: "choco",
      departmentName: "Chocó",
      capital: "Quibdó",
      region: "Pacífico",
      hint: "One of the rainiest places on Earth",
      funFact: "Receives over 10 meters of rainfall annually in some areas"
    },
    {
      departmentId: "narino",
      departmentName: "Nariño",
      capital: "Pasto",
      region: "Pacífico",
      hint: "Home to Las Lajas Sanctuary",
      funFact: "Features the spectacular Las Lajas Sanctuary and Carnival of Blacks and Whites"
    },
    {
      departmentId: "valle-del-cauca",
      departmentName: "Valle del Cauca",
      capital: "Cali",
      region: "Pacífico",
      hint: "World capital of salsa",
      funFact: "Cali is recognized worldwide as the capital of salsa music and dance"
    }
  ],
  trivia: [
    {
      question: "Which Colombian city is known as the world capital of salsa?",
      correctAnswer: "Cali",
      wrongAnswers: ["Medellín", "Barranquilla", "Cartagena"],
      explanation: "Cali in Valle del Cauca is internationally recognized as the world capital of salsa music and dance.",
      difficulty: "easy",
      category: "cultural"
    },
    {
      question: "Which department is one of the rainiest places on Earth?",
      correctAnswer: "Chocó",
      wrongAnswers: ["Cauca", "Nariño", "Valle del Cauca"],
      explanation: "Chocó receives some of the highest rainfall in the world, with over 10 meters annually in some areas.",
      difficulty: "medium",
      category: "physical"
    },
    {
      question: "What is Popayán known as?",
      correctAnswer: "The White City",
      wrongAnswers: ["The Golden City", "The Emerald City", "The Pearl City"],
      explanation: "Popayán is called the White City for its well-preserved colonial architecture with white buildings.",
      difficulty: "medium",
      category: "cultural"
    }
  ],
  characteristics: {
    climate: ["Tropical rainforest climate", "High humidity year-round", "Heavy rainfall", "Consistently warm temperatures"],
    geography: ["Pacific coastline", "Dense rainforests", "River systems and deltas", "Mountainous interior"],
    economy: ["Agriculture (sugarcane, coffee)", "Mining", "Fishing and aquaculture", "Tourism", "Manufacturing in Valle del Cauca"]
  }
};

// Orinoco Region - Eastern Plains
const orinoquia: RegionData = {
  regionName: "Orinoquía",
  departments: ["arauca", "casanare", "meta", "vichada"],
  facts: [
    {
      id: "llanos-plains",
      title: "Los Llanos",
      description: "The Orinoco plains are vast grasslands perfect for cattle ranching and oil production",
      category: "physical",
      difficulty: "beginner",
      region: "Orinoquía",
      relatedDepartments: ["meta", "casanare", "arauca", "vichada"]
    },
    {
      id: "llanero-culture",
      title: "Llanero Culture",
      description: "The cowboy culture of the plains with distinctive music, poetry, and horsemanship",
      category: "cultural",
      difficulty: "intermediate",
      region: "Orinoquía",
      relatedDepartments: ["meta", "casanare", "arauca"]
    },
    {
      id: "cano-cristales",
      title: "Caño Cristales",
      description: "Known as the River of Five Colors, located in Meta's Serranía de la Macarena",
      category: "physical",
      difficulty: "intermediate",
      region: "Orinoquía",
      relatedDepartments: ["meta"]
    },
    {
      id: "oil-production",
      title: "Oil Production",
      description: "Casanare and Arauca are major oil-producing regions of Colombia",
      category: "economic",
      difficulty: "intermediate",
      region: "Orinoquía",
      relatedDepartments: ["casanare", "arauca"]
    }
  ],
  flashcards: [
    {
      departmentId: "arauca",
      departmentName: "Arauca",
      capital: "Arauca",
      region: "Orinoquía",
      hint: "Border with Venezuela, llanero culture",
      funFact: "Known for llanero culture and the international José Antonio Páez bridge"
    },
    {
      departmentId: "casanare",
      departmentName: "Casanare",
      capital: "Yopal",
      region: "Orinoquía",
      hint: "Important oil producer",
      funFact: "Major oil production and extensive cattle ranching"
    },
    {
      departmentId: "meta",
      departmentName: "Meta",
      capital: "Villavicencio",
      region: "Orinoquía",
      hint: "Gateway to the plains, River of Five Colors",
      funFact: "Gateway to the Llanos and home to Caño Cristales river"
    },
    {
      departmentId: "vichada",
      departmentName: "Vichada",
      capital: "Puerto Carreño",
      region: "Orinoquía",
      hint: "Second largest department",
      funFact: "Second most extensive department of Colombia"
    }
  ],
  trivia: [
    {
      question: "Which river is known as the River of Five Colors?",
      correctAnswer: "Caño Cristales",
      wrongAnswers: ["Río Meta", "Río Casanare", "Río Arauca"],
      explanation: "Caño Cristales in Meta is famous for its spectacular colors created by aquatic plants.",
      difficulty: "medium",
      category: "physical"
    },
    {
      question: "What is the traditional culture of the Orinoco plains called?",
      correctAnswer: "Llanero",
      wrongAnswers: ["Paisa", "Costeño", "Santandereano"],
      explanation: "Llanero culture is the distinctive cowboy culture of the Colombian plains, with its own music and traditions.",
      difficulty: "easy",
      category: "cultural"
    }
  ],
  characteristics: {
    climate: ["Tropical savanna climate", "Distinct wet and dry seasons", "Hot temperatures", "Seasonal flooding"],
    geography: ["Vast grassland plains", "River systems", "Seasonal wetlands", "Few hills or mountains"],
    economy: ["Cattle ranching", "Oil production", "Agriculture", "Natural gas", "Rice cultivation"]
  }
};

// Amazon Region - Southern Rainforest
const amazoniaData: RegionData = {
  regionName: "Amazonía",
  departments: ["amazonas", "caqueta", "guainia", "guaviare", "putumayo", "vaupes"],
  facts: [
    {
      id: "amazon-rainforest",
      title: "Amazon Rainforest",
      description: "Colombia contains about 10% of the Amazon rainforest, the world's largest tropical rainforest",
      category: "physical",
      difficulty: "beginner",
      region: "Amazonía",
      relatedDepartments: ["amazonas", "caqueta", "guainia", "guaviare", "putumayo", "vaupes"]
    },
    {
      id: "indigenous-diversity",
      title: "Indigenous Diversity",
      description: "The Amazon region is home to over 27 different indigenous peoples, especially in Vaupés",
      category: "cultural",
      difficulty: "advanced",
      region: "Amazonía",
      relatedDepartments: ["vaupes", "amazonas", "guainia"]
    },
    {
      id: "chiribiquete",
      title: "Serranía del Chiribiquete",
      description: "UNESCO World Heritage site with ancient rock paintings and unique biodiversity",
      category: "cultural",
      difficulty: "advanced",
      region: "Amazonía",
      relatedDepartments: ["guaviare", "caqueta"]
    },
    {
      id: "estrella-fluvial",
      title: "Estrella Fluvial del Oriente",
      description: "Guainía is famous for the Eastern River Star where multiple rivers converge",
      category: "physical",
      difficulty: "advanced",
      region: "Amazonía",
      relatedDepartments: ["guainia"]
    }
  ],
  flashcards: [
    {
      departmentId: "amazonas",
      departmentName: "Amazonas",
      capital: "Leticia",
      region: "Amazonía",
      hint: "Largest department, 9.6% of national territory",
      funFact: "Colombia's largest department covering 9.6% of the national territory"
    },
    {
      departmentId: "caqueta",
      departmentName: "Caquetá",
      capital: "Florencia",
      region: "Amazonía",
      hint: "Gateway to the Colombian Amazon",
      funFact: "Known as the gateway to the Colombian Amazon"
    },
    {
      departmentId: "guainia",
      departmentName: "Guainía",
      capital: "Inírida",
      region: "Amazonía",
      hint: "Eastern River Star phenomenon",
      funFact: "Famous for the Eastern River Star where rivers converge"
    },
    {
      departmentId: "guaviare",
      departmentName: "Guaviare",
      capital: "San José del Guaviare",
      region: "Amazonía",
      hint: "Ancient rock paintings of Chiribiquete",
      funFact: "Home to the ancient rock paintings of Serranía del Chiribiquete"
    },
    {
      departmentId: "putumayo",
      departmentName: "Putumayo",
      capital: "Mocoa",
      region: "Amazonía",
      hint: "Sibundoy Valley and ethnic diversity",
      funFact: "Known for the Sibundoy Valley and remarkable ethnic diversity"
    },
    {
      departmentId: "vaupes",
      departmentName: "Vaupés",
      capital: "Mitú",
      region: "Amazonía",
      hint: "27+ indigenous peoples",
      funFact: "Rich ethnic diversity with more than 27 indigenous peoples"
    }
  ],
  trivia: [
    {
      question: "Which is Colombia's largest department by area?",
      correctAnswer: "Amazonas",
      wrongAnswers: ["Vichada", "Caquetá", "Meta"],
      explanation: "Amazonas covers 109,665 km², representing 9.6% of Colombia's total territory.",
      difficulty: "medium",
      category: "physical"
    },
    {
      question: "Which department has the highest indigenous diversity in Colombia?",
      correctAnswer: "Vaupés",
      wrongAnswers: ["Amazonas", "Guainía", "Putumayo"],
      explanation: "Vaupés is home to more than 27 different indigenous peoples, the highest diversity in the country.",
      difficulty: "hard",
      category: "cultural"
    },
    {
      question: "What UNESCO site is famous for ancient rock paintings?",
      correctAnswer: "Serranía del Chiribiquete",
      wrongAnswers: ["Sierra Nevada de Santa Marta", "Los Katíos National Park", "Malpelo Island"],
      explanation: "Serranía del Chiribiquete is a UNESCO World Heritage site known for its ancient indigenous rock art.",
      difficulty: "hard",
      category: "cultural"
    }
  ],
  characteristics: {
    climate: ["Tropical rainforest climate", "High humidity and temperature", "Heavy rainfall year-round", "Little seasonal variation"],
    geography: ["Dense Amazon rainforest", "River systems and tributaries", "Low-lying flood plains", "Ancient geological formations"],
    economy: ["Sustainable forestry", "Ecotourism", "Indigenous crafts", "Research and conservation", "Limited agriculture"]
  }
};

// Regional data collection
export const regionData: Record<string, RegionData> = {
  andina: andinaData,
  caribe: caribeData,
  pacifico: pacificoData,
  orinoquia: orinoquia,
  amazonia: amazoniaData
};

// Daily content generation
const generateDailyGeography = (region: string): DailyGeography => {
  const data = regionData[region];
  if (!data) {
    throw new Error(`Region ${region} not found`);
  }

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);

  // Use day of year to select consistent daily content
  const factIndex = dayOfYear % data.facts.length;
  const cardIndex = dayOfYear % data.flashcards.length;
  const triviaIndex = dayOfYear % data.trivia.length;

  return {
    fact: data.facts[factIndex],
    flashcard: data.flashcards[cardIndex],
    trivia: data.trivia[triviaIndex],
    date: today.toISOString().split('T')[0]
  };
};

// Export functions
export const getRegionFacts = (region: string, category?: string): GeographyFact[] => {
  const data = regionData[region];
  if (!data) {
    throw new Error(`Region ${region} not found`);
  }

  if (category) {
    return data.facts.filter(fact => fact.category === category);
  }

  return data.facts;
};

export const getDailyGeography = (region: string): DailyGeography => {
  return generateDailyGeography(region);
};

export const getFlashcards = (region: string): DepartmentCard[] => {
  const data = regionData[region];
  if (!data) {
    throw new Error(`Region ${region} not found`);
  }

  return data.flashcards;
};

export const getTrivia = (region: string, difficulty?: 'easy' | 'medium' | 'hard'): TriviaQuestion[] => {
  const data = regionData[region];
  if (!data) {
    throw new Error(`Region ${region} not found`);
  }

  if (difficulty) {
    return data.trivia.filter(question => question.difficulty === difficulty);
  }

  return data.trivia;
};

export const getRegionCharacteristics = (region: string) => {
  const data = regionData[region];
  if (!data) {
    throw new Error(`Region ${region} not found`);
  }

  return data.characteristics;
};

export const getRandomFacts = (region: string, count: number = 3): GeographyFact[] => {
  const facts = getRegionFacts(region);
  const shuffled = [...facts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const searchFacts = (region: string, searchTerm: string): GeographyFact[] => {
  const facts = getRegionFacts(region);
  const term = searchTerm.toLowerCase();

  return facts.filter(fact =>
    fact.title.toLowerCase().includes(term) ||
    fact.description.toLowerCase().includes(term)
  );
};

export const getFactsByDifficulty = (region: string, difficulty: 'beginner' | 'intermediate' | 'advanced'): GeographyFact[] => {
  const facts = getRegionFacts(region);
  return facts.filter(fact => fact.difficulty === difficulty);
};

export const getAvailableRegions = (): string[] => {
  return Object.keys(regionData);
};

export const getRegionInfo = (region: string) => {
  const data = regionData[region];
  if (!data) {
    throw new Error(`Region ${region} not found`);
  }

  return {
    regionName: data.regionName,
    departmentCount: data.departments.length,
    factsCount: data.facts.length,
    flashcardsCount: data.flashcards.length,
    triviaCount: data.trivia.length
  };
};

// Fact of the day functionality
export const getFactOfTheDay = (region: string): GeographyFact => {
  const dailyContent = getDailyGeography(region);
  return dailyContent.fact;
};

// Flashcard of the day functionality
export const getFlashcardOfTheDay = (region: string): DepartmentCard => {
  const dailyContent = getDailyGeography(region);
  return dailyContent.flashcard;
};

// Trivia of the day functionality
export const getTriviaOfTheDay = (region: string): TriviaQuestion => {
  const dailyContent = getDailyGeography(region);
  return dailyContent.trivia;
};

// Get all flashcards for learning mode
export const getAllFlashcards = (): DepartmentCard[] => {
  const allCards: DepartmentCard[] = [];
  Object.values(regionData).forEach(region => {
    allCards.push(...region.flashcards);
  });
  return allCards;
};

// Get all trivia questions for quiz mode
export const getAllTrivia = (): TriviaQuestion[] => {
  const allTrivia: TriviaQuestion[] = [];
  Object.values(regionData).forEach(region => {
    allTrivia.push(...region.trivia);
  });
  return allTrivia;
};

// Get department by ID
export const getDepartmentCard = (departmentId: string): DepartmentCard | undefined => {
  const allCards = getAllFlashcards();
  return allCards.find(card => card.departmentId === departmentId);
};

export default regionData;