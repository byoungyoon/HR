'use client';

import { ArrowRight, ChevronLeft } from 'lucide-react';
import { useWizaredStore } from '../state';

export default function Step3Area() {
  const { wizSpecialClause, setWizSpecialClause, setWizardStep } = useWizaredStore();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700">특약사항 (선택)</label>
          <textarea
            value={wizSpecialClause}
            onChange={e => setWizSpecialClause(e.target.value)}
            rows={5}
            placeholder="추가적인 약정사항이 있으면 입력해주세요..."
            className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs leading-relaxed focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
        </div>

        {/* 팁 박스 및 독소 조항 시뮬레이션 */}
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold text-slate-700">
            💡 법적 위반 독소 조항 시뮬레이션 (클릭 시 입력창에 추가)
          </p>
          <p className="text-[11px] text-slate-500">
            실시간 노무 분석 엔진이 어떤 조항을 독소 조항으로 감지하는지 체험해 보십시오.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setWizSpecialClause(
                  wizSpecialClause +
                    (wizSpecialClause ? '\n' : '') +
                    '지각이나 결석 시 급여의 일부를 강제 삭감하거나 벌금 처리한다.'
                )
              }
              className="rounded-xl border border-red-100 bg-red-50 px-2.5 py-1.5 text-[10px] font-extrabold text-red-700 transition-colors hover:bg-red-100"
            >
              + '지각/결석 벌금' 삽입
            </button>
            <button
              type="button"
              onClick={() =>
                setWizSpecialClause(
                  wizSpecialClause +
                    (wizSpecialClause ? '\n' : '') +
                    '강사는 어떠한 경우에도 퇴직금을 청구하지 않기로 확약한다.'
                )
              }
              className="rounded-xl border border-red-100 bg-red-50 px-2.5 py-1.5 text-[10px] font-extrabold text-red-700 transition-colors hover:bg-red-100"
            >
              + '퇴직금 포기' 삽입
            </button>
            <button
              type="button"
              onClick={() =>
                setWizSpecialClause(
                  wizSpecialClause +
                    (wizSpecialClause ? '\n' : '') +
                    '학원 업무와 관련한 준비 및 회의 시간은 별도의 수당을 지급하지 아니한다.'
                )
              }
              className="rounded-xl border border-red-100 bg-red-50 px-2.5 py-1.5 text-[10px] font-extrabold text-red-700 transition-colors hover:bg-red-100"
            >
              + '준비/회의시간 무급' 삽입
            </button>
            <button
              type="button"
              onClick={() =>
                setWizSpecialClause(
                  wizSpecialClause +
                    (wizSpecialClause ? '\n' : '') +
                    '퇴사 후 2년간 반경 10km 이내 동종 업계 학원에 일체 근무할 수 없으며, 이를 어길 시 위약금을 지불한다.'
                )
              }
              className="rounded-xl border border-red-100 bg-red-50 px-2.5 py-1.5 text-[10px] font-extrabold text-red-700 transition-colors hover:bg-red-100"
            >
              + '경업금지/위약금' 삽입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
