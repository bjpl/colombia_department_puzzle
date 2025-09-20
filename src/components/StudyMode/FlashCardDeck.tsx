import React, { useState, useEffect } from 'react';
import { VocabularyItem } from './StudyModeContainer';

interface FlashCardDeckProps {
  vocabularyData: VocabularyItem[];
  onCardComplete: (correct: boolean) => void;
  onDeckComplete: () => void;
  className?: string;
}

interface CardState {
  id: string;
  isFlipped: boolean;
  isKnown: boolean | null; // null = not answered, true = known, false = unknown
  attempts: number;
}

export const FlashCardDeck: React.FC<FlashCardDeckProps> = ({
  vocabularyData,
  onCardComplete,
  onDeckComplete,
  className = ''
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardStates, setCardStates] = useState<Map<string, CardState>>(new Map());
  const [deckProgress, setDeckProgress] = useState({ completed: 0, total: 0 });
  const [showResults, setShowResults] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    known: 0,
    unknown: 0,
    totalAttempts: 0
  });

  // Initialize card states
  useEffect(() => {
    if (vocabularyData.length > 0) {
      const initialStates = new Map<string, CardState>();
      vocabularyData.forEach(item => {
        initialStates.set(item.id, {
          id: item.id,
          isFlipped: false,
          isKnown: null,
          attempts: 0
        });
      });
      setCardStates(initialStates);
      setDeckProgress({ completed: 0, total: vocabularyData.length });
      setCurrentCardIndex(0);
      setShowResults(false);
    }
  }, [vocabularyData]);

  const currentCard = vocabularyData[currentCardIndex];
  const currentCardState = currentCard ? cardStates.get(currentCard.id) : null;

  const flipCard = () => {
    if (!currentCard || !currentCardState) return;
    
    setCardStates(prev => {
      const newStates = new Map(prev);
      const state = newStates.get(currentCard.id);
      if (state) {
        newStates.set(currentCard.id, { ...state, isFlipped: !state.isFlipped });
      }
      return newStates;
    });
  };

  const markCard = (known: boolean) => {
    if (!currentCard || !currentCardState) return;

    setCardStates(prev => {
      const newStates = new Map(prev);
      const state = newStates.get(currentCard.id);
      if (state) {
        newStates.set(currentCard.id, {
          ...state,
          isKnown: known,
          attempts: state.attempts + 1,
          isFlipped: false
        });
      }
      return newStates;
    });

    // Update session stats
    setSessionStats(prev => ({
      known: prev.known + (known ? 1 : 0),
      unknown: prev.unknown + (known ? 0 : 1),
      totalAttempts: prev.totalAttempts + 1
    }));

    // Update progress
    const newCompleted = deckProgress.completed + (currentCardState.isKnown === null ? 1 : 0);
    setDeckProgress(prev => ({ ...prev, completed: newCompleted }));

    onCardComplete(known);

    // Move to next card or complete deck
    setTimeout(() => {
      if (currentCardIndex < vocabularyData.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        // Check if all cards are completed
        const allCompleted = Array.from(cardStates.values()).every(state => state.isKnown !== null);
        if (allCompleted || newCompleted >= vocabularyData.length) {
          setShowResults(true);
          onDeckComplete();
        } else {
          // Restart with unknown cards
          const unknownCards = vocabularyData.filter((_, index) => {
            const card = vocabularyData[index];
            const state = cardStates.get(card.id);
            return !state || state.isKnown === false || state.isKnown === null;
          });
          if (unknownCards.length > 0) {
            setCurrentCardIndex(0);
          } else {
            setShowResults(true);
            onDeckComplete();
          }
        }
      }
    }, 600);
  };

  const resetDeck = () => {
    setCurrentCardIndex(0);
    setShowResults(false);
    setSessionStats({ known: 0, unknown: 0, totalAttempts: 0 });
    setCardStates(prev => {
      const newStates = new Map(prev);
      vocabularyData.forEach(item => {
        newStates.set(item.id, {
          id: item.id,
          isFlipped: false,
          isKnown: null,
          attempts: 0
        });
      });
      return newStates;
    });
    setDeckProgress({ completed: 0, total: vocabularyData.length });
  };

  const studyUnknownCards = () => {
    const unknownCards = vocabularyData.filter(item => {
      const state = cardStates.get(item.id);
      return state && state.isKnown === false;
    });
    
    if (unknownCards.length > 0) {
      setCurrentCardIndex(vocabularyData.indexOf(unknownCards[0]));
      setShowResults(false);
    }
  };

  if (vocabularyData.length === 0) {
    return (
      <div className={`flashcard-deck flex items-center justify-center ${className}`}>
        <div className="text-center">
          <p className="text-gray-600 mb-4">No vocabulary data available</p>
          <p className="text-sm text-gray-500">Select a region to load flashcards</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const accuracy = sessionStats.totalAttempts > 0 ? 
      Math.round((sessionStats.known / sessionStats.totalAttempts) * 100) : 0;
    const unknownCardsCount = Array.from(cardStates.values())
      .filter(state => state.isKnown === false).length;

    return (
      <div className={`flashcard-deck ${className}`}>
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Deck Complete!</h2>
              <p className="text-gray-600">Great job studying the flashcards</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{sessionStats.known}</div>
                <div className="text-sm text-gray-600">Known</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{sessionStats.unknown}</div>
                <div className="text-sm text-gray-600">Unknown</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={resetDeck}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Study Again
              </button>
              {unknownCardsCount > 0 && (
                <button
                  onClick={studyUnknownCards}
                  className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                  Review Unknown Cards ({unknownCardsCount})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flashcard-deck ${className}`}>
      <div className="max-w-md mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Card {currentCardIndex + 1} of {vocabularyData.length}</span>
            <span>{deckProgress.completed}/{deckProgress.total} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(deckProgress.completed / deckProgress.total) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="relative h-64 mb-6 perspective-1000">
          <div 
            className={`flashcard-container absolute inset-0 w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
              currentCardState?.isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={flipCard}
          >
            {/* Front of card */}
            <div className="flashcard-face absolute inset-0 w-full h-full bg-white rounded-lg shadow-lg border-2 border-gray-200 backface-hidden flex flex-col justify-center items-center p-6">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Word</div>
                <div className="text-3xl font-bold text-gray-800 mb-4">{currentCard?.word}</div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  currentCard?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentCard?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentCard?.difficulty}
                </div>
              </div>
              <div className="absolute bottom-4 text-xs text-gray-400">Click to flip</div>
            </div>

            {/* Back of card */}
            <div className="flashcard-face absolute inset-0 w-full h-full bg-blue-50 rounded-lg shadow-lg border-2 border-blue-200 backface-hidden rotate-y-180 flex flex-col justify-center items-center p-6">
              <div className="text-center">
                <div className="text-sm text-blue-600 mb-2 uppercase tracking-wide">Meaning</div>
                <div className="text-2xl font-bold text-gray-800 mb-4">{currentCard?.meaning}</div>
                {currentCard?.examples && currentCard.examples.length > 0 && (
                  <div className="text-sm text-gray-600 italic mb-4">
                    "{currentCard.examples[0]}"
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {currentCardState?.isFlipped && (
          <div className="flex space-x-4">
            <button
              onClick={() => markCard(false)}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Don't Know</span>
            </button>
            <button
              onClick={() => markCard(true)}
              className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>I Know This</span>
            </button>
          </div>
        )}

        {/* Hint when card is not flipped */}
        {!currentCardState?.isFlipped && (
          <div className="text-center text-gray-500 text-sm">
            Think about the meaning, then click the card to reveal the answer
          </div>
        )}
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};