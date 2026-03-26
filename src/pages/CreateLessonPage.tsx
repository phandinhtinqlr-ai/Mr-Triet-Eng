import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';
import { Card, Button } from '../components/UI';
import { Plus, Trash2, ArrowRight, BookOpen, Sparkles, RotateCcw } from 'lucide-react';
import { Word } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

export const CreateLessonPage = () => {
  const { setTodayCustomWords } = useAppState();
  const navigate = useNavigate();
  
  const [words, setWords] = useState<Array<{ word: string; meaningVietnamese: string; isGenerating?: boolean }>>(
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

  const handleReset = () => {
    console.log('Reset clicked');
    setWords(Array(10).fill({ word: '', meaningVietnamese: '' }));
  };

  const handleChange = (index: number, field: 'word' | 'meaningVietnamese', value: string) => {
    const newWords = [...words];
    newWords[index] = { ...newWords[index], [field]: value };
    setWords(newWords);
  };

  const handleGenerate = async () => {
    console.log('Generate clicked');
    const validVietnameseWords = words.filter(w => w.meaningVietnamese.trim() !== '').map(w => w.meaningVietnamese.trim());
    
    if (validVietnameseWords.length === 0) {
      alert('Vui lòng nhập ít nhất 1 nghĩa tiếng Việt!');
      return;
    }

    setWords(words.map(w => ({ ...w, isGenerating: w.meaningVietnamese.trim() !== '' })));

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      console.log('API Key exists:', !!apiKey);
      if (!apiKey) {
        alert('Lỗi: Chưa cấu hình API Key.');
        setWords(words.map(w => ({ ...w, isGenerating: false })));
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Generate English words and image prompts for these Vietnamese meanings: ${validVietnameseWords.join(', ')}. Return as JSON array of objects with 'englishWord' and 'imagePrompt' fields.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                englishWord: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
              },
              required: ["englishWord", "imagePrompt"],
            },
          },
        },
      });

      const generatedData = JSON.parse(response.text || '[]');
      
      const newWords = [...words];
      let genIndex = 0;
      for (let i = 0; i < newWords.length; i++) {
        if (newWords[i].meaningVietnamese.trim() !== '') {
          if (genIndex < generatedData.length) {
            newWords[i] = { 
              ...newWords[i], 
              word: generatedData[genIndex].englishWord,
              isGenerating: false 
            };
            genIndex++;
          }
        }
      }
      setWords(newWords);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Có lỗi khi tạo từ vựng. Vui lòng thử lại.');
      setWords(words.map(w => ({ ...w, isGenerating: false })));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validWords = words.filter(w => w.word.trim() !== '' && w.meaningVietnamese.trim() !== '');
    
    if (validWords.length === 0) {
      alert('Vui lòng nhập/tạo ít nhất 1 từ vựng!');
      return;
    }

    const customWords: Omit<Word, 'id'>[] = validWords.map(w => ({
      word: w.word.trim(),
      meaningVietnamese: w.meaningVietnamese.trim(),
      phonetic: '', 
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
        <p className="text-slate-500 mt-2">Nhập nghĩa tiếng Việt, mình sẽ giúp bạn tạo từ tiếng Anh và hình ảnh.</p>
      </header>

      <Card className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {words.map((word, index) => (
              <div 
                key={index}
                className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100"
              >
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nghĩa (Tiếng Việt)</label>
                  <input
                    type="text"
                    value={word.meaningVietnamese}
                    onChange={(e) => handleChange(index, 'meaningVietnamese', e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                    placeholder="VD: Quả táo"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Từ vựng {index + 1} (Tiếng Anh)</label>
                  <input
                    type="text"
                    value={word.word}
                    onChange={(e) => handleChange(index, 'word', e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                    placeholder={word.isGenerating ? "Đang tạo..." : "VD: Apple"}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    disabled={word.isGenerating}
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
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <Button type="submit" className="w-full sm:w-auto px-8 py-3 text-base">
              Bắt đầu học ngay
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </form>
        
        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerate}
            className="flex-1"
          >
            <Sparkles size={20} className="mr-2" />
            Tạo từ vựng
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <RotateCcw size={20} className="mr-2" />
            Reset
          </Button>
        </div>
      </Card>
    </div>
  );
};
