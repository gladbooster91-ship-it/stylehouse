import React, { useState } from 'react';
import { Sparkles, Bell, ShieldCheck, Wallet, ChevronRight, X, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FORMAT_UGX } from '../data/products';

export const Header: React.FC = () => {
  const {
    balanceUGX,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setIsRechargeOpen,
    setActiveTab,
    vipLevel
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-xs">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Country Flag */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
          id="header-brand-logo"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-base shadow-xs group-hover:bg-blue-600 transition-colors">
            SH
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-none">
                StyleHouse <span className="text-blue-600">Clothing</span>
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                VIP {vipLevel}
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400 mt-0.5">
              Kampala • Uganda
            </p>
          </div>
        </div>

        {/* Quick Balance & Notification controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsRechargeOpen(true)}
            className="bg-slate-100 hover:bg-slate-200/80 px-3.5 py-1.5 rounded-full flex items-center space-x-2 transition-colors cursor-pointer border border-slate-200/80 text-slate-800"
            id="header-quick-balance-btn"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-slate-800">
              Balance: {FORMAT_UGX(balanceUGX)}
            </span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              +Top up
            </span>
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors relative cursor-pointer"
              id="header-notification-btn"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Modal */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-sm text-slate-900">Uganda Platform Notices</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-slate-500 hover:text-slate-900 font-medium"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs font-medium">
                      No new notices
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                          n.isRead
                            ? 'bg-slate-50 border-slate-100 text-slate-500'
                            : 'bg-blue-50/50 border-blue-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className={n.isRead ? 'text-slate-700' : 'text-blue-600'}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
