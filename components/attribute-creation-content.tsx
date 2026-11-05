"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AttributeCreationTab } from "@/components/attribute-creation-tab"
import { DatablockMappingTab } from "@/components/datablock-mapping-tab"
import {
  DEFAULT_ATTRIBUTES,
  MAX_ATTRIBUTE_DEPTH,
  buildDefaultMappings,
  subtreeIds,
  type Attribute,
} from "@/lib/attributes"

type TabId = "creation" | "mapping"

const TABS: { id: TabId; label: string }[] = [
  { id: "creation", label: "Creation" },
  { id: "mapping", label: "Datablock Mapping" },
]

export function AttributeCreationContent() {
  const [activeTab, setActiveTab] = useState<TabId>("creation")
  const [attributes, setAttributes] = useState<Attribute[]>(DEFAULT_ATTRIBUTES)
  const [mappings, setMappings] = useState<Record<string, string[]>>(() => buildDefaultMappings())

  const handleDeleteAttribute = (id: string) => {
    const removed = subtreeIds(attributes, id)
    setAttributes((prev) => prev.filter((a) => !removed.has(a.id)))
    setMappings((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([blockId, path]) => {
          const cut = path.findIndex((x) => removed.has(x))
          return [blockId, cut === -1 ? path : path.slice(0, cut)]
        }),
      ),
    )
  }

  const usageCount = (attributeId: string) =>
    Object.values(mappings).filter((path) => path.includes(attributeId)).length

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-[#33295e]">Attribute Creation</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Build an attribute tree up to {MAX_ATTRIBUTE_DEPTH} levels deep, then map each datablock to a path through it.
          </p>
        </div>

        <div role="tablist" aria-label="Attribute sections" className="flex gap-1 border-b border-slate-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`-mb-px px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-slate-900 border-[#fd6d6d]"
                  : "text-slate-600 border-transparent hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          {activeTab === "creation" ? (
            <AttributeCreationTab
              attributes={attributes}
              usageCount={usageCount}
              onAdd={(attr) => setAttributes((prev) => [...prev, attr])}
              onUpdate={(attr) => setAttributes((prev) => prev.map((a) => (a.id === attr.id ? attr : a)))}
              onDelete={handleDeleteAttribute}
            />
          ) : (
            <DatablockMappingTab attributes={attributes} mappings={mappings} onSave={setMappings} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
