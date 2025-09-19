import React, { useEffect, useState } from 'react';
import { colombiaDepartments } from '../data/colombiaDepartments';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName: string;
  region: string;
  hintLevel: number; // 1, 2, or 3 - progressive hints
  attempts?: number; // How many times they've tried this department
}

const regionColors: Record<string, { bg: string; text: string; icon: string }> = {
  'Andina': { bg: 'from-green-400 to-green-600', text: 'text-green-900', icon: '⛰️' },
  'Caribe': { bg: 'from-blue-400 to-blue-600', text: 'text-blue-900', icon: '🏖️' },
  'Pacífica': { bg: 'from-purple-400 to-purple-600', text: 'text-purple-900', icon: '🌊' },
  'Orinoquía': { bg: 'from-yellow-400 to-yellow-600', text: 'text-yellow-900', icon: '🌾' },
  'Amazonía': { bg: 'from-emerald-400 to-emerald-600', text: 'text-emerald-900', icon: '🌳' },
  'Insular': { bg: 'from-cyan-400 to-cyan-600', text: 'text-cyan-900', icon: '🏝️' },
};

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
  }
};

export default function HintModal({ isOpen, onClose, departmentName, region, hintLevel = 1, attempts = 0 }: HintModalProps) {
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

  const getHintContent = () => {
    // Progressive hints based on level
    if (hintLevel === 1) {
      // Level 1: Region and general area
      return (
        <>
          <div className="text-6xl mb-4 animate-bounce">{regionData.icon}</div>
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Pista Nivel 1: Región
          </h3>
          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-semibold text-gray-900">{departmentName}</span> está en:
            </p>
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${regionData.bg} text-white font-bold text-lg shadow-lg`}>
              <span className="text-2xl">{regionData.icon}</span>
              Región {region}
            </div>

            {department && (
              <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">💡 Dato útil:</span> La capital es {department.capital}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-600 italic">
              Busca en las áreas de color {
                region === 'Andina' ? 'verde (centro del país)' :
                region === 'Caribe' ? 'azul (costa norte)' :
                region === 'Pacífica' ? 'púrpura (costa oeste)' :
                region === 'Orinoquía' ? 'amarillo (llanos orientales)' :
                region === 'Amazonía' ? 'esmeralda (sur selvático)' :
                'cyan (islas del Caribe)'
              }
            </p>
          </div>
        </>
      );
    } else if (hintLevel === 2) {
      // Level 2: Neighboring departments and position
      return (
        <>
          <div className="text-6xl mb-4 animate-pulse">🧭</div>
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Pista Nivel 2: Ubicación
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">{departmentName}</p>

              {geoHints.position && (
                <p className="text-gray-700 mb-3">
                  📍 <span className="font-medium">{geoHints.position}</span>
                </p>
              )}

              {geoHints.neighbors && geoHints.neighbors.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Limita con:</p>
                  <div className="flex flex-wrap gap-2">
                    {geoHints.neighbors.map(neighbor => (
                      <span key={neighbor} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        {neighbor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {department && department.area && (
                <p className="text-sm text-gray-600 mt-3">
                  📏 Tamaño: {department.area > 50000 ? 'Muy grande' :
                             department.area > 20000 ? 'Grande' :
                             department.area > 10000 ? 'Mediano' :
                             department.area > 5000 ? 'Pequeño' : 'Muy pequeño'}
                  {' '}({department.area.toLocaleString()} km²)
                </p>
              )}
            </div>
          </div>
        </>
      );
    } else {
      // Level 3: Very specific hints
      return (
        <>
          <div className="text-6xl mb-4 animate-pulse">🎯</div>
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Pista Nivel 3: Ubicación Específica
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-2 border-orange-300">
              <p className="font-bold text-gray-900 text-lg mb-3">{departmentName}</p>

              {geoHints.landmark && (
                <div className="bg-white rounded-lg p-3 mb-3">
                  <p className="text-gray-800">
                    🏛️ <span className="font-semibold">Referencia clave:</span>
                  </p>
                  <p className="text-gray-700 ml-6">{geoHints.landmark}</p>
                </div>
              )}

              {geoHints.size && (
                <p className="text-gray-700 mb-2">
                  🔍 <span className="font-semibold">Forma:</span> {geoHints.size}
                </p>
              )}

              <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                <p className="text-sm text-yellow-800 font-medium">
                  ⚡ Mira cuidadosamente en la región {region}
                </p>
                {attempts > 2 && (
                  <p className="text-xs text-yellow-700 mt-1">
                    Has intentado {attempts} veces. ¡Busca con calma!
                  </p>
                )}
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
          hintLevel === 2 ? 'from-blue-400 to-green-400' :
          'from-red-400 to-orange-400'
        } rounded-3xl blur-2xl opacity-30 animate-pulse`} />

        {/* Card */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Hint cost indicator */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-gray-100 rounded-full">
            <span className="text-xs font-semibold text-gray-600">Costo: {getHintCost()}</span>
          </div>

          {/* Content */}
          <div className="text-center mt-4">
            {getHintContent()}
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            ¡Entendido!
          </button>

          {/* Progress indicator */}
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3].map(level => (
              <div
                key={level}
                className={`w-2 h-2 rounded-full ${
                  level <= hintLevel ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}