import React from 'react';
import { Home, Sparkles, Users, User, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, activatedProducts, currentTimeOffsetHours } = useApp();

  // Check if any product is ready to claim right now
  const nowTime = Date.now() + currentTimeOffsetHours * 60 * 60 * 1000;
  const readyToClaimCount = activatedProducts.filter(
    p => p.status === 'active' && nowTime >= new Date(p.nextClaimAvailableAt).getTime()
  ).length;

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home
    },
    {
      id: 'products',
      label: 'Products',
      icon: Sparkles
    },
    {
      id: 'team',
      label: 'Team',
      icon: Users
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      badge: readyToClaimCount > 0 ? readyToClaimCount : undefined
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 max-w-lg mx-auto sm:max-w-2xl md:max-w-4xl shadow-xs">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              id={`nav-tab-${item.id}`}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 relative cursor-pointer group ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                }`}>
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] rounded-full bg-blue-600 text-white text-[9px] font-extrabold flex items-center justify-center px-1 shadow-sm animate-bounce">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] uppercase font-bold mt-1 tracking-wider ${
                isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
