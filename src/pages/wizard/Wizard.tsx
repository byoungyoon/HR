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
import Step3Area from './_area/Step3.area';
import Step4Area from './_area/Step4.area';

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
    wizCommissionPercent,

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
      {wizardStep === 3 && <Step3Area />}

      {/* 스텝 4: 최종 초안 확인 및 발송 */}
      {wizardStep === 4 && <Step4Area />}
    </div>
  );
}
