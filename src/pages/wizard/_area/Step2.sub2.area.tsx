import { ArrowRight, ChevronDown, ChevronUp, Clock, X } from 'lucide-react';
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

export default function Step2Sub2Area() {
  const {
    wizWorkDaysType,
    wizDaysConfig,
    batchStartTime,
    batchEndTime,
    batchBreakTime,
    editingDay,
    wizSubStep,
    maxUnlockedSubStep,
    wizScheduleApplied,
    setWizSubStep,
    setMaxUnlockedSubStep,
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

  /* wizScheduleApplied가 true일 때 카드 뷰 */
  const isConfigured = wizScheduleApplied;

  const calculateDailyHours = (start: string, end: string, breakStr: string): number => {
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    const totalMinutes = eH * 60 + eM - (sH * 60 + sM);
    let breakMinutes = 0;
    if (breakStr === '30분') breakMinutes = 30;
    else if (breakStr === '1시간') breakMinutes = 60;
    else if (breakStr === '1.5시간') breakMinutes = 90;
    else if (breakStr === '2시간') breakMinutes = 120;
    return Math.max(0, (totalMinutes - breakMinutes) / 60);
  };

  const weeklyHours = parseFloat(
    Object.values(wizDaysConfig)
      .reduce(
        (sum, conf) =>
          sum +
          (conf.enabled ? calculateDailyHours(conf.startTime, conf.endTime, conf.breakTime) : 0),
        0
      )
      .toFixed(1)
  );
  const hasWeeklyRestAllowance = weeklyHours >= 15;

  /* 적용하기 */
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

  /* 카드 토글 */
  const toggleDay = (day: string) => {
    const conf = wizDaysConfig[day];
    if (conf.enabled) {
      /* ON → OFF */
      setWizDaysConfig(prev => ({
        ...prev,
        [day]: { ...prev[day], enabled: false },
      }));
      setEditingDay(null);
    } else {
      /* OFF → ON + 편집 패널 오픈 */
      setWizDaysConfig(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          enabled: true,
          startTime: batchStartTime,
          endTime: batchEndTime,
          breakTime: batchBreakTime,
        },
      }));
      setEditingDay(day);
    }
    setWizWorkDaysType('custom');
  };

  const presetLabel: Record<string, string> = {
    '5days': '주 5일',
    '3days': '주 3일',
    custom: '직접 지정',
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all">
      {/* 아코디언 헤더 */}
      <button
        type="button"
        onClick={() => setWizSubStep(2)}
        className={`flex w-full items-center justify-between p-5 text-left transition-all ${
          wizSubStep === 2 ? 'border-b border-slate-100 bg-slate-50/80' : 'hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
              wizSubStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            2
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">
              근무 요일 및 소정근로시간 설정
            </h3>
            {wizSubStep !== 2 && isConfigured && (
              <p className="mt-1 text-[11px] font-semibold text-slate-500">
                {presetLabel[wizWorkDaysType] ?? '직접 지정'} ·{' '}
                <span className="font-bold text-slate-800">주 {weeklyHours}시간</span>
                {hasWeeklyRestAllowance ? (
                  <span className="ml-1.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">
                    주휴 ✔
                  </span>
                ) : null}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {wizSubStep === 2 ? (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
              작성 중
            </span>
          ) : isConfigured ? (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              완료
            </span>
          ) : null}
          {wizSubStep === 2 ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* 아코디언 바디 */}
      {wizSubStep === 2 && (
        <div className="space-y-5 p-5">
          {/* ── Phase 1: Setup ── */}
          {!isConfigured && (
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
          )}

          {/* ── Phase 2: 카드 뷰 ── */}
          {isConfigured && (
            <div className="space-y-4">
              {/* 요일 카드 그리드 */}
              <div className="grid grid-cols-7 gap-2">
                {ALL_DAYS.map(day => {
                  const conf = wizDaysConfig[day];
                  const hours = conf.enabled
                    ? calculateDailyHours(conf.startTime, conf.endTime, conf.breakTime)
                    : 0;
                  const isEditing = editingDay === day;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        if (conf.enabled) {
                          /* ON인 경우: 편집 패널 토글 */
                          setEditingDay(isEditing ? null : day);
                        } else {
                          toggleDay(day);
                        }
                      }}
                      className={`flex flex-col items-center justify-between rounded-2xl border-2 p-2.5 text-center transition-all ${
                        isEditing
                          ? 'border-indigo-600 bg-indigo-50/30 shadow-sm'
                          : conf.enabled
                            ? 'border-slate-200 bg-white hover:border-indigo-300'
                            : 'border-dashed border-slate-200 bg-slate-50/50 opacity-60 hover:border-slate-300 hover:opacity-100'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-black ${conf.enabled ? 'text-slate-800' : 'text-slate-400'}`}
                      >
                        {day.slice(0, 1)}
                      </span>
                      <span
                        className={`mt-1 rounded-full px-1 py-0.5 text-[8px] font-bold ${
                          conf.enabled
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {conf.enabled ? 'ON' : 'OFF'}
                      </span>
                      {conf.enabled ? (
                        <div className="mt-1.5 space-y-0.5 text-[9px] text-slate-600">
                          <div className="font-bold">{conf.startTime}</div>
                          <div className="text-slate-300">~</div>
                          <div className="font-bold">{conf.endTime}</div>
                          <div className="mt-0.5 rounded bg-slate-100 px-1 text-[8px] font-extrabold text-slate-500">
                            {hours}H
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 text-[10px] text-slate-300">+</div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 개별 편집 패널 */}
              {editingDay &&
                (() => {
                  const conf = wizDaysConfig[editingDay];
                  const hours = conf.enabled
                    ? calculateDailyHours(conf.startTime, conf.endTime, conf.breakTime)
                    : 0;
                  return (
                    <div className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/20 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-indigo-700">
                          🔧 {editingDay} 시간 설정
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleDay(editingDay)}
                            className="rounded-lg border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-500 hover:bg-red-100"
                          >
                            OFF로 변경
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingDay(null)}
                            className="rounded-lg border border-slate-200 bg-white p-1 text-slate-400 hover:bg-slate-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* 시작 */}
                        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
                          <span className="text-[10px] font-extrabold text-slate-500">시작</span>
                          <select
                            value={conf.startTime}
                            onChange={e =>
                              setWizDaysConfig(prev => ({
                                ...prev,
                                [editingDay]: { ...prev[editingDay], startTime: e.target.value },
                              }))
                            }
                            className="cursor-pointer border-0 bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                          >
                            {START_TIMES.map(t => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* 종료 */}
                        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
                          <span className="text-[10px] font-extrabold text-slate-500">종료</span>
                          <select
                            value={conf.endTime}
                            onChange={e =>
                              setWizDaysConfig(prev => ({
                                ...prev,
                                [editingDay]: { ...prev[editingDay], endTime: e.target.value },
                              }))
                            }
                            className="cursor-pointer border-0 bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                          >
                            {END_TIMES.map(t => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* 휴게 */}
                        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
                          <span className="text-[10px] font-extrabold text-slate-500">휴게</span>
                          <select
                            value={conf.breakTime}
                            onChange={e =>
                              setWizDaysConfig(prev => ({
                                ...prev,
                                [editingDay]: { ...prev[editingDay], breakTime: e.target.value },
                              }))
                            }
                            className="cursor-pointer border-0 bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                          >
                            {BREAK_OPTIONS.map(o => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* 소정 시간 뱃지 */}
                        <div className="flex items-center rounded-xl bg-indigo-600 px-3 py-1.5 text-[10px] font-extrabold text-white">
                          소정 {hours}H
                        </div>
                      </div>
                    </div>
                  );
                })()}
            </div>
          )}

          {/* 이전 / 다음 버튼 */}
          {isConfigured && (
            <div className="flex justify-end border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  setMaxUnlockedSubStep(Math.max(maxUnlockedSubStep, 3) as any);
                  setWizSubStep(3);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800"
              >
                <span>2단계 완료 및 3단계로</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
