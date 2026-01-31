import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Path, Line, Ellipse, Rect, G } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppContext } from '@/lib/context';

const HEART = 'M0 10 C-2 8 -12 1 -12 -4 C-12 -8 -9 -10.5 -6 -10.5 C-3 -10.5 -1 -8 0 -6 C1 -8 3 -10.5 6 -10.5 C9 -10.5 12 -8 12 -4 C12 1 2 8 0 10Z';

function sparkle(cx: number, cy: number, r: number): string {
  const s = r * 0.22;
  return `M${cx} ${cy - r} L${cx + s} ${cy - s} L${cx + r} ${cy} L${cx + s} ${cy + s} L${cx} ${cy + r} L${cx - s} ${cy + s} L${cx - r} ${cy} L${cx - s} ${cy - s} Z`;
}

function BackupIllustration({ color }: { color: string }) {
  return (
    <Svg width={300} height={360} viewBox="0 0 300 360" fill="none">
      {/* ===== ROW 1 ===== */}

      {/* Heart circle - top left */}
      <G transform="translate(58, 55)">
        <Circle r={38} stroke={color} strokeWidth={1.5} />
        <Path d={HEART} stroke={color} strokeWidth={1.4} fill="none" strokeLinejoin="round" />
      </G>

      <Path d={sparkle(132, 38, 7)} fill={color} opacity={0.7} />

      {/* Pacifier circle - top right */}
      <G transform="translate(212, 48)">
        <Circle r={42} stroke={color} strokeWidth={1.5} />
        <Circle cx={-5} cy={-8} r={6} stroke={color} strokeWidth={1.3} />
        <Ellipse cx={3} cy={3} rx={14} ry={11} stroke={color} strokeWidth={1.3} />
        <Path d="M8 14 Q12 22 3 19" stroke={color} strokeWidth={1.3} fill="none" strokeLinecap="round" />
      </G>

      <Path d={sparkle(270, 28, 6)} fill={color} opacity={0.6} />

      {/* Decorative curve from pacifier */}
      <Path d="M254 56 Q282 68 278 102 Q272 135 250 150" stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" />

      {/* ===== ROW 2 ===== */}

      {/* Heart circle - mid left */}
      <G transform="translate(52, 158)">
        <Circle r={32} stroke={color} strokeWidth={1.5} />
        <G transform="scale(0.85)">
          <Path d={HEART} stroke={color} strokeWidth={1.6} fill="none" strokeLinejoin="round" />
        </G>
      </G>

      {/* Footprint circle - center */}
      <G transform="translate(152, 150)">
        <Circle r={35} stroke={color} strokeWidth={1.5} />
        <Ellipse cx={0} cy={4} rx={8} ry={12} stroke={color} strokeWidth={1.3} />
        <Circle cx={-7} cy={-10} r={2.5} stroke={color} strokeWidth={1.2} />
        <Circle cx={-1.5} cy={-13} r={2.7} stroke={color} strokeWidth={1.2} />
        <Circle cx={4.5} cy={-12} r={2.4} stroke={color} strokeWidth={1.2} />
        <Circle cx={9} cy={-8} r={2.1} stroke={color} strokeWidth={1.2} />
        <Circle cx={12} cy={-3} r={1.8} stroke={color} strokeWidth={1.1} />
      </G>

      <Path d={sparkle(220, 132, 6)} fill={color} opacity={0.6} />

      {/* Heart circle - small right */}
      <G transform="translate(255, 160)">
        <Circle r={26} stroke={color} strokeWidth={1.5} />
        <G transform="scale(0.65)">
          <Path d={HEART} stroke={color} strokeWidth={2} fill="none" strokeLinejoin="round" />
        </G>
      </G>

      {/* ===== ROW 3 ===== */}

      {/* Heart circle - lower left */}
      <G transform="translate(52, 260)">
        <Circle r={32} stroke={color} strokeWidth={1.5} />
        <G transform="scale(0.85)">
          <Path d={HEART} stroke={color} strokeWidth={1.6} fill="none" strokeLinejoin="round" />
        </G>
      </G>

      {/* Pacifier circle - lower center */}
      <G transform="translate(150, 258)">
        <Circle r={33} stroke={color} strokeWidth={1.5} />
        <Circle cx={-4} cy={-7} r={5.5} stroke={color} strokeWidth={1.3} />
        <Ellipse cx={2} cy={2} rx={12} ry={9} stroke={color} strokeWidth={1.3} />
        <Path d="M7 11 Q10 18 2 16" stroke={color} strokeWidth={1.3} fill="none" strokeLinecap="round" />
      </G>

      {/* Photo circle - right */}
      <G transform="translate(248, 248)">
        <Circle r={34} stroke={color} strokeWidth={1.5} />
        <Rect x={-15} y={-12} width={30} height={22} rx={3} stroke={color} strokeWidth={1.3} />
        <Path d="M-10 8 L-4 -2 L1 4 L5 -1 L12 8" stroke={color} strokeWidth={1.2} fill="none" strokeLinejoin="round" />
        <Circle cx={-7} cy={-5} r={2.8} stroke={color} strokeWidth={1.1} />
      </G>

      <Path d={sparkle(290, 212, 5)} fill={color} opacity={0.5} />

      {/* ===== ROW 4 ===== */}

      <Path d={sparkle(110, 320, 6)} fill={color} opacity={0.6} />
      <Path d={sparkle(188, 332, 5)} fill={color} opacity={0.5} />

      {/* Mountain circle - bottom right */}
      <G transform="translate(265, 318)">
        <Circle r={28} stroke={color} strokeWidth={1.5} />
        <Path d="M-18 10 L-8 -6 L-2 2 L6 -10 L18 10" stroke={color} strokeWidth={1.3} fill="none" strokeLinejoin="round" />
        <Line x1={-20} y1={10} x2={20} y2={10} stroke={color} strokeWidth={1} strokeLinecap="round" />
      </G>

      {/* Decorative curve under mountain */}
      <Path d="M238 332 Q218 342 212 336" stroke={color} strokeWidth={1.3} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

export default function BackupScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { theme, completeOnboarding } = React.use(AppContext);

  const handleRestore = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleNewProfile = () => {
    router.push('/onboarding/profile');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Illustration */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View entering={FadeIn.delay(100).duration(800)}>
          <BackupIllustration color={theme.textTertiary} />
        </Animated.View>
      </View>

      {/* Text and buttons */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(600)}
        style={{ paddingHorizontal: 32, paddingBottom: insets.bottom + 16 }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: theme.text,
            textAlign: 'center',
            marginBottom: 48,
            lineHeight: 32,
          }}
        >
          {t('backup.found')}
        </Text>

        <Pressable
          onPress={handleRestore}
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
            {t('backup.restore')}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleNewProfile}
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
            {t('backup.newProfile')}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
