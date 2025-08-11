import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { TransactionCard } from '../components/TransactionCard';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { Transaction, Settings } from '../types';
import { databaseService } from '../services/DatabaseService';
import { formatCurrency } from '../services/CurrencyService';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<Settings>({
    currency: 'MYR',
    language: 'en',
    theme: 'system',
    isPremium: false,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transactionsData, settingsData] = await Promise.all([
        databaseService.getTransactions(50),
        databaseService.getSettings(),
      ]);
      
      setTransactions(transactionsData);
      setSettings(settingsData);
      calculateBalance(transactionsData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load transactions');
    }
  };

  const calculateBalance = (transactionList: Transaction[]) => {
    const balance = transactionList.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
    setTotalBalance(balance);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleSaveTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editTransaction) {
        await databaseService.updateTransaction(editTransaction.id, transactionData);
      } else {
        await databaseService.addTransaction(transactionData);
      }
      
      await loadData();
      setEditTransaction(undefined);
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert('Error', 'Failed to save transaction');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setModalVisible(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await databaseService.deleteTransaction(transaction.id);
              await loadData();
            } catch (error) {
              console.error('Error deleting transaction:', error);
              Alert.alert('Error', 'Failed to delete transaction');
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
      backgroundColor: theme.colors.primary,
    },
    headerText: {
      color: 'white',
      fontSize: theme.fontSize.xl,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    balanceContainer: {
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    balanceLabel: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: theme.fontSize.sm,
    },
    balanceAmount: {
      color: 'white',
      fontSize: theme.fontSize.xxl,
      fontWeight: 'bold',
      marginTop: theme.spacing.xs,
    },
    content: {
      flex: 1,
    },
    listContainer: {
      paddingBottom: 100,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xxl,
    },
    emptyText: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.md,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing.lg,
      right: theme.spacing.md,
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    sectionHeader: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    sectionHeaderText: {
      fontSize: theme.fontSize.lg,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
  });

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TransactionCard
      transaction={item}
      currency={settings.currency}
      onPress={() => handleEditTransaction(item)}
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="receipt-outline" 
        size={64} 
        color={theme.colors.textSecondary} 
      />
      <Text style={styles.emptyText}>
        No transactions yet.{'\n'}Tap the + button to add your first transaction!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Expense Tracker</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(totalBalance, settings.currency)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditTransaction(undefined);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      <AddTransactionModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditTransaction(undefined);
        }}
        onSave={handleSaveTransaction}
        editTransaction={editTransaction}
      />
    </View>
  );
};