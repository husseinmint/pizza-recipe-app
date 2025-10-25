"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Clock, Users } from "lucide-react"
import RecipeNotes from "@/components/recipe-notes"

interface Note {
  id: number
  text: string
  createdAt: string
}

interface Recipe {
  id: number
  name: string
  category: string
  prepTime: string
  servings: number
  difficulty: string
  image: string
  notes: string
  recipeNotes: Note[]
}

interface RecipeDetailModalProps {
  isOpen: boolean
  recipe: Recipe | null
  onClose: () => void
  onAddNote: (recipeId: number, note: Omit<Note, "id">) => void
  onDeleteNote: (recipeId: number, noteId: number) => void
  onEditNote: (recipeId: number, noteId: number, text: string) => void
}

export default function RecipeDetailModal({
  isOpen,
  recipe,
  onClose,
  onAddNote,
  onDeleteNote,
  onEditNote,
}: RecipeDetailModalProps) {
  if (!isOpen || !recipe) return null

  const difficultyColor = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-amber-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-amber-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-amber-900">{recipe.name}</h2>
          <button onClick={onClose} className="text-amber-700 hover:text-amber-900">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative h-64 bg-amber-100 rounded-lg overflow-hidden">
            <img src={recipe.image || "/placeholder.svg"} alt={recipe.name} className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColor[recipe.difficulty as keyof typeof difficultyColor]}`}
              >
                {recipe.difficulty}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-amber-50 border-amber-200 p-4">
              <p className="text-sm text-amber-700 font-medium">Category</p>
              <p className="text-lg font-semibold text-amber-900">{recipe.category}</p>
            </Card>
            <Card className="bg-amber-50 border-amber-200 p-4">
              <p className="text-sm text-amber-700 font-medium">Prep Time</p>
              <p className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                <Clock size={18} />
                {recipe.prepTime}
              </p>
            </Card>
            <Card className="bg-amber-50 border-amber-200 p-4">
              <p className="text-sm text-amber-700 font-medium">Servings</p>
              <p className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                <Users size={18} />
                {recipe.servings}
              </p>
            </Card>
            <Card className="bg-amber-50 border-amber-200 p-4">
              <p className="text-sm text-amber-700 font-medium">Tips</p>
              <p className="text-lg font-semibold text-amber-900">{recipe.notes}</p>
            </Card>
          </div>

          <div className="border-t border-amber-200 pt-6">
            <RecipeNotes
              recipeId={recipe.id}
              notes={recipe.recipeNotes || []}
              onAddNote={onAddNote}
              onDeleteNote={onDeleteNote}
              onEditNote={onEditNote}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
