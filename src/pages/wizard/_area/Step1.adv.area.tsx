import { useWizaredStore } from '../state';
import cx from 'classnames';

export default function Step1AdvArea() {
  const {
    wizInstructorName,
    wizInstructorPhone,
    wizInstructorSubject,
    wizInstructorBirthDate,
    wizInstructorAddress,
    wizContractType,
  } = useWizaredStore();

  const isNameFilled = !!wizInstructorName.trim();
  const isPhoneFilled = !!wizInstructorPhone.trim();
  const isSubjectFilled = !!wizInstructorSubject.trim();
  const isBirthFilled = !!wizInstructorBirthDate.trim();
  const isAddressFilled = !!wizInstructorAddress.trim();

  const showPhoneWarning =
    isPhoneFilled &&
    !/^\d{2,3}-\d{3,4}-\d{4}$/.test(wizInstructorPhone) &&
    !/^\d{9,11}$/.test(wizInstructorPhone);

  return (
    <div className="space-y-4">
      <div
        key={`${wizInstructorName}-${wizInstructorPhone}-${wizInstructorSubject}-${wizInstructorBirthDate}-${wizInstructorAddress}`}
        className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]"
      >
        <div className="border-b border-slate-100 pb-3">
          <h4 className="text-13 font-bold text-slate-800">실시간 연동 프로필</h4>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-center gap-2.5">
            <span className="w-12 text-xs font-semibold text-slate-400">성명</span>
            <span
              className={cx('text-xs font-extrabold transition-all', {
                'text-sm text-slate-800': isNameFilled,
                'text-slate-350 italic': !isNameFilled,
              })}
            >
              {isNameFilled ? wizInstructorName : '이름을 입력해주세요'}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <span className="w-12 text-xs font-semibold text-slate-400">연락처</span>
              <span
                className={cx('text-xs font-bold transition-all', {
                  'text-slate-700': isPhoneFilled,
                  'text-slate-350 italic': !isPhoneFilled,
                })}
              >
                {isPhoneFilled ? wizInstructorPhone : '연락처를 입력해주세요'}
              </span>
            </div>
            {showPhoneWarning && (
              <p className="animate-in fade-in slide-in-from-top-1 pl-14 text-[10px] font-semibold text-amber-600">
                형식이 올바르지 않습니다 (예: 010-1234-5678)
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-12 text-xs font-semibold text-slate-400">과목</span>
            <span
              className={cx('text-xs font-bold transition-all', {
                'text-slate-700': isSubjectFilled,
                'text-slate-350 italic': !isSubjectFilled,
              })}
            >
              {isSubjectFilled ? wizInstructorSubject : '과목을 입력해주세요'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-12 text-xs font-semibold text-slate-400">생년월일</span>
            <span
              className={cx('text-xs font-bold transition-all', {
                'text-slate-700': isBirthFilled,
                'text-slate-350 italic': !isBirthFilled,
              })}
            >
              {isBirthFilled ? wizInstructorBirthDate : '생년월일을 선택해주세요'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-12 text-xs font-semibold text-slate-400">주소</span>
            <span
              className={cx('max-w-[320px] truncate text-xs font-bold transition-all', {
                'text-slate-700': isAddressFilled,
                'text-slate-350 italic': !isAddressFilled,
              })}
            >
              {isAddressFilled ? wizInstructorAddress : '주소를 입력해주세요'}
            </span>
          </div>
        </div>
      </div>

      <div
        key={wizContractType}
        className="space-y-2.5 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]"
      >
        <h4 className="text-13 font-bold text-slate-800">선택된 계약서 법적 지침</h4>

        <p className="text-xs leading-relaxed font-semibold text-slate-600">
          현재 선택된 계약 유형은{' '}
          <strong className="font-black text-indigo-950">
            {wizContractType || '강사근로계약서'}
          </strong>
          입니다.
        </p>
        <div className="space-y-2 rounded-2xl border border-indigo-50/50 bg-indigo-50/30 p-3.5 text-xs text-indigo-950">
          <p className="font-extrabold">💡 주요 노무 체크포인트:</p>
          <ul className="list-disc space-y-1 pl-4 leading-relaxed font-semibold text-indigo-900/80">
            <li>
              근로관계 성립 시 근로기준법상 <strong>주휴수당 및 연차휴가</strong> 지급 의무 검토가
              필요합니다.
            </li>
            <li>
              향후 2단계에서 입력할 <strong>소정근로시간</strong> 및 <strong>급여 설정</strong>에
              따라 자동으로 위험 항목을 탐지하여 실시간 자문이 표시됩니다.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
