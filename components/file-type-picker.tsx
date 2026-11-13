"use client"

import { useMemo, useState } from "react"
import { Check, FileText, History, Search, X } from "lucide-react"
import {
  categoryFor,
  FILE_TYPE_CATEGORIES,
  TILE_LAYOUT_LIMIT,
  type FileTypeCategory,
  type FileTypeOption,
} from "@/lib/upload-file-types"

type FileTypePickerProps = {
  types: FileTypeOption[]
  value: string
  onChange: (value: string) => void
  recentValues?: string[]
  categories?: FileTypeCategory[]
}

export function FileTypePicker({
  types,
  value,
  onChange,
  recentValues = [],
  categories = FILE_TYPE_CATEGORIES,
}: FileTypePickerProps) {
  if (types.length <= TILE_LAYOUT_LIMIT) {
    return <FileTypeTiles types={types} value={value} onChange={onChange} />
  }
  return (
    <FileTypeBrowser
      types={types}
      value={value}
      onChange={onChange}
      recentValues={recentValues}
      categories={categories}
    />
  )
}

function FileTypeTiles({ types, value, onChange }: Pick<FileTypePickerProps, "types" | "value" | "onChange">) {
  return (
    <div role="radiogroup" aria-label="File type" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {types.map((t) => {
        const Icon = categoryFor(t.category)?.icon ?? FileText
        const active = t.value === value
        return (
          <label
            key={t.value}
            className={`group relative flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#33295e] has-[:focus-visible]:ring-offset-2 ${
              active
                ? "border-[#33295e] bg-[#33295e] text-white shadow-md"
                : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name="upload-file-type"
              value={t.value}
              checked={active}
              onChange={() => onChange(t.value)}
              className="sr-only"
            />
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                active ? "bg-white/15" : "bg-slate-100 group-hover:bg-white"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-white" : "text-[#33295e]"}`} aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5 pr-5">
              <span className="text-sm font-semibold">{t.label}</span>
              <span className={`text-xs leading-snug ${active ? "text-white/75" : "text-slate-500"}`}>
                {t.description}
              </span>
              <span className={`text-[11px] font-mono ${active ? "text-white/60" : "text-slate-400"}`}>
                {t.formats.join(" · ")}
              </span>
            </span>
            {active && <Check className="absolute right-3 top-3 h-4 w-4 text-white" aria-hidden="true" />}
          </label>
        )
      })}
    </div>
  )
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const i = text.toLowerCase().indexOf(query.toLowerCase())
  if (i === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-amber-100 px-0.5 text-inherit">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  )
}

function FileTypeBrowser({ types, value, onChange, recentValues = [], categories = [] }: FileTypePickerProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of types) map.set(t.category, (map.get(t.category) ?? 0) + 1)
    return map
  }, [types])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return types.filter(
      (t) =>
        (category === "all" || t.category === category) &&
        (!q || t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)),
    )
  }, [types, query, category])

  const grouped = useMemo(
    () =>
      categories
        .map((c) => ({ category: c, items: filtered.filter((t) => t.category === c.id) }))
        .filter((g) => g.items.length > 0),
    [categories, filtered],
  )

  const recent = recentValues
    .map((v) => types.find((t) => t.value === v))
    .filter((t): t is FileTypeOption => !!t)
    .slice(0, 5)

  const selected = types.find((t) => t.value === value)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <label htmlFor="file-type-search" className="sr-only">
          Search file types
        </label>
        <input
          id="file-type-search"
          type="text"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${types.length} file types`}
          className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#33295e] focus:outline-none focus:ring-2 focus:ring-[#33295e]/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
        {[{ id: "all", label: "All" }, ...categories].map((c) => {
          const active = category === c.id
          const count = c.id === "all" ? types.length : (counts.get(c.id) ?? 0)
          if (count === 0) return null
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              aria-pressed={active}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "border-[#33295e] bg-[#33295e] text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {c.label}
              <span className={active ? "text-white/70" : "text-slate-400"}>{count}</span>
            </button>
          )
        })}
      </div>

      {recent.length > 0 && !query && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <History className="h-3.5 w-3.5" aria-hidden="true" />
            Recently used
          </span>
          {recent.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange(t.value)}
              aria-pressed={t.value === value}
              className={`rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                t.value === value
                  ? "border-[#33295e] bg-[#33295e]/10 text-[#33295e]"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div
        role="radiogroup"
        aria-label="File type"
        className="max-h-80 overflow-y-auto rounded-lg border border-slate-200 bg-white"
      >
        {grouped.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-slate-500">
            No file types match &ldquo;{query}&rdquo;.
          </p>
        )}
        {grouped.map(({ category: c, items }) => {
          const Icon = c.icon
          return (
            <div key={c.id} role="group" aria-label={c.label}>
              <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-100 bg-slate-50/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 backdrop-blur">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {c.label}
                <span className="font-normal normal-case tracking-normal text-slate-400">{items.length}</span>
              </div>
              {items.map((t) => {
                const active = t.value === value
                return (
                  <label
                    key={t.value}
                    className={`flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-2.5 last:border-b-0 has-[:focus-visible]:bg-slate-50 ${
                      active ? "bg-[#33295e]/5" : "hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="upload-file-type"
                      value={t.value}
                      checked={active}
                      onChange={() => onChange(t.value)}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        active ? "border-[#33295e] bg-[#33295e]" : "border-slate-300 bg-white"
                      }`}
                      aria-hidden="true"
                    >
                      {active && <Check className="h-3 w-3 text-white" />}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className={`truncate text-sm ${active ? "font-semibold text-[#33295e]" : "font-medium text-slate-900"}`}>
                        <Highlight text={t.label} query={query.trim()} />
                      </span>
                      <span className="truncate text-xs text-slate-500">
                        <Highlight text={t.description} query={query.trim()} />
                      </span>
                    </span>
                    <span className="hidden shrink-0 font-mono text-[11px] text-slate-400 sm:block">
                      {t.formats.join(" · ")}
                    </span>
                  </label>
                )
              })}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-slate-500" aria-live="polite">
        {selected ? (
          <>
            Selected: <span className="font-medium text-slate-900">{selected.label}</span>
          </>
        ) : (
          `Showing ${filtered.length} of ${types.length}`
        )}
      </p>
    </div>
  )
}
