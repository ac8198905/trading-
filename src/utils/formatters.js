// Currency, percentage, and number formatting helpers

export const formatINR = (value, showDecimals = true) => {
  if (value === undefined || value === null || isNaN(value)) return "₹0.00";
  const num = Number(value);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(num);
};

export const formatNumber = (value) => {
  if (value === undefined || value === null || isNaN(value)) return "0";
  return new Intl.NumberFormat("en-IN").format(value);
};

export const formatPercent = (value) => {
  if (value === undefined || value === null || isNaN(value)) return "0.00%";
  const num = Number(value);
  const sign = num > 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
};

export const formatChange = (value) => {
  if (value === undefined || value === null || isNaN(value)) return "0.00";
  const num = Number(value);
  const sign = num > 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}`;
};
