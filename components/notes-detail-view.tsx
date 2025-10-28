"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ArrowLeft, X } from "lucide-react"
import NoteCard from "./note-card"
import RichTextEditorClient from "./rich-text-editor-client"
import { NoteTemplate, noteTemplates } from "./note-templates"

interface GeneralNote {
  id: number
  title?: string
  text: string
  html?: string
  createdAt: string
  updatedAt: string
  template?: NoteTemplate
  tags?: string[]
}

interface NotesDetailViewProps {
  notes: GeneralNote[]
  onAdd: (noteData: { title: string; content: string; template: NoteTemplate; tag?: string }) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, noteData: { title: string; content: string; template: NoteTemplate; tag?: string }) => void
}

export default function NotesDetailView({ notes, onAdd, onDelete, onUpdate }: NotesDetailViewProps) {
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [editingTitle, setEditingTitle] = useState("")
  const [editingTemplate, setEditingTemplate] = useState<NoteTemplate | undefined>()
  const [editingTag, setEditingTag] = useState<string>("")
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteTemplate, setNewNoteTemplate] = useState<NoteTemplate | undefined>()
  const [newNoteTag, setNewNoteTag] = useState<string>("")
  const [availableTags, setAvailableTags] = useState<string[]>(["عام", "مهم", "تذكير", "فكرة"])

  const selectedNote = notes.find((n) => n.id === selectedNoteId)

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
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
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        template: newNoteTemplate || defaultTemplate,
        tag: newNoteTag && newNoteTag !== "no-tag" ? newNoteTag : undefined
      })
      
      setNewNoteContent("")
      setNewNoteTitle("")
      setNewNoteTemplate(undefined)
      setNewNoteTag("")
      setIsCreatingNew(false)
      setSelectedNoteId(null)
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
        title: editingTitle.trim(),
        content: editingContent.trim(),
        template: editingTemplate || defaultTemplate,
        tag: editingTag && editingTag !== "no-tag" ? editingTag : undefined
      })
      
      setEditingNoteId(null)
      setEditingContent("")
      setEditingTitle("")
      setEditingTemplate(undefined)
      setEditingTag("")
    }
  }

  if (isCreatingNew) {
    return (
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">ملاحظة جديدة</h2>
          <Button
            onClick={() => {
              setIsCreatingNew(false)
              setNewNoteContent("")
              setNewNoteTitle("")
              setNewNoteTemplate(undefined)
            }}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft size={20} />
          </Button>
        </div>

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              عنوان الملاحظة
            </label>
            <input
              type="text"
              placeholder="أدخل عنوان الملاحظة..."
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="w-full px-3 py-2 bg-secondary text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              قالب الملاحظة
            </label>
            
            {/* Template Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {noteTemplates.map((templateOption) => (
                <button
                  key={templateOption.id}
                  onClick={() => setNewNoteTemplate(templateOption)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    newNoteTemplate?.id === templateOption.id 
                      ? `${templateOption.bgColor} ${templateOption.borderColor} ${templateOption.textColor} border-opacity-100` 
                      : 'bg-secondary border-border hover:bg-secondary/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={newNoteTemplate?.id === templateOption.id ? templateOption.iconColor : 'text-muted-foreground'}>
                      {templateOption.icon}
                    </div>
                    <span className={`text-sm font-medium ${
                      newNoteTemplate?.id === templateOption.id ? templateOption.textColor : 'text-foreground'
                    }`}>
                      {templateOption.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tag Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              الوسم
            </label>
            <Select value={newNoteTag || "no-tag"} onValueChange={(value) => setNewNoteTag(value === "no-tag" ? "" : value)}>
              <SelectTrigger className="h-10 text-sm w-full">
                <SelectValue placeholder="اختر وسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-tag" className="text-sm">لا وسم</SelectItem>
                {availableTags.map(tag => (
                  <SelectItem key={tag} value={tag} className="text-sm">
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            <label className="block text-sm font-medium text-foreground mb-2">
              محتوى الملاحظة *
            </label>
            <div className="border border-border rounded-lg overflow-hidden" style={{ minHeight: '300px' }}>
              <RichTextEditorClient
            value={newNoteContent}
            onChange={setNewNoteContent}
                placeholder="اكتب محتوى الملاحظة..."
          />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAddNote} className="flex-1 bg-foreground hover:bg-foreground/90 text-background">
              حفظ الملاحظة
            </Button>
            <Button
              onClick={() => {
                setIsCreatingNew(false)
                setNewNoteContent("")
                setNewNoteTitle("")
                setNewNoteTemplate(undefined)
              }}
              variant="ghost"
              className="flex-1"
            >
              إلغاء
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
          <h2 className="text-2xl font-semibold text-foreground">تعديل الملاحظة</h2>
          <Button
            onClick={() => {
              setEditingNoteId(null)
              setEditingContent("")
              setEditingTitle("")
              setEditingTemplate(undefined)
            }}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft size={20} />
          </Button>
        </div>

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              عنوان الملاحظة
            </label>
            <input
              type="text"
              placeholder="أدخل عنوان الملاحظة..."
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="w-full px-3 py-2 bg-secondary text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              قالب الملاحظة
            </label>
            
            {/* Template Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {noteTemplates.map((templateOption) => (
                <button
                  key={templateOption.id}
                  onClick={() => setEditingTemplate(templateOption)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    editingTemplate?.id === templateOption.id 
                      ? `${templateOption.bgColor} ${templateOption.borderColor} ${templateOption.textColor} border-opacity-100` 
                      : 'bg-secondary border-border hover:bg-secondary/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={editingTemplate?.id === templateOption.id ? templateOption.iconColor : 'text-muted-foreground'}>
                      {templateOption.icon}
                    </div>
                    <span className={`text-sm font-medium ${
                      editingTemplate?.id === templateOption.id ? templateOption.textColor : 'text-foreground'
                    }`}>
                      {templateOption.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tag Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              الوسم
            </label>
            <Select value={editingTag || "no-tag"} onValueChange={(value) => setEditingTag(value === "no-tag" ? "" : value)}>
              <SelectTrigger className="h-10 text-sm w-full">
                <SelectValue placeholder="اختر وسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-tag" className="text-sm">لا وسم</SelectItem>
                {availableTags.map(tag => (
                  <SelectItem key={tag} value={tag} className="text-sm">
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            <label className="block text-sm font-medium text-foreground mb-2">
              محتوى الملاحظة *
            </label>
            <div className="border border-border rounded-lg overflow-hidden" style={{ minHeight: '300px' }}>
              <RichTextEditorClient 
                value={editingContent} 
                onChange={setEditingContent} 
                placeholder="اكتب محتوى الملاحظة..." 
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveEdit} className="flex-1 bg-foreground hover:bg-foreground/90 text-background">
              حفظ التغييرات
            </Button>
            <Button
              onClick={() => {
                setEditingNoteId(null)
                setEditingContent("")
                setEditingTitle("")
                setEditingTemplate(undefined)
                setEditingTag("")
              }}
              variant="ghost"
              className="flex-1"
            >
              إلغاء
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
            setEditingTitle(selectedNote.title || "")
            setEditingTemplate(selectedNote.template)
          }}
          className="w-full bg-foreground hover:bg-foreground/90 text-background"
        >
          تعديل الملاحظة
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">الملاحظات</h2>
        <Button onClick={() => setIsCreatingNew(true)} className="bg-foreground hover:bg-foreground/90 text-background">
          <Plus size={20} className="mr-2" />
          ملاحظة جديدة
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-lg mb-4">لا توجد ملاحظات بعد</p>
            <Button
              onClick={() => setIsCreatingNew(true)}
              className="bg-foreground hover:bg-foreground/90 text-background"
            >
              إنشاء أول ملاحظة
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => setSelectedNoteId(note.id)}
              onEdit={(e) => {
                e?.stopPropagation()
                setEditingNoteId(note.id)
                setEditingContent(note.text)
                setEditingTitle(note.title || "")
                setEditingTemplate(note.template)
              }}
              onDelete={(e) => {
                e?.stopPropagation()
                onDelete(note.id)
              }}
              onTogglePin={(e) => {
                e?.stopPropagation()
                // Add toggle pin handler if needed
              }}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
