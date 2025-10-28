"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Info, AlertTriangle, CheckCircle, XCircle, Moon } from "lucide-react"

export interface NoteTemplate {
  id: string
  name: string
  type: 'info' | 'success' | 'warning' | 'danger' | 'dark'
  icon: React.ReactNode
  bgColor: string
  borderColor: string
  textColor: string
  iconColor: string
}

const noteTemplates: NoteTemplate[] = [
  {
    id: 'info',
    name: 'معلومة',
    type: 'info',
    icon: <Info size={16} />,
    bgColor: 'bg-slate-50 dark:bg-slate-900/30',
    borderColor: 'border-slate-200 dark:border-slate-700',
    textColor: 'text-slate-700 dark:text-slate-300',
    iconColor: 'text-slate-500 dark:text-slate-400'
  },
  {
    id: 'success',
    name: 'نجاح',
    type: 'success',
    icon: <CheckCircle size={16} />,
    bgColor: 'bg-emerald-50/50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200/50 dark:border-emerald-800/50',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    iconColor: 'text-emerald-600 dark:text-emerald-500'
  },
  {
    id: 'warning',
    name: 'تحذير',
    type: 'warning',
    icon: <AlertTriangle size={16} />,
    bgColor: 'bg-amber-50/50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200/50 dark:border-amber-800/50',
    textColor: 'text-amber-700 dark:text-amber-400',
    iconColor: 'text-amber-600 dark:text-amber-500'
  },
  {
    id: 'danger',
    name: 'خطر',
    type: 'danger',
    icon: <XCircle size={16} />,
    bgColor: 'bg-rose-50/50 dark:bg-rose-950/30',
    borderColor: 'border-rose-200/50 dark:border-rose-800/50',
    textColor: 'text-rose-700 dark:text-rose-400',
    iconColor: 'text-rose-600 dark:text-rose-500'
  },
  {
    id: 'dark',
    name: 'داكن',
    type: 'dark',
    icon: <Moon size={16} />,
    bgColor: 'bg-zinc-100 dark:bg-zinc-900/50',
    borderColor: 'border-zinc-300 dark:border-zinc-700',
    textColor: 'text-zinc-700 dark:text-zinc-300',
    iconColor: 'text-zinc-600 dark:text-zinc-400'
  }
]

interface NoteTemplatesProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: NoteTemplate) => void
}

export default function NoteTemplates({ isOpen, onClose, onSelectTemplate }: NoteTemplatesProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg border border-border shadow-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">اختر قالب الملاحظة</h2>
          
          <div className="space-y-3">
            {noteTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template)
                  onClose()
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all hover:scale-105 ${template.bgColor} ${template.borderColor} ${template.textColor}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${template.iconColor}`}>
                    {template.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm opacity-75">قالب {template.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex justify-end mt-6">
            <Button onClick={onClose} variant="outline">
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { noteTemplates }