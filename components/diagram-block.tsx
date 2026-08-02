'use client';

import React, { useEffect, useState, useId } from 'react';
import mermaid from 'mermaid';
import { Network, Maximize2, Copy, Check, RefreshCw } from 'lucide-react';

interface DiagramBlockProps {
  code: string;
  className?: string;
  title?: string;
}

export const DiagramBlock: React.FC<DiagramBlockProps> = ({
  code,
  className = '',
  title,
}) => {
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Unique ID for mermaid render
  const rawId = useId().replace(/:/g, '_');
  const diagramId = `mermaid_svg_${rawId}`;

  // Clean diagram code if wrapped in markdown code blocks
  let cleanedCode = code || '';
  if (cleanedCode.startsWith('```mermaid')) {
    cleanedCode = cleanedCode.replace(/^```mermaid\n?/, '').replace(/\n?```$/, '');
  } else if (cleanedCode.startsWith('```')) {
    cleanedCode = cleanedCode.replace(/^```\w*\n?/, '').replace(/\n?```$/, '');
  }
  cleanedCode = cleanedCode.trim();

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      if (!cleanedCode) return;

      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        });

        // Use mermaid.render
        const { svg } = await mermaid.render(diagramId, cleanedCode);
        if (isMounted) {
          setSvgHtml(svg);
          setError(null);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setError(err?.message || 'Failed to render diagram syntax.');
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [cleanedCode, diagramId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine Diagram Type Badge
  let diagramType = 'UML / Diagram';
  if (/^classDiagram/i.test(cleanedCode)) diagramType = 'UML Class Diagram';
  else if (/^sequenceDiagram/i.test(cleanedCode)) diagramType = 'UML Sequence Diagram';
  else if (/^gantt/i.test(cleanedCode)) diagramType = 'Gantt Chart';
  else if (/^erDiagram/i.test(cleanedCode)) diagramType = 'ER Entity-Relationship';
  else if (/^stateDiagram/i.test(cleanedCode)) diagramType = 'UML State Diagram';
  else if (/^journey/i.test(cleanedCode)) diagramType = 'User Journey Map';
  else if (/^mindmap/i.test(cleanedCode)) diagramType = 'Concept Mind Map';
  else if (/^(graph|flowchart)/i.test(cleanedCode)) diagramType = 'Flowchart / Architecture';

  return (
    <div className={`rounded-xl border border-indigo-200 bg-white overflow-hidden shadow-sm transition-all ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-indigo-50/80 border-b border-indigo-100 text-xs text-indigo-900">
        <div className="flex items-center gap-2 font-semibold">
          <Network className="w-4 h-4 text-indigo-600" />
          <span className="uppercase tracking-wider text-[11px] font-bold text-indigo-800">
            {title || diagramType}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-indigo-100/60 border border-indigo-200 text-slate-700 transition-colors text-[11px]"
            title="Copy Mermaid Code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Code</span>
              </>
            )}
          </button>

          {svgHtml && (
            <button
              onClick={() => setIsZoomed(true)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-[11px] font-semibold"
              title="Expand Diagram"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full View</span>
            </button>
          )}
        </div>
      </div>

      {/* Render Area */}
      <div className="p-4 md:p-6 overflow-x-auto flex justify-center items-center bg-slate-50/50 min-h-[160px]">
        {error ? (
          <div className="w-full p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 font-mono">
            <p className="font-bold mb-1 text-rose-900">Diagram Render Note:</p>
            <p className="mb-2 text-[11px] text-rose-700">{error}</p>
            <pre className="p-2 bg-white rounded border border-rose-200 text-[11px] overflow-x-auto">
              {cleanedCode}
            </pre>
          </div>
        ) : svgHtml ? (
          <div
            className="mermaid-svg-container w-full max-w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svgHtml }}
          />
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400 py-6">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
            <span>Rendering publication-grade diagram...</span>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && svgHtml && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <Network className="w-4 h-4 text-indigo-600" />
                <span>{title || diagramType}</span>
              </div>
              <button
                onClick={() => setIsZoomed(false)}
                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded text-xs transition-colors"
              >
                Close
              </button>
            </div>
            <div className="p-6 overflow-auto flex-1 flex justify-center items-center bg-slate-50 [&>svg]:max-w-none [&>svg]:w-full">
              <div dangerouslySetInnerHTML={{ __html: svgHtml }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
