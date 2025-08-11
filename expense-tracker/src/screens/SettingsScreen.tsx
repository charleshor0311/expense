import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Settings } from '../types';
import { databaseService } from '../services/DatabaseService';
import { CURRENCIES } from '../services/CurrencyService';

export const SettingsScreen: React.FC = () => {
  const { theme, themeMode, setTheme: setAppTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>({
    currency: 'MYR',
    language: 'en',
    theme: 'system',
    isPremium: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsData = await databaseService.getSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key: keyof Settings, value: any) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);
      await databaseService.updateSettings({ [key]: value });
      
      if (key === 'theme') {
        setAppTheme(value);
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      Alert.alert('Error', 'Failed to update setting');
    }
  };

  const showCurrencyPicker = () => {
    const currencyOptions = Object.entries(CURRENCIES).map(([code, info]) => ({
      text: `${info.name} (${info.symbol})`,
      onPress: () => updateSetting('currency', code),
    }));

    Alert.alert(
      'Select Currency',
      'Choose your preferred currency',
      [
        ...currencyOptions,
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const showThemePicker = () => {
    Alert.alert(
      'Select Theme',
      'Choose your preferred theme',
      [
        {
          text: 'Light',
          onPress: () => updateSetting('theme', 'light'),
        },
        {
          text: 'Dark',
          onPress: () => updateSetting('theme', 'dark'),
        },
        {
          text: 'System',
          onPress: () => updateSetting('theme', 'system'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const showLanguagePicker = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        {
          text: 'English',
          onPress: () => updateSetting('language', 'en'),
        },
        {
          text: 'Bahasa Malaysia',
          onPress: () => updateSetting('language', 'ms'),
        },
        {
          text: 'Chinese (Simplified)',
          onPress: () => updateSetting('language', 'zh'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature allows you to export your transaction data as a CSV file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Export data feature would be implemented here') },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your transactions. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: () => console.log('Clear data feature would be implemented here') 
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
    scrollView: {
      flex: 1,
    },
    section: {
      backgroundColor: theme.colors.surface,
      margin: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
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
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingIcon: {
      marginRight: theme.spacing.md,
    },
    settingContent: {
      flex: 1,
    },
    settingLabel: {
      fontSize: theme.fontSize.md,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    settingValue: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    settingArrow: {
      marginLeft: theme.spacing.sm,
    },
    premiumBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      marginLeft: theme.spacing.sm,
    },
    premiumText: {
      color: 'white',
      fontSize: theme.fontSize.xs,
      fontWeight: 'bold',
    },
    versionText: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.sm,
      padding: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
  });

  const getThemeDisplayName = (themeValue: string) => {
    switch (themeValue) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'Follow System';
      default: return 'System';
    }
  };

  const getLanguageDisplayName = (languageValue: string) => {
    switch (languageValue) {
      case 'en': return 'English';
      case 'ms': return 'Bahasa Malaysia';
      case 'zh': return 'Chinese (Simplified)';
      default: return 'English';
    }
  };

  const getCurrencyDisplayName = (currencyCode: string) => {
    const currency = CURRENCIES[currencyCode as keyof typeof CURRENCIES];
    return currency ? `${currency.name} (${currency.symbol})` : currencyCode;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={showCurrencyPicker}>
            <Ionicons 
              name="card-outline" 
              size={24} 
              color={theme.colors.textSecondary} 
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Currency</Text>
              <Text style={styles.settingValue}>
                {getCurrencyDisplayName(settings.currency)}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.textSecondary} 
              style={styles.settingArrow}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={showLanguagePicker}>
            <Ionicons 
              name="language-outline" 
              size={24} 
              color={theme.colors.textSecondary} 
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingValue}>
                {getLanguageDisplayName(settings.language)}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.textSecondary} 
              style={styles.settingArrow}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={showThemePicker}>
            <Ionicons 
              name="contrast-outline" 
              size={24} 
              color={theme.colors.textSecondary} 
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingValue}>
                {getThemeDisplayName(themeMode)}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.textSecondary} 
              style={styles.settingArrow}
            />
          </TouchableOpacity>
        </View>

        {/* Premium Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          
          <View style={styles.settingItem}>
            <Ionicons 
              name="sparkles-outline" 
              size={24} 
              color={theme.colors.primary} 
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.settingLabel}>AI Expense Tracker</Text>
                {settings.isPremium && (
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumText}>PRO</Text>
                  </View>
                )}
              </View>
              <Text style={styles.settingValue}>
                {settings.isPremium ? 'Available' : 'Upgrade to Premium'}
              </Text>
            </View>
            <Switch
              value={settings.isPremium}
              onValueChange={(value) => updateSetting('isPremium', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={settings.isPremium ? 'white' : theme.colors.textSecondary}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
            <Ionicons 
              name="download-outline" 
              size={24} 
              color={theme.colors.textSecondary} 
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Export Data</Text>
              <Text style={styles.settingValue}>Save your data as CSV</Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.textSecondary} 
              style={styles.settingArrow}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
            <Ionicons 
              name="trash-outline" 
              size={24} 
              color={theme.colors.error} 
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.colors.error }]}>
                Clear All Data
              </Text>
              <Text style={styles.settingValue}>Permanently delete all transactions</Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.error} 
              style={styles.settingArrow}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>
          Expense Tracker v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};