import { useShallow } from 'zustand/shallow';
import TemplateItem from '../../_component/TemplateItem';
import { useWizaredStore } from '../../state';

export default function SelectTemplateAction() {
  const { wizContractType, setWizContractType } = useWizaredStore(
    useShallow(state => ({
      wizContractType: state.wizContractType,
      setWizContractType: state.setWizContractType,
    }))
  );

  return (
    <div className="flex">
      <div className="w-1/2">
        <TemplateItem
          displayName="강사근로계약서"
          content="학원과 강사 간의 근로관계를 명확히 하는 계약서입니다. 법적 요건을 충족하는 표준 계약서 양식으로 작성됩니다."
          isSelected={wizContractType === '강사근로계약서'}
          onClick={() => setWizContractType('강사근로계약서')}
        />
      </div>
    </div>
  );
}
