import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to main forms page
  redirect("/forms")
}
