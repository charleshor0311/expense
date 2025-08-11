export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: 'income' | 'expense';
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export interface Settings {
  currency: string;
  language: string;
  theme: 'light' | 'dark';
  isPremium: boolean;
}

export interface MonthlyData {
  month: string;
  totalExpenses: number;
  totalIncome: number;
  categoryBreakdown: { [key: string]: number };
}

export interface ChartData {
  x: string;
  y: number;
}