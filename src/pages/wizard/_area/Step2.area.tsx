import {
  AlertTriangle,
  ArrowRight,
  CalendarRange,
  Check,
  CheckCircle2,
  Info,
  Sparkles,
} from 'lucide-react';
import Accordion from '../_component/Accordion';
import { useWizaredStore } from '../state';
import Step2Sub1Area from './Step2.sub1.area';
import Step2Adv1Area from './Step2.adv1.area';
import Step2Sub2Area from './Step2.sub2.area';
import Step2Sub3Area from './Step2.sub3.area';
import Step2Adv2Area from './Step2.adv2.area';
import Step2Adv3Area from './Step2.adv3.area';

export default function Step2Area() {
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
    wizardStep,
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

  const isAllClosed = wizSubStep === 0;

  return (
    <div className="grid max-w-full grid-cols-1 items-start gap-6 lg:grid-cols-12">
      {/* 왼쪽 컬럼: 작성 단계 (아코디언 리스트) */}
      <div className={`space-y-4 ${isAllClosed ? 'lg:col-span-12' : 'lg:col-span-8'}`}>
        {/* [1단계] 계약 기간 및 수습 설정 */}
        <Step2Sub1Area />

        {maxUnlockedSubStep >= 2 && <Step2Sub2Area />}

        {/* [3단계] 급여 및 비과세 설정 */}
        {maxUnlockedSubStep >= 3 && <Step2Sub3Area />}
      </div>

      {/* 오른쪽 컬럼: 실시간 자문 */}
      {!isAllClosed && (
        <div className="space-y-4 lg:sticky lg:top-6 lg:col-span-4 animate-in fade-in duration-200">
          <div className="space-y-4 rounded-3xl border border-indigo-100/70 bg-indigo-50/40 p-4">
            {wizSubStep === 1 && <Step2Adv1Area />}

            {wizSubStep === 2 && <Step2Adv2Area />}

            {wizSubStep === 3 && <Step2Adv3Area />}
          </div>
        </div>
      )}

      {/* 하단 이동 바 */}
      <div className="col-span-12 flex justify-between border-t border-slate-100 pt-5">
        {wizSubStep === 1 ? (
          <button
            onClick={() => setWizardStep(1)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50"
          >
            이전 (강사선택)
          </button>
        ) : (
          <button
            onClick={() => setWizSubStep((wizSubStep === 0 ? 3 : wizSubStep - 1) as any)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50"
          >
            이전 단계로 ({wizSubStep === 2 ? '계약 기간' : wizSubStep === 3 ? '근무 일정' : '급여 설정'})
          </button>
        )}

        {wizSubStep === 0 && (
          <button
            onClick={() => setWizardStep(3)}
            className="flex items-center space-x-1 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-100 transition-all duration-200 hover:bg-blue-700 animate-in fade-in"
          >
            <span>특약사항 및 리스크 자문으로 넘어가기</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
