import { ArrowRight } from 'lucide-react';
import { useWizaredStore } from '../../state';

export default function ClickNextStepAction() {
  const setWizardStep = useWizaredStore(state => state.setWizardStep);

  const handleNext = () => {
    setWizardStep(2);
  };

  return (
    <button
      onClick={handleNext}
      className="flex cursor-pointer items-center space-x-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-black text-white shadow-sm transition-all duration-200 hover:bg-slate-800"
    >
      <span>다음 단계로</span>
      <ArrowRight className="h-3.5 w-3.5" />
    </button>
  );
}
