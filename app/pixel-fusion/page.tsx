import { redirect } from "next/navigation"

export default function PixelFusionPage() {
  // Pixel Fusion settings are internal, admin-only tools. Land on the first tab.
  redirect("/pixel-fusion/system-help")
}
