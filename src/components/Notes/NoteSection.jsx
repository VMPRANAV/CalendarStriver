import { useLocalStorage } from '../../hooks/useLocalStorage';
import { StickyNote } from 'lucide-react';

export const NoteSection = () => {
  const [note, setNote] = useLocalStorage('calendar-note', '');

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 text-gray-500">
        <StickyNote size={18} />
        <h3 className="font-bold text-xs uppercase tracking-widest">Monthly Memos</h3>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Type your notes here..."
        className="flex-1 w-full p-4 bg-yellow-50/50 rounded-lg border-2 border-dashed border-yellow-200/50 
                   resize-none focus:outline-none focus:border-yellow-400 transition-colors 
                   text-gray-700 font-medium italic leading-relaxed"
      />
      <p className="text-[10px] text-gray-400 mt-2 text-right italic">
        *Saved automatically to local storage
      </p>
    </div>
  );
};