"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface AddNoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (text: string) => void
  initialText?: string
  isEditing?: boolean
}

export default function AddNoteModal({
  isOpen,
  onClose,
  onSave,
  initialText = "",
  isEditing = false,
}: AddNoteModalProps) {
  const [text, setText] = useState("")

  useEffect(() => {
    setText(initialText)
  }, [initialText, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onSave(text)
      setText("")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-amber-200 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-amber-200">
          <h2 className="text-2xl font-bold text-amber-900">{isEditing ? "Edit Note" : "Add Note"}</h2>
          <button onClick={onClose} className="text-amber-700 hover:text-amber-900">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">Note</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Write your note here..."
              rows={4}
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
              {isEditing ? "Update Note" : "Add Note"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
