import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Check, ChevronDown, ChevronUp, Info } from 'lucide-react';
import React, { useState } from 'react';
import { numberToKorean } from '../../../utils';
import { useWizaredStore } from '../state';
import Accordion from '../_component/Accordion';

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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300/80">
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
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-slate-100 bg-slate-50/30"
          >
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
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
          className="h-[34px] w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
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
            type="text"
            value={wizNonTaxFood === 0 ? '' : wizNonTaxFood.toLocaleString()}
            onChange={e => {
              const raw = e.target.value.replace(/[^0-9]/g, '');
              setWizNonTaxFood(Math.max(0, parseInt(raw) || 0));
            }}
            className="w-full rounded-xl border border-slate-200 p-2.5 pr-8 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
            placeholder="0"
          />
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
            원
          </span>
        </div>
      </div>
      {/* 자가운전보조금 */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700">자가운전보조금</label>
          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">
            월 20만원 비과세 한도
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={wizNonTaxCar === 0 ? '' : wizNonTaxCar.toLocaleString()}
            onChange={e => {
              const raw = e.target.value.replace(/[^0-9]/g, '');
              const val = Math.max(0, parseInt(raw) || 0);
              setWizNonTaxCar(val);
              setWizHasCarAllowance(val > 0);
            }}
            className="w-full rounded-xl border border-slate-200 p-2.5 pr-8 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
            placeholder="0"
          />
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
            원
          </span>
        </div>
      </div>
    </div>
  );
}

