'use client';

import React from 'react';
import katex from 'katex';
import { DiagramBlock } from './diagram-block';
import { CodeBlock } from './code-block';

interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Extracts Term and Detail if input starts with a term + delimiter pattern
  const extractTermAndDetail = (input: string) => {
    if (!input) return null;
    const trimmed = input.trim();

    // 1) Explicit markdown bold at start: **Term** - Detail OR **Term**: Detail OR **Term** — Detail
    const boldMatch = trimmed.match(/^\*\*(.*?)\*\*\s*(?::|—|–|-|\s-\s)\s*([\s\S]*)$/);
    if (boldMatch) {
      return { term: boldMatch[1].trim(), detail: boldMatch[2].trim() };
    }

    // 2) Single star / underscore bold/italic at start: *Term* - Detail OR __Term__: Detail
    const starMatch = trimmed.match(/^(?:\*|_){1,2}(.*?)(?:\*|_){1,2}\s*(?::|—|–|-|\s-\s)\s*([\s\S]*)$/);
    if (starMatch) {
      return { term: starMatch[1].trim(), detail: starMatch[2].trim() };
    }

    // 3) Plain Term: Detail or Term - Detail or Term — Detail (Term <= 6 words)
    const plainMatch = trimmed.match(/^([A-Za-z0-9\s/\\()&,\-\+]{2,40}?)\s*(?::|—|–|\s-\s)\s*([\s\S]*)$/);
    if (plainMatch) {
      const candidateTerm = plainMatch[1].trim();
      const candidateDetail = plainMatch[2].trim();
      if (candidateTerm.split(/\s+/).length <= 6 && candidateDetail.length > 0) {
        return { term: candidateTerm, detail: candidateDetail };
      }
    }

    return null;
  };

  // Inline parser that parses **bold**, *italic*, `code`, and KaTeX math ($math$, $$math$$)
  const renderInlineMarkdownAndMath = (input: string, keyPrefix: string): React.ReactNode[] => {
    if (!input) return [];

    // Clean leading hashtag headers or orphaned bullet characters
    const cleanInput = input.replace(/^[#*]+\s*/, '');

    const parts: React.ReactNode[] = [];
    const inlineRegex = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$|\*\*([^*]+?)\*\*|__([^_]+?)__|`([^`]+?)`|\*([^*]+?)\*|_([^_]+?)_/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = inlineRegex.exec(cleanInput)) !== null) {
      if (match.index > lastIndex) {
        const textChunk = cleanInput.substring(lastIndex, match.index);
        const safeChunk = textChunk.replace(/\*\*+/g, '');
        if (safeChunk) {
          parts.push(<span key={`${keyPrefix}-txt-${lastIndex}`}>{safeChunk}</span>);
        }
      }

      const blockMath = match[1];
      const inlineMath = match[2];
      const boldText1 = match[3];
      const boldText2 = match[4];
      const codeText = match[5];
      const italicText1 = match[6];
      const italicText2 = match[7];

      const matchIdx = match.index;

      if (blockMath !== undefined) {
        try {
          const html = katex.renderToString(blockMath, { displayMode: true, throwOnError: false });
          parts.push(
            <span
              key={`${keyPrefix}-mblk-${matchIdx}`}
              className="my-2 block overflow-x-auto text-center"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          parts.push(<code key={`${keyPrefix}-err-${matchIdx}`} className="text-amber-600 font-mono text-xs">{match[0]}</code>);
        }
      } else if (inlineMath !== undefined) {
        try {
          const html = katex.renderToString(inlineMath, { displayMode: false, throwOnError: false });
          parts.push(
            <span
              key={`${keyPrefix}-minl-${matchIdx}`}
              className="inline-block px-1 font-mono text-indigo-900"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          parts.push(<code key={`${keyPrefix}-err-${matchIdx}`} className="text-amber-600 font-mono text-xs">{match[0]}</code>);
        }
      } else if (boldText1 !== undefined || boldText2 !== undefined) {
        const boldVal = boldText1 || boldText2;
        parts.push(
          <strong key={`${keyPrefix}-bold-${matchIdx}`} className="text-slate-900 font-bold">
            {boldVal}
          </strong>
        );
      } else if (codeText !== undefined) {
        parts.push(
          <code
            key={`${keyPrefix}-code-${matchIdx}`}
            className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-xs border border-slate-200"
          >
            {codeText}
          </code>
        );
      } else if (italicText1 !== undefined || italicText2 !== undefined) {
        const italicVal = italicText1 || italicText2;
        parts.push(
          <em key={`${keyPrefix}-ital-${matchIdx}`} className="text-slate-800 italic">
            {italicVal}
          </em>
        );
      }

      lastIndex = inlineRegex.lastIndex;
    }

    if (lastIndex < cleanInput.length) {
      const textChunk = cleanInput.substring(lastIndex);
      const safeChunk = textChunk.replace(/\*\*+/g, '');
      if (safeChunk) {
        parts.push(<span key={`${keyPrefix}-txt-${lastIndex}`}>{safeChunk}</span>);
      }
    }

    return parts;
  };

  // Renders a single text line/item with term, anchor, and detail formatting if applicable
  const renderFormattedLine = (line: string, keyPrefix: string) => {
    const termAndDetail = extractTermAndDetail(line);

    if (termAndDetail) {
      return (
        <div key={keyPrefix} className="note-item-row flex flex-wrap items-baseline my-1.5 text-slate-800">
          <strong className="text-slate-900 font-bold">
            {renderInlineMarkdownAndMath(termAndDetail.term, `${keyPrefix}-term`)}
          </strong>
          <span className="text-slate-400 mx-2 font-light select-none">—</span>
          <span className="text-slate-600 font-normal">
            {renderInlineMarkdownAndMath(termAndDetail.detail, `${keyPrefix}-detail`)}
          </span>
        </div>
      );
    }

    return (
      <span key={keyPrefix}>
        {renderInlineMarkdownAndMath(line, keyPrefix)}
      </span>
    );
  };

  // Helper to render Markdown Table
  const renderMarkdownTable = (tableStr: string, key: string) => {
    const lines = tableStr.trim().split('\n').filter((l) => l.trim().startsWith('|'));
    if (lines.length < 2) return <pre key={key} className="whitespace-pre-wrap">{tableStr}</pre>;

    const parseRow = (rowStr: string) =>
      rowStr
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());

    const headers = parseRow(lines[0]);
    const bodyRows = lines.slice(2).map(parseRow);

    return (
      <div key={key} className="my-3 overflow-x-auto rounded-lg border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-xs text-left text-slate-800 border-collapse">
          <thead className="bg-indigo-50/80 text-indigo-950 uppercase text-[11px] font-bold border-b border-indigo-100">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-3.5 py-2 border-r border-indigo-100 last:border-r-0">
                  {renderFormattedLine(h, `${key}-th-${i}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3.5 py-2 border-r border-slate-100 last:border-r-0">
                    {renderFormattedLine(cell, `${key}-td-${rIdx}-${cIdx}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Main block parser (handles ```mermaid, ```code, markdown tables, and formatted lines)
  const renderBlocks = (input: string) => {
    const blocks: React.ReactNode[] = [];
    let blockCounter = 0;

    const codeFenceRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let codeMatch: RegExpExecArray | null;

    while ((codeMatch = codeFenceRegex.exec(input)) !== null) {
      const matchStart = codeMatch.index;
      const matchEnd = codeFenceRegex.lastIndex;

      if (matchStart > lastIndex) {
        const textBefore = input.substring(lastIndex, matchStart);
        blocks.push(...renderTextAndTables(textBefore, `blk-${blockCounter++}`));
      }

      const lang = (codeMatch[1] || '').toLowerCase();
      const codeContent = codeMatch[2];

      if (lang === 'mermaid' || /^(classDiagram|sequenceDiagram|gantt|erDiagram|stateDiagram|graph|flowchart|journey|mindmap)/.test(codeContent.trim())) {
        blocks.push(
          <div key={`mermaid-${blockCounter++}`} className="my-3">
            <DiagramBlock code={codeContent} />
          </div>
        );
      } else {
        blocks.push(
          <div key={`code-${blockCounter++}`} className="my-3">
            <CodeBlock code={codeContent} language={lang || 'python'} />
          </div>
        );
      }

      lastIndex = matchEnd;
    }

    if (lastIndex < input.length) {
      const textAfter = input.substring(lastIndex);
      blocks.push(...renderTextAndTables(textAfter, `blk-${blockCounter++}`));
    }

    return blocks;
  };

  const renderTextAndTables = (chunk: string, prefix: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    const tableRegex = /(?:^|\n)(\|.*\|\n\|[-:\s|]+\|\n(?:\|.*\|\n?)+)/g;
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = tableRegex.exec(chunk)) !== null) {
      const matchStart = match.index;
      const tableContent = match[1];

      if (matchStart > lastIdx) {
        const plainText = chunk.substring(lastIdx, matchStart);
        result.push(renderFormattedLine(plainText, `${prefix}-lx-${lastIdx}`));
      }

      result.push(renderMarkdownTable(tableContent, `${prefix}-tbl-${matchStart}`));
      lastIdx = tableRegex.lastIndex;
    }

    if (lastIdx < chunk.length) {
      const plainText = chunk.substring(lastIdx);
      result.push(renderFormattedLine(plainText, `${prefix}-lx-${lastIdx}`));
    }

    return result;
  };

  return <div className={`text-slate-800 ${className}`}>{renderBlocks(text)}</div>;
};

