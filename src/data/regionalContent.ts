// Regional Spanish Content Data
// Comprehensive vocabulary, expressions, and cultural information for Spanish-speaking regions

export interface VocabularyItem {
  word: string;
  meaning: string;
  pronunciation: string;
  usage: string;
  example: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export interface RegionalExpression {
  expression: string;
  meaning: string;
  context: string;
  example: string;
  formality: 'informal' | 'formal' | 'neutral';
}

export interface CulturalNote {
  topic: string;
  description: string;
  tip: string;
}

export interface DailyContent {
  word: VocabularyItem;
  expression: RegionalExpression;
  culturalTip: string;
  date: string;
}

export interface RegionalData {
  country: string;
  flag: string;
  vocabulary: VocabularyItem[];
  expressions: RegionalExpression[];
  culturalNotes: CulturalNote[];
  pronunciation: {
    characteristics: string[];
    audioTips: string[];
  };
}

// Spain - Peninsular Spanish
const spainData: RegionalData = {
  country: "España",
  flag: "🇪🇸",
  vocabulary: [
    {
      word: "ordenador",
      meaning: "computer",
      pronunciation: "or-de-na-DOR",
      usage: "Common term for computer in Spain",
      example: "Mi ordenador está en la oficina.",
      difficulty: "beginner",
      category: "technology"
    },
    {
      word: "móvil",
      meaning: "mobile phone",
      pronunciation: "MO-vil",
      usage: "Standard term for cell phone",
      example: "He perdido mi móvil en el metro.",
      difficulty: "beginner",
      category: "technology"
    },
    {
      word: "coche",
      meaning: "car",
      pronunciation: "KO-che",
      usage: "Most common word for car in Spain",
      example: "Voy al trabajo en coche.",
      difficulty: "beginner",
      category: "transportation"
    },
    {
      word: "piso",
      meaning: "apartment",
      pronunciation: "PI-so",
      usage: "Standard term for apartment",
      example: "Vivimos en un piso céntrico.",
      difficulty: "beginner",
      category: "housing"
    },
    {
      word: "zumo",
      meaning: "juice",
      pronunciation: "THU-mo",
      usage: "Fruit juice, pronounced with theta sound",
      example: "Quiero un zumo de naranja.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "patatas",
      meaning: "potatoes",
      pronunciation: "pa-TA-tas",
      usage: "Standard term for potatoes",
      example: "Las patatas bravas están riquísimas.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "gafas",
      meaning: "glasses",
      pronunciation: "GA-fas",
      usage: "Eyeglasses",
      example: "Necesito mis gafas para leer.",
      difficulty: "beginner",
      category: "accessories"
    },
    {
      word: "jersey",
      meaning: "sweater",
      pronunciation: "yer-SEY",
      usage: "Common term for sweater",
      example: "Hace frío, ponte el jersey.",
      difficulty: "beginner",
      category: "clothing"
    },
    {
      word: "conducir",
      meaning: "to drive",
      pronunciation: "kon-du-THIR",
      usage: "To drive a vehicle",
      example: "Aprendí a conducir a los 18 años.",
      difficulty: "intermediate",
      category: "verbs"
    },
    {
      word: "aparcar",
      meaning: "to park",
      pronunciation: "a-par-KAR",
      usage: "To park a vehicle",
      example: "No puedo aparcar en esta calle.",
      difficulty: "intermediate",
      category: "verbs"
    },
    {
      word: "fontanero",
      meaning: "plumber",
      pronunciation: "fon-ta-NE-ro",
      usage: "Professional who fixes pipes",
      example: "Llamé al fontanero para arreglar la tubería.",
      difficulty: "intermediate",
      category: "professions"
    },
    {
      word: "ascensor",
      meaning: "elevator",
      pronunciation: "as-then-SOR",
      usage: "Lift in buildings",
      example: "El ascensor está averiado.",
      difficulty: "intermediate",
      category: "buildings"
    },
    {
      word: "estanco",
      meaning: "tobacco shop",
      pronunciation: "es-TAN-ko",
      usage: "Shop selling tobacco and stamps",
      example: "Compra sellos en el estanco.",
      difficulty: "advanced",
      category: "shops"
    },
    {
      word: "madrugada",
      meaning: "early morning (1-6 AM)",
      pronunciation: "ma-dru-GA-da",
      usage: "Very early morning hours",
      example: "Llegué a casa de madrugada.",
      difficulty: "advanced",
      category: "time"
    },
    {
      word: "cachondeo",
      meaning: "fun/joking around",
      pronunciation: "ka-chon-DE-o",
      usage: "Informal fun or teasing",
      example: "¡Qué cachondeo tienen estos niños!",
      difficulty: "advanced",
      category: "slang"
    },
    {
      word: "churros",
      meaning: "fried dough pastry",
      pronunciation: "CHU-rros",
      usage: "Traditional Spanish pastry",
      example: "Desayuné churros con chocolate.",
      difficulty: "intermediate",
      category: "food"
    },
    {
      word: "tapas",
      meaning: "small plates/appetizers",
      pronunciation: "TA-pas",
      usage: "Traditional Spanish dining style",
      example: "Fuimos de tapas por el barrio.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "siesta",
      meaning: "afternoon nap",
      pronunciation: "si-ES-ta",
      usage: "Traditional afternoon rest",
      example: "Después de comer echo la siesta.",
      difficulty: "beginner",
      category: "culture"
    },
    {
      word: "botellón",
      meaning: "street drinking gathering",
      pronunciation: "bo-te-LLON",
      usage: "Youth gathering to drink outdoors",
      example: "Los jóvenes hacen botellón en el parque.",
      difficulty: "advanced",
      category: "culture"
    },
    {
      word: "puente",
      meaning: "long weekend",
      pronunciation: "PUEN-te",
      usage: "Extended weekend with bridge day",
      example: "Este puente nos vamos a la playa.",
      difficulty: "intermediate",
      category: "time"
    },
    {
      word: "tertulia",
      meaning: "social gathering for conversation",
      pronunciation: "ter-TU-lia",
      usage: "Informal discussion group",
      example: "Participé en una tertulia literaria.",
      difficulty: "advanced",
      category: "culture"
    },
    {
      word: "bocadillo",
      meaning: "sandwich",
      pronunciation: "bo-ka-DI-llo",
      usage: "Spanish-style sandwich",
      example: "Me hice un bocadillo de jamón.",
      difficulty: "beginner",
      category: "food"
    }
  ],
  expressions: [
    {
      expression: "¡Qué guay!",
      meaning: "How cool!",
      context: "Expressing excitement or approval",
      example: "¡Qué guay tu camiseta nueva!",
      formality: "informal"
    },
    {
      expression: "¡No me jodas!",
      meaning: "No way! / You're kidding!",
      context: "Expressing disbelief (vulgar)",
      example: "¿Te han dado el trabajo? ¡No me jodas!",
      formality: "informal"
    },
    {
      expression: "Estar hasta los huevos",
      meaning: "To be fed up",
      context: "Being extremely annoyed (vulgar)",
      example: "Estoy hasta los huevos del tráfico.",
      formality: "informal"
    },
    {
      expression: "¡Qué fuerte!",
      meaning: "How intense! / Wow!",
      context: "Expressing surprise or shock",
      example: "¡Qué fuerte lo que me has contado!",
      formality: "informal"
    },
    {
      expression: "Ir de marcha",
      meaning: "To go out partying",
      context: "Going out for nightlife",
      example: "Este sábado vamos de marcha.",
      formality: "informal"
    },
    {
      expression: "Estar en las nubes",
      meaning: "To be daydreaming",
      context: "Being distracted or absent-minded",
      example: "No me escuchas, estás en las nubes.",
      formality: "neutral"
    },
    {
      expression: "Ser un rollo",
      meaning: "To be boring",
      context: "Something tedious or uninteresting",
      example: "Esta película es un rollo.",
      formality: "informal"
    },
    {
      expression: "¡Qué mono!",
      meaning: "How cute!",
      context: "Describing something adorable",
      example: "¡Qué mono tu perrito!",
      formality: "informal"
    },
    {
      expression: "Pasarse tres pueblos",
      meaning: "To go too far",
      context: "Exceeding limits or boundaries",
      example: "Con esa broma te has pasado tres pueblos.",
      formality: "informal"
    },
    {
      expression: "Tener mala leche",
      meaning: "To be in a bad mood",
      context: "Being grumpy or irritable",
      example: "Hoy mi jefe tiene mala leche.",
      formality: "informal"
    }
  ],
  culturalNotes: [
    {
      topic: "Dining Times",
      description: "Spanish meals are later than most countries: lunch at 2-3 PM, dinner at 9-10 PM",
      tip: "Don't expect restaurants to serve dinner before 8 PM"
    },
    {
      topic: "Siesta Culture",
      description: "Many businesses close from 2-5 PM for siesta time",
      tip: "Plan shopping and errands around siesta hours"
    },
    {
      topic: "Tapas Tradition",
      description: "Tapas were originally free snacks served with drinks",
      tip: "Order drinks first, tapas often come automatically"
    }
  ],
  pronunciation: {
    characteristics: [
      "Theta sound (θ) for 'c' before 'e,i' and 'z'",
      "Clear distinction between 'll' and 'y'",
      "Strong 'rr' rolling",
      "Final 's' clearly pronounced"
    ],
    audioTips: [
      "Practice the 'th' sound in 'gracias'",
      "Distinguish 'caza' (hunting) from 'casa' (house)",
      "Roll your R's strongly in 'perro'"
    ]
  }
};

// Mexico - Mexican Spanish
const mexicoData: RegionalData = {
  country: "México",
  flag: "🇲🇽",
  vocabulary: [
    {
      word: "computadora",
      meaning: "computer",
      pronunciation: "kom-pu-ta-DO-ra",
      usage: "Standard term for computer in Mexico",
      example: "Mi computadora es muy lenta.",
      difficulty: "beginner",
      category: "technology"
    },
    {
      word: "celular",
      meaning: "cell phone",
      pronunciation: "se-lu-LAR",
      usage: "Mobile phone in Mexico",
      example: "¿Me pasas tu número de celular?",
      difficulty: "beginner",
      category: "technology"
    },
    {
      word: "carro",
      meaning: "car",
      pronunciation: "KA-rro",
      usage: "Most common word for car",
      example: "Voy a lavar el carro.",
      difficulty: "beginner",
      category: "transportation"
    },
    {
      word: "departamento",
      meaning: "apartment",
      pronunciation: "de-par-ta-MEN-to",
      usage: "Apartment or flat",
      example: "Rento un departamento céntrico.",
      difficulty: "beginner",
      category: "housing"
    },
    {
      word: "jugo",
      meaning: "juice",
      pronunciation: "HU-go",
      usage: "Fruit juice",
      example: "Quiero un jugo de naranja.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "papas",
      meaning: "potatoes",
      pronunciation: "PA-pas",
      usage: "Standard term for potatoes",
      example: "Las papas fritas están deliciosas.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "lentes",
      meaning: "glasses",
      pronunciation: "LEN-tes",
      usage: "Eyeglasses",
      example: "Necesito mis lentes para manejar.",
      difficulty: "beginner",
      category: "accessories"
    },
    {
      word: "suéter",
      meaning: "sweater",
      pronunciation: "SWE-ter",
      usage: "Warm clothing item",
      example: "Ponte el suéter, hace frío.",
      difficulty: "beginner",
      category: "clothing"
    },
    {
      word: "manejar",
      meaning: "to drive",
      pronunciation: "ma-ne-HAR",
      usage: "To drive a vehicle",
      example: "Aprendí a manejar a los 16 años.",
      difficulty: "intermediate",
      category: "verbs"
    },
    {
      word: "estacionar",
      meaning: "to park",
      pronunciation: "es-ta-sio-NAR",
      usage: "To park a vehicle",
      example: "No se puede estacionar aquí.",
      difficulty: "intermediate",
      category: "verbs"
    },
    {
      word: "plomero",
      meaning: "plumber",
      pronunciation: "plo-ME-ro",
      usage: "Professional who fixes pipes",
      example: "Llamé al plomero para la fuga.",
      difficulty: "intermediate",
      category: "professions"
    },
    {
      word: "elevador",
      meaning: "elevator",
      pronunciation: "e-le-va-DOR",
      usage: "Lift in buildings",
      example: "El elevador está descompuesto.",
      difficulty: "intermediate",
      category: "buildings"
    },
    {
      word: "tianguis",
      meaning: "street market",
      pronunciation: "tian-GUIS",
      usage: "Traditional outdoor market",
      example: "Voy al tianguis a comprar verduras.",
      difficulty: "advanced",
      category: "culture"
    },
    {
      word: "alberca",
      meaning: "swimming pool",
      pronunciation: "al-BER-ka",
      usage: "Pool for swimming",
      example: "Los niños están en la alberca.",
      difficulty: "intermediate",
      category: "recreation"
    },
    {
      word: "camión",
      meaning: "bus",
      pronunciation: "ka-MION",
      usage: "Public transportation bus",
      example: "Tomé el camión para ir al centro.",
      difficulty: "intermediate",
      category: "transportation"
    },
    {
      word: "torta",
      meaning: "sandwich (Mexican style)",
      pronunciation: "TOR-ta",
      usage: "Traditional Mexican sandwich",
      example: "Me comí una torta de jamón.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "tacos",
      meaning: "tacos",
      pronunciation: "TA-kos",
      usage: "Traditional Mexican dish",
      example: "Cenamos tacos de pastor.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "chela",
      meaning: "beer (slang)",
      pronunciation: "CHE-la",
      usage: "Informal term for beer",
      example: "¿Nos tomamos una chela?",
      difficulty: "advanced",
      category: "slang"
    },
    {
      word: "güey",
      meaning: "dude/guy (slang)",
      pronunciation: "GWEY",
      usage: "Informal address, can be rude",
      example: "¿Qué onda, güey?",
      difficulty: "advanced",
      category: "slang"
    },
    {
      word: "chido",
      meaning: "cool/awesome",
      pronunciation: "CHI-do",
      usage: "Something good or cool",
      example: "Está muy chido tu carro.",
      difficulty: "advanced",
      category: "slang"
    },
    {
      word: "órale",
      meaning: "wow!/come on!",
      pronunciation: "O-ra-le",
      usage: "Exclamation of surprise or encouragement",
      example: "¡Órale! ¿En serio ganaste?",
      difficulty: "advanced",
      category: "expressions"
    },
    {
      word: "fresa",
      meaning: "posh/snobby person",
      pronunciation: "FRE-sa",
      usage: "Person from upper class (sometimes derogatory)",
      example: "No seas fresa, ven con nosotros.",
      difficulty: "advanced",
      category: "slang"
    }
  ],
  expressions: [
    {
      expression: "¡Qué padre!",
      meaning: "How cool! / Awesome!",
      context: "Expressing approval or excitement",
      example: "¡Qué padre tu nueva casa!",
      formality: "informal"
    },
    {
      expression: "No manches",
      meaning: "No way! / You're kidding!",
      context: "Expressing disbelief or surprise",
      example: "¿Te casas? ¡No manches!",
      formality: "informal"
    },
    {
      expression: "¿Qué onda?",
      meaning: "What's up? / What's going on?",
      context: "Casual greeting or inquiry",
      example: "¡Hola! ¿Qué onda?",
      formality: "informal"
    },
    {
      expression: "Está padrísimo",
      meaning: "It's really cool/awesome",
      context: "High praise for something",
      example: "El concierto está padrísimo.",
      formality: "informal"
    },
    {
      expression: "Andar de malas",
      meaning: "To be in a bad mood",
      context: "Having bad luck or feeling down",
      example: "Hoy ando de malas, perdí la cartera.",
      formality: "informal"
    },
    {
      expression: "Echar la hueva",
      meaning: "To be lazy",
      context: "Not wanting to do anything",
      example: "Hoy solo quiero echar la hueva.",
      formality: "informal"
    },
    {
      expression: "Dar el gatazo",
      meaning: "To disappoint",
      context: "Something not meeting expectations",
      example: "La película dio el gatazo.",
      formality: "informal"
    },
    {
      expression: "Estar hasta la madre",
      meaning: "To be fed up",
      context: "Being extremely annoyed (vulgar)",
      example: "Estoy hasta la madre del tráfico.",
      formality: "informal"
    },
    {
      expression: "Ponerse las pilas",
      meaning: "To get energized/focused",
      context: "Need to work harder or pay attention",
      example: "Ponte las pilas para el examen.",
      formality: "informal"
    },
    {
      expression: "¡A toda madre!",
      meaning: "Awesome! / Excellent!",
      context: "High praise (vulgar but common)",
      example: "¡Está a toda madre tu carro nuevo!",
      formality: "informal"
    }
  ],
  culturalNotes: [
    {
      topic: "Punctuality",
      description: "Mexican time can be more flexible, especially for social events",
      tip: "Arrive 15-30 minutes late to parties, but be on time for business"
    },
    {
      topic: "Formal Address",
      description: "Use 'usted' with older people and in formal situations",
      tip: "When in doubt, start with 'usted' until invited to use 'tú'"
    },
    {
      topic: "Family Importance",
      description: "Family gatherings are central to Mexican culture",
      tip: "Don't be surprised if family events take priority over other plans"
    }
  ],
  pronunciation: {
    characteristics: [
      "Soft 's' sounds, often not pronounced at end of words",
      "'x' in indigenous words pronounced as 'sh' (México = MEH-shi-ko)",
      "Seseo: 'c' and 'z' pronounced as 's'",
      "Aspirated 's' in many regions"
    ],
    audioTips: [
      "Say 'México' with 'sh' sound, not 'x'",
      "Practice dropping final 's' sounds",
      "All 'c' and 'z' sounds like English 's'"
    ]
  }
};

// Argentina - Rioplatense Spanish
const argentinaData: RegionalData = {
  country: "Argentina",
  flag: "🇦🇷",
  vocabulary: [
    {
      word: "computadora",
      meaning: "computer",
      pronunciation: "kom-pu-ta-DO-ra",
      usage: "Standard term for computer",
      example: "Mi computadora está rota.",
      difficulty: "beginner",
      category: "technology"
    },
    {
      word: "celular",
      meaning: "cell phone",
      pronunciation: "se-lu-LAR",
      usage: "Mobile phone",
      example: "¿Tenés el celular?",
      difficulty: "beginner",
      category: "technology"
    },
    {
      word: "auto",
      meaning: "car",
      pronunciation: "AU-to",
      usage: "Most common word for car",
      example: "Voy en auto al trabajo.",
      difficulty: "beginner",
      category: "transportation"
    },
    {
      word: "departamento",
      meaning: "apartment",
      pronunciation: "de-par-ta-MEN-to",
      usage: "Apartment or flat",
      example: "Vivo en un departamento céntrico.",
      difficulty: "beginner",
      category: "housing"
    },
    {
      word: "jugo",
      meaning: "juice",
      pronunciation: "HU-go",
      usage: "Fruit juice",
      example: "Quiero un jugo de naranja.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "papas",
      meaning: "potatoes",
      pronunciation: "PA-pas",
      usage: "Standard term for potatoes",
      example: "Las papas fritas están buenísimas.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "anteojos",
      meaning: "glasses",
      pronunciation: "an-te-O-hos",
      usage: "Eyeglasses",
      example: "¿Viste mis anteojos?",
      difficulty: "beginner",
      category: "accessories"
    },
    {
      word: "pullover",
      meaning: "sweater",
      pronunciation: "PU-llo-ver",
      usage: "Warm clothing item",
      example: "Hace frío, poné el pullover.",
      difficulty: "beginner",
      category: "clothing"
    },
    {
      word: "manejar",
      meaning: "to drive",
      pronunciation: "ma-ne-HAR",
      usage: "To drive a vehicle",
      example: "¿Sabés manejar?",
      difficulty: "intermediate",
      category: "verbs"
    },
    {
      word: "estacionar",
      meaning: "to park",
      pronunciation: "es-ta-sio-NAR",
      usage: "To park a vehicle",
      example: "No podés estacionar acá.",
      difficulty: "intermediate",
      category: "verbs"
    },
    {
      word: "plomero",
      meaning: "plumber",
      pronunciation: "plo-ME-ro",
      usage: "Professional who fixes pipes",
      example: "Llamé al plomero por la pérdida.",
      difficulty: "intermediate",
      category: "professions"
    },
    {
      word: "ascensor",
      meaning: "elevator",
      pronunciation: "as-sen-SOR",
      usage: "Lift in buildings",
      example: "El ascensor no funciona.",
      difficulty: "intermediate",
      category: "buildings"
    },
    {
      word: "colectivo",
      meaning: "bus",
      pronunciation: "ko-lek-TI-vo",
      usage: "Public transportation bus",
      example: "Tomé el colectivo para venir.",
      difficulty: "intermediate",
      category: "transportation"
    },
    {
      word: "subte",
      meaning: "subway",
      pronunciation: "SUB-te",
      usage: "Underground train system",
      example: "Prefiero viajar en subte.",
      difficulty: "intermediate",
      category: "transportation"
    },
    {
      word: "pileta",
      meaning: "swimming pool",
      pronunciation: "pi-LE-ta",
      usage: "Pool for swimming",
      example: "Los chicos están en la pileta.",
      difficulty: "intermediate",
      category: "recreation"
    },
    {
      word: "asado",
      meaning: "barbecue",
      pronunciation: "a-SA-do",
      usage: "Traditional Argentine barbecue",
      example: "Hagamos un asado el domingo.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "empanadas",
      meaning: "meat pies",
      pronunciation: "em-pa-NA-das",
      usage: "Traditional Argentine pastries",
      example: "Compré empanadas para la cena.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "mate",
      meaning: "traditional tea drink",
      pronunciation: "MA-te",
      usage: "Traditional herbal drink",
      example: "¿Querés un mate?",
      difficulty: "intermediate",
      category: "culture"
    },
    {
      word: "che",
      meaning: "hey/dude",
      pronunciation: "CHE",
      usage: "Informal address, very common",
      example: "Che, ¿cómo andás?",
      difficulty: "advanced",
      category: "expressions"
    },
    {
      word: "boludo",
      meaning: "dude/idiot",
      pronunciation: "bo-LU-do",
      usage: "Very informal, can be friendly or insulting",
      example: "¿Qué hacés, boludo?",
      difficulty: "advanced",
      category: "slang"
    },
    {
      word: "laburo",
      meaning: "work/job",
      pronunciation: "la-BU-ro",
      usage: "Informal term for work",
      example: "Mañana tengo mucho laburo.",
      difficulty: "advanced",
      category: "slang"
    },
    {
      word: "birra",
      meaning: "beer",
      pronunciation: "BI-rra",
      usage: "Informal term for beer",
      example: "¿Nos tomamos una birra?",
      difficulty: "advanced",
      category: "slang"
    }
  ],
  expressions: [
    {
      expression: "¡Qué copado!",
      meaning: "How cool! / Awesome!",
      context: "Expressing approval or excitement",
      example: "¡Qué copado tu nuevo trabajo!",
      formality: "informal"
    },
    {
      expression: "No da",
      meaning: "It's not okay / It's not right",
      context: "Something inappropriate or wrong",
      example: "Llegar tarde a la cita no da.",
      formality: "informal"
    },
    {
      expression: "¿Cómo andás?",
      meaning: "How are you doing?",
      context: "Casual greeting using 'vos'",
      example: "¡Hola! ¿Cómo andás?",
      formality: "informal"
    },
    {
      expression: "Estar al pedo",
      meaning: "To be doing nothing",
      context: "Being bored or idle (vulgar)",
      example: "Estoy al pedo, no tengo nada que hacer.",
      formality: "informal"
    },
    {
      expression: "Zafar",
      meaning: "To manage / to get by",
      context: "Getting through a difficult situation",
      example: "Con este sueldo, apenas zafo.",
      formality: "informal"
    },
    {
      expression: "Estar en el horno",
      meaning: "To be in trouble",
      context: "Being in a difficult situation",
      example: "Si no estudio, estoy en el horno.",
      formality: "informal"
    },
    {
      expression: "Flashear",
      meaning: "To imagine / to think crazy thoughts",
      context: "Having wild ideas or thoughts",
      example: "Estás flasheando, eso es imposible.",
      formality: "informal"
    },
    {
      expression: "Bancar",
      meaning: "To support / to put up with",
      context: "Supporting someone or tolerating something",
      example: "Te banco en esta decisión.",
      formality: "informal"
    },
    {
      expression: "Estar de más",
      meaning: "To be unnecessary / out of place",
      context: "Something or someone not needed",
      example: "Ese comentario estaba de más.",
      formality: "informal"
    },
    {
      expression: "Quilombo",
      meaning: "Mess / chaos",
      context: "Complicated or messy situation",
      example: "La reunión fue un quilombo total.",
      formality: "informal"
    }
  ],
  culturalNotes: [
    {
      topic: "Voseo",
      description: "Argentines use 'vos' instead of 'tú' with different verb conjugations",
      tip: "Use 'tenés' instead of 'tienes', 'sos' instead of 'eres'"
    },
    {
      topic: "Mate Culture",
      description: "Sharing mate is a social ritual and sign of friendship",
      tip: "Don't touch the bombilla (straw) and pass it back to the same person"
    },
    {
      topic: "Late Dining",
      description: "Dinner is typically eaten after 9 PM, sometimes as late as 11 PM",
      tip: "Don't expect restaurants to be busy before 9 PM"
    }
  ],
  pronunciation: {
    characteristics: [
      "Yeísmo: 'll' and 'y' pronounced as 'sh' or 'zh'",
      "Strong Italian influence in intonation",
      "Final 's' often aspirated or dropped",
      "Distinctive 'vos' conjugations"
    ],
    audioTips: [
      "Say 'llamar' as 'shamar' or 'zhamar'",
      "Practice vos conjugations: 'vos tenés', 'vos sos'",
      "Note the musical, Italian-like intonation"
    ]
  }
};

// Colombia - Colombian Spanish
const colombiaData: RegionalData = {
  country: "Colombia",
  flag: "🇨🇴",
  vocabulary: [
    {
      word: "computador",
      meaning: "computer",
      pronunciation: "kom-pu-ta-DOR",
      usage: "Standard term for computer",
      example: "Mi computador está lento hoy.",
      difficulty: "beginner",
      category: "technology"
    },
    {
      word: "celular",
      meaning: "cell phone",
      pronunciation: "se-lu-LAR",
      usage: "Mobile phone",
      example: "¿Me prestás tu celular?",
      difficulty: "beginner",
      category: "technology"
    },
    {
      word: "carro",
      meaning: "car",
      pronunciation: "KA-rro",
      usage: "Most common word for car",
      example: "Voy en carro al trabajo.",
      difficulty: "beginner",
      category: "transportation"
    },
    {
      word: "apartamento",
      meaning: "apartment",
      pronunciation: "a-par-ta-MEN-to",
      usage: "Apartment or flat",
      example: "Vivo en un apartamento pequeño.",
      difficulty: "beginner",
      category: "housing"
    },
    {
      word: "jugo",
      meaning: "juice",
      pronunciation: "HU-go",
      usage: "Fruit juice",
      example: "Me gusta el jugo de maracuyá.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "papas",
      meaning: "potatoes",
      pronunciation: "PA-pas",
      usage: "Standard term for potatoes",
      example: "Las papas rellenas están deliciosas.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "gafas",
      meaning: "glasses",
      pronunciation: "GA-fas",
      usage: "Eyeglasses",
      example: "Necesito mis gafas para leer.",
      difficulty: "beginner",
      category: "accessories"
    },
    {
      word: "buzo",
      meaning: "sweater",
      pronunciation: "BU-so",
      usage: "Warm clothing item",
      example: "Hace frío, ponte el buzo.",
      difficulty: "beginner",
      category: "clothing"
    },
    {
      word: "manejar",
      meaning: "to drive",
      pronunciation: "ma-ne-HAR",
      usage: "To drive a vehicle",
      example: "¿Sabés manejar moto?",
      difficulty: "intermediate",
      category: "verbs"
    },
    {
      word: "parquear",
      meaning: "to park",
      pronunciation: "par-ke-AR",
      usage: "To park a vehicle",
      example: "Voy a parquear en el centro comercial.",
      difficulty: "intermediate",
      category: "verbs"
    },
    {
      word: "plomero",
      meaning: "plumber",
      pronunciation: "plo-ME-ro",
      usage: "Professional who fixes pipes",
      example: "El plomero viene mañana.",
      difficulty: "intermediate",
      category: "professions"
    },
    {
      word: "ascensor",
      meaning: "elevator",
      pronunciation: "as-sen-SOR",
      usage: "Lift in buildings",
      example: "Subamos por el ascensor.",
      difficulty: "intermediate",
      category: "buildings"
    },
    {
      word: "bus",
      meaning: "bus",
      pronunciation: "BUS",
      usage: "Public transportation",
      example: "Tomé el bus para llegar acá.",
      difficulty: "beginner",
      category: "transportation"
    },
    {
      word: "piscina",
      meaning: "swimming pool",
      pronunciation: "pis-SI-na",
      usage: "Pool for swimming",
      example: "Los niños están en la piscina.",
      difficulty: "intermediate",
      category: "recreation"
    },
    {
      word: "tinto",
      meaning: "black coffee",
      pronunciation: "TIN-to",
      usage: "Small cup of black coffee",
      example: "¿Querés un tinto?",
      difficulty: "intermediate",
      category: "drinks"
    },
    {
      word: "arepa",
      meaning: "corn cake",
      pronunciation: "a-RE-pa",
      usage: "Traditional Colombian food",
      example: "Desayuné arepa con queso.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "empanada",
      meaning: "fried pastry",
      pronunciation: "em-pa-NA-da",
      usage: "Traditional fried pastry with filling",
      example: "Compré empanadas de pollo.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "chévere",
      meaning: "cool/great",
      pronunciation: "CHE-ve-re",
      usage: "Something good or positive",
      example: "¡Qué chévere tu camiseta!",
      difficulty: "advanced",
      category: "slang"
    },
    {
      word: "bacano",
      meaning: "cool/awesome",
      pronunciation: "ba-KA-no",
      usage: "Something really good",
      example: "Está muy bacano el concierto.",
      difficulty: "advanced",
      category: "slang"
    },
    {
      word: "parcero",
      meaning: "buddy/friend",
      pronunciation: "par-SE-ro",
      usage: "Informal term for friend",
      example: "¿Qué tal, parcero?",
      difficulty: "advanced",
      category: "slang"
    },
    {
      word: "plata",
      meaning: "money",
      pronunciation: "PLA-ta",
      usage: "Informal term for money",
      example: "No tengo plata para el cine.",
      difficulty: "advanced",
      category: "slang"
    },
    {
      word: "chimba",
      meaning: "awesome/cool",
      pronunciation: "CHIM-ba",
      usage: "Something excellent (can be vulgar)",
      example: "¡Qué chimba de partido!",
      difficulty: "advanced",
      category: "slang"
    }
  ],
  expressions: [
    {
      expression: "¡Qué chévere!",
      meaning: "How cool! / How great!",
      context: "Expressing approval or excitement",
      example: "¡Qué chévere que viniste!",
      formality: "informal"
    },
    {
      expression: "¡Uy, no!",
      meaning: "Oh no! / No way!",
      context: "Expressing surprise or disagreement",
      example: "¿Llueve otra vez? ¡Uy, no!",
      formality: "informal"
    },
    {
      expression: "¿Qué más?",
      meaning: "What's up? / How's it going?",
      context: "Casual greeting",
      example: "¡Hola! ¿Qué más?",
      formality: "informal"
    },
    {
      expression: "Estar mamado",
      meaning: "To be tired/fed up",
      context: "Being exhausted or annoyed",
      example: "Estoy mamado del trabajo.",
      formality: "informal"
    },
    {
      expression: "Dar papaya",
      meaning: "To give opportunity for trouble",
      context: "Making oneself vulnerable",
      example: "No des papaya con el celular.",
      formality: "informal"
    },
    {
      expression: "Echar los perros",
      meaning: "To flirt",
      context: "Trying to court someone",
      example: "Le está echando los perros a María.",
      formality: "informal"
    },
    {
      expression: "Estar enguayabado",
      meaning: "To be hungover",
      context: "Feeling bad after drinking",
      example: "Estoy muy enguayabado hoy.",
      formality: "informal"
    },
    {
      expression: "¡Qué pena!",
      meaning: "How embarrassing! / What a shame!",
      context: "Expressing embarrassment or regret",
      example: "¡Qué pena llegar tarde!",
      formality: "neutral"
    },
    {
      expression: "Pilas",
      meaning: "Be careful / Pay attention",
      context: "Warning or advice",
      example: "Pilas con el tráfico.",
      formality: "informal"
    },
    {
      expression: "¡Listo!",
      meaning: "Ready! / Done! / Okay!",
      context: "Confirming completion or agreement",
      example: "¿Nos vemos a las 8? ¡Listo!",
      formality: "neutral"
    }
  ],
  culturalNotes: [
    {
      topic: "Courtesy",
      description: "Colombians are very polite and use formal greetings frequently",
      tip: "Always greet people when entering a room or elevator"
    },
    {
      topic: "Coffee Culture",
      description: "Coffee is central to Colombian culture, often offered to guests",
      tip: "Accept coffee when offered, it's a sign of hospitality"
    },
    {
      topic: "Regional Variations",
      description: "Each region has distinct accents and vocabulary",
      tip: "Coastal Spanish differs significantly from Andean Spanish"
    }
  ],
  pronunciation: {
    characteristics: [
      "Clear pronunciation of all vowels",
      "Softer 's' sounds in coastal regions",
      "Strong 'rr' rolling",
      "Distinctive intonation patterns by region"
    ],
    audioTips: [
      "Practice clear vowel sounds",
      "Coast vs mountains have different rhythms",
      "Roll your R's clearly in 'carro'"
    ]
  }
};

// Peru - Peruvian Spanish
const peruData: RegionalData = {
  country: "Perú",
  flag: "🇵🇪",
  vocabulary: [
    {
      word: "computadora",
      meaning: "computer",
      pronunciation: "kom-pu-ta-DO-ra",
      usage: "Standard term for computer",
      example: "Mi computadora es nueva.",
      difficulty: "beginner",
      category: "technology"
    },
    {
      word: "celular",
      meaning: "cell phone",
      pronunciation: "se-lu-LAR",
      usage: "Mobile phone",
      example: "¿Tienes tu celular?",
      difficulty: "beginner",
      category: "technology"
    },
    {
      word: "carro",
      meaning: "car",
      pronunciation: "KA-rro",
      usage: "Most common word for car",
      example: "Voy en carro a trabajar.",
      difficulty: "beginner",
      category: "transportation"
    },
    {
      word: "departamento",
      meaning: "apartment",
      pronunciation: "de-par-ta-MEN-to",
      usage: "Apartment or flat",
      example: "Alquilo un departamento céntrico.",
      difficulty: "beginner",
      category: "housing"
    },
    {
      word: "jugo",
      meaning: "juice",
      pronunciation: "HU-go",
      usage: "Fruit juice",
      example: "Quiero jugo de papaya.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "papas",
      meaning: "potatoes",
      pronunciation: "PA-pas",
      usage: "Peru has hundreds of potato varieties",
      example: "Las papas rellenas son típicas.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "lentes",
      meaning: "glasses",
      pronunciation: "LEN-tes",
      usage: "Eyeglasses",
      example: "Perdí mis lentes de sol.",
      difficulty: "beginner",
      category: "accessories"
    },
    {
      word: "chompa",
      meaning: "sweater",
      pronunciation: "CHOM-pa",
      usage: "Warm clothing item",
      example: "Hace frío, ponte la chompa.",
      difficulty: "beginner",
      category: "clothing"
    },
    {
      word: "manejar",
      meaning: "to drive",
      pronunciation: "ma-ne-HAR",
      usage: "To drive a vehicle",
      example: "¿Sabes manejar?",
      difficulty: "intermediate",
      category: "verbs"
    },
    {
      word: "estacionar",
      meaning: "to park",
      pronunciation: "es-ta-sio-NAR",
      usage: "To park a vehicle",
      example: "Voy a estacionar en la esquina.",
      difficulty: "intermediate",
      category: "verbs"
    },
    {
      word: "gasfitero",
      meaning: "plumber",
      pronunciation: "gas-fi-TE-ro",
      usage: "Professional who fixes pipes",
      example: "Llamé al gasfitero por la fuga.",
      difficulty: "intermediate",
      category: "professions"
    },
    {
      word: "ascensor",
      meaning: "elevator",
      pronunciation: "as-sen-SOR",
      usage: "Lift in buildings",
      example: "Subimos en el ascensor.",
      difficulty: "intermediate",
      category: "buildings"
    },
    {
      word: "micro",
      meaning: "bus",
      pronunciation: "MI-kro",
      usage: "Public transportation bus",
      example: "Tomé el micro para llegar.",
      difficulty: "intermediate",
      category: "transportation"
    },
    {
      word: "combi",
      meaning: "minibus",
      pronunciation: "KOM-bi",
      usage: "Small public transport vehicle",
      example: "La combi va llena de gente.",
      difficulty: "intermediate",
      category: "transportation"
    },
    {
      word: "piscina",
      meaning: "swimming pool",
      pronunciation: "pis-SI-na",
      usage: "Pool for swimming",
      example: "Los niños juegan en la piscina.",
      difficulty: "intermediate",
      category: "recreation"
    },
    {
      word: "ceviche",
      meaning: "raw fish dish",
      pronunciation: "se-VI-che",
      usage: "Traditional Peruvian dish",
      example: "El ceviche está fresco.",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "pisco",
      meaning: "grape brandy",
      pronunciation: "PIS-ko",
      usage: "Traditional Peruvian alcoholic drink",
      example: "Preparamos pisco sour.",
      difficulty: "intermediate",
      category: "drinks"
    },
    {
      word: "chifa",
      meaning: "Chinese-Peruvian food",
      pronunciation: "CHI-fa",
      usage: "Chinese-Peruvian fusion cuisine",
      example: "Vamos al chifa a almorzar.",
      difficulty: "advanced",
      category: "food"
    },
    {
      word: "pata",
      meaning: "friend/buddy",
      pronunciation: "PA-ta",
      usage: "Informal term for friend",
      example: "¿Qué tal, pata?",
      difficulty: "advanced",
      category: "slang"
    },
    {
      word: "jato",
      meaning: "house/home",
      pronunciation: "HA-to",
      usage: "Informal term for home",
      example: "Vamos a mi jato.",
      difficulty: "advanced",
      category: "slang"
    },
    {
      word: "chamba",
      meaning: "work/job",
      pronunciation: "CHAM-ba",
      usage: "Informal term for work",
      example: "Tengo mucha chamba hoy.",
      difficulty: "advanced",
      category: "slang"
    },
    {
      word: "huachafo",
      meaning: "tacky/cheap",
      pronunciation: "wa-CHA-fo",
      usage: "Something in bad taste",
      example: "Esa decoración está huachafa.",
      difficulty: "advanced",
      category: "slang"
    }
  ],
  expressions: [
    {
      expression: "¡Qué tal raza!",
      meaning: "What's up, people!",
      context: "Casual group greeting",
      example: "¡Hola! ¡Qué tal raza!",
      formality: "informal"
    },
    {
      expression: "¡Qué bestia!",
      meaning: "How awesome! / Incredible!",
      context: "Expressing amazement",
      example: "¡Qué bestia tu nuevo carro!",
      formality: "informal"
    },
    {
      expression: "Está con su toque",
      meaning: "It's really good/special",
      context: "Something has a special quality",
      example: "Tu comida está con su toque.",
      formality: "informal"
    },
    {
      expression: "¡Asu mare!",
      meaning: "Oh my! / Wow!",
      context: "Expressing surprise (mild vulgar)",
      example: "¡Asu mare, qué carro tan bonito!",
      formality: "informal"
    },
    {
      expression: "Estar jodido",
      meaning: "To be in trouble/broke",
      context: "Bad situation (vulgar)",
      example: "Estoy jodido sin trabajo.",
      formality: "informal"
    },
    {
      expression: "¡Ya pe!",
      meaning: "Come on! / Enough!",
      context: "Showing impatience or agreement",
      example: "¡Ya pe, vámonos!",
      formality: "informal"
    },
    {
      expression: "Ser una mosca muerta",
      meaning: "To be very quiet/shy",
      context: "Someone who appears innocent",
      example: "No te dejes engañar, es una mosca muerta.",
      formality: "informal"
    },
    {
      expression: "Estar en la huacas",
      meaning: "To be far away",
      context: "Somewhere very distant",
      example: "Su casa está en las huacas.",
      formality: "informal"
    },
    {
      expression: "¡Qué roche!",
      meaning: "How embarrassing!",
      context: "Feeling shame or embarrassment",
      example: "¡Qué roche llegar tarde!",
      formality: "informal"
    },
    {
      expression: "Estar yuca",
      meaning: "To be difficult/tough",
      context: "Something challenging",
      example: "El examen está yuca.",
      formality: "informal"
    }
  ],
  culturalNotes: [
    {
      topic: "Indigenous Influence",
      description: "Many Quechua and other indigenous words are used in daily Spanish",
      tip: "Words like 'cancha' (popcorn) come from Quechua"
    },
    {
      topic: "Food Culture",
      description: "Peru has incredibly diverse cuisine, considered among world's best",
      tip: "Try different regional specialties, each area has unique dishes"
    },
    {
      topic: "Formality",
      description: "Peruvians can be quite formal in business and with elders",
      tip: "Use 'usted' until invited to use 'tú'"
    }
  ],
  pronunciation: {
    characteristics: [
      "Clear pronunciation influenced by Quechua",
      "Some indigenous sounds in local words",
      "Softer 's' in Lima and coast",
      "Distinctive Andean rhythm in mountains"
    ],
    audioTips: [
      "Practice Quechua-origin words with original sounds",
      "Coastal accent is softer, mountain accent stronger",
      "Pay attention to indigenous place names"
    ]
  }
};

// Regional data collection
export const regionalData: Record<string, RegionalData> = {
  spain: spainData,
  mexico: mexicoData,
  argentina: argentinaData,
  colombia: colombiaData,
  peru: peruData
};

// Daily content generation
const generateDailyContent = (region: string): DailyContent => {
  const data = regionalData[region];
  if (!data) {
    throw new Error(`Region ${region} not found`);
  }

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);

