import { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { ALL_VOCABULARY } from '../data/vocabulary';
import { Card, Button, Badge } from '../components/UI';
import { Volume2, ChevronRight, ChevronLeft, CheckCircle2, XCircle, Star, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../components/UI';

export const DailyLessonPage = () => {
  const { state, getTodayWords, updateProgress, recordActivity } = useAppState();
  const todayWordIds = getTodayWords();
  const todayWords = todayWordIds.map(id => ALL_VOCABULARY.find(w => w.id === id)!);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentWord = todayWords[currentIndex];
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentIndex < todayWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowDetails(false);
    } else {
      setCompleted(true);
      // Record activity: 10 words learned, 50 points
      recordActivity({ wordsLearned: 10, pointsEarned: 50 });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowDetails(false);
    }
  };

  const markAsLearned = () => {
    updateProgress(currentWord.id, true);
    handleNext();
  };

  const markAsHard = () => {
    updateProgress(currentWord.id, false, true);
    handleNext();
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-900">Great job, Mr. Triết!</h1>
        <p className="text-slate-500 max-w-md">
          You've completed today's 10 words. Your vocabulary is growing stronger every day.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/')} variant="outline">Back to Dashboard</Button>
          <Button onClick={() => navigate('/quiz')}>Take a Quiz</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daily Lesson</h1>
          <p className="text-slate-500">Word {currentIndex + 1} of {todayWords.length}</p>
        </div>
        <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-500" 
            style={{ width: `${((currentIndex + 1) / todayWords.length) * 100}%` }}
          />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <Card className="p-0 overflow-hidden shadow-xl border-none">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto bg-slate-100">
                <img 
                  src={currentWord.imageUrl} 
                  alt={currentWord.word} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="warning" className="bg-white/90 backdrop-blur shadow-sm">
                    {currentWord.topic}
                  </Badge>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-4xl font-bold text-slate-900">{currentWord.word}</h2>
                    <p className="text-indigo-600 font-mono mt-1">{currentWord.phonetic}</p>
                    <p className="text-sm text-slate-400 italic mt-1">{currentWord.partOfSpeech}</p>
                  </div>
                  <button 
                    onClick={() => speak(currentWord.word)}
                    className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors"
                  >
                    <Volume2 size={24} />
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-2xl font-semibold text-slate-800">{currentWord.meaningVietnamese}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Example</p>
                    <p className="text-slate-800 font-medium leading-relaxed">"{currentWord.exampleEnglish}"</p>
                    <p className="text-slate-500 text-sm mt-2 italic">{currentWord.exampleVietnamese}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={markAsHard} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                    <XCircle size={18} className="mr-2" />
                    Hard Word
                  </Button>
                  <Button onClick={markAsLearned} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle2 size={18} className="mr-2" />
                    Got it!
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Button 
              onClick={handlePrevious} 
              disabled={currentIndex === 0}
              variant="ghost"
              className="text-slate-400"
            >
              <ChevronLeft size={20} className="mr-2" />
              Previous
            </Button>
            <div className="flex gap-2">
              {todayWords.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === currentIndex ? "w-6 bg-indigo-600" : "bg-slate-200"
                  )} 
                />
              ))}
            </div>
            <Button 
              onClick={handleNext}
              variant="ghost"
              className="text-slate-400"
            >
              Next
              <ChevronRight size={20} className="ml-2" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      <Card className="bg-amber-50 border-amber-100 p-6">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h4 className="font-bold text-amber-900">Learning Tip</h4>
            <p className="text-sm text-amber-800 mt-1 leading-relaxed">
              Try to use <span className="font-bold">"{currentWord.word}"</span> in a sentence about your own life. 
              Personalizing examples helps your brain create stronger neural connections!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
