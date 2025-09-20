/**
 * Comprehensive Spanish translations for Colombia Puzzle Game
 * Focused on Colombian Spanish dialect (es-CO)
 * Cultural adaptation for Colombian users
 */

export interface TranslationKeys {
  // Navigation and main menu
  navigation: {
    title: string;
    subtitle: string;
    backToModes: string;
    close: string;
    menu: string;
  };

  // Game modes and selection
  gameModes: {
    title: string;
    subtitle: string;
    fullCountry: {
      title: string;
      description: string;
      badge: string;
    };
    regions: {
      title: string;
      description: string;
      badge: string;
      recommended: string;
    };
    study: {
      title: string;
      description: string;
      badge: string;
    };
    selectRegions: {
      title: string;
      description: string;
      selectInstructions: string;
      startGame: string;
      selectedCount: string;
      selectAtLeast: string;
    };
  };

  // Game header and controls
  gameHeader: {
    title: string;
    subtitle: string;
    controls: {
      score: string;
      points: string;
      time: string;
      paused: string;
      progress: string;
      hints: string;
      pause: string;
      resume: string;
      restart: string;
      mode: string;
      tutorial: string;
      study: string;
    };
    modeDisplays: {
      full: string;
      progression: string;
      custom: string;
    };
  };

  // Educational panel and instructions
  educational: {
    selectedDepartment: string;
    fields: {
      name: string;
      capital: string;
      region: string;
      area: string;
      population: string;
    };
    useHint: string;
    instructions: {
      title: string;
      steps: string[];
      tip: string;
      tipText: string;
    };
    statistics: {
      title: string;
      failed: string;
      accuracy: string;
      remaining: string;
    };
    learningTips: {
      title: string;
      colombiaFacts: string;
    };
  };

  // Hint system
  hints: {
    cost: string;
    understood: string;
    levels: {
      level1: {
        insular: string;
        coastal: string;
        border: string;
        small: string;
        large: string;
        regional: string;
      };
      level2: {
        exactLocation: string;
        connections: string;
        keyNeighbors: string;
        specificPosition: string;
        connectedDepartment: string;
        neighborsKey: string;
        bordersWith: string;
        form: string;
        area: string;
      };
      level3: {
        maximumHelp: string;
        lookHere: string;
        characteristicForm: string;
        allNeighbors: string;
        capital: string;
        encouragement: string;
      };
    };
    geographic: {
      coastTypes: {
        pacific: string;
        caribbean: string;
      };
      borderCountries: {
        venezuela: string;
        brazil: string;
        peru: string;
        ecuador: string;
      };
      characteristics: {
        largest: string;
        smallest: string;
        onlyInsular: string;
        mostConnected: string;
        triangularShape: string;
        rectangularShape: string;
        irregularShape: string;
      };
    };
  };

  // Regional information (Colombian Spanish terminology)
  regions: {
    names: {
      Insular: string;
      Pacífica: string;
      Orinoquía: string;
      Amazonía: string;
      Caribe: string;
      Andina: string;
    };
    difficulty: {
      easy: string;
      medium: string;
      hard: string;
      expert: string;
    };
    descriptions: {
      Insular: string;
      Pacífica: string;
      Orinoquía: string;
      Amazonía: string;
      Caribe: string;
      Andina: string;
    };
  };

  // Colombian departments (cultural adaptations)
  departments: {
    // Note: Keep original names but provide cultural context
    culturalNotes: {
      'San Andrés y Providencia': string;
      'Norte de Santander': string;
      'Valle del Cauca': string;
      'Bogotá D.C.': string;
    };
  };

  // Feedback and quiz system
  feedback: {
    correct: string;
    incorrect: string;
    excellent: string;
    good: string;
    tryAgain: string;
    perfectScore: string;
    almostThere: string;
    keepGoing: string;
    wellDone: string;
    congratulations: string;
    gameCompleted: string;
    newRecord: string;
    improvementSuggestion: string;
  };

  // Study modes and learning
  study: {
    title: string;
    modes: {
      explore: string;
      quiz: string;
      practice: string;
      challenge: string;
    };
    quizQuestions: {
      findDepartment: string;
      whichCapital: string;
      whichRegion: string;
      largestDepartment: string;
      smallestDepartment: string;
      coastalDepartments: string;
      borderDepartments: string;
    };
    instructions: {
      exploreMode: string;
      quizMode: string;
      practiceMode: string;
      challengeMode: string;
    };
  };

  // Tutorial and help
  tutorial: {
    title: string;
    welcome: string;
    steps: {
      selectDepartment: string;
      dragToMap: string;
      dropInPlace: string;
      earnPoints: string;
      useHints: string;
      complete: string;
    };
    tips: {
      regions: string;
      hints: string;
      scoring: string;
      difficulty: string;
    };
    next: string;
    previous: string;
    finish: string;
    skip: string;
  };

