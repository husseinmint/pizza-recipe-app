"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Search } from "lucide-react"

interface RecipeFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  selectedDifficulty: string | null
  onDifficultyChange: (difficulty: string | null) => void
  categories: string[]
  difficulties: string[]
  resultCount: number
}

export default function RecipeFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  categories,
  difficulties,
  resultCount,
}: RecipeFiltersProps) {
  const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty

  const handleClearFilters = () => {
    onSearchChange("")
    onCategoryChange(null)
    onDifficultyChange(null)
  }

  return (
    <Card className="bg-white border-amber-200 p-6 mb-8">
      <div className="space-y-4">
        {/* Search Bar */}
        <div>
          <label className="block text-sm font-medium text-amber-900 mb-2">Search Recipes</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-amber-600" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by recipe name..."
              className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => onCategoryChange(selectedCategory === category ? null : category)}
                  className={`${
                    selectedCategory === category
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-amber-50 border border-amber-300 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">Difficulty</label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  onClick={() => onDifficultyChange(selectedDifficulty === difficulty ? null : difficulty)}
                  className={`${
                    selectedDifficulty === difficulty
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-amber-50 border border-amber-300 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters and Clear Button */}
        <div className="flex items-center justify-between pt-4 border-t border-amber-200">
          <div className="text-sm text-amber-700">
            <span className="font-medium">{resultCount}</span> recipe{resultCount !== 1 ? "s" : ""} found
          </div>
          {hasActiveFilters && (
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent gap-1"
            >
              <X size={16} />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
