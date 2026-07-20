import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Check, ChevronDown, ChevronUp, Info } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { numberToKorean } from '../../../utils';
import { useWizaredStore } from '../state';
import { useStore } from '../../../store/useStore';
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
          className="text-custom-indigo h-4 w-4 rounded border-slate-300 focus:ring-custom-indigo-border"
        />
        <span>퇴직 후 경업금지 약정 적용</span>
      </label>
      {wizHasNonCompete && (
        <div className="animate-in fade-in flex flex-wrap items-center gap-2 duration-200">
          <select
            value={wizNonCompetePeriod}
            onChange={e => setWizNonCompetePeriod(e.target.value)}
            className="focus:ring-custom-indigo-border rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold focus:ring-1 focus:outline-none"
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
            className="focus:ring-custom-indigo-border rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold focus:ring-1 focus:outline-none"
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
              className="shrink-0 cursor-pointer text-[10px] font-extrabold text-custom-indigo transition-colors hover:text-custom-indigo-hover hover:underline"
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

  const { wizCommissionPercent, setWizCommissionPercent } = useStore();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(1);
  const [showSimulation, setShowSimulation] = useState(false);
  const [showGuaranteeDetail, setShowGuaranteeDetail] = useState(false);

  useEffect(() => {
    if (!wizSalaryApplied) {
      setCurrentQ(1);
    }
  }, [wizSalaryApplied]);

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

  /* ── 통계 및 공제액 계산 ── */
  const isHourly = wizSalaryType === 'hourly';
  const basePayForDeduction = isHourly
    ? Math.round(wizSalaryAmount * weeklyHours * 4.345 + (hasWeeklyRestAllowance ? (weeklyHours / 40) * 8 * wizSalaryAmount * 4.345 : 0))
    : wizSalaryAmount;
  const allowanceTotalForDeduction = isHourly ? 0 : (wizPositionAllowance || 0) + (wizOvertimeAllowance || 0) + (wizOtherAllowance || 0);
  const nonCompetePayForDeduction = isHourly ? 0 : (wizHasNonCompete ? wizNonCompeteAmount : 0);
  const grossPayForDeduction = basePayForDeduction + allowanceTotalForDeduction + nonCompetePayForDeduction;

  const nonTaxForDeduction = (wizNonTaxFood || 0) + (wizNonTaxCar || 0);
  const taxableForDeduction = Math.max(0, grossPayForDeduction - nonTaxForDeduction);

  const pensionForDeduction = Math.round(Math.min(5900000, taxableForDeduction) * 0.045);
  const healthForDeduction = Math.round(taxableForDeduction * 0.03545);
  const careForDeduction = Math.round(healthForDeduction * 0.1295);
  const employmentForDeduction = Math.round(taxableForDeduction * 0.009);
  const socialInsuranceForDeduction = pensionForDeduction + healthForDeduction + careForDeduction + employmentForDeduction;

  const getEstimatedTaxForDeduction = (val: number) => {
    if (val <= 1060000) return 0;
    if (val <= 2000000) return (val - 1060000) * 0.015;
    if (val <= 3000000) return 14100 + (val - 2000000) * 0.04;
    if (val <= 4000000) return 54100 + (val - 3000000) * 0.08;
    if (val <= 6000000) return 134100 + (val - 4000000) * 0.15;
    return 434100 + (val - 6000000) * 0.24;
  };
  const incomeTaxForDeduction = Math.round(getEstimatedTaxForDeduction(taxableForDeduction));
  const localTaxForDeduction = Math.round(incomeTaxForDeduction * 0.1);
  const totalTaxForDeduction = incomeTaxForDeduction + localTaxForDeduction;

  const totalDeductionsForDeduction = socialInsuranceForDeduction + totalTaxForDeduction;
  const netPayForDeduction = Math.max(0, grossPayForDeduction - totalDeductionsForDeduction);

  const basePercentForDeduction = Math.max(0, Math.round((basePayForDeduction / grossPayForDeduction) * 100)) || 0;
  const allowancePercentForDeduction = Math.max(0, Math.round((allowanceTotalForDeduction / grossPayForDeduction) * 100)) || 0;
  const nonCompetePercentForDeduction = Math.max(0, Math.round((nonCompetePayForDeduction / grossPayForDeduction) * 100)) || 0;

  const renderSummaryAndStatistics = (showModifyButton: boolean) => {
    return (
      <div className="animate-in fade-in space-y-4 duration-200">
        {/* 요약 리포트 카드 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-[14px] font-bold text-slate-800">급여 설정 요약 및 통계</h4>
            <span className="inline-flex items-center gap-1 rounded-full bg-custom-indigo-bg px-2.5 py-1 text-[10px] font-black text-custom-indigo">
              {wizSalaryType === 'monthly'
                ? '고정급(월급제)'
                : wizSalaryType === 'fixed'
                  ? '비율제(인센티브)'
                  : '시급제'}
            </span>
          </div>

          {/* 입력 항목 요약 */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[11px] font-medium text-slate-600">
            <div className="flex justify-between border-b border-slate-50 pb-1">
              <span className="text-slate-400">기본 금액</span>
              <span className="font-bold text-slate-800">
                {wizSalaryType === 'fixed' ? (
                  <>최소보장 {wizSalaryAmount.toLocaleString()}원 ({wizCommissionPercent}%)</>
                ) : wizSalaryType === 'hourly' ? (
                  <>시급 {wizSalaryAmount.toLocaleString()}원</>
                ) : (
                  <>{wizSalaryAmount.toLocaleString()}원</>
                )}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-1">
              <span className="text-slate-400">급여 지급일</span>
              <span className="font-bold text-slate-800">매월 {wizPayDay}일</span>
            </div>

            {wizSalaryType === 'monthly' && (
              <>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400">비과세 수당</span>
                  <span className="font-bold text-slate-800">
                    {nonTaxForDeduction > 0 ? `${nonTaxForDeduction.toLocaleString()}원` : '없음'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400">경업금지 약정</span>
                  <span className="font-bold text-slate-800">
                    {wizHasNonCompete ? `${wizNonCompeteAmount.toLocaleString()}원` : '없음'}
                  </span>
                </div>
                <div className="col-span-2 flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400">추가 고정수당</span>
                  <span className="font-bold text-slate-800">
                    {allowanceTotalForDeduction > 0 ? `${allowanceTotalForDeduction.toLocaleString()}원` : '없음'}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* 실수령액 요약 카드 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-custom-indigo bg-custom-indigo-bg/70 px-2 py-0.5 rounded-md">
                예상 실수령액 (세후)
              </span>
              <span className="text-xs font-bold text-slate-400">
                세전 총액: {grossPayForDeduction.toLocaleString()}원
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-black text-custom-indigo">
                월 {netPayForDeduction.toLocaleString()}원
              </span>
            </div>

            {/* 세금 공제 상세 */}
            <div className="pt-2 border-t border-custom-indigo-border/50 space-y-1.5 text-[10px] font-bold text-slate-400">
              <div className="flex justify-between">
                <span>4대 보험 공제액</span>
                <span className="text-slate-700">-{socialInsuranceForDeduction.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span>소득세 / 지방소득세</span>
                <span className="text-slate-700">-{totalTaxForDeduction.toLocaleString()}원</span>
              </div>
              {nonTaxForDeduction > 0 && (
                <div className="mt-2 rounded-lg bg-emerald-50/60 border border-emerald-100/50 p-2 text-[9px] font-bold text-emerald-800 leading-normal">
                  💡 비과세 설정({nonTaxForDeduction.toLocaleString()}원)으로 월 약 {Math.round(nonTaxForDeduction * 0.12).toLocaleString()}원의 세금 및 4대보험료를 절감했습니다. (양사 부담 절감액 기준)
                </div>
              )}
            </div>
          </div>

          {/* 급여 구성비 가로 바 차트 */}
          {wizSalaryType === 'monthly' && (
            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/30 p-3">
              <div className="text-[10px] font-bold text-slate-500">급여 구성 비율</div>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div style={{ width: `${basePercentForDeduction}%` }} className="bg-custom-indigo h-full transition-all duration-300" title="기본급" />
                <div style={{ width: `${allowancePercentForDeduction}%` }} className="bg-sky-400 h-full transition-all duration-300" title="고정수당" />
                <div style={{ width: `${nonCompetePercentForDeduction}%` }} className="bg-amber-400 h-full transition-all duration-300" title="경업금지수당" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-[9px] font-bold text-slate-455">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-custom-indigo" />
                  <span>기본급 ({basePercentForDeduction}%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <span>추가수당 ({allowancePercentForDeduction}%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span>경업수당 ({nonCompetePercentForDeduction}%)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {showModifyButton && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setWizSalaryApplied(false)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50  cursor-pointer"
            >
              급여 설정 수정하기
            </button>
          </div>
        )}
      </div>
    );
  };

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
      active: 'border-blue-600 bg-blue-600 text-white  -blue-100',
      inactive:
        'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50/55',
    },
    violet: {
      active: 'border-violet-600 bg-violet-600 text-white  -violet-100',
      inactive:
        'border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-slate-50/55',
    },
    amber: {
      active: 'border-amber-500 bg-amber-500 text-white  -amber-50',
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
            <span className="rounded bg-custom-indigo-bg px-1.5 py-0.5 text-[9px] font-bold text-custom-indigo">
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
                  최소보장 {minGuarantee.toLocaleString()}원 ({wizCommissionPercent}%)
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
          {!wizSalaryApplied && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Progress Header */}
              {(() => {
                const totalQ = wizSalaryType === 'monthly' ? 7 : 4;
                return (
                  <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-[11px] font-bold text-custom-indigo">
                      급여 설정 단계: {currentQ}단계 / {totalQ}단계
                    </span>
                    <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="bg-custom-indigo h-full transition-all duration-300"
                        style={{ width: `${Math.round((currentQ / totalQ) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })()}

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ}
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -10, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4 min-h-[260px] flex flex-col justify-between"
                >
                  {/* --- Question 1: 급여 유형 --- */}
                  {currentQ === 1 && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <h4 className="text-[14px] font-bold text-slate-800 leading-snug">
                          선생님의 급여는 어떤 방식으로 지급되나요?
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {[
                          {
                            key: 'monthly' as const,
                            label: '고정급 (월급제)',
                            sub: '매월 고정된 기본급을 지급받는 가장 일반적인 근로 형태입니다.',
                            emoji: '💼',
                          },
                          {
                            key: 'fixed' as const,
                            label: '비율제 (인센티브)',
                            sub: '수업 매출액에 약정된 비율(%)을 곱해 생산성에 따라 정산받습니다.',
                            emoji: '📈',
                          },
                          {
                            key: 'hourly' as const,
                            label: '시급제 (단시간)',
                            sub: '실제 근무한 시간만큼 시급 단위로 계산하여 매월 정산받습니다.',
                            emoji: '⏱️',
                          },
                        ].map(item => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => {
                              setWizSalaryType(item.key);
                              if (item.key === 'monthly') {
                                setWizSalaryAmount(2400000);
                                setWizNonTaxFood(200000);
                              } else if (item.key === 'fixed') {
                                setWizSalaryAmount(minGuarantee || 1683296);
                                setWizNonTaxFood(200000);
                              } else {
                                setWizSalaryAmount(MIN_WAGE);
                                setWizNonTaxFood(0);
                              }
                              setCurrentQ(2);
                            }}
                            className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                              wizSalaryType === item.key
                                ? 'border-custom-indigo bg-custom-indigo-bg/25 text-slate-900 '
                                : 'border-slate-200 bg-white text-slate-655 hover:border-custom-indigo-border-hover hover:bg-slate-50/50'
                            }`}
                          >
                            <span className="text-xl shrink-0 mt-0.5">{item.emoji}</span>
                            <div className="space-y-0.5">
                              <span className="block text-xs font-bold text-slate-800">{item.label}</span>
                              <span className="block text-[10px] font-semibold text-slate-450 leading-relaxed">
                                {item.sub}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* --- Question 2: 금액 설정 --- */}
                  {currentQ === 2 && (
                    <div className="space-y-3">
                      {wizSalaryType === 'monthly' && (
                        <div className="space-y-2">
                          <h4 className="text-[14px] font-bold text-slate-800 leading-snug">
                            매월 지급할 월 급여액(세전 기본급)은 얼마인가요?
                          </h4>
                          <div className="relative">
                            <input
                              type="text"
                              value={wizSalaryAmount === 0 ? '' : wizSalaryAmount.toLocaleString()}
                              onChange={e => {
                                const raw = e.target.value.replace(/[^0-9]/g, '');
                                setWizSalaryAmount(Math.max(0, parseInt(raw) || 0));
                              }}
                              className="h-[36px] w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-custom-indigo-border focus:outline-none"
                              placeholder="0"
                              autoFocus
                            />
                            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
                              원
                            </span>
                          </div>
                          <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                            <span>{numberToKorean(wizSalaryAmount)}원</span>
                            <span>* 기본 식대 비과세 20만원 포함 자동 계산</span>
                          </div>
                        </div>
                      )}

                      {wizSalaryType === 'fixed' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h4 className="text-[14px] font-bold text-slate-800 leading-snug">
                              매출액 대비 수수료 지급 비율은 몇 %인가요?
                            </h4>
                            <div className="flex gap-2">
                              {[20, 30, 40].map(p => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => setWizCommissionPercent(p)}
                                  className={`h-[34px] flex-1 rounded-xl border text-xs font-bold transition-all ${
                                    wizCommissionPercent === p
                                      ? 'border-custom-indigo bg-custom-indigo text-white '
                                      : 'border-slate-200 bg-white text-slate-655 hover:border-custom-indigo-border-hover'
                                  }`}
                                >
                                  {p}%
                                </button>
                              ))}
                              {wizCommissionPercent !== 20 &&
                              wizCommissionPercent !== 30 &&
                              wizCommissionPercent !== 40 ? (
                                <div className="relative flex h-[34px] flex-1 cursor-text items-center justify-center rounded-xl border border-custom-indigo bg-custom-indigo text-white ">
                                  <input
                                    type="text"
                                    value={wizCommissionPercent === 0 ? '' : wizCommissionPercent.toString()}
                                    onChange={e => {
                                      const raw = e.target.value.replace(/[^0-9]/g, '');
                                      const val = Math.min(100, parseInt(raw) || 0);
                                      setWizCommissionPercent(val);
                                    }}
                                    className="h-4 w-10 border-b border-white/50 bg-transparent px-0 py-0 text-center text-xs font-bold text-white focus:outline-none"
                                    autoFocus
                                  />
                                  <span className="ml-0.5 text-[10px] font-bold text-white/80 select-none">%</span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setWizCommissionPercent(25)}
                                  className="flex h-[34px] flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-650 transition-all hover:border-custom-indigo-border-hover"
                                >
                                  직접 입력
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 border-t border-slate-100 pt-3">
                            <h4 className="text-[13px] font-bold text-slate-800 leading-snug">
                              최소 보장 금액을 설정할까요?
                            </h4>
                            <p className="text-[10px] font-semibold text-slate-455 leading-relaxed">
                              비율제로 급여를 산정하더라도 근로자로 판단 시 최저임금법 준수 의무가 발생할 수 있습니다.
                            </p>
                            <div className="relative">
                              <input
                                type="text"
                                value={wizSalaryAmount === 0 ? '' : wizSalaryAmount.toLocaleString()}
                                onChange={e => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '');
                                  setWizSalaryAmount(Math.max(0, parseInt(raw) || 0));
                                }}
                                className="h-[36px] w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-custom-indigo-border focus:outline-none"
                                placeholder="최소 보장액 입력 (원)"
                              />
                              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
                                원
                              </span>
                            </div>
                            <div className="text-[10px] font-semibold text-slate-400">
                              * 법정 최저 보장 가이드액: {minGuarantee.toLocaleString()}원
                            </div>
                          </div>
                        </div>
                      )}

                      {wizSalaryType === 'hourly' && (
                        <div className="space-y-2">
                          <h4 className="text-[14px] font-bold text-slate-800 leading-snug">
                            시간당 지급할 시급은 얼마인가요?
                          </h4>
                          <div className="relative">
                            <input
                              type="text"
                              value={wizSalaryAmount === 0 ? '' : wizSalaryAmount.toLocaleString()}
                              onChange={e => {
                                const raw = e.target.value.replace(/[^0-9]/g, '');
                                setWizSalaryAmount(Math.max(0, parseInt(raw) || 0));
                              }}
                              className="h-[36px] w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-custom-indigo-border focus:outline-none"
                              placeholder="0"
                              autoFocus
                            />
                            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
                              원
                            </span>
                          </div>
                          <div className="text-[10px] font-semibold text-slate-400">
                            * 2026년 법정 최저시급: {MIN_WAGE.toLocaleString()}원
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- Question 3: 급여 지급일 --- */}
                  {currentQ === 3 && (
                    <div className="space-y-3">
                      <h4 className="text-[14px] font-bold text-slate-800 leading-snug">
                        매월 급여는 언제 지급되나요?
                      </h4>
                      <PayDaySelector value={wizPayDay} onChange={setWizPayDay} />
                      <p className="text-[10px] font-semibold text-slate-450 leading-relaxed">
                        계약서에 지급일이 명시되지 않을 시 근로조건 서면 명시 의무 위반 소지가 될 수 있습니다.
                      </p>
                    </div>
                  )}

                  {/* --- Question 4: 비과세 적용 --- */}
                  {currentQ === 4 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-[14px] font-bold text-slate-800 leading-snug">
                          식대나 자가운전보조금 같은 비과세 수당을 비과세 한도 내에서 적용할까요?
                        </h4>
                        <p className="text-[10px] font-semibold text-slate-455 leading-relaxed">
                          총 세전 금액은 동일하더라도 비과세 처리를 늘릴수록 사업주와 선생님 양측의 4대보험료 및 소득세 부담이 경감됩니다.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setWizNonTaxFood(0);
                            setWizNonTaxCar(0);
                            setWizHasCarAllowance(false);
                            setCurrentQ(5);
                          }}
                          className={`rounded-2xl border-2 p-4 text-center transition-all duration-200 cursor-pointer ${
                            wizNonTaxFood === 0 && wizNonTaxCar === 0
                              ? 'border-custom-indigo bg-custom-indigo-bg/25 text-slate-900 '
                              : 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50'
                          }`}
                        >
                          <span className="block text-xs font-bold">아니오</span>
                          <span className="mt-1 block text-[9px] font-semibold text-slate-400">
                            추가 비과세 항목 없음
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (wizNonTaxFood === 0) setWizNonTaxFood(200000);
                          }}
                          className={`rounded-2xl border-2 p-4 text-center transition-all duration-200 cursor-pointer ${
                            wizNonTaxFood > 0 || wizNonTaxCar > 0
                              ? 'border-custom-indigo bg-custom-indigo-bg/25 text-slate-900 '
                              : 'border-slate-200 bg-white text-slate-655 hover:bg-slate-50'
                          }`}
                        >
                          <span className="block text-xs font-bold">예</span>
                          <span className="mt-1 block text-[9px] font-semibold text-slate-400">
                            식대/자가운전 설정하기
                          </span>
                        </button>
                      </div>

                      {(wizNonTaxFood > 0 || wizNonTaxCar > 0) && (
                        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/20 p-4 animate-in fade-in">
                          <NonTaxContent
                            wizNonTaxFood={wizNonTaxFood}
                            setWizNonTaxFood={setWizNonTaxFood}
                            wizHasCarAllowance={wizHasCarAllowance}
                            setWizHasCarAllowance={setWizHasCarAllowance}
                            wizNonTaxCar={wizNonTaxCar}
                            setWizNonTaxCar={setWizNonTaxCar}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- Question 5: 경업금지 약정 설정 --- */}
                  {currentQ === 5 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-[14px] font-bold text-slate-800 leading-snug">
                          퇴직 후 경쟁업체 근무를 제한하는 경업금지 약정이 있습니까?
                        </h4>
                        <p className="text-[10px] font-semibold text-slate-455 leading-relaxed">
                          경업금지 약정은 효력을 지니기 위해 법적으로 적절한 대가(수당 등)를 근로자에게 지급하는 조건이 필요합니다.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setWizHasNonCompete(false);
                            setWizNonCompeteAmount(0);
                            setCurrentQ(6);
                          }}
                          className={`rounded-2xl border-2 p-4 text-center transition-all duration-200 cursor-pointer ${
                            !wizHasNonCompete
                              ? 'border-custom-indigo bg-custom-indigo-bg/25 text-slate-900 '
                              : 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50'
                          }`}
                        >
                          <span className="block text-xs font-bold">아니오</span>
                          <span className="mt-1 block text-[9px] font-semibold text-slate-400">
                            경업금지 약정 없음
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setWizHasNonCompete(true);
                            if (wizNonCompeteAmount === 0) {
                              setWizNonCompeteAmount(Math.round(wizSalaryAmount * 0.1) || 200000);
                            }
                          }}
                          className={`rounded-2xl border-2 p-4 text-center transition-all duration-200 cursor-pointer ${
                            wizHasNonCompete
                              ? 'border-custom-indigo bg-custom-indigo-bg/25 text-slate-900 '
                              : 'border-slate-200 bg-white text-slate-655 hover:bg-slate-50'
                          }`}
                        >
                          <span className="block text-xs font-bold">예</span>
                          <span className="mt-1 block text-[9px] font-semibold text-slate-400">
                            경업금지 약정 및 보상 설정
                          </span>
                        </button>
                      </div>

                      {wizHasNonCompete && (
                        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/20 p-4 animate-in fade-in">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="mb-1 block text-[10px] font-bold text-slate-500">제한 기간</label>
                              <select
                                value={wizNonCompetePeriod}
                                onChange={e => setWizNonCompetePeriod(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                              >
                                {['3개월', '6개월', '12개월', '24개월'].map(v => (
                                  <option key={v} value={v}>{v}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-bold text-slate-500">제한 범위</label>
                              <select
                                value={wizNonCompeteRange}
                                onChange={e => setWizNonCompeteRange(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                              >
                                {['반경 1km', '반경 3km', '반경 5km', '반경 10km'].map(v => (
                                  <option key={v} value={v}>{v}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="mb-1 block text-[10px] font-bold text-slate-500">
                              월 보상수당액
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={wizNonCompeteAmount === 0 ? '' : wizNonCompeteAmount.toLocaleString()}
                                onChange={e => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '');
                                  setWizNonCompeteAmount(Math.max(0, parseInt(raw) || 0));
                                }}
                                className="h-[34px] w-full rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-semibold focus:outline-none"
                                placeholder="월 대가 입력 (원)"
                              />
                              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">원</span>
                            </div>
                            <div className="mt-1 flex justify-between text-[9px] font-bold text-slate-400">
                              <span>{numberToKorean(wizNonCompeteAmount)}원</span>
                              <button
                                type="button"
                                onClick={() => setWizNonCompeteAmount(Math.round(wizSalaryAmount * 0.1))}
                                className="text-custom-indigo hover:underline cursor-pointer"
                              >
                                * 권장 대가 자동 계산 (월급의 10%: {Math.round(wizSalaryAmount * 0.1).toLocaleString()}원)
                              </button>
                            </div>

                            {wizHasNonCompete && wizSalaryType === 'monthly' && (wizSalaryAmount - wizNonCompeteAmount < minGuarantee) && (
                              <div className="mt-3 flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50/40 p-3 text-[11px] leading-relaxed text-amber-800 animate-in fade-in">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                                  <div>
                                    <p className="font-bold text-amber-900">최저임금 미달 우려 (수당 제외 시)</p>
                                    <p className="mt-0.5 font-medium text-slate-655">
                                      기본급에서 경업금지 수당을 뺀 금액이 법정 최소보장금액({minGuarantee.toLocaleString()}원)보다 낮아집니다.
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setWizSalaryAmount(minGuarantee + wizNonCompeteAmount)}
                                  className="w-full mt-1 rounded-lg bg-amber-600 py-1.5 px-3 text-center text-xs font-bold text-white  hover:bg-amber-700 transition-all cursor-pointer"
                                >
                                  희망 수령액(월 기본급)을 {(minGuarantee + wizNonCompeteAmount).toLocaleString()}원으로 조정하기
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- Question 6: 추가 고정수당 설정 --- */}
                  {currentQ === 6 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-[14px] font-bold text-slate-800 leading-snug">
                          직책수당, 고정연장수당 등의 추가적인 고정수당이 있습니까?
                        </h4>
                        <p className="text-[10px] font-semibold text-slate-455 leading-relaxed">
                          계약서에 추가 고정수당 항목을 별도로 표기할 수 있습니다.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setWizPositionAllowance(0);
                            setWizOvertimeAllowance(0);
                            setWizOtherAllowance(0);
                            setWizOtherAllowanceName('');
                            setCurrentQ(7);
                          }}
                          className={`rounded-2xl border border-slate-200 bg-white p-4 text-center hover:bg-slate-50 cursor-pointer ${
                            wizPositionAllowance === 0 && wizOvertimeAllowance === 0 && wizOtherAllowance === 0
                              ? 'border-custom-indigo bg-custom-indigo-bg/25 text-slate-900 '
                              : ''
                          }`}
                        >
                          <span className="block text-xs font-bold">아니오</span>
                          <span className="mt-1 block text-[9px] font-semibold text-slate-400">
                            추가 수당 없음
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (wizPositionAllowance === 0 && wizOvertimeAllowance === 0 && wizOtherAllowance === 0) {
                              setWizPositionAllowance(50000);
                            }
                          }}
                          className={`rounded-2xl border-2 p-4 text-center transition-all duration-200 cursor-pointer ${
                            wizPositionAllowance > 0 || wizOvertimeAllowance > 0 || wizOtherAllowance > 0
                              ? 'border-custom-indigo bg-custom-indigo-bg/25 text-slate-900 '
                              : 'border-slate-200 bg-white text-slate-655 hover:bg-slate-50'
                          }`}
                        >
                          <span className="block text-xs font-bold">예</span>
                          <span className="mt-1 block text-[9px] font-semibold text-slate-400">
                            직책/연장/기타 수당 설정
                          </span>
                        </button>
                      </div>

                      {(wizPositionAllowance > 0 || wizOvertimeAllowance > 0 || wizOtherAllowance > 0) && (
                        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/20 p-4 animate-in fade-in">
                          <AllowanceContent
                            wizOvertimeAllowance={wizOvertimeAllowance}
                            setWizOvertimeAllowance={setWizOvertimeAllowance}
                            wizPositionAllowance={wizPositionAllowance}
                            setWizPositionAllowance={setWizPositionAllowance}
                            wizOtherAllowance={wizOtherAllowance}
                            setWizOtherAllowance={setWizOtherAllowance}
                            wizOtherAllowanceName={wizOtherAllowanceName}
                            setWizOtherAllowanceName={setWizOtherAllowanceName}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- 급여 시뮬레이션 및 통계 리포트 --- */}
                  {((currentQ === 7 && wizSalaryType === 'monthly') ||
                    (currentQ === 4 &&
                      (wizSalaryType === 'hourly' || wizSalaryType === 'fixed'))) &&
                    renderSummaryAndStatistics(false)}

                  {/* Navigation Actions */}
                  {(() => {
                    const totalQ = wizSalaryType === 'monthly' ? 7 : 4;
                    return (
                      <div className="mt-6 flex justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                        {currentQ > 1 ? (
                          <button
                            type="button"
                            onClick={() => setCurrentQ(currentQ - 1)}
                            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            이전 단계
                          </button>
                        ) : (
                          <div />
                        )}

                        {currentQ < totalQ ? (
                          <button
                            type="button"
                            onClick={() => setCurrentQ(currentQ + 1)}
                            className="flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                          >
                            다음 단계
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setWizSalaryApplied(true);
                              setWizSubStep(0);
                            }}
                            className="flex items-center gap-1 rounded-xl bg-custom-indigo px-5 py-2.5 text-xs font-bold text-white  hover:bg-custom-indigo-hover cursor-pointer"
                          >
                            급여 설정 완료
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* ══════════ 급여 설정 요약 및 통계 리포트 ══════════ */}
          {wizSalaryApplied && renderSummaryAndStatistics(true)}

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
          {false && wizSalaryApplied && wizSalaryType === 'fixed' && (
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
                          onClick={() => setWizCommissionPercent(p)}
                          className={`flex h-[34px] flex-1 items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                            wizCommissionPercent === p
                              ? 'border-custom-indigo bg-custom-indigo text-white '
                              : 'border-slate-200 bg-white text-slate-655 hover:border-custom-indigo-border-hover'
                          }`}
                        >
                          {p}%
                        </button>
                      ))}
                      {wizCommissionPercent !== 20 && wizCommissionPercent !== 30 && wizCommissionPercent !== 40 ? (
                        <div
                          onClick={e =>
                            (
                              e.currentTarget.querySelector('input') as HTMLInputElement | null
                            )?.focus()
                          }
                          className="relative flex h-[34px] flex-1 cursor-text items-center justify-center rounded-xl border border-custom-indigo bg-custom-indigo text-white "
                        >
                          <input
                            type="text"
                            value={wizCommissionPercent === 0 ? '' : wizCommissionPercent.toString()}
                            onChange={e => {
                              const raw = e.target.value.replace(/[^0-9]/g, '');
                              const val = Math.min(100, parseInt(raw) || 0);
                              setWizCommissionPercent(val);
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
                          onClick={() => setWizCommissionPercent(25)}
                          className="flex h-[34px] flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 transition-all hover:border-custom-indigo-border-hover"
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
          {false && wizSalaryApplied && wizSalaryType === 'hourly' && (
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

        {false && wizSalaryApplied && (
          <div className="mt-3.5 flex justify-end border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setWizSubStep(0)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white  transition-all hover:bg-slate-800"
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
