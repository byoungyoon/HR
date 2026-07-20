import React from 'react';
import { create } from 'zustand';
import {
  Person,
  Contract,
  EventLog,
  SignatureLog,
  Academy,
  ContractType,
  SalaryType,
  EventType,
} from '../types';
import {
  INSIGHT_INSTRUCTORS,
  INITIAL_CONTRACTS,
  INITIAL_EVENT_LOGS,
  INITIAL_ACADEMIES,
  sha256Simulate,
  analyzeContractContent,
  generateStampSvg,
} from '../utils';

interface AppState {
  // state global/persons: Person[]
  persons: Person[];
  // state global/contracts: Contract[]
  contracts: Contract[];
  // state global/eventLogs: EventLog[]
  eventLogs: EventLog[];
  // state global/signatureLogs: SignatureLog[]
  signatureLogs: SignatureLog[];
  // state global/academies: Academy[]
  academies: Academy[];
  // state global/selectedAcademyId: string
  selectedAcademyId: string;
  // state global/currentRole: 'admin' | 'instructor'
  currentRole: 'admin' | 'instructor';
  // state global/selectedInstructorId: string
  selectedInstructorId: string;
  // state global/selectedContractId: string | null
  selectedContractId: string | null;
  // state global/toast: Toast | null
  toast: { text: string; type: 'success' | 'info' | 'warning' } | null;
  // state global/fontSize: number
  fontSize: number;

  // state contract/wizardStep: number
  wizardStep: number;
  // state contract/wizSubStep: 1 | 2 | 3
  wizSubStep: 1 | 2 | 3;
  // state contract/maxUnlockedSubStep: 1 | 2 | 3
  maxUnlockedSubStep: 1 | 2 | 3;
  // state contract/wizInstructorId: string
  wizInstructorId: string;
  wizInstructorName: string;
  wizInstructorSubject: string;
  wizInstructorAddress: string;
  wizInstructorPhone: string;
  wizInstructorBirthDate: string;
  // state contract/wizContractType: ContractType
  wizContractType: ContractType;
  // state contract/wizStartDate: string
  wizStartDate: string;
  // state contract/wizPeriodYear: number
  wizPeriodYear: number;
  // state contract/wizEndDate: string
  wizEndDate: string;
  // state contract/wizProbation: string
  wizProbation: string;
  // state contract/wizWorkDaysType: '5days' | '3days' | 'custom'
  wizWorkDaysType: '5days' | '3days' | 'custom';
  // state contract/wizDaysConfig: object
  wizDaysConfig: {
    [key: string]: {
      enabled: boolean;
      startTime: string;
      endTime: string;
      breakTime: string;
    };
  };
  // state contract/selectedBatchDays: string[]
  selectedBatchDays: string[];
  // state contract/batchStartTime: string
  batchStartTime: string;
  // state contract/batchEndTime: string
  batchEndTime: string;
  // state contract/batchBreakTime: string
  batchBreakTime: string;
  // state contract/editingDay: string | null
  editingDay: string | null;
  // state contract/showChangePulse: boolean
  showChangePulse: boolean;
  // state contract/wizSalaryType: SalaryType
  wizSalaryType: SalaryType;
  // state contract/wizSalaryAmount: number
  wizSalaryAmount: number;
  // state contract/wizNonTaxFood: number
  wizNonTaxFood: number;
  // state contract/wizHasCarAllowance: boolean
  wizHasCarAllowance: boolean;
  // state contract/wizNonTaxCar: number
  wizNonTaxCar: number;
  // state contract/wizPayDay: string
  wizPayDay: string;
  // state contract/wizOvertimeAllowance: number
  wizOvertimeAllowance: number;
  // state contract/wizPositionAllowance: number
  wizPositionAllowance: number;
  // state contract/wizOtherAllowance: number
  wizOtherAllowance: number;
  wizOtherAllowanceName: string;
  // state contract/wizHasNonCompete: boolean
  wizHasNonCompete: boolean;
  // state contract/wizNonCompetePeriod: string
  wizNonCompetePeriod: string;
  // state contract/wizNonCompeteRange: string
  wizNonCompeteRange: string;
  // state contract/wizNonCompeteAmount: number
  wizNonCompeteAmount: number;
  // state contract/wizSpecialClause: string
  wizSpecialClause: string;
  // state contract/wizContractText: string
  wizContractText: string;
  // state contract/wizCommissionPercent: number
  wizCommissionPercent: number;

