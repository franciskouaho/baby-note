export type Gender = 'girl' | 'boy';
export type ThemeColor = 'peach' | 'pink' | 'blue';
export type Language = 'fr' | 'en';

export interface BabyProfile {
  id: string;
  name: string;
  gender: Gender;
  birthday: string; // ISO date
  photoUri?: string;
  themeColor: ThemeColor;
  height?: number; // cm
  weight?: number; // kg
  createdAt: string;
}

export type EventType = 'sleep' | 'breastfeeding' | 'bottle' | 'diaper' | 'solids' | 'pumped_milk';

export interface SleepEvent {
  id: string;
  type: 'sleep';
  startTime: string;
  endTime?: string;
  notes?: string;
  createdAt: string;
}

export interface BreastfeedingEvent {
  id: string;
  type: 'breastfeeding';
  side: 'left' | 'right' | 'both';
  durationMinutes: number;
  startTime: string;
  notes?: string;
  createdAt: string;
}

export interface BottleEvent {
  id: string;
  type: 'bottle';
  amountMl: number;
  startTime: string;
  notes?: string;
  createdAt: string;
}

export interface DiaperEvent {
  id: string;
  type: 'diaper';
  diaperType: 'wet' | 'dirty' | 'mixed';
  startTime: string;
  notes?: string;
  createdAt: string;
}

export interface SolidsEvent {
  id: string;
  type: 'solids';
  food: string;
  amountGrams?: number;
  startTime: string;
  notes?: string;
  createdAt: string;
}

export interface PumpedMilkEvent {
  id: string;
  type: 'pumped_milk';
  amountMl: number;
  startTime: string;
  notes?: string;
  createdAt: string;
}

export type BabyEvent =
  | SleepEvent
  | BreastfeedingEvent
  | BottleEvent
  | DiaperEvent
  | SolidsEvent
  | PumpedMilkEvent;

export interface GrowthEntry {
  id: string;
  date: string;
  weight?: number;
  height?: number;
  headCircumference?: number;
  createdAt: string;
}

export interface AppData {
  baby: BabyProfile | null;
  events: BabyEvent[];
  growthEntries: GrowthEntry[];
  onboardingCompleted: boolean;
  language: Language;
}
