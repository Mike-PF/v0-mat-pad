"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { isPlatformAdmin } from "@/lib/current-org"
import { Palette, Type, MousePointerClick, Tag, FormInput, Layers, Check, Copy, Lock, Square, Ban } from "lucide-react"

const NAVY = "#121051"
const MAGENTA = "#B30089"

type Swatch = { name: string; value: string; note?: string; textLight?: boolean }

const brandColors: Swatch[] = [
  { name: "Brand Navy", value: "#121051", note: "Primary actions, headings, active states", textLight: true },
  { name: "Navy Hover", value: "#0F0D42", note: "Primary button hover", textLight: true },
  { name: "Navy Deep", value: "#0E0C3E", note: "Sidebar accents", textLight: true },
  { name: "Brand Magenta", value: "#B30089", note: "Secondary brand, AI/help, toggles", textLight: true },
  { name: "Magenta Hover", value: "#8A006A", note: "Magenta hover state", textLight: true },
]

const neutralColors: Swatch[] = [
  { name: "slate-50", value: "#F8FAFC", note: "Page background" },
  { name: "slate-100", value: "#F1F5F9", note: "Subtle fills, chips" },
  { name: "slate-200", value: "#E2E8F0", note: "Borders, dividers" },
  { name: "slate-300", value: "#CBD5E1", note: "Input borders, scrollbar" },
  { name: "slate-400", value: "#94A3B8", note: "Disabled, placeholder icons", textLight: true },
  { name: "slate-500", value: "#64748B", note: "Secondary text", textLight: true },
  { name: "slate-700", value: "#334155", note: "Body text", textLight: true },
  { name: "slate-900", value: "#0F172A", note: "Headings", textLight: true },
]

const statusColors: Swatch[] = [
  { name: "Success", value: "#4A7C44", note: "Toast success background", textLight: true },
  { name: "Error", value: "#8B3A2F", note: "Toast error background", textLight: true },
  { name: "Warning", value: "#B8862A", note: "Toast warning background", textLight: true },
  { name: "Destructive", value: "#EF4444", note: "Delete / destructive actions", textLight: true },
]

const categoryColors: Swatch[] = [
  { name: "Blue", value: "#5B9BF5", textLight: true },
  { name: "Purple", value: "#715DBF", textLight: true },
  { name: "Magenta", value: "#B3008B", textLight: true },
  { name: "Orange", value: "#F79400", textLight: true },
  { name: "Green", value: "#5BBE80", textLight: true },
  { name: "Teal", value: "#2395A4", textLight: true },
  { name: "Light Teal", value: "#6AD0D5" },
  { name: "Red", value: "#F7555A", textLight: true },
]

const semanticTokens = [
  { token: "--background", hsl: "0 0% 100%", usage: "App / card background" },
  { token: "--foreground", hsl: "222.2 84% 4.9%", usage: "Primary text" },
  { token: "--primary", hsl: "248 83% 17%", usage: "Brand navy (buttons, ring)" },
  { token: "--primary-foreground", hsl: "210 40% 98%", usage: "Text on primary" },
  { token: "--secondary", hsl: "210 40% 96%", usage: "Secondary surfaces" },
  { token: "--muted", hsl: "210 40% 96%", usage: "Muted surfaces" },
  { token: "--muted-foreground", hsl: "215.4 16.3% 46.9%", usage: "Muted text" },
  { token: "--accent", hsl: "210 40% 96%", usage: "Hover surfaces" },
  { token: "--destructive", hsl: "0 84.2% 60.2%", usage: "Destructive actions" },
  { token: "--border", hsl: "214.3 31.8% 91.4%", usage: "Borders" },
  { token: "--input", hsl: "214.3 31.8% 91.4%", usage: "Input borders" },
  { token: "--ring", hsl: "248 83% 17%", usage: "Focus ring" },
  { token: "--radius", hsl: "0.5rem", usage: "Base corner radius" },
]

const typeScale = [
  { label: "Heading XL", cls: "text-2xl font-bold", sample: "Multi-academy insight" },
  { label: "Heading L", cls: "text-xl font-semibold", sample: "Section heading" },
  { label: "Heading M", cls: "text-lg font-semibold", sample: "Card title" },
  { label: "Body", cls: "text-sm text-slate-700", sample: "Standard body text used across the platform." },
  { label: "Small / meta", cls: "text-xs text-slate-500", sample: "Secondary metadata and helper copy" },
]

