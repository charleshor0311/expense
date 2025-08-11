export const CURRENCIES = {
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', code: 'MYR' },
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', code: 'SGD' },
  THB: { symbol: '฿', name: 'Thai Baht', code: 'THB' },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', code: 'IDR' },
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = CURRENCIES[currencyCode as keyof typeof CURRENCIES];
  if (!currency) return `${amount.toFixed(2)}`;
  
  return `${currency.symbol}${amount.toFixed(2)}`;
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = CURRENCIES[currencyCode as keyof typeof CURRENCIES];
  return currency ? currency.symbol : currencyCode;
};