"use client"

import { useMemo, useState } from "react"
import { ChevronDown, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DATABLOCKS, MAX_ATTRIBUTES_PER_DATABLOCK, type Attribute } from "@/lib/attributes"

interface DatablockMappingTabProps {
  attributes: Attribute[]
  mappings: Record<string, string[]>
  onSave: (mappings: Record<string, string[]>) => void
}

type Filter = "all" | "mapped" | "unmapped"

export function DatablockMappingTab({ attributes, mappings, onSave }: DatablockMappingTabProps) {
  const [draft, setDraft] = useState<Record<string, string[]>>(mappings)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [savedNote, setSavedNote] = useState(false)

  const attributeById = useMemo(() => new Map(attributes.map((a) => [a.id, a])), [attributes])
  const selectedFor = (blockId: string) => (draft[blockId] ?? []).filter((id) => attributeById.has(id))

  const isDirty = DATABLOCKS.some((b) => {
    const a = selectedFor(b.id)
    const s = (mappings[b.id] ?? []).filter((id) => attributeById.has(id))
    return a.length !== s.length || a.some((id) => !s.includes(id))
  })

  const mappedCount = DATABLOCKS.filter((b) => selectedFor(b.id).length > 0).length

  const visibleSections = useMemo(() => {
    const q = search.trim().toLowerCase()
    const groups = new Map<string, typeof DATABLOCKS>()
    for (const block of DATABLOCKS) {
      const count = (draft[block.id] ?? []).filter((id) => attributeById.has(id)).length
      if (filter === "mapped" && count === 0) continue
      if (filter === "unmapped" && count > 0) continue
      if (q && !block.name.toLowerCase().includes(q) && !block.section.toLowerCase().includes(q)) continue
      groups.set(block.section, [...(groups.get(block.section) ?? []), block])
    }
    return [...groups.entries()]
  }, [search, filter, draft, attributeById])

  const toggle = (blockId: string, attributeId: string) => {
    setSavedNote(false)
    setDraft((prev) => {
      const current = (prev[blockId] ?? []).filter((id) => attributeById.has(id))
      if (current.includes(attributeId)) return { ...prev, [blockId]: current.filter((id) => id !== attributeId) }
      if (current.length >= MAX_ATTRIBUTES_PER_DATABLOCK) return prev
      return { ...prev, [blockId]: [...current, attributeId] }
    })
  }

  const handleSave = () => {
    const cleaned = Object.fromEntries(
      Object.entries(draft)
        .map(([id, ids]) => [id, ids.filter((x) => attributeById.has(x))] as const)
        .filter(([, ids]) => ids.length > 0),
    )
    onSave(cleaned)
    setDraft(cleaned)
    setSavedNote(true)
  }

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "mapped", label: "Mapped" },
    { id: "unmapped", label: "Unmapped" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search datablocks"
              aria-label="Search datablocks"
              className="pl-9"
            />
          </div>
          <div className="flex rounded-lg bg-slate-100 p-1" role="group" aria-label="Filter datablocks">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.id ? "bg-card text-[#33295e] shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="text-sm text-slate-500">
            {mappedCount} of {DATABLOCKS.length} mapped
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isDirty ? (
            <span className="text-xs font-medium text-amber-600">Unsaved changes</span>
          ) : (
            savedNote && <span className="text-xs font-medium text-emerald-600">Mappings saved</span>
          )}
          <Button variant="outline" disabled={!isDirty} onClick={() => setDraft(mappings)}>
            Discard
          </Button>
          <Button
            disabled={!isDirty}
            onClick={handleSave}
            className="bg-[#33295e] hover:bg-[#33295e]/90 text-white"
          >
            Save mappings
          </Button>
        </div>
      </div>

      {attributes.length === 0 && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          There are no attributes yet. Add some on the Creation tab before mapping datablocks.
        </p>
      )}

      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th scope="col" className="text-left font-semibold px-4 py-3 w-72">
                Datablock
              </th>
              <th scope="col" className="text-left font-semibold px-4 py-3">
                Mapped areas (up to {MAX_ATTRIBUTES_PER_DATABLOCK})
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleSections.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-10 text-center text-slate-500">
                  No datablocks match your filters.
                </td>
              </tr>
            ) : (
              visibleSections.map(([section, blocks]) => (
                <SectionRows
                  key={section}
                  section={section}
                  blocks={blocks}
                  attributes={attributes}
                  attributeById={attributeById}
                  selectedFor={selectedFor}
                  onToggle={toggle}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SectionRows({
  section,
  blocks,
  attributes,
  attributeById,
  selectedFor,
  onToggle,
}: {
  section: string
  blocks: typeof DATABLOCKS
  attributes: Attribute[]
  attributeById: Map<string, Attribute>
  selectedFor: (blockId: string) => string[]
  onToggle: (blockId: string, attributeId: string) => void
}) {
  return (
    <>
      <tr className="border-t border-slate-200 bg-slate-50/60">
        <th colSpan={2} scope="colgroup" className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          {section}
        </th>
      </tr>
      {blocks.map((block) => {
        const selected = selectedFor(block.id)
        const atLimit = selected.length >= MAX_ATTRIBUTES_PER_DATABLOCK
        return (
          <tr key={block.id} className="border-t border-slate-200 align-top">
            <th scope="row" className="px-4 py-3 text-left font-medium text-slate-900">
              {block.name}
            </th>
            <td className="px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                {selected.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded-full bg-[#33295e]/10 py-1 pl-2.5 pr-1 text-xs font-medium text-[#33295e]"
                  >
                    {attributeById.get(id)?.name}
                    <button
                      type="button"
                      onClick={() => onToggle(block.id, id)}
                      aria-label={`Remove ${attributeById.get(id)?.name} from ${block.name}`}
                      className="rounded-full p-0.5 hover:bg-[#33295e]/15"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      disabled={attributes.length === 0}
                      className="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-slate-400 hover:text-slate-900 disabled:opacity-50"
                      aria-label={`Choose areas for ${block.name}`}
                    >
                      {selected.length === 0 ? "Map areas" : `${selected.length}/${MAX_ATTRIBUTES_PER_DATABLOCK}`}
                      <ChevronDown className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-72 p-2">
                    <p className="px-2 pb-2 text-xs text-slate-500">
                      {atLimit
                        ? `Limit of ${MAX_ATTRIBUTES_PER_DATABLOCK} reached. Remove one to add another.`
                        : `Select up to ${MAX_ATTRIBUTES_PER_DATABLOCK} areas.`}
                    </p>
                    <div className="flex max-h-64 flex-col overflow-y-auto">
                      {attributes.map((attr) => {
                        const checked = selected.includes(attr.id)
                        const disabled = !checked && atLimit
                        const checkboxId = `map-${block.id}-${attr.id}`
                        return (
                          <label
                            key={attr.id}
                            htmlFor={checkboxId}
                            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                              disabled ? "cursor-not-allowed text-slate-400" : "cursor-pointer text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <Checkbox
                              id={checkboxId}
                              checked={checked}
                              disabled={disabled}
                              onCheckedChange={() => onToggle(block.id, attr.id)}
                              className="data-[state=checked]:bg-[#33295e] data-[state=checked]:border-[#33295e]"
                            />
                            {attr.name}
                          </label>
                        )
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </td>
          </tr>
        )
      })}
    </>
  )
}
