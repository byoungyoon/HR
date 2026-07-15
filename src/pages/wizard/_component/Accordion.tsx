import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AccordionProps = {
  step: number;
  title: string;
  isOpen: boolean;
  isDone?: boolean;
  activeColor?: 'blue' | 'indigo' | 'violet' | 'emerald';
  onClick: () => void;
  summary?: React.ReactNode;
  hasWarning?: boolean;
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
  hasWarning = false,
  children,
}: AccordionProps) {
  const colors = COLOR_MAP[activeColor];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300">
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center justify-between p-5 text-left transition-all ${
          isOpen ? colors.headerActive : 'hover:bg-slate-50/50'
        }`}
      >
        <div className="flex flex-1 items-center gap-3">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
              isOpen ? colors.badge : 'bg-slate-100 text-slate-700'
            }`}
          >
            {step}
          </span>
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
            {title}
            {hasWarning && (
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-extrabold text-amber-700">
                리스크 감지됨
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          {summary && <span className="text-[11px] font-extrabold text-slate-500">{summary}</span>}
          {isOpen ? (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${colors.activeBadge}`}
            >
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

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-slate-100 bg-slate-50/10 p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
