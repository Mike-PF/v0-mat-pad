"use client"

import { useSyncExternalStore } from "react"

// UI preference only: whether the support chat launcher has been tucked into the sidebar.
// Sidebar links are full page loads, so the choice is kept in localStorage.
const STORAGE_KEY = "fuze:support-chat-docked"
const OPEN_EVENT = "fuze:support-chat-open"

const listeners = new Set<() => void>()

function read(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

function write(docked: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, docked ? "1" : "0")
  } catch {}
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSupportChatDocked() {
  return useSyncExternalStore(subscribe, read, () => false)
}

export function dockSupportChat() {
  write(true)
}

/** Bring the launcher back from the sidebar and open the chat panel. */
export function undockAndOpenSupportChat() {
  write(false)
  window.dispatchEvent(new Event(OPEN_EVENT))
}

export function onSupportChatOpenRequest(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler)
  return () => window.removeEventListener(OPEN_EVENT, handler)
}
