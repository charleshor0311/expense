import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { VictoryPie, VictoryChart, VictoryBar, VictoryTheme, VictoryAxis } from 'victory-native';
import { useTheme } from '../context/ThemeContext';
import { Transaction, Settings, ChartData } from '../types';
import { databaseService } from '../services/DatabaseService';
import { formatCurrency } from '../services/CurrencyService';
import { ALL_CATEGORIES } from '../constants/Categories';

const { width: screenWidth } = Dimensions.get('window');

export const DashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<Settings>({
    currency: 'MYR',
    language: 'en',
    theme: 'system',
    isPremium: false,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [monthlyData, setMonthlyData] = useState<{
    totalIncome: number;
    totalExpenses: number;
    categoryBreakdown: { category: string; amount: number; color: string }[];
    monthlyTrend: ChartData[];
  }>({
    totalIncome: 0,
    totalExpenses: 0,
    categoryBreakdown: [],
    monthlyTrend: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [transactionsData, settingsData] = await Promise.all([
        databaseService.getTransactions(),
        databaseService.getSettings(),
      ]);
      
      setTransactions(transactionsData);
      setSettings(settingsData);
      processData(transactionsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const processData = (transactionList: Transaction[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Filter current month transactions
    const currentMonthTransactions = transactionList.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    // Calculate totals
    const totalIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryMap = new Map<string, number>();
    currentMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.amount);
      });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, amount]) => {
      const categoryInfo = ALL_CATEGORIES.find(cat => cat.name === category);
      return {
        category,
        amount,
        color: categoryInfo?.color || theme.colors.accent,
      };
    }).sort((a, b) => b.amount - a.amount);

    // Monthly trend (last 6 months)
    const monthlyTrend = generateMonthlyTrend(transactionList);

    setMonthlyData({
      totalIncome,
      totalExpenses,
      categoryBreakdown,
      monthlyTrend,
    });
  };

  const generateMonthlyTrend = (transactionList: Transaction[]): ChartData[] => {
    const now = new Date();
    const monthsData: ChartData[] = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = targetDate.toLocaleDateString('en-US', { month: 'short' });
      
      const monthTransactions = transactionList.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === targetDate.getMonth() && 
               transactionDate.getFullYear() === targetDate.getFullYear();
      });

      const totalExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      monthsData.push({
        x: monthName,
        y: totalExpenses,
      });
    }

    return monthsData;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
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
    scrollView: {
      flex: 1,
    },
    section: {
      backgroundColor: theme.colors.surface,
      margin: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    summaryLabel: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    summaryAmount: {
      fontSize: theme.fontSize.md,
      fontWeight: '600',
    },
    incomeAmount: {
      color: theme.colors.income,
    },
    expenseAmount: {
      color: theme.colors.expense,
    },
    netAmount: {
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    chartContainer: {
      alignItems: 'center',
      marginVertical: theme.spacing.md,
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    categoryColor: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: theme.spacing.md,
    },
    categoryName: {
      flex: 1,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    categoryAmount: {
      fontSize: theme.fontSize.md,
      fontWeight: '600',
      color: theme.colors.expense,
    },
    categoryPercentage: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
    },
  });

  const pieData = monthlyData.categoryBreakdown.map(item => ({
    x: item.category,
    y: item.amount,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Monthly Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Income</Text>
            <Text style={[styles.summaryAmount, styles.incomeAmount]}>
              +{formatCurrency(monthlyData.totalIncome, settings.currency)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={[styles.summaryAmount, styles.expenseAmount]}>
              -{formatCurrency(monthlyData.totalExpenses, settings.currency)}
            </Text>
          </View>
          <View style={[styles.summaryRow, { paddingTop: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border }]}>
            <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>Net Amount</Text>
            <Text style={[styles.summaryAmount, styles.netAmount]}>
              {formatCurrency(monthlyData.totalIncome - monthlyData.totalExpenses, settings.currency)}
            </Text>
          </View>
        </View>

        {/* Spending Trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6-Month Spending Trend</Text>
          <View style={styles.chartContainer}>
            <VictoryChart
              theme={VictoryTheme.material}
              width={screenWidth - 60}
              height={200}
              padding={{ left: 60, top: 20, right: 20, bottom: 40 }}
            >
              <VictoryAxis dependentAxis />
              <VictoryAxis />
              <VictoryBar
                data={monthlyData.monthlyTrend}
                style={{
                  data: { fill: theme.colors.primary }
                }}
              />
            </VictoryChart>
          </View>
        </View>

        {/* Category Breakdown */}
        {monthlyData.categoryBreakdown.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
            
            <View style={styles.chartContainer}>
              <VictoryPie
                data={pieData}
                width={screenWidth - 60}
                height={200}
                colorScale={monthlyData.categoryBreakdown.map(item => item.color)}
                labelRadius={({ innerRadius }) => innerRadius as number + 30}
                innerRadius={40}
                padAngle={2}
                labelComponent={<></>}
              />
            </View>

            {monthlyData.categoryBreakdown.map((item, index) => {
              const percentage = ((item.amount / monthlyData.totalExpenses) * 100).toFixed(1);
              return (
                <View key={index} style={styles.categoryItem}>
                  <View 
                    style={[styles.categoryColor, { backgroundColor: item.color }]} 
                  />
                  <Text style={styles.categoryName}>{item.category}</Text>
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(item.amount, settings.currency)}
                  </Text>
                  <Text style={styles.categoryPercentage}>
                    ({percentage}%)
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};