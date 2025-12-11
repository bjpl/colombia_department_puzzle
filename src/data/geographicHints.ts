/**
 * Geographic hints data for Colombia departments
 * Extracted from HintModal for better maintainability
 *
 * @module data/geographicHints
 */

export interface GeographicHint {
  neighbors?: string[];
  position?: string;
  landmark?: string;
  size?: string;
}

export const geographicHints: Record<string, GeographicHint> = {
  'La Guajira': {
    neighbors: ['Cesar', 'Magdalena'],
    position: 'Extremo norte del país, península en el Caribe',
    landmark: 'Punta Gallinas - punto más norte de Suramérica',
    size: 'Forma de península que apunta hacia Venezuela'
  },
  'Antioquia': {
    neighbors: ['Córdoba', 'Santander', 'Boyacá', 'Caldas', 'Risaralda', 'Chocó'],
    position: 'Noroeste del país, segundo más grande',
    landmark: 'Medellín está en el centro del departamento',
    size: 'Uno de los más grandes, forma irregular'
  },
  'Cundinamarca': {
    neighbors: ['Boyacá', 'Meta', 'Tolima', 'Caldas'],
    position: 'Centro del país, rodea a Bogotá',
    landmark: 'Tiene un "hueco" donde está Bogotá D.C.',
    size: 'Forma de dona alrededor de la capital'
  },
  'Nariño': {
    neighbors: ['Cauca', 'Putumayo'],
    position: 'Extremo suroeste, frontera con Ecuador',
    landmark: 'Volcán Galeras cerca de Pasto',
    size: 'En la esquina suroeste del país'
  },
  'San Andrés y Providencia': {
    neighbors: [],
    position: 'Islas en el Mar Caribe, lejos de la costa',
    landmark: 'Archipiélago cercano a Nicaragua',
    size: 'El único departamento insular'
  },
  'Amazonas': {
    neighbors: ['Vaupés', 'Caquetá', 'Putumayo'],
    position: 'Extremo sur, forma de triángulo',
    landmark: 'Leticia en la triple frontera con Brasil y Perú',
    size: 'El más grande del país, forma triangular al sur'
  },
  'Chocó': {
    neighbors: ['Antioquia', 'Risaralda', 'Valle del Cauca'],
    position: 'Costa Pacífica, todo el lado oeste',
    landmark: 'Único con costas en el Pacífico al norte',
    size: 'Alargado de norte a sur por la costa Pacífica'
  },
  'Meta': {
    neighbors: ['Cundinamarca', 'Boyacá', 'Casanare', 'Vichada', 'Guaviare', 'Caquetá', 'Huila'],
    position: 'Centro-este, entrada a los Llanos',
    landmark: 'Villavicencio es la puerta al Llano',
    size: 'Grande, conecta los Andes con los Llanos'
  },
  'Atlántico': {
    neighbors: ['Bolívar', 'Magdalena'],
    position: 'Costa norte, pequeño departamento costero',
    landmark: 'Barranquilla en la desembocadura del río Magdalena',
    size: 'Uno de los más pequeños, en la costa Caribe'
  },
  'Bolívar': {
    neighbors: ['Atlántico', 'Magdalena', 'Cesar', 'Santander', 'Antioquia', 'Córdoba', 'Sucre'],
    position: 'Norte del país, desde la costa hacia el interior',
    landmark: 'Cartagena de Indias, ciudad amurallada',
    size: 'Grande, forma irregular con costa Caribe'
  },
  'Magdalena': {
    neighbors: ['La Guajira', 'Cesar', 'Bolívar', 'Atlántico'],
    position: 'Costa norte, entre La Guajira y Atlántico',
    landmark: 'Santa Marta, ciudad más antigua de Colombia',
    size: 'Mediano, con forma triangular hacia el mar'
  },
  'Cesar': {
    neighbors: ['La Guajira', 'Magdalena', 'Bolívar', 'Norte de Santander', 'Santander'],
    position: 'Norte del país, interior de la costa Caribe',
    landmark: 'Valledupar, capital mundial del vallenato',
    size: 'Grande, forma rectangular al norte'
  },
  'Córdoba': {
    neighbors: ['Antioquia', 'Bolívar', 'Sucre'],
    position: 'Norte, costa Caribe occidental',
    landmark: 'Montería junto al río Sinú',
    size: 'Mediano-grande, costa y llanuras'
  },
  'Sucre': {
    neighbors: ['Córdoba', 'Bolívar'],
    position: 'Norte, costa Caribe entre Córdoba y Bolívar',
    landmark: 'Sincelejo en las sabanas',
    size: 'Pequeño-mediano, golfo de Morrosquillo'
  },
  'Santander': {
    neighbors: ['Norte de Santander', 'Boyacá', 'Antioquia', 'Bolívar', 'Cesar'],
    position: 'Noreste, cordillera Oriental',
    landmark: 'Cañón del Chicamocha, Bucaramanga',
    size: 'Grande, forma alargada norte-sur'
  },
  'Norte de Santander': {
    neighbors: ['Cesar', 'Santander', 'Boyacá'],
    position: 'Noreste, frontera con Venezuela',
    landmark: 'Cúcuta, puente fronterizo con Venezuela',
    size: 'Mediano, forma triangular hacia Venezuela'
  },
  'Boyacá': {
    neighbors: ['Norte de Santander', 'Santander', 'Antioquia', 'Caldas', 'Cundinamarca', 'Meta', 'Casanare', 'Arauca'],
    position: 'Centro-este, altiplano cundiboyacense',
    landmark: 'Tunja, Puente de Boyacá (independencia)',
    size: 'Grande, forma irregular en los Andes'
  },
  'Arauca': {
    neighbors: ['Boyacá', 'Casanare', 'Vichada'],
    position: 'Este, frontera con Venezuela en los Llanos',
    landmark: 'Arauca ciudad fronteriza, río Arauca',
    size: 'Mediano, rectangular en los Llanos orientales'
  },
  'Casanare': {
    neighbors: ['Arauca', 'Boyacá', 'Meta', 'Vichada'],
    position: 'Este, corazón de los Llanos Orientales',
    landmark: 'Yopal, capital petrolera de los Llanos',
    size: 'Muy grande, forma irregular en los Llanos'
  },
  'Vichada': {
    neighbors: ['Arauca', 'Casanare', 'Meta', 'Guaviare', 'Guainía'],
    position: 'Este extremo, frontera con Venezuela',
    landmark: 'Puerto Carreño en la confluencia del Meta y Orinoco',
    size: 'Segundo más grande, forma triangular al este'
  },
  'Guainía': {
    neighbors: ['Vichada', 'Guaviare', 'Vaupés'],
    position: 'Este extremo, frontera con Venezuela y Brasil',
    landmark: 'Puerto Inírida, Cerros de Mavecure',
    size: 'Grande, en el extremo oriental'
  },
  'Guaviare': {
    neighbors: ['Meta', 'Vichada', 'Guainía', 'Vaupés', 'Caquetá'],
    position: 'Centro-sur, transición Llanos-Amazonía',
    landmark: 'San José del Guaviare, puerta a la Amazonía',
    size: 'Grande, forma cuadrada en el centro-sur'
  },
  'Vaupés': {
    neighbors: ['Guaviare', 'Guainía', 'Amazonas', 'Caquetá'],
    position: 'Sureste, plena selva amazónica',
    landmark: 'Mitú, rodeado de selva amazónica',
    size: 'Grande, frontera con Brasil'
  },
  'Caquetá': {
    neighbors: ['Huila', 'Meta', 'Guaviare', 'Vaupés', 'Amazonas', 'Putumayo', 'Cauca'],
    position: 'Sur, piedemonte amazónico',
    landmark: 'Florencia, portal amazónico',
    size: 'Muy grande, forma irregular al sur'
  },
  'Putumayo': {
    neighbors: ['Nariño', 'Cauca', 'Caquetá', 'Amazonas'],
    position: 'Sur extremo, frontera con Ecuador y Perú',
    landmark: 'Mocoa, Valle de Sibundoy',
    size: 'Mediano-grande, frontera sur'
  },
  'Huila': {
    neighbors: ['Cundinamarca', 'Tolima', 'Meta', 'Caquetá', 'Cauca'],
    position: 'Centro-sur, nacimiento del río Magdalena',
    landmark: 'Neiva, Desierto de la Tatacoa, Nevado del Huila',
    size: 'Mediano, forma de diamante'
  },
  'Tolima': {
    neighbors: ['Caldas', 'Risaralda', 'Valle del Cauca', 'Quindío', 'Cundinamarca', 'Huila'],
    position: 'Centro del país, corazón de Colombia',
    landmark: 'Ibagué, Nevado del Tolima',
    size: 'Mediano, forma triangular en el centro'
  },
  'Caldas': {
    neighbors: ['Antioquia', 'Boyacá', 'Cundinamarca', 'Tolima', 'Risaralda'],
    position: 'Centro-oeste, Eje Cafetero',
    landmark: 'Manizales, Nevado del Ruiz',
    size: 'Pequeño, en el Eje Cafetero'
  },
  'Risaralda': {
    neighbors: ['Antioquia', 'Caldas', 'Quindío', 'Valle del Cauca', 'Chocó'],
    position: 'Centro-oeste, Eje Cafetero',
    landmark: 'Pereira, centro del Eje Cafetero',
    size: 'El segundo más pequeño del país'
  },
  'Quindío': {
    neighbors: ['Risaralda', 'Tolima', 'Valle del Cauca'],
    position: 'Centro-oeste, corazón del Eje Cafetero',
    landmark: 'Armenia, Valle de Cocora con palmas de cera',
    size: 'El más pequeño después de San Andrés'
  },
  'Valle del Cauca': {
    neighbors: ['Chocó', 'Risaralda', 'Quindío', 'Tolima', 'Cauca'],
    position: 'Suroeste, costa Pacífica',
    landmark: 'Cali, capital de la salsa, Buenaventura puerto',
    size: 'Mediano, desde el Pacífico hasta la cordillera'
  },
  'Cauca': {
    neighbors: ['Valle del Cauca', 'Tolima', 'Huila', 'Caquetá', 'Putumayo', 'Nariño'],
    position: 'Suroeste, entre Valle y Nariño',
    landmark: 'Popayán, ciudad blanca',
    size: 'Grande, desde el Pacífico hasta la Amazonía'
  },
  'Bogotá D.C.': {
    neighbors: ['Cundinamarca'],
    position: 'Centro del país, dentro de Cundinamarca',
    landmark: 'Capital de Colombia, Distrito Capital',
    size: 'Muy pequeño, completamente rodeado por Cundinamarca'
  }
};