  // state instructor/selectedMyPageContractId: string | null
  selectedMyPageContractId: string | null;
  // state instructor/signingStep: 'select' | 'read' | 'verify' | 'sign' | 'complete'
  signingStep: 'select' | 'read' | 'verify' | 'sign' | 'complete';
  // state instructor/signConsentChecked: boolean
  signConsentChecked: boolean;
  // state instructor/authPhone: string
  authPhone: string;
  // state instructor/authCode: string
  authCode: string;
  // state instructor/isAuthSent: boolean
  isAuthSent: boolean;
  // state instructor/isAuthVerified: boolean
  isAuthVerified: boolean;
  // state instructor/hasSignature: boolean
  hasSignature: boolean;

  // state newInstructor/newInstName: string
  newInstName: string;
  // state newInstructor/newInstPhone: string
  newInstPhone: string;
  // state newInstructor/newInstEmail: string
  newInstEmail: string;

  // actions
  setPersons: (persons: Person[] | ((prev: Person[]) => Person[])) => void;
  setContracts: (contracts: Contract[] | ((prev: Contract[]) => Contract[])) => void;
  setEventLogs: (eventLogs: EventLog[] | ((prev: EventLog[]) => EventLog[])) => void;
  setSignatureLogs: (
    signatureLogs: SignatureLog[] | ((prev: SignatureLog[]) => SignatureLog[])
  ) => void;
  setAcademies: (academies: Academy[] | ((prev: Academy[]) => Academy[])) => void;
  setSelectedAcademyId: (id: string) => void;
  setCurrentRole: (role: 'admin' | 'instructor') => void;
  setSelectedInstructorId: (id: string) => void;
  setSelectedContractId: (id: string | null) => void;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  addEventLog: (
    eventType: EventType,
    actor: string,
    actorId: string,
    targetId: string,
    details: string
  ) => void;

  setWizardStep: (step: number) => void;
  setWizSubStep: (subStep: 1 | 2 | 3) => void;
  setMaxUnlockedSubStep: (subStep: 1 | 2 | 3) => void;
  setWizInstructorId: (id: string) => void;
  setWizInstructorName: (name: string) => void;
  setWizInstructorSubject: (subject: string) => void;
  setWizInstructorAddress: (address: string) => void;
  setWizInstructorPhone: (phone: string) => void;
  setWizInstructorBirthDate: (birthDate: string) => void;
  setWizContractType: (type: ContractType) => void;
  setWizStartDate: (date: string) => void;
  setWizPeriodYear: (year: number) => void;
  setWizEndDate: (date: string) => void;
  setWizProbation: (probation: string) => void;
  setWizWorkDaysType: (type: '5days' | '3days' | 'custom') => void;
  setWizDaysConfig: (
    config:
      AppState['wizDaysConfig'] | ((prev: AppState['wizDaysConfig']) => AppState['wizDaysConfig'])
  ) => void;
  setSelectedBatchDays: (days: string[]) => void;
  setBatchStartTime: (time: string) => void;
  setBatchEndTime: (time: string) => void;
  setBatchBreakTime: (time: string) => void;
  setEditingDay: (day: string | null) => void;
  setShowChangePulse: (show: boolean) => void;
  setWizSalaryType: (type: SalaryType) => void;
  setWizSalaryAmount: (amount: number) => void;
  setWizNonTaxFood: (amount: number) => void;
  setWizHasCarAllowance: (has: boolean) => void;
  setWizNonTaxCar: (amount: number) => void;
  setWizPayDay: (day: string) => void;
  setWizOvertimeAllowance: (amount: number) => void;
  setWizPositionAllowance: (amount: number) => void;
  setWizOtherAllowance: (amount: number) => void;
  setWizOtherAllowanceName: (name: string) => void;
  setWizHasNonCompete: (has: boolean) => void;
  setWizNonCompetePeriod: (period: string) => void;
  setWizNonCompeteRange: (range: string) => void;
  setWizNonCompeteAmount: (amount: number) => void;
  setWizSpecialClause: (clause: string) => void;
  setWizContractText: (text: string) => void;
  setWizCommissionPercent: (percent: number) => void;

