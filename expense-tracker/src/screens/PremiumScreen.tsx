import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { inAppPurchaseService } from '../services/InAppPurchaseService';
import { databaseService } from '../services/DatabaseService';

interface PremiumFeature {
  icon: string;
  title: string;
  description: string;
}

export const PremiumScreen: React.FC = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    checkPremiumStatus();
    initializePurchases();
  }, []);

  const initializePurchases = async () => {
    try {
      await inAppPurchaseService.initializePurchases();
    } catch (error) {
      console.error('Failed to initialize purchases:', error);
    }
  };

  const checkPremiumStatus = async () => {
    try {
      const settings = await databaseService.getSettings();
      setIsPremium(settings.isPremium);
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const success = await inAppPurchaseService.purchasePremium();
      if (success) {
        await databaseService.updateSettings({ isPremium: true });
        setIsPremium(true);
        Alert.alert(
          'Purchase Successful!',
          'Welcome to Premium! You now have access to all premium features.'
        );
      } else {
        Alert.alert('Purchase Failed', 'Unable to complete the purchase. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'An error occurred during purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      const success = await inAppPurchaseService.restorePurchases();
      if (success) {
        await databaseService.updateSettings({ isPremium: true });
        setIsPremium(true);
        Alert.alert('Restore Successful!', 'Your premium features have been restored.');
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases were found to restore.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'An error occurred while restoring purchases.');
    } finally {
      setIsLoading(false);
    }
  };

  const premiumFeatures: PremiumFeature[] = [
    {
      icon: 'sparkles',
      title: 'AI Expense Analysis',
      description: 'Take screenshots of receipts and let AI automatically extract and categorize your expenses',
    },
    {
      icon: 'camera',
      title: 'Smart Receipt Scanner',
      description: 'Instantly scan and digitize physical receipts with advanced OCR technology',
    },
    {
      icon: 'trending-up',
      title: 'Advanced Analytics',
      description: 'Get detailed insights into your spending patterns with predictive analytics',
    },
    {
      icon: 'sync',
      title: 'Cloud Backup',
      description: 'Secure cloud storage and synchronization across all your devices',
    },
    {
      icon: 'notifications',
      title: 'Smart Notifications',
      description: 'Intelligent spending alerts and budget recommendations based on your habits',
    },
    {
      icon: 'share',
      title: 'Advanced Exports',
      description: 'Export detailed reports in multiple formats including PDF, Excel, and JSON',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    gradient: {
      paddingTop: 60,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    headerIcon: {
      marginBottom: theme.spacing.md,
    },
    headerTitle: {
      fontSize: theme.fontSize.xxl,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    headerSubtitle: {
      fontSize: theme.fontSize.md,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
      lineHeight: 22,
    },
    scrollView: {
      flex: 1,
    },
    featuresContainer: {
      padding: theme.spacing.md,
    },
    featureItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    featureIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    featureContent: {
      flex: 1,
    },
    featureTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    featureDescription: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      lineHeight: 18,
    },
    pricingContainer: {
      backgroundColor: theme.colors.surface,
      margin: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      alignItems: 'center',
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    priceText: {
      fontSize: theme.fontSize.xxl,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    priceDescription: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
    },
    purchaseButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 50,
      width: '100%',
      marginBottom: theme.spacing.md,
    },
    purchaseButtonText: {
      color: 'white',
      fontSize: theme.fontSize.md,
      fontWeight: 'bold',
    },
    restoreButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
    },
    restoreButtonText: {
      color: theme.colors.primary,
      fontSize: theme.fontSize.sm,
      fontWeight: '600',
    },
    premiumBadge: {
      backgroundColor: theme.colors.success,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    premiumBadgeText: {
      color: 'white',
      fontSize: theme.fontSize.md,
      fontWeight: 'bold',
    },
    footer: {
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    footerText: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 16,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="diamond" size={64} color="white" />
          </View>
          <Text style={styles.headerTitle}>Upgrade to Premium</Text>
          <Text style={styles.headerSubtitle}>
            Unlock powerful AI features and advanced analytics to take control of your finances
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.featuresContainer}>
          {premiumFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Ionicons 
                  name={feature.icon as any} 
                  size={24} 
                  color="white" 
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.pricingContainer}>
          {isPremium ? (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>✨ Premium Active ✨</Text>
            </View>
          ) : (
            <>
              <Text style={styles.priceText}>$4.99</Text>
              <Text style={styles.priceDescription}>One-time purchase • Lifetime access</Text>
              
              <TouchableOpacity
                style={styles.purchaseButton}
                onPress={handlePurchase}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.purchaseButtonText}>Upgrade Now</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.restoreButton}
                onPress={handleRestore}
                disabled={isLoading}
              >
                <Text style={styles.restoreButtonText}>Restore Purchases</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            • No subscription required • One-time payment • Cancel anytime{'\n'}
            • Secure payment processing • 7-day money-back guarantee
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};