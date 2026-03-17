import { useAppState } from '../hooks/useAppState';
import { Card, Button, Badge } from '../components/UI';
import { User, Settings, Bell, Shield, Target, Calendar, Award, Edit2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../components/UI';
import { UserWordProgress } from '../types';

export const ProfilePage = () => {
  const { state } = useAppState();
  const user = state.user!;

  const progressList = Object.values(state.progress) as UserWordProgress[];
  const masteredCount = progressList.filter(p => p.status === 'mastered').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      <header className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold border-4 border-indigo-50">
            MT
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50">
            <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{user.fullName}</h1>
            <Badge variant="success" className="w-fit mx-auto md:mx-0 text-[10px] sm:text-xs">Premium Member</Badge>
          </div>
          <p className="text-sm sm:text-base text-slate-500 font-medium">@{user.username} • Level {user.level} Learner</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 sm:mt-6">
            <div className="flex items-center gap-2 text-slate-600">
              <Award size={16} className="text-amber-500 sm:w-[18px] sm:h-[18px]" />
              <span className="text-xs sm:text-sm font-bold">{user.totalPoints} Points</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar size={16} className="text-indigo-500 sm:w-[18px] sm:h-[18px]" />
              <span className="text-xs sm:text-sm font-bold">Joined March 2026</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none text-xs sm:text-sm">Share</Button>
          <Button className="flex-1 sm:flex-none text-xs sm:text-sm">Edit Profile</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <section className="grid grid-cols-3 gap-3 sm:gap-4">
            <Card className="p-3 sm:p-6 text-center">
              <p className="text-xl sm:text-3xl font-bold text-indigo-600">{user.learningStreak}</p>
              <p className="text-[10px] sm:text-sm text-slate-500 font-medium mt-1">Streak</p>
            </Card>
            <Card className="p-3 sm:p-6 text-center">
              <p className="text-xl sm:text-3xl font-bold text-emerald-600">{progressList.length}</p>
              <p className="text-[10px] sm:text-sm text-slate-500 font-medium mt-1">Learned</p>
            </Card>
            <Card className="p-3 sm:p-6 text-center">
              <p className="text-xl sm:text-3xl font-bold text-amber-600">{masteredCount}</p>
              <p className="text-[10px] sm:text-sm text-slate-500 font-medium mt-1">Mastered</p>
            </Card>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Target size={18} className="text-indigo-500 sm:w-5 sm:h-5" />
              Learning Goals
            </h2>
            <Card className="p-4 sm:p-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-700">Daily Goal</span>
                  <span className="text-xs sm:text-sm font-bold text-indigo-600">{user.dailyGoal} words/day</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Preferred Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {user.preferredTopics.map(topic => (
                      <div key={topic}>
                        <Badge variant="default" className="text-[10px] sm:text-xs">{topic}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Study Time</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-700">Morning (8:00 AM - 9:00 AM)</p>
                </div>
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award size={18} className="text-amber-500 sm:w-5 sm:h-5" />
              Achievements
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {['🌅', '📚', '🔥', '👑'].map((icon, idx) => {
                const labels = ['Early Bird', 'Word Master', '7 Day Streak', 'Quiz King'];
                const colors = ['bg-orange-50', 'bg-indigo-50', 'bg-red-50', 'bg-amber-50'];
                return (
                  <div key={labels[idx]}>
                    <Card className={cn('p-3 sm:p-4 text-center border-none shadow-none', colors[idx])}>
                      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{icon}</div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-800">{labels[idx]}</p>
                    </Card>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-50">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">Account Settings</h3>
            </div>
            <div className="p-1 sm:p-2">
              {[
                { label: 'Notifications', icon: Bell, color: 'text-blue-500' },
                { label: 'Privacy & Security', icon: Shield, color: 'text-emerald-500' },
                { label: 'App Preferences', icon: Settings, color: 'text-slate-500' },
                { label: 'Help & Support', icon: User, color: 'text-indigo-500' },
              ].map(item => (
                <button key={item.label} className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className={cn(item.color, "sm:w-[18px] sm:h-[18px]")} />
                    <span className="text-xs sm:text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 sm:w-4 sm:h-4" />
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-red-50 border-red-100">
            <h3 className="font-bold text-red-900 mb-1 sm:mb-2 text-sm sm:text-base">Danger Zone</h3>
            <p className="text-[10px] sm:text-xs text-red-700 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="danger" className="w-full py-2 text-[10px] sm:text-xs">Delete Account</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
