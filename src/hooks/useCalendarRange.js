import { useMemo, useState } from 'react';
import { endOfMonth, format, isAfter, isBefore, isSameDay, isWithinInterval, parseISO, startOfMonth } from 'date-fns';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'calendar-notes-v2';

const DEFAULT_NOTE = {
  content: '',
  color: '#a855f7',
  textStyle: 'normal',
};

const EMPTY_MONTH = {
  defaultNote: DEFAULT_NOTE,
  entries: [],
};

const normalizeEntry = (entry) => ({
  ...entry,
  color: entry.color || DEFAULT_NOTE.color,
  textStyle: entry.textStyle || DEFAULT_NOTE.textStyle,
  content: entry.content || '',
});

const getMonthBucket = (store, monthKey) => {
  const monthData = store[monthKey] || EMPTY_MONTH;

  return {
    defaultNote: {
      ...DEFAULT_NOTE,
      ...(monthData.defaultNote || {}),
    },
    entries: (monthData.entries || []).map(normalizeEntry),
  };
};

const sortDates = (firstDate, secondDate) => {
  if (isAfter(firstDate, secondDate)) {
    return { start: secondDate, end: firstDate };
  }

  return { start: firstDate, end: secondDate };
};

export const useCalendarRange = (currentDate) => {
  const monthKey = format(currentDate, 'yyyy-MM');
  const [draftSelection, setDraftSelection] = useState(null);
  const [draftNote, setDraftNote] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState('month-default');
  const [storedNotes, setStoredNotes] = useLocalStorage(STORAGE_KEY, {});

  const monthNotes = useMemo(() => getMonthBucket(storedNotes, monthKey), [storedNotes, monthKey]);

  const updateMonthNotes = (updater) => {
    setStoredNotes((previousStore) => {
      const currentMonthNotes = getMonthBucket(previousStore, monthKey);
      const nextMonthNotes = updater(currentMonthNotes);

      return {
        ...previousStore,
        [monthKey]: nextMonthNotes,
      };
    });
  };

  const currentSelection = useMemo(() => {
    if (!draftSelection?.start) {
      return null;
    }

    return {
      start: draftSelection.start,
      end: draftSelection.end || draftSelection.start,
      mode: draftSelection.mode,
    };
  }, [draftSelection]);

  const activeNote = useMemo(() => {
    if (activeNoteId === 'month-default') {
      return {
        id: 'month-default',
        type: 'month',
        label: `${format(currentDate, 'MMMM yyyy')} Notes`,
        monthKey,
        ...monthNotes.defaultNote,
      };
    }

    if (activeNoteId === 'draft-selection' && draftSelection?.start && draftNote) {
      const startKey = format(draftSelection.start, 'yyyy-MM-dd');
      const endKey = format(draftSelection.end || draftSelection.start, 'yyyy-MM-dd');

      return {
        id: 'draft-selection',
        type: startKey === endKey ? 'single' : 'range',
        label:
          startKey === endKey
            ? format(parseISO(startKey), 'MMM d, yyyy')
            : `${format(parseISO(startKey), 'MMM d')} - ${format(parseISO(endKey), 'MMM d, yyyy')}`,
        startKey,
        endKey,
        ...draftNote,
      };
    }

    const matchedEntry = monthNotes.entries.find((entry) => entry.id === activeNoteId);

    if (!matchedEntry) {
      return {
        id: 'month-default',
        type: 'month',
        label: `${format(currentDate, 'MMMM yyyy')} Notes`,
        monthKey,
        ...monthNotes.defaultNote,
      };
    }

    return {
      ...matchedEntry,
      type: matchedEntry.startKey === matchedEntry.endKey ? 'single' : 'range',
      label:
        matchedEntry.startKey === matchedEntry.endKey
          ? format(parseISO(matchedEntry.startKey), 'MMM d, yyyy')
          : `${format(parseISO(matchedEntry.startKey), 'MMM d')} - ${format(parseISO(matchedEntry.endKey), 'MMM d, yyyy')}`,
    };
  }, [activeNoteId, currentDate, draftNote, draftSelection, monthKey, monthNotes.defaultNote, monthNotes.entries]);

  const entryForDate = (date, prioritizedEntryId) => {
    const matchingEntries = monthNotes.entries.filter((entry) => {
      const start = parseISO(entry.startKey);
      const end = parseISO(entry.endKey);

      return isWithinInterval(date, { start, end });
    });

    if (matchingEntries.length === 0) {
      return null;
    }

    if (prioritizedEntryId) {
      const prioritizedEntry = matchingEntries.find((entry) => entry.id === prioritizedEntryId);

      if (prioritizedEntry) {
        return prioritizedEntry;
      }
    }

    return matchingEntries[matchingEntries.length - 1];
  };

  const handleDateClick = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const existingSingle = monthNotes.entries.find(
      (entry) => entry.startKey === dateKey && entry.endKey === dateKey,
    );
    const isSelectedSingleDate =
      draftSelection?.start &&
      draftSelection?.end &&
      isSameDay(draftSelection.start, draftSelection.end) &&
      isSameDay(date, draftSelection.start);

    if (!draftSelection?.start || draftSelection.mode === 'range') {
      if (existingSingle) {
        setActiveNoteId(existingSingle.id);
        setDraftNote(null);
      } else {
        setDraftNote({
          content: '',
          color: monthNotes.defaultNote.color,
          textStyle: monthNotes.defaultNote.textStyle,
        });
        setActiveNoteId('draft-selection');
      }

      setDraftSelection({ start: date, end: date, mode: 'single' });
      return;
    }

    if (isSelectedSingleDate) {
      setActiveNoteId('month-default');
      setDraftSelection(null);
      setDraftNote(null);
      return;
    }

    if (isSameDay(date, draftSelection.start)) {
      setDraftSelection({ start: date, end: date, mode: 'single' });
      if (existingSingle) {
        setActiveNoteId(existingSingle.id);
        setDraftNote(null);
      } else {
        setActiveNoteId('draft-selection');
        setDraftNote((currentDraft) =>
          currentDraft || {
            content: '',
            color: monthNotes.defaultNote.color,
            textStyle: monthNotes.defaultNote.textStyle,
          },
        );
      }
      return;
    }

    const { start, end } = sortDates(draftSelection.start, date);
    const startKey = format(start, 'yyyy-MM-dd');
    const endKey = format(end, 'yyyy-MM-dd');
    const existingRange = monthNotes.entries.find(
      (entry) => entry.startKey === startKey && entry.endKey === endKey,
    );

    if (existingRange) {
      setActiveNoteId(existingRange.id);
      setDraftNote(null);
    } else {
      setActiveNoteId('draft-selection');
      setDraftNote((currentDraft) =>
        currentDraft || {
          content: '',
          color: monthNotes.defaultNote.color,
          textStyle: monthNotes.defaultNote.textStyle,
        },
      );
    }

    setDraftSelection({ start, end, mode: 'range' });
  };

  const updateActiveNote = (updates) => {
    if (activeNoteId === 'draft-selection') {
      setDraftNote((currentDraft) => ({
        ...(currentDraft || DEFAULT_NOTE),
        ...updates,
      }));
      return;
    }

    if (activeNoteId === 'month-default') {
      updateMonthNotes((currentMonthNotes) => ({
        ...currentMonthNotes,
        defaultNote: {
          ...currentMonthNotes.defaultNote,
          ...updates,
        },
      }));
      return;
    }

    updateMonthNotes((currentMonthNotes) => ({
      ...currentMonthNotes,
      entries: currentMonthNotes.entries.map((entry) =>
        entry.id === activeNoteId ? { ...entry, ...updates } : entry,
      ),
    }));
  };

  const submitActiveNote = () => {
    if (activeNoteId === 'draft-selection') {
      const content = (draftNote?.content || '').trim();

      if (!content || !draftSelection?.start) {
        return;
      }

      const startKey = format(draftSelection.start, 'yyyy-MM-dd');
      const endKey = format(draftSelection.end || draftSelection.start, 'yyyy-MM-dd');
      const entryId = `note-${startKey}-${endKey}`;
      const existingEntry = monthNotes.entries.find(
        (entry) => entry.startKey === startKey && entry.endKey === endKey,
      );

      updateMonthNotes((currentMonthNotes) => ({
        ...currentMonthNotes,
        entries: existingEntry
          ? currentMonthNotes.entries.map((entry) =>
              entry.id === existingEntry.id
                ? {
                    ...entry,
                    id: entryId,
                    startKey,
                    endKey,
                    content: draftNote.content,
                    color: draftNote.color,
                    textStyle: draftNote.textStyle,
                  }
                : entry,
            )
          : [
              ...currentMonthNotes.entries,
              {
                id: entryId,
                startKey,
                endKey,
                content: draftNote.content,
                color: draftNote.color,
                textStyle: draftNote.textStyle,
              },
            ],
      }));

      setActiveNoteId('month-default');
      setDraftSelection(null);
      setDraftNote(null);
      return;
    }

    if (activeNoteId !== 'month-default') {
      setMonthDefaultActive();
      return;
    }

    const content = monthNotes.defaultNote.content.trim();

    if (!content) {
      return;
    }

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startKey = format(monthStart, 'yyyy-MM-dd');
    const endKey = format(monthEnd, 'yyyy-MM-dd');
    const monthRangeId = `note-${startKey}-${endKey}`;
    const existingMonthRange = monthNotes.entries.find(
      (entry) => entry.startKey === startKey && entry.endKey === endKey,
    );

    updateMonthNotes((currentMonthNotes) => ({
      ...currentMonthNotes,
      defaultNote: {
        ...currentMonthNotes.defaultNote,
        content: '',
      },
      entries: existingMonthRange
        ? currentMonthNotes.entries.map((entry) =>
            entry.id === existingMonthRange.id
              ? {
                  ...entry,
                  id: monthRangeId,
                  startKey,
                  endKey,
                  content: currentMonthNotes.defaultNote.content,
                  color: currentMonthNotes.defaultNote.color,
                  textStyle: currentMonthNotes.defaultNote.textStyle,
                }
              : entry,
          )
        : [
            ...currentMonthNotes.entries,
            {
              id: monthRangeId,
              startKey,
              endKey,
              content: currentMonthNotes.defaultNote.content,
              color: currentMonthNotes.defaultNote.color,
              textStyle: currentMonthNotes.defaultNote.textStyle,
            },
          ],
    }));

    setActiveNoteId('month-default');
    setDraftSelection(null);
    setDraftNote(null);
  };

  const removeEntry = (entryId) => {
    updateMonthNotes((currentMonthNotes) => ({
      ...currentMonthNotes,
      entries: currentMonthNotes.entries.filter((entry) => entry.id !== entryId),
    }));

    if (activeNoteId === entryId) {
      setActiveNoteId('month-default');
      setDraftSelection(null);
      setDraftNote(null);
    }
  };

  const setMonthDefaultActive = () => {
    setActiveNoteId('month-default');
    setDraftSelection(null);
    setDraftNote(null);
  };

  const selectEntry = (entryId) => {
    const matchedEntry = monthNotes.entries.find((entry) => entry.id === entryId);

    if (!matchedEntry) {
      return;
    }

    const start = parseISO(matchedEntry.startKey);
    const end = parseISO(matchedEntry.endKey);
    setActiveNoteId(entryId);
    setDraftNote(null);
    setDraftSelection({
      start,
      end,
      mode: matchedEntry.startKey === matchedEntry.endKey ? 'single' : 'range',
    });
  };

  const changeMonth = (nextDate) => {
    const nextMonthKey = format(nextDate, 'yyyy-MM');

    if (nextMonthKey !== monthKey) {
      setActiveNoteId('month-default');
      setDraftSelection(null);
      setDraftNote(null);
    }
  };

  const visibleEntries = monthNotes.entries.filter((entry) => {
    const entryStart = parseISO(entry.startKey);
    const entryEnd = parseISO(entry.endKey);

    return (
      !isBefore(entryEnd, startOfMonth(currentDate)) &&
      !isAfter(entryStart, endOfMonth(currentDate))
    );
  });

  return {
    activeNote,
    activeNoteId,
    changeMonth,
    currentSelection,
    handleDateClick,
    removeEntry,
    selectEntry,
    setMonthDefaultActive,
    submitActiveNote,
    updateActiveNote,
    visibleEntries,
    entryForDate,
  };
};
