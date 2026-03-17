import { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { Card, Button, Badge } from '../components/UI';
import { Volume2, RotateCcw, CheckCircle2, XCircle, Trophy, ArrowRight, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../components/UI';

export const QuizPage = () => {
  const { state, updateProgress, recordActivity, getAllWords } = useAppState();
  const navigate = useNavigate();
  const allWords = getAllWords();

  // Create a quiz from words being learned or new words
  const [quizWords] = useState(() => {
    const learningIds = Object.keys(state.progress).filter(id => state.progress[id].status !== 'mastered');
    const pool = learningIds.length >= 5 ? learningIds : allWords.map(w => w.id);
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 5).map(id => allWords.find(w => w.id === id)!).filter(Boolean);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentWord = quizWords[currentIndex];

  const [options] = useState(() => {
    const generateOptions = (word: typeof currentWord) => {
      if (!word) return [];
      const others = allWords.filter(w => w.id !== word.id).sort(() => Math.random() - 0.5).slice(0, 3);
      return [word, ...others].sort(() => Math.random() - 0.5);
    };
    return quizWords.map(w => generateOptions(w));
  });

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption) return;
    
    setSelectedOption(optionId);
    const correct = optionId === currentWord.id;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
    
    updateProgress(currentWord.id, correct);
  };

  const handleNext = () => {
    if (currentIndex < quizWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
      // Record activity: quiz score, points (10 per correct answer)
      recordActivity({ 
        quizScore: score + (isCorrect ? 1 : 0), 
        quizTotal: quizWords.length,
        pointsEarned: (score + (isCorrect ? 1 : 0)) * 10
      });
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (quizWords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Chưa có từ vựng</h1>
        <p className="text-slate-500 max-w-md">Bạn chưa có từ vựng nào để làm bài kiểm tra. Hãy tạo bài học mới nhé!</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-32 h-32 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <Trophy size={64} />
        </motion.div>
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Quiz Completed!</h1>
          <p className="text-slate-500 text-xl mt-2">You scored {score} out of {quizWords.length}</p>
        </div>
        
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-medium">Accuracy</span>
            <span className="text-indigo-600 font-bold">{(score / quizWords.length) * 100}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full" style={{ width: `${(score / quizWords.length) * 100}%` }} />
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()} variant="outline" className="px-8">
            <RotateCcw size={18} className="mr-2" />
            Try Again
          </Button>
          <Button onClick={() => navigate('/')} className="px-8">
            Back to Dashboard
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quiz Challenge</h1>
          <p className="text-slate-500">Question {currentIndex + 1} of {quizWords.length}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-500">Score</p>
          <p className="text-xl font-bold text-indigo-600">{score}</p>
        </div>
      </header>

      <Card className="p-4 sm:p-8 space-y-6 sm:space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="default" className="bg-indigo-50 text-indigo-600 px-3 sm:px-4 py-1 text-[10px] sm:text-xs">What is the meaning of:</Badge>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900">{currentWord.word}</h2>
            <button 
              onClick={() => speak(currentWord.word)}
              className="text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <Volume2 size={24} className="sm:w-8 sm:h-8" />
            </button>
          </div>
          {currentWord.phonetic && <p className="text-sm sm:text-base text-slate-400 font-mono italic">{currentWord.phonetic}</p>}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:gap-3">
          {options[currentIndex].map((option) => {
            const isSelected = selectedOption === option.id;
            const isCorrectOption = option.id === currentWord.id;
            
            let variantClass = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30";
            if (selectedOption) {
              if (isCorrectOption) variantClass = "border-emerald-500 bg-emerald-50 text-emerald-700";
              else if (isSelected) variantClass = "border-red-500 bg-red-50 text-red-700";
              else variantClass = "opacity-50 border-slate-100";
            }

            return (
              <button
                key={option.id}
                disabled={!!selectedOption}
                onClick={() => handleOptionSelect(option.id)}
                className={cn(
                  "w-full p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 text-left font-semibold transition-all flex items-center justify-between text-sm sm:text-base",
                  variantClass
                )}
              >
                <span>{option.meaningVietnamese}</span>
                {selectedOption && isCorrectOption && <CheckCircle2 size={18} className="text-emerald-500 sm:w-5 sm:h-5" />}
                {selectedOption && isSelected && !isCorrectOption && <XCircle size={18} className="text-red-500 sm:w-5 sm:h-5" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-2 sm:pt-4"
            >
              <div className={cn(
                "p-3 sm:p-4 rounded-xl flex items-start gap-3 mb-4 sm:mb-6",
                isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
              )}>
                {isCorrect ? <CheckCircle2 size={18} className="shrink-0 sm:w-5 sm:h-5" /> : <XCircle size={18} className="shrink-0 sm:w-5 sm:h-5" />}
                <div>
                  <p className="font-bold text-sm sm:text-base">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
                  <p className="text-xs sm:text-sm mt-0.5 sm:mt-1">
                    <span className="font-bold">{currentWord.word}</span> means <span className="italic">"{currentWord.meaningVietnamese}"</span>.
                  </p>
                </div>
              </div>
              <Button onClick={handleNext} className="w-full py-4 text-base sm:text-lg">
                {currentIndex < quizWords.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <ChevronRight size={20} className="ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};
