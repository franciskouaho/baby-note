import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Path, Line, Ellipse, Rect, G } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AppContext } from '@/lib/context';
import { hasBackup } from '@/lib/storage';

function SearchIllustration({ color }: { color: string }) {
  return (
    <Svg width={260} height={270} viewBox="0 0 260 270" fill="none">
      {/* === Magnifying glass === */}
      <Circle cx={155} cy={95} r={52} stroke={color} strokeWidth={2.5} />
      <Line x1={193} y1={133} x2={232} y2={172} stroke={color} strokeWidth={12} strokeLinecap="round" />

      {/* Shine lines */}
      <Line x1={198} y1={55} x2={212} y2={44} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={208} y1={65} x2={220} y2={57} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={214} y1={78} x2={224} y2={74} stroke={color} strokeWidth={1.5} strokeLinecap="round" />

      {/* === Heart in circle === */}
      <G transform="translate(65, 108)">
        <Circle r={28} stroke={color} strokeWidth={1.5} />
        <Path
          d="M0 10 C-2 8 -12 1 -12 -4 C-12 -8 -9 -10.5 -6 -10.5 C-3 -10.5 -1 -8 0 -6 C1 -8 3 -10.5 6 -10.5 C9 -10.5 12 -8 12 -4 C12 1 2 8 0 10Z"
          stroke={color} strokeWidth={1.4} fill="none" strokeLinejoin="round"
        />
      </G>

      {/* === Footprint in circle === */}
      <G transform="translate(92, 185)">
        <Circle r={23} stroke={color} strokeWidth={1.5} />
        <Ellipse cx={0} cy={4} rx={7} ry={10} stroke={color} strokeWidth={1.3} />
        <Circle cx={-6} cy={-9} r={2.2} stroke={color} strokeWidth={1.1} />
        <Circle cx={-1} cy={-11.5} r={2.4} stroke={color} strokeWidth={1.1} />
        <Circle cx={4.5} cy={-10.5} r={2.1} stroke={color} strokeWidth={1.1} />
        <Circle cx={8.5} cy={-7} r={1.8} stroke={color} strokeWidth={1.1} />
      </G>

      {/* === Pacifier in circle === */}
      <G transform="translate(162, 202)">
        <Circle r={26} stroke={color} strokeWidth={1.5} />
        <Circle cx={-4} cy={-7} r={5} stroke={color} strokeWidth={1.3} />
        <Ellipse cx={2} cy={2} rx={11} ry={8.5} stroke={color} strokeWidth={1.3} />
        <Path d="M6 10.5 Q9 17 2 15" stroke={color} strokeWidth={1.3} fill="none" strokeLinecap="round" />
      </G>

      {/* === Photo in circle === */}
      <G transform="translate(98, 248)">
        <Circle r={21} stroke={color} strokeWidth={1.5} />
        <Rect x={-12} y={-10} width={24} height={18} rx={2.5} stroke={color} strokeWidth={1.2} />
        <Path d="M-8 6 L-3 -2 L1 3 L4 -1 L10 6" stroke={color} strokeWidth={1.1} fill="none" strokeLinejoin="round" />
        <Circle cx={-6} cy={-4} r={2.2} stroke={color} strokeWidth={1} />
      </G>

      {/* === Small bubbles === */}
      <Circle cx={48} cy={152} r={3.5} stroke={color} strokeWidth={1.2} />
      <Circle cx={56} cy={200} r={2.5} stroke={color} strokeWidth={1.1} />
      <Circle cx={46} cy={230} r={2} stroke={color} strokeWidth={1} />
    </Svg>
  );
}

export default function SearchingScreen() {
  const { t } = useTranslation();
  const { theme } = React.use(AppContext);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const backup = await hasBackup();
      if (backup) {
        router.replace('/onboarding/backup');
      } else {
        router.replace('/onboarding/profile');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center', paddingBottom: 60 }}>
      <Animated.View entering={FadeIn.delay(100).duration(800)} style={{ alignItems: 'center' }}>
        <SearchIllustration color={theme.textTertiary} />

        <ActivityIndicator
          size="small"
          color={theme.textTertiary}
          style={{ marginTop: 20, marginBottom: 28 }}
        />

        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: theme.text,
            textAlign: 'center',
            marginBottom: 12,
            paddingHorizontal: 32,
          }}
        >
          {t('searching.title')}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: theme.textSecondary,
            textAlign: 'center',
            lineHeight: 22,
            paddingHorizontal: 48,
          }}
        >
          {t('searching.subtitle')}
        </Text>
      </Animated.View>
    </View>
  );
}
