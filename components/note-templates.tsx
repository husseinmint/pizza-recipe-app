"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Clock, ChefHat, Thermometer, Package, Lightbulb } from "lucide-react"

interface NoteTemplate {
  id: string
  name: string
  description: string
  content: string
  tags: string[]
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const templates: NoteTemplate[] = [
  {
    id: "technique",
    name: "Technique Note",
    description: "Cooking techniques and methods",
    content: "<h2>Technique:</h2><p></p><h3>Steps:</h3><ol><li></li><li></li><li></li></ol><h3>Tips:</h3><ul><li></li><li></li></ul><h3>Common Mistakes:</h3><ul><li></li><li></li></ul>",
    tags: ["Technique"],
    icon: ChefHat
  },
  {
    id: "ingredient",
    name: "Ingredient Note",
    description: "Ingredient information and substitutions",
    content: "<h2>Ingredient:</h2><p></p><h3>Quality Indicators:</h3><ul><li></li><li></li></ul><h3>Storage:</h3><ul><li></li></ul><h3>Substitutions:</h3><ul><li></li><li></li></ul><h3>Best Sources:</h3><ul><li></li></ul>",
    tags: ["Ingredient"],
    icon: Package
  },
  {
    id: "timing",
    name: "Timing Note",
    description: "Cooking times and schedules",
    content: "<h2>Process:</h2><p></p><h3>Timeline:</h3><ul><li><strong>Prep:</strong> </li><li><strong>Cook:</strong> </li><li><strong>Rest:</strong> </li></ul><h3>Key Checkpoints:</h3><ul><li></li><li></li></ul><h3>Signs of Doneness:</h3><ul><li></li></ul>",
    tags: ["Timing"],
    icon: Clock
  },
  {
    id: "temperature",
    name: "Temperature Note",
    description: "Temperature settings and monitoring",
    content: "<h2>Process:</h2><p></p><h3>Temperature Settings:</h3><ul><li><strong>Oven:</strong> </li><li><strong>Surface:</strong> </li></ul><h3>Monitoring:</h3><ul><li><strong>Target:</strong> </li><li><strong>Signs:</strong> </li></ul><h3>Troubleshooting:</h3><ul><li>Too hot: </li><li>Too cold: </li></ul>",
    tags: ["Equipment"],
    icon: Thermometer
  },
  {
    id: "substitution",
    name: "Substitution Note",
    description: "Ingredient substitutions and alternatives",
    content: "<h2>Original:</h2><p></p><h3>Substitutions:</h3><ol><li><strong>Best:</strong>  (ratio: )</li><li><strong>Good:</strong>  (ratio: )</li><li><strong>Emergency:</strong>  (ratio: )</li></ol><h3>Notes:</h3><ul><li></li><li></li></ul>",
    tags: ["Substitution"],
    icon: Lightbulb
  },
  {
    id: "quality",
    name: "Quality Note",
    description: "Quality assessment and standards",
    content: "<h2>Item:</h2><p></p><h3>Quality Standards:</h3><ul><li><strong>Appearance:</strong> </li><li><strong>Texture:</strong> </li><li><strong>Aroma:</strong> </li><li><strong>Taste:</strong> </li></ul><h3>Red Flags:</h3><ul><li></li><li></li></ul><h3>Best Practices:</h3><ul><li></li></ul>",
    tags: ["Quality"],
    icon: FileText
  }
]

interface NoteTemplatesProps {
  onSelectTemplate: (template: NoteTemplate) => void
  onClose: () => void
}

export default function NoteTemplates({ onSelectTemplate, onClose }: NoteTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<NoteTemplate | null>(null)

  const handleSelect = (template: NoteTemplate) => {
    onSelectTemplate(template)
    onClose()
  }

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      onClose()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Note Templates</h3>
        <Button onClick={onClose} variant="ghost" size="sm">
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {templates.map((template) => {
          const Icon = template.icon
          
          return (
            <Card
              key={template.id}
              className="p-4 cursor-pointer transition-colors border-border hover:border-foreground/50 hover:bg-secondary/50 hover:shadow-md"
              onClick={() => handleSelect(template)}
            >
              <div className="flex items-start gap-3">
                <Icon size={20} className="text-foreground mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{template.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-secondary text-xs text-muted-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">Click any template to use it</p>
        <Button onClick={onClose} variant="outline" size="sm">
          Cancel
        </Button>
      </div>
    </div>
  )
}
