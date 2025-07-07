"use client"

import { Upload, Settings, ClipboardList, FileBarChart, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  expanded: boolean
  onToggle: () => void
}

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  const menuItems = [
    { icon: Upload, label: "Upload", href: "/upload" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: ClipboardList, label: "Forms", href: "/forms", active: true },
    { icon: FileBarChart, label: "Reports", href: "/reports" },
  ]

  return (
    <div className={cn("bg-slate-600 transition-all duration-300 flex flex-col", expanded ? "w-64" : "w-16")}>
      {/* Menu Toggle */}
      <div className="h-16 flex items-center justify-end px-4">
        <button onClick={onToggle} className="text-slate-50 hover:bg-slate-500 p-2 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="mb-2">
              <a
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg h-10 transition-colors group",
                  item.active ? "bg-slate-500" : "hover:bg-slate-500",
                  expanded ? "px-3" : "justify-center",
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-lg min-h-6 w-6 border border-slate-400",
                    item.active ? "bg-white" : "bg-slate-200 group-hover:bg-white",
                  )}
                >
                  <Icon className="w-4 h-4 text-slate-700" />
                </div>
                {expanded && <span className="ml-3 text-white font-medium">{item.label}</span>}
              </a>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