/**
 * Department classification helpers
 */
export const coastalDepartments = [
  'La Guajira', 'Magdalena', 'Atlántico', 'Bolívar', 'Córdoba',
  'Sucre', 'Chocó', 'Valle del Cauca', 'Cauca', 'Nariño'
];

export const borderDepartments = [
  'La Guajira', 'Norte de Santander', 'Arauca', 'Vichada',
  'Guainía', 'Vaupés', 'Amazonas', 'Putumayo', 'Nariño'
];

export const smallDepartments = [
  'Atlántico', 'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Bogotá D.C.'
];

export const largeDepartments = [
  'Amazonas', 'Vichada', 'Meta', 'Casanare', 'Caquetá', 'Antioquia'
];

export const islandDepartment = 'San Andrés y Providencia';

/**
 * Check department characteristics
 */
export function isDepartmentCoastal(name: string): boolean {
  return coastalDepartments.includes(name);
}

export function isDepartmentBorder(name: string): boolean {
  return borderDepartments.includes(name);
}

export function isDepartmentSmall(name: string): boolean {
  return smallDepartments.includes(name);
}

export function isDepartmentLarge(name: string): boolean {
  return largeDepartments.includes(name);
}

export function isDepartmentIsland(name: string): boolean {
  return name === islandDepartment;
}

/**
 * Get border country for a department
 */
export function getBorderCountry(departmentName: string): string | null {
  if (['La Guajira', 'Norte de Santander', 'Arauca', 'Vichada', 'Guainía'].includes(departmentName)) {
    return 'Venezuela';
  }
  if (['Vaupés', 'Amazonas', 'Guainía'].includes(departmentName)) {
    return 'Brasil';
  }
  if (['Putumayo', 'Amazonas'].includes(departmentName)) {
    return 'Perú';
  }
  if (departmentName === 'Nariño') {
    return 'Ecuador';
  }
  return null;
}

/**
 * Get coast type for a coastal department
 */
export function getCoastType(departmentName: string): 'Pacífico' | 'Caribe' | null {
  if (['Chocó', 'Valle del Cauca', 'Cauca', 'Nariño'].includes(departmentName)) {
    return 'Pacífico';
  }
  if (['La Guajira', 'Magdalena', 'Atlántico', 'Bolívar', 'Córdoba', 'Sucre'].includes(departmentName)) {
    return 'Caribe';
  }
  return null;
}
