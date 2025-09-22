import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  educationalResources,
  Resource,
  ResourceType,
  ResourceLanguage,
  ResourceLevel,
  resourceTypeLabels,
  languageLabels,
  levelLabels,
  getFeaturedResources,
  searchResources
} from '../data/educationalResources';

/**
 * CONCEPT: Multi-dimensional filtering system
 * WHY: Provides intuitive resource discovery
 * PATTERN: Faceted search with state management
 */

export default function Resources() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<ResourceLanguage | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<ResourceLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [isGridView, setIsGridView] = useState(true);

  // Filter resources based on all criteria
  const filteredResources = useMemo(() => {
    let filtered = [...educationalResources];

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(r => r.type === selectedType);
    }

    // Apply language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(r =>
        r.language === selectedLanguage || r.language === 'both'
      );
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(r =>
        r.level === selectedLevel || r.level === 'all'
      );
    }

    // Apply featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(r => r.featured);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.tags.some(tag => tag.toLowerCase().includes(query)) ||
        r.author?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedType, selectedLanguage, selectedLevel, searchQuery, showFeaturedOnly]);

  // Group resources by type for organized display
  const groupedResources = useMemo(() => {
    const groups: Record<ResourceType, Resource[]> = {} as any;
    filteredResources.forEach(resource => {
      if (!groups[resource.type]) {
        groups[resource.type] = [];
      }
      groups[resource.type].push(resource);
    });
    return groups;
  }, [filteredResources]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedType('all');
    setSelectedLanguage('all');
    setSelectedLevel('all');
    setSearchQuery('');
    setShowFeaturedOnly(false);
  };

  const hasActiveFilters =
    selectedType !== 'all' ||
    selectedLanguage !== 'all' ||
    selectedLevel !== 'all' ||
    searchQuery.trim() !== '' ||
    showFeaturedOnly;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back to Game Button */}
              <button
                onClick={() => navigate('/')}
                className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-xl hover:from-blue-200 hover:to-blue-300 transition-all transform hover:scale-105 active:scale-95 shadow-md"
                title="Volver al juego"
                aria-label="Volver al juego"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  🎓 Recursos Educativos
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Explora materiales para aprender sobre Colombia
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsGridView(!isGridView)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={isGridView ? "Vista de lista" : "Vista de cuadrícula"}
              >
                {isGridView ? '☰' : '⊞'}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0 space-y-6">
            {/* Search */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Buscar</h3>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar recursos..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Featured Filter */}
            <div className="bg-white rounded-lg shadow p-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">⭐ Solo destacados</span>
              </label>
            </div>

            {/* Type Filter */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Tipo de Recurso</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedType === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Todos los tipos
                </button>
                {Object.entries(resourceTypeLabels).map(([type, { label, icon }]) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type as ResourceType)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      selectedType === type
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                    <span className="ml-auto text-xs opacity-60">
                      {educationalResources.filter(r => r.type === type).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Filter */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Idioma</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedLanguage('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedLanguage === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Todos los idiomas
                </button>
                {Object.entries(languageLabels).map(([lang, { label, flag }]) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang as ResourceLanguage)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      selectedLanguage === lang
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>{flag}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Nivel</h3>
              <div className="space-y-2">
                {Object.entries(levelLabels).map(([level, { label, color }]) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level as ResourceLevel)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      selectedLevel === level
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full bg-${color}-500`} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Summary */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                {filteredResources.length} recursos encontrados
                {hasActiveFilters && ' (filtrado)'}
              </p>
            </div>

            {/* Resources Display */}
            {filteredResources.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No se encontraron recursos
                </h3>
                <p className="text-gray-500">
                  Intenta ajustar los filtros o buscar con otros términos
                </p>
              </div>
            ) : selectedType === 'all' ? (
              // Group by type when showing all
              <div className="space-y-8">
                {Object.entries(groupedResources).map(([type, resources]) => (
                  <div key={type}>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span>{resourceTypeLabels[type as ResourceType].icon}</span>
                      <span>{resourceTypeLabels[type as ResourceType].label}</span>
                      <span className="text-sm font-normal text-gray-500">
                        ({resources.length})
                      </span>
                    </h2>
                    <ResourceGrid
                      resources={resources}
                      isGridView={isGridView}
                    />
                  </div>
                ))}
              </div>
            ) : (
              // Show flat list when filtered by type
              <ResourceGrid
                resources={filteredResources}
                isGridView={isGridView}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Resource Grid Component
function ResourceGrid({ resources, isGridView }: {
  resources: Resource[];
  isGridView: boolean;
}) {
  if (isGridView) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map(resource => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {resources.map(resource => (
        <ResourceListItem key={resource.id} resource={resource} />
      ))}
    </div>
  );
}

// Resource Card Component
function ResourceCard({ resource }: { resource: Resource }) {
  const typeInfo = resourceTypeLabels[resource.type];
  const langInfo = languageLabels[resource.language];
  const levelInfo = levelLabels[resource.level];

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl" title={typeInfo.label}>
          {typeInfo.icon}
        </span>
        {resource.featured && (
          <span className="text-yellow-500" title="Recurso destacado">⭐</span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
        {resource.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
        {resource.description}
      </p>

      {/* Metadata */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 bg-gray-100 rounded-full flex items-center gap-1">
          {langInfo.flag} {langInfo.label}
        </span>
        {resource.level !== 'all' && (
          <span className={`px-2 py-1 bg-${levelInfo.color}-100 text-${levelInfo.color}-700 rounded-full`}>
            {levelInfo.label}
          </span>
        )}
        {resource.duration && (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
            ⏱ {resource.duration}
          </span>
        )}
      </div>

      {/* Author and Year */}
      <div className="mt-3 pt-3 border-t text-xs text-gray-500">
        {resource.author && <div>Por: {resource.author}</div>}
        {resource.year && <div>Año: {resource.year}</div>}
      </div>
    </a>
  );
}

// Resource List Item Component
function ResourceListItem({ resource }: { resource: Resource }) {
  const typeInfo = resourceTypeLabels[resource.type];
  const langInfo = languageLabels[resource.language];
  const levelInfo = levelLabels[resource.level];

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 group"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
          {typeInfo.icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {resource.title}
            {resource.featured && (
              <span className="ml-2 text-yellow-500" title="Recurso destacado">⭐</span>
            )}
          </h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {resource.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-2 text-xs">
          <span className="px-2 py-1 bg-gray-100 rounded-full flex items-center gap-1">
            {langInfo.flag} {langInfo.label}
          </span>
          {resource.level !== 'all' && (
            <span className={`px-2 py-1 bg-${levelInfo.color}-100 text-${levelInfo.color}-700 rounded-full`}>
              {levelInfo.label}
            </span>
          )}
          {resource.duration && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
              ⏱ {resource.duration}
            </span>
          )}
          {resource.author && (
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              {resource.author}
            </span>
          )}
          {resource.year && (
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              {resource.year}
            </span>
          )}
        </div>
      </div>

      {/* External link indicator */}
      <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors">
        ↗
      </div>
    </a>
  );
}