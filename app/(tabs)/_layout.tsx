import { Tabs } from 'expo-router';
import React from 'react';
import { View, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppContext } from '@/lib/context';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { BlurView } from 'expo-blur';

function HomeIcon({ color, focused, size = 24 }: { color: string; focused: boolean; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 2.2 : 1.8}>
      <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill={focused ? color + '15' : 'none'} />
      <Path d="M9 22V12h6v10" />
    </Svg>
  );
}

function JournalIcon({ color, focused, size = 24 }: { color: string; focused: boolean; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 2.2 : 1.8}>
      <Path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" fill={focused ? color + '15' : 'none'} />
      <Line x1="8" y1="7" x2="16" y2="7" />
      <Line x1="8" y1="11" x2="14" y2="11" />
    </Svg>
  );
}

function StatsIcon({ color, focused, size = 24 }: { color: string; focused: boolean; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 2.2 : 1.8}>
      <Path d="M18 20V10" strokeLinecap="round" />
      <Path d="M12 20V4" strokeLinecap="round" />
      <Path d="M6 20v-6" strokeLinecap="round" />
    </Svg>
  );
}

function SettingsIcon({ color, focused, size = 24 }: { color: string; focused: boolean; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 2.2 : 1.8}>
      <Circle cx="12" cy="12" r="3" fill={focused ? color + '15' : 'none'} />
      <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </Svg>
  );
}

export default function TabsLayout() {
  const { theme, colorScheme } = React.use(AppContext);
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colorScheme === 'dark' ? theme.surface + 'E6' : theme.surface + 'F2',
          borderTopWidth: 0,
          height: 88,
          paddingBottom: 30,
          paddingTop: 10,
          ...(Platform.OS === 'ios' ? {} : {
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            shadowRadius: 20,
          }),
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
              <BlurView
                intensity={80}
                tint={colorScheme === 'dark' ? 'dark' : 'light'}
                style={{ flex: 1 }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 0.5,
                  backgroundColor: theme.border,
                  opacity: 0.6,
                }}
              />
            </View>
          ) : null,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.3,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('dashboard.home', 'Accueil'),
          tabBarIcon: ({ color, focused }) => <HomeIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: t('journal.title'),
          tabBarIcon: ({ color, focused }) => <JournalIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, focused }) => <StatsIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings.title'),
          tabBarIcon: ({ color, focused }) => <SettingsIcon color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
