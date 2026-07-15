import { Send, Building, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { analyzeContractContent } from '../../../utils';
import { useWizaredStore } from '../state';

export default function Step4Area() {
  const navigate = useNavigate();
  const { persons, academies, selectedAcademyId, handleSendContract, wizCommissionPercent } =
    useStore();
  const {
    wizInstructorId,
    wizDaysConfig,
    wizSalaryType,
    wizSalaryAmount,
    wizSpecialClause,
    setWizardStep,
    wizStartDate,
    wizEndDate,
    wizProbation,
    wizNonTaxFood,
    wizHasCarAllowance,
    wizNonTaxCar,
    wizPayDay,
    wizOvertimeAllowance,
    wizPositionAllowance,
    wizOtherAllowance,
    wizOtherAllowanceName,
    wizHasNonCompete,
    wizNonCompetePeriod,
    wizNonCompeteRange,
    wizNonCompeteAmount,
    reset,
  } = useWizaredStore();

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

  const validationResult = analyzeContractContent(
    wizSpecialClause,
    wizSalaryAmount,
    wizSalaryType,
    weeklyHours,
    hasWeeklyRestAllowance
  );

  const handleSend = () => {
    handleSendContract(validationResult);
    reset();
    navigate('/admin/cabinet');
  };

  const instructor = persons.find(p => p.id === wizInstructorId);
  const representativeAcademy = academies?.find(a => a.id === selectedAcademyId) || academies?.[0];

  const activeDays = Object.keys(wizDaysConfig).filter(day => wizDaysConfig[day].enabled);
  const activeDaysCount = activeDays.length || 1;
  const dailyHours = (weeklyHours / activeDaysCount).toFixed(1);

  // 별지 2 임금산정 내역 계산
  const nonTaxTotal = wizNonTaxFood + (wizHasCarAllowance ? wizNonTaxCar : 0);
  const fixedAllowances = wizPositionAllowance + wizOtherAllowance;
  const packageBase = Math.max(0, wizSalaryAmount - nonTaxTotal - fixedAllowances);

  let docBasePay = packageBase;
  let docRestPay = 0;
  if (hasWeeklyRestAllowance) {
    docBasePay = Math.round(packageBase / 1.2);
    docRestPay = packageBase - docBasePay;
  }

  let hourlyBasePay = 0;
  let hourlyRestPay = 0;
  if (wizSalaryType === 'hourly') {
    hourlyBasePay = Math.round(wizSalaryAmount * weeklyHours * 4.345);
    hourlyRestPay = Math.round(
      hasWeeklyRestAllowance ? (weeklyHours / 40) * 8 * wizSalaryAmount * 4.345 : 0
    );
  }

  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="animate-in fade-in w-full space-y-6 duration-200">
      {/* 종이 서류 형태의 계약서 본문 프리뷰 */}
      <div className="max-h-[680px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 font-sans text-xs leading-relaxed text-slate-800 md:p-8">
        <div className="space-y-6">
          {/* 계약 시작 한줄 */}
          <p className="leading-normal font-semibold text-slate-700">
            {representativeAcademy?.name || '학원'}(이하 "갑"이라 한다)과{' '}
            {instructor?.name || '강사'}(이하 "을"이라 한다)는 다음과 같이 근로계약을 체결한다.
          </p>

          {/* 제1조 계약 당사자 */}
          <div className="space-y-2">
            <h3 className="text-[13px] font-extrabold text-slate-900">제1조 (계약 당사자)</h3>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0">
                {/* 갑 (사용자) */}
                <div className="space-y-2 p-4">
                  <div className="mb-2 border-b border-slate-100 pb-1.5 text-[12px] font-extrabold text-slate-900">
                    갑 (사용자)
                  </div>
                  <div className="flex text-[11px]">
                    <span className="w-20 font-medium text-slate-400">상호</span>
                    <span className="font-bold text-slate-800">{representativeAcademy?.name}</span>
                  </div>
                  <div className="flex text-[11px]">
                    <span className="w-20 font-medium text-slate-400">대표자</span>
                    <span className="font-bold text-slate-800">
                      {representativeAcademy?.ownerName}
                    </span>
                  </div>
                  <div className="flex text-[11px]">
                    <span className="w-20 font-medium text-slate-400">등록번호</span>
                    <span className="font-bold text-slate-800">
                      {representativeAcademy?.businessNumber}
                    </span>
                  </div>
                  <div className="flex text-[11px]">
                    <span className="w-20 font-medium text-slate-400">연락처</span>
                    <span className="font-bold text-slate-800">{representativeAcademy?.phone}</span>
                  </div>
                  <div className="flex text-[11px]">
                    <span className="w-20 font-medium text-slate-400">주소</span>
                    <span className="text-slate-850 leading-normal font-bold">
                      {representativeAcademy?.address}
                    </span>
                  </div>
                </div>
                {/* 을 (근로자) */}
                <div className="space-y-2 p-4">
                  <div className="mb-2 border-b border-slate-100 pb-1.5 text-[12px] font-extrabold text-slate-900">
                    을 (근로자)
                  </div>
                  <div className="flex text-[11px]">
                    <span className="w-20 font-medium text-slate-400">성명</span>
                    <span className="font-bold text-slate-800">{instructor?.name || '강사'}</span>
                  </div>
                  <div className="flex text-[11px]">
                    <span className="w-20 font-medium text-slate-400">연락처</span>
                    <span className="font-bold text-slate-800">
                      {instructor?.phone || '미지정'}
                    </span>
                  </div>
                  <div className="flex text-[11px]">
                    <span className="w-20 font-medium text-slate-400">담당과목</span>
                    <span className="font-bold text-slate-800">
                      {instructor?.subject || '미지정'}
                    </span>
                  </div>
                  <div className="flex text-[11px]">
                    <span className="w-20 font-medium text-slate-400">주소</span>
                    <span className="text-slate-850 leading-normal font-bold">
                      {instructor?.address || '미지정'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 제2조 (계약기간) */}
          <div className="space-y-1">
            <h3 className="text-[13px] font-extrabold text-slate-900">제2조 (계약기간)</h3>
            <p className="font-medium text-slate-700">
              ① 본 계약의 기간은 {wizStartDate}부터 {wizEndDate}까지로 한다.
            </p>
            {wizProbation !== '없음' && (
              <p className="font-medium text-slate-700">
                ② 수습기간: 계약개시일로부터 {wizProbation}
              </p>
            )}
          </div>

          {/* 제3조 (업무내용) */}
          <div className="space-y-1">
            <h3 className="text-[13px] font-extrabold text-slate-900">제3조 (업무내용)</h3>
            <p className="font-medium text-slate-700">을의 담당 업무는 다음과 같다.</p>
            <ul className="text-slate-650 list-disc space-y-0.5 pl-4 font-medium">
              <li>담당 과목: {instructor?.subject || '미지정'}</li>
              <li>갑이 지시하는 교육 관련 업무</li>
            </ul>
          </div>

          {/* 제4조 (근로시간) */}
          <div className="space-y-1">
            <h3 className="text-[13px] font-extrabold text-slate-900">제4조 (근로시간)</h3>
            <p className="font-medium text-slate-700">
              ① 소정근로시간 및 휴게시간의 상세 사항은 별지 제1호에 따른다.
            </p>
            <p className="font-medium text-slate-700">
              ② 1주 소정근로시간은 1주 {weeklyHours}시간이며, 1일 소정근로시간은 {dailyHours}
              시간으로 한다.
            </p>
          </div>

          {/* 제5조 (휴게시간) */}
          <div className="space-y-1">
            <h3 className="text-[13px] font-extrabold text-slate-900">제5조 (휴게시간)</h3>
            <p className="font-medium text-slate-700">
              ① 4시간 이상 근로하는 경우 30분 이상, 8시간 이상 근로하는 경우 1시간 이상의 휴게시간을
              부여한다.
            </p>
            <p className="font-medium text-slate-700">
              ② 휴게시간은 근로시간 도중에 자유롭게 이용할 수 있다.
            </p>
          </div>

          {/* 제6조 (임금) */}
          <div className="space-y-2">
            <h3 className="text-[13px] font-extrabold text-slate-900">제6조 (임금)</h3>

            {wizSalaryType === 'fixed' ? (
              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-700">
                <div className="font-extrabold text-indigo-700">📌 합산 실행 방식</div>
                <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                  <div>
                    <span className="block text-[10px] text-slate-400">매출 기준</span>
                    <span className="font-bold text-slate-800">매출 × {wizCommissionPercent}%</span>
                  </div>
                  <div className="self-end text-center font-medium text-slate-400">vs</div>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400">최소 보장</span>
                    <span className="text-slate-850 font-bold">
                      {wizSalaryAmount.toLocaleString()}원
                    </span>
                  </div>
                </div>
                <div className="font-semibold text-slate-500">
                  👉 둘 중 큰 금액을 매월 지급합니다.
                </div>
              </div>
            ) : (
              <p className="font-semibold text-slate-800">
                {wizSalaryType === 'monthly'
                  ? `고정급 (월급제): ${wizSalaryAmount.toLocaleString()}원`
                  : `시급제: ${wizSalaryAmount.toLocaleString()}원`}
              </p>
            )}

            <p className="font-medium text-slate-700">① 급여 지급일: 매월 {wizPayDay}</p>
            <p className="font-medium text-slate-700">
              ② 을이 지정한 금융기관 계좌로 이체하여 지급한다.
            </p>
            <p className="font-medium text-slate-700">
              ③ 상세 항목 및 산정 내역은 별지 제2호에 따른다.
            </p>
            {wizSalaryType === 'fixed' && (
              <p className="text-slate-650 font-medium">
                * 매월 정산 급여가 최소 보장 금액에 미달할 경우, 최소 보장 금액을 지급합니다.
              </p>
            )}
          </div>

          {/* 제7조 (휴일 및 휴가) */}
          <div className="space-y-1">
            <h3 className="text-[13px] font-extrabold text-slate-900">제7조 (휴일 및 휴가)</h3>
            <p className="font-medium text-slate-700">① 주휴일: 매주 일요일</p>
            <p className="font-medium text-slate-700">② 법정공휴일은 무급휴일로 한다.</p>
            <p className="font-medium text-slate-700">
              ③ 연차유급휴가는 근로기준법에 따라 부여한다.
            </p>
            <p className="font-medium text-slate-700">
              ④ 1년간 80% 이상 출근 시 15일의 유급휴가 부여, 1년 미만 근로자는 1개월 개근 시 1일
              부여
            </p>
          </div>

          {/* 제8조 (퇴직급여) */}
          <div className="space-y-1">
            <h3 className="text-[13px] font-extrabold text-slate-900">제8조 (퇴직급여)</h3>
            <p className="font-medium text-slate-700">
              ① 계속근로기간이 1년 이상인 경우, 퇴직일로부터 14일 이내에 퇴직급여를 지급한다.
            </p>
            <p className="font-medium text-slate-700">
              ② 퇴직급여는 근로자퇴직급여보장법에 따라 산정한다.
            </p>
            <p className="font-medium text-slate-700">
              ③ 퇴직급여 = 1일 평균임금 × 30일 × (근속연수)
            </p>
          </div>

          {/* 제9조 비밀유지 */}
          <div className="space-y-1">
            <h3 className="text-[13px] font-extrabold text-slate-900">제9조 (비밀유지)</h3>
            <p className="font-medium text-slate-700">
              ① 을은 재직 중 및 퇴직 후에도 갑의 경영상, 영업상 비밀 및 학생·학부모 정보를
              누설하여서는 아니 된다.
            </p>
            <p className="font-medium text-slate-700">② 비밀의 범위는 다음 각 호와 같다.</p>
            <ul className="text-slate-650 list-disc space-y-0.5 pl-4 font-medium">
              <li>갑의 교육 프로그램, 교재, 교구 등 교육 관련 정보</li>
              <li>학생 및 학부모의 개인정보</li>
              <li>갑의 영업상 비밀 및 고객 정보</li>
              <li>기타 갑이 비밀로 유지할 필요가 있다고 인정하는 정보</li>
            </ul>
          </div>

          {/* 제10조 경업금지 */}
          {wizHasNonCompete && (
            <div className="space-y-1">
              <h3 className="text-[13px] font-extrabold text-slate-900">제10조 (경업금지)</h3>
              <p className="font-medium text-slate-700">
                ① 을은 퇴직 후 {wizNonCompetePeriod}간 {representativeAcademy?.name}으로부터 반경{' '}
                {wizNonCompeteRange} 이내에서 동종 업종에 종사하지 않는다.
              </p>
              <p className="font-medium text-slate-700">
                ② 경업금지의 대가로 갑은 을에게 매월 {wizNonCompeteAmount.toLocaleString()}원을
                지급한다. 이 금액은 본 계약 제6조의 급여와 별도로 지급한다.
              </p>
              <p className="font-medium text-slate-700">
                ③ 을이 본 조를 위반한 경우, 갑에게 발생한 손해를 배상할 책임을 진다.
              </p>
            </div>
          )}

          {/* 제11조 (손해배상) */}
          <div className="space-y-1">
            <h3 className="text-[13px] font-extrabold text-slate-900">제11조 (손해배상)</h3>
            <p className="font-medium text-slate-700">
              ① 당사자 일방이 고의 또는 중대한 과실로 상대방에게 손해를 입힌 경우, 그 손해를 배상할
              책임을 진다.
            </p>
            <p className="font-medium text-slate-700">
              ② 본 계약에 위약금 또는 손해배상액을 예정하는 계약을 하지 아니한다.
            </p>
          </div>

          {/* 제12조 (기타) */}
          <div className="space-y-1">
            <h3 className="text-[13px] font-extrabold text-slate-900">제12조 (기타)</h3>
            <p className="font-medium text-slate-700">
              ① 본 계약서에 명시되지 않은 사항은 근로기준법 및 관계 법령에 따른다.
            </p>
            <p className="font-medium text-slate-700">
              ② 본 계약서는 2부를 작성하여 갑과 을이 각 1부씩 보관한다.
            </p>
          </div>

          {/* 제13조 (관할법원) */}
          <div className="space-y-1">
            <h3 className="text-[13px] font-extrabold text-slate-900">제13조 (관할법원)</h3>
            <p className="font-medium text-slate-700">
              본 계약과 관련하여 분쟁이 발생한 경우, 갑의 주소지 관할법원을 제1심 관할법원으로 한다.
            </p>
          </div>

          {/* 특약사항 */}
          <div className="space-y-1">
            <h3 className="text-[13px] font-extrabold text-slate-900">【특약사항】</h3>
            <p className="text-slate-750 rounded-lg border border-slate-100 bg-slate-50 p-3 leading-relaxed font-medium whitespace-pre-wrap">
              {wizSpecialClause || '없음'}
            </p>
          </div>

          {/* 종명 날인 문구 */}
          <div className="border-t border-slate-100 pt-4 text-center font-semibold text-slate-700">
            위 계약을 증명하기 위하여 본 계약서 2부를 작성하여 갑과 을이 각각 서명 날인 후 1부씩
            보관한다.
            <div className="mt-4 text-[13px] font-extrabold text-slate-800">{formattedDate}</div>
          </div>

          {/* 서명 날인 란 */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/30 p-4">
              <div className="text-[10px] font-extrabold text-slate-400">갑 (사용자)</div>
              <div className="text-[11px] font-bold text-slate-800">
                상호: {representativeAcademy?.name}
              </div>
              <div className="text-[11px] font-bold text-slate-800">
                대표자: {representativeAcademy?.ownerName}
              </div>
              <div className="text-slate-650 text-[11px] leading-normal font-medium">
                주소: {representativeAcademy?.address}
              </div>
              <div className="mt-4 flex justify-end">
                <div className="border-slate-350 flex h-10 w-10 items-center justify-center rounded-full border bg-white text-[11px] font-extrabold text-slate-400">
                  인
                </div>
              </div>
            </div>
            <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/30 p-4">
              <div className="text-[10px] font-extrabold text-slate-400">을 (근로자)</div>
              <div className="text-[11px] font-bold text-slate-800">성명: {instructor?.name}</div>
              <div className="text-slate-650 text-[11px] leading-normal font-medium">
                주소: {instructor?.address || '미지정'}
              </div>
              <div className="mt-4 flex justify-end">
                <div className="border-slate-350 flex h-10 w-10 items-center justify-center rounded-full border bg-white text-[11px] font-extrabold text-slate-400">
                  인
                </div>
              </div>
            </div>
          </div>

          {/* 별지 1 상세 근로시간표 */}
          <div className="border-slate-250 mt-8 space-y-2 border-t border-dashed pt-6">
            <h3 className="text-[13px] font-extrabold text-slate-900">
              【 별지 1 】 상세 근로시간표
            </h3>
            <table className="w-full divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 text-[11px] text-slate-700">
              <thead className="bg-slate-50">
                <tr className="divide-x divide-slate-200">
                  <th className="w-24 p-2 text-left font-extrabold">요일</th>
                  <th className="p-2 text-left font-extrabold">근무시간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.keys(wizDaysConfig)
                  .filter(day => wizDaysConfig[day].enabled)
                  .map(day => (
                    <tr key={day} className="divide-x divide-slate-200">
                      <td className="p-2 font-bold">{day}</td>
                      <td className="p-2 font-medium">
                        {wizDaysConfig[day].startTime} ~ {wizDaysConfig[day].endTime} (휴게{' '}
                        {wizDaysConfig[day].breakTime})
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* 별지 2 상세 임금산정 내역 */}
          <div className="mt-6 space-y-2">
            <h3 className="text-[13px] font-extrabold text-slate-900">
              【 별지 2 】 상세 임금산정 내역
            </h3>
            <table className="w-full divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 text-[11px] text-slate-700">
              <thead className="bg-slate-50">
                <tr className="divide-x divide-slate-200">
                  <th className="p-2 text-left font-extrabold">항목</th>
                  <th className="w-36 p-2 text-right font-extrabold">금액</th>
                  <th className="p-2 text-left font-extrabold">비고</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {wizSalaryType === 'hourly' ? (
                  <>
                    <tr className="divide-x divide-slate-200">
                      <td className="p-2 font-bold">기본 시급</td>
                      <td className="p-2 text-right font-medium">
                        {wizSalaryAmount.toLocaleString()}원
                      </td>
                      <td className="p-2 text-slate-400">1시간 실 근로에 대한 고정 급여</td>
                    </tr>
                    <tr className="divide-x divide-slate-200">
                      <td className="p-2 font-bold">기본급 (월 환산)</td>
                      <td className="p-2 text-right font-medium">
                        {hourlyBasePay.toLocaleString()}원
                      </td>
                      <td className="p-2 text-slate-400">월 평균 근로시간 소정급여</td>
                    </tr>
                    {hourlyRestPay > 0 && (
                      <tr className="divide-x divide-slate-200">
                        <td className="p-2 font-bold">주휴수당 (월 환산)</td>
                        <td className="p-2 text-right font-medium">
                          {hourlyRestPay.toLocaleString()}원
                        </td>
                        <td className="p-2 text-slate-400">
                          주 소정근로 15시간 이상 의무 발생 상당액
                        </td>
                      </tr>
                    )}
                    <tr className="divide-x divide-slate-200 bg-slate-50/50">
                      <td className="p-2 font-extrabold text-slate-900">월 예상 합계 (세전)</td>
                      <td className="p-2 text-right font-extrabold text-indigo-700">
                        {(hourlyBasePay + hourlyRestPay).toLocaleString()}원
                      </td>
                      <td className="p-2 font-semibold text-indigo-700">
                        기본급과 주휴수당의 합산액 (월 근로일 기준)
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="divide-x divide-slate-200">
                      <td className="p-2 font-bold">기본급</td>
                      <td className="p-2 text-right font-medium">
                        {docBasePay.toLocaleString()}원
                      </td>
                      <td className="p-2 text-slate-400">기본 소정근로 시간 분</td>
                    </tr>
                    {docRestPay > 0 && (
                      <tr className="divide-x divide-slate-200">
                        <td className="p-2 font-bold">주휴수당</td>
                        <td className="p-2 text-right font-medium">
                          {docRestPay.toLocaleString()}원
                        </td>
                        <td className="p-2 text-slate-400">주 소정근로에 비례 산정</td>
                      </tr>
                    )}
                    {wizNonTaxFood > 0 && (
                      <tr className="divide-x divide-slate-200">
                        <td className="p-2 font-bold">비과세 식대</td>
                        <td className="p-2 text-right font-medium">
                          {wizNonTaxFood.toLocaleString()}원
                        </td>
                        <td className="p-2 font-semibold text-emerald-600">비과세</td>
                      </tr>
                    )}
                    {wizHasCarAllowance && wizNonTaxCar > 0 && (
                      <tr className="divide-x divide-slate-200">
                        <td className="p-2 font-bold">자가운전보조금</td>
                        <td className="p-2 text-right font-medium">
                          {wizNonTaxCar.toLocaleString()}원
                        </td>
                        <td className="p-2 font-semibold text-emerald-600">비과세</td>
                      </tr>
                    )}
                    {wizPositionAllowance > 0 && (
                      <tr className="divide-x divide-slate-200">
                        <td className="p-2 font-bold">직책수당</td>
                        <td className="p-2 text-right font-medium">
                          {wizPositionAllowance.toLocaleString()}원
                        </td>
                        <td className="p-2 text-slate-400">과목 팀장/파트장 수당</td>
                      </tr>
                    )}
                    {wizOtherAllowance > 0 && (
                      <tr className="divide-x divide-slate-200">
                        <td className="p-2 font-bold">{wizOtherAllowanceName || '기타 수당'}</td>
                        <td className="p-2 text-right font-medium">
                          {wizOtherAllowance.toLocaleString()}원
                        </td>
                        <td className="p-2 text-slate-400">기타 고정 수당</td>
                      </tr>
                    )}
                    <tr className="divide-x divide-slate-200 bg-slate-50/50">
                      <td className="p-2 font-extrabold text-slate-900">합계 (세전)</td>
                      <td className="p-2 text-right font-extrabold text-indigo-700">
                        {wizSalaryAmount.toLocaleString()}원
                      </td>
                      <td className="p-2 font-semibold text-indigo-700">
                        {wizSalaryType === 'fixed' ? '인센티브 최소보장 금액' : '고정 월 지급액'}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-between border-t border-slate-100 pt-5">
        <button
          onClick={() => setWizardStep(3)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>이전</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleSend}
            className="flex cursor-pointer items-center space-x-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-black text-white transition-all duration-200 hover:bg-indigo-700"
          >
            <Send className="h-4 w-4" />
            <span>계약서 작성 완료</span>
          </button>
        </div>
      </div>
    </div>
  );
}
