import { useState, useEffect, useRef } from 'react'
import type { WidgetProps } from '../../types'

interface Note {
  id: string
  text: string
  createdAt: number
}

export default function NotesWidget({ config, onUpdate }: WidgetProps) {
  const [notes, setNotes] = useState<Note[]>(config.data?.notes || [])
  const [newNoteText, setNewNoteText] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const onUpdateRef = useRef(onUpdate)

  // Keep ref updated
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    if (JSON.stringify(notes) !== JSON.stringify(config.data?.notes)) {
      onUpdateRef.current({ data: { ...config.data, notes } })
    }
  }, [notes, config.data])

  const addNote = () => {
    if (!newNoteText.trim()) return

    const newNote: Note = {
      id: `note_${Date.now()}`,
      text: newNoteText,
      createdAt: Date.now()
    }

    setNotes([newNote, ...notes])
    setNewNoteText('')
    setIsAdding(false)
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  return (
    <div className="flex flex-col h-full">
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-3 bg-brass-500/10 border border-dashed border-brass-700/50 rounded-card text-brass-300 font-medium hover:bg-brass-500/15 hover:border-brass-600/60 transition-colors mb-3 focus-visible:outline-none focus-visible:shadow-focus"
        >
          + Add New Note
        </button>
      )}

      {isAdding && (
        <div className="mb-3 p-3 bg-surface-overlay rounded-card border border-hairline">
          <textarea
            autoFocus
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Write your note..."
            className="w-full p-2 bg-surface-sunken border border-hairline rounded-control resize-none text-primary placeholder:text-tertiary focus-visible:outline-none focus-visible:shadow-focus"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                addNote()
              }
            }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={addNote}
              className="flex-1 px-3 py-2 bg-brass-500 hover:bg-brass-600 text-surface-base rounded-control shadow-soft-sm transition-colors text-sm font-medium focus-visible:outline-none focus-visible:shadow-focus"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsAdding(false)
                setNewNoteText('')
              }}
              className="flex-1 px-3 py-2 bg-transparent border border-hairline text-secondary rounded-control hover:text-primary hover:border-brass-700/60 transition-colors text-sm focus-visible:outline-none focus-visible:shadow-focus"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-tertiary mt-1">Ctrl+Enter to save</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-tertiary">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <p className="text-sm">No notes yet</p>
            <p className="text-xs">Click above to add your first note</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="group p-3 bg-surface-overlay border border-hairline rounded-card hover:border-brass-700/50 hover:shadow-soft transition-colors"
            >
              <div className="flex items-start justify-between">
                <p className="flex-1 text-sm text-primary whitespace-pre-wrap">{note.text}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="ml-2 p-1 opacity-0 group-hover:opacity-100 text-burgundy-300 hover:bg-burgundy-500/15 rounded-control transition-colors focus-visible:outline-none focus-visible:shadow-focus"
                  title="Delete note"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-tertiary mt-1">
                {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
