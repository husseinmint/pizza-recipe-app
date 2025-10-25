"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

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

interface EditRecipeModalProps {
  isOpen: boolean
  recipe: Recipe | null
  onClose: () => void
  onSave: (recipe: Recipe) => void
}

export default function EditRecipeModal({ isOpen, recipe, onClose, onSave }: EditRecipeModalProps) {
  const [formData, setFormData] = useState<Recipe | null>(null)

  useEffect(() => {
    if (recipe) {
      setFormData(recipe)
    }
  }, [recipe, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData) {
      onSave(formData)
      setFormData(null)
    }
  }

  if (!isOpen || !formData) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-amber-200 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-amber-200">
          <h2 className="text-2xl font-bold text-amber-900">Edit Recipe</h2>
          <button onClick={onClose} className="text-amber-700 hover:text-amber-900">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Recipe Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., Classic Margherita"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option>Traditional</option>
                <option>Specialty</option>
                <option>Premium</option>
                <option>Seasonal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">Prep Time</label>
              <input
                type="text"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., 24h"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">Servings</label>
              <input
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Notes & Tips</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Add any special notes or tips..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
