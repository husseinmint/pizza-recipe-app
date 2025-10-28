"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Pizza, Bread, BowlFood, Cheese, FileText } from "@phosphor-icons/react"

interface RecipeTemplate {
  id: string
  name: string
  category: 'Pizza' | 'Dough' | 'Sauce' | 'Toppings' | 'Other'
  content: string
  ingredients: string
  flavor: string
  usage: string
  suggestedToppings: string
}

const recipeTemplates: RecipeTemplate[] = [
  {
    id: 'margherita-pizza',
    name: 'بيتزا مارغريتا',
    category: 'Pizza',
    content: '<h2>طريقة التحضير</h2><ol><li>افرد العجين في صينية البيتزا</li><li>ضع طبقة رقيقة من الصلصة</li><li>أضف الجبن الموزاريلا</li><li>أضف أوراق الريحان الطازجة</li><li>اخبز في فرن ساخن لمدة 10-12 دقيقة</li></ol>',
    ingredients: '• عجين البيتزا\n• صلصة الطماطم\n• جبن الموزاريلا\n• أوراق الريحان الطازجة\n• زيت الزيتون\n• ملح وفلفل',
    flavor: 'نكهة إيطالية أصيلة مع الطماطم الطازجة والريحان العطري',
    usage: 'وجبة عشاء مثالية أو غداء سريع مع السلطة',
    suggestedToppings: '• جبن بارميزان إضافي\n• طماطم كرزية\n• زيتون أسود\n• فلفل أحمر حلو'
  },
  {
    id: 'pizza-dough',
    name: 'عجين البيتزا',
    category: 'Dough',
    content: '<h2>طريقة التحضير</h2><ol><li>اخلط الدقيق والخميرة والملح</li><li>أضف الماء الدافئ تدريجياً</li><li>اعجن لمدة 8-10 دقائق</li><li>اتركه يتخمر لمدة ساعة</li><li>اقسمه إلى كرات واتركه يرتاح 30 دقيقة</li></ol>',
    ingredients: '• 500 جرام دقيق قمح\n• 7 جرام خميرة جافة\n• 10 جرام ملح\n• 300 مل ماء دافئ\n• 30 مل زيت زيتون',
    flavor: 'عجين ناعم ومرن مع نكهة خفيفة من زيت الزيتون',
    usage: 'قاعدة مثالية لجميع أنواع البيتزا',
    suggestedToppings: '• جبن الموزاريلا\n• صلصة الطماطم\n• أوراق الريحان\n• زيتون'
  },
  {
    id: 'tomato-sauce',
    name: 'صلصة الطماطم',
    category: 'Sauce',
    content: '<h2>طريقة التحضير</h2><ol><li>سخن زيت الزيتون في مقلاة</li><li>أضف البصل والثوم وقلب حتى يذبل</li><li>أضف الطماطم المقطعة</li><li>اتركه يغلي على نار هادئة لمدة 20 دقيقة</li><li>تبل بالملح والفلفل والأعشاب</li></ol>',
    ingredients: '• 800 جرام طماطم طازجة\n• بصلة متوسطة\n• 3 فصوص ثوم\n• 30 مل زيت زيتون\n• أوراق ريحان\n• ملح وفلفل أسود',
    flavor: 'نكهة طماطم طازجة مع رائحة الثوم والريحان',
    usage: 'صلصة أساسية للبيتزا والمعكرونة',
    suggestedToppings: '• جبن بارميزان\n• أوراق ريحان طازجة\n• زيتون أسود\n• فلفل أحمر حار'
  },
  {
    id: 'four-cheese-pizza',
    name: 'بيتزا الأربع جبن',
    category: 'Pizza',
    content: '<h2>طريقة التحضير</h2><ol><li>افرد العجين في الصينية</li><li>ضع طبقة رقيقة من الصلصة</li><li>وزع الجبن الأربع بالتساوي</li><li>أضف القليل من زيت الزيتون</li><li>اخبز حتى يذوب الجبن ويصبح ذهبياً</li></ol>',
    ingredients: '• عجين البيتزا\n• صلصة الطماطم\n• جبن الموزاريلا\n• جبن الشيدر\n• جبن البارميزان\n• جبن الريكوتا\n• زيت الزيتون',
    flavor: 'مزيج غني من أربع أنواع جبن مختلفة',
    usage: 'وجبة دسمة مثالية لمحبي الجبن',
    suggestedToppings: '• أوراق ريحان\n• طماطم كرزية\n• زيتون أسود\n• فلفل أحمر حلو'
  },
  {
    id: 'pepperoni-pizza',
    name: 'بيتزا الببروني',
    category: 'Pizza',
    content: '<h2>طريقة التحضير</h2><ol><li>افرد العجين في الصينية</li><li>ضع طبقة من الصلصة</li><li>أضف جبن الموزاريلا</li><li>وزع شرائح الببروني</li><li>اخبز حتى يصبح الجبن ذهبياً</li></ol>',
    ingredients: '• عجين البيتزا\n• صلصة الطماطم\n• جبن الموزاريلا\n• شرائح الببروني\n• زيت الزيتون\n• أوراق ريحان',
    flavor: 'نكهة مدخنة وحارة من الببروني مع الجبن الذائب',
    usage: 'وجبة شهية مثالية للعشاء',
    suggestedToppings: '• جبن بارميزان\n• فلفل أحمر حار\n• زيتون أسود\n• طماطم كرزية'
  }
]

interface RecipeTemplatesProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: RecipeTemplate) => void
}

export default function RecipeTemplates({ isOpen, onClose, onSelectTemplate }: RecipeTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredTemplates = selectedCategory === 'all' 
    ? recipeTemplates 
    : recipeTemplates.filter(template => template.category === selectedCategory)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Pizza': return <Pizza size={20} />
      case 'Dough': return <Bread size={20} />
      case 'Sauce': return <BowlFood size={20} />
      case 'Toppings': return <Cheese size={20} />
      default: return <FileText size={20} />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">قوالب الوصفات</h2>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded transition-colors">
            <X size={20} className="text-foreground" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b border-border">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              الكل
            </button>
            {['Pizza', 'Dough', 'Sauce', 'Toppings', 'Other'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${
                  selectedCategory === category 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {getCategoryIcon(category)}
                {category === 'Pizza' ? 'بيتزا' : 
                 category === 'Dough' ? 'عجين' :
                 category === 'Sauce' ? 'صلصة' :
                 category === 'Toppings' ? 'حشوات' : 'أخرى'}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template)
                  onClose()
                }}
                className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-2 mb-3">
                  {getCategoryIcon(template.category)}
                  <h3 className="font-semibold text-foreground">{template.name}</h3>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-foreground">المكونات:</span>
                    <span className="line-clamp-2">{template.ingredients.split('\n')[0]}...</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-foreground">النكهة:</span>
                    <span className="line-clamp-1">{template.flavor}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    انقر لاستخدام هذا القالب
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-border text-foreground hover:bg-secondary bg-transparent"
          >
            إلغاء
          </Button>
        </div>
      </div>
    </div>
  )
}
