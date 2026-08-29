import React, { useState } from 'react';
import {
  User,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  ShieldCheck,
  Zap,
  ExternalLink,
  ChevronRight,
  ListFilter,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FORMAT_UGX, FORMAT_NUMBER } from '../data/products';

export const AccountTab: React.FC = () => {
  const {
    balanceUGX,
    totalEarnedUGX,
    totalRechargedUGX,
    totalWithdrawnUGX,
    userPhone,
    vipLevel,
    activatedProducts,
    transactions,
    setIsRechargeOpen,
    setIsWithdrawOpen,
    claimDailyIncome,
    fastForwardTime,
    currentTimeOffsetHours,
    setActiveTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'products' | 'transactions' | 'support'>('products');
  const [txFilter, setTxFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'daily_income' | 'activation'>('all');
  const [claimToast, setClaimToast] = useState<string | null>(null);

  const nowTime = Date.now() + currentTimeOffsetHours * 60 * 60 * 1000;

  const handleClaim = (instanceId: string) => {
    const res = claimDailyIncome(instanceId);
    setClaimToast(res.message);
    setTimeout(() => setClaimToast(null), 3500);
  };

  const filteredTransactions = transactions.filter(t => {
    if (txFilter === 'all') return true;
    return t.type === txFilter;
  });

  return (
    <div className="pb-28 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      {/* Toast Alert */}
      {claimToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 animate-in fade-in zoom-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{claimToast}</span>
        </div>
      )}

      {/* User Profile Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <User className="w-6 h-6 text-slate-700" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-slate-900">
                  Uganda VIP Member
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 font-bold text-[10px] uppercase border border-blue-100">
                  VIP {vipLevel}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono">{userPhone}</span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">Verified Account</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsRechargeOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Deposit UGX</span>
            </button>
            <button
              onClick={() => setIsWithdrawOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200/80"
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span>Withdraw UGX</span>
            </button>
          </div>
        </div>

        {/* 4 Financial Balances Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Available Balance
            </span>
            <span className="text-lg font-extrabold text-slate-900 mt-0.5 block">
              {FORMAT_NUMBER(balanceUGX)}
            </span>
            <span className="text-[10px] text-blue-600 font-bold">UGX</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">
              Total Earnings
            </span>
            <span className="text-lg font-extrabold text-emerald-600 mt-0.5 block">
              +{FORMAT_NUMBER(totalEarnedUGX)}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">UGX</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Total Recharged
            </span>
            <span className="text-lg font-extrabold text-slate-700 mt-0.5 block">
              {FORMAT_NUMBER(totalRechargedUGX)}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">UGX</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Total Withdrawn
            </span>
            <span className="text-lg font-extrabold text-slate-700 mt-0.5 block">
              {FORMAT_NUMBER(totalWithdrawnUGX)}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">UGX</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs: (My Products, Transactions, Support) */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveSubTab('products')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'products'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>My Activated Clothing ({activatedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('transactions')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'transactions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Transaction History ({transactions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('support')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'support'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & Support</span>
        </button>
      </div>

      {/* 1. ACTIVATED PRODUCTS VIEW */}
      {activeSubTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-base text-slate-900">
                Active 45-Day Income Cycles
              </h2>
              <p className="text-xs text-slate-500">
                Income is credited directly to your balance once every 24 hours.
              </p>
            </div>

            {/* Fast forward 24h button */}
            <button
              onClick={() => fastForwardTime(24)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Fast forward 24 hours to claim income in demo"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Simulate +24H</span>
            </button>
          </div>

          {activatedProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <p className="text-slate-500 text-sm">You haven't activated any clothing lines yet.</p>
              <button
                onClick={() => setActiveTab('products')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Browse Clothing Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activatedProducts.map(item => {
                const nextAvailableTime = new Date(item.nextClaimAvailableAt).getTime();
                const isReady = nowTime >= nextAvailableTime;
                const remainingMs = Math.max(0, nextAvailableTime - nowTime);
                const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
                const remainingMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

                const progressPct = Math.min(100, Math.round((item.daysCompleted / item.durationDays) * 100));

                return (
                  <div
                    key={item.instanceId}
                    className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all space-y-4 shadow-xs ${
                      isReady && item.status === 'active'
                        ? 'border-emerald-500/80 bg-emerald-50/20'
                        : 'border-slate-200/80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-100"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base">
                              {item.productName}
                            </h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.status === 'completed'
                                ? 'bg-slate-100 text-slate-500'
                                : 'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>
                              {item.status === 'completed' ? 'Completed' : 'Running'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Cost: {FORMAT_UGX(item.priceUGX)} • Daily Income:{' '}
                            <span className="text-emerald-600 font-semibold">
                              +{FORMAT_UGX(item.dailyIncomeUGX)}/day
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Claim or Timer Button */}
                      {item.status === 'completed' ? (
                        <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold">
                          All 45 Days Settled
                        </div>
                      ) : isReady ? (
                        <button
                          onClick={() => handleClaim(item.instanceId)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Claim +{FORMAT_UGX(item.dailyIncomeUGX)}</span>
                        </button>
                      ) : (
                        <div className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>Next in: {remainingHours}h {remainingMins}m</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar for 45 Days */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          Cycle Progress: <strong className="text-slate-900">{item.daysCompleted} / {item.durationDays} Days</strong>
                        </span>
                        <span className="text-slate-900 font-bold">
                          {FORMAT_NUMBER(item.totalEarnedUGX)} / {FORMAT_NUMBER(item.totalPayoutUGX)} UGX
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. TRANSACTIONS VIEW */}
      {activeSubTab === 'transactions' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {(['all', 'deposit', 'withdrawal', 'daily_income', 'activation'] as const).map(f => (
              <button
                key={f}
                onClick={() => setTxFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                  txFilter === f
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-xs">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No transactions recorded in this category.
              </div>
            ) : (
              filteredTransactions.map(tx => (
                <div key={tx.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        tx.type === 'deposit' ? 'bg-blue-50 text-blue-600' :
                        tx.type === 'withdrawal' ? 'bg-slate-100 text-slate-700' :
                        tx.type === 'daily_income' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {tx.type.replace('_', ' ')}
                      </span>
                      <span className="font-semibold text-slate-900">{tx.description}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {tx.date} • Ref: {tx.referenceNo} {tx.provider && `• ${tx.provider}`}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`font-mono font-extrabold text-sm ${
                      tx.type === 'deposit' || tx.type === 'daily_income' || tx.type === 'team_commission'
                        ? 'text-emerald-600'
                        : 'text-slate-700'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'daily_income' || tx.type === 'team_commission' ? '+' : '-'}
                      {FORMAT_UGX(tx.amountUGX)}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-semibold uppercase">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. SUPPORT & UGANDA OFFICE VIEW */}
      {activeSubTab === 'support' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>StyleHouse Uganda Official Support Desk</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Our Kampala headquarters customer service team is available 24/7 to resolve deposit confirmations, withdrawals, and VIP account upgrades.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-blue-600">
                  WhatsApp Support (Uganda)
                </span>
                <p className="text-sm font-bold text-slate-900">+256 700 882 100</p>
                <p className="text-[11px] text-slate-400">Instant VIP response</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-600">
                  Kampala Office Location
                </span>
                <p className="text-sm font-bold text-slate-900">Plot 42 Kampala Road</p>
                <p className="text-[11px] text-slate-400">Kampala Central, Uganda</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
