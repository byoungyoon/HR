import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { analyzeContractContent } from '../../../utils';
import { useWizaredStore } from '../state';

export default function Step3Area() {
  const { showToast } = useStore();
  const {
    wizInstructorId,
    wizContractType,
    wizStartDate,
    wizPeriodYear,
    wizEndDate,
    wizProbation,
    wizWorkDaysType,
    wizDaysConfig,
    selectedBatchDays,
    batchStartTime,
    batchEndTime,
    batchBreakTime,
    editingDay,
    showChangePulse,
    wizSalaryType,
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
    wizSpecialClause,
    wizContractText,
    wizSubStep,
    maxUnlockedSubStep,

    setWizardStep,
    setWizSubStep,
    setMaxUnlockedSubStep,
    setWizInstructorId,
    setWizContractType,
    setWizStartDate,
    setWizPeriodYear,
    setWizEndDate,
    setWizProbation,
    setWizWorkDaysType,
    setWizDaysConfig,
    setSelectedBatchDays,
    setBatchStartTime,
    setBatchEndTime,
    setBatchBreakTime,
    setEditingDay,
    setShowChangePulse,
    setWizSalaryType,
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
    setWizSpecialClause,
    setWizContractText,
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

  const validationResult = analyzeContractContent(
    wizSpecialClause,
    wizSalaryAmount,
    wizSalaryType,
    weeklyHours,
    hasWeeklyRestAllowance
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 왼쪽: 특약사항 폼 */}
        <div className="space-y-4 lg:col-span-7">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">특약사항 (선택)</label>
            <textarea
              value={wizSpecialClause}
              onChange={e => setWizSpecialClause(e.target.value)}
              rows={5}
              placeholder="추가적인 약정사항이 있으면 입력해주세요..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs leading-relaxed focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          {/* 팁 박스 및 독소 조항 시뮬레이션 */}
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold text-slate-700">
              💡 법적 위반 독소 조항 시뮬레이션 (클릭 시 입력창에 추가)
            </p>
            <p className="text-[11px] text-slate-500">
              실시간 노무 분석 엔진이 어떤 조항을 독소 조항으로 감지하는지 체험해 보십시오.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setWizSpecialClause(
                    wizSpecialClause +
                      (wizSpecialClause ? '\n' : '') +
                      '지각이나 결석 시 급여의 일부를 강제 삭감하거나 벌금 처리한다.'
                  )
                }
                className="rounded-xl border border-red-100 bg-red-50 px-2.5 py-1.5 text-[10px] font-extrabold text-red-700 transition-colors hover:bg-red-100"
              >
                + '지각/감봉 삭감' 삽입
              </button>
              <button
                type="button"
                onClick={() =>
                  setWizSpecialClause(
                    wizSpecialClause +
                      (wizSpecialClause ? '\n' : '') +
                      '근무 도중 중도 퇴사할 경우, 당월 급여를 청구할 수 없으며 포기하기로 합의한다.'
                  )
                }
                className="rounded-xl border border-red-100 bg-red-50 px-2.5 py-1.5 text-[10px] font-extrabold text-red-700 transition-colors hover:bg-red-100"
              >
                + '중도퇴사 시 급여포기' 삽입
              </button>
              <button
                type="button"
                onClick={() =>
                  setWizSpecialClause(
                    wizSpecialClause +
                      (wizSpecialClause ? '\n' : '') +
                      '수업 전 준비 시간 및 학원 정기 회의 시간은 별도의 근로시간으로 치지 않으며 무급으로 정한다.'
                  )
                }
                className="rounded-xl border border-red-100 bg-red-50 px-2.5 py-1.5 text-[10px] font-extrabold text-red-700 transition-colors hover:bg-red-100"
              >
                + '준비/회의시간 무급' 삽입
              </button>
              <button
                type="button"
                onClick={() =>
                  setWizSpecialClause(
                    wizSpecialClause +
                      (wizSpecialClause ? '\n' : '') +
                      '퇴사 후 2년간 반경 10km 이내 동종 업계 학원에 일체 근무할 수 없으며, 이를 어길 시 위약금을 지불한다.'
                  )
                }
                className="rounded-xl border border-red-100 bg-red-50 px-2.5 py-1.5 text-[10px] font-extrabold text-red-700 transition-colors hover:bg-red-100"
              >
                + '경업금지/위약금' 삽입
              </button>
            </div>
          </div>
        </div>

        {/* 오른쪽: 라이브 노무법 처방 리포트 (Step 2와 동일한 프리미엄 UI 스타일) */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:col-span-5">
          <div className="space-y-4 rounded-3xl border border-indigo-100/70 bg-indigo-50/40 p-4">
            <span className="block text-[10px] font-black tracking-widest text-indigo-600 uppercase">
              🛡 HAKON REALTIME RISK LAWYER REPORT
            </span>

            {validationResult.detectedToxicClauses.length > 0 ? (
              <>
                {/* 위험 주의 배너 */}
                <div className="animate-in fade-in space-y-2 rounded-2xl border-2 border-rose-200 bg-rose-50/80 p-4 text-rose-900 shadow-sm duration-200">
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                    <span className="text-rose-850">
                      🚨 [위험] 법적 위반 독소 조항 탐지됨 (
                      {validationResult.detectedToxicClauses.length}건)
                    </span>
                  </div>
                  <p className="text-slate-650 text-[11px] leading-relaxed font-medium">
                    입력하신 특약사항에서 근로기준법을 위반할 위험이 매우 높은 조항이
                    발견되었습니다. 아래 권고안으로 즉시 교체하십시오.
                  </p>
                </div>

                {/* 개별 대안 처방 카드 */}
                {validationResult.detectedToxicClauses.map((clause, idx) => (
                  <div
                    key={idx}
                    className="animate-in fade-in space-y-3 rounded-2xl border border-slate-200/70 bg-white p-4 text-slate-700 shadow-sm duration-200"
                  >
                    <span className="inline-block rounded bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-600">
                      독소조항 의혹 조항
                    </span>
                    <p className="text-[11px] font-bold text-slate-700 italic">
                      "{clause.originalText}"
                    </p>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-[11px] leading-relaxed font-medium text-slate-500">
                      {clause.detectedRisk}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        let updatedClause = wizSpecialClause.replace(
                          clause.originalText,
                          clause.alternativeText
                        );
                        if (updatedClause === wizSpecialClause) {
                          updatedClause += `\n[대안 합의] ${clause.alternativeText}`;
                        }
                        setWizSpecialClause(updatedClause);
                        showToast('독소 조항이 안전한 표준 대안으로 처방되었습니다!', 'success');
                      }}
                      className="w-full rounded-xl bg-blue-600 py-2 text-[11px] font-extrabold text-white shadow-sm transition-all hover:bg-blue-700"
                    >
                      표준 노무 권고안 대안조항으로 교체
                    </button>
                  </div>
                ))}
              </>
            ) : (
              /* 안전 배너 */
              <div className="animate-in fade-in space-y-2 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 p-4 text-emerald-900 shadow-sm duration-200">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span className="text-emerald-850">✔ [안전] 노무법 위반 리스크 없음</span>
                </div>
                <p className="text-slate-650 text-[11px] leading-relaxed font-medium">
                  현재 등록된 특약사항 내에 근로기준법 및 대법원 판례 기준을 위반하는 독소 조항이
                  감지되지 않았습니다. 안전한 계약 체결이 가능합니다.
                </p>
              </div>
            )}

            {/* 검증 로그 상세 리스트 */}
            <div className="space-y-2.5 rounded-2xl border border-slate-200/70 bg-white p-4 text-slate-700 shadow-sm">
              <p className="border-b border-slate-100 pb-1.5 text-[11px] font-extrabold text-slate-800">
                ⚖ 실시간 근로계약 검증 상세 피드백
              </p>
              <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
                {validationResult.riskLog.map((log, i) => (
                  <p
                    key={i}
                    className="text-slate-650 flex items-start gap-1.5 text-[11px] leading-relaxed font-medium"
                  >
                    <span className="mt-0.5 shrink-0 font-bold text-emerald-500">✓</span>
                    <span>{log}</span>
                  </p>
                ))}
              </div>
            </div>

            <span className="block pl-1 text-[9px] leading-normal font-medium text-slate-400">
              ※ 본 엔진은 최신 대법원 노무 판례 통계 및 고용노동부 지침을 바탕으로 동작합니다.
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between border-t border-slate-100 pt-5">
        <button
          onClick={() => setWizardStep(2)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50"
        >
          이전
        </button>
        <button
          onClick={() => setWizardStep(4)}
          className="flex items-center space-x-1 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-100 transition-all duration-200 hover:bg-blue-700"
        >
          <span>최종 초안 검토로 넘어가기</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
