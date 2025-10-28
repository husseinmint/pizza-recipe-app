"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import RichTextEditorClient from "./rich-text-editor-client"
import { NoteTemplate, noteTemplates } from "./note-templates"

interface NoteFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (noteData: { title: string; content: string; template: NoteTemplate }) => void
  initialTitle?: string
  initialContent?: string
  initialTemplate?: NoteTemplate
  mode?: 'create' | 'edit'
}

export default function NoteForm({
  isOpen,
  onClose,
  onSave,
  initialTitle = '',
  initialContent = '',
  initialTemplate,
  mode = 'create'
}: NoteFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [template, setTemplate] = useState<NoteTemplate | undefined>(initialTemplate)

  const handleSave = () => {
    if (!content.trim()) return
    
    const defaultTemplate: NoteTemplate = {
      id: 'info',
      name: 'معلومة',
      type: 'info',
      icon: null,
      bgColor: 'bg-slate-50 dark:bg-slate-900/30',
      borderColor: 'border-slate-200 dark:border-slate-700',
      textColor: 'text-slate-700 dark:text-slate-300',
      iconColor: 'text-slate-500 dark:text-slate-400'
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      template: template || defaultTemplate
    })
    
    // Reset form
    setTitle('')
    setContent('')
    setTemplate(undefined)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg border border-border shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              {mode === 'create' ? 'إضافة ملاحظة جديدة' : 'تعديل الملاحظة'}
            </h2>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X size={20} />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                عنوان الملاحظة
              </label>
              <input
                type="text"
                placeholder="أدخل عنوان الملاحظة..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-secondary text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                قالب الملاحظة
              </label>
              
              {/* Template Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {noteTemplates.map((templateOption) => (
                  <button
                    key={templateOption.id}
                    onClick={() => setTemplate(templateOption)}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      template?.id === templateOption.id 
                        ? `${templateOption.bgColor} ${templateOption.borderColor} ${templateOption.textColor} border-opacity-100` 
                        : 'bg-secondary border-border hover:bg-secondary/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={template?.id === templateOption.id ? templateOption.iconColor : 'text-muted-foreground'}>
                        {templateOption.icon}
                      </div>
                      <span className={`text-sm font-medium ${
                        template?.id === templateOption.id ? templateOption.textColor : 'text-foreground'
                      }`}>
                        {templateOption.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Selected Template Display */}
              <div className="flex gap-2 flex-wrap">
                {template && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${template.bgColor} ${template.borderColor} ${template.textColor}`}>
                    <div className={template.iconColor}>
                      {template.icon}
                    </div>
                    <span className="text-sm">{template.name}</span>
                    <button
                      onClick={() => setTemplate(undefined)}
                      className="text-xs opacity-75 hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {!template && (
                  <div className="text-sm text-muted-foreground px-3 py-2">
                    لم يتم اختيار قالب - سيتم استخدام القالب الافتراضي
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0">
              <label className="block text-sm font-medium text-foreground mb-2">
                محتوى الملاحظة *
              </label>
              <div className="border border-border rounded-lg overflow-hidden" style={{ minHeight: '300px' }}>
                <RichTextEditorClient
                  value={content}
                  onChange={setContent}
                  placeholder="اكتب محتوى الملاحظة..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={onClose} variant="outline">
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={!content.trim()}>
              {mode === 'create' ? 'إضافة الملاحظة' : 'حفظ التغييرات'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
