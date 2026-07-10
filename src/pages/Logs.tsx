import { useStore } from '../store/useStore';

export default function Logs() {
  const { eventLogs } = useStore();

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-extrabold tracking-wider text-slate-950 uppercase">
            학온 통합 활동 감사이력 (EventLog - 10.3)
          </h2>
          <p className="text-xs text-slate-500">
            법적 사후부인방지 및 위변조 방지를 검증하는 무결성 해시 사슬 구조를 시뮬레이션합니다.
          </p>
        </div>
        <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-[9px] font-extrabold text-white">
          HASH CHAIN ACTIVE
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left font-mono text-[10px]">
          <thead>
            <tr className="border-slate-150 border-b bg-slate-50 font-bold text-slate-400">
              <th className="px-2.5 py-2">이벤트 ID</th>
              <th className="px-2.5 py-2">로그 유형</th>
              <th className="px-2.5 py-2">주체 (Actor)</th>
              <th className="px-2.5 py-2">수행 세부 명세</th>
              <th className="px-2.5 py-2">이전 해시 (prevHash)</th>
              <th className="px-2.5 py-2 text-right">현재 해시 (hash)</th>
            </tr>
          </thead>
          <tbody>
            {eventLogs.map(l => (
              <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-2.5 py-2.5 text-slate-500">{l.id}</td>
                <td className="px-2.5 py-2.5">
                  <span
                    className={`rounded px-1 text-[8px] font-extrabold ${
                      l.eventType === 'SIGNED' || l.eventType === 'CONTRACT_COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : l.eventType === 'RISK_DETECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {l.eventType}
                  </span>
                </td>
                <td className="px-2.5 py-2.5 font-sans font-bold text-slate-700">{l.actor}</td>
                <td className="max-w-xs truncate px-2.5 py-2.5 font-sans text-slate-600">
                  {l.details}
                </td>
                <td
                  className="max-w-[80px] truncate px-2.5 py-2.5 text-[9px] text-slate-400"
                  title={l.prevHash}
                >
                  {l.prevHash.slice(0, 12)}...
                </td>
                <td
                  className="max-w-[80px] truncate px-2.5 py-2.5 text-right text-[9px] font-bold text-indigo-600"
                  title={l.hash}
                >
                  {l.hash.slice(0, 12)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
