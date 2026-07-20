import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useWizaredStore } from '../state';

export default function Step2Adv3Area() {
  const {
    wizDaysConfig,
    wizSalaryType,
    wizSalaryAmount,
    wizHasNonCompete,
    wizNonCompeteAmount,
  } = useWizaredStore();

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

  return (
    <div
      key={`${wizSalaryType}-${wizSalaryAmount}-${weeklyHours}`}
      className="animate-in fade-in space-y-3 duration-200"
    >


      {/* [자문] 포괄임금 계약 유효성 가이드 (요약본) */}
      {(() => {
        const isMonthly = wizSalaryType === 'monthly';
        return (
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-slate-800 text-[13px] font-extrabold">
              [자문] 포괄임금 계약 유효성 가이드
            </div>
            <p className="text-slate-650 text-[12px] leading-relaxed font-medium">
              {isMonthly
                ? `월급제 계약인 경우, 기본 소정근로에 대한 '기본급'과 주휴수당에 해당하는 '주휴수당액'을 구체적인 지급 한도 시간과 금액으로 쪼개어 계약서상에 구분 기재해야 대법원 판례에 따라 유효한 포괄임금/고정급 계약으로 온전히 인정받을 수 있습니다.`
                : `시급제 계약의 경우, 근무한 실제 시간에 비례하여 기본급과 주휴수당을 정산해야 하며, 고정액 일괄 포괄임금 계약은 권장하지 않습니다.`}
            </p>
          </div>
        );
      })()}

      {/* 최저임금 기준 검사 (주의/안전 구분) */}
      {(() => {
        const minWageLimit = 10320;
        let isMinWageViolation = false;
        let isNonCompeteViolation = false;
        let explanationText = '';
        let calcMinWage = 0;

        if (wizSalaryType === 'hourly') {
          isMinWageViolation = wizSalaryAmount < minWageLimit;
          explanationText = `시간당 ${wizSalaryAmount.toLocaleString()}원입니다.`;
        } else {
          const weeklyRestHours = hasWeeklyRestAllowance ? Math.min(8, (weeklyHours / 40) * 8) : 0;
          const monthlyHours = (weeklyHours + weeklyRestHours) * 4.345;
          calcMinWage = Math.round(monthlyHours * minWageLimit);
          isMinWageViolation = wizSalaryAmount < calcMinWage;

          if (wizHasNonCompete && wizSalaryType === 'monthly') {
            const adjustedBase = wizSalaryAmount - wizNonCompeteAmount;
            if (adjustedBase < calcMinWage) {
              isNonCompeteViolation = true;
            }
          }

          explanationText = `소정근로 주 ${weeklyHours}시간 대비, 2026년 법정 기준 월 환산액은 ${calcMinWage.toLocaleString()}원입니다.`;
        }

        const showViolation = isMinWageViolation || isNonCompeteViolation;

        return (
          <div
            className={`space-y-2 rounded-2xl border-2 p-4 transition-all duration-300 bg-white ${
              showViolation
                ? 'border-rose-200 text-rose-900 animate-danger-glow'
                : 'border-emerald-100 text-emerald-900'
            }`}
          >
            <div className="text-[13px] font-extrabold">
              <span className={showViolation ? 'text-rose-700' : 'text-emerald-700'}>
                {isMinWageViolation
                  ? '[위험] 최저임금법 위반 소지'
                  : isNonCompeteViolation
                    ? '[경고] 경업금지 보상수당 제외 시 최저임금 미달'
                    : '[적정] 최저임금 기준 통과'}
              </span>
            </div>
            <p className="text-[12px] leading-relaxed font-medium text-slate-700">
              {isMinWageViolation
                ? `책정된 급여가 법정 기준치 미만입니다. 최저임금법 제6조 위반으로 3년 이하의 징역 또는 2천만원 이하의 벌금에 처해질 수 있습니다. 즉시 급여 상향이 요구됩니다.`
                : isNonCompeteViolation
                  ? `경업금지 약정이 적용된 상태에서, 희망 수령액(기본급)에서 경업금지 보상수당을 제외한 금액(${(wizSalaryAmount - wizNonCompeteAmount).toLocaleString()}원)이 법정 최소보장금액(${calcMinWage.toLocaleString()}원)보다 낮습니다. 경업금지 보상수당은 최저임금 계산에서 제외되므로 법적 위반 소지가 있습니다.`
                  : `2026년 시간당 법정 최저시급(10,320원)을 철저히 준수하고 있습니다.`}
            </p>
            {isNonCompeteViolation && (
              <div className="mt-2 rounded-xl bg-rose-50/80 p-2.5 text-[11px] font-bold text-rose-800 leading-normal">
                ⚠️ 해결 방법: 마법사의 '2단계: 금액 설정'에서 월 급여액(희망 수령액)을 올리거나, '5단계: 경업금지 약정'에서 월 보상수당액을 낮춰서 최소보장금액 이상이 되도록 조정해주세요.
              </div>
            )}
            <p className="mt-1 font-mono text-[11px] font-semibold text-slate-400">{explanationText}</p>
          </div>
        );
      })()}
    </div>
  );
}
