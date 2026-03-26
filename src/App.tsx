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

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAppState();
  const location = useLocation();

  if (!state.user) {
    return <Navigate to="/login" replace />;
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
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
        <Route path="/create-lesson" element={<ProtectedLayout><CreateLessonPage /></ProtectedLayout>} />
        <Route path="/manage-lesson" element={<ProtectedLayout><ManageLessonPage /></ProtectedLayout>} />
        <Route path="/lesson" element={<ProtectedLayout><DailyLessonPage /></ProtectedLayout>} />
        <Route path="/flashcards" element={<ProtectedLayout><FlashcardsPage /></ProtectedLayout>} />
        <Route path="/images" element={<ProtectedLayout><ImageLearningPage /></ProtectedLayout>} />
        <Route path="/quiz" element={<ProtectedLayout><QuizPage /></ProtectedLayout>} />
        <Route path="/review" element={<ProtectedLayout><ReviewPage /></ProtectedLayout>} />
        <Route path="/profile" element={<ProtectedLayout><ProfilePage /></ProtectedLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
