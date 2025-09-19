import React, { useEffect, useState } from 'react';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName: string;
  region: string;
  hintType: 'region' | 'letter' | 'location';
}

const regionColors: Record<string, { bg: string; text: string; icon: string }> = {
  'Andina': { bg: 'from-green-400 to-green-600', text: 'text-green-900', icon: '⛰️' },
  'Caribe': { bg: 'from-blue-400 to-blue-600', text: 'text-blue-900', icon: '🏖️' },
  'Pacífica': { bg: 'from-purple-400 to-purple-600', text: 'text-purple-900', icon: '🌊' },
  'Orinoquía': { bg: 'from-yellow-400 to-yellow-600', text: 'text-yellow-900', icon: '🌾' },
  'Amazonía': { bg: 'from-emerald-400 to-emerald-600', text: 'text-emerald-900', icon: '🌳' },
};

export default function HintModal({ isOpen, onClose, departmentName, region, hintType }: HintModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const regionData = regionColors[region] || regionColors['Andina'];

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
    switch (hintType) {
      case 'region':
        return (
          <>
            <div className="text-6xl mb-4 animate-bounce">{regionData.icon}</div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              ¡Pista de Región!
            </h3>
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">{departmentName}</span> está en:
              </p>
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${regionData.bg} text-white font-bold text-lg shadow-lg transform hover:scale-105 transition-transform`}>
                <span className="text-2xl">{regionData.icon}</span>
                Región {region}
              </div>
              <p className="text-sm text-gray-600 italic">
                Busca las áreas de color {region === 'Andina' ? 'verde' :
                               region === 'Caribe' ? 'azul' :
                               region === 'Pacífica' ? 'púrpura' :
                               region === 'Orinoquía' ? 'amarillo' : 'esmeralda'}
              </p>
            </div>
          </>
        );
      case 'letter':
        return (
          <>
            <div className="text-6xl mb-4">✏️</div>
            <h3 className="text-2xl font-bold mb-3">Primera Letra</h3>
            <p className="text-gray-700 mb-3">El departamento empieza con:</p>
            <div className="text-5xl font-bold text-blue-600 animate-pulse">
              {departmentName[0]}
            </div>
          </>
        );
      case 'location':
        return (
          <>
            <div className="text-6xl mb-4">📍</div>
            <h3 className="text-2xl font-bold mb-3">Ubicación Exacta</h3>
            <p className="text-gray-700">¡Mira el área resaltada en el mapa!</p>
          </>
        );
      default:
        return null;
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
        <div className={`absolute -inset-4 bg-gradient-to-r ${regionData.bg} rounded-3xl blur-2xl opacity-30 animate-pulse`} />

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

          {/* Content */}
          <div className="text-center">
            {getHintContent()}
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            ¡Entendido!
          </button>

          {/* Decorative elements */}
          <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-br from-blue-200 to-green-200 rounded-full opacity-50 blur-xl" />
          <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-50 blur-xl" />
        </div>
      </div>
    </div>
  );
}