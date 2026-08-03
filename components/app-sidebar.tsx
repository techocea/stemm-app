"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAppStore } from "@/lib/store"
import { ChevronRight, GraduationCap } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function AppSidebar() {
  const {
    shortNotesList,
    examsList,
    currentNotes,
    currentExam,
    activeTab,
    selectNotes,
    selectExam,
  } = useAppStore()

  const router = useRouter()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center justify-start">
                <Image
                  src="/logo.png"
                  alt="STEMM Logo"
                  width={50}
                  height={50}
                />
                <h1 className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900">
                  STEMM
                </h1>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {shortNotesList.length > 0 && (
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <span className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  Generated Short Notes ({shortNotesList.length})
                </span>

                <div className="max-h-40 space-y-1.5 overflow-y-auto">
                  {shortNotesList.map((sn) => (
                    <button
                      key={sn.id}
                      onClick={() => router.push(`/${sn.id}`)}
                      className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-[11px] transition-all ${
                        currentNotes?.id === sn.id
                          ? "border-emerald-300 bg-emerald-50 font-bold text-emerald-950"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate pr-2">{sn.title}</span>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Exam Library History */}
            {examsList.length > 0 && (
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <span className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  Saved Model Papers ({examsList.length})
                </span>

                <div className="max-h-40 space-y-1.5 overflow-y-auto">
                  {examsList.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => router.push(`/${ex.id}`)}
                      className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-[11px] transition-all ${
                        currentExam?.id === ex.id
                          ? "border-amber-300 bg-amber-50 font-bold text-amber-900"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate pr-2">{ex.title}</span>
                      <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                        {ex.paperType === "past_paper_solution"
                          ? "Simulated"
                          : "Model"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
