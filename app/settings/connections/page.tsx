"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Pencil, Lock } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

// Credentials data for systems like Safesmart
const credentialsConnections: Record<string, Array<{
  id: string
  username: string
  password: string
  orgCode: string
  active: boolean
}>> = {
  safesmart: [
    { id: "1", username: "Gareth Heggie", password: "**********", orgCode: "STJOMAT", active: true },
    { id: "2", username: "Gareth Heggie", password: "**********", orgCode: "STJOMAT", active: true },
  ],
}

// SAMpeople-specific credentials with domain and baseUrl
const sampeopleConnections: Array<{
  id: string
  username: string
  password: string
  domain: string
  baseUrl: string
  active: boolean
}> = [
  { id: "1", username: "FEPS_BI$uk_group_118205", password: "**********", domain: "[ARBOR_DATA_CONNECTOR_PRODUCTION]", baseUrl: "xs48132.eu-west-2.aws.snowflakecomputing", active: true },
]

// WeAreEvery credentials (simple username/password)
const weareeveryConnections: Array<{
  id: string
  username: string
  password: string
  active: boolean
}> = [
  { id: "1", username: "support@pixel-fusion.com", password: "**********", active: true },
]

// Wonde connections (URN, Organisation Name, connected status)
const wondeConnections: Array<{
  urn: string
  organisationName: string
  connected: boolean
}> = [
  { urn: "149032", organisationName: "Blessed Carlo Acutis Catholic and Church of England Academy", connected: true },
  { urn: "149190", organisationName: "Holy Family Catholic Academy", connected: true },
  { urn: "149029", organisationName: "Holy Spirit Catholic Academy", connected: false },
  { urn: "150373", organisationName: "Notre Dame Catholic Academy", connected: false },
  { urn: "149133", organisationName: "St Ambrose Catholic Academy", connected: false },
  { urn: "149031", organisationName: "St Augustine of Canterbury Catholic Academy", connected: false },
  { urn: "150713", organisationName: "St Francis Xavier's Catholic Academy", connected: false },
  { urn: "149132", organisationName: "St Nicholas Catholic Academy", connected: false },
  { urn: "149134", organisationName: "The Trinity Catholic Academy", connected: false },
]

// CPOMS storage connection
const cpomsStorageConnection = {
  tenant: "sjc",
  storageAccountName: "insightukprodclientdata",
  containerName: "insight-data-f01fb0d6-e012-45c1-9f9f-d45",
  sasToken: "**********",
}

// CPOMS school links
const cpomsSchoolLinks: Array<{
  slug: string
  currentLink: string
  linkedSchool: string
}> = [
  { slug: "cpoms_francisxavier", currentLink: "-", linkedSchool: "" },
  { slug: "cpoms_holyfamilyplattbridge", currentLink: "-", linkedSchool: "" },
  { slug: "cpoms_holyspiritsefton", currentLink: "-", linkedSchool: "" },
  { slug: "cpoms_notredamecc", currentLink: "-", linkedSchool: "" },
  { slug: "cpoms_stambrosepri", currentLink: "-", linkedSchool: "" },
  { slug: "cpoms_staugs", currentLink: "-", linkedSchool: "" },
  { slug: "cpoms_stchadshigh", currentLink: "-", linkedSchool: "" },
  { slug: "cpoms_stcharlesliverpool", currentLink: "-", linkedSchool: "" },
  { slug: "cpoms_stnicholascps", currentLink: "-", linkedSchool: "" },
]

// SISRA connections
const sisraConnections: Array<{
  urn: string
  schoolName: string
  connectionStatus: string
  verified: boolean
  lastRun: string
  username: string
  password: string
  enabled: boolean
}> = [
  { urn: "149032", schoolName: "Blessed Carlo Acutis Catholic and Church of England Academy", connectionStatus: "Login details are incorrect", verified: false, lastRun: "Error 24/02/2026, 11:28:59", username: "heggar372216", password: "", enabled: false },
  { urn: "150373", schoolName: "Notre Dame Catholic Academy", connectionStatus: "-", verified: true, lastRun: "-", username: "heggar372215", password: "**********", enabled: true },
  { urn: "149031", schoolName: "St Augustine of Canterbury Catholic Academy", connectionStatus: "-", verified: true, lastRun: "-", username: "heggar372214", password: "**********", enabled: true },
  { urn: "150713", schoolName: "St Francis Xavier's Catholic Academy", connectionStatus: "Login details are incorrect", verified: true, lastRun: "Error 24/02/2026, 09:25:19", username: "heggar367840", password: "**********", enabled: true },
]

// SISRA datasets for each school (by URN)
const sisraDatasets: Record<string, Array<{
  id: string
  academicYear: string
  datasetName: string
  schoolName: string
  getDatasets: boolean
  yearTab: string
}>> = {
  "149031": [
    { id: "1", academicYear: "24/25 - Year 11 Data", datasetName: "KS4 Targets", schoolName: "St Augustine Of Canterbury Catholic Academy", getDatasets: true, yearTab: "24/25 (Y11)" },
    { id: "2", academicYear: "24/25 - Year 11 Data", datasetName: "SPI Targets", schoolName: "St Augustine Of Canterbury Catholic Academy", getDatasets: false, yearTab: "24/25 (Y11)" },
    { id: "3", academicYear: "24/25 - Year 10 Data", datasetName: "Y10 Autumn Current", schoolName: "St Augustine Of Canterbury Catholic Academy", getDatasets: false, yearTab: "24/25 (Y11)" },
    { id: "4", academicYear: "24/25 - Year 10 Data", datasetName: "Y10 Autumn Predicted", schoolName: "St Augustine Of Canterbury Catholic Academy", getDatasets: false, yearTab: "24/25 (Y11)" },
    { id: "5", academicYear: "24/25 - Year 10 Data", datasetName: "Y10 Summer Current", schoolName: "St Augustine Of Canterbury Catholic Academy", getDatasets: false, yearTab: "24/25 (Y11)" },
    { id: "6", academicYear: "24/25 - Year 10 Data", datasetName: "Y10 Summer Predicted", schoolName: "St Augustine Of Canterbury Catholic Academy", getDatasets: false, yearTab: "24/25 (Y11)" },
    { id: "7", academicYear: "24/25 - Year 11 Data", datasetName: "Y11 Autumn Current", schoolName: "St Augustine Of Canterbury Catholic Academy", getDatasets: false, yearTab: "24/25 (Y11)" },
    { id: "8", academicYear: "25/26 - Year 10 Data", datasetName: "Y10 Targets", schoolName: "St Augustine Of Canterbury Catholic Academy", getDatasets: false, yearTab: "25/26 (Y10)" },
    { id: "9", academicYear: "23/24 - Year 11 Data", datasetName: "Final Results", schoolName: "St Augustine Of Canterbury Catholic Academy", getDatasets: false, yearTab: "23/24 (Leavers)" },
    { id: "10", academicYear: "22/23 - Year 11 Data", datasetName: "Final Results", schoolName: "St Augustine Of Canterbury Catholic Academy", getDatasets: false, yearTab: "22/23 (Leavers)" },
  ],
  "150373": [
    { id: "1", academicYear: "24/25 - Year 11 Data", datasetName: "KS4 Targets", schoolName: "Notre Dame Catholic Academy", getDatasets: false, yearTab: "24/25 (Y11)" },
    { id: "2", academicYear: "24/25 - Year 11 Data", datasetName: "SPI Targets", schoolName: "Notre Dame Catholic Academy", getDatasets: false, yearTab: "24/25 (Y11)" },
  ],
  "150713": [
    { id: "1", academicYear: "24/25 - Year 11 Data", datasetName: "KS4 Targets", schoolName: "St Francis Xavier's Catholic Academy", getDatasets: false, yearTab: "24/25 (Y11)" },
  ],
}

const sisraYearTabs = ["24/25 (Y11)", "25/26 (Y10)", "23/24 (Leavers)", "22/23 (Leavers)"]

// Available schools for linking dropdown
const availableSchools = [
  { urn: "149032", name: "Blessed Carlo Acutis Catholic and Church of England Academy" },
  { urn: "149190", name: "Holy Family Catholic Academy" },
  { urn: "149029", name: "Holy Spirit Catholic Academy" },
  { urn: "150373", name: "Notre Dame Catholic Academy" },
  { urn: "149133", name: "St Ambrose Catholic Academy" },
  { urn: "149031", name: "St Augustine of Canterbury Catholic Academy" },
  { urn: "150713", name: "St Francis Xavier's Catholic Academy" },
  { urn: "149132", name: "St Nicholas Catholic Academy" },
  { urn: "149134", name: "The Trinity Catholic Academy" },
]

// Mock school data for each system
const schoolConnections: Record<string, Array<{
  urn: string
  schoolName: string
  status: "connected" | "no-connection"
  domain: string
  apiKey: string
  active: boolean
}>> = {
  arbor: [
    { urn: "149032", schoolName: "Blessed Carlo Acutis Catholic and Church of England Academy", status: "no-connection", domain: "https://...", apiKey: "", active: false },
    { urn: "149190", schoolName: "Holy Family Catholic Academy", status: "connected", domain: "https://holy-family.uk.arbor.sc/grap", apiKey: "**********", active: true },
    { urn: "149029", schoolName: "Holy Spirit Catholic Academy", status: "connected", domain: "https://holy-spirit-catholic-acaden", apiKey: "**********", active: true },
    { urn: "150373", schoolName: "Notre Dame Catholic Academy", status: "connected", domain: "https://notre-dame-catholic-colleg", apiKey: "**********", active: true },
    { urn: "149133", schoolName: "St Ambrose Catholic Academy", status: "connected", domain: "https://st-ambrose-catholic-acade", apiKey: "**********", active: true },
    { urn: "149031", schoolName: "St Augustine of Canterbury Catholic Academy", status: "connected", domain: "https://staugs.uk.arbor.sc/graphql/...", apiKey: "", active: true },
    { urn: "150713", schoolName: "St Francis Xavier's Catholic Academy", status: "connected", domain: "https://st-francis-xaviers-college.u", apiKey: "**********", active: true },
    { urn: "149132", schoolName: "St Nicholas Catholic Academy", status: "connected", domain: "https://st-nicholas-catholic-primar", apiKey: "**********", active: true },
    { urn: "149134", schoolName: "The Trinity Catholic Academy", status: "connected", domain: "https://the-trinity-catholic-primary", apiKey: "**********", active: true },
  ],
  bromcom: [
    { urn: "149032", schoolName: "Blessed Carlo Acutis Catholic and Church of England Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "149190", schoolName: "Holy Family Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "149029", schoolName: "Holy Spirit Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "150373", schoolName: "Notre Dame Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "149133", schoolName: "St Ambrose Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "149031", schoolName: "St Augustine of Canterbury Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "150713", schoolName: "St Francis Xavier's Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "149132", schoolName: "St Nicholas Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "149134", schoolName: "The Trinity Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
  ],
  cpoms: [
    { urn: "149001", schoolName: "St Mary's Primary School", status: "connected", domain: "https://stmarys.cpoms.net", apiKey: "**********", active: true },
    { urn: "149002", schoolName: "Sacred Heart Academy", status: "connected", domain: "https://sacredheart.cpoms.net", apiKey: "**********", active: true },
  ],
  evolve: [
    { urn: "149032", schoolName: "Blessed Carlo Acutis Catholic and Church of England Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "149190", schoolName: "Holy Family Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "149029", schoolName: "Holy Spirit Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "150373", schoolName: "Notre Dame Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "149133", schoolName: "St Ambrose Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "149031", schoolName: "St Augustine of Canterbury Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "150713", schoolName: "St Francis Xavier's Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "149132", schoolName: "St Nicholas Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "149134", schoolName: "The Trinity Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
  ],
  safesmart: [
    { urn: "149001", schoolName: "St Mary's Primary School", status: "connected", domain: "https://stmarys.safesmart.co.uk", apiKey: "**********", active: true },
  ],
  sampeople: [
    { urn: "149001", schoolName: "St Mary's Primary School", status: "connected", domain: "https://stmarys.sampeople.com", apiKey: "**********", active: true },
  ],
  sisra: [
    { urn: "149001", schoolName: "St Mary's Primary School", status: "connected", domain: "https://stmarys.sisra.com", apiKey: "**********", active: true },
  ],
  weareevery: [
    { urn: "149001", schoolName: "St Mary's Primary School", status: "connected", domain: "https://stmarys.every.education", apiKey: "**********", active: true },
  ],
  wonde: [
    { urn: "149001", schoolName: "St Mary's Primary School", status: "connected", domain: "https://stmarys.wonde.com", apiKey: "**********", active: true },
  ],
}

// System-specific configuration for modal display
const systemConfig: Record<string, {
  columns: "standard" | "simple" | "credentials" | "sampeople" | "weareevery" | "wonde" | "cpoms" | "sisra"
  idFieldName: string
  idPlaceholder: string
  brandColor: string
}> = {
  arbor: { columns: "standard", idFieldName: "Arbor Domain", idPlaceholder: "https://...", brandColor: "#121051" },
  bromcom: { columns: "simple", idFieldName: "Bromcom School ID", idPlaceholder: "e.g. 11504", brandColor: "#121051" },
  cpoms: { columns: "cpoms", idFieldName: "", idPlaceholder: "", brandColor: "#121051" },
  evolve: { columns: "simple", idFieldName: "API Key", idPlaceholder: "", brandColor: "#121051" },
  safesmart: { columns: "credentials", idFieldName: "", idPlaceholder: "", brandColor: "#121051" },
  sampeople: { columns: "sampeople", idFieldName: "", idPlaceholder: "", brandColor: "#121051" },
  sisra: { columns: "sisra", idFieldName: "", idPlaceholder: "", brandColor: "#121051" },
  weareevery: { columns: "weareevery", idFieldName: "", idPlaceholder: "", brandColor: "#121051" },
  wonde: { columns: "wonde", idFieldName: "", idPlaceholder: "", brandColor: "#121051" },
}

const systems = [
  {
    id: "arbor",
    name: "Arbor",
    logoImage: "/images/logos/arbor.png",
    description: "Make informed decisions with Arbor's cloud-based MIS, providing instant access to real-time student data. Monitor attendance, track academic progress, and analyse trends across your school, all from a single, intuitive dashboard."
  },
  {
    id: "bromcom",
    name: "Bromcom",
    logoImage: "/images/logos/bromcom.png",
    description: "Connect to Bromcom to synchronise attendance, student, and mark records using a secure, read-only data flow."
  },
  {
    id: "cpoms",
    name: "CPOMS",
    logoImage: "/images/logos/cpoms.png",
    description: "CPOMS (Child Protection Online Management System) is a safeguarding, wellbeing and pastoral case-management platform used by schools and trusts to securely record concerns, build chronologies, manage cases and support coordinated safeguarding action."
  },
  {
    id: "evolve",
    name: "Evolve",
    logoImage: "/images/logos/evolve.png",
    description: "Gain full visibility over school trips and activities with Evolve's data-driven management system. Track approvals, risk assessments, and communication logs in one centralised platform, ensuring clear oversight and compliance at every stage."
  },
  {
    id: "safesmart",
    name: "Safesmart",
    logoImage: "/images/logos/safesmart.png",
    description: "Manage health and safety data with ease using Safesmart. From incident reports to compliance checks, centralise safety records and access key insights to ensure your school meets regulatory standards efficiently."
  },
  {
    id: "sampeople",
    name: "SAMpeople",
    logoImage: "/images/logos/sampeople.png",
    description: "Optimise your school's HR management with SAMpeople, the dedicated platform for tracking staff data, performance, and wellbeing. From absence management to professional development, SAMpeople provides clear insights and streamlined processes to support your team and improve operational efficiency."
  },
  {
    id: "sisra",
    name: "Sisra",
    logoImage: "/images/logos/sisra.png",
    description: "Make time-consuming data analysis a thing of the past with Sisra Analytics, the most flexible data-driven solution for assessments in schools. Bring together student progress, performance and pastoral data across key stages 3, 4 & 5."
  },
  {
    id: "weareevery",
    name: "WeAreEvery",
    logoImage: "/images/logos/every.png",
    description: "Empower your school with Every, the all-in-one platform for managing compliance, HR, and operational data. From tracking staff records to overseeing site management and policies, Every gives you the tools to centralise processes, streamline reporting, and make data-driven decisions with confidence."
  },
  {
    id: "wonde",
    name: "Wonde",
    logoImage: "/images/logos/wonde.png",
    description: "Take control of your school's data with Wonde's secure integration platform. Automate data transfers, manage permissions, and connect to the digital tools you rely on while maintaining data accuracy and security."
  },
]

// Systems allowed per subscription tier
const subscriptionTierAccess = {
  essentials: ["arbor", "bromcom"],
  insight: ["arbor", "bromcom", "cpoms", "sampeople"],
  enterprise: ["arbor", "bromcom", "cpoms", "sampeople", "weareevery", "sisra", "wonde", "evolve", "safesmart"],
}

export default function ConnectionsPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [activeSubscription, setActiveSubscription] = useState<"essentials" | "insight" | "enterprise">("essentials")
  const [selectedSystem, setSelectedSystem] = useState<typeof systems[0] | null>(null)

  // Load subscription from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("organisationSubscription")
    console.log("[v0] Connections page loaded, subscription from localStorage:", saved)
    if (saved === "essentials" || saved === "insight" || saved === "enterprise") {
      setActiveSubscription(saved)
      console.log("[v0] Set activeSubscription to:", saved)
    }
  }, [])
  const [connections, setConnections] = useState(schoolConnections)
  const [originalConnections, setOriginalConnections] = useState(schoolConnections)
  const [credentials, setCredentials] = useState(credentialsConnections)
  const [originalCredentials, setOriginalCredentials] = useState(credentialsConnections)
  const [sampeople, setSampeople] = useState(sampeopleConnections)
  const [originalSampeople, setOriginalSampeople] = useState(sampeopleConnections)
  const [weareevery, setWeareevery] = useState(weareeveryConnections)
  const [originalWeareevery, setOriginalWeareevery] = useState(weareeveryConnections)
  const [wonde, setWonde] = useState(wondeConnections)
  const [sisra, setSisra] = useState(sisraConnections)
  const [originalSisra, setOriginalSisra] = useState(sisraConnections)
  const [cpomsStorage, setCpomsStorage] = useState(cpomsStorageConnection)
  const [originalCpomsStorage, setOriginalCpomsStorage] = useState(cpomsStorageConnection)
  const [cpomsLinks, setCpomsLinks] = useState(cpomsSchoolLinks)
  const [originalCpomsLinks, setOriginalCpomsLinks] = useState(cpomsSchoolLinks)
  const [unlinkConfirmation, setUnlinkConfirmation] = useState<{ slug: string; schoolName: string } | null>(null)
  const [sisraDatasetsModal, setSisraDatasetsModal] = useState<{ urn: string; schoolName: string } | null>(null)
  const [sisraDatasetsData, setSisraDatasetsData] = useState(sisraDatasets)
  const [sisraActiveTab, setSisraActiveTab] = useState("24/25 (Y11)")
  const [sisraDatasetSearch, setSisraDatasetSearch] = useState("")

  const handleOpenModal = (system: typeof systems[0]) => {
    setSelectedSystem(system)
    setOriginalConnections(JSON.parse(JSON.stringify(connections)))
    setOriginalCredentials(JSON.parse(JSON.stringify(credentials)))
    setOriginalSampeople(JSON.parse(JSON.stringify(sampeople)))
    setOriginalWeareevery(JSON.parse(JSON.stringify(weareevery)))
    setOriginalCpomsStorage(JSON.parse(JSON.stringify(cpomsStorage)))
    setOriginalCpomsLinks(JSON.parse(JSON.stringify(cpomsLinks)))
    setOriginalSisra(JSON.parse(JSON.stringify(sisra)))
  }

  const handleToggleActive = (systemId: string, urn: string) => {
    setConnections(prev => ({
      ...prev,
      [systemId]: prev[systemId].map(school => 
        school.urn === urn ? { ...school, active: !school.active } : school
      )
    }))
  }

  const handleDomainChange = (systemId: string, urn: string, value: string) => {
    setConnections(prev => ({
      ...prev,
      [systemId]: prev[systemId].map(school => 
        school.urn === urn ? { ...school, domain: value } : school
      )
    }))
  }

  const handleApiKeyChange = (systemId: string, urn: string, value: string) => {
    setConnections(prev => ({
      ...prev,
      [systemId]: prev[systemId].map(school => 
        school.urn === urn ? { ...school, apiKey: value } : school
      )
    }))
  }

  // Credentials handlers
  const handleCredentialChange = (systemId: string, id: string, field: string, value: string | boolean) => {
    setCredentials(prev => ({
      ...prev,
      [systemId]: prev[systemId].map(cred => 
        cred.id === id ? { ...cred, [field]: value } : cred
      )
    }))
  }

  const hasCredentialChanges = (systemId: string, id: string) => {
    const current = credentials[systemId]?.find(c => c.id === id)
    const original = originalCredentials[systemId]?.find(c => c.id === id)
    if (!current || !original) return false
    return current.username !== original.username || 
           current.password !== original.password || 
           current.orgCode !== original.orgCode ||
           current.active !== original.active
  }

  const canSaveCredential = (systemId: string, id: string) => {
    const cred = credentials[systemId]?.find(c => c.id === id)
    if (!cred) return false
    const hasValidDetails = cred.username && cred.password && cred.orgCode
    return hasCredentialChanges(systemId, id) && hasValidDetails
  }

  const handleSaveCredential = (systemId: string, id: string) => {
    setOriginalCredentials(prev => ({
      ...prev,
      [systemId]: prev[systemId].map(cred => 
        cred.id === id ? { ...credentials[systemId].find(c => c.id === id)! } : cred
      )
    }))
  }

  // SAMpeople handlers
  const handleSampeopleChange = (id: string, field: string, value: string | boolean) => {
    setSampeople(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const hasSampeopleChanges = (id: string) => {
    const current = sampeople.find(s => s.id === id)
    const original = originalSampeople.find(s => s.id === id)
    if (!current || !original) return false
    return current.username !== original.username || 
           current.password !== original.password || 
           current.domain !== original.domain ||
           current.baseUrl !== original.baseUrl ||
           current.active !== original.active
  }

  const canSaveSampeople = (id: string) => {
    const item = sampeople.find(s => s.id === id)
    if (!item) return false
    const hasValidDetails = item.username && item.password && item.domain && item.baseUrl
    return hasSampeopleChanges(id) && hasValidDetails
  }

  const handleSaveSampeople = (id: string) => {
    setOriginalSampeople(prev => prev.map(item => 
      item.id === id ? { ...sampeople.find(s => s.id === id)! } : item
    ))
  }

  // WeAreEvery handlers
  const handleWeareeveryChange = (id: string, field: string, value: string | boolean) => {
    setWeareevery(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const hasWeareeveryChanges = (id: string) => {
    const current = weareevery.find(w => w.id === id)
    const original = originalWeareevery.find(w => w.id === id)
    if (!current || !original) return false
    return current.username !== original.username || 
           current.password !== original.password || 
           current.active !== original.active
  }

  const canSaveWeareevery = (id: string) => {
    const item = weareevery.find(w => w.id === id)
    if (!item) return false
    const hasValidDetails = item.username && item.password
    return hasWeareeveryChanges(id) && hasValidDetails
  }

  const handleSaveWeareevery = (id: string) => {
    setOriginalWeareevery(prev => prev.map(item => 
      item.id === id ? { ...weareevery.find(w => w.id === id)! } : item
    ))
  }

// Wonde handlers
  const handleWondeConnect = (urn: string) => {
    setWonde(prev => prev.map(item =>
      item.urn === urn ? { ...item, connected: true } : item
    ))
  }

  // SISRA handlers
  const handleSisraChange = (urn: string, field: string, value: string | boolean) => {
    setSisra(prev => prev.map(item =>
      item.urn === urn ? { ...item, [field]: value } : item
    ))
  }

  const hasSisraChanges = (urn: string) => {
    const current = sisra.find(s => s.urn === urn)
    const original = originalSisra.find(s => s.urn === urn)
    if (!current || !original) return false
    return current.username !== original.username ||
           current.password !== original.password ||
           current.enabled !== original.enabled
  }

  const canSaveSisra = (urn: string) => {
    const item = sisra.find(s => s.urn === urn)
    if (!item) return false
    const hasValidDetails = item.username && item.password
    return hasSisraChanges(urn) && hasValidDetails
  }

  const handleSaveSisra = (urn: string) => {
    setOriginalSisra(prev => prev.map(item =>
      item.urn === urn ? { ...sisra.find(s => s.urn === urn)! } : item
    ))
  }

  // SISRA datasets handlers
  const handleOpenSisraDatasets = (urn: string, schoolName: string) => {
    // Only open if the school is enabled (has active connection)
    const school = sisra.find(s => s.urn === urn)
    if (school && school.enabled) {
      setSisraDatasetsModal({ urn, schoolName })
      setSisraActiveTab("24/25 (Y11)")
      setSisraDatasetSearch("")
    }
  }

  const handleCloseSisraDatasets = () => {
    setSisraDatasetsModal(null)
  }

  const handleToggleSisraDataset = (urn: string, datasetId: string, checked: boolean) => {
    setSisraDatasetsData(prev => ({
      ...prev,
      [urn]: prev[urn]?.map(dataset =>
        dataset.id === datasetId ? { ...dataset, getDatasets: checked } : dataset
      ) || []
    }))
  }

  const handleDeleteSisraDataset = (urn: string, datasetId: string) => {
    setSisraDatasetsData(prev => ({
      ...prev,
      [urn]: prev[urn]?.filter(dataset => dataset.id !== datasetId) || []
    }))
  }

  const getFilteredSisraDatasets = (urn: string) => {
    const datasets = sisraDatasetsData[urn] || []
    return datasets.filter(dataset => {
      const matchesTab = dataset.yearTab === sisraActiveTab
      const matchesSearch = sisraDatasetSearch === "" || 
        dataset.datasetName.toLowerCase().includes(sisraDatasetSearch.toLowerCase()) ||
        dataset.academicYear.toLowerCase().includes(sisraDatasetSearch.toLowerCase())
      return matchesTab && matchesSearch
    })
  }
  
  // CPOMS handlers
  const handleCpomsStorageChange = (field: string, value: string) => {
    setCpomsStorage(prev => ({ ...prev, [field]: value }))
  }

  const hasCpomsStorageChanges = () => {
    return cpomsStorage.tenant !== originalCpomsStorage.tenant ||
           cpomsStorage.storageAccountName !== originalCpomsStorage.storageAccountName ||
           cpomsStorage.containerName !== originalCpomsStorage.containerName ||
           cpomsStorage.sasToken !== originalCpomsStorage.sasToken
  }

  const canSaveCpomsStorage = () => {
    const hasValidDetails = cpomsStorage.tenant && cpomsStorage.storageAccountName && 
                            cpomsStorage.containerName && cpomsStorage.sasToken
    return hasCpomsStorageChanges() && hasValidDetails
  }

  const handleSaveCpomsStorage = () => {
    setOriginalCpomsStorage(JSON.parse(JSON.stringify(cpomsStorage)))
  }

  const handleCpomsLinkChange = (slug: string, linkedSchool: string) => {
    setCpomsLinks(prev => prev.map(link => 
      link.slug === slug ? { ...link, linkedSchool } : link
    ))
  }

  const hasCpomsLinkChanges = (slug: string) => {
    const current = cpomsLinks.find(l => l.slug === slug)
    const original = originalCpomsLinks.find(l => l.slug === slug)
    if (!current || !original) return false
    return current.linkedSchool !== original.linkedSchool
  }

  const canSaveCpomsLink = (slug: string) => {
    const link = cpomsLinks.find(l => l.slug === slug)
    if (!link) return false
    return hasCpomsLinkChanges(slug) && link.linkedSchool !== ""
  }

  const handleSaveCpomsLink = (slug: string) => {
    const link = cpomsLinks.find(l => l.slug === slug)
    if (link) {
      setOriginalCpomsLinks(prev => prev.map(l => 
        l.slug === slug ? { ...l, linkedSchool: link.linkedSchool, currentLink: link.linkedSchool } : l
      ))
      setCpomsLinks(prev => prev.map(l => 
        l.slug === slug ? { ...l, currentLink: link.linkedSchool } : l
      ))
    }
  }

  const handleUnlinkCpomsClick = (slug: string) => {
    const link = cpomsLinks.find(l => l.slug === slug)
    if (link && link.currentLink !== "-") {
      setUnlinkConfirmation({ slug, schoolName: link.currentLink })
    }
  }

  const handleConfirmUnlink = () => {
    if (unlinkConfirmation) {
      setCpomsLinks(prev => prev.map(link => 
        link.slug === unlinkConfirmation.slug ? { ...link, linkedSchool: "", currentLink: "-" } : link
      ))
      setOriginalCpomsLinks(prev => prev.map(link => 
        link.slug === unlinkConfirmation.slug ? { ...link, linkedSchool: "", currentLink: "-" } : link
      ))
      setUnlinkConfirmation(null)
    }
  }

  const handleCancelUnlink = () => {
    setUnlinkConfirmation(null)
  }

  const canUnlinkCpoms = (slug: string) => {
    const link = cpomsLinks.find(l => l.slug === slug)
    return link && link.currentLink !== "-"
  }

  const getDomainColumnName = (systemName: string) => {
    return `${systemName} Domain`
  }

  const hasChanges = (systemId: string, urn: string) => {
    const current = connections[systemId]?.find(s => s.urn === urn)
    const original = originalConnections[systemId]?.find(s => s.urn === urn)
    if (!current || !original) return false
    return current.domain !== original.domain || 
           current.apiKey !== original.apiKey || 
           current.active !== original.active
  }

  const canSave = (systemId: string, urn: string) => {
    const school = connections[systemId]?.find(s => s.urn === urn)
    if (!school) return false
    
    const config = systemConfig[systemId]
    
    // For simple columns (like Bromcom), only need domain field filled
    if (config?.columns === "simple") {
      const hasValidDetails = school.domain && school.domain !== "" && school.domain !== config.idPlaceholder
      return hasChanges(systemId, urn) && hasValidDetails
    }
    
    // For standard columns, need both domain and API key
    const hasValidDetails = school.domain && school.domain !== "https://..." && school.apiKey && school.apiKey !== ""
    return hasChanges(systemId, urn) && hasValidDetails
  }

  const handleSave = (systemId: string, urn: string) => {
    // Update original to match current (simulating save)
    setOriginalConnections(prev => ({
      ...prev,
      [systemId]: prev[systemId].map(school => 
        school.urn === urn ? { ...connections[systemId].find(s => s.urn === urn)! } : school
      )
    }))
    // Also update status to connected
    setConnections(prev => ({
      ...prev,
      [systemId]: prev[systemId].map(school => 
        school.urn === urn ? { ...school, status: "connected" as const } : school
      )
    }))
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-auto">
          <div className="space-y-2">
            {systems.map((system) => {
              const allowedSystems = subscriptionTierAccess[activeSubscription]
              const isLocked = !allowedSystems.includes(system.id)
              return (
                <div
                  key={system.id}
                  onClick={() => !isLocked && handleOpenModal(system)}
                  className={`flex items-start gap-4 p-4 bg-white border rounded-lg transition-all duration-150 ${
                    isLocked
                      ? "border-slate-200 opacity-50 cursor-not-allowed"
                      : "border-slate-200 hover:shadow-md hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                  }`}
                >
                  <div className="w-24 flex-shrink-0 flex items-center justify-center">
                    {system.logoImage ? (
                      <Image
                        src={system.logoImage}
                        alt={`${system.name} logo`}
                        width={80}
                        height={40}
                        className={`object-contain ${isLocked ? "grayscale" : ""}`}
                      />
                    ) : (
                      <span className={`text-sm font-semibold ${system.logoColor}`}>
                        {system.logoText}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{system.name}</h3>
                      {isLocked && (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" />
                          {activeSubscription === "essentials" ? "Insight or above required" : "Enterprise required"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {system.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Connection Configuration Modal */}
      <Dialog open={!!selectedSystem} onOpenChange={(open) => !open && setSelectedSystem(null)}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedSystem?.logoImage ? (
                <Image
                  src={selectedSystem.logoImage}
                  alt={`${selectedSystem.name} logo`}
                  width={100}
                  height={50}
                  className="object-contain"
                />
              ) : (
                <span className="text-xl font-bold">{selectedSystem?.name}</span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto">
            {/* CPOMS - two sections: storage connection and school links */}
            {selectedSystem && systemConfig[selectedSystem.id]?.columns === "cpoms" ? (
              <div className="space-y-6">
                {/* CPOMS storage connection section */}
                <div>
                  <h3 className="text-center font-semibold text-slate-900 mb-4">CPOMS storage connection</h3>
                  <table className="w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">CPOMS tenant</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Storage account name</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Container name</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">SAS token</th>
                      <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Save</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-2">
                        <Input
                          value={cpomsStorage.tenant}
                          onChange={(e) => handleCpomsStorageChange("tenant", e.target.value)}
                          className="h-8 text-sm w-32"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          value={cpomsStorage.storageAccountName}
                          onChange={(e) => handleCpomsStorageChange("storageAccountName", e.target.value)}
                          className="h-8 text-sm w-48"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          value={cpomsStorage.containerName}
                          onChange={(e) => handleCpomsStorageChange("containerName", e.target.value)}
                          className="h-8 text-sm w-64"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          type="password"
                          value={cpomsStorage.sasToken}
                          onChange={(e) => handleCpomsStorageChange("sasToken", e.target.value)}
                          className="h-8 text-sm w-32"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Button
                          size="sm"
                          disabled={!canSaveCpomsStorage()}
                          onClick={handleSaveCpomsStorage}
                          className={`px-6 ${
                            canSaveCpomsStorage()
                              ? "text-white"
                              : "bg-slate-300 text-slate-500 cursor-not-allowed"
                          }`}
                          style={canSaveCpomsStorage() ? { backgroundColor: "#121051" } : undefined}
                        >
                          Save
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                </div>

                {/* CPOMS school links section */}
                <div>
                  <h3 className="text-center font-semibold text-slate-900 mb-4">CPOMS school links</h3>
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">CPOMS School</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">School</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Linked School</th>
                      <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cpomsLinks.map((link) => (
                      <tr key={link.slug} className="border-b last:border-0">
                        <td className="py-3 px-2 text-sm text-slate-900">{link.slug}</td>
                        <td className="py-3 px-2">
                          <select
                            value={link.linkedSchool}
                            onChange={(e) => handleCpomsLinkChange(link.slug, e.target.value)}
                            className="w-full h-8 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                          >
                            <option value="">-- Unlinked --</option>
                            {availableSchools.map((school) => (
                              <option key={school.urn} value={school.name}>
                                {school.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-2 text-sm text-slate-600">{link.currentLink}</td>
                        <td className="py-3 px-2">
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              disabled={!canSaveCpomsLink(link.slug)}
                              onClick={() => handleSaveCpomsLink(link.slug)}
                              className={`px-6 ${
                                canSaveCpomsLink(link.slug)
                                  ? "text-white"
                                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
                              }`}
                              style={canSaveCpomsLink(link.slug) ? { backgroundColor: "#121051" } : undefined}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!canUnlinkCpoms(link.slug)}
                              onClick={() => handleUnlinkCpomsClick(link.slug)}
                              className={`px-4 ${
                                canUnlinkCpoms(link.slug)
                                  ? "border-slate-300 text-slate-600"
                                  : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                              }`}
                            >
                              Unlink
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : selectedSystem && systemConfig[selectedSystem.id]?.columns === "credentials" ? (
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Username</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Password</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Organisation Code</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Active</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Save</th>
                  </tr>
                </thead>
                <tbody>
                  {credentials[selectedSystem.id]?.map((cred) => (
                    <tr key={cred.id} className="border-b last:border-0">
                      <td className="py-3 px-2">
                        <Input
                          value={cred.username}
                          onChange={(e) => handleCredentialChange(selectedSystem.id, cred.id, "username", e.target.value)}
                          className="h-8 text-sm w-48"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          type="password"
                          value={cred.password}
                          onChange={(e) => handleCredentialChange(selectedSystem.id, cred.id, "password", e.target.value)}
                          className="h-8 text-sm w-48"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          value={cred.orgCode}
                          onChange={(e) => handleCredentialChange(selectedSystem.id, cred.id, "orgCode", e.target.value)}
                          className="h-8 text-sm w-32"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Switch
                          checked={cred.active}
                          onCheckedChange={(checked) => handleCredentialChange(selectedSystem.id, cred.id, "active", checked)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-400"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Button 
                          size="sm" 
                          disabled={!canSaveCredential(selectedSystem.id, cred.id)}
                          onClick={() => handleSaveCredential(selectedSystem.id, cred.id)}
                          className={`px-6 ${
                            canSaveCredential(selectedSystem.id, cred.id)
                              ? "text-white"
                              : "bg-slate-300 text-slate-500 cursor-not-allowed"
                          }`}
                          style={canSaveCredential(selectedSystem.id, cred.id) ? { backgroundColor: "#121051" } : undefined}
                        >
                          Save
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : selectedSystem && systemConfig[selectedSystem.id]?.columns === "sampeople" ? (
              /* SAMpeople credentials table */
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Username</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Password</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Domain</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Base URL</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Active</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Save</th>
                  </tr>
                </thead>
                <tbody>
                  {sampeople.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-3 px-2">
                        <Input
                          value={item.username}
                          onChange={(e) => handleSampeopleChange(item.id, "username", e.target.value)}
                          className="h-8 text-sm w-48"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          type="password"
                          value={item.password}
                          onChange={(e) => handleSampeopleChange(item.id, "password", e.target.value)}
                          className="h-8 text-sm w-36"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          value={item.domain}
                          onChange={(e) => handleSampeopleChange(item.id, "domain", e.target.value)}
                          className="h-8 text-sm w-56"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          value={item.baseUrl}
                          onChange={(e) => handleSampeopleChange(item.id, "baseUrl", e.target.value)}
                          className="h-8 text-sm w-56"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Switch
                          checked={item.active}
                          onCheckedChange={(checked) => handleSampeopleChange(item.id, "active", checked)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-400"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Button 
                          size="sm" 
                          disabled={!canSaveSampeople(item.id)}
                          onClick={() => handleSaveSampeople(item.id)}
                          className={`px-6 ${
                            canSaveSampeople(item.id)
                              ? "text-white"
                              : "bg-slate-300 text-slate-500 cursor-not-allowed"
                          }`}
                          style={canSaveSampeople(item.id) ? { backgroundColor: "#121051" } : undefined}
                        >
                          Save
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : selectedSystem && systemConfig[selectedSystem.id]?.columns === "weareevery" ? (
              /* WeAreEvery credentials table */
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Username</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Password</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Active</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Save</th>
                  </tr>
                </thead>
                <tbody>
                  {weareevery.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-3 px-2">
                        <Input
                          value={item.username}
                          onChange={(e) => handleWeareeveryChange(item.id, "username", e.target.value)}
                          className="h-8 text-sm w-64"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          type="password"
                          value={item.password}
                          onChange={(e) => handleWeareeveryChange(item.id, "password", e.target.value)}
                          className="h-8 text-sm w-64"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Switch
                          checked={item.active}
                          onCheckedChange={(checked) => handleWeareeveryChange(item.id, "active", checked)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-400"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Button 
                          size="sm" 
                          disabled={!canSaveWeareevery(item.id)}
                          onClick={() => handleSaveWeareevery(item.id)}
                          className={`px-6 ${
                            canSaveWeareevery(item.id)
                              ? "text-white"
                              : "bg-slate-300 text-slate-500 cursor-not-allowed"
                          }`}
                          style={canSaveWeareevery(item.id) ? { backgroundColor: "#121051" } : undefined}
                        >
                          Save
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : selectedSystem && systemConfig[selectedSystem.id]?.columns === "sisra" ? (
              /* SISRA table */
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">URN</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">School Name</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Connection Status</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Verified</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Last Run</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">SISRA Username</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">SISRA Password</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Save</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Active</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Data set</th>
                  </tr>
                </thead>
                <tbody>
                  {sisra.map((item) => (
                    <tr key={item.urn} className="border-b last:border-0">
                      <td className="py-3 px-2 text-sm text-slate-600">{item.urn}</td>
                      <td className="py-3 px-2 text-sm text-slate-900">{item.schoolName}</td>
                      <td className="py-3 px-2 text-sm">
                        {item.connectionStatus === "-" ? (
                          <span className="text-slate-600">-</span>
                        ) : (
                          <span className="text-red-500">{item.connectionStatus}</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-sm text-center text-slate-600">
                        {item.verified ? "Yes" : "No"}
                      </td>
                      <td className="py-3 px-2 text-sm">
                        {item.lastRun === "-" ? (
                          <span className="text-slate-600">-</span>
                        ) : (
                          <span className="text-red-500">{item.lastRun}</span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          value={item.username}
                          onChange={(e) => handleSisraChange(item.urn, "username", e.target.value)}
                          className="h-8 text-sm w-32"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          type="password"
                          value={item.password}
                          onChange={(e) => handleSisraChange(item.urn, "password", e.target.value)}
                          placeholder="Password"
                          className="h-8 text-sm w-28"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Button
                          size="sm"
                          disabled={!canSaveSisra(item.urn)}
                          onClick={() => handleSaveSisra(item.urn)}
                          className={`px-6 ${
                            canSaveSisra(item.urn)
                              ? "text-white"
                              : "bg-slate-300 text-slate-500 cursor-not-allowed"
                          }`}
                          style={canSaveSisra(item.urn) ? { backgroundColor: "#121051" } : undefined}
                        >
                          Save
                        </Button>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Switch
                          checked={item.enabled}
                          onCheckedChange={(checked) => handleSisraChange(item.urn, "enabled", checked)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-400"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button 
                          onClick={() => handleOpenSisraDatasets(item.urn, item.schoolName)}
                          className={`${item.enabled ? "text-slate-400 hover:text-slate-600 cursor-pointer" : "text-slate-200 cursor-not-allowed"}`}
                          disabled={!item.enabled}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : selectedSystem && systemConfig[selectedSystem.id]?.columns === "wonde" ? (
              /* Wonde table - URN, Organisation Name, Connect/Edit */
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">URN</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Organisation Name</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Connect/Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {wonde.map((item) => (
                    <tr key={item.urn} className="border-b last:border-0">
                      <td className="py-3 px-2 text-sm text-slate-600">{item.urn}</td>
                      <td className="py-3 px-2 text-sm text-slate-900">{item.organisationName}</td>
                      <td className="py-3 px-2 text-center">
                        {item.connected ? (
                          <Button 
                            variant="outline"
                            size="sm" 
                            className="px-8 border-slate-300 text-slate-600"
                          >
                            Edit
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleWondeConnect(item.urn)}
                            className="px-6 text-white"
                            style={{ backgroundColor: "#121051" }}
                          >
                            Connect
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* Standard/Simple school-based table */
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">URN</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">School Name</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">
                      {selectedSystem ? systemConfig[selectedSystem.id]?.idFieldName : "Domain"}
                    </th>
                    {selectedSystem && systemConfig[selectedSystem.id]?.columns === "standard" && (
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">API Key</th>
                    )}
                    <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Active</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Save</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSystem && connections[selectedSystem.id]?.map((school) => (
                    <tr key={school.urn} className="border-b last:border-0">
                      <td className="py-3 px-2 text-sm text-slate-600">{school.urn}</td>
                      <td className="py-3 px-2 text-sm text-slate-900">{school.schoolName}</td>
                      <td className="py-3 px-2">
                        <span className={`text-sm ${school.status === "connected" ? "text-green-600" : "text-slate-400"}`}>
                          {school.status === "connected" ? "Connected" : "No connection"}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          value={school.domain}
                          onChange={(e) => handleDomainChange(selectedSystem.id, school.urn, e.target.value)}
                          placeholder={systemConfig[selectedSystem.id]?.idPlaceholder || "https://..."}
                          className="h-8 text-sm w-48"
                        />
                      </td>
                      {systemConfig[selectedSystem.id]?.columns === "standard" && (
                        <td className="py-3 px-2">
                          <Input
                            type="password"
                            value={school.apiKey}
                            onChange={(e) => handleApiKeyChange(selectedSystem.id, school.urn, e.target.value)}
                            placeholder="API key"
                            className="h-8 text-sm w-32"
                          />
                        </td>
                      )}
                      <td className="py-3 px-2 text-center">
                        <Switch
                          checked={school.active}
                          onCheckedChange={() => handleToggleActive(selectedSystem.id, school.urn)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-400"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Button 
                          size="sm" 
                          disabled={!canSave(selectedSystem.id, school.urn)}
                          onClick={() => handleSave(selectedSystem.id, school.urn)}
                          className={`px-6 ${
                            canSave(selectedSystem.id, school.urn)
                              ? "text-white"
                              : "bg-slate-300 text-slate-500 cursor-not-allowed"
                          }`}
                          style={canSave(selectedSystem.id, school.urn) ? { backgroundColor: "#121051" } : undefined}
                        >
                          Save
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Unlink Confirmation Modal */}
      <Dialog open={unlinkConfirmation !== null} onOpenChange={(open) => !open && handleCancelUnlink()}>
        <DialogContent className="max-w-md">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Confirm Unlink</h2>
          <div className="py-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to unlink <span className="font-semibold text-slate-900">{unlinkConfirmation?.schoolName}</span>?
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancelUnlink}
              className="px-4"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUnlink}
              className="px-4 text-white"
              style={{ backgroundColor: "#121051" }}
            >
              Unlink
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* SISRA Datasets Modal */}
      <Dialog open={sisraDatasetsModal !== null} onOpenChange={(open) => !open && handleCloseSisraDatasets()}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 flex flex-col">
          <div className="p-6 pb-0">
            <h2 className="text-lg font-semibold text-slate-900">
              SISRA Datasets – {sisraDatasetsModal?.schoolName}
            </h2>
          </div>
          
          {/* Year tabs and search */}
          <div className="px-6 pt-4 flex items-center justify-between border-b">
            <div className="flex">
              {sisraYearTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSisraActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    sisraActiveTab === tab
                      ? "border-[#121051] text-[#121051]"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <Input
              placeholder="Search..."
              value={sisraDatasetSearch}
              onChange={(e) => setSisraDatasetSearch(e.target.value)}
              className="w-48 h-9 mb-2"
            />
          </div>

          <div className="flex-1 overflow-auto px-6 py-4">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b">
                  <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Academic Year</th>
                  <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Dataset Name</th>
                  <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Get Datasets</th>
                  <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Delete</th>
                </tr>
              </thead>
              <tbody>
                {sisraDatasetsModal && getFilteredSisraDatasets(sisraDatasetsModal.urn).map((dataset) => (
                  <tr key={dataset.id} className="border-b last:border-0">
                    <td className="py-3 px-2 text-sm text-slate-600 text-center">{dataset.academicYear}</td>
                    <td className="py-3 px-2 text-sm text-slate-600 text-center">{dataset.datasetName}</td>
                    <td className="py-3 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={dataset.getDatasets}
                        onChange={(e) => handleToggleSisraDataset(sisraDatasetsModal.urn, dataset.id, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 accent-[#121051] focus:ring-[#121051]"
                      />
                    </td>
                    <td className="py-3 px-2 text-center">
                      {dataset.getDatasets ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSisraDataset(sisraDatasetsModal.urn, dataset.id)}
                          className="px-6 border-slate-300 text-slate-600 hover:bg-[#121051] hover:text-white hover:border-[#121051] transition-colors"
                        >
                          Delete
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="px-6 bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Save button at bottom */}
          <div className="px-6 py-4 border-t flex justify-end">
            <Button
              onClick={handleCloseSisraDatasets}
              className="px-6 text-white"
              style={{ backgroundColor: "#121051" }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
