import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Zap,
  Users,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Gift,
  HelpCircle,
  PhoneCall,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CLOTHING_PRODUCTS, FORMAT_UGX, FORMAT_NUMBER } from '../data/products';

export const HomeTab: React.FC = () => {
  const {
    balanceUGX,
    totalEarnedUGX,
    activatedProducts,
    setActiveTab,
    setIsRechargeOpen,
    setIsWithdrawOpen,
    claimAllAvailableIncomes,
    fastForwardTime,
    currentTimeOffsetHours,
    openActivationModal,
    setSelectedProductForDetail
  } = useApp();

  // Calculate ready to claim
  const nowTime = Date.now() + currentTimeOffsetHours * 60 * 60 * 1000;
  const readyProducts = activatedProducts.filter(
    p => p.status === 'active' && nowTime >= new Date(p.nextClaimAvailableAt).getTime()
  );
  const claimableTotalUGX = readyProducts.reduce((sum, p) => sum + p.dailyIncomeUGX, 0);

  // Live Ugandan payout ticker simulation
  const [tickerIndex, setTickerIndex] = useState(0);
  const livePayouts = [
    { phone: '0772 ••• 419 (Kampala)', action: 'withdrew 250,000 UGX to MTN MoMo', time: '1m ago' },
    { phone: '0701 ••• 882 (Jinja)', action: 'activated StyleHouse Golden Empress', time: '3m ago' },
    { phone: '0784 ••• 203 (Entebbe)', action: 'claimed 50,000 UGX daily income', time: '4m ago' },
    { phone: '0756 ••• 912 (Mbarara)', action: 'withdrew 100,000 UGX to Airtel Money', time: '6m ago' },
    { phone: '0774 ••• 331 (Gulu)', action: 'activated HD Crimson Frost Queen', time: '8m ago' },
    { phone: '0704 ••• 665 (Mukono)', action: 'received 30,000 UGX Team Referral Bonus', time: '10m ago' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % livePayouts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const [claimToast, setClaimToast] = useState<string | null>(null);

  const handleClaimAll = () => {
    const res = claimAllAvailableIncomes();
    if (res.claimedCount > 0) {
      setClaimToast(`Claimed +${FORMAT_UGX(res.totalAmount)} from ${res.claimedCount} products!`);
      setTimeout(() => setClaimToast(null), 4000);
    }
  };

  const hotProducts = CLOTHING_PRODUCTS.filter(p => p.popular).slice(0, 3);

  return (
    <div className="pb-28 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      {/* Toast Notification */}
      {claimToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 animate-in fade-in zoom-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{claimToast}</span>
        </div>
      )}

      {/* Official Marquee / Uganda Live Ticker */}
      <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-xs overflow-hidden shadow-xs">
        <div className="flex items-center gap-1.5 shrink-0 bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-md text-[11px]">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> LIVE UGANDA
        </div>
        <div className="text-slate-600 truncate">
          <span className="font-semibold text-slate-900">{livePayouts[tickerIndex].phone}</span>{' '}
          <span className="text-blue-600 font-medium">{livePayouts[tickerIndex].action}</span>
          <span className="text-slate-400 ml-1.5 text-[10px]">({livePayouts[tickerIndex].time})</span>
        </div>
      </div>

      {/* Hero Banner Showcase */}
      <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
              <span>StyleHouse Uganda</span>
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              <span>45-Day Yield Program</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Wear Luxury. <br className="hidden sm:inline" />
              <span className="text-blue-600 font-light">
                Earn Daily Income in UGX.
              </span>
            </h1>

            <p className="text-sm text-slate-500 leading-relaxed font-normal">
              Activate prestigious haute couture lines and receive automatic daily earnings settled to your wallet every 24 hours. Fast cashout to MTN Mobile Money & Airtel Money.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('products')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsRechargeOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer border border-slate-200/80"
              >
                Recharge UGX
              </button>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="w-full md:w-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3 shrink-0">
            <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Program Yield Guarantee</span>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-black text-slate-900 font-sans">45 DAYS</div>
              <div className="text-xs text-slate-400">Fixed Income Duration</div>
            </div>
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-4 text-xs">
              <span className="text-slate-400">Settlement:</span>
              <span className="font-bold text-emerald-600">Every 24 Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Claim Action Banner (Shows when 24h timer has passed on any product) */}
      {readyProducts.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
                  Income Ready
                </span>
                <span className="text-xs text-emerald-800 font-semibold">
                  {readyProducts.length} Product{readyProducts.length > 1 ? 's' : ''} Ready
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                Claim +{FORMAT_UGX(claimableTotalUGX)} Daily Earnings
              </h3>
            </div>
          </div>

          <button
            onClick={handleClaimAll}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Claim All Now</span>
          </button>
        </div>
      )}

      {/* Main Wallet Summary Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Wallet className="w-4 h-4 text-blue-600" />
            <span>StyleHouse UGX Wallet</span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
            MTN & Airtel Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Current Balance */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Available Balance
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {FORMAT_NUMBER(balanceUGX)}
              <span className="text-xs font-bold text-blue-600 ml-1.5">UGX</span>
            </div>
          </div>

          {/* Total Earned */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-emerald-600 uppercase font-bold tracking-wider">
              Total Income Earned
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              +{FORMAT_NUMBER(totalEarnedUGX)}
              <span className="text-xs font-bold text-emerald-600 ml-1.5">UGX</span>
            </div>
          </div>

          {/* Active Products */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Activated Clothing Lines
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {activatedProducts.filter(p => p.status === 'active').length}
              <span className="text-xs font-normal text-slate-400 ml-1.5">active items</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <button
            onClick={() => setIsRechargeOpen(true)}
            className="p-3 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100/80 text-blue-600 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4 text-blue-600" />
            <span>Recharge UGX</span>
          </button>

          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span>Withdraw UGX</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4 text-blue-600" />
            <span>My Active Items</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>Invite & Earn</span>
          </button>
        </div>
      </div>

      {/* Demo Tool: Fast Forward 24 Hours */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
              Demonstration Tool
            </span>
            <span className="text-xs text-slate-400">
              Offset: +{currentTimeOffsetHours}h simulated
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Advance clock by 24 hours to test daily income collection & countdown cycles instantly.
          </p>
        </div>

        <button
          onClick={() => fastForwardTime(24)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Fast-Forward 24H</span>
        </button>
      </div>

      {/* Featured Hot Picks from the Catalog */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-blue-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Trending Clothing Drops
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All (8)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {hotProducts.map(product => (
            <div
              key={product.id}
              onClick={() => setSelectedProductForDetail(product)}
              className="bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-4 space-y-3 cursor-pointer group transition-all shadow-xs hover:shadow-md"
            >
              <div className="relative h-40 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={product.imageUrl}
                  alt={product.fullName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold uppercase">
                  45 DAYS
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {product.fullName}
                </h3>
                <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Price</span>
                    <span className="font-bold text-slate-900">{FORMAT_NUMBER(product.priceUGX)} UGX</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-600 block uppercase">Daily</span>
                    <span className="font-bold text-emerald-600">+{FORMAT_NUMBER(product.dailyIncomeUGX)} UGX</span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openActivationModal(product);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Activate Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Uganda Official Payment Trust Badges */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Official Uganda Telecommunications Payment Integrations</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          StyleHouse Uganda operates seamless automated mobile money settlements. Top-up and cash out 24/7 directly to MTN Mobile Money (*165#) and Airtel Money (*185#) accounts with instant SMS confirmation.
        </p>
        <div className="flex flex-wrap gap-3 pt-1 text-xs text-slate-700 font-medium">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="font-semibold">MTN MoMo Uganda</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-semibold">Airtel Money Uganda</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold">Kampala Financial Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};
