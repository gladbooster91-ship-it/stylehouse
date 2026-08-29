import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Zap, Wallet, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FORMAT_UGX, FORMAT_NUMBER } from '../data/products';

export const ActivateModal: React.FC = () => {
  const {
    selectedProductForActivation,
    setSelectedProductForActivation,
    balanceUGX,
    activateProduct,
    setIsRechargeOpen
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'Internal Balance' | 'MTN Mobile Money' | 'Airtel Money'>('Internal Balance');
  const [phoneNumber, setPhoneNumber] = useState('0774892104');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!selectedProductForActivation) return null;

  const product = selectedProductForActivation;
  const hasEnoughBalance = balanceUGX >= product.priceUGX;

  const handleConfirmActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const res = activateProduct(product.id, paymentMethod);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        setSuccessMessage(null);
        setSelectedProductForActivation(null);
      }, 2200);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
              StyleHouse Uganda Activation
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Activate Product Line
            </h2>
          </div>
          <button
            onClick={() => setSelectedProductForActivation(null)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMessage ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Activation Confirmed!</h3>
            <p className="text-xs text-slate-500">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleConfirmActivation} className="space-y-4">
            {/* Product Summary Header */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={product.imageUrl}
                alt={product.fullName}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase">
                  {product.durationDays} DAY PRODUCT
                </span>
                <h3 className="font-bold text-sm text-slate-900 leading-tight">
                  {product.fullName}
                </h3>
                <div className="text-xs text-slate-500 font-semibold">
                  Price: <span className="text-slate-900 font-extrabold">{FORMAT_UGX(product.priceUGX)}</span>
                </div>
              </div>
            </div>

            {/* Income breakdown table */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Daily Yield</span>
                <span className="font-extrabold text-emerald-600 text-sm">+{FORMAT_UGX(product.dailyIncomeUGX)}/day</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">45-Day Total Return</span>
                <span className="font-extrabold text-slate-900 text-sm">{FORMAT_UGX(product.totalPayoutUGX)}</span>
              </div>
            </div>

            {/* Settlement rule note */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-700">
              <Zap className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Daily income unlocks automatically after 24 hours of activation.</span>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-2">
                Choose Payment Method
              </label>
              <div className="space-y-2">
                {/* 1. Internal Wallet Balance */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Internal Balance')}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    paymentMethod === 'Internal Balance'
                      ? 'bg-blue-50/60 border-blue-600 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="text-xs font-bold block text-slate-900">Wallet Balance</span>
                      <span className="text-[11px] text-slate-400">Available: {FORMAT_UGX(balanceUGX)}</span>
                    </div>
                  </div>
                  {hasEnoughBalance ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                      Sufficient
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                      Low Balance
                    </span>
                  )}
                </button>

                {/* 2. Direct MTN MoMo */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('MTN Mobile Money')}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    paymentMethod === 'MTN Mobile Money'
                      ? 'bg-amber-50/60 border-amber-400 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-400" />
                    <div>
                      <span className="text-xs font-bold block text-slate-900">Direct MTN Mobile Money</span>
                      <span className="text-[11px] text-slate-400">Instant *165# Prompt PIN</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700">Instant</span>
                </button>

                {/* 3. Direct Airtel Money */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Airtel Money')}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    paymentMethod === 'Airtel Money'
                      ? 'bg-rose-50/60 border-rose-400 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-500" />
                    <div>
                      <span className="text-xs font-bold block text-slate-900">Direct Airtel Money</span>
                      <span className="text-[11px] text-slate-400">Instant *185# Prompt PIN</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700">Instant</span>
                </button>
              </div>
            </div>

            {/* If Mobile Money selected, show phone number input */}
            {(paymentMethod === 'MTN Mobile Money' || paymentMethod === 'Airtel Money') && (
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Uganda Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600">
                    +256
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-16 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Low balance helper if wallet selected */}
            {paymentMethod === 'Internal Balance' && !hasEnoughBalance && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                <span>Need {FORMAT_UGX(product.priceUGX - balanceUGX)} more</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProductForActivation(null);
                    setIsRechargeOpen(true);
                  }}
                  className="font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                >
                  Top Up Now
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Activating Clothing Line...</span>
                </div>
              ) : (
                <>
                  <span>Activate for {FORMAT_UGX(product.priceUGX)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
