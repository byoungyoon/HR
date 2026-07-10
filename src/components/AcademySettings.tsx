import React, { useState, useRef } from 'react';
import { Academy } from '../types';
import { generateStampSvg } from '../utils';
import {
  Building,
  MapPin,
  User,
  Phone,
  FileText,
  Stamp,
  Plus,
  Trash2,
  Check,
  UploadCloud,
  Edit3,
  AlertCircle,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

interface AcademySettingsProps {
  academies: Academy[];
  setAcademies: React.Dispatch<React.SetStateAction<Academy[]>>;
  selectedAcademyId: string;
  setSelectedAcademyId: (id: string) => void;
  showToast: (msg: string, type: 'success' | 'warning' | 'info') => void;
}

export default function AcademySettings({
  academies,
  setAcademies,
  selectedAcademyId,
  setSelectedAcademyId,
  showToast,
}: AcademySettingsProps) {
  // 에딧/등록 폼 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formOwnerName, setFormOwnerName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formBusinessNumber, setFormBusinessNumber] = useState('');
  const [formStampImage, setFormStampImage] = useState('');

  // 생성형 직인 설정
  const [stampText, setStampText] = useState('');
  const [isSquareStamp, setIsSquareStamp] = useState(false);

  // 드래그앤드롭 파일 업로드 ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // 새 학원 추가 모드 켜기
  const handleOpenAdd = () => {
    setIsEditing(true);
    setEditingId(null);
    setFormName('');
    setFormAddress('');
    setFormOwnerName('');
    setFormPhone('');
    setFormBusinessNumber('');
    setFormStampImage(generateStampSvg('학온', false));
    setStampText('대치학온');
    setIsSquareStamp(false);
  };

  // 기존 학원 수정 모드 켜기
  const handleOpenEdit = (academy: Academy) => {
    setIsEditing(true);
    setEditingId(academy.id);
    setFormName(academy.name);
    setFormAddress(academy.address);
    setFormOwnerName(academy.ownerName);
    setFormPhone(academy.phone);
    setFormBusinessNumber(academy.businessNumber);
    setFormStampImage(academy.stampImage);
    setStampText(academy.name.replace(/\s/g, '').substring(0, 4));
    setIsSquareStamp(academy.stampImage.includes('rect'));
  };

  // 폼 취소
  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  // 생성형 직인 생성 적용
  const handleGenerateStamp = () => {
    const textToUse = stampText.trim() || formName.replace(/\s/g, '').substring(0, 4) || '학온';
    const generated = generateStampSvg(textToUse, isSquareStamp);
    setFormStampImage(generated);
    showToast(`"${textToUse}" 문구 기반 인장이 자동 생성되었습니다.`, 'info');
  };

  // 파일(직인 이미지) 로딩 도우미
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('이미지 파일(*.png, *.jpg, *.jpeg, *.svg)만 등록할 수 있습니다.', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        setFormStampImage(e.target.result as string);
        showToast('커스텀 직인 파일이 성공적으로 등록되었습니다.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // 학원 정보 저장 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('학원명을 입력해 주세요.', 'warning');
      return;
    }

    if (editingId) {
      // 수정
      setAcademies(prev =>
        prev.map(a => {
          if (a.id === editingId) {
            return {
              ...a,
              name: formName.trim(),
              address: formAddress.trim(),
              ownerName: formOwnerName.trim(),
              phone: formPhone.trim(),
              businessNumber: formBusinessNumber.trim(),
              stampImage: formStampImage,
            };
          }
          return a;
        })
      );
      showToast('학원 정보가 성공적으로 수정되었습니다.', 'success');
    } else {
      // 추가
      const newId = `AC_${Date.now()}`;
      const newAcademy: Academy = {
        id: newId,
        name: formName.trim(),
        address: formAddress.trim(),
        ownerName: formOwnerName.trim(),
        phone: formPhone.trim(),
        businessNumber: formBusinessNumber.trim(),
        stampImage: formStampImage,
      };
      setAcademies(prev => [...prev, newAcademy]);
      showToast('신규 학원 정보가 정상 등록되었습니다.', 'success');

      // 학원이 하나뿐이었다면 대표 학원으로 설정
      if (academies.length === 0) {
        setSelectedAcademyId(newId);
      }
    }

    setIsEditing(false);
    setEditingId(null);
  };

  // 학원 삭제
  const handleDelete = (id: string) => {
    if (academies.length <= 1) {
      showToast('최소 한 개 이상의 학원 정보가 유지되어야 합니다.', 'warning');
      return;
    }
    if (id === selectedAcademyId) {
      showToast(
        '현재 계약서 작성용 대표 학원으로 지정된 항목은 삭제할 수 없습니다. 다른 학원을 먼저 선택하십시오.',
        'warning'
      );
      return;
    }
    if (window.confirm('정말 이 학원 정보를 삭제하시겠습니까? 관련 데이터가 소멸됩니다.')) {
      setAcademies(prev => prev.filter(a => a.id !== id));
      showToast('학원 정보가 정상 삭제되었습니다.', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* 타이틀 헤더 */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900">
            <Building className="h-6 w-6 text-indigo-600" />
            <span>학원 정보 설정 및 직인(인장) 관리</span>
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            전자계약서 작성 시 발송인 란에 자동 연계되어 기입될 학원들의 기본 정보와 법인 인장을
            중앙 관리합니다.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-blue-100 transition-all duration-200 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>신규 학원 추가</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 리스트 카드 (Bento Grid) - 왼쪽 2칸 */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-1.5">
            <div className="grid grid-cols-1 gap-4">
              {academies.map(academy => {
                const isSelected = academy.id === selectedAcademyId;
                return (
                  <div
                    key={academy.id}
                    className={`rounded-2xl border bg-white p-5 transition-all duration-300 ${
                      isSelected
                        ? 'border-indigo-600 shadow-[0_4px_16px_rgba(79,70,229,0.08)] ring-4 ring-indigo-50'
                        : 'border-slate-100 shadow-sm hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3.5">
                        {/* 상단 뱃지 및 이름 */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-black text-slate-900">{academy.name}</h3>
                          {isSelected && (
                            <span className="flex items-center gap-1 rounded-full bg-indigo-600 px-2 py-0.5 text-[9px] font-black tracking-wider text-white">
                              <Check className="h-3 w-3" /> 대표 학원
                            </span>
                          )}
                        </div>

                        {/* 상세 정보들 */}
                        <div className="grid grid-cols-1 gap-2 text-xs font-medium text-slate-600 sm:grid-cols-2">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            <span className="truncate">{academy.address || '주소 미입력'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            <span>대표자: {academy.ownerName || '미입력'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            <span>연락처: {academy.phone || '미입력'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            <span>사업자번호: {academy.businessNumber || '미입력'}</span>
                          </div>
                        </div>

                        {/* 하단 제어 단추 */}
                        <div className="flex items-center gap-2 border-t border-slate-50 pt-2">
                          {!isSelected && (
                            <button
                              onClick={() => {
                                setSelectedAcademyId(academy.id);
                                showToast(
                                  `"${academy.name}"이 계약서 발송 대표 학원으로 지정되었습니다.`,
                                  'success'
                                );
                              }}
                              className="rounded-lg border border-indigo-100 px-3 py-1.5 text-[11px] font-bold text-indigo-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50"
                            >
                              대표로 지정
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(academy)}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 transition-colors hover:bg-slate-50"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>정보 수정</span>
                          </button>
                          {!isSelected && (
                            <button
                              onClick={() => handleDelete(academy.id)}
                              className="ml-auto flex items-center gap-1 rounded-lg border border-red-100 px-3 py-1.5 text-[11px] font-bold text-red-600 transition-colors hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>삭제</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 우측 직인 이미지 */}
                      <div className="border-slate-150 flex w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border bg-slate-50 p-2.5">
                        <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                          법인인장
                        </span>
                        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-inner">
                          {academy.stampImage ? (
                            <img
                              src={academy.stampImage}
                              alt="Stamp seal"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Stamp className="h-8 w-8 text-slate-300" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 편집/등록 폼 - 오른쪽 1칸 */}
        <div>
          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              className="animate-in fade-in slide-in-from-bottom-2 space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-md duration-300"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
                  <Building className="h-4 w-4 text-blue-600" />
                  <span>{editingId ? '학원 정보 수정' : '신규 학원 등록'}</span>
                </h3>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  취소
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* 학원명 */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    학원명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="예: 대치 학온 본원"
                    className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    required
                  />
                </div>

                {/* 대표자명 */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">대표자명</label>
                  <input
                    type="text"
                    value={formOwnerName}
                    onChange={e => setFormOwnerName(e.target.value)}
                    placeholder="예: 김학온"
                    className="w-full rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  />
                </div>

                {/* 학원 주소 */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">학원 주소</label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={e => setFormAddress(e.target.value)}
                    placeholder="예: 서울시 강남구 대치동 3층"
                    className="w-full rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  />
                </div>

                {/* 연락처 */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">대표 연락처</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="예: 02-555-1234"
                    className="w-full rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  />
                </div>

                {/* 사업자 등록 번호 */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">사업자 등록 번호</label>
                  <input
                    type="text"
                    value={formBusinessNumber}
                    onChange={e => setFormBusinessNumber(e.target.value)}
                    placeholder="예: 120-12-34567"
                    className="w-full rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  />
                </div>

                {/* 인장(직인) 등록 */}
                <div className="space-y-3.5 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <label className="block flex items-center gap-1 font-extrabold text-slate-800">
                      <Stamp className="h-3.5 w-3.5 text-indigo-600" />
                      <span>학원 인장(직인) 등록</span>
                    </label>
                  </div>

                  {/* 인장 미리보기 및 탭 분할 */}
                  <div className="border-slate-150 grid grid-cols-1 items-center gap-3 rounded-2xl border bg-slate-50 p-3 sm:grid-cols-3">
                    <div className="flex flex-col items-center sm:col-span-1">
                      <span className="mb-1 block text-[8px] font-bold text-slate-400">
                        인장 프리뷰
                      </span>
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                        {formStampImage ? (
                          <img
                            src={formStampImage}
                            alt="Preview"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Stamp className="h-8 w-8 text-slate-300" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 text-right sm:col-span-2">
                      <span className="block text-[10px] leading-tight font-semibold text-slate-400">
                        학원 로고 이미지(PNG) 또는 생성형 벡터 인장을 직접 만들어 적용합니다.
                      </span>
                    </div>
                  </div>

                  {/* 방식 1: 생성형 인장 제너레이터 */}
                  <div className="space-y-2 rounded-2xl border border-indigo-100/60 bg-indigo-50/50 p-3">
                    <span className="block text-[10px] font-black text-indigo-800">
                      ⚡ 생성형 벡터 인장 즉시 제작
                    </span>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={stampText}
                        onChange={e => setStampText(e.target.value.substring(0, 6))}
                        placeholder="새길 문구 (최대 4자)"
                        className="flex-1 rounded-lg border border-indigo-100 bg-white p-2 text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateStamp}
                        className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-extrabold text-white transition-colors hover:bg-indigo-700"
                      >
                        <RefreshCw className="h-3 w-3" /> 제작
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600">
                      <label className="flex cursor-pointer items-center gap-1">
                        <input
                          type="radio"
                          name="stamp_shape"
                          checked={!isSquareStamp}
                          onChange={() => setIsSquareStamp(false)}
                          className="text-indigo-600"
                        />
                        <span>전통 원형인</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-1">
                        <input
                          type="radio"
                          name="stamp_shape"
                          checked={isSquareStamp}
                          onChange={() => setIsSquareStamp(true)}
                          className="text-indigo-600"
                        />
                        <span>법인 사각인</span>
                      </label>
                    </div>
                  </div>

                  {/* 방식 2: 드래그 앤 드롭 업로드 */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-2xl border-2 border-dashed p-3 text-center transition-all ${
                      isDragOver
                        ? 'border-indigo-600 bg-indigo-50/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <UploadCloud className="mx-auto mb-1 h-5 w-5 text-slate-400" />
                    <span className="block text-[10px] font-bold text-slate-500">
                      여기에 수기 직인 도장 파일 드래그 또는 클릭 업로드
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-1/2 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white shadow-md shadow-blue-100 transition-colors hover:bg-blue-700"
                >
                  저장 완료
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 p-5 text-white shadow-xl">
              <div className="flex items-start gap-2.5 rounded-2xl border border-indigo-700 bg-indigo-800/50 p-2.5 text-xs leading-relaxed">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300" />
                <div className="space-y-1">
                  <p className="font-extrabold text-indigo-200">학원 정보 SSOT 연동 보증</p>
                  <p className="text-[11px] text-slate-300">
                    여기서 등록하고 '대표'로 지정한 학원은 계약서 생성 마법사 1단계 및 최종 조항
                    검토에 실시간 자동 기입됩니다.
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 border-t border-indigo-800/60 pt-4 text-xs font-medium">
                <h4 className="font-bold text-slate-200">💡 직인/인장 등록 스마트 활용법</h4>
                <ul className="list-disc space-y-2 pl-4 text-[11px] leading-relaxed text-slate-300">
                  <li>
                    <strong className="text-white">생성형 원클릭 인장:</strong> 도장 파일이 없더라도
                    상단 대표자 이름이나 학원명 등을 입력해 법인 인장을 1초 만에 깔끔한 SVG 벡터
                    이미지로 완성할 수 있습니다.
                  </li>
                  <li>
                    <strong className="text-white">실제 도장 등록:</strong> 실제 수기 직인도장을 흰
                    종이에 찍어 스마트폰 카메라로 촬영한 뒤, 드래그앤드롭하여 즉시 등록 사용할 수
                    있습니다.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
