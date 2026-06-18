"use client"

import { useEffect, useState, createContext, useContext, useCallback, useRef } from "react"
import { CheckCircle, AlertTriangle, Zap, X } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "warning"

export interface ToastAction {
  label: string
  onClick?: () => void
}

export interface Toast {
  id: string
  variant: ToastVariant
  title: string
  message: string
  primaryAction?: ToastAction
  secondaryAction?: ToastAction
  duration?: number // ms — 0 = persist until dismissed
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, "id">) => void
  dismissToast: (id: string) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within a ToastProvider")
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

// ─── Container ────────────────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-2xl px-4 pointer-events-none"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

// ─── Variant config ───────────────────────────────────────────────────────────

const variantConfig: Record<
  ToastVariant,
  { bg: string; iconBg: string; Icon: React.ElementType }
> = {
  success: {
    bg: "bg-[#4a7c44]",
    iconBg: "bg-[#3d6b38]",
    Icon: CheckCircle,
  },
  error: {
    bg: "bg-[#8b3a2f]",
    iconBg: "bg-[#7a3226]",
    Icon: Zap,
  },
  warning: {
    bg: "bg-[#b8862a]",
    iconBg: "bg-[#a67624]",
    Icon: AlertTriangle,
  },
}

// ─── Item ─────────────────────────────────────────────────────────────────────

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const { bg, iconBg, Icon } = variantConfig[toast.variant]
  const duration = toast.duration ?? 5000
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(() => onDismiss(toast.id), duration)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [toast.id, duration, onDismiss])

  const handleAction = (action?: ToastAction) => {
    action?.onClick?.()
    onDismiss(toast.id)
  }

  return (
    <div
      role="alert"
      className={`
        pointer-events-auto flex items-stretch rounded-lg overflow-hidden shadow-lg
        ${bg} text-white
        animate-in slide-in-from-bottom-4 fade-in duration-300
      `}
    >
      {/* Icon column */}
      <div className={`${iconBg} flex items-center justify-center px-4 flex-shrink-0`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Message */}
      <div className="flex-1 flex items-center px-4 py-3 min-w-0">
        <p className="text-sm leading-snug">
          <span className="font-bold">{toast.title}</span>
          {toast.message && <span className="font-normal"> {toast.message}</span>}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col border-l border-white/20 flex-shrink-0 divide-y divide-white/20">
        {toast.primaryAction && (
          <button
            onClick={() => handleAction(toast.primaryAction)}
            className="px-5 py-2 text-sm font-semibold hover:bg-white/10 transition-colors text-right whitespace-nowrap"
          >
            {toast.primaryAction.label}
          </button>
        )}
        {toast.secondaryAction ? (
          <button
            onClick={() => handleAction(toast.secondaryAction)}
            className="px-5 py-2 text-sm hover:bg-white/10 transition-colors text-right whitespace-nowrap"
          >
            {toast.secondaryAction.label}
          </button>
        ) : (
          <button
            onClick={() => onDismiss(toast.id)}
            className="px-5 py-2 text-sm hover:bg-white/10 transition-colors text-right whitespace-nowrap"
            aria-label="Close notification"
          >
            <X className="w-4 h-4 inline" />
          </button>
        )}
      </div>
    </div>
  )
}
