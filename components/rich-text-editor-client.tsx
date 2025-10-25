"use client"

import { useState, useEffect } from "react"
import RichTextEditor from "./rich-text-editor"

interface RichTextEditorClientProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditorClient({ value, onChange, placeholder }: RichTextEditorClientProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="border border-border rounded-lg overflow-hidden flex flex-col h-full">
        <div className="flex flex-wrap items-center gap-1 p-3 border-b border-border bg-secondary overflow-y-auto">
          <div className="text-sm text-muted-foreground">Loading editor...</div>
        </div>
        <div className="p-4 bg-background flex-1 overflow-y-auto">
          <div className="text-sm text-muted-foreground">Loading rich text editor...</div>
        </div>
      </div>
    )
  }

  return (
    <RichTextEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  )
}

