"use client"

import { useMemo, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/toast"
import { FileBarChart, FileText, Database, Lock, Search } from "lucide-react"
import { isPlatformAdmin } from "@/lib/current-org"
import {
  subscriptionTiers,
  reportItems,
  templateItems,
  feedItems,
  buildDefaultEntitlements,
  type EntitlementItem,
  type EntitlementKind,
  type TierId,
} from "@/lib/subscriptions"

const sections: { id: EntitlementKind; label: string; icon: typeof FileBarChart; items: EntitlementItem[] }[] = [
  { id: "report", label: "Reports", icon: FileBarChart, items: reportItems },
  { id: "template", label: "Templates", icon: FileText, items: templateItems },
  { id: "feed", label: "Data Feeds", icon: Database, items: feedItems },
]

const checkboxClass =
  "h-5 w-5 rounded border-slate-300 data-[state=checked]:bg-[#33295e] data-[state=checked]:border-[#33295e] data-[state=checked]:text-white data-[state=indeterminate]:bg-[#33295e]/40 data-[state=indeterminate]:border-[#33295e]/40 data-[state=indeterminate]:text-white"

type Entitlements = Record<TierId, string[]>

function countKind(keys: string[], kind: EntitlementKind) {
  return keys.filter((k) => k.startsWith(`${kind}:`)).length
}

export default function SubscriptionsPage() {
  const allowed = isPlatformAdmin()
  const { showToast } = useToast()

  const [saved, setSaved] = useState<Entitlements>(() => buildDefaultEntitlements())
  const [draft, setDraft] = useState<Entitlements>(saved)
  const [sectionId, setSectionId] = useState<EntitlementKind>("report")
  const [search, setSearch] = useState("")

  const section = sections.find((s) => s.id === sectionId)!

  const enabled = useMemo(
    () =>
      Object.fromEntries(subscriptionTiers.map((t) => [t.id, new Set(draft[t.id])])) as Record<TierId, Set<string>>,
    [draft],
  )

  const isDirty = useMemo(
    () =>
      subscriptionTiers.some((t) => {
        const a = draft[t.id]
        const b = new Set(saved[t.id])
        return a.length !== b.size || a.some((k) => !b.has(k))
      }),
    [draft, saved],
  )

  const groups = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = section.items.filter(
      (i) => !q || i.name.toLowerCase().includes(q) || i.group.toLowerCase().includes(q),
    )
    const map = new Map<string, EntitlementItem[]>()
    for (const item of filtered) {
      map.set(item.group, [...(map.get(item.group) ?? []), item])
    }
    return [...map.entries()]
  }, [section, search])

  const setKeys = (tier: TierId, keys: string[], on: boolean) => {
    setDraft((prev) => {
      const next = new Set(prev[tier])
      for (const k of keys) {
        if (on) next.add(k)
        else next.delete(k)
      }
      return { ...prev, [tier]: [...next] }
    })
  }

  const handleSave = () => {
    setSaved(draft)
    showToast({ variant: "success", title: "Subscriptions updated", message: "Changes to the subscription levels have been saved." })
  }

  if (!allowed) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4">
            <TopNavigation />
          </div>
          <main className="flex-1 flex items-center justify-center p-6">
            <Card className="max-w-md">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <h1 className="text-lg font-semibold text-slate-900 mb-1">Restricted page</h1>
                <p className="text-sm text-slate-500">Subscriptions are only managed by the Fuze platform team.</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <TopNavigation />
        </div>
        <main className="flex-1 px-4 pb-8 overflow-auto">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6 flex flex-col gap-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-xl font-bold text-[#33295e]">Subscriptions</h1>
                  <p className="text-sm text-slate-500 text-pretty">
                    Choose which reports, templates and data feeds are included at each subscription level.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {isDirty && <span className="text-xs font-medium text-amber-600">Unsaved changes</span>}
                  <Button variant="outline" disabled={!isDirty} onClick={() => setDraft(saved)}>
                    Discard
                  </Button>
                  <Button
                    disabled={!isDirty}
                    onClick={handleSave}
                    className="bg-[#33295e] hover:bg-[#33295e]/90 text-white"
                  >
                    Save changes
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptionTiers.map((tier) => (
                  <div key={tier.id} className="rounded-lg border border-slate-200 p-4 flex flex-col gap-3">
                    <div className="flex flex-col gap-0.5">
                      <h2 className="font-semibold text-slate-900">{tier.name}</h2>
                      <p className="text-xs text-slate-500">{tier.summary}</p>
                    </div>
                    <dl className="grid grid-cols-3 gap-2">
                      {sections.map((s) => (
                        <div key={s.id} className="rounded-md bg-slate-50 px-2.5 py-2">
                          <dt className="text-[11px] text-slate-500">{s.label}</dt>
                          <dd className="text-sm font-semibold text-[#33295e]">
                            {countKind(draft[tier.id], s.id)}
                            <span className="font-normal text-slate-400">/{s.items.length}</span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div role="tablist" aria-label="Entitlement type" className="flex gap-1 rounded-lg bg-slate-100 p-1">
                  {sections.map((s) => {
                    const Icon = s.icon
                    const active = s.id === sectionId
                    return (
                      <button
                        key={s.id}
                        role="tab"
                        aria-selected={active}
                        onClick={() => setSectionId(s.id)}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                          active ? "bg-white text-[#33295e] shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {s.label}
                        <span className="text-xs text-slate-400">{s.items.length}</span>
                      </button>
                    )
                  })}
                </div>
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder={`Search ${section.label.toLowerCase()}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                    aria-label={`Search ${section.label.toLowerCase()}`}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th scope="col" className="text-left font-semibold px-4 py-3">
                        {section.label.replace(/s$/, "")}
                      </th>
                      {subscriptionTiers.map((tier) => (
                        <th key={tier.id} scope="col" className="w-36 text-center font-semibold px-4 py-3">
                          {tier.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {groups.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                          No {section.label.toLowerCase()} match your search.
                        </td>
                      </tr>
                    )}
                    {groups.map(([group, items]) => {
                      const keys = items.map((i) => i.key)
                      return (
                        <GroupRows
                          key={group}
                          group={group}
                          items={items}
                          renderGroupCell={(tier) => {
                            const on = keys.filter((k) => enabled[tier].has(k)).length
                            const state = on === 0 ? false : on === keys.length ? true : "indeterminate"
                            return (
                              <Checkbox
                                className={checkboxClass}
                                checked={state}
                                onCheckedChange={() => setKeys(tier, keys, state !== true)}
                                aria-label={`Include all ${group} ${section.label.toLowerCase()} in ${tier}`}
                              />
                            )
                          }}
                          renderItemCell={(item, tier) => (
                            <Checkbox
                              className={checkboxClass}
                              checked={enabled[tier].has(item.key)}
                              onCheckedChange={(v) => setKeys(tier, [item.key], v === true)}
                              aria-label={`Include ${item.name} in ${tier}`}
                            />
                          )}
                        />
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

function GroupRows({
  group,
  items,
  renderGroupCell,
  renderItemCell,
}: {
  group: string
  items: EntitlementItem[]
  renderGroupCell: (tier: TierId) => React.ReactNode
  renderItemCell: (item: EntitlementItem, tier: TierId) => React.ReactNode
}) {
  return (
    <>
      <tr className="bg-slate-50/60 border-t border-slate-200">
        <th scope="rowgroup" className="text-left px-4 py-2.5 font-semibold text-[#33295e]">
          {group}
          <span className="ml-2 text-xs font-normal text-slate-400">{items.length}</span>
        </th>
        {subscriptionTiers.map((tier) => (
          <td key={tier.id} className="px-4 py-2.5">
            <div className="flex justify-center">{renderGroupCell(tier.id)}</div>
          </td>
        ))}
      </tr>
      {items.map((item) => (
        <tr key={item.key} className="border-t border-slate-100 hover:bg-slate-50/50">
          <th scope="row" className="text-left font-normal text-slate-700 px-4 py-2.5 pl-8">
            {item.name}
          </th>
          {subscriptionTiers.map((tier) => (
            <td key={tier.id} className="px-4 py-2.5">
              <div className="flex justify-center">{renderItemCell(item, tier.id)}</div>
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
