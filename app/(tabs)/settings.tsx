import React, { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Constants from 'expo-constants';
import { AppContext } from '@/lib/context';
import * as storage from '@/lib/storage';
import type { ThemeColor, Language } from '@/lib/types';

/* ------------------------------------------------------------------ */
/*  Icon components                                                    */
/* ------------------------------------------------------------------ */

function ChevronRightIcon({ color = '#636366', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path d="M7 4l5 5-5 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ProfileIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeLinecap="round" />
    </Svg>
  );
}

function LanguageIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="2" y1="12" x2="22" y2="12" />
      <Path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </Svg>
  );
}

function PaletteIcon({ color, size = 22 }: { color: string; size?: number }) {
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

function ExportIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <Path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" />
    </Svg>
  );
}

function ImportIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <Path d="M17 8l-5-5-5 5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
    </Svg>
  );
}

function TrashIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M3 6h18" strokeLinecap="round" />
      <Path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
      <Path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <Line x1="10" y1="11" x2="10" y2="17" strokeLinecap="round" />
      <Line x1="14" y1="11" x2="14" y2="17" strokeLinecap="round" />
    </Svg>
  );
}

function InfoIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" />
      <Circle cx="12" cy="8" r="0.5" fill={color} />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Setting row component                                              */
/* ------------------------------------------------------------------ */

function SettingRow({
  icon,
  label,
  onPress,
  rightContent,
  destructive = false,
  index,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  rightContent?: React.ReactNode;
  destructive?: boolean;
  index: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(400)}>
      <Pressable
        onPress={onPress}
        disabled={!onPress && !rightContent}
        style={({ pressed }) => ({
          backgroundColor: pressed && onPress ? '#2C2C2E' : '#1C1C1E',
          borderRadius: 16,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          marginBottom: 8,
        })}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: destructive ? '#FF3B3020' : '#2C2C2E',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </View>
        <Text
          style={{
            flex: 1,
            color: destructive ? '#FF3B30' : '#FFFFFF',
            fontSize: 15,
            fontWeight: '500',
          }}
        >
          {label}
        </Text>
        {rightContent ?? (onPress ? <ChevronRightIcon /> : null)}
      </Pressable>
    </Animated.View>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings Screen                                                    */
/* ------------------------------------------------------------------ */

export default function SettingsScreen() {
  const { t } = useTranslation();
  const {
    theme,
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

  /* ---- Export ---- */
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

  /* ---- Import ---- */
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

  /* ---- Delete All ---- */
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

  /* ---- Theme color options ---- */
  const themeOptions: { color: ThemeColor; hex: string }[] = [
    { color: 'peach', hex: '#F4A683' },
    { color: 'pink', hex: '#E8A0BF' },
    { color: 'blue', hex: '#7EB6DE' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Title ---- */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={{
            paddingTop: 60,
            paddingBottom: 24,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: theme.primary,
              fontSize: 20,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
          >
            {t('settings.title')}
          </Text>
        </Animated.View>

        <View style={{ paddingHorizontal: 16 }}>
          {/* ---- Edit Profile ---- */}
          <SettingRow
            icon={<ProfileIcon color={theme.primary} />}
            label={t('settings.editProfile')}
            onPress={() => router.push('/onboarding/profile')}
            index={0}
          />

          {/* ---- Language ---- */}
          <SettingRow
            icon={<LanguageIcon color={theme.primary} />}
            label={t('settings.language')}
            index={1}
            rightContent={
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {(['fr', 'en'] as Language[]).map((lang) => {
                  const isActive = language === lang;
                  return (
                    <Pressable
                      key={lang}
                      onPress={() => setLanguage(lang)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 10,
                        backgroundColor: isActive ? theme.primary : '#2C2C2E',
                      }}
                    >
                      <Text
                        style={{
                          color: isActive ? '#000000' : '#8E8E93',
                          fontSize: 13,
                          fontWeight: '600',
                        }}
                      >
                        {lang.toUpperCase()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            }
          />

          {/* ---- Theme Color ---- */}
          <SettingRow
            icon={<PaletteIcon color={theme.primary} />}
            label={t('settings.themeColor')}
            index={2}
            rightContent={
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {themeOptions.map((opt) => {
                  const isActive = themeColor === opt.color;
                  return (
                    <Pressable
                      key={opt.color}
                      onPress={() => setThemeColor(opt.color)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: opt.hex,
                        borderWidth: isActive ? 3 : 0,
                        borderColor: '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isActive && (
                        <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                          <Path
                            d="M3 7l3 3 5-6"
                            stroke="#FFFFFF"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            }
          />

          {/* ---- Separator ---- */}
          <View style={{ height: 16 }} />

          {/* ---- Export Data ---- */}
          <SettingRow
            icon={<ExportIcon color="#8E8E93" />}
            label={t('settings.exportData')}
            onPress={handleExport}
            index={3}
          />

          {/* ---- Import Data ---- */}
          <SettingRow
            icon={<ImportIcon color="#8E8E93" />}
            label={t('settings.importData')}
            onPress={handleImport}
            index={4}
          />

          {/* ---- Separator ---- */}
          <View style={{ height: 16 }} />

          {/* ---- Delete All ---- */}
          <SettingRow
            icon={<TrashIcon color="#FF3B30" />}
            label={t('settings.deleteAll')}
            onPress={handleDeleteAll}
            destructive
            index={5}
          />

          {/* ---- Separator ---- */}
          <View style={{ height: 16 }} />

          {/* ---- Version ---- */}
          <SettingRow
            icon={<InfoIcon color="#636366" />}
            label={`${t('settings.version')} ${appVersion}`}
            index={6}
          />
        </View>
      </ScrollView>
    </View>
  );
}
