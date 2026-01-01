'use client';

import { useTheme } from '@/hooks/useTheme';
import type { ThemeMode } from '@/types/theme';

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, targetMode: ThemeMode) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setMode(targetMode);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const modes: ThemeMode[] = ['light', 'auto', 'dark'];
      const currentIndex = modes.indexOf(mode);
      const nextIndex = (currentIndex + 1) % modes.length;
      const nextMode = modes[nextIndex];
      if (nextMode) {
        setMode(nextMode);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const modes: ThemeMode[] = ['light', 'auto', 'dark'];
      const currentIndex = modes.indexOf(mode);
      const prevIndex = (currentIndex - 1 + modes.length) % modes.length;
      const prevMode = modes[prevIndex];
      if (prevMode) {
        setMode(prevMode);
      }
    }
  };

  const buttonBaseClasses = 'px-4 py-2 text-sm font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';
  const activeClasses = 'bg-primary text-white';
  const inactiveClasses = 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary';

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className="inline-flex rounded-lg bg-surface-secondary p-1 gap-1"
    >
      <div
        role="radio"
        aria-checked={mode === 'light'}
        tabIndex={mode === 'light' ? 0 : -1}
        onClick={() => setMode('light')}
        onKeyDown={(e) => handleKeyDown(e, 'light')}
        className={`${buttonBaseClasses} ${mode === 'light' ? activeClasses : inactiveClasses} cursor-pointer`}
      >
        Light
      </div>
      <div
        role="radio"
        aria-checked={mode === 'auto'}
        tabIndex={mode === 'auto' ? 0 : -1}
        onClick={() => setMode('auto')}
        onKeyDown={(e) => handleKeyDown(e, 'auto')}
        className={`${buttonBaseClasses} ${mode === 'auto' ? activeClasses : inactiveClasses} cursor-pointer`}
      >
        Auto
      </div>
      <div
        role="radio"
        aria-checked={mode === 'dark'}
        tabIndex={mode === 'dark' ? 0 : -1}
        onClick={() => setMode('dark')}
        onKeyDown={(e) => handleKeyDown(e, 'dark')}
        className={`${buttonBaseClasses} ${mode === 'dark' ? activeClasses : inactiveClasses} cursor-pointer`}
      >
        Dark
      </div>
    </div>
  );
}
