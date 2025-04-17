
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
