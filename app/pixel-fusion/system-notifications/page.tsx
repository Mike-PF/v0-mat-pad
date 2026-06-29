"use client"

import { useMemo, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"
import { Trash2, X, Search, Eye, Bell, Monitor, Play, ExternalLink, Users, Building2, School, Check } from "lucide-react"
import {
  useNotifications,
  getTypeIcon,
  getTypeColor,
  getTypeLabel,
  isCurrentlyNew,
  describeAudience,
  NOTIFICATION_TYPES,
  ORG_DIRECTORY,
  type NotificationType,
  type WhatsNewItem,
  type AudienceScope,
  type AudienceTarget,
} from "@/lib/notifications"

const NAVY = "#121051"

export default function SystemNotificationsPage() {
  const { items, setItems, hydrated } = useNotifications()
  const { showToast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | NotificationType>("all")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<WhatsNewItem | null>(null)

  // Per-item preview of how a notification looks when opened on the homepage
  const [previewItem, setPreviewItem] = useState<WhatsNewItem | null>(null)

  // Form state
  const [formType, setFormType] = useState<NotificationType>("update")
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formDate, setFormDate] = useState("")
  const [formDaysLeft, setFormDaysLeft] = useState("")
  const [formBody, setFormBody] = useState("")
  const [formVideoUrl, setFormVideoUrl] = useState("")
  const [formVideoTitle, setFormVideoTitle] = useState("")
  const [formIsUrgent, setFormIsUrgent] = useState(false)
  const [formIsNew, setFormIsNew] = useState(false)
  const [formIsActive, setFormIsActive] = useState(false)
  // Audience targeting
  const [formAudienceScope, setFormAudienceScope] = useState<AudienceScope>("all")
  const [formTargets, setFormTargets] = useState<AudienceTarget[]>([])
  const [targetSearch, setTargetSearch] = useState("")

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || item.type === filterType
      return matchesSearch && matchesType
    })
  }, [items, searchTerm, filterType])

  const visibleCount = items.filter((i) => i.visible).length

  const resetForm = () => {
    setFormType("update")
    setFormTitle("")
    setFormDescription("")
    setFormDate("")
    setFormDaysLeft("")
    setFormBody("")
    setFormVideoUrl("")
    setFormVideoTitle("")
    setFormIsUrgent(false)
    setFormIsNew(false)
    setFormIsActive(false)
    setFormAudienceScope("all")
    setFormTargets([])
    setTargetSearch("")
  }

  const handleAdd = () => {
    setEditingId(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (item: WhatsNewItem) => {
    setEditingId(item.id)
    setFormType(item.type)
    setFormTitle(item.title)
    setFormDescription(item.description)
    setFormDate(item.date)
    setFormDaysLeft(item.daysLeft !== undefined ? String(item.daysLeft) : "")
    setFormBody(item.body ?? "")
    setFormVideoUrl(item.video?.url ?? "")
    setFormVideoTitle(item.video?.title ?? "")
    setFormIsUrgent(Boolean(item.isUrgent))
    setFormIsNew(Boolean(item.isNew))
    setFormIsActive(Boolean(item.isActive))
    setFormAudienceScope(item.audience?.scope ?? "all")
    setFormTargets(item.audience?.targets ?? [])
    setTargetSearch("")
    setIsDialogOpen(true)
  }

  const handleToggleVisible = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, visible: !i.visible } : i)))
  }

  const handleSave = () => {
    const missing: string[] = []
    if (!formTitle.trim()) missing.push("Title")
    if (!formDescription.trim()) missing.push("Short description")
    if (!formDate.trim()) missing.push("Date label")
    if (!formBody.trim()) missing.push("Full details")

    if (missing.length > 0) {
      showToast({
        variant: "error",
        title: "Required fields missing",
        message: `Please complete: ${missing.join(", ")}.`,
        primaryAction: { label: "Dismiss" },
      })
      return
    }

    if (formAudienceScope === "targeted" && formTargets.length === 0) {
      showToast({
        variant: "error",
        title: "No recipients selected",
        message: "Choose at least one organisation, or send to all users.",
        primaryAction: { label: "Dismiss" },
      })
      return
    }

    const daysLeftNum = formDaysLeft.trim() === "" ? undefined : Number(formDaysLeft)
    const video = formVideoUrl.trim()
      ? { url: formVideoUrl.trim(), title: formVideoTitle.trim() || "Watch video" }
      : undefined
    const audience =
      formAudienceScope === "targeted"
        ? { scope: "targeted" as const, targets: formTargets }
        : { scope: "all" as const }

    if (editingId) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingId
            ? {
                ...i,
                type: formType,
                title: formTitle.trim(),
                description: formDescription.trim(),
                date: formDate.trim() || "—",
                daysLeft: daysLeftNum,
                body: formBody.trim() || undefined,
                video,
                isUrgent: formIsUrgent,
                isNew: formIsNew,
                // Preserve the original "new since" date if it was already new; otherwise stamp now.
                newSince: formIsNew ? (i.isNew && i.newSince ? i.newSince : new Date().toISOString()) : undefined,
                isActive: formIsActive,
                audience,
              }
            : i,
        ),
      )
      showToast({
        variant: "success",
        title: "Notification updated",
        message: `"${formTitle.trim()}" has been updated.`,
        primaryAction: { label: "Dismiss" },
      })
    } else {
      const newItem: WhatsNewItem = {
        id: `notif-${Date.now()}`,
        type: formType,
        title: formTitle.trim(),
        description: formDescription.trim(),
        date: formDate.trim() || "—",
        visible: true,
        daysLeft: daysLeftNum,
        body: formBody.trim() || undefined,
        video,
        isUrgent: formIsUrgent,
        isNew: formIsNew,
        newSince: formIsNew ? new Date().toISOString() : undefined,
        isActive: formIsActive,
        audience,
      }
      setItems((prev) => [newItem, ...prev])
      showToast({
        variant: "success",
        title: "Notification added",
        message: `"${formTitle.trim()}" is now showing on the homepage.`,
        primaryAction: { label: "Dismiss" },
      })
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (item: WhatsNewItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    setDeleteConfirm(null)
    showToast({
      variant: "success",
      title: "Notification deleted",
      message: `"${item.title}" has been removed.`,
      primaryAction: { label: "Dismiss" },
    })
  }

  const isTargetSelected = (id: string) => formTargets.some((t) => t.id === id)

  const toggleTarget = (target: AudienceTarget) => {
    setFormTargets((prev) =>
      prev.some((t) => t.id === target.id) ? prev.filter((t) => t.id !== target.id) : [...prev, target],
    )
  }

  // Flattened, searchable list of targetable organisations (MATs + their schools + standalone schools).
  const targetOptions = useMemo(() => {
    const q = targetSearch.trim().toLowerCase()
    const groups: { mat: AudienceTarget; schools: AudienceTarget[] }[] = []
    for (const org of ORG_DIRECTORY) {
      if (org.kind === "mat") {
        const mat: AudienceTarget = { kind: "mat", id: org.id, name: org.name }
        const schools: AudienceTarget[] = (org.schools ?? []).map((s) => ({
          kind: "school",
          id: s.id,
          name: s.name,
        }))
        groups.push({ mat, schools })
      } else {
        groups.push({ mat: { kind: "school", id: org.id, name: org.name }, schools: [] })
      }
    }
    if (!q) return groups
    // Keep a group if the MAT/school name or any child school matches.
    return groups
      .map((g) => {
        const matMatches = g.mat.name.toLowerCase().includes(q)
        const matchedSchools = g.schools.filter((s) => s.name.toLowerCase().includes(q))
        if (matMatches) return g
        if (matchedSchools.length > 0) return { mat: g.mat, schools: matchedSchools }
        return null
      })
      .filter((g): g is { mat: AudienceTarget; schools: AudienceTarget[] } => g !== null)
  }, [targetSearch])

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <main className="flex-1 px-4 pb-6 overflow-auto">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-1">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#B3008918" }}
                  >
                    <Bell className="w-5 h-5" style={{ color: "#B30089" }} />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-slate-900">System Notifications</h1>
                    <p className="text-sm text-slate-500 max-w-2xl mt-0.5">
                      Control the items shown in the{" "}
                      <span className="font-medium text-slate-700">What&apos;s New &amp; Key Dates</span> panel on
                      the homepage. Toggle visibility, edit content, or add new announcements, deadlines and alerts.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button onClick={handleAdd} className="text-white" style={{ backgroundColor: NAVY }}>
                    Add notification
                  </Button>
                </div>
              </div>

              {/* Summary */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-5 mt-3">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  {visibleCount} visible on homepage
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100">
                  {items.length} total
                </span>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterType} onValueChange={(v) => setFilterType(v as "all" | NotificationType)}>
                  <SelectTrigger className="w-full sm:w-52">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {NOTIFICATION_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* List */}
              {!hydrated ? (
                <div className="py-16 text-center text-sm text-slate-400">Loading notifications...</div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 mb-4">
                    <Bell className="w-7 h-7 text-slate-400" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-900 mb-1">No notifications found</h4>
                  <p className="text-sm text-slate-500 max-w-sm">
                    {items.length === 0
                      ? "Add your first notification to display it on the homepage."
                      : "No notifications match your current search or filter."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((item) => {
                    const Icon = getTypeIcon(item.type)
                    const color = getTypeColor(item.type)
                    return (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleEdit(item)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            handleEdit(item)
                          }
                        }}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer hover:border-slate-300 hover:bg-slate-50 ${
                          item.visible ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/60"
                        }`}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${color}18` }}
                        >
                          <Icon className="w-4 h-4" style={{ color }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-sm font-medium ${item.visible ? "text-slate-900" : "text-slate-500"}`}>
                              {item.title}
                            </p>
                            <span
                              className="px-1.5 py-0.5 text-[10px] font-semibold rounded"
                              style={{ backgroundColor: `${color}18`, color }}
                            >
                              {getTypeLabel(item.type)}
                            </span>
                            {isCurrentlyNew(item) && (
                              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500 text-white rounded">
                                NEW
                              </span>
                            )}
                            {item.isUrgent && (
                              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-500 text-white rounded">
                                URGENT
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{item.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[11px] text-slate-400">
                              {item.date}
                              {item.daysLeft !== undefined ? ` · ${item.daysLeft} days left` : ""}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded ${
                                !item.audience || item.audience.scope === "all"
                                  ? "bg-slate-100 text-slate-500"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {!item.audience || item.audience.scope === "all" ? (
                                <Users className="w-3 h-3" />
                              ) : (
                                <Building2 className="w-3 h-3" />
                              )}
                              {describeAudience(item.audience)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <Switch
                              checked={item.visible}
                              onCheckedChange={() => handleToggleVisible(item.id)}
                              aria-label={`Toggle visibility of ${item.title}`}
                              className="data-[state=checked]:bg-[#121051]"
                            />
                          </label>
                          <button
                            onClick={() => setPreviewItem(item)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-[#121051] hover:bg-slate-100 transition-colors"
                            aria-label={`Preview ${item.title}`}
                            title="Preview how this looks when opened"
                          >
                            <Monitor className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(item)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            aria-label={`Delete ${item.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            {editingId ? "Edit notification" : "Add notification"}
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="notif-type">Type<span className="text-red-500">*</span></Label>
              <Select value={formType} onValueChange={(v) => setFormType(v as NotificationType)}>
                <SelectTrigger id="notif-type" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notif-title">Title<span className="text-red-500">*</span></Label>
              <Input
                id="notif-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Spring Census deadline"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="notif-desc">Short description<span className="text-red-500">*</span></Label>
              <Input
                id="notif-desc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="One line shown in the list"
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="notif-date">Date label<span className="text-red-500">*</span></Label>
                <Input
                  id="notif-date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  placeholder="e.g. 16 Jan / Today / Active"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="notif-days">Days left</Label>
                <Input
                  id="notif-days"
                  type="number"
                  value={formDaysLeft}
                  onChange={(e) => setFormDaysLeft(e.target.value)}
                  placeholder="e.g. 2"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notif-body">Full details<span className="text-red-500">*</span></Label>
              <Textarea
                id="notif-body"
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                placeholder="Shown when a user opens the notification"
                rows={5}
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="notif-video-url">Video URL</Label>
                <Input
                  id="notif-video-url"
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="notif-video-title">Video title</Label>
                <Input
                  id="notif-video-title"
                  value={formVideoTitle}
                  onChange={(e) => setFormVideoTitle(e.target.value)}
                  placeholder="e.g. Walkthrough"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
              <div className="flex items-center justify-between px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-800">Mark as &quot;NEW&quot;</p>
                  <p className="text-xs text-slate-500">Shows a blue NEW badge for 3 days</p>
                </div>
                <Switch checked={formIsNew} onCheckedChange={setFormIsNew} className="data-[state=checked]:bg-[#121051]" />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-800">Mark as &quot;URGENT&quot;</p>
                  <p className="text-xs text-slate-500">Highlights the item in red</p>
                </div>
                <Switch checked={formIsUrgent} onCheckedChange={setFormIsUrgent} className="data-[state=checked]:bg-[#121051]" />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-800">Mark as &quot;Active&quot;</p>
                  <p className="text-xs text-slate-500">Highlights ongoing issues in amber</p>
                </div>
                <Switch checked={formIsActive} onCheckedChange={setFormIsActive} className="data-[state=checked]:bg-[#121051]" />
              </div>
            </div>

            {/* Audience targeting */}
            <div>
              <Label>Send to<span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => setFormAudienceScope("all")}
                  className={`flex items-start gap-2 p-3 rounded-lg border text-left transition-colors ${
                    formAudienceScope === "all"
                      ? "border-[#121051] bg-[#121051]/5"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Users
                    className={`w-4 h-4 mt-0.5 shrink-0 ${formAudienceScope === "all" ? "text-[#121051]" : "text-slate-400"}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-800">All system users</p>
                    <p className="text-xs text-slate-500">Everyone sees this</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormAudienceScope("targeted")}
                  className={`flex items-start gap-2 p-3 rounded-lg border text-left transition-colors ${
                    formAudienceScope === "targeted"
                      ? "border-[#121051] bg-[#121051]/5"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Building2
                    className={`w-4 h-4 mt-0.5 shrink-0 ${formAudienceScope === "targeted" ? "text-[#121051]" : "text-slate-400"}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-800">Specific organisations</p>
                    <p className="text-xs text-slate-500">Choose MATs or schools</p>
                  </div>
                </button>
              </div>

              {formAudienceScope === "targeted" && (
                <div className="mt-3 rounded-lg border border-slate-200 overflow-hidden">
                  {formTargets.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-2.5 border-b border-slate-100 bg-slate-50/60">
                      {formTargets.map((t) => (
                        <span
                          key={t.id}
                          className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full bg-white border border-slate-200 text-xs text-slate-700"
                        >
                          {t.kind === "mat" ? (
                            <Building2 className="w-3 h-3 text-slate-400" />
                          ) : (
                            <School className="w-3 h-3 text-slate-400" />
                          )}
                          {t.name}
                          <button
                            type="button"
                            onClick={() => toggleTarget(t)}
                            className="p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                            aria-label={`Remove ${t.name}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="relative p-2 border-b border-slate-100">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <Input
                      value={targetSearch}
                      onChange={(e) => setTargetSearch(e.target.value)}
                      placeholder="Search trusts or schools..."
                      className="pl-8 h-9"
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto p-1">
                    {targetOptions.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No organisations match your search.</p>
                    ) : (
                      targetOptions.map((group) => (
                        <div key={group.mat.id} className="mb-1">
                          <TargetRow
                            target={group.mat}
                            selected={isTargetSelected(group.mat.id)}
                            onToggle={() => toggleTarget(group.mat)}
                            subtitle={
                              group.mat.kind === "mat" ? "Whole trust — includes all schools" : "Standalone school"
                            }
                          />
                          {group.schools.map((school) => (
                            <TargetRow
                              key={school.id}
                              target={school}
                              selected={isTargetSelected(school.id)}
                              onToggle={() => toggleTarget(school)}
                              indented
                            />
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="text-white" style={{ backgroundColor: NAVY }}>
              {editingId ? "Save changes" : "Add notification"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={Boolean(deleteConfirm)} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="max-w-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Delete notification</h2>
              <p className="text-sm text-slate-500 mt-1">
                Are you sure you want to delete{" "}
                <span className="font-medium text-slate-700">&quot;{deleteConfirm?.title}&quot;</span>? This cannot be
                undone.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <X className="w-4 h-4 mr-1.5" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Per-item preview: how the notification looks when opened on the homepage */}
      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {previewItem && (
            <>
              <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-slate-100">
                <Monitor className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Homepage preview — opened view
                </span>
              </div>

              {/* Replicated homepage detail panel */}
              <div
                className="flex items-start gap-3 px-6 py-5 border-b border-slate-200"
                style={{ borderTopColor: getTypeColor(previewItem.type), borderTopWidth: 3 }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${getTypeColor(previewItem.type)}18` }}
                >
                  {(() => {
                    const Icon = getTypeIcon(previewItem.type)
                    return <Icon className="w-4 h-4" style={{ color: getTypeColor(previewItem.type) }} />
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold text-slate-900">{previewItem.title}</h2>
                    {isCurrentlyNew(previewItem) && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500 text-white rounded">NEW</span>
                    )}
                    {previewItem.isUrgent && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-500 text-white rounded">
                        URGENT
                      </span>
                    )}
                    {previewItem.isActive && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500 text-white rounded">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {previewItem.date}
                    {previewItem.daysLeft !== undefined ? ` · ${previewItem.daysLeft} days remaining` : ""}
                  </p>
                </div>
              </div>

              <div className="px-6 py-5 space-y-5 max-h-[55vh] overflow-y-auto">
                {previewItem.body ? (
                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{previewItem.body}</div>
                ) : (
                  <p className="text-sm text-slate-400 italic">{previewItem.description}</p>
                )}

                {previewItem.video && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{previewItem.video.title}</span>
                    </div>
                    <div
                      className="relative w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
                      style={{ paddingBottom: "56.25%" }}
                    >
                      <iframe
                        src={previewItem.video.url}
                        title={previewItem.video.title}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {previewItem.documents && previewItem.documents.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Attachments</p>
                    {previewItem.documents.map((doc, i) => {
                      const docColors: Record<string, string> = {
                        pdf: "text-red-600 bg-red-50",
                        xlsx: "text-emerald-600 bg-emerald-50",
                        docx: "text-blue-600 bg-blue-50",
                      }
                      const colors = docColors[doc.type] || "text-slate-600 bg-slate-50"
                      return (
                        <div
                          key={i}
                          className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 text-left"
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${colors}`}
                          >
                            {doc.type.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
                            <p className="text-xs text-slate-400">{doc.size}</p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
                {!previewItem.visible && (
                  <span className="mr-auto inline-flex items-center gap-1.5 text-xs text-amber-600">
                    Hidden — not currently shown on the homepage
                  </span>
                )}
                <Button variant="outline" onClick={() => setPreviewItem(null)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TargetRow({
  target,
  selected,
  onToggle,
  subtitle,
  indented = false,
}: {
  target: AudienceTarget
  selected: boolean
  onToggle: () => void
  subtitle?: string
  indented?: boolean
}) {
  const Icon = target.kind === "mat" ? Building2 : School
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-colors hover:bg-slate-50 ${
        indented ? "pl-7" : ""
      }`}
    >
      <span
        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
          selected ? "bg-[#121051] border-[#121051]" : "border-slate-300 bg-white"
        }`}
      >
        {selected && <Check className="w-3 h-3 text-white" />}
      </span>
      <Icon className="w-4 h-4 text-slate-400 shrink-0" />
      <span className="flex-1 min-w-0">
        <span className="block text-sm text-slate-800 truncate">{target.name}</span>
        {subtitle && <span className="block text-[11px] text-slate-400">{subtitle}</span>}
      </span>
    </button>
  )
}
