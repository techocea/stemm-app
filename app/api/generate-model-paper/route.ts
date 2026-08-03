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

    const {
      pdfBase64,
      targetSubject = "Computer Science",
      docType = "lecture_notes", // 'lecture_notes' | 'past_paper'
      generationMode = "model_paper", // 'short_notes' | 'model_paper' | 'past_paper_solver' | 'weighted_model_paper'
      showAnswers = true,
      questionCount = 6,
    } = await req.json()

    if (!pdfBase64) {
      return NextResponse.json(
        { error: "Please provide a PDF document." },
        { status: 400 }
      )
    }

    const systemInstruction = `
You are an expert academic tutor and university board examiner for higher education across STEM (Computer Science, Data Structures & Algorithms, Physics, Chemistry, Biology) and Business/Management disciplines. You are producing a paper that a real student will study from as their primary preparation days before a real exam — errors or gaps here cost them marks in real life.
 
═══════════════════════════════════════════════
NON-NEGOTIABLE COVERAGE RULE
═══════════════════════════════════════════════
Base every question, formula, and solution STRICTLY on the uploaded document's content — never introduce outside concepts. But within that constraint, err toward MORE faithful coverage, not less: if the source material spans multiple distinct topics, your ${questionCount} questions should be distributed across all of them proportional to how much the source emphasizes each, not clustered on whichever topic is easiest to write about.
 
═══════════════════════════════════════════════
BLOOM'S TAXONOMY — REQUIRED COGNITIVE SPREAD
═══════════════════════════════════════════════
Real university exams do not just test recall. Distribute the ${questionCount} questions across Bloom's levels roughly as follows (adjust proportionally for small counts, but never make every question pure recall):
- Remember/Understand (define, describe, identify): ~20%
- Apply (solve, compute, implement, trace through): ~35%
- Analyze (compare, differentiate, debug, decompose a system/problem): ~30%
- Evaluate/Create (justify a design choice, critique an approach, design a solution): ~15%
 
Tag every question with its "bloomLevel" so the student knows what skill it's testing. A paper that is 100% "define X" questions is a bad exam paper and a bad study tool — do not produce one even if the source material is mostly definitional; if so, apply/analyze-level questions should ask the student to use those definitions, not just restate them.
 
═══════════════════════════════════════════════
DOCUMENT TYPE HANDLING
═══════════════════════════════════════════════
A. IF INPUT IS "LECTURE NOTES":
   - Mode "model_paper": Synthesize a university-standard model exam paper with appropriate mark allocations, grounded strictly in the lecture material, following the Bloom's spread above.
 
B. IF INPUT IS "PAST PAPER":
   - Mode "past_paper_solver": Scan and parse EVERY question in the uploaded paper — do not skip or merge any. Provide complete, full-credit solutions with step-by-step marking rubrics precise enough that a student can self-mark against them.
   - Mode "weighted_model_paper": Analyze the topic weighting and question style/format distribution of the uploaded past paper, then generate a brand-new ${questionCount}-question paper that mimics that real distribution and difficulty — not a generic paper, a faithful stylistic mirror of this specific paper.
 
═══════════════════════════════════════════════
FORMATTING RULES
═══════════════════════════════════════════════
- Tables & Matrices: clean standard Markdown tables.
- UML/ER/Sequence/Flowcharts: valid Mermaid.js in "diagramCode" whenever depicted or clearly implied by the source.
- Math/Physics/Chemistry: complete step-by-step working, LaTeX for all formulas ($...$ or $$...$$) — do not skip intermediate algebraic steps a student would need to follow the logic.
- Code: fenced, language-tagged, correctly indented.
 
═══════════════════════════════════════════════
ANSWER VISIBILITY
═══════════════════════════════════════════════
showAnswers = ${showAnswers ? "TRUE" : "FALSE"}.
- TRUE: full, complete, correct model solution + explanation + rubric for every question — no placeholders, no "left as an exercise."
- FALSE: questions only; solution field states "[Candidate Test Mode — Solutions Hidden]".
 
═══════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════
Output ONLY valid JSON strictly matching the response schema. No markdown fences, no preamble.
`

    let promptText = ""
    if (docType === "past_paper") {
      if (generationMode === "past_paper_solution") {
        promptText = `Scan and extract every question from the uploaded past exam paper for ${targetSubject}. Output fully solved model answers with step-by-step marking rubrics, tagged with Bloom's level.`
      } else {
        promptText = `Analyze the topic weightings and question formats of the uploaded past paper for ${targetSubject}, then generate a brand-new ${questionCount}-question weighted model paper mimicking its style and difficulty, with Bloom's-level tags on each question.`
      }
    } else {
      promptText = `Synthesize a university-standard model examination paper for ${targetSubject} consisting of ${questionCount} questions based strictly on the lecture text, complete with mark allocations, model answers, and Bloom's-level tags per the required cognitive spread.`
    }

    if (!showAnswers) {
      promptText += ` Note: Candidate mode is active (showAnswers=false). Keep the solution field blank or labeled as hidden for self-testing.`
    }

    let contentsPayload: any[]

    if (pdfBase64) {
      const cleanBase64 = pdfBase64.replace(
        /^data:application\/pdf;base64,/,
        ""
      )
      contentsPayload = [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: cleanBase64,
          },
        },
        { text: promptText },
      ]
    } else {
      contentsPayload = [
        {
          text: `EXAM SOURCE MATERIAL / ACADEMIC DOCUMENT:\n${promptText}`,
        },
      ]
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contentsPayload,
      config: {
        systemInstruction,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            docType: { type: Type.STRING },
            generationMode: { type: Type.STRING },
            paperType: { type: Type.STRING },
            totalMarks: { type: Type.INTEGER },
            durationMinutes: { type: Type.INTEGER },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            alignmentMatrix: {
              type: Type.ARRAY,
              description:
                "Curriculum alignment matrix for simulated past papers",
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  frequencyPercentage: { type: Type.INTEGER },
                  historicalWeight: { type: Type.STRING },
                  keyTrap: { type: Type.STRING },
                  corePrinciple: { type: Type.STRING },
                },
                required: [
                  "topic",
                  "frequencyPercentage",
                  "historicalWeight",
                  "keyTrap",
                  "corePrinciple",
                ],
              },
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  questionNumber: { type: Type.INTEGER },
                  section: { type: Type.STRING },
                  marks: { type: Type.INTEGER },
                  bloomLevel: {
                    type: Type.STRING,
                    description:
                      "One of: Remember, Understand, Apply, Analyze, Evaluate, Create",
                  },
                  questionText: { type: Type.STRING },
                  codeSnippet: { type: Type.STRING },
                  latexFormula: { type: Type.STRING },
                  diagramCode: { type: Type.STRING },
                  solution: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  rubricSteps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        step: { type: Type.STRING },
                        marks: { type: Type.INTEGER },
                      },
                      required: ["step", "marks"],
                    },
                  },
                },
                required: [
                  "id",
                  "questionNumber",
                  "marks",
                  "bloomLevel",
                  "questionText",
                  "solution",
                  "explanation",
                ],
              },
            },
          },
          required: ["title", "subject", "totalMarks", "questions"],
        },
      },
    })

    const rawJson = response.text
    if (!rawJson) {
      throw new Error("Gemini engine returned an empty response.")
    }

    const parsedData = JSON.parse(rawJson)
    parsedData.id = parsedData.id || `exam-${Date.now()}`
    parsedData.createdAt = new Date().toISOString().split("T")[0]
    parsedData.docType = docType
    parsedData.generationMode = generationMode
    parsedData.showAnswers = showAnswers

    return NextResponse.json(parsedData)
  } catch (error: any) {
    console.error("Error generating solved exam paper:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to generate solved exam paper." },
      { status: 500 }
    )
  }
}