function AllowanceContent({
  wizOvertimeAllowance,
  setWizOvertimeAllowance,
  wizPositionAllowance,
  setWizPositionAllowance,
  wizOtherAllowance,
  setWizOtherAllowance,
  wizOtherAllowanceName,
  setWizOtherAllowanceName,
}: {
  wizOvertimeAllowance: number;
  setWizOvertimeAllowance: (v: number) => void;
  wizPositionAllowance: number;
  setWizPositionAllowance: (v: number) => void;
  wizOtherAllowance: number;
  setWizOtherAllowance: (v: number) => void;
  wizOtherAllowanceName: string;
  setWizOtherAllowanceName: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      {/* 연장근로수당 */}
      <div>
        <label className="mb-1 block text-xs font-bold text-slate-600">연장근로수당</label>
        <div className="relative">
          <input
            type="text"
            value={wizOvertimeAllowance === 0 ? '' : wizOvertimeAllowance.toLocaleString()}
            onChange={e => {
              const raw = e.target.value.replace(/[^0-9]/g, '');
              setWizOvertimeAllowance(Math.max(0, parseInt(raw) || 0));
            }}
            placeholder="0"
            className="w-full rounded-xl border border-slate-200 p-2.5 pr-8 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
            원
          </span>
        </div>
        <p className="mt-0.5 text-[10px] text-slate-400">주 40시간 이하인 경우 선택사항</p>
      </div>

      {/* 직책수당 */}
      <div>
        <label className="mb-1 block text-xs font-bold text-slate-600">직책수당</label>
        <div className="relative">
          <input
            type="text"
            value={wizPositionAllowance === 0 ? '' : wizPositionAllowance.toLocaleString()}
            onChange={e => {
              const raw = e.target.value.replace(/[^0-9]/g, '');
              setWizPositionAllowance(Math.max(0, parseInt(raw) || 0));
            }}
            placeholder="0"
            className="w-full rounded-xl border border-slate-200 p-2.5 pr-8 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
            원
          </span>
        </div>
      </div>

      {/* 기타수당 */}
      <div className="space-y-2">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600">기타수당</label>
          <div className="relative">
            <input
              type="text"
              value={wizOtherAllowance === 0 ? '' : wizOtherAllowance.toLocaleString()}
              onChange={e => {
                const raw = e.target.value.replace(/[^0-9]/g, '');
                const val = Math.max(0, parseInt(raw) || 0);
                setWizOtherAllowance(val);
              }}
              placeholder="0"
              className="w-full rounded-xl border border-slate-200 p-2.5 pr-8 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
              원
            </span>
          </div>
        </div>

        {wizOtherAllowance > 0 && (
          <div className="animate-in fade-in space-y-1 duration-150">
            <label className="block text-[10px] font-bold text-slate-500">기타수당 명칭</label>
            <input
              type="text"
              value={wizOtherAllowanceName}
              onChange={e => setWizOtherAllowanceName(e.target.value)}
              placeholder="예: 식대 지원, 차량보조"
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────── 공통: 경업금지 약정 섹션 내용 ────────── */
/* ────────── 공통: 경업금지 약정 한 줄 입력바 ────────── */
function NonCompeteBar({
  wizHasNonCompete,
  setWizHasNonCompete,
  wizNonCompetePeriod,
  setWizNonCompetePeriod,
  wizNonCompeteRange,
  setWizNonCompeteRange,
  wizNonCompeteAmount,
  setWizNonCompeteAmount,
  wizSalaryAmount = 0,
}: {
  wizHasNonCompete: boolean;
  setWizHasNonCompete: (v: boolean) => void;
  wizNonCompetePeriod: string;
  setWizNonCompetePeriod: (v: string) => void;
  wizNonCompeteRange: string;
  setWizNonCompeteRange: (v: string) => void;
  wizNonCompeteAmount: number;
  setWizNonCompeteAmount: (v: number) => void;
  wizSalaryAmount?: number;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/20 p-3 text-xs">
      <label className="flex cursor-pointer items-center gap-2 font-bold text-slate-700">
        <input
          type="checkbox"
          checked={wizHasNonCompete}
          onChange={e => setWizHasNonCompete(e.target.checked)}
          className="text-indigo-650 h-4 w-4 rounded border-slate-300 focus:ring-indigo-500"
        />
        <span>퇴직 후 경업금지 약정 적용</span>
      </label>
      {wizHasNonCompete && (
        <div className="animate-in fade-in flex flex-wrap items-center gap-2 duration-200">
          <select
            value={wizNonCompetePeriod}
            onChange={e => setWizNonCompetePeriod(e.target.value)}
            className="focus:ring-indigo-150 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold focus:ring-1 focus:outline-none"
          >
            {['3개월', '6개월', '12개월', '24개월'].map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <select
            value={wizNonCompeteRange}
            onChange={e => setWizNonCompeteRange(e.target.value)}
            className="focus:ring-indigo-150 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold focus:ring-1 focus:outline-none"
          >
            {['반경 1km', '반경 3km', '반경 5km', '반경 10km'].map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <div className="relative w-28">
            <input
              type="text"
              value={wizNonCompeteAmount === 0 ? '' : wizNonCompeteAmount.toLocaleString()}
              onChange={e => {
                const raw = e.target.value.replace(/[^0-9]/g, '');
                setWizNonCompeteAmount(Math.max(0, parseInt(raw) || 0));
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 pr-6 text-[11px] font-semibold focus:outline-none"
              placeholder="월 대가"
            />
            <span className="absolute top-1/2 right-2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
              원
            </span>
          </div>
          {wizSalaryAmount > 0 && (
            <button
              type="button"
              onClick={() => setWizNonCompeteAmount(Math.round(wizSalaryAmount * 0.1))}
              className="shrink-0 cursor-pointer text-[10px] font-extrabold text-indigo-500 transition-colors hover:text-indigo-700 hover:underline"
              title="클릭 시 권장 대가 적용"
            >
              (권장: 약 {Math.round(wizSalaryAmount * 0.1).toLocaleString()}원)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────── 메인 컴포넌트 ────────── */
export default function Step2Sub3Area({ hasWarning = false }: { hasWarning?: boolean }) {
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
    wizOtherAllowanceName,
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
    setWizOtherAllowanceName,
    setWizHasNonCompete,
    setWizNonCompetePeriod,
    setWizNonCompeteRange,
    setWizNonCompeteAmount,
  } = useWizaredStore();

  const [openSection, setOpenSection] = useState<string | null>(null);
  const [localPercent, setLocalPercent] = useState(30);
  const [showSimulation, setShowSimulation] = useState(false);
  const [showGuaranteeDetail, setShowGuaranteeDetail] = useState(false);

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
    allowanceParts.push(
      `${wizOtherAllowanceName || '기타'} ${wizOtherAllowance.toLocaleString()}원`
    );
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
    wizOtherAllowanceName,
    setWizOtherAllowanceName,
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
  const renderSummaryCard = () => {
    const nonTaxTotal = wizNonTaxFood + (wizHasCarAllowance ? wizNonTaxCar : 0);
    const taxableBase =
      wizSalaryType === 'monthly' || wizSalaryType === 'fixed'
        ? Math.max(0, wizSalaryAmount - nonTaxTotal - (wizHasNonCompete ? wizNonCompeteAmount : 0))
        : Math.round(
            wizSalaryAmount * weeklyHours * 4.345 +
              (hasWeeklyRestAllowance ? (weeklyHours / 40) * 8 * wizSalaryAmount * 4.345 : 0)
          );

    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200">
        <button
          type="button"
          onClick={() => setShowSimulation(!showSimulation)}
          className="flex w-full items-center justify-between px-4 py-3 text-left transition-all hover:bg-slate-50/50"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700">실지급 시뮬레이션</span>
            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700">
              세전
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black text-blue-600">
              최종 예상 실수령액 {expectedSalary.toLocaleString()}원
            </span>
            {showSimulation ? (
              <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            )}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {showSimulation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-slate-100 bg-slate-50/30 text-[10px] text-slate-500"
            >
              <div className="space-y-1.5 p-4">
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
                {wizHasNonCompete && wizNonCompeteAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-450">경업금지수당 (급여 포함)</span>
                    <span className="font-extrabold text-slate-700">
                      {wizNonCompeteAmount.toLocaleString()}원
                    </span>
                  </div>
                )}
                {additionalAllowances > 0 && (
                  <div className="flex justify-between border-t border-slate-100 pt-1.5">
                    <span className="text-slate-450">추가 수당 (연장/직책/기타)</span>
                    <span className="font-extrabold text-emerald-600">
                      +{additionalAllowances.toLocaleString()}원
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <Accordion
      step={3}
      title="급여 형태 및 금액 설정"
      isOpen={wizSubStep === 3}
      isDone={wizSalaryApplied}
      activeColor="indigo"
      onClick={() => setWizSubStep(3)}
      hasWarning={hasWarning}
      summary={
        wizSalaryApplied ? (
          <div className="animate-in fade-in flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700">
              {wizSalaryType === 'monthly'
                ? '고정급(월급제)'
                : wizSalaryType === 'fixed'
                  ? '비율제(인센티브)'
                  : '시급제'}
            </span>
            <span className="ml-1 text-[10px] font-extrabold text-slate-800">
              {wizSalaryType === 'fixed' ? (
                <>
                  최소보장 {minGuarantee.toLocaleString()}원 ({localPercent}%)
                </>
              ) : (
                <>{wizSalaryAmount === 0 ? '0' : wizSalaryAmount.toLocaleString()}원</>
              )}
            </span>
            <span
              role="button"
              onClick={e => {
                e.stopPropagation();
                setWizSalaryApplied(false);
              }}
              className="ml-1.5 cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 transition-all hover:bg-slate-50"
            >
              변경
            </span>
          </div>
        ) : null
      }
    >
      <div className="flex flex-col">
        <div className="max-h-[460px] space-y-4 overflow-y-auto pr-1.5">
          {/* ── 선택 상태 or 빠른 유형 선택 칩 ── */}
          {!wizSalaryApplied && (
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
          )}

          {/* ══════════ 고정급 (월급제) ══════════ */}
          {wizSalaryApplied && wizSalaryType === 'monthly' && (
            <div className="animate-in fade-in space-y-4 duration-200">
              {/* 필수 설정 */}
              <div className="space-y-2">
                <div className="text-slate-450 flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase">
                  <span>필수 설정</span>
                  <span className="rounded bg-rose-50 px-1 py-0.5 text-[9px] font-bold text-rose-600 normal-case">
                    필수
                  </span>
                </div>
                {/* 월급 입력 & 급여일 (한 줄 배치) */}
                <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-3">
                  <div className="space-y-1 sm:col-span-2">
                    <div className="mb-1 flex items-baseline justify-between">
                      <label className="block text-xs font-bold text-slate-700">월 급여액</label>
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        {numberToKorean(wizSalaryAmount)}원
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={wizSalaryAmount === 0 ? '' : wizSalaryAmount.toLocaleString()}
                        onChange={e => {
                          const raw = e.target.value.replace(/[^0-9]/g, '');
                          setWizSalaryAmount(Math.max(0, parseInt(raw) || 0));
                        }}
                        className="h-[34px] w-full rounded-xl border border-slate-200 bg-white px-3 text-base font-black text-slate-900 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        placeholder="0"
                      />
                      <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
                        원
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <PayDaySelector value={wizPayDay} onChange={setWizPayDay} />
                  </div>
                </div>
              </div>

              {/* 선택 설정 */}
              <div className="space-y-2">
                <div className="text-slate-455 text-[10px] font-black tracking-wider uppercase">
                  선택 설정
                </div>
                {/* 접힌 섹션들 (한 줄 배치) */}
                <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
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
                </div>

                {/* 경업금지 약정 한 줄 입력바 */}
                <NonCompeteBar {...nonCompeteProps} />
              </div>

              {/* 실지급 요약 */}
              <div className="space-y-2">
                <div className="text-slate-455 text-[10px] font-black tracking-wider uppercase">
                  실지급 요약
                </div>
                {renderSummaryCard()}
              </div>
            </div>
          )}

          {/* ══════════ 비율제 (인센티브) ══════════ */}
          {wizSalaryApplied && wizSalaryType === 'fixed' && (
            <div className="animate-in fade-in space-y-4 duration-200">
              {/* 필수 설정 */}
              <div className="space-y-2">
                <div className="text-slate-450 flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase">
                  <span>필수 설정</span>
                  <span className="rounded bg-rose-50 px-1 py-0.5 text-[9px] font-bold text-rose-600 normal-case">
                    필수
                  </span>
                </div>
                {/* 비율 입력 & 급여일 (한 줄 배치) */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">
                      매출액 대비 지급 비율
                    </label>
                    <div className="flex gap-1.5">
                      {[20, 30, 40].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setLocalPercent(p)}
                          className={`flex h-[34px] flex-1 items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                            localPercent === p
                              ? 'border-violet-600 bg-violet-600 text-white shadow-sm'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300'
                          }`}
                        >
                          {p}%
                        </button>
                      ))}
                      {localPercent !== 20 && localPercent !== 30 && localPercent !== 40 ? (
                        <div
                          onClick={e =>
                            (
                              e.currentTarget.querySelector('input') as HTMLInputElement | null
                            )?.focus()
                          }
                          className="relative flex h-[34px] flex-1 cursor-text items-center justify-center rounded-xl border border-violet-600 bg-violet-600 text-white shadow-sm"
                        >
                          <input
                            type="text"
                            value={localPercent === 0 ? '' : localPercent.toString()}
                            onChange={e => {
                              const raw = e.target.value.replace(/[^0-9]/g, '');
                              const val = Math.min(100, parseInt(raw) || 0);
                              setLocalPercent(val);
                            }}
                            className="h-4 w-12 border-b border-white/50 bg-transparent px-0 py-0 text-center text-xs font-black text-white focus:outline-none"
                            autoFocus
                          />
                          <span className="ml-0.5 text-[10px] font-bold text-white/80 select-none">
                            %
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setLocalPercent(25)}
                          className="flex h-[34px] flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 transition-all hover:border-violet-300"
                        >
                          직접 입력
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <PayDaySelector value={wizPayDay} onChange={setWizPayDay} />
                  </div>
                </div>

                {/* 기본급 (최소보장금액) */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setShowGuaranteeDetail(!showGuaranteeDetail)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-all hover:bg-slate-50/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-700">최소보장금액</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-blue-600">
                        {minGuarantee.toLocaleString()}원
                      </span>
                      {showGuaranteeDetail ? (
                        <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {showGuaranteeDetail && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="text-slate-650 overflow-hidden border-t border-slate-100 bg-slate-50/30 text-[11px] font-medium"
                      >
                        <div className="space-y-2 p-4">
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
                          <p className="border-t border-slate-200 pt-1.5 text-[9px] leading-normal text-slate-400">
                            💡 인센티브 정산액이 최소보장금액 미만일 경우 차액을 보전해야 합니다.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 선택 설정 */}
              <div className="space-y-2">
                <div className="text-slate-455 text-[10px] font-black tracking-wider uppercase">
                  선택 설정
                </div>
                {/* 접힌 섹션들 (한 줄 배치) */}
                <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
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
                </div>

                {/* 경업금지 약정 한 줄 입력바 */}
                <NonCompeteBar {...nonCompeteProps} />
              </div>

              {/* 실지급 요약 */}
              <div className="space-y-2">
                <div className="text-slate-455 text-[10px] font-black tracking-wider uppercase">
                  실지급 요약
                </div>
                {renderSummaryCard()}
              </div>
            </div>
          )}

          {/* ══════════ 시급제 ══════════ */}
          {wizSalaryApplied && wizSalaryType === 'hourly' && (
            <div className="animate-in fade-in space-y-4 duration-200">
              {/* 필수 설정 */}
              <div className="space-y-2">
                <div className="text-slate-450 flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase">
                  <span>필수 설정</span>
                  <span className="rounded bg-rose-50 px-1 py-0.5 text-[9px] font-bold text-rose-600 normal-case">
                    필수
                  </span>
                </div>
                {/* 시급 입력 & 급여일 (한 줄 배치) */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="mb-1 block text-xs font-bold text-slate-700">시급</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={wizSalaryAmount === 0 ? '' : wizSalaryAmount.toLocaleString()}
                        onChange={e => {
                          const raw = e.target.value.replace(/[^0-9]/g, '');
                          setWizSalaryAmount(Math.max(0, parseInt(raw) || 0));
                        }}
                        className="h-[34px] w-full rounded-xl border border-slate-200 bg-white px-3 text-base font-black text-slate-900 focus:ring-2 focus:ring-amber-100 focus:outline-none"
                        placeholder="0"
                      />
                      <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
                        원
                      </span>
                    </div>
                    {isMinimumWageCompliant && (
                      <p className="mt-1 text-[10px] font-semibold text-slate-400">
                        2026년 최저임금 {MIN_WAGE.toLocaleString()}원 이상 ✓
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <PayDaySelector value={wizPayDay} onChange={setWizPayDay} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {wizSalaryApplied && (
          <div className="mt-3.5 flex justify-end border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setWizSubStep(0)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800"
            >
              <span>다음</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </Accordion>
  );
}
