import { useMemo, useState, useRef, UIEvent } from "react";
import { useNotesContext } from "../state/NotesContext";
import { XMarkIcon, TrashIcon, PencilIcon, CheckIcon } from "@heroicons/react/24/outline";

function fmt(ts: number) {
  return new Date(ts).toLocaleString();
}

export default function NotesModal({
  listingId,
  onClose,
}: {
  listingId: string;
  onClose: () => void;
}) {
  const { getNotesForListing, addNote, updateNote, deleteNote } = useNotesContext();
  const notes = useMemo(() => getNotesForListing(listingId), [getNotesForListing, listingId]);

  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setScrolled(el.scrollTop > 2);
  };

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Dialog */}
      <div className="absolute inset-x-0 top-[5vh] mx-auto w-[min(100%,44rem)] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold">Notes</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div
          ref={bodyRef}
          onScroll={onScroll}
          className="max-h-[70vh] overflow-auto px-5 pb-5"
        >
          {/* Sticky add-note composer */}
          <div
            className={[
              "sticky top-0 z-10 -mx-5 px-5 pt-4 pb-3 bg-white",
              "border-b",
              scrolled ? "shadow-sm" : "shadow-none",
            ].join(" ")}
          >
            <div className="rounded-xl border p-3">
              <label htmlFor="note" className="mb-2 block text-sm font-medium text-gray-700">
                Add a note for this listing
              </label>
              <textarea
                id="note"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={150} // Limit input to 150 characters
                className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Ask about parking, confirm move-in date…"
              />
              <div className="mt-1 text-sm text-gray-500">
                {text.length}/150 characters
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    const t = text.trim();
                    if (!t) return;
                    addNote(listingId, t);
                    setText("");
                    // keep focus in composer for rapid add
                    setTimeout(() => document.getElementById("note")?.focus(), 0);
                  }}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>

          {/* Notes list */}
          <div className="mt-4 space-y-3">
            {notes.length === 0 ? (
              <p className="text-gray-500">No notes yet.</p>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="rounded-xl border p-3">
                  {editingId === n.id ? (
                    <>
                      <textarea
                        rows={3}
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="mt-3 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            updateNote(n.id, editingText.trim());
                            setEditingId(null);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700"
                        >
                          <CheckIcon className="h-4 w-4" /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-xl border px-3 py-2 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap text-gray-900">{n.text}</p>
                      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                        <span>Updated {fmt(n.updatedAt)}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(n.id);
                              setEditingText(n.text);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 hover:bg-gray-50"
                          >
                            <PencilIcon className="h-4 w-4" /> Edit
                          </button>
                          <button
                            onClick={() => deleteNote(n.id)}
                            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-red-600 hover:bg-gray-50"
                          >
                            <TrashIcon className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
