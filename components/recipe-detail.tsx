"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Trash2, Plus, Printer, Edit2, Clock, Calendar, Package, Tag, UtensilsCrossed, Apple, ListOrdered, Activity } from "lucide-react"
import NoteCard from "./note-card"
import RichTextEditorClient from "./rich-text-editor-client"
import { NoteTemplate } from "./note-templates"

interface Note {
  id: number
  title?: string
  text: string
  html?: string
  createdAt: string
  template?: NoteTemplate
}

interface Recipe {
  id: number
  title: string
  name?: string // للتوافق مع الكود القديم
  description?: string
  content: string
  notes: Note[]
  createdAt: string
  updatedAt: string
  category?: 'Pizza' | 'Dough' | 'Sauce' | 'Toppings' | 'Other'
  cuisine?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  prepTime?: number
  cookTime?: number
  servings?: number
  isFavorite?: boolean
  image?: string
  imageUrl?: string // للتوافق مع الكود القديم
  ingredients?: Array<{
    name: string
    amount: string
    unit: string
  }>
  instructions?: Array<{
    step: number
    description: string
    time: number
  }>
  tags?: string[]
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  flavor?: string
  usage?: string
  suggestedToppings?: string[]
}

interface RecipeDetailProps {
  recipe: Recipe
  onUpdate: (recipe: Recipe) => void
  onDelete: (id: number) => void
  onEdit?: (recipe: Recipe) => void
  onAddNote: (recipeId: number, noteData: { title: string; content: string; template: NoteTemplate }) => void
  onDeleteNote: (recipeId: number, noteId: number) => void
  onBack?: () => void
}

export default function RecipeDetail({
  recipe,
  onUpdate,
  onDelete,
  onEdit,
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
      
      onAddNote(recipe.id, {
        title: '',
        content: newNote,
        template: defaultTemplate
      })
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
      <div className="border-b border-border p-4 flex items-center justify-between bg-background">
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
          {onEdit && (
            <Button
              onClick={() => onEdit(recipe)}
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10"
            >
              <Edit2 size={18} />
            </Button>
          )}
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

      {/* Hero Image */}
      <div className="w-full h-72 relative bg-linear-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center overflow-hidden">
        <img 
          src={recipe.imageUrl || "/placeholder.svg"} 
          alt={recipe.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg"
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Recipe Metadata */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{recipe.notes.length} notes</span>
          </div>
        </div>

        {/* Ingredients */}
        {recipe.ingredients && (
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Package size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">المكونات</h3>
            </div>
            {Array.isArray(recipe.ingredients) ? (
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
                    <span className="text-foreground font-medium">{ingredient.name}</span>
                    <span className="text-muted-foreground text-sm">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground leading-relaxed whitespace-pre-line">{recipe.ingredients}</p>
            )}
          </div>
        )}

        {/* Flavor */}
        {recipe.flavor && (
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">النكهة المميزة</h3>
            </div>
            <p className="text-foreground leading-relaxed">{recipe.flavor}</p>
          </div>
        )}

        {/* Usage */}
        {recipe.usage && (
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <UtensilsCrossed size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">الاستخدام</h3>
            </div>
            <p className="text-foreground leading-relaxed">{recipe.usage}</p>
          </div>
        )}

        {/* Suggested Toppings */}
        {recipe.suggestedToppings && (
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Apple size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">الحشوات المقترحة</h3>
            </div>
            {Array.isArray(recipe.suggestedToppings) ? (
              <div className="flex flex-wrap gap-2">
                {recipe.suggestedToppings.map((topping, index) => (
                  <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {topping}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-foreground leading-relaxed whitespace-pre-line">{recipe.suggestedToppings}</p>
            )}
          </div>
        )}

        {/* Instructions */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ListOrdered size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">خطوات التحضير</h3>
            </div>
            <div className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    {instruction.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground leading-relaxed">{instruction.description}</p>
                    {instruction.time > 0 && (
                      <p className="text-muted-foreground text-sm mt-1">
                        ⏱️ {instruction.time} دقيقة
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition */}
        {recipe.nutrition && (
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">المعلومات الغذائية</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{recipe.nutrition.calories}</div>
                <div className="text-sm text-muted-foreground">سعرة حرارية</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{recipe.nutrition.protein}g</div>
                <div className="text-sm text-muted-foreground">بروتين</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{recipe.nutrition.carbs}g</div>
                <div className="text-sm text-muted-foreground">كربوهيدرات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{recipe.nutrition.fat}g</div>
                <div className="text-sm text-muted-foreground">دهون</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{recipe.nutrition.fiber}g</div>
                <div className="text-sm text-muted-foreground">ألياف</div>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">العلامات</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Content */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Edit2 size={18} className="text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">Recipe Details</h3>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="ghost"
              size="sm"
              className="text-foreground hover:bg-secondary"
            >
              {isEditing ? "Done" : "Edit Recipe"}
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
              className="bg-card border border-border p-6 rounded-xl text-foreground max-w-none text-base leading-relaxed shadow-sm
              **:text-foreground
              [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-4 [&_h1]:text-foreground
              [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-foreground
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-foreground
              [&_p]:my-4 [&_p]:text-foreground
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul_li]:my-2 [&_ul]:text-foreground
              [&_ol]:list-decimal [&_ol]:ml-6 [&_ol_li]:my-2 [&_ol]:text-foreground
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:bg-secondary/50 [&_blockquote]:py-3 [&_blockquote]:rounded-r
              [&_strong]:font-semibold [&_strong]:text-foreground
              [&_em]:italic [&_em]:text-foreground
              [&_hr]:my-6 [&_hr]:border-border
              [&_code]:bg-secondary [&_code]:text-foreground [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
              [&_pre]:bg-secondary [&_pre]:text-foreground [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-auto [&_pre]:border [&_pre]:border-border
              [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
              [&_th]:font-semibold [&_th]:border-b-2 [&_th]:border-border [&_th]:py-3 [&_th]:pr-4 [&_th]:text-left
              [&_td]:border-b [&_td]:border-border [&_td]:py-2 [&_td]:pr-4
              [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_img]:shadow-md"
              dangerouslySetInnerHTML={{ __html: recipe.content }}
            />
          )}
        </div>

        {/* Notes Section */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Plus size={18} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Notes</h3>
          </div>
          <div className="space-y-3 mb-4">
            {recipe.notes.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">لا توجد ملاحظات بعد</p>
            ) : (
              recipe.notes.map((note) => {
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
                    onDelete={() => onDeleteNote(recipe.id, note.id)}
                    showActions={true}
                  />
                )
              })
            )}
          </div>

          {/* Add Note */}
          <Button
            onClick={() => {
              // This will trigger the note form in the parent component
              const event = new CustomEvent('openNoteForm', { 
                detail: { recipeId: recipe.id } 
              })
              window.dispatchEvent(event)
            }}
            variant="ghost"
            className="w-full text-foreground hover:bg-secondary"
          >
            <Plus size={16} className="ml-2" />
            إضافة ملاحظة
          </Button>
        </div>
      </div>
    </div>
  )
}
