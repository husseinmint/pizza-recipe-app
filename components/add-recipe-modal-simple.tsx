"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface AddRecipeModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (name: string, content: string, category: string) => void
}

export default function AddRecipeModal({ isOpen, onClose, onAdd }: AddRecipeModalProps) {
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("Other")

  const handleSubmit = () => {
    if (name.trim() && content.trim()) {
      onAdd(name, content, category)
      setName("")
      setContent("")
      setCategory("Other")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
          <h2 className="text-lg font-semibold text-foreground">New Recipe</h2>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded transition-colors">
            <X size={20} className="text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Recipe Name</label>
            <input
              type="text"
              placeholder="e.g., Classic Margherita"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-secondary text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-secondary text-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground"
            >
              <option value="Pizza">Pizza</option>
              <option value="Dough">Dough</option>
              <option value="Sauce">Sauce</option>
              <option value="Toppings">Toppings</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Recipe Content</label>
            <textarea
              placeholder="Enter your recipe details, ingredients, and instructions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-48 px-3 py-2 bg-secondary text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-foreground hover:bg-foreground/90 text-background">
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
