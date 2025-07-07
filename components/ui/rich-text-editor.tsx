"use client"

import { useState, useRef, useEffect } from "react"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Table,
  Undo,
  Redo,
  Type,
  Highlighter,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [selectedFont, setSelectedFont] = useState("Arial")
  const [textColor, setTextColor] = useState("#000000")
  const [highlightColor, setHighlightColor] = useState("#ffff00")

  const fonts = ["Arial", "Times New Roman", "Helvetica", "Georgia", "Verdana", "Calibri"]

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertTable = () => {
    const table = `
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ccc;">Cell 1</td>
          <td style="padding: 8px; border: 1px solid #ccc;">Cell 2</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ccc;">Cell 3</td>
          <td style="padding: 8px; border: 1px solid #ccc;">Cell 4</td>
        </tr>
      </table>
    `
    execCommand("insertHTML", table)
  }

  return (
    <div className={`border border-slate-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
        {/* Basic Formatting */}
        <Button variant="ghost" size="sm" onClick={() => execCommand("bold")} className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => execCommand("italic")} className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => execCommand("underline")} className="h-8 w-8 p-0">
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* Font Selection */}
        <select
          value={selectedFont}
          onChange={(e) => {
            setSelectedFont(e.target.value)
            execCommand("fontName", e.target.value)
          }}
          className="text-xs border border-slate-300 rounded px-2 py-1 bg-white"
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* Text Color */}
        <div className="flex items-center gap-1">
          <Type className="h-4 w-4 text-slate-600" />
          <input
            type="color"
            value={textColor}
            onChange={(e) => {
              setTextColor(e.target.value)
              execCommand("foreColor", e.target.value)
            }}
            className="w-6 h-6 border border-slate-300 rounded cursor-pointer"
          />
        </div>

        {/* Highlight Color */}
        <div className="flex items-center gap-1">
          <Highlighter className="h-4 w-4 text-slate-600" />
          <input
            type="color"
            value={highlightColor}
            onChange={(e) => {
              setHighlightColor(e.target.value)
              execCommand("backColor", e.target.value)
            }}
            className="w-6 h-6 border border-slate-300 rounded cursor-pointer"
          />
        </div>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* Lists */}
        <Button variant="ghost" size="sm" onClick={() => execCommand("insertUnorderedList")} className="h-8 w-8 p-0">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => execCommand("insertOrderedList")} className="h-8 w-8 p-0">
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* Table */}
        <Button variant="ghost" size="sm" onClick={insertTable} className="h-8 w-8 p-0">
          <Table className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* Alignment */}
        <Button variant="ghost" size="sm" onClick={() => execCommand("justifyLeft")} className="h-8 w-8 p-0">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => execCommand("justifyCenter")} className="h-8 w-8 p-0">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => execCommand("justifyRight")} className="h-8 w-8 p-0">
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* Undo/Redo */}
        <Button variant="ghost" size="sm" onClick={() => execCommand("undo")} className="h-8 w-8 p-0">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => execCommand("redo")} className="h-8 w-8 p-0">
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[120px] p-4 focus:outline-none"
        style={{ minHeight: "120px" }}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />
    </div>
  )
}
