import ClickNextStepAction from '../_action/step1/ClickNextStep.action';
import FormAction from '../_action/step1/Form.action';
import SelectTemplateAction from '../_action/step1/SelectTemplate.action';

export default function Step1Area() {
  return (
    <section className="space-y-6">
      <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <div className="space-y-1">
          <h3 className="text-15 text-text-main font-bold">강사 정보</h3>
          <p className="text-12 text-text-side font-medium">
            계약을 맺을 강사의 기본 정보를 입력합니다.
          </p>
        </div>
        <FormAction />
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <div className="space-y-1">
          <h3 className="text-15 text-text-main font-bold">계약 유형</h3>
          <p className="text-12 text-text-side font-medium">
            작성하고자 하는 계약서 양식을 선택해 주세요.
          </p>
        </div>
        <SelectTemplateAction />
      </div>

      <div className="flex justify-end pt-2">
        <ClickNextStepAction />
      </div>
    </section>
  );
}
