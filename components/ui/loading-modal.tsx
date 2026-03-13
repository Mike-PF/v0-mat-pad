import { Spinner } from "@/components/ui/spinner"

interface LoadingModalProps {
  isOpen: boolean
  message?: string
}

export function LoadingModal({ isOpen, message = "Loading..." }: LoadingModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" />
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg rounded-lg flex flex-col items-center">
        <img src="/matpad-logo.svg" alt="MATpad" className="w-20 h-20" />
        <div className="flex flex-col items-center gap-2">
          <Spinner size="lg" className="text-slate-900" />
          <p className="text-sm text-slate-600 font-medium">{message}</p>
        </div>
      </div>
    </>
  )
}
