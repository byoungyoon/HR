import FormAction from '../_action/step1/Form.action';
import SelectTemplateAction from '../_action/step1/SelectTemplate.action';

export default function Step1Area() {
  return (
    <section className="space-y-6">
      <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <h3 className="text-15 text-text-main font-bold">강사 정보</h3>
        <FormAction />
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <h3 className="text-15 text-text-main font-bold">계약 유형</h3>
        <SelectTemplateAction />
      </div>
    </section>
  );
}
