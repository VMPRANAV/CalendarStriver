import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageAnchor } from '../Hero/ImageAnchor';
import { SpiralBinder } from './SpiralBinder';
import { useCalendarRange } from '../../hooks/useCalendarRange';
import { Header } from './Header';
import { DayGrid } from './DayGrid';
import { NoteSection } from '../Notes/NoteSection';

const pageVariants = {
  enter: (direction) => ({
    rotateX: direction > 0 ? -70 : 70,
    opacity: 0,
    y: direction > 0 ? -24 : 24,
    scale: 0.985,
  }),
  center: {
    rotateX: 0,
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  exit: (direction) => ({
    rotateX: direction > 0 ? 70 : -70,
    opacity: 0,
    y: direction > 0 ? 24 : -24,
    transition: {
      duration: 0.38,
      ease: 'easeIn',
    },
  }),
};

export default function CalendarRoot() {
  const [currentDate, setCurrentDate] = useState(new Date(2022, 0, 1)); // January 2022 as per prompt
  const [transitionDirection, setTransitionDirection] = useState(1);
  const { range, handleDateClick } = useCalendarRange();

  const handlePrevMonth = () => {
    setTransitionDirection(-1);
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setTransitionDirection(1);
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate))
  });

  const monthKey = format(currentDate, 'yyyy-MM');

  return (
    <div className="calendar-container mx-auto my-12 relative max-w-6xl min-h-[600px]" style={{ perspective: '1800px' }}>
      <AnimatePresence mode="wait" custom={transitionDirection} initial={false}>
        <motion.div
          key={monthKey}
          custom={transitionDirection}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ transformStyle: 'preserve-3d', transformOrigin: 'top center' }}
          className="relative"
        >
          <SpiralBinder />
          <div className="flex flex-col md:flex-row min-h-[600px]">
            {/* Left Panel: Hero */}
            <div className="md:w-5/12 border-r border-[var(--border)] bg-gray-100">
              <ImageAnchor currentMonth={format(currentDate, 'MMMM')} />
            </div>

            {/* Right Panel: Functional Grid */}
            <div className="md:w-7/12 p-4 md:p-10 flex flex-col">
              <Header currentDate={currentDate} onPrev={handlePrevMonth} onNext={handleNextMonth} />
              <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
                <div className="lg:col-span-2">
                  <DayGrid days={days} range={range} onDateClick={handleDateClick} currentMonth={currentDate.getMonth()} />
                </div>
                <div className="border-t lg:border-t-0 lg:border-l border-[var(--border)] pt-8 lg:pt-0 lg:pl-8">
                  <NoteSection />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}