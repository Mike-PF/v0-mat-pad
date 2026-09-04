"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#efeef6] px-4">
      {/* Soft ambient background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60rem 60rem at 15% -10%, rgba(51,41,94,0.10), transparent 55%), radial-gradient(50rem 50rem at 110% 120%, rgba(253,109,109,0.12), transparent 55%)",
        }}
      />
      {/* Subtle horizontal texture lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 26px)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* Brand */}
        <div className="flex flex-col items-center">
          <img src="/matpad-logo.svg" alt="MATpad" className="h-20 w-20" />
        </div>

        {/* Card */}
        <div className="mt-8 w-full rounded-2xl border border-white/70 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(51,41,94,0.35)] sm:p-10">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900">
            Welcome to MATpad.
          </h1>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-500">
            In order to use the system, you must login using your business account.
          </p>

          <Button
            onClick={() => router.push("/home")}
            className="mt-8 h-12 w-full rounded-lg bg-[#33295e] text-base font-medium text-white shadow-sm transition-colors hover:bg-[#fd6d6d]"
          >
            Login
          </Button>
        </div>

        <p className="mt-8 text-xs font-medium tracking-wide text-slate-400">MATpad</p>
      </div>
    </main>
  )
}
