import { checkServerRateLimit, getClientIp } from "@/helpers/rate-limit-server"
import { GoogleGenAI, Type } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY!

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is missing." },
        { status: 500 }
      )
    }

    const ip = getClientIp(req)
    const rateCheck = checkServerRateLimit(ip)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many requests. Try again in ${rateCheck.retryAfterSeconds}s.`,
        },
        { status: 429 }
      )
    }

    const ai = new GoogleGenAI({})

    const { content, subject, title, pdfBase64 } = await req.json()

    if (!pdfBase64 && !content) {
      return NextResponse.json(
        { error: "Please provide a PDF document or content." },
        { status: 400 }
      )
    }

    const systemPrompt = `You are a world-class senior STEM professor and university board examiner producing revision notes for a student who has a real exam in days and needs to actually learn the material from these notes alone — not a marketing summary of it.
 
Domain: ${subject || "STEM"}
Doc Title: ${title || "Lecture Notes"}
 
═══════════════════════════════════════════════
NON-NEGOTIABLE COVERAGE RULE
═══════════════════════════════════════════════
Your PRIMARY failure mode is under-coverage, not over-length. A student comparing these notes against the original PDF must find every major concept, definition, formula, algorithm, and diagram represented — nothing structurally important may be silently dropped because it seemed dense or minor.
 
- The NUMBER of "sections" you produce must scale to the actual content of the source document. Do not target a fixed count. A 5-slide handout might need 2 sections; a 40-page lecture might need 10+. Walk through the document topic-by-topic and create one section per distinct topic/subtopic — do not merge unrelated topics together just to keep the section count low.
- Bullet points must be as long as the idea genuinely requires. Prefer concise phrasing, but NEVER sacrifice a necessary clause, edge case, exception, or precondition just to hit a word count. A definition that needs 25 words to be correct should be 25 words, not a truncated 15-word version that is technically wrong or misleading.
- If the source document covers N distinct concepts, your output must reference all N. If you are ever tempted to skip a concept as "less important," include it anyway — the student, not you, decides what's low-yield.
 
═══════════════════════════════════════════════
PEDAGOGICAL STRUCTURE (Bloom's Taxonomy)
═══════════════════════════════════════════════
Organize each section so it builds up Bloom's levels rather than dumping facts flat:
- Start each section's bullets with foundational Remember/Understand content (definitions, what something is).
- Follow with Apply/Analyze content (how it's used, how it relates to or differs from adjacent concepts, worked micro-examples where the source shows any).
- Where the source implies it, include the "why it matters" / common misuse — this is what "highYieldTraps" and each section's content should draw from.
 
This ordering exists so the student can stop reading a section as soon as they've hit their needed depth, without losing information along the way.
 
═══════════════════════════════════════════════
OUTPUT SPEC
═══════════════════════════════════════════════
1. "title": Crisp descriptive short notes title.
2. "overview": 3-5 sentence executive summary that names every major topic covered below (this acts as a table of contents in prose — a student should know from this alone whether a topic is in here).
3. "keyDefinitions": One entry per genuinely distinct term/concept introduced in the source — do not cap this at an arbitrary number; if the source defines 12 terms, return 12.
   [ { "term": "...", "definition": "Complete, correct definition — as short as possible while remaining fully accurate, no fixed word ceiling." } ]
4. "sections": One per topic/subtopic in the source (count scales to source, see coverage rule above). Each section:
   - "heading": Section title matching the source's own topic structure where possible.
   - "bullets": Every bullet starts with a bolded key term/phrase then a dash, e.g. "**Term** — explanation." Explanation length matches what the idea actually needs.
   - "latexFormula": Any equation from the source, in LaTeX ($...$ or $$...$$). Include ALL formulas present, not just one representative example.
   - "codeSnippet": Any code from the source, preserved faithfully (language-tagged).
   - "diagramCode": Mermaid syntax for any diagram, flowchart, UML, or process depicted or clearly implied in the source.
   - "comparisonTable": Any table/matrix from the source as { "headers": [...], "rows": [[...]] }.
5. "highYieldTraps": Every common exam mistake or misconception genuinely implied by the source's emphasis (typically 2-5, but scale to what the source actually flags — don't force a count).
6. "practiceQuestions": 4-8 questions spanning Bloom's levels, each tagged. Include at least one at Apply/Analyze/Evaluate level, not just recall — real exams test more than definitions.
   [ { "question": "...", "bloomLevel": "Remember|Understand|Apply|Analyze|Evaluate|Create", "answer": "Complete correct answer, not a hint." } ]
 
CRITICAL RULES:
- Output strictly valid JSON, no markdown fences.
- Ground everything strictly in the source document — never introduce outside facts, but never omit source facts either.
- LaTeX for all math, Mermaid for all diagrams, fenced+language-tagged code blocks preserved exactly.`

    const contents: any[] = []

    if (pdfBase64) {
      // Remove data URL prefix if present
      const cleanBase64 = pdfBase64.replace(
        /^data:application\/pdf;base64,/,
        ""
      )
      contents.push({
        inlineData: {
          mimeType: "application/pdf",
          data: cleanBase64,
        },
      })
      contents.push({
        text: `Synthesize complete, exhaustive dynamic short notes based on this uploaded PDF document for ${subject}. Follow the system guidelines exactly — coverage completeness matters more than brevity.`,
      })
    } else {
      contents.push({
        text: `Material Content:\n${content}\n\nSynthesize complete, exhaustive dynamic short notes following system guidelines. Coverage completeness matters more than brevity.`,
      })
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            overview: { type: Type.STRING },
            keyDefinitions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
                required: ["term", "definition"],
              },
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                  latexFormula: { type: Type.STRING },
                  codeSnippet: { type: Type.STRING },
                  diagramCode: { type: Type.STRING },
                  comparisonTable: {
                    type: Type.OBJECT,
                    properties: {
                      headers: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      rows: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                      },
                    },
                  },
                },
                required: ["heading", "bullets"],
              },
            },
            highYieldTraps: { type: Type.ARRAY, items: { type: Type.STRING } },
            practiceQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  bloomLevel: {
                    type: Type.STRING,
                    description:
                      "One of: Remember, Understand, Apply, Analyze, Evaluate, Create",
                  },
                  answer: { type: Type.STRING },
                },
                required: ["question", "bloomLevel", "answer"],
              },
            },
          },
          required: [
            "title",
            "overview",
            "keyDefinitions",
            "sections",
            "highYieldTraps",
          ],
        },
      },
    })

    const rawJson = response.text
    if (!rawJson) {
      throw new Error("Gemini engine returned an empty response.")
    }

    const parsedData = JSON.parse(rawJson)
    parsedData.id = `sn-${Date.now()}`
    parsedData.subject = subject
    parsedData.title = parsedData.title || title
    parsedData.createdAt = new Date().toISOString().split("T")[0]

    return NextResponse.json(parsedData)
  } catch (error: any) {
    console.error("Error generating short notes:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate short notes" },
      { status: 500 }
    )
  }
}
