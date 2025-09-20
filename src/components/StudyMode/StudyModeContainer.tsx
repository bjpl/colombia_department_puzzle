import React, { useState, useEffect } from 'react';
import { RegionSelector } from './RegionSelector';
import { PracticeArea } from './PracticeArea';
import { FlashCardDeck } from './FlashCardDeck';
import { ProgressTracker } from './ProgressTracker';
import { VocabularyList } from './VocabularyList';

export interface StudySession {
  id: string;
  region: string;
  startTime: Date;
  endTime?: Date;
  score: number;
  totalCards: number;
  correctAnswers: number;
}

export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  region: string;
  difficulty: 'easy' | 'medium' | 'hard';
  examples: string[];
}

interface StudyModeContainerProps {
  className?: string;
}

export const StudyModeContainer: React.FC<StudyModeContainerProps> = ({ className = '' }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [vocabularyData, setVocabularyData] = useState<VocabularyItem[]>([]);
  const [studyMode, setStudyMode] = useState<'practice' | 'flashcards' | 'vocabulary'>('practice');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize study session when region changes
  useEffect(() => {
    if (selectedRegion) {
      const newSession: StudySession = {
        id: `session-${Date.now()}`,
        region: selectedRegion,
        startTime: new Date(),
        score: 0,
        totalCards: 0,
        correctAnswers: 0
      };
      setCurrentSession(newSession);
      loadVocabularyData(selectedRegion);
    }
  }, [selectedRegion]);

  const loadVocabularyData = async (region: string) => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual data fetching
      const mockData: VocabularyItem[] = [
        {
          id: '1',
          word: 'parce',
          meaning: 'amigo, compañero',
          region: region,
          difficulty: 'easy',
          examples: ['¡Ey parce, ¿cómo estás?', 'Mi parce me ayudó con la tarea']
        },
        {
          id: '2',
          word: 'chimba',
          meaning: 'excelente, genial',
          region: region,
          difficulty: 'medium',
          examples: ['Esa película estuvo chimba', 'Qué chimba de carro tienes']
        }
      ];
      setVocabularyData(mockData);
    } catch (error) {
      console.error('Failed to load vocabulary data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSessionProgress = (correct: boolean) => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        totalCards: prev.totalCards + 1,
        correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
        score: Math.round(((prev.correctAnswers + (correct ? 1 : 0)) / (prev.totalCards + 1)) * 100)
      } : null);
    }
  };

  const endSession = () => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        endTime: new Date()
      } : null);
    }
  };

  return (
    <div className={`study-mode-container bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Modo de Estudio de Geografía</h1>
        <p className="text-gray-600">Aprende sobre los departamentos, capitales y regiones de Colombia</p>
      </div>

      {/* Region Selection */}
      <div className="mb-6">
        <RegionSelector
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          className="mb-4"
        />
      </div>

      {/* Progress Tracker */}
      {currentSession && (
        <div className="mb-6">
          <ProgressTracker
            session={currentSession}
            className="mb-4"
          />
        </div>
      )}

      {/* Study Mode Tabs */}
      {selectedRegion && (
        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setStudyMode('practice')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                studyMode === 'practice'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Práctica
            </button>
            <button
              onClick={() => setStudyMode('flashcards')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                studyMode === 'flashcards'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tarjetas
            </button>
            <button
              onClick={() => setStudyMode('vocabulary')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                studyMode === 'vocabulary'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Vocabulario
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-gray-50 rounded-lg p-6 min-h-96">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {studyMode === 'practice' && (
                  <PracticeArea
                    region={selectedRegion}
                    vocabularyData={vocabularyData}
                    onAnswerSubmit={updateSessionProgress}
                    className="h-full"
                  />
                )}
                {studyMode === 'flashcards' && (
                  <FlashCardDeck
                    vocabularyData={vocabularyData}
                    onCardComplete={updateSessionProgress}
                    onDeckComplete={endSession}
                    className="h-full"
                  />
                )}
                {studyMode === 'vocabulary' && (
                  <VocabularyList
                    vocabularyData={vocabularyData}
                    region={selectedRegion}
                    className="h-full"
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Welcome Message */}
      {!selectedRegion && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Selecciona un Departamento para Comenzar</h3>
          <p className="text-gray-500">Elige un departamento colombiano para aprender sobre su capital, región y datos importantes</p>
        </div>
      )}
    </div>
  );
};

export default StudyModeContainer;