import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type AccordionProps = {
  /** 아코디언 번호 (1, 2, 3...) */
  step: number;
  /** 헤더 제목 */
  title: string;
  /** 펼쳐진 상태 여부 */
  isOpen: boolean;
  /** 완료 상태 여부 (완료 뱃지 색상 결정) */
  isDone?: boolean;
  /** 펼쳐진 상태일 때 step 배지 색상 (기본값: 'blue') */
  activeColor?: 'blue' | 'indigo' | 'violet' | 'emerald';
  /** 헤더 클릭 시 */
  onClick: () => void;
  /** 닫힌 상태일 때 헤더 아래 요약 텍스트 */
  summary?: React.ReactNode;
  /** 아코디언 내부 컨텐츠 */
  children: React.ReactNode;
};

const COLOR_MAP = {
  blue: {
    badge: 'bg-blue-600 text-white',
    activeBadge: 'bg-blue-50 text-blue-700',
    headerActive: 'border-b border-slate-100 bg-slate-50/80',
  },
  indigo: {
    badge: 'bg-indigo-600 text-white',
    activeBadge: 'bg-indigo-50 text-indigo-700',
    headerActive: 'border-b border-slate-100 bg-slate-50/80',
  },
  violet: {
    badge: 'bg-violet-600 text-white',
    activeBadge: 'bg-violet-50 text-violet-700',
    headerActive: 'border-b border-slate-100 bg-slate-50/80',
  },
  emerald: {
    badge: 'bg-emerald-600 text-white',
    activeBadge: 'bg-emerald-50 text-emerald-700',
    headerActive: 'border-b border-slate-100 bg-slate-50/80',
  },
};

export default function Accordion({
  step,
  title,
  isOpen,
  isDone = false,
  activeColor = 'blue',
  onClick,
  summary,
  children,
}: AccordionProps) {
  const colors = COLOR_MAP[activeColor];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300">
      {/* 헤더 */}
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center justify-between p-5 text-left transition-all ${
          isOpen ? colors.headerActive : 'hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
              isOpen ? colors.badge : 'bg-slate-100 text-slate-700'
            }`}
          >
            {step}
          </span>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
              {title}
            </h3>
            {!isOpen && summary && (
              <p className="mt-1 text-[11px] font-semibold text-slate-500">{summary}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOpen ? (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${colors.activeBadge}`}>
              작성 중
            </span>
          ) : isDone ? (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              완료
            </span>
          ) : null}
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* 바디 */}
      {isOpen && (
        <div className="animate-in fade-in space-y-4 border-t border-slate-100 bg-slate-50/10 p-6 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
