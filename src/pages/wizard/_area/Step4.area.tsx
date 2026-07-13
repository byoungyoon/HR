import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { analyzeContractContent } from '../../../utils';
import { useWizaredStore } from '../state';

export default function Step4Area() {
  const navigate = useNavigate();
  const { persons, handleSendContract } = useStore();
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

  const handleSend = () => {
    handleSendContract(validationResult);
    navigate('/admin/cabinet');
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
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
  );
}
