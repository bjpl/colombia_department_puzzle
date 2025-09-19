import React, { useState } from 'react';
import { Department, colombiaDepartments } from '../data/colombiaDepartments';
import { normalizeId } from '../utils/nameNormalizer';

interface StudyModeProps {
  onClose: () => void;
  onStartGame: () => void;
}

export default function StudyMode({ onClose, onStartGame }: StudyModeProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [studiedDepartments, setStudiedDepartments] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const handleDepartmentClick = (dept: Department) => {
    setSelectedDepartment(dept);
    setStudiedDepartments(prev => new Set([...prev, dept.id]));
  };

  const getRegionColor = (region: string) => {
    const colors: Record<string, string> = {
      'Andina': 'bg-green-100 border-green-400',
      'Caribe': 'bg-blue-100 border-blue-400',
      'Pacífica': 'bg-purple-100 border-purple-400',
      'Orinoquía': 'bg-yellow-100 border-yellow-400',
      'Amazonía': 'bg-emerald-100 border-emerald-400',
      'Insular': 'bg-cyan-100 border-cyan-400',
    };
    return colors[region] || 'bg-gray-100 border-gray-400';
  };

  // Group departments by region
  const departmentsByRegion = colombiaDepartments.reduce((acc, dept) => {
    if (!acc[dept.region]) acc[dept.region] = [];
    acc[dept.region].push(dept);
    return acc;
  }, {} as Record<string, Department[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">📚 Modo de Estudio</h2>
              <p className="text-sm opacity-90">
                Haz clic en cada departamento para aprender sobre él
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                {viewMode === 'grid' ? '🗺️ Vista Mapa' : '📋 Vista Lista'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                ✕ Cerrar
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${(studiedDepartments.size / colombiaDepartments.length) * 100}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-center">
            {studiedDepartments.size} de {colombiaDepartments.length} departamentos estudiados
          </p>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Department List */}
          <div className="w-2/3 overflow-y-auto p-4 border-r">
            {viewMode === 'grid' ? (
              <div className="space-y-4">
                {Object.entries(departmentsByRegion).map(([region, depts]) => (
                  <div key={region}>
                    <h3 className="font-bold text-lg mb-2 text-gray-700">
                      {region} ({depts.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {depts.map(dept => (
                        <button
                          key={dept.id}
                          onClick={() => handleDepartmentClick(dept)}
                          className={`
                            p-3 rounded-lg border-2 transition-all text-left
                            ${getRegionColor(dept.region)}
                            ${studiedDepartments.has(dept.id) ? 'opacity-70' : ''}
                            ${selectedDepartment?.id === dept.id ? 'ring-2 ring-blue-500 scale-105' : ''}
                            hover:scale-105 hover:shadow-lg
                          `}
                        >
                          <div className="font-semibold text-sm">{dept.name}</div>
                          <div className="text-xs text-gray-600">Capital: {dept.capital}</div>
                          {studiedDepartments.has(dept.id) && (
                            <div className="text-xs text-green-600 mt-1">✓ Estudiado</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">Vista de mapa en desarrollo</p>
                  <p className="text-sm text-gray-400">
                    Por ahora, usa la vista de lista para estudiar
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Department Details */}
          <div className="w-1/3 p-4 bg-gray-50">
            {selectedDepartment ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${getRegionColor(selectedDepartment.region)}`}>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedDepartment.name}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedDepartment.region}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-700 mb-2">📍 Información Básica</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Capital:</dt>
                      <dd className="font-semibold">{selectedDepartment.capital}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Área:</dt>
                      <dd className="font-semibold">
                        {selectedDepartment.area.toLocaleString()} km²
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Población:</dt>
                      <dd className="font-semibold">
                        {selectedDepartment.population.toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-700 mb-2">💡 Dato Curioso</h4>
                  <p className="text-sm text-gray-600 italic">
                    {selectedDepartment.trivia}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-700 mb-2">📚 Para Recordar</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Primera letra: <span className="font-bold">{selectedDepartment.name[0]}</span></li>
                    <li>• Número de letras: {selectedDepartment.name.length}</li>
                    <li>• Región: {selectedDepartment.region}</li>
                    {selectedDepartment.name.includes(' ') && (
                      <li>• Nombre compuesto</li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">📖</div>
                  <p className="text-lg font-semibold">Selecciona un departamento</p>
                  <p className="text-sm mt-2">
                    Haz clic en cualquier departamento para ver su información
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-3 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            💡 Tip: Estudia todos los departamentos antes de jugar para mejores resultados
          </div>
          <button
            onClick={onStartGame}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
          >
            🎮 Empezar Juego
          </button>
        </div>
      </div>
    </div>
  );
}