"use client"

import { Upload, Settings, ClipboardList, FileBarChart, ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarProps {
  expanded: boolean
  onToggle: () => void
}

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { icon: Upload, label: "Upload", href: "/upload" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: ClipboardList, label: "Forms", href: "/forms" },
    { icon: FileBarChart, label: "Reports", href: "/reports" },
  ]

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <div
      className={cn(
        "flex flex-col transition-all duration-300 ease-in-out relative",
        expanded ? "w-56" : "w-[60px]"
      )}
      style={{ backgroundColor: "#121051" }}
    >
      {/* Nav Items */}
      <nav className="flex-1 pt-4 px-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <a
              key={item.label}
              href={item.href}
              title={!expanded ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg h-11 transition-all duration-150 group relative overflow-hidden",
                expanded ? "px-3" : "justify-center px-0",
                active
                  ? "bg-white/10"
                  : "hover:bg-white/8"
              )}
            >
              {/* Active indicator bar */}
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                  style={{ backgroundColor: "hsl(314 100% 35%)" }}
                />
              )}

              {/* Icon */}
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-all text-white"
                )}
                style={active ? { backgroundColor: "hsl(314 100% 35%)" } : undefined}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "hsl(314 100% 35%)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent"
                  }
                }}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Label */}
              {expanded && (
                <span
                  className={cn(
                    "text-sm font-medium whitespace-nowrap transition-colors",
                    active ? "text-white" : "text-white/60 group-hover:text-white/90"
                  )}
                >
                  {item.label}
                </span>
              )}
            </a>
          )
        })}
      </nav>

      {/* Collapse toggle at bottom */}
      <div className="p-2 pb-4">
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center rounded-lg h-9 transition-colors text-white/40 hover:text-white/80 hover:bg-white/8",
            expanded ? "px-3 gap-3" : "justify-center"
          )}
          aria-label={expanded ? "Collapse menu" : "Expand menu"}
        >
          {expanded ? (
            <>
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}
