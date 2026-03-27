import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';
import { Card, Button } from '../components/UI';
import { Plus, Trash2, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Word } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

export const ManageLessonPage = () => {
  const { state, updateTodayWord, addTodayWord, deleteTodayWord } = useAppState();
  const navigate = useNavigate();
  
  // Filter today's words
  const todayWords = state.customVocabulary.filter(w => state.todayWords.includes(w.id));
  
  const [words, setWords] = useState<Word[]>(todayWords);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUpdateWord = (wordId: string, field: keyof Word, value: string) => {
    setWords(words.map(w => w.id === wordId ? { ...w, [field]: value } : w));
    updateTodayWord(wordId, { [field]: value });
  };

  const handleDeleteWord = (wordId: string) => {
    deleteTodayWord(wordId);
    setWords(words.filter(w => w.id !== wordId));
  };

  const handleAddNewWord = () => {
    const newWord: Omit<Word, 'id'> = {
      word: '',
      meaningVietnamese: '',
      phonetic: '',
      partOfSpeech: 'unknown',
      exampleEnglish: '',
      exampleVietnamese: '',
      imageUrl: '', // Will be generated when the word is updated or AI translates it
      topic: 'Custom',
      level: 'A1'
    };
    addTodayWord(newWord);
    // Refresh words list
    setWords([...words, { ...newWord, id: `custom-${Date.now()}` }]);
  };

  const handleGenerateAI = async () => {
    const missingWords = words.filter(w => w.meaningVietnamese.trim() !== '' && w.word.trim() === '');
    
    if (missingWords.length === 0) {
      alert('Vui lòng thêm "Thêm từ mới" và gõ "Nghĩa tiếng Việt" trước, hoặc xóa các hàng trống!');
      return;
    }

    setIsGenerating(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        alert('Lỗi: Chưa cấu hình API Key.');
        setIsGenerating(false);
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const validVietnameseWords = missingWords.map(w => w.meaningVietnamese.trim());
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate English words for these Vietnamese meanings: ${validVietnameseWords.join(', ')}. Return exactly as JSON array of objects with 'englishWord' field.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                englishWord: { type: Type.STRING },
              },
              required: ["englishWord"],
            },
          },
        },
      });

      const generatedData = JSON.parse(response.text || '[]');
      
      const newWords = [...words];
      let genIndex = 0;
      for (let i = 0; i < newWords.length; i++) {
        if (newWords[i].meaningVietnamese.trim() !== '' && newWords[i].word.trim() === '') {
          if (genIndex < generatedData.length) {
            const engWord = generatedData[genIndex].englishWord;
            const updatedImgUrl = `https://loremflickr.com/400/300/${encodeURIComponent(engWord)},vocabulary/all`;
            
            newWords[i] = { 
              ...newWords[i], 
              word: engWord,
              imageUrl: updatedImgUrl
            };
            // Instantly update the backend store
            updateTodayWord(newWords[i].id, { word: engWord, imageUrl: updatedImgUrl });
            genIndex++;
          }
        }
      }
      setWords(newWords);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Có lỗi khi tạo từ vựng. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
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
                  disabled={isGenerating}
                />
                <input
                  type="text"
                  value={word.word}
                  onChange={(e) => {
                    const newWord = e.target.value;
                    const newImageUrl = `https://loremflickr.com/400/300/${encodeURIComponent(newWord)},vocabulary/all`;
                    handleUpdateWord(word.id, 'word', newWord);
                    handleUpdateWord(word.id, 'imageUrl', newImageUrl);
                  }}
                  placeholder="Từ tiếng Anh"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200"
                  disabled={isGenerating}
                />
                <button
                  onClick={() => handleDeleteWord(word.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa từ này"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button onClick={handleAddNewWord} variant="outline" className="flex-1" disabled={isGenerating}>
            <Plus size={20} className="mr-2" />
            Thêm dòng / từ mới
          </Button>
          <Button 
            onClick={handleGenerateAI} 
            variant="secondary" 
            className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none"
            disabled={isGenerating}
          >
            <Sparkles size={20} className="mr-2" />
            {isGenerating ? "Đang tạo..." : "Tạo từ vựng (AI)"}
          </Button>
          <Button onClick={() => navigate('/lesson')} className="flex-1" disabled={isGenerating}>
            <ArrowRight size={20} className="ml-2" />
            Học ngay
          </Button>
        </div>
      </Card>
    </div>
  );
};
