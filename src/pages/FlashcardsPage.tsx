import { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { Card, Button, Badge } from '../components/UI';
import { Volume2, RotateCw, CheckCircle2, XCircle, Star, Info, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../components/UI';

export const FlashcardsPage = () => {
  const { state, updateProgress, getAllWords } = useAppState();
  const allWords = getAllWords();
  
  // Get words that are currently being learned or review
  const [cards] = useState(() => {
    const learningIds = Object.keys(state.progress).filter(id => state.progress[id].status !== 'mastered');
    const pool = learningIds.length >= 5 ? learningIds : allWords.map(w => w.id);
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 10).map(id => allWords.find(w => w.id === id)!).filter(Boolean);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentWord = cards[currentIndex];

  const handleNext = (known: boolean) => {
    updateProgress(currentWord.id, known);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setCompleted(true);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Chưa có từ vựng</h1>
        <p className="text-slate-500 max-w-md">Bạn chưa có từ vựng nào để ôn tập. Hãy tạo bài học mới nhé!</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
          <Layers size={48} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Flashcards Done!</h1>
        <p className="text-slate-500 max-w-md">You've reviewed {cards.length} cards. Keep going to master your vocabulary!</p>
        <Button onClick={() => window.location.reload()}>Review More</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Flashcards</h1>
        <p className="text-slate-500">Card {currentIndex + 1} of {cards.length}</p>
      </header>

      <div className="perspective-1000 relative h-[380px] sm:h-[450px] w-full">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          className="w-full h-full relative preserve-3d cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front Side */}
          <Card className="absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-6 sm:p-12 text-center shadow-xl border-none">
            <Badge variant="default" className="absolute top-4 sm:top-6 right-4 sm:right-6 text-[10px] sm:text-xs">{currentWord.topic}</Badge>
            <h2 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-4">{currentWord.word}</h2>
            {currentWord.phonetic && <p className="text-lg sm:text-xl text-indigo-600 font-mono">{currentWord.phonetic}</p>}
            {currentWord.partOfSpeech && currentWord.partOfSpeech !== 'unknown' && <p className="text-xs sm:text-sm text-slate-400 mt-2 italic">{currentWord.partOfSpeech}</p>}
            <div className="mt-8 sm:mt-12 text-slate-300 flex flex-col items-center gap-2">
              <RotateCw size={20} className="sm:w-6 sm:h-6" />
              <p className="text-[10px] font-medium uppercase tracking-widest">Click to flip</p>
            </div>
          </Card>

          {/* Back Side */}
          <Card className="absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-6 sm:p-12 text-center shadow-xl border-none rotate-y-180 bg-indigo-50">
            <div className="space-y-4 sm:space-y-6 w-full">
              <div>
                <p className="text-[10px] sm:text-sm font-bold text-indigo-400 uppercase tracking-widest mb-1 sm:mb-2">Meaning</p>
                <h3 className="text-2xl sm:text-4xl font-bold text-slate-900">{currentWord.meaningVietnamese}</h3>
              </div>
              
              {(currentWord.exampleEnglish || currentWord.exampleVietnamese) && (
                <div className="pt-4 sm:pt-6 border-t border-indigo-100">
                  <p className="text-[10px] sm:text-sm font-bold text-indigo-400 uppercase tracking-widest mb-1 sm:mb-2">Example</p>
                  {currentWord.exampleEnglish && <p className="text-sm sm:text-lg font-medium text-slate-800 leading-relaxed italic">"{currentWord.exampleEnglish}"</p>}
                  {currentWord.exampleVietnamese && <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">{currentWord.exampleVietnamese}</p>}
                </div>
              )}

              <div className="flex justify-center gap-4 pt-2 sm:pt-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); speak(currentWord.word); }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-sm hover:bg-indigo-50 transition-colors"
                >
                  <Volume2 size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button 
          onClick={() => handleNext(false)} 
          variant="outline" 
          className="flex-1 py-4 sm:py-6 border-red-200 text-red-600 hover:bg-red-50"
        >
          <XCircle size={18} className="mr-2" />
          Still Learning
        </Button>
        <Button 
          onClick={() => handleNext(true)} 
          className="flex-1 py-4 sm:py-6 bg-emerald-600 hover:bg-emerald-700"
        >
          <CheckCircle2 size={18} className="mr-2" />
          I Know This
        </Button>
      </div>

      <p className="text-center text-sm text-slate-400">
        Tip: Try to recall the meaning before flipping the card!
      </p>
    </div>
  );
};
