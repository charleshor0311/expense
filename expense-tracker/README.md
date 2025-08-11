# Expense Tracker - Cross-Platform Mobile App

A modern, offline-first expense tracking application built with React Native and Expo. This app provides a beautiful, user-friendly interface for managing personal finances with advanced features like AI-powered receipt scanning (Premium) and comprehensive analytics.

## 🌟 Features

### Core Features
- **Offline-First Architecture**: All data stored locally using SQLite
- **Timeline View**: Modern transaction list sorted by creation time
- **Category Management**: Color-coded expense and income categories
- **Dashboard Analytics**: Monthly summaries, spending trends, and category breakdowns
- **Multi-Currency Support**: Support for MYR, USD, EUR, GBP, JPY, SGD, THB, IDR
- **Theme Support**: Light, dark, and system theme modes
- **Multi-Language**: English, Bahasa Malaysia, Chinese (Simplified)

### Premium Features
- **AI Expense Analysis**: Screenshot-based transaction extraction (iOS Shortcuts integration)
- **Smart Receipt Scanner**: OCR-powered receipt digitization
- **Advanced Analytics**: Predictive spending insights
- **Cloud Backup**: Secure synchronization across devices
- **Smart Notifications**: Intelligent spending alerts
- **Advanced Exports**: PDF, Excel, and JSON export formats

### Technical Features
- **Cross-Platform**: Works on both iOS and Android
- **In-App Purchases**: Platform-specific billing integration
- **iOS Shortcuts**: AI-powered expense analysis via Shortcuts app
- **Secure Storage**: Encrypted local database
- **Responsive Design**: Optimized for all screen sizes

## 🏗 Architecture

### Project Structure
```
expense-tracker/
├── src/
│   ├── components/          # Reusable UI components
│   ├── constants/           # App constants and configurations
│   ├── context/            # React Context providers
│   ├── navigation/         # Navigation setup
│   ├── screens/            # Main app screens
│   ├── services/           # Business logic and external integrations
│   └── types/              # TypeScript type definitions
├── assets/                 # Static assets
└── App.tsx                 # Main app entry point
```

### Key Services
- **DatabaseService**: SQLite operations for transactions and settings
- **CurrencyService**: Multi-currency formatting and conversion
- **InAppPurchaseService**: Platform-specific purchase handling
- **ShortcutsService**: iOS Shortcuts integration for AI features
- **SampleDataService**: Development data generation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (for iOS development)
- Android Studio and Android Emulator (for Android development)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on your preferred platform:
   - **iOS**: Press `i` or scan QR code with iPhone Camera
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w` (limited functionality)

### Building for Production

#### iOS
```bash
# Build for iOS App Store
npx expo build:ios --type app-store

# Build for iOS Simulator
npx expo build:ios --type simulator
```

#### Android
```bash
# Build APK
npx expo build:android --type apk

# Build for Google Play Store
npx expo build:android --type app-bundle
```

## 🎨 Design System

### Color Palette
- **Primary**: #FF6B9D (Warm Pink)
- **Secondary**: #4ECDC4 (Teal)
- **Accent**: #45B7D1 (Blue)
- **Success**: #6BCF7F (Green)
- **Warning**: #FDCB6E (Yellow)
- **Error**: #E17055 (Orange-Red)

### Typography
- **Font Family**: Inter (Rounded, friendly aesthetic)
- **Scale**: 12px (xs) to 32px (xxl)
- **Weights**: Regular, Medium, SemiBold, Bold

### Spacing System
- **8px base unit**: xs(4), sm(8), md(16), lg(24), xl(32), xxl(48)

## 📱 Platform-Specific Features

### iOS Features
- **StoreKit Integration**: Native in-app purchases
- **Shortcuts Integration**: AI-powered expense analysis
- **Native Haptic Feedback**: Enhanced user experience
- **iOS Design Guidelines**: Platform-specific UI patterns

### Android Features
- **Google Play Billing**: Native purchase handling
- **Material Design**: Android-specific components
- **Back Button Handling**: Native navigation patterns
- **Adaptive Icons**: Dynamic icon theming

## 🔒 Security & Privacy

### Data Security
- **Local-Only Storage**: No cloud data collection
- **SQLite Encryption**: Secure local database
- **Secure Storage**: Encrypted sensitive settings
- **No Analytics Tracking**: Complete user privacy

### Purchase Security
- **Platform Verification**: Native receipt validation
- **Secure Transactions**: Platform-managed billing
- **Purchase Restoration**: Cross-device purchase recovery

## 🤖 AI Features (Premium)

### iOS Shortcuts Integration
The app includes a comprehensive iOS Shortcuts integration that enables:

1. **Screenshot Capture**: Automatic screen capture for analysis
2. **AI Processing Stub**: Prepared for future ML model integration
3. **Data Extraction**: Mock transaction data extraction
4. **Local Storage**: Secure local data persistence

### Usage
1. Open iOS Shortcuts app
2. Create new shortcut with "Open App" action pointing to Expense Tracker
3. Add custom URL scheme: `expense-tracker://process-ai-screenshot`
4. Run shortcut to trigger AI analysis workflow

## 📊 Analytics & Insights

### Dashboard Features
- **Monthly Overview**: Income vs. expenses breakdown
- **Category Analysis**: Pie charts with percentage breakdowns
- **Spending Trends**: 6-month spending history
- **Interactive Charts**: Touch-enabled data exploration

### Data Visualization
- **Victory Native**: High-performance chart library
- **Responsive Charts**: Adapts to screen sizes
- **Custom Styling**: Brand-consistent visualization
- **Real-time Updates**: Dynamic data refresh

## 🌍 Internationalization

### Supported Languages
- **English** (en): Default language
- **Bahasa Malaysia** (ms): Malaysian localization
- **Chinese Simplified** (zh): Chinese market support

### Currency Support
- **Primary**: Malaysian Ringgit (MYR)
- **Global**: USD, EUR, GBP, JPY, SGD, THB, IDR
- **Formatting**: Locale-aware currency display
- **Symbol Display**: Native currency symbols

## 🔧 Development Notes

### State Management
- **React Context**: Theme and settings management
- **Local State**: Component-level state with hooks
- **Database State**: SQLite as single source of truth

### Performance Optimizations
- **Lazy Loading**: Screen-level code splitting
- **Memoization**: Expensive calculation caching
- **Efficient Rendering**: FlatList virtualization
- **Image Optimization**: Asset compression and caching

### Testing Recommendations
```bash
# Unit tests
npm run test

# E2E tests (requires setup)
npm run test:e2e

# Type checking
npm run type-check
```

## 📦 Dependencies

### Core Dependencies
- **expo**: Development platform
- **react-native**: Cross-platform framework
- **@react-navigation**: Navigation system
- **expo-sqlite**: Local database
- **victory-native**: Chart visualization

### Platform-Specific
- **expo-store-kit**: iOS in-app purchases
- **expo-secure-store**: Encrypted storage
- **react-native-reanimated**: Smooth animations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent formatting
- **Conventional Commits**: Structured commit messages

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🆘 Support

For support, please create an issue in the repository or contact the development team.

### Common Issues
- **Build Failures**: Ensure all dependencies are installed
- **Database Errors**: Clear app data and restart
- **Purchase Issues**: Verify platform-specific configuration

---

**Made with ❤️ using React Native and Expo**