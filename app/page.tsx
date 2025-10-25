"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ChevronRight, Star, StarOff, Download, Upload, Filter, Moon, Sun, Printer, Image } from "lucide-react"
import { Pizza, Bread, BowlFood, Cheese, FileText } from "@phosphor-icons/react"
import RecipeDetail from "@/components/recipe-detail"
import NotesSection from "@/components/notes-section"
import AddRecipeModal from "@/components/add-recipe-modal-simple"
import NotesDetailView from "@/components/notes-detail-view"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useGitHubStorage } from "@/lib/github-api"
import GitHubConfigComponent from "@/components/github-config"
import ClientOnly from "@/components/client-only"
import RichTextEditorClient from "@/components/rich-text-editor-client"

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
  category: 'Pizza' | 'Dough' | 'Sauce' | 'Toppings' | 'Other'
  isFavorite?: boolean
  viewCount?: number
  lastViewed?: string
}

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

export default function Home() {
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>("pizza-recipes", [
    {
      id: 1,
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
  const [showFavorites, setShowFavorites] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [githubConfig, setGithubConfig] = useLocalStorage<any>("github-config", null)
  const [showGitHubConfig, setShowGitHubConfig] = useState(false)
  const [noteSearchTerm, setNoteSearchTerm] = useState("")
  const [selectedNoteTag, setSelectedNoteTag] = useState<string>("all")
  const [showPinnedNotes, setShowPinnedNotes] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isCreatingNote, setIsCreatingNote] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteTags, setNewNoteTags] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useLocalStorage("dark-mode", false)
  const [lastBackupTime, setLastBackupTime] = useLocalStorage("last-backup", null)
  
  const { saveToGitHub, loadFromGitHub, isLoading: githubLoading, error: githubError } = useGitHubStorage(githubConfig)

  useEffect(() => {
    setIsClient(true)
  }, [])

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
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = recipe.name.toLowerCase().includes(searchLower) ||
                           recipe.content.toLowerCase().includes(searchLower) ||
                           recipe.category.toLowerCase().includes(searchLower)
      
      const matchesFavorites = !showFavorites || recipe.isFavorite
      const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory
      
      return matchesSearch && matchesFavorites && matchesCategory
    })
  }, [recipes, searchTerm, showFavorites, selectedCategory])

  const handleAddRecipe = (name: string, content: string, category: string = 'Other') => {
    const newRecipe: Recipe = {
      id: Math.max(...recipes.map((r) => r.id), 0) + 1,
      name,
      content,
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: category as Recipe['category'],
      isFavorite: false,
      viewCount: 0,
    }
    setRecipes([newRecipe, ...recipes])
    setIsAddModalOpen(false)
  }

  const handleDeleteRecipe = (id: number) => {
    setRecipes(recipes.filter((r) => r.id !== id))
    if (selectedRecipe?.id === id) {
      setSelectedRecipe(null)
    }
  }

  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    setRecipes(recipes.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)))
    setSelectedRecipe(updatedRecipe)
  }

  const handleAddNote = (recipeId: number, noteText: string) => {
    const updatedRecipes = recipes.map((r) => {
      if (r.id === recipeId) {
        const newNote: Note = {
          id: Math.max(...(r.notes?.map((n) => n.id) || [0]), 0) + 1,
          text: noteText,
          html: noteText,
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

  const handleAddGeneralNote = (noteText: string, tags: string[] = [], template?: string, linkedRecipeId?: number) => {
    const newNote: GeneralNote = {
      id: Math.max(...generalNotes.map((n) => n.id), 0) + 1,
      text: noteText,
      html: noteText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags,
      isPinned: false,
      template,
      linkedRecipeId,
    }
    setGeneralNotes([newNote, ...generalNotes])
  }

  const handleDeleteGeneralNote = (id: number) => {
    setGeneralNotes(generalNotes.filter((n) => n.id !== id))
  }

  const handleUpdateGeneralNote = (id: number, noteText: string, tags?: string[]) => {
    setGeneralNotes(
      generalNotes.map((n) =>
        n.id === id
          ? {
              ...n,
              text: noteText,
              html: noteText,
              tags: tags || n.tags,
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
      handleAddGeneralNote(newNoteContent, newNoteTags)
      setNewNoteContent("")
      setNewNoteTags([])
      setIsCreatingNote(false)
    }
  }

  const handleStartCreatingNote = () => {
    setIsCreatingNote(true)
    setNewNoteContent("")
    setNewNoteTags([])
  }

  const handleSelectTemplate = (template: any) => {
    setNewNoteContent(template.content)
    setNewNoteTags(template.tags)
    setIsCreatingNote(true)
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
            setRecipes(data.recipes)
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
  
  const getCategoryIcon = (category: string) => {
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
      const searchLower = noteSearchTerm.toLowerCase()
      const matchesSearch = noteSearchTerm === "" || 
                           note.text.toLowerCase().includes(searchLower) ||
                           note.tags.some(tag => tag.toLowerCase().includes(searchLower))
      
      const matchesTag = selectedNoteTag === "all" || note.tags.includes(selectedNoteTag)
      const matchesPinned = !showPinnedNotes || note.isPinned
      
      return matchesSearch && matchesTag && matchesPinned
    }).sort((a, b) => {
      // Pinned notes first, then by date
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [generalNotes, noteSearchTerm, selectedNoteTag, showPinnedNotes])

  // Auto-save to GitHub when data changes
  useEffect(() => {
    if (githubConfig && recipes.length > 0) {
      const timeoutId = setTimeout(() => {
        saveToGitHub(recipes, generalNotes)
        setLastBackupTime(new Date().toISOString())
      }, 10000) // Auto-save every 10 seconds

      return () => clearTimeout(timeoutId)
    }
  }, [recipes, generalNotes, githubConfig])

  // Load from GitHub on mount
  useEffect(() => {
    if (githubConfig) {
      const loadData = async () => {
        try {
          const data = await loadFromGitHub()
          if (data.recipes && data.recipes.length > 0) {
            setRecipes(data.recipes)
          }
          if (data.generalNotes && data.generalNotes.length > 0) {
            setGeneralNotes(data.generalNotes)
          }
        } catch (error) {
          console.error('Failed to load from GitHub:', error)
        }
      }
      loadData()
    }
  }, [githubConfig, loadFromGitHub])

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
              Recipes
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
              Notes
            </button>
          </div>

          {/* Search/Add Header */}
          {activeTab === "recipes" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 bg-secondary text-foreground placeholder-muted-foreground rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                />
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  size="sm"
                  className="bg-foreground hover:bg-foreground/90 text-background"
                >
                  <Plus size={18} />
                </Button>
              </div>
              
              {/* Filters */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowFavorites(!showFavorites)}
                  size="sm"
                  variant={showFavorites ? "default" : "outline"}
                  className="text-xs"
                >
                  <Star size={14} className="mr-1" />
                  Favorites
                </Button>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2 py-1 bg-secondary text-foreground rounded text-xs border border-border"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
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
                  Export
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
                      Import
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
                {lastBackupTime && (
                  <p className="text-xs text-muted-foreground">
                    Last backup: {new Date(lastBackupTime).toLocaleTimeString()}
                  </p>
                )}
              </div>
              
              {/* GitHub Sync */}
              <div className="space-y-2">
                <GitHubConfigComponent 
                  config={githubConfig} 
                  onConfigChange={setGithubConfig}
                />
                {githubError && (
                  <p className="text-xs text-destructive">❌ {githubError}</p>
                )}
                {githubLoading && (
                  <p className="text-xs text-muted-foreground">🔄 Syncing with GitHub...</p>
                )}
                {githubConfig && !githubLoading && !githubError && (
                  <p className="text-xs text-green-600">✅ Connected to GitHub</p>
                )}
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
                <div className="p-4 text-center text-muted-foreground text-sm">No recipes found</div>
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
                            <h3 className="font-medium text-foreground truncate">{recipe.name}</h3>
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
              {/* Notes Search and Filters */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={noteSearchTerm}
                  onChange={(e) => setNoteSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary text-foreground placeholder-muted-foreground rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowPinnedNotes(!showPinnedNotes)}
                    size="sm"
                    variant={showPinnedNotes ? "default" : "outline"}
                    className="text-xs"
                  >
                    📌 Pinned
                  </Button>
                  <select
                    value={selectedNoteTag}
                    onChange={(e) => setSelectedNoteTag(e.target.value)}
                    className="px-2 py-1 bg-secondary text-foreground rounded text-xs border border-border"
                  >
                    {noteTags.map(tag => (
                      <option key={tag} value={tag}>
                        {tag === 'all' ? 'All Tags' : tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
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
                onSelectTemplate={handleSelectTemplate}
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
                  placeholder="Start writing your note..."
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
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onBack={() => setSelectedRecipe(null)}
          />
        </div>
      )}

      {/* Add Recipe Modal */}
      <AddRecipeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddRecipe} />
    </main>
  )
}
