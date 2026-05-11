"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, X, PlayCircle, Upload, ExternalLink, Search } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Available pages for help videos
const availablePages = [
  { id: "dashboard-settings", label: "Dashboard Settings", path: "/settings/dashboard-settings" },
  { id: "users", label: "Users", path: "/settings/users" },
  { id: "roles", label: "Roles", path: "/settings/roles" },
  { id: "organisation", label: "Organisation", path: "/settings/organisation" },
  { id: "connections", label: "System Connections", path: "/settings/connections" },
  { id: "term-dates", label: "System Dates", path: "/settings/term-dates" },
  { id: "mapping", label: "Data Mapping", path: "/settings/mapping" },
  { id: "document-creation", label: "Document Creation", path: "/settings/document-creation" },
  { id: "reports-dashboard", label: "Reports Dashboard", path: "/reports" },
  { id: "reports-predefined", label: "Predefined Reports", path: "/reports/predefined" },
  { id: "reports-export", label: "Data Export", path: "/reports/data-export" },
  { id: "forms-dashboard", label: "Forms Dashboard", path: "/forms" },
  { id: "forms-maintenance", label: "Forms Maintenance", path: "/forms/maintenance" },
]

// Sample help videos data
interface HelpVideo {
  id: number
  pageId: string
  pageName: string
  title: string
  description: string
  loomId: string
  duration: string
  createdAt: string
  updatedAt: string
}

