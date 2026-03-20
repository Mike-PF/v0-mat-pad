"use client"

import { useState } from "react"
import { Upload, Settings, ClipboardList, FileBarChart, ChevronLeft, ChevronRight, LogOut, ArrowLeftRight, Check } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const ACCENT = "hsl(314 100% 35%)"

const schools = [
  { id: "1", name: "All Saints' Catholic High School", abbr: "ASHS" },
  { id: "2", name: "Emmaus Catholic Primary School", abbr: "ECP" },
  { id: "3", name: "Notre Dame High School", abbr: "NDHS" },
]

interface SidebarProps {
  expanded: boolean
  onToggle: () => void
}

function IconCircle({
  active,
  children,
}: {
  active?: boolean
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-all text-white"
      style={{ backgroundColor: active || hovered ? ACCENT : "transparent" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  )
}

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [activeSchool, setActiveSchool] = useState(schools[0])

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
                "flex items-center gap-1 rounded-lg h-11 transition-all duration-150 group relative overflow-hidden",
                expanded ? "px-1" : "justify-center px-0",
              )}
              style={active ? { backgroundColor: "hsl(314 100% 35% / 0.18)" } : undefined}
            >
              {/* Active indicator bar */}
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full"
                  style={{ backgroundColor: ACCENT }}
                />
              )}

              <IconCircle active={active}>
                <Icon className="w-5 h-5" />
              </IconCircle>

              {/* Label */}
              {expanded && (
                <span
                  className={cn(
                    "text-sm font-medium whitespace-nowrap transition-colors ml-2",
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

      {/* Bottom section */}
      <div className="p-2 pb-4 space-y-1 border-t border-white/10">

        {/* Account Switcher */}
        <div className="relative">
          <button
            onClick={() => setSwitcherOpen((o) => !o)}
            className={cn(
              "w-full flex items-center rounded-lg h-11 transition-colors group",
              expanded ? "px-1 gap-1" : "justify-center"
            )}
            title={!expanded ? `Switch school (${activeSchool.abbr})` : undefined}
            aria-label="Switch school account"
          >
            <IconCircle>
              <ArrowLeftRight className="w-5 h-5" />
            </IconCircle>
            {expanded && (
              <div className="flex flex-col items-start ml-2 min-w-0">
                <span className="text-[10px] text-white/40 leading-none">School account</span>
                <span className="text-sm font-medium text-white/80 group-hover:text-white truncate max-w-[110px] leading-tight mt-0.5">
                  {activeSchool.abbr}
                </span>
              </div>
            )}
          </button>

          {/* Dropdown */}
          {switcherOpen && (
            <div
              className="absolute bottom-full mb-2 left-0 right-0 rounded-lg overflow-hidden shadow-xl border border-white/10 z-50"
              style={{ backgroundColor: "#0e0c3e" }}
            >
              {schools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => {
                    setActiveSchool(school)
                    setSwitcherOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white/8 transition-colors group"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {school.abbr.charAt(0)}
                  </div>
                  <span className="text-xs text-white/70 group-hover:text-white truncate flex-1">
                    {expanded ? school.name : school.abbr}
                  </span>
                  {activeSchool.id === school.id && (
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: ACCENT }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => {}}
          className={cn(
            "w-full flex items-center rounded-lg h-11 transition-colors group",
            expanded ? "px-1 gap-1" : "justify-center"
          )}
          title={!expanded ? "Logout" : undefined}
          aria-label="Logout"
        >
          <IconCircle>
            <LogOut className="w-5 h-5" />
          </IconCircle>
          {expanded && (
            <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors ml-2">
              Logout
            </span>
          )}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center rounded-lg h-9 transition-colors text-white/30 hover:text-white/70",
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