const sections = [
  { id: "colours", label: "Colours", icon: Palette },
  { id: "tokens", label: "Theme Tokens", icon: Square },
  { id: "typography", label: "Typography", icon: Type },
  { id: "buttons", label: "Buttons", icon: MousePointerClick },
  { id: "badges", label: "Badges", icon: Tag },
  { id: "forms", label: "Form Controls", icon: FormInput },
  { id: "surfaces", label: "Surfaces & Radius", icon: Layers },
  { id: "iconography", label: "Iconography", icon: Ban },
]

function ColorSwatch({ swatch, onCopy, copied }: { swatch: Swatch; onCopy: (v: string) => void; copied: string | null }) {
  const isCopied = copied === swatch.value
  return (
    <button
      onClick={() => onCopy(swatch.value)}
      className="group text-left rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all"
    >
      <div
        className="h-20 flex items-end justify-end p-2"
        style={{ backgroundColor: swatch.value }}
      >
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
            swatch.textLight ? "bg-white/20 text-white" : "bg-slate-900/10 text-slate-900"
          }`}
        >
          {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {isCopied ? "Copied" : "Copy"}
        </span>
      </div>
      <div className="p-2.5 bg-white">
        <p className="text-sm font-medium text-slate-900">{swatch.name}</p>
        <p className="text-xs font-mono text-slate-500 uppercase">{swatch.value}</p>
        {swatch.note && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{swatch.note}</p>}
      </div>
    </button>
  )
}

function SectionHeading({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${MAGENTA}18` }}>
        <Icon className="w-4.5 h-4.5" style={{ color: MAGENTA }} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 mt-0.5 max-w-2xl">{description}</p>
      </div>
    </div>
  )
}