const initialHelpVideos: HelpVideo[] = [
  {
    id: 1,
    pageId: "dashboard-settings",
    pageName: "Dashboard Settings",
    title: "Getting Started",
    description: "An overview of the dashboard settings page and key features.",
    loomId: "1234567890abcdef",
    duration: "2:30",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: 2,
    pageId: "dashboard-settings",
    pageName: "Dashboard Settings",
    title: "Configuring Reports",
    description: "Learn how to set display names, descriptions, and report areas.",
    loomId: "abcdef1234567890",
    duration: "4:15",
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
  {
    id: 3,
    pageId: "users",
    pageName: "Users",
    title: "Managing Users",
    description: "Learn how to add users, assign schools and roles, and manage account access.",
    loomId: "fedcba0987654321",
    duration: "3:45",
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17",
  },
  {
    id: 4,
    pageId: "roles",
    pageName: "Roles",
    title: "Managing Roles",
    description: "Learn how to create roles, set permissions, and assign users to roles.",
    loomId: "0987654321fedcba",
    duration: "5:20",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },
]

export default function SystemHelpPage() {
  const [helpVideos, setHelpVideos] = useState<HelpVideo[]>(initialHelpVideos)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPage, setFilterPage] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<HelpVideo | null>(null)
  const [previewVideo, setPreviewVideo] = useState<HelpVideo | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<HelpVideo | null>(null)

  // Form state
  const [formPageId, setFormPageId] = useState("")
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formLoomId, setFormLoomId] = useState("")
  const [formDuration, setFormDuration] = useState("")

  const { showToast } = useToast()

  // Filter videos
  const filteredVideos = helpVideos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.pageName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPage = filterPage === "all" || video.pageId === filterPage
    return matchesSearch && matchesPage
  })

  // Group videos by page
  const videosByPage = filteredVideos.reduce((acc, video) => {
    if (!acc[video.pageId]) {
      acc[video.pageId] = []
    }
    acc[video.pageId].push(video)
    return acc
  }, {} as Record<string, HelpVideo[]>)

  // Open add dialog
  const handleAddVideo = () => {
    setEditingVideo(null)
    setFormPageId("")
    setFormTitle("")
    setFormDescription("")
    setFormLoomId("")
    setFormDuration("")
    setIsDialogOpen(true)
  }

  // Open edit dialog
  const handleEditVideo = (video: HelpVideo) => {
    setEditingVideo(video)
    setFormPageId(video.pageId)
    setFormTitle(video.title)
    setFormDescription(video.description)
    setFormLoomId(video.loomId)
    setFormDuration(video.duration)
    setIsDialogOpen(true)
  }

  // Save video
  const handleSaveVideo = () => {
    if (!formPageId || !formTitle || !formLoomId) {
      showToast({
        variant: "warning",
        title: "Required fields missing",
        message: "Please fill in the page, title, and Loom ID.",
        primaryAction: { label: "OK" },
      })
      return
    }

    const selectedPage = availablePages.find((p) => p.id === formPageId)

    if (editingVideo) {
      // Update existing
      setHelpVideos(
        helpVideos.map((v) =>
          v.id === editingVideo.id
            ? {
                ...v,
                pageId: formPageId,
                pageName: selectedPage?.label || formPageId,
                title: formTitle,
                description: formDescription,
                loomId: formLoomId,
                duration: formDuration,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : v
        )
      )
      showToast({
        variant: "success",
        title: "Video updated",
        message: `"${formTitle}" has been updated successfully.`,
        primaryAction: { label: "Dismiss" },
      })
    } else {
      // Add new
      const newVideo: HelpVideo = {
        id: Math.max(...helpVideos.map((v) => v.id), 0) + 1,
        pageId: formPageId,
        pageName: selectedPage?.label || formPageId,
        title: formTitle,
        description: formDescription,
        loomId: formLoomId,
        duration: formDuration,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setHelpVideos([...helpVideos, newVideo])
      showToast({
        variant: "success",
        title: "Video added",
        message: `"${formTitle}" has been added to ${selectedPage?.label}.`,
        primaryAction: { label: "Dismiss" },
      })
    }

    setIsDialogOpen(false)
  }

  // Delete video
  const handleDeleteVideo = (video: HelpVideo) => {
    setHelpVideos(helpVideos.filter((v) => v.id !== video.id))
    setDeleteConfirm(null)
    showToast({
      variant: "success",
      title: "Video deleted",
      message: `"${video.title}" has been removed.`,
      primaryAction: { label: "Dismiss" },
    })
  }

  // Extract Loom ID from URL
  const extractLoomId = (input: string): string => {
    // If it's already just an ID
    if (/^[a-f0-9]+$/i.test(input)) {
      return input
    }
    // Extract from URL like https://www.loom.com/share/abc123
    const match = input.match(/loom\.com\/(?:share|embed)\/([a-f0-9]+)/i)
    return match ? match[1] : input
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
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">System Help Videos</h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Manage tutorial videos that appear on each page to help users.
                  </p>
                </div>
                <Button
                  onClick={handleAddVideo}
                  className="bg-[#B30089] hover:bg-[#8a006a] text-white flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Video
                </Button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <select
                  value={filterPage}
                  onChange={(e) => setFilterPage(e.target.value)}
                  className="h-10 px-3 rounded-md border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B30089]/20"
                >
                  <option value="all">All Pages</option>
                  {availablePages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Videos List */}
              {Object.keys(videosByPage).length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <PlayCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium">No videos found</p>
                  <p className="text-sm mt-1">Add your first help video to get started.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(videosByPage).map(([pageId, videos]) => (
                    <div key={pageId}>
                      {/* Page Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-sm font-semibold text-slate-900">{videos[0].pageName}</h3>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {videos.length} video{videos.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Video Cards */}
                      <div className="space-y-2">
                        {videos.map((video) => (
                          <div
                            key={video.id}
                            className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition-colors"
                          >
                            {/* Thumbnail */}
                            <button
                              onClick={() => setPreviewVideo(video)}
                              className="w-24 h-14 rounded-md overflow-hidden bg-gradient-to-br from-[#121051] to-[#B30089] flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
                            >
                              <PlayCircle className="w-6 h-6 text-white" />
                            </button>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-slate-900">{video.title}</h4>
                              <p className="text-xs text-slate-500 line-clamp-1">{video.description}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-400">{video.duration}</span>
                                <span className="text-xs text-slate-400">Updated {video.updatedAt}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPreviewVideo(video)}
                                className="text-slate-500 hover:text-[#B30089]"
                              >
                                <PlayCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditVideo(video)}
                                className="text-slate-500 hover:text-[#B30089]"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteConfirm(video)}
                                className="text-slate-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-[#121051] to-[#B30089] px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              {editingVideo ? "Edit Help Video" : "Add Help Video"}
            </h2>
            <p className="text-sm text-white/80">
              {editingVideo ? "Update the video details below." : "Add a new tutorial video to a page."}
            </p>
          </div>

          <div className="p-6 space-y-4">
            {/* Page Selection */}
            <div className="space-y-2">
              <Label htmlFor="page" className="text-sm font-medium text-slate-700">
                Target Page<span className="text-red-500">*</span>
              </Label>
              <select
                id="page"
                value={formPageId}
                onChange={(e) => setFormPageId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B30089]/20"
              >
                <option value="">Select a page...</option>
                {availablePages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-slate-700">
                Video Title<span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Getting Started"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                Description
              </Label>
              <Input
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief description of what this video covers"
              />
            </div>

            {/* Loom ID */}
            <div className="space-y-2">
              <Label htmlFor="loomId" className="text-sm font-medium text-slate-700">
                Loom Video ID or URL<span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="loomId"
                  value={formLoomId}
                  onChange={(e) => setFormLoomId(extractLoomId(e.target.value))}
                  placeholder="Paste Loom URL or ID"
                  className="flex-1"
                />
                {formLoomId && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://www.loom.com/share/${formLoomId}`, "_blank")}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Test
                  </Button>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Paste a Loom share URL (e.g. https://www.loom.com/share/abc123) or just the video ID.
              </p>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-slate-700">
                Duration
              </Label>
              <Input
                id="duration"
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
                placeholder="e.g. 2:30"
                className="max-w-[120px]"
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveVideo}
              className="bg-[#B30089] hover:bg-[#8a006a] text-white"
            >
              {editingVideo ? "Update Video" : "Add Video"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      {previewVideo && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewVideo(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-[#121051] to-[#B30089]">
              <div>
                <h3 className="text-lg font-semibold text-white">{previewVideo.title}</h3>
                <p className="text-sm text-white/80">{previewVideo.description}</p>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={`https://www.loom.com/embed/${previewVideo.loomId}?hideEmbedTopBar=true`}
                frameBorder="0"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen"
              />
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                This video appears on the <strong>{previewVideo.pageName}</strong> page.
              </p>
              <Button
                onClick={() => setPreviewVideo(null)}
                variant="outline"
                className="border-slate-300"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Delete Video</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete <strong>{deleteConfirm.title}</strong>? This action
                cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteVideo(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
