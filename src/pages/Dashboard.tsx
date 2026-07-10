import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { contracts, eventLogs, persons } = useStore();

  return (
    <div className="space-y-6">
      {/* 통계 상자 - Bento Dashboard Style */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="flex items-center justify-between rounded-3xl border border-slate-100 bg-gradient-to-br from-indigo-50/20 via-white to-white p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03),0_8px_16px_-8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:scale-[1.01] hover:border-indigo-100 hover:shadow-md">
          <div>
            <span className="block text-[10px] font-black tracking-wider text-slate-400 uppercase">
              총 등록 문서
            </span>
            <span className="mt-1.5 block font-mono text-2xl font-black text-slate-900">
              {contracts.length}건
            </span>
          </div>
          <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
            <FileText className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-3xl border border-slate-100 bg-gradient-to-br from-amber-50/20 via-white to-white p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03),0_8px_16px_-8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:scale-[1.01] hover:border-amber-100 hover:shadow-md">
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

        <div className="flex items-center justify-between rounded-3xl border border-slate-100 bg-gradient-to-br from-emerald-50/20 via-white to-white p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03),0_8px_16px_-8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:scale-[1.01] hover:border-emerald-100 hover:shadow-md">
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

        <div className="flex items-center justify-between rounded-3xl border border-slate-100 bg-gradient-to-br from-rose-50/20 via-white to-white p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03),0_8px_16px_-8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:scale-[1.01] hover:border-rose-100 hover:shadow-md">
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

      {/* 노무 진단 리스트 및 실시간 알림 - Bento Grid Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <div>
            <span className="mb-3 block text-[9px] font-extrabold tracking-widest text-indigo-400 uppercase">
              법령 검증 엔진 (EC-17)
            </span>
            <h4 className="mb-2.5 text-base font-bold">2026년도 최저 시급 자동 적용</h4>
            <p className="text-xs leading-relaxed font-light text-slate-300">
              학온 법률 연동 모듈이 시간당 최저임금{' '}
              <strong className="font-mono font-bold text-white">10,320원</strong> 기준을 기반으로
              근로조건 적법성 및 독소 조항 포함 여부를 실시간 위배 여부 필터링 중입니다.
            </p>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-3 font-mono text-[10px] text-slate-500">
            <span>Engine: v2.4 (Active)</span>
            <span className="text-emerald-400">● Safe Verified</span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04),0_12px_24px_-10px_rgba(0,0,0,0.03)] transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
          <div>
            <span className="mb-4 block text-[9px] font-black tracking-widest text-slate-400 uppercase">
              원장 당면 과제 (To-Do)
            </span>
            <div className="space-y-3">
              <div className="flex items-start space-x-2.5 rounded-2xl border border-amber-100/60 bg-amber-50/40 p-3 text-xs">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <div>
                  <p className="font-bold text-slate-800">미서명 계약 리마인드</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    박서준 강사의 임용 서명이 수신되지 않았습니다.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5 rounded-2xl border border-rose-100/60 bg-rose-50/40 p-3 text-xs">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <div>
                  <p className="font-bold text-slate-800">독소 위반 조항 감지됨</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    지각에 따른 임의 급여 삭감은 무효 소지가 큽니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04),0_12px_24px_-10px_rgba(0,0,0,0.03)] transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
          <div>
            <span className="mb-4 block text-[9px] font-black tracking-widest text-slate-400 uppercase">
              최근 이력 요약 (EventLog)
            </span>
            <div className="space-y-3">
              {eventLogs
                .slice(-2)
                .reverse()
                .map(l => (
                  <div key={l.id} className="border-l-2 border-indigo-500 py-0.5 pl-3 text-xs">
                    <span className="block font-mono text-[9px] text-slate-400">
                      {new Date(l.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <p className="mt-0.5 font-bold text-slate-700">
                      {l.actor} ➔ {l.eventType}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-500">{l.details}</p>
                  </div>
                ))}
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/logs')}
            className="mt-4 flex items-center space-x-1 self-start text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
          >
            <span>감사로그 전체보기</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* 리스크 진단 목록 */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-extrabold tracking-wider text-slate-900 uppercase">
          최근 계약서 노무 위험도 검증 분석
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 font-bold text-slate-400">
                <th className="px-3 py-2">계약서 명칭</th>
                <th className="px-3 py-2">강사명</th>
                <th className="px-3 py-2">근무시간</th>
                <th className="px-3 py-2">위험도 진단</th>
                <th className="px-3 py-2">검증 로그</th>
              </tr>
            </thead>
            <tbody>
              {contracts.slice(0, 3).map(c => {
                const person = persons.find(p => p.id === c.personId);
                return (
                  <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-3 py-2.5 font-semibold text-slate-900">{c.title}</td>
                    <td className="px-3 py-2.5 text-slate-700">{person?.name || '미지정'}</td>
                    <td className="px-3 py-2.5 font-mono">주 {c.weeklyHours}시간</td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                          c.riskStatus === 'safe'
                            ? 'bg-emerald-50 text-emerald-700'
                            : c.riskStatus === 'warning'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {c.riskStatus === 'safe'
                          ? '안전'
                          : c.riskStatus === 'warning'
                            ? '주의'
                            : '위험'}
                      </span>
                    </td>
                    <td className="max-w-xs truncate px-3 py-2.5 text-[11px] text-slate-500">
                      {c.riskLog?.[0] || '특이사항 없음'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
