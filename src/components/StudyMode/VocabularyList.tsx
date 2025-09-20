import React, { useState, useMemo } from 'react';
import { VocabularyItem } from './StudyModeContainer';

interface VocabularyListProps {
  vocabularyData: VocabularyItem[];
  region: string;
  className?: string;
}

type SortOption = 'word' | 'difficulty' | 'meaning';
type FilterOption = 'all' | 'easy' | 'medium' | 'hard';

export const VocabularyList: React.FC<VocabularyListProps> = ({
  vocabularyData,
  region,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('word');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort vocabulary data
  const filteredAndSortedData = useMemo(() => {
    let filtered = vocabularyData.filter(item => {
      const matchesSearch = 
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.examples.some(example => example.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterBy === 'all' || item.difficulty === filterBy;
      
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'word':
          return a.word.localeCompare(b.word);
        case 'meaning':
          return a.meaning.localeCompare(b.meaning);
        case 'difficulty':
          const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });
  }, [vocabularyData, searchTerm, sortBy, filterBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'hard':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
    });
  };

  const difficultyStats = useMemo(() => {
    const stats = vocabularyData.reduce((acc, item) => {
      acc[item.difficulty] = (acc[item.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  }, [vocabularyData]);

  return (
    <div className={`vocabulary-list ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Vocabulario de {region.charAt(0).toUpperCase() + region.slice(1)}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{vocabularyData.length}</div>
            <div className="text-sm text-gray-600">Total Palabras</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{difficultyStats.easy || 0}</div>
            <div className="text-sm text-gray-600">Fácil</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{difficultyStats.medium || 0}</div>
            <div className="text-sm text-gray-600">Medio</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{difficultyStats.hard || 0}</div>
            <div className="text-sm text-gray-600">Difícil</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar palabras, significados o ejemplos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filtrar:</label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los Niveles</option>
              <option value="easy">Fácil</option>
              <option value="medium">Medio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="word">Palabra</option>
              <option value="meaning">Significado</option>
              <option value="difficulty">Dificultad</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {(searchTerm || filterBy !== 'all') && (
        <div className="mb-4 text-sm text-gray-600">
          Mostrando {filteredAndSortedData.length} de {vocabularyData.length} palabras
          {searchTerm && <span> que coinciden con "{searchTerm}"</span>}
          {filterBy !== 'all' && <span> filtradas por dificultad {filterBy}</span>}
        </div>
      )}

      {/* Vocabulary Cards */}
      {filteredAndSortedData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.453.692-6.258 1.882C5.274 16.645 5.866 17 6.5 17h11c.634 0 1.226-.355.758-.118z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No se Encontró Vocabulario</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta ajustar los términos de búsqueda' : 'No hay datos de vocabulario disponibles para este departamento'}
          </p>
        </div>
      ) : (
        <div className={`vocabulary-grid ${
          viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'
        }`}>
          {filteredAndSortedData.map((item) => {
            const isExpanded = expandedCard === item.id;
            
            return (
              <div
                key={item.id}
                className={`vocabulary-card bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
                  viewMode === 'list' ? 'p-4' : 'p-6'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.word}</h3>
                    <p className="text-gray-600">{item.meaning}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(item.difficulty)}`}>
                      {getDifficultyIcon(item.difficulty)} {item.difficulty}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`${item.word}: ${item.meaning}`)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copiar al portapapeles"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Examples (always show first one, expand for more) */}
                {item.examples.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 italic mb-2">
                      "{item.examples[0]}"
                    </div>
                    
                    {item.examples.length > 1 && (
                      <>
                        {isExpanded && (
                          <div className="space-y-2">
                            {item.examples.slice(1).map((example, index) => (
                              <div key={index} className="text-sm text-gray-600 italic">
                                "{example}"
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <button
                          onClick={() => toggleCard(item.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                          {isExpanded ? 'Mostrar Menos' : `Mostrar ${item.examples.length - 1} Ejemplos Más`}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Departamental: {region}</span>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                      Practicar
                    </button>
                    <button className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors">
                      Tarjeta
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};