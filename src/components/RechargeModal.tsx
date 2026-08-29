import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Phone, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FORMAT_UGX, FORMAT_NUMBER } from '../data/products';

export const RechargeModal: React.FC = () => {
  const { isRechargeOpen, setIsRechargeOpen, rechargeBalance, userPhone } = useApp();

  const [provider, setProvider] = useState<'MTN Mobile Money' | 'Airtel Money'>('MTN Mobile Money');
  const [amount, setAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('0774892104');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isRechargeOpen) return null;

  const quickAmounts = [25000, 50000, 100000, 150000, 250000, 500000, 1000000, 2500000];

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const finalAmount = customAmount ? parseInt(customAmount, 10) : amount;
    if (isNaN(finalAmount) || finalAmount < 10000) {
      setErrorMessage('Minimum recharge amount is 10,000 UGX');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 9) {
      setErrorMessage('Please enter a valid Uganda mobile number (e.g. 077... or 070...)');
      return;
    }

    setLoading(true);
    const res = await rechargeBalance(finalAmount, provider, phoneNumber);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        setSuccessMessage(null);
        setIsRechargeOpen(false);
      }, 2000);
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
              Uganda Mobile Money
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Deposit UGX
            </h2>
          </div>
          <button
            onClick={() => setIsRechargeOpen(false)}
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
            <h3 className="font-bold text-lg text-slate-900">Deposit Successful!</h3>
            <p className="text-xs text-slate-500">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleRecharge} className="space-y-4">
            {/* Telecom Provider Selection */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-2">
                Select Telecom Network
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProvider('MTN Mobile Money')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    provider === 'MTN Mobile Money'
                      ? 'bg-amber-50/60 border-amber-400 text-slate-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="text-sm">MTN MoMo</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Prompt: *165#</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('Airtel Money')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    provider === 'Airtel Money'
                      ? 'bg-rose-50/60 border-rose-400 text-slate-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-sm">Airtel Money</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Prompt: *185#</span>
                </button>
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">
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
                  placeholder="774892104"
                  className="w-full pl-16 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Quick Amount Selectors */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-2">
                Deposit Amount (UGX)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      amount === amt && !customAmount
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {amt >= 1000000 ? `${amt / 1000000}M` : `${amt / 1000}K`}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <input
                type="number"
                placeholder="Or enter custom amount (Min 10,000 UGX)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />
            </div>

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
                  <span>Processing Telecom Push...</span>
                </div>
              ) : (
                <>
                  <span>Confirm Deposit of {FORMAT_UGX(customAmount ? parseInt(customAmount, 10) || 0 : amount)}</span>
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
