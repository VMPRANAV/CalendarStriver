import { useState } from 'react';
import { isAfter, isBefore, isSameDay } from 'date-fns';

export const useCalendarRange = () => {
  const [range, setRange] = useState({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState(null);

  const handleDateClick = (date) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: date, end: null });
    } else if (isBefore(date, range.start)) {
      setRange({ start: date, end: null });
    } else if (isSameDay(date, range.start)) {
      setRange({ start: null, end: null });
    } else {
      setRange({ ...range, end: date });
    }
  };

  return { range, hoverDate, setHoverDate, handleDateClick };
};