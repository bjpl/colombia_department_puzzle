import React from 'react';

export interface Region {
  id: string;
  name: string;
  flag: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (regionId: string) => void;
  className?: string;
}

const AVAILABLE_REGIONS: Region[] = [
  {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    description: 'British English vocabulary and expressions',
    difficulty: 'beginner'
  },
  {
    id: 'aus',
    name: 'Australia',
    flag: '🇦🇺',
    description: 'Australian English slang and terminology',
    difficulty: 'intermediate'
  },
  {
    id: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    description: 'American English vocabulary and idioms',
    difficulty: 'beginner'
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    description: 'Canadian English expressions and terms',
    difficulty: 'intermediate'
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    flag: '🇿🇦',
    description: 'South African English vocabulary',
    difficulty: 'advanced'
  },
  {
    id: 'new-zealand',
    name: 'New Zealand',
    flag: '🇳🇿',
    description: 'New Zealand English expressions',
    difficulty: 'intermediate'
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'text-green-600 bg-green-100';
    case 'intermediate':
      return 'text-yellow-600 bg-yellow-100';
    case 'advanced':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegion,
  onRegionChange,
  className = ''
}) => {
  const selectedRegionData = AVAILABLE_REGIONS.find(r => r.id === selectedRegion);

  return (
    <div className={`region-selector ${className}`}>
      <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select Study Region
      </label>
      
      <div className="relative">
        <select
          id="region-select"
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          className="block w-full px-4 py-3 pr-10 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm appearance-none cursor-pointer transition-all duration-200 hover:border-gray-400"
        >
          <option value="">Choose a region...</option>
          {AVAILABLE_REGIONS.map((region) => (
            <option key={region.id} value={region.id}>
              {region.flag} {region.name}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Region Details */}
      {selectedRegionData && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                <span className="text-2xl mr-2">{selectedRegionData.flag}</span>
                {selectedRegionData.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{selectedRegionData.description}</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500">Difficulty:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getDifficultyColor(selectedRegionData.difficulty)}`}>
                  {selectedRegionData.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Region Grid (Alternative Display) */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Select</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AVAILABLE_REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => onRegionChange(region.id)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                selectedRegion === region.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-1">
                <span className="text-xl mr-2">{region.flag}</span>
                <span className="font-medium text-sm text-gray-800 truncate">{region.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getDifficultyColor(region.difficulty)}`}>
                  {region.difficulty}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};