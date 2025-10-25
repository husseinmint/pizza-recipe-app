"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Ingredient {
  id: number
  name: string
  amount: number
  unit: string
}

export default function IngredientScaler() {
  const [servings, setServings] = useState(4)
  const [originalServings, setOriginalServings] = useState(4)
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: "Flour", amount: 500, unit: "g" },
    { id: 2, name: "Water", amount: 325, unit: "ml" },
    { id: 3, name: "Salt", amount: 10, unit: "g" },
    { id: 4, name: "Yeast", amount: 3, unit: "g" },
  ])
  const [newIngredient, setNewIngredient] = useState({ name: "", amount: "", unit: "g" })

  const scaleFactor = servings / originalServings

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.amount) {
      setIngredients([
        ...ingredients,
        {
          id: Math.max(...ingredients.map((i) => i.id), 0) + 1,
          name: newIngredient.name,
          amount: Number(newIngredient.amount),
          unit: newIngredient.unit,
        },
      ])
      setNewIngredient({ name: "", amount: "", unit: "g" })
    }
  }

  const removeIngredient = (id: number) => {
    setIngredients(ingredients.filter((i) => i.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Ingredient Scaler</h2>

        {/* Servings Control */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">Original Servings</label>
            <input
              type="number"
              value={originalServings}
              onChange={(e) => setOriginalServings(Number(e.target.value))}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              min="1"
            />
          </div>
          <div className="flex items-end justify-center pb-2">
            <div className="text-2xl font-bold text-amber-600">→</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">New Servings</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              min="1"
            />
          </div>
        </div>

        {/* Ingredients List */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">Ingredients (Scale: {scaleFactor.toFixed(2)}x)</h3>
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <Card key={ingredient.id} className="bg-amber-50 border-amber-200 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-amber-900">{ingredient.name}</p>
                  <p className="text-sm text-amber-700">
                    {(ingredient.amount * scaleFactor).toFixed(2)} {ingredient.unit}
                  </p>
                </div>
                <Button
                  onClick={() => removeIngredient(ingredient.id)}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                >
                  Remove
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Add Ingredient */}
        <div className="border-t border-amber-200 pt-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">Add Ingredient</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
              placeholder="Ingredient name"
              className="px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="number"
              value={newIngredient.amount}
              onChange={(e) => setNewIngredient({ ...newIngredient, amount: e.target.value })}
              placeholder="Amount"
              className="px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <select
              value={newIngredient.unit}
              onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
              className="px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option>g</option>
              <option>kg</option>
              <option>ml</option>
              <option>l</option>
              <option>cup</option>
              <option>tbsp</option>
              <option>tsp</option>
            </select>
            <Button onClick={addIngredient} className="bg-amber-600 hover:bg-amber-700 text-white">
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