  // Error messages and validation
  errors: {
    gameError: string;
    loadingError: string;
    notFound: string;
    tryAgainLater: string;
    invalidSelection: string;
    noHintsLeft: string;
    connectionError: string;
    browserNotSupported: string;
  };

  // Accessibility labels (ARIA)
  accessibility: {
    gameControl: string;
    mapArea: string;
    departmentTray: string;
    educationalPanel: string;
    progressBar: string;
    scoreDisplay: string;
    timerDisplay: string;
    hintButton: string;
    pauseButton: string;
    playButton: string;
    restartButton: string;
    closeButton: string;
    selectRegion: string;
    dragDepartment: string;
    dropZone: string;
  };

  // Colombian cultural expressions and encouragement
  cultural: {
    greetings: {
      welcome: string;
      goodLuck: string;
      excellent: string;
      veryGood: string;
    };
    expressions: {
      awesome: string;
      fantastic: string;
      incredible: string;
      perfect: string;
      outstanding: string;
    };
    encouragement: {
      keepGoing: string;
      almostThere: string;
      dontGiveUp: string;
      youCanDoIt: string;
      oneMoreTime: string;
    };
  };

  // Time and scoring
  time: {
    minutes: string;
    seconds: string;
    hours: string;
    elapsed: string;
    bestTime: string;
    averageTime: string;
  };

  // Units and measurements (Colombian standards)
  units: {
    kilometers: string;
    squareKilometers: string;
    inhabitants: string;
    departments: string;
    stars: string;
    attempts: string;
  };
}

