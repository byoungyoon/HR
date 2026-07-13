import { ContractType, SalaryType } from '@/src/types';
import { create } from 'zustand';

type State = {
  wizardStep: number;
  // state contract/wizSubStep: 0 | 1 | 2 | 3
  wizSubStep: 0 | 1 | 2 | 3;
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
  // state contract/wizScheduleApplied: boolean
  wizScheduleApplied: boolean;
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
  // state contract/wizSalaryApplied: boolean
  wizSalaryApplied: boolean;
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
};

type Action = {
  setWizardStep: (step: number) => void;
  setWizSubStep: (subStep: 0 | 1 | 2 | 3) => void;
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
  setWizScheduleApplied: (v: boolean) => void;
  setWizDaysConfig: (
    config: State['wizDaysConfig'] | ((prev: State['wizDaysConfig']) => State['wizDaysConfig'])
  ) => void;
  setSelectedBatchDays: (days: string[]) => void;
  setBatchStartTime: (time: string) => void;
  setBatchEndTime: (time: string) => void;
  setBatchBreakTime: (time: string) => void;
  setEditingDay: (day: string | null) => void;
  setShowChangePulse: (show: boolean) => void;
  setWizSalaryType: (type: SalaryType) => void;
  setWizSalaryApplied: (applied: boolean) => void;
  setWizSalaryAmount: (amount: number) => void;
  setWizNonTaxFood: (amount: number) => void;
  setWizHasCarAllowance: (has: boolean) => void;
  setWizNonTaxCar: (amount: number) => void;
  setWizPayDay: (day: string) => void;
  setWizOvertimeAllowance: (amount: number) => void;
  setWizPositionAllowance: (amount: number) => void;
  setWizOtherAllowance: (amount: number) => void;
  setWizHasNonCompete: (has: boolean) => void;
  setWizNonCompetePeriod: (period: string) => void;
  setWizNonCompeteRange: (range: string) => void;
  setWizNonCompeteAmount: (amount: number) => void;
  setWizSpecialClause: (clause: string) => void;
  setWizContractText: (text: string) => void;
};

export const useWizaredStore = create<State & Action>(set => ({
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
  // state contract/wizStartDate: string
  wizStartDate: '2026-07-09',
  // state contract/wizPeriodYear: number
  wizPeriodYear: 1,
  // state contract/wizEndDate: string
  wizEndDate: '2027-07-08',
  // state contract/wizProbation: string
  wizProbation: '3개월',
  // state contract/wizWorkDaysType: '5days' | '3days' | 'custom'
  wizWorkDaysType: '5days',
  // state contract/wizScheduleApplied: boolean
  wizScheduleApplied: false,
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
  // state contract/wizSalaryApplied: boolean
  wizSalaryApplied: false,
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
  setWizScheduleApplied: v => set({ wizScheduleApplied: v }),
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
  setWizSalaryApplied: applied => set({ wizSalaryApplied: applied }),
  setWizSalaryAmount: amount => set({ wizSalaryAmount: amount }),
  setWizNonTaxFood: amount => set({ wizNonTaxFood: amount }),
  setWizHasCarAllowance: has => set({ wizHasCarAllowance: has }),
  setWizNonTaxCar: amount => set({ wizNonTaxCar: amount }),
  setWizPayDay: day => set({ wizPayDay: day }),
  setWizOvertimeAllowance: amount => set({ wizOvertimeAllowance: amount }),
  setWizPositionAllowance: amount => set({ wizPositionAllowance: amount }),
  setWizOtherAllowance: amount => set({ wizOtherAllowance: amount }),
  setWizHasNonCompete: has => set({ wizHasNonCompete: has }),
  setWizNonCompetePeriod: period => set({ wizNonCompetePeriod: period }),
  setWizNonCompeteRange: range => set({ wizNonCompeteRange: range }),
  setWizNonCompeteAmount: amount => set({ wizNonCompeteAmount: amount }),
  setWizSpecialClause: clause => set({ wizSpecialClause: clause }),
  setWizContractText: text => set({ wizContractText: text }),
}));
