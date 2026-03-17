import { useAppState } from '../hooks/useAppState';
import { Card, Button, Badge } from '../components/UI';
import { History as HistoryIcon, AlertCircle, CheckCircle2, Clock, ArrowRight, Filter, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../components/UI';
import { UserWordProgress } from '../types';

export const ReviewPage = () => {
  const { state, getAllWords } = useAppState();
  const allWords = getAllWords();
  
  const progressList = Object.values(state.progress) as UserWordProgress[];
  const reviewWords = progressList
    .filter(p => p.status === 'learning' || p.status === 'review' || p.isHardWord)
    .map(p => ({
      ...p,
      data: allWords.find(w => w.id === p.wordId)!
    }))
    .filter(p => p.data)
    .sort((a, b) => (b.wrongCount || 0) - (a.wrongCount || 0));

  const masteredWords = progressList
    .filter(p => p.status === 'mastered')
    .map(p => ({
      ...p,
      data: allWords.find(w => w.id === p.wordId)!
    }))
    .filter(p => p.data);

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Review Center</h1>
          <p className="text-sm sm:text-base text-slate-500">Focus on what matters most to your progress.</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Link to="/quiz" className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full text-xs sm:text-sm">
              <RefreshCw size={16} className="mr-1.5 sm:mr-2" />
              Quick Quiz
            </Button>
          </Link>
          <Link to="/flashcards" className="flex-1 sm:flex-none">
            <Button className="w-full text-xs sm:text-sm">
              <ArrowRight size={16} className="mr-1.5 sm:mr-2" />
              Review All
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500 sm:w-5 sm:h-5" />
                Needs Attention ({reviewWords.length})
              </h2>
              <button className="text-xs sm:text-sm text-indigo-600 font-bold hover:underline">Clear all</button>
            </div>
            
            <div className="space-y-3">
              {reviewWords.map((word) => (
                <motion.div
                  key={word.wordId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="p-3 sm:p-4 flex items-center justify-between hover:border-red-100 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center font-bold text-base sm:text-lg">
                        {word.data.word[0]}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">{word.data.word}</h3>
                        <p className="text-[10px] sm:text-xs text-slate-500 truncate">{word.data.meaningVietnamese}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-6">
                      <div className="text-right hidden md:block">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Errors</p>
                        <p className="text-sm font-bold text-red-500">{word.wrongCount}</p>
                      </div>
                      <Badge variant={word.isHardWord ? 'error' : 'warning'} className="text-[10px] sm:text-xs px-2 py-0.5">
                        {word.isHardWord ? 'Hard' : word.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-10 sm:h-10">
                        <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
              {reviewWords.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <CheckCircle2 size={40} className="mx-auto text-emerald-400 mb-2" />
                  <p className="text-slate-500 font-medium">No words need urgent review. Great job!</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-500" />
              Mastered Words ({masteredWords.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {masteredWords.slice(0, 6).map(word => (
                <div key={word.wordId}>
                  <Card className="p-4 text-center hover:bg-emerald-50/30 transition-colors">
                    <p className="font-bold text-slate-900">{word.data.word}</p>
                    <p className="text-xs text-slate-500 mt-1">{word.data.meaningVietnamese}</p>
                  </Card>
                </div>
              ))}
            </div>
            {masteredWords.length > 6 && (
              <button className="w-full mt-4 py-3 text-sm font-bold text-slate-500 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                View all {masteredWords.length} mastered words
              </button>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-indigo-600 text-white">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock size={20} />
              Spaced Repetition
            </h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              Our algorithm schedules reviews based on your performance. Words you find difficult appear more often.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span>Next review session</span>
                <span className="font-bold">Tomorrow, 8:00 AM</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Words scheduled</span>
                <span className="font-bold">12 words</span>
              </div>
            </div>
            <Button variant="secondary" className="w-full mt-8 bg-white text-indigo-600 hover:bg-indigo-50 border-none">
              Set Reminder
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Filter size={18} className="text-slate-400" />
              Filter by Topic
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Work', 'Travel', 'Life', 'General', 'Society'].map(topic => (
                <button key={topic} className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                  {topic}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
