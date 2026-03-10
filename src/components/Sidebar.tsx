import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Layers, Image as ImageIcon, HelpCircle, History, User, LogOut, Sparkles } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { cn } from '../components/UI';

export const Sidebar = () => {
  const { logout, state } = useAppState();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Daily Lesson', path: '/lesson' },
    { icon: Layers, label: 'Flashcards', path: '/flashcards' },
    { icon: ImageIcon, label: 'Image Learning', path: '/images' },
    { icon: HelpCircle, label: 'Quiz', path: '/quiz' },
    { icon: History, label: 'Review', path: '/review' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 h-screen sticky top-0 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
          <Sparkles size={24} />
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">TrietEng</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium',
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
              MT
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-800 truncate">{state.user?.fullName}</p>
              <p className="text-xs text-slate-500">Level {state.user?.level}</p>
            </div>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-3/4 rounded-full" />
          </div>
          <p className="text-[10px] text-slate-400 mt-1 text-right">75% to B2</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};
