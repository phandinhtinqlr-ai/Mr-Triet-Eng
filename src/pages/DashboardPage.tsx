import { useAppState } from '../hooks/useAppState';
import { Card, Badge, Button } from '../components/UI';
import { ALL_VOCABULARY } from '../data/vocabulary';
import { Trophy, Flame, BookOpen, CheckCircle2, AlertCircle, ArrowRight, Star, Layers, HelpCircle, History as HistoryIcon, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../components/UI';
import { UserWordProgress } from '../types';

export const DashboardPage = () => {
  const { state, getTodayWords } = useAppState();
  const todayWordIds = getTodayWords();
  
  const progressList = Object.values(state.progress) as UserWordProgress[];
  const masteredCount = progressList.filter(p => p.status === 'mastered').length;
  const learningCount = progressList.filter(p => p.status === 'learning' || p.status === 'review').length;
  const hardWordsCount = progressList.filter(p => p.isHardWord).length;

  const todayProgress = todayWordIds.filter(id => state.progress[id]?.status !== 'new').length;
  const todayPercent = (todayProgress / todayWordIds.length) * 100;

  const stats = [
    { label: 'Mastered', value: masteredCount, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Learning', value: learningCount, icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Hard Words', value: hardWordsCount, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Streak', value: `${state.user?.learningStreak} days`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hello, {state.user?.fullName}! 👋</h1>
          <p className="text-slate-500 mt-1">Today is a great day to learn 10 new words.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success" className="px-4 py-2 text-sm">Level {state.user?.level}</Badge>
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star size={20} fill="currentColor" />
            <span>{state.user?.totalPoints} pts</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="flex items-center gap-4 p-5">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="relative overflow-hidden border-none bg-indigo-600 text-white p-8">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Today's Focus</h2>
              <p className="text-indigo-100 mb-6">You've completed {todayProgress} out of {todayWordIds.length} words for today.</p>
              
              <div className="w-full bg-white/20 h-3 rounded-full mb-8">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${todayPercent}%` }}
                  className="bg-white h-full rounded-full" 
                />
              </div>

              <Link to="/lesson">
                <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-indigo-50 border-none px-8 py-6 text-lg font-bold">
                  Start Today's Lesson
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 hover:border-indigo-200 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                  <Layers size={20} />
                </div>
                <ArrowRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Flashcard Mode</h3>
              <p className="text-sm text-slate-500 mt-1">Quickly review your vocabulary using cards.</p>
            </Card>

            <Card className="p-6 hover:border-indigo-200 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                  <HelpCircle size={20} />
                </div>
                <ArrowRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Quiz Challenge</h3>
              <p className="text-sm text-slate-500 mt-1">Test your knowledge with interactive quizzes.</p>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <HistoryIcon size={18} className="text-indigo-500" />
              Recent Progress
            </h3>
            <div className="space-y-4">
              {progressList.slice(-5).reverse().map((p) => {
                const word = ALL_VOCABULARY.find(w => w.id === p.wordId);
                return (
                  <div key={p.wordId} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="font-semibold text-slate-800">{word?.word}</p>
                      <p className="text-xs text-slate-500">{word?.topic}</p>
                    </div>
                    <Badge variant={p.status === 'mastered' ? 'success' : 'default'}>
                      {p.status}
                    </Badge>
                  </div>
                );
              })}
              {progressList.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4 italic">No progress yet. Start learning!</p>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-slate-900 text-white">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-red-400" />
              Words to Review
            </h3>
            <div className="space-y-3">
              {progressList.filter(p => p.wrongCount > 0).slice(0, 3).map(p => {
                const word = ALL_VOCABULARY.find(w => w.id === p.wordId);
                return (
                  <div key={p.wordId} className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-sm font-medium">{word?.word}</span>
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                      {p.wrongCount} errors
                    </span>
                  </div>
                );
              })}
              <Link to="/review" className="block text-center text-xs text-indigo-400 hover:text-indigo-300 font-medium mt-4">
                View all review list
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-emerald-500" />
              Learning History
            </h3>
            <div className="space-y-4">
              {(state.history || []).slice(-5).reverse().map((activity) => (
                <div key={activity.date} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{new Date(activity.date).toLocaleDateString('vi-VN')}</p>
                    <p className="text-xs text-slate-500">{activity.wordsLearned} words • {activity.quizScore}/{activity.quizTotal} quiz</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">+{activity.pointsEarned} pts</span>
                </div>
              ))}
              {(!state.history || state.history.length === 0) && (
                <p className="text-sm text-slate-400 text-center py-4 italic">No history yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
