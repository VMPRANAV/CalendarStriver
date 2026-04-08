import { DayCell } from './DayCell';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const DayGrid = ({ days, range, onDateClick, currentMonth }) => {
  return (
    <div className="grid grid-cols-7 gap-y-1">
      {WEEKDAYS.map((day) => (
        <div key={day} className="text-center text-[10px] font-bold text-gray-400 mb-4 tracking-widest">
          {day}
        </div>
      ))}
      {days.map((day) => (
        <DayCell
          key={day.toString()}
          date={day}
          range={range}
          onSelect={onDateClick}
          isCurrentMonth={day.getMonth() === currentMonth}
        />
      ))}
    </div>
  );
};