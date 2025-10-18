export const formatNumber = (value: string | number): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "0.00";
  }

  return numValue.toFixed(2);
};

export const formatCurrency = (
  value: string | number,
  currency?: string
): string => {
  const formatted = formatNumber(value);
  return currency ? `${formatted} ${currency}` : formatted;
};
