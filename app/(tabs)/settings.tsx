import React, { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Svg, { Path, Circle, Line, Rect, Ellipse } from 'react-native-svg';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Constants from 'expo-constants';
import { AppContext } from '@/lib/context';
import * as storage from '@/lib/storage';
import type { ThemeColor, Language } from '@/lib/types';
import type { ColorSchemePreference } from '@/lib/theme';

/* ------------------------------------------------------------------ */
/*  Icon components                                                    */
/* ------------------------------------------------------------------ */

function ChevronRightIcon({ color = '#636366', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M6 3l5 5-5 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ProfileIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeLinecap="round" />
    </Svg>
  );
}

function LanguageIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="2" y1="12" x2="22" y2="12" />
      <Path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </Svg>
  );
}

function PaletteIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="10" />
      <Circle cx="12" cy="8" r="1.5" fill={color} />
      <Circle cx="8" cy="12" r="1.5" fill={color} />
      <Circle cx="16" cy="12" r="1.5" fill={color} />
      <Circle cx="12" cy="16" r="1.5" fill={color} />
    </Svg>
  );
}

function AppearanceIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 2a10 10 0 000 20V2z" fill={color} opacity={0.3} />
    </Svg>
  );
}

function ExportIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <Path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" />
    </Svg>
  );
}

function ImportIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <Path d="M17 8l-5-5-5 5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
    </Svg>
  );
}

function TrashIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M3 6h18" strokeLinecap="round" />
      <Path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
      <Path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </Svg>
  );
}

function InfoIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" />
      <Circle cx="12" cy="8" r="0.5" fill={color} />
    </Svg>
  );
}

