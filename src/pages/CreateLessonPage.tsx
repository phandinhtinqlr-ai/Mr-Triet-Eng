import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';
import { Card, Button } from '../components/UI';
import { Plus, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Word } from '../types';

export const CreateLessonPage = () => {
  const { setTodayCustomWords } = useAppState();
  const navigate = useNavigate();
  
  const [words, setWords] = useState<Array<{ word: string; meaningVietnamese: string }>>(
    Array(10).fill({ word: '', meaningVietnamese: '' })
  );

  const handleAddRow = () => {
    if (words.length < 10) {
      setWords([...words, { word: '', meaningVietnamese: '' }]);
    }
  };

  const handleRemoveRow = (index: number) => {
    if (words.length > 1) {
      setWords(words.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index: number, field: 'word' | 'meaningVietnamese', value: string) => {
    const newWords = [...words];
    newWords[index] = { ...newWords[index], [field]: value };
    setWords(newWords);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty rows
    const validWords = words.filter(w => w.word.trim() !== '' && w.meaningVietnamese.trim() !== '');
    
    if (validWords.length === 0) {
      alert('Vui lòng nhập ít nhất 1 từ vựng!');
      return;
    }

    // Map to Word format
    const customWords: Omit<Word, 'id'>[] = validWords.map(w => ({
      word: w.word.trim(),
      meaningVietnamese: w.meaningVietnamese.trim(),
      phonetic: '', // Optional or auto-generated later
      partOfSpeech: 'unknown',
      exampleEnglish: '',
      exampleVietnamese: '',
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(w.word)}/400/300`,
      topic: 'Custom',
      level: 'A1'
    }));

    setTodayCustomWords(customWords);
    navigate('/lesson');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <BookOpen className="text-indigo-600" />
          Tạo Bài Học Hôm Nay
        </h1>
        <p className="text-slate-500 mt-2">Nhập các từ vựng bạn muốn học hôm nay (tối đa 10 từ).</p>
      </header>

      <Card className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {words.map((word, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100"
              >
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Từ vựng {index + 1} (Tiếng Anh)</label>
                  <input
                    type="text"
                    value={word.word}
                    onChange={(e) => handleChange(index, 'word', e.target.value)}
                    placeholder="VD: Apple"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nghĩa (Tiếng Việt)</label>
                  <input
                    type="text"
                    value={word.meaningVietnamese}
                    onChange={(e) => handleChange(index, 'meaningVietnamese', e.target.value)}
                    placeholder="VD: Quả táo"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                {words.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="mt-6 sm:mt-5 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa từ này"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {words.length < 10 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddRow}
              className="w-full border-dashed border-2 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50"
            >
              <Plus size={20} className="mr-2" />
              Thêm từ vựng ({words.length}/10)
            </Button>
          )}

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <Button type="submit" className="w-full sm:w-auto px-8 py-3 text-base">
              Bắt đầu học ngay
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
