import React, { createContext, useCallback, useEffect, useState } from 'react';
import { BabyProfile, BabyEvent, GrowthEntry, ThemeColor, Language } from './types';
import * as storage from './storage';
import { getTheme } from './theme';
import i18n from './i18n';

interface AppContextType {
  baby: BabyProfile | null;
  setBaby: (baby: BabyProfile) => Promise<void>;
  events: BabyEvent[];
  addEvent: (event: BabyEvent) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
  refreshEvents: () => Promise<void>;
  growthEntries: GrowthEntry[];
  addGrowthEntry: (entry: GrowthEntry) => Promise<void>;
  refreshGrowth: () => Promise<void>;
  onboardingDone: boolean;
  completeOnboarding: () => Promise<void>;
  theme: ReturnType<typeof getTheme>;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => Promise<void>;
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  isLoading: boolean;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [baby, setBabyState] = useState<BabyProfile | null>(null);
  const [events, setEvents] = useState<BabyEvent[]>([]);
  const [growthEntries, setGrowthEntries] = useState<GrowthEntry[]>([]);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [themeColor, setThemeColorState] = useState<ThemeColor>('peach');
  const [language, setLanguageState] = useState<Language>('fr');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [babyData, eventsData, growthData, onboarding, lang] = await Promise.all([
        storage.getBabyProfile(),
        storage.getEvents(),
        storage.getGrowthEntries(),
        storage.isOnboardingCompleted(),
        storage.getLanguage(),
      ]);
      if (babyData) {
        setBabyState(babyData);
        setThemeColorState(babyData.themeColor || 'peach');
      }
      setEvents(eventsData);
      setGrowthEntries(growthData);
      setOnboardingDone(onboarding);
      setLanguageState(lang);
      i18n.changeLanguage(lang);
    } finally {
      setIsLoading(false);
    }
  }

  const setBaby = useCallback(async (b: BabyProfile) => {
    setBabyState(b);
    setThemeColorState(b.themeColor);
    await storage.saveBabyProfile(b);
  }, []);

  const addEvent = useCallback(async (event: BabyEvent) => {
    await storage.saveEvent(event);
    setEvents((prev) => [event, ...prev]);
  }, []);

  const removeEvent = useCallback(async (id: string) => {
    await storage.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const refreshEvents = useCallback(async () => {
    const data = await storage.getEvents();
    setEvents(data);
  }, []);

  const addGrowthEntry = useCallback(async (entry: GrowthEntry) => {
    await storage.saveGrowthEntry(entry);
    const data = await storage.getGrowthEntries();
    setGrowthEntries(data);
  }, []);

  const refreshGrowth = useCallback(async () => {
    const data = await storage.getGrowthEntries();
    setGrowthEntries(data);
  }, []);

  const completeOnboarding = useCallback(async () => {
    setOnboardingDone(true);
    await storage.setOnboardingCompleted(true);
  }, []);

  const setThemeColor = useCallback(async (color: ThemeColor) => {
    setThemeColorState(color);
    if (baby) {
      const updated = { ...baby, themeColor: color };
      setBabyState(updated);
      await storage.saveBabyProfile(updated);
    }
  }, [baby]);

  const setLanguageFunc = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    await storage.setLanguage(lang);
  }, []);

  const theme = getTheme(themeColor);

  return (
    <AppContext.Provider
      value={{
        baby,
        setBaby,
        events,
        addEvent,
        removeEvent,
        refreshEvents,
        growthEntries,
        addGrowthEntry,
        refreshGrowth,
        onboardingDone,
        completeOnboarding,
        theme,
        themeColor,
        setThemeColor,
        language,
        setLanguage: setLanguageFunc,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
