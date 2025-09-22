/**
 * CONCEPT: Educational Resources Data Structure
 * WHY: Centralized resource management with type safety
 * PATTERN: Typed data model with categorization
 */

export type ResourceType =
  | 'video'
  | 'article'
  | 'book'
  | 'website'
  | 'map'
  | 'game'
  | 'course'
  | 'podcast'
  | 'documentary';

export type ResourceLanguage = 'es' | 'en' | 'both';

export type ResourceLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  language: ResourceLanguage;
  level: ResourceLevel;
  url: string;
  thumbnail?: string;
  duration?: string; // For videos, podcasts
  author?: string;
  year?: number;
  tags: string[];
  featured?: boolean;
}

export const educationalResources: Resource[] = [
  // Videos
  {
    id: 'vid-1',
    title: 'Colombia: Wild and Free',
    description: 'National Geographic documentary exploring Colombia\'s incredible biodiversity and natural wonders.',
    type: 'documentary',
    language: 'en',
    level: 'all',
    url: 'https://www.youtube.com/watch?v=example1',
    duration: '52 min',
    author: 'National Geographic',
    year: 2023,
    tags: ['nature', 'biodiversity', 'geography'],
    featured: true
  },
  {
    id: 'vid-2',
    title: 'Historia de Colombia en 10 Minutos',
    description: 'Resumen animado de la historia colombiana desde la época precolombina hasta la actualidad.',
    type: 'video',
    language: 'es',
    level: 'beginner',
    url: 'https://www.youtube.com/watch?v=example2',
    duration: '10 min',
    author: 'Academia Play',
    year: 2022,
    tags: ['historia', 'educación', 'cultura']
  },
  {
    id: 'vid-3',
    title: 'Geografía de Colombia - Regiones Naturales',
    description: 'Explicación detallada de las 6 regiones naturales de Colombia y sus características.',
    type: 'video',
    language: 'es',
    level: 'intermediate',
    url: 'https://www.youtube.com/watch?v=example3',
    duration: '15 min',
    author: 'Educación Colombia',
    year: 2023,
    tags: ['geografía', 'regiones', 'educación']
  },

  // Articles
  {
    id: 'art-1',
    title: 'Understanding Colombia\'s Departments',
    description: 'Comprehensive guide to Colombia\'s administrative divisions and their historical significance.',
    type: 'article',
    language: 'en',
    level: 'intermediate',
    url: 'https://www.britannica.com/place/Colombia',
    author: 'Britannica',
    year: 2023,
    tags: ['geography', 'administration', 'history']
  },
  {
    id: 'art-2',
    title: 'La Diversidad Cultural de Colombia',
    description: 'Exploración de las diferentes culturas, tradiciones y grupos étnicos de Colombia.',
    type: 'article',
    language: 'es',
    level: 'intermediate',
    url: 'https://www.mincultura.gov.co/example',
    author: 'Ministerio de Cultura',
    year: 2022,
    tags: ['cultura', 'diversidad', 'tradiciones']
  },

  // Books
  {
    id: 'book-1',
    title: 'One Hundred Years of Solitude',
    description: 'Gabriel García Márquez\'s masterpiece that captures the essence of Colombian culture and magical realism.',
    type: 'book',
    language: 'both',
    level: 'advanced',
    url: 'https://www.goodreads.com/book/show/320.One_Hundred_Years_of_Solitude',
    author: 'Gabriel García Márquez',
    year: 1967,
    tags: ['literature', 'culture', 'history'],
    featured: true
  },
  {
    id: 'book-2',
    title: 'Colombia: A Concise Contemporary History',
    description: 'Modern history of Colombia covering political, social, and economic developments.',
    type: 'book',
    language: 'en',
    level: 'advanced',
    url: 'https://www.amazon.com/Colombia-Contemporary-History-Michael-LaRosa/dp/example',
    author: 'Michael J. LaRosa & Germán R. Mejía',
    year: 2017,
    tags: ['history', 'politics', 'society']
  },

  // Websites
  {
    id: 'web-1',
    title: 'Colombia.co - Official Tourism Portal',
    description: 'Official Colombian tourism website with comprehensive information about regions, culture, and attractions.',
    type: 'website',
    language: 'both',
    level: 'all',
    url: 'https://www.colombia.co/',
    tags: ['tourism', 'culture', 'geography'],
    featured: true
  },
  {
    id: 'web-2',
    title: 'DANE - Departamento Administrativo Nacional de Estadística',
    description: 'Official statistics and demographic data for all Colombian departments.',
    type: 'website',
    language: 'es',
    level: 'intermediate',
    url: 'https://www.dane.gov.co/',
    author: 'Gobierno de Colombia',
    tags: ['statistics', 'demographics', 'data']
  },
  {
    id: 'web-3',
    title: 'ProColombia',
    description: 'Investment, export, and tourism promotion agency with detailed regional information.',
    type: 'website',
    language: 'both',
    level: 'intermediate',
    url: 'https://procolombia.co/',
    tags: ['economy', 'business', 'regions']
  },

  // Maps
  {
    id: 'map-1',
    title: 'Interactive Political Map of Colombia',
    description: 'Detailed interactive map showing all departments, capitals, and major cities.',
    type: 'map',
    language: 'both',
    level: 'all',
    url: 'https://www.google.com/maps/place/Colombia',
    tags: ['geography', 'interactive', 'cities']
  },
  {
    id: 'map-2',
    title: 'Colombia Topographic Map',
    description: 'Physical map showing mountains, rivers, and elevation of Colombian territory.',
    type: 'map',
    language: 'both',
    level: 'intermediate',
    url: 'https://en-gb.topographic-map.com/maps/qmh7/Colombia/',
    tags: ['geography', 'topography', 'physical']
  },

  // Educational Games
  {
    id: 'game-1',
    title: 'Seterra - Colombia Geography Quiz',
    description: 'Interactive quiz game to learn Colombian departments and capitals.',
    type: 'game',
    language: 'both',
    level: 'beginner',
    url: 'https://www.geoguessr.com/seterra/en/vgp/3199',
    tags: ['education', 'interactive', 'quiz'],
    featured: true
  },
  {
    id: 'game-2',
    title: 'Colombia Trivia',
    description: 'Test your knowledge about Colombian culture, history, and geography.',
    type: 'game',
    language: 'en',
    level: 'intermediate',
    url: 'https://www.sporcle.com/games/tag/colombia',
    tags: ['trivia', 'education', 'culture']
  },

  // Courses
  {
    id: 'course-1',
    title: 'Colombian Spanish Course',
    description: 'Learn Colombian Spanish dialect, expressions, and cultural context.',
    type: 'course',
    language: 'both',
    level: 'beginner',
    url: 'https://www.spanishlandschool.com/',
    duration: '20 hours',
    tags: ['language', 'spanish', 'culture']
  },
  {
    id: 'course-2',
    title: 'Historia y Geografía de Colombia',
    description: 'Curso completo sobre la historia y geografía colombiana para estudiantes.',
    type: 'course',
    language: 'es',
    level: 'intermediate',
    url: 'https://www.coursera.org/learn/colombia-history',
    duration: '6 weeks',
    author: 'Universidad de los Andes',
    tags: ['education', 'history', 'geography']
  },

  // Podcasts
  {
    id: 'pod-1',
    title: 'Radio Ambulante',
    description: 'Award-winning Spanish podcast featuring stories from Colombia and Latin America.',
    type: 'podcast',
    language: 'es',
    level: 'advanced',
    url: 'https://radioambulante.org/',
    author: 'NPR',
    tags: ['stories', 'culture', 'journalism']
  },
  {
    id: 'pod-2',
    title: 'Colombia Calling',
    description: 'English-language podcast about life, culture, and travel in Colombia.',
    type: 'podcast',
    language: 'en',
    level: 'intermediate',
    url: 'https://colombiacalling.com/',
    author: 'Richard McColl',
    tags: ['culture', 'expat', 'travel']
  },

  // Documentaries
  {
    id: 'doc-1',
    title: 'Encanto: A Journey Through Colombia',
    description: 'Behind-the-scenes look at the Colombian inspiration for Disney\'s Encanto.',
    type: 'documentary',
    language: 'both',
    level: 'all',
    url: 'https://www.disneyplus.com/encanto-colombia',
    duration: '45 min',
    year: 2022,
    tags: ['culture', 'film', 'family']
  },
  {
    id: 'doc-2',
    title: 'El Sendero de la Anaconda',
    description: 'Documental sobre el río Amazonas y las comunidades indígenas de Colombia.',
    type: 'documentary',
    language: 'es',
    level: 'intermediate',
    url: 'https://www.caracoltv.com/anaconda',
    duration: '78 min',
    year: 2019,
    author: 'Alessandro Angulo',
    tags: ['nature', 'indigenous', 'amazon']
  }
];

