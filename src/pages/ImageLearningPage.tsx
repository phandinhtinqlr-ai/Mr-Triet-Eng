import { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { Card, Button, Badge } from '../components/UI';
import { ImageIcon, ChevronRight, ChevronLeft, CheckCircle2, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../components/UI';

export const ImageLearningPage = () => {
  const { state, getAllWords } = useAppState();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const allWords = getAllWords();

  const topics = ['All', ...new Set(allWords.map(w => w.topic))];

  const filteredWords = allWords.filter(w => {
    const matchesTopic = filter === 'All' || w.topic === filter;
    const matchesSearch = w.word.toLowerCase().includes(search.toLowerCase()) || 
                         w.meaningVietnamese.toLowerCase().includes(search.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Image Learning</h1>
          <p className="text-slate-500">Visualize your vocabulary for better retention.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search words..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {topics.map(topic => (
          <button
            key={topic}
            onClick={() => setFilter(topic)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              filter === topic 
                ? "bg-indigo-600 text-white shadow-md" 
                : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"
            )}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredWords.map((word, i) => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-0 overflow-hidden group hover:shadow-xl transition-all duration-300 border-none">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={word.imageUrl} 
                    alt={word.word} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-xs font-medium italic">"{word.exampleEnglish}"</p>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="default" className="bg-white/90 backdrop-blur text-[10px] uppercase tracking-wider">
                      {word.topic}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold text-slate-900">{word.word}</h3>
                    <span className="text-xs text-indigo-500 font-mono">{word.phonetic}</span>
                  </div>
                  <p className="text-slate-600 font-medium">{word.meaningVietnamese}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-1">
                      {state.progress[word.id]?.status === 'mastered' && (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      )}
                      {state.progress[word.id]?.isHardWord && (
                        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-[10px] font-bold">!</div>
                      )}
                    </div>
                    <button className="text-indigo-600 text-xs font-bold hover:underline">View Details</button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No words found</h3>
          <p className="text-slate-500">Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
};
