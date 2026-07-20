'use client';

import { useState, useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { useWizaredStore } from '../../state';
import { useStore } from '@/src/store/useStore';

export default function FormAction() {
  const { persons } = useStore();
  const {
    wizInstructorId,
    wizInstructorName,
    wizInstructorSubject,
    wizInstructorAddress,
    wizInstructorPhone,
    wizInstructorBirthDate,
    setWizInstructorId,
    setWizInstructorName,
    setWizInstructorSubject,
    setWizInstructorAddress,
    setWizInstructorPhone,
    setWizInstructorBirthDate,
  } = useWizaredStore(
    useShallow(state => ({
      wizInstructorId: state.wizInstructorId,
      wizInstructorName: state.wizInstructorName,
      wizInstructorSubject: state.wizInstructorSubject,
      wizInstructorAddress: state.wizInstructorAddress,
      wizInstructorPhone: state.wizInstructorPhone,
      wizInstructorBirthDate: state.wizInstructorBirthDate,
      setWizInstructorId: state.setWizInstructorId,
      setWizInstructorName: state.setWizInstructorName,
      setWizInstructorSubject: state.setWizInstructorSubject,
      setWizInstructorAddress: state.setWizInstructorAddress,
      setWizInstructorPhone: state.setWizInstructorPhone,
      setWizInstructorBirthDate: state.setWizInstructorBirthDate,
    }))
  );

  const [mode, setMode] = useState<'existing' | 'new'>('existing');

  // Sync mode based on initial wizInstructorId
  useEffect(() => {
    const isExisting = persons.some(p => p.id === wizInstructorId);
    if (isExisting) {
      setMode('existing');
    } else {
      setMode('new');
    }
  }, [wizInstructorId, persons]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 탭 선택 영역 */}
      <div className="col-span-2 mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setMode('existing');
            // Select the first person if none or if it's currently a new/cleared one
            const isCurrentlyExisting = persons.some(p => p.id === wizInstructorId);
            if (!isCurrentlyExisting && persons.length > 0) {
              const p = persons[0];
              setWizInstructorId(p.id);
              setWizInstructorName(p.name);
              setWizInstructorPhone(p.phone);
              setWizInstructorSubject(p.subject || '');
              setWizInstructorBirthDate(p.birthDate || '');
              setWizInstructorAddress(p.address || '');
            }
          }}
          className={`flex-1 rounded-xl py-2.5 text-xs font-black transition-all ${
            mode === 'existing'
              ? 'bg-custom-indigo text-white shadow-sm'
              : 'border border-slate-200 bg-white text-slate-650 hover:bg-slate-50'
          }`}
        >
          기존 등록 강사 선택
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('new');
            setWizInstructorId('CI_' + Math.floor(Math.random() * 10000000));
            setWizInstructorName('');
            setWizInstructorPhone('');
            setWizInstructorSubject('');
            setWizInstructorBirthDate('');
            setWizInstructorAddress('');
          }}
          className={`flex-1 rounded-xl py-2.5 text-xs font-black transition-all ${
            mode === 'new'
              ? 'bg-custom-indigo text-white shadow-sm'
              : 'border border-slate-200 bg-white text-slate-650 hover:bg-slate-50'
          }`}
        >
          신규 강사 정보 입력
        </button>
      </div>

      {mode === 'existing' ? (
        <>
          {/* 기존 강사 선택 드롭다운 */}
          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              등록된 강사 선택 <span className="text-red-500">*</span>
            </label>
            <select
              value={wizInstructorId}
              onChange={e => {
                const selectedId = e.target.value;
                const found = persons.find(p => p.id === selectedId);
                if (found) {
                  setWizInstructorId(found.id);
                  setWizInstructorName(found.name);
                  setWizInstructorPhone(found.phone);
                  setWizInstructorSubject(found.subject || '');
                  setWizInstructorBirthDate(found.birthDate || '');
                  setWizInstructorAddress(found.address || '');
                } else {
                  setWizInstructorId('');
                  setWizInstructorName('');
                  setWizInstructorPhone('');
                  setWizInstructorSubject('');
                  setWizInstructorBirthDate('');
                  setWizInstructorAddress('');
                }
              }}
              className="bg-background w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium outline-none transition-all focus:border-custom-indigo"
            >
              <option value="">-- 강사를 선택하세요 --</option>
              {persons.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.subject || '과목 미지정'} / {p.phone})
                </option>
              ))}
            </select>
          </div>

          {/* 선택된 강사의 정보 요약 카드 */}
          {wizInstructorId && persons.some(p => p.id === wizInstructorId) && (
            <div className="col-span-2 grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div>
                <span className="mb-1 block text-[10px] font-bold text-slate-400">강사 이름</span>
                <span className="text-xs font-extrabold text-slate-700">{wizInstructorName}</span>
              </div>
              <div>
                <span className="mb-1 block text-[10px] font-bold text-slate-400">연락처</span>
                <span className="text-xs font-extrabold text-slate-700">{wizInstructorPhone || '-'}</span>
              </div>
              <div>
                <span className="mb-1 block text-[10px] font-bold text-slate-400">담당 과목</span>
                <span className="text-xs font-extrabold text-slate-700">{wizInstructorSubject || '-'}</span>
              </div>
              <div>
                <span className="mb-1 block text-[10px] font-bold text-slate-400">생년월일</span>
                <span className="text-xs font-extrabold text-slate-700">{wizInstructorBirthDate || '-'}</span>
              </div>
              <div className="col-span-2">
                <span className="mb-1 block text-[10px] font-bold text-slate-400">주소</span>
                <span className="text-xs font-extrabold text-slate-700">{wizInstructorAddress || '-'}</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* 신규 강사 정보 입력 필드 */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              강사 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={wizInstructorName}
              onChange={e => setWizInstructorName(e.target.value)}
              className="bg-background"
              placeholder="예: 홍길동"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={wizInstructorPhone}
              onChange={e => setWizInstructorPhone(e.target.value)}
              className="bg-background"
              placeholder="예: 010-1234-5678"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              담당 과목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={wizInstructorSubject}
              onChange={e => setWizInstructorSubject(e.target.value)}
              className="bg-background"
              placeholder="예: 공통수학, 수학I"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              생년월일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={wizInstructorBirthDate}
              onChange={e => setWizInstructorBirthDate(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              주소 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={wizInstructorAddress}
              onChange={e => setWizInstructorAddress(e.target.value)}
              className="bg-background"
              placeholder="예: 서울시 강남구 대치동 123-45"
            />
          </div>
        </>
      )}
    </div>
  );
}
