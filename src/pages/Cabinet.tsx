import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useWizaredStore } from './wizard/state';
import { INITIAL_ACADEMIES } from '../utils';
import { Contract } from '../types';
import { FileText, Edit3, Search, Users } from 'lucide-react';

export default function Cabinet() {
  const navigate = useNavigate();
  const {
    selectedContractId,
    setSelectedContractId,
    contracts,
    persons,
    signatureLogs,
    academies,
    eventLogs,
    showToast,
    setContracts,
  } = useStore();

  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleEditContract = (c: Contract) => {
    const person = persons.find(p => p.id === c.personId);
    useWizaredStore.setState({
      wizInstructorId: c.personId,
      wizInstructorName: person?.name || '',
      wizContractType: c.contractType,
      wizSalaryType: c.salaryType,
      wizSalaryAmount: c.salaryAmount,
      wizStartDate: c.contractStart,
      wizEndDate: c.contractEnd,
      wizSalaryApplied: true,
      wizardStep: 2,
      wizSubStep: 3,
    });
    navigate('/wizard');
    showToast(`${person?.name || '강사'}님의 계약서 수정을 시작합니다.`, 'info');
  };

  const handleDeleteContract = (id: string) => {
    if (window.confirm('정말로 이 계약서를 삭제하시겠습니까?')) {
      setContracts(prev => prev.filter(c => c.id !== id));
      showToast('계약서가 정상적으로 삭제되었습니다.', 'success');
    }
  };

  const drafts = contracts.filter(c => c.status === 'draft');

  const filteredContracts = contracts.filter(c => {
    if (c.status === 'draft') return false;
    if (selectedPersonId && c.personId !== selectedPersonId) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const person = persons.find(p => p.id === c.personId);
      const titleMatch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      const nameMatch = person?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      if (!titleMatch && !nameMatch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {selectedContractId ? (
        (() => {
          const c = contracts.find(contract => contract.id === selectedContractId);
          const person = persons.find(p => p.id === c?.personId);
          const sigLog = signatureLogs.find(sl => sl.documentId === c?.id);

          if (!c) return null;

          return (
            <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 ">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <button
                  onClick={() => setSelectedContractId(null)}
                  className="flex items-center space-x-1 text-xs font-bold text-custom-indigo hover:text-custom-indigo-hover cursor-pointer"
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
                        <h4 className="mb-3 border-b border-slate-200 pb-2 text-center font-bold text-slate-955">
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
                          {c.contractType === '강사위촉계약서' ? '프리랜서 위촉' : '표준근로계약'}
                        </p>
                        <p className="mb-1">약정시급: 시간당 {c.salaryAmount.toLocaleString()}원</p>
                        <p className="mb-4">소정시간: 주당 {c.weeklyHours}시간 근무</p>

                        <p className="text-slate-500 mb-4 border-t border-slate-200 pt-2.5 text-[11px] leading-relaxed">
                          본 계약서는 전자서명법에 따라 모바일 휴대폰 CI 본인인증과 터치 수기 서명을
                          필두로 작성되었으며 원본 대조가 보증된 해시 사슬 봉인을 준수합니다.
                        </p>

                        <div className="mt-6 flex justify-between border-t border-slate-100 pt-3">
                          <div className="border-slate-100 flex w-1/2 flex-col items-center justify-center border-r text-center">
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
                            <span className="block text-[8px] font-bold text-custom-indigo">
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
                                <span className="block font-mono text-[8px] font-bold text-emerald-505">
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
                    <span className="block text-[10px] font-bold text-custom-indigo-side uppercase">
                      감사추적 검증서
                    </span>

                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-400">해시무결성:</span>
                        <span className="max-w-[120px] truncate text-custom-indigo-side">{c.hash}</span>
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
        <div className="space-y-6">
          {/* 상단: 작성 중인 임시 계약서 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5  space-y-4">
            <div>
              <h2 className="text-sm font-extrabold tracking-wider text-slate-900 uppercase">
                작성중 계약서
              </h2>
            </div>

            {drafts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drafts.map(c => {
                  const person = persons.find(p => p.id === c.personId);
                  return (
                    <div
                      key={c.id}
                      className="relative rounded-2xl border border-slate-200 bg-white p-4  hover: hover:border-custom-indigo-border-hover transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center gap-1 rounded bg-custom-indigo-bg px-2 py-0.5 text-[9px] font-bold text-custom-indigo">
                            임시 저장
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">
                          {c.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold mb-3">
                          대상 강사: {person?.name || '미지정'} ({person?.phone || ''})
                        </p>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 pt-2.5 border-t border-slate-100/60">
                        <button
                          type="button"
                          onClick={() => handleDeleteContract(c.id)}
                          className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        >
                          삭제
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditContract(c)}
                          className="flex items-center gap-1 rounded-xl bg-custom-indigo px-3 py-1.5 text-[10px] font-bold text-white hover:bg-custom-indigo-hover transition-all cursor-pointer"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>수정</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs font-semibold text-slate-400">
                작성 중인 임시 계약서가 보관함에 존재하지 않습니다.
              </div>
            )}
          </div>

          {/* 하단: 강사 리스트 | 테이블 | 필터 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5  space-y-4">
            <div>
              <h2 className="text-sm font-extrabold tracking-wider text-slate-900 uppercase">
                학원 전자 계약 보관함
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
              {/* 좌측: 강사 리스트 */}
              <div className="lg:col-span-1 space-y-2">
                <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-wider">
                  <span>강사 목록</span>
                </h3>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-2 space-y-1 max-h-[350px] overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedPersonId(null)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition-all cursor-pointer ${
                      selectedPersonId === null
                        ? 'bg-slate-900 text-white '
                        : 'text-slate-655 hover:bg-slate-100/50'
                    }`}
                  >
                    <span>전체 강사</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full ${selectedPersonId === null ? 'bg-white/20 text-white font-extrabold' : 'bg-slate-200/80 text-slate-500'}`}
                    >
                      {contracts.filter(c => c.status !== 'draft').length}
                    </span>
                  </button>
                  {persons.map(p => {
                    const count = contracts.filter(c => c.personId === p.id && c.status !== 'draft').length;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPersonId(p.id)}
                        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition-all cursor-pointer ${
                          selectedPersonId === p.id
                            ? 'bg-custom-indigo text-white '
                            : 'text-slate-655 hover:bg-slate-100/50'
                        }`}
                      >
                        <span>{p.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full ${selectedPersonId === p.id ? 'bg-white/20 text-white font-extrabold' : 'bg-slate-200/80 text-slate-500'}`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 우측: 필터 + 테이블 */}
              <div className="lg:col-span-3 space-y-3">
                {/* 필터 바 */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-200">
                  <div className="relative w-full sm:max-w-xs">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="계약서 명칭 검색..."
                      className="w-full h-8 pl-8 pr-3 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-custom-indigo-border"
                    />
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  </div>

                  <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
                    {['all', 'completed', 'pending_signature'].map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={`h-8 px-3 rounded-xl border text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                          statusFilter === status
                            ? 'border-slate-900 bg-slate-900 text-white '
                            : 'border-slate-200 bg-white text-slate-655 hover:border-slate-350 hover:bg-slate-50'
                        }`}
                      >
                        {status === 'all'
                          ? '전체 상태'
                          : status === 'completed'
                            ? '체결 완료'
                            : '대기'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 계약서 테이블 */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white ">
                  <table className="w-full border-collapse text-left text-xs min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-450">
                        <th className="px-4 py-3">서명 대상자</th>
                        <th className="px-4 py-3">상태</th>
                        <th className="px-4 py-3">계약일</th>
                        <th className="px-4 py-3">계약서 작성일</th>
                        <th className="px-4 py-3 text-right">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContracts.length > 0 ? (
                        filteredContracts.map(c => {
                          const person = persons.find(p => p.id === c.personId);
                          return (
                            <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/30 text-slate-700">
                              <td className="px-4 py-3">
                                <div className="font-bold text-slate-900">{person?.name}</div>
                                <span className="mt-0.5 block font-mono text-[9px] text-slate-400">
                                  {person?.phone}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                    c.status === 'completed'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                                  }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${c.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                  ></span>
                                  <span>{c.status === 'completed' ? '체결 완료' : '대기'}</span>
                                </span>
                              </td>
                              <td className="px-4 py-3 font-semibold text-xs text-slate-600">
                                {c.contractStart} ~ {c.contractEnd}
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-500">
                                {new Date(c.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedContractId(c.id)}
                                    className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-350 transition-all cursor-pointer"
                                    title="상세보기"
                                  >
                                    상세보기
                                  </button>

                                  {c.status !== 'completed' ? (
                                    <>
                                      <button
                                        onClick={() => handleEditContract(c)}
                                        className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-custom-indigo hover:bg-custom-indigo-bg/30 transition-all cursor-pointer"
                                        title="수정"
                                      >
                                        수정
                                      </button>
                                      <button
                                        onClick={() => handleDeleteContract(c.id)}
                                        className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                                        title="삭제"
                                      >
                                        삭제
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => showToast('계약서 PDF 다운로드를 시작합니다.', 'info')}
                                      className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-350 transition-all cursor-pointer"
                                      title="다운로드"
                                    >
                                      다운로드
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(`https://hakon-hr.com/contract/sign/${c.id}`);
                                      showToast('카카오톡 공유 링크가 클립보드에 복사되었습니다.', 'success');
                                    }}
                                    className="rounded-xl bg-custom-indigo px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-custom-indigo-hover transition-all cursor-pointer"
                                    title="카카오톡 링크 공유"
                                  >
                                    공유
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-slate-400 font-bold">
                            조건에 부합하는 계약서가 보관함에 존재하지 않습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
