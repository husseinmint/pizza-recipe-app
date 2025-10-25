"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, Trash2, Edit2, Eye } from "lucide-react"

interface Recipe {
  id: number
  name: string
  category: string
  prepTime: string
  servings: number
  difficulty: string
  image: string
  notes: string
}

interface RecipeCardProps {
  recipe: Recipe
  onDelete: (id: number) => void
  onEdit: (recipe: Recipe) => void
  onViewDetails: (recipe: Recipe) => void
}

export default function RecipeCard({ recipe, onDelete, onEdit, onViewDetails }: RecipeCardProps) {
  const difficultyColor = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  }

  return (
    <Card className="bg-white border-amber-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-amber-100">
        <img src={recipe.image || "/placeholder.svg"} alt={recipe.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColor[recipe.difficulty as keyof typeof difficultyColor]}`}
          >
            {recipe.difficulty}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-amber-900 mb-1">{recipe.name}</h3>
        <p className="text-sm text-amber-700 mb-3">{recipe.category}</p>

        <div className="flex gap-4 mb-4 text-sm text-amber-700">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            {recipe.prepTime}
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            {recipe.servings} servings
          </div>
        </div>

        <p className="text-sm text-amber-600 mb-4 italic">{recipe.notes}</p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
            onClick={() => onViewDetails(recipe)}
          >
            <Eye size={16} />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
            onClick={() => onEdit(recipe)}
          >
            <Edit2 size={16} />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
            onClick={() => onDelete(recipe.id)}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}
