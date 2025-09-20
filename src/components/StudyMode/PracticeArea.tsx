import React, { useState, useEffect, useRef } from 'react';
import { VocabularyItem } from './StudyModeContainer';

interface PracticeAreaProps {
  region: string;
  vocabularyData: VocabularyItem[];
  onAnswerSubmit: (correct: boolean) => void;
  className?: string;
}

interface PracticeQuestion {
  id: string;
  type: 'definition' | 'usage' | 'multiple-choice';
  question: string;
  correctAnswer: string;
  options?: string[];
  hint?: string;
  vocabularyItem: VocabularyItem;
}

export const PracticeArea: React.FC<PracticeAreaProps> = ({
  region,
  vocabularyData,
  onAnswerSubmit,
  className = ''
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{
    show: boolean;
    correct: boolean;
    message: string;
  }>({ show: false, correct: false, message: '' });
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate practice questions from vocabulary data
  const generateQuestion = (): PracticeQuestion | null => {
    if (vocabularyData.length === 0) return null;

    const availableItems = vocabularyData.filter(item => !questionHistory.includes(item.id));
    const item = availableItems.length > 0 
      ? availableItems[Math.floor(Math.random() * availableItems.length)]
      : vocabularyData[Math.floor(Math.random() * vocabularyData.length)];

    const questionTypes: PracticeQuestion['type'][] = ['definition', 'usage', 'multiple-choice'];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    switch (type) {
      case 'definition':
        return {
          id: `def-${item.id}-${Date.now()}`,
          type: 'definition',
          question: `What does "${item.word}" mean in ${region}?`,
          correctAnswer: item.meaning.toLowerCase(),
          hint: `Think about regional vocabulary differences`,
          vocabularyItem: item
        };

      case 'usage':
        const example = item.examples[Math.floor(Math.random() * item.examples.length)];
        const blankedExample = example.replace(new RegExp(item.word, 'gi'), '_____');
        return {
          id: `usage-${item.id}-${Date.now()}`,
          type: 'usage',
          question: `Fill in the blank: ${blankedExample}`,
          correctAnswer: item.word.toLowerCase(),
          hint: `This word means "${item.meaning}"`,
          vocabularyItem: item
        };

      case 'multiple-choice':
        const otherItems = vocabularyData.filter(v => v.id !== item.id).slice(0, 3);
        const options = [item.meaning, ...otherItems.map(v => v.meaning)]
          .sort(() => Math.random() - 0.5);
        return {
          id: `mc-${item.id}-${Date.now()}`,
          type: 'multiple-choice',
          question: `What is the meaning of "${item.word}" in ${region}?`,
          correctAnswer: item.meaning.toLowerCase(),
          options,
          vocabularyItem: item
        };

      default:
        return null;
    }
  };

  // Load new question
  const loadNewQuestion = () => {
    const question = generateQuestion();
    if (question) {
      setCurrentQuestion(question);
      setUserAnswer('');
      setFeedback({ show: false, correct: false, message: '' });
      setQuestionHistory(prev => [...prev.slice(-10), question.vocabularyItem.id]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Real-time validation
  useEffect(() => {
    if (!currentQuestion || !userAnswer.trim()) {
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    const timeoutId = setTimeout(() => {
      const answer = userAnswer.toLowerCase().trim();
      const correct = currentQuestion.correctAnswer.toLowerCase().includes(answer) || 
                     answer.includes(currentQuestion.correctAnswer.toLowerCase());
      
      if (answer.length >= 3) {
        setIsValidating(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [userAnswer, currentQuestion]);

  // Submit answer
  const handleSubmit = (submittedAnswer?: string) => {
    if (!currentQuestion) return;

    const answer = (submittedAnswer || userAnswer).toLowerCase().trim();
    const correctAnswer = currentQuestion.correctAnswer.toLowerCase();
    
    const isCorrect = answer === correctAnswer || 
                     correctAnswer.includes(answer) || 
                     answer.includes(correctAnswer);

    setFeedback({
      show: true,
      correct: isCorrect,
      message: isCorrect 
        ? '✅ Correct! Well done!' 
        : `❌ Not quite. The correct answer is "${currentQuestion.correctAnswer}"`
    });

    onAnswerSubmit(isCorrect);

    // Auto-advance to next question after 2 seconds
    setTimeout(() => {
      loadNewQuestion();
    }, 2000);
  };

  // Initialize with first question
  useEffect(() => {
    if (vocabularyData.length > 0 && !currentQuestion) {
      loadNewQuestion();
    }
  }, [vocabularyData]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !feedback.show) {
      handleSubmit();
    }
  };

  if (!currentQuestion) {
    return (
      <div className={`practice-area flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading practice questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`practice-area ${className}`}>
      <div className="max-w-2xl mx-auto">
        {/* Question Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
              {currentQuestion.type.replace('-', ' ')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentQuestion.vocabularyItem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              currentQuestion.vocabularyItem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentQuestion.vocabularyItem.difficulty}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{currentQuestion.question}</h2>
        </div>

        {/* Answer Input */}
        {currentQuestion.type === 'multiple-choice' ? (
          <div className="space-y-3 mb-6">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSubmit(option)}
                disabled={feedback.show}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                  feedback.show
                    ? option.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : userAnswer.toLowerCase() === option.toLowerCase() && !feedback.correct
                      ? 'border-red-500 bg-red-50 text-red-800'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-6">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={feedback.show}
                placeholder="Type your answer here..."
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  feedback.show
                    ? feedback.correct
                      ? 'border-green-500 bg-green-50 focus:ring-green-500'
                      : 'border-red-500 bg-red-50 focus:ring-red-500'
                    : isValidating
                    ? 'border-yellow-500 focus:ring-yellow-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              {isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                </div>
              )}
            </div>
            
            {!feedback.show && (
              <button
                onClick={() => handleSubmit()}
                disabled={!userAnswer.trim()}
                className="mt-3 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Submit Answer
              </button>
            )}
          </div>
        )}

        {/* Feedback */}
        {feedback.show && (
          <div className={`p-4 rounded-lg mb-6 ${
            feedback.correct ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
          }`}>
            <p className="font-medium mb-2">{feedback.message}</p>
            {!feedback.correct && currentQuestion.hint && (
              <p className="text-sm text-gray-600">💡 Hint: {currentQuestion.hint}</p>
            )}
            {feedback.correct && currentQuestion.vocabularyItem.examples.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Example usage:</p>
                <p className="text-sm text-gray-600 italic">
                  "{currentQuestion.vocabularyItem.examples[0]}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={loadNewQuestion}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            Skip Question
          </button>
          
          {currentQuestion.hint && !feedback.show && (
            <button
              onClick={() => setFeedback({
                show: true,
                correct: false,
                message: `💡 Hint: ${currentQuestion.hint}`
              })}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Show Hint
            </button>
          )}
        </div>
      </div>
    </div>
  );
};