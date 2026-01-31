import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Path, Circle, Line, Rect, Ellipse, G } from 'react-native-svg';
import { AppContext } from '@/lib/context';
import { getBabyAge, formatEventTime, getLastEventOfType } from '@/lib/helpers';

/* ------------------------------------------------------------------ */
/*  SVG Icon Components                                                */
/* ------------------------------------------------------------------ */

function StatsNavIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M18 20V10" strokeLinecap="round" />
      <Path d="M12 20V4" strokeLinecap="round" />
      <Path d="M6 20v-6" strokeLinecap="round" />
    </Svg>
  );
}

function SettingsNavIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </Svg>
  );
}

function BabyFaceIcon({ size = 80 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      <Circle cx="40" cy="40" r="38" fill="#F4C9A8" />
      <Circle cx="40" cy="40" r="32" fill="#FDDCC5" />
      {/* Eyes */}
      <Ellipse cx="30" cy="38" rx="3" ry="3.5" fill="#3A3A3C" />
      <Ellipse cx="50" cy="38" rx="3" ry="3.5" fill="#3A3A3C" />
      {/* Eye highlights */}
      <Circle cx="31" cy="37" r="1" fill="#FFFFFF" />
      <Circle cx="51" cy="37" r="1" fill="#FFFFFF" />
      {/* Cheeks */}
      <Ellipse cx="24" cy="44" rx="5" ry="3" fill="#F8B4B4" opacity={0.4} />
      <Ellipse cx="56" cy="44" rx="5" ry="3" fill="#F8B4B4" opacity={0.4} />
      {/* Mouth */}
      <Path d="M35 48 Q40 53 45 48" stroke="#E88B7A" strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* Hair tufts */}
      <Path d="M30 12 Q32 6 36 10" stroke="#C9A06C" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M38 10 Q40 4 44 8" stroke="#C9A06C" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M46 11 Q48 5 52 10" stroke="#C9A06C" strokeWidth={2} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

function SleepIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Crib base */}
      <Rect x="4" y="8" width="20" height="14" rx="3" stroke="#8B7BF4" strokeWidth={2} fill="none" />
      {/* Crib legs */}
      <Line x1="7" y1="22" x2="7" y2="26" stroke="#8B7BF4" strokeWidth={2} strokeLinecap="round" />
      <Line x1="21" y1="22" x2="21" y2="26" stroke="#8B7BF4" strokeWidth={2} strokeLinecap="round" />
      {/* Crib bars */}
      <Line x1="10" y1="8" x2="10" y2="22" stroke="#8B7BF4" strokeWidth={1.5} opacity={0.5} />
      <Line x1="14" y1="8" x2="14" y2="22" stroke="#8B7BF4" strokeWidth={1.5} opacity={0.5} />
      <Line x1="18" y1="8" x2="18" y2="22" stroke="#8B7BF4" strokeWidth={1.5} opacity={0.5} />
      {/* Moon */}
      <Path d="M20 3 Q22 5 20 7 Q23 6 22 3Z" fill="#8B7BF4" opacity={0.7} />
    </Svg>
  );
}

function BreastfeedingIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Mother circle */}
      <Circle cx="11" cy="8" r="4" stroke="#4ECB71" strokeWidth={2} fill="none" />
      {/* Mother body */}
      <Path d="M7 14 Q7 20 11 22 Q15 20 15 14" stroke="#4ECB71" strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* Baby circle */}
      <Circle cx="20" cy="14" r="3" stroke="#4ECB71" strokeWidth={1.5} fill="none" />
      {/* Baby body */}
      <Path d="M17 18 Q17 22 20 23 Q23 22 23 18" stroke="#4ECB71" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      {/* Heart */}
      <Path d="M14 10 Q14 8 16 9 Q14 11 14 10 Q14 8 12 9 Q14 11 14 10Z" fill="#4ECB71" opacity={0.6} />
    </Svg>
  );
}

function DiaperIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Diaper shape */}
      <Path
        d="M6 8 L22 8 L24 14 Q24 22 14 24 Q4 22 4 14 Z"
        stroke="#F4C542"
        strokeWidth={2}
        fill="none"
        strokeLinejoin="round"
      />
      {/* Tab left */}
      <Path d="M6 8 L4 12" stroke="#F4C542" strokeWidth={2} strokeLinecap="round" />
      {/* Tab right */}
      <Path d="M22 8 L24 12" stroke="#F4C542" strokeWidth={2} strokeLinecap="round" />
      {/* Star decoration */}
      <Path d="M14 14 L15 16 L14 15 L13 16 Z" fill="#F4C542" opacity={0.6} />
      <Circle cx="11" cy="15" r="1" fill="#F4C542" opacity={0.4} />
      <Circle cx="17" cy="15" r="1" fill="#F4C542" opacity={0.4} />
    </Svg>
  );
}

function PlusIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Line x1="9" y1="3" x2="9" y2="15" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1="3" y1="9" x2="15" y2="9" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Tracking Card Component                                            */
/* ------------------------------------------------------------------ */

