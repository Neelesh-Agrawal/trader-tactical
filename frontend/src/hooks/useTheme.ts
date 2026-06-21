export const useTheme = () => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
  }

  return { theme: 'light' as const, toggleTheme: () => {}, isDark: false };
};
