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
      className="flex cursor-pointer items-center space-x-1 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-100 transition-all duration-200 hover:bg-blue-700"
    >
      <span>다음</span>
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
