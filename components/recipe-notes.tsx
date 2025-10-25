"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Edit2 } from "lucide-react"
import AddNoteModal from "@/components/add-note-modal"

interface Note {
  id: number
  text: string
  createdAt: string
}

interface RecipeNotesProps {
  recipeId: number
  notes: Note[]
  onAddNote: (recipeId: number, note: Omit<Note, "id">) => void
  onDeleteNote: (recipeId: number, noteId: number) => void
  onEditNote: (recipeId: number, noteId: number, text: string) => void
}

export default function RecipeNotes({ recipeId, notes, onAddNote, onDeleteNote, onEditNote }: RecipeNotesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const handleAddNote = (text: string) => {
    if (editingNote) {
      onEditNote(recipeId, editingNote.id, text)
      setEditingNote(null)
    } else {
      onAddNote(recipeId, {
        text,
        createdAt: new Date().toLocaleDateString(),
      })
    }
    setIsModalOpen(false)
  }

  const handleEditClick = (note: Note) => {
    setEditingNote(note)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-amber-900">Notes</h3>
          <Button
            size="sm"
            onClick={() => {
              setEditingNote(null)
              setIsModalOpen(true)
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white gap-1"
          >
            <Plus size={16} />
            Add Note
          </Button>
        </div>

        {notes.length === 0 ? (
          <p className="text-sm text-amber-600 italic">No notes yet. Add one to get started!</p>
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <Card key={note.id} className="bg-amber-50 border-amber-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-amber-900">{note.text}</p>
                    <p className="text-xs text-amber-600 mt-1">{note.createdAt}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditClick(note)}
                      className="text-amber-700 hover:bg-amber-100 h-8 w-8 p-0"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteNote(recipeId, note.id)}
                      className="text-red-700 hover:bg-red-100 h-8 w-8 p-0"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddNoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingNote(null)
        }}
        onSave={handleAddNote}
        initialText={editingNote?.text || ""}
        isEditing={!!editingNote}
      />
    </>
  )
}
