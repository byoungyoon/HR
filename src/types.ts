export type PersonStatus = 'candidate' | 'interview' | 'accepted' | 'employed' | 'resigned';
export type PersonRole = 'instructor' | 'staff';

export interface Person {
  id: string; // CI (식별키)
  name: string;
  phone: string;
  email?: string;
  role: PersonRole;
  status: PersonStatus;
  joinedDate?: string;
  subject?: string;
  address?: string;
  birthDate?: string;
}

export type DocumentType = 'contract' | 'consent' | 'work_rule' | 'cert';
export type DocumentStatus = 'draft' | 'pending_signature' | 'completed' | 'expired';

export interface Document {
  id: string;
  type: DocumentType;
  title: string;
  version: number;
  status: DocumentStatus;
  personId: string;
  createdAt: string;
  hash: string;
}

export type ContractType = '강사근로계약서' | '강사위촉계약서';

export type SalaryType = 'hourly' | 'monthly' | 'fixed';

export interface Contract extends Document {
  contractType: ContractType;
  salaryType: SalaryType;
  salaryAmount: number;
  weeklyHours: number;
  hasWeeklyRestAllowance: boolean; // 주휴수당 포함 여부
  contractStart: string;
  contractEnd: string;
  riskStatus: 'safe' | 'warning' | 'danger';
  riskLog: string[];
  toxicClauses: {
    originalText: string;
    detectedRisk: string;
    alternativeText: string;
    isApplied: boolean;
  }[];
  academyId?: string; // 학원 정보 식별 ID
  contractText?: string;
}

export interface SignatureLog {
  id: string;
  documentId: string;
  signerName: string;
  signerId: string; // Person.id (CI)
  signatureData?: string; // Base64 signature path
  verifiedPhone: string;
  verifiedCi: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  documentHash: string;
}

export type EventType =
  | 'PERSON_CREATED'
  | 'CONTRACT_DRAFTED'
  | 'CONTRACT_SENT'
  | 'IDENTITY_VERIFIED'
  | 'SIGNED'
  | 'CONTRACT_COMPLETED'
  | 'DOCUMENT_VIEWED'
  | 'RISK_DETECTED';

export interface EventLog {
  id: string;
  eventType: EventType;
  actor: string;
  actorId: string;
  targetId: string;
  timestamp: string;
  details: string;
  prevHash: string;
  hash: string;
}

export interface Academy {
  id: string;
  name: string;
  address: string;
  ownerName: string;
  phone: string;
  businessNumber: string;
  stampImage?: string; // Base64 or preset image path
}
