"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextAlign } from "@tiptap/extension-text-align"
import { Underline } from "@tiptap/extension-underline"
import { Color } from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import { Highlight } from "@tiptap/extension-highlight"
import { Link } from "@tiptap/extension-link"
import { Image } from "@tiptap/extension-image"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import { TaskList } from "@tiptap/extension-task-list"
import { TaskItem } from "@tiptap/extension-task-item"
import { HorizontalRule } from "@tiptap/extension-horizontal-rule"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Palette,
  Highlighter,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  CheckSquare,
  Minus,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Color,
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      HorizontalRule,
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!isMounted || !editor) {
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
    <div className="border border-border rounded-lg overflow-hidden flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-border bg-secondary overflow-y-auto">
        {/* Text Formatting */}
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("bold") ? "bg-foreground/20" : ""}
          title="Bold (Cmd+B)"
        >
          <Bold size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("italic") ? "bg-foreground/20" : ""}
          title="Italic (Cmd+I)"
        >
          <Italic size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("underline") ? "bg-foreground/20" : ""}
          title="Underline (Cmd+U)"
        >
          <UnderlineIcon size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("strike") ? "bg-foreground/20" : ""}
          title="Strikethrough"
        >
          <Strikethrough size={18} />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Headings */}
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("heading", { level: 1 }) ? "bg-foreground/20" : ""}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("heading", { level: 2 }) ? "bg-foreground/20" : ""}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("heading", { level: 3 }) ? "bg-foreground/20" : ""}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("bulletList") ? "bg-foreground/20" : ""}
          title="Bullet List"
        >
          <List size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("orderedList") ? "bg-foreground/20" : ""}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Blocks */}
        <Button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("codeBlock") ? "bg-foreground/20" : ""}
          title="Code Block"
        >
          <Code size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("blockquote") ? "bg-foreground/20" : ""}
          title="Quote"
        >
          <Quote size={18} />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Alignment */}
        <Button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          variant="ghost"
          size="sm"
          className={editor.isActive({ textAlign: "left" }) ? "bg-foreground/20" : ""}
          title="Align Left"
        >
          <AlignLeft size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          variant="ghost"
          size="sm"
          className={editor.isActive({ textAlign: "center" }) ? "bg-foreground/20" : ""}
          title="Align Center"
        >
          <AlignCenter size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          variant="ghost"
          size="sm"
          className={editor.isActive({ textAlign: "right" }) ? "bg-foreground/20" : ""}
          title="Align Right"
        >
          <AlignRight size={18} />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Advanced Formatting */}
        <Button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("highlight") ? "bg-foreground/20" : ""}
          title="Highlight"
        >
          <Highlighter size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("subscript") ? "bg-foreground/20" : ""}
          title="Subscript"
        >
          <SubscriptIcon size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("superscript") ? "bg-foreground/20" : ""}
          title="Superscript"
        >
          <SuperscriptIcon size={18} />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Links and Media */}
        <Button
          onClick={() => {
            const url = window.prompt('Enter URL:')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          variant="ghost"
          size="sm"
          className={editor.isActive("link") ? "bg-foreground/20" : ""}
          title="Add Link"
        >
          <LinkIcon size={18} />
        </Button>
        <Button
          onClick={() => {
            const url = window.prompt('Enter image URL:')
            if (url) {
              editor.chain().focus().setImage({ src: url }).run()
            }
          }}
          variant="ghost"
          size="sm"
          title="Add Image"
        >
          <ImageIcon size={18} />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Tables and Lists */}
        <Button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          variant="ghost"
          size="sm"
          title="Insert Table"
        >
          <TableIcon size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          variant="ghost"
          size="sm"
          className={editor.isActive("taskList") ? "bg-foreground/20" : ""}
          title="Task List"
        >
          <CheckSquare size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          variant="ghost"
          size="sm"
          title="Horizontal Rule"
        >
          <Minus size={18} />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Color Picker */}
        <div className="flex items-center gap-1">
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="w-8 h-8 rounded border border-border cursor-pointer"
            title="Text Color"
          />
          <Button
            onClick={() => editor.chain().focus().unsetColor().run()}
            variant="ghost"
            size="sm"
            title="Remove Color"
          >
            <Palette size={18} />
          </Button>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Undo/Redo */}
        <Button
          onClick={() => editor.chain().focus().undo().run()}
          variant="ghost"
          size="sm"
          disabled={!editor.can().undo()}
          title="Undo (Cmd+Z)"
        >
          <Undo2 size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().redo().run()}
          variant="ghost"
          size="sm"
          disabled={!editor.can().redo()}
          title="Redo (Cmd+Shift+Z)"
        >
          <Redo2 size={18} />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="flex-1 overflow-y-auto p-4 text-foreground bg-background focus:outline-none prose prose-sm max-w-none min-h-0 prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-secondary prose-blockquote:text-foreground prose-li:text-foreground prose-table:text-foreground prose-th:text-foreground prose-td:text-foreground"
        placeholder={placeholder}
      />
    </div>
  )
}