// Helper functions for filtering
export const getResourcesByType = (type: ResourceType): Resource[] => {
  return educationalResources.filter(resource => resource.type === type);
};

export const getResourcesByLanguage = (language: ResourceLanguage): Resource[] => {
  return educationalResources.filter(resource =>
    resource.language === language || resource.language === 'both'
  );
};

export const getFeaturedResources = (): Resource[] => {
  return educationalResources.filter(resource => resource.featured);
};

export const getResourcesByLevel = (level: ResourceLevel): Resource[] => {
  return educationalResources.filter(resource =>
    resource.level === level || resource.level === 'all'
  );
};

export const searchResources = (query: string): Resource[] => {
  const lowercaseQuery = query.toLowerCase();
  return educationalResources.filter(resource =>
    resource.title.toLowerCase().includes(lowercaseQuery) ||
    resource.description.toLowerCase().includes(lowercaseQuery) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Type labels for UI
export const resourceTypeLabels: Record<ResourceType, { label: string; icon: string }> = {
  video: { label: 'Videos', icon: '🎬' },
  article: { label: 'Artículos', icon: '📄' },
  book: { label: 'Libros', icon: '📚' },
  website: { label: 'Sitios Web', icon: '🌐' },
  map: { label: 'Mapas', icon: '🗺️' },
  game: { label: 'Juegos', icon: '🎮' },
  course: { label: 'Cursos', icon: '🎓' },
  podcast: { label: 'Podcasts', icon: '🎙️' },
  documentary: { label: 'Documentales', icon: '🎥' }
};

export const languageLabels: Record<ResourceLanguage, { label: string; flag: string }> = {
  es: { label: 'Español', flag: '🇨🇴' },
  en: { label: 'English', flag: '🇬🇧' },
  both: { label: 'Ambos/Both', flag: '🌍' }
};

export const levelLabels: Record<ResourceLevel, { label: string; color: string }> = {
  beginner: { label: 'Principiante', color: 'green' },
  intermediate: { label: 'Intermedio', color: 'yellow' },
  advanced: { label: 'Avanzado', color: 'red' },
  all: { label: 'Todos', color: 'blue' }
};