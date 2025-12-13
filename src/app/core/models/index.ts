// Export transaction interfaces first
export * from './transaction.interfaces';

// Export transaction type enum
export * from './transaction-type.enum';

// Export currency interfaces
export * from './currency.interfaces';

// Import Transaction type for use in UserData
import type { Transaction } from './transaction.interfaces';

export interface User {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface UserData {
  userId: number;
  firstName: string;
  balance: number;
  income: number;
  expenses: number;
  transactions: Transaction[];
  cards: Card[];
}

export type TransactionType = 'income' | 'expense';

export interface CardApiResponse {
  id: number;
  userId: number;
  phoneNumber: string;
  cardId: string;
  maskPan: string;
  cardType: string;
  active: boolean;
  balance: number;
  cardName?: string; // Optional card title from backend
  cardDesignInfo: {
    cardType: string;
    bankName: string;
    bankLogo: string;
    bankLogoMini: string;
    bankWhiteLogo?: string;
    bankWhiteLogoMini?: string;
    processingLogo: string;
    processingLogoMini: string;
    processingWhiteLogo?: string;
    processingWhiteLogoMini?: string;
  };
}

export interface Card {
  id: number;
  userId?: number;
  phoneNumber?: string;
  cardId?: string;
  number: string;
  cardType?: string;
  cardName?: string;
  balance: number;
  gradient: string;
  bankName?: string;
  expiryDate?: string;
  active?: boolean;
  bankLogo?: string;
  bankLogoMini?: string;
  bankWhiteLogo?: string;
  bankWhiteLogoMini?: string;
  processingLogo?: string;
  processingLogoMini?: string;
  processingWhiteLogo?: string;
  processingWhiteLogoMini?: string;
}

export interface WeeklyStat {
  week: string;
  income: number;
  expenses: number;
}

// Add Card API interfaces
export interface AddCardRequest {
  cardNumber: string;
  expiryDate: string;
  cardName: string;
}

export interface AddCardResponse {
  success: boolean;
  cardType: string | null;
  phoneMask: string | null;
  message: string | null;
  otpId: string | null;
}

export interface VerifyCardRequest {
  cardNumber: string;
  expiryDate: string;
  code: string;
  cardType: string;
  otpId: string;
  cardName: string;
}

// Telegram Authentication interfaces
export interface TelegramAuthRequest {
  initData: string;
}

export interface TelegramUser {
  id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  language_code?: string;
  is_premium?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

export interface TelegramAuthResponse {
  success: boolean;
  token: string;
  issuedAt: string;
  expiresAt: string;
  user: TelegramUser;
  message: string;
}


// Profile interfaces
export interface PlanSummary {
  code: string;
  name: string;
  description: string;
  paid: boolean;
  highlighted: boolean;
}

export interface ProfileResponse {
  userId: number;
  phoneNumber: string;
  name: string;
  language: string;
  subscribed: boolean;
  autoPay: boolean;
  paidDate: string;
  expireDate: string;
  createdAt: string;
  subscriptionPlan: string;
  billingCycle: string;
  planSummary: PlanSummary;
}

// Subscription interfaces
export interface SubscriptionPlan {
  name: string;
  price: number;
  period: string;
  description: string;
}

// Subscription Plan API Models
export interface PriceOption {
  cycle: 'MONTHLY' | 'YEARLY';
  amount: number;
  finalAmount: number;
  discountPercent: number | null;
  discountLabel: string | null;
  selected: boolean;
  label: string;
}

export interface FeatureDetail {
  code: string;
  title: string;
  description: string;
  limit: number | null;
  enabled: boolean;
}

export interface SubscriptionPlanDetailed {
  code: string;
  name: string;
  badgeText: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercent: number | null;
  discountLabel: string | null;
  priceLabel: string;
  cycleLabel: string;
  currency: string;
  current: boolean;
  highlighted: boolean;
  ctaText: string;
  features: string[];
  featureDetails: FeatureDetail[];
  priceOptions: PriceOption[];
}

// Profile API Response
export interface ProfileResponse {
  userId: number;
  phoneNumber: string;
  name: string;
  username?: string;
  language: string;
  subscribed: boolean;
  autoPay: boolean;
  paidDate: string;
  expireDate: string;
  createdAt: string;
  subscriptionPlan: string;
  billingCycle: string;
  planSummary: {
    code: string;
    name: string;
    description: string;
    paid: boolean;
    highlighted: boolean;
  };
}

export interface BillingCycle {
  cycle: 'MONTHLY' | 'YEARLY';
  label: string;
  discountLabel: string | null;
  selected: boolean;
}

export interface UpgradeHint {
  show: boolean;
  badgeText: string | null;
  message: string | null;
  actionText: string | null;
}

export interface SubscriptionPlansResponse {
  billingCycle: 'MONTHLY' | 'YEARLY';
  plans: SubscriptionPlanDetailed[];
  cycles: BillingCycle[];
  upgradeHint: UpgradeHint;
}

