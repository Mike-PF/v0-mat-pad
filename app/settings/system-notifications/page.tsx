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
import { Plus, Trash2, X, Search, Eye, Bell, Megaphone, ChevronRight, Monitor } from "lucide-react"
import {
  useNotifications,
  getTypeIcon,
  getTypeColor,
  getTypeLabel,
  NOTIFICATION_TYPES,
  type NotificationType,
  type WhatsNewItem,
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

  // Preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewTab, setPreviewTab] = useState<"all" | "updates" | "deadlines" | "system">("all")

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

  // Mirrors the homepage "What's New & Key Dates" filtering
  const previewItems = items.filter((item) => {
    if (!item.visible) return false
    if (previewTab === "all") return true
    if (previewTab === "updates") return item.type === "update"
    if (previewTab === "deadlines") return item.type === "deadline"
    if (previewTab === "system") return item.type === "maintenance" || item.type === "issue"
    return true
  })

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
    setIsDialogOpen(true)
  }

  const handleToggleVisible = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, visible: !i.visible } : i)))
  }

  const handleSave = () => {
    if (!formTitle.trim()) {
      showToast({
        variant: "error",
        title: "Title required",
        message: "Please enter a title for the notification.",
        primaryAction: { label: "Dismiss" },
      })
      return
    }

    const daysLeftNum = formDaysLeft.trim() === "" ? undefined : Number(formDaysLeft)
    const video = formVideoUrl.trim()
      ? { url: formVideoUrl.trim(), title: formVideoTitle.trim() || "Watch video" }
      : undefined

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
                isActive: formIsActive,
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
        isActive: formIsActive,
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
                  <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
                    <Monitor className="w-4 h-4 mr-1.5" />
                    Preview
                  </Button>
                  <Button onClick={handleAdd} className="text-white" style={{ backgroundColor: NAVY }}>
                    <Plus className="w-4 h-4 mr-1.5" />
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
                            {item.isNew && (
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
                          <p className="text-[11px] text-slate-400 mt-1">
                            {item.date}
                            {item.daysLeft !== undefined ? ` · ${item.daysLeft} days left` : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <Switch
                              checked={item.visible}
                              onCheckedChange={() => handleToggleVisible(item.id)}
                              aria-label={`Toggle visibility of ${item.title}`}
                            />
                          </label>
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
              <Label htmlFor="notif-type">Type</Label>
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
              <Label htmlFor="notif-title">Title</Label>
              <Input
                id="notif-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Spring Census deadline"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="notif-desc">Short description</Label>
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
                <Label htmlFor="notif-date">Date label</Label>
                <Input
                  id="notif-date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  placeholder="e.g. 16 Jan / Today / Active"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="notif-days">Days left (optional)</Label>
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
              <Label htmlFor="notif-body">Full details (optional)</Label>
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
                <Label htmlFor="notif-video-url">Video URL (optional)</Label>
                <Input
                  id="notif-video-url"
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="notif-video-title">Video title (optional)</Label>
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
                  <p className="text-xs text-slate-500">Shows a blue NEW badge</p>
                </div>
                <Switch checked={formIsNew} onCheckedChange={setFormIsNew} />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-800">Mark as &quot;URGENT&quot;</p>
                  <p className="text-xs text-slate-500">Highlights the item in red</p>
                </div>
                <Switch checked={formIsUrgent} onCheckedChange={setFormIsUrgent} />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-800">Mark as &quot;Active&quot;</p>
                  <p className="text-xs text-slate-500">Highlights ongoing issues in amber</p>
                </div>
                <Switch checked={formIsActive} onCheckedChange={setFormIsActive} />
              </div>
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

      {/* Homepage preview */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-xl">
          <div className="flex items-center gap-2 mb-1">
            <Monitor className="w-4 h-4 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-900">Homepage preview</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            This is exactly how the visible notifications appear in the{" "}
            <span className="font-medium text-slate-700">What&apos;s New &amp; Key Dates</span> panel on the homepage.
          </p>

          {/* Replicated homepage panel */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <Card className="bg-white border-slate-200">
              <div className="px-5 pt-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-900">What&apos;s New &amp; Key Dates</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {(["all", "updates", "deadlines", "system"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setPreviewTab(tab)}
                        className={`px-2 py-1 rounded-md capitalize transition-colors ${
                          previewTab === tab ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <CardContent className="px-5 pb-4">
                {previewItems.length === 0 ? (
                  <div className="py-10 text-center text-sm text-slate-400">
                    No visible notifications for this filter.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {previewItems.map((item) => {
                      const Icon = getTypeIcon(item.type)
                      const color = getTypeColor(item.type)
                      return (
                        <div
                          key={item.id}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-lg border text-left group ${
                            item.isUrgent
                              ? "border-red-200 bg-red-50/50"
                              : item.isNew
                              ? "border-blue-200 bg-blue-50/50"
                              : item.isActive
                              ? "border-amber-200 bg-amber-50/50"
                              : "border-slate-100"
                          }`}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${color}18` }}
                          >
                            <Icon className="w-3.5 h-3.5" style={{ color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                              {item.isNew && (
                                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500 text-white rounded shrink-0">
                                  NEW
                                </span>
                              )}
                              {item.isUrgent && (
                                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-500 text-white rounded shrink-0">
                                  URGENT
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 truncate">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <div className="text-right">
                              <p className="text-xs text-slate-500">{item.date}</p>
                              {item.daysLeft !== undefined && item.daysLeft <= 7 && (
                                <p
                                  className={`text-xs font-semibold ${
                                    item.daysLeft <= 3 ? "text-red-600" : "text-amber-600"
                                  }`}
                                >
                                  {item.daysLeft}d left
                                </p>
                              )}
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 ml-1" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
