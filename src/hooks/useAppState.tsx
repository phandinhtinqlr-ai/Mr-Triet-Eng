import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AppState, UserProfile, UserWordProgress, DailyActivity, Word } from '../types';
import { DEFAULT_USER } from '../data/user';
import { ALL_VOCABULARY } from '../data/vocabulary';

const STORAGE_KEY = 'triet_english_app_state';

export function useAppProviderState() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          customVocabulary: parsed.customVocabulary || []
        };
      }
    } catch (error) {
      console.warn('localStorage is not available', error);
    }
    return {
      user: null, // Start with null for login
      progress: {},
      lastLessonDate: null,
      todayWords: [],
      history: [],
      customVocabulary: []
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('localStorage is not available', error);
    }
  }, [state]);

  const recordActivity = (activity: Partial<DailyActivity>) => {
    const today = new Date().toISOString().split('T')[0];
    
    setState(prev => {
      const history = [...(prev.history || [])];
      const existingIndex = history.findIndex(h => h.date === today);
      
      if (existingIndex >= 0) {
        history[existingIndex] = {
          ...history[existingIndex],
          wordsLearned: (history[existingIndex].wordsLearned || 0) + (activity.wordsLearned || 0),
          quizScore: (history[existingIndex].quizScore || 0) + (activity.quizScore || 0),
          quizTotal: (history[existingIndex].quizTotal || 0) + (activity.quizTotal || 0),
          pointsEarned: (history[existingIndex].pointsEarned || 0) + (activity.pointsEarned || 0),
        };
      } else {
        history.push({
          date: today,
          wordsLearned: activity.wordsLearned || 0,
          quizScore: activity.quizScore || 0,
          quizTotal: activity.quizTotal || 0,
          pointsEarned: activity.pointsEarned || 0,
        });
      }

      // Update user points too
      const newUser = prev.user ? {
        ...prev.user,
        totalPoints: prev.user.totalPoints + (activity.pointsEarned || 0)
      } : null;

      return { ...prev, history, user: newUser };
    });
  };

  const login = (username: string, password: string): boolean => {
    if (username === 'triet' && password === '123456') {
      setState(prev => ({ ...prev, user: DEFAULT_USER }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, user: null }));
  };

  const updateProgress = (wordId: string, isCorrect: boolean, isHard: boolean = false) => {
    setState(prev => {
      const currentProgress = prev.progress[wordId] || {
        wordId,
        status: 'new',
        wrongCount: 0,
        correctCount: 0,
        isHardWord: false
      };

      const newCorrectCount = isCorrect ? currentProgress.correctCount + 1 : currentProgress.correctCount;
      const newWrongCount = !isCorrect ? currentProgress.wrongCount + 1 : currentProgress.wrongCount;
      
      let newStatus = currentProgress.status;
      if (newCorrectCount >= 5) newStatus = 'mastered';
      else if (newCorrectCount >= 2) newStatus = 'review';
      else if (newCorrectCount >= 1) newStatus = 'learning';

      return {
        ...prev,
        progress: {
          ...prev.progress,
          [wordId]: {
            ...currentProgress,
            correctCount: newCorrectCount,
            wrongCount: newWrongCount,
            status: newStatus,
            isHardWord: isHard || currentProgress.isHardWord,
            lastReviewed: new Date().toISOString()
          }
        }
      };
    });
  };

  const getTodayWords = () => {
    const today = new Date().toDateString();
    if (state.lastLessonDate === today && state.todayWords.length > 0) {
      return state.todayWords;
    }
    return [];
  };

  const setTodayCustomWords = (words: Omit<Word, 'id'>[]) => {
    const today = new Date().toDateString();
    const newWords: Word[] = words.map((w, idx) => ({
      ...w,
      id: `custom-${Date.now()}-${idx}`
    }));

    setState(prev => ({
      ...prev,
      lastLessonDate: today,
      todayWords: newWords.map(w => w.id),
      customVocabulary: [...(prev.customVocabulary || []), ...newWords]
    }));
  };

  const addTodayWord = (word: Omit<Word, 'id'>) => {
    const newWord: Word = {
      ...word,
      id: `custom-${Date.now()}`
    };

    setState(prev => ({
      ...prev,
      todayWords: [...prev.todayWords, newWord.id],
      customVocabulary: [...(prev.customVocabulary || []), newWord]
    }));
  };

  const updateTodayWord = (wordId: string, updatedWord: Partial<Word>) => {
    setState(prev => ({
      ...prev,
      customVocabulary: prev.customVocabulary.map(w => 
        w.id === wordId ? { ...w, ...updatedWord } : w
      )
    }));
  };

  const deleteTodayWord = (wordId: string) => {
    setState(prev => ({
      ...prev,
      todayWords: prev.todayWords.filter(id => id !== wordId),
      customVocabulary: prev.customVocabulary.filter(w => w.id !== wordId)
    }));
  };

  const getAllWords = () => {
    return [...ALL_VOCABULARY, ...(state.customVocabulary || [])];
  };

  return {
    state,
    login,
    logout,
    updateProgress,
    getTodayWords,
    setTodayCustomWords,
    addTodayWord,
    updateTodayWord,
    deleteTodayWord,
    getAllWords,
    recordActivity
  };
}

const AppStateContext = createContext<ReturnType<typeof useAppProviderState> | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const value = useAppProviderState();
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
};

