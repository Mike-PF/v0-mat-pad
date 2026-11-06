"use client"

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { Headset, Minus, SendHorizontal } from "lucide-react"

interface SupportMessage {
  id: number
  from: "agent" | "user"
  text: string
  time: string
}

const timeNow = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

const WELCOME: SupportMessage = {
  id: 0,
  from: "agent",
  text: "Hi, you're through to the Fuze support team. How can we help today?",
  time: "",
}

const AUTO_REPLY =
  "Thanks, we've received your message. A member of the support team will pick this up shortly. You can keep using Fuze while you wait."

/**
 * Customer support (human) chat. Anchored bottom-left beside the sidebar so it never
 * overlaps the Fuze AI launcher or download queue, which live bottom-right. It sits at
 * z-40, below the AI chat overlay (z-50), so opening the AI chat always covers it.
 */
export function SupportChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<SupportMessage[]>([WELCOME])
  const [draft, setDraft] = useState("")
  const [unread, setUnread] = useState(0)
  const [agentTyping, setAgentTyping] = useState(false)
  const nextId = useRef(1)
  const hasAutoReplied = useRef(false)
  const listRef = useRef<HTMLOListElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, agentTyping, open])

  const toggle = () => {
    setOpen((o) => !o)
    setUnread(0)
  }

  const send = (e?: FormEvent) => {
    e?.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((m) => [...m, { id: nextId.current++, from: "user", text, time: timeNow() }])
    setDraft("")
    inputRef.current?.focus()

    if (hasAutoReplied.current) return
    hasAutoReplied.current = true
    setAgentTyping(true)
    window.setTimeout(() => {
      setAgentTyping(false)
      setMessages((m) => [...m, { id: nextId.current++, from: "agent", text: AUTO_REPLY, time: timeNow() }])
      setOpen((isOpen) => {
        if (!isOpen) setUnread((u) => u + 1)
        return isOpen
      })
    }, 1400)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey) return
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    e.preventDefault()
    send()
  }

  return (
    <div className="fixed bottom-6 left-[84px] z-40 flex flex-col items-start gap-3">
      {open && (
        <section
          id="support-chat-panel"
          aria-label="Customer support chat"
          className="flex h-[480px] max-h-[calc(100vh-7rem)] w-[360px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between gap-3 bg-[#33295e] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Headset className="h-5 w-5 text-white" aria-hidden="true" />
                <span
                  className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#33295e] bg-emerald-400"
                  aria-hidden="true"
                />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-white">Fuze Support</h2>
                <p className="text-xs text-white/75">Online · usually replies in a few minutes</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggle}
              aria-label="Minimise support chat"
              className="rounded-full p-1.5 text-white/85 transition-colors hover:bg-white/15 hover:text-white"
            >
              <Minus className="h-4 w-4" />
            </button>
          </header>

          <ol ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto bg-slate-50 px-4 py-4" aria-live="polite">
            {messages.map((m) => (
              <li key={m.id} className={`flex flex-col gap-1 ${m.from === "user" ? "items-end" : "items-start"}`}>
                <p
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.from === "user"
                      ? "rounded-br-sm bg-[#33295e] text-white"
                      : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {m.text}
                </p>
                {m.time && <span className="px-1 text-[11px] text-slate-400">{m.time}</span>}
              </li>
            ))}
            {agentTyping && (
              <li className="flex items-start">
                <span className="sr-only">Support is typing</span>
                <span
                  className="flex gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3.5 py-3"
                  aria-hidden="true"
                >
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
                </span>
              </li>
            )}
          </ol>

          <form onSubmit={send} className="flex items-end gap-2 border-t border-slate-200 bg-white p-3">
            <label htmlFor="support-chat-input" className="sr-only">
              Message support
            </label>
            <textarea
              id="support-chat-input"
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your message"
              className="max-h-28 min-h-10 flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-[#33295e] focus:outline-none focus:ring-2 focus:ring-[#33295e]/20"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#33295e] text-white transition-colors hover:bg-[#33295e]/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="support-chat-panel"
        className="relative flex items-center gap-2 rounded-full border border-slate-200 bg-white py-2.5 pl-3.5 pr-4 text-sm font-medium text-[#33295e] shadow-lg transition-shadow hover:shadow-xl"
      >
        <Headset className="h-5 w-5" aria-hidden="true" />
        {open ? "Close support" : "Chat with support"}
        {unread > 0 && !open && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#fd6d6d] px-1 text-[11px] font-semibold text-white">
            {unread}
            <span className="sr-only"> unread {unread === 1 ? "message" : "messages"}</span>
          </span>
        )}
      </button>
    </div>
  )
}
