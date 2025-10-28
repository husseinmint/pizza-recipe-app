"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Package, Tag, UtensilsCrossed, Apple, FileText } from "lucide-react"
import RichTextEditorClient from "./rich-text-editor-client"
import RecipeTemplates from "./recipe-templates"

interface RecipeData {
  name: string
  content: string
  category: string
  imageUrl?: string
  ingredients?: string
  flavor?: string
  usage?: string
  suggestedToppings?: string
}

interface AddRecipeModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (recipeData: RecipeData) => void
}

export default function AddRecipeModal({ isOpen, onClose, onAdd }: AddRecipeModalProps) {
  const [recipeData, setRecipeData] = useState<RecipeData>({
    name: "",
    content: "",
    category: "Other",
    imageUrl: "",
    ingredients: "",
    flavor: "",
    usage: "",
    suggestedToppings: ""
  })
  const [showTemplates, setShowTemplates] = useState(false)

  const handleSubmit = () => {
    if (recipeData.name.trim() && recipeData.content.trim()) {
      onAdd(recipeData)
      setRecipeData({
        name: "",
        content: "",
        category: "Other",
        imageUrl: "",
        ingredients: "",
        flavor: "",
        usage: "",
        suggestedToppings: ""
      })
    }
  }

  const handleSelectTemplate = (template: any) => {
    setRecipeData({
      name: template.name,
      content: template.content,
      category: template.category,
      imageUrl: "",
      ingredients: template.ingredients,
      flavor: template.flavor,
      usage: template.usage,
      suggestedToppings: template.suggestedToppings
    })
  }

  const updateRecipeData = (field: keyof RecipeData, value: string) => {
    setRecipeData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
      <div className="bg-background rounded-lg shadow-lg w-full h-full max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
          <h2 className="text-lg font-semibold text-foreground">إضافة وصفة جديدة</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowTemplates(true)}
              variant="outline"
              size="sm"
              className="text-foreground hover:bg-secondary"
            >
              <FileText size={16} className="mr-1" />
              قوالب
            </Button>
            <button onClick={onClose} className="p-1 hover:bg-secondary rounded transition-colors">
              <X size={20} className="text-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4 space-y-4 min-h-0 overflow-y-auto">
          {/* Basic Info */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">اسم الوصفة</label>
              <input
                type="text"
                placeholder="مثال: بيتزا مارغريتا"
                value={recipeData.name}
                onChange={(e) => updateRecipeData('name', e.target.value)}
                className="w-full px-3 py-2 bg-secondary text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium text-foreground mb-2">التصنيف</label>
              <select
                value={recipeData.category}
                onChange={(e) => updateRecipeData('category', e.target.value)}
                className="w-full px-3 py-2 bg-secondary text-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                <option value="Pizza">بيتزا</option>
                <option value="Dough">عجين</option>
                <option value="Sauce">صلصة</option>
                <option value="Toppings">حشوات</option>
                <option value="Other">أخرى</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">رابط الصورة (اختياري)</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={recipeData.imageUrl || ""}
              onChange={(e) => updateRecipeData('imageUrl', e.target.value)}
              className="w-full px-3 py-2 bg-secondary text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Package size={16} className="text-primary" />
              المكونات
            </label>
            <textarea
              placeholder="اذكر المكونات المطلوبة..."
              value={recipeData.ingredients || ""}
              onChange={(e) => updateRecipeData('ingredients', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-secondary text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
            />
          </div>

          {/* Flavor */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Tag size={16} className="text-primary" />
              النكهة المميزة
            </label>
            <input
              type="text"
              placeholder="وصف النكهة المميزة للوصفة..."
              value={recipeData.flavor || ""}
              onChange={(e) => updateRecipeData('flavor', e.target.value)}
              className="w-full px-3 py-2 bg-secondary text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          {/* Usage */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <UtensilsCrossed size={16} className="text-primary" />
              الاستخدام
            </label>
            <input
              type="text"
              placeholder="متى وكيف تستخدم هذه الوصفة..."
              value={recipeData.usage || ""}
              onChange={(e) => updateRecipeData('usage', e.target.value)}
              className="w-full px-3 py-2 bg-secondary text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          {/* Suggested Toppings */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Apple size={16} className="text-primary" />
              الحشوات المقترحة
            </label>
            <textarea
              placeholder="اذكر الحشوات المقترحة..."
              value={recipeData.suggestedToppings || ""}
              onChange={(e) => updateRecipeData('suggestedToppings', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-secondary text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
            />
          </div>

          {/* Recipe Content */}
          <div className="flex-1 flex flex-col min-h-0">
            <label className="block text-sm font-medium text-foreground mb-2">تفاصيل الوصفة</label>
            <div className="flex-1 border border-border rounded-lg overflow-hidden min-h-0">
              <RichTextEditorClient
                value={recipeData.content}
                onChange={(value) => updateRecipeData('content', value)}
                placeholder="اكتب تفاصيل الوصفة والخطوات..."
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
            >
              إلغاء
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-foreground hover:bg-foreground/90 text-background">
              إنشاء الوصفة
            </Button>
          </div>
        </div>
      </div>

      {/* Recipe Templates Modal */}
      <RecipeTemplates
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  )
}
