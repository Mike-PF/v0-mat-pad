"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function TopNavigation() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Different navigation tabs based on the current page
  const getNavigationTabs = () => {
    if (!mounted) {
      // Return default tabs during SSR to avoid mismatch
      return [
        { id: "dashboard", label: "Dashboard", href: "/forms" },
        { id: "maintenance", label: "Maintenance", href: "/forms/maintenance" },
      ]
    }
    
    if (pathname.startsWith("/settings")) {
      return [
        { id: "organisation", label: "Organisation", href: "/settings/organisation" },
        { id: "users", label: "Users", href: "/settings/users" },
        { id: "roles", label: "Roles", href: "/settings/roles" },
        { id: "connections", label: "System Connections", href: "/settings/connections" },
        { id: "system-dates", label: "System Dates", href: "/settings/term-dates" },
        { id: "dashboard-settings", label: "Dashboard Settings", href: "/settings/dashboard-settings" },
        { id: "mapping", label: "Data Mapping", href: "/settings/mapping" },
        { id: "document-creation", label: "Document creation", href: "/settings/document-creation" },
        { id: "system-help", label: "System Help", href: "/settings/system-help" },
      ]
    }

    if (pathname.startsWith("/reports")) {
      return [
        { id: "predefined", label: "Reports", href: "/reports/predefined" },
        { id: "data-export", label: "Data Export", href: "/reports/data-export" },
        { id: "archive", label: "Archive", href: "/reports/archive" },
      ]
    }

    if (pathname.startsWith("/dashboards")) {
      return [
        { id: "dashboards", label: "Dashboards", href: "/dashboards" },
      ]
    }

    if (pathname.startsWith("/profile")) {
      return [
        { id: "profile", label: "Profile", href: "/profile" },
      ]
    }

    // Default tabs for forms and other pages
    return [
      { id: "dashboard", label: "Dashboard", href: "/forms" },
      { id: "maintenance", label: "Maintenance", href: "/forms/maintenance" },
    ]
  }

  const tabs = getNavigationTabs()
  const isSettingsPage = mounted && pathname.startsWith("/settings")
  const isReportsPage = mounted && pathname.startsWith("/reports")
  const isDashboardsPage = mounted && pathname.startsWith("/dashboards")
  const isAiChatPage = mounted && pathname.startsWith("/ai-chat")

  return (
    <div className="w-full rounded-lg h-14 bg-white border border-slate-200 flex items-center justify-between px-4">
      {/* Navigation Tabs */}
      <div className="flex h-full">
        {tabs.map((tab) => {
          const isActive = mounted && (
            pathname === tab.href ||
            (tab.href === "/settings/organisation" && pathname === "/settings") ||
            (tab.href === "/reports/predefined" && pathname === "/reports") ||
            (tab.href === "/profile" && pathname.startsWith("/profile")) ||
            (tab.href === "/dashboards" && pathname.startsWith("/dashboards"))
          )

          return (
            <a
              key={tab.id}
              href={tab.href}
              className={cn(
                "px-4 flex items-center border-b-2 transition-colors",
                isActive
                  ? "font-semibold text-slate-900 border-primary"
                  : "font-normal text-slate-700 border-transparent hover:text-slate-900",
              )}
            >
              {tab.label}
            </a>
          )
        })}
      </div>

      {/* Right side content */}
      <div className="flex items-center gap-6">
        {/* Progress Bar - only show on forms pages */}
        {mounted && !isSettingsPage && !isReportsPage && !isDashboardsPage && !pathname.startsWith("/profile") && (
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">Progress:</div>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-slate-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "15%" }}></div>
              </div>
              <span className="text-sm font-medium text-slate-700">3/20</span>
            </div>
            <div className="text-xs text-slate-500">sections completed</div>
          </div>
        )}

        {/* User Profile and Logo */}
        <div className="flex items-center gap-4">
          {/* MATpad Logo */}
          <img src="/matpad-logo.svg" alt="MATpad" className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  )
}
