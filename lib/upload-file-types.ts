import { FileSearch, Landmark, type LucideIcon } from "lucide-react"

export type FileTypeCategory = {
  id: string
  label: string
  icon: LucideIcon
}

export type FileTypeOption = {
  value: string
  label: string
  description: string
  category: string
  formats: string[]
}

export const FILE_TYPE_CATEGORIES: FileTypeCategory[] = [
  { id: "inspection", label: "Inspection", icon: FileSearch },
  { id: "national", label: "National data", icon: Landmark },
]

export const FILE_TYPES: FileTypeOption[] = [
  {
    value: "idsr",
    label: "IDSR",
    description: "Inspection Data Summary Report",
    category: "inspection",
    formats: ["PDF"],
  },
  {
    value: "national",
    label: "National data",
    description: "DfE national comparison datasets",
    category: "national",
    formats: ["CSV", "XLSX"],
  },
]

export const TILE_LAYOUT_LIMIT = 8

export function categoryFor(id: string) {
  return FILE_TYPE_CATEGORIES.find((c) => c.id === id)
}
