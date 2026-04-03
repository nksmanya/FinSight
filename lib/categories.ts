export const categoryColors: Record<string, string> = {
  Housing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Groceries: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  Dining: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  Transport: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  Entertainment: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  Income: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  Health: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  Shopping: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
};

const defaultColor = 'bg-gray-500/10 text-gray-500 border-gray-500/20 dark:text-gray-400';

export function getCategoryColorClass(category: string): string {
  // Try exact match
  if (categoryColors[category]) {
    return categoryColors[category];
  }
  
  // Try case-insensitive matching
  const normalizedCategory = category.toLowerCase();
  const matchedKey = Object.keys(categoryColors).find(
    (key) => key.toLowerCase() === normalizedCategory
  );
  
  return matchedKey ? categoryColors[matchedKey] : defaultColor;
}
