import { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { useWizaredStore } from '../state';

const START_TIMES = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];
const END_TIMES = [
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
  '24:00',
];
const BREAK_OPTIONS = ['없음', '30분', '1시간', '1.5시간', '2시간'];
const ALL_DAYS = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
const PRESET_DAYS: Record<string, string[]> = {
  '5days': ['월요일', '화요일', '수요일', '목요일', '금요일'],
  '3days': ['월요일', '수요일', '금요일'],
  custom: [],
};

const presetLabel = {
  '5days': '주 5일',
  '3days': '주 3일',
  custom: '직접 지정',
};

export default function Step2Sub2PreviewArea() {
  const {
    batchStartTime,
    batchEndTime,
    batchBreakTime,
    setWizWorkDaysType,
    setWizDaysConfig,
    setBatchStartTime,
    setBatchEndTime,
    setBatchBreakTime,
    setEditingDay,
    setWizScheduleApplied,
  } = useWizaredStore();

  const { applyQuickSchedule } = useStore();
  const [localPreset, setLocalPreset] = useState<'5days' | '3days' | 'custom'>('5days');

  const handleApply = () => {
    const target = PRESET_DAYS[localPreset];
    setWizDaysConfig(prev => {
      const next = { ...prev };
      ALL_DAYS.forEach(day => {
        const isTarget = localPreset === 'custom' ? false : target.includes(day);
        next[day] = {
          ...next[day],
          enabled: localPreset === 'custom' ? false : isTarget,
          ...(isTarget
            ? { startTime: batchStartTime, endTime: batchEndTime, breakTime: batchBreakTime }
            : {}),
        };
      });
      return next;
    });

    if (localPreset !== 'custom') {
      applyQuickSchedule(localPreset);
    }
    setWizWorkDaysType(localPreset);
    setWizScheduleApplied(true);
    setEditingDay(null);
  };

  return (
    <div className="space-y-4">
      {/* 프리셋 칩 */}
      <div>
        <p className="mb-2 text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
          근무 유형 선택
        </p>
        <div className="flex gap-2">
          {(['5days', '3days', 'custom'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setLocalPreset(p)}
              className={`rounded-xl border-2 px-4 py-2 text-xs font-bold transition-all ${
                localPreset === p
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {presetLabel[p]}
            </button>
          ))}
        </div>
        {localPreset !== 'custom' && (
          <p className="mt-1.5 text-[10px] font-semibold text-slate-400">
            {localPreset === '5days'
              ? '월~금 5일 근무로 설정됩니다'
              : '월·수·금 3일 근무로 설정됩니다'}
          </p>
        )}
        {localPreset === 'custom' && (
          <p className="mt-1.5 text-[10px] font-semibold text-slate-400">
            적용 후 요일 카드에서 ON/OFF로 개별 설정할 수 있습니다
          </p>
        )}
      </div>

      {/* 기본 시간 입력 (한 줄) */}
      <div>
        <p className="mb-2 text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
          기본 근무 시간
        </p>
        <div className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-[9px] font-black text-slate-400">근무 시작</span>
            <select
              value={batchStartTime}
              onChange={e => setBatchStartTime(e.target.value)}
              className="cursor-pointer border-0 bg-transparent text-xs font-black text-slate-800 focus:outline-none"
            >
              {START_TIMES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center text-slate-300">~</div>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-[9px] font-black text-slate-400">근무 종료</span>
            <select
              value={batchEndTime}
              onChange={e => setBatchEndTime(e.target.value)}
              className="cursor-pointer border-0 bg-transparent text-xs font-black text-slate-800 focus:outline-none"
            >
              {END_TIMES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="mx-1 w-px bg-slate-200" />
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-[9px] font-black text-slate-400">휴게</span>
            <select
              value={batchBreakTime}
              onChange={e => setBatchBreakTime(e.target.value)}
              className="cursor-pointer border-0 bg-transparent text-xs font-black text-slate-800 focus:outline-none"
            >
              {BREAK_OPTIONS.map(o => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 적용하기 */}
      <button
        type="button"
        onClick={handleApply}
        className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-indigo-600 py-3 text-xs font-black text-white shadow-sm transition-all hover:bg-indigo-700"
      >
        적용하기 →
      </button>
    </div>
  );
}
