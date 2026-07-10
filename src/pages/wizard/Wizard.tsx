import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Check,
  CalendarRange,
  X,
  Info,
  Shield,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building,
} from 'lucide-react';
import { analyzeContractContent, numberToKorean, INITIAL_ACADEMIES } from '../../utils';
import { ContractType, SalaryType } from '../../types';
import Step1Area from './_area/Step1.area';
import Step2Area from './_area/Step2.area';
import { useWizaredStore } from './state';

export default function Wizard() {
  const navigate = useNavigate();

  const {
    persons,
    academies,
    selectedAcademyId,
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
    setSelectedAcademyId,
    showToast,
    applyQuickSchedule,
    handleSendContract,
  } = useStore();

  // --- 로컬 파생 상태 계산 ---
  const calculateDailyHours = (start: string, end: string, breakStr: string): number => {
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    const totalMinutes = eH * 60 + eM - (sH * 60 + sM);

    let breakMinutes = 60; // 기본 1시간
    if (breakStr === '30분') breakMinutes = 30;
    else if (breakStr === '1시간') breakMinutes = 60;
    else if (breakStr === '1.5시간') breakMinutes = 90;
    else if (breakStr === '2시간') breakMinutes = 120;
    else if (breakStr === '없음') breakMinutes = 0;

    const netMinutes = totalMinutes - breakMinutes;
    return Math.max(0, netMinutes / 60);
  };

  const getWeeklyHours = (): number => {
    let total = 0;
    Object.keys(wizDaysConfig).forEach(day => {
      const conf = wizDaysConfig[day];
      if (conf.enabled) {
        total += calculateDailyHours(conf.startTime, conf.endTime, conf.breakTime);
      }
    });
    return parseFloat(total.toFixed(1));
  };

  const weeklyHours = getWeeklyHours();
  const hasWeeklyRestAllowance = weeklyHours >= 15;

  const calculateExpectedSalary = (): number => {
    const additionalAllowances =
      wizSalaryType === 'monthly' || wizSalaryType === 'fixed'
        ? wizOvertimeAllowance + wizPositionAllowance + wizOtherAllowance
        : 0;

    if (wizSalaryType === 'monthly' || wizSalaryType === 'fixed') {
      return (
        wizSalaryAmount +
        additionalAllowances +
        wizNonTaxFood +
        (wizHasCarAllowance ? wizNonTaxCar : 0)
      );
    }
    const basePay = wizSalaryAmount * weeklyHours * 4.345;
    const restAllowance = hasWeeklyRestAllowance
      ? (weeklyHours / 40) * 8 * wizSalaryAmount * 4.345
      : 0;
    return Math.round(
      basePay + restAllowance + wizNonTaxFood + (wizHasCarAllowance ? wizNonTaxCar : 0)
    );
  };

  const expectedSalary = calculateExpectedSalary();

  const generateFinalContractText = (): string => {
    const targetPerson = persons.find(p => p.id === wizInstructorId);
    const name = targetPerson ? targetPerson.name : '강사';

    const selectedAcademy =
      academies.find(a => a.id === selectedAcademyId) || academies[0] || INITIAL_ACADEMIES[0];

    let daysText = '';
    Object.keys(wizDaysConfig).forEach(day => {
      const conf = wizDaysConfig[day];
      if (conf.enabled) {
        daysText += `${day}(${conf.startTime}~${conf.endTime}, 휴게 ${conf.breakTime}) `;
      }
    });

    const salaryTypeLabel =
      wizSalaryType === 'hourly'
        ? '시급제'
        : wizSalaryType === 'monthly'
          ? '고정급 (월급제)'
          : '비율제 (인센티브)';

    let extraAllowancesText = '';
    if (wizSalaryType === 'monthly' || wizSalaryType === 'fixed') {
      extraAllowancesText = `
3. 추가 수당 설정:
   - 연장근로수당: ${wizOvertimeAllowance.toLocaleString()}원
   - 직책수당: ${wizPositionAllowance.toLocaleString()}원
   - 기타 수당: ${wizOtherAllowance.toLocaleString()}원`;
    }

    const nonCompeteSection =
      wizHasNonCompete && (wizSalaryType === 'monthly' || wizSalaryType === 'fixed')
        ? `\n\n제 7 조 (퇴직 후 경업금지 약정)
1. 근로자는 퇴직 후 ${wizNonCompetePeriod} 동안 ${wizNonCompeteRange} 이내의 동종 업계 학원에 임용되거나 창업하는 것을 금지한다.
2. 회사는 이에 대한 정당한 대가로서 매월 ${wizNonCompeteAmount.toLocaleString()}원(금 ${numberToKorean(wizNonCompeteAmount)})을 경업금지 약정 수당으로서 지급한다.`
        : '';

    return `=== 표준근로계약서 ===

본 계약은 '${selectedAcademy.name}'(이하 '회사')과 강사 '${name}'(이하 '근로자') 간의 근로 조건을 명확히 규정하고 법령을 성실히 준수함을 목적으로 한다.

제 1 조 (계약의 목적)
본 계약은 '회사'와 '근로자' 간의 근로 관계를 정의하고 상호 신의 성실의 원칙에 입각하여 성실히 이행함을 목적으로 한다.

제 2 조 (계약 기간 및 수습 설정)
1. 근로 시작일: ${wizStartDate}
2. 근로 종료일: ${wizEndDate}
3. 수습 기간: ${wizProbation}

제 3 조 (근무 장소 및 담당 업무)
1. 근무 장소: ${selectedAcademy.address}
2. 담당 업무: 프론트엔드 개발 / 강의 교수 및 이에 부수하는 학원 행정 업무

제 4 조 (근무 요일 및 소정근로시간)
1. 근무 요일 및 시간: ${daysText || '지정 안 됨'}
2. 주당 총 소정근로시간: 주 ${weeklyHours}시간

제 5 조 (임금 및 지급 방식)
1. 임금 형태: ${salaryTypeLabel}
2. 기본 금액: ${wizSalaryAmount.toLocaleString()}원${extraAllowancesText}
4. 비과세 식대: ${wizNonTaxFood.toLocaleString()}원
5. 비과세 자가운전보조금: ${wizHasCarAllowance ? wizNonTaxCar.toLocaleString() : 0}원
6. 주휴수당 지급 여부: ${hasWeeklyRestAllowance ? '지급 대상 (주 15시간 이상 근무)' : '대상 아님 (주 15시간 미만)'}
7. 매월 ${wizPayDay}에 근로자 명의의 예금계좌로 지급한다.

제 6 조 (특약사항)
${wizSpecialClause || '추가적인 합의사항 없음'}${nonCompeteSection}

본 계약을 명확히 증명하기 위해, 쌍방은 모바일 본인 인증 및 고유 해시 기반 전자서명을 통해 각자 서명 날인한다.`;
  };

  // --- Effects ---
  useEffect(() => {
    setWizContractText(generateFinalContractText());
  }, [
    wizInstructorId,
    wizStartDate,
    wizEndDate,
    wizProbation,
    wizDaysConfig,
    wizSalaryType,
    wizSalaryAmount,
    wizNonTaxFood,
    wizHasCarAllowance,
    wizNonTaxCar,
    wizPayDay,
    wizSpecialClause,
    selectedAcademyId,
    academies,
    wizOvertimeAllowance,
    wizPositionAllowance,
    wizOtherAllowance,
    wizHasNonCompete,
    wizNonCompetePeriod,
    wizNonCompeteRange,
    wizNonCompeteAmount,
  ]);

  const wizardStep = useWizaredStore(state => state.wizardStep);

  useEffect(() => {
    if (!wizStartDate) return;
    const start = new Date(wizStartDate);
    if (isNaN(start.getTime())) return;

    const end = new Date(start);
    end.setFullYear(start.getFullYear() + wizPeriodYear);
    end.setDate(end.getDate() - 1);

    const yyyy = end.getFullYear();
    const mm = String(end.getMonth() + 1).padStart(2, '0');
    const dd = String(end.getDate()).padStart(2, '0');
    setWizEndDate(`${yyyy}-${mm}-${dd}`);
  }, [wizStartDate, wizPeriodYear]);

  useEffect(() => {
    setShowChangePulse(true);
    const timer = setTimeout(() => setShowChangePulse(false), 800);
    return () => clearTimeout(timer);
  }, [weeklyHours]);

  const validationResult = analyzeContractContent(
    wizContractText,
    wizSalaryAmount,
    wizSalaryType,
    weeklyHours,
    hasWeeklyRestAllowance
  );

  const handleSend = () => {
    handleSendContract(validationResult);
    navigate('/admin/cabinet');
  };

  const representativeAcademy =
    academies.find(a => a.id === selectedAcademyId) || academies[0] || INITIAL_ACADEMIES[0];

  return (
    <div className="space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04),0_12px_24px_-10px_rgba(0,0,0,0.03)] sm:p-8">
      {/* 헤더 */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
            전자계약서 신속 작성 마법사
          </h2>
          {representativeAcademy && (
            <div
              onClick={() => navigate('/admin/academy')}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600 transition-all hover:bg-slate-100"
              title="클릭하여 학원 정보 설정 페이지로 이동"
            >
              <Building className="h-3.5 w-3.5 text-slate-400" />
              <div className="text-left">
                <span className="block text-[10px] leading-none font-bold text-slate-500">
                  {representativeAcademy.name}{' '}
                  <span className="ml-0.5 text-[9px] font-normal text-slate-400">
                    (학원정보 설정 →)
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 상단 스텝 프로그레스바 - Bento Grid UI */}
        <div className="flex max-w-full flex-wrap items-center gap-1.5 overflow-x-auto rounded-full border border-slate-200 bg-slate-50 p-1 shadow-inner">
          {[
            { step: 1, label: '1. 강사 및 계약 설정' },
            { step: 2, label: '2. 근무 및 급여설정' },
            { step: 3, label: '3. 특약/자문' },
            { step: 4, label: '4. 초안검토' },
          ].map(item => (
            <div
              key={item.step}
              onClick={() => {
                if (item.step < wizardStep || (item.step <= 3 && wizardStep > 1)) {
                  setWizardStep(item.step);
                }
              }}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                wizardStep === item.step
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {wizardStep === 1 && <Step1Area />}

      {wizardStep === 2 && <Step2Area />}

      {/* 스텝 3: 특약사항 및 조항 위반 진단 */}
      {wizardStep === 3 && (
        <div className="max-w-4xl space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* 왼쪽: 특약사항 폼 */}
            <div className="space-y-4 lg:col-span-7">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  특약사항 (선택)
                </label>
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

            {/* 오른쪽: 라이브 노무법 처방 리포트 */}
            <div className="flex flex-col justify-between rounded-2xl bg-slate-900 p-5 text-white shadow-xl lg:col-span-5">
              <div className="space-y-4">
                <span className="block text-[10px] font-black tracking-widest text-indigo-400 uppercase">
                  🛡 HAKON REALTIME RISK LAWYER REPORT
                </span>

                <div className="max-h-[220px] space-y-3 overflow-y-auto pr-1">
                  {validationResult.riskLog.map((log, i) => (
                    <p
                      key={i}
                      className="flex items-start space-x-1.5 text-xs leading-relaxed text-slate-300"
                    >
                      <span className="mt-0.5 shrink-0 text-emerald-400">✔</span>
                      <span>{log}</span>
                    </p>
                  ))}
                </div>

                {validationResult.detectedToxicClauses.length > 0 ? (
                  <div className="space-y-3 border-t border-slate-800 pt-3.5">
                    <span className="flex items-center space-x-1 text-[11px] font-black text-red-400">
                      <span>
                        🚨 법적 위반 독소 조항 탐지됨 (
                        {validationResult.detectedToxicClauses.length}건)
                      </span>
                    </span>
                    {validationResult.detectedToxicClauses.map((clause, idx) => (
                      <div
                        key={idx}
                        className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] leading-relaxed"
                      >
                        <p className="font-bold text-rose-400">탐지 조항:</p>
                        <p className="text-slate-300 italic">"{clause.originalText}"</p>
                        <p className="text-slate-400">{clause.detectedRisk}</p>
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
                            showToast(
                              '독소 조항이 안전한 표준 대안으로 처방되었습니다!',
                              'success'
                            );
                          }}
                          className="w-full rounded-lg bg-blue-600 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-blue-700"
                        >
                          표준 노무 권고안 대안조항으로 교체
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-t border-slate-800 py-4 pt-3.5 text-center">
                    <span className="inline-block rounded-full border border-emerald-800 bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-400">
                      ● 노무법 위반 리스크 없음 (안전)
                    </span>
                  </div>
                )}
              </div>

              <span className="mt-4 block text-[9px] text-slate-500">
                ※ 본 엔진은 최신 대법원 노무 판례 통계 및 고용노동부 지침을 바탕으로 동작합니다.
              </span>
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
      )}

      {/* 스텝 4: 최종 초안 확인 및 발송 */}
      {wizardStep === 4 && (
        <div className="max-w-3xl space-y-6">
          <div className="max-h-[400px] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap shadow-inner">
            {wizContractText}
          </div>

          <div className="flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs text-blue-800">
            <span className="text-lg">📢</span>
            <div>
              <strong>비대면 알림톡 연동 안내:</strong> 계약 체결하기 버튼을 누르면 상대방 강사(
              {persons.find(p => p.id === wizInstructorId)?.name || '강사'}) 휴대폰 번호로 모바일
              본인인증 전용 1회성 서명 링크가 자동 전송됩니다.
            </div>
          </div>

          <div className="flex justify-between border-t border-slate-100 pt-5">
            <button
              onClick={() => setWizardStep(3)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50"
            >
              이전
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setWizardStep(1);
                  navigate('/admin/dashboard');
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
              >
                취소
              </button>
              <button
                onClick={handleSend}
                className="flex items-center space-x-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
                <span>계약 체결하기 및 알림톡 발송</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
