import { databaseService } from './DatabaseService';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/Categories';

export const insertSampleData = async () => {
  try {
    const transactions = await databaseService.getTransactions(1);
    
    // Only insert sample data if no transactions exist
    if (transactions.length === 0) {
      const sampleTransactions = [
        {
          amount: 25.50,
          category: 'Food & Dining',
          description: 'Lunch at cafe',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24),
          type: 'expense' as const,
        },
        {
          amount: 500.00,
          category: 'Transportation',
          description: 'Monthly bus pass',
          date: new Date(Date.now() - 1000 * 60 * 60 * 48),
          type: 'expense' as const,
        },
        {
          amount: 3000.00,
          category: 'Salary',
          description: 'Monthly salary',
          date: new Date(Date.now() - 1000 * 60 * 60 * 72),
          type: 'income' as const,
        },
        {
          amount: 89.99,
          category: 'Shopping',
          description: 'New headphones',
          date: new Date(Date.now() - 1000 * 60 * 60 * 96),
          type: 'expense' as const,
        },
        {
          amount: 45.00,
          category: 'Entertainment',
          description: 'Movie tickets',
          date: new Date(Date.now() - 1000 * 60 * 60 * 120),
          type: 'expense' as const,
        },
        {
          amount: 200.00,
          category: 'Bills & Utilities',
          description: 'Electricity bill',
          date: new Date(Date.now() - 1000 * 60 * 60 * 144),
          type: 'expense' as const,
        },
      ];

      for (const transaction of sampleTransactions) {
        await databaseService.addTransaction(transaction);
      }
      
      console.log('Sample data inserted successfully');
    }
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
};