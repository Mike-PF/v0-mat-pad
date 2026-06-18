"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { RAGPicker } from "@/components/ui/rag-picker"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { AttendanceChart } from "@/components/charts/attendance-chart"
import { AssessmentTable } from "@/components/tables/assessment-table"
import { BehaviourData } from "@/components/data/behaviour-data"
import { ChevronDown } from "lucide-react"
import { SuspensionExclusionData } from "@/components/data/suspension-exclusion-data"

interface QuestionSectionProps {
  activeSection: string
  formData: Record<string, any>
  onUpdateData: (questionId: string, value: any) => void
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>
  onSectionChange: (sectionId: string) => void
}

export function QuestionSection({
  activeSection,
  formData,
  onUpdateData,
  sectionRefs,
  onSectionChange,
}: QuestionSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer to track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onSectionChange(entry.target.id)
          }
        })
      },
      { threshold: 0.5, rootMargin: "-100px 0px -100px 0px" },
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [onSectionChange, sectionRefs])

  const sections = [
    {
      id: "academy-vision",
      title: "Academy Vision",
      questions: [
        {
          id: "vision-statement",
          type: "rich-text",
          label: "Please provide your academy's vision statement",
          placeholder: "Enter the academy's vision statement with formatting...",
          required: true,
          info: "Your vision statement should be <strong>clear, inspiring, and specific</strong> to your academy. Include:<br/>• What you aspire to achieve<br/>• Your core values and beliefs<br/>• How you want to impact your pupils and community<br/>• Keep it concise but meaningful (2-3 sentences ideal)<br/><br/><em>Use the rich text editor to format your response with bold text for key phrases.</em>",
        },
        {
          id: "vision-implementation",
          type: "multiline",
          label: "How is this vision implemented across the academy?",
          placeholder: "Describe implementation strategies...",
          info: "Explain the <strong>practical steps</strong> you take to make your vision a reality:<br/>• Specific policies and procedures<br/>• Staff training and development<br/>• Curriculum design decisions<br/>• Community engagement activities<br/>• How you measure success<br/><br/>Provide <em>concrete examples</em> rather than general statements.",
        },
        {
          id: "vision-effectiveness",
          type: "rag",
          label: "Rate the effectiveness of your vision implementation",
          required: true,
          info: "Use the RAG rating system to assess how well you're implementing your vision:<br/><br/><strong>🔴 Red:</strong> Vision is not effectively embedded; limited evidence of impact<br/><strong>🟡 Amber:</strong> Vision is partially implemented with some evidence of impact<br/><strong>🟢 Green:</strong> Vision is fully embedded and driving positive outcomes across the academy",
        },
      ],
    },
    {
      id: "introduction",
      title: "Introduction to the Report",
      questions: [
        {
          id: "school-context",
          type: "rich-text",
          label: "Provide context about your school (size, demographics, challenges)",
          placeholder: "Describe the school context, pupil demographics, and key challenges...",
          required: true,
          info: "Paint a clear picture of your school's context including:<br/>• <strong>Size:</strong> Number of pupils, classes, year groups<br/>• <strong>Demographics:</strong> Pupil premium %, EAL %, SEND %<br/>• <strong>Socio-economic context:</strong> Local area characteristics<br/>• <strong>Key challenges:</strong> Specific issues your school faces<br/>• <strong>Unique features:</strong> What makes your school distinctive<br/><br/>This helps readers understand your school's starting point and context for achievements.",
        },
        {
          id: "report-period",
          type: "single-line",
          label: "Reporting period",
          placeholder: "e.g., September 2024 - July 2025",
          info: "Specify the exact time period this report covers. Typically this would be:<br/>• A full academic year (September to July)<br/>• A specific term or half-term<br/>• A calendar year<br/><br/>Format: <strong>Month Year - Month Year</strong>",
        },
        {
          id: "school-type",
          type: "dropdown",
          label: "School Type",
          options: ["Primary Academy", "Secondary Academy", "All-Through Academy", "Special Academy"],
          required: true,
          info: "Select your school's official designation:<br/><br/><strong>Primary Academy:</strong> Ages 4-11<br/><strong>Secondary Academy:</strong> Ages 11-16 or 11-18<br/><strong>All-Through Academy:</strong> Ages 4-16 or 4-18<br/><strong>Special Academy:</strong> For pupils with special educational needs",
        },
        {
          id: "key-achievements",
          type: "multiline",
          label: "Highlight key achievements during this period",
          placeholder: "List significant accomplishments and successes...",
          info: "Focus on your <strong>most significant achievements</strong> during the reporting period:<br/>• Academic improvements and outcomes<br/>• Awards and recognition received<br/>• Successful initiatives or projects<br/>• Positive inspection outcomes<br/>• Community partnerships<br/>• Staff achievements<br/><br/>Be specific and include measurable outcomes where possible.",
        },
      ],
    },
    {
      id: "self-evaluation",
      title: "Self-Evaluation",
      questions: [
        {
          id: "overall-effectiveness",
          type: "dropdown",
          label: "Overall Effectiveness Grade",
          options: ["Outstanding", "Good", "Requires Improvement", "Inadequate"],
          required: true,
          info: "Use Ofsted's four-point grading system:<br/><br/><strong>Outstanding (1):</strong> Exceptional and highly effective<br/><strong>Good (2):</strong> Effective and successful<br/><strong>Requires Improvement (3):</strong> Not yet good enough<br/><strong>Inadequate (4):</strong> Serious weaknesses<br/><br/>Consider all aspects: quality of education, behaviour and attitudes, personal development, leadership and management, and early years (if applicable).",
        },
        {
          id: "overall-effectiveness-rag",
          type: "rag",
          label: "Overall Effectiveness RAG Rating",
          required: true,
          info: "Provide a RAG assessment of your overall effectiveness:<br/><br/><strong>🔴 Red:</strong> Significant concerns, requires immediate action<br/><strong>🟡 Amber:</strong> Some areas of concern, improvement needed<br/><strong>🟢 Green:</strong> Strong performance, meeting or exceeding expectations<br/><br/>This should align with your Ofsted-style grade above.",
        },
        {
          id: "overall-justification",
          type: "rich-text",
          label: "Justify your overall effectiveness grade",
          placeholder: "Provide evidence and reasoning for your self-evaluation...",
          info: "Provide <strong>robust evidence</strong> to support your self-evaluation grade:<br/>• Pupil outcomes and progress data<br/>• Quality of teaching evidence<br/>• Behaviour and safety indicators<br/>• Leadership impact examples<br/>• External validation (inspections, peer reviews)<br/>• Stakeholder feedback<br/><br/>Use <strong>specific data and examples</strong> rather than general statements. Reference national benchmarks where relevant.",
        },
        {
          id: "quality-education-grade",
          type: "dropdown",
          label: "Quality of Education Grade",
          options: ["Outstanding", "Good", "Requires Improvement", "Inadequate"],
          info: "Evaluate the quality of education based on:<br/>• <strong>Intent:</strong> Curriculum design and ambition<br/>• <strong>Implementation:</strong> How well the curriculum is taught<br/>• <strong>Impact:</strong> What pupils achieve and remember<br/><br/>Consider subject knowledge, teaching quality, assessment, and how well the curriculum meets all pupils' needs.",
        },
        {
          id: "quality-education-rag",
          type: "rag",
          label: "Quality of Education RAG Rating",
          info: "RAG rating for curriculum and teaching quality:<br/><br/><strong>🔴 Red:</strong> Curriculum gaps, weak teaching, poor outcomes<br/><strong>🟡 Amber:</strong> Adequate curriculum, inconsistent teaching quality<br/><strong>🟢 Green:</strong> Strong curriculum, consistently good teaching, excellent outcomes",
        },
        {
          id: "behaviour-attitudes-grade",
          type: "dropdown",
          label: "Behaviour and Attitudes Grade",
          options: ["Outstanding", "Good", "Requires Improvement", "Inadequate"],
          info: "Assess behaviour and attitudes considering:<br/>• Pupils' behaviour in lessons and around school<br/>• Attitudes to learning and school<br/>• Attendance and punctuality<br/>• Relationships between pupils and with adults<br/>• Anti-bullying effectiveness<br/>• Exclusion rates and patterns",
        },
        {
          id: "leadership-grade",
          type: "dropdown",
          label: "Leadership and Management Grade",
          options: ["Outstanding", "Good", "Requires Improvement", "Inadequate"],
          info: "Evaluate leadership effectiveness across:<br/>• Vision and strategic direction<br/>• Quality assurance and improvement<br/>• Staff development and wellbeing<br/>• Governance and accountability<br/>• Safeguarding arrangements<br/>• Use of resources and value for money<br/>• Stakeholder engagement",
        },
      ],
    },
    {
      id: "statutory-assessments",
      title: "Statutory Assessments",
      dataComponent: <AssessmentTable />,
      questions: [
        {
          id: "ks2-analysis",
          type: "rich-text",
          label: "Based on the Key Stage 2 results above, provide your analysis of pupil performance",
          placeholder: "Analyze the data trends, strengths, and areas for improvement...",
          required: true,
          info: "Analyze your KS2 data thoroughly:<br/>• <strong>Compare to national averages</strong> and previous years<br/>• Identify <strong>strengths and weaknesses</strong> by subject<br/>• Comment on <strong>progress measures</strong> (value-added)<br/>• Analyze performance of different groups (PP, SEND, EAL)<br/>• Explain any <strong>significant variations</strong><br/>• Reference <strong>contextual factors</strong> that may have influenced results<br/><br/>Use the rich text editor to highlight key statistics in <strong>bold</strong>.",
        },
        {
          id: "ks1-analysis",
          type: "multiline",
          label: "Analyze the Key Stage 1 results and their implications",
          placeholder: "Comment on progress and next steps...",
          info: "For KS1 analysis, focus on:<br/>• Percentage achieving expected standard and greater depth<br/>• Comparison with national figures<br/>• Progress from EYFS baseline<br/>• Phonics screening outcomes<br/>• Implications for KS2 preparation<br/>• Any interventions or support needed",
        },
        {
          id: "phonics-performance",
          type: "single-line",
          label: "Phonics Screening Check pass rate (%)",
          placeholder: "e.g., 85",
          info: "Enter the percentage of Year 1 pupils who met the expected standard in the Phonics Screening Check.<br/><br/><strong>National average is typically around 82%</strong><br/><br/>If you have Year 2 retake data, you may want to mention this in other sections.",
        },
        {
          id: "assessment-quality",
          type: "rag",
          label: "Rate the overall quality of assessment outcomes",
          info: "RAG rating for your statutory assessment performance:<br/><br/><strong>🔴 Red:</strong> Below national average, significant gaps<br/><strong>🟡 Amber:</strong> Around national average, some areas of concern<br/><strong>🟢 Green:</strong> Above national average, strong performance across subjects",
        },
        {
          id: "assessment-actions",
          type: "rich-text",
          label: "What actions are being taken to address areas of underperformance?",
          placeholder: "Describe specific interventions and support strategies...",
          info: "Detail your <strong>improvement strategies</strong>:<br/>• Specific interventions for underperforming groups<br/>• Changes to curriculum or teaching approaches<br/>• Additional support or resources<br/>• Staff training and development<br/>• Monitoring and evaluation plans<br/>• Expected timescales for improvement<br/><br/>Be specific about <em>what, when, who, and how</em> you will measure success.",
        },
      ],
    },
    {
      id: "key-priorities",
      title: "Key Priorities",
      questions: [
        {
          id: "priority-1-title",
          type: "single-line",
          label: "Priority 1 Title",
          placeholder: "e.g., Curriculum Development",
          info: "Give your first key priority a clear, concise title that summarizes the main focus area. Examples:<br/>• Curriculum Development<br/>• Raising Standards in Mathematics<br/>• Improving Attendance<br/>• Staff Wellbeing and Retention",
        },
        {
          id: "priority-1-description",
          type: "rich-text",
          label: "Priority 1 Description and Actions",
          placeholder: "Describe the priority, actions taken, and progress made...",
          info: "For each priority, include:<br/>• <strong>Why</strong> this is a priority (evidence/rationale)<br/>• <strong>What</strong> specific actions you're taking<br/>• <strong>Who</strong> is responsible<br/>• <strong>When</strong> actions will be completed<br/>• <strong>How</strong> you'll measure success<br/>• <strong>Progress</strong> made so far<br/>• <strong>Impact</strong> on pupils/outcomes<br/><br/>Use formatting to make key points stand out.",
        },
        {
          id: "priority-1-rag",
          type: "rag",
          label: "Priority 1 Progress Rating",
          info: "Rate progress on this priority:<br/><br/><strong>🔴 Red:</strong> Limited progress, behind schedule, significant barriers<br/><strong>🟡 Amber:</strong> Some progress made, on track but with challenges<br/><strong>🟢 Green:</strong> Good progress, on or ahead of schedule, positive impact evident",
        },
        {
          id: "priority-2-title",
          type: "single-line",
          label: "Priority 2 Title",
          placeholder: "e.g., Staff Development",
          info: "Second key priority title - should be distinct from Priority 1 and address a different aspect of school improvement.",
        },
        {
          id: "priority-2-description",
          type: "rich-text",
          label: "Priority 2 Description and Actions",
          placeholder: "Describe the priority, actions taken, and progress made...",
          info: "Follow the same structure as Priority 1:<br/>• Rationale and evidence<br/>• Specific actions and responsibilities<br/>• Timescales and success measures<br/>• Progress and impact to date<br/><br/>Ensure this priority complements rather than duplicates Priority 1.",
        },
        {
          id: "priority-2-rag",
          type: "rag",
          label: "Priority 2 Progress Rating",
          info: "Rate progress on Priority 2 using the same criteria as Priority 1. Consider whether progress is consistent across your priorities or if some are advancing faster than others.",
        },
        {
          id: "priority-3-title",
          type: "single-line",
          label: "Priority 3 Title",
          placeholder: "e.g., Student Wellbeing",
          info: "Third key priority - consider focusing on a different area such as pupil wellbeing, community engagement, or operational improvements.",
        },
        {
          id: "priority-3-description",
          type: "rich-text",
          label: "Priority 3 Description and Actions",
          placeholder: "Describe the priority, actions taken, and progress made...",
          info: "Complete the same detailed analysis for Priority 3. Ensure your three priorities together provide a comprehensive improvement strategy for your school.",
        },
        {
          id: "priority-3-rag",
          type: "rag",
          label: "Priority 3 Progress Rating",
          info: "Final priority progress rating. Consider how the three priorities work together and whether the overall RAG profile shows balanced improvement across key areas.",
        },
      ],
    },
    {
      id: "behaviour",
      title: "Behaviour & Attitudes",
      dataComponent: <BehaviourData />,
      questions: [
        {
          id: "behaviour-analysis",
          type: "rich-text",
          label: "Analyze the behaviour data and trends shown above",
          placeholder: "Comment on incident patterns, effectiveness of interventions...",
          required: true,
          info: "Analyze the behaviour data comprehensively:<br/>• <strong>Trends over time</strong> - are incidents increasing/decreasing?<br/>• <strong>Types of incidents</strong> - which are most common?<br/>• <strong>Resolution rates</strong> - how effectively are issues addressed?<br/>• <strong>Repeat offenders</strong> - patterns in individual pupils<br/>• <strong>Hotspots</strong> - times/locations of incidents<br/>• <strong>Impact of interventions</strong> - what's working?<br/><br/>Reference specific data points from the charts above.",
        },
        {
          id: "behaviour-policy-effectiveness",
          type: "rag",
          label: "Rate the effectiveness of your behaviour policy",
          info: "Assess your behaviour policy effectiveness:<br/><br/><strong>🔴 Red:</strong> Policy unclear, inconsistently applied, poor outcomes<br/><strong>🟡 Amber:</strong> Policy adequate, some inconsistencies, mixed outcomes<br/><strong>🟢 Green:</strong> Policy clear, consistently applied, positive outcomes",
        },
        {
          id: "behaviour-policy",
          type: "multiline",
          label: "How effective is your current behaviour policy?",
          placeholder: "Evaluate policy effectiveness and any recent changes...",
          info: "Evaluate your behaviour policy considering:<br/>• Clarity and consistency of expectations<br/>• Staff understanding and application<br/>• Pupil and parent understanding<br/>• Effectiveness of rewards and sanctions<br/>• Recent updates or changes made<br/>• Evidence of impact on behaviour<br/>• Areas for further development",
        },
        {
          id: "behaviour-interventions",
          type: "rich-text",
          label: "What interventions are in place for pupils with challenging behaviour?",
          placeholder: "Describe support strategies and their impact...",
          info: "Detail your <strong>intervention strategies</strong>:<br/>• Early identification processes<br/>• Individual behaviour plans<br/>• Therapeutic interventions<br/>• External agency support<br/>• Staff training and expertise<br/>• Family engagement approaches<br/>• Success stories and case studies<br/>• Measuring impact and effectiveness<br/><br/>Include <em>specific examples</em> of successful interventions.",
        },
        {
          id: "behaviour-training",
          type: "dropdown",
          label: "Staff behaviour management training level",
          options: ["Comprehensive", "Adequate", "Basic", "Insufficient"],
          info: "Assess the level of behaviour management training your staff have received:<br/><br/><strong>Comprehensive:</strong> Regular, high-quality training, specialist expertise<br/><strong>Adequate:</strong> Basic training completed, some ongoing development<br/><strong>Basic:</strong> Minimal training, relies mainly on experience<br/><strong>Insufficient:</strong> Little or no formal training, significant gaps",
        },
      ],
    },
    {
      id: "attendance",
      title: "Attendance & Punctuality",
      dataComponent: <AttendanceChart />,
      questions: [
        {
          id: "attendance-analysis",
          type: "rich-text",
          label: "Based on the attendance data shown above, what are your key findings?",
          placeholder: "Analyze attendance trends, identify patterns...",
          required: true,
          info: "Analyze your attendance data thoroughly:<br/>• <strong>Overall attendance rate</strong> vs national average (96%+)<br/>• <strong>Trends over time</strong> - seasonal patterns, improvements/declines<br/>• <strong>Persistent absence rate</strong> (below 90% attendance)<br/>• <strong>Different groups</strong> - PP, SEND, EAL pupils<br/>• <strong>Year group variations</strong><br/>• <strong>Impact of interventions</strong><br/>• <strong>COVID-19 effects</strong> if relevant<br/><br/>Reference specific percentages and trends from the chart above.",
        },
        {
          id: "attendance-strategies",
          type: "multiline",
          label: "What strategies are in place to improve attendance?",
          placeholder: "Describe interventions and support measures...",
          info: "Detail your attendance improvement strategies:<br/>• Early intervention procedures<br/>• Family support and engagement<br/>• Rewards and incentives<br/>• Partnership with external agencies<br/>• Legal action processes<br/>• Addressing barriers to attendance<br/>• Monitoring and tracking systems<br/>• Staff roles and responsibilities",
        },
        {
          id: "persistent-absence",
          type: "single-line",
          label: "Current persistent absence rate (%)",
          placeholder: "e.g., 8.5",
          info: "Enter the percentage of pupils who are persistently absent (attending less than 90% of sessions).<br/><br/><strong>National average is typically around 8-10%</strong><br/><br/>Lower percentages indicate better performance. Anything above 15% would be a significant concern.",
        },
        {
          id: "attendance-quality",
          type: "rag",
          label: "Rate overall attendance performance",
          info: "RAG rating for attendance performance:<br/><br/><strong>🔴 Red:</strong> Below 94%, high persistent absence, declining trends<br/><strong>🟡 Amber:</strong> 94-96%, moderate persistent absence, stable<br/><strong>🟢 Green:</strong> Above 96%, low persistent absence, improving trends",
        },
        {
          id: "punctuality-issues",
          type: "multiline",
          label: "Comment on punctuality and any concerns",
          placeholder: "Describe punctuality patterns and interventions...",
          info: "Address punctuality specifically:<br/>• Late arrival patterns and frequency<br/>• Impact on learning and other pupils<br/>• Strategies to improve punctuality<br/>• Family engagement on punctuality<br/>• Links between punctuality and attendance<br/>• Success stories and improvements<br/>• Ongoing concerns or challenges",
        },
      ],
    },
    {
      id: "suspensions",
      title: "Suspensions and Exclusions",
      dataComponent: <SuspensionExclusionData />,
      questions: [
        {
          id: "suspension-number",
          type: "single-line",
          label: "Number of suspensions this academic year",
          placeholder: "e.g., 35",
          info: "Enter the total number of <strong>fixed-term suspensions</strong> (previously called exclusions) issued during this academic year.<br/><br/>Count each suspension period separately - if the same pupil has multiple suspensions, count each one.<br/><br/>This should match your official records and any data submitted to the local authority.",
        },
        {
          id: "exclusion-number",
          type: "single-line",
          label: "Number of permanent exclusions this academic year",
          placeholder: "e.g., 0",
          info: "Enter the total number of <strong>permanent exclusions</strong> issued during this academic year.<br/><br/>Permanent exclusions are rare and require significant justification. Most schools will have 0 or very few permanent exclusions.<br/><br/>Each permanent exclusion must be reported to governors and the local authority.",
        },
        {
          id: "suspension-analysis",
          type: "rich-text",
          label: "Comment on Suspensions and Exclusions based on the data above",
          placeholder: "Analyze suspension/exclusion data, trends, patterns, and effectiveness of procedures...",
          required: true,
          info: "Provide a comprehensive analysis of your suspension and exclusion data:<br/>• <strong>Trends and patterns</strong> - which behaviors lead to most suspensions?<br/>• <strong>Individual pupils</strong> - are there repeat offenders?<br/>• <strong>Effectiveness</strong> - do suspensions improve behavior?<br/>• <strong>Alternatives used</strong> - internal exclusions, restorative justice<br/>• <strong>Support provided</strong> - before, during, and after suspensions<br/>• <strong>Impact on learning</strong> - sessions lost, catch-up support<br/>• <strong>Comparison</strong> - how do your rates compare to similar schools?<br/><br/>Reference specific data points from the table above and explain any concerning patterns.",
        },
        {
          id: "suspension-procedures",
          type: "multiline",
          label: "Evaluate the effectiveness of your suspension and exclusion procedures",
          placeholder: "Comment on procedures, decision-making, and outcomes...",
          info: "Assess your suspension and exclusion procedures:<br/>• Consistency of decision-making<br/>• Involvement of senior leaders<br/>• Communication with parents/carers<br/>• Provision of work during suspensions<br/>• Reintegration meetings and support<br/>• Appeals process and outcomes<br/>• Staff training on procedures<br/>• Record-keeping and monitoring",
        },
        {
          id: "suspension-alternatives",
          type: "rich-text",
          label: "What alternatives to suspension are used and how effective are they?",
          placeholder: "Describe alternative interventions and their success rates...",
          info: "Detail your <strong>alternative approaches</strong> to suspension:<br/>• Internal exclusion/isolation<br/>• Restorative justice approaches<br/>• Therapeutic interventions<br/>• Mentoring and counseling<br/>• Modified timetables<br/>• Community service<br/>• Parent contracts<br/>• Multi-agency support<br/><br/>Include evidence of <em>effectiveness</em> and when each approach is most appropriate.",
        },
        {
          id: "suspension-rag",
          type: "rag",
          label: "Rate the overall effectiveness of your behavior management and disciplinary procedures",
          info: "Overall RAG rating for behavior management:<br/><br/><strong>🔴 Red:</strong> High suspension rates, ineffective procedures, repeat offenders<br/><strong>🟡 Amber:</strong> Moderate rates, some effectiveness, room for improvement<br/><strong>🟢 Green:</strong> Low rates, effective procedures, positive behavior culture",
        },
      ],
    },
  ]

  const renderQuestion = (question: any) => {
    const commonProps = {
      value: formData[question.id] || "",
      onChange: (value: any) => onUpdateData(question.id, value),
      placeholder: question.placeholder,
    }

    switch (question.type) {
      case "single-line":
        return <Input {...commonProps} className="w-full" />

      case "multiline":
        return <Textarea {...commonProps} className="min-h-[120px]" />

      case "rich-text":
        return <RichTextEditor {...commonProps} className="w-full" />

      case "dropdown":
        return (
          <div className="relative">
            <select
              value={formData[question.id] || ""}
              onChange={(e) => onUpdateData(question.id, e.target.value)}
              className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an option...</option>
              {question.options?.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        )

      case "rag":
        return <RAGPicker value={formData[question.id] || ""} onChange={(value) => onUpdateData(question.id, value)} />

      default:
        return <Input {...commonProps} />
    }
  }

  return (
    <div ref={containerRef} className="space-y-8 pb-20">
      {sections.map((section) => (
        <Card
          key={section.id}
          id={section.id}
          ref={(el) => {
            sectionRefs.current[section.id] = el
          }}
          className="scroll-mt-4"
        >
          <CardHeader>
            <CardTitle className="text-2xl">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data Visualization Component */}
            {section.dataComponent && <div className="mb-8">{section.dataComponent}</div>}

            {/* Questions */}
            {section.questions?.map((question) => (
              <div key={question.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    {question.label}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {question.info && <InfoTooltip content={question.info} />}
                </div>

                {renderQuestion(question)}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
