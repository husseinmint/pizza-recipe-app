"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Trash2 } from "lucide-react"
import { Package, Tag, UtensilsCrossed, Apple, FileText, Clock, ChartBar, ListNumbers } from "@phosphor-icons/react"
import RichTextEditorClient from "./rich-text-editor-client"

interface Ingredient {
  name: string
  amount: string
  unit: string
}

interface Instruction {
  step: number
  description: string
  time: number
}

interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}

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
  ingredients?: Ingredient[]
  instructions?: Instruction[]
  tags?: string[]
  nutrition?: Nutrition
  flavor?: string
  usage?: string
  suggestedToppings?: string[]
}

interface AddRecipeModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (recipeData: RecipeData) => void
}

export default function AddRecipeModal({ isOpen, onClose, onAdd }: AddRecipeModalProps) {
  const [recipeData, setRecipeData] = useState<RecipeData>({
    title: "",
    description: "",
    content: "",
    category: "Other",
    cuisine: "",
    difficulty: "easy",
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    image: "",
    ingredients: [],
    instructions: [],
    tags: [],
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    },
    flavor: "",
    usage: "",
    suggestedToppings: []
  })
  const [activeTab, setActiveTab] = useState<'basic' | 'ingredients' | 'instructions' | 'nutrition' | 'details'>('basic')

  const handleSubmit = () => {
    if (recipeData.title.trim() && recipeData.content.trim()) {
      onAdd(recipeData)
      setRecipeData({
        title: "",
        description: "",
        content: "",
        category: "Other",
        cuisine: "",
        difficulty: "easy",
        prepTime: 0,
        cookTime: 0,
        servings: 1,
        image: "",
        ingredients: [],
        instructions: [],
        tags: [],
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0
        },
        flavor: "",
        usage: "",
        suggestedToppings: []
      })
      onClose()
    }
  }

  const addIngredient = () => {
    setRecipeData(prev => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), { name: "", amount: "", unit: "جرام" }]
    }))
  }

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    setRecipeData(prev => ({
      ...prev,
      ingredients: prev.ingredients?.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      ) || []
    }))
  }

  const removeIngredient = (index: number) => {
    setRecipeData(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index) || []
    }))
  }

  const addInstruction = () => {
    const newStep = (recipeData.instructions?.length || 0) + 1
    setRecipeData(prev => ({
      ...prev,
      instructions: [...(prev.instructions || []), { step: newStep, description: "", time: 0 }]
    }))
  }

  const updateInstruction = (index: number, field: keyof Instruction, value: string | number) => {
    setRecipeData(prev => ({
      ...prev,
      instructions: prev.instructions?.map((inst, i) => 
        i === index ? { ...inst, [field]: value } : inst
      ) || []
    }))
  }

  const removeInstruction = (index: number) => {
    setRecipeData(prev => ({
      ...prev,
      instructions: prev.instructions?.filter((_, i) => i !== index).map((inst, i) => ({ ...inst, step: i + 1 })) || []
    }))
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !recipeData.tags?.includes(tag.trim())) {
      setRecipeData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag.trim()]
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setRecipeData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const addSuggestedTopping = (topping: string) => {
    if (topping.trim() && !recipeData.suggestedToppings?.includes(topping.trim())) {
      setRecipeData(prev => ({
        ...prev,
        suggestedToppings: [...(prev.suggestedToppings || []), topping.trim()]
      }))
    }
  }

  const removeSuggestedTopping = (toppingToRemove: string) => {
    setRecipeData(prev => ({
      ...prev,
      suggestedToppings: prev.suggestedToppings?.filter(topping => topping !== toppingToRemove) || []
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">إضافة وصفة جديدة</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="flex border-b">
          {[
            { id: 'basic', label: 'معلومات أساسية', icon: FileText },
            { id: 'ingredients', label: 'المكونات', icon: Package },
            { id: 'instructions', label: 'خطوات التحضير', icon: ListNumbers },
            { id: 'nutrition', label: 'معلومات غذائية', icon: ChartBar },
            { id: 'details', label: 'تفاصيل إضافية', icon: Tag }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Basic Information */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">اسم الوصفة *</Label>
                <Input
                  id="title"
                  value={recipeData.title}
                  onChange={(e) => setRecipeData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="أدخل اسم الوصفة"
                />
              </div>

              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={recipeData.description}
                  onChange={(e) => setRecipeData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف مختصر للوصفة"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Select value={recipeData.category} onValueChange={(value) => setRecipeData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pizza">بيتزا</SelectItem>
                      <SelectItem value="Dough">عجين</SelectItem>
                      <SelectItem value="Sauce">صلصة</SelectItem>
                      <SelectItem value="Toppings">حشوات</SelectItem>
                      <SelectItem value="Other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cuisine">المطبخ</Label>
                  <Input
                    id="cuisine"
                    value={recipeData.cuisine}
                    onChange={(e) => setRecipeData(prev => ({ ...prev, cuisine: e.target.value }))}
                    placeholder="مثل: إيطالي، عربي"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prepTime">وقت التحضير (دقيقة)</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    value={recipeData.prepTime}
                    onChange={(e) => setRecipeData(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="cookTime">وقت الطبخ (دقيقة)</Label>
                  <Input
                    id="cookTime"
                    type="number"
                    value={recipeData.cookTime}
                    onChange={(e) => setRecipeData(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="servings">عدد الحصص</Label>
                  <Input
                    id="servings"
                    type="number"
                    value={recipeData.servings}
                    onChange={(e) => setRecipeData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="difficulty">مستوى الصعوبة</Label>
                <Select value={recipeData.difficulty} onValueChange={(value: any) => setRecipeData(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">سهل</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="hard">صعب</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image">رابط الصورة</Label>
                <Input
                  id="image"
                  value={recipeData.image}
                  onChange={(e) => setRecipeData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label>محتوى الوصفة *</Label>
                <RichTextEditorClient
                  content={recipeData.content}
                  onChange={(content) => setRecipeData(prev => ({ ...prev, content }))}
                  placeholder="اكتب تفاصيل الوصفة هنا..."
                />
              </div>
            </div>
          )}

          {/* Ingredients */}
          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">المكونات</h3>
                <Button onClick={addIngredient} size="sm">
                  <Plus size={16} className="mr-2" />
                  إضافة مكون
                </Button>
              </div>

              {recipeData.ingredients?.map((ingredient, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label>اسم المكون</Label>
                    <Input
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      placeholder="مثل: طماطم"
                    />
                  </div>
                  <div className="w-24">
                    <Label>الكمية</Label>
                    <Input
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                      placeholder="500"
                    />
                  </div>
                  <div className="w-24">
                    <Label>الوحدة</Label>
                    <Select value={ingredient.unit} onValueChange={(value) => updateIngredient(index, 'unit', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="جرام">جرام</SelectItem>
                        <SelectItem value="كيلو">كيلو</SelectItem>
                        <SelectItem value="مل">مل</SelectItem>
                        <SelectItem value="لتر">لتر</SelectItem>
                        <SelectItem value="كوب">كوب</SelectItem>
                        <SelectItem value="ملعقة كبيرة">ملعقة كبيرة</SelectItem>
                        <SelectItem value="ملعقة صغيرة">ملعقة صغيرة</SelectItem>
                        <SelectItem value="حبة">حبة</SelectItem>
                        <SelectItem value="رشة">رشة</SelectItem>
                        <SelectItem value="حسب الرغبة">حسب الرغبة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}

              {(!recipeData.ingredients || recipeData.ingredients.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package size={48} className="mx-auto mb-4 opacity-50" />
                  <p>لا توجد مكونات بعد. اضغط "إضافة مكون" لبدء إضافة المكونات.</p>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">خطوات التحضير</h3>
                <Button onClick={addInstruction} size="sm">
                  <Plus size={16} className="mr-2" />
                  إضافة خطوة
                </Button>
              </div>

              {recipeData.instructions?.map((instruction, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {instruction.step}
                    </div>
                    <span className="font-medium">الخطوة {instruction.step}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                      className="ml-auto"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label>وصف الخطوة</Label>
                      <Textarea
                        value={instruction.description}
                        onChange={(e) => updateInstruction(index, 'description', e.target.value)}
                        placeholder="اكتب وصف الخطوة هنا..."
                        rows={3}
                      />
                    </div>
                    <div className="w-32">
                      <Label>الوقت (دقيقة)</Label>
                      <Input
                        type="number"
                        value={instruction.time}
                        onChange={(e) => updateInstruction(index, 'time', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {(!recipeData.instructions || recipeData.instructions.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <ListNumbers size={48} className="mx-auto mb-4 opacity-50" />
                  <p>لا توجد خطوات بعد. اضغط "إضافة خطوة" لبدء إضافة خطوات التحضير.</p>
                </div>
              )}
            </div>
          )}

          {/* Nutrition */}
          {activeTab === 'nutrition' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">المعلومات الغذائية (لكل حصة)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="calories">السعرات الحرارية</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={recipeData.nutrition?.calories || 0}
                    onChange={(e) => setRecipeData(prev => ({
                      ...prev,
                      nutrition: { ...prev.nutrition!, calories: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="protein">البروتين (جرام)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={recipeData.nutrition?.protein || 0}
                    onChange={(e) => setRecipeData(prev => ({
                      ...prev,
                      nutrition: { ...prev.nutrition!, protein: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">الكربوهيدرات (جرام)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={recipeData.nutrition?.carbs || 0}
                    onChange={(e) => setRecipeData(prev => ({
                      ...prev,
                      nutrition: { ...prev.nutrition!, carbs: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fat">الدهون (جرام)</Label>
                  <Input
                    id="fat"
                    type="number"
                    value={recipeData.nutrition?.fat || 0}
                    onChange={(e) => setRecipeData(prev => ({
                      ...prev,
                      nutrition: { ...prev.nutrition!, fat: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fiber">الألياف (جرام)</Label>
                  <Input
                    id="fiber"
                    type="number"
                    value={recipeData.nutrition?.fiber || 0}
                    onChange={(e) => setRecipeData(prev => ({
                      ...prev,
                      nutrition: { ...prev.nutrition!, fiber: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional Details */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="flavor">النكهة المميزة</Label>
                <Textarea
                  id="flavor"
                  value={recipeData.flavor}
                  onChange={(e) => setRecipeData(prev => ({ ...prev, flavor: e.target.value }))}
                  placeholder="وصف النكهة المميزة للوصفة"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="usage">طريقة الاستخدام</Label>
                <Textarea
                  id="usage"
                  value={recipeData.usage}
                  onChange={(e) => setRecipeData(prev => ({ ...prev, usage: e.target.value }))}
                  placeholder="كيفية استخدام هذه الوصفة"
                  rows={2}
                />
              </div>

              <div>
                <Label>العلامات</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {recipeData.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="أضف علامة جديدة"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTag(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      addTag(input.value)
                      input.value = ''
                    }}
                  >
                    إضافة
                  </Button>
                </div>
              </div>

              <div>
                <Label>الحشوات المقترحة</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {recipeData.suggestedToppings?.map((topping, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
                    >
                      {topping}
                      <button
                        onClick={() => removeSuggestedTopping(topping)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="أضف حشوة مقترحة"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSuggestedTopping(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      addSuggestedTopping(input.value)
                      input.value = ''
                    }}
                  >
                    إضافة
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={!recipeData.title.trim() || !recipeData.content.trim()}>
            إضافة الوصفة
          </Button>
        </div>
      </div>
    </div>
  )
}