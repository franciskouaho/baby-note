import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, BabyEvent, BabyProfile, GrowthEntry, Language } from './types';
import type { ColorSchemePreference } from './theme';

const KEYS = {
  BABY: 'baby_profile',
  EVENTS: 'baby_events',
  GROWTH: 'growth_entries',
  ONBOARDING: 'onboarding_completed',
  LANGUAGE: 'app_language',
  COLOR_SCHEME: 'color_scheme_preference',
};

export async function saveBabyProfile(baby: BabyProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.BABY, JSON.stringify(baby));
}

export async function getBabyProfile(): Promise<BabyProfile | null> {
  const data = await AsyncStorage.getItem(KEYS.BABY);
  return data ? JSON.parse(data) : null;
}

export async function saveEvent(event: BabyEvent): Promise<void> {
  const events = await getEvents();
  events.unshift(event);
  await AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
}

export async function getEvents(): Promise<BabyEvent[]> {
  const data = await AsyncStorage.getItem(KEYS.EVENTS);
  return data ? JSON.parse(data) : [];
}

export async function deleteEvent(eventId: string): Promise<void> {
  const events = await getEvents();
  const filtered = events.filter((e) => e.id !== eventId);
  await AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(filtered));
}

export async function saveGrowthEntry(entry: GrowthEntry): Promise<void> {
  const entries = await getGrowthEntries();
  entries.push(entry);
  entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  await AsyncStorage.setItem(KEYS.GROWTH, JSON.stringify(entries));
}

export async function getGrowthEntries(): Promise<GrowthEntry[]> {
  const data = await AsyncStorage.getItem(KEYS.GROWTH);
  return data ? JSON.parse(data) : [];
}

export async function setOnboardingCompleted(completed: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING, JSON.stringify(completed));
}

export async function isOnboardingCompleted(): Promise<boolean> {
  const data = await AsyncStorage.getItem(KEYS.ONBOARDING);
  return data ? JSON.parse(data) : false;
}

export async function setLanguage(lang: Language): Promise<void> {
  await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
}

export async function getLanguage(): Promise<Language> {
  const data = await AsyncStorage.getItem(KEYS.LANGUAGE);
  return (data as Language) || 'fr';
}

export async function setColorSchemePreference(pref: ColorSchemePreference): Promise<void> {
  await AsyncStorage.setItem(KEYS.COLOR_SCHEME, pref);
}

export async function getColorSchemePreference(): Promise<ColorSchemePreference> {
  const data = await AsyncStorage.getItem(KEYS.COLOR_SCHEME);
  if (data === 'dark' || data === 'light' || data === 'system') return data;
  return 'system';
}

export async function exportAllData(): Promise<AppData> {
  const baby = await getBabyProfile();
  const events = await getEvents();
  const growthEntries = await getGrowthEntries();
  const onboardingCompleted = await isOnboardingCompleted();
  const language = await getLanguage();
  return { baby, events, growthEntries, onboardingCompleted, language };
}

export async function importAllData(data: AppData): Promise<void> {
  if (data.baby) await saveBabyProfile(data.baby);
  if (data.events) await AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(data.events));
  if (data.growthEntries) await AsyncStorage.setItem(KEYS.GROWTH, JSON.stringify(data.growthEntries));
  if (data.onboardingCompleted !== undefined) await setOnboardingCompleted(data.onboardingCompleted);
  if (data.language) await setLanguage(data.language);
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}

export async function hasBackup(): Promise<boolean> {
  const baby = await getBabyProfile();
  return baby !== null;
}
