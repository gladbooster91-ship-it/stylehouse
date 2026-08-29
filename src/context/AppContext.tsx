import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ClothingProduct, ActivatedProduct, Transaction, TeamMember, AppNotification, TabType } from '../types';
import { CLOTHING_PRODUCTS } from '../data/products';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  balanceUGX: number;
  totalEarnedUGX: number;
  totalRechargedUGX: number;
  totalWithdrawnUGX: number;
  activatedProducts: ActivatedProduct[];
  transactions: Transaction[];
  teamMembers: TeamMember[];
  notifications: AppNotification[];
  userPhone: string;
  referralCode: string;
  vipLevel: number;
  selectedProductForDetail: ClothingProduct | null;
  setSelectedProductForDetail: (product: ClothingProduct | null) => void;
  selectedProductForActivation: ClothingProduct | null;
  setSelectedProductForActivation: (product: ClothingProduct | null) => void;
  isRechargeOpen: boolean;
  setIsRechargeOpen: (open: boolean) => void;
  isWithdrawOpen: boolean;
  setIsWithdrawOpen: (open: boolean) => void;
  // Actions
  activateProduct: (productId: string, provider?: 'Internal Balance' | 'MTN Mobile Money' | 'Airtel Money') => { success: boolean; message: string };
  claimDailyIncome: (instanceId: string) => { success: boolean; amount: number; message: string };
  claimAllAvailableIncomes: () => { claimedCount: number; totalAmount: number };
  fastForwardTime: (hours: number) => void;
  rechargeBalance: (amountUGX: number, provider: 'MTN Mobile Money' | 'Airtel Money', phone: string) => Promise<{ success: boolean; message: string }>;
  withdrawFunds: (amountUGX: number, provider: 'MTN Mobile Money' | 'Airtel Money', phone: string) => Promise<{ success: boolean; message: string; feeUGX: number }>;
  claimTeamBonus: (tierId: number) => { success: boolean; amount: number; message: string };
  claimedBonusTiers: number[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  currentTimeOffsetHours: number;
  openActivationModal: (product: ClothingProduct) => void;
}

const STORAGE_KEY = 'stylehouse_uganda_app_state_v1';

