import { useStore } from '../store/useStore';
import { INITIAL_ACADEMIES } from '../utils';

export default function Cabinet() {
  const {
    selectedContractId,
    setSelectedContractId,
    contracts,
    persons,
    signatureLogs,
    academies,
    eventLogs,
  } = useStore();

  return (
    <div className="space-y-4">
      {selectedContractId ? (
        (() => {
          const c = contracts.find(contract => contract.id === selectedContractId);
          const person = persons.find(p => p.id === c?.personId);
          const sigLog = signatureLogs.find(sl => sl.documentId === c?.id);

          if (!c) return null;

          return (
            <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <button
                  onClick={() => setSelectedContractId(null)}
                  className="flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <span>← 보관함 전체 목록</span>
                </button>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${c.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}
                >
                  {c.status === 'completed' ? '체결 및 위변조 방지 봉인완료' : '서명 전송 대기'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="max-h-[350px] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap lg:col-span-2">
                  {(() => {
                    const contractAcademy =
                      academies.find(a => a.id === c.academyId) ||
                      academies[0] ||
                      INITIAL_ACADEMIES[0];
                    return (
                      <>
                        <h4 className="mb-3 border-b border-slate-200 pb-2 text-center font-bold text-slate-950">
                          {c.title}
                        </h4>
                        <p className="mb-2">
                          <strong>[계약 서명 당사자]</strong>
                        </p>
                        <p className="mb-1">
                          원 장 (학원): {contractAcademy.ownerName} ({contractAcademy.name})
                        </p>
                        <p className="mb-3">
                          상대방 (강사): {person?.name} ({person?.phone})
                        </p>

                        <p className="mb-2">
                          <strong>[임금 및 근로 상세]</strong>
                        </p>
                        <p className="mb-1">
                          근로형태:{' '}
                          {c.contractType === 'freelancer' ? '프리랜서 위촉' : '표준정직원근로'}
                        </p>
                        <p className="mb-1">약정시급: 시간당 {c.salaryAmount.toLocaleString()}원</p>
                        <p className="mb-4">소정시간: 주당 {c.weeklyHours}시간 근무</p>

                        <p className="text-slate-505 mb-4 border-t border-slate-200 pt-2.5 text-[11px] leading-relaxed">
                          본 계약서는 전자서명법에 따라 모바일 휴대폰 CI 본인인증과 터치 수기 서명을
                          필두로 작성되었으며 원본 대조가 보증된 해시 사슬 봉인을 준수합니다.
                        </p>

                        <div className="mt-6 flex justify-between border-t border-slate-100 pt-3">
                          <div className="border-slate-105 flex w-1/2 flex-col items-center justify-center border-r text-center">
                            <p className="text-[10px] text-slate-400">발송/체결인 (학원)</p>
                            <div className="relative my-1 flex h-12 w-12 items-center justify-center">
                              {contractAcademy.stampImage && (
                                <img
                                  src={contractAcademy.stampImage}
                                  alt="seal"
                                  className="absolute h-11 w-11 object-contain opacity-85"
                                />
                              )}
                              <p className="z-10 rounded bg-white/20 px-0.5 text-[11px] leading-none font-extrabold text-slate-900">
                                {contractAcademy.ownerName}
                              </p>
                            </div>
                            <span className="block text-[8px] font-bold text-indigo-600">
                              VERIFIED HAKON ADMIN
                            </span>
                          </div>
                          <div className="flex w-1/2 flex-col items-center justify-center text-center">
                            <p className="text-[10px] text-slate-400">자필서명인 (강사)</p>
                            {c.status === 'completed' ? (
                              <div className="mt-1 flex flex-col items-center justify-center">
                                {sigLog?.signatureData ? (
                                  <img
                                    src={sigLog.signatureData}
                                    alt="sig"
                                    className="h-7 object-contain"
                                  />
                                ) : (
                                  <p className="mt-1 font-bold text-emerald-600">
                                    {person?.name} (서명완료)
                                  </p>
                                )}
                                <span className="block font-mono text-[8px] font-bold text-emerald-500">
                                  CI_VERIFIED
                                </span>
                              </div>
                            ) : (
                              <p className="mt-2 text-slate-400 italic">서명 미날인</p>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="space-y-4">
                  <div className="space-y-3 rounded-xl bg-slate-900 p-4 text-white">
                    <span className="block text-[10px] font-bold text-indigo-400 uppercase">
                      감사추적 검증서 (EC-12 / 8.2)
                    </span>

                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-400">해시무결성:</span>
                        <span className="max-w-[120px] truncate text-indigo-300">{c.hash}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-400">서명 일자:</span>
                        <span>
                          {sigLog ? new Date(sigLog.timestamp).toLocaleString() : '미서명'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-400">고유식별 CI:</span>
                        <span className="max-w-[120px] truncate text-emerald-400">
                          {sigLog ? sigLog.verifiedCi : '미검증'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">접속 IP:</span>
                        <span className="text-slate-300">
                          {sigLog ? sigLog.ipAddress : '기록전'}
                        </span>
                      </div>
                    </div>

                    {c.status === 'completed' ? (
                      <div className="bg-emerald-955/40 rounded border border-emerald-900 p-2.5 text-[10px] leading-relaxed text-slate-300">
                        <p className="font-bold text-emerald-400">✔ 법정 증거 규격 충족</p>
                        <p className="mt-1">
                          인물 고유 CI값과 서명 궤적, 약관 열람 타임라인이 안전하게 매칭되어 사후
                          부인 방지 및 민형사 분쟁 증거력을 확보했습니다.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-amber-955/40 rounded border border-amber-900 p-2.5 text-[10px] leading-relaxed text-slate-300">
                        <p className="font-bold text-amber-400">⚠ 서명 수신 대기</p>
                        <p className="mt-1">
                          강사 모바일 마이페이지를 통한 수기 확인 날인 절차가 완료되면 증거 사슬이
                          자동 완성됩니다.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <span className="mb-2 block text-[10px] font-bold text-slate-400 uppercase">
                      이 문서의 흐름 타임라인
                    </span>
                    <div className="space-y-2">
                      {eventLogs
                        .filter(l => l.targetId === c.id)
                        .map(l => (
                          <div key={l.id} className="border-l border-slate-300 pl-2 text-[10px]">
                            <span className="block font-mono text-[8px] text-slate-400">
                              {new Date(l.timestamp).toLocaleString()}
                            </span>
                            <p className="font-bold text-slate-700">
                              {l.actor} - {l.eventType}
                            </p>
                            <p className="line-clamp-1 text-slate-500">{l.details}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-sm font-extrabold tracking-wider text-slate-900 uppercase">
              학원 전자 계약 보관함 (EC-13)
            </h2>
            <p className="text-slate-550 text-xs">
              대치 학온 수학학원 테넌트에 안전하게 격리 보관된 계약 리스트입니다.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 font-bold text-slate-400">
                  <th className="px-3 py-2">계약 문서 명칭</th>
                  <th className="px-3 py-2">서명 대상자</th>
                  <th className="px-3 py-2">노무 진단</th>
                  <th className="px-3 py-2">상태</th>
                  <th className="px-3 py-2 text-right">조회</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map(c => {
                  const person = persons.find(p => p.id === c.personId);
                  return (
                    <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-3 py-2.5">
                        <div className="font-bold text-slate-900">{c.title}</div>
                        <span className="mt-0.5 block font-mono text-[9px] text-slate-400">
                          {c.id}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-700">
                        <div>{person?.name}</div>
                        <span className="mt-0.5 block font-mono text-[10px] text-slate-400">
                          {person?.phone}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            c.riskStatus === 'safe'
                              ? 'bg-emerald-50 text-emerald-700'
                              : c.riskStatus === 'warning'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {c.riskStatus === 'safe' ? '안전성 검증' : '보완 필요'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex items-center space-x-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            c.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          <span
                            className={`h-1 w-1 rounded-full ${c.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          ></span>
                          <span>{c.status === 'completed' ? '체결 완료' : '대기'}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          onClick={() => setSelectedContractId(c.id)}
                          className="rounded bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-slate-800"
                        >
                          증적조회
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
