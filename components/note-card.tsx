"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Calendar, Pin, PinOff } from "lucide-react"
import { NoteTemplate } from "./note-templates"

interface NoteCardProps {
  note: {
    id: number
    title?: string
    text: string
    html?: string
    createdAt: string
    template?: NoteTemplate
    isPinned?: boolean
    tags?: string[]
  }
  onClick?: () => void
  onEdit?: (e?: React.MouseEvent) => void
  onDelete?: (e?: React.MouseEvent) => void
  onTogglePin?: (e?: React.MouseEvent) => void
  showActions?: boolean
}

export default function NoteCard({ 
  note, 
  onClick,
  onEdit, 
  onDelete, 
  onTogglePin,
  showActions = true 
}: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Generate color for tag based on name
  const getTagColor = (tag: string) => {
    const colors = {
      "عام": "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
      "مهم": "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300",
      "تذكير": "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
      "فكرة": "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
      "عمل": "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
      "شخصي": "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300"
    }
    return colors[tag as keyof typeof colors] || "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
  }
  
  const template = note.template || {
    id: 'info',
    name: 'معلومة',
    type: 'info',
    icon: null,
    bgColor: 'bg-slate-50 dark:bg-slate-900/30',
    borderColor: 'border-slate-200 dark:border-slate-700',
    textColor: 'text-slate-700 dark:text-slate-300',
    iconColor: 'text-slate-500 dark:text-slate-400'
  }

  const displayText = note.html || note.text
  const isLongText = displayText.length > 200

  return (
    <div 
      className={`p-4 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer ${template.bgColor} ${template.borderColor} ${template.textColor}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          {note.title && (
            <h3 className="font-semibold text-base mb-1 truncate">{note.title}</h3>
          )}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 text-xs rounded-full ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm opacity-75">
            <Calendar size={14} />
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
            {note.isPinned && (
              <Pin size={14} className="text-yellow-600" />
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1">
            {onTogglePin && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onTogglePin(e)
                }}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-black/10"
              >
                {note.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
              </Button>
            )}
            {onEdit && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(e)
                }}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-black/10"
              >
                <Edit2 size={14} />
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(e)
                }}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div
          className={`prose prose-sm max-w-none ${template.textColor}`}
          dangerouslySetInnerHTML={{ 
            __html: isExpanded || !isLongText ? displayText : displayText.substring(0, 200) + '...' 
          }}
        />
        
        {isLongText && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm opacity-75 hover:opacity-100 underline"
          >
            {isExpanded ? 'عرض أقل' : 'عرض المزيد'}
          </button>
        )}
      </div>

    </div>
  )
}
