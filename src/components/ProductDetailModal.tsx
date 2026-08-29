import React from 'react';
import { X, Sparkles, Clock, TrendingUp, ShieldCheck, ArrowRight, Layers, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FORMAT_UGX, FORMAT_NUMBER } from '../data/products';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForDetail,
    setSelectedProductForDetail,
    openActivationModal
  } = useApp();

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-0 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Image Showcase */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100 shrink-0">
          <img
            src={product.imageUrl}
            alt={product.fullName}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />

          {/* Close button */}
          <button
            onClick={() => setSelectedProductForDetail(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-sm backdrop-blur-md cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on image */}
          <div className="absolute bottom-4 left-4 right-4 space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase">
                {product.durationDays} DAY PRODUCT
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-slate-900 text-[10px] font-bold shadow-xs">
                VIP Tier {product.vipTier}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">
              {product.fullName}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                PRICE
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 block mt-0.5">
                {FORMAT_NUMBER(product.priceUGX)}
              </span>
              <span className="text-[10px] font-bold text-slate-400">UGX</span>
            </div>

            <div className="border-x border-slate-200 px-1">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                DAILY INCOME
              </span>
              <span className="text-base sm:text-lg font-bold text-emerald-600 block mt-0.5">
                +{FORMAT_NUMBER(product.dailyIncomeUGX)}
              </span>
              <span className="text-[10px] font-bold text-emerald-600">UGX/day</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                TOTAL PAYOUT
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 block mt-0.5">
                {FORMAT_NUMBER(product.totalPayoutUGX)}
              </span>
              <span className="text-[10px] font-bold text-slate-400">UGX</span>
            </div>
          </div>

          {/* Description & Haute Couture Story */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Couture Design & Concept
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Fabric Specifications */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Fabric & Material Specifications</span>
            </div>
            <p className="text-xs text-slate-600">
              {product.fabricSpecs}
            </p>
          </div>

          {/* Income Settlement Terms */}
          <div className="space-y-2 text-xs text-slate-600">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Program Settlement Terms
            </h3>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Daily income matures and unlocks every 24 hours.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Immediate 1-click claim directly to your Uganda Shilling wallet.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant automated withdrawals to MTN Mobile Money & Airtel Money.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] text-slate-500 block font-bold uppercase">Product Price</span>
            <span className="text-base font-extrabold text-slate-900">{FORMAT_UGX(product.priceUGX)}</span>
          </div>

          <button
            onClick={() => {
              setSelectedProductForDetail(null);
              openActivationModal(product);
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>Activate Product</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