function BabyFaceIcon({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      <Circle cx="40" cy="40" r="38" fill="#F4C9A8" />
      <Circle cx="40" cy="40" r="32" fill="#FDDCC5" />
      <Ellipse cx="30" cy="38" rx="3" ry="3.5" fill="#3A3A3C" />
      <Ellipse cx="50" cy="38" rx="3" ry="3.5" fill="#3A3A3C" />
      <Circle cx="31" cy="37" r="1" fill="#FFFFFF" />
      <Circle cx="51" cy="37" r="1" fill="#FFFFFF" />
      <Ellipse cx="24" cy="44" rx="5" ry="3" fill="#F8B4B4" opacity={0.4} />
      <Ellipse cx="56" cy="44" rx="5" ry="3" fill="#F8B4B4" opacity={0.4} />
      <Path d="M35 48 Q40 53 45 48" stroke="#E88B7A" strokeWidth={2} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings Screen                                                    */
/* ------------------------------------------------------------------ */

export default function SettingsScreen() {
  const { t } = useTranslation();
  const {
    theme,
    colorScheme,
    colorSchemePreference,
    setColorSchemePreference,
    themeColor,
    setThemeColor,
    language,
    setLanguage,
    baby,
    setBaby,
    refreshEvents,
    refreshGrowth,
  } = React.use(AppContext);

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const activeTextColor = theme.activeButtonText;

  const handleExport = useCallback(async () => {
    try {
      const data = await storage.exportAllData();
      const json = JSON.stringify(data, null, 2);
      const backupFile = new File(Paths.document, 'baby-note-backup.json');
      backupFile.write(json);
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(backupFile.uri, {
          mimeType: 'application/json',
          dialogTitle: t('settings.exportData'),
          UTI: 'public.json',
        });
      }
    } catch {
      Alert.alert('Error', 'Export failed');
    }
  }, [t]);

  const handleImport = useCallback(async () => {
    try {
      const backupFile = new File(Paths.document, 'baby-note-backup.json');
      if (!backupFile.exists) {
        Alert.alert('Info', 'No backup file found in app documents.');
        return;
      }
      const json = await backupFile.text();
      const data = JSON.parse(json);
      await storage.importAllData(data);
      await refreshEvents();
      await refreshGrowth();
      Alert.alert('OK', 'Data imported successfully.');
    } catch {
      Alert.alert('Error', 'Import failed');
    }
  }, [refreshEvents, refreshGrowth]);

  const handleDeleteAll = useCallback(() => {
    Alert.alert(t('settings.deleteAll'), t('settings.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await storage.clearAllData();
          router.replace('/onboarding');
        },
      },
    ]);
  }, [t]);

  const themeOptions: { color: ThemeColor; hex: string; label: string }[] = [
    { color: 'peach', hex: '#F4A683', label: 'Peach' },
    { color: 'pink', hex: '#E8A0BF', label: 'Rose' },
    { color: 'blue', hex: '#7EB6DE', label: 'Ciel' },
  ];

  const appearanceOptions: { pref: ColorSchemePreference; label: string }[] = [
    { pref: 'system', label: 'Auto' },
    { pref: 'light', label: 'Light' },
    { pref: 'dark', label: 'Dark' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Header ---- */}
        <Animated.View
          entering={FadeIn.duration(400)}
          style={{ paddingTop: 60, paddingBottom: 8, paddingHorizontal: 24 }}
        >
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.3 }}>
            {t('settings.title')}
          </Text>
        </Animated.View>

        {/* ---- Profile Card ---- */}
        <Animated.View entering={FadeInDown.delay(60).duration(400)} style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Pressable
            onPress={() => router.push('/onboarding/profile')}
            style={({ pressed }) => ({
              backgroundColor: theme.surface,
              borderRadius: 24,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              borderWidth: colorScheme === 'light' ? 1 : 0,
              borderColor: theme.border,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                overflow: 'hidden',
                backgroundColor: theme.surfaceElevated,
                borderWidth: 2,
                borderColor: theme.primary + '30',
              }}
            >
              {baby?.photoUri ? (
                <Image source={{ uri: baby.photoUri }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <View style={{ transform: [{ scale: 0.6 }], alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                  <BabyFaceIcon size={80} />
                </View>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 17, fontWeight: '700' }}>
                {baby?.name ?? 'Baby'}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2, fontWeight: '500' }}>
                {t('settings.editProfile')}
              </Text>
            </View>
            <ChevronRightIcon color={theme.textTertiary} />
          </Pressable>
        </Animated.View>

        {/* ---- Section: Appearance ---- */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={{ paddingHorizontal: 16, marginTop: 28 }}>
          <Text style={{ color: theme.textTertiary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, marginLeft: 8 }}>
            {t('settings.appearance', 'Apparence')}
          </Text>

          <View
            style={{
              backgroundColor: theme.surface,
              borderRadius: 22,
              overflow: 'hidden',
              borderWidth: colorScheme === 'light' ? 1 : 0,
              borderColor: theme.border,
            }}
          >
            {/* Dark/Light Mode */}
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: theme.primary + '12', alignItems: 'center', justifyContent: 'center' }}>
                <AppearanceIcon color={theme.primary} size={18} />
              </View>
              <Text style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '500' }}>
                {t('settings.appearance', 'Mode')}
              </Text>
              <View style={{ flexDirection: 'row', gap: 3, backgroundColor: theme.surfaceElevated, borderRadius: 10, padding: 3 }}>
                {appearanceOptions.map((opt) => {
                  const isActive = colorSchemePreference === opt.pref;
                  return (
                    <Pressable
                      key={opt.pref}
                      onPress={() => setColorSchemePreference(opt.pref)}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: isActive ? theme.primary : 'transparent',
                      }}
                    >
                      <Text
                        style={{
                          color: isActive ? activeTextColor : theme.textSecondary,
                          fontSize: 11,
                          fontWeight: '600',
                        }}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: theme.border, marginLeft: 66 }} />

            {/* Language */}
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: theme.primary + '12', alignItems: 'center', justifyContent: 'center' }}>
                <LanguageIcon color={theme.primary} size={18} />
              </View>
              <Text style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '500' }}>
                {t('settings.language')}
              </Text>
              <View style={{ flexDirection: 'row', gap: 3, backgroundColor: theme.surfaceElevated, borderRadius: 10, padding: 3 }}>
                {(['fr', 'en'] as Language[]).map((lang) => {
                  const isActive = language === lang;
                  return (
                    <Pressable
                      key={lang}
                      onPress={() => setLanguage(lang)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: isActive ? theme.primary : 'transparent',
                      }}
                    >
                      <Text
                        style={{
                          color: isActive ? activeTextColor : theme.textSecondary,
                          fontSize: 12,
                          fontWeight: '600',
                        }}
                      >
                        {lang.toUpperCase()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: theme.border, marginLeft: 66 }} />

            {/* Theme Color */}
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: theme.primary + '12', alignItems: 'center', justifyContent: 'center' }}>
                <PaletteIcon color={theme.primary} size={18} />
              </View>
              <Text style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '500' }}>
                {t('settings.themeColor')}
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {themeOptions.map((opt) => {
                  const isActive = themeColor === opt.color;
                  return (
                    <Pressable
                      key={opt.color}
                      onPress={() => setThemeColor(opt.color)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: opt.hex,
                        borderWidth: isActive ? 2.5 : 0,
                        borderColor: theme.text,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isActive && (
                        <Svg width={12} height={12} viewBox="0 0 14 14" fill="none">
                          <Path
                            d="M3 7l3 3 5-6"
                            stroke={theme.activeButtonText}
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ---- Section: Data ---- */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ paddingHorizontal: 16, marginTop: 28 }}>
          <Text style={{ color: theme.textTertiary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, marginLeft: 8 }}>
            {t('settings.data', 'Donnees')}
          </Text>

          <View
            style={{
              backgroundColor: theme.surface,
              borderRadius: 22,
              overflow: 'hidden',
              borderWidth: colorScheme === 'light' ? 1 : 0,
              borderColor: theme.border,
            }}
          >
            <Pressable
              onPress={handleExport}
              style={({ pressed }) => ({
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                backgroundColor: pressed ? theme.surfaceLight : 'transparent',
              })}
            >
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: theme.surfaceElevated, alignItems: 'center', justifyContent: 'center' }}>
                <ExportIcon color={theme.textSecondary} size={18} />
              </View>
              <Text style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '500' }}>
                {t('settings.exportData')}
              </Text>
              <ChevronRightIcon color={theme.textTertiary} />
            </Pressable>

            <View style={{ height: 1, backgroundColor: theme.border, marginLeft: 66 }} />

            <Pressable
              onPress={handleImport}
              style={({ pressed }) => ({
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                backgroundColor: pressed ? theme.surfaceLight : 'transparent',
              })}
            >
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: theme.surfaceElevated, alignItems: 'center', justifyContent: 'center' }}>
                <ImportIcon color={theme.textSecondary} size={18} />
              </View>
              <Text style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '500' }}>
                {t('settings.importData')}
              </Text>
              <ChevronRightIcon color={theme.textTertiary} />
            </Pressable>
          </View>
        </Animated.View>

        {/* ---- Section: Danger ---- */}
        <Animated.View entering={FadeInDown.delay(280).duration(400)} style={{ paddingHorizontal: 16, marginTop: 28 }}>
          <View
            style={{
              backgroundColor: theme.surface,
              borderRadius: 22,
              overflow: 'hidden',
              borderWidth: colorScheme === 'light' ? 1 : 0,
              borderColor: theme.border,
            }}
          >
            <Pressable
              onPress={handleDeleteAll}
              style={({ pressed }) => ({
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                backgroundColor: pressed ? '#FF3B3008' : 'transparent',
              })}
            >
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#FF3B3015', alignItems: 'center', justifyContent: 'center' }}>
                <TrashIcon color="#FF3B30" size={18} />
              </View>
              <Text style={{ flex: 1, color: '#FF3B30', fontSize: 15, fontWeight: '500' }}>
                {t('settings.deleteAll')}
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* ---- Footer ---- */}
        <Animated.View entering={FadeInDown.delay(340).duration(400)} style={{ alignItems: 'center', marginTop: 32, paddingHorizontal: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <InfoIcon color={theme.textTertiary} size={14} />
            <Text style={{ color: theme.textTertiary, fontSize: 12, fontWeight: '500' }}>
              Baby Note {appVersion}
            </Text>
          </View>
          <Text style={{ color: theme.textTertiary, fontSize: 11, opacity: 0.6 }}>
            Made with {'\u2764\uFE0F'} for parents
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
