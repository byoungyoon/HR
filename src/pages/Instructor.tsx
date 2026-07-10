import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { FileText, ArrowRight, ChevronRight, Smartphone, FileSignature, Check } from 'lucide-react';
import { INITIAL_ACADEMIES } from '../utils';

export default function Instructor() {
  const navigate = useNavigate();

  const {
    persons,
    contracts,
    academies,
    selectedInstructorId,
    selectedMyPageContractId,
    signingStep,
    signConsentChecked,
    authPhone,
    authCode,
    isAuthSent,
    isAuthVerified,
    hasSignature,

    setSelectedInstructorId,
    setSelectedMyPageContractId,
    setSigningStep,
    setSignConsentChecked,
    setAuthPhone,
    setAuthCode,
    setIsAuthSent,
    setIsAuthVerified,
    setHasSignature,
    setCurrentRole,
    setSelectedContractId,
    addEventLog,
    handleSendSMS,
    handleVerifySMS,
    handleCompleteSignature,
    showToast,
  } = useStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const activeInstructor = persons.find(p => p.id === selectedInstructorId);
  const instructorContracts = contracts.filter(c => c.personId === selectedInstructorId);

  useEffect(() => {
    if (activeInstructor) {
      setAuthPhone(activeInstructor.phone);
    }
    setSigningStep('select');
    setSignConsentChecked(false);
    setIsAuthSent(false);
    setIsAuthVerified(false);
    setHasSignature(false);
  }, [selectedInstructorId]);

  // --- Drawing Canvas Handlers ---
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const onCompleteSignature = () => {
    const signatureData = canvasRef.current ? canvasRef.current.toDataURL() : undefined;
    handleCompleteSignature(signatureData);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* 좌측 강사 목록 변경 */}
      <div className="space-y-4 lg:col-span-1">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="mb-2.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            로그인 중인 강사 변경
          </span>
          <div className="space-y-1.5">
            {persons
              .filter(p => p.role === 'instructor')
              .map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedInstructorId(p.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-all ${
                    selectedInstructorId === p.id
                      ? 'border-emerald-600 bg-emerald-50/10 font-bold text-emerald-950'
                      : 'border-slate-100 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span>{p.name} 강사</span>
                    <span className="font-mono text-[9px] text-slate-400">{p.id.slice(-5)}</span>
                  </div>
                  <span className="mt-0.5 block text-[11px] font-normal text-slate-400">
                    {p.phone}
                  </span>
                </button>
              ))}
          </div>
        </div>

        <div className="space-y-2 rounded-xl bg-emerald-900 p-5 text-emerald-100">
          <span className="block text-[10px] font-extrabold tracking-wider text-emerald-400 uppercase">
            비대면 날인 모바일 지원 (PF-09)
          </span>
          <p className="text-xs leading-relaxed text-emerald-200">
            강사님은 카카오톡으로 전송된 고유 링크를 통하여 별도의 프로그램 설치 없이 즉시 신원 실명
            검증 및 자필 서명을 완료할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 우측 계약 서명 마법사 */}
      <div className="lg:col-span-3">
        {signingStep === 'select' && (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold tracking-wider text-slate-900 uppercase">
                {activeInstructor?.name} 강사님 전용 서명 보관함 (PF-09)
              </h2>
              <p className="text-xs text-slate-500">
                대치 학온 수학학원에서 발송된 전자계약 및 보안동의 검토 리스트입니다.
              </p>
            </div>

            <div className="space-y-3">
              {instructorContracts.length > 0 ? (
                instructorContracts.map(c => (
                  <div
                    key={c.id}
                    className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="shrink-0 rounded-lg bg-emerald-100 p-2 text-emerald-700">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-slate-955 text-xs font-bold">{c.title}</p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          시간당 {c.salaryAmount.toLocaleString()}원 | 계약 시기: {c.contractStart}{' '}
                          ~ {c.contractEnd}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 self-end sm:self-auto">
                      {c.status === 'completed' ? (
                        <span className="rounded bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                          ✔ 체결 및 봉인완료
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedMyPageContractId(c.id);
                            setSigningStep('read');
                          }}
                          className="flex items-center space-x-1 rounded bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                        >
                          <span>지금 서명 시작하기</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                  <p className="text-slate-505 text-xs">도착한 서명 요청이 아직 없습니다.</p>
                  <p
                    onClick={() => {
                      setCurrentRole('admin');
                      navigate('/admin/wizard');
                    }}
                    className="mt-1.5 cursor-pointer text-xs font-bold text-indigo-600"
                  >
                    원장 화면에서 새 계약서를 작성 및 전송해보세요 →
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {signingStep !== 'select' &&
          (() => {
            const c = contracts.find(contract => contract.id === selectedMyPageContractId);
            if (!c) return null;

            return (
              <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <button
                    onClick={() => setSigningStep('select')}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    ← 보관함으로 복귀
                  </button>
                  <div className="flex items-center space-x-2 font-mono text-[10px] font-bold text-slate-400">
                    <span className={signingStep === 'read' ? 'text-emerald-600' : ''}>
                      1. 조항열람
                    </span>
                    <ChevronRight className="h-3 w-3" />
                    <span className={signingStep === 'verify' ? 'text-emerald-600' : ''}>
                      2. 본인인증
                    </span>
                    <ChevronRight className="h-3 w-3" />
                    <span className={signingStep === 'sign' ? 'text-emerald-600' : ''}>
                      3. 날인기입
                    </span>
                    <ChevronRight className="h-3 w-3" />
                    <span className={signingStep === 'complete' ? 'text-emerald-600' : ''}>
                      4. 완료
                    </span>
                  </div>
                </div>

                {/* 1단계: 조항 읽기 */}
                {signingStep === 'read' && (
                  <div className="space-y-4">
                    <p className="text-slate-505 text-xs">
                      계약서의 모든 내용을 정확히 읽어 보시고 수령 합치 합의에 동의해 주십시오.
                    </p>

                    <div className="max-h-[250px] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                      {(() => {
                        const contractAcademy =
                          academies.find(a => a.id === c.academyId) ||
                          academies[0] ||
                          INITIAL_ACADEMIES[0];
                        return (
                          <>
                            <p className="mb-3 border-b border-slate-200 pb-1 text-center text-sm font-bold text-slate-900">
                              {c.title}
                            </p>
                            <p className="mb-2">
                              <strong>[주요 근로 합치조건]</strong>
                            </p>
                            <p className="mb-1">
                              원 장: {contractAcademy.name} ({contractAcademy.ownerName})
                            </p>
                            <p className="mb-2">강 사: {activeInstructor?.name}</p>
                            <p className="mb-1">
                              지급 형태: 시간당 {c.salaryAmount.toLocaleString()}원
                            </p>
                            <p className="mb-3">근로 시간: 주당 {c.weeklyHours}시간</p>
                            <p className="leading-relaxed">
                              {c.contractText ||
                                (c as any).wizContractText ||
                                '표준 합치 조건에 합의합니다.'}
                            </p>
                          </>
                        );
                      })()}
                    </div>

                    <label className="flex cursor-pointer items-start space-x-2 rounded-lg bg-slate-100 p-3 text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={signConsentChecked}
                        onChange={e => setSignConsentChecked(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600"
                      />
                      <span>
                        상기 모든 약정 근로 및 법정 조항을 정밀히 읽고 합의 완료하여 다음 휴대폰
                        본인확인 날인 절차를 이행합니다. (필수)
                      </span>
                    </label>

                    <div className="flex justify-end pt-2">
                      <button
                        disabled={!signConsentChecked}
                        onClick={() => {
                          setSigningStep('verify');
                          if (activeInstructor) {
                            addEventLog(
                              'DOCUMENT_VIEWED',
                              `강사 (${activeInstructor.name})`,
                              activeInstructor.id,
                              c.id,
                              '비대면 계약서 수령 합치 동의 완료.'
                            );
                          }
                        }}
                        className={`flex items-center space-x-1 rounded-lg px-4 py-2 text-xs font-bold ${
                          signConsentChecked
                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                            : 'cursor-not-allowed bg-slate-200 text-slate-400'
                        }`}
                      >
                        <span>본인인증 단계 진행</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 2단계: 휴대폰 실명 검증 (EC-10) */}
                {signingStep === 'verify' && (
                  <div className="mx-auto max-w-md space-y-5">
                    <div className="text-center">
                      <Smartphone className="mx-auto mb-1 h-6 w-6 text-emerald-600" />
                      <h3 className="text-xs font-bold text-slate-900">
                        전자 서명 법적 보증용 본인확인 (EC-10)
                      </h3>
                    </div>

                    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div>
                        <label className="mb-0.5 block text-[10px] font-bold text-slate-400">
                          성명
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={activeInstructor?.name || ''}
                          className="w-full rounded border border-slate-200 bg-slate-100 p-2 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="mb-0.5 block text-[10px] font-bold text-slate-400">
                          휴대폰 연락처
                        </label>
                        <div className="flex space-x-1.5">
                          <input
                            type="text"
                            value={authPhone}
                            onChange={e => setAuthPhone(e.target.value)}
                            className="flex-1 rounded border border-slate-200 bg-white p-2 text-xs font-semibold"
                          />
                          <button
                            type="button"
                            onClick={handleSendSMS}
                            className="shrink-0 rounded bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
                          >
                            {isAuthSent ? '재전송' : '인증코드 요청'}
                          </button>
                        </div>
                      </div>

                      {isAuthSent && (
                        <div className="space-y-1.5 border-t border-slate-200 pt-2">
                          <label className="block text-[10px] font-bold text-slate-400">
                            인증코드 (테스트용 고정 번호: 8204)
                          </label>
                          <div className="flex space-x-1.5">
                            <input
                              type="text"
                              placeholder="숫자 4자리"
                              value={authCode}
                              onChange={e => setAuthCode(e.target.value)}
                              className="flex-1 rounded border border-slate-200 bg-white p-2 text-center text-xs font-bold tracking-widest"
                            />
                            <button
                              type="button"
                              onClick={handleVerifySMS}
                              className="shrink-0 rounded bg-emerald-600 px-3.5 py-2 text-xs font-black font-bold text-white hover:bg-emerald-700"
                            >
                              인증확인
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setSigningStep('read')}
                        className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        이전
                      </button>
                      <button
                        disabled={!isAuthVerified}
                        onClick={() => setSigningStep('sign')}
                        className={`flex items-center space-x-1 rounded-lg px-4 py-2 text-xs font-bold ${
                          isAuthVerified
                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                            : 'cursor-not-allowed bg-slate-200 text-slate-400'
                        }`}
                      >
                        <span>수기 서명 기입</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3단계: 서명 그리기 */}
                {signingStep === 'sign' && (
                  <div className="mx-auto max-w-md space-y-5">
                    <div className="text-center">
                      <FileSignature className="mx-auto mb-1 h-6 w-6 text-emerald-600" />
                      <h3 className="text-xs font-bold text-slate-900">
                        본인 서명 드로잉 기입 (8.2 / EC-11)
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <div className="border-slate-350 relative rounded-xl border bg-slate-50 p-2">
                        <canvas
                          ref={canvasRef}
                          width={400}
                          height={200}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                          className="h-[200px] w-full cursor-crosshair touch-none rounded border border-slate-200 bg-white"
                        />
                        <button
                          type="button"
                          onClick={clearCanvas}
                          className="text-slate-650 absolute right-3 bottom-3 rounded border border-slate-300 bg-slate-100 px-2 py-0.5 text-[9px] font-bold hover:bg-slate-200"
                        >
                          지우기
                        </button>
                      </div>
                      <span className="block text-center text-[10px] text-slate-400">
                        ※ 기입하신 수기 서명 궤적 타임라인과 좌표 정보가 감사파일 증적으로
                        귀속됩니다.
                      </span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setSigningStep('verify')}
                        className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        이전
                      </button>
                      <button
                        disabled={!hasSignature}
                        onClick={onCompleteSignature}
                        className={`flex items-center space-x-1 rounded-lg px-4 py-2 text-xs font-bold ${
                          hasSignature
                            ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                            : 'cursor-not-allowed bg-slate-200 text-slate-400'
                        }`}
                      >
                        <span>최종 계약 봉인 완료</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4단계: 체결 완료 */}
                {signingStep === 'complete' && (
                  <div className="mx-auto max-w-md space-y-5 py-4 text-center">
                    <div className="inline-block animate-bounce rounded-full bg-emerald-100 p-3 text-emerald-800">
                      <Check className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        계약 무결성 전자 서명 완료
                      </h3>
                      <p className="text-slate-505 mt-1.5 text-xs leading-relaxed">
                        축하합니다! 모의 전자 서명 및 검증이 모두 성립되었습니다.
                        <br />
                        학온 불변 로그 해시 사슬에 의해 원본 위변조가 방지 및 고유 검증
                        봉인되었습니다.
                      </p>
                    </div>

                    <div className="space-y-1.5 rounded-xl bg-slate-900 p-4 text-left font-mono text-[10px] text-slate-200">
                      <p className="flex justify-between border-b border-slate-800 pb-1 font-bold text-indigo-400">
                        <span>해시 체인 봉인 이력</span>
                        <span>STATUS: SECURE SEALED</span>
                      </p>
                      <p>계약문서 고유키: {c.id}</p>
                      <p>
                        서명 완료인 (CI): {activeInstructor?.name} ({activeInstructor?.id})
                      </p>
                      <p className="truncate">무결성 검증 해시: {c.hash}</p>
                    </div>

                    <div className="flex justify-center space-x-2 pt-2">
                      <button
                        onClick={() => {
                          setSigningStep('select');
                          setSelectedMyPageContractId(null);
                        }}
                        className="text-slate-705 rounded border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold hover:bg-slate-50"
                      >
                        보관함으로 복귀
                      </button>
                      <button
                        onClick={() => {
                          setCurrentRole('admin');
                          setSelectedContractId(c.id);
                          navigate('/admin/cabinet');
                        }}
                        className="flex items-center space-x-1 rounded bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-indigo-700"
                      >
                        <span>원장 증적검서 확인하기</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
      </div>
    </div>
  );
}
