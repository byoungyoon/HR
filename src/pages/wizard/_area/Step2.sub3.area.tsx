import { AlertTriangle, ArrowRight, Check, ChevronDown, ChevronUp, Info } from 'lucide-react';
import React, { useState } from 'react';
import { numberToKorean } from '../../../utils';
import { useWizaredStore } from '../state';

const MIN_WAGE = 10320; // 2026년 최저시급

/* ────────── 유틸: 접이식 섹션 헤더 ────────── */
function SectionAccordion({
  title,
  sectionKey,
  openSection,
  onToggle,
  children,
  badge,
}: {
  title: string;
  sectionKey: string;
  openSection: string | null;
  onToggle: (key: string) => void;
  children: React.ReactNode;
  badge?: string;
}) {
  const isOpen = openSection === sectionKey;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-slate-300/80">
      <button
        type="button"
        onClick={() => onToggle(sectionKey)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-all hover:bg-slate-50/50"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-black text-slate-700">{title}</span>
          {badge && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        )}
      </button>
      {isOpen && (
        <div className="animate-in fade-in border-t border-slate-100 bg-slate-50/30 p-4 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}

/* ────────── 공통: 급여일 선택 ────────── */
function PayDaySelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}일`).concat(['말일']);
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">매월 급여 지급일</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-2.5 pr-8 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
        >
          {days.map(d => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ────────── 공통: 비과세 항목 섹션 내용 ────────── */
function NonTaxContent({
  wizNonTaxFood,
  setWizNonTaxFood,
  wizHasCarAllowance,
  setWizHasCarAllowance,
  wizNonTaxCar,
  setWizNonTaxCar,
}: {
  wizNonTaxFood: number;
  setWizNonTaxFood: (v: number) => void;
  wizHasCarAllowance: boolean;
  setWizHasCarAllowance: (v: boolean) => void;
  wizNonTaxCar: number;
  setWizNonTaxCar: (v: number) => void;
}) {
  return (
    <div className="space-y-4">
      {/* 식대 */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700">식대</label>
          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">
            월 20만원 비과세 한도
          </span>
        </div>
        <div className="relative">
          <input
            type="number"
            value={wizNonTaxFood}
            onChange={e => setWizNonTaxFood(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full rounded-xl border border-slate-200 p-2.5 pr-8 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
            원
          </span>
        </div>
      </div>
      {/* 자가운전보조금 */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={wizHasCarAllowance}
              onChange={e => setWizHasCarAllowance(e.target.checked)}
              className="h-3.5 w-3.5 rounded text-blue-600 focus:ring-blue-500"
            />
            자가운전보조금
          </label>
          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">
            월 20만원 비과세 한도
          </span>
        </div>
        {wizHasCarAllowance ? (
          <div className="animate-in fade-in relative duration-155">
            <input
              type="number"
              value={wizNonTaxCar}
              onChange={e => setWizNonTaxCar(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-xl border border-slate-200 p-2.5 pr-8 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
              원
            </span>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-100/70 py-2 text-center text-[10px] font-medium text-slate-400">
            자가운전보조금 미지급
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────── 공통: 추가 수당 섹션 내용 ────────── */
function AllowanceContent({
  wizOvertimeAllowance,
  setWizOvertimeAllowance,
  wizPositionAllowance,
  setWizPositionAllowance,
  wizOtherAllowance,
  setWizOtherAllowance,
}: {
  wizOvertimeAllowance: number;
  setWizOvertimeAllowance: (v: number) => void;
  wizPositionAllowance: number;
  setWizPositionAllowance: (v: number) => void;
  wizOtherAllowance: number;
  setWizOtherAllowance: (v: number) => void;
}) {
  const items = [
    {
      label: '연장근로수당',
      value: wizOvertimeAllowance,
      set: setWizOvertimeAllowance,
      hint: '주 40시간 이하인 경우 선택사항',
    },
    { label: '직책수당', value: wizPositionAllowance, set: setWizPositionAllowance },
    { label: '기타수당', value: wizOtherAllowance, set: setWizOtherAllowance },
  ];
  return (
    <div className="space-y-3">
      {items.map(({ label, value, set, hint }) => (
        <div key={label}>
          <label className="mb-1 block text-xs font-bold text-slate-600">{label}</label>
          <div className="relative">
            <input
              type="number"
              value={value}
              onChange={e => set(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="0"
              className="w-full rounded-xl border border-slate-200 p-2.5 pr-8 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
              원
            </span>
          </div>
          {hint && <p className="mt-0.5 text-[10px] text-slate-400">{hint}</p>}
        </div>
      ))}
    </div>
  );
}

/* ────────── 공통: 경업금지 약정 섹션 내용 ────────── */
function NonCompeteContent({
  wizHasNonCompete,
  setWizHasNonCompete,
  wizNonCompetePeriod,
  setWizNonCompetePeriod,
  wizNonCompeteRange,
  setWizNonCompeteRange,
  wizNonCompeteAmount,
  setWizNonCompeteAmount,
  wizSalaryAmount,
}: {
  wizHasNonCompete: boolean;
  setWizHasNonCompete: (v: boolean) => void;
  wizNonCompetePeriod: string;
  setWizNonCompetePeriod: (v: string) => void;
  wizNonCompeteRange: string;
  setWizNonCompeteRange: (v: string) => void;
  wizNonCompeteAmount: number;
  setWizNonCompeteAmount: (v: number) => void;
  wizSalaryAmount: number;
}) {
  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={wizHasNonCompete}
          onChange={e => setWizHasNonCompete(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-xs font-bold text-slate-700">퇴직 후 경업금지 약정 적용</span>
      </label>
      <p className="pl-6 text-[10px] text-slate-400">
        💡 경업금지 대가는 최소 보장 금액의 약 10%를 권장합니다.
      </p>
      {wizHasNonCompete && (
        <div className="animate-in fade-in ml-6 space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 duration-150">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold text-slate-500">기간</label>
              <select
                value={wizNonCompetePeriod}
                onChange={e => setWizNonCompetePeriod(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
              >
                {['3개월', '6개월', '12개월', '24개월'].map(v => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold text-slate-500">범위</label>
              <select
                value={wizNonCompeteRange}
                onChange={e => setWizNonCompeteRange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
              >
                {['반경 1km', '반경 3km', '반경 5km', '반경 10km'].map(v => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold text-slate-500">
              경업금지 대가 (월)
            </label>
            <div className="relative">
              <input
                type="number"
                value={wizNonCompeteAmount}
                onChange={e => setWizNonCompeteAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pr-8 text-xs font-semibold focus:outline-none"
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
                원
              </span>
            </div>
            <p className="mt-0.5 font-mono text-[10px] font-bold text-slate-400">
              ({numberToKorean(wizNonCompeteAmount)}원)
            </p>
          </div>
          <div className="flex items-start gap-1.5 rounded-xl border border-blue-100 bg-blue-50/50 p-2.5 text-[10px] leading-relaxed text-blue-800">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
            <p>
              기본급 {wizSalaryAmount.toLocaleString()}원의 약 10% ={' '}
              <strong>{Math.round(wizSalaryAmount * 0.1).toLocaleString()}원</strong> 권장
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────── 메인 컴포넌트 ────────── */
export default function Step2Sub3Area() {
  const {
    wizSubStep,
    wizSalaryType,
    wizSalaryApplied,
    wizSalaryAmount,
    wizNonTaxFood,
    wizHasCarAllowance,
    wizNonTaxCar,
    wizPayDay,
    wizOvertimeAllowance,
    wizPositionAllowance,
    wizOtherAllowance,
    wizHasNonCompete,
    wizNonCompetePeriod,
    wizNonCompeteRange,
    wizNonCompeteAmount,
    wizDaysConfig,
    setWizSubStep,
    setWizardStep,
    setWizSalaryType,
    setWizSalaryApplied,
    setWizSalaryAmount,
    setWizNonTaxFood,
    setWizHasCarAllowance,
    setWizNonTaxCar,
    setWizPayDay,
    setWizOvertimeAllowance,
    setWizPositionAllowance,
    setWizOtherAllowance,
    setWizHasNonCompete,
    setWizNonCompetePeriod,
    setWizNonCompeteRange,
    setWizNonCompeteAmount,
  } = useWizaredStore();

  const [openSection, setOpenSection] = useState<string | null>(null);
  const [localPercent, setLocalPercent] = useState(30);

  const toggleSection = (key: string) => setOpenSection(prev => (prev === key ? null : key));

  /* ── 주당 소정근로 계산 ── */
  const calculateDailyHours = (start: string, end: string, breakStr: string): number => {
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    const totalMinutes = eH * 60 + eM - (sH * 60 + sM);
    let breakMinutes = 0;
    if (breakStr === '30분') breakMinutes = 30;
    else if (breakStr === '1시간') breakMinutes = 60;
    else if (breakStr === '1.5시간') breakMinutes = 90;
    else if (breakStr === '2시간') breakMinutes = 120;
    return Math.max(0, (totalMinutes - breakMinutes) / 60);
  };

  const weeklyHours = parseFloat(
    Object.values(wizDaysConfig)
      .reduce(
        (sum, conf) =>
          sum +
          (conf.enabled ? calculateDailyHours(conf.startTime, conf.endTime, conf.breakTime) : 0),
        0
      )
      .toFixed(1)
  );
  const hasWeeklyRestAllowance = weeklyHours >= 15;

  /* ── 비율제 최소보장금액 ── */
  const minMonthlyWage = Math.round(MIN_WAGE * weeklyHours * 4.345);
  const weeklyRestPay = hasWeeklyRestAllowance
    ? Math.round((weeklyHours / 40) * 8 * MIN_WAGE * 4.345)
    : 0;
  const minGuarantee = minMonthlyWage + weeklyRestPay;

  /* ── 시간당 임금 계산 및 최저임금 적법성 검사 ── */
  const monthlyWorkingHours = parseFloat(
    ((weeklyHours + (hasWeeklyRestAllowance ? (weeklyHours / 40) * 8 : 0)) * 4.345).toFixed(1)
  );

  const hourlyWage =
    wizSalaryType === 'hourly'
      ? wizSalaryAmount
      : monthlyWorkingHours > 0
        ? Math.round(
            (wizSalaryAmount +
              wizPositionAllowance +
              wizOtherAllowance -
              (wizHasNonCompete ? wizNonCompeteAmount : 0) -
              wizOvertimeAllowance) /
              monthlyWorkingHours
          )
        : 0;

  const isMinimumWageCompliant = hourlyWage >= MIN_WAGE;

  const MinimumWageWarning = () => {
    if (isMinimumWageCompliant) return null;
    return (
      <div className="animate-in fade-in flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[11px] leading-relaxed text-red-800 duration-150">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
        <div>
          <p className="font-extrabold text-red-900">최저임금 미달 경고</p>
          <p className="mt-0.5 font-medium text-slate-600">
            {wizSalaryType === 'hourly' ? (
              <>
                입력하신 시급(<strong>{wizSalaryAmount.toLocaleString()}원</strong>)이 2026년
                최저시급(<strong>{MIN_WAGE.toLocaleString()}원</strong>)보다 낮습니다.
              </>
            ) : (
              <>
                산식으로 계산된 시간당 임금이 <strong>{hourlyWage.toLocaleString()}원</strong>으로,
                2026년 최저시급(<strong>{MIN_WAGE.toLocaleString()}원</strong>)보다 낮습니다.
                <span className="mt-1 block text-[10px] font-normal text-slate-500">
                  ※ 산식: (기본급 + 고정 식대/수당 - 경업금지수당 - 연장수당) / 월 소정근로시간 (
                  {monthlyWorkingHours}시간)
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    );
  };

  /* ── 예상 실지급액 ── */
  const additionalAllowances =
    wizSalaryType === 'monthly' || wizSalaryType === 'fixed'
      ? wizOvertimeAllowance + wizPositionAllowance + wizOtherAllowance
      : 0;

  const expectedSalary =
    wizSalaryType === 'monthly' || wizSalaryType === 'fixed'
      ? wizSalaryAmount + additionalAllowances
      : Math.round(
          wizSalaryAmount * weeklyHours * 4.345 +
            (hasWeeklyRestAllowance ? (weeklyHours / 40) * 8 * wizSalaryAmount * 4.345 : 0) +
            wizNonTaxFood +
            (wizHasCarAllowance ? wizNonTaxCar : 0)
        );

  /* ── 유형 선택 핸들러 ── */
  const handleTypeSelect = (type: 'monthly' | 'fixed' | 'hourly') => {
    setWizSalaryType(type);
    if (type === 'monthly') {
      setWizSalaryAmount(2400000);
      setWizNonTaxFood(200000);
    } else if (type === 'fixed') {
      setWizSalaryAmount(minGuarantee || 1683296);
      setWizNonTaxFood(200000);
    } else {
      setWizSalaryAmount(MIN_WAGE);
      setWizNonTaxFood(0);
    }
    setWizSalaryApplied(true);
    setOpenSection(null);
  };

  const TYPE_META = [
    {
      key: 'monthly' as const,
      label: '고정급',
      sub: '월급제',
      emoji: '💼',
      color: 'blue',
    },
    {
      key: 'fixed' as const,
      label: '비율제',
      sub: '인센티브',
      emoji: '📊',
      color: 'violet',
    },
    {
      key: 'hourly' as const,
      label: '시급제',
      sub: '단시간',
      emoji: '⏱',
      color: 'amber',
    },
  ] as const;

  const colorMap = {
    blue: {
      active: 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100',
      inactive:
        'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50/55',
    },
    violet: {
      active: 'border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-100',
      inactive:
        'border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-slate-50/55',
    },
    amber: {
      active: 'border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-50',
      inactive:
        'border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-slate-50/55',
    },
  };

  /* ── 아코디언 뱃지 동적 계산 ── */
  const nonTaxParts = [];
  if (wizNonTaxFood > 0) nonTaxParts.push(`식대 ${wizNonTaxFood.toLocaleString()}원`);
  if (wizHasCarAllowance && wizNonTaxCar > 0) {
    nonTaxParts.push(`자가운전 ${wizNonTaxCar.toLocaleString()}원`);
  }
  const nonTaxBadge = nonTaxParts.join(' · ') || '미설정';

  const allowanceParts = [];
  if (wizOvertimeAllowance > 0) {
    allowanceParts.push(`연장 ${wizOvertimeAllowance.toLocaleString()}원`);
  }
  if (wizPositionAllowance > 0) {
    allowanceParts.push(`직책 ${wizPositionAllowance.toLocaleString()}원`);
  }
  if (wizOtherAllowance > 0) {
    allowanceParts.push(`기타 ${wizOtherAllowance.toLocaleString()}원`);
  }
  const allowanceBadge = allowanceParts.join(' · ') || '미설정';

  const nonCompeteBadge = wizHasNonCompete
    ? `${wizNonCompeteAmount.toLocaleString()}원 (${wizNonCompetePeriod})`
    : '미적용';

  /* ── 공통 props ── */
  const nonTaxProps = {
    wizNonTaxFood,
    setWizNonTaxFood,
    wizHasCarAllowance,
    setWizHasCarAllowance,
    wizNonTaxCar,
    setWizNonTaxCar,
  };
  const allowanceProps = {
    wizOvertimeAllowance,
    setWizOvertimeAllowance,
    wizPositionAllowance,
    setWizPositionAllowance,
    wizOtherAllowance,
    setWizOtherAllowance,
  };
  const nonCompeteProps = {
    wizHasNonCompete,
    setWizHasNonCompete,
    wizNonCompetePeriod,
    setWizNonCompetePeriod,
    wizNonCompeteRange,
    setWizNonCompeteRange,
    wizNonCompeteAmount,
    setWizNonCompeteAmount,
    wizSalaryAmount,
  };

  /* ── 예상 실지급 요약 카드 (Premium 디자인 개선) ── */
  const SummaryCard = () => {
    const nonTaxTotal = wizNonTaxFood + (wizHasCarAllowance ? wizNonTaxCar : 0);
    const taxableBase =
      wizSalaryType === 'monthly' || wizSalaryType === 'fixed'
        ? Math.max(0, wizSalaryAmount - nonTaxTotal)
        : Math.round(
            wizSalaryAmount * weeklyHours * 4.345 +
              (hasWeeklyRestAllowance ? (weeklyHours / 40) * 8 * wizSalaryAmount * 4.345 : 0)
          );

    return (
      <div className="border-slate-150 rounded-2xl border bg-slate-50 p-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            실지급 시뮬레이션
          </span>
          <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
            세전
          </span>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-slate-650 text-xs font-bold">최종 예상 실수령액</span>
          <span className="text-xl font-black text-blue-600">
            {expectedSalary.toLocaleString()}원
          </span>
        </div>
        <div className="mt-2.5 space-y-1.5 border-t border-dashed border-slate-200 pt-2.5 text-[10px] text-slate-500">
          {wizSalaryType !== 'hourly' && (
            <div className="flex justify-between">
              <span className="text-slate-450">과세 대상 기본급</span>
              <span className="font-extrabold text-slate-700">
                {taxableBase.toLocaleString()}원
              </span>
            </div>
          )}
          {wizSalaryType === 'hourly' && (
            <div className="flex justify-between">
              <span className="text-slate-450">과세 대상 기본근로수당</span>
              <span className="font-extrabold text-slate-700">
                {taxableBase.toLocaleString()}원
              </span>
            </div>
          )}
          {wizNonTaxFood > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-450">비과세 식대 (급여 포함)</span>
              <span className="font-extrabold text-slate-700">
                {wizNonTaxFood.toLocaleString()}원
              </span>
            </div>
          )}
          {wizHasCarAllowance && wizNonTaxCar > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-450">비과세 자가운전 (급여 포함)</span>
              <span className="font-extrabold text-slate-700">
                {wizNonTaxCar.toLocaleString()}원
              </span>
            </div>
          )}
          {additionalAllowances > 0 && (
            <div className="flex justify-between border-t border-slate-100 pt-1.5">
              <span className="text-slate-450">추가 수당 (연장/직책/기타)</span>
              <span className="text-emerald-650 font-extrabold">
                +{additionalAllowances.toLocaleString()}원
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-top-2 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300">
      {/* 아코디언 헤더 */}
      <button
        type="button"
        onClick={() => setWizSubStep(3)}
        className={`flex w-full items-center justify-between p-5 text-left transition-all ${
          wizSubStep === 3 ? 'border-b border-slate-100 bg-slate-50/80' : 'hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
              wizSubStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            3
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">💰 급여 형태 및 금액 설정</h3>
            {wizSubStep !== 3 && wizSalaryApplied && (
              <p className="mt-1 text-[11px] font-semibold text-slate-500">
                {wizSalaryType === 'hourly'
                  ? '시급제'
                  : wizSalaryType === 'monthly'
                    ? '고정급'
                    : '비율제'}{' '}
                · {wizSalaryAmount.toLocaleString()}원 · 예상 {expectedSalary.toLocaleString()}원
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              wizSubStep === 3 ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {wizSubStep === 3 ? '작성 중' : '완료'}
          </span>
          {wizSubStep === 3 ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* 아코디언 바디 */}
      {wizSubStep === 3 && (
        <div className="space-y-5 p-5">
          {/* ── 선택 상태 or 빠른 유형 선택 칩 ── */}
          {!wizSalaryApplied ? (
            <div>
              <p className="mb-2 text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
                급여 방식 선택
              </p>
              <div className="flex gap-2">
                {TYPE_META.map(({ key, label, sub, emoji, color }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTypeSelect(key)}
                    className={`flex flex-1 flex-col items-center rounded-2xl border-2 py-3 transition-all ${
                      colorMap[color].inactive
                    }`}
                  >
                    <span className="text-base">{emoji}</span>
                    <span className="mt-0.5 text-xs font-black">{label}</span>
                    <span className="text-[9px] font-semibold text-slate-400">{sub}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/30 p-3 px-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-slate-500">선택된 급여 방식:</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white shadow-sm">
                  {wizSalaryType === 'monthly'
                    ? '💼 고정급 (월급제)'
                    : wizSalaryType === 'fixed'
                      ? '📊 비율제 (인센티브)'
                      : '⏱ 시급제'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setWizSalaryApplied(false)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600 transition-all hover:bg-slate-50"
              >
                변경
              </button>
            </div>
          )}

          {/* ══════════ 고정급 (월급제) ══════════ */}
          {wizSalaryApplied && wizSalaryType === 'monthly' && (
            <div className="animate-in fade-in space-y-3 duration-200">
              {/* 월급 입력 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">월 급여액</label>
                <div className="relative">
                  <input
                    type="number"
                    value={wizSalaryAmount}
                    onChange={e => setWizSalaryAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 pr-8 text-lg font-black text-slate-900 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm font-bold text-slate-400">
                    원
                  </span>
                </div>
                <p className="font-mono text-[11px] font-bold text-slate-400">
                  {numberToKorean(wizSalaryAmount)}원
                </p>
                <MinimumWageWarning />
              </div>

              {/* 급여일 */}
              <PayDaySelector value={wizPayDay} onChange={setWizPayDay} />

              {/* 접힌 섹션들 */}
              <SectionAccordion
                title="비과세 항목"
                sectionKey="nontax"
                openSection={openSection}
                onToggle={toggleSection}
                badge={nonTaxBadge}
              >
                <NonTaxContent {...nonTaxProps} />
              </SectionAccordion>

              <SectionAccordion
                title="추가 수당"
                sectionKey="allowance"
                openSection={openSection}
                onToggle={toggleSection}
                badge={allowanceBadge}
              >
                <AllowanceContent {...allowanceProps} />
              </SectionAccordion>

              <SectionAccordion
                title="경업금지 약정"
                sectionKey="noncompete"
                openSection={openSection}
                onToggle={toggleSection}
                badge={nonCompeteBadge}
              >
                <NonCompeteContent {...nonCompeteProps} />
              </SectionAccordion>

              {/* 통계 */}
              <SummaryCard />
            </div>
          )}

          {/* ══════════ 비율제 (인센티브) ══════════ */}
          {wizSalaryApplied && wizSalaryType === 'fixed' && (
            <div className="animate-in fade-in space-y-3 duration-200">
              {/* 비율 입력 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">매출액 대비 지급 비율</label>
                <div className="flex gap-2">
                  {[20, 25, 30, 35, 40].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setLocalPercent(p)}
                      className={`flex-1 rounded-xl border-2 py-2 text-xs font-bold transition-all ${
                        localPercent === p
                          ? 'border-violet-600 bg-violet-600 text-white shadow-sm shadow-violet-100'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300'
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">직접 입력:</span>
                  <div className="relative w-24">
                    <input
                      type="number"
                      value={localPercent}
                      onChange={e =>
                        setLocalPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 pr-6 text-xs font-black focus:outline-none"
                    />
                    <span className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs font-bold text-slate-400">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* 기본급 (최소보장금액) */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-sm">
                <span className="text-[9px] font-black tracking-widest text-indigo-500 uppercase">
                  기본급 · 최소보장금액
                </span>
                <div className="mt-2 space-y-2 text-[11px] font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>
                      최저임금 {MIN_WAGE.toLocaleString()}원 × {weeklyHours}H × 4.345
                    </span>
                    <span className="font-extrabold text-slate-800">
                      {minMonthlyWage.toLocaleString()}원
                    </span>
                  </div>
                  {hasWeeklyRestAllowance && (
                    <div className="flex justify-between">
                      <span>주휴수당</span>
                      <span className="font-extrabold text-emerald-600">
                        +{weeklyRestPay.toLocaleString()}원
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-xs">
                    <span className="text-slate-850 font-black">최소보장금액</span>
                    <span className="text-sm font-black text-blue-600">
                      {minGuarantee.toLocaleString()}원
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-[9px] leading-normal text-slate-400">
                  💡 인센티브 정산액이 최소보장금액 미만일 경우 차액을 보전해야 합니다.
                </p>
              </div>
              <MinimumWageWarning />

              {/* 급여일 */}
              <PayDaySelector value={wizPayDay} onChange={setWizPayDay} />

              {/* 접힌 섹션들 */}
              <SectionAccordion
                title="비과세 항목"
                sectionKey="nontax"
                openSection={openSection}
                onToggle={toggleSection}
                badge={nonTaxBadge}
              >
                <NonTaxContent {...nonTaxProps} />
              </SectionAccordion>

              <SectionAccordion
                title="추가 수당"
                sectionKey="allowance"
                openSection={openSection}
                onToggle={toggleSection}
                badge={allowanceBadge}
              >
                <AllowanceContent {...allowanceProps} />
              </SectionAccordion>

              <SectionAccordion
                title="경업금지 약정"
                sectionKey="noncompete"
                openSection={openSection}
                onToggle={toggleSection}
                badge={nonCompeteBadge}
              >
                <NonCompeteContent {...nonCompeteProps} />
              </SectionAccordion>

              {/* 통계 */}
              <SummaryCard />
            </div>
          )}

          {/* ══════════ 시급제 ══════════ */}
          {wizSalaryApplied && wizSalaryType === 'hourly' && (
            <div className="animate-in fade-in space-y-3 duration-200">
              {/* 시급 입력 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">시급</label>
                <div className="relative">
                  <input
                    type="number"
                    value={wizSalaryAmount}
                    onChange={e => setWizSalaryAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 pr-8 text-lg font-black text-slate-900 focus:ring-2 focus:ring-amber-100 focus:outline-none"
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm font-bold text-slate-400">
                    원
                  </span>
                </div>
                {isMinimumWageCompliant ? (
                  <p className="mt-1 text-[10px] font-semibold text-slate-400">
                    2026년 최저임금 {MIN_WAGE.toLocaleString()}원 이상 ✓
                  </p>
                ) : (
                  <MinimumWageWarning />
                )}
              </div>

              {/* 급여일 */}
              <PayDaySelector value={wizPayDay} onChange={setWizPayDay} />
            </div>
          )}

          {/* ── 이전 / 완료 버튼 ── */}
          {wizSalaryApplied && (
            <div className="flex justify-end border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setWizSubStep(0)}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-100 transition-all hover:bg-blue-700"
              >
                <span>다음</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
