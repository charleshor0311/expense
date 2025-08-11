import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { TabNavigator } from './src/navigation/TabNavigator';
import { databaseService } from './src/services/DatabaseService';
import { insertSampleData } from './src/services/SampleDataService';
import { shortcutsService } from './src/services/ShortcutsService';

const AppContent: React.FC = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    initializeApp();
    
    // Setup iOS Shortcuts integration
    shortcutsService.setupShortcutsIntegration();
    
    // Cleanup on unmount
    return () => {
      shortcutsService.cleanup();
    };
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database
      await databaseService.init();
      
      // Insert sample data if needed
      await insertSampleData();
      
      console.log('App initialized successfully');
    } catch (error) {
      console.error('App initialization error:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <TabNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}