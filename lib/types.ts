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

export type EventType =
  | 'sleep' | 'breastfeeding' | 'bottle' | 'diaper' | 'solids' | 'pumped_milk'
  | 'walk' | 'bath'
  | 'doctor' | 'vaccine' | 'temperature' | 'illness' | 'treatment'
  | 'mood'
  | 'milestone';

export type MoodType = 'happy' | 'good' | 'sad' | 'crying';
export type MilestoneType = 'first_steps' | 'sat_up' | 'first_word' | 'first_tooth' | 'custom';

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

export interface WalkEvent {
  id: string;
  type: 'walk';
  durationMinutes?: number;
  startTime: string;
  notes?: string;
  createdAt: string;
}

export interface BathEvent {
  id: string;
  type: 'bath';
  durationMinutes?: number;
  startTime: string;
  notes?: string;
  createdAt: string;
}

export interface DoctorEvent {
  id: string;
  type: 'doctor';
  startTime: string;
  notes?: string;
  createdAt: string;
}

export interface VaccineEvent {
  id: string;
  type: 'vaccine';
  vaccineName?: string;
  startTime: string;
  notes?: string;
  createdAt: string;
}

export interface TemperatureEvent {
  id: string;
  type: 'temperature';
  temperature: number;
  startTime: string;
  notes?: string;
  createdAt: string;
}

export interface IllnessEvent {
  id: string;
  type: 'illness';
  description?: string;
  startTime: string;
  notes?: string;
  createdAt: string;
}

export interface TreatmentEvent {
  id: string;
  type: 'treatment';
  treatmentName?: string;
  dosage?: string;
  startTime: string;
  notes?: string;
  createdAt: string;
}

export interface MoodEvent {
  id: string;
  type: 'mood';
  moodType: MoodType;
  startTime: string;
  notes?: string;
  createdAt: string;
}

export interface MilestoneEvent {
  id: string;
  type: 'milestone';
  milestoneType: MilestoneType;
  description?: string;
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
  | PumpedMilkEvent
  | WalkEvent
  | BathEvent
  | DoctorEvent
  | VaccineEvent
  | TemperatureEvent
  | IllnessEvent
  | TreatmentEvent
  | MoodEvent
  | MilestoneEvent;

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
