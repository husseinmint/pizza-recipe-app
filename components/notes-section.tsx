"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ChevronRight, Pin, PinOff, Tag, X, FileText } from "lucide-react"
import NoteCard from "./note-card"
import { NoteTemplate } from "./note-templates"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GeneralNote {
  id: number
  title?: string
  text: string
  html?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  isPinned?: boolean
  template?: NoteTemplate
  linkedRecipeId?: number
  imageUrl?: string
}

interface NotesSectionProps {
  notes: GeneralNote[]
  onAdd: (noteData: { title: string; content: string; template: NoteTemplate }, tags?: string[], linkedRecipeId?: number) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, noteData: { title: string; content: string; template: NoteTemplate }, tags?: string[]) => void
  onTogglePin: (id: number) => void
  onAddTag: (id: number, tag: string) => void
  onRemoveTag: (id: number, tag: string) => void
  availableTags: string[]
  onCreateNote: () => void
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
  onCreateNote
}: NotesSectionProps) {
  const [selectedNoteTag, setSelectedNoteTag] = useState<string>("all")
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [newNoteTags, setNewNoteTags] = useState<string[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [editingTags, setEditingTags] = useState<string[]>([])
  const [showTagSelector, setShowTagSelector] = useState(false)

  const handleAddNote = () => {
    if (newNote.trim()) {
      const defaultTemplate: NoteTemplate = {
        id: 'info',
        name: 'معلومة',
        type: 'info',
        icon: null,
        bgColor: 'bg-slate-50 dark:bg-slate-900/30',
        borderColor: 'border-slate-200 dark:border-slate-700',
        textColor: 'text-slate-700 dark:text-slate-300',
        iconColor: 'text-slate-500 dark:text-slate-400'
      }
      
      onAdd({
        title: '',
        content: newNote.trim(),
        template: defaultTemplate
      }, newNoteTags)
      setNewNote("")
      setNewNoteTags([])
      setIsAddingNote(false)
    }
  }

  const handleSaveEdit = () => {
    if (editingNoteId && editingContent.trim()) {
      const defaultTemplate: NoteTemplate = {
        id: 'info',
        name: 'معلومة',
        type: 'info',
        icon: null,
        bgColor: 'bg-slate-50 dark:bg-slate-900/30',
        borderColor: 'border-slate-200 dark:border-slate-700',
        textColor: 'text-slate-700 dark:text-slate-300',
        iconColor: 'text-slate-500 dark:text-slate-400'
      }
      
      onUpdate(editingNoteId, {
        title: '',
        content: editingContent.trim(),
        template: defaultTemplate
      }, editingTags)
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

  const selectedNote = notes.find((n) => n.id === selectedNoteId)

  // Filter notes by selected tag
  const filteredNotes = selectedNoteTag === "all" 
    ? notes 
    : notes.filter(note => note.tags?.includes(selectedNoteTag))

  return (
    <div className="flex flex-col h-full">
      {/* Add Note Button */}
      <div className="p-4 space-y-2">
        <Button
          onClick={onCreateNote}
          className="justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:shadow-lg active:shadow-md h-9 px-4 has-[>svg]:px-3 bg-foreground hover:bg-foreground/90 text-background flex items-center gap-2 w-full py-8"
        >
          <Plus size={16} className="mr-2" />
          ملاحظة جديده
        </Button>
        
        {/* Tags Filter */}
        <div className="flex-1">
          <Select value={selectedNoteTag} onValueChange={setSelectedNoteTag}>
            <SelectTrigger className="h-10 text-sm w-full">
              <SelectValue placeholder="اختر وسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">جميع الوسوم</SelectItem>
              {availableTags.map(tag => (
                <SelectItem key={tag} value={tag} className="text-sm">
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm">لا توجد ملاحظات بعد</div>
        ) : (
          filteredNotes.map((note) => {
            // Add default template if not present for old notes
            const noteWithTemplate = {
              ...note,
              template: note.template || {
                id: 'info',
                name: 'معلومة',
                type: 'info',
                icon: null,
                bgColor: 'bg-slate-50 dark:bg-slate-900/30',
                borderColor: 'border-slate-200 dark:border-slate-700',
                textColor: 'text-slate-700 dark:text-slate-300',
                iconColor: 'text-slate-500 dark:text-slate-400'
              }
            }
            
            return (
              <NoteCard
                key={note.id}
                note={noteWithTemplate}
                onEdit={() => handleStartEdit(note)}
                onDelete={() => onDelete(note.id)}
                onTogglePin={() => onTogglePin(note.id)}
                showActions={true}
              />
            )
          })
        )}
      </div>

    </div>
  )
}
