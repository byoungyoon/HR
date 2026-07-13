import { Contract, EventLog, EventType, Person, SalaryType, Academy } from './types';

// 간단한 FNV-1a 해시 또는 DJB2 해시를 헥사 스트링으로 변환하는 문자열 해시 함수
export function sha256Simulate(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  const result = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256_${result}_${Date.now().toString(36)}`;
}

// 2026년 최저시급 정보
export const MINIMUM_WAGE_2026 = 10320;

// 인사이트 강사 리스트 모의 데이터 (SSOT 마스터 데이터 연동 시뮬레이션용)
export const INSIGHT_INSTRUCTORS: Person[] = [
  {
    id: 'CI_92817291',
    name: '김태희',
    phone: '010-4829-1928',
    email: 'taehee@gmail.com',
    role: 'instructor',
    status: 'candidate',
  },
  {
    id: 'CI_10283719',
    name: '박서준',
    phone: '010-8273-0192',
    email: 'seojun@gmail.com',
    role: 'instructor',
    status: 'accepted',
  },
  {
    id: 'CI_83921029',
    name: '이지은',
    phone: '010-1234-5678',
    email: 'jieun@gmail.com',
    role: 'instructor',
    status: 'employed',
    joinedDate: '2025-03-01',
  },
  {
    id: 'CI_58291028',
    name: '이민호',
    phone: '010-9876-5432',
    email: 'minho@gmail.com',
    role: 'instructor',
    status: 'resigned',
    joinedDate: '2024-01-15',
  },
];

// 초기 계약서 목록 데이터
export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'DOC_1001',
    type: 'contract',
    title: '이지은 강사 표준 근로계약서',
    version: 1,
    status: 'completed',
    personId: 'CI_83921029',
    createdAt: '2025-02-28T14:30:00Z',
    hash: 'sha256_3b1b9e82c5a6109f',
    contractType: '강사근로계약서',
    salaryType: 'hourly',
    salaryAmount: 12000,
    weeklyHours: 18,
    hasWeeklyRestAllowance: true,
    contractStart: '2025-03-01',
    contractEnd: '2026-02-28',
    riskStatus: 'safe',
    riskLog: [
      '[검증 완료] 2026년 최저시급(10,030원) 이상을 준수합니다.',
      '[검증 완료] 주 15시간 이상 근무에 따른 주휴수당이 정상 반영되었습니다.',
    ],
    toxicClauses: [],
  },
  {
    id: 'DOC_1002',
    type: 'contract',
    title: '박서준 강사 임용 근로계약서',
    version: 1,
    status: 'pending_signature',
    personId: 'CI_10283719',
    createdAt: '2026-07-08T10:15:00Z',
    hash: 'sha256_f8291a8c0d9e2b14',
    contractType: '강사근로계약서',
    salaryType: 'hourly',
    salaryAmount: 10500,
    weeklyHours: 20,
    hasWeeklyRestAllowance: false, // 주휴수당 미지급으로 리스크 발생 시뮬레이션
    contractStart: '2026-07-15',
    contractEnd: '2027-07-14',
    riskStatus: 'warning',
    riskLog: [
      '[주의] 주 15시간 이상 근무하나 주휴수당 미지급 조건으로 설정되어 노동법적 위반 소지가 있습니다.',
    ],
    toxicClauses: [
      {
        originalText: '지각 또는 결석 시 당월 급여의 20%를 감봉 처리한다.',
        detectedRisk:
          '근로기준법 제95조(감급의 제한) 위반 소지가 높습니다. 1회 지각 금액에 대해 하루 평균임금의 반액, 총액은 월급의 10%를 초과할 수 없습니다.',
        alternativeText: '지각 또는 결석 시 해당 시간만큼 시급에서 공제(일할 계산)하여 지급한다.',
        isApplied: false,
      },
    ],
  },
];

// 초기 감사 로그
export const INITIAL_EVENT_LOGS: EventLog[] = [
  {
    id: 'EV_001',
    eventType: 'PERSON_CREATED',
    actor: '원장 (이은재)',
    actorId: 'USER_ADMIN',
    targetId: 'CI_83921029',
    timestamp: '2025-02-28T14:10:00Z',
    details: '인사이트 동기화를 통해 강사 이지은(CI_83921029) 마스터 데이터를 생성하였습니다.',
    prevHash: '00000000000000000000000000000000',
    hash: 'sha256_init_01',
  },
  {
    id: 'EV_002',
    eventType: 'CONTRACT_DRAFTED',
    actor: '원장 (이은재)',
    actorId: 'USER_ADMIN',
    targetId: 'DOC_1001',
    timestamp: '2025-02-28T14:20:00Z',
    details: '이지은 강사 표준 근로계약서 초안을 작성하였습니다. (시급: 12,000원, 주: 18시간)',
    prevHash: 'sha256_init_01',
    hash: 'sha256_init_02',
  },
  {
    id: 'EV_003',
    eventType: 'CONTRACT_SENT',
    actor: '원장 (이은재)',
    actorId: 'USER_ADMIN',
    targetId: 'DOC_1001',
    timestamp: '2025-02-28T14:22:00Z',
    details: '카카오 알림톡을 통해 이지은 강사에게 서명 링크를 전송하였습니다.',
    prevHash: 'sha256_init_02',
    hash: 'sha256_init_03',
  },
  {
    id: 'EV_004',
    eventType: 'IDENTITY_VERIFIED',
    actor: '강사 (이지은)',
    actorId: 'CI_83921029',
    targetId: 'DOC_1001',
    timestamp: '2025-02-28T14:28:00Z',
    details:
      '휴대폰 본인확인을 통해 이지은의 신원을 검증하였습니다. (CI 발급 완료, 거래번호: TX_9817291)',
    prevHash: 'sha256_init_03',
    hash: 'sha256_init_04',
  },
  {
    id: 'EV_005',
    eventType: 'SIGNED',
    actor: '강사 (이지은)',
    actorId: 'CI_83921029',
    targetId: 'DOC_1001',
    timestamp: '2025-02-28T14:30:00Z',
    details:
      '이지은 강사가 전자서명을 완료하였습니다. (IP: 211.234.12.98, 브라우저: Safari Mobile)',
    prevHash: 'sha256_init_04',
    hash: 'sha256_init_05',
  },
  {
    id: 'EV_006',
    eventType: 'CONTRACT_COMPLETED',
    actor: '시스템',
    actorId: 'SYSTEM',
    targetId: 'DOC_1001',
    timestamp: '2025-02-28T14:30:05Z',
    details: '계약이 체결 완료되어 PDF로 봉인 보관되었습니다. 무결성 해시 체인 검증 통과.',
    prevHash: 'sha256_init_05',
    hash: 'sha256_init_06',
  },
];

// 법적 계약 조항 리스크 검사 및 독소 조항 분석
export function analyzeContractContent(
  text: string,
  salaryAmount: number,
  salaryType: SalaryType,
  weeklyHours: number,
  hasWeeklyRestAllowance: boolean
): {
  riskStatus: 'safe' | 'warning' | 'danger';
  riskLog: string[];
  detectedToxicClauses: {
    originalText: string;
    detectedRisk: string;
    alternativeText: string;
    isApplied: boolean;
  }[];
} {
  const riskLog: string[] = [];
  let riskStatus: 'safe' | 'warning' | 'danger' = 'safe';

  // 1. 최저임금 검증 (2026년 기준 10,030원)
  if (salaryType === 'hourly') {
    if (salaryAmount < MINIMUM_WAGE_2026) {
      riskStatus = 'danger';
      riskLog.push(
        `[위반] 시급이 2026년 최저임금인 ${MINIMUM_WAGE_2026.toLocaleString()}원보다 낮은 ${salaryAmount.toLocaleString()}원입니다.`
      );
    } else {
      riskLog.push(
        `[준수] 2026년 최저시급(${MINIMUM_WAGE_2026.toLocaleString()}원) 이상을 만족합니다.`
      );
    }
  } else if (salaryType === 'monthly') {
    // 월급제일 때, 주 소정근로시간 주 40시간(월 209시간) 기준으로 대략 비례 계산
    const monthlyMinWage = MINIMUM_WAGE_2026 * 209; // 대략 2,096,270원
    if (salaryAmount < monthlyMinWage && weeklyHours >= 40) {
      riskStatus = 'danger';
      riskLog.push(
        `[위반] 월급액이 주 40시간 기준 최저임금액(${Math.round(monthlyMinWage).toLocaleString()}원)에 미달합니다.`
      );
    }
  }

  // 2. 주휴수당 검증 (소정근로시간이 주 15시간 이상일 때 주휴수당 미지급 경고)
  if (weeklyHours >= 15 && !hasWeeklyRestAllowance) {
    if (riskStatus !== 'danger') riskStatus = 'warning';
    riskLog.push(
      `[주의] 소정 근로시간이 주 ${weeklyHours}시간(15시간 이상)이므로 법정 주휴수당 지급 대상이나, '주휴수당 제외' 조건으로 명시되었습니다. 근로기준법상 무효 조항으로 판정될 위험이 있습니다.`
    );
  } else if (weeklyHours >= 15 && hasWeeklyRestAllowance) {
    riskLog.push(`[준수] 주 15시간 이상 조건에 필수적인 주휴수당 지급 규정이 포함되었습니다.`);
  }

  // 3. 독소 조항 키워드 탐지
  const toxicRules = [
    {
      keywords: ['감봉', '삭감', '지각', '결석', '벌금'],
      originalText: '지각이나 결석 시 급여의 일부를 강제 삭감하거나 벌금 처리한다.',
      detectedRisk:
        '근로기준법 제95조(감급의 제한) 위반 소지가 높습니다. 징계 성격의 급여 삭감은 1회당 평균임금의 반액, 총액은 월급의 10%를 초과할 수 없습니다.',
      alternativeText:
        '지각 또는 결석 시 해당 시간만큼 실 근로시간에서 제외(무노동 무임금 원칙)하여 급여를 차감 지급한다.',
    },
    {
      keywords: ['퇴사', '지급하지 않는다', '급여 미지급', '포기'],
      originalText: '근무 도중 중도 퇴사할 경우, 당월 급여를 청구할 수 없으며 포기하기로 합의한다.',
      detectedRisk:
        '근로기준법 제43조(임금 지급) 위반입니다. 일한 기간만큼의 급여는 반드시 전액 지급되어야 하며 중도 퇴사하더라도 미지급 특약은 법적 효력이 없습니다.',
      alternativeText:
        '근무 도중 중도 퇴사 시, 퇴사 전일까지의 실제 근무 일수에 대하여 일할 계산하여 급여를 지급한다.',
    },
    {
      keywords: ['준비', '무급', '회의', '대기'],
      originalText:
        '수업 전 준비 시간 및 학원 정기 회의 시간은 별도의 근로시간으로 치지 않으며 무급으로 정한다.',
      detectedRisk:
        '근로시간 위반 우려가 있습니다. 사용자의 지휘·감독 하에 있는 준비 시간 및 회의 참석 시간은 법정 근로시간에 포함되어 수당이 발생해야 합니다.',
      alternativeText:
        '수업 외 준비시간 및 공식 회의 시간 또한 소정 근로시간에 포함시키거나, 별도의 시간당 수당을 책정하여 정상 지급한다.',
    },
    {
      keywords: ['금지', '동종 업계', '창업', '경쟁'],
      originalText:
        '퇴사 후 2년간 반경 10km 이내 동종 업계 학원에 일체 근무할 수 없으며, 이를 어길 시 위약금을 지불한다.',
      detectedRisk:
        '헌법상 직업선택의 자유를 지나치게 제한하는 경업금지 약정으로, 법원에서 효력이 부정되거나 범위가 감축될 가능성이 매우 높고 위약금 예정 금지(근로기준법 제20조)에 반할 수 있습니다.',
      alternativeText:
        '퇴사 후 학원의 영업비밀 및 고유 교수안을 누출하지 않으며, 기존 원생의 비정상적 이탈 유도를 금지하는 서약으로 대체한다.',
    },
  ];

  const detectedToxicClauses: {
    originalText: string;
    detectedRisk: string;
    alternativeText: string;
    isApplied: boolean;
  }[] = [];

  // 텍스트 분석 또는 설정에 따른 매칭
  toxicRules.forEach(rule => {
    const hasKeyword = rule.keywords.some(keyword => text.includes(keyword));
    if (hasKeyword) {
      if (riskStatus !== 'danger') riskStatus = 'warning';
      detectedToxicClauses.push({
        originalText: rule.originalText,
        detectedRisk: rule.detectedRisk,
        alternativeText: rule.alternativeText,
        isApplied: false,
      });
    }
  });

  return {
    riskStatus,
    riskLog,
    detectedToxicClauses,
  };
}

// --- 숫자를 한글 금액 읽기로 변환하는 함수 ---
export const numberToKorean = (num: number): string => {
  if (num === 0) return '영';
  const units = ['', '십', '백', '천'];
  const gUnits = ['', '만', '억', '조'];
  const digits = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  let result = '';
  let temp = num;
  let gIndex = 0;

  while (temp > 0) {
    const chunk = temp % 10000;
    if (chunk > 0) {
      let chunkStr = '';
      let chunkTemp = chunk;
      for (let i = 0; i < 4; i++) {
        const digit = chunkTemp % 10;
        if (digit > 0) {
          const digitName = digit === 1 && i > 0 ? '' : digits[digit];
          chunkStr = digitName + units[i] + chunkStr;
        }
        chunkTemp = Math.floor(chunkTemp / 10);
      }
      result = chunkStr + gUnits[gIndex] + result;
    }
    temp = Math.floor(temp / 10);
    gIndex++;
  }
  return result;
};

// --- 학원 정보 생성형 직인(인장) SVG 제너레이터 ---
export const generateStampSvg = (name: string, isSquare = false): string => {
  let textRows: string[] = [];
  const cleanName = name.replace(/\s/g, '');

  if (cleanName.length <= 2) {
    textRows = [cleanName, '의인'];
  } else if (cleanName.length === 3) {
    textRows = [cleanName.substring(0, 2), cleanName.substring(2) + '인'];
  } else if (cleanName.length === 4) {
    textRows = [cleanName.substring(0, 2), cleanName.substring(2, 4)];
  } else {
    textRows = [cleanName.substring(0, 3), cleanName.substring(3, Math.min(6, cleanName.length))];
  }

  const stampColor = '#dc2626'; // 전통 붉은색 인장 컬러

  let svgContent = '';
  if (isSquare) {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect x="8" y="8" width="84" height="84" fill="none" stroke="${stampColor}" stroke-width="7" rx="3"/>
        <text x="50" y="44" font-family="'Batang', 'Gungsuh', 'serif', 'Noto Serif KR'" font-size="28" font-weight="900" fill="${stampColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">
          ${textRows[0]}
        </text>
        <text x="50" y="74" font-family="'Batang', 'Gungsuh', 'serif', 'Noto Serif KR'" font-size="28" font-weight="900" fill="${stampColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">
          ${textRows[1] || ''}
        </text>
      </svg>
    `;
  } else {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="${stampColor}" stroke-width="6"/>
        <text x="50" y="44" font-family="'Batang', 'Gungsuh', 'serif', 'Noto Serif KR'" font-size="26" font-weight="900" fill="${stampColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">
          ${textRows[0]}
        </text>
        <text x="50" y="74" font-family="'Batang', 'Gungsuh', 'serif', 'Noto Serif KR'" font-size="26" font-weight="900" fill="${stampColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">
          ${textRows[1] || ''}
        </text>
      </svg>
    `;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

// --- 초기 기본 학원 정보 (사용자 프리셋) ---
export const INITIAL_ACADEMIES: Academy[] = [
  {
    id: 'AC_1',
    name: '대치 학온 본원',
    address: '서울특별시 강남구 대치동 학온 본사 3층',
    ownerName: '김학온',
    phone: '02-555-1234',
    businessNumber: '120-12-34567',
    stampImage: generateStampSvg('대치학온'),
  },
  {
    id: 'AC_2',
    name: '목동 학온 캠퍼스',
    address: '서울특별시 양천구 목동서로 201 학온빌딩 5층',
    ownerName: '이학온',
    phone: '02-2644-5678',
    businessNumber: '105-13-98765',
    stampImage: generateStampSvg('목동학온', true),
  },
];
