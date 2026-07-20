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
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  Megaphone,
} from 'lucide-react';
import { analyzeContractContent, numberToKorean, INITIAL_ACADEMIES } from '../../utils';
import { ContractType, SalaryType } from '../../types';
import Step1Area from './_area/Step1.area';
import Step2Area from './_area/Step2.area';
import { useWizaredStore } from './state';
import Step3Area from './_area/Step3.area';
import Step4Area from './_area/Step4.area';
import Step1AdvArea from './_area/Step1.adv.area';
import Step2Adv1Area from './_area/Step2.adv1.area';
import Step2Adv2Area from './_area/Step2.adv2.area';
import Step2Adv3Area from './_area/Step2.adv3.area';

export default function Wizard() {
  const navigate = useNavigate();

  const {
    persons,
    academies,
    selectedAcademyId,
    setSelectedAcademyId,
    showToast,
    applyQuickSchedule,
    handleSendContract,
    wizCommissionPercent,
  } = useStore();

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
    wizSubStepClickCount,
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
      return wizSalaryAmount + additionalAllowances + (wizHasNonCompete ? wizNonCompeteAmount : 0);
    }
    const basePay = wizSalaryAmount * weeklyHours * 4.345;
    const restAllowance = hasWeeklyRestAllowance
      ? (weeklyHours / 40) * 8 * wizSalaryAmount * 4.345
      : 0;
    return Math.round(basePay + restAllowance + (wizHasNonCompete ? wizNonCompeteAmount : 0));
  };

  const expectedSalary = calculateExpectedSalary();

  const generateFinalContractText = (): string => {
    const targetPerson = persons.find(p => p.id === wizInstructorId);
    const name = targetPerson ? targetPerson.name : '강사';

    const selectedAcademy =
      academies.find(a => a.id === selectedAcademyId) || academies[0] || INITIAL_ACADEMIES[0];

    const activeDays = Object.keys(wizDaysConfig).filter(day => wizDaysConfig[day].enabled);
    const activeDaysCount = activeDays.length || 1;
    const dailyHours = (weeklyHours / activeDaysCount).toFixed(1);

    // split base salary package to basic pay and weekly rest pay
    const nonTaxTotal = wizNonTaxFood + (wizHasCarAllowance ? wizNonTaxCar : 0);
    const fixedAllowances = wizPositionAllowance + wizOtherAllowance;
    const packageBase = Math.max(0, wizSalaryAmount - nonTaxTotal - fixedAllowances);

    let docBasePay = packageBase;
    let docRestPay = 0;

    if (hasWeeklyRestAllowance) {
      docBasePay = Math.round(packageBase / 1.2);
      docRestPay = packageBase - docBasePay;
    }

    let salaryDescription = '';
    if (wizSalaryType === 'fixed') {
      salaryDescription = `📌 급여 산정 방식

매출 기준

매출 × ${wizCommissionPercent}%

VS
최소 보장

${wizSalaryAmount.toLocaleString()}원

👉 둘 중 큰 금액을 매월 지급합니다.`;
    } else if (wizSalaryType === 'monthly') {
      salaryDescription = `고정급 (월급제)

${wizSalaryAmount.toLocaleString()}원`;
    } else {
      salaryDescription = `시급제

${wizSalaryAmount.toLocaleString()}원`;
    }

    let nonCompeteSection = '';
    if (wizHasNonCompete) {
      nonCompeteSection = `\n\n제10조 (경업금지)\n① 을은 퇴직 후 ${wizNonCompetePeriod}간 ${selectedAcademy.name}으로부터 반경 ${wizNonCompeteRange} 이내에서 동종 업종에 종사하지 않는다.\n\n② 경업금지의 대가로 갑은 을에게 매월 ${wizNonCompeteAmount.toLocaleString()}원을 지급한다. 이 금액은 본 계약 제6조의 급여와 별도로 지급한다.\n\n③ 을이 본 조를 위반한 경우, 갑에게 발생한 손해를 배상할 책임을 진다.`;
    }

    // 별지 1
    let scheduleText = '요일\t근무시간';
    const dayMap: Record<string, string> = {
      월요일: '월',
      화요일: '화',
      수요일: '수',
      목요일: '목',
      금요일: '금',
      토요일: '토',
      일요일: '일',
    };
    Object.keys(wizDaysConfig).forEach(day => {
      const conf = wizDaysConfig[day];
      if (conf.enabled) {
        const shortDay = dayMap[day] || day;
        scheduleText += `\n\${shortDay}\t\${conf.startTime}~\${conf.endTime}`;
      }
    });

    // 별지 2
    let wageDetailText = '';
    if (wizSalaryType === 'fixed') {
      wageDetailText = `항목\t금액\t비고
급여 산정 기준\t매출의 ${wizCommissionPercent}%\t담당 수강료 기준
최소 보장 내역
기본급\t\${docBasePay.toLocaleString()}원\t
주휴수당\t\${docRestPay.toLocaleString()}원\t
식대\t\${wizNonTaxFood.toLocaleString()}원\t비과세
직책수당\t\${wizPositionAllowance.toLocaleString()}원\t
기타수당\t\${wizOtherAllowance.toLocaleString()}원\t`;
    } else if (wizSalaryType === 'monthly') {
      wageDetailText = `항목\t금액\t비고
기본급\t\${docBasePay.toLocaleString()}원\t
주휴수당\t\${docRestPay.toLocaleString()}원\t
식대\t\${wizNonTaxFood.toLocaleString()}원\t비과세
직책수당\t\${wizPositionAllowance.toLocaleString()}원\t
기타수당\t\${wizOtherAllowance.toLocaleString()}원\t`;
    } else {
      wageDetailText = `항목\t금액\t비고
기본시급\t\${wizSalaryAmount.toLocaleString()}원\t
주휴수당\t\${docRestPay.toLocaleString()}원\t
식대\t\${wizNonTaxFood.toLocaleString()}원\t비과세`;
    }

    if (wizHasNonCompete) {
      wageDetailText += `\n별도 지급 항목\n경업금지대가\t${wizNonCompeteAmount.toLocaleString()}원\t제10조 참조`;
    }
    const finalSalaryText = expectedSalary.toLocaleString();
    if (wizSalaryType === 'fixed') {
      wageDetailText += `\n월 급여 (세전)\t\${finalSalaryText}원\t매출 기준과 최소 보장 중 큰 금액\${wizHasNonCompete ? ' + 별도 지급 (${wizNonCompeteAmount.toLocaleString()}원)' : ''}`;
    } else if (wizSalaryType === 'monthly') {
      wageDetailText += `\n월 급여 (세전)\t\${finalSalaryText}원\t`;
    } else {
      wageDetailText += `\n월 예상 급여 (세전)\t\${finalSalaryText}원\t소정근로시간 기준 예상액`;
    }

    const today = new Date();
    const formattedDate = `\${today.getFullYear()}년 \${today.getMonth() + 1}월 \${today.getDate()}일`;

    return `\${selectedAcademy.name}(이하 "갑"이라 한다)과 \${name}(이하 "을"이라 한다)은 다음과 같이 근로계약을 체결한다.

제1조 (계약 당사자)
갑 (사용자)
상호\t\${selectedAcademy.name}
대표자\t\${selectedAcademy.ownerName}
사업자번호\t\${selectedAcademy.businessNumber}
연락처\t\${selectedAcademy.phone}
주소\t\${selectedAcademy.address}

을 (근로자)
성명\t\${name}
담당과목\t\${targetPerson?.subject || '미지정'}
주소\t\${targetPerson?.address || '미지정'}

제2조 (계약기간)
① 본 계약의 기간은 \${wizStartDate}부터 \${wizEndDate}까지로 한다.
② 수습기간: \${wizProbation}

제3조 (업무내용)
을의 담당 업무는 다음과 같다.
담당 과목: \${targetPerson?.subject || '미지정'}
갑이 지시하는 교육 관련 업무

제4조 (근로시간)
① 소정근로시간 및 휴게시간의 상세 사항은 별지 제1호에 따른다.
② 1주 소정근로시간은 1주 \${weeklyHours}시간이며, 1일 소정근로시간은 \${dailyHours}시간으로 한다.

제5조 (휴게시간)
① 4시간 이상 근로하는 경우 30분 이상, 8시간 이상 근로하는 경우 1시간 이상의 휴게시간을 부여한다.
② 휴게시간은 근로시간 도중에 자유롭게 이용할 수 있다.

제6조 (임금)
\${salaryDescription}

① 급여 지급일: 매월 \${wizPayDay}
② 을이 지정한 금융기관 계좌로 이체하여 지급한다.
③ 상세 항목 및 산정 내역은 별지 제2호에 따른다.
\${wizSalaryType === 'fixed' ? '\n※ 매월 정산 급여가 최소 보장 금액에 미달할 경우, 최소 보장 금액을 지급합니다.\n' : ''}
제7조 (휴일 및 휴가)
① 주휴일: 매주 일요일
② 법정공휴일은 유급휴일로 한다.
③ 연차유급휴가는 근로기준법에 따라 부여한다.
④ 1년간 80% 이상 출근 시 15일의 유급휴가 부여, 1년 미만 근로자는 1개월 개근 시 1일 부여

제8조 (퇴직급여)
① 계속근로기간이 1년 이상인 경우, 퇴직일로부터 14일 이내에 퇴직급여를 지급한다.
② 퇴직급여는 근로자퇴직급여보장법에 따라 산정한다.
③ 퇴직급여 = 1일 평균임금 × 30일 × (근속연수)\${nonCompeteSection}

제11조 (손해배상)
① 당사자 일방이 고의 또는 중대한 과실로 상대방에게 손해를 입힌 경우, 그 손해를 배상할 책임을 진다.
② 본 계약에 위약금 또는 손해배상액을 예정하는 계약을 하지 아니한다.

제12조 (기타)
① 본 계약서에 명시되지 않은 사항은 근로기준법 및 관계 법령에 따른다.
② 본 계약서는 2부를 작성하여 갑과 을이 각 1부씩 보관한다.

제13조 (관할법원)
본 계약과 관련하여 분쟁이 발생한 경우, 갑의 주소지 관할법원을 제1심 관할법원으로 한다.

【특약사항】
\${wizSpecialClause || '없음'}

위 계약을 증명하기 위하여 본 계약서 2부를 작성하여 갑과 을이 각각 서명 날인 후 1부씩 보관한다.

\${formattedDate}

갑 (사용자)
상호: \${selectedAcademy.name}
주소: \${selectedAcademy.address}
대표자: \${selectedAcademy.ownerName}
인

을 (근로자)
성명: \${name}
주소: \${targetPerson?.address || '미지정'}
인

【별지 1】 상세 근로시간표
\${scheduleText}

【별지 2】 상세 임금산정 내역
\${wageDetailText}

본 계약서는 학온(HAGON) 전자계약 시스템을 통해 생성되었습니다.`;
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
    wizCommissionPercent,
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
    wizSpecialClause,
    wizSalaryAmount,
    wizSalaryType,
    weeklyHours,
    hasWeeklyRestAllowance
  );

  const representativeAcademy =
    academies.find(a => a.id === selectedAcademyId) || academies[0] || INITIAL_ACADEMIES[0];

  return (
    <div className="flex items-start pr-8">
      <style>{`
        @keyframes warningGlow {
          0%, 100% { border-color: rgba(245, 158, 11, 0.4); }
          50% { border-color: rgba(245, 158, 11, 1); }
        }
        @keyframes dangerGlow {
          0%, 100% { border-color: rgba(239, 68, 68, 0.4); }
          50% { border-color: rgba(239, 68, 68, 1); }
        }
        .animate-warning-glow {
          animation: warningGlow 2.5s infinite ease-in-out;
        }
        .animate-danger-glow {
          animation: dangerGlow 2.5s infinite ease-in-out;
        }
      `}</style>
      <section className="flex-1">
        <header className="flex min-h-16 items-center justify-between gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <h2 className="text-text-title font-extrabold tracking-tight">계약서 작성</h2>
            {representativeAcademy && (
              <button
                type="button"
                onClick={() => navigate('/admin/academy')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-black text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50"
                title="클릭하여 학원 정보 설정 페이지로 이동"
              >
                <Building className="h-3.5 w-3.5 text-slate-500" />
                <span>{representativeAcademy.name}</span>
                <span className="text-[10px] font-bold text-slate-400">(학원 설정 이동)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1.5 text-[13px]">
            {[
              { step: 1, label: '1. 강사 및 계약 설정' },
              { step: 2, label: '2. 근무 및 급여설정' },
              { step: 3, label: '3. 특약/자문' },
              { step: 4, label: '4. 초안검토' },
            ].map((item, idx) => (
              <div key={item.step} className="flex shrink-0 items-center gap-2">
                <span
                  onClick={() => {
                    if (item.step < wizardStep) {
                      setWizardStep(item.step);
                    }
                  }}
                  className={`transition-all duration-200 ${
                    wizardStep === item.step
                      ? 'cursor-default font-black text-custom-indigo'
                      : item.step < wizardStep
                        ? 'text-slate-650 cursor-pointer font-bold hover:text-custom-indigo'
                        : 'cursor-not-allowed font-medium text-slate-300'
                  }`}
                >
                  {item.label}
                </span>
                {idx < 3 && <ChevronRight className="h-3 w-3 text-slate-300" />}
              </div>
            ))}
          </div>
        </header>

        {wizardStep === 1 && <Step1Area />}
        {wizardStep === 2 && <Step2Area />}
        {wizardStep === 3 && <Step3Area />}
        {wizardStep === 4 && <Step4Area />}
      </section>

      <section className="ml-6 w-[540px] shrink-0">
        <header className="flex min-h-16 items-center justify-end">
          {wizardStep <= 3 && (
            <div className="flex items-center gap-2">
              {wizardStep > 1 && (
                <button
                  type="button"
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="flex items-center gap-1 rounded-xl border border-slate-350 bg-white px-3 py-1.5 text-xs font-black text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-250 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>이전</span>
                </button>
              )}

              {wizardStep === 1 && (
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="flex cursor-pointer items-center space-x-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white shadow-sm transition-all duration-200 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  <span>다음 단계로</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}

              {wizardStep === 2 && (
                <button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  disabled={wizSubStep !== 0}
                  className={`flex items-center space-x-1 rounded-xl px-4 py-2 text-xs font-black shadow-sm transition-all duration-200 ${
                    wizSubStep === 0
                      ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed dark:bg-slate-800 dark:text-slate-650 dark:border-slate-800'
                  }`}
                >
                  <span>다음 단계로</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}

              {wizardStep === 3 && (
                <button
                  type="button"
                  onClick={() => setWizardStep(4)}
                  className="flex cursor-pointer items-center space-x-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white shadow-sm transition-all duration-200 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  <span>다음 단계로</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </header>
        {wizardStep === 1 && <Step1AdvArea />}

        {wizardStep === 2 && (
          <div className="animate-in fade-in">
            {wizSubStep === 1 && <Step2Adv1Area key={`adv1-${wizSubStepClickCount}`} />}
            {wizSubStep === 2 && <Step2Adv2Area key={`adv2-${wizSubStepClickCount}`} />}
            {wizSubStep === 3 && <Step2Adv3Area key={`adv3-${wizSubStepClickCount}`} />}
            {wizSubStep === 0 && (
              <>
                {(() => {
                  const calcPeriodDays = (start: string, end: string): number => {
                    if (!start || !end) return 0;
                    return (
                      Math.round(
                        (new Date(end).getTime() - new Date(start).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) + 1
                    );
                  };
                  const periodDays = calcPeriodDays(wizStartDate, wizEndDate);
                  const isUnderOneYear = periodDays > 0 && periodDays < 365;
                  const isProbationWarning = wizProbation !== '없음' && parseInt(wizProbation) > 3;
                  const hasStep1Warning = isUnderOneYear || isProbationWarning;
                  const hasStep2Warning = weeklyHours >= 15;

                  const minWageLimit = 10320;
                  let hasStep3Warning = false;
                  if (wizSalaryType === 'hourly') {
                    hasStep3Warning = wizSalaryAmount < minWageLimit;
                  } else {
                    const weeklyRestHours =
                      weeklyHours >= 15 ? Math.min(8, (weeklyHours / 40) * 8) : 0;
                    const monthlyHours = (weeklyHours + weeklyRestHours) * 4.345;
                    const calcMinWage = Math.round(monthlyHours * minWageLimit);
                    hasStep3Warning = wizSalaryAmount < calcMinWage;
                  }

                  const isStep2WarningActive =
                    hasStep1Warning || hasStep2Warning || hasStep3Warning;

                  if (isStep2WarningActive) {
                    return (
                      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="text-[13px] font-extrabold text-rose-700">
                          [검토] 확인이 필요한 계약서 리스크 리포트
                        </div>
                        <p className="text-[12px] leading-relaxed font-medium text-slate-500">
                          작성하신 조건 중 근로기준법 위반 소지나 실무상 주의가 필요한 항목들이
                          감지되었습니다. 다음 단계로 넘어가기 전 확인해 보십시오.
                        </p>

                        {hasStep1Warning && (
                          <div className="space-y-2 border-t border-slate-100 pt-3">
                            {isUnderOneYear && (
                              <div className="text-[12px]">
                                <span className="font-extrabold text-amber-700">
                                  [주의] 퇴직금 회피 의혹
                                </span>
                                <p className="mt-1 leading-relaxed font-medium text-slate-600">
                                  계약기간이 1년 미만으로 설정되어 퇴직금 지급 의무가 없습니다. 단,
                                  반복 갱신 시 법적 리스크가 발생할 수 있습니다.
                                </p>
                              </div>
                            )}
                            {isProbationWarning && (
                              <div className="text-[12px]">
                                <span className="font-extrabold text-amber-700">
                                  [주의] 수습기간 3개월 초과
                                </span>
                                <p className="mt-1 leading-relaxed font-medium text-slate-600">
                                  수습 감액(10% 이내)은 최초 3개월까지만 유효합니다.
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {hasStep2Warning && (
                          <div className="border-t border-slate-100 pt-3">
                            <div className="text-[12px]">
                              <span className="font-extrabold text-amber-700">
                                [주의] 주휴수당 필수 발생
                              </span>
                              <p className="mt-1 leading-relaxed font-medium text-slate-600">
                                주당 근로시간이 15시간 이상이므로 주휴수당 지급 및 명시 의무가
                                발생합니다.
                              </p>
                            </div>
                          </div>
                        )}

                        {hasStep3Warning && (
                          <div className="border-t border-slate-100 pt-3">
                            <div className="text-[12px]">
                              <span className="font-extrabold text-rose-700">
                                [위험] 최저임금법 위반 소지
                              </span>
                              <p className="mt-1 leading-relaxed font-medium text-slate-600">
                                책정된 급여(또는 시급)가 2026년 최저임금(
                                {minWageLimit.toLocaleString()}원) 기준 월 환산액 미만입니다. 즉시
                                급여 조율이 권장됩니다.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300">
                      <div className="mb-2 text-[13px] font-extrabold text-custom-indigo">
                        완벽합니다! 다음 단계로 가볼까요?
                      </div>
                      <p className="text-slate-650 text-[12px] leading-relaxed font-medium">
                        근무 요건 및 급여 책정에 리스크나 법적 위반 소지가 발견되지 않았습니다.
                        안전하게 계약서를 완성하실 수 있습니다. 다음 버튼을 눌러 계약서 작성을 계속
                        진행하세요.
                      </p>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}

        {wizardStep === 3 && (
          <div className="mt-4 space-y-4">
            {/* [자문] 특약사항 법적 유효성 가이드 */}
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-[13px] font-extrabold text-slate-800">
                [자문] 특약사항 법적 유효성 가이드
              </div>
              <p className="text-slate-650 text-[12px] leading-relaxed font-medium">
                근로기준법에 반하는 강제적인 벌금 부과나 퇴직금 포기 합의 등은 특약으로 기재하더라도
                전부 무효가 되며 오히려 임금체불이나 근로기준법 위반으로 형사 처벌 대상이 될 수
                있습니다.
              </p>
            </div>

            {validationResult.detectedToxicClauses.length > 0 ? (
              <div className="space-y-4">
                {/* 위험 주의 배너 */}
                <div className="animate-in fade-in animate-danger-glow space-y-2 rounded-2xl border-2 border-rose-200 bg-white p-4 text-rose-900 duration-200">
                  <div className="text-[13px] font-extrabold text-rose-700">
                    [위험] 법적 위반 독소 조항 탐지됨 (
                    {validationResult.detectedToxicClauses.length}건)
                  </div>
                  <p className="text-[12px] leading-relaxed font-medium text-slate-600">
                    입력하신 특약사항에서 근로기준법을 위반할 위험이 매우 높은 조항이
                    발견되었습니다. 아래 권고안으로 즉시 교체하십시오.
                  </p>
                </div>

                {/* 개별 대안 처방 카드 */}
                <div className="max-h-[380px] space-y-4 overflow-y-auto pr-1">
                  {validationResult.detectedToxicClauses.map((clause, idx) => (
                    <div
                      key={idx}
                      className="animate-in fade-in space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 duration-200"
                    >
                      <span className="inline-block rounded bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                        독소조항 의혹 조항
                      </span>
                      <p className="text-[12px] font-extrabold text-slate-800 italic">
                        "{clause.originalText}"
                      </p>
                      <div className="text-slate-650 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-[12px] leading-relaxed font-medium">
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
                        className="w-full rounded-xl bg-blue-600 py-2.5 text-[12px] font-extrabold text-white transition-all hover:bg-blue-700"
                      >
                        표준 노무 권고안 대안조항으로 교체
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* 안전 배너 */
              <div className="animate-in fade-in space-y-2 rounded-2xl border-2 border-emerald-100 bg-white p-4 text-emerald-900 duration-200">
                <div className="text-[13px] font-extrabold text-emerald-700">
                  [안전] 노무법 위반 리스크 없음
                </div>
                <p className="text-[12px] leading-relaxed font-medium text-slate-600">
                  현재 등록된 특약사항 내에 근로기준법 및 대법원 판례 기준을 위반하는 독소 조항이
                  감지되지 않았습니다. 안전한 계약 체결이 가능합니다.
                </p>
              </div>
            )}

            {/* 검증 로그 상세 리스트 */}
            <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-4 text-slate-700">
              <p className="border-b border-slate-100 pb-1.5 text-[13px] font-extrabold text-slate-800">
                실시간 근로계약 검증 피드백
              </p>
              <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
                {validationResult.riskLog.map((log, i) => {
                  const match = log.match(/^(\[[^\]]+\])\s*(.*)$/);
                  const prefix = match ? match[1] : '';
                  const content = match ? match[2] : log;

                  let prefixColor = 'text-slate-800 font-extrabold';
                  if (prefix === '[준수]') prefixColor = 'text-emerald-700 font-extrabold';
                  if (prefix === '[주의]') prefixColor = 'text-amber-700 font-extrabold';
                  if (prefix === '[위반]') prefixColor = 'text-rose-700 font-extrabold';

                  return (
                    <p key={i} className="text-[12px] leading-relaxed font-medium text-slate-600">
                      <span className={prefixColor}>{prefix}</span> {content}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
