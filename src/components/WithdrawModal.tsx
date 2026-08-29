import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FORMAT_UGX, FORMAT_NUMBER } from '../data/products';

export const WithdrawModal: React.FC = () => {
  const { isWithdrawOpen, setIsWithdrawOpen, balanceUGX, withdrawFunds } = useApp();

  const [provider, setProvider] = useState<'MTN Mobile Money' | 'Airtel Money'>('MTN Mobile Money');
  const [amount, setAmount] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('0774892104');
  const [accountName, setAccountName] = useState<string>('M. Mukasa');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isWithdrawOpen) return null;

  const numAmount = parseInt(amount, 10) || 0;
  const feeUGX = Math.round(numAmount * 0.03); // 3% telecom transfer fee
  const netPayoutUGX = Math.max(0, numAmount - feeUGX);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (numAmount < 10000) {
      setErrorMessage('Minimum withdrawal amount is 10,000 UGX');
      return;
    }

    if (numAmount > balanceUGX) {
      setErrorMessage('Insufficient wallet balance');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 9) {
      setErrorMessage('Please enter a valid Uganda mobile number');
      return;
    }

    setLoading(true);
    const res = await withdrawFunds(numAmount, provider, phoneNumber);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        setSuccessMessage(null);
        setIsWithdrawOpen(false);
      }, 2500);
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
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
              Instant Cashout
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Withdraw to Mobile Money
            </h2>
          </div>
          <button
            onClick={() => setIsWithdrawOpen(false)}
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
            <h3 className="font-bold text-lg text-slate-900">Withdrawal Sent!</h3>
            <p className="text-xs text-slate-500">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleWithdraw} className="space-y-4">
            {/* Current Balance Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Available for Cashout:</span>
              <span className="text-sm font-extrabold text-slate-900">{FORMAT_UGX(balanceUGX)}</span>
            </div>

            {/* Provider Selector */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-2">
                Payout Destination
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
                  <span className="text-[10px] text-slate-400 block mt-1">24/7 Automated</span>
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
                  <span className="text-[10px] text-slate-400 block mt-1">24/7 Automated</span>
                </button>
              </div>
            </div>

            {/* Account Name */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">
                Registered Mobile Money Name
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g. Mukasa David"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />
            </div>

            {/* Phone Number */}
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

            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-600">
                  Withdrawal Amount (UGX)
                </label>
                <button
                  type="button"
                  onClick={() => setAmount(balanceUGX.toString())}
                  className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  All ({FORMAT_NUMBER(balanceUGX)})
                </button>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Min: 10,000 UGX"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />
            </div>

            {/* Financial Summary Box */}
            {numAmount > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-500">
                  <span>Gross Cashout:</span>
                  <span className="text-slate-900 font-semibold">{FORMAT_UGX(numAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Telecom Handling (3%):</span>
                  <span className="text-slate-400">-{FORMAT_UGX(feeUGX)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold pt-1.5 border-t border-slate-200">
                  <span>Net Payout to Phone:</span>
                  <span>{FORMAT_UGX(netPayoutUGX)}</span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || numAmount <= 0}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Transfer to {provider}...</span>
                </div>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Confirm Payout to {provider}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
