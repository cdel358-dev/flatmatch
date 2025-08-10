import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface Note {
  id: string;
  listingId: string;
  text: string;
  createdAt: number;
  updatedAt: number;
}

type NotesContextValue = {
  notes: Note[];
  getNotesForListing: (listingId: string) => Note[];
  addNote: (listingId: string, text: string) => void;
  updateNote: (id: string, text: string) => void;
  deleteNote: (id: string) => void;
};

const NotesContext = createContext<NotesContextValue | undefined>(undefined);
const STORAGE_KEY = "flatmatch:notes:v1";

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Note[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch { /* no-op */ }
  }, [notes]);

  const addNote = (listingId: string, text: string) => {
    const now = Date.now();
    setNotes(prev => [{ id: "n" + now, listingId, text, createdAt: now, updatedAt: now }, ...prev]);
  };

  const updateNote = (id: string, text: string) => {
    const now = Date.now();
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, text, updatedAt: now } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const getNotesForListing = (listingId: string) =>
    notes.filter(n => n.listingId === listingId).sort((a, b) => b.updatedAt - a.updatedAt);

  const value = useMemo(
    () => ({ notes, getNotesForListing, addNote, updateNote, deleteNote }),
    [notes]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotesContext = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotesContext must be used within NotesProvider");
  return ctx;
};
