import ClickNextStepAction from '../_action/step1/ClickNextStep.action';
import FormAction from '../_action/step1/Form.action';
import SelectTemplateAction from '../_action/step1/SelectTemplate.action';

export default function Step1Area() {
  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-800">강사 정보를 입력해주세요</h3>
        <p className="text-[11.5px] font-medium text-slate-500">
          계약을 맺을 강사의 기본 정보를 입력합니다.
        </p>

        <FormAction />
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h3 className="text-sm font-bold text-slate-800">계약 유형</h3>
        <SelectTemplateAction />
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <ClickNextStepAction />
      </div>
    </section>
  );
}
