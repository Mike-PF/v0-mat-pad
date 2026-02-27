"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/upload")
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <p className="text-slate-600">Redirecting...</p>
    </div>
  )
}
