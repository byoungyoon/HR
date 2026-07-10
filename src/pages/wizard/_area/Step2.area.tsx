import {
  AlertTriangle,
  ArrowRight,
  CalendarRange,
  Check,
  CheckCircle2,
  Info,
  Sparkles,
} from 'lucide-react';
import Accordion from '../_component/Accordion';
import { useWizaredStore } from '../state';
import Step2Sub1Area from './Step2.sub1.area';
import Step2Adv1Area from './Step2.adv1.area';

export default function Step2Area() {
  const {
    wizInstructorId,
    wizContractType,
    wizStartDate,
    wizPeriodYear,
    wizEndDate,
    wizProbation,
    wizWorkDaysType,
    wizDaysConfig,
    selectedBatchDays,
    batchStartTime,
    batchEndTime,
    batchBreakTime,
    editingDay,
    showChangePulse,
    wizSalaryType,
    wizSalaryAmount,
    wizNonTaxFood,
    wizHasCarAllowance,
    wizNonTaxCar,
    wizPayDay,
    wizOvertimeAllowance,
    wizPositionAllowance,
    wizOtherAllowance,
    wizHasNonCompete,
    wizNonCompetePeriod,
    wizNonCompeteRange,
    wizNonCompeteAmount,
    wizSpecialClause,
    wizContractText,
    wizardStep,
    wizSubStep,
    maxUnlockedSubStep,

    setWizardStep,
    setWizSubStep,
    setMaxUnlockedSubStep,
    setWizInstructorId,
    setWizContractType,
    setWizStartDate,
    setWizPeriodYear,
    setWizEndDate,
    setWizProbation,
    setWizWorkDaysType,
    setWizDaysConfig,
    setSelectedBatchDays,
    setBatchStartTime,
    setBatchEndTime,
    setBatchBreakTime,
    setEditingDay,
    setShowChangePulse,
    setWizSalaryType,
    setWizSalaryAmount,
    setWizNonTaxFood,
    setWizHasCarAllowance,
    setWizNonTaxCar,
    setWizPayDay,
    setWizOvertimeAllowance,
    setWizPositionAllowance,
    setWizOtherAllowance,
    setWizHasNonCompete,
    setWizNonCompetePeriod,
    setWizNonCompeteRange,
    setWizNonCompeteAmount,
    setWizSpecialClause,
    setWizContractText,
  } = useWizaredStore();

  return (
    <div className="grid max-w-full grid-cols-1 items-start gap-6 lg:grid-cols-12">
      {/* 왼쪽 컬럼: 작성 단계 (아코디언 리스트) */}
      <div className="space-y-4 lg:col-span-8">
        {/* [1단계] 계약 기간 및 수습 설정 */}
        <Step2Sub1Area />

        {maxUnlockedSubStep >= 2 && (
          <></>
          //   <div className="animate-in fade-in slide-in-from-top-2 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300">
          //     {/* 아코디언 헤더 */}
          //     <button
          //       type="button"
          //       onClick={() => setWizSubStep(2)}
          //       className={`flex w-full items-center justify-between p-5 text-left transition-all ${
          //         wizSubStep === 2
          //           ? 'border-b border-slate-100 bg-slate-50/80'
          //           : 'hover:bg-slate-50/50'
          //       }`}
          //     >
          //       <div className="flex items-center gap-3">
          //         <span
          //           className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
          //             wizSubStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
          //           }`}
          //         >
          //           2
          //         </span>
          //         <div>
          //           <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
          //             ⚡ 근무 요일 및 소정근로시간 설정
          //           </h3>
          //           {wizSubStep !== 2 && (
          //             <p className="mt-1 text-[11px] font-semibold text-slate-500">
          //               일정 유형:{' '}
          //               <span className="font-bold text-slate-800">
          //                 {wizWorkDaysType === '5days'
          //                   ? '주 5일'
          //                   : wizWorkDaysType === '3days'
          //                     ? '주 3일'
          //                     : '직접 지정'}
          //               </span>{' '}
          //               · 주당 소정근로:{' '}
          //               <span className="font-bold text-slate-800">{weeklyHours}시간</span>
          //             </p>
          //           )}
          //         </div>
          //       </div>
          //       <div className="flex items-center gap-2">
          //         {wizSubStep === 2 ? (
          //           <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
          //             작성 중
          //           </span>
          //         ) : (
          //           <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          //             완료
          //           </span>
          //         )}
          //         {wizSubStep === 2 ? (
          //           <ChevronUp className="h-4 w-4 text-slate-400" />
          //         ) : (
          //           <ChevronDown className="h-4 w-4 text-slate-400" />
          //         )}
          //       </div>
          //     </button>

          //     {/* 아코디언 바디 */}
          //     {wizSubStep === 2 && (
          //       <div className="animate-in fade-in space-y-6 border-t border-slate-100 bg-slate-50/10 p-6 duration-200">
          //         {/* 간편 패턴 프리셋 */}
          //         <div className="space-y-3">
          //           <div className="flex items-center gap-1.5">
          //             <Sparkles className="h-4 w-4 text-indigo-500" />
          //             <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
          //               간편 패턴 프리셋 (Fast Preset)
          //             </span>
          //           </div>
          //           <div className="grid grid-cols-3 gap-3">
          //             {/* 주 5일 */}
          //             <button
          //               type="button"
          //               onClick={() => {
          //                 applyQuickSchedule('5days');
          //                 setSelectedBatchDays(['월요일', '화요일', '수요일', '목요일', '금요일']);
          //                 setEditingDay(null);
          //               }}
          //               className={`relative rounded-2xl border-2 p-3.5 text-left transition-all ${
          //                 wizWorkDaysType === '5days'
          //                   ? 'border-indigo-600 bg-indigo-50/30 shadow-sm ring-1 ring-indigo-500/10'
          //                   : 'border-slate-200 bg-white hover:border-slate-300'
          //               }`}
          //             >
          //               {wizWorkDaysType === '5days' && (
          //                 <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-indigo-600" />
          //               )}
          //               <h4 className="text-xs font-black text-slate-800">주 5일 (평일)</h4>
          //               <p className="mt-1 text-[10px] leading-tight font-medium text-slate-500">
          //                 월~금 (14:00 ~ 22:00)
          //               </p>
          //               <span className="mt-2 inline-block rounded border border-indigo-100 bg-indigo-50 px-1.5 py-0.5 text-[9px] font-extrabold text-indigo-600">
          //                 휴게 1h · 소정 35H
          //               </span>
          //             </button>

          //             {/* 주 3일 */}
          //             <button
          //               type="button"
          //               onClick={() => {
          //                 applyQuickSchedule('3days');
          //                 setSelectedBatchDays(['월요일', '수요일', '금요일']);
          //                 setEditingDay(null);
          //               }}
          //               className={`relative rounded-2xl border-2 p-3.5 text-left transition-all ${
          //                 wizWorkDaysType === '3days'
          //                   ? 'border-indigo-600 bg-indigo-50/30 shadow-sm ring-1 ring-indigo-500/10'
          //                   : 'border-slate-200 bg-white hover:border-slate-300'
          //               }`}
          //             >
          //               {wizWorkDaysType === '3days' && (
          //                 <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-indigo-600" />
          //               )}
          //               <h4 className="text-xs font-black text-slate-800">주 3일</h4>
          //               <p className="mt-1 text-[10px] leading-tight font-medium text-slate-500">
          //                 월수금 (14:00 ~ 22:00)
          //               </p>
          //               <span className="mt-2 inline-block rounded border border-indigo-100 bg-indigo-50 px-1.5 py-0.5 text-[9px] font-extrabold text-indigo-600">
          //                 휴게 1h · 소정 21H
          //               </span>
          //             </button>

          //             {/* 직접 지정 */}
          //             <button
          //               type="button"
          //               onClick={() => {
          //                 setWizWorkDaysType('custom');
          //                 setEditingDay(null);
          //               }}
          //               className={`relative rounded-2xl border-2 p-3.5 text-left transition-all ${
          //                 wizWorkDaysType === 'custom'
          //                   ? 'border-indigo-600 bg-indigo-50/30 shadow-sm ring-1 ring-indigo-500/10'
          //                   : 'border-slate-200 bg-white hover:border-slate-300'
          //               }`}
          //             >
          //               {wizWorkDaysType === 'custom' && (
          //                 <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-indigo-600" />
          //               )}
          //               <h4 className="text-xs font-black text-indigo-600">직접 지정</h4>
          //               <p className="mt-1 text-[10px] leading-tight font-medium text-slate-500">
          //                 요일별 개별 시간 세팅
          //               </p>
          //               <span className="mt-2 inline-block rounded border border-slate-100 bg-slate-50 px-1.5 py-0.5 font-sans text-[9px] font-extrabold text-slate-400">
          //                 사용자 지정
          //               </span>
          //             </button>
          //           </div>
          //         </div>

          //         {/* 단축 일괄 제어기 */}
          //         <div className="relative space-y-4 overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50 p-5 shadow-sm">
          //           <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-full bg-indigo-500/5 blur-xl filter" />

          //           <div className="flex flex-col justify-between gap-1.5 sm:flex-row sm:items-center">
          //             <div className="space-y-0.5">
          //               <div className="flex items-center gap-1.5">
          //                 <span className="text-[9px] font-black tracking-widest text-indigo-600 uppercase">
          //                   GLOBAL APPLY CONTROLLER
          //                 </span>
          //                 <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[9px] font-black text-indigo-800">
          //                   ★ 핵심 개선
          //                 </span>
          //               </div>
          //               <h3 className="text-xs font-black text-slate-800">단축 일괄 제어기</h3>
          //             </div>
          //             <span className="text-slate-505 text-[10px] font-semibold">
          //               "원하는 요일을 다중 선택하고, 시간을 한 번만 입력하면 자동으로 채워집니다."
          //             </span>
          //           </div>

          //           <div className="grid grid-cols-1 gap-4 border-t border-slate-200/55 pt-4 md:grid-cols-12">
          //             {/* 대상 요일 및 단축칩 */}
          //             <div className="space-y-3 md:col-span-6">
          //               <div className="flex items-center justify-between">
          //                 <label className="text-[10px] font-extrabold tracking-wider text-slate-600 uppercase">
          //                   대상 요일 토글 (Multi-Select)
          //                 </label>
          //                 <div className="flex gap-1.5">
          //                   <button
          //                     type="button"
          //                     onClick={() =>
          //                       setSelectedBatchDays([
          //                         '월요일',
          //                         '화요일',
          //                         '수요일',
          //                         '목요일',
          //                         '금요일',
          //                       ])
          //                     }
          //                     className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[9px] font-black text-indigo-600 transition-all hover:bg-indigo-100/60 hover:text-indigo-700"
          //                   >
          //                     평일 전체
          //                   </button>
          //                   <button
          //                     type="button"
          //                     onClick={() => setSelectedBatchDays(['토요일', '일요일'])}
          //                     className="rounded-lg bg-amber-50 px-2 py-0.5 text-[9px] font-black text-amber-600 transition-all hover:bg-amber-100/60 hover:text-amber-700"
          //                   >
          //                     주말 전체
          //                   </button>
          //                   <button
          //                     type="button"
          //                     onClick={() => setSelectedBatchDays([])}
          //                     className="rounded-lg bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-500 transition-all hover:bg-slate-200/80 hover:text-slate-600"
          //                   >
          //                     선택 초기화
          //                   </button>
          //                 </div>
          //               </div>

          //               {/* 요일 토글 버튼 리스트 */}
          //               <div className="flex flex-wrap gap-1.5">
          //                 {['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'].map(
          //                   day => {
          //                     const isSelected = selectedBatchDays.includes(day);
          //                     const shortDay = day.substring(0, 1);
          //                     return (
          //                       <button
          //                         key={day}
          //                         type="button"
          //                         onClick={() => {
          //                           if (isSelected) {
          //                             setSelectedBatchDays(selectedBatchDays.filter(d => d !== day));
          //                           } else {
          //                             setSelectedBatchDays([...selectedBatchDays, day]);
          //                           }
          //                         }}
          //                         className={`flex h-10 w-10 flex-col items-center justify-center rounded-xl border transition-all ${
          //                           isSelected
          //                             ? 'scale-102 border-indigo-600 bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-100'
          //                             : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          //                         }`}
          //                       >
          //                         <span className="text-[11px] font-black">{shortDay}</span>
          //                         <span className="mt-0.5 text-[8px] font-bold tracking-tighter opacity-80">
          //                           {isSelected ? 'ON' : 'OFF'}
          //                         </span>
          //                       </button>
          //                     );
          //                   }
          //                 )}
          //               </div>
          //               <p className="text-[9px] leading-normal font-bold text-slate-400">
          //                 ※ 터치하여 활성화/비활성화 가능 (선택된 요일들만 하단 일괄 설정값이 일체화
          //                 동기화됨)
          //               </p>
          //             </div>

          //             {/* 일괄 시간 입력 바 */}
          //             <div className="flex flex-col justify-between space-y-3 md:col-span-6">
          //               <div>
          //                 <label className="mb-2 block text-[10px] font-extrabold tracking-wider text-slate-600 uppercase">
          //                   선택 요일 시간 일괄 입력 바
          //                 </label>
          //                 <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-inner">
          //                   {/* 근무 시작 */}
          //                   <div className="space-y-1">
          //                     <span className="block px-1 text-[8px] font-black text-slate-400">
          //                       근무 시작
          //                     </span>
          //                     <select
          //                       value={batchStartTime}
          //                       onChange={e => setBatchStartTime(e.target.value)}
          //                       className="w-full cursor-pointer border-0 bg-transparent p-0.5 text-xs font-black text-slate-700 focus:ring-0 focus:outline-none"
          //                     >
          //                       {[
          //                         '08:00',
          //                         '09:00',
          //                         '10:00',
          //                         '11:00',
          //                         '12:00',
          //                         '13:00',
          //                         '14:00',
          //                         '15:00',
          //                         '16:00',
          //                         '17:00',
          //                         '18:00',
          //                         '19:00',
          //                         '20:00',
          //                       ].map(t => (
          //                         <option key={t} value={t}>
          //                           {t}
          //                         </option>
          //                       ))}
          //                     </select>
          //                   </div>
          //                   {/* 근무 종료 */}
          //                   <div className="space-y-1 border-l border-slate-100 pl-2">
          //                     <span className="block px-1 text-[8px] font-black text-slate-400">
          //                       근무 종료
          //                     </span>
          //                     <select
          //                       value={batchEndTime}
          //                       onChange={e => setBatchEndTime(e.target.value)}
          //                       className="w-full cursor-pointer border-0 bg-transparent p-0.5 text-xs font-black text-slate-700 focus:ring-0 focus:outline-none"
          //                     >
          //                       {[
          //                         '12:00',
          //                         '13:00',
          //                         '14:00',
          //                         '15:00',
          //                         '16:00',
          //                         '17:00',
          //                         '18:00',
          //                         '19:00',
          //                         '20:00',
          //                         '21:00',
          //                         '22:00',
          //                         '23:00',
          //                         '24:00',
          //                       ].map(t => (
          //                         <option key={t} value={t}>
          //                           {t}
          //                         </option>
          //                       ))}
          //                     </select>
          //                   </div>
          //                   {/* 휴게 시간 */}
          //                   <div className="space-y-1 border-l border-slate-100 pl-2">
          //                     <span className="block px-1 text-[8px] font-black text-slate-400">
          //                       휴게 시간
          //                     </span>
          //                     <select
          //                       value={batchBreakTime}
          //                       onChange={e => setBatchBreakTime(e.target.value)}
          //                       className="w-full cursor-pointer border-0 bg-transparent p-0.5 text-xs font-black text-slate-700 focus:ring-0 focus:outline-none"
          //                     >
          //                       <option value="없음">없음</option>
          //                       <option value="30분">30분</option>
          //                       <option value="1시간">1시간</option>
          //                       <option value="1.5시간">1.5시간</option>
          //                       <option value="2시간">2시간</option>
          //                     </select>
          //                   </div>
          //                 </div>
          //               </div>

          //               {/* 일괄 적용 버튼 */}
          //               <button
          //                 type="button"
          //                 onClick={() => {
          //                   if (selectedBatchDays.length === 0) {
          //                     return;
          //                   }
          //                   setWizDaysConfig(prev => {
          //                     const next = { ...prev };
          //                     selectedBatchDays.forEach(day => {
          //                       next[day] = {
          //                         ...next[day],
          //                         enabled: true,
          //                         startTime: batchStartTime,
          //                         endTime: batchEndTime,
          //                         breakTime: batchBreakTime,
          //                       };
          //                     });
          //                     return next;
          //                   });
          //                   setWizWorkDaysType('custom');
          //                 }}
          //                 className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-[11px] font-black text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
          //               >
          //                 <Check className="h-3.5 w-3.5" />
          //                 <span>선택된 요일에 설정 일괄 채우기 (Apply)</span>
          //               </button>
          //             </div>
          //           </div>
          //         </div>

          //         {/* 요일별 결과 및 미세 조정 그리드 (Horizontal Summary Grid) */}
          //         <div className="space-y-3">
          //           <div className="flex items-center justify-between">
          //             <div className="flex items-center gap-1.5">
          //               <CalendarRange className="h-4 w-4 text-slate-500" />
          //               <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
          //                 요일별 개별 상세 카드
          //               </span>
          //             </div>
          //             <span className="text-[9.5px] font-semibold text-slate-400">
          //               💡 각 요일 카드를 터치하여 개별 미세 예외를 즉각 세팅할 수 있습니다.
          //             </span>
          //           </div>

          //           <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-7">
          //             {['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'].map(
          //               day => {
          //                 const conf = wizDaysConfig[day];
          //                 const hours = conf.enabled
          //                   ? calculateDailyHours(conf.startTime, conf.endTime, conf.breakTime)
          //                   : 0;
          //                 const isEditing = editingDay === day;
          //                 return (
          //                   <div
          //                     key={day}
          //                     onClick={() => setEditingDay(day)}
          //                     className={`relative flex h-[115px] cursor-pointer flex-col justify-between rounded-2xl border-2 p-3 text-center transition-all ${
          //                       isEditing
          //                         ? 'scale-102 border-indigo-600 bg-indigo-50/20 shadow-sm ring-1 ring-indigo-500/10'
          //                         : conf.enabled
          //                           ? 'border-slate-200 bg-white shadow-xs hover:border-slate-300'
          //                           : 'border-slate-100 bg-slate-50/50 opacity-75 hover:bg-slate-50'
          //                     }`}
          //                   >
          //                     <div>
          //                       <span
          //                         className={`block text-[10px] font-black ${conf.enabled ? 'text-slate-800' : 'text-slate-400'}`}
          //                       >
          //                         {day.substring(0, 3)}
          //                       </span>
          //                       <span
          //                         className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
          //                           conf.enabled
          //                             ? 'bg-indigo-50 text-indigo-700'
          //                             : 'bg-slate-100 text-slate-400'
          //                         }`}
          //                       >
          //                         {conf.enabled ? 'ON' : 'OFF'}
          //                       </span>
          //                     </div>

          //                     {conf.enabled ? (
          //                       <div className="space-y-0.5">
          //                         <div className="text-[10px] leading-none font-black text-slate-800">
          //                           {conf.startTime}
          //                         </div>
          //                         <div className="text-[8px] font-medium text-slate-400">~</div>
          //                         <div className="text-[10px] leading-none font-black text-slate-800">
          //                           {conf.endTime}
          //                         </div>
          //                         <div className="mt-1 inline-block text-[8px] font-bold text-indigo-600">
          //                           휴게 {conf.breakTime}
          //                         </div>
          //                         <div className="mt-1 block rounded bg-slate-100 px-1 py-0.5 text-[8px] font-extrabold text-slate-500">
          //                           소정 {hours}H
          //                         </div>
          //                       </div>
          //                     ) : (
          //                       <div className="py-4 text-lg font-black text-slate-300">-</div>
          //                     )}
          //                   </div>
          //                 );
          //               }
          //             )}
          //           </div>

          //           {/* 독립 예외 편집 기능 (미세 조정 Panel) */}
          //           {editingDay &&
          //             (() => {
          //               const conf = wizDaysConfig[editingDay];
          //               const hours = conf.enabled
          //                 ? calculateDailyHours(conf.startTime, conf.endTime, conf.breakTime)
          //                 : 0;
          //               return (
          //                 <div className="animate-in slide-in-from-top-1 space-y-4 rounded-3xl border-2 border-indigo-100/70 bg-indigo-50/20 p-4 shadow-[0_4px_16px_rgba(99,102,241,0.03)] duration-200">
          //                   <div className="flex items-center justify-between border-b border-indigo-100/50 pb-2">
          //                     <div className="text-slate-905 flex items-center gap-1.5 text-[11px] font-black">
          //                       <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
          //                       <span>🔧 [{editingDay}] 개별 예외 미세 조정</span>
          //                     </div>
          //                     <button
          //                       type="button"
          //                       onClick={() => setEditingDay(null)}
          //                       className="rounded-lg border border-slate-200/60 bg-white p-1 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
          //                     >
          //                       <X className="h-3 w-3" />
          //                     </button>
          //                   </div>

          //                   <div className="flex flex-wrap items-center gap-3.5 text-xs">
          //                     {/* 활성화 상태 */}
          //                     <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5">
          //                       <span className="text-[10px] font-extrabold text-slate-600">
          //                         근무 여부:
          //                       </span>
          //                       <button
          //                         type="button"
          //                         onClick={() => {
          //                           setWizDaysConfig(prev => ({
          //                             ...prev,
          //                             [editingDay]: {
          //                               ...prev[editingDay],
          //                               enabled: !prev[editingDay].enabled,
          //                             },
          //                           }));
          //                           setWizWorkDaysType('custom');
          //                         }}
          //                         className={`rounded-lg px-2.5 py-1 text-[9px] font-black tracking-wider transition-all ${
          //                           conf.enabled
          //                             ? 'bg-indigo-600 text-white shadow-sm'
          //                             : 'text-slate-505 bg-slate-200'
          //                         }`}
          //                       >
          //                         {conf.enabled ? 'ON (근무)' : 'OFF (휴무)'}
          //                       </button>
          //                     </div>

          //                     {conf.enabled && (
          //                       <>
          //                         {/* 시작 시간 */}
          //                         <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5">
          //                           <span className="text-[10px] font-extrabold text-slate-600">
          //                             시작:
          //                           </span>
          //                           <select
          //                             value={conf.startTime}
          //                             onChange={e => {
          //                               setWizDaysConfig(prev => ({
          //                                 ...prev,
          //                                 [editingDay]: {
          //                                   ...prev[editingDay],
          //                                   startTime: e.target.value,
          //                                 },
          //                               }));
          //                               setWizWorkDaysType('custom');
          //                             }}
          //                             className="text-slate-808 cursor-pointer border-0 bg-transparent p-0.5 text-xs font-bold focus:outline-none"
          //                           >
          //                             {[
          //                               '08:00',
          //                               '09:00',
          //                               '10:00',
          //                               '11:00',
          //                               '12:00',
          //                               '13:00',
          //                               '14:00',
          //                               '15:00',
          //                               '16:00',
          //                               '17:00',
          //                               '18:00',
          //                               '19:00',
          //                               '20:00',
          //                             ].map(t => (
          //                               <option key={t} value={t}>
          //                                 {t}
          //                               </option>
          //                             ))}
          //                           </select>
          //                         </div>

          //                         {/* 종료 시간 */}
          //                         <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5">
          //                           <span className="text-[10px] font-extrabold text-slate-600">
          //                             종료:
          //                           </span>
          //                           <select
          //                             value={conf.endTime}
          //                             onChange={e => {
          //                               setWizDaysConfig(prev => ({
          //                                 ...prev,
          //                                 [editingDay]: {
          //                                   ...prev[editingDay],
          //                                   endTime: e.target.value,
          //                                 },
          //                               }));
          //                               setWizWorkDaysType('custom');
          //                             }}
          //                             className="text-slate-808 cursor-pointer border-0 bg-transparent p-0.5 text-xs font-bold focus:outline-none"
          //                           >
          //                             {[
          //                               '12:00',
          //                               '13:00',
          //                               '14:00',
          //                               '15:00',
          //                               '16:00',
          //                               '17:00',
          //                               '18:00',
          //                               '19:00',
          //                               '20:00',
          //                               '21:00',
          //                               '22:00',
          //                               '23:00',
          //                               '24:00',
          //                             ].map(t => (
          //                               <option key={t} value={t}>
          //                                 {t}
          //                               </option>
          //                             ))}
          //                           </select>
          //                         </div>

          //                         {/* 휴게 시간 */}
          //                         <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5">
          //                           <span className="text-[10px] font-extrabold text-slate-600">
          //                             휴게:
          //                           </span>
          //                           <select
          //                             value={conf.breakTime}
          //                             onChange={e => {
          //                               setWizDaysConfig(prev => ({
          //                                 ...prev,
          //                                 [editingDay]: {
          //                                   ...prev[editingDay],
          //                                   breakTime: e.target.value,
          //                                 },
          //                               }));
          //                               setWizWorkDaysType('custom');
          //                             }}
          //                             className="text-slate-808 cursor-pointer border-0 bg-transparent p-0.5 text-xs font-bold focus:outline-none"
          //                           >
          //                             <option value="없음">없음</option>
          //                             <option value="30분">30분</option>
          //                             <option value="1시간">1시간</option>
          //                             <option value="1.5시간">1.5시간</option>
          //                             <option value="2시간">2시간</option>
          //                           </select>
          //                         </div>

          //                         {/* 하루 소정근로시간 요약 */}
          //                         <div className="rounded-xl bg-indigo-600 px-2.5 py-1.5 text-[10px] font-extrabold text-white shadow-sm">
          //                           하루 소정 {hours}H
          //                         </div>
          //                       </>
          //                     )}
          //                   </div>
          //                 </div>
          //               );
          //             })()}
          //         </div>

          //         {/* 소정근로 정산 패널 */}
          //         <div
          //           className={`flex flex-col items-center justify-between gap-3 rounded-3xl border p-4.5 transition-all duration-300 sm:flex-row ${
          //             showChangePulse
          //               ? 'scale-[1.01] border-indigo-400 bg-indigo-50/70 shadow-[0_4px_16px_rgba(99,102,241,0.08)]'
          //               : 'border-slate-200 bg-slate-50/50'
          //           }`}
          //         >
          //           <div className="flex items-center gap-2.5">
          //             <div
          //               className={`rounded-xl p-2 ${hasWeeklyRestAllowance ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}
          //             >
          //               <Clock className="h-5 w-5" />
          //             </div>
          //             <div className="space-y-0.5">
          //               <span className="block text-[8px] font-black tracking-wider text-slate-400 uppercase">
          //                 DYNAMIC REAL-TIME FEEDBACK
          //               </span>
          //               <h4 className="flex items-center gap-1.5 text-xs font-black text-slate-800">
          //                 주당 총 소정근로시간 요약 :
          //                 <span className="text-sm font-black text-indigo-600 underline decoration-2 underline-offset-2">
          //                   {weeklyHours}시간
          //                 </span>
          //               </h4>
          //             </div>
          //           </div>

          //           <div className="flex items-center gap-2">
          //             {hasWeeklyRestAllowance ? (
          //               <span className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-extrabold text-emerald-700 shadow-sm">
          //                 <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          //                 주휴수당 지급 대상 (15시간 이상)
          //               </span>
          //             ) : (
          //               <span className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-extrabold text-slate-500">
          //                 <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          //                 주휴수당 제외 대상 (15시간 미만)
          //               </span>
          //             )}
          //           </div>
          //         </div>

          //         <div className="flex justify-between border-t border-slate-100 pt-2">
          //           <button
          //             type="button"
          //             onClick={() => setWizSubStep(1)}
          //             className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          //           >
          //             이전 단계로
          //           </button>
          //           <button
          //             type="button"
          //             onClick={() => {
          //               setMaxUnlockedSubStep(Math.max(maxUnlockedSubStep, 3) as any);
          //               setWizSubStep(3);
          //             }}
          //             className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800"
          //           >
          //             <span>2단계 완료 및 3단계로 이동</span>
          //             <ArrowRight className="h-3.5 w-3.5" />
          //           </button>
          //         </div>
          //       </div>
          //     )}
          //   </div>
        )}

        {/* [3단계] 급여 및 비과세 설정 */}
        {maxUnlockedSubStep >= 3 && (
          <></>
          //   <div className="animate-in fade-in slide-in-from-top-2 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300">
          //     {/* 아코디언 헤더 */}
          //     <button
          //       type="button"
          //       onClick={() => setWizSubStep(3)}
          //       className={`flex w-full items-center justify-between p-5 text-left transition-all ${
          //         wizSubStep === 3
          //           ? 'border-b border-slate-100 bg-slate-50/80'
          //           : 'hover:bg-slate-50/50'
          //       }`}
          //     >
          //       <div className="flex items-center gap-3">
          //         <span
          //           className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
          //             wizSubStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
          //           }`}
          //         >
          //           3
          //         </span>
          //         <div>
          //           <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
          //             💰 급여 형태 및 금액 설정
          //           </h3>
          //           {wizSubStep !== 3 && (
          //             <p className="mt-1 text-[11px] font-semibold text-slate-500">
          //               급여 형태: {wizSalaryType === 'hourly' ? '시급제' : '월급제'} · 금액:{' '}
          //               {wizSalaryAmount.toLocaleString()}원 · 예상 실수령:{' '}
          //               {expectedSalary.toLocaleString()}원
          //             </p>
          //           )}
          //         </div>
          //       </div>
          //       <div className="flex items-center gap-2">
          //         {wizSubStep === 3 ? (
          //           <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
          //             작성 중
          //           </span>
          //         ) : (
          //           <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          //             완료
          //           </span>
          //         )}
          //         {wizSubStep === 3 ? (
          //           <ChevronUp className="h-4 w-4 text-slate-400" />
          //         ) : (
          //           <ChevronDown className="h-4 w-4 text-slate-400" />
          //         )}
          //       </div>
          //     </button>

          //     {/* 아코디언 바디 */}
          //     {wizSubStep === 3 && (
          //       <div className="animate-in fade-in space-y-6 border-t border-slate-100 bg-slate-50/10 p-6 duration-200">
          //         {/* 급여 방식 선택 (이미지 1의 3단 수직 카드 구조) */}
          //         <div className="space-y-3.5">
          //           <label className="block text-xs font-black tracking-wider text-slate-800 uppercase">
          //             급여 방식을 선택해주세요 <span className="text-red-500">*</span>
          //           </label>

          //           <div className="space-y-3.5">
          //             {/* 1. 고정급 (월급제) */}
          //             <div
          //               onClick={() => {
          //                 setWizSalaryType('monthly');
          //                 setWizSalaryAmount(2400000);
          //               }}
          //               className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border-2 p-5 transition-all ${
          //                 wizSalaryType === 'monthly'
          //                   ? 'border-blue-600 bg-blue-50/20 shadow-sm ring-1 ring-blue-500/20'
          //                   : 'border-slate-200 bg-white hover:bg-slate-50'
          //               }`}
          //             >
          //               <div className="flex items-start justify-between">
          //                 <div className="flex items-center gap-3">
          //                   <div
          //                     className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          //                       wizSalaryType === 'monthly'
          //                         ? 'border-blue-600 bg-blue-600'
          //                         : 'border-slate-300 bg-white'
          //                     }`}
          //                   >
          //                     {wizSalaryType === 'monthly' && (
          //                       <div className="h-2 w-2 rounded-full bg-white" />
          //                     )}
          //                   </div>
          //                   <div>
          //                     <span className="text-sm font-extrabold text-slate-900">
          //                       고정급 (월급제)
          //                     </span>
          //                     <p className="text-slate-505 mt-0.5 text-[11px] font-medium">
          //                       매월 고정된 금액을 지급합니다.
          //                     </p>
          //                   </div>
          //                 </div>
          //                 <span className="flex items-center gap-1 rounded-lg border border-amber-200/50 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600">
          //                   ⭐ 가장 많이 사용
          //                 </span>
          //               </div>
          //               <div className="mt-3.5 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3.5 text-[11px] font-semibold sm:grid-cols-2">
          //                 <div className="space-y-1">
          //                   <div className="flex items-center gap-1.5 text-emerald-600">
          //                     <Check className="h-3.5 w-3.5" />
          //                     <span>급여 예측이 쉬움</span>
          //                   </div>
          //                   <div className="flex items-center gap-1.5 text-emerald-600">
          //                     <Check className="h-3.5 w-3.5" />
          //                     <span>행정 처리 간편</span>
          //                   </div>
          //                 </div>
          //                 <div className="flex items-center gap-1.5 self-start text-amber-600 sm:self-center">
          //                   <AlertTriangle className="h-3.5 w-3.5" />
          //                   <span>근무시간 변동 시 정산 필요</span>
          //                 </div>
          //               </div>
          //             </div>

          //             {/* 2. 비율제 (인센티브) */}
          //             <div
          //               onClick={() => {
          //                 setWizSalaryType('fixed');
          //                 setWizSalaryAmount(1683296);
          //               }}
          //               className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border-2 p-5 transition-all ${
          //                 wizSalaryType === 'fixed'
          //                   ? 'border-blue-600 bg-blue-50/20 shadow-sm ring-1 ring-blue-500/20'
          //                   : 'border-slate-200 bg-white hover:bg-slate-50'
          //               }`}
          //             >
          //               <div className="flex items-start justify-between">
          //                 <div className="flex items-center gap-3">
          //                   <div
          //                     className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          //                       wizSalaryType === 'fixed'
          //                         ? 'border-blue-600 bg-blue-600'
          //                         : 'border-slate-300 bg-white'
          //                     }`}
          //                   >
          //                     {wizSalaryType === 'fixed' && (
          //                       <div className="h-2 w-2 rounded-full bg-white" />
          //                     )}
          //                   </div>
          //                   <div>
          //                     <span className="text-sm font-extrabold text-slate-900">
          //                       비율제 (인센티브)
          //                     </span>
          //                     <p className="text-slate-550 mt-0.5 text-[11px] font-medium">
          //                       수강료의 일정 비율을 지급합니다.
          //                     </p>
          //                   </div>
          //                 </div>
          //                 <span className="flex items-center gap-1 rounded-lg border border-blue-200/50 bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">
          //                   💡 성과 연동
          //                 </span>
          //               </div>
          //               <div className="mt-3.5 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3.5 text-[11px] font-semibold sm:grid-cols-2">
          //                 <div className="space-y-1">
          //                   <div className="flex items-center gap-1.5 text-emerald-600">
          //                     <Check className="h-3.5 w-3.5" />
          //                     <span>성과에 따른 보상 가능</span>
          //                   </div>
          //                   <div className="flex items-center gap-1.5 text-emerald-600">
          //                     <Check className="h-3.5 w-3.5" />
          //                     <span>강사 동기부여 효과</span>
          //                   </div>
          //                 </div>
          //                 <div className="flex items-center gap-1.5 self-start text-amber-600 sm:self-center">
          //                   <AlertTriangle className="h-3.5 w-3.5" />
          //                   <span>최저임금 보장 필수 (미달 시 차액 지급)</span>
          //                 </div>
          //               </div>
          //             </div>

          //             {/* 3. 시급제 */}
          //             <div
          //               onClick={() => {
          //                 setWizSalaryType('hourly');
          //                 setWizSalaryAmount(10320);
          //               }}
          //               className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border-2 p-5 transition-all ${
          //                 wizSalaryType === 'hourly'
          //                   ? 'border-blue-600 bg-blue-50/20 shadow-sm ring-1 ring-blue-500/20'
          //                   : 'border-slate-200 bg-white hover:bg-slate-50'
          //               }`}
          //             >
          //               <div className="flex items-start justify-between">
          //                 <div className="flex items-center gap-3">
          //                   <div
          //                     className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          //                       wizSalaryType === 'hourly'
          //                         ? 'border-blue-600 bg-blue-600'
          //                         : 'border-slate-300 bg-white'
          //                     }`}
          //                   >
          //                     {wizSalaryType === 'hourly' && (
          //                       <div className="h-2 w-2 rounded-full bg-white" />
          //                     )}
          //                   </div>
          //                   <div>
          //                     <span className="text-sm font-extrabold text-slate-900">시급제</span>
          //                     <p className="text-slate-550 mt-0.5 text-[11px] font-medium">
          //                       근무한 시간에 따라 시급을 지급합니다.
          //                     </p>
          //                   </div>
          //                 </div>
          //                 <span className="flex items-center gap-1 rounded-lg border border-slate-200/50 bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
          //                   📋 단시간 적합
          //                 </span>
          //               </div>
          //               <div className="mt-3.5 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3.5 text-[11px] font-semibold sm:grid-cols-2">
          //                 <div className="space-y-1">
          //                   <div className="flex items-center gap-1.5 text-emerald-600">
          //                     <Check className="h-3.5 w-3.5" />
          //                     <span>근무시간 변동에 유연</span>
          //                   </div>
          //                   <div className="flex items-center gap-1.5 text-emerald-600">
          //                     <Check className="h-3.5 w-3.5" />
          //                     <span>15시간 미만 단시간 근로에 적합</span>
          //                   </div>
          //                 </div>
          //                 <div className="flex items-center gap-1.5 self-start text-amber-600 sm:self-center">
          //                   <AlertTriangle className="h-3.5 w-3.5" />
          //                   <span>매월 급여가 달라질 수 있음</span>
          //                 </div>
          //               </div>
          //             </div>
          //           </div>
          //         </div>

          //         {/* 금액 및 지급일 입력 영역 */}
          //         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          //           <div>
          //             <label className="mb-1.5 block text-xs font-bold text-slate-700">
          //               기본{' '}
          //               {wizSalaryType === 'hourly'
          //                 ? '시급'
          //                 : wizSalaryType === 'monthly'
          //                   ? '급여액'
          //                   : '약정 대가(기본급)'}{' '}
          //               <span className="text-red-500">*</span>
          //             </label>
          //             <div className="relative">
          //               <input
          //                 type="number"
          //                 value={wizSalaryAmount}
          //                 onChange={e =>
          //                   setWizSalaryAmount(Math.max(0, parseInt(e.target.value) || 0))
          //                 }
          //                 className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pr-8 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
          //               />
          //               <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-500">
          //                 원
          //               </span>
          //             </div>
          //           </div>

          //           <div>
          //             <label className="mb-1.5 block text-xs font-bold text-slate-700">
          //               매월 급여 지급일
          //             </label>
          //             <select
          //               value={wizPayDay}
          //               onChange={e => setWizPayDay(e.target.value)}
          //               className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold focus:outline-none"
          //             >
          //               <option value="10일">10일</option>
          //               <option value="25일">25일</option>
          //               <option value="말일">말일</option>
          //             </select>
          //           </div>
          //         </div>

          //         {/* 비율제/고정급일 때 추가 수당 및 경업금지 약정 설정 노출 (이미지 2) */}
          //         {(wizSalaryType === 'monthly' || wizSalaryType === 'fixed') && (
          //           <div className="animate-in fade-in space-y-4 duration-300">
          //             {/* 📋 추가 수당 설정 */}
          //             <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          //               <h4 className="flex items-center gap-1.5 border-b border-slate-100 pb-2 text-[12px] font-extrabold text-slate-800">
          //                 📋 추가 수당 설정
          //               </h4>

          //               <div className="space-y-3.5">
          //                 <div>
          //                   <label className="mb-1 block text-xs font-bold text-slate-600">
          //                     연장근로수당
          //                   </label>
          //                   <div className="relative">
          //                     <input
          //                       type="number"
          //                       value={wizOvertimeAllowance}
          //                       onChange={e =>
          //                         setWizOvertimeAllowance(Math.max(0, parseInt(e.target.value) || 0))
          //                       }
          //                       className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pr-8 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
          //                       placeholder="0"
          //                     />
          //                     <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-500">
          //                       원
          //                     </span>
          //                   </div>
          //                   <p className="mt-1 text-[10px] text-slate-400">
          //                     주 40시간 이하인 경우 연장근로수당은 선택사항입니다.
          //                   </p>
          //                 </div>

          //                 <div>
          //                   <label className="mb-1 block text-xs font-bold text-slate-600">
          //                     직책수당
          //                   </label>
          //                   <div className="relative">
          //                     <input
          //                       type="number"
          //                       value={wizPositionAllowance}
          //                       onChange={e =>
          //                         setWizPositionAllowance(Math.max(0, parseInt(e.target.value) || 0))
          //                       }
          //                       className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pr-8 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
          //                       placeholder="0"
          //                     />
          //                     <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-500">
          //                       원
          //                     </span>
          //                   </div>
          //                 </div>

          //                 <div>
          //                   <label className="mb-1 block text-xs font-bold text-slate-600">
          //                     기타 수당
          //                   </label>
          //                   <div className="relative">
          //                     <input
          //                       type="number"
          //                       value={wizOtherAllowance}
          //                       onChange={e =>
          //                         setWizOtherAllowance(Math.max(0, parseInt(e.target.value) || 0))
          //                       }
          //                       className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pr-8 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
          //                       placeholder="0"
          //                     />
          //                     <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-500">
          //                       원
          //                     </span>
          //                   </div>
          //                 </div>
          //               </div>
          //             </div>

          //             {/* 📋 경업금지 약정 설정 */}
          //             <div className="space-y-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          //               <h4 className="flex items-center gap-1.5 border-b border-slate-100 pb-2 text-[12px] font-extrabold text-slate-800">
          //                 📋 경업금지 약정 설정
          //               </h4>

          //               <label className="flex cursor-pointer items-center gap-2 p-0.5">
          //                 <input
          //                   type="checkbox"
          //                   checked={wizHasNonCompete}
          //                   onChange={e => setWizHasNonCompete(e.target.checked)}
          //                   className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          //                 />
          //                 <span className="text-xs font-bold text-slate-700">
          //                   퇴직 후 경업금지 약정 적용
          //                 </span>
          //               </label>
          //               <p className="pl-6 text-[10px] leading-relaxed text-slate-400">
          //                 💡 학온 추천: 경업금지 대가는 최소 보장 금액의 약 10%를 권장합니다.
          //               </p>

          //               {wizHasNonCompete && (
          //                 <div className="animate-in fade-in ml-6 space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 duration-200">
          //                   <div className="grid grid-cols-2 gap-4">
          //                     <div>
          //                       <label className="mb-1 block text-[11px] font-bold text-slate-500">
          //                         기간
          //                       </label>
          //                       <select
          //                         value={wizNonCompetePeriod}
          //                         onChange={e => setWizNonCompetePeriod(e.target.value)}
          //                         className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold focus:outline-none"
          //                       >
          //                         <option value="3개월">3개월</option>
          //                         <option value="6개월">6개월</option>
          //                         <option value="12개월">12개월</option>
          //                         <option value="24개월">24개월</option>
          //                       </select>
          //                     </div>
          //                     <div>
          //                       <label className="mb-1 block text-[11px] font-bold text-slate-500">
          //                         범위
          //                       </label>
          //                       <select
          //                         value={wizNonCompeteRange}
          //                         onChange={e => setWizNonCompeteRange(e.target.value)}
          //                         className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold focus:outline-none"
          //                       >
          //                         <option value="반경 1km">반경 1km</option>
          //                         <option value="반경 3km">반경 3km</option>
          //                         <option value="반경 5km">반경 5km</option>
          //                         <option value="반경 10km">반경 10km</option>
          //                       </select>
          //                     </div>
          //                   </div>

          //                   <div>
          //                     <label className="mb-1 block text-[11px] font-bold text-slate-500">
          //                       경업금지 대가 (월)
          //                     </label>
          //                     <div className="relative">
          //                       <input
          //                         type="number"
          //                         value={wizNonCompeteAmount}
          //                         onChange={e =>
          //                           setWizNonCompeteAmount(Math.max(0, parseInt(e.target.value) || 0))
          //                         }
          //                         className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pr-8 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
          //                       />
          //                       <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-500">
          //                         원
          //                       </span>
          //                     </div>
          //                     <p className="mt-1 pl-1 font-mono text-[10px] font-bold text-slate-500">
          //                       ({numberToKorean(wizNonCompeteAmount)}원)
          //                     </p>
          //                   </div>

          //                   <div className="text-slate-650 flex items-start gap-1.5 rounded-xl border border-blue-100/60 bg-blue-50/50 p-3 text-[10px] leading-normal">
          //                     <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
          //                     <p>
          //                       💡 학온 추천: 최소 보장 금액 {wizSalaryAmount.toLocaleString()}
          //                       원의 약 10% = {Math.round(wizSalaryAmount * 0.1).toLocaleString()}
          //                       원을 경업금지 대가로 권장합니다.
          //                     </p>
          //                   </div>
          //                 </div>
          //               )}
          //             </div>
          //           </div>
          //         )}

          //         {/* 비과세 항목 */}
          //         <div className="space-y-3.5 rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
          //           <h4 className="text-slate-505 flex items-center gap-1 text-[11px] font-extrabold">
          //             📋 비과세 급여 항목 구성
          //           </h4>

          //           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          //             <div>
          //               <div className="mb-1 flex items-center justify-between">
          //                 <label className="text-xs font-bold text-slate-700">식대</label>
          //                 <span className="rounded bg-emerald-50 px-1 text-[9px] text-emerald-600">
          //                   월 20만원 비과세 한도
          //                 </span>
          //               </div>
          //               <div className="relative">
          //                 <input
          //                   type="number"
          //                   value={wizNonTaxFood}
          //                   onChange={e =>
          //                     setWizNonTaxFood(Math.max(0, parseInt(e.target.value) || 0))
          //                   }
          //                   className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pr-8 text-xs focus:outline-none"
          //                 />
          //                 <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-slate-500">
          //                   원
          //                 </span>
          //               </div>
          //             </div>

          //             <div>
          //               <div className="mb-1 flex items-center justify-between">
          //                 <label className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-700">
          //                   <input
          //                     type="checkbox"
          //                     checked={wizHasCarAllowance}
          //                     onChange={e => setWizHasCarAllowance(e.target.checked)}
          //                     className="h-3.5 w-3.5 rounded text-blue-600"
          //                   />
          //                   <span>자가운전보조금</span>
          //                 </label>
          //                 <span className="rounded bg-emerald-50 px-1 text-[9px] text-emerald-600">
          //                   월 20만원 비과세 한도
          //                 </span>
          //               </div>
          //               {wizHasCarAllowance ? (
          //                 <div className="relative">
          //                   <input
          //                     type="number"
          //                     value={wizNonTaxCar}
          //                     onChange={e =>
          //                       setWizNonTaxCar(Math.max(0, parseInt(e.target.value) || 0))
          //                     }
          //                     className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pr-8 text-xs focus:outline-none"
          //                   />
          //                   <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-slate-500">
          //                     원
          //                   </span>
          //                 </div>
          //               ) : (
          //                 <div className="text-slate-405 rounded-xl bg-slate-100 p-2.5 text-center text-[10px]">
          //                   자가운전보조금 미지급
          //                 </div>
          //               )}
          //             </div>
          //           </div>
          //         </div>

          //         {/* 지급 예정액 */}
          //         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          //           <div className="flex flex-col justify-between rounded-2xl bg-slate-900 p-4 text-white shadow-md">
          //             <span className="text-[10px] font-black tracking-widest text-indigo-300 uppercase">
          //               실지급액 예측 (소정시간 기반)
          //             </span>
          //             <div className="mt-2">
          //               <p className="text-xl font-black text-white">
          //                 {expectedSalary.toLocaleString()}원
          //               </p>
          //               <p className="mt-1 text-[9px] font-semibold text-slate-400">
          //                 추가 수당 및 비과세 포함 · 세전 기준
          //               </p>
          //             </div>
          //           </div>
          //         </div>

          //         <div className="flex justify-between border-t border-slate-100 pt-2">
          //           <button
          //             type="button"
          //             onClick={() => setWizSubStep(2)}
          //             className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          //           >
          //             이전 단계로
          //           </button>
          //           <button
          //             type="button"
          //             onClick={() => setWizardStep(3)}
          //             className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-100 transition-all hover:bg-blue-700"
          //           >
          //             <span>3단계 완료 및 특약사항 이동</span>
          //             <ArrowRight className="h-3.5 w-3.5" />
          //           </button>
          //         </div>
          //       </div>
          //     )}
          //   </div>
        )}
      </div>

      {/* 오른쪽 컬럼: 실시간 자문 */}
      <div className="space-y-4 lg:sticky lg:top-6 lg:col-span-4">
        <div className="space-y-4 rounded-3xl border border-indigo-100/70 bg-indigo-50/40 p-4">
          {wizSubStep === 1 && <Step2Adv1Area />}

          {/* {wizSubStep === 2 && (
            <div className="animate-in fade-in space-y-3 duration-200">
              {(() => {
                const weeklyRestHours = Math.min(8, (weeklyHours / 40) * 8);
                const monthlyRestAllowance = Math.round(
                  weeklyRestHours *
                    (wizSalaryType === 'hourly'
                      ? wizSalaryAmount
                      : wizSalaryAmount / (weeklyHours + weeklyRestHours) / 4.345) *
                    4.345
                );
                const hasViolation = weeklyHours >= 15;

                return (
                  <div
                    className={`space-y-2 rounded-2xl border-2 p-4 transition-all ${
                      hasViolation
                        ? 'border-amber-200 bg-amber-50/80 text-amber-900 shadow-sm'
                        : 'border-emerald-100 bg-emerald-50/50 text-emerald-900 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold">
                      {hasViolation ? (
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      )}
                      <span className={hasViolation ? 'text-amber-850' : 'text-emerald-850'}>
                        {hasViolation
                          ? '⚠️ [주의] 주휴수당 필수 발생'
                          : '✔ [안전] 주휴수당 제외 대상 (초단시간)'}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-medium text-slate-600">
                      {weeklyHours >= 15
                        ? `주당 소정근로시간이 ${weeklyHours}시간으로 15시간 이상이므로, 근로기준법 제55조에 따라 매주 1회 이상 유급주휴일을 보장하고 주휴수당을 가산 지급해야 합니다. 기본시급과 주휴수당의 환산 금액을 각각 구분하여 명시하십시오.`
                        : `주당 소정근로시간이 15시간 미만으로, 법정 주휴수당 및 퇴직금 지급 의무에서 예외 적용을 받습니다.`}
                    </p>
                    {weeklyHours >= 15 && (
                      <p className="text-amber-850 mt-1 rounded-lg border border-amber-200/50 bg-white/70 px-2.5 py-1.5 pl-1 font-mono text-[10px] font-bold">
                        💡 예상 주휴수당 상당액: 월 평균 약 {monthlyRestAllowance.toLocaleString()}
                        원
                      </p>
                    )}
                  </div>
                );
              })()}

              <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-800">
                  <Info className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                  <span>⚖ [자문] 소정근로일정 특정의 가치</span>
                </div>
                <p className="text-[11px] leading-relaxed font-medium text-slate-600">
                  요일별 소정근로시간을 수치화하여 명확히 지정해 놓는 과정은 추후 강사와 근로일 증감
                  합의 및 수당 계산 시 불필요한 마찰을 완전히 예방할 수 있는 훌륭한 실무입니다.
                </p>
              </div>
            </div>
          )} */}

          {/* {wizSubStep === 3 && (
            <div className="animate-in fade-in space-y-3 duration-200">
              {(() => {
                const minWageLimit = 10320;
                let isMinWageViolation = false;
                let explanationText = '';
                let calcMinWage = 0;

                if (wizSalaryType === 'hourly') {
                  isMinWageViolation = wizSalaryAmount < minWageLimit;
                  explanationText = `시간당 ${wizSalaryAmount.toLocaleString()}원입니다.`;
                } else {
                  const weeklyRestHours = hasWeeklyRestAllowance
                    ? Math.min(8, (weeklyHours / 40) * 8)
                    : 0;
                  const monthlyHours = (weeklyHours + weeklyRestHours) * 4.345;
                  calcMinWage = Math.round(monthlyHours * minWageLimit);
                  isMinWageViolation = wizSalaryAmount < calcMinWage;
                  explanationText = `소정근로 주 ${weeklyHours}시간 대비, 2026년 법정 기준 월 환산액은 ${calcMinWage.toLocaleString()}원입니다.`;
                }

                return (
                  <div
                    className={`space-y-2 rounded-2xl border-2 p-4 transition-all ${
                      isMinWageViolation
                        ? 'border-rose-200 bg-rose-50/80 text-rose-900 shadow-sm'
                        : 'border-emerald-100 bg-emerald-50/50 text-emerald-900 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold">
                      {isMinWageViolation ? (
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      )}
                      <span className={isMinWageViolation ? 'text-rose-850' : 'text-emerald-850'}>
                        {isMinWageViolation
                          ? '🚨 [위험] 최저임금법 위반 소지'
                          : '✔ [적정] 최저임금 기준 통과'}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-medium text-slate-600">
                      {isMinWageViolation
                        ? `책정된 급여가 법정 기준치 미만입니다. 최저임금법 제6조 위반으로 3년 이하의 징역 또는 2천만원 이하의 벌금에 처해질 수 있습니다. 즉시 급여 상향이 요구됩니다.`
                        : `2026년 시간당 법정 최저시급(10,320원)을 철저히 준수하고 있습니다.`}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-slate-400">{explanationText}</p>
                  </div>
                );
              })()}

              {(() => {
                const isMonthly = wizSalaryType === 'monthly';
                return (
                  <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-800">
                      <Info className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                      <span>⚖ [자문] 포괄임금 계약 유효성 가이드</span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-medium text-slate-600">
                      {isMonthly
                        ? `월급제 계약인 경우, 기본 소정근로에 대한 '기본급'과 주휴수당에 해당하는 '주휴수당액'을 구체적인 지급 한도 시간과 금액으로 쪼개어 계약서상에 구분 기재해야 대법원 판례에 따라 유효한 포괄임금/고정급 계약으로 온전히 인정받을 수 있습니다.`
                        : `시급제 계약의 경우, 근무한 실제 시간에 비례하여 기본급과 주휴수당을 정산해야 하며, 고정액 일괄 포괄임금 계약은 권장하지 않습니다.`}
                    </p>
                  </div>
                );
              })()}
            </div>
          )} */}
        </div>
      </div>

      {/* 하단 이동 바 */}
      <div className="col-span-12 flex justify-between border-t border-slate-100 pt-5">
        {wizSubStep === 1 ? (
          <button
            onClick={() => setWizardStep(1)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50"
          >
            이전 (강사선택)
          </button>
        ) : (
          <button
            onClick={() => setWizSubStep((wizSubStep - 1) as any)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50"
          >
            이전 단계로 ({wizSubStep === 2 ? '계약 기간' : '근무 일정'})
          </button>
        )}

        {/* {wizSubStep < 3 ? (
          <button
            onClick={() => setWizSubStep((wizSubStep + 1) as any)}
            className="flex items-center space-x-1 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-100 transition-all duration-200 hover:bg-blue-700"
          >
            <span>다음 단계로 ({wizSubStep === 1 ? '근무 일정' : '급여 설정'})</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => setWizardStep(3)}
            className="flex items-center space-x-1 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-100 transition-all duration-200 hover:bg-blue-700"
          >
            <span>특약사항 및 리스크 자문으로 넘어가기</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )} */}
      </div>
    </div>
  );
}
