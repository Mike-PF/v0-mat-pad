"use client"

import { useEffect, useState } from "react"
import { Mail, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_USERS } from "@/components/permission-assigner"

export type ScheduleFrequency = "daily" | "weekly" | "monthly" | "half-termly" | "termly" | "yearly"

export interface ReportSchedule {
  reportId: string
  frequency: ScheduleFrequency
  weekday: string
  monthDay: string
  periodTiming: "start" | "end"
  time: string
  recipientIds: string[]
  message: string
  active: boolean
}

export const FREQUENCY_LABELS: Record<ScheduleFrequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  "half-termly": "Half termly",
  termly: "Termly",
  yearly: "Yearly",
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const MONTH_DAYS = ["1", "7", "14", "21", "28", "last"]
const PERIOD_NOUN: Partial<Record<ScheduleFrequency, string>> = {
  "half-termly": "half term",
  termly: "term",
  yearly: "academic year",
}

export function describeSchedule(s: ReportSchedule) {
  const at = `at ${s.time}`
  switch (s.frequency) {
    case "daily":
      return `Every school day ${at}`
    case "weekly":
      return `Every ${s.weekday} ${at}`
    case "monthly":
      return s.monthDay === "last" ? `Last day of each month ${at}` : `Day ${s.monthDay} of each month ${at}`
    default:
      return `${s.periodTiming === "start" ? "Start" : "End"} of each ${PERIOD_NOUN[s.frequency]} ${at}`
  }
}

interface Props {
  isOpen: boolean
  onClose: () => void
  report: { id: string; name: string } | null
  existing?: ReportSchedule | null
  onSave: (schedule: ReportSchedule) => void
  onRemove: (reportId: string) => void
}

export function ReportScheduleModal({ isOpen, onClose, report, existing, onSave, onRemove }: Props) {
  const [frequency, setFrequency] = useState<ScheduleFrequency>("weekly")
  const [weekday, setWeekday] = useState("Monday")
  const [monthDay, setMonthDay] = useState("1")
  const [periodTiming, setPeriodTiming] = useState<"start" | "end">("end")
  const [time, setTime] = useState("08:00")
  const [recipientIds, setRecipientIds] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [active, setActive] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isOpen) return
    setFrequency(existing?.frequency ?? "weekly")
    setWeekday(existing?.weekday ?? "Monday")
    setMonthDay(existing?.monthDay ?? "1")
    setPeriodTiming(existing?.periodTiming ?? "end")
    setTime(existing?.time ?? "08:00")
    setRecipientIds(existing?.recipientIds ?? [])
    setMessage(existing?.message ?? "")
    setActive(existing?.active ?? true)
    setError("")
  }, [isOpen, existing])

  if (!report) return null

  const toggleRecipient = (id: string) => {
    setError("")
    setRecipientIds((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))
  }

  const allSelected = recipientIds.length === MOCK_USERS.length

  const draft: ReportSchedule = {
    reportId: report.id,
    frequency,
    weekday,
    monthDay,
    periodTiming,
    time,
    recipientIds,
    message,
    active,
  }

  const handleSave = () => {
    if (recipientIds.length === 0) {
      setError("Select at least one recipient.")
      return
    }
    onSave(draft)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#33295e]">
            <Mail className="w-5 h-5" aria-hidden="true" />
            Schedule email
          </DialogTitle>
          <DialogDescription>
            Automatically email <span className="font-medium text-slate-900">{report.name}</span> to selected users.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-slate-900 mb-2">Frequency</legend>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(FREQUENCY_LABELS) as ScheduleFrequency[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={frequency === f}
                  onClick={() => setFrequency(f)}
                  className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                    frequency === f
                      ? "border-[#33295e] bg-[#33295e] text-white"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {FREQUENCY_LABELS[f]}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-4">
            {frequency === "weekly" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="schedule-weekday">Day</Label>
                <Select value={weekday} onValueChange={setWeekday}>
                  <SelectTrigger id="schedule-weekday">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WEEKDAYS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {frequency === "monthly" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="schedule-monthday">Day of month</Label>
                <Select value={monthDay} onValueChange={setMonthDay}>
                  <SelectTrigger id="schedule-monthday">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_DAYS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d === "last" ? "Last day" : d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {PERIOD_NOUN[frequency] && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="schedule-timing">Send at</Label>
                <Select value={periodTiming} onValueChange={(v) => setPeriodTiming(v as "start" | "end")}>
                  <SelectTrigger id="schedule-timing">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">Start of {PERIOD_NOUN[frequency]}</SelectItem>
                    <SelectItem value="end">End of {PERIOD_NOUN[frequency]}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="schedule-time">Time</Label>
              <Input id="schedule-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <fieldset className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <legend className="text-sm font-medium text-slate-900">
                Recipients <span className="text-slate-500 font-normal">({recipientIds.length} selected)</span>
              </legend>
              <button
                type="button"
                className="text-xs font-medium text-[#33295e] hover:underline"
                onClick={() => setRecipientIds(allSelected ? [] : MOCK_USERS.map((u) => u.id))}
              >
                {allSelected ? "Clear all" : "Select all"}
              </button>
            </div>
            <ul className="flex flex-col divide-y divide-slate-100 rounded-md border border-slate-200">
              {MOCK_USERS.map((u) => (
                <li key={u.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-slate-50">
                    <Checkbox checked={recipientIds.includes(u.id)} onCheckedChange={() => toggleRecipient(u.id)} />
                    <span className="flex flex-col">
                      <span className="text-sm text-slate-900">{u.name}</span>
                      <span className="text-xs text-slate-500">{u.email}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
          </fieldset>

          <div className="flex flex-col gap-2">
            <Label htmlFor="schedule-message">Email message (optional)</Label>
            <textarea
              id="schedule-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please find the latest report attached."
              className="rounded-md border border-slate-200 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#33295e]/30"
            />
          </div>

          <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900">Schedule active</span>
              <span className="text-xs text-slate-500">{describeSchedule(draft)}</span>
            </div>
            <Switch checked={active} onCheckedChange={setActive} aria-label="Schedule active" />
          </div>
        </div>

        <DialogFooter className="flex items-center gap-2 sm:justify-between">
          {existing ? (
            <Button
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                onRemove(report.id)
                onClose()
              }}
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              Remove schedule
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-[#33295e] text-white hover:bg-[#2a2150]" onClick={handleSave}>
              Save schedule
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
