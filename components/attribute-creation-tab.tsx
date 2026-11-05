"use client"

import { useRef, useState, type FormEvent } from "react"
import { ChevronRight, Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  MAX_ATTRIBUTE_DEPTH,
  childrenOf,
  depthOf,
  subtreeIds,
  type Attribute,
} from "@/lib/attributes"

interface AttributeCreationTabProps {
  attributes: Attribute[]
  usageCount: (attributeId: string) => number
  onAdd: (attribute: Attribute) => void
  onUpdate: (attribute: Attribute) => void
  onDelete: (id: string) => void
}

type FormMode = { kind: "add"; parentId: string | null } | { kind: "edit"; id: string }

export function AttributeCreationTab({ attributes, usageCount, onAdd, onUpdate, onDelete }: AttributeCreationTabProps) {
  const [mode, setMode] = useState<FormMode>({ kind: "add", parentId: null })
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const nameRef = useRef<HTMLInputElement>(null)

  const byId = new Map(attributes.map((a) => [a.id, a]))
  const parentId = mode.kind === "add" ? mode.parentId : (byId.get(mode.id)?.parentId ?? null)
  const parentName = parentId ? byId.get(parentId)?.name : null
  const level = parentId ? depthOf(attributes, parentId) + 1 : 1

  const resetForm = () => {
    setMode({ kind: "add", parentId: null })
    setName("")
    setDescription("")
    setError("")
  }

  const startAddChild = (parent: Attribute) => {
    setMode({ kind: "add", parentId: parent.id })
    setName("")
    setDescription("")
    setError("")
    setCollapsed((prev) => {
      const next = new Set(prev)
      next.delete(parent.id)
      return next
    })
    nameRef.current?.focus()
  }

  const startEdit = (attr: Attribute) => {
    setMode({ kind: "edit", id: attr.id })
    setName(attr.name)
    setDescription(attr.description)
    setError("")
    nameRef.current?.focus()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError("Enter an attribute name.")
      return
    }
    const editingId = mode.kind === "edit" ? mode.id : null
    const duplicate = childrenOf(attributes, parentId).some(
      (a) => a.id !== editingId && a.name.toLowerCase() === trimmed.toLowerCase(),
    )
    if (duplicate) {
      setError(parentName ? `"${parentName}" already has an item with this name.` : "A top-level item with this name already exists.")
      return
    }
    if (editingId) {
      onUpdate({ id: editingId, name: trimmed, description: description.trim(), parentId })
      resetForm()
    } else {
      onAdd({ id: `attr-${Date.now()}`, name: trimmed, description: description.trim(), parentId })
      setName("")
      setDescription("")
    }
  }

  const handleDelete = (attr: Attribute) => {
    const removed = subtreeIds(attributes, attr.id)
    const childCount = removed.size - 1
    const used = usageCount(attr.id)
    const parts = [`Delete "${attr.name}"?`]
    if (childCount) parts.push(`This also deletes ${childCount} item${childCount === 1 ? "" : "s"} beneath it.`)
    if (used) parts.push(`${used} datablock mapping${used === 1 ? "" : "s"} will be shortened.`)
    if (!window.confirm(parts.join(" "))) return
    if ((mode.kind === "edit" && removed.has(mode.id)) || (mode.kind === "add" && mode.parentId && removed.has(mode.parentId))) {
      resetForm()
    }
    onDelete(attr.id)
  }

  const toggleCollapsed = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const renderNodes = (parent: string | null, depth: number) =>
    childrenOf(attributes, parent).map((attr) => {
      const kids = childrenOf(attributes, attr.id)
      const isCollapsed = collapsed.has(attr.id)
      const isActive = (mode.kind === "edit" && mode.id === attr.id) || (mode.kind === "add" && mode.parentId === attr.id)
      const used = usageCount(attr.id)
      return (
        <li key={attr.id} role="treeitem" aria-expanded={kids.length ? !isCollapsed : undefined} aria-level={depth}>
          <div
            className={`group flex items-center gap-2 border-t border-slate-200 py-2 pr-3 ${isActive ? "bg-[#33295e]/5" : "hover:bg-slate-50"}`}
            style={{ paddingLeft: `${(depth - 1) * 24 + 12}px` }}
          >
            {kids.length ? (
              <button
                type="button"
                onClick={() => toggleCollapsed(attr.id)}
                aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${attr.name}`}
                className="rounded p-0.5 text-slate-500 hover:bg-slate-200"
              >
                <ChevronRight className={`w-4 h-4 transition-transform ${isCollapsed ? "" : "rotate-90"}`} />
              </button>
            ) : (
              <span className="w-5" aria-hidden="true" />
            )}
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">L{depth}</span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-slate-900">{attr.name}</span>
              {attr.description && <span className="truncate text-xs text-slate-500">{attr.description}</span>}
            </div>
            {used > 0 && (
              <span className="text-xs text-slate-500">
                {used} datablock{used === 1 ? "" : "s"}
              </span>
            )}
            <div className="flex gap-1">
              {depth < MAX_ATTRIBUTE_DEPTH && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => startAddChild(attr)}
                  className="h-8 text-[#33295e]"
                  aria-label={`Add item under ${attr.name}`}
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  Add child
                </Button>
              )}
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(attr)} aria-label={`Edit ${attr.name}`}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(attr)}
                aria-label={`Delete ${attr.name}`}
                className="h-8 w-8 text-slate-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {kids.length > 0 && !isCollapsed && <ul role="group">{renderNodes(attr.id, depth + 1)}</ul>}
        </li>
      )
    })

  const heading =
    mode.kind === "edit" ? "Edit item" : parentName ? `Add level ${level} item under "${parentName}"` : "Add top-level item"

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">{heading}</h2>
          {mode.kind === "add" && mode.parentId && (
            <button type="button" onClick={resetForm} className="text-sm text-[#33295e] hover:underline">
              Add at top level instead
            </button>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
          <div className="flex flex-col gap-2">
            <Label htmlFor="attribute-name">Name</Label>
            <Input
              id="attribute-name"
              ref={nameRef}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError("")
              }}
              placeholder={parentName ? "e.g. Curriculum" : "e.g. Quality of education"}
              aria-invalid={!!error}
              aria-describedby={error ? "attribute-name-error" : undefined}
              className="bg-card"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="attribute-description">Description (optional)</Label>
            <Input
              id="attribute-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this item covers"
              className="bg-card"
            />
          </div>
          <div className="flex gap-2">
            {(mode.kind === "edit" || mode.parentId) && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
            <Button type="submit" className="bg-[#33295e] hover:bg-[#33295e]/90 text-white">
              {mode.kind === "edit" ? (
                "Save item"
              ) : (
                <>
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  Add item
                </>
              )}
            </Button>
          </div>
        </div>
        {error && (
          <p id="attribute-name-error" role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </form>

      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between bg-slate-50 px-4 py-3 text-sm">
          <span className="font-semibold text-slate-600">Attribute tree</span>
          <span className="text-xs text-slate-500">Up to {MAX_ATTRIBUTE_DEPTH} levels</span>
        </div>
        {attributes.length === 0 ? (
          <p className="border-t border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
            No attributes yet. Add a top-level item above to start the tree.
          </p>
        ) : (
          <ul role="tree" aria-label="Attribute tree">
            {renderNodes(null, 1)}
          </ul>
        )}
      </div>
    </div>
  )
}