  // Use day of year to select consistent daily content
  const vocabIndex = dayOfYear % data.vocabulary.length;
  const exprIndex = dayOfYear % data.expressions.length;
  const noteIndex = dayOfYear % data.culturalNotes.length;

  return {
    word: data.vocabulary[vocabIndex],
    expression: data.expressions[exprIndex],
    culturalTip: data.culturalNotes[noteIndex].description,
    date: today.toISOString().split('T')[0]
  };
};

// Export functions
export const getRegionalVocabulary = (region: string, category?: string): VocabularyItem[] => {
  const data = regionalData[region];
  if (!data) {
    throw new Error(`Region ${region} not found`);
  }

  if (category) {
    return data.vocabulary.filter(item => item.category === category);
  }

  return data.vocabulary;
};

export const getDailyContent = (region: string): DailyContent => {
  return generateDailyContent(region);
};

export const getExpressions = (region: string, formality?: 'informal' | 'formal' | 'neutral'): RegionalExpression[] => {
  const data = regionalData[region];
  if (!data) {
    throw new Error(`Region ${region} not found`);
  }

  if (formality) {
    return data.expressions.filter(expr => expr.formality === formality);
  }

  return data.expressions;
};

export const getCulturalNotes = (region: string): CulturalNote[] => {
  const data = regionalData[region];
  if (!data) {
    throw new Error(`Region ${region} not found`);
  }

  return data.culturalNotes;
};

