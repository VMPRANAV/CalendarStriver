import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Header = ({ currentDate, onPrev, onNext }) => {
  return (
    <div className="flex justify-between items-center mb-8 px-2">
      <div className="flex flex-col">
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
          {format(currentDate, 'yyyy')}
        </h2>
        <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
          {format(currentDate, 'MMMM')}
        </span>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={onPrev}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={onNext}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};