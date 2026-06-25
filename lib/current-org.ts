// Lightweight "current organisation" concept for the prototype.
//
// There is no real authentication in this app yet — the signed-in user is
// hardcoded (see components/sidebar.tsx). "Fuze" is the platform/vendor admin
// organisation that manages system-wide configuration (System Help, System
// Notifications, and the AI Chatbot). Pages gated behind isPlatformAdmin()
// are only available when signed in as Fuze.
//
// To simulate signing in as a different organisation, change CURRENT_ORG.
export const PLATFORM_ADMIN_ORG = "Fuze"

export const CURRENT_ORG = "Fuze"

export function isPlatformAdmin(org: string = CURRENT_ORG): boolean {
  return org === PLATFORM_ADMIN_ORG
}