  applyQuickSchedule: (type: '5days' | '3days' | 'custom') => void;
  applyAlternative: (index: number, validationResult: any) => void;
  handleSendContract: (validationResult: any) => void;

  setSelectedMyPageContractId: (id: string | null) => void;
  setSigningStep: (step: AppState['signingStep']) => void;
  setSignConsentChecked: (checked: boolean) => void;
  setAuthPhone: (phone: string) => void;
  setAuthCode: (code: string) => void;
  setIsAuthSent: (sent: boolean) => void;
  setIsAuthVerified: (verified: boolean) => void;
  setHasSignature: (has: boolean) => void;

  handleSendSMS: () => void;
  handleVerifySMS: () => void;
  handleCompleteSignature: (signatureData: string | undefined) => void;

  setNewInstName: (name: string) => void;
  setNewInstPhone: (phone: string) => void;
  setNewInstEmail: (email: string) => void;
  handleImportInstructor: (e: React.FormEvent) => void;
  setFontSize: (size: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // state global/persons: Person[]
  persons: INSIGHT_INSTRUCTORS,
  // state global/contracts: Contract[]
  contracts: INITIAL_CONTRACTS,
  // state global/eventLogs: EventLog[]
  eventLogs: INITIAL_EVENT_LOGS,
  // state global/signatureLogs: SignatureLog[]
  signatureLogs: [],
  // state global/academies: Academy[]
  academies: (() => {
    const saved = localStorage.getItem('hakon_academies');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ACADEMIES;
  })(),
  // state global/selectedAcademyId: string
  selectedAcademyId: (() => {
    const saved = localStorage.getItem('hakon_selected_academy_id');
    return saved || (INITIAL_ACADEMIES[0] ? INITIAL_ACADEMIES[0].id : 'AC_1');
  })(),
  // state global/currentRole: 'admin' | 'instructor'
  currentRole: 'admin',
  // state global/selectedInstructorId: string
  selectedInstructorId: 'CI_10283719',
  // state global/selectedContractId: string | null
  selectedContractId: null,
  // state global/toast: Toast | null
  toast: null,

  // state contract/wizardStep: number
  wizardStep: 1,
  // state contract/wizSubStep: 1 | 2 | 3
  wizSubStep: 1,
  // state contract/maxUnlockedSubStep: 1 | 2 | 3
  maxUnlockedSubStep: 1,
  // state contract/wizInstructorId: string
  wizInstructorId: 'CI_10283719',
  wizInstructorName: '',
  wizInstructorSubject: '',
  wizInstructorAddress: '',
  wizInstructorPhone: '',
  wizInstructorBirthDate: '',
  // state contract/wizContractType: ContractType
  wizContractType: '강사근로계약서',
  wizStartDate: (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })(),
  wizPeriodYear: 1,
  wizEndDate: (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    d.setDate(d.getDate() - 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })(),
  // state contract/wizProbation: string
  wizProbation: '3개월',
  // state contract/wizWorkDaysType: '5days' | '3days' | 'custom'
  wizWorkDaysType: '5days',
  // state contract/wizDaysConfig: object
  wizDaysConfig: {
    월요일: {
      enabled: true,
      startTime: '14:00',
      endTime: '22:00',
      breakTime: '1시간',
    },
    화요일: {
      enabled: true,
      startTime: '14:00',
      endTime: '22:00',
      breakTime: '1시간',
    },
    수요일: {
      enabled: true,
      startTime: '14:00',
      endTime: '22:00',
      breakTime: '1시간',
    },
    목요일: {
      enabled: true,
      startTime: '14:00',
      endTime: '22:00',
      breakTime: '1시간',
    },
    금요일: {
      enabled: true,
      startTime: '14:00',
      endTime: '22:00',
      breakTime: '1시간',
    },
    토요일: {
      enabled: false,
      startTime: '09:00',
      endTime: '18:00',
      breakTime: '1시간',
    },
    일요일: {
      enabled: false,
      startTime: '09:00',
      endTime: '18:00',
      breakTime: '1시간',
    },
  },
  // state contract/selectedBatchDays: string[]
  selectedBatchDays: ['월요일', '화요일', '수요일', '목요일', '금요일'],
  // state contract/batchStartTime: string
  batchStartTime: '14:00',
  // state contract/batchEndTime: string
  batchEndTime: '22:00',
  // state contract/batchBreakTime: string
  batchBreakTime: '1시간',
  // state contract/editingDay: string | null
  editingDay: null,
  // state contract/showChangePulse: boolean
  showChangePulse: false,
  // state contract/wizSalaryType: SalaryType
  wizSalaryType: 'hourly',
  // state contract/wizSalaryAmount: number
  wizSalaryAmount: 10320,
  // state contract/wizNonTaxFood: number
  wizNonTaxFood: 0,
  // state contract/wizHasCarAllowance: boolean
  wizHasCarAllowance: false,
  // state contract/wizNonTaxCar: number
  wizNonTaxCar: 0,
  // state contract/wizPayDay: string
  wizPayDay: '10일',
  // state contract/wizOvertimeAllowance: number
  wizOvertimeAllowance: 0,
  // state contract/wizPositionAllowance: number
  wizPositionAllowance: 0,
  // state contract/wizOtherAllowance: number
  wizOtherAllowance: 0,
  wizOtherAllowanceName: '',
  // state contract/wizHasNonCompete: boolean
  wizHasNonCompete: false,
  // state contract/wizNonCompetePeriod: string
  wizNonCompetePeriod: '6개월',
  // state contract/wizNonCompeteRange: string
  wizNonCompeteRange: '반경 3km',
  // state contract/wizNonCompeteAmount: number
  wizNonCompeteAmount: 200000,
  // state contract/wizSpecialClause: string
  wizSpecialClause: '',
  // state contract/wizContractText: '',
  wizContractText: '',
  // state contract/wizCommissionPercent: number
  wizCommissionPercent: 30,

