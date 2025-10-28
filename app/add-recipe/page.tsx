"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import AddRecipeModal from "@/components/add-recipe-modal-advanced"

interface RecipeData {
  title: string
  description?: string
  content: string
  category: string
  cuisine?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  prepTime?: number
  cookTime?: number
  servings?: number
  image?: string
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

export default function AddRecipePage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(true)

  const handleAddRecipe = async (recipeData: RecipeData) => {
    try {
      // Get existing recipes from localStorage
      const existingRecipes = JSON.parse(localStorage.getItem('pizza-recipes') || '[]')
      
      // Create new recipe with proper structure
      const newRecipe = {
        id: Math.max(...existingRecipes.map((r: any) => r.id), 0) + 1,
        title: recipeData.title,
        name: recipeData.title, // للتوافق مع الكود القديم
        description: recipeData.description,
        content: recipeData.content,
        notes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: recipeData.category,
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
      
      // Add to beginning of array
      existingRecipes.unshift(newRecipe)
      
      // Save back to localStorage
      localStorage.setItem('pizza-recipes', JSON.stringify(existingRecipes))
      
      // Navigate back to home
      router.push('/')
    } catch (error) {
      console.error('Error saving recipe:', error)
      alert('حدث خطأ أثناء حفظ الوصفة')
    }
  }

  const handleClose = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background px-4 py-3 sticky top-0 z-10 flex items-center gap-3">
        <button
          onClick={handleClose}
          className="p-2 hover:bg-secondary rounded transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground flex-1">إضافة وصفة جديدة</h1>
      </div>

      {/* Modal */}
      <AddRecipeModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onAdd={handleAddRecipe}
      />
    </div>
  )
}