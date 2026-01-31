import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn, FadeInRight } from 'react-native-reanimated';
import Svg, { Path, Circle, Line, Rect, Ellipse, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { AppContext } from '@/lib/context';
import { getBabyAge, formatEventTime, getLastEventOfType } from '@/lib/helpers';

const { width: SCREEN_W } = Dimensions.get('window');

/* ------------------------------------------------------------------ */
/*  SVG Icon Components                                                */
/* ------------------------------------------------------------------ */

function BabyFaceIcon({ size = 80 }: { size?: number }) {
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
      <Path d="M30 12 Q32 6 36 10" stroke="#C9A06C" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M38 10 Q40 4 44 8" stroke="#C9A06C" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M46 11 Q48 5 52 10" stroke="#C9A06C" strokeWidth={2} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

function SleepIcon({ color = '#A599FF', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BreastfeedingIcon({ color = '#6BD68A', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10" cy="7" r="3.5" stroke={color} strokeWidth={1.8} />
      <Path d="M6 12 Q6 17 10 18.5 Q14 17 14 12" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="18" cy="11" r="2.5" stroke={color} strokeWidth={1.5} />
      <Path d="M15.5 14.5 Q15.5 18 18 19 Q20.5 18 20.5 14.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function DiaperIcon({ color = '#FFD166', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 7 L19 7 L21 12 Q21 19 12 21 Q3 19 3 12 Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M5 7 L3 10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M19 7 L21 10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function BottleIcon({ color = '#7EC8F2', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="8" y="3" width="8" height="3" rx="1" stroke={color} strokeWidth={1.8} />
      <Path d="M7 6 L7 19 Q7 21 9 21 L15 21 Q17 21 17 19 L17 6" stroke={color} strokeWidth={1.8} />
      <Line x1="7" y1="12" x2="17" y2="12" stroke={color} strokeWidth={1.2} opacity={0.5} />
    </Svg>
  );
}

function SolidsIcon({ color = '#FFB088', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Ellipse cx="12" cy="16" rx="8" ry="4" stroke={color} strokeWidth={1.8} />
      <Path d="M4 16 Q4 12 12 12 Q20 12 20 16" stroke={color} strokeWidth={1.8} />
      <Line x1="12" y1="4" x2="12" y2="10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="12" cy="10" r="2" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

function PumpedIcon({ color = '#C9A0E0', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="8" y="8" width="8" height="13" rx="2" stroke={color} strokeWidth={1.8} />
      <Path d="M8 12 L6 10 L6 6 L10 6 L10 8" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="8" y1="14" x2="16" y2="14" stroke={color} strokeWidth={1.2} opacity={0.5} />
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

function GrowthIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M2 14 L6 8 L10 10 L14 2" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ArrowRightIcon({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path d="M5 3l4 4-4 4" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick action data                                                  */
/* ------------------------------------------------------------------ */

const QUICK_ACTIONS = [
  { type: 'sleep', icon: SleepIcon, color: '#A599FF', cardKey: 'cardSleep' as const },
  { type: 'breastfeeding', icon: BreastfeedingIcon, color: '#6BD68A', cardKey: 'cardFeeding' as const },
  { type: 'diaper', icon: DiaperIcon, color: '#FFD166', cardKey: 'cardDiaper' as const },
  { type: 'bottle', icon: BottleIcon, color: '#7EC8F2', cardKey: 'cardBottle' as const },
  { type: 'solids', icon: SolidsIcon, color: '#FFB088', cardKey: 'cardSolids' as const },
  { type: 'pumped_milk', icon: PumpedIcon, color: '#C9A0E0', cardKey: 'cardPumped' as const },
];

/* ------------------------------------------------------------------ */
/*  Dashboard Screen                                                   */
/* ------------------------------------------------------------------ */

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { baby, events, theme, colorScheme } = React.use(AppContext);

  const babyAge = baby ? getBabyAge(baby.birthday) : '';
  const lastSleep = getLastEventOfType(events, 'sleep');
  const lastFeeding = getLastEventOfType(events, 'breastfeeding');
  const lastDiaper = getLastEventOfType(events, 'diaper');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('home.hello', 'Bonjour') : hour < 18 ? t('home.hello', 'Bonjour') : t('home.goodEvening', 'Bonsoir');

  function handleAddEvent(type: string) {
    router.push(`/modals/add-event?type=${type}`);
  }

  const eventColors: Record<string, string> = {
    sleep: '#A599FF',
    breastfeeding: '#6BD68A',
    bottle: '#7EC8F2',
    solids: '#FFB088',
    pumped_milk: '#C9A0E0',
    diaper: '#FFD166',
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Hero Header ---- */}
        <Animated.View
          entering={FadeIn.duration(500)}
          style={{
            paddingHorizontal: 24,
            marginBottom: 28,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  color: theme.textSecondary,
                  marginBottom: 4,
                }}
              >
                {greeting} {'\u2728'}
              </Text>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: '800',
                  color: theme.text,
                  lineHeight: 38,
                  letterSpacing: -0.5,
                }}
              >
                {baby?.name ?? 'Baby Note'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
                <View
                  style={{
                    backgroundColor: theme.primary + '18',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: theme.primary, fontSize: 13, fontWeight: '600' }}>
                    {babyAge}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={() => router.navigate('/(tabs)/settings')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              })}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 20,
                  overflow: 'hidden',
                  backgroundColor: theme.surfaceElevated,
                  borderWidth: 2.5,
                  borderColor: theme.primary + '30',
                  shadowColor: theme.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: 4,
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
            </Pressable>
          </View>
        </Animated.View>

        {/* ---- Vital Stats Strip ---- */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}
            style={{ marginBottom: 28 }}
          >
            {/* Last Sleep */}
            {lastSleep && (
              <View
                style={{
                  backgroundColor: theme.cardSleep,
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <SleepIcon color="#A599FF" size={16} />
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '500' }}>
                  {formatEventTime(lastSleep)}
                </Text>
              </View>
            )}

            {/* Last Feeding */}
            {lastFeeding && (
              <View
                style={{
                  backgroundColor: theme.cardFeeding,
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <BreastfeedingIcon color="#6BD68A" size={16} />
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '500' }}>
                  {formatEventTime(lastFeeding)}
                </Text>
              </View>
            )}

            {/* Last Diaper */}
            {lastDiaper && (
              <View
                style={{
                  backgroundColor: theme.cardDiaper,
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <DiaperIcon color="#FFD166" size={16} />
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '500' }}>
                  {formatEventTime(lastDiaper)}
                </Text>
              </View>
            )}

            {/* Height */}
            <View
              style={{
                backgroundColor: theme.surface,
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <Text style={{ fontSize: 12 }}>{'\u{1F4CF}'}</Text>
              <Text style={{ color: theme.text, fontSize: 13, fontWeight: '700' }}>
                {baby?.height ? `${baby.height}` : '--'}
              </Text>
              <Text style={{ color: theme.textTertiary, fontSize: 11 }}>cm</Text>
            </View>

            {/* Weight */}
            <View
              style={{
                backgroundColor: theme.surface,
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <Text style={{ fontSize: 12 }}>{'\u2696\uFE0F'}</Text>
              <Text style={{ color: theme.text, fontSize: 13, fontWeight: '700' }}>
                {baby?.weight ? `${baby.weight}` : '--'}
              </Text>
              <Text style={{ color: theme.textTertiary, fontSize: 11 }}>kg</Text>
            </View>
          </ScrollView>
        </Animated.View>

        {/* ---- Quick Actions Grid ---- */}
        <Animated.View entering={FadeInDown.delay(160).duration(500)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 14 }}>
            <Text style={{ fontSize: 13, color: theme.textTertiary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
              {t('dashboard.actions', 'Actions rapides')}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingHorizontal: 20,
              gap: 10,
            }}
          >
            {QUICK_ACTIONS.map((action, i) => {
              const Icon = action.icon;
              const tKey = action.type === 'pumped_milk' ? 'tracking.pumpedMilk' : `tracking.${action.type}`;
              return (
                <Animated.View
                  key={action.type}
                  entering={FadeInDown.delay(200 + i * 50).duration(400)}
                  style={{ width: (SCREEN_W - 60) / 3 }}
                >
                  <Pressable
                    onPress={() => handleAddEvent(action.type)}
                    style={({ pressed }) => ({
                      backgroundColor: pressed
                        ? (colorScheme === 'dark' ? action.color + '20' : action.color + '18')
                        : (colorScheme === 'dark' ? theme[action.cardKey] : theme.surface),
                      borderRadius: 22,
                      paddingVertical: 18,
                      alignItems: 'center',
                      gap: 10,
                      borderWidth: colorScheme === 'light' ? 1 : 0,
                      borderColor: colorScheme === 'light' ? theme.border : 'transparent',
                      shadowColor: colorScheme === 'light' ? action.color : 'transparent',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: colorScheme === 'light' ? 0.08 : 0,
                      shadowRadius: 12,
                      elevation: colorScheme === 'light' ? 2 : 0,
                      transform: [{ scale: pressed ? 0.96 : 1 }],
                    })}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 15,
                        backgroundColor: action.color + '18',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon color={action.color} size={22} />
                    </View>
                    <Text
                      style={{
                        color: theme.text,
                        fontSize: 11,
                        fontWeight: '600',
                        textAlign: 'center',
                        letterSpacing: 0.1,
                      }}
                      numberOfLines={1}
                    >
                      {t(tKey)}
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* ---- Growth Entry CTA ---- */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={{ paddingHorizontal: 24, marginTop: 24 }}>
          <Pressable
            onPress={() => router.push('/modals/add-growth')}
            style={({ pressed }) => ({
              backgroundColor: pressed ? theme.primary + '15' : theme.primary + '0A',
              borderRadius: 20,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              borderWidth: 1.5,
              borderColor: theme.primary + '25',
              borderStyle: 'dashed',
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                backgroundColor: theme.primary + '18',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GrowthIcon color={theme.primary} size={18} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>
                {t('growth.title', 'Croissance')}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
                {t('dashboard.trackGrowth', 'Suivre poids, taille, PC')}
              </Text>
            </View>
            <ArrowRightIcon color={theme.primary} size={16} />
          </Pressable>
        </Animated.View>

        {/* ---- Recent Activity ---- */}
        {events.length > 0 && (
          <Animated.View entering={FadeInDown.delay(580).duration(500)} style={{ marginTop: 28 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 14 }}>
              <Text style={{ fontSize: 13, color: theme.textTertiary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
                {t('home.recentActivity', 'Activite recente')}
              </Text>
              <Pressable onPress={() => router.navigate('/(tabs)/journal')} hitSlop={8}>
                <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '600' }}>
                  {t('common.seeAll', 'Voir tout')}
                </Text>
              </Pressable>
            </View>

            <View style={{ paddingHorizontal: 24, gap: 8 }}>
              {events.slice(0, 3).map((event, idx) => {
                const color = eventColors[event.type] || theme.textSecondary;
                return (
                  <Animated.View key={event.id} entering={FadeInRight.delay(600 + idx * 60).duration(400)}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: theme.surface,
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        borderRadius: 16,
                        gap: 12,
                        borderWidth: colorScheme === 'light' ? 1 : 0,
                        borderColor: theme.border,
                      }}
                    >
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: color,
                        }}
                      />
                      <Text style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: '500' }}>
                        {t(`tracking.${event.type === 'pumped_milk' ? 'pumpedMilk' : event.type}`)}
                      </Text>
                      <Text style={{ color: theme.textTertiary, fontSize: 12, fontWeight: '500' }}>
                        {formatEventTime(event.startTime)}
                      </Text>
                    </View>
                  </Animated.View>
                );
              })}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* ---- Floating Add Button ---- */}
      <Animated.View entering={FadeInDown.delay(700).duration(500)} style={{ position: 'absolute', bottom: 100, right: 24 }}>
        <Pressable
          onPress={() => router.push('/modals/add')}
          style={({ pressed }) => ({
            width: 58,
            height: 58,
            borderRadius: 22,
            backgroundColor: pressed ? theme.primary : theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 14,
            elevation: 8,
            transform: [{ scale: pressed ? 0.92 : 1 }],
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <PlusIcon color={theme.activeButtonText} size={22} />
        </Pressable>
      </Animated.View>
    </View>
  );
}
