import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useWizaredStore } from '../state';

export default function Step2Adv2Area() {
  const { wizDaysConfig, wizSalaryType, wizSalaryAmount } = useWizaredStore();

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

  const weeklyRestHours = Math.min(8, (weeklyHours / 40) * 8);
  const monthlyRestAllowance = Math.round(
    weeklyRestHours *
      (wizSalaryType === 'hourly'
        ? wizSalaryAmount
        : wizSalaryAmount / (weeklyHours + weeklyRestHours) / 4.345) *
      4.345
  );
  const hasViolation = weeklyHours >= 15;

  return (
    <div
      key={Object.values(wizDaysConfig).map(c => `${c.enabled}-${c.startTime}-${c.endTime}`).join('-')}
      className="animate-in fade-in space-y-3 duration-200"
    >
      {/* [자문] 소정근로일정 특정의 가치 (요약본) */}
      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-slate-800 text-[13px] font-extrabold">
          [자문] 소정근로일정 특정의 가치
        </div>
        <p className="text-slate-600 text-[12px] leading-relaxed font-medium">
          요일별 소정근로시간을 수치화하여 명확히 지정해 놓는 과정은 추후 강사와 근로일 증감 합의 및
          수당 계산 시 불필요한 마찰을 완전히 예방할 수 있는 훌륭한 실무입니다.
        </p>
      </div>

      {/* 주휴수당 필수 발생 여부 검사 (주의/안전 구분) */}
      <div
        className={`space-y-2 rounded-2xl border-2 p-4 transition-all duration-300 bg-white ${
          hasViolation
            ? 'border-amber-200 text-amber-900 animate-warning-glow'
            : 'border-emerald-100 text-emerald-900'
        }`}
      >
        <div className="text-[13px] font-extrabold">
          <span className={hasViolation ? 'text-amber-700' : 'text-emerald-700'}>
            {hasViolation
              ? '[주의] 주휴수당 필수 발생'
              : '[안전] 주휴수당 제외 대상 (초단시간)'}
          </span>
        </div>
        <p className="text-slate-600 text-[12px] leading-relaxed font-medium">
          {weeklyHours >= 15
            ? `주당 소정근로시간이 ${weeklyHours}시간으로 15시간 이상이므로, 근로기준법 제55조에 따라 매주 1회 이상 유급주휴일을 보장하고 주휴수당을 가산 지급해야 합니다. 기본시급과 주휴수당의 환산 금액을 각각 구분하여 명시하십시오.`
            : `주당 소정근로시간이 15시간 미만으로, 법정 주휴수당 및 퇴직금 지급 의무에서 예외 적용을 받습니다.`}
        </p>
        {weeklyHours >= 15 && (
          <p className="text-amber-850 mt-1 rounded-lg border border-amber-200/50 bg-white px-2.5 py-1.5 pl-1 font-mono text-[11px] font-semibold">
            예상 주휴수당 상당액: 월 평균 약 {monthlyRestAllowance.toLocaleString()}원
          </p>
        )}
      </div>
    </div>
  );
}