const INITIAL_TEAM: TeamMember[] = [
  { id: 'tm-1', phoneMasked: '+256 772 ••• 419', joinedDate: '2026-08-25', level: 1, totalRechargeUGX: 100000, activeProductsCount: 1, commissionEarnedUGX: 10000 },
  { id: 'tm-2', phoneMasked: '+256 701 ••• 882', joinedDate: '2026-08-26', level: 1, totalRechargeUGX: 50000, activeProductsCount: 1, commissionEarnedUGX: 5000 },
  { id: 'tm-3', phoneMasked: '+256 784 ••• 203', joinedDate: '2026-08-27', level: 2, totalRechargeUGX: 150000, activeProductsCount: 2, commissionEarnedUGX: 7500 },
  { id: 'tm-4', phoneMasked: '+256 756 ••• 912', joinedDate: '2026-08-28', level: 3, totalRechargeUGX: 25000, activeProductsCount: 1, commissionEarnedUGX: 500 },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    title: 'Welcome to StyleHouse Uganda 🇺🇬',
    message: 'Receive daily income in UGX every 24 hours after activating HD Clothing products. Enjoy instant MTN & Airtel payouts!',
    time: 'Just now',
    isRead: false,
    type: 'system'
  },
  {
    id: 'n-2',
    title: 'VIP Activation Bonus Available',
    message: 'Activate any 45-day clothing line to upgrade your VIP tier and unlock higher referral commission rates.',
    time: '1 hour ago',
    isRead: false,
    type: 'promo'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [balanceUGX, setBalanceUGX] = useState<number>(35000); // Starter balance to allow immediate testing of 25k product or recharge
  const [totalEarnedUGX, setTotalEarnedUGX] = useState<number>(15000);
  const [totalRechargedUGX, setTotalRechargedUGX] = useState<number>(50000);
  const [totalWithdrawnUGX, setTotalWithdrawnUGX] = useState<number>(0);
  const [userPhone] = useState<string>('+256 774 892 104');
  const [referralCode] = useState<string>('SH-UG8892');
  const [claimedBonusTiers, setClaimedBonusTiers] = useState<number[]>([]);
  const [currentTimeOffsetHours, setCurrentTimeOffsetHours] = useState<number>(0);

  // Initial starter activated product so user sees how 24h countdown & claims work right away
  const [activatedProducts, setActivatedProducts] = useState<ActivatedProduct[]>([
    {
      instanceId: 'inst-starter-1',
      productId: 'amethyst-frost',
      productName: 'StyleHouse HD Amethyst Frost',
      priceUGX: 25000,
      dailyIncomeUGX: 5000,
      totalPayoutUGX: 250000,
      durationDays: 45,
      daysCompleted: 3,
      totalEarnedUGX: 15000,
      activatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastClaimedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // Ready to claim! (>24h ago)
      nextClaimAvailableAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx-init-1',
      type: 'deposit',
      amountUGX: 50000,
      description: 'Account Starter Deposit via MTN MoMo',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString() + ' 09:30',
      status: 'completed',
      provider: 'MTN Mobile Money',
      referenceNo: 'MTN-UG-984210'
    },
    {
      id: 'tx-init-2',
      type: 'activation',
      amountUGX: 25000,
      description: 'Activated StyleHouse HD Amethyst Frost (45 Days)',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString() + ' 09:35',
      status: 'completed',
      provider: 'Internal Balance',
      referenceNo: 'ACT-UG-441209'
    },
    {
      id: 'tx-init-3',
      type: 'daily_income',
      amountUGX: 5000,
      description: 'Day 1 Income from HD Amethyst Frost',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString() + ' 10:00',
      status: 'completed',
      provider: 'Internal Balance',
      referenceNo: 'INC-UG-100291'
    },
    {
      id: 'tx-init-4',
      type: 'daily_income',
      amountUGX: 5000,
      description: 'Day 2 Income from HD Amethyst Frost',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString() + ' 10:15',
      status: 'completed',
      provider: 'Internal Balance',
      referenceNo: 'INC-UG-100388'
    }
  ]);

  const [teamMembers] = useState<TeamMember[]>(INITIAL_TEAM);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<ClothingProduct | null>(null);
  const [selectedProductForActivation, setSelectedProductForActivation] = useState<ClothingProduct | null>(null);
  const [isRechargeOpen, setIsRechargeOpen] = useState<boolean>(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);

  // Load from local storage if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.balanceUGX !== undefined) setBalanceUGX(parsed.balanceUGX);
        if (parsed.totalEarnedUGX !== undefined) setTotalEarnedUGX(parsed.totalEarnedUGX);
        if (parsed.totalRechargedUGX !== undefined) setTotalRechargedUGX(parsed.totalRechargedUGX);
        if (parsed.totalWithdrawnUGX !== undefined) setTotalWithdrawnUGX(parsed.totalWithdrawnUGX);
        if (parsed.activatedProducts) setActivatedProducts(parsed.activatedProducts);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.claimedBonusTiers) setClaimedBonusTiers(parsed.claimedBonusTiers);
      }
    } catch (e) {
      console.error('Failed to load stored state', e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        balanceUGX,
        totalEarnedUGX,
        totalRechargedUGX,
        totalWithdrawnUGX,
        activatedProducts,
        transactions,
        claimedBonusTiers
      }));
    } catch (e) {
      console.error('Failed to persist state', e);
    }
  }, [balanceUGX, totalEarnedUGX, totalRechargedUGX, totalWithdrawnUGX, activatedProducts, transactions, claimedBonusTiers]);

  // Determine VIP level by active products
  const activeCount = activatedProducts.filter(p => p.status === 'active').length;
  const vipLevel = Math.min(8, Math.max(1, activeCount + 1));

  const openActivationModal = (product: ClothingProduct) => {
    setSelectedProductForActivation(product);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#a855f7', '#10b981', '#f43f5e', '#ffffff']
      });
    } catch (err) {
      console.log('Confetti not available', err);
    }
  };

  // Activate Product
  const activateProduct = (
    productId: string,
    provider: 'Internal Balance' | 'MTN Mobile Money' | 'Airtel Money' = 'Internal Balance'
  ) => {
    const product = CLOTHING_PRODUCTS.find(p => p.id === productId);
    if (!product) {
      return { success: false, message: 'Clothing product not found' };
    }

    if (provider === 'Internal Balance') {
      if (balanceUGX < product.priceUGX) {
        return {
          success: false,
          message: `Insufficient balance. You need ${new Intl.NumberFormat('en-UG').format(product.priceUGX - balanceUGX)} UGX more. Please recharge via MTN or Airtel Money.`
        };
      }
      setBalanceUGX(prev => prev - product.priceUGX);
    } else {
      // Direct payment simulation
      setTotalRechargedUGX(prev => prev + product.priceUGX);
    }

    const now = new Date();
    // 24 hours from now is next claim
    const nextClaim = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const newActivation: ActivatedProduct = {
      instanceId: `inst-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId: product.id,
      productName: product.fullName,
      priceUGX: product.priceUGX,
      dailyIncomeUGX: product.dailyIncomeUGX,
      totalPayoutUGX: product.totalPayoutUGX,
      durationDays: product.durationDays,
      daysCompleted: 0,
      totalEarnedUGX: 0,
      activatedAt: now.toISOString(),
      lastClaimedAt: now.toISOString(),
      nextClaimAvailableAt: nextClaim.toISOString(),
      status: 'active',
      imageUrl: product.imageUrl
    };

    setActivatedProducts(prev => [newActivation, ...prev]);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'activation',
      amountUGX: product.priceUGX,
      description: `Activated ${product.fullName} (45 Days cycle)`,
      date: new Date().toLocaleString(),
      status: 'completed',
      provider: provider,
      referenceNo: `ACT-UG-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setTransactions(prev => [newTx, ...prev]);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Product Activated Successfully! 🎉',
      message: `You activated ${product.fullName}. Your daily income of ${new Intl.NumberFormat('en-UG').format(product.dailyIncomeUGX)} UGX starts in 24 hours.`,
      time: 'Just now',
      isRead: false,
      type: 'income'
    };
    setNotifications(prev => [newNotif, ...prev]);

    triggerConfetti();
    return {
      success: true,
      message: `Successfully activated ${product.fullName}! Earning starts in 24 hours.`
    };
  };

  // Claim Daily Income
  const claimDailyIncome = (instanceId: string) => {
    const item = activatedProducts.find(p => p.instanceId === instanceId);
    if (!item) {
      return { success: false, amount: 0, message: 'Item not found' };
    }

    if (item.status === 'completed') {
      return { success: false, amount: 0, message: 'This 45-day cycle is already fully completed!' };
    }

    // Check if 24 hours have passed since last claim
    const nextAvailableTime = new Date(item.nextClaimAvailableAt).getTime();
    const nowTime = Date.now() + currentTimeOffsetHours * 60 * 60 * 1000;

    if (nowTime < nextAvailableTime) {
      const remainingMs = nextAvailableTime - nowTime;
      const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
      const remainingMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      return {
        success: false,
        amount: 0,
        message: `Income settling... Available in ${remainingHours}h ${remainingMins}m`
      };
    }

    const newDays = item.daysCompleted + 1;
    const isNowCompleted = newDays >= item.durationDays;
    const nextClaimDate = new Date(nowTime + 24 * 60 * 60 * 1000);

    setActivatedProducts(prev =>
      prev.map(p => {
        if (p.instanceId === instanceId) {
          return {
            ...p,
            daysCompleted: newDays,
            totalEarnedUGX: p.totalEarnedUGX + item.dailyIncomeUGX,
            lastClaimedAt: new Date(nowTime).toISOString(),
            nextClaimAvailableAt: nextClaimDate.toISOString(),
            status: isNowCompleted ? 'completed' : 'active'
          };
        }
        return p;
      })
    );

    setBalanceUGX(prev => prev + item.dailyIncomeUGX);
    setTotalEarnedUGX(prev => prev + item.dailyIncomeUGX);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'daily_income',
      amountUGX: item.dailyIncomeUGX,
      description: `Day ${newDays} Income from ${item.productName}`,
      date: new Date().toLocaleString(),
      status: 'completed',
      provider: 'Internal Balance',
      referenceNo: `INC-UG-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setTransactions(prev => [newTx, ...prev]);
    triggerConfetti();

    return {
      success: true,
      amount: item.dailyIncomeUGX,
      message: `Claimed +${new Intl.NumberFormat('en-UG').format(item.dailyIncomeUGX)} UGX daily income! (Day ${newDays}/${item.durationDays})`
    };
  };

  // Claim All Available
  const claimAllAvailableIncomes = () => {
    const nowTime = Date.now() + currentTimeOffsetHours * 60 * 60 * 1000;
    let claimedCount = 0;
    let totalAmount = 0;

    const updated = activatedProducts.map(p => {
      if (p.status === 'active') {
        const nextAvailableTime = new Date(p.nextClaimAvailableAt).getTime();
        if (nowTime >= nextAvailableTime) {
          claimedCount++;
          totalAmount += p.dailyIncomeUGX;
          const newDays = p.daysCompleted + 1;
          const nextClaimDate = new Date(nowTime + 24 * 60 * 60 * 1000);
          return {
            ...p,
            daysCompleted: newDays,
            totalEarnedUGX: p.totalEarnedUGX + p.dailyIncomeUGX,
            lastClaimedAt: new Date(nowTime).toISOString(),
            nextClaimAvailableAt: nextClaimDate.toISOString(),
            status: (newDays >= p.durationDays ? 'completed' : 'active') as 'completed' | 'active'
          };
        }
      }
      return p;
    });

    if (claimedCount > 0) {
      setActivatedProducts(updated);
      setBalanceUGX(prev => prev + totalAmount);
      setTotalEarnedUGX(prev => prev + totalAmount);

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'daily_income',
        amountUGX: totalAmount,
        description: `Batch Daily Income Claim (${claimedCount} active products)`,
        date: new Date().toLocaleString(),
        status: 'completed',
        provider: 'Internal Balance',
        referenceNo: `BATCH-UG-${Math.floor(100000 + Math.random() * 900000)}`
      };
      setTransactions(prev => [newTx, ...prev]);
      triggerConfetti();
    }

    return { claimedCount, totalAmount };
  };

  // Fast-forward demo helper (simulates advancing time by 24h)
  const fastForwardTime = (hours: number) => {
    setCurrentTimeOffsetHours(prev => prev + hours);
    // Shift nextClaimAvailableAt backwards by hours so items become claimable
    setActivatedProducts(prev =>
      prev.map(p => {
        const currentNext = new Date(p.nextClaimAvailableAt).getTime();
        const adjustedNext = new Date(currentNext - hours * 60 * 60 * 1000);
        return {
          ...p,
          nextClaimAvailableAt: adjustedNext.toISOString()
        };
      })
    );
  };

  // Recharge Balance
  const rechargeBalance = async (
    amountUGX: number,
    provider: 'MTN Mobile Money' | 'Airtel Money',
    phone: string
  ): Promise<{ success: boolean; message: string }> => {
    // Simulate brief network request
    await new Promise(resolve => setTimeout(resolve, 800));

    if (amountUGX < 10000) {
      return { success: false, message: 'Minimum deposit is 10,000 UGX' };
    }

    setBalanceUGX(prev => prev + amountUGX);
    setTotalRechargedUGX(prev => prev + amountUGX);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      amountUGX: amountUGX,
      description: `Recharge via ${provider} (${phone})`,
      date: new Date().toLocaleString(),
      status: 'completed',
      provider: provider,
      referenceNo: `${provider.startsWith('MTN') ? 'MTN' : 'AIR'}-UG-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setTransactions(prev => [newTx, ...prev]);
    triggerConfetti();

    return {
      success: true,
      message: `Deposit of ${new Intl.NumberFormat('en-UG').format(amountUGX)} UGX received via ${provider}!`
    };
  };

  // Withdraw Funds
  const withdrawFunds = async (
    amountUGX: number,
    provider: 'MTN Mobile Money' | 'Airtel Money',
    phone: string
  ): Promise<{ success: boolean; message: string; feeUGX: number }> => {
    await new Promise(resolve => setTimeout(resolve, 900));

    if (amountUGX < 10000) {
      return { success: false, message: 'Minimum withdrawal is 10,000 UGX', feeUGX: 0 };
    }

    if (amountUGX > balanceUGX) {
      return { success: false, message: 'Insufficient wallet balance for this withdrawal', feeUGX: 0 };
    }

    const feeUGX = Math.round(amountUGX * 0.03); // 3% telecom cashout tax/fee
    const netPayout = amountUGX - feeUGX;

    setBalanceUGX(prev => prev - amountUGX);
    setTotalWithdrawnUGX(prev => prev + amountUGX);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'withdrawal',
      amountUGX: amountUGX,
      description: `Withdrawal to ${provider} (${phone}) - Net: ${new Intl.NumberFormat('en-UG').format(netPayout)} UGX`,
      date: new Date().toLocaleString(),
      status: 'completed',
      provider: provider,
      referenceNo: `WTH-UG-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      message: `Withdrawal of ${new Intl.NumberFormat('en-UG').format(netPayout)} UGX successfully sent to your ${provider} account (${phone})!`,
      feeUGX
    };
  };

  // Claim Team Referral Tier Bonus
  const claimTeamBonus = (tierId: number) => {
    if (claimedBonusTiers.includes(tierId)) {
      return { success: false, amount: 0, message: 'Bonus already claimed for this level' };
    }

    const bonusAmounts: Record<number, number> = {
      1: 20000,
      2: 50000,
      3: 150000
    };

    const amount = bonusAmounts[tierId] || 10000;
    setClaimedBonusTiers(prev => [...prev, tierId]);
    setBalanceUGX(prev => prev + amount);
    setTotalEarnedUGX(prev => prev + amount);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'team_commission',
      amountUGX: amount,
      description: `VIP Team Milestone Reward Level ${tierId}`,
      date: new Date().toLocaleString(),
      status: 'completed',
      provider: 'Internal Balance',
      referenceNo: `BONUS-UG-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setTransactions(prev => [newTx, ...prev]);
    triggerConfetti();

    return {
      success: true,
      amount,
      message: `Claimed +${new Intl.NumberFormat('en-UG').format(amount)} UGX Team Reward!`
    };
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        balanceUGX,
        totalEarnedUGX,
        totalRechargedUGX,
        totalWithdrawnUGX,
        activatedProducts,
        transactions,
        teamMembers,
        notifications,
        userPhone,
        referralCode,
        vipLevel,
        selectedProductForDetail,
        setSelectedProductForDetail,
        selectedProductForActivation,
        setSelectedProductForActivation,
        isRechargeOpen,
        setIsRechargeOpen,
        isWithdrawOpen,
        setIsWithdrawOpen,
        activateProduct,
        claimDailyIncome,
        claimAllAvailableIncomes,
        fastForwardTime,
        rechargeBalance,
        withdrawFunds,
        claimTeamBonus,
        claimedBonusTiers,
        markNotificationRead,
        clearAllNotifications,
        currentTimeOffsetHours,
        openActivationModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
