"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ChevronRight, Pin, PinOff, Tag, X, FileText } from "lucide-react"
import RichTextEditorClient from "./rich-text-editor-client"
import NoteTemplates from "./note-templates"

interface GeneralNote {
  id: number
  text: string
  html?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  isPinned?: boolean
  template?: string
  linkedRecipeId?: number
  imageUrl?: string
}

interface NotesSectionProps {
  notes: GeneralNote[]
  onAdd: (noteText: string, tags?: string[], template?: string, linkedRecipeId?: number) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, noteText: string, tags?: string[]) => void
  onTogglePin: (id: number) => void
  onAddTag: (id: number, tag: string) => void
  onRemoveTag: (id: number, tag: string) => void
  availableTags: string[]
  onCreateNote: () => void
  onSelectTemplate: (template: any) => void
}

export default function NotesSection({ 
  notes, 
  onAdd, 
  onDelete, 
  onUpdate, 
  onTogglePin, 
  onAddTag, 
  onRemoveTag, 
  availableTags,
  onCreateNote,
  onSelectTemplate
}: NotesSectionProps) {
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [newNoteTags, setNewNoteTags] = useState<string[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [editingTags, setEditingTags] = useState<string[]>([])
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAdd(newNote, newNoteTags)
      setNewNote("")
      setNewNoteTags([])
      setIsAddingNote(false)
    }
  }

  const handleSaveEdit = () => {
    if (editingNoteId && editingContent.trim()) {
      onUpdate(editingNoteId, editingContent, editingTags)
      setEditingNoteId(null)
      setEditingContent("")
      setEditingTags([])
    }
  }

  const handleStartEdit = (note: GeneralNote) => {
    setEditingNoteId(note.id)
    setEditingContent(note.text)
    setEditingTags([...note.tags])
  }

  const handleSelectTemplate = (template: any) => {
    onSelectTemplate(template)
    setShowTemplates(false)
  }

  const selectedNote = notes.find((n) => n.id === selectedNoteId)

  return (
    <div className="flex flex-col h-full">
      {/* Add Note Button */}
      <div className="border-b border-border p-4">
        <div className="space-y-2">
          <Button
            onClick={onCreateNote}
            className="w-full bg-foreground hover:bg-foreground/90 text-background"
          >
            <Plus size={16} className="mr-2" />
            New Note
          </Button>
          <Button
            onClick={() => setShowTemplates(true)}
            variant="outline"
            className="w-full"
          >
            <FileText size={16} className="mr-2" />
            Use Template
          </Button>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">No notes yet</div>
        ) : (
          <div className="divide-y divide-border">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`w-full text-left p-4 hover:bg-secondary transition-colors ${
                  selectedNoteId === note.id ? "bg-secondary" : ""
                } ${note.isPinned ? "border-l-4 border-foreground" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {note.isPinned && <Pin size={12} className="text-foreground" />}
                      <p className="text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-foreground line-clamp-2 mb-2">{note.text}</p>
                    
                    {/* Tags */}
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-secondary text-xs text-muted-foreground rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onTogglePin(note.id)
                      }}
                      className="p-1 hover:bg-background rounded"
                      title={note.isPinned ? "Unpin" : "Pin"}
                    >
                      {note.isPinned ? <Pin size={14} className="text-foreground" /> : <PinOff size={14} className="text-muted-foreground" />}
                    </button>
                    <button
                      onClick={() => setSelectedNoteId(note.id)}
                      className="p-1 hover:bg-background rounded"
                    >
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Template Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <NoteTemplates
                onSelectTemplate={handleSelectTemplate}
                onClose={() => setShowTemplates(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
