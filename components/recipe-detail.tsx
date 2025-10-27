"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Trash2, Plus, Printer } from "lucide-react"
import RichTextEditorClient from "./rich-text-editor-client"

interface Note {
  id: number
  text: string
  html?: string
  createdAt: string
}

interface Recipe {
  id: number
  name: string
  content: string
  notes: Note[]
  createdAt: string
  updatedAt: string
}

interface RecipeDetailProps {
  recipe: Recipe
  onUpdate: (recipe: Recipe) => void
  onDelete: (id: number) => void
  onAddNote: (recipeId: number, noteText: string) => void
  onDeleteNote: (recipeId: number, noteId: number) => void
  onBack?: () => void
}

export default function RecipeDetail({
  recipe,
  onUpdate,
  onDelete,
  onAddNote,
  onDeleteNote,
  onBack,
}: RecipeDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(recipe.content)
  const [newNote, setNewNote] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)

  const handleSave = () => {
    onUpdate({
      ...recipe,
      content: editedContent,
      updatedAt: new Date().toISOString(),
    })
    setIsEditing(false)
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(recipe.id, newNote)
      setNewNote("")
      setIsAddingNote(false)
    }
  }

  const handlePrintRecipe = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${recipe.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
              h2 { color: #666; margin-top: 20px; }
              pre { white-space: pre-wrap; font-family: inherit; }
            </style>
          </head>
          <body>
            <h1>${recipe.name}</h1>
            <h2>Recipe</h2>
            <pre>${recipe.content}</pre>
            ${recipe.notes.length > 0 ? `
              <h2>Notes</h2>
              ${recipe.notes.map(note => `<div style="margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px;"><strong>${new Date(note.createdAt).toLocaleDateString()}</strong><br>${note.html || note.text}</div>`).join('')}
            ` : ''}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {onBack && (
            <button onClick={onBack} className="p-1 hover:bg-secondary rounded transition-colors">
              <ChevronLeft size={20} className="text-foreground" />
            </button>
          )}
          <h2 className="text-xl font-semibold text-foreground">{recipe.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrintRecipe}
            variant="ghost"
            size="sm"
            className="text-foreground hover:bg-secondary"
            title="Print Recipe"
          >
            <Printer size={18} />
          </Button>
          <Button
            onClick={() => onDelete(recipe.id)}
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Recipe Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Recipe</h3>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="ghost"
              size="sm"
              className="text-foreground hover:bg-secondary"
            >
              {isEditing ? "Done" : "Edit"}
            </Button>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <div className="border border-border rounded-lg overflow-hidden">
                <RichTextEditorClient
                  value={editedContent}
                  onChange={setEditedContent}
                  placeholder="Edit your recipe..."
                />
              </div>
              <Button onClick={handleSave} className="w-full bg-foreground hover:bg-foreground/90 text-background">
                Save Changes
              </Button>
            </div>
          ) : (
            <div
              className="bg-secondary p-4 rounded-lg text-foreground max-w-none text-[15px] leading-relaxed
              [&_*]:text-foreground
              [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-2 [&_h1]:mb-3
              [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2
              [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5
              [&_p]:my-3
              [&_ul]:list-disc [&_ul]:ml-5 [&_ul_li]:my-1
              [&_ol]:list-decimal [&_ol]:ml-5 [&_ol_li]:my-1
              [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-3
              [&_strong]:font-semibold
              [&_em]:italic
              [&_hr]:my-4 [&_hr]:border-border
              [&_code]:bg-background [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
              [&_pre]:bg-background [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-auto
              [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse
              [&_th]:font-semibold [&_th]:border-b [&_th]:border-border [&_th]:py-2 [&_th]:pr-3
              [&_td]:border-b [&_td]:border-border [&_td]:py-2 [&_td]:pr-3
              [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded"
              dangerouslySetInnerHTML={{ __html: recipe.content }}
            />
          )}
        </div>

        {/* Notes Section */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Notes</h3>
          <div className="space-y-3 mb-4">
            {recipe.notes.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No notes yet</p>
            ) : (
              recipe.notes.map((note) => (
                <div key={note.id} className="bg-secondary p-3 rounded-lg group">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleDateString()}</p>
                    <button
                      onClick={() => onDeleteNote(recipe.id, note.id)}
                      className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background rounded"
                    >
                      <Trash2 size={14} className="text-destructive" />
                    </button>
                  </div>
                  <div
                    className="text-sm text-foreground prose prose-sm max-w-none **:my-0 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_strong]:font-semibold [&_em]:italic [&_h2]:font-bold [&_h2]:text-base"
                    dangerouslySetInnerHTML={{ __html: note.html || note.text }}
                  />
                </div>
              ))
            )}
          </div>

          {/* Add Note */}
          {!isAddingNote ? (
            <Button
              onClick={() => setIsAddingNote(true)}
              variant="ghost"
              className="w-full text-foreground hover:bg-secondary"
            >
              <Plus size={16} className="mr-2" />
              Add Note
            </Button>
          ) : (
            <div className="space-y-2">
              <RichTextEditorClient value={newNote} onChange={setNewNote} placeholder="Write your note..." />
              <div className="flex gap-2">
                <Button onClick={handleAddNote} className="flex-1 bg-foreground hover:bg-foreground/90 text-background">
                  Save Note
                </Button>
                <Button
                  onClick={() => {
                    setIsAddingNote(false)
                    setNewNote("")
                  }}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
