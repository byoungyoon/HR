import { ArrowRight } from 'lucide-react';
import Accordion from '../_component/Accordion';
import { useWizaredStore } from '../state';

type Preset = '1개월' | '3개월' | '6개월' | '1년' | '2년';

function addToDate(startDate: string, preset: Preset): string {
  const d = new Date(startDate);
  if (preset === '1개월') d.setMonth(d.getMonth() + 1);
  else if (preset === '3개월') d.setMonth(d.getMonth() + 3);
  else if (preset === '6개월') d.setMonth(d.getMonth() + 6);
  else if (preset === '1년') d.setFullYear(d.getFullYear() + 1);
  else if (preset === '2년') d.setFullYear(d.getFullYear() + 2);
  d.setDate(d.getDate() - 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const PROBATION_OPTIONS = ['없음', '1개월', '2개월', '3개월', '6개월'];

function calcPeriodLabel(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return '';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) return '';
  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  if (years > 0 && months > 0) return `${years}년 ${months}개월`;
  if (years > 0) return `${years}년`;
  if (months > 0) return `${months}개월`;
  return `${totalDays}일`;
}

export default function Step2Sub1Area({ hasWarning = false }: { hasWarning?: boolean }) {
  const {
    wizStartDate,
    wizEndDate,
    wizProbation,
    wizSubStep,
    maxUnlockedSubStep,
    setWizSubStep,
    setMaxUnlockedSubStep,
    setWizStartDate,
    setWizEndDate,
    setWizProbation,
  } = useWizaredStore();

  const handleApplyPreset = (preset: Preset) => {
    if (!wizStartDate) return;
    const newEnd = addToDate(wizStartDate, preset);
    setWizEndDate(newEnd);
  };

  const periodLabel = calcPeriodLabel(wizStartDate, wizEndDate);

  return (
    <Accordion
      step={1}
      title="계약 기간 및 수습 설정"
      isOpen={wizSubStep === 1}
      isDone={maxUnlockedSubStep >= 2}
      activeColor="blue"
      onClick={() => setWizSubStep(1)}
      hasWarning={hasWarning}
      summary={
        <>
          계약기간: <span className="font-bold text-slate-800">{wizStartDate || '-'}</span> ~{' '}
          <span className="font-bold text-slate-800">{wizEndDate || '-'}</span>
          {wizProbation !== '없음' ? ` · 수습: ${wizProbation}` : ' · 수습 없음'}
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="block text-xs font-bold text-slate-700">계약 기간</label>
          {periodLabel && (
            <span className="rounded-md bg-custom-indigo-bg px-1.5 py-0.5 text-[10px] font-extrabold text-custom-indigo animate-in fade-in">
              {periodLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={wizStartDate}
            onChange={e => setWizStartDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
          <span className="font-bold text-slate-400">~</span>
          <input
            type="date"
            value={wizEndDate}
            onChange={e => setWizEndDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="mr-1 text-[10px] font-bold text-slate-400">간편 설정:</span>
          {(['1개월', '3개월', '6개월', '1년', '2년'] as Preset[]).map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-extrabold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">수습 기간</label>
        <div className="flex flex-wrap gap-2">
          {PROBATION_OPTIONS.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => setWizProbation(opt)}
              className={`cursor-pointer rounded-xl border px-5 py-2.5 text-xs font-black transition-all duration-200 ${
                wizProbation === opt
                  ? 'border-custom-indigo bg-custom-indigo text-white shadow-md shadow-custom-indigo-border'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-2">
        <button
          type="button"
          onClick={() => {
            setMaxUnlockedSubStep(Math.max(maxUnlockedSubStep, 2) as any);
            setWizSubStep(2);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800"
        >
          <span>다음</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </Accordion>
  );
}
