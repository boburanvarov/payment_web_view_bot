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
