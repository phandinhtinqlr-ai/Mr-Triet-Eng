import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppState } from './hooks/useAppState';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DailyLessonPage } from './pages/DailyLessonPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { ImageLearningPage } from './pages/ImageLearningPage';
import { QuizPage } from './pages/QuizPage';
import { ReviewPage } from './pages/ReviewPage';
import { ProfilePage } from './pages/ProfilePage';
import { CreateLessonPage } from './pages/CreateLessonPage';
import { ManageLessonPage } from './pages/ManageLessonPage';
import { motion, AnimatePresence } from 'motion/react';

// Inner app that has access to router context (useLocation)
const AppInner = () => {
  const { state } = useAppState();
  const location = useLocation();

  if (!state.user) {
    // Allow login page without sidebar
    return (
      <Routes location={location} key={location.pathname}>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 pb-24 lg:pb-8 overflow-y-auto max-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/create-lesson" element={<CreateLessonPage />} />
              <Route path="/manage-lesson" element={<ManageLessonPage />} />
              <Route path="/lesson" element={<DailyLessonPage />} />
              <Route path="/flashcards" element={<FlashcardsPage />} />
              <Route path="/images" element={<ImageLearningPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/review" element={<ReviewPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
