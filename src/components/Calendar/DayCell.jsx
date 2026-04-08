import { isSameDay, isWithinInterval, format } from 'date-fns';
import { clsx } from 'clsx';

export const DayCell = ({ date, range, onSelect, isCurrentMonth }) => {
  const isStart = range.start && isSameDay(date, range.start);
  const isEnd = range.end && isSameDay(date, range.end);
  const isBetween = range.start && range.end && isWithinInterval(date, { start: range.start, end: range.end });

  return (
    <button
      onClick={() => onSelect(date)}
      disabled={!isCurrentMonth}
      className={clsx(
        "day-cell h-14 w-full relative flex items-center justify-center text-lg transition-all duration-300",
        !isCurrentMonth && "opacity-10 pointer-events-none",
        (isBetween || isStart || isEnd) && "bg-[var(--accent)] text-white z-10",
        (isStart || isEnd) && "shadow-lg scale-105",
        (isStart && !isEnd) && "rounded-l-xl",
        (isEnd && !isStart) && "rounded-r-xl",
        (isStart && isEnd) && "rounded-xl" // Single day selection
      )}
    >
      <span className="relative z-10">{format(date, 'd')}</span>
      {/* Visual pulse for the selected start date */}
      {isStart && !range.end && <span className="absolute inset-0 selection-pulse rounded-full" />}
    </button>
  );
};