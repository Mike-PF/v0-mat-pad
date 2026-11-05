"use client"

import { useState, type FormEvent } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Attribute } from "@/lib/attributes"

interface AttributeCreationTabProps {
  attributes: Attribute[]
  usageCount: (attributeId: string) => number
  onAdd: (attribute: Attribute) => void
  onUpdate: (attribute: Attribute) => void
  onDelete: (id: string) => void
}

export function AttributeCreationTab({ attributes, usageCount, onAdd, onUpdate, onDelete }: AttributeCreationTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const resetForm = () => {
    setEditingId(null)
    setName("")
    setDescription("")
    setError("")
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError("Enter an attribute name.")
      return
    }
    const duplicate = attributes.some((a) => a.id !== editingId && a.name.toLowerCase() === trimmed.toLowerCase())
    if (duplicate) {
      setError("An attribute with this name already exists.")
      return
    }
    if (editingId) {
      onUpdate({ id: editingId, name: trimmed, description: description.trim() })
    } else {
      onAdd({ id: `attr-${Date.now()}`, name: trimmed, description: description.trim() })
    }
    resetForm()
  }

  const startEdit = (attr: Attribute) => {
    setEditingId(attr.id)
    setName(attr.name)
    setDescription(attr.description)
    setError("")
  }

  const handleDelete = (attr: Attribute) => {
    const used = usageCount(attr.id)
    const message = used
      ? `Delete "${attr.name}"? It will be removed from ${used} mapped datablock${used === 1 ? "" : "s"}.`
      : `Delete "${attr.name}"?`
    if (!window.confirm(message)) return
    if (editingId === attr.id) resetForm()
    onDelete(attr.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
      >
        <h2 className="text-sm font-semibold text-slate-900">{editingId ? "Edit attribute" : "New attribute"}</h2>
        <div className="grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
          <div className="flex flex-col gap-2">
            <Label htmlFor="attribute-name">Name</Label>
            <Input
              id="attribute-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError("")
              }}
              placeholder="e.g. Quality of education"
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
              placeholder="What this attribute covers"
              className="bg-card"
            />
          </div>
          <div className="flex gap-2">
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
            <Button type="submit" className="bg-[#33295e] hover:bg-[#33295e]/90 text-white">
              {editingId ? (
                "Save attribute"
              ) : (
                <>
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  Add attribute
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
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th scope="col" className="text-left font-semibold px-4 py-3">
                Attribute
              </th>
              <th scope="col" className="text-left font-semibold px-4 py-3">
                Description
              </th>
              <th scope="col" className="text-left font-semibold px-4 py-3 w-40">
                Mapped datablocks
              </th>
              <th scope="col" className="px-4 py-3 w-28">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {attributes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                  No attributes yet. Add one above to start mapping datablocks.
                </td>
              </tr>
            ) : (
              attributes.map((attr) => (
                <tr
                  key={attr.id}
                  className={`border-t border-slate-200 ${editingId === attr.id ? "bg-[#33295e]/5" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{attr.name}</td>
                  <td className="px-4 py-3 text-slate-600">{attr.description || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{usageCount(attr.id)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(attr)}
                        aria-label={`Edit ${attr.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(attr)}
                        aria-label={`Delete ${attr.name}`}
                        className="text-slate-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
