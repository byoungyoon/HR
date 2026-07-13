import ClickNextStepAction from '../_action/step1/ClickNextStep.action';
import FormAction from '../_action/step1/Form.action';
import SelectTemplateAction from '../_action/step1/SelectTemplate.action';

export default function Step1Area() {
  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-15 text-text-main font-bold">강사 정보를 입력해주세요</h3>
        <p className="text-12 text-text-side font-medium">
          계약을 맺을 강사의 기본 정보를 입력합니다.
        </p>
        <div className="mt-2">
          <FormAction />
        </div>
      </div>

      <div className="border-custom-slate-border-side space-y-3 border-t pt-4">
        <h3 className="text-15 text-text-main font-bold">계약 유형</h3>
        <SelectTemplateAction />
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <ClickNextStepAction />
      </div>
    </section>
  );
}
