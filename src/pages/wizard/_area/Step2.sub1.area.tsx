import { ArrowRight, CalendarDays, Pencil } from 'lucide-react';
import { useState } from 'react';
import Accordion from '../_component/Accordion';
import { useWizaredStore } from '../state';

type Preset = '1개월' | '3개월' | '6개월' | '1년' | '2년' | '직접입력';

const PERIOD_PRESETS: Preset[] = ['1개월', '3개월', '6개월', '1년', '2년', '직접입력'];
const PROBATION_OPTIONS = ['없음', '1개월', '2개월', '3개월', '6개월'];

function addToDate(startDate: string, preset: Exclude<Preset, '직접입력'>): string {
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

/** 시작일~종료일 기간 텍스트 계산 */
function calcPeriodLabel(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return '-';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) return '날짜 오류';
  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  if (years > 0 && months > 0) return `${years}년 ${months}개월`;
  if (years > 0) return `${years}년`;
  if (months > 0) return `${months}개월`;
  return `${totalDays}일`;
}

/** 실제 계약 일수 */
function calcPeriodDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const diffMs = new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

export default function Step2Sub1Area() {
  const {
    wizStartDate,
    wizPeriodYear,
    wizEndDate,
    wizProbation,
    wizSubStep,
    maxUnlockedSubStep,
    setWizSubStep,
    setMaxUnlockedSubStep,
    setWizStartDate,
    setWizPeriodYear,
    setWizEndDate,
    setWizProbation,
  } = useWizaredStore();

  const [selectedPreset, setSelectedPreset] = useState<Preset>('1년');

  const isCustom = selectedPreset === '직접입력';
  const periodLabel = calcPeriodLabel(wizStartDate, wizEndDate);
  const periodDays = calcPeriodDays(wizStartDate, wizEndDate);
  const isUnderOneYear = periodDays > 0 && periodDays < 365;

  const handlePeriodPreset = (preset: Preset) => {
    setSelectedPreset(preset);
    if (preset !== '직접입력' && wizStartDate) {
      const newEnd = addToDate(wizStartDate, preset as Exclude<Preset, '직접입력'>);
      setWizEndDate(newEnd);
      // wizPeriodYear 동기화 (연 단위만)
      if (preset === '1년') setWizPeriodYear(1);
      else if (preset === '2년') setWizPeriodYear(2);
    }
  };

  const handleStartDateChange = (date: string) => {
    setWizStartDate(date);
    if (!isCustom && date && selectedPreset !== '직접입력') {
      setWizEndDate(addToDate(date, selectedPreset as Exclude<Preset, '직접입력'>));
    }
  };

  /** 종료일 직접 변경 → 항상 직접입력 모드로 전환 */
  const handleEndDateChange = (date: string) => {
    setWizEndDate(date);
    setSelectedPreset('직접입력');
  };

  return (
    <Accordion
      step={1}
      title="계약 기간 및 수습 설정"
      isOpen={wizSubStep === 1}
      isDone={maxUnlockedSubStep >= 2}
      activeColor="blue"
      onClick={() => setWizSubStep(1)}
      summary={
        <>
          시작일: <span className="font-bold text-slate-800">{wizStartDate}</span> → 종료일:{' '}
          <span className="font-bold text-slate-800">{wizEndDate}</span> (
          {isCustom ? '직접선택' : selectedPreset})
          {wizProbation !== '없음' ? ` · 수습: ${wizProbation}` : ' · 수습 없음'}
        </>
      }
    >
      <div>
        <label className="mb-1.5 block text-xs font-bold text-slate-700">
          계약 시작일 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={wizStartDate}
          onChange={e => handleStartDateChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">
          계약 기간 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PERIOD_PRESETS.map(preset => {
            const isActive = selectedPreset === preset;
            const isCustomBtn = preset === '직접입력';
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handlePeriodPreset(preset)}
                className={`flex items-center gap-1.5 rounded-xl border-2 px-3.5 py-2 text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? isCustomBtn
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                      : 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-100'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                {isCustomBtn ? (
                  <Pencil className="h-3 w-3" />
                ) : (
                  <CalendarDays className="h-3 w-3" />
                )}
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          계약 종료일{' '}
          <span className="ml-1 text-[10px] font-semibold text-slate-400">
            (직접 수정하면 직접선택으로 전환됩니다)
          </span>
        </label>
        <div className="relative">
          <input
            type="date"
            value={wizEndDate}
            onChange={e => handleEndDateChange(e.target.value)}
            className={`w-full rounded-xl border-2 p-3 pr-20 text-xs font-semibold transition-all focus:ring-2 focus:outline-none ${
              isCustom
                ? 'border-indigo-300 bg-white text-slate-800 focus:ring-indigo-100'
                : 'border-slate-200 bg-slate-50/60 text-slate-700 focus:ring-blue-100'
            }`}
          />
          <span
            className={`pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-full px-2 py-0.5 text-[9px] font-black ${
              isCustom ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
            }`}
          >
            {isCustom ? '직접선택' : '자동계산'}
          </span>
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
              className={`rounded-xl border-2 px-3.5 py-2 text-xs font-bold transition-all duration-150 ${
                wizProbation === opt
                  ? opt === '없음'
                    ? 'border-slate-600 bg-slate-600 text-white shadow-sm'
                    : parseInt(opt) <= 3
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-100'
                      : 'border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-100'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-2">
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
