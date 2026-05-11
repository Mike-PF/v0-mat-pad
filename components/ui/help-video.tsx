"use client"

import { useState } from "react"
import { PlayCircle, X, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HelpVideoProps {
  videoId: string // Loom video ID (from the URL)
  title?: string
  description?: string
  buttonVariant?: "icon" | "text" | "full"
}

export function HelpVideo({ 
  videoId, 
  title = "Need help?", 
  description = "Watch this short video tutorial to learn how to use this feature.",
  buttonVariant = "full"
}: HelpVideoProps) {
  const [isOpen, setIsOpen] = useState(false)

  const loomEmbedUrl = `https://www.loom.com/embed/${videoId}?hideEmbedTopBar=true`

  return (
    <>
      {/* Trigger Button */}
      {buttonVariant === "icon" && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-[#B30089]"
          title="Watch help video"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      )}

      {buttonVariant === "text" && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 text-sm text-[#B30089] hover:text-[#8a006a] transition-colors font-medium"
        >
          <PlayCircle className="w-4 h-4" />
          Watch tutorial
        </button>
      )}

      {buttonVariant === "full" && (
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="flex items-center gap-2 border-[#B30089] text-[#B30089] hover:bg-[#B30089]/5 hover:text-[#B30089]"
        >
          <PlayCircle className="w-4 h-4" />
          Help Video
        </Button>
      )}

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-[#121051] to-[#B30089]">
              <div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm text-white/80">{description}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Container */}
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={loomEmbedUrl}
                frameBorder="0"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Still need help? Contact support at{" "}
                <a href="mailto:support@matpad.co.uk" className="text-[#B30089] hover:underline">
                  support@matpad.co.uk
                </a>
              </p>
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="border-slate-300"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Single video type for multi-video banner
interface VideoItem {
  videoId: string
  title: string
  description: string
  duration?: string
}

// Multi-video help banner for pages with multiple tutorials
interface MultiVideoHelpBannerProps {
  pageTitle: string
  pageDescription?: string
  videos: VideoItem[]
}

export function MultiVideoHelpBanner({
  pageTitle,
  pageDescription = "Watch these tutorials to get started.",
  videos,
}: MultiVideoHelpBannerProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)

  return (
    <>
      <div className="mb-6 rounded-lg border border-slate-200 bg-white overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#B30089]/10 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-[#B30089]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{pageTitle}</h2>
              <p className="text-sm text-slate-600">{pageDescription}</p>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video, index) => (
            <button
              key={index}
              onClick={() => setActiveVideo(video)}
              className="group text-left p-4 rounded-lg border border-slate-200 hover:border-[#B30089] hover:shadow-md transition-all bg-white"
            >
              {/* Thumbnail placeholder */}
              <div className="relative mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-[#121051] to-[#B30089] aspect-video flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform" />
                {video.duration && (
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-xs font-medium">
                    {video.duration}
                  </span>
                )}
              </div>
              <h3 className="font-medium text-slate-900 group-hover:text-[#B30089] transition-colors mb-1">
                {video.title}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2">{video.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-[#121051] to-[#B30089]">
              <div>
                <h3 className="text-lg font-semibold text-white">{activeVideo.title}</h3>
                <p className="text-sm text-white/80">{activeVideo.description}</p>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={`https://www.loom.com/embed/${activeVideo.videoId}?hideEmbedTopBar=true`}
                frameBorder="0"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen"
              />
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Still need help? Contact support at{" "}
                <a href="mailto:support@matpad.co.uk" className="text-[#B30089] hover:underline">
                  support@matpad.co.uk
                </a>
              </p>
              <Button
                onClick={() => setActiveVideo(null)}
                variant="outline"
                className="border-slate-300"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Wrapper component for page-level help that includes a title card
interface PageHelpVideoProps {
  videoId: string
  pageTitle: string
  pageDescription?: string
}

export function PageHelpBanner({ 
  videoId, 
  pageTitle,
  pageDescription = "Learn how to use this feature effectively."
}: PageHelpVideoProps) {
  const [isOpen, setIsOpen] = useState(false)

  const loomEmbedUrl = `https://www.loom.com/embed/${videoId}?hideEmbedTopBar=true`

  return (
    <>
      <div className="mb-6 p-4 rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#B30089]/10 flex items-center justify-center">
            <PlayCircle className="w-6 h-6 text-[#B30089]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{pageTitle}</h2>
            <p className="text-sm text-slate-600">{pageDescription}</p>
          </div>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-white"
          style={{ backgroundColor: "#B30089" }}
        >
          <PlayCircle className="w-4 h-4" />
          Watch Tutorial
        </Button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-[#121051] to-[#B30089]">
              <div>
                <h3 className="text-lg font-semibold text-white">{pageTitle} Tutorial</h3>
                <p className="text-sm text-white/80">{pageDescription}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={loomEmbedUrl}
                frameBorder="0"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen"
              />
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Still need help? Contact support at{" "}
                <a href="mailto:support@matpad.co.uk" className="text-[#B30089] hover:underline">
                  support@matpad.co.uk
                </a>
              </p>
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="border-slate-300"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
