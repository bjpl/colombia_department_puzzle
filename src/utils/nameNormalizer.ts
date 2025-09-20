// Utility to normalize department names for consistent matching
export function normalizeId(name: string): string {
  if (!name) return '';

  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with dash
    .replace(/-+/g, '-') // Replace multiple dashes with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
}

// Map between our data IDs and GeoJSON names
export const departmentNameMap: Record<string, string> = {
  'amazonas': 'amazonas',
  'antioquia': 'antioquia',
  'arauca': 'arauca',
  'san-andres': 'archipielago-de-san-andres-providencia-y-santa-catalina',
  'san-andres-y-providencia': 'archipielago-de-san-andres-providencia-y-santa-catalina', // Alternative name
  'atlantico': 'atlantico',
  'bogota': 'bogota-d-c',
  'bolivar': 'bolivar',
  'boyaca': 'boyaca',
  'caldas': 'caldas',
  'caqueta': 'caqueta',
  'casanare': 'casanare',
  'cauca': 'cauca',
  'cesar': 'cesar',
  'choco': 'choco',
  'cordoba': 'cordoba',
  'cundinamarca': 'cundinamarca',
  'guainia': 'guainia',
  'guaviare': 'guaviare',
  'huila': 'huila',
  'la-guajira': 'la-guajira',
  'magdalena': 'magdalena',
  'meta': 'meta',
  'narino': 'narino',
  'norte-santander': 'norte-de-santander',
  'putumayo': 'putumayo',
  'quindio': 'quindio',
  'risaralda': 'risaralda',
  'santander': 'santander',
  'sucre': 'sucre',
  'tolima': 'tolima',
  'valle-del-cauca': 'valle-del-cauca',
  'vaupes': 'vaupes',
  'vichada': 'vichada'
};