export const getMonthDateRange = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return { firstDay, lastDay };
};

export const getPreviousMonthDateRange = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  return { firstDay, lastDay };
};

export const calculatePercentageChange = (current: number, previous: number): { value: number, trend: 'up' | 'down' } => {
  if (previous === 0) return { value: 0, trend: 'up' };
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(change * 10) / 10),
    trend: change >= 0 ? 'up' : 'down'
  };
};
