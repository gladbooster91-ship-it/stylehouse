import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { ProductsTab } from './components/ProductsTab';
import { TeamTab } from './components/TeamTab';
import { AccountTab } from './components/AccountTab';
import { RechargeModal } from './components/RechargeModal';
import { WithdrawModal } from './components/WithdrawModal';
import { ActivateModal } from './components/ActivateModal';
import { ProductDetailModal } from './components/ProductDetailModal';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Top Header */}
      <Header />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'team' && <TeamTab />}
        {activeTab === 'account' && <AccountTab />}
      </main>

      {/* Persistent Bottom Navigation for Mobile & Web */}
      <BottomNav />

      {/* Interactive Global Modals */}
      <RechargeModal />
      <WithdrawModal />
      <ActivateModal />
      <ProductDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
