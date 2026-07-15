import { ArrowRight, ChevronLeft } from 'lucide-react';
import { useWizaredStore } from '../state';
import Step2Sub1Area from './Step2.sub1.area';
import Step2Sub2Area from './Step2.sub2.area';
import Step2Sub3Area from './Step2.sub3.area';

function calculateDailyHours(start: string, end: string, breakStr: string): number {
  if (!start || !end) return 0;
  const [sH, sM] = start.split(':').map(Number);
  const [eH, eM] = end.split(':').map(Number);
  const totalMinutes = eH * 60 + eM - (sH * 60 + sM);
  let breakMinutes = 0;
  if (breakStr === '30분') breakMinutes = 30;
  else if (breakStr === '1시간') breakMinutes = 60;
  else if (breakStr === '1.5시간') breakMinutes = 90;
  else if (breakStr === '2시간') breakMinutes = 120;
  return Math.max(0, (totalMinutes - breakMinutes) / 60);
}

function calcPeriodDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  return (
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1
  );
}

export default function Step2Area() {
  const {
    wizStartDate,
    wizEndDate,
    wizProbation,
    wizDaysConfig,
    wizSalaryType,
    wizSalaryAmount,
    wizSubStep,
    maxUnlockedSubStep,
    setWizardStep,
  } = useWizaredStore();

  const periodDays = calcPeriodDays(wizStartDate, wizEndDate);
  const isUnderOneYear = periodDays > 0 && periodDays < 365;
  const isProbationWarning = wizProbation !== '없음' && parseInt(wizProbation) > 3;
  const hasStep1Warning = isUnderOneYear || isProbationWarning;

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
  const hasStep2Warning = weeklyHours >= 15;

  const minWageLimit = 10320;
  let hasStep3Warning = false;
  if (wizSalaryType === 'hourly') {
    hasStep3Warning = wizSalaryAmount < minWageLimit;
  } else {
    const weeklyRestHours = weeklyHours >= 15 ? Math.min(8, (weeklyHours / 40) * 8) : 0;
    const monthlyHours = (weeklyHours + weeklyRestHours) * 4.345;
    const calcMinWage = Math.round(monthlyHours * minWageLimit);
    hasStep3Warning = wizSalaryAmount < calcMinWage;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Step2Sub1Area hasWarning={hasStep1Warning} />
        {maxUnlockedSubStep >= 2 && <Step2Sub2Area hasWarning={hasStep2Warning} />}
        {maxUnlockedSubStep >= 3 && <Step2Sub3Area hasWarning={hasStep3Warning} />}
      </div>

      <div className="flex justify-between border-t border-slate-100 pt-5">
        <button
          onClick={() => setWizardStep(1)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>이전 (강사 선택)</span>
        </button>

        {wizSubStep === 0 && (
          <button
            onClick={() => setWizardStep(3)}
            className="animate-in fade-in flex cursor-pointer items-center space-x-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-black text-white shadow-sm transition-all duration-200 hover:bg-slate-800"
          >
            <span>특약사항 및 리스크 자문으로 넘어가기</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
