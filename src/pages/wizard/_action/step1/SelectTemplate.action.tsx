import { useShallow } from 'zustand/shallow';
import TemplateItem from '../../_component/TemplateItem';
import { useWizaredStore } from '../../state';

export default function SelectTemplateAction() {
  const { wizContractType, setWizContractType } = useWizaredStore(
    useShallow(state => ({
      wizContractType: state.wizContractText,
      setWizContractType: state.setWizContractText,
    }))
  );

  return (
    <div className="flex-[1 1] flex gap-3">
      <TemplateItem
        displayName="강사근로계약서"
        content="학원과 강사 간의 근로관계를 명확히 하는 계약서입니다. 법적 요건을 충족하는 표준 계약서 양식으로 작성됩니다."
        isSelected={wizContractType === '강사근로계약서'}
        onClick={() => setWizContractType('강사근로계약서')}
      />
      {/* <div className="pointer-events-none opacity-30 select-none">
        <TemplateItem
          displayName="강사위촉계약서"
          content="학원과 강사 간의 위촉관계를 명확히 하는 계약서입니다. 법적 요건을 충족하는 표준 위촉계약서 양식으로 작성됩니다."
          isSelected={wizContractType === '강사위촉계약서'}
          onClick={() => setWizContractType('강사위촉계약서')}
        />
      </div> */}
    </div>
  );
}
