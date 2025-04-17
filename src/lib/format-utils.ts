
/**
 * Format a numeric value with the appropriate suffix based on the value type
 */
export const formatValue = (value: number, type?: string): string => {
  if (typeof value !== 'number') return String(value);
  
  // Format based on metric type
  if (type === 'revenue' || type === 'adSpend') {
    return formatCurrency(value);
  } else if (type === 'conversionRate' || type === 'acos' || type === 'tacos') {
    return formatPercentage(value);
  } else if (type === 'sessions' || type === 'unitsSold' || type === 'dos' || type === 'deals') {
    return formatNumber(value);
  } else {
    return formatNumber(value);
  }
};

/**
 * Format a number with thousand separators
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a number as currency
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Format a number as percentage
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

/**
 * Format a date for display
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormatter('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Generate a realistic value based on a base value and date
 * This creates somewhat realistic data patterns with weekly cycles
 */
export const generateRealisticValue = (
  baseValue: number,
  date: Date,
  volatility: number = 0.1,
  trend: number = 0.001,
  weekendEffect: number = 0.2
): number => {
  // Create a deterministic but seemingly random value based on the date
  const dateValue = date.getDate() + date.getMonth() * 30;
  const dayOfWeek = date.getDay();
  
  // Add some weekly seasonality (weekend dips for most metrics)
  const weekendImpact = (dayOfWeek === 0 || dayOfWeek === 6) ? -weekendEffect : 0;
  
  // Add some noise based on the date
  const noise = Math.sin(dateValue * 0.1) * volatility + Math.cos(dateValue * 0.3) * volatility * 0.5;
  
  // Add a small trend over time
  const trendFactor = trend * dateValue;
  
  // Combine all factors
  const adjustedValue = baseValue * (1 + noise + weekendImpact + trendFactor);
  
  // Ensure the value is positive and round to 2 decimal places
  return Math.max(0, Math.round(adjustedValue * 100) / 100);
};
