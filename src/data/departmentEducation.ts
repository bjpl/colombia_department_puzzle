// Comprehensive Educational Content for Colombian Departments
// Rich narratives, historical context, and detailed information for Study Mode

export interface DepartmentEducation {
  departmentId: string;
  historiaContexto: string;        // History & Context - full paragraphs
  importanciaEconomica: string;    // Economic Importance - detailed info
  caracteristicasUnicas: string;   // Unique Features - complete descriptions
  patrimonioCultural: string;      // Cultural Heritage - rich narratives
  datosEspecificos: {             // Specific verified data
    fechaCreacion?: string;
    poblacionIndigena?: string;
    patrimonioUNESCO?: string[];
    atraccionesPrincipales?: string[];
    industrias?: string[];
    clima?: string;
    altitud?: string;
  };
}

export const departmentEducationData: DepartmentEducation[] = [
  {
    departmentId: 'amazonas',
    historiaContexto: 'Amazonas representa el corazón de la selva colombiana, un territorio que ha sido habitado por más de 40 grupos indígenas durante milenios. Esta región fue explorada por los conquistadores españoles en el siglo XVI en busca del mítico El Dorado, pero su geografía selvática y la resistencia indígena mantuvieron gran parte del territorio fuera del control colonial. Durante el siglo XX, la extracción de caucho marcó una época violenta conocida como la "fiebre del caucho", documentada magistralmente por José Eustasio Rivera en "La Vorágine".',
    importanciaEconomica: 'La economía amazónica se basa principalmente en la pesca artesanal, la extracción sostenible de productos forestales no maderables, y un creciente ecoturismo. Leticia, su capital, sirve como puerto tripartito con Brasil y Perú, facilitando el comercio fronterizo. Los recursos incluyen maderas finas, plantas medicinales, frutas exóticas como el camu-camu (con el mayor contenido de vitamina C del mundo), y artesanías indígenas. El turismo científico y ecológico genera importantes ingresos, con visitantes internacionales que vienen a observar los delfines rosados del Amazonas.',
    caracteristicasUnicas: 'Amazonas es el departamento más grande de Colombia, cubriendo 109,665 km² (9.6% del territorio nacional) pero albergando menos de 80,000 habitantes. Es el único departamento accesible únicamente por aire o río, sin carreteras terrestres que lo conecten con el resto del país. La biodiversidad es extraordinaria: se han identificado más de 3,000 especies de plantas, 1,500 especies de mariposas, y 600 especies de aves. Los ríos Negro y Solimões crean el fenómeno natural del "encuentro de las aguas" cerca de Leticia.',
    patrimonioCultural: 'La diversidad cultural del Amazonas es única en el mundo, con más de 40 grupos étnicos que mantienen sus lenguas originarias, tradiciones medicinales, y sistemas de conocimiento ancestral. Los grupos principales incluyen los Tikuna, Huitoto, Yagua, y Cocama, cada uno con cosmogonías distintivas y prácticas rituales. La maloca, casa comunal tradicional, sigue siendo el centro de la vida social indígena. Los saberes sobre plantas medicinales amazónicas han contribuido significativamente a la farmacología moderna.',
    datosEspecificos: {
      fechaCreacion: '1991 (constitución)',
      poblacionIndigena: '67% (53,000 personas aprox.)',
      patrimonioUNESCO: ['Reserva de Biosfera del Río Putumayo'],
      atraccionesPrincipales: ['Parque Nacional Natural Amacayacu', 'Isla de los Micos', 'Lagos de Tarapoto', 'Reserva Tanimboca'],
      industrias: ['Ecoturismo', 'Pesca artesanal', 'Productos forestales', 'Artesanías indígenas'],
      clima: 'Tropical húmedo, 26°C promedio, 2,500-3,000mm lluvia anual',
      altitud: '84 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'antioquia',
    historiaContexto: 'Antioquia fue colonizada en el siglo XVI por exploradores españoles en busca de oro, estableciendo poblaciones como Santa Fe de Antioquia (1541). La región desarrolló una cultura minera distintiva que evolucionó hacia el comercio y la industria. Durante las guerras de independencia, Antioquia jugó un papel crucial, y en el siglo XIX se convirtió en pionera de la industrialización colombiana. La cultura "paisa" se caracteriza por su espíritu emprendedor, tradicionalmente atribuido a la herencia vasca de muchos colonos.',
    importanciaEconomica: 'Antioquia es el motor económico de Colombia, contribuyendo con el 13% del PIB nacional. Medellín, su capital, es el segundo centro industrial del país, destacando en textiles, confecciones, metalurgia, y tecnología. El departamento produce significativas cantidades de oro, carbón, y café. La Feria de las Flores genera más de $200 millones de pesos en turismo anualmente. Las empresas antioqueñas como el Grupo Empresarial Antioqueño (GEA) tienen presencia internacional. El metro de Medellín, único en Colombia, simboliza la transformación urbana y genera importantes ingresos.',
    caracteristicasUnicas: 'Medellín es reconocida mundialmente por su transformación de ciudad violenta a centro de innovación, ganando el premio "Ciudad Más Innovadora" en 2013. La Feria de las Flores es uno de los festivales más importantes de América Latina, celebrando la tradición silletera desde 1957. El sistema integrado de transporte incluye metro, metrocable, y tranvía, siendo modelo para otras ciudades latinoamericanas. Fernando Botero, el artista colombiano más reconocido internacionalmente, es nativo de Medellín.',
    patrimonioCultural: 'La cultura paisa se expresa en tradiciones como la arriería (declarada Patrimonio Cultural Inmaterial de la Humanidad por UNESCO), el silletero, y festivales como la Feria de las Flores. Las obras de Fernando Botero adornan Medellín, con el Museo de Antioquia albergando la mayor colección del artista. La arquitectura colonial de Santa Fe de Antioquia está protegida como patrimonio nacional. La gastronomía incluye la bandeja paisa, considerada plato nacional de Colombia.',
    datosEspecificos: {
      fechaCreacion: '1856',
      poblacionIndigena: '1.2% (80,000 personas aprox.)',
      patrimonioUNESCO: ['Paisaje Cultural Cafetero (parte)', 'Arriería como patrimonio inmaterial'],
      atraccionesPrincipales: ['Comuna 13', 'Museo de Antioquia', 'Pueblito Paisa', 'Parque Arví', 'Santa Fe de Antioquia'],
      industrias: ['Textiles', 'Metalurgia', 'Servicios financieros', 'Tecnología', 'Minería'],
      clima: 'Tropical de montaña, "eterna primavera" en Medellín (22°C promedio)',
      altitud: 'Medellín: 1,495 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'arauca',
    historiaContexto: 'Arauca formó parte del territorio disputado durante las guerras de independencia, donde los llaneros comandados por José Antonio Páez jugaron un papel decisivo. El departamento se creó en 1991, separándose de Boyacá. La cultura llanera, compartida con Venezuela, se desarrolló alrededor de la ganadería extensiva y el contrabando histórico a través del río Arauca. El descubrimiento de petróleo en los años 1980 transformó radicalmente la economía y demografía regional.',
    importanciaEconomica: 'La economía araucana se basa principalmente en la explotación petrolera, que ha generado importantes regalías para el departamento desde los años 1980. El Complejo Petrolero de Caño Limón produce cerca de 100,000 barriles diarios. La ganadería sigue siendo importante, con más de 2 millones de cabezas de ganado. La agricultura incluye arroz, plátano, yuca, y palma africana. El comercio fronterizo con Venezuela es significativo, aunque fluctúa según las relaciones diplomáticas.',
    caracteristicasUnicas: 'El Puente José Antonio Páez, que conecta con Venezuela, es uno de los más largos de Sudamérica con 1,430 metros. Arauca tiene la peculiaridad geográfica de ser tan plano que las tormentas son visibles desde 50 kilómetros de distancia. El departamento experimenta dos estaciones extremas: una húmeda (abril-noviembre) donde las llanuras se inundan, y una seca (diciembre-marzo) donde el paisaje se vuelve árido. Es el único departamento colombiano cuya capital tiene el mismo nombre.',
    patrimonioCultural: 'La cultura llanera de Arauca es compartida con Venezuela, expresándose en el joropo, música tradicional interpretada con arpa, cuatro, y maracas. El coleo, deporte tradicional donde se derriba un toro agarrándolo por la cola, es patrimonio cultural regional. Las tradiciones orales incluyen los "contrapunteos" improvisados y las coplas llaneras. Las ferias ganaderas mantienen vivas las tradiciones de vaquería y monta de caballos. La artesanía en cuero y sombreros de palma refleja la vida rural llanera.',
    datosEspecificos: {
      fechaCreacion: '1991',
      poblacionIndigena: '2.8% (7,600 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Puente José Antonio Páez', 'Reserva Natural El Lipa', 'Laguna de Lipa', 'Parque Nacional El Tuparro (parcial)'],
      industrias: ['Petróleo', 'Ganadería', 'Agricultura', 'Comercio fronterizo'],
      clima: 'Tropical de sabana, 27°C promedio, estaciones húmeda y seca marcadas',
      altitud: '125 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'atlantico',
    historiaContexto: 'Atlántico fue creado en 1905, siendo uno de los departamentos más jóvenes de Colombia. Barranquilla emergió en el siglo XIX como el principal puerto del país cuando el río Magdalena se convirtió en la arteria comercial principal. La llegada de inmigrantes árabes, judíos, italianos, y alemanes en el siglo XX creó una sociedad cosmopolita. El Carnaval de Barranquilla tiene raíces en las celebraciones españolas coloniales mezcladas con tradiciones africanas e indígenas.',
    importanciaEconomica: 'Atlántico, a pesar de ser el departamento más pequeño de la región Caribe, concentra una gran actividad económica. Barranquilla es el tercer puerto marítimo más importante de Colombia, manejando 40% del comercio exterior por la costa Caribe. El sector industrial incluye química, alimentos, textiles, y metalurgia. El Carnaval de Barranquilla genera más de $150 millones de pesos anuales en turismo. La ubicación estratégica en la desembocadura del Magdalena facilita el comercio fluvial y marítimo.',
    caracteristicasUnicas: 'Atlántico es el departamento con mayor densidad poblacional de Colombia (más de 700 habitantes por km²). Barranquilla fue la primera ciudad colombiana en tener aviación comercial, servicio telefónico, y energía eléctrica. El Carnaval es la segunda festividad más importante de América Latina después del de Río de Janeiro. Shakira, la artista colombiana más exitosa internacionalmente, es nativa de Barranquilla. El municipio de Puerto Colombia tiene la peculiaridad de ser uno de los pocos pueblos costeros construidos en acantilados.',
    patrimonioCultural: 'El Carnaval de Barranquilla fue declarado Patrimonio Cultural Inmaterial de la Humanidad por UNESCO en 2008. Las tradiciones incluyen personajes como la Marimonda, el Congo, y el Rey Momo. La cumbia, ritmo musical que se extendió por toda América Latina, tiene sus raíces en esta región. La gastronomía costeña incluye especialidades como el sancocho de guandú, el bollo limpio, y la arepa de huevo. Santa Verónica es reconocida como uno de los mejores sitios de parapente del mundo.',
    datosEspecificos: {
      fechaCreacion: '1905',
      poblacionIndigena: '0.1% (2,500 personas aprox.)',
      patrimonioUNESCO: ['Carnaval de Barranquilla (2008)'],
      atraccionesPrincipales: ['Carnaval de Barranquilla', 'Casa del Carnaval', 'Museo del Caribe', 'Santa Verónica', 'Puerto Colombia'],
      industrias: ['Servicios portuarios', 'Química', 'Alimentos', 'Turismo', 'Textiles'],
      clima: 'Tropical seco, 28°C promedio, precipitación 800-1000mm anual',
      altitud: '98 metros sobre el nivel del mar en promedio'
    }
  },
  {
    departmentId: 'bolivar',
    historiaContexto: 'Bolívar tiene una de las historias más ricas de Colombia. Cartagena fue fundada en 1533 y se convirtió en el principal puerto español en América, donde llegaban los galeones cargados de oro peruano. Las fortificaciones de Cartagena, construidas durante tres siglos, la convirtieron en la ciudad más protegida del Nuevo Mundo. Durante la independencia, Cartagena resistió el sitio de Pablo Morillo (1815), conocido como "el año terrible". San Basilio de Palenque, fundado por esclavos cimarrones en el siglo XVII, fue el primer pueblo libre de América.',
    importanciaEconomica: 'Cartagena es el principal puerto turístico de Colombia, recibiendo más de 3 millones de visitantes anuales y generando ingresos superiores a $1.5 billones de pesos. El complejo industrial de Mamonal alberga refinerías, petroquímicas, y plantas químicas que contribuyen significativamente al PIB nacional. El puerto de Cartagena maneja el 30% del comercio marítimo nacional. La industria naval y la joyería con esmeraldas son importantes fuentes de empleo. Las islas del Rosario desarrollan turismo náutico y ecológico.',
    caracteristicasUnicas: 'Las murallas de Cartagena son las fortificaciones coloniales españolas más extensas y mejor conservadas de América, con 11 kilómetros de longitud. El Castillo San Felipe de Barajas es considerado la obra de ingeniería militar más grande construida por España en sus colonias. Cartagena es la única ciudad colombiana que conserva completamente su centro histórico colonial. La Heroica resistió exitosamente los ataques de Francis Drake (1586) y Edward Vernon (1741), consolidando su fama de inexpugnable.',
    patrimonioCultural: 'El centro histórico de Cartagena fue declarado Patrimonio Cultural de la Humanidad por UNESCO en 1984. San Basilio de Palenque es reconocido como Patrimonio Inmaterial por preservar la lengua palenquera y tradiciones africanas únicas en América. La música de gaita y tambores, el vallenato, y la champeta son expresiones culturales distintivas. La gastronomía incluye el sancocho de mondongo cartagenero y dulces tradicionales como el cocadas y las alegrías.',
    datosEspecificos: {
      fechaCreacion: '1886',
      poblacionIndigena: '0.8% (21,000 personas aprox.)',
      patrimonioUNESCO: ['Centro Histórico de Cartagena (1984)', 'San Basilio de Palenque (2008)'],
      atraccionesPrincipales: ['Ciudad Amurallada', 'Castillo San Felipe', 'Islas del Rosario', 'San Basilio de Palenque', 'Volcán del Totumo'],
      industrias: ['Turismo', 'Petroquímica', 'Servicios portuarios', 'Industria naval', 'Refinación'],
      clima: 'Tropical seco, 28°C promedio, temporada seca diciembre-abril',
      altitud: '2 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'boyaca',
    historiaContexto: 'Boyacá es conocida como la "Cuna de la Libertad" porque allí se libró la Batalla de Boyacá el 7 de agosto de 1819, que selló la independencia de Colombia y gran parte de América del Sur. El puente de Boyacá, donde ocurrió el encuentro decisivo entre las tropas de Simón Bolívar y las españolas, es considerado lugar sagrado de la patria. Durante la colonia, la región fue importante por sus minas de sal y esmeraldas. Villa de Leyva, fundada en 1572, conserva la arquitectura colonial más pura del país.',
    importanciaEconomica: 'Boyacá es el principal productor de esmeraldas del mundo, concentrando el 70% de la producción global en minas como Muzo y Chivor. La agricultura incluye papa, cebolla, zanahoria, y flores para exportación. El turismo histórico y cultural genera importantes ingresos, especialmente en Villa de Leyva y Tunja. La industria siderúrgica en Sogamoso produce acero para construcción. El sector lácteo de la Sabana de Bogotá y los páramos proporcionan productos para el centro del país.',
    caracteristicasUnicas: 'Villa de Leyva posee la plaza mayor más grande de Colombia (14,000 m²) y una de las más grandes de América Latina. El departamento contiene el 18.3% de todos los páramos de Colombia, ecosistemas únicos que regulan el agua para millones de personas. El Lago de Tota es el lago natural más grande de Colombia. El Festival Internacional de la Cultura (FIC) convierte a Boyacá en capital cultural de América Latina cada agosto desde 1973.',
    patrimonioCultural: 'El Puente de Boyacá es considerado altar de la patria, donde se realizan ceremonias oficiales cada 7 de agosto. Villa de Leyva es Monumento Nacional por su arquitectura colonial intacta y sus calles empedradas originales. Las tradiciones incluyen el Festival de Cometas de agosto, las festividades navideñas de Villa de Leyva, y el aguinaldo boyacense. La artesanía en lana, cerámica de Ráquira, y tejidos tradicionales mantienen técnicas ancestrales.',
    datosEspecificos: {
      fechaCreacion: '1886',
      poblacionIndigena: '1.1% (14,000 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Villa de Leyva', 'Puente de Boyacá', 'Lago de Tota', 'Ráquira', 'Parque Nacional Natural El Cocuy'],
      industrias: ['Minería (esmeraldas)', 'Agricultura', 'Turismo', 'Siderurgia', 'Lácteos'],
      clima: 'Tropical de montaña, páramos fríos, valles templados',
      altitud: 'Varía entre 200m y 5,330m (Sierra Nevada del Cocuy)'
    }
  },
  {
    departmentId: 'caldas',
    historiaContexto: 'Caldas fue creado en 1905 como parte del desmembramiento del Gran Caldas, junto con Risaralda y Quindío. La colonización antioqueña del siglo XIX trajo la cultura paisa y el cultivo del café a estas montañas. Manizales fue fundada en 1849 por colonos antioqueños y se convirtió en centro del comercio cafetero. La ciudad ha sido reconstruida múltiples veces debido a incendios y terremotos, desarrollando una arquitectura única adaptada a las condiciones sísmicas.',
    importanciaEconomica: 'Caldas es parte del Paisaje Cultural Cafetero, declarado Patrimonio de la Humanidad, produciendo café de alta calidad reconocido mundialmente. Manizales alberga la Bolsa Nacional Agropecuaria y es centro de comercialización del café colombiano. La Feria de Manizales atrae más de 500,000 visitantes anuales, generando importantes ingresos turísticos. El departamento produce también flores para exportación y desarrolla agroindustria. La Universidad Nacional de Colombia campus Manizales es líder en investigación agrícola.',
    caracteristicasUnicas: 'Manizales es conocida como la "Ciudad de las Puertas Abiertas" por la hospitalidad de sus habitantes. El Nevado del Ruiz, volcán activo, domina el paisaje y es parte del Parque Nacional Natural Los Nevados. La ciudad está construida sobre fuertes pendientes, con un sistema de transporte por cable único en el país. El Carnaval del Diablo de Riosucio, cada dos años, es uno de los carnavales más antiguos y auténticos de Colombia.',
    patrimonioCultural: 'El Paisaje Cultural Cafetero fue declarado Patrimonio de la Humanidad por UNESCO en 2011, reconociendo las tradiciones ancestrales del cultivo del café. La Feria de Manizales incluye corridas de toros, reinado internacional, y el festival "Manizales Grita Rock". El Carnaval del Diablo de Riosucio celebra la diversidad cultural y la resistencia indígena cada dos años desde 1915. La arquitectura de bahareque y guadua es característica de la región cafetera.',
    datosEspecificos: {
      fechaCreacion: '1905',
      poblacionIndigena: '3.2% (32,000 personas aprox.)',
      patrimonioUNESCO: ['Paisaje Cultural Cafetero (2011)'],
      atraccionesPrincipales: ['Nevado del Ruiz', 'Termales de Santa Rosa', 'Riosucio', 'Reserva de Río Blanco', 'Centro Histórico de Manizales'],
      industrias: ['Café', 'Turismo', 'Flores', 'Agroindustria', 'Servicios'],
      clima: 'Tropical de montaña, 17°C promedio en Manizales',
      altitud: 'Manizales: 2,153 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'caqueta',
    historiaContexto: 'Caquetá fue colonizado a principios del siglo XX por campesinos en busca de tierras, convirtiéndose en territorio nacional en 1904 y departamento en 1981. Florencia fue fundada en 1902 por colonos que llegaron huyendo de la Guerra de los Mil Días. La región sirvió como puerta de entrada al Amazonas colombiano, desarrollando una cultura de colonización y adaptación a la selva tropical. Durante el conflicto armado interno, el departamento fue escenario de confrontaciones entre grupos irregulares.',
    importanciaEconomica: 'La economía de Caquetá se basa en la ganadería extensiva, con más de 2.5 millones de cabezas de ganado, y la agricultura de pancoger que incluye plátano, yuca, maíz, y arroz. La piscicultura está en desarrollo, aprovechando los recursos hídricos amazónicos. El ecoturismo emerge como alternativa económica, especialmente en las zonas de transición Andes-Amazonas. La explotación maderera regulada y los productos forestales no maderables complementan la economía regional.',
    caracteristicasUnicas: 'Caquetá es el "Portal del Amazonas" colombiano, ubicado en la transición entre la región andina y la amazónica. La Serranía de la Lindosa contiene arte rupestre de más de 12,000 años de antigüedad, considerado la "Capilla Sixtina" del arte precolombino. El río Caquetá es navegable en gran parte de su recorrido, sirviendo como vía de comunicación principal. Las formaciones rocosas de la Lindosa incluyen tepuis similares a los de Venezuela y Brasil.',
    patrimonioCultural: 'El arte rupestre de la Serranía de la Lindosa representa una de las colecciones más importantes de América, con pinturas que narran la historia de los primeros pobladores amazónicos. Las tradiciones de navegación fluvial en canoas talladas incluyen técnicas ancestrales adaptadas al medio acuático. La música regional combina influencias andinas y amazónicas. Los conocimientos tradicionales sobre plantas medicinales y alimenticias de la selva se mantienen en las comunidades rurales.',
    datosEspecificos: {
      fechaCreacion: '1981',
      poblacionIndigena: '1.8% (9,000 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Serranía de la Lindosa', 'Parque Nacional Natural Serranía de los Churumbelos', 'Cascadas del Fin del Mundo', 'Río Caquetá'],
      industrias: ['Ganadería', 'Agricultura', 'Piscicultura', 'Ecoturismo', 'Productos forestales'],
      clima: 'Tropical húmedo, 25°C promedio, alta precipitación',
      altitud: 'Florencia: 242 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'casanare',
    historiaContexto: 'Casanare formó parte de la antigua provincia de Tunja durante la colonia y fue escenario crucial de las guerras de independencia, donde los llaneros fueron determinantes en las victorias patriotas. El departamento se creó en 1991, separándose de Boyacá. El descubrimiento del campo petrolero de Cusiana en 1988 transformó dramáticamente la región, convirtiendo a Yopal de un pequeño pueblo ganadero en una ciudad moderna. La cultura llanera tradicional coexiste con la modernidad petrolera.',
    importanciaEconomica: 'Casanare es uno de los principales productores de petróleo de Colombia, con campos como Cusiana y Cupiagua que han aportado billones de pesos en regalías. La ganadería sigue siendo importante, con más de 1.8 millones de cabezas de ganado. El arroz de los llanos de Casanare abastece gran parte del consumo nacional. Yopal experimentó un crecimiento económico acelerado, convirtiéndose en centro de servicios petroleros y financieros para la región.',
    caracteristicasUnicas: 'Casanare es el epicentro de la cultura llanera colombiana, donde el coleo (deporte de derribar toros por la cola) es tradición ancestral. El departamento experimenta estaciones extremas: la época de lluvias convierte las sabanas en enormes lagos, mientras la sequía crea paisajes áridos. Los caballos de paso fino casanareño son reconocidos por su calidad. El Torneo Internacional del Joropo es el evento cultural más importante de la región.',
    patrimonioCultural: 'El coleo es el deporte tradicional más representativo, donde jinetes a caballo deben derribar un toro agarrándolo por la cola. El joropo, música interpretada con arpa, cuatro, y maracas, expresa el alma llanera en coplas improvisadas. Las tradicionales "coleadas" son festivales que combinan deporte, música, y gastronomía. Los "contrapunteos" (duelos de improvisación musical) mantienen viva la tradición oral llanera. La elaboración de sombreros de palma y trabajos en cuero son artesanías tradicionales.',
    datosEspecificos: {
      fechaCreacion: '1991',
      poblacionIndigena: '0.9% (4,000 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Wisirare (Orocué)', 'Caño Cristales (parcial)', 'Reserva Natural La Macarena', 'Hato La Aurora'],
      industrias: ['Petróleo', 'Ganadería', 'Agricultura (arroz)', 'Servicios', 'Turismo rural'],
      clima: 'Tropical de sabana, 26°C promedio, estaciones húmeda y seca marcadas',
      altitud: 'Yopal: 350 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'cauca',
    historiaContexto: 'El Cauca tiene una historia prehispánica rica con la cultura San Agustín y culturas del Pacífico. Durante la colonia fue importante por sus minas de oro y la población esclavizada africana que trabajaba en ellas. La región se convirtió en cuna de música tradicional como el bambuco, nacido de la fusión de elementos africanos, indígenas, y españoles. Popayán, fundada en 1537, fue centro administrativo colonial y es conocida como la "Ciudad Blanca" por su arquitectura.',
    importanciaEconomica: 'El Cauca es un departamento con economía diversificada que incluye agricultura (café, caña de azúcar, fique), ganadería, y minería aurífera artesanal. Popayán es centro de servicios y educación superior, con varias universidades importantes. La industria azucarera del norte del departamento complementa la del Valle del Cauca. El ecoturismo en el Pacífico caucano, especialmente para avistamiento de ballenas jorobadas, genera importantes ingresos.',
    caracteristicasUnicas: 'El Cauca es único por su diversidad geográfica, abarcando desde la cordillera andina hasta el océano Pacífico. El Macizo Colombiano, donde nacen los ríos Magdalena, Cauca, Patía, y Caquetá, está ubicado en este departamento. La música de marimba del Pacífico caucano fue declarada Patrimonio Inmaterial de la Humanidad por UNESCO. Las comunidades afrocolombianas del litoral mantienen tradiciones únicas de navegación y pesca.',
    patrimonioCultural: 'La música y danzas de marimba fueron declaradas Patrimonio Cultural Inmaterial de la Humanidad por UNESCO en 2015, reconociendo la tradición afrocolombiana del Pacífico. El bambuco, considerado aire nacional de Colombia, tiene sus orígenes en esta región. Popayán es famosa por sus procesiones de Semana Santa, declaradas Patrimonio Inmaterial por UNESCO. La gastronomía incluye especialidades como las empanadas de pipián y el champús.',
    datosEspecificos: {
      fechaCreacion: '1886',
      poblacionIndigena: '21.5% (295,000 personas aprox.)',
      patrimonioUNESCO: ['Música de marimba (2015)', 'Procesiones de Semana Santa de Popayán (2009)'],
      atraccionesPrincipales: ['Popayán', 'Parque Nacional Natural Gorgona', 'Tierradentro', 'Silvia', 'Guapi'],
      industrias: ['Agricultura', 'Minería', 'Turismo', 'Agroindustria', 'Pesca'],
      clima: 'Variado: templado en Popayán (19°C), tropical húmedo en el Pacífico',
      altitud: 'Popayán: 1,760 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'cesar',
    historiaContexto: 'César fue creado en 1967, separándose de Magdalena. Esta región ha sido cuna de la música vallenata, que surgió de la fusión de tres culturas: la indígena (guacharaca), la africana (caja), y la europea (acordeón alemán). El Valle de Upar fue habitado por los indígenas chimilas, y durante la colonia fue zona de haciendas ganaderas. El Festival de la Leyenda Vallenata, iniciado en 1968, convirtió a Valledupar en la capital mundial de este género musical.',
    importanciaEconomica: 'César es uno de los principales productores de carbón de Colombia, con minas en El Cerrejón y La Loma que exportan a Europa y Asia. La ganadería es tradicional y muy importante, con más de 1.5 millones de cabezas de ganado. La agricultura incluye algodón, sorgo, maíz, y yuca. El turismo musical atrae miles de visitantes durante el Festival Vallenato. La producción de aceite de palma es creciente en la región.',
    caracteristicasUnicas: 'César es la cuna del vallenato, declarado Patrimonio Cultural Inmaterial de la Humanidad por UNESCO en 2015. El valle donde está ubicada Valledupar está rodeado por dos sistemas montañosos: la Sierra Nevada de Santa Marta y la Serranía de los Perijás. La región tiene la peculiaridad de ser frontera con Venezuela. El vallenato tradicional se interpreta únicamente con tres instrumentos: acordeón, caja vallenata, y guacharaca.',
    patrimonioCultural: 'El vallenato fue reconocido por UNESCO como Patrimonio Cultural Inmaterial de la Humanidad en 2015, honrando esta tradición musical que narra la vida cotidiana del pueblo caribeño. El Festival de la Leyenda Vallenata corona al "Rey Vallenato" anualmente desde 1968. Los aires del vallenato (paseo, merengue, puya, y son) cada uno tiene características rítmicas distintivas. Figuras como Rafael Escalona, Carlos Vives, y Diomedes Díaz han llevado el vallenato al mundo.',
    datosEspecificos: {
      fechaCreacion: '1967',
      poblacionIndigena: '8.7% (90,000 personas aprox.)',
      patrimonioUNESCO: ['Vallenato como patrimonio inmaterial (2015)'],
      atraccionesPrincipales: ['Casa de la Cultura Vallenata', 'Parque de la Leyenda Vallenata', 'Sierra Nevada de Santa Marta', 'Balneario Hurtado'],
      industrias: ['Minería (carbón)', 'Ganadería', 'Agricultura', 'Turismo musical', 'Palma africana'],
      clima: 'Tropical seco, 28°C promedio, lluvias de abril a noviembre',
      altitud: 'Valledupar: 169 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'choco',
    historiaContexto: 'Chocó fue creado en 1947 y tiene una historia marcada por la explotación aurífera desde la época colonial, cuando fue poblado principalmente por esclavos africanos traídos para trabajar en las minas. Esta herencia africana es dominante: el 82.1% de la población es afrocolombiana. La región desarrolló una cultura única de resistencia y preservación de tradiciones africanas. Durante el siglo XX, la marimba se convirtió en símbolo de identidad cultural chocoana.',
    importanciaEconomica: 'Chocó posee importantes recursos naturales incluyendo oro, platino, y la mayor biodiversidad por hectárea del planeta. Sin embargo, es uno de los departamentos con mayores desafíos de desarrollo. La economía se basa en minería artesanal, pesca, agricultura de subsistencia, y aprovechamiento forestal sostenible. El ecoturismo emerge como alternativa, especialmente para avistamiento de ballenas jorobadas. Buenaventura (Valle) sirve como puerto principal para el comercio del Pacífico.',
    caracteristicasUnicas: 'Lloró, municipio de Chocó, ostenta el récord mundial de precipitación con 13,300mm anuales. El departamento contiene la mayor biodiversidad por área del planeta, con 7,000-8,000 especies vegetales identificadas. Es el único departamento de Colombia con costas en el Pacífico pero sin salida directa al mar (comparte con Valle del Cauca). El 96% del territorio es propiedad colectiva de comunidades indígenas y afrocolombianas.',
    patrimonioCultural: 'La música de marimba y los cantos tradicionales del Pacífico Sur fueron declarados Patrimonio Cultural Inmaterial de la Humanidad por UNESCO en 2015. Esta tradición musical afrocolombiana incluye ritmos como el currulao, la juga, y el aguabajo. Las técnicas tradicionales de construcción naval, pesca, y medicina ancestral se mantienen vivas. El conocimiento sobre plantas medicinales del Chocó ha contribuido a descubrimientos farmacológicos importantes.',
    datosEspecificos: {
      fechaCreacion: '1947',
      poblacionIndigena: '12% (60,000 personas aprox.)',
      patrimonioUNESCO: ['Música de marimba del Pacífico (2015)'],
      atraccionesPrincipales: ['Parque Nacional Natural Utría', 'Nuquí', 'Bahía Solano', 'Capurganá', 'El Valle'],
      industrias: ['Minería artesanal', 'Pesca', 'Ecoturismo', 'Productos forestales', 'Agricultura'],
      clima: 'Tropical húmedo, 26°C promedio, hasta 13,300mm lluvia anual',
      altitud: 'Quibdó: 43 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'cordoba',
    historiaContexto: 'Córdoba fue creado en 1951, separándose de Bolívar. La región fue habitada por los pueblos indígenas zenúes, quienes desarrollaron sofisticados sistemas de ingeniería hidráulica para controlar las inundaciones del río Sinú. Durante la colonia se establecieron haciendas ganaderas que definieron la vocación económica regional. Montería, fundada en 1777, se convirtió en centro comercial y ganadero. El sombrero vueltiao, símbolo cultural, tiene sus raíces en las tradiciones zenúes.',
    importanciaEconomica: 'Córdoba es uno de los principales departamentos ganaderos de Colombia, con más de 2.5 millones de cabezas de ganado bovino. La agricultura incluye arroz, algodón, maíz, y yuca. La región está desarrollando agroindustria, especialmente procesamiento de carne y lácteos. La minería de níquel en Cerro Matoso es significativa. El comercio y los servicios en Montería complementan la economía departamental.',
    caracteristicasUnicas: 'El sombrero vueltiao es símbolo cultural nacional, elaborado con fibra de caña flecha por artesanos zenúes con técnicas ancestrales. Córdoba tiene una forma geográfica irregular alargada en sentido norte-sur. La región del Bajo Sinú se caracteriza por extensas llanuras que se inundan estacionalmente. Los festivales del porro y el fandango son tradiciones musicales distintivas de la región.',
    patrimonioCultural: 'El sombrero vueltiao fue declarado Patrimonio Cultural de la Nación, representando la identidad costeña y el legado zenú. Las técnicas de tejido se transmiten de generación en generación en las comunidades indígenas. La música de porro y fandango son expresiones culturales tradicionales. Los conocimientos ancestrales zenúes sobre manejo del agua y agricultura en zonas inundables son reconocidos internacionalmente.',
    datosEspecificos: {
      fechaCreacion: '1951',
      poblacionIndigena: '11.2% (190,000 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Parque Nacional Natural Paramillo', 'Ciénaga de Ayapel', 'Tuchín (sombreros vueltiao)', 'Lorica'],
      industrias: ['Ganadería', 'Agricultura', 'Minería (níquel)', 'Agroindustria', 'Comercio'],
      clima: 'Tropical con estaciones seca y húmeda, 28°C promedio',
      altitud: 'Montería: 18 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'cundinamarca',
    historiaContexto: 'Cundinamarca fue sede de la civilización muisca, una de las más avanzadas de América precolombina, conocida por la leyenda de El Dorado en la laguna de Guatavita. Durante la colonia, la sabana de Bogotá se convirtió en centro administrativo del Virreinato de Nueva Granada. Bogotá fue declarada capital de la Gran Colombia y posteriormente de Colombia. El departamento rodea al Distrito Capital y forma con él una conurbación de más de 10 millones de habitantes.',
    importanciaEconomica: 'Cundinamarca, junto con Bogotá, constituye el centro económico más importante de Colombia, contribuyendo aproximadamente 25% del PIB nacional. La sabana de Bogotá concentra industria manufacturera, servicios financieros, y agricultura intensiva (flores, papa, leche). El aeropuerto El Dorado es el más importante del país. La región es líder en educación superior y tecnología. La cercanía a Bogotá facilita el desarrollo de ciudades dormitorio y corredores industriales.',
    caracteristicasUnicas: 'Cundinamarca tiene la particularidad de rodear completamente al Distrito Capital de Bogotá. La laguna de Guatavita es el lugar donde se originó la leyenda mundial de El Dorado. La Catedral de Sal de Zipaquirá es considerada la Primera Maravilla de Colombia. El altiplano cundiboyacense tiene el ecosistema de páramo más extenso del mundo. La sabana de Bogotá es una de las altiplanicies más pobladas de América.',
    patrimonioCultural: 'La Catedral de Sal de Zipaquirá es un templo católico construido dentro de una mina de sal, declarado Primera Maravilla de Colombia. Villa de Leyva (aunque en Boyacá) está administrativamente conectada con la región. Los pueblos coloniales como Guatavita conservan arquitectura y tradiciones. La leyenda de El Dorado se originó en ceremonias muiscas en la laguna de Guatavita. Las tradiciones campesinas de la sabana incluyen festivales agrícolas y gastronómicos.',
    datosEspecificos: {
      fechaCreacion: '1886',
      poblacionIndigena: '0.8% (25,000 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Catedral de Sal de Zipaquirá', 'Laguna de Guatavita', 'Parque Nacional Natural Chingaza', 'Guasca', 'La Calera'],
      industrias: ['Industria manufacturera', 'Agricultura intensiva', 'Servicios', 'Minería (sal)', 'Turismo'],
      clima: 'Tropical de montaña, 14°C promedio en la sabana',
      altitud: 'Sabana de Bogotá: 2,600 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'guainia',
    historiaContexto: 'Guainía fue creado como comisaría en 1963 y se convirtió en departamento en 1991. Esta región amazónica ha sido habitada ancestralmente por grupos indígenas que han mantenido sus tradiciones y lenguas originarias. Inírida fue fundada en 1963 como centro administrativo. La región permaneció aislada del resto del país hasta épocas recientes, preservando ecosistemas únicos y culturas indígenas. Su nombre deriva del río Guainía, que significa "río de la estrella" en lengua indígena.',
    importanciaEconomica: 'La economía de Guainía se basa en pesca artesanal, agricultura de subsistencia, y aprovechamiento sostenible de productos forestales. El ecoturismo está en desarrollo, especialmente hacia los Cerros de Mavicure y la Estrella Fluvial del Oriente. La artesanía indígena genera ingresos para las comunidades. Los servicios gubernamentales y el comercio fronterizo con Venezuela complementan la economía. La región tiene potencial para turismo científico y ecológico.',
    caracteristicasUnicas: 'Guainía se encuentra en el extremo oriental de Colombia, formando frontera triple con Venezuela y Brasil. Los Cerros de Mavicure son formaciones rocosas únicas que se elevan abruptamente desde la llanura amazónica. La Estrella Fluvial del Oriente es el punto donde confluyen los ríos Guaviare, Atabapo, e Inírida. Inírida es conocida como la "Ciudad de los Ríos" por su ubicación estratégica en esta confluencia fluvial.',
    patrimonioCultural: 'Las comunidades indígenas de Guainía preservan tradiciones ancestrales, idiomas nativos, y conocimientos sobre el uso sostenible de la biodiversidad amazónica. Las técnicas de navegación fluvial, pesca tradicional, y elaboración de artesanías mantienen métodos ancestrales. Los conocimientos sobre plantas medicinales y alimenticias de la selva son invaluables. Las malocas tradicionales y las ceremonias rituales son parte del patrimonio inmaterial.',
    datosEspecificos: {
      fechaCreacion: '1991',
      poblacionIndigena: '65% (26,000 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Cerros de Mavicure', 'Estrella Fluvial del Oriente', 'Comunidades indígenas', 'Río Inírida'],
      industrias: ['Pesca artesanal', 'Ecoturismo', 'Artesanías indígenas', 'Productos forestales', 'Servicios'],
      clima: 'Tropical húmedo amazónico, 26°C promedio, alta precipitación',
      altitud: 'Inírida: 100 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'guaviare',
    historiaContexto: 'Guaviare fue territorio de colonización tardía, iniciada en el siglo XX por campesinos en busca de tierras baldías. San José del Guaviare fue fundado en 1938 por colonos que llegaron después de la violencia partidista. La región se convirtió en intendencia en 1977 y departamento en 1991. Durante décadas fue escenario del conflicto armado y el cultivo de coca, pero el proceso de paz ha abierto nuevas oportunidades para el desarrollo sostenible y el ecoturismo.',
    importanciaEconomica: 'La economía de Guaviare está en transición de la coca hacia cultivos legales como cacao, plátano, yuca y maíz. La ganadería sostenible se está desarrollando con apoyo gubernamental. El ecoturismo emerge como alternativa económica, especialmente las visitas al Parque Nacional Natural Chiribiquete y las pinturas rupestres de la Serranía de la Lindosa. Los programas de sustitución de cultivos ilícitos han traído inversión en infraestructura rural.',
    caracteristicasUnicas: 'Guaviare alberga el Parque Nacional Natural Chiribiquete, declarado Patrimonio de la Humanidad por la UNESCO en 2018, conocido como la "Capilla Sixtina del arte rupestre amazónico". Las pinturas rupestres de la Serranía de la Lindosa tienen más de 12,000 años de antigüedad y representan una de las colecciones de arte prehistórico más importantes de América. El departamento es considerado la "puerta de entrada" al Amazonas colombiano.',
    patrimonioCultural: 'El arte rupestre de la Serranía de la Lindosa y Chiribiquete representa la historia de los primeros pobladores de América, con escenas de cacería, animales extintos como mastodontes, y rituales ancestrales. Las tradiciones de los colonos incluyen técnicas de navegación fluvial y conocimientos sobre plantas medicinales amazónicas. Los procesos de paz han permitido la recuperación y promoción de este patrimonio arqueológico previamente inaccesible por el conflicto.',
    datosEspecificos: {
      fechaCreacion: '1991',
      poblacionIndigena: '0.8% (4,000 personas aprox.)',
      patrimonioUNESCO: ['Parque Nacional Natural Chiribiquete (2018)'],
      atraccionesPrincipales: ['Chiribiquete', 'Serranía de la Lindosa', 'Pinturas rupestres', 'Caño Cristales (parcial)', 'Río Guaviare'],
      industrias: ['Agricultura (sustitución)', 'Ganadería', 'Ecoturismo', 'Pesca', 'Artesanías'],
      clima: 'Tropical húmedo, 26°C promedio, precipitación 2,500-3,000mm anual',
      altitud: 'San José del Guaviare: 175 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'huila',
    historiaContexto: 'Huila tiene una rica historia precolombina con la cultura de San Agustín, que desarrolló una sofisticada civilización entre los años 1000 a.C. y 1600 d.C. Neiva fue fundada tres veces: inicialmente en 1539, luego en 1550, y finalmente establecida en 1612 por Diego de Ospina. Durante la independencia, la región fue refugio de líderes patriotas como Simón Bolívar. El departamento se separó de Tolima en 1905, convirtiéndose en centro del desarrollo cafetero nacional.',
    importanciaEconomica: 'Huila es el departamento cafetero más importante de Colombia, produciendo el 18% del café nacional con 154,800 hectáreas cultivadas. La región combina café de alta calidad con petróleo, siendo significativo en la producción de hidrocarburos. Los embalses de Betania y El Quimbo generan energía hidroeléctrica para el país. El turismo cultural y arqueológico, especialmente en San Agustín, genera importantes ingresos. La agricultura incluye arroz, sorgo, y frutas tropicales.',
    caracteristicasUnicas: 'Huila es la cuna del río Magdalena, que nace en el Macizo Colombiano dentro del departamento. El Nevado del Huila (5,365m) es el pico más alto de la Cordillera Central y un volcán activo. El desierto de la Tatacoa es un ecosistema único con formaciones rocosas erosionadas y uno de los mejores lugares para observación astronómica en Colombia. San Agustín alberga el parque arqueológico con las estatuas megalíticas más grandes de Sudamérica.',
    patrimonioCultural: 'El Parque Arqueológico de San Agustín fue declarado Patrimonio de la Humanidad por la UNESCO en 1995, conteniendo más de 500 estatuas megalíticas que representan una de las manifestaciones artísticas más importantes de la América precolombina. El Festival Nacional del Bambuco y el Sanjuanero Huilense celebran la música y danza tradicional. La lechona huilense es reconocida como patrimonio gastronómico nacional. Las tradiciones indígenas Nasa y Páez mantienen vivas las conexiones ancestrales con la tierra.',
    datosEspecificos: {
      fechaCreacion: '1905',
      poblacionIndigena: '4.5% (55,000 personas aprox.)',
      patrimonioUNESCO: ['Parque Arqueológico de San Agustín (1995)'],
      atraccionesPrincipales: ['San Agustín', 'Desierto de la Tatacoa', 'Nevado del Huila', 'Estrecho del Magdalena', 'Termales de Rivera'],
      industrias: ['Café', 'Petróleo', 'Turismo', 'Energía hidroeléctrica', 'Agricultura'],
      clima: 'Variado: 18°C en Neiva, páramos fríos en nevados',
      altitud: 'Neiva: 442 metros; Nevado del Huila: 5,365 metros'
    }
  },
  {
    departmentId: 'la_guajira',
    historiaContexto: 'La Guajira es territorio ancestral del pueblo Wayuu, la etnia indígena más numerosa de Colombia con más de 270,000 habitantes. Esta región permaneció relativamente aislada durante la colonia española debido a su geografía desértica y la resistencia indígena. Riohacha fue fundada en 1545 por Nicolás de Federmann como puerto para el comercio de perlas. En el siglo XX, el descubrimiento de las minas de sal en Manaure y más tarde el carbón en El Cerrejón transformaron la economía regional.',
    importanciaEconomica: 'La Guajira es el principal productor de sal marina de Colombia, concentrando más del 70% de la producción nacional en las salinas de Manaure. El Cerrejón es una de las minas de carbón a cielo abierto más grandes del mundo, exportando principalmente a Europa y Estados Unidos. La ganadería caprina adaptada al clima árido es tradicional entre los Wayuu. El turismo étnico y ecológico está creciendo, especialmente hacia Cabo de la Vela y Punta Gallinas.',
    caracteristicasUnicas: 'Punta Gallinas es el punto más septentrional de Sudamérica, ofreciendo paisajes únicos donde el desierto se encuentra con el mar Caribe. La Guajira es el único departamento de Colombia con clima desértico, recibiendo menos de 300mm de lluvia anual. Los flamencos rosados habitan las lagunas costeras, creando un espectáculo natural único. Los vientos alisios constantes han convertido la región en ideal para la generación de energía eólica.',
    patrimonioCultural: 'La cultura Wayuu mantiene tradiciones milenarias incluyendo el tejido de mochilas wayuu, reconocidas mundialmente por sus diseños geométricos y colores vibrantes que narran historias ancestrales. El wayuunaiki es la lengua nativa hablada por más de 300,000 personas. Las disputas se resuelven tradicionalmente a través del sistema de palabreros (pütchipü\'ü), reconocido por la UNESCO como Patrimonio Cultural Inmaterial de la Humanidad. La música vallenata tiene influencias wayuu significativas.',
    datosEspecificos: {
      fechaCreacion: '1965',
      poblacionIndigena: '44.9% (270,000 personas aprox.)',
      patrimonioUNESCO: ['Sistema normativo wayuu aplicado por el pütchipü\'ü (2010)'],
      atraccionesPrincipales: ['Cabo de la Vela', 'Punta Gallinas', 'Salinas de Manaure', 'Parque Nacional Natural Macuira', 'Santuario de Flora y Fauna Los Flamencos'],
      industrias: ['Minería (carbón)', 'Sal marina', 'Turismo', 'Ganadería caprina', 'Energía eólica'],
      clima: 'Desértico tropical, 28°C promedio, 250-500mm lluvia anual',
      altitud: 'Riohacha: 6 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'magdalena',
    historiaContexto: 'Magdalena fue habitado por la avanzada civilización Tairona, que construyó la Ciudad Perdida (Teyuna) en el siglo IX. Santa Marta, fundada en 1525 por Rodrigo de Bastidas, es la ciudad más antigua de Colombia y la segunda de Sudamérica. La región fue puerto principal para las exportaciones de oro durante la colonia. En 1830, Simón Bolívar murió en la Quinta de San Pedro Alejandrino, convirtiendo a Santa Marta en lugar sagrado de la independencia americana.',
    importanciaEconomica: 'El puerto de Santa Marta es estratégico para las exportaciones colombianas, especialmente carbón de las minas del interior. La agricultura incluye banano (principal producto de exportación), café de la Sierra Nevada, y palma africana. El turismo es fundamental, con la Sierra Nevada, Tayrona, y el centro histórico atrayendo visitantes nacionales e internacionales. La pesca marítima y la industria cultural complementan la economía departamental.',
    caracteristicasUnicas: 'La Sierra Nevada de Santa Marta es la montaña costera más alta del mundo, elevándose desde el nivel del mar hasta 5,775 metros en solo 42 kilómetros de distancia horizontal. Esta formación única contiene todos los pisos térmicos posibles y es considerada reserva de biosfera por la UNESCO. Los cuatro pueblos indígenas (Kogui, Arhuaco, Wiwa, y Kankuamo) la consideran el "corazón del mundo" y mantienen tradiciones ancestrales de conservación.',
    patrimonioCultural: 'La Ciudad Perdida (Teyuna) es uno de los sitios arqueológicos más importantes de América, con terrazas y caminos de piedra que revelan la sofisticación de la civilización Tairona. Los pueblos indígenas de la Sierra Nevada preservan conocimientos ancestrales sobre astronomía, medicina tradicional, y manejo ambiental, considerándose "hermanos mayores" guardianes de la Tierra. El centro histórico de Santa Marta conserva arquitectura colonial y republicana. La tradición oral incluye leyendas sobre El Dorado y los tesoros perdidos.',
    datosEspecificos: {
      fechaCreacion: '1886',
      poblacionIndigena: '2.8% (35,000 personas aprox.)',
      patrimonioUNESCO: ['Reserva de Biosfera Sierra Nevada de Santa Marta'],
      atraccionesPrincipales: ['Ciudad Perdida', 'Parque Nacional Natural Tayrona', 'Sierra Nevada', 'Quinta de San Pedro Alejandrino', 'Centro Histórico Santa Marta'],
      industrias: ['Turismo', 'Puerto marítimo', 'Agricultura (banano)', 'Minería (carbón)', 'Pesca'],
      clima: 'Tropical seco en costa, todos los pisos térmicos en Sierra Nevada',
      altitud: 'Santa Marta: 2 metros; Pico Cristóbal Colón: 5,775 metros'
    }
  },
  {
    departmentId: 'meta',
    historiaContexto: 'Meta fue territorio de los pueblos indígenas Guahibo, Sikuani, y Achagua antes de la llegada española. Durante la colonia sirvió como ruta de comunicación entre los Andes y los llanos. Villavicencio, fundada en 1840, se convirtió en la "Puerta de los Llanos" por ser el punto de acceso desde Bogotá a la Orinoquia. El departamento experimentó un boom petrolero en las décadas de 1980 y 1990 que transformó su economía y demografía.',
    importanciaEconomica: 'Meta es un importante productor de petróleo colombiano, con campos como Castilla y Chichimene que han generado significativas regalías. La agricultura incluye arroz (uno de los principales productores), palma africana, plátano, y maíz. La ganadería es tradicional con más de 1.2 millones de cabezas de ganado. El turismo hacia Caño Cristales, conocido como "el río más hermoso del mundo", atrae visitantes internacionales y genera importante actividad económica.',
    caracteristicasUnicas: 'Caño Cristales es un fenómeno natural único donde plantas acuáticas endémicas (Macarenia clavigera) tiñen el río de cinco colores: rojo, amarillo, verde, azul, y negro, creando un espectáculo visible entre junio y noviembre. El río Guatiquía forma las cascadas del Amor y otros paisajes espectaculares. La región de la Macarena es una de las zonas de mayor biodiversidad del planeta, considerada el encuentro de los Andes, la Orinoquia, y el Amazonas.',
    patrimonioCultural: 'La cultura llanera se expresa en el joropo, música interpretada con arpa, cuatro, y maracas, que narra la vida en las sabanas. El coleo es el deporte tradicional donde jinetes deben derribar toros sujetándolos por la cola. Los "contrapunteos" son duelos musicales improvisados que mantienen viva la tradición oral llanera. El Festival de Joropo en Villavicencio es uno de los eventos culturales más importantes de la Orinoquia. Las tradiciones de trabajo de llano incluyen la elaboración de sombreros de palma y aperos de cuero.',
    datosEspecificos: {
      fechaCreacion: '1960',
      poblacionIndigena: '0.7% (7,000 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Caño Cristales', 'Parque Nacional Natural La Macarena', 'Bioparque Los Ocarros', 'Cascadas del Amor', 'Reserva Natural Kalawasi'],
      industrias: ['Petróleo', 'Agricultura', 'Ganadería', 'Turismo', 'Agroindustria'],
      clima: 'Tropical de sabana, 26°C promedio, estaciones seca y húmeda',
      altitud: 'Villavicencio: 467 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'narino',
    historiaContexto: 'Nariño fue habitado por las culturas Quillacingas y Pastos antes de la conquista española. Pasto fue fundada en 1537 por Lorenzo de Aldana. La región jugó un papel crucial durante las guerras de independencia, siendo inicialmente realista pero luego uniéndose a la causa patriota. Antonio Nariño, prócer de la independencia, dio nombre al departamento creado en 1904. La frontera con Ecuador ha influenciado significativamente su desarrollo cultural y económico.',
    importanciaEconomica: 'Nariño es un importante productor de café de alta calidad, especialmente en las zonas montañosas cercanas a Pasto. La agricultura incluye papa, fríjol, maíz, y frutas andinas. Tumaco, su puerto principal en el Pacífico, maneja exportaciones de productos agrícolas y es centro de la industria pesquera. El comercio fronterizo con Ecuador es significativo. La artesanía, especialmente el barniz de Pasto, genera ingresos culturales importantes.',
    caracteristicasUnicas: 'Nariño es el único departamento colombiano que limita con Ecuador, creando una rica zona fronteriza de intercambio cultural. El Santuario de Las Lajas, construido sobre un cañón, es considerado una de las iglesias más hermosas del mundo y atrae peregrinos internacionales. La Laguna de la Cocha es el segundo lago natural más grande de Colombia. Tumaco en el Pacífico es famoso por el avistamiento de ballenas jorobadas entre julio y octubre.',
    patrimonioCultural: 'El barniz de Pasto es una técnica artesanal única que utiliza la resina del árbol mopa-mopa para crear objetos decorativos con diseños geométricos prehispánicos, reconocida como patrimonio cultural nacional. El Carnaval de Negros y Blancos de Pasto, celebrado cada enero, fue declarado Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO en 2009. Las tradiciones culinarias incluyen el cuy asado y preparaciones únicas de la gastronomía andina-pacífica.',
    datosEspecificos: {
      fechaCreacion: '1904',
      poblacionIndigena: '10.8% (185,000 personas aprox.)',
      patrimonioUNESCO: ['Carnaval de Negros y Blancos (2009)'],
      atraccionesPrincipales: ['Santuario de Las Lajas', 'Laguna de la Cocha', 'Tumaco', 'Volcán Galeras', 'Carnaval de Negros y Blancos'],
      industrias: ['Café', 'Agricultura', 'Pesca', 'Turismo religioso', 'Artesanías'],
      clima: 'Andino frío en Pasto (13°C), tropical húmedo en Tumaco (26°C)',
      altitud: 'Pasto: 2,527 metros; Tumaco: 2 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'norte_de_santander',
    historiaContexto: 'Norte de Santander fue territorio de los indígenas Chitareros antes de la conquista española. Cúcuta fue fundada en 1733 por Juana Rangel de Cuéllar. La región fue escenario crucial de las guerras de independencia, donde ocurrieron batallas decisivas como la de Cúcuta en 1813. El departamento se separó de Santander en 1910. Su posición fronteriza con Venezuela ha marcado su desarrollo histórico, especialmente durante los períodos de migración e intercambio comercial.',
    importanciaEconomica: 'Norte de Santander basa su economía en el comercio fronterizo con Venezuela, especialmente a través de Cúcuta. La agricultura incluye café, cacao, arroz, y palma africana. La industria manufacturera produce calzado, textiles, y productos alimenticios. Los servicios financieros y comerciales son importantes debido al intercambio fronterizo. El carbón de la región de Zulia contribuye a las exportaciones nacionales.',
    caracteristicasUnicas: 'Cúcuta es conocida como la "Puerta de Colombia" por ser el principal paso fronterizo con Venezuela. El Puente Internacional Simón Bolívar es uno de los cruces fronterizos más transitados de América Latina. La región tiene microclimas únicos que permiten el cultivo de café de alta calidad en las zonas montañosas. El área metropolitana de Cúcuta forma una conurbación binacional con San Antonio del Táchira en Venezuela.',
    patrimonioCultural: 'La Casa Natal del General Santander en Villa del Rosario es un sitio histórico nacional donde nació el "Hombre de las Leyes". El Congreso de Cúcuta de 1821 dio origen a la Gran Colombia, evento fundamental en la historia americana. Las tradiciones fronterizas incluyen gastronomía compartida con Venezuela como las arepas ocañeras y el masato. La música vallenata y los festivales binacionales celebran la hermandad entre los dos países.',
    datosEspecificos: {
      fechaCreacion: '1910',
      poblacionIndigena: '0.6% (8,000 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Casa Natal del General Santander', 'Área Metropolitana de Cúcuta', 'Parque Nacional Natural Tamá', 'Ocaña', 'Villa del Rosario'],
      industrias: ['Comercio fronterizo', 'Agricultura', 'Manufactura', 'Servicios', 'Minería (carbón)'],
      clima: 'Tropical seco en valle de Cúcuta (28°C), templado en montañas',
      altitud: 'Cúcuta: 320 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'putumayo',
    historiaContexto: 'Putumayo fue territorio ancestral de pueblos indígenas como los Inga, Kamsá, Awá, y Siona. Durante la colonia española se establecieron misiones franciscanas y capuchinas. La región sufrió durante la "Casa Arana" y la explotación cauchera de principios del siglo XX que esclavizó poblaciones indígenas. Se convirtió en departamento en 1991. El conflicto armado y los cultivos de coca han marcado su historia reciente, pero los acuerdos de paz han abierto nuevas oportunidades.',
    importanciaEconomica: 'La economía de Putumayo está en transición de cultivos ilícitos hacia alternativas legales como café, cacao, plátano, y yuca. La extracción petrolera en campos como Orito genera regalías importantes. La ganadería sostenible y la piscicultura están en desarrollo. El ecoturismo hacia el Valle de Sibundoy y la observación de aves amazónicas tiene potencial creciente. Los programas de sustitución de cultivos han traído inversión en infraestructura rural.',
    caracteristicasUnicas: 'El Valle de Sibundoy es una planicie andina única en medio de la región amazónica, con un microclima especial que permite agricultura de altura. Mocoa es conocida como la "Puerta de Oro del Amazonas" por su posición de entrada a la selva desde los Andes. La región tiene una biodiversidad extraordinaria donde convergen ecosistemas andinos y amazónicos. Las comunidades indígenas mantienen tradiciones de medicina ancestral con plantas como el yagé.',
    patrimonioCultural: 'Las comunidades Inga y Kamsá del Valle de Sibundoy preservan tradiciones milenarias incluyendo el uso ceremonial del yagé (ayahuasca) para propósitos espirituales y curativos. El Día Grande o Inti Raymi es la celebración del solsticio de verano que mantiene vivas las tradiciones astronómicas ancestrales. La artesanía incluye tejidos en telar, instrumentos musicales tradicionales, y medicina herbal. Las chagras (huertas tradicionales) representan sistemas agrícolas sostenibles ancestrales.',
    datosEspecificos: {
      fechaCreacion: '1991',
      poblacionIndigena: '3.8% (13,000 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Valle de Sibundoy', 'Fin del Mundo', 'Parque Nacional Natural La Paya', 'Laguna de la Cocha (parcial)', 'Termales de Yunguillo'],
      industrias: ['Agricultura (sustitución)', 'Petróleo', 'Ecoturismo', 'Ganadería', 'Artesanías'],
      clima: 'Tropical húmedo en tierras bajas, templado en Valle de Sibundoy',
      altitud: 'Mocoa: 655 metros; Valle de Sibundoy: 2,200 metros'
    }
  },
  {
    departmentId: 'risaralda',
    historiaContexto: 'Risaralda fue creado en 1966 como parte de la división del Gran Caldas, junto con Quindío. La región fue colonizada por antioqueños en el siglo XIX durante la expansión cafetera. Pereira fue fundada en 1863 por Remigio Antonio Cañarte. La ciudad se convirtió en centro del comercio cafetero y punto de conexión entre Bogotá, Medellín, y Cali. La cultura paisa y la tradición cafetera definieron la identidad departamental.',
    importanciaEconomica: 'Risaralda es parte fundamental del Paisaje Cultural Cafetero, patrimonio de la UNESCO, produciendo café de alta calidad reconocido mundialmente. Pereira es un importante centro de servicios y comercio para el Eje Cafetero. La industria incluye textiles, confecciones, y productos alimenticios. El turismo cafetero atrae visitantes nacionales e internacionales. El departamento es estratégico por su ubicación central en el triángulo de oro económico colombiano.',
    caracteristicasUnicas: 'Pereira es conocida como "La Perla del Otún" y "Ciudad sin Puertas" por la hospitalidad de sus habitantes. El Parque Nacional Natural Los Nevados incluye el Nevado de Santa Isabel dentro del departamento. La región tiene una de las mayores densidades de cultivo de café por hectárea en el mundo. El paisaje cafetero combina montañas, guaduales, y fincas tradicionales creando un mosaico cultural único.',
    patrimonioCultural: 'El Paisaje Cultural Cafetero fue declarado Patrimonio de la Humanidad por la UNESCO en 2011, reconociendo las tradiciones centenarias del cultivo del café y la arquitectura vernácula de guadua y bahareque. La Feria de Pereira celebra la cultura paisa con cabalgatas, música, y gastronomía tradicional. El Festival Internacional de Arte de Pereira posiciona la ciudad como centro cultural del Eje Cafetero. Las tradiciones incluyen el trabajo manual en los cafetales y el secado de café en patios de las fincas.',
    datosEspecificos: {
      fechaCreacion: '1966',
      poblacionIndigena: '1.4% (14,000 personas aprox.)',
      patrimonioUNESCO: ['Paisaje Cultural Cafetero (2011)'],
      atraccionesPrincipales: ['Parque Nacional Natural Los Nevados', 'Termales de Santa Rosa', 'Santuario de Fauna y Flora Otún Quimbaya', 'Marsella', 'Santa Rosa de Cabal'],
      industrias: ['Café', 'Servicios', 'Industria textil', 'Turismo', 'Comercio'],
      clima: 'Tropical de montaña, 21°C promedio en Pereira',
      altitud: 'Pereira: 1,411 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'santander',
    historiaContexto: 'Santander fue territorio de los indígenas Guanes, reconocidos por su avanzada orfebrería y sistemas agrícolas. Durante la colonia se desarrolló la minería de oro y la agricultura. Bucaramanga fue fundada en 1622. La región fue cuna de líderes independentistas y escenario de batallas cruciales. El departamento lleva el nombre de Francisco de Paula Santander, el "Hombre de las Leyes". La cultura santandereana se caracteriza por el espíritu emprendedor y la tradición comercial.',
    importanciaEconomica: 'Santander es uno de los departamentos más prósperos de Colombia, con una economía diversificada que incluye petróleo, manufactura, agricultura, y servicios. El área metropolitana de Bucaramanga es el cuarto centro económico del país. La industria del calzado, textiles, y productos alimenticios es importante. La agricultura incluye tabaco, café, cacao, y frutas tropicales. El turismo de aventura en San Gil genera significativa actividad económica.',
    caracteristicasUnicas: 'San Gil es reconocida como la "Capital Turística de Aventura de Colombia" ofreciendo rafting, parapente, espeleología, y escalada en roca. El Cañón del Chicamocha es uno de los más profundos de América y alberga el parque nacional del mismo nombre. Barichara es considerado uno de los pueblos más hermosos de Colombia, conservando arquitectura colonial intacta. Las hormigas culonas son una delicia gastronómica única de la región.',
    patrimonioCultural: 'Barichara fue declarado Patrimonio Cultural de la Nación por su excepcional conservación de arquitectura colonial de los siglos XVIII y XIX. El Camino Real que conecta Barichara con Guane es una ruta histórica empedrada de la época colonial. Las tradiciones santandereanas incluyen la elaboración artesanal de tabaco, la gastronomía con hormigas culonas y cabrito, y el Festival de la Canción de Barichara. La artesanía en fique y la talla en piedra mantienen técnicas ancestrales.',
    datosEspecificos: {
      fechaCreacion: '1886',
      poblacionIndigena: '0.4% (8,000 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Barichara', 'San Gil', 'Cañón del Chicamocha', 'Parque Nacional del Chicamocha', 'Girón'],
      industrias: ['Petróleo', 'Manufactura', 'Turismo', 'Agricultura', 'Servicios'],
      clima: 'Tropical en valles (24°C), templado en mesetas (18°C)',
      altitud: 'Bucaramanga: 959 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'sucre',
    historiaContexto: 'Sucre fue habitado por los pueblos indígenas Zenúes, quienes desarrollaron sistemas sofisticados de ingeniería hidráulica para el manejo de las inundaciones del río San Jorge. Sincelejo fue fundada en 1535 por Alonso de Heredia. La región formó parte de Bolívar hasta 1966, cuando se creó el departamento más joven de la región Caribe. El nombre honra a Antonio José de Sucre, el "Gran Mariscal de Ayacucho".',
    importanciaEconomica: 'La economía de Sucre se basa principalmente en la ganadería, con más de 1.8 millones de cabezas de ganado bovino. La agricultura incluye arroz, maíz, yuca, ñame, y tabaco. La pesca en el Golfo de Morrosquillo y la actividad turística en las playas de Tolú y Coveñas generan importantes ingresos. La artesanía tradicional, especialmente los sombreros vueltiao elaborados por comunidades zenúes, tiene reconocimiento nacional e internacional.',
    caracteristicasUnicas: 'Sucre tiene acceso tanto al mar Caribe como a importantes sistemas de humedales y ciénagas que regulan las inundaciones estacionales. El Golfo de Morrosquillo alberga el archipiélago de San Bernardo con sus aguas cristalinas y arrecifes coralinos. Las sabanas de Sucre se caracterizan por extensas llanuras ideales para la ganadería. La región tiene cinco subregiones distintivas: Morrosquillo, Montes de María, Sabanas, San Jorge, y La Mojana.',
    patrimonioCultural: 'El sombrero vueltiao, elaborado por las comunidades zenúes con fibra de caña flecha, es símbolo cultural nacional y fue declarado patrimonio cultural de Colombia. Las técnicas de tejido se transmiten de generación en generación entre las mujeres zenúes. El Festival Nacional del Sombrero Vueltiao en las Sabanas es la celebración cultural más importante del departamento. La gastronomía incluye el sancocho de gallina criolla, las empanadas de arroz, y dulces tradicionales como el enyucado.',
    datosEspecificos: {
      fechaCreacion: '1966',
      poblacionIndigena: '10.8% (90,000 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Archipiélago San Bernardo', 'Tolú', 'Coveñas', 'Ciénaga de la Caimanera', 'Morroa'],
      industrias: ['Ganadería', 'Agricultura', 'Turismo', 'Pesca', 'Artesanías'],
      clima: 'Tropical seco, 28°C promedio, estaciones seca y húmeda',
      altitud: 'Sincelejo: 213 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'tolima',
    historiaContexto: 'Tolima fue territorio de los pueblos indígenas Pijaos, reconocidos por su resistencia a la conquista española durante más de un siglo. Ibagué fue fundada en 1550 por Andrés López de Galarza. La región fue escenario de importantes batallas durante las guerras de independencia y más tarde durante La Violencia del siglo XX. El departamento se convirtió en centro del desarrollo agrícola nacional, especialmente en la producción de arroz y algodón.',
    importanciaEconomica: 'Tolima es uno de los principales productores agrícolas de Colombia, destacando en arroz (30% de la producción nacional), algodón, sorgo, y café en las zonas montañosas. La industria incluye la Siderúrgica del Muña y empresas textiles. Ibagué es un importante centro de servicios y distribución para el centro del país. El turismo hacia el Nevado del Tolima y las aguas termales genera actividad económica significativa.',
    caracteristicasUnicas: 'Ibagué es conocida como la "Capital Musical de Colombia" por su tradición en festivales de música popular y conservatorios. El Nevado del Tolima (5,276m) es uno de los volcanes más altos de Colombia y atrae montañistas de todo el mundo. La tragedia de Armero en 1985, causada por la erupción del Nevado del Ruiz, marcó profundamente la historia del departamento. El valle del río Magdalena en Tolima es una de las regiones agrícolas más fértiles del país.',
    patrimonioCultural: 'El Festival Nacional de la Música Colombiana en Ibagué es el evento musical más importante del país, celebrando todos los géneros de la música tradicional colombiana desde 1959. La gastronomía tolimense incluye la lechona, el tamal tolimense, y los productos derivados del arroz. Las tradiciones pijaos incluyen leyendas sobre la resistencia indígena y sitios arqueológicos en los Montes de María. La artesanía en guadua y cerámica mantiene técnicas ancestrales.',
    datosEspecificos: {
      fechaCreacion: '1886',
      poblacionIndigena: '0.8% (11,000 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Nevado del Tolima', 'Parque Nacional Natural Los Nevados', 'Termales de Jamundí', 'Honda', 'Mariquita'],
      industrias: ['Agricultura', 'Industria', 'Servicios', 'Turismo', 'Minería'],
      clima: 'Tropical en valles (28°C), páramo en nevados',
      altitud: 'Ibagué: 1,285 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'valle_del_cauca',
    historiaContexto: 'Valle del Cauca fue habitado por los pueblos indígenas Quimbaya, reconocidos por su orfebrería excepcional. Santiago de Cali fue fundada en 1536 por Sebastián de Belalcázar. Durante la colonia se desarrolló la cultura de la caña de azúcar con base en el trabajo esclavo africano, creando una importante población afrocolombiana. El departamento se convirtió en centro industrial y puerta del Pacífico para Colombia.',
    importanciaEconomica: 'Valle del Cauca produce el 75% del azúcar de Colombia y es líder en agroindustria azucarera. El puerto de Buenaventura maneja el 60% del comercio marítimo nacional, siendo la principal puerta del Pacífico. Cali es el tercer centro industrial del país con industrias químicas, farmacéuticas, y alimentarias. El departamento contribuye significativamente al PIB nacional y es centro de servicios para el suroccidente colombiano.',
    caracteristicasUnicas: 'Cali es reconocida mundialmente como la "Capital de la Salsa" con una vibrante escena musical y de baile que atrae turistas internacionales. El valle geográfico del río Cauca es una de las regiones más fértiles de Colombia, ideal para la agricultura intensiva. Buenaventura es el puerto más importante del Pacífico colombiano, conectando el país con Asia y la cuenca del Pacífico. La región fue designada por la UNESCO como "Ciudad de la Gastronomía" en 2017.',
    patrimonioCultural: 'La salsa caleña es reconocida mundialmente, con escuelas de baile que atraen estudiantes internacionales y festivales que posicionan a Cali como capital mundial de este ritmo. La cultura afrocolombiana del Pacífico incluye tradiciones musicales como el currulao y la marimba. La gastronomía valle-caucana combina influencias indígenas, africanas, y españolas en platos como el sancocho de gallina, empanadas vallunas, y dulces tradicionales. El Carnaval de Cali y la Feria de Cali son festividades que celebran la identidad cultural regional.',
    datosEspecificos: {
      fechaCreacion: '1910',
      poblacionIndigena: '0.7% (33,000 personas aprox.)',
      patrimonioUNESCO: ['Cali - Ciudad Creativa de la Gastronomía (2017)'],
      atraccionesPrincipales: ['Centro Histórico de Cali', 'Cristo Rey', 'Buenaventura', 'Parque Nacional Natural Farallones', 'Lago Calima'],
      industrias: ['Agroindustria azucarera', 'Puerto marítimo', 'Manufactura', 'Servicios', 'Turismo'],
      clima: 'Tropical en valle (24°C), todos los pisos térmicos hasta páramo',
      altitud: 'Cali: 1,018 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'vaupes',
    historiaContexto: 'Vaupés es territorio ancestral de más de 25 grupos indígenas que han habitado la región durante milenios, incluyendo los Cubeo, Desano, Tucano, y Wanano. La región permaneció prácticamente aislada durante la época colonial y republicana. Se convirtió en comisaría en 1963 y departamento en 1991. La penetración occidental ha sido mínima, permitiendo que las culturas indígenas mantengan sus tradiciones ancestrales casi intactas.',
    importanciaEconomica: 'La economía de Vaupés se basa en actividades de subsistencia tradicionales como pesca, caza, recolección, y agricultura de chagra. El ecoturismo especializado en cultura indígena amazónica está emergiendo como alternativa económica. Los servicios gubernamentales proporcionan empleo limitado. La artesanía indígena, especialmente canastos, instrumentos musicales, y arte plumario, tiene valor cultural y económico. Los conocimientos tradicionales sobre plantas medicinales tienen potencial para la investigación farmacológica.',
    caracteristicasUnicas: 'Vaupés es el departamento con mayor porcentaje de población indígena en Colombia (95%), donde se hablan más de 20 idiomas nativos diferentes. Mitú es accesible únicamente por avión, siendo una de las capitales más aisladas del país. La región conserva tradiciones de construcción de malocas (casas comunales) que pueden albergar hasta 100 personas. Los sistemas de conocimiento astronómico indígena incluyen calendarios complejos basados en constelaciones y ciclos naturales.',
    patrimonioCultural: 'Las tradiciones culturales de Vaupés incluyen sistemas complejos de iniciación masculina, uso ceremonial del yagé, y conocimientos astronómicos sofisticados que regulan actividades agrícolas y rituales. La maloca es el centro de la vida social y espiritual, donde se transmiten conocimientos ancestrales a través de la tradición oral. Los sistemas de intercambio tradicional incluyen el trueque de productos entre diferentes grupos étnicos. La música tradicional con instrumentos como yurupary (flautas sagradas) es fundamental en ceremonias rituales.',
    datosEspecificos: {
      fechaCreacion: '1991',
      poblacionIndigena: '95% (40,000 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Comunidades indígenas', 'Río Vaupés', 'Malocas tradicionales', 'Raudales del río', 'Piedras rituales'],
      industrias: ['Subsistencia tradicional', 'Artesanías indígenas', 'Ecoturismo cultural', 'Servicios gubernamentales'],
      clima: 'Tropical húmedo amazónico, 26°C promedio, alta precipitación',
      altitud: 'Mitú: 180 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'vichada',
    historiaContexto: 'Vichada fue territorio de pueblos indígenas como los Sikuani, Piaroa, Curripaco, y Puinave que desarrollaron culturas adaptadas a las sabanas y bosques de galería de la Orinoquia. La colonización occidental fue tardía y limitada. Se creó como comisaría en 1913 y se convirtió en departamento en 1991. Puerto Carreño fue establecido como puerto fluvial en el río Orinoco para conectar Colombia con Venezuela y facilitar el comercio regional.',
    importanciaEconomica: 'La economía de Vichada se basa en ganadería extensiva adaptada a las sabanas inundables, pesca artesanal en los ríos Orinoco y Meta, y agricultura de subsistencia. El ecoturismo hacia la observación de fauna llanera y la pesca deportiva está en desarrollo. Los servicios gubernamentales proporcionan empleo en Puerto Carreño. La extracción sostenible de productos forestales no maderables complementa la economía. El comercio fronterizo con Venezuela es limitado pero significativo localmente.',
    caracteristicasUnicas: 'Vichada es el segundo departamento más grande de Colombia pero el menos poblado, con vastas extensiones de sabanas prístinas y bosques de galería. Puerto Carreño está ubicado en la confluencia de los ríos Orinoco y Meta, formando frontera con Venezuela. La región experimenta estaciones extremas con inundaciones masivas en época de lluvias y sequías severas. Los ecosistemas de sabana albergan fauna única como anacondas, jaguares, y más de 300 especies de aves.',
    patrimonioCultural: 'Las culturas indígenas de Vichada mantienen tradiciones de navegación fluvial, conocimientos sobre ciclos naturales de inundación, y técnicas de pesca y caza adaptadas a los ecosistemas de sabana. Las comunidades Sikuani preservan tradiciones de música y danza que narran la relación con la naturaleza. Los sistemas tradicionales de manejo del ganado incluyen técnicas de pastoreo rotativo adaptadas a las inundaciones estacionales. La tradición oral incluye leyendas sobre los orígenes de los ríos y la fauna llanera.',
    datosEspecificos: {
      fechaCreacion: '1991',
      poblacionIndigena: '44.8% (35,000 personas aprox.)',
      patrimonioUNESCO: [],
      atraccionesPrincipales: ['Confluencia Orinoco-Meta', 'Sabanas del Orinoco', 'Observación de fauna', 'Parque Nacional Natural El Tuparro', 'Puerto Carreño'],
      industrias: ['Ganadería', 'Pesca artesanal', 'Ecoturismo', 'Servicios gubernamentales', 'Productos forestales'],
      clima: 'Tropical de sabana, 27°C promedio, estaciones húmeda y seca extremas',
      altitud: 'Puerto Carreño: 51 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'san_andres_y_providencia',
    historiaContexto: 'El archipiélago fue habitado inicialmente por pueblos indígenas antes de la colonización europea. Los puritanos ingleses establecieron asentamientos en 1630, trayendo esclavos africanos para trabajar en plantaciones de algodón y coco. La población raizal (afrocaribeña) desarrolló una cultura única mezclando elementos africanos, ingleses, y caribeños. Colombia asumió soberanía definitiva en 1822, pero la población mantuvo sus tradiciones culturales distintivas.',
    importanciaEconomica: 'La economía se basa principalmente en turismo, aprovechando las playas caribeñas, arrecifes coralinos, y la condición de puerto libre. El comercio duty-free atrae compradores de todo el Caribe y Colombia continental. La pesca artesanal y la agricultura de coco y frutas tropicales son tradicionales. Los servicios turísticos incluyen hoteles, restaurantes, y actividades acuáticas. El transporte aéreo y marítimo conecta el archipiélago con el continente y otros países caribeños.',
    caracteristicasUnicas: 'San Andrés y Providencia es el único departamento de Colombia completamente insular y el más pequeño del país. La población raizal habla inglés, español, y creole (inglés criollo). La Reserva de Biosfera Seaflower protege el tercer arrecife de barrera coralina más grande del mundo. El departamento está más cerca de Nicaragua que de Colombia continental. Las tradiciones arquitectónicas incluyen casas de madera estilo caribeño sobre pilotes.',
    patrimonioCultural: 'La cultura raizal combina tradiciones africanas, inglesas, y caribeñas en una síntesis única, expresada en música calypso, soca, y reggae. El idioma creole es patrimonio lingüístico distintivo del archipiélago. Las tradiciones gastronómicas incluyen rondón (sopa de coco), cangrejo negro, y pescados preparados con coco. Las festividades como el Festival de la Música Caribe y celebraciones del Emancipation Day mantienen vivas las conexiones con la herencia africana y caribeña.',
    datosEspecificos: {
      fechaCreacion: '1991',
      poblacionIndigena: '0.1% (75 personas aprox.)',
      patrimonioUNESCO: ['Reserva de Biosfera Seaflower (2000)'],
      atraccionesPrincipales: ['Johnny Cay', 'Acuario', 'West View', 'Hoyo Soplador', 'Old Providence McBean Lagoon'],
      industrias: ['Turismo', 'Comercio duty-free', 'Pesca', 'Servicios', 'Agricultura'],
      clima: 'Tropical seco caribeño, 27°C promedio, vientos alisios',
      altitud: 'San Andrés: 2 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'quindio',
    historiaContexto: 'Quindío fue territorio de los indígenas Quimbaya, reconocidos por su excepcional orfebrería precolombina que hoy forma parte del Museo del Oro. La colonización antioqueña del siglo XIX transformó esta región con la fundación de Armenia en 1889 por Jesús María Ocampo. El departamento se separó de Caldas en 1966, consolidándose como el corazón de la región cafetera. La influencia paisa marcó profundamente la cultura, arquitectura, y tradiciones de la región.',
    importanciaEconomica: 'Quindío es reconocido mundialmente por la producción de café suave colombiano de alta calidad, siendo parte del Paisaje Cultural Cafetero declarado Patrimonio de la Humanidad por UNESCO. El turismo cafetero genera importantes ingresos, con fincas que ofrecen experiencias de agroturismo y educación sobre el proceso del café. La agroindustria incluye también plátano, cítricos, y aguacate. Los parques temáticos como el Parque Nacional del Café atraen turismo nacional e internacional.',
    caracteristicasUnicas: 'Armenia es conocida como la "Ciudad Milagro" por su rápida reconstrucción después del terremoto de 1999 que devastó la región. Quindío es el departamento más pequeño de la región andina, pero uno de los más densamente poblados y productivos. El Valle de Cocora alberga las palmas de cera más altas del mundo, símbolo nacional de Colombia, que pueden alcanzar hasta 70 metros de altura. La arquitectura paisa con sus casas de bahareque y corredores es característica de la región.',
    patrimonioCultural: 'El Paisaje Cultural Cafetero de Quindío representa una tradición centenaria de cultivo del café que combina técnicas ancestrales con sostenibilidad ambiental. La cultura paisa se expresa en festividades como la Fiesta Nacional del Café y tradiciones gastronómicas que incluyen la bandeja paisa, arepas, y dulces típicos. Los arrieros y la tradición del café han creado un patrimonio intangible único. Las ferias equinas y festivales culturales mantienen vivas las tradiciones regionales.',
    datosEspecificos: {
      fechaCreacion: '1966',
      poblacionIndigena: '0.5% (2,500 personas aprox.)',
      patrimonioUNESCO: ['Paisaje Cultural Cafetero (2011)'],
      atraccionesPrincipales: ['Valle de Cocora', 'Parque Nacional del Café', 'Filandia', 'Salento', 'Panaca'],
      industrias: ['Café', 'Turismo', 'Agroindustria', 'Servicios', 'Manufactura'],
      clima: 'Tropical de montaña, 19-24°C promedio',
      altitud: 'Armenia: 1,483 metros sobre el nivel del mar'
    }
  },
  {
    departmentId: 'bogota_dc',
    historiaContexto: 'Bogotá fue fundada en 1538 por Gonzalo Jiménez de Quesada en territorio del pueblo Muisca, especialmente el cacicazgo de Bacatá. Como Santa Fe de Bogotá, fue la capital del Virreinato de Nueva Granada desde 1717. La ciudad fue epicentro de los movimientos independentistas, siendo escenario del Grito de Independencia el 20 de julio de 1810. En 1991 se constituyó como Distrito Capital, consolidando su estatus como centro político, económico, y cultural de Colombia.',
    importanciaEconomica: 'Bogotá D.C. concentra aproximadamente el 25% del PIB nacional, siendo el principal centro económico de Colombia. La ciudad alberga las sedes de las principales empresas nacionales e internacionales, bancos, y entidades financieras. Los sectores de servicios, comercio, industria manufacturera, y tecnología son los motores económicos principales. Como centro de telecomunicaciones y transporte, conecta todo el territorio nacional. El sector educativo superior contribuye significativamente con universidades de prestigio internacional.',
    caracteristicasUnicas: 'Bogotá es la tercera capital más alta del mundo a 2,640 metros sobre el nivel del mar, ubicada en la sabana cundiboyacense. Es la ciudad más poblada de Colombia con más de 8 millones de habitantes en su área metropolitana. El sistema TransMilenio fue pionero en Latinoamérica en transporte masivo BRT. La ciclovía dominical es una de las más extensas del mundo con más de 120 kilómetros. El centro histórico La Candelaria preserva arquitectura colonial y republicana.',
    patrimonioCultural: 'El centro histórico de La Candelaria alberga la mayor concentración de patrimonio colonial de Colombia, con museos como el Museo del Oro y la Casa de Moneda. Bogotá es reconocida como "Ciudad de la Música" por UNESCO, con una vibrante escena cultural que incluye rock, salsa, vallenato, y música académica. La Biblioteca Luis Ángel Arango es una de las más visitadas del mundo. Los festivales como Rock al Parque y el Festival Iberoamericano de Teatro posicionan la ciudad internacionalmente.',
    datosEspecificos: {
      fechaCreacion: '1538 (fundación), 1991 (Distrito Capital)',
      poblacionIndigena: '1.2% (100,000 personas aprox.)',
      patrimonioUNESCO: ['Candidato: Centro Histórico La Candelaria'],
      atraccionesPrincipales: ['Monserrate', 'La Candelaria', 'Museo del Oro', 'Plaza Bolívar', 'Zona Rosa'],
      industrias: ['Servicios financieros', 'Tecnología', 'Manufactura', 'Comercio', 'Educación'],
      clima: 'Tropical de altura, 14°C promedio, dos temporadas de lluvia',
      altitud: '2,640 metros sobre el nivel del mar'
    }
  }
];

// Helper function to get education data for a department
export function getDepartmentEducation(departmentId: string): DepartmentEducation | undefined {
  return departmentEducationData.find(edu => edu.departmentId === departmentId);
}

// Get random educational fact
export function getRandomEducationalFact(departmentId: string): string {
  const education = getDepartmentEducation(departmentId);
  if (!education) return '';

  const facts = [
    education.historiaContexto,
    education.importanciaEconomica,
    education.caracteristicasUnicas,
    education.patrimonioCultural
  ];

  // Return first sentence of a random section
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  return randomFact.split('.')[0] + '.';
}