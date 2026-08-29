export interface ClothingProduct {
  id: string;
  name: string;
  fullName: string;
  tagline: string;
  durationDays: number;
  priceUGX: number;
  dailyIncomeUGX: number;
  totalPayoutUGX: number;
  imageUrl: string;
  category: 'haute-couture' | 'royal-collection' | 'signature-vip' | 'evening-wear';
  colorTheme: string;
  accentColor: string;
  popular?: boolean;
  vipTier: number;
  description: string;
  fabricSpecs: string;
}

export interface ActivatedProduct {
  instanceId: string;
  productId: string;
  productName: string;
  priceUGX: number;
  dailyIncomeUGX: number;
  totalPayoutUGX: number;
  durationDays: number;
  daysCompleted: number;
  totalEarnedUGX: number;
  activatedAt: string; // ISO date string
  lastClaimedAt: string; // ISO date string
  nextClaimAvailableAt: string; // ISO date string (24 hours after last claimed/activated)
  status: 'active' | 'completed';
  imageUrl: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'activation' | 'daily_income' | 'team_commission' | 'bonus';
  amountUGX: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  provider?: 'MTN Mobile Money' | 'Airtel Money' | 'Internal Balance';
  referenceNo: string;
}

export interface TeamMember {
  id: string;
  phoneMasked: string;
  joinedDate: string;
  level: 1 | 2 | 3;
  totalRechargeUGX: number;
  activeProductsCount: number;
  commissionEarnedUGX: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'income' | 'system' | 'commission' | 'promo';
}

export type TabType = 'home' | 'products' | 'team' | 'account';