export const esCOTranslations: TranslationKeys = {
  navigation: {
    title: '🇨🇴 Rompecabezas de Colombia',
    subtitle: 'Aprendé los departamentos de nuestra hermosa Colombia',
    backToModes: '← Volver a modos',
    close: 'Cerrar',
    menu: 'Menú',
  },

  gameModes: {
    title: 'Elegí Tu Modo de Juego',
    subtitle: 'Tres formas cheveres de aprender los departamentos de Colombia',
    fullCountry: {
      title: 'Colombia Completa',
      description: 'Los 33 departamentos de una vez. ¡El reto completo, parcero!',
      badge: '33 departamentos',
    },
    regions: {
      title: 'Por Regiones',
      description: 'Elegí regiones específicas para practicar de a poquitos.',
      badge: '1-10 departamentos',
      recommended: 'Recomendado',
    },
    study: {
      title: 'Modo Estudio',
      description: 'Aprendé primero, después practicá. Bacano para principiantes.',
      badge: 'Aprendizaje',
    },
    selectRegions: {
      title: 'Seleccioná las Regiones',
      description: 'Elegí una o más regiones para practicar.',
      selectInstructions: 'Elegí al menos una región para comenzar',
      startGame: 'Comenzar Juego',
      selectedCount: 'región seleccionada | regiones seleccionadas',
      selectAtLeast: 'Seleccioná al menos una región',
    },
  },

  gameHeader: {
    title: '🇨🇴 Rompecabezas de Colombia',
    subtitle: 'Aprendé los departamentos de Colombia',
    controls: {
      score: 'Puntos',
      points: 'Puntos',
      time: 'Tiempo',
      paused: 'Pausado',
      progress: 'Progreso',
      hints: 'Pistas',
      pause: 'Pausar',
      resume: 'Continuar',
      restart: 'Reiniciar',
      mode: 'Modo',
      tutorial: 'Tutorial',
      study: 'Estudiar',
    },
    modeDisplays: {
      full: '🌎 Colombia Completa',
      progression: '🎓 Modo Aprendizaje',
      custom: '🎮 Modo Personalizado',
    },
  },

  educational: {
    selectedDepartment: 'Departamento Seleccionado',
    fields: {
      name: 'Nombre',
      capital: 'Capital',
      region: 'Región',
      area: 'Área',
      population: 'Población',
    },
    useHint: 'Usar Pista',
    instructions: {
      title: '¿Cómo Jugar?',
      steps: [
        '1. Seleccioná un departamento de la izquierda',
        '2. Arrastralo hasta su ubicación en el mapa',
        '3. Soltalo en el lugar correcto',
        '4. Ganá puntos por cada acierto',
        '5. Usá pistas si necesitás ayuda',
      ],
      tip: 'Consejo',
      tipText: 'Los colores indican las regiones geográficas de Colombia',
    },
    statistics: {
      title: 'Estadísticas',
      failed: 'Errores',
      accuracy: 'Precisión',
      remaining: 'Faltan',
    },
    learningTips: {
      title: '¿Sabías que...?',
      colombiaFacts: 'Colombia tiene 32 departamentos y un distrito capital. Es el único país suramericano con costas en dos océanos: Pacífico y Atlántico.',
    },
  },

  hints: {
    cost: 'Costo',
    understood: '¡Entendido!',
    levels: {
      level1: {
        insular: 'Territorio Insular',
        coastal: 'Departamento Costero',
        border: 'Frontera Internacional',
        small: 'Tamaño Pequeño',
        large: 'Gran Extensión',
        regional: 'Ubicación Regional',
      },
      level2: {
        exactLocation: 'Ubicación Exacta',
        connections: 'Conexiones',
        keyNeighbors: 'Vecinos Clave',
        specificPosition: 'Posición Específica',
        connectedDepartment: 'Departamento muy conectado',
        neighborsKey: 'Vecinos clave:',
        bordersWith: 'Limita con:',
        form: 'Forma:',
        area: 'Área:',
      },
      level3: {
        maximumHelp: 'Ayuda Máxima',
        lookHere: 'Buscalo acá:',
        characteristicForm: 'Forma característica:',
        allNeighbors: 'Todos sus vecinos:',
        capital: 'Capital:',
        encouragement: '¡Ya casi lo tenés! Esta es la máxima ayuda disponible',
      },
    },
    geographic: {
      coastTypes: {
        pacific: 'Pacífico',
        caribbean: 'Caribe',
      },
      borderCountries: {
        venezuela: 'Venezuela',
        brazil: 'Brasil',
        peru: 'Perú',
        ecuador: 'Ecuador',
      },
      characteristics: {
        largest: 'uno de los más grandes del país',
        smallest: 'uno de los más pequeños',
        onlyInsular: 'el único departamento insular',
        mostConnected: 'Departamento muy conectado',
        triangularShape: 'forma triangular',
        rectangularShape: 'forma rectangular',
        irregularShape: 'forma irregular',
      },
    },
  },

  regions: {
    names: {
      Insular: 'Región Insular',
      Pacífica: 'Región Pacífica',
      Orinoquía: 'Región de la Orinoquía',
      Amazonía: 'Región Amazónica',
      Caribe: 'Región Caribe',
      Andina: 'Región Andina',
    },
    difficulty: {
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil',
      expert: 'Experto',
    },
    descriptions: {
      Insular: 'Islas de San Andrés y Providencia en el Mar Caribe, territorio insular colombiano.',
      Pacífica: 'Costa occidental de Colombia con el océano Pacífico, selvas tropicales y biodiversidad única.',
      Orinoquía: 'Llanos orientales, sabanas extensas y cultura llanera, corazón ganadero de Colombia.',
      Amazonía: 'Selva amazónica colombiana, pulmón del mundo y hogar de comunidades indígenas.',
      Caribe: 'Costa norte de Colombia, cultura costeña, vallenatos y ciudades históricas como Cartagena.',
      Andina: 'Cordillera de los Andes, región montañosa con las principales ciudades como Bogotá, Medellín y Cali.',
    },
  },

  departments: {
    culturalNotes: {
      'San Andrés y Providencia': 'Nuestro territorio insular en el Caribe, conocido por su cultura raizal y el inglés criollo.',
      'Norte de Santander': 'Puerta de entrada a Venezuela, cuna de muchos próceres de la independencia.',
      'Valle del Cauca': 'Tierra de la caña de azúcar y capital mundial de la salsa.',
      'Bogotá D.C.': 'Nuestra capital, el Distrito Capital rodeado por Cundinamarca.',
    },
  },

  feedback: {
    correct: '¡Correcto!',
    incorrect: 'Incorrecto',
    excellent: '¡Excelente!',
    good: '¡Muy bien!',
    tryAgain: 'Intentá de nuevo',
    perfectScore: '¡Puntuación perfecta!',
    almostThere: '¡Ya casi!',
    keepGoing: '¡Seguí así!',
    wellDone: '¡Bien hecho!',
    congratulations: '¡Felicitaciones!',
    gameCompleted: '¡Juego completado!',
    newRecord: '¡Nuevo récord!',
    improvementSuggestion: 'Seguí practicando para mejorar tu tiempo',
  },

  study: {
    title: 'Modo Estudio',
    modes: {
      explore: 'Explorar',
      quiz: 'Evaluación',
      practice: 'Práctica',
      challenge: 'Desafío',
    },
    quizQuestions: {
      findDepartment: '¿Dónde está el departamento de {department}?',
      whichCapital: '¿Cuál es la capital de {department}?',
      whichRegion: '¿A qué región pertenece {department}?',
      largestDepartment: '¿Cuál es el departamento más grande de Colombia?',
      smallestDepartment: '¿Cuál es el departamento más pequeño?',
      coastalDepartments: '¿Cuáles departamentos tienen costa en el Caribe?',
      borderDepartments: '¿Cuáles departamentos hacen frontera con Venezuela?',
    },
    instructions: {
      exploreMode: 'Explorá libremente el mapa y aprendé sobre cada departamento.',
      quizMode: 'Respondé preguntas sobre los departamentos de Colombia.',
      practiceMode: 'Practicá colocando departamentos sin presión de tiempo.',
      challengeMode: 'Desafío cronometrado para poner a prueba tus conocimientos.',
    },
  },

  tutorial: {
    title: 'Tutorial Interactivo',
    welcome: '¡Bienvenido al Rompecabezas de Colombia!',
    steps: {
      selectDepartment: 'Paso 1: Seleccioná un departamento del panel izquierdo',
      dragToMap: 'Paso 2: Arrastralo hacia el mapa de Colombia',
      dropInPlace: 'Paso 3: Soltalo en su ubicación correcta',
      earnPoints: 'Paso 4: Ganá puntos por cada acierto',
      useHints: 'Paso 5: Usá pistas cuando necesites ayuda',
      complete: '¡Completá todos los departamentos para ganar!',
    },
    tips: {
      regions: 'Tip: Los colores representan las regiones de Colombia',
      hints: 'Tip: Las pistas cuestan puntos, ¡usalas sabiamente!',
      scoring: 'Tip: Más rápido = más puntos',
      difficulty: 'Tip: Empezá con regiones pequeñas antes del mapa completo',
    },
    next: 'Siguiente',
    previous: 'Anterior',
    finish: 'Finalizar',
    skip: 'Saltar tutorial',
  },

  errors: {
    gameError: 'Error en el juego',
    loadingError: 'Error cargando el contenido',
    notFound: 'Contenido no encontrado',
    tryAgainLater: 'Intentá de nuevo más tarde',
    invalidSelection: 'Selección inválida',
    noHintsLeft: 'No te quedan más pistas',
    connectionError: 'Error de conexión',
    browserNotSupported: 'Navegador no soportado',
  },

  accessibility: {
    gameControl: 'Panel de control del juego',
    mapArea: 'Área del mapa de Colombia',
    departmentTray: 'Panel de departamentos disponibles',
    educationalPanel: 'Panel educativo con información',
    progressBar: 'Barra de progreso del juego',
    scoreDisplay: 'Mostrar puntuación actual',
    timerDisplay: 'Mostrar tiempo transcurrido',
    hintButton: 'Botón para usar pista',
    pauseButton: 'Pausar el juego',
    playButton: 'Continuar el juego',
    restartButton: 'Reiniciar el juego',
    closeButton: 'Cerrar ventana',
    selectRegion: 'Seleccionar región para jugar',
    dragDepartment: 'Arrastrar departamento al mapa',
    dropZone: 'Zona para soltar departamento',
  },

  cultural: {
    greetings: {
      welcome: '¡Bienvenido, parcero!',
      goodLuck: '¡Que te vaya súper!',
      excellent: '¡Excelente, hermano!',
      veryGood: '¡Muy berraco!',
    },
    expressions: {
      awesome: '¡Bacano!',
      fantastic: '¡Fantástico!',
      incredible: '¡Increíble!',
      perfect: '¡Perfecto!',
      outstanding: '¡Sobresaliente!',
    },
    encouragement: {
      keepGoing: '¡Dale que vas bien!',
      almostThere: '¡Ya mero!',
      dontGiveUp: '¡No te rindás!',
      youCanDoIt: '¡Vos podés!',
      oneMoreTime: '¡Una vez más!',
    },
  },

  time: {
    minutes: 'minutos',
    seconds: 'segundos',
    hours: 'horas',
    elapsed: 'transcurrido',
    bestTime: 'mejor tiempo',
    averageTime: 'tiempo promedio',
  },

  units: {
    kilometers: 'km',
    squareKilometers: 'km²',
    inhabitants: 'habitantes',
    departments: 'departamentos',
    stars: 'estrellas',
    attempts: 'intentos',
  },
};

// Export default Spanish translations
export default esCOTranslations;

// Helper function to get nested translation keys
export function getTranslation(key: string, translations: TranslationKeys = esCOTranslations): string {
  const keys = key.split('.');
  let result: any = translations;

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  return typeof result === 'string' ? result : key;
}

// Helper for pluralization in Spanish
export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

// Helper for interpolation in translations
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
}

// Helper to format Colombian numbers
export function formatColombianNumber(num: number): string {
  return new Intl.NumberFormat('es-CO').format(num);
}

// Helper for Colombian currency formatting
export function formatColombianCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
}