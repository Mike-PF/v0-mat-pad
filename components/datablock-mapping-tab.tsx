"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DATABLOCKS,
  MAX_ATTRIBUTE_DEPTH,
  childrenOf,
  validPath,
  type Attribute,
  type Datablock,
} from "@/lib/attributes"

interface DatablockMappingTabProps {
  attributes: Attribute[]
  mappings: Record<string, string[]>
  onSave: (mappings: Record<string, string[]>) => void
}

type Filter = "all" | "mapped" | "unmapped"

const samePath = (a: string[], b: string[]) => a.length === b.length && a.every((id, i) => id === b[i])

const PAGE_SIZES = [10, 25, 50]

// Keep datablocks grouped by section (in first-seen order) so pages read cleanly.
const SECTION_ORDER = [...new Set(DATABLOCKS.map((b) => b.section))]
const SORTED_DATABLOCKS = [...DATABLOCKS].sort(
  (a, b) => SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section),
)

export function DatablockMappingTab({ attributes, mappings, onSave }: DatablockMappingTabProps) {
  const [draft, setDraft] = useState<Record<string, string[]>>(mappings)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [savedNote, setSavedNote] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const pathFor = (blockId: string) => validPath(attributes, draft[blockId])
  const isDirty = DATABLOCKS.some((b) => !samePath(pathFor(b.id), validPath(attributes, mappings[b.id])))
  const mappedCount = DATABLOCKS.filter((b) => pathFor(b.id).length > 0).length

  const filteredBlocks = useMemo(() => {
    const q = search.trim().toLowerCase()
    return SORTED_DATABLOCKS.filter((block) => {
      const mapped = validPath(attributes, draft[block.id]).length > 0
      if (filter === "mapped" && !mapped) return false
      if (filter === "unmapped" && mapped) return false
      return !q || block.name.toLowerCase().includes(q) || block.section.toLowerCase().includes(q)
    })
  }, [search, filter, draft, attributes])

  const totalPages = Math.max(1, Math.ceil(filteredBlocks.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const pageBlocks = filteredBlocks.slice(pageStart, pageStart + pageSize)

  const visibleSections = useMemo(() => {
    const groups = new Map<string, Datablock[]>()
    for (const block of pageBlocks) groups.set(block.section, [...(groups.get(block.section) ?? []), block])
    return [...groups.entries()]
  }, [pageBlocks])

  const selectAtLevel = (blockId: string, level: number, attributeId: string) => {
    setSavedNote(false)
    setDraft((prev) => {
      const current = validPath(attributes, prev[blockId])
      return { ...prev, [blockId]: [...current.slice(0, level), attributeId] }
    })
  }

  const clearPath = (blockId: string) => {
    setSavedNote(false)
    setDraft((prev) => ({ ...prev, [blockId]: [] }))
  }

  const handleSave = () => {
    const cleaned = Object.fromEntries(
      DATABLOCKS.map((b) => [b.id, validPath(attributes, draft[b.id])] as const).filter(([, path]) => path.length > 0),
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
    <TooltipProvider delayDuration={150}>
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
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
                onClick={() => {
                  setFilter(f.id)
                  setPage(1)
                }}
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
          <Button disabled={!isDirty} onClick={handleSave} className="bg-[#33295e] hover:bg-[#33295e]/90 text-white">
            Save mappings
          </Button>
        </div>
      </div>

      {attributes.length === 0 && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          There are no attributes yet. Build the tree on the Creation tab before mapping datablocks.
        </p>
      )}

      <div className="rounded-lg border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th scope="col" className="text-left font-semibold px-4 py-3 w-64">
                Datablock
              </th>
              <th scope="col" className="text-left font-semibold px-4 py-3">
                Mapped area (up to {MAX_ATTRIBUTE_DEPTH} levels)
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
                  pathFor={pathFor}
                  onSelect={selectAtLevel}
                  onClear={clearPath}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredBlocks.length > 0 && (
        <nav aria-label="Datablock pagination" className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span id="rows-per-page-label">Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v))
                setPage(1)
              }}
            >
              <SelectTrigger aria-labelledby="rows-per-page-label" className="h-9 w-20 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <span aria-live="polite">
              {pageStart + 1}–{Math.min(pageStart + pageSize, filteredBlocks.length)} of {filteredBlocks.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  variant={n === currentPage ? "default" : "ghost"}
                  size="icon"
                  className={`h-9 w-9 ${n === currentPage ? "bg-[#33295e] hover:bg-[#33295e]/90 text-white" : ""}`}
                  onClick={() => setPage(n)}
                  aria-label={`Page ${n}`}
                  aria-current={n === currentPage ? "page" : undefined}
                >
                  {n}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </nav>
      )}
    </div>
    </TooltipProvider>
  )
}

function SectionRows({
  section,
  blocks,
  attributes,
  pathFor,
  onSelect,
  onClear,
}: {
  section: string
  blocks: Datablock[]
  attributes: Attribute[]
  pathFor: (blockId: string) => string[]
  onSelect: (blockId: string, level: number, attributeId: string) => void
  onClear: (blockId: string) => void
}) {
  return (
    <>
      <tr className="border-t border-slate-200 bg-slate-50/60">
        <th
          colSpan={2}
          scope="colgroup"
          className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          {section}
        </th>
      </tr>
      {blocks.map((block) => (
        <tr key={block.id} className="border-t border-slate-200 align-middle">
          <th scope="row" className="px-4 py-3 text-left font-medium text-slate-900">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="cursor-help text-left underline decoration-slate-300 decoration-dotted underline-offset-4 hover:decoration-[#33295e]"
                >
                  {block.name}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p className="text-xs opacity-70">Example</p>
                <p className="font-medium">{block.example}</p>
              </TooltipContent>
            </Tooltip>
          </th>
          <td className="px-4 py-3">
            <CascadingSelectors
              block={block}
              attributes={attributes}
              path={pathFor(block.id)}
              onSelect={(level, id) => onSelect(block.id, level, id)}
              onClear={() => onClear(block.id)}
            />
          </td>
        </tr>
      ))}
    </>
  )
}

function CascadingSelectors({
  block,
  attributes,
  path,
  onSelect,
  onClear,
}: {
  block: Datablock
  attributes: Attribute[]
  path: string[]
  onSelect: (level: number, attributeId: string) => void
  onClear: () => void
}) {
  // One selector per chosen level, plus the next level when the last choice has children.
  const levels: { level: number; options: Attribute[]; value: string }[] = []
  for (let level = 0; level < MAX_ATTRIBUTE_DEPTH; level++) {
    const parentId = level === 0 ? null : path[level - 1]
    if (level > 0 && !parentId) break
    const options = childrenOf(attributes, parentId)
    if (options.length === 0) break
    levels.push({ level, options, value: path[level] ?? "" })
    if (!path[level]) break
  }

  if (levels.length === 0) {
    return <span className="text-sm text-slate-400">No attributes available</span>
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {levels.map(({ level, options, value }) => (
        <div key={level} className="flex items-center gap-2">
          {level > 0 && <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />}
          <Select value={value} onValueChange={(id) => onSelect(level, id)}>
            <SelectTrigger
              aria-label={`${block.name} level ${level + 1}`}
              className={`h-9 w-56 justify-between bg-card text-left text-sm [&>span]:truncate ${value ? "border-[#33295e]/30 text-[#33295e]" : "text-slate-500"}`}
            >
              <SelectValue placeholder={`Level ${level + 1}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      {path.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          aria-label={`Clear mapping for ${block.name}`}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
