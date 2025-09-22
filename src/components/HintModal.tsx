import { useEffect, useState } from 'react';
import { colombiaDepartments } from '../data/colombiaDepartments';
import { REGION_STYLES as regionColors } from '../constants/regionColors';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Modal,
  colors,
  spacing,
  textStyles,
  shadows
} from '../design-system';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName: string;
  region: string;
  hintLevel: number; // 1, 2, or 3 - progressive hints
}


// Geographic relationships for better hints
const geographicHints: Record<string, {
  neighbors?: string[];
  position?: string;
  landmark?: string;
  size?: string;
}> = {
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

export default function HintModal({ isOpen, onClose, departmentName, region, hintLevel = 1 }: HintModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const regionData = regionColors[region] || regionColors['Andina'];
  const geoHints = geographicHints[departmentName] || {};

  // Find the department data for capital info
  const department = colombiaDepartments.find(d => d.name === departmentName);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  // Determine department characteristics for varied hints
  const isCoastal = ['La Guajira', 'Magdalena', 'Atlántico', 'Bolívar', 'Córdoba', 'Sucre', 'Chocó', 'Valle del Cauca', 'Cauca', 'Nariño'].includes(departmentName);
  const isBorder = ['La Guajira', 'Norte de Santander', 'Arauca', 'Vichada', 'Guainía', 'Vaupés', 'Amazonas', 'Putumayo', 'Nariño'].includes(departmentName);
  const isSmall = ['Atlántico', 'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Bogotá D.C.'].includes(departmentName);
  const isLarge = ['Amazonas', 'Vichada', 'Meta', 'Casanare', 'Caquetá', 'Antioquia'].includes(departmentName);
  const isIsland = departmentName === 'San Andrés y Providencia';

  const getHintContent = () => {
    // Progressive hints based on level
    if (hintLevel === 1) {
      // Level 1: Varied first hints based on department characteristics

      // Special case for islands
      if (isIsland) {
        return (
          <>
            <div className="text-6xl mb-4 animate-bounce">🏝️</div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent">
              Pista Nivel 1: Territorio Insular
            </h3>
            <div className="space-y-4">
              <div className="bg-cyan-50 rounded-lg p-4 border-2 border-cyan-300">
                <p className="text-lg font-semibold text-cyan-900 mb-2">
                  {departmentName} es el único departamento insular
                </p>
                <p className="text-cyan-700">
                  🌊 Ubicado en el Mar Caribe, lejos de la costa continental
                </p>
                <p className="text-sm text-cyan-600 mt-2">
                  Busca las islas en el Caribe, más cerca de Nicaragua que de Colombia
                </p>
              </div>
            </div>
          </>
        );
      }

      // For coastal departments, emphasize the coastline
      if (isCoastal) {
        const coast = departmentName === 'Chocó' || departmentName === 'Valle del Cauca' || departmentName === 'Cauca' || departmentName === 'Nariño' ? 'Pacífico' : 'Caribe';
        return (
          <>
            <div className="text-6xl mb-4 animate-bounce">{coast === 'Pacífico' ? '🌊' : '🏖️'}</div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
              Pista Nivel 1: Departamento Costero
            </h3>
            <div className="space-y-4">
              <div className="bg-sky-50 rounded-lg p-4">
                <p className="text-lg font-semibold text-sky-900 mb-2">
                  {departmentName} tiene costa en el {coast}
                </p>
                {geoHints.position && (
                  <p className="text-sky-700 mb-2">
                    📍 {geoHints.position}
                  </p>
                )}
                {department && (
                  <p className="text-sm text-sky-600 mt-2">
                    Capital: {department.capital}
                  </p>
                )}
              </div>
            </div>
          </>
        );
      }

      // For border departments, emphasize international borders
      if (isBorder && !isCoastal) {
        const borderCountry = ['La Guajira', 'Norte de Santander', 'Arauca', 'Vichada', 'Guainía'].includes(departmentName) ? 'Venezuela' :
                            ['Vaupés', 'Amazonas', 'Guainía'].includes(departmentName) ? 'Brasil' :
                            ['Putumayo', 'Amazonas'].includes(departmentName) ? 'Perú' :
                            'Ecuador';
        return (
          <>
            <div className="text-6xl mb-4 animate-pulse">🗺️</div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Pista Nivel 1: Frontera Internacional
            </h3>
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
                <p className="text-lg font-semibold text-orange-900 mb-2">
                  {departmentName} hace frontera con {borderCountry}
                </p>
                {geoHints.landmark && (
                  <p className="text-orange-700 mb-2">
                    🏛️ {geoHints.landmark}
                  </p>
                )}
                <p className="text-sm text-orange-600 mt-2">
                  Busca en los límites del país con {borderCountry}
                </p>
              </div>
            </div>
          </>
        );
      }

      // For very small departments, emphasize size
      if (isSmall) {
        return (
          <>
            <div className="text-6xl mb-4 animate-bounce">🔍</div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
              Pista Nivel 1: Tamaño Pequeño
            </h3>
            <div className="space-y-4">
              <div className="bg-violet-50 rounded-lg p-4">
                <p className="text-lg font-semibold text-violet-900 mb-2">
                  {departmentName} es uno de los más pequeños
                </p>
                {geoHints.position && (
                  <p className="text-violet-700 mb-2">
                    📍 {geoHints.position}
                  </p>
                )}
                {department && (
                  <div className="bg-violet-100 rounded p-2 mt-2">
                    <p className="text-sm text-violet-800">
                      💡 Capital: {department.capital}
                    </p>
                    <p className="text-xs text-violet-600">
                      Área: {department.area?.toLocaleString()} km²
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        );
      }

      // For very large departments, emphasize size and shape
      if (isLarge) {
        return (
          <>
            <div className="text-6xl mb-4 animate-pulse">🗾</div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              Pista Nivel 1: Gran Extensión
            </h3>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-lg font-semibold text-green-900 mb-2">
                  {departmentName} es uno de los más grandes del país
                </p>
                {geoHints.size && (
                  <p className="text-green-700 mb-2">
                    🔍 {geoHints.size}
                  </p>
                )}
                {geoHints.position && (
                  <p className="text-sm text-green-600 mt-2">
                    📍 {geoHints.position}
                  </p>
                )}
              </div>
            </div>
          </>
        );
      }

      // Default: Show region and unique characteristic
      return (
        <>
          <div className="text-6xl mb-4 animate-bounce">{regionData.icon}</div>
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Pista Nivel 1: Ubicación Regional
          </h3>
          <div className="space-y-4">
            <div className={`bg-gradient-to-r ${regionData.bg} bg-opacity-10 rounded-lg p-4`}>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                {departmentName} - Región {region}
              </p>
              {geoHints.landmark && (
                <p className="text-gray-700 mb-2">
                  🏛️ {geoHints.landmark}
                </p>
              )}
              {department && (
                <p className="text-sm text-gray-600 mt-2">
                  Capital: {department.capital}
                </p>
              )}
              <div className="mt-3 bg-sky-50 rounded p-2">
                <p className="text-xs text-sky-700">
                  💡 Tip: Usa el botón "Mostrar Regiones" en el mapa para ver los colores
                </p>
              </div>
            </div>
          </div>
        </>
      );
    } else if (hintLevel === 2) {
      // Level 2: More specific location hints

      // For islands, show unique position
      if (isIsland) {
        return (
          <>
            <div className="text-6xl mb-4 animate-pulse">🗺️</div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
              Pista Nivel 2: Ubicación Exacta
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-cyan-50 to-sky-50 rounded-lg p-4">
                <p className="text-lg font-bold text-cyan-900 mb-3">
                  🏝️ Archipiélago en el Caribe
                </p>
                <div className="bg-white rounded p-3">
                  <p className="text-sm text-gray-700">
                    📐 Más cerca de Nicaragua que de la costa colombiana
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    🧭 Al noroeste del territorio continental
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    🌊 En medio del Mar Caribe
                  </p>
                </div>
              </div>
            </div>
          </>
        );
      }

      // Show different information based on what's most helpful
      const hasMany = geoHints.neighbors && geoHints.neighbors.length > 4;
      const hasFew = geoHints.neighbors && geoHints.neighbors.length <= 3;

      return (
        <>
          <div className="text-6xl mb-4 animate-pulse">🧭</div>
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-sky-600 to-green-600 bg-clip-text text-transparent">
            Pista Nivel 2: {hasMany ? 'Conexiones' : hasFew ? 'Vecinos Clave' : 'Posición Específica'}
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-sky-50 to-green-50 rounded-lg p-4">
              <p className="font-bold text-gray-900 mb-3">{departmentName}</p>

              {/* Show neighbors differently based on count */}
              {hasMany && (
                <div className="bg-yellow-50 rounded p-3 mb-3">
                  <p className="text-sm font-semibold text-yellow-800 mb-1">
                    ⚠️ Departamento muy conectado
                  </p>
                  <p className="text-xs text-yellow-700">
                    Limita con {geoHints.neighbors.length} departamentos
                  </p>
                </div>
              )}

              {geoHints.position && (
                <p className="text-gray-700 mb-3">
                  📍 <span className="font-medium">{geoHints.position}</span>
                </p>
              )}

              {geoHints.neighbors && geoHints.neighbors.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {hasFew ? '🎯 Vecinos clave:' : '🔗 Limita con:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(geoHints.neighbors || []).slice(0, hasFew ? 3 : 5).map(neighbor => (
                      <span key={neighbor} className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                        hasFew ? 'bg-green-100 text-green-800' : 'bg-white text-gray-700'
                      }`}>
                        {neighbor}
                      </span>
                    ))}
                    {geoHints.neighbors && geoHints.neighbors.length > 5 && (
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-500">
                        +{geoHints.neighbors.length - 5} más
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Add shape hint for large departments */}
              {isLarge && geoHints.size && (
                <div className="mt-3 bg-green-50 rounded p-2">
                  <p className="text-sm text-green-800">
                    🔍 Forma: {geoHints.size}
                  </p>
                </div>
              )}

              {/* Add area comparison for context */}
              {department && department.area && (
                <p className="text-xs text-gray-500 mt-3">
                  📏 Área: {department.area.toLocaleString()} km²
                </p>
              )}
            </div>
          </div>
        </>
      );
    } else {
      // Level 3: Maximum help - directional guidance and key identifiers
      return (
        <>
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Pista Nivel 3: Ayuda Máxima
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border-2 border-red-300">
              <p className="font-bold text-gray-900 text-lg mb-3">📍 {departmentName}</p>

              {/* Directional guidance based on department */}
              <div className="bg-white rounded-lg p-3 mb-3 border-l-4 border-red-400">
                <p className="text-sm font-semibold text-red-800 mb-2">
                  🧭 Búscalo aquí:
                </p>
                {isIsland && (
                  <p className="text-gray-700">
                    En el Mar Caribe, esquina superior izquierda del mapa,
                    lejos de la costa continental
                  </p>
                )}
                {departmentName === 'Amazonas' && (
                  <p className="text-gray-700">
                    Extremo sur del país, el departamento más grande,
                    forma triangular apuntando hacia Brasil y Perú
                  </p>
                )}
                {departmentName === 'La Guajira' && (
                  <p className="text-gray-700">
                    Península en el extremo norte, la punta más al norte de Colombia
                  </p>
                )}
                {departmentName === 'Nariño' && (
                  <p className="text-gray-700">
                    Suroeste, en la frontera con Ecuador, costa Pacífica
                  </p>
                )}
                {departmentName === 'Chocó' && (
                  <p className="text-gray-700">
                    Costa Pacífica, departamento largo y delgado desde Panamá hacia el sur
                  </p>
                )}
                {departmentName === 'Bogotá D.C.' && (
                  <p className="text-gray-700">
                    Centro del país, pequeño punto dentro de Cundinamarca,
                    busca el "hueco" en medio de Cundinamarca
                  </p>
                )}
                {/* Specific directional guidance for ALL remaining departments */}
                {departmentName === 'Antioquia' && (
                  <p className="text-gray-700">
                    Noroeste del centro, departamento grande con forma irregular,
                    entre Chocó y Santander, al norte de Caldas y Risaralda
                  </p>
                )}
                {departmentName === 'Arauca' && (
                  <p className="text-gray-700">
                    Este del país, frontera con Venezuela,
                    rectángulo horizontal en los Llanos, al norte de Casanare
                  </p>
                )}
                {departmentName === 'Atlántico' && (
                  <p className="text-gray-700">
                    Costa norte, el más pequeño de la costa Caribe,
                    donde el río Magdalena desemboca al mar, junto a Barranquilla
                  </p>
                )}
                {departmentName === 'Bolívar' && (
                  <p className="text-gray-700">
                    Norte, departamento grande desde Cartagena hacia el interior,
                    forma irregular que abraza a Atlántico
                  </p>
                )}
                {departmentName === 'Boyacá' && (
                  <p className="text-gray-700">
                    Centro-este, forma alargada vertical,
                    al este de Antioquia, entre Santander y Cundinamarca
                  </p>
                )}
                {departmentName === 'Caldas' && (
                  <p className="text-gray-700">
                    Centro-oeste, pequeño en el Eje Cafetero,
                    entre Antioquia y Tolima, al norte de Risaralda
                  </p>
                )}
                {departmentName === 'Caquetá' && (
                  <p className="text-gray-700">
                    Sur del país, grande en forma de L invertida,
                    entre Meta y Putumayo, al norte de Amazonas
                  </p>
                )}
                {departmentName === 'Casanare' && (
                  <p className="text-gray-700">
                    Este, departamento grande de los Llanos,
                    al sur de Arauca, forma irregular hacia el Orinoco
                  </p>
                )}
                {departmentName === 'Cauca' && (
                  <p className="text-gray-700">
                    Suroeste, departamento grande del Pacífico al interior,
                    entre Valle del Cauca y Nariño, con costa Pacífica
                  </p>
                )}
                {departmentName === 'Cesar' && (
                  <p className="text-gray-700">
                    Norte interior, rectángulo vertical,
                    entre La Guajira y Norte de Santander, sin costa
                  </p>
                )}
                {departmentName === 'Córdoba' && (
                  <p className="text-gray-700">
                    Norte, costa Caribe occidental,
                    al oeste de Bolívar y Sucre, forma triangular
                  </p>
                )}
                {departmentName === 'Cundinamarca' && (
                  <p className="text-gray-700">
                    Centro del país, forma de C que rodea a Bogotá,
                    entre Boyacá y Tolima, busca el "donut" con hueco
                  </p>
                )}
                {departmentName === 'Guainía' && (
                  <p className="text-gray-700">
                    Extremo este, frontera con Venezuela y Brasil,
                    forma triangular en la esquina oriental del país
                  </p>
                )}
                {departmentName === 'Guaviare' && (
                  <p className="text-gray-700">
                    Centro-sur, transición Llanos-Amazonía,
                    forma cuadrada entre Meta y Caquetá
                  </p>
                )}
                {departmentName === 'Huila' && (
                  <p className="text-gray-700">
                    Centro-sur, forma de diamante,
                    entre Tolima y Caquetá, donde nace el río Magdalena
                  </p>
                )}
                {departmentName === 'Magdalena' && (
                  <p className="text-gray-700">
                    Costa norte, forma triangular hacia el mar,
                    entre La Guajira y Atlántico, con Santa Marta
                  </p>
                )}
                {departmentName === 'Meta' && (
                  <p className="text-gray-700">
                    Centro-este, departamento grande,
                    puerta a los Llanos desde Bogotá, al sur de Casanare
                  </p>
                )}
                {departmentName === 'Norte de Santander' && (
                  <p className="text-gray-700">
                    Noreste frontera con Venezuela,
                    entre Cesar y Santander, donde está Cúcuta
                  </p>
                )}
                {departmentName === 'Putumayo' && (
                  <p className="text-gray-700">
                    Sur extremo, frontera con Ecuador y Perú,
                    franja horizontal entre Nariño y Amazonas
                  </p>
                )}
                {departmentName === 'Quindío' && (
                  <p className="text-gray-700">
                    Centro-oeste, el más pequeño del interior,
                    corazón del Eje Cafetero, entre Risaralda y Valle
                  </p>
                )}
                {departmentName === 'Risaralda' && (
                  <p className="text-gray-700">
                    Centro-oeste, segundo más pequeño,
                    en el Eje Cafetero entre Caldas y Valle del Cauca
                  </p>
                )}
                {departmentName === 'San Andrés y Providencia' && (
                  <p className="text-gray-700">
                    Islas en el Mar Caribe, esquina superior izquierda del mapa,
                    más cerca de Nicaragua que de Colombia continental
                  </p>
                )}
                {departmentName === 'Santander' && (
                  <p className="text-gray-700">
                    Noreste interior, departamento largo vertical,
                    entre Norte de Santander y Boyacá, con el Cañón del Chicamocha
                  </p>
                )}
                {departmentName === 'Sucre' && (
                  <p className="text-gray-700">
                    Norte costa Caribe, pequeño entre Córdoba y Bolívar,
                    con el Golfo de Morrosquillo
                  </p>
                )}
                {departmentName === 'Tolima' && (
                  <p className="text-gray-700">
                    Centro del país, forma triangular,
                    entre Cundinamarca y Huila, corazón de Colombia
                  </p>
                )}
                {departmentName === 'Valle del Cauca' && (
                  <p className="text-gray-700">
                    Suroeste, desde la costa Pacífica (Buenaventura),
                    entre Chocó y Cauca, donde está Cali
                  </p>
                )}
                {departmentName === 'Vaupés' && (
                  <p className="text-gray-700">
                    Sureste, selva amazónica profunda,
                    entre Guaviare y Amazonas, frontera con Brasil
                  </p>
                )}
                {departmentName === 'Vichada' && (
                  <p className="text-gray-700">
                    Este, segundo departamento más grande,
                    forma triangular en los Llanos, frontera con Venezuela
                  </p>
                )}
              </div>

              {/* Visual shape description */}
              {geoHints.size && (
                <div className="bg-yellow-50 rounded p-2 mb-3">
                  <p className="text-sm text-yellow-800">
                    🔍 <span className="font-semibold">Forma característica:</span>
                  </p>
                  <p className="text-sm text-yellow-700 ml-6">{geoHints.size}</p>
                </div>
              )}

              {/* All neighbors for reference */}
              {geoHints.neighbors && geoHints.neighbors.length > 0 && (
                <div className="bg-sky-50 rounded p-2 mb-3">
                  <p className="text-sm font-semibold text-sky-800 mb-1">
                    🔗 Todos sus vecinos:
                  </p>
                  <div className="flex flex-wrap gap-1 ml-6">
                    {geoHints.neighbors.map(neighbor => (
                      <span key={neighbor} className="px-2 py-0.5 bg-sky-100 rounded text-xs text-sky-700">
                        {neighbor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Capital as final clue */}
              {department && (
                <div className="mt-3 p-2 bg-gradient-to-r from-pink-100 to-red-100 rounded border border-pink-300">
                  <p className="text-sm font-bold text-red-800">
                    🏛️ Capital: {department.capital}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Busca donde estaría esta ciudad importante
                  </p>
                </div>
              )}

              {/* Encouragement message */}
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-600 italic">
                  💪 ¡Ya casi lo tienes! Esta es la máxima ayuda disponible
                </p>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  const getHintCost = () => {
    switch(hintLevel) {
      case 1: return '10 puntos';
      case 2: return '25 puntos';
      case 3: return '50 puntos';
      default: return '10 puntos';
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
      isAnimating ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative transform transition-all duration-300 ${
        isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Glow effect */}
        <div className={`absolute -inset-4 bg-gradient-to-r ${
          hintLevel === 1 ? regionData.bg :
          hintLevel === 2 ? 'from-sky-400 to-green-400' :
          'from-red-400 to-orange-400'
        } rounded-3xl blur-2xl opacity-30 animate-pulse`} />

        {/* Card */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full group"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>

          {/* Hint cost indicator */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-gray-100 rounded-full">
            <span className="text-xs font-semibold text-gray-600">Costo: {getHintCost()}</span>
          </div>

          {/* Content */}
          <div className="text-center mt-4">
            {getHintContent()}
          </div>

          {/* Action button */}
          <Button
            variant="primary"
            size="lg"
            onClick={onClose}
            className="mt-6 w-full"
          >
            ¡Entendido!
          </Button>

          {/* Progress indicator */}
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3].map(level => (
              <div
                key={level}
                className={`w-2 h-2 rounded-full ${
                  level <= hintLevel ? 'bg-sky-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}