"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { X, Send, Sparkles, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function AIChatPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/reports-ai" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleClearChat = () => {
    setMessages([])
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200 hover:scale-105",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        style={{ backgroundColor: "hsl(314 100% 35%)" }}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </button>

      {/* Chat popup */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 border border-slate-200",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 text-white"
          style={{ backgroundColor: "#121051" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "hsl(314 100% 35%)" }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">MATpad AI</h3>
              <p className="text-xs text-white/60">Ask about your data</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="text-xs text-white/60 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "hsl(314 100% 35% / 0.1)" }}
              >
                <Sparkles className="w-8 h-8" style={{ color: "hsl(314 100% 35%)" }} />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">How can I help?</h4>
              <p className="text-sm text-slate-500 mb-6">
                Ask me anything about your reports, attendance data, attainment figures, or get insights from your school data.
              </p>
              <div className="grid gap-2 w-full">
                {[
                  "What's our current attendance rate?",
                  "Compare KS2 results across schools",
                  "Show persistent absence trends",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion)
                    }}
                    className="text-left text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-colors text-slate-600"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#121051" }}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    message.role === "user"
                      ? "bg-[#121051] text-white rounded-br-md"
                      : "bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm"
                  )}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <span key={index} className="whitespace-pre-wrap">
                          {part.text}
                        </span>
                      )
                    }
                    return null
                  })}
                </div>
                {message.role === "user" && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "hsl(314 100% 35%)" }}
                  >
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-3 justify-start">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#121051" }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your data..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-full focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              size="icon"
              className="w-10 h-10 rounded-full shrink-0 disabled:opacity-50"
              style={{ backgroundColor: isLoading || !input.trim() ? "#ccc" : "hsl(314 100% 35%)" }}
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
