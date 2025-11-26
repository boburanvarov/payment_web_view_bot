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

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  time: string;
  icon: string;
  category?: string;
  color?: string;
}

export type TransactionType = 'income' | 'expense';

export interface Card {
  id: number;
  number: string;
  balance: number;
  gradient: string;
}

export interface WeeklyStat {
  week: string;
  income: number;
  expenses: number;
}
