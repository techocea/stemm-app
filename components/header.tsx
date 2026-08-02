import React from "react"
import { Download, GraduationCap } from "lucide-react"

const Header = () => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3.5 shadow-xs">
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <h1 className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900">
            STEM Academic Studio
            <span className="rounded-full border border-indigo-200/80 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
              PDF SHORT NOTE & EXAM SOLVER
            </span>
          </h1>
          <p className="text-[11px] font-medium text-slate-500">
            Dynamic Short Notes from PDF & Model Examination Papers
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header
