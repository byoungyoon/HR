import { AlertTriangle } from 'lucide-react';
import { useWizaredStore } from '../state';

function calcPeriodLabel(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return '-';
  const diffMs = new Date(endDate).getTime() - new Date(startDate).getTime();
  if (diffMs < 0) return '날짜 오류';
  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  if (years > 0 && months > 0) return `${years}년 ${months}개월`;
  if (years > 0) return `${years}년`;
  if (months > 0) return `${months}개월`;
  return `${totalDays}일`;
}

function calcPeriodDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  return (
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1
  );
}

export default function Step2Adv1Area() {
  const { wizProbation, wizStartDate, wizEndDate } = useWizaredStore();

  const periodDays = calcPeriodDays(wizStartDate, wizEndDate);
  const periodLabel = calcPeriodLabel(wizStartDate, wizEndDate);
  const isUnderOneYear = periodDays > 0 && periodDays < 365;
  const isProbationWarning = wizProbation !== '없음' && parseInt(wizProbation) > 3;

  return (
    <div key={`${wizStartDate}-${wizEndDate}-${wizProbation}`} className="space-y-3">
      {/* 계약기간 요약 뱃지 */}
      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300">
        <div className="text-[13px] font-extrabold text-slate-800">
          [자문] 기간제 근로계약 유효성 가이드
        </div>
        <p className="text-[12px] leading-relaxed font-medium text-slate-600">
          기간제법 제4조에 의거, 2년을 초과하여 기간제 근로자(강사)로 사용하는 경우 무기계약
          근로자(정규직)로 간주되어 퇴사 통보 시 해고예고 및 부당해고 구제신청 리스크가 발생합니다.
          총 계약 합산 기간이 2년을 넘지 않도록 세심히 관리하십시오.
        </p>

        {periodDays > 0 && (
          <div className="mt-2 flex flex-wrap gap-2 border-t border-slate-100 pt-2">
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                periodDays >= 365
                  ? 'border border-emerald-100 bg-emerald-50 text-emerald-700'
                  : 'border border-amber-100 bg-amber-50 text-amber-700'
              }`}
            >
              계약기간 {periodLabel}
              <span className="font-medium text-slate-400">({periodDays}일)</span> ·{' '}
              {periodDays >= 365 ? '퇴직금 의무 있음' : '퇴직금 없음'}
            </span>

            {wizProbation !== '없음' && (
              <span
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                  isProbationWarning
                    ? 'border border-amber-100 bg-amber-50 text-amber-700'
                    : 'border border-emerald-100 bg-emerald-50 text-emerald-700'
                }`}
              >
                수습 {wizProbation} · {isProbationWarning ? '3개월 초과' : '적정'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 1년 미만 경고 */}
      {isUnderOneYear && (
        <div className="animate-warning-glow rounded-2xl border border-amber-300 bg-white p-4 text-[12px] text-amber-900">
          <div className="text-amber-750 mb-2 text-[13px] font-extrabold">
            [주의] 퇴직금 회피 의혹 주의
          </div>
          <p className="mb-2 text-[12px] font-semibold">
            계약기간을 <strong>1년 미만</strong>으로 설정하면 퇴직금 지급 의무가 없습니다.
          </p>
          <p className="mb-1 text-[12px] font-semibold text-amber-800">
            단, 1년 미만 계약을 반복 갱신하는 경우:
          </p>
          <ul className="ml-3 list-disc space-y-1 text-[12px] font-medium text-amber-800">
            <li>
              퇴직금 회피 목적으로 간주되어{' '}
              <strong className="font-semibold text-amber-900">퇴직금 지급 의무가 발생</strong>할 수
              있습니다
            </li>
            <li>
              2년 초과 시 기간의 정함이 없는 계약{' '}
              <strong className="font-semibold text-amber-900">(무기계약)으로 전환</strong>됩니다
            </li>
          </ul>
        </div>
      )}

      {isProbationWarning && (
        <div className="animate-warning-glow space-y-2 rounded-2xl border border-amber-200 bg-white p-4 text-amber-900 transition-all">
          <div className="text-amber-750 text-[13px] font-extrabold">
            [주의] 수습기간 초과 리스크
          </div>
          <p className="text-[12px] leading-relaxed font-medium text-slate-600">
            3개월을 초과한 수습 기간은 설정 가능하나, 최저임금 감액 적용(10% 이내 감액)은 최초
            3개월까지만 유효합니다. 초과 기간 감액 시 임금체불 소지가 있습니다.
          </p>
        </div>
      )}

      {!isUnderOneYear && !isProbationWarning && (
        <div className="space-y-2 rounded-2xl border-2 border-emerald-100 bg-white p-4 text-emerald-900 transition-all">
          <div className="text-[13px] font-extrabold text-emerald-700">
            [적정] 계약 및 수습기간 기준 통과
          </div>
          <p className="text-[12px] leading-relaxed font-medium text-slate-600">
            계약기간이 1년 이상으로 퇴직금 지급 기준을 충족하며, 수습기간이 3개월 이내로 법정 감액
            적용 기준에 적합합니다.
          </p>
        </div>
      )}
    </div>
  );
}