function TrackingCard({
  title,
  icon,
  accentColor,
  cardBg,
  lastTime,
  notYetText,
  onAdd,
  index,
}: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  cardBg: string;
  lastTime: string | null;
  notYetText: string;
  onAdd: () => void;
  index: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 100).duration(500).springify()}
      style={{
        flex: 1,
        backgroundColor: cardBg,
        borderRadius: 20,
        padding: 14,
        alignItems: 'center',
        minHeight: 150,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ alignItems: 'center', gap: 8 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: accentColor + '20',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </View>
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: '#8E8E93',
            fontSize: 11,
            textAlign: 'center',
          }}
        >
          {lastTime ? formatEventTime(lastTime) : notYetText}
        </Text>
      </View>
      <Pressable
        onPress={onAdd}
        style={({ pressed }) => ({
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: pressed ? accentColor + 'CC' : accentColor,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 8,
        })}
      >
        <PlusIcon color="#000000" size={16} />
      </Pressable>
    </Animated.View>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Screen                                                   */
/* ------------------------------------------------------------------ */

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { baby, events, theme } = React.use(AppContext);

  const babyAge = baby ? getBabyAge(baby.birthday) : '';
  const lastSleep = getLastEventOfType(events, 'sleep');
  const lastBreastfeeding = getLastEventOfType(events, 'breastfeeding');
  const lastDiaper = getLastEventOfType(events, 'diaper');

  function handleAddEvent(type: string) {
    router.push(`/modals/add-event?type=${type}`);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Header row: Stats / Avatar / Settings ---- */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            paddingTop: 60,
            paddingBottom: 8,
          }}
        >
          <Pressable
            onPress={() => router.navigate('/(tabs)/stats')}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: pressed ? '#2C2C2E' : '#1C1C1E',
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <StatsNavIcon color="#8E8E93" />
          </Pressable>

          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                borderWidth: 3,
                borderColor: theme.primary,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {baby?.photoUri ? (
                <Image
                  source={{ uri: baby.photoUri }}
                  style={{ width: 82, height: 82, borderRadius: 41 }}
                />
              ) : (
                <BabyFaceIcon size={80} />
              )}
            </View>
          </View>

          <Pressable
            onPress={() => router.navigate('/(tabs)/settings')}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: pressed ? '#2C2C2E' : '#1C1C1E',
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <SettingsNavIcon color="#8E8E93" />
          </Pressable>
        </Animated.View>

        {/* ---- Baby name & age ---- */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={{ alignItems: 'center', marginTop: 12 }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
          >
            {baby?.name ?? '---'}
          </Text>
          <Text
            style={{
              color: '#8E8E93',
              fontSize: 14,
              marginTop: 4,
            }}
          >
            {babyAge}
          </Text>
        </Animated.View>

        {/* ---- Height / Weight row ---- */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(500)}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 40,
            marginTop: 16,
            marginBottom: 24,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#636366', fontSize: 12 }}>
              {t('dashboard.height')}
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginTop: 2 }}>
              {baby?.height ? `${baby.height} cm` : '--'}
            </Text>
          </View>
          <View
            style={{
              width: 1,
              height: 30,
              backgroundColor: '#2C2C2E',
            }}
          />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#636366', fontSize: 12 }}>
              {t('dashboard.weight')}
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginTop: 2 }}>
              {baby?.weight ? `${baby.weight} kg` : '--'}
            </Text>
          </View>
        </Animated.View>

        {/* ---- Tracking Cards ---- */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            gap: 10,
          }}
        >
          <TrackingCard
            title={t('tracking.sleep')}
            icon={<SleepIcon />}
            accentColor="#8B7BF4"
            cardBg="#1C1C2E"
            lastTime={lastSleep}
            notYetText={t('dashboard.notYet')}
            onAdd={() => handleAddEvent('sleep')}
            index={0}
          />
          <TrackingCard
            title={t('tracking.breastfeeding')}
            icon={<BreastfeedingIcon />}
            accentColor="#4ECB71"
            cardBg="#1C2E1C"
            lastTime={lastBreastfeeding}
            notYetText={t('dashboard.notYet')}
            onAdd={() => handleAddEvent('breastfeeding')}
            index={1}
          />
          <TrackingCard
            title={t('tracking.diaper')}
            icon={<DiaperIcon />}
            accentColor="#F4C542"
            cardBg="#2E2E1C"
            lastTime={lastDiaper}
            notYetText={t('dashboard.notYet')}
            onAdd={() => handleAddEvent('diaper')}
            index={2}
          />
        </View>

        {/* ---- Helper text ---- */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          style={{ alignItems: 'center', marginTop: 32, paddingHorizontal: 40 }}
        >
          <Text
            style={{
              color: '#636366',
              fontSize: 13,
              textAlign: 'center',
              lineHeight: 18,
            }}
          >
            {t('dashboard.addEvent')}
          </Text>
        </Animated.View>
      </ScrollView>

      {/* ---- Floating Action Button ---- */}
      <Pressable
        onPress={() => handleAddEvent('sleep')}
        style={({ pressed }) => ({
          position: 'absolute',
          bottom: 100,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: pressed ? '#3A3A3C' : '#2C2C2E',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        })}
      >
        <PlusIcon color={theme.primary} size={26} />
      </Pressable>
    </View>
  );
}