export default function StyleGuidePage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [demoSwitch, setDemoSwitch] = useState(true)

  const allowed = isPlatformAdmin()

  const handleCopy = (value: string) => {
    navigator.clipboard?.writeText(value)
    setCopied(value)
    setTimeout(() => setCopied(null), 1500)
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  if (!allowed) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <div className="p-4">
            <TopNavigation />
          </div>
          <main className="flex-1 px-4 pb-6 overflow-auto">
            <Card className="bg-white border-slate-200">
              <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-slate-400" />
                </div>
                <h1 className="text-lg font-semibold text-slate-900">Restricted page</h1>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">
                  The developer style guide is only available to the Fuze platform admin organisation.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <main className="flex-1 px-4 pb-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Hero */}
            <Card className="bg-white border-slate-200 overflow-hidden">
              <div className="px-6 py-6" style={{ background: `linear-gradient(90deg, ${NAVY}, ${MAGENTA})` }}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white text-balance">Style Guide</h1>
                    <p className="text-sm text-white/80 mt-0.5 max-w-2xl">
                      The single source of truth for colours, typography, components and patterns. Reference this when
                      building new pages to keep the platform consistent.
                    </p>
                  </div>
                </div>
              </div>
              {/* Section nav */}
              <CardContent className="p-3">
                <div className="flex flex-wrap gap-1.5">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <s.icon className="w-3.5 h-3.5" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Colours */}
            <Card id="colours" className="bg-white border-slate-200 scroll-mt-4">
              <CardContent className="p-6">
                <SectionHeading
                  icon={Palette}
                  title="Colours"
                  description="Click any swatch to copy its hex value. Brand colours drive primary actions and identity; neutrals form the slate-based UI foundation."
                />

                <h3 className="text-sm font-semibold text-slate-700 mb-3">Brand</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                  {brandColors.map((s) => (
                    <ColorSwatch key={s.value + s.name} swatch={s} onCopy={handleCopy} copied={copied} />
                  ))}
                </div>

                <div className="rounded-lg border border-slate-200 p-4 mb-6">
                  <p className="text-sm font-medium text-slate-900 mb-1">Brand gradient</p>
                  <p className="text-xs text-slate-500 mb-3 font-mono">
                    linear-gradient(90deg, #121051, #B30089)
                  </p>
                  <div className="h-14 rounded-md" style={{ background: `linear-gradient(90deg, ${NAVY}, ${MAGENTA})` }} />
                  <p className="text-xs text-slate-400 mt-2">Used for hero headers, modal banners and the AI assistant.</p>
                </div>

                <h3 className="text-sm font-semibold text-slate-700 mb-3">Neutrals (Slate)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
                  {neutralColors.map((s) => (
                    <ColorSwatch key={s.value + s.name} swatch={s} onCopy={handleCopy} copied={copied} />
                  ))}
                </div>

                <h3 className="text-sm font-semibold text-slate-700 mb-3">Status &amp; Feedback</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {statusColors.map((s) => (
                    <ColorSwatch key={s.value + s.name} swatch={s} onCopy={handleCopy} copied={copied} />
                  ))}
                </div>

                <h3 className="text-sm font-semibold text-slate-700 mb-3">Report Category Palette</h3>
                <p className="text-xs text-slate-500 mb-3">
                  Rotating accent colours for report categories, charts and data visualisations.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {categoryColors.map((s) => (
                    <ColorSwatch key={s.value + s.name} swatch={s} onCopy={handleCopy} copied={copied} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Theme tokens */}
            <Card id="tokens" className="bg-white border-slate-200 scroll-mt-4">
              <CardContent className="p-6">
                <SectionHeading
                  icon={Square}
                  title="Theme Tokens"
                  description="Semantic CSS variables (defined in globals.css) power shadcn/ui components. Prefer these tokens over hard-coded colours so theming stays consistent."
                />
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-4 py-2.5 font-medium">Token</th>
                        <th className="px-4 py-2.5 font-medium">Value (HSL)</th>
                        <th className="px-4 py-2.5 font-medium">Tailwind class</th>
                        <th className="px-4 py-2.5 font-medium">Usage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {semanticTokens.map((t) => (
                        <tr key={t.token} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 font-mono text-xs text-slate-900">{t.token}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{t.hsl}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-slate-500">
                            {t.token.replace("--", "").replace("radius", "rounded-lg")}
                          </td>
                          <td className="px-4 py-2.5 text-slate-600">{t.usage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Typography */}
            <Card id="typography" className="bg-white border-slate-200 scroll-mt-4">
              <CardContent className="p-6">
                <SectionHeading
                  icon={Type}
                  title="Typography"
                  description="Poppins is the primary sans-serif typeface; JetBrains Mono is used for code and hex values. Body line-height stays relaxed for readability."
                />
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Sans — font-sans</p>
                    <p className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-poppins)" }}>Poppins</p>
                    <p className="text-xs text-slate-500 mt-2">Weights: 300 · 400 · 500 · 600 · 700</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-slate-700">
                      <span className="font-light">Light</span>
                      <span className="font-normal">Regular</span>
                      <span className="font-medium">Medium</span>
                      <span className="font-semibold">Semibold</span>
                      <span className="font-bold">Bold</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Mono — font-mono</p>
                    <p className="text-2xl text-slate-900 font-mono">JetBrains Mono</p>
                    <p className="text-xs text-slate-500 mt-2 font-mono">#121051 · const value = 42;</p>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
                  {typeScale.map((t) => (
                    <div key={t.label} className="flex items-baseline gap-4 px-4 py-3">
                      <span className="w-28 shrink-0 text-xs text-slate-400">{t.label}</span>
                      <span className={t.cls}>{t.sample}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Buttons */}
            <Card id="buttons" className="bg-white border-slate-200 scroll-mt-4">
              <CardContent className="p-6">
                <SectionHeading
                  icon={MousePointerClick}
                  title="Buttons"
                  description="Primary actions use the brand navy. Use variants for hierarchy: default for the main action, outline/secondary for supporting actions, ghost for low-emphasis."
                />
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">Variants</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button className="text-white" style={{ backgroundColor: NAVY }}>Primary (navy)</Button>
                      <Button className="text-white" style={{ backgroundColor: MAGENTA }}>Brand magenta</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">Sizes</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="sm" className="text-white" style={{ backgroundColor: NAVY }}>Small</Button>
                      <Button size="default" className="text-white" style={{ backgroundColor: NAVY }}>Default</Button>
                      <Button size="lg" className="text-white" style={{ backgroundColor: NAVY }}>Large</Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">States</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button className="text-white" style={{ backgroundColor: NAVY }}>Default</Button>
                      <Button disabled className="text-white" style={{ backgroundColor: NAVY }}>Disabled</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card id="badges" className="bg-white border-slate-200 scroll-mt-4">
              <CardContent className="p-6">
                <SectionHeading
                  icon={Tag}
                  title="Badges & Tags"
                  description="Small status indicators. Use semantic variants for system states, and coloured pill tags for inline labels like NEW, URGENT or ACTIVE."
                />
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">Variants</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">Inline status pills</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500 text-white rounded">NEW</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-500 text-white rounded">URGENT</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500 text-white rounded">ACTIVE</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#121051]/10 text-[#121051]">System</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form controls */}
            <Card id="forms" className="bg-white border-slate-200 scroll-mt-4">
              <CardContent className="p-6">
                <SectionHeading
                  icon={FormInput}
                  title="Form Controls"
                  description="Inputs, selects and switches. Mark mandatory fields with a red asterisk; active toggles use brand navy across settings pages."
                />
                <div className="grid md:grid-cols-2 gap-5 max-w-3xl">
                  <div className="space-y-2">
                    <Label htmlFor="sg-input">
                      Text input<span className="text-red-500">*</span>
                    </Label>
                    <Input id="sg-input" placeholder="Placeholder text" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sg-select">Select</Label>
                    <Select>
                      <SelectTrigger id="sg-select">
                        <SelectValue placeholder="Choose an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one">Option one</SelectItem>
                        <SelectItem value="two">Option two</SelectItem>
                        <SelectItem value="three">Option three</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sg-disabled">Disabled input</Label>
                    <Input id="sg-disabled" placeholder="Unavailable" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Toggle (active = navy)</Label>
                    <div className="flex items-center gap-3 h-10">
                      <Switch checked={demoSwitch} onCheckedChange={setDemoSwitch} />
                      <span className="text-sm text-slate-600">{demoSwitch ? "On" : "Off"}</span>
                      <Switch className="ml-4" defaultChecked />
                      <span className="text-sm text-slate-400">Always navy — never pink</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Surfaces & radius */}
            <Card id="surfaces" className="bg-white border-slate-200 scroll-mt-4">
              <CardContent className="p-6">
                <SectionHeading
                  icon={Layers}
                  title="Surfaces & Radius"
                  description="Cards sit on a slate-50 background with white surfaces, slate-200 borders and a base radius of 0.5rem (rounded-lg)."
                />
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="rounded-md border border-slate-200 bg-white p-4">
                    <div className="h-10 rounded-md bg-slate-100 mb-3" />
                    <p className="text-sm font-medium text-slate-900">rounded-md</p>
                    <p className="text-xs text-slate-500 font-mono">calc(0.5rem - 2px)</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="h-10 rounded-lg bg-slate-100 mb-3" />
                    <p className="text-sm font-medium text-slate-900">rounded-lg</p>
                    <p className="text-xs text-slate-500 font-mono">0.5rem (base)</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="h-10 rounded-full bg-slate-100 mb-3" />
                    <p className="text-sm font-medium text-slate-900">rounded-full + shadow-sm</p>
                    <p className="text-xs text-slate-500 font-mono">Pills, avatars, FAB</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 mt-4">
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-sm font-medium text-slate-900 mb-1">No elevation</p>
                    <p className="text-xs text-slate-500">Default cards — border only</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-medium text-slate-900 mb-1">shadow-sm</p>
                    <p className="text-xs text-slate-500">Hover / raised surfaces</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
                    <p className="text-sm font-medium text-slate-900 mb-1">shadow-lg</p>
                    <p className="text-xs text-slate-500">Modals, popovers, FAB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Iconography */}
            <Card id="iconography" className="bg-white border-slate-200 scroll-mt-4">
              <CardContent className="p-6">
                <SectionHeading
                  icon={Ban}
                  title="Iconography"
                  description="Keep the interface clean and text-led. Do not add decorative icons to new pages or components."
                />
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-5">
                  <p className="text-sm font-semibold text-red-800 mb-1">Rule: no decorative icons</p>
                  <p className="text-sm text-red-700 leading-relaxed">
                    Do not add icons going forward — no coloured icon tiles next to list items, no leading icons on
                    rows, cards, suggestions or table cells, and no purely decorative glyphs. Lead with clear text
                    labels instead. This keeps screens uncluttered and consistent across the platform.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs uppercase tracking-wide text-green-600 font-semibold mb-2">Do</p>
                    <ul className="space-y-1.5 text-sm text-slate-600 leading-relaxed">
                      <li>Use text labels and badges to convey type or status.</li>
                      <li>Rely on spacing, weight and colour for hierarchy.</li>
                      <li>Keep list rows and cards icon-free.</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs uppercase tracking-wide text-red-600 font-semibold mb-2">Don&apos;t</p>
                    <ul className="space-y-1.5 text-sm text-slate-600 leading-relaxed">
                      <li>Add coloured icon squares beside item names.</li>
                      <li>Prefix suggestions or menu rows with glyphs.</li>
                      <li>Introduce new decorative icons to fill space.</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                  Note: small functional controls that are clearly understood (e.g. a delete action or a search field
                  affordance) may keep their icon where it aids usability — the rule targets decorative and
                  category/type icons.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
