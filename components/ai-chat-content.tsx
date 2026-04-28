"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Mic, Send, Star, MoreHorizontal, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const NAVY = "#121051"
const ACCENT = "#B30089"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
}

// Sample chat history
const sampleChatSessions: ChatSession[] = [
  {
    id: "1",
    title: "Ofsted Inspection Preparation",
    messages: [
      { id: "1a", role: "user", content: "What should we focus on when preparing for an Ofsted inspection?", timestamp: new Date("2024-01-15T10:00:00") },
      { id: "1b", role: "assistant", content: "For Ofsted preparation, focus on five key areas: quality of education, behaviour and attitudes, personal development, leadership and management, and early years provision if applicable. Ensure your self-evaluation form (SEF) is up to date and that all staff can articulate your school improvement plan clearly.", timestamp: new Date("2024-01-15T10:01:00") },
    ],
    isPinned: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "MAT Performance Overview",
    messages: [
      { id: "2a", role: "user", content: "Summarise the performance across our MAT for this academic year.", timestamp: new Date("2024-01-14T09:00:00") },
      { id: "2b", role: "assistant", content: "Across the trust, Progress 8 scores have improved by 0.3 on average compared to last year. Three schools are now above national average for Attainment 8, and persistent absence has reduced by 2.1 percentage points trust-wide. The primary schools show strong KS2 reading results at 76% meeting expected standard.", timestamp: new Date("2024-01-14T09:01:00") },
    ],
    isPinned: true,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    title: "Pupil Premium Strategy 2024",
    messages: [
      { id: "3a", role: "user", content: "Help me draft a pupil premium strategy for the 2024-25 academic year.", timestamp: new Date("2024-01-13T14:00:00") },
      { id: "3b", role: "assistant", content: "A strong pupil premium strategy should be structured around three pillars: teaching and learning quality, targeted academic support, and wider strategies for wellbeing and attendance. I can help you draft each section with reference to the EEF guidance toolkit. Shall we start with your current pupil premium cohort data?", timestamp: new Date("2024-01-13T14:02:00") },
    ],
    isPinned: true,
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
  },
  {
    id: "4",
    title: "Persistent Absence Analysis",
    messages: [
      { id: "4a", role: "user", content: "Which year groups have the highest persistent absence rates?", timestamp: new Date("2024-01-12T11:00:00") },
      { id: "4b", role: "assistant", content: "Based on the current data, Year 10 has the highest persistent absence rate at 18.4%, followed by Year 8 at 15.9%. Both are above the national average of 14.2%. Year 7 and Year 12 are performing well below the national threshold. Would you like me to break this down by FSM eligibility or SEN status?", timestamp: new Date("2024-01-12T11:01:00") },
    ],
    isPinned: false,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "5",
    title: "SEND Provision Review",
    messages: [
      { id: "5a", role: "user", content: "Review our current SEND provision and identify gaps.", timestamp: new Date("2024-01-11T16:00:00") },
      { id: "5b", role: "assistant", content: "Looking at your SEND data, the proportion of pupils with EHCPs is 3.2%, slightly below the national average of 3.7%. There are indicators that identification of pupils with SEMH needs may be underrepresented. I would recommend reviewing referral pathways and ensuring class teachers are confident in early identification.", timestamp: new Date("2024-01-11T16:02:00") },
    ],
    isPinned: false,
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
  },
  {
    id: "6",
    title: "School Improvement Plan Draft",
    messages: [
      { id: "6a", role: "user", content: "Help me write the curriculum section of our school improvement plan.", timestamp: new Date("2024-01-10T09:30:00") },
      { id: "6b", role: "assistant", content: "For the curriculum section, I suggest structuring it around intent, implementation, and impact — aligned with the Ofsted framework. Key priorities might include improving curriculum sequencing in humanities, increasing oracy provision across KS3, and embedding retrieval practice school-wide. Shall I draft specific targets and success criteria?", timestamp: new Date("2024-01-10T09:32:00") },
    ],
    isPinned: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "7",
    title: "KS2 SATs Results Breakdown",
    messages: [
      { id: "7a", role: "user", content: "Break down our KS2 SATs results by subject and demographic.", timestamp: new Date("2024-01-09T13:00:00") },
      { id: "7b", role: "assistant", content: "Your combined Reading, Writing and Maths score is 61%, which is 3 points below national average. Reading is your strongest subject at 74%. There is a notable gap for FSM pupils in Maths (48% vs 67% non-FSM). Gender gap in Writing is narrower than national, which is a positive indicator.", timestamp: new Date("2024-01-09T13:03:00") },
    ],
    isPinned: false,
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-09"),
  },
  {
    id: "8",
    title: "Staff Wellbeing Survey Analysis",
    messages: [
      { id: "8a", role: "user", content: "Analyse the results of our staff wellbeing survey.", timestamp: new Date("2024-01-08T10:00:00") },
      { id: "8b", role: "assistant", content: "The survey results show 68% of staff feel supported by senior leadership, up from 54% last year. Workload remains the top concern, cited by 71% of respondents. CPD satisfaction has improved significantly following the introduction of protected development time on Thursday afternoons.", timestamp: new Date("2024-01-08T10:05:00") },
    ],
    isPinned: false,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
  },
  {
    id: "9",
    title: "Exclusions & Behaviour Data",
    messages: [
      { id: "9a", role: "user", content: "Summarise our exclusions data for the autumn term.", timestamp: new Date("2024-01-07T15:00:00") },
      { id: "9b", role: "assistant", content: "Autumn term saw 12 fixed-term exclusions and 0 permanent exclusions. This is a reduction of 4 compared to the same period last year. The majority of exclusions were in Year 9 and related to persistent disruptive behaviour. Internal suspensions totalled 34 days across the school.", timestamp: new Date("2024-01-07T15:04:00") },
    ],
    isPinned: false,
    createdAt: new Date("2024-01-07"),
    updatedAt: new Date("2024-01-07"),
  },
  {
    id: "10",
    title: "Sixth Form Destinations Report",
    messages: [
      { id: "10a", role: "user", content: "What were the post-16 destinations for last year's Year 13 cohort?", timestamp: new Date("2024-01-06T11:00:00") },
      { id: "10b", role: "assistant", content: "Of last year's Year 13 cohort, 62% progressed to higher education, with 8% attending Russell Group universities. 21% entered employment or apprenticeships, 11% took a gap year, and 6% enrolled in further education or retraining. Overall destination data is above national average for this school type.", timestamp: new Date("2024-01-06T11:02:00") },
    ],
    isPinned: false,
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-06"),
  },
  {
    id: "11",
    title: "Curriculum Intent Statement",
    messages: [
      { id: "11a", role: "user", content: "Help me write a curriculum intent statement for our school.", timestamp: new Date("2024-01-05T09:00:00") },
      { id: "11b", role: "assistant", content: "Here is a draft curriculum intent statement: 'Our curriculum is designed to inspire curiosity, build cultural capital, and equip all pupils with the knowledge and skills to thrive beyond school. We believe in an ambitious, knowledge-rich curriculum that is carefully sequenced to ensure deep understanding and long-term retention across all subjects and year groups.' Would you like me to tailor this to your school context?", timestamp: new Date("2024-01-05T09:03:00") },
    ],
    isPinned: false,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
]

export function AIChatContent() {
  const [sessions, setSessions] = useState<ChatSession[]>(sampleChatSessions)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeSession = sessions.find((s) => s.id === activeSessionId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (activeSession) {
      scrollToBottom()
    }
  }, [activeSession?.messages])

  const handleNewChat = () => {
    setActiveSessionId(null)
    setInputValue("")
  }

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId)
    setInputValue("")
  }

  const handleTogglePin = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, isPinned: !s.isPinned } : s))
    )
  }

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    if (activeSessionId === sessionId) {
      setActiveSessionId(null)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    if (activeSessionId) {
      // Add message to existing session
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, messages: [...s.messages, userMessage], updatedAt: new Date() }
            : s
        )
      )
    } else {
      // Create new session
      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: inputValue.trim().slice(0, 30) + (inputValue.length > 30 ? "..." : ""),
        messages: [userMessage],
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setSessions((prev) => [newSession, ...prev])
      setActiveSessionId(newSession.id)
    }

    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-response`,
        role: "assistant",
        content: "Thank you for your message. I'm here to help you with any questions about your school data, reports, or any other information you need. How can I assist you today?",
        timestamp: new Date(),
      }

      setSessions((prev) =>
        prev.map((s) =>
          s.id === (activeSessionId || `session-${Date.now() - 1500}`) ||
          (s.messages.length === 1 && s.messages[0].id === userMessage.id)
            ? { ...s, messages: [...s.messages, assistantMessage], updatedAt: new Date() }
            : s
        )
      )
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const pinnedSessions = sessions.filter((s) => s.isPinned)
  const recentSessions = sessions.filter((s) => !s.isPinned)

  return (
    <div className="flex h-full bg-white">
      {/* Left Sidebar - Chat History */}
      <div className="w-64 border-r border-slate-200 flex flex-col bg-slate-50">
        {/* New Chat Button */}
        <div className="p-3 border-b border-slate-200">
          <Button
            onClick={handleNewChat}
            variant="outline"
            className="w-full justify-start gap-2 text-sm hover:bg-slate-100"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {/* Pinned Section */}
          {pinnedSessions.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Pinned
              </div>
              {pinnedSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  onMouseEnter={() => setHoveredSessionId(session.id)}
                  onMouseLeave={() => setHoveredSessionId(null)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                    activeSessionId === session.id
                      ? "bg-slate-200"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <span className="flex-1 truncate text-slate-700">{session.title}</span>
                  {(hoveredSessionId === session.id || activeSessionId === session.id) ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleTogglePin(session.id, e)}
                        className="p-1 hover:bg-slate-200 rounded"
                        title="Unpin"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="p-1 hover:bg-slate-200 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  ) : (
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Recents Section */}
          <div className="py-2">
            <div className="px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
              Recents
            </div>
            {recentSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSelectSession(session.id)}
                onMouseEnter={() => setHoveredSessionId(session.id)}
                onMouseLeave={() => setHoveredSessionId(null)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                  activeSessionId === session.id
                    ? "bg-slate-200"
                    : "hover:bg-slate-100"
                }`}
              >
                <span className="flex-1 truncate text-slate-700">{session.title}</span>
                {(hoveredSessionId === session.id || activeSessionId === session.id) && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleTogglePin(session.id, e)}
                      className="p-1 hover:bg-slate-200 rounded"
                      title="Pin"
                    >
                      <Star className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="p-1 hover:bg-slate-200 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {!activeSession ? (
          // Empty state - New Chat
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <h1 className="text-3xl font-light text-slate-800 mb-12 italic">
              Ready when you are.
            </h1>

            {/* Input Field */}
            <div className="w-full max-w-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-full shadow-sm bg-white">
                <Plus className="w-5 h-5 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask anything"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
                />
                <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="p-2 rounded-full transition-colors disabled:opacity-50"
                  style={{ backgroundColor: NAVY, color: "white" }}
                >
                  <Send className="w-4 h-4" />
                </button>
            </div>
          </div>
        ) : (
          // Active Chat
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-medium text-slate-800">{activeSession.title}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleTogglePin(activeSession.id, e)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title={activeSession.isPinned ? "Unpin" : "Pin"}
                >
                  <Star
                    className={`w-4 h-4 ${
                      activeSession.isPinned ? "text-amber-500 fill-amber-500" : "text-slate-400"
                    }`}
                  />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="max-w-3xl mx-auto space-y-6">
                {activeSession.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-slate-100 text-slate-800"
                          : "bg-white border border-slate-200 text-slate-700"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="px-6 py-4 border-t border-slate-200">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-full bg-white">
                  <Plus className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ask anything"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
                  />
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="p-2 rounded-full transition-colors disabled:opacity-50"
                    style={{ backgroundColor: NAVY, color: "white" }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
