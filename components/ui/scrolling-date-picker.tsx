"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const NAVY = "#33295e"
const WEEKDAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]

interface ScrollingDatePickerProps {
  value?: Date | null
  onChange?: (date: Date) => void
  placeholder?: string
  className?: string
}

interface MonthCell {
  date: Date
  inMonth: boolean
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const formatMonth = (d: Date) => d.toLocaleString("en-US", { month: "long", year: "numeric" })
const formatShortMonth = (d: Date) => d.toLocaleString("en-US", { month: "short" })
const formatDisplay = (d: Date) => d.toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric" })

// Build the 6-week grid for a given month, including faded adjacent-month days.
function buildMonthGrid(year: number, month: number): MonthCell[] {
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay()) // back up to the Sunday
  const cells: MonthCell[] = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    cells.push({ date, inMonth: date.getMonth() === month })
  }
  // Drop a trailing all-adjacent week if the month only needs 5 weeks.
  if (cells.slice(35).every((c) => !c.inMonth)) return cells.slice(0, 35)
  return cells
}

export function ScrollingDatePicker({ value, onChange, placeholder = "Select a date", className }: ScrollingDatePickerProps) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [open, setOpen] = useState(false)

  // Month range: one year back through two years forward from today.
  const months = useMemo(() => {
    const list: { year: number; month: number }[] = []
    const startYear = today.getFullYear() - 1
    const endYear = today.getFullYear() + 2
    for (let y = startYear; y <= endYear; y++) {
      for (let m = 0; m < 12; m++) list.push({ year: y, month: m })
    }
    return list
  }, [today])

  const todayIndex = useMemo(
    () => months.findIndex((m) => m.year === today.getFullYear() && m.month === today.getMonth()),
    [months, today],
  )

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const monthRefs = useRef<(HTMLDivElement | null)[]>([])
  const sidebarRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(todayIndex < 0 ? 0 : todayIndex)

  const scrollToMonth = (index: number, behavior: ScrollBehavior = "smooth") => {
    const el = monthRefs.current[index]
    const container = scrollRef.current
    if (el && container) {
      container.scrollTo({ top: el.offsetTop - container.offsetTop, behavior })
    }
  }

  // When opened, jump straight to the selected month (or today) without animation.
  useLayoutEffect(() => {
    if (!open) return
    const target = value
      ? months.findIndex((m) => m.year === value.getFullYear() && m.month === value.getMonth())
      : todayIndex
    const idx = target < 0 ? todayIndex : target
    setActiveIndex(idx < 0 ? 0 : idx)
    // defer so the popover content has laid out
    const raf = requestAnimationFrame(() => scrollToMonth(idx < 0 ? 0 : idx, "auto"))
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Keep the active sidebar entry in view as the calendar scrolls.
  useEffect(() => {
    sidebarRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  const handleScroll = () => {
    const container = scrollRef.current
    if (!container) return
    const top = container.scrollTop + 8
    let current = activeIndex
    for (let i = 0; i < monthRefs.current.length; i++) {
      const el = monthRefs.current[i]
      if (!el) continue
      if (el.offsetTop - container.offsetTop <= top) current = i
      else break
    }
    if (current !== activeIndex) setActiveIndex(current)
  }

  const handleSelect = (date: Date) => {
    onChange?.(startOfDay(date))
    setOpen(false)
  }

  const activeMonth = months[activeIndex] ?? months[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-64 items-center rounded-lg border-2 px-4 py-2.5 text-left text-base transition-colors",
            open ? "border-[#33295e]" : "border-slate-300 hover:border-slate-400",
            className,
          )}
          style={open ? { borderColor: NAVY } : undefined}
        >
          <span className={value ? "text-slate-900" : "text-slate-500"}>
            {value ? formatDisplay(value) : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverPrimitive.Content
        align="start"
        sideOffset={6}
        // Rendered WITHOUT a portal so the panel stays inside the dialog's
        // scroll-lock boundary — otherwise react-remove-scroll blocks wheel
        // scrolling on the month list and year sidebar.
        className="z-50 w-auto overflow-hidden rounded-xl border border-slate-200 bg-popover p-0 text-popover-foreground shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
      >
        <div className="flex h-[420px]">
          {/* Sidebar: scrollable month list grouped by year */}
          <div className="w-24 shrink-0 overflow-y-auto border-r border-slate-100 bg-slate-50 py-3">
            {months.map((m, i) => {
              const date = new Date(m.year, m.month, 1)
              const isActive = i === activeIndex
              return (
                <div key={`${m.year}-${m.month}`}>
                  {m.month === 0 && (
                    <button
                      type="button"
                      onClick={() => scrollToMonth(i)}
                      className="block w-full px-5 py-1.5 text-left text-lg font-bold"
                      style={{ color: NAVY }}
                    >
                      {m.year}
                    </button>
                  )}
                  <button
                    ref={(el) => (sidebarRefs.current[i] = el)}
                    type="button"
                    onClick={() => scrollToMonth(i)}
                    className={cn(
                      "block w-full px-5 py-1.5 text-left text-lg transition-colors hover:text-[#33295e]",
                      isActive ? "font-bold" : "font-normal text-slate-500",
                    )}
                    style={isActive ? { color: NAVY } : undefined}
                  >
                    {formatShortMonth(date)}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Main calendar */}
          <div className="flex w-[360px] flex-col">
            {/* Sticky header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-xl font-bold" style={{ color: NAVY }}>
                {activeMonth ? formatMonth(new Date(activeMonth.year, activeMonth.month, 1)) : ""}
              </span>
              <button
                type="button"
                onClick={() => scrollToMonth(todayIndex < 0 ? 0 : todayIndex)}
                className="text-base font-medium hover:underline"
                style={{ color: NAVY }}
              >
                Today
              </button>
            </div>
            {/* Weekday row */}
            <div className="grid grid-cols-7 px-3 pb-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-1 text-center text-xs font-bold tracking-wide" style={{ color: NAVY }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Scrollable month blocks */}
            <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-3 pb-3">
              {months.map((m, i) => {
                const grid = buildMonthGrid(m.year, m.month)
                return (
                  <div key={`${m.year}-${m.month}`} ref={(el) => (monthRefs.current[i] = el)}>
                    <div className="pt-3 pb-1 text-lg font-bold" style={{ color: NAVY }}>
                      {formatMonth(new Date(m.year, m.month, 1))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1">
                      {grid.map((cell, ci) => {
                        const isToday = sameDay(cell.date, today)
                        const isSelected = value ? sameDay(cell.date, value) : false
                        return (
                          <div key={ci} className="flex justify-center">
                            <button
                              type="button"
                              onClick={() => handleSelect(cell.date)}
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-md text-base transition-colors",
                                !cell.inMonth && "text-slate-300",
                                cell.inMonth && !isSelected && "text-slate-800 hover:bg-slate-100",
                                isSelected && "font-semibold text-white",
                                !isSelected && isToday && "border",
                              )}
                              style={{
                                ...(isSelected ? { backgroundColor: NAVY } : {}),
                                ...(!isSelected && isToday ? { borderColor: NAVY, color: NAVY } : {}),
                              }}
                            >
                              {cell.date.getDate()}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </PopoverPrimitive.Content>
    </Popover>
  )
}