  // state global/fontSize: number
  fontSize: parseInt(localStorage.getItem('hakon_font_size') || '18'),

  // state instructor/selectedMyPageContractId: string | null
  selectedMyPageContractId: null,
  // state instructor/signingStep: 'select' | 'read' | 'verify' | 'sign' | 'complete'
  signingStep: 'select',
  // state instructor/signConsentChecked: boolean
  signConsentChecked: false,
  // state instructor/authPhone: string
  authPhone: '010-8273-0192',
  // state instructor/authCode: string
  authCode: '',
  // state instructor/isAuthSent: boolean
  isAuthSent: false,
  // state instructor/isAuthVerified: boolean
  isAuthVerified: false,
  // state instructor/hasSignature: boolean
  hasSignature: false,

  // state newInstructor/newInstName: string
  newInstName: '',
  // state newInstructor/newInstPhone: string
  newInstPhone: '',
  // state newInstructor/newInstEmail: string
  newInstEmail: '',

  // actions
  setPersons: updater =>
    set(state => ({
      persons: typeof updater === 'function' ? updater(state.persons) : updater,
    })),
  setContracts: updater =>
    set(state => ({
      contracts: typeof updater === 'function' ? updater(state.contracts) : updater,
    })),
  setEventLogs: updater =>
    set(state => ({
      eventLogs: typeof updater === 'function' ? updater(state.eventLogs) : updater,
    })),
  setSignatureLogs: updater =>
    set(state => ({
      signatureLogs: typeof updater === 'function' ? updater(state.signatureLogs) : updater,
    })),
  setAcademies: updater =>
    set(state => {
      const next = typeof updater === 'function' ? updater(state.academies) : updater;
      localStorage.setItem('hakon_academies', JSON.stringify(next));
      return { academies: next };
    }),
  setSelectedAcademyId: id => {
    localStorage.setItem('hakon_selected_academy_id', id);
    set({ selectedAcademyId: id });
  },
  setCurrentRole: role => set({ currentRole: role }),
  setSelectedInstructorId: id => set({ selectedInstructorId: id }),
  setSelectedContractId: id => set({ selectedContractId: id }),
  showToast: (text, type = 'success') => {
    set({ toast: { text, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  addEventLog: (eventType, actor, actorId, targetId, details) => {
    set(state => {
      const lastLog = state.eventLogs[state.eventLogs.length - 1];
      const prevHash = lastLog ? lastLog.hash : '00000000000000000000000000000000';
      const logString = `${eventType}_${actor}_${targetId}_${Date.now()}_${prevHash}`;
      const hash = sha256Simulate(logString);

      const newLog: EventLog = {
        id: `EV_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        eventType,
        actor,
        actorId,
        targetId,
        timestamp: new Date().toISOString(),
        details,
        prevHash,
        hash,
      };
      return { eventLogs: [...state.eventLogs, newLog] };
    });
  },

  setWizardStep: step => set({ wizardStep: step }),
  setWizSubStep: subStep => set({ wizSubStep: subStep }),
  setMaxUnlockedSubStep: subStep => set({ maxUnlockedSubStep: subStep }),
  setWizInstructorId: id => set({ wizInstructorId: id }),
  setWizInstructorName: name => set({ wizInstructorName: name }),
  setWizInstructorSubject: subject => set({ wizInstructorSubject: subject }),
  setWizInstructorAddress: address => set({ wizInstructorAddress: address }),
  setWizInstructorPhone: phone => set({ wizInstructorPhone: phone }),
  setWizInstructorBirthDate: birthDate => set({ wizInstructorBirthDate: birthDate }),
  setWizContractType: type => set({ wizContractType: type }),
  setWizStartDate: date => set({ wizStartDate: date }),
  setWizPeriodYear: year => set({ wizPeriodYear: year }),
  setWizEndDate: date => set({ wizEndDate: date }),
  setWizProbation: probation => set({ wizProbation: probation }),
  setWizWorkDaysType: type => set({ wizWorkDaysType: type }),
  setWizDaysConfig: updater =>
    set(state => ({
      wizDaysConfig: typeof updater === 'function' ? updater(state.wizDaysConfig) : updater,
    })),
  setSelectedBatchDays: days => set({ selectedBatchDays: days }),
  setBatchStartTime: time => set({ batchStartTime: time }),
  setBatchEndTime: time => set({ batchEndTime: time }),
  setBatchBreakTime: time => set({ batchBreakTime: time }),
  setEditingDay: day => set({ editingDay: day }),
  setShowChangePulse: show => set({ showChangePulse: show }),
  setWizSalaryType: type => set({ wizSalaryType: type }),
  setWizSalaryAmount: amount => set({ wizSalaryAmount: amount }),
  setWizNonTaxFood: amount => set({ wizNonTaxFood: amount }),
  setWizHasCarAllowance: has => set({ wizHasCarAllowance: has }),
  setWizNonTaxCar: amount => set({ wizNonTaxCar: amount }),
  setWizPayDay: day => set({ wizPayDay: day }),
  setWizOvertimeAllowance: amount => set({ wizOvertimeAllowance: amount }),
  setWizPositionAllowance: amount => set({ wizPositionAllowance: amount }),
  setWizOtherAllowance: amount => set({ wizOtherAllowance: amount }),
  setWizOtherAllowanceName: name => set({ wizOtherAllowanceName: name }),
  setWizHasNonCompete: has => set({ wizHasNonCompete: has }),
  setWizNonCompetePeriod: period => set({ wizNonCompetePeriod: period }),
  setWizNonCompeteRange: range => set({ wizNonCompeteRange: range }),
  setWizNonCompeteAmount: amount => set({ wizNonCompeteAmount: amount }),
  setWizSpecialClause: clause => set({ wizSpecialClause: clause }),
  setWizContractText: text => set({ wizContractText: text }),
  setWizCommissionPercent: percent => set({ wizCommissionPercent: percent }),

  applyQuickSchedule: type => {
    set({ wizWorkDaysType: type });
    if (type === '5days') {
      set({
        wizDaysConfig: {
          월요일: {
            enabled: true,
            startTime: '14:00',
            endTime: '22:00',
            breakTime: '1시간',
          },
          화요일: {
            enabled: true,
            startTime: '14:00',
            endTime: '22:00',
            breakTime: '1시간',
          },
          수요일: {
            enabled: true,
            startTime: '14:00',
            endTime: '22:00',
            breakTime: '1시간',
          },
          목요일: {
            enabled: true,
            startTime: '14:00',
            endTime: '22:00',
            breakTime: '1시간',
          },
          금요일: {
            enabled: true,
            startTime: '14:00',
            endTime: '22:00',
            breakTime: '1시간',
          },
          토요일: {
            enabled: false,
            startTime: '09:00',
            endTime: '18:00',
            breakTime: '1시간',
          },
          일요일: {
            enabled: false,
            startTime: '09:00',
            endTime: '18:00',
            breakTime: '1시간',
          },
        },
      });
    } else if (type === '3days') {
      set({
        wizDaysConfig: {
          월요일: {
            enabled: true,
            startTime: '14:00',
            endTime: '22:00',
            breakTime: '1시간',
          },
          화요일: {
            enabled: false,
            startTime: '14:00',
            endTime: '22:00',
            breakTime: '1시간',
          },
          수요일: {
            enabled: true,
            startTime: '14:00',
            endTime: '22:00',
            breakTime: '1시간',
          },
          목요일: {
            enabled: false,
            startTime: '14:00',
            endTime: '22:00',
            breakTime: '1시간',
          },
          금요일: {
            enabled: true,
            startTime: '14:00',
            endTime: '22:00',
            breakTime: '1시간',
          },
          토요일: {
            enabled: false,
            startTime: '09:00',
            endTime: '18:00',
            breakTime: '1시간',
          },
          일요일: {
            enabled: false,
            startTime: '09:00',
            endTime: '18:00',
            breakTime: '1시간',
          },
        },
      });
    }
  },

  applyAlternative: (index, validationResult) => {
    const clause = validationResult.detectedToxicClauses[index];
    if (!clause) return;

    let newText = get().wizContractText;
    newText += `\n[대체조항 적용] ${clause.alternativeText}`;
    set({ wizContractText: newText });
    get().showToast('대안 합의 조항이 하단에 성공적으로 추가되었습니다.', 'success');

    get().addEventLog(
      'RISK_DETECTED',
      '원장 (이은재)',
      'USER_ADMIN',
      'WIZ_DRAFT',
      '노무 위반 조항에 대해 제공된 표준 권고 대안 합의안을 계약서 본문에 반영하였습니다.'
    );
  },

  handleSendContract: validationResult => {
    const {
      persons,
      wizInstructorId,
      wizContractType,
      wizSalaryType,
      wizSalaryAmount,
      wizStartDate,
      wizEndDate,
      selectedAcademyId,
      showToast,
      addEventLog,
      setContracts,
      setPersons,
      setWizardStep,
    } = get();

    const targetPerson = persons.find(p => p.id === wizInstructorId);
    if (!targetPerson) return;

    // Calculate weekly hours
    let totalHours = 0;
    const config = get().wizDaysConfig;
    Object.keys(config).forEach(day => {
      const conf = config[day];
      if (conf.enabled) {
        // inline daily hours calculation
        const [sH, sM] = conf.startTime.split(':').map(Number);
        const [eH, eM] = conf.endTime.split(':').map(Number);
        const totalMinutes = eH * 60 + eM - (sH * 60 + sM);

        let breakMinutes = 60; // 1시간
        if (conf.breakTime === '30분') breakMinutes = 30;
        else if (conf.breakTime === '1시간') breakMinutes = 60;
        else if (conf.breakTime === '1.5시간') breakMinutes = 90;
        else if (conf.breakTime === '2시간') breakMinutes = 120;
        else if (conf.breakTime === '없음') breakMinutes = 0;

        const netMinutes = totalMinutes - breakMinutes;
        totalHours += Math.max(0, netMinutes / 60);
      }
    });
    const weeklyHours = parseFloat(totalHours.toFixed(1));
    const hasWeeklyRestAllowance = weeklyHours >= 15;

    const docId = `DOC_${Date.now()}`;
    const newContract: Contract = {
      id: docId,
      type: 'contract',
      title: `${targetPerson.name} 강사 근로계약서 (${wizContractType === '강사위촉계약서' ? '위촉' : '근로'})`,
      version: 1,
      status: 'pending_signature',
      personId: wizInstructorId,
      createdAt: new Date().toISOString(),
      hash: sha256Simulate(`${docId}_${wizInstructorId}`),
      contractType: wizContractType,
      salaryType: wizSalaryType,
      salaryAmount: wizSalaryAmount,
      weeklyHours: weeklyHours,
      hasWeeklyRestAllowance: hasWeeklyRestAllowance,
      contractStart: wizStartDate,
      contractEnd: wizEndDate,
      riskStatus: validationResult.riskStatus,
      riskLog: validationResult.riskLog,
      toxicClauses: validationResult.detectedToxicClauses,
      academyId: selectedAcademyId,
      contractText: get().wizContractText,
    };

    setContracts(prev => [newContract, ...prev]);

    // Update person status if candidate
    setPersons(prev =>
      prev.map(p => {
        if (p.id === wizInstructorId && p.status === 'candidate') {
          return { ...p, status: 'accepted' };
        }
        return p;
      })
    );

    addEventLog(
      'CONTRACT_DRAFTED',
      '원장 (이은재)',
      'USER_ADMIN',
      docId,
      `[계약서 초안 완성] ${targetPerson.name} 강사의 조건 조율을 마쳤습니다.`
    );
    addEventLog(
      'CONTRACT_SENT',
      '원장 (이은재)',
      'USER_ADMIN',
      docId,
      `[카카오 알림톡 발송] 비대면 서명 링크가 강사 연락처로 전송되었습니다.`
    );

    showToast(`${targetPerson.name} 강사님께 서명 요청 발송 완료 (알림톡 연동 모의)`, 'success');
    setWizardStep(1);
  },

  setSelectedMyPageContractId: id => set({ selectedMyPageContractId: id }),
  setSigningStep: step => set({ signingStep: step }),
  setSignConsentChecked: checked => set({ signConsentChecked: checked }),
  setAuthPhone: phone => set({ authPhone: phone }),
  setAuthCode: code => set({ authCode: code }),
  setIsAuthSent: sent => set({ isAuthSent: sent }),
  setIsAuthVerified: verified => set({ isAuthVerified: verified }),
  setHasSignature: has => set({ hasSignature: has }),

  handleSendSMS: () => {
    set({ isAuthSent: true, authCode: '8204' });
    get().showToast('본인확인 인증번호 [8204]가 정상 발송되었습니다.', 'info');
  },

  handleVerifySMS: () => {
    const {
      authCode,
      selectedMyPageContractId,
      persons,
      selectedInstructorId,
      addEventLog,
      showToast,
    } = get();
    if (authCode === '8204') {
      set({ isAuthVerified: true });
      showToast('휴대폰 실명 확인에 따른 고유 식별값(CI) 발급 성공!', 'success');
      const activeInstructor = persons.find(p => p.id === selectedInstructorId);
      if (selectedMyPageContractId && activeInstructor) {
        addEventLog(
          'IDENTITY_VERIFIED',
          `강사 (${activeInstructor.name})`,
          activeInstructor.id,
          selectedMyPageContractId,
          `본인 확인 성공. 식별키(CI) 연계 검증 완료. (인증번호: 8204)`
        );
      }
    } else {
      showToast('인증번호를 잘못 입력하셨습니다. 다시 확인해 주세요.', 'warning');
    }
  },

  handleCompleteSignature: signatureData => {
    const {
      selectedMyPageContractId,
      persons,
      selectedInstructorId,
      setSignatureLogs,
      setContracts,
      setPersons,
      addEventLog,
      showToast,
    } = get();

    if (!selectedMyPageContractId) return;
    const activeInstructor = persons.find(p => p.id === selectedInstructorId);
    if (!activeInstructor) return;

    const documentHash = sha256Simulate(`${selectedMyPageContractId}_COMPLETED_SEAL`);

    const newSigLog: SignatureLog = {
      id: `SIG_${Date.now()}`,
      documentId: selectedMyPageContractId,
      signerName: activeInstructor.name,
      signerId: activeInstructor.id,
      signatureData,
      verifiedPhone: activeInstructor.phone,
      verifiedCi: `CI_VERIFY_SHA256_${sha256Simulate(activeInstructor.id).slice(10, 22).toUpperCase()}`,
      ipAddress: '211.234.12.82',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      documentHash,
    };

    setSignatureLogs(prev => [newSigLog, ...prev]);

    setContracts(prev =>
      prev.map(c => {
        if (c.id === selectedMyPageContractId) {
          return { ...c, status: 'completed', hash: documentHash };
        }
        return c;
      })
    );

    setPersons(prev =>
      prev.map(p => {
        if (p.id === activeInstructor.id) {
          return {
            ...p,
            status: 'employed',
            joinedDate: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );

    addEventLog(
      'SIGNED',
      `강사 (${activeInstructor.name})`,
      activeInstructor.id,
      selectedMyPageContractId,
      `수기 서명 획적을 기록 완료하였습니다.`
    );
    addEventLog(
      'CONTRACT_COMPLETED',
      '시스템',
      'SYSTEM',
      selectedMyPageContractId,
      `쌍방 서명 체결 완료에 따라 원본 PDF 무결성 봉인 해시를 생성하였습니다.`
    );

    set({ signingStep: 'complete' });
    showToast('전자 계약이 법적으로 완벽하게 성립되었습니다!', 'success');
  },

  setNewInstName: name => set({ newInstName: name }),
  setNewInstPhone: phone => set({ newInstPhone: phone }),
  setNewInstEmail: email => set({ newInstEmail: email }),

  handleImportInstructor: e => {
    e.preventDefault();
    const { newInstName, newInstPhone, newInstEmail, setPersons, addEventLog, showToast } = get();
    if (!newInstName || !newInstPhone) {
      showToast('성명 및 휴대폰 정보가 올바르지 않습니다.', 'warning');
      return;
    }

    const newId = `CI_${Math.floor(10000000 + Math.random() * 90000000)}`;
    const newP: Person = {
      id: newId,
      name: newInstName,
      phone: newInstPhone,
      email: newInstEmail || undefined,
      role: 'instructor',
      status: 'candidate',
    };

    setPersons(prev => [...prev, newP]);
    addEventLog(
      'PERSON_CREATED',
      '원장 (이은재)',
      'USER_ADMIN',
      newId,
      `인사이트 본체 동기화를 통해 후보강사 ${newInstName} 데이터를 생성하였습니다.`
    );
    showToast(`${newInstName} 강사가 동기화 및 임포트되었습니다.`, 'success');

    set({ newInstName: '', newInstPhone: '', newInstEmail: '' });
  },

  setFontSize: size => {
    localStorage.setItem('hakon_font_size', String(size));
    document.documentElement.style.setProperty('--font-size', `${size}px`);
    set({ fontSize: size });
  },
}));