export const getPronunciationGuide = (region: string) => {
  const data = regionalData[region];
  if (!data) {
    throw new Error(`Region ${region} not found`);
  }

  return data.pronunciation;
};

export const getRandomVocabulary = (region: string, count: number = 5): VocabularyItem[] => {
  const vocabulary = getRegionalVocabulary(region);
  const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const searchVocabulary = (region: string, searchTerm: string): VocabularyItem[] => {
  const vocabulary = getRegionalVocabulary(region);
  const term = searchTerm.toLowerCase();

  return vocabulary.filter(item =>
    item.word.toLowerCase().includes(term) ||
    item.meaning.toLowerCase().includes(term) ||
    item.usage.toLowerCase().includes(term)
  );
};

export const getVocabularyByDifficulty = (region: string, difficulty: 'beginner' | 'intermediate' | 'advanced'): VocabularyItem[] => {
  const vocabulary = getRegionalVocabulary(region);
  return vocabulary.filter(item => item.difficulty === difficulty);
};

export const getAvailableRegions = (): string[] => {
  return Object.keys(regionalData);
};

export const getRegionInfo = (region: string) => {
  const data = regionalData[region];
  if (!data) {
    throw new Error(`Region ${region} not found`);
  }

  return {
    country: data.country,
    flag: data.flag,
    vocabularyCount: data.vocabulary.length,
    expressionsCount: data.expressions.length,
    culturalNotesCount: data.culturalNotes.length
  };
};

// Word of the day functionality
export const getWordOfTheDay = (region: string): VocabularyItem => {
  const dailyContent = getDailyContent(region);
  return dailyContent.word;
};

// Expression of the day functionality
export const getExpressionOfTheDay = (region: string): RegionalExpression => {
  const dailyContent = getDailyContent(region);
  return dailyContent.expression;
};

export default regionalData;