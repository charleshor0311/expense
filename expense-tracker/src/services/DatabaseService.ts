import * as SQLite from 'expo-sqlite';
import { Transaction, Settings } from '../types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('expense_tracker.db');
      
      // Create tables
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          date TEXT NOT NULL,
          type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY,
          currency TEXT NOT NULL DEFAULT 'MYR',
          language TEXT NOT NULL DEFAULT 'en',
          theme TEXT NOT NULL DEFAULT 'system',
          is_premium INTEGER NOT NULL DEFAULT 0
        );

        -- Insert default settings if not exists
        INSERT OR IGNORE INTO settings (id, currency, language, theme, is_premium) 
        VALUES (1, 'MYR', 'en', 'system', 0);
      `);
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');
    
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();
    
    await this.db.runAsync(
      `INSERT INTO transactions (id, amount, category, description, date, type, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, transaction.amount, transaction.category, transaction.description || '', 
       transaction.date.toISOString(), transaction.type, now, now]
    );
    
    return id;
  }

  async updateTransaction(id: string, transaction: Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const updates = [];
    const values = [];
    
    if (transaction.amount !== undefined) {
      updates.push('amount = ?');
      values.push(transaction.amount);
    }
    if (transaction.category !== undefined) {
      updates.push('category = ?');
      values.push(transaction.category);
    }
    if (transaction.description !== undefined) {
      updates.push('description = ?');
      values.push(transaction.description);
    }
    if (transaction.date !== undefined) {
      updates.push('date = ?');
      values.push(transaction.date.toISOString());
    }
    if (transaction.type !== undefined) {
      updates.push('type = ?');
      values.push(transaction.type);
    }
    
    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);
    
    await this.db.runAsync(
      `UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteTransaction(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
  }

  async getTransactions(limit?: number, offset?: number): Promise<Transaction[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    let query = 'SELECT * FROM transactions ORDER BY created_at DESC';
    const params = [];
    
    if (limit !== undefined) {
      query += ' LIMIT ?';
      params.push(limit);
      if (offset !== undefined) {
        query += ' OFFSET ?';
        params.push(offset);
      }
    }
    
    const result = await this.db.getAllAsync(query, params);
    
    return result.map((row: any) => ({
      id: row.id,
      amount: row.amount,
      category: row.category,
      description: row.description,
      date: new Date(row.date),
      type: row.type,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(
      'SELECT * FROM transactions WHERE date BETWEEN ? AND ? ORDER BY created_at DESC',
      [startDate.toISOString(), endDate.toISOString()]
    );
    
    return result.map((row: any) => ({
      id: row.id,
      amount: row.amount,
      category: row.category,
      description: row.description,
      date: new Date(row.date),
      type: row.type,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  async getSettings(): Promise<Settings> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync('SELECT * FROM settings WHERE id = 1');
    
    if (!result) {
      throw new Error('Settings not found');
    }
    
    return {
      currency: (result as any).currency,
      language: (result as any).language,
      theme: (result as any).theme,
      isPremium: Boolean((result as any).is_premium),
    };
  }

  async updateSettings(settings: Partial<Settings>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const updates = [];
    const values = [];
    
    if (settings.currency !== undefined) {
      updates.push('currency = ?');
      values.push(settings.currency);
    }
    if (settings.language !== undefined) {
      updates.push('language = ?');
      values.push(settings.language);
    }
    if (settings.theme !== undefined) {
      updates.push('theme = ?');
      values.push(settings.theme);
    }
    if (settings.isPremium !== undefined) {
      updates.push('is_premium = ?');
      values.push(settings.isPremium ? 1 : 0);
    }
    
    if (updates.length > 0) {
      await this.db.runAsync(
        `UPDATE settings SET ${updates.join(', ')} WHERE id = 1`,
        values
      );
    }
  }
}

export const databaseService = new DatabaseService();