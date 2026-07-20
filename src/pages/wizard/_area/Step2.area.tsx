import { motion } from 'framer-motion';
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
    wizHasNonCompete,
    wizNonCompeteAmount,
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
    const adjustedBase = wizSalaryAmount - (wizHasNonCompete && wizSalaryType === 'monthly' ? wizNonCompeteAmount : 0);
    hasStep3Warning = wizSalaryAmount < calcMinWage || (wizHasNonCompete && wizSalaryType === 'monthly' && adjustedBase < calcMinWage);
  }

  const sub1 = <Step2Sub1Area key="sub1" hasWarning={hasStep1Warning} />;
  const sub2 = maxUnlockedSubStep >= 2 ? <Step2Sub2Area key="sub2" hasWarning={hasStep2Warning} /> : null;
  const sub3 = maxUnlockedSubStep >= 3 ? <Step2Sub3Area key="sub3" hasWarning={hasStep3Warning} /> : null;

  const items = [
    { id: 1, element: sub1 },
    { id: 2, element: sub2 },
    { id: 3, element: sub3 },
  ].filter(item => item.element !== null);

  let orderedItems = [...items];
  if (wizSubStep === 2) {
    const item2 = items.find(item => item.id === 2);
    const item1 = items.find(item => item.id === 1);
    const item3 = items.find(item => item.id === 3);
    orderedItems = [item2, item1, item3].filter(Boolean) as typeof items;
  } else if (wizSubStep === 3) {
    const item3 = items.find(item => item.id === 3);
    const item1 = items.find(item => item.id === 1);
    const item2 = items.find(item => item.id === 2);
    orderedItems = [item3, item1, item2].filter(Boolean) as typeof items;
  }

  return (
    <div className="space-y-6">
      <motion.div layout className="space-y-4">
        {orderedItems.map(item => (
          <motion.div key={item.id} layout transition={{ type: 'spring', stiffness: 220, damping: 26 }}>
            {item.element}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
