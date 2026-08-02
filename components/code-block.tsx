'use client';

import React, { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  // Clean code string if wrapped in markdown code fence
  let cleanedCode = code || '';
  let detectedLang = language;

  const fenceMatch = cleanedCode.match(/^```(\w+)?\n([\s\S]*?)```$/);
  if (fenceMatch) {
    if (fenceMatch[1]) detectedLang = fenceMatch[1];
    cleanedCode = fenceMatch[2];
  } else {
    cleanedCode = cleanedCode.replace(/^```(\w+)?\n?/, '').replace(/\n?```$/, '');
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = cleanedCode.trim().split('\n');

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-950 overflow-hidden text-slate-100 shadow-lg ${className}`}>
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/80 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-mono">
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="uppercase text-[11px] tracking-wider font-semibold text-indigo-300">
            {detectedLang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto font-mono text-xs md:text-sm leading-relaxed">
        <table className="border-collapse w-full">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-slate-900/50">
                <td className="pr-4 text-right text-slate-600 select-none text-[11px] w-6 border-r border-slate-800/60 font-mono">
                  {idx + 1}
                </td>
                <td className="pl-4 text-slate-200 whitespace-pre">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
