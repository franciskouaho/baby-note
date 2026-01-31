import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Rect, Path, Line, Ellipse, G } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppContext } from '@/lib/context';

// Phone with baby icons floating out of it
function PhoneIllustration({ color }: { color: string }) {
  return (
    <Svg width={260} height={300} viewBox="0 0 260 300" fill="none">
      {/* === Phone === */}
      <Rect x={85} y={130} width={90} height={160} rx={14} stroke={color} strokeWidth={2.2} />
      <Rect x={92} y={140} width={76} height={130} rx={4} stroke={color} strokeWidth={1} opacity={0.4} />
      <Line x1={120} y1={280} x2={140} y2={280} stroke={color} strokeWidth={2} strokeLinecap="round" />

      {/* === Shine lines on top-right of phone === */}
      <Line x1={185} y1={148} x2={200} y2={135} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={188} y1={162} x2={205} y2={155} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1={190} y1={178} x2={202} y2={175} stroke={color} strokeWidth={1.5} strokeLinecap="round" />

      {/* === Floating icons === */}

      {/* Heart - top left */}
      <G transform="translate(55, 75)">
        <Circle r={26} stroke={color} strokeWidth={1.5} />
        <Path
          d="M0 8 C-2 6 -10 1 -10 -3 C-10 -6.5 -7.5 -8.5 -5 -8.5 C-2.5 -8.5 -1 -6.5 0 -5 C1 -6.5 2.5 -8.5 5 -8.5 C7.5 -8.5 10 -6.5 10 -3 C10 1 2 6 0 8Z"
          stroke={color}
          strokeWidth={1.4}
          fill="none"
          strokeLinejoin="round"
        />
      </G>

      {/* Footprint - top center-left */}
      <G transform="translate(118, 45)">
        <Circle r={22} stroke={color} strokeWidth={1.5} />
        <Ellipse cx={0} cy={3} rx={6} ry={9} stroke={color} strokeWidth={1.2} />
        <Circle cx={-5.5} cy={-7.5} r={2} stroke={color} strokeWidth={1} />
        <Circle cx={-1} cy={-10} r={2.2} stroke={color} strokeWidth={1} />
        <Circle cx={4} cy={-9} r={1.9} stroke={color} strokeWidth={1} />
        <Circle cx={7.5} cy={-5.5} r={1.6} stroke={color} strokeWidth={1} />
      </G>

      {/* Star - top right */}
      <G transform="translate(195, 50)">
        <Circle r={24} stroke={color} strokeWidth={1.5} />
        <Path
          d="M0 -10 L2.5 -3.5 L9.5 -3.5 L4 1 L6 8 L0 4 L-6 8 L-4 1 L-9.5 -3.5 L-2.5 -3.5Z"
          stroke={color}
          strokeWidth={1.3}
          fill="none"
          strokeLinejoin="round"
        />
      </G>

      {/* Pacifier - left */}
      <G transform="translate(40, 168)">
        <Circle r={24} stroke={color} strokeWidth={1.5} />
        <Circle cx={-3} cy={-5} r={4.5} stroke={color} strokeWidth={1.2} />
        <Ellipse cx={2} cy={2} rx={10} ry={7.5} stroke={color} strokeWidth={1.2} />
        <Path d="M6 9 Q8 15 2 13" stroke={color} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      </G>

      {/* Bottle - right */}
      <G transform="translate(220, 110)">
        <Circle r={26} stroke={color} strokeWidth={1.5} />
        <Path d="M-3 -12 C-3 -14 -1 -16 0 -16 C1 -16 3 -14 3 -12V-8H-3V-12Z" stroke={color} strokeWidth={1.2} fill="none" />
        <Rect x={-5} y={-8} width={10} height={2.5} rx={1} stroke={color} strokeWidth={1.2} />
        <Path d="M-5 -5.5H5V8C5 10 3.5 12 1 12H-1C-3.5 12 -5 10 -5 8V-5.5Z" stroke={color} strokeWidth={1.3} fill="none" />
        <Line x1={-3} y1={0} x2={0} y2={0} stroke={color} strokeWidth={1} strokeLinecap="round" />
        <Line x1={-3} y1={3.5} x2={0} y2={3.5} stroke={color} strokeWidth={1} strokeLinecap="round" />
        <Line x1={-3} y1={7} x2={0} y2={7} stroke={color} strokeWidth={1} strokeLinecap="round" />
      </G>

      {/* Thumbs up - bottom left */}
      <G transform="translate(52, 250)">
        <Circle r={22} stroke={color} strokeWidth={1.5} />
        <Path
          d="M-2 -2 L-2 -8 C-2 -10 0 -12 2 -10 L4 -8 L8 -8 C9.5 -8 10 -6.5 10 -5 V2 C10 3.5 9 4.5 7.5 4.5 H0 C-2 4.5 -2 3 -2 2Z"
          stroke={color}
          strokeWidth={1.2}
          fill="none"
          strokeLinejoin="round"
        />
        <Rect x={-9} y={-4} width={5.5} height={9} rx={1.5} stroke={color} strokeWidth={1.2} />
      </G>

      {/* Small decorative dots */}
      <Circle cx={160} cy={25} r={2.5} fill={color} opacity={0.5} />
      <Circle cx={82} cy={120} r={2} fill={color} opacity={0.4} />
      <Circle cx={235} cy={85} r={3} fill={color} opacity={0.4} />
    </Svg>
  );
}

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { theme } = React.use(AppContext);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Illustration */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View entering={FadeIn.delay(100).duration(800)}>
          <PhoneIllustration color={theme.textTertiary} />
        </Animated.View>
      </View>

      {/* Bottom content */}
      <Animated.View
        entering={FadeInDown.delay(500).duration(600)}
        style={{
          paddingHorizontal: 32,
          paddingBottom: insets.bottom + 16,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: '700',
            color: theme.text,
            textAlign: 'center',
            marginBottom: 40,
            lineHeight: 34,
          }}
        >
          {t('welcome.title')}
        </Text>

        <Pressable
          onPress={() => router.push('/onboarding/profile')}
          style={({ pressed }) => ({
            backgroundColor: pressed ? theme.primaryDark : theme.primary,
            borderRadius: 30,
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 6,
          })}
        >
          <Text style={{ fontSize: 17, fontWeight: '600', color: theme.activeButtonText }}>
            {t('welcome.newHere')}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/onboarding/searching')}
          style={({ pressed }) => ({
            backgroundColor: pressed ? theme.surfaceLight : theme.surface,
            borderRadius: 30,
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.border,
          })}
        >
          <Text style={{ fontSize: 17, fontWeight: '600', color: theme.text }}>
            {t('welcome.alreadyUsed')}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
