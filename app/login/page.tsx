"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Minus, Square, X, Lock } from "lucide-react"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
      <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
      <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
      <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [showPopup, setShowPopup] = useState(false)

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fdf3ec] px-4">
      {/* Soft ambient background accents (coral + gold blend) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(55rem 55rem at 12% -12%, rgba(244,201,93,0.35), transparent 55%), radial-gradient(60rem 60rem at 112% 118%, rgba(253,109,109,0.32), transparent 55%)",
        }}
      />
      {/* Subtle horizontal texture lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 26px)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* Brand */}
        <div className="flex flex-col items-center">
          <img src="/fuze-logo.svg" alt="Fuze" className="h-16 w-auto" />
        </div>

        {/* Card */}
        <div className="mt-8 w-full rounded-2xl border border-white/70 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(51,41,94,0.35)] sm:p-10">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900">Welcome to Fuze.</h1>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-500">
            In order to use the system, you must login using your organisation Google or Office 365 account.
          </p>

          <Button
            onClick={() => setShowPopup(true)}
            className="mt-8 h-12 w-full rounded-lg bg-[#fd6d6d] text-base font-medium text-white shadow-sm transition-colors hover:bg-[#f4c95d] hover:text-slate-900"
          >
            Login
          </Button>
        </div>
      </div>

      {/* Browser-style login popup */}
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Fuze Login"
        >
          <div className="w-full max-w-[460px] overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/10">
            {/* Window title bar */}
            <div className="flex items-center justify-between bg-[#eef0f4] px-3 py-2">
              <div className="flex items-center gap-2">
                <img src="/fuze-icon.svg" alt="" className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs font-medium text-slate-600">Fuze Login &ndash; Google Chrome</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                <Square className="h-3 w-3" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  aria-label="Close login window"
                  className="rounded p-0.5 transition-colors hover:bg-[#fd6d6d] hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Address bar */}
            <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
              <Lock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span className="truncate text-xs text-slate-500">
                fuzeeducation.b2clogin.com/fuzeeducation.onmicrosoft.com/b2c_1&hellip;
              </span>
            </div>

            {/* Popup body */}
            <div
              className="relative px-8 py-10"
              style={{
                backgroundImage:
                  "radial-gradient(40rem 40rem at 10% -20%, rgba(244,201,93,0.28), transparent 55%), radial-gradient(44rem 44rem at 120% 120%, rgba(253,109,109,0.26), transparent 55%)",
              }}
            >
              <div className="flex flex-col items-center">
                <img src="/fuze-logo.svg" alt="Fuze" className="h-14 w-auto" />
              </div>

              <h2 className="mt-6 text-2xl font-semibold text-slate-700">Sign in</h2>

              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/home")}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left shadow-sm transition-colors hover:border-[#fd6d6d] hover:bg-[#fef4f4]"
                >
                  <GoogleIcon />
                  <span className="flex-1 text-center text-sm font-medium text-slate-700">Google Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/home")}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left shadow-sm transition-colors hover:border-[#fd6d6d] hover:bg-[#fef4f4]"
                >
                  <MicrosoftIcon />
                  <span className="flex-1 text-center text-sm font-medium text-slate-700">Microsoft Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
