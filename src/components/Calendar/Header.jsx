import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Moon, Sun } from 'lucide-react';

export const Header = ({ currentDate, onPrev, onNext, theme, onToggleTheme }) => {
  return (
    <div className="flex justify-between items-center mb-8 px-2">
      <div className="flex flex-col">
        <h2 className="text-4xl font-black tracking-tighter text-[var(--text-h)]">
          {format(currentDate, 'yyyy')}
        </h2>
        <span className="text-sm font-bold uppercase tracking-widest text-[var(--accent)]">
          {format(currentDate, 'MMMM')}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--button-hover)]"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous month"
          className="rounded-full border border-[var(--border)] p-2 text-[var(--text-h)] transition-colors hover:bg-[var(--button-hover)]"
        >
          <ChevronUp size={20} />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next month"
          className="rounded-full border border-[var(--border)] p-2 text-[var(--text-h)] transition-colors hover:bg-[var(--button-hover)]"
        >
          <ChevronDown size={20} />
        </button>
      </div>
    </div>
  );
};
