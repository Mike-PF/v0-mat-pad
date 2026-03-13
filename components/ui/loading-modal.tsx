import Image from "next/image"
import { Spinner } from "@/components/ui/spinner"

interface LoadingModalProps {
  isOpen: boolean
  message?: string
}

export function LoadingModal({ isOpen, message = "Loading..." }: LoadingModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
        <div className="w-24 h-24 relative">
          <Image
            src="/matpad-logo.jpg"
            alt="MATpad"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-slate-600">{message}</p>
        </div>
      </div>
    </div>
  )
}
