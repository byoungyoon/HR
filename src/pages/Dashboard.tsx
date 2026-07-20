import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useWizaredStore } from './wizard/state';
import { Contract } from '../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { contracts, persons, showToast } = useStore();

  // 갱신 필요 계약 필터링 (만료됨 또는 30일 이내 만료 임박)
  const renewalNeededContracts = contracts.filter(c => {
    if (c.status === 'draft') return false; // 임시저장은 제외
    if (!c.contractEnd) return false;
    const endDate = new Date(c.contractEnd);
    const today = new Date('2026-07-20'); // SSOT 현재 기준 시점
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30; // 30일 이내 만료 또는 만료 완료
  });

  const handleRenewContract = (c: Contract) => {
    const person = persons.find(p => p.id === c.personId);
    useWizaredStore.setState({
      wizInstructorId: c.personId,
      wizInstructorName: person?.name || '',
      wizContractType: c.contractType,
      wizardStep: 1,
      wizSubStep: 1,
      wizSalaryApplied: false,
    });
    navigate('/wizard');
    showToast(`${person?.name || '강사'}님의 재계약 작성을 시작합니다.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* 통계 상자 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white border-slate-200 p-5  transition-all duration-300 hover:scale-[1.01] hover:border-custom-indigo-border hover:">
          <div>
            <span className="block text-[10px] font-black tracking-wider text-slate-400 uppercase">
              총 등록 문서
            </span>
            <span className="mt-1.5 block font-mono text-2xl font-black text-slate-900">
              {contracts.length}건
            </span>
          </div>
          <div className="rounded-2xl bg-custom-indigo-bg p-3 text-custom-indigo">
            <FileText className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white border-slate-200 p-5  transition-all duration-300 hover:scale-[1.01] hover:border-amber-100 hover:">
          <div>
            <span className="block text-[10px] font-black tracking-wider text-slate-400 uppercase">
              서명 수신대기
            </span>
            <span className="mt-1.5 block font-mono text-2xl font-black text-amber-600">
              {contracts.filter(c => c.status === 'pending_signature').length}건
            </span>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
            <Clock className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white border-slate-200 p-5  transition-all duration-300 hover:scale-[1.01] hover:border-emerald-100 hover:">
          <div>
            <span className="block text-[10px] font-black tracking-wider text-slate-400 uppercase">
              봉인 체결 완료
            </span>
            <span className="mt-1.5 block font-mono text-2xl font-black text-emerald-600">
              {contracts.filter(c => c.status === 'completed').length}건
            </span>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white border-slate-200 p-5  transition-all duration-300 hover:scale-[1.01] hover:border-rose-100 hover:">
          <div>
            <span className="block text-[10px] font-black tracking-wider text-slate-400 uppercase">
              노무 위험 탐지
            </span>
            <span className="mt-1.5 block font-mono text-2xl font-black text-rose-600">
              {
                contracts.filter(c => c.riskStatus === 'danger' || c.riskStatus === 'warning')
                  .length
              }
              건
            </span>
          </div>
          <div className="rounded-2xl bg-rose-50 p-3 text-rose-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* 갱신 필요 계약 목록 */}
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 ">
        <div>
          <h3 className="text-sm font-extrabold tracking-wider text-slate-900 uppercase">
            갱신 필요 계약서 목록
          </h3>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/60 bg-white">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-450">
                <th className="px-4 py-3">서명 대상자</th>
                <th className="px-4 py-3">계약 문서 명칭</th>
                <th className="px-4 py-3">만료일자</th>
                <th className="px-4 py-3">만료 현황</th>
                <th className="px-4 py-3 text-right">갱신 관리</th>
              </tr>
            </thead>
            <tbody>
              {renewalNeededContracts.length > 0 ? (
                renewalNeededContracts.map(c => {
                  const person = persons.find(p => p.id === c.personId);
                  const endDate = new Date(c.contractEnd);
                  const today = new Date('2026-07-20');
                  const diffTime = endDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  const isExpired = diffDays < 0;

                  return (
                    <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/30 text-slate-700">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {person?.name || '미지정'}
                      </td>
                      <td className="px-4 py-3 font-semibold">{c.title}</td>
                      <td className="px-4 py-3 font-mono">{c.contractEnd}</td>
                      <td className="px-4 py-3">
                        {isExpired ? (
                          <span className="rounded bg-rose-50 border border-rose-100 px-2 py-0.5 text-[9px] font-bold text-rose-600">
                            만료 완료
                          </span>
                        ) : (
                          <span className="rounded bg-amber-50 border border-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                            만료 {diffDays}일 전
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRenewContract(c)}
                          className="inline-flex items-center gap-1 rounded-xl bg-custom-indigo px-3.5 py-1.5 text-[10px] font-bold text-white hover:bg-custom-indigo-hover transition-all  cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>재계약하기</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-bold">
                    현재 재계약 갱신이 시급한 계약서가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
