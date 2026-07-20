'use client';

import { useState, useEffect } from 'react';
import { useWizaredStore } from '../state';
import { useStore } from '@/src/store/useStore';

export default function Step1AdvArea() {
  const { persons, contracts } = useStore();
  const {
    wizInstructorId,
    wizContractType,
    setWizContractType,
    setWizSalaryType,
    setWizSalaryAmount,
    setWizStartDate,
    setWizEndDate,
    setWizProbation,
    setWizScheduleApplied,
    setWizSalaryApplied,
    setWizardStep,
    setWizSubStep,
    setMaxUnlockedSubStep,
  } = useWizaredStore();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [wizInstructorId]);

  const selectedInstructor = persons.find(p => p.id === wizInstructorId);
  const isExistingInstructor = !!selectedInstructor;
  const instructorContracts = contracts.filter(c => c.personId === wizInstructorId);
  const hasPrevContract = isExistingInstructor && instructorContracts.length > 0;

  const latestContract = hasPrevContract
    ? [...instructorContracts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]
    : null;

  const handleLoadContract = () => {
    if (latestContract) {
      setWizContractType(latestContract.contractType);
      setWizSalaryType(latestContract.salaryType);
      setWizSalaryAmount(latestContract.salaryAmount);
      setWizStartDate(latestContract.contractStart);
      setWizEndDate(latestContract.contractEnd);
      setWizProbation('3개월');
      setWizScheduleApplied(true);
      setWizSalaryApplied(true);
      
      // Advance to step 2 in completed/folded view
      setWizardStep(2);
      setWizSubStep(0);
      setMaxUnlockedSubStep(3);
      setLoaded(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <div className="border-b border-slate-100 pb-3">
          <h4 className="text-13 font-bold text-slate-800">이전 계약서 불러오기</h4>
        </div>

        {isExistingInstructor ? (
          hasPrevContract && latestContract ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4 text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">계약서 명칭</span>
                  <span className="font-extrabold text-slate-800">{latestContract.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">계약 유형</span>
                  <span className="font-extrabold text-slate-800">{latestContract.contractType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">급여 조건</span>
                  <span className="font-extrabold text-slate-800">
                    {latestContract.salaryType === 'hourly'
                      ? '시급'
                      : latestContract.salaryType === 'monthly'
                        ? '월급'
                        : '연봉'}{' '}
                    {latestContract.salaryAmount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">계약 기간</span>
                  <span className="font-extrabold text-slate-800">
                    {latestContract.contractStart} ~ {latestContract.contractEnd}
                  </span>
                </div>
              </div>

              {loaded ? (
                <div className="rounded-2xl bg-emerald-50 p-3 text-center text-xs font-bold text-emerald-700">
                  이전 계약 조건을 정상적으로 불러왔습니다.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLoadContract}
                  className="w-full rounded-xl bg-custom-indigo py-3 text-center text-xs font-black text-white shadow-sm hover:bg-custom-indigo-hover transition-colors cursor-pointer"
                >
                  이전 계약 조건 불러오기
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400 font-medium">
              이 강사의 이전 계약서 기록이 존재하지 않습니다.
            </div>
          )
        ) : (
          <div className="text-center py-6 text-xs text-slate-400 font-medium">
            신규 강사 등록 모드입니다.
          </div>
        )}
      </div>

      <div className="space-y-2.5 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <h4 className="text-13 font-bold text-slate-800">선택된 계약서 법적 지침</h4>
        <p className="text-xs leading-relaxed font-semibold text-slate-600">
          현재 선택된 계약 유형은{' '}
          <strong className="font-black text-slate-900">
            {wizContractType || '강사근로계약서'}
          </strong>
          입니다.
        </p>
        <div className="space-y-2 rounded-2xl border border-custom-indigo-border/50 bg-custom-indigo-bg/30 p-3.5 text-xs text-slate-900">
          <p className="font-extrabold">주요 노무 체크포인트:</p>
          <ul className="list-disc space-y-1 pl-4 leading-relaxed font-semibold text-custom-indigo/80">
            <li>
              근로관계 성립 시 근로기준법상 주휴수당 및 연차휴가 지급 의무 검토가 필요합니다.
            </li>
            <li>
              향후 2단계에서 입력할 소정근로시간 및 급여 설정에 따라 자동으로 위험 항목을 탐지하여 실시간 자문이 표시됩니다.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
