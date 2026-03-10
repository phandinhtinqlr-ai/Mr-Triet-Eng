import { useState, useEffect } from 'react';
import { AppState, UserProfile, UserWordProgress, DailyActivity } from '../types';
import { DEFAULT_USER } from '../data/user';
import { ALL_VOCABULARY } from '../data/vocabulary';

const STORAGE_KEY = 'triet_english_app_state';

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      user: null, // Start with null for login
      progress: {},
      lastLessonDate: null,
      todayWords: [],
      history: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

    // Deterministic selection based on date string
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const shuffled = [...ALL_VOCABULARY].sort((a, b) => {
      const hashA = (parseInt(a.id) * seed) % 100;
      const hashB = (parseInt(b.id) * seed) % 100;
      return hashA - hashB;
    });

    const selectedIds = shuffled.slice(0, 10).map(w => w.id);
    
    setState(prev => ({
      ...prev,
      lastLessonDate: today,
      todayWords: selectedIds
    }));

    return selectedIds;
  };

  return {
    state,
    login,
    logout,
    updateProgress,
    getTodayWords,
    recordActivity
  };
}
