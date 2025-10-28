"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ChevronRight, Download, Upload, Filter, Moon, Sun, Printer, Image, Star } from "lucide-react"
import { Pizza, Bread, BowlFood, Cheese, FileText } from "@phosphor-icons/react"
import RecipeDetail from "@/components/recipe-detail"
import NotesSection from "@/components/notes-section"
import AddRecipeModal from "@/components/add-recipe-modal-advanced"
import EditRecipeModal from "@/components/edit-recipe-modal"
import NotesDetailView from "@/components/notes-detail-view"
import ClientOnly from "@/components/client-only"
import RichTextEditorClient from "@/components/rich-text-editor-client"
import NoteForm from "@/components/note-form"
import NoteCard from "@/components/note-card"
import { NoteTemplate } from "@/components/note-templates"
import { useLocalStorage } from "@/hooks/use-local-storage"

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
  viewCount?: number
  lastViewed?: string
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

export default function Home() {
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>("pizza-recipes", [
    {
      id: 1,
      title: "Classic Margherita",
      name: "Classic Margherita",
      content:
        "Dough:\n- 500g flour\n- 300ml water\n- 10g salt\n- 5g yeast\n\nInstructions:\n1. Mix flour and water\n2. Add salt and yeast\n3. Knead for 10 minutes\n4. Let ferment for 24 hours\n5. Shape and top with tomato, mozzarella, basil\n6. Bake at 300°C for 90 seconds",
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Pizza',
      isFavorite: false,
      viewCount: 0,
    },
  ])

  const [generalNotes, setGeneralNotes] = useLocalStorage<GeneralNote[]>("pizza-notes", [])
  const [activeTab, setActiveTab] = useState<"recipes" | "notes">("recipes")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showPinnedNotes, setShowPinnedNotes] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isCreatingNote, setIsCreatingNote] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteTags, setNewNoteTags] = useState<string[]>([])
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [editingNote, setEditingNote] = useState<{ id: number; title: string; content: string; template: NoteTemplate } | null>(null)
  const [noteFormMode, setNoteFormMode] = useState<'create' | 'edit'>('create')
  const [isDarkMode, setIsDarkMode] = useLocalStorage("dark-mode", false)
  

  useEffect(() => {
    setIsClient(true)
    
    // Listen for note form events from RecipeDetail
    const handleOpenNoteForm = (event: CustomEvent) => {
      const { recipeId } = event.detail
      setSelectedRecipe(recipes.find(r => r.id === recipeId) || null)
      setNoteFormMode('create')
      setEditingNote(null)
      setShowNoteForm(true)
    }
    
    window.addEventListener('openNoteForm', handleOpenNoteForm as EventListener)
    
    return () => {
      window.removeEventListener('openNoteForm', handleOpenNoteForm as EventListener)
    }
  }, [recipes])

  // Dark mode toggle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [isDarkMode])

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const recipeName = recipe.title || recipe.name || ''
      const matchesSearch = recipeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recipe.description && recipe.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [recipes, searchTerm, selectedCategory])

  const handleAddRecipe = (recipeData: any) => {
    const newRecipe: Recipe = {
      id: Math.max(...recipes.map((r) => r.id), 0) + 1,
      title: recipeData.title,
      name: recipeData.title, // للتوافق مع الكود القديم
      description: recipeData.description,
      content: recipeData.content,
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: recipeData.category as Recipe['category'],
      cuisine: recipeData.cuisine,
      difficulty: recipeData.difficulty,
      prepTime: recipeData.prepTime,
      cookTime: recipeData.cookTime,
      servings: recipeData.servings,
      isFavorite: false,
      viewCount: 0,
      image: recipeData.image,
      imageUrl: recipeData.image, // للتوافق مع الكود القديم
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      tags: recipeData.tags,
      nutrition: recipeData.nutrition,
      flavor: recipeData.flavor,
      usage: recipeData.usage,
      suggestedToppings: recipeData.suggestedToppings,
    }
    setRecipes([newRecipe, ...recipes])
    setIsAddModalOpen(false)
  }

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe)
    setIsEditModalOpen(true)
  }

  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    setRecipes(recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r))
    if (selectedRecipe?.id === updatedRecipe.id) {
      setSelectedRecipe(updatedRecipe)
    }
    setIsEditModalOpen(false)
    setEditingRecipe(null)
  }

  const handleDeleteRecipe = (id: number) => {
    setRecipes(recipes.filter((r) => r.id !== id))
    if (selectedRecipe?.id === id) {
      setSelectedRecipe(null)
    }
  }


  const handleAddNote = (recipeId: number, noteData: { title: string; content: string; template: NoteTemplate }) => {
    const updatedRecipes = recipes.map((r) => {
      if (r.id === recipeId) {
        const newNote: Note = {
          id: Math.max(...(r.notes?.map((n) => n.id) || [0]), 0) + 1,
          title: noteData.title,
          text: noteData.content,
          html: noteData.content,
          template: noteData.template,
          createdAt: new Date().toISOString(),
        }
        return {
          ...r,
          notes: [newNote, ...r.notes],
          updatedAt: new Date().toISOString(),
        }
      }
      return r
    })
    setRecipes(updatedRecipes)
    const updated = updatedRecipes.find((r) => r.id === recipeId)
    if (updated) setSelectedRecipe(updated)
  }

  const handleDeleteNote = (recipeId: number, noteId: number) => {
    const updatedRecipes = recipes.map((r) => {
      if (r.id === recipeId) {
        return {
          ...r,
          notes: r.notes.filter((n) => n.id !== noteId),
          updatedAt: new Date().toISOString(),
        }
      }
      return r
    })
    setRecipes(updatedRecipes)
    const updated = updatedRecipes.find((r) => r.id === recipeId)
    if (updated) setSelectedRecipe(updated)
  }

  const handleAddGeneralNote = (noteData: { title: string; content: string; template: NoteTemplate; tag?: string }, tags: string[] = [], linkedRecipeId?: number) => {
    const newNote: GeneralNote = {
      id: Math.max(...generalNotes.map((n) => n.id), 0) + 1,
      title: noteData.title,
      text: noteData.content,
      html: noteData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: noteData.tag ? [noteData.tag] : tags,
      isPinned: false,
      template: noteData.template,
      linkedRecipeId,
    }
    setGeneralNotes([newNote, ...generalNotes])
  }

  const handleDeleteGeneralNote = (id: number) => {
    setGeneralNotes(generalNotes.filter((n) => n.id !== id))
  }

  const handleUpdateGeneralNote = (id: number, noteData: { title: string; content: string; template: NoteTemplate; tag?: string }, tags?: string[]) => {
    setGeneralNotes(
      generalNotes.map((n) =>
        n.id === id
          ? {
              ...n,
              title: noteData.title,
              text: noteData.content,
              html: noteData.content,
              template: noteData.template,
              tags: noteData.tag ? [noteData.tag] : tags || n.tags,
              updatedAt: new Date().toISOString(),
            }
          : n,
      ),
    )
  }

  const handleToggleNotePin = (id: number) => {
    setGeneralNotes(generalNotes.map(n => 
      n.id === id ? { ...n, isPinned: !n.isPinned } : n
    ))
  }

  const handleAddNoteTag = (id: number, tag: string) => {
    setGeneralNotes(generalNotes.map(n => 
      n.id === id ? { ...n, tags: [...n.tags, tag] } : n
    ))
  }

  const handleRemoveNoteTag = (id: number, tag: string) => {
    setGeneralNotes(generalNotes.map(n => 
      n.id === id ? { ...n, tags: n.tags.filter(t => t !== tag) } : n
    ))
  }

  const handleCreateNote = () => {
    if (newNoteContent.trim()) {
      const defaultTemplate: NoteTemplate = {
        id: 'info',
        name: 'معلومة',
        type: 'info',
        icon: null,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600'
      }
      handleAddGeneralNote({
        title: '',
        content: newNoteContent,
        template: defaultTemplate
      }, newNoteTags)
      setNewNoteContent("")
      setNewNoteTags([])
      setIsCreatingNote(false)
    }
  }

  const handleStartCreatingNote = () => {
    setNoteFormMode('create')
    setEditingNote(null)
    setShowNoteForm(true)
  }

  const handleEditNote = (note: any) => {
    setNoteFormMode('edit')
    setEditingNote({
      id: note.id,
      title: note.title || '',
      content: note.text,
      template: note.template
    })
    setShowNoteForm(true)
  }

  const handleSaveNote = (noteData: { title: string; content: string; template: NoteTemplate }) => {
    if (noteFormMode === 'create') {
      if (activeTab === 'notes') {
        handleAddGeneralNote(noteData, newNoteTags)
      } else if (selectedRecipe) {
        handleAddNote(selectedRecipe.id, noteData)
      }
    } else if (noteFormMode === 'edit' && editingNote) {
      if (activeTab === 'notes') {
        handleUpdateGeneralNote(editingNote.id, noteData)
      } else if (selectedRecipe) {
        // Update recipe note
        const updatedRecipes = recipes.map((r) => {
          if (r.id === selectedRecipe.id) {
            return {
              ...r,
              notes: r.notes.map((n) =>
                n.id === editingNote.id
                  ? {
                      ...n,
                      title: noteData.title,
                      text: noteData.content,
                      html: noteData.content,
                      template: noteData.template,
                    }
                  : n
              ),
            }
          }
          return r
        })
        setRecipes(updatedRecipes)
        const updated = updatedRecipes.find((r) => r.id === selectedRecipe.id)
        if (updated) setSelectedRecipe(updated)
      }
    }
    setShowNoteForm(false)
    setEditingNote(null)
  }

  const handleToggleFavorite = (id: number) => {
    setRecipes(recipes.map((r) => 
      r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
    ))
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    // Track view count
    setRecipes(recipes.map(r => 
      r.id === recipe.id 
        ? { ...r, viewCount: (r.viewCount || 0) + 1, lastViewed: new Date().toISOString() }
        : r
    ))
  }

  const handleExportData = () => {
    const data = { recipes, generalNotes }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pizza-recipes-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.recipes && data.generalNotes) {
            // تحويل البيانات القديمة إلى التنسيق الجديد
            const convertedRecipes = data.recipes.map((recipe: any) => ({
              ...recipe,
              title: recipe.title || recipe.name,
              name: recipe.name || recipe.title,
              imageUrl: recipe.imageUrl || recipe.image,
              suggestedToppings: Array.isArray(recipe.suggestedToppings) 
                ? recipe.suggestedToppings 
                : recipe.suggestedToppings?.split(',').map((s: string) => s.trim()) || []
            }))
            setRecipes(convertedRecipes)
            setGeneralNotes(data.generalNotes)
            alert('Data imported successfully!')
          } else {
            alert('Invalid backup file format.')
          }
        } catch (error) {
          alert('Error reading backup file.')
        }
      }
      reader.readAsText(file)
    }
  }


  const categories = ['all', 'Pizza', 'Dough', 'Sauce', 'Toppings', 'Other']
  const noteTags = ['all', 'Technique', 'Ingredient', 'Equipment', 'Timing', 'Substitution', 'Quality', 'Storage', 'Other']
  
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Pizza': return <Pizza size={16} />
      case 'Dough': return <Bread size={16} />
      case 'Sauce': return <BowlFood size={16} />
      case 'Toppings': return <Cheese size={16} />
      default: return <FileText size={16} />
    }
  }
  
  const filteredNotes = useMemo(() => {
    return generalNotes.filter((note) => {
      const matchesPinned = !showPinnedNotes || note.isPinned
      
      return matchesPinned
    }).sort((a, b) => {
      // Pinned notes first, then by date
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [generalNotes, showPinnedNotes])


  if (!isClient) {
    return (
      <main className="flex h-screen bg-background">
        <div className="w-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Pizza Recipe App...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
      <main className="flex h-screen bg-background">
      {/* Sidebar - Navigation and List */}
      <div className="w-full md:w-80 border-r border-border flex flex-col bg-background">
        {/* Tab Navigation */}
        <div className="border-b border-border p-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setActiveTab("recipes")
                setSearchTerm("")
              }}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                activeTab === "recipes"
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              الوصفات
            </button>
            <button
              onClick={() => {
                setActiveTab("notes")
                setSearchTerm("")
              }}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                activeTab === "notes"
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              الملاحظات
            </button>
          </div>

          {/* Add Recipe Header */}
          {activeTab === "recipes" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Button
                  onClick={() => window.location.href = '/add-recipe'}
                  className="bg-foreground hover:bg-foreground/90 text-background flex items-center gap-2 w-full py-8"
                >
                  <Plus size={18} />
                  إضافة وصفة
                </Button>
              </div>
              
              {/* Category Filter */}
              <div className="flex-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-10 text-sm w-full">
                    <SelectValue placeholder="اختر تصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat} className="text-sm">
                        {cat === 'all' ? 'جميع التصنيفات' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Export/Import */}
              <div className="flex gap-2">
                <Button
                  onClick={handleExportData}
                  size="sm"
                  variant="outline"
                  className="text-xs flex-1"
                >
                  <Download size={14} className="mr-1" />
                  تصدير
                </Button>
                <label className="flex-1">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs w-full"
                    asChild
                  >
                    <span>
                      <Upload size={14} className="mr-1" />
                      استيراد
                    </span>
                  </Button>
                </label>
              </div>
              
              {/* Simple Controls */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    {isDarkMode ? <Sun size={14} className="mr-1" /> : <Moon size={14} className="mr-1" />}
                    {isDarkMode ? 'Light' : 'Dark'}
                  </Button>
                  <Button
                    onClick={handleExportData}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Download size={14} className="mr-1" />
                    Backup
                  </Button>
                </div>
                
                {/* Backup Status */}
              </div>
              
            </div>
          )}
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "recipes" ? (
            // Recipes List
            <>
              {filteredRecipes.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">لم يتم العثور على وصفات</div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredRecipes.map((recipe) => (
                    <button
                      key={recipe.id}
                      onClick={() => setSelectedRecipe(recipe)}
                      className={`w-full text-left p-4 hover:bg-secondary transition-colors ${
                        selectedRecipe?.id === recipe.id ? "bg-secondary" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getCategoryIcon(recipe.category)}
                            <h3 className="font-medium text-foreground truncate">{recipe.title || recipe.name}</h3>
                            {recipe.isFavorite && <Star size={14} className="text-yellow-500" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {recipe.content.split("\n")[0]}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Notes List
            <div className="space-y-3 p-4">
              {/* Tags Filter */}
              <NotesSection
                notes={filteredNotes}
                onAdd={handleAddGeneralNote}
                onDelete={handleDeleteGeneralNote}
                onUpdate={handleUpdateGeneralNote}
                onTogglePin={handleToggleNotePin}
                onAddTag={handleAddNoteTag}
                onRemoveTag={handleRemoveNoteTag}
                availableTags={noteTags.filter(t => t !== 'all')}
                onCreateNote={handleStartCreatingNote}
              />
              
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Recipe Detail or Note Detail */}
      <div className="hidden md:flex flex-1 flex-col bg-background">
        {activeTab === "recipes" ? (
          selectedRecipe ? (
            <RecipeDetail
              recipe={selectedRecipe}
              onUpdate={handleUpdateRecipe}
              onDelete={handleDeleteRecipe}
              onEdit={handleEditRecipe}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-lg">Select a recipe to view</p>
              </div>
            </div>
          )
        ) : isCreatingNote ? (
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">New Note</h2>
              <Button
                onClick={() => {
                  setIsCreatingNote(false)
                  setNewNoteContent("")
                  setNewNoteTags([])
                }}
                variant="ghost"
                size="sm"
              >
                ✕
              </Button>
            </div>

            <div className="flex-1 flex flex-col gap-4 min-h-0">
              <div className="flex-1 min-h-0">
                <RichTextEditorClient
                  value={newNoteContent}
                  onChange={setNewNoteContent}
                  placeholder="ابدأ في كتابة ملاحظتك..."
                />
              </div>
              
              {/* Tags for new note */}
              {newNoteTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {newNoteTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-secondary text-xs text-muted-foreground rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={handleCreateNote} className="flex-1 bg-foreground hover:bg-foreground/90 text-background">
                  Save Note
                </Button>
                <Button
                  onClick={() => {
                    setIsCreatingNote(false)
                    setNewNoteContent("")
                    setNewNoteTags([])
                  }}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <NotesDetailView
            notes={generalNotes}
            onAdd={handleAddGeneralNote}
            onDelete={handleDeleteGeneralNote}
            onUpdate={handleUpdateGeneralNote}
          />
        )}
      </div>

      {/* Mobile Detail View */}
      {selectedRecipe && activeTab === "recipes" && (
        <div className="md:hidden fixed inset-0 bg-background z-50">
          <RecipeDetail
            recipe={selectedRecipe}
            onUpdate={handleUpdateRecipe}
            onDelete={handleDeleteRecipe}
            onEdit={handleEditRecipe}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onBack={() => setSelectedRecipe(null)}
          />
        </div>
      )}

        {/* Note Form Modal */}
        <NoteForm
          isOpen={showNoteForm}
          onClose={() => {
            setShowNoteForm(false)
            setEditingNote(null)
          }}
          onSave={handleSaveNote}
          initialTitle={editingNote?.title || ''}
          initialContent={editingNote?.content || ''}
          initialTemplate={editingNote?.template}
          mode={noteFormMode}
        />

        {/* Add Recipe Modal */}
        <AddRecipeModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddRecipe} 
        />

        {/* Edit Recipe Modal */}
        <EditRecipeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingRecipe(null)
          }}
          onUpdate={handleUpdateRecipe}
          recipe={editingRecipe}
        />
    </main>
  )
}
