import { useParams, useNavigate, Link } from "react-router-dom";
import { useNotesContext } from "../state/NotesContext";
import { useMemo, useState } from "react";
import { ArrowLeftIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

function formatTs(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString();
}

export default function NotesPage() {
  const { id: listingId } = useParams();
  const navigate = useNavigate();
  const { getNotesForListing, addNote, updateNote, deleteNote } = useNotesContext();

  const notes = useMemo(() => (listingId ? getNotesForListing(listingId) : []), [listingId, getNotesForListing]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  if (!listingId) return <div className="p-4">Missing listing id.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(`/listing/${listingId}`)}
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label="Back"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Notes</h1>
        <span className="ml-auto text-sm text-gray-500">
          <Link to={`/listing/${listingId}`} className="underline">
            Back to Listing
          </Link>
        </span>
      </div>

      {/* Add new note */}
      <div className="bg-white rounded-2xl border p-4 mb-6">
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
          Add a note for this listing
        </label>
        <textarea
          id="note"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="e.g., Ask about parking, confirm move-in date, compare with Grey St unit…"
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => {
              if (!text.trim()) return;
              addNote(listingId, text.trim());
              setText("");
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Save Note
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet. Add your first one above.</p>
        ) : (
          notes.map((n) => (
            <div key={n.id} className="bg-white border rounded-2xl p-4">
              {editingId === n.id ? (
                <div>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end mt-3">
                    <button
                      onClick={() => {
                        updateNote(n.id, editingText.trim());
                        setEditingId(null);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      <CheckIcon className="h-5 w-5" /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-gray-50"
                    >
                      <XMarkIcon className="h-5 w-5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="whitespace-pre-wrap text-gray-900">{n.text}</p>
                  <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                    <span>Updated {formatTs(n.updatedAt)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(n.id);
                          setEditingText(n.text);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border hover:bg-gray-50"
                      >
                        <PencilIcon className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => deleteNote(n.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

