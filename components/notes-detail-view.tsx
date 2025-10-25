"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import RichTextEditorClient from "./rich-text-editor-client"

interface GeneralNote {
  id: number
  text: string
  html?: string
  createdAt: string
  updatedAt: string
}

interface NotesDetailViewProps {
  notes: GeneralNote[]
  onAdd: (noteText: string) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, noteText: string) => void
}

export default function NotesDetailView({ notes, onAdd, onDelete, onUpdate }: NotesDetailViewProps) {
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState("")

  const selectedNote = notes.find((n) => n.id === selectedNoteId)

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAdd(newNoteContent)
      setNewNoteContent("")
      setIsCreatingNew(false)
      setSelectedNoteId(null)
    }
  }

  const handleSaveEdit = () => {
    if (editingNoteId && editingContent.trim()) {
      onUpdate(editingNoteId, editingContent)
      setEditingNoteId(null)
      setEditingContent("")
    }
  }

  if (isCreatingNew) {
    return (
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">New Note</h2>
          <Button
            onClick={() => {
              setIsCreatingNew(false)
              setNewNoteContent("")
            }}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft size={20} />
          </Button>
        </div>

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0">
            <RichTextEditorClient
              value={newNoteContent}
              onChange={setNewNoteContent}
              placeholder="Start writing your note..."
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddNote} className="flex-1 bg-foreground hover:bg-foreground/90 text-background">
              Save Note
            </Button>
            <Button
              onClick={() => {
                setIsCreatingNew(false)
                setNewNoteContent("")
              }}
              variant="ghost"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (selectedNote && editingNoteId === selectedNote.id) {
    return (
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Edit Note</h2>
          <Button
            onClick={() => {
              setEditingNoteId(null)
              setEditingContent("")
            }}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft size={20} />
          </Button>
        </div>

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0">
            <RichTextEditorClient value={editingContent} onChange={setEditingContent} placeholder="Edit your note..." />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveEdit} className="flex-1 bg-foreground hover:bg-foreground/90 text-background">
              Save Changes
            </Button>
            <Button
              onClick={() => {
                setEditingNoteId(null)
                setEditingContent("")
              }}
              variant="ghost"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (selectedNote) {
    return (
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {new Date(selectedNote.createdAt).toLocaleDateString()} at{" "}
              {new Date(selectedNote.createdAt).toLocaleTimeString()}
            </p>
            <h2 className="text-2xl font-semibold text-foreground line-clamp-2">{selectedNote.text.split("\n")[0]}</h2>
          </div>
          <Button
            onClick={() => {
              onDelete(selectedNote.id)
              setSelectedNoteId(null)
            }}
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={20} />
          </Button>
        </div>

        <div
          className="flex-1 overflow-y-auto prose prose-sm max-w-none **:my-2 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_strong]:font-semibold [&_em]:italic [&_h2]:font-bold [&_h2]:text-lg [&_h3]:font-semibold [&_h3]:text-base text-foreground mb-6"
          dangerouslySetInnerHTML={{ __html: selectedNote.html || selectedNote.text }}
        />

        <Button
          onClick={() => {
            setEditingNoteId(selectedNote.id)
            setEditingContent(selectedNote.text)
          }}
          className="w-full bg-foreground hover:bg-foreground/90 text-background"
        >
          Edit Note
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Notes</h2>
        <Button onClick={() => setIsCreatingNew(true)} className="bg-foreground hover:bg-foreground/90 text-background">
          <Plus size={20} className="mr-2" />
          New Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-lg mb-4">No notes yet</p>
            <Button
              onClick={() => setIsCreatingNew(true)}
              className="bg-foreground hover:bg-foreground/90 text-background"
            >
              Create your first note
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedNoteId === note.id
                  ? "border-foreground bg-secondary"
                  : "border-border hover:border-foreground/50 hover:bg-secondary/50"
              }`}
            >
              <p className="text-xs text-muted-foreground mb-2">{new Date(note.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-foreground line-clamp-3">{note.text}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
