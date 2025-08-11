import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Transaction } from '../types';
import { formatCurrency } from '../services/CurrencyService';
import { ALL_CATEGORIES } from '../constants/Categories';

interface TransactionCardProps {
  transaction: Transaction;
  currency: string;
  onPress?: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ 
  transaction, 
  currency, 
  onPress 
}) => {
  const { theme } = useTheme();
  
  const category = ALL_CATEGORIES.find(cat => cat.name === transaction.category);
  const isIncome = transaction.type === 'income';
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      marginHorizontal: theme.spacing.md,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: category?.color || theme.colors.accent,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leftSection: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: category?.color || theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
    },
    category: {
      fontSize: theme.fontSize.md,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    description: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    date: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
    },
    amountContainer: {
      alignItems: 'flex-end',
    },
    amount: {
      fontSize: theme.fontSize.lg,
      fontWeight: 'bold',
      color: isIncome ? theme.colors.income : theme.colors.expense,
    },
    time: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={category?.icon as any || 'card'} 
              size={24} 
              color="white" 
            />
          </View>
          <View style={styles.content}>
            <Text style={styles.category}>{transaction.category}</Text>
            {transaction.description && (
              <Text style={styles.description} numberOfLines={1}>
                {transaction.description}
              </Text>
            )}
            <Text style={styles.date}>
              {formatDate(transaction.date)}
            </Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
          </Text>
          <Text style={styles.time}>
            {formatTime(transaction.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};