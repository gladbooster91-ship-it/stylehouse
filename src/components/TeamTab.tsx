import React, { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  Share2,
  Gift,
  Award,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FORMAT_UGX, FORMAT_NUMBER } from '../data/products';

export const TeamTab: React.FC = () => {
  const {
    referralCode,
    teamMembers,
    claimTeamBonus,
    claimedBonusTiers
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [bonusToast, setBonusToast] = useState<string | null>(null);

  const inviteUrl = `https://stylehouse.ug/register?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const totalCommissionUGX = teamMembers.reduce((sum, m) => sum + m.commissionEarnedUGX, 0);
  const totalTeamVolumeUGX = teamMembers.reduce((sum, m) => sum + m.totalRechargeUGX, 0);

  const milestones = [
    { tier: 1, title: 'Starter Affiliate', req: 'Invite 2 active members', bonusUGX: 20000, eligible: teamMembers.length >= 2 },
    { tier: 2, title: 'Regional Agent', req: 'Team volume reaches 200,000 UGX', bonusUGX: 50000, eligible: totalTeamVolumeUGX >= 200000 },
    { tier: 3, title: 'Uganda Master Ambassador', req: 'Reach 4 active team members', bonusUGX: 150000, eligible: teamMembers.length >= 4 },
  ];

  const handleClaimBonus = (tier: number) => {
    const res = claimTeamBonus(tier);
    if (res.success) {
      setBonusToast(res.message);
      setTimeout(() => setBonusToast(null), 3500);
    }
  };

  return (
    <div className="pb-28 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      {/* Toast */}
      {bonusToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 animate-in fade-in zoom-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{bonusToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            StyleHouse Uganda Partner Network
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Invite Friends & Earn Commission
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Share your invitation code with friends in Uganda. Earn perpetual daily commission across 3 tiers whenever your team members activate clothing products.
          </p>
        </div>
      </div>

      {/* Invitation Code & Link Box */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              My Referral Code
            </span>
            <div className="text-2xl font-mono font-black text-slate-900 mt-0.5">
              {referralCode}
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyCode}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200/80"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Code' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Copy Invite Link</span>
            </button>
          </div>
        </div>

        {/* 3-Tier Commission Breakdown */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
              Tier 1 (Direct)
            </span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">10%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Commission</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
              Tier 2 (Indirect)
            </span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">5%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Commission</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
              Tier 3 (Network)
            </span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">2%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Commission</span>
          </div>
        </div>
      </div>

      {/* Team Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
            Total Team Members
          </span>
          <div className="text-2xl font-black text-slate-900">
            {teamMembers.length}
            <span className="text-xs font-normal text-slate-400 ml-1.5">members</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
            Team Active Volume
          </span>
          <div className="text-2xl font-black text-slate-900">
            {FORMAT_NUMBER(totalTeamVolumeUGX)}
            <span className="text-xs font-bold text-slate-400 ml-1.5">UGX</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] text-emerald-600 uppercase font-bold tracking-wider">
            Commission Earned
          </span>
          <div className="text-2xl font-black text-emerald-600">
            +{FORMAT_NUMBER(totalCommissionUGX)}
            <span className="text-xs font-bold text-emerald-600 ml-1.5">UGX</span>
          </div>
        </div>
      </div>

      {/* Milestone Rewards Chests */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-base text-slate-900">
              Affiliate Milestone Bonuses
            </h2>
          </div>
          <span className="text-xs text-blue-600 font-semibold">Instant Wallet Credit</span>
        </div>

        <div className="space-y-3">
          {milestones.map(m => {
            const isClaimed = claimedBonusTiers.includes(m.tier);

            return (
              <div
                key={m.tier}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isClaimed
                    ? 'bg-slate-50 border-slate-200/60 opacity-70'
                    : m.eligible
                    ? 'bg-blue-50/50 border-blue-200'
                    : 'bg-slate-50/50 border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isClaimed ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{m.title}</h3>
                    <p className="text-xs text-slate-500">{m.req}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                  <span className="font-extrabold text-slate-900 text-sm">
                    +{FORMAT_UGX(m.bonusUGX)}
                  </span>
                  <button
                    disabled={!m.eligible || isClaimed}
                    onClick={() => handleClaimBonus(m.tier)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isClaimed
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : m.eligible
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isClaimed ? 'Claimed' : m.eligible ? 'Claim Bonus' : 'In Progress'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <h2 className="font-bold text-base text-slate-900">
          My Active Team Roster
        </h2>

        <div className="divide-y divide-slate-100">
          {teamMembers.map(member => (
            <div key={member.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm">{member.phoneMasked}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    member.level === 1 ? 'bg-blue-50 text-blue-600' :
                    member.level === 2 ? 'bg-slate-100 text-slate-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    Level {member.level}
                  </span>
                </div>
                <div className="text-slate-400">Joined: {member.joinedDate}</div>
              </div>

              <div className="text-right space-y-0.5">
                <div className="font-extrabold text-emerald-600">
                  +{FORMAT_UGX(member.commissionEarnedUGX)}
                </div>
                <div className="text-slate-400">
                  Recharged: {FORMAT_UGX(member.totalRechargeUGX)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
