import { useShallow } from 'zustand/shallow';
import { useWizaredStore } from '../../state';

export default function FormAction() {
  const {
    wizInstructorName,
    wizInstructorSubject,
    wizInstructorAddress,
    wizInstructorPhone,
    wizInstructorBirthDate,
    setWizInstructorName,
    setWizInstructorSubject,
    setWizInstructorAddress,
    setWizInstructorPhone,
    setWizInstructorBirthDate,
  } = useWizaredStore(
    useShallow(state => ({
      wizInstructorName: state.wizInstructorName,
      wizInstructorSubject: state.wizInstructorSubject,
      wizInstructorAddress: state.wizInstructorAddress,
      wizInstructorPhone: state.wizInstructorPhone,
      wizInstructorBirthDate: state.wizInstructorBirthDate,
      setWizInstructorName: state.setWizInstructorName,
      setWizInstructorSubject: state.setWizInstructorSubject,
      setWizInstructorAddress: state.setWizInstructorAddress,
      setWizInstructorPhone: state.setWizInstructorPhone,
      setWizInstructorBirthDate: state.setWizInstructorBirthDate,
    }))
  );

  return (
    <div className="grid grid-cols-2 gap-4">
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

      <div className="md:col-span-2">
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
    </div>
  );
}
