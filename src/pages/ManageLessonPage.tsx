import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';
import { Card, Button } from '../components/UI';
import { Plus, Trash2, ArrowRight, BookOpen, Save } from 'lucide-react';
import { Word } from '../types';

export const ManageLessonPage = () => {
  const { state, updateTodayWord, addTodayWord } = useAppState();
  const navigate = useNavigate();
  
  // Filter today's words
  const todayWords = state.customVocabulary.filter(w => state.todayWords.includes(w.id));
  
  const [words, setWords] = useState<Word[]>(todayWords);

  const handleUpdateWord = (wordId: string, field: keyof Word, value: string) => {
    setWords(words.map(w => w.id === wordId ? { ...w, [field]: value } : w));
    updateTodayWord(wordId, { [field]: value });
  };

  const handleAddNewWord = () => {
    const newWord: Omit<Word, 'id'> = {
      word: '',
      meaningVietnamese: '',
      phonetic: '',
      partOfSpeech: 'unknown',
      exampleEnglish: '',
      exampleVietnamese: '',
      imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300`,
      topic: 'Custom',
      level: 'A1'
    };
    addTodayWord(newWord);
    // Refresh words list
    setWords([...words, { ...newWord, id: `custom-${Date.now()}` }]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <BookOpen className="text-indigo-600" />
          Quản lý bài học hôm nay
        </h1>
      </header>

      <Card className="p-6">
        <div className="space-y-4">
          {words.map((word) => (
            <div key={word.id} className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={word.meaningVietnamese}
                  onChange={(e) => handleUpdateWord(word.id, 'meaningVietnamese', e.target.value)}
                  placeholder="Nghĩa tiếng Việt"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200"
                />
                <input
                  type="text"
                  value={word.word}
                  onChange={(e) => handleUpdateWord(word.id, 'word', e.target.value)}
                  placeholder="Từ tiếng Anh"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={handleAddNewWord} variant="outline" className="flex-1">
            <Plus size={20} className="mr-2" />
            Thêm từ mới
          </Button>
          <Button onClick={() => navigate('/lesson')} className="flex-1">
            <ArrowRight size={20} className="ml-2" />
            Học ngay
          </Button>
        </div>
      </Card>
    </div>
  );
};
