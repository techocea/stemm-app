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

    const ai = new GoogleGenAI({})

    const { content, subject, title, pdfBase64 } = await req.json()

    const systemPrompt = `You are a World-Class Senior STEM Professor and University Board Examiner.
Your task is to synthesize publication-grade, high-yield Dynamic Short Notes from the provided study material or lecture notes.

Domain: ${subject || "STEM"}
Doc Title: ${title || "Lecture Notes"}

Target Output Requirements:
1. "title": Crisp descriptive short notes title
2. "overview": Concise executive summary of core concepts
3. "keyDefinitions": Array of 3-5 key terms with exact definition
   [ { "term": "...", "definition": "Short punchy definition under 15 words." } ]
4. "sections": Array of 2-4 structured technical sections.
   Each section MUST include:
   - "heading": Section title
   - "bullets": Array of high-yield bullet points. EVERY bullet point MUST start with a bolded key term followed by a delimiter, e.g. "**Key Term** — Short explanation under 15 words." (use LaTeX math like $E=mc^2$ where applicable).
   - "latexFormula": Optional key math equation
   - "codeSnippet": Optional code snippet (if CS/engineering)
   - "diagramCode": Optional Mermaid syntax diagram (e.g., graph TD ...)
   - "comparisonTable": Optional table with { "headers": [...], "rows": [[...], [...]] }
5. "highYieldTraps": Array of 2-3 common candidate errors or exam traps to avoid.

CRITICAL FORMATTING RULES:
- Output MUST be strictly valid JSON without markdown wrapping (\`\`\`json).
- Every bullet point in "bullets" MUST begin with an explicitly bolded key term e.g. "**Term Name** — Concise explanation."
- Keep bullet explanations short, punchy, and scannable (ideally under 15 words).
- Format all math equations in standard LaTeX notation ($...$ or $$...$$).
- Ensure all diagrams use valid Mermaid string syntax.`

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
        text: `Synthesize dynamic short notes based on this uploaded PDF document for ${subject}. Follow the system guidelines.`,
      })
    } else {
      contents.push({
        text: `Material Content:\n${content}\n\nSynthesize dynamic short notes following system guidelines.`,
      })
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    })

    const responseText = response.text || "{}"
    const jsonStart = responseText.indexOf("{")
    const jsonEnd = responseText.lastIndexOf("}")
    const cleanJson = responseText.slice(jsonStart, jsonEnd + 1)

    const parsed = JSON.parse(cleanJson)
    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error("Error generating short notes:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate short notes" },
      { status: 500 }
    )
  }
}
