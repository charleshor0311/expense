import { Category } from '../types';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', icon: 'restaurant', color: '#FF6B6B', type: 'expense' },
  { id: '2', name: 'Transportation', icon: 'car', color: '#4ECDC4', type: 'expense' },
  { id: '3', name: 'Shopping', icon: 'shopping-bag', color: '#45B7D1', type: 'expense' },
  { id: '4', name: 'Entertainment', icon: 'movie', color: '#96CEB4', type: 'expense' },
  { id: '5', name: 'Bills & Utilities', icon: 'receipt', color: '#FFEAA7', type: 'expense' },
  { id: '6', name: 'Healthcare', icon: 'medical', color: '#DDA0DD', type: 'expense' },
  { id: '7', name: 'Education', icon: 'school', color: '#98D8C8', type: 'expense' },
  { id: '8', name: 'Others', icon: 'ellipsis-horizontal', color: '#F7DC6F', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: '9', name: 'Salary', icon: 'card', color: '#6BCF7F', type: 'income' },
  { id: '10', name: 'Business', icon: 'business', color: '#4D96FF', type: 'income' },
  { id: '11', name: 'Investment', icon: 'trending-up', color: '#9B59B6', type: 'income' },
  { id: '12', name: 'Gift', icon: 'gift', color: '#F39C12', type: 'income' },
  { id: '13', name: 'Others', icon: 'add-circle', color: '#1ABC9C', type: 'income' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];