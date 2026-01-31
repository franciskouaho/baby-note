import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Svg, { Path, Circle, Line, Rect, Ellipse, Polyline } from 'react-native-svg';
import { AppContext } from '@/lib/context';

/* ------------------------------------------------------------------ */
/*  Back arrow                                                         */
/* ------------------------------------------------------------------ */

function BackIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Alimentation Icons                                                 */
/* ------------------------------------------------------------------ */

function BreastfeedingIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10" cy="7" r="3.5" stroke={color} strokeWidth={1.8} />
      <Path d="M6 12 Q6 17 10 18.5 Q14 17 14 12" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="18" cy="11" r="2.5" stroke={color} strokeWidth={1.5} />
      <Path d="M15.5 14.5 Q15.5 18 18 19 Q20.5 18 20.5 14.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function BottleIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="8" y="3" width="8" height="3" rx="1" stroke={color} strokeWidth={1.8} />
      <Path d="M7 6 L7 19 Q7 21 9 21 L15 21 Q17 21 17 19 L17 6" stroke={color} strokeWidth={1.8} />
      <Line x1="7" y1="12" x2="17" y2="12" stroke={color} strokeWidth={1.2} opacity={0.5} />
      <Line x1="7" y1="15" x2="17" y2="15" stroke={color} strokeWidth={1.2} opacity={0.3} />
    </Svg>
  );
}

function SolidsIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Ellipse cx="12" cy="16" rx="8" ry="4" stroke={color} strokeWidth={1.8} />
      <Path d="M4 16 Q4 12 12 12 Q20 12 20 16" stroke={color} strokeWidth={1.8} />
      <Line x1="12" y1="4" x2="12" y2="10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="12" cy="10" r="2" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

function PumpedIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="8" y="8" width="8" height="13" rx="2" stroke={color} strokeWidth={1.8} />
      <Path d="M8 12 L6 10 L6 6 L10 6 L10 8" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="8" y1="14" x2="16" y2="14" stroke={color} strokeWidth={1.2} opacity={0.5} />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Activité Icons                                                     */
/* ------------------------------------------------------------------ */

function DiaperIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 7 L19 7 L21 12 Q21 19 12 21 Q3 19 3 12 Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M5 7 L3 10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M19 7 L21 10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function SleepIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StrollerIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="20" r="2" stroke={color} strokeWidth={1.8} />
      <Circle cx="18" cy="20" r="2" stroke={color} strokeWidth={1.8} />
      <Path d="M3 3h2l3 10h10l2-6H8" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BathIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12h16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M4 12 Q4 20 12 20 Q20 20 20 12" stroke={color} strokeWidth={1.8} />
      <Path d="M7 12V5a2 2 0 012-2h0a2 2 0 012 2v1" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="15" cy="8" r="1.5" stroke={color} strokeWidth={1.5} />
      <Circle cx="18" cy="6" r="1" stroke={color} strokeWidth={1.3} />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Croissance Icons                                                   */
/* ------------------------------------------------------------------ */

function WeightIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="10" width="18" height="11" rx="2" stroke={color} strokeWidth={1.8} />
      <Path d="M7 10 V8 a5 5 0 0110 0 V10" stroke={color} strokeWidth={1.8} />
      <Circle cx="12" cy="16" r="2" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

function HeightIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M8 7 L12 3 L16 7" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 17 L12 21 L16 17" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function HeadIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.8} />
      <Path d="M12 4 A8 8 0 0 1 20 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth={1} opacity={0.3} />
      <Line x1="12" y1="4" x2="12" y2="20" stroke={color} strokeWidth={1} opacity={0.3} />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Santé Icons                                                        */
/* ------------------------------------------------------------------ */

function DoctorIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.8} />
      <Path d="M4 20 Q4 14 12 14 Q20 14 20 20" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="12" y1="6" x2="12" y2="10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="10" y1="8" x2="14" y2="8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function VaccineIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 3l3 3-8 8-3-3 8-8z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M12 6l3-3 3 3-3 3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="6" y1="10" x2="10" y2="14" stroke={color} strokeWidth={1.2} opacity={0.5} />
      <Path d="M4 14l-2 2 4 4 2-2" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ThermometerIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" stroke={color} strokeWidth={1.8} />
      <Circle cx="11.5" cy="17.5" r="2" stroke={color} strokeWidth={1.5} />
      <Line x1="11.5" y1="15.5" x2="11.5" y2="8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function IllnessIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="12" y1="8" x2="12" y2="16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function TreatmentIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="10" width="18" height="5" rx="2.5" stroke={color} strokeWidth={1.8} transform="rotate(-30 12 12.5)" />
      <Line x1="12" y1="8" x2="12" y2="17" stroke={color} strokeWidth={1.2} opacity={0.4} transform="rotate(-30 12 12.5)" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Humeur Icons                                                       */
/* ------------------------------------------------------------------ */

function HappyIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
      <Circle cx="9" cy="10" r="1.2" fill={color} />
      <Circle cx="15" cy="10" r="1.2" fill={color} />
      <Path d="M8 14.5 Q12 18.5 16 14.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function GoodIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
      <Circle cx="9" cy="10" r="1.2" fill={color} />
      <Circle cx="15" cy="10" r="1.2" fill={color} />
      <Path d="M8.5 15 Q12 17 15.5 15" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function SadIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
      <Circle cx="9" cy="10" r="1.2" fill={color} />
      <Circle cx="15" cy="10" r="1.2" fill={color} />
      <Path d="M8.5 16.5 Q12 13.5 15.5 16.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function CryingIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
      <Circle cx="9" cy="10" r="1.2" fill={color} />
      <Circle cx="15" cy="10" r="1.2" fill={color} />
      <Path d="M8.5 16.5 Q12 13 15.5 16.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
      <Path d="M9 12.5 Q8.5 14 9 15" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M15 12.5 Q15.5 14 15 15" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Événement important Icons                                          */
/* ------------------------------------------------------------------ */

function StarIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Category definitions                                               */
/* ------------------------------------------------------------------ */

interface ActionItem {
  key: string;
  labelKey: string;
  icon: React.FC<{ color: string; size?: number }>;
  color: string;
  bgTint: string;
  action: () => void;
}

interface CategoryDef {
  titleKey: string;
  items: ActionItem[];
}

function buildCategories(t: (k: string) => string): CategoryDef[] {
  return [
    {
      titleKey: 'addScreen.feeding',
      items: [
        {
          key: 'breastfeeding',
          labelKey: 'tracking.breastfeeding',
          icon: BreastfeedingIcon,
          color: '#6BD68A',
          bgTint: '#6BD68A',
          action: () => router.push('/modals/add-event?type=breastfeeding'),
        },
        {
          key: 'bottle',
          labelKey: 'tracking.bottle',
          icon: BottleIcon,
          color: '#7EC8F2',
          bgTint: '#7EC8F2',
          action: () => router.push('/modals/add-event?type=bottle'),
        },
        {
          key: 'solids',
          labelKey: 'tracking.solids',
          icon: SolidsIcon,
          color: '#FFB088',
          bgTint: '#FFB088',
          action: () => router.push('/modals/add-event?type=solids'),
        },
        {
          key: 'pumped_milk',
          labelKey: 'tracking.pumpedMilk',
          icon: PumpedIcon,
          color: '#C9A0E0',
          bgTint: '#C9A0E0',
          action: () => router.push('/modals/add-event?type=pumped_milk'),
        },
      ],
    },
    {
      titleKey: 'addScreen.activity',
      items: [
        {
          key: 'diaper',
          labelKey: 'tracking.diaper',
          icon: DiaperIcon,
          color: '#FFD166',
          bgTint: '#8B7A3A',
          action: () => router.push('/modals/add-event?type=diaper'),
        },
        {
          key: 'sleep',
          labelKey: 'tracking.sleep',
          icon: SleepIcon,
          color: '#A599FF',
          bgTint: '#A599FF',
          action: () => router.push('/modals/add-event?type=sleep'),
        },
        {
          key: 'walk',
          labelKey: 'addScreen.walk',
          icon: StrollerIcon,
          color: '#5EC4B6',
          bgTint: '#5EC4B6',
          action: () => router.push('/modals/add-event?type=walk'),
        },
        {
          key: 'bath',
          labelKey: 'addScreen.bath',
          icon: BathIcon,
          color: '#9B8FE0',
          bgTint: '#9B8FE0',
          action: () => router.push('/modals/add-event?type=bath'),
        },
      ],
    },
    {
      titleKey: 'addScreen.growth',
      items: [
        {
          key: 'weight',
          labelKey: 'addScreen.weight',
          icon: WeightIcon,
          color: '#E88B7A',
          bgTint: '#E88B7A',
          action: () => router.push('/modals/add-growth'),
        },
        {
          key: 'height',
          labelKey: 'addScreen.height',
          icon: HeightIcon,
          color: '#E88B7A',
          bgTint: '#E88B7A',
          action: () => router.push('/modals/add-growth'),
        },
        {
          key: 'head',
          labelKey: 'addScreen.headCirc',
          icon: HeadIcon,
          color: '#E88B7A',
          bgTint: '#E88B7A',
          action: () => router.push('/modals/add-growth'),
        },
      ],
    },
    {
      titleKey: 'addScreen.health',
      items: [
        {
          key: 'doctor',
          labelKey: 'addScreen.doctor',
          icon: DoctorIcon,
          color: '#4DB8A4',
          bgTint: '#4DB8A4',
          action: () => router.push('/modals/add-event?type=doctor'),
        },
        {
          key: 'vaccine',
          labelKey: 'addScreen.vaccine',
          icon: VaccineIcon,
          color: '#4DB8A4',
          bgTint: '#4DB8A4',
          action: () => router.push('/modals/add-event?type=vaccine'),
        },
        {
          key: 'temperature',
          labelKey: 'addScreen.temperature',
          icon: ThermometerIcon,
          color: '#4DB8A4',
          bgTint: '#4DB8A4',
          action: () => router.push('/modals/add-event?type=temperature'),
        },
        {
          key: 'illness',
          labelKey: 'addScreen.illness',
          icon: IllnessIcon,
          color: '#4DB8A4',
          bgTint: '#4DB8A4',
          action: () => router.push('/modals/add-event?type=illness'),
        },
        {
          key: 'treatment',
          labelKey: 'addScreen.treatment',
          icon: TreatmentIcon,
          color: '#4DB8A4',
          bgTint: '#4DB8A4',
          action: () => router.push('/modals/add-event?type=treatment'),
        },
      ],
    },
    {
      titleKey: 'addScreen.mood',
      items: [
        {
          key: 'happy',
          labelKey: 'addScreen.happy',
          icon: HappyIcon,
          color: '#B580D1',
          bgTint: '#B580D1',
          action: () => router.push('/modals/add-event?type=mood&subtype=happy'),
        },
        {
          key: 'good',
          labelKey: 'addScreen.good',
          icon: GoodIcon,
          color: '#B580D1',
          bgTint: '#B580D1',
          action: () => router.push('/modals/add-event?type=mood&subtype=good'),
        },
        {
          key: 'sad',
          labelKey: 'addScreen.sad',
          icon: SadIcon,
          color: '#B580D1',
          bgTint: '#B580D1',
          action: () => router.push('/modals/add-event?type=mood&subtype=sad'),
        },
        {
          key: 'crying',
          labelKey: 'addScreen.crying',
          icon: CryingIcon,
          color: '#B580D1',
          bgTint: '#B580D1',
          action: () => router.push('/modals/add-event?type=mood&subtype=crying'),
        },
      ],
    },
    {
      titleKey: 'addScreen.milestone',
      items: [
        {
          key: 'first_steps',
          labelKey: 'addScreen.firstSteps',
          icon: StarIcon,
          color: '#C4A84D',
          bgTint: '#8B7A3A',
          action: () => router.push('/modals/add-event?type=milestone&subtype=first_steps'),
        },
        {
          key: 'sat_up',
          labelKey: 'addScreen.satUp',
          icon: StarIcon,
          color: '#C4A84D',
          bgTint: '#8B7A3A',
          action: () => router.push('/modals/add-event?type=milestone&subtype=sat_up'),
        },
        {
          key: 'first_word',
          labelKey: 'addScreen.firstWord',
          icon: StarIcon,
          color: '#C4A84D',
          bgTint: '#8B7A3A',
          action: () => router.push('/modals/add-event?type=milestone&subtype=first_word'),
        },
        {
          key: 'first_tooth',
          labelKey: 'addScreen.firstTooth',
          icon: StarIcon,
          color: '#C4A84D',
          bgTint: '#8B7A3A',
          action: () => router.push('/modals/add-event?type=milestone&subtype=first_tooth'),
        },
        {
          key: 'custom_event',
          labelKey: 'addScreen.customEvent',
          icon: StarIcon,
          color: '#C4A84D',
          bgTint: '#8B7A3A',
          action: () => router.push('/modals/add-event?type=milestone&subtype=custom'),
        },
      ],
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Circular Action Button                                             */
/* ------------------------------------------------------------------ */

function CircleButton({
  item,
  index,
  theme,
  colorScheme,
  t,
}: {
  item: ActionItem;
  index: number;
  theme: any;
  colorScheme: 'dark' | 'light';
  t: (k: string) => string;
}) {
  const Icon = item.icon;

  const bgColor = colorScheme === 'dark'
    ? item.bgTint + '28'
    : item.color + '14';
  const borderColor = colorScheme === 'dark'
    ? item.color + '45'
    : item.color + '30';

  return (
    <Animated.View
      entering={FadeInDown.delay(80 + index * 30).duration(300)}
      style={styles.circleWrapper}
    >
      <Pressable
        onPress={item.action}
        style={({ pressed }) => ({
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: pressed ? item.color + '35' : bgColor,
          borderWidth: 1.8,
          borderColor: pressed ? item.color + '70' : borderColor,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          marginBottom: 10,
          transform: [{ scale: pressed ? 0.9 : 1 }],
        })}
      >
        <Icon color={item.color} size={28} />
      </Pressable>
      <Text
        style={{
          color: theme.textSecondary,
          fontSize: 11,
          fontWeight: '500',
          textAlign: 'center',
          lineHeight: 14,
        }}
        numberOfLines={2}
      >
        {t(item.labelKey)}
      </Text>
    </Animated.View>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Screen (Hub)                                                   */
/* ------------------------------------------------------------------ */

export default function AddScreen() {
  const { t } = useTranslation();
  const { theme, colorScheme } = React.use(AppContext);
  const insets = useSafeAreaInsets();

  const categories = buildCategories(t);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* ---- Header ---- */}
      <Animated.View
        entering={FadeIn.duration(300)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: insets.top + 8,
          paddingBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={({ pressed }) => ({
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: theme.surface,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <BackIcon color={theme.textSecondary} size={22} />
        </Pressable>

        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 42 }}>
          <Text style={{ color: '#6BD68A', fontSize: 22, fontWeight: '800', marginRight: 6 }}>+</Text>
          <Text style={{ color: theme.primary, fontSize: 20, fontWeight: '700', letterSpacing: 0.3 }}>
            {t('addScreen.title', 'Ajouter')}
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category, catIdx) => (
          <View key={category.titleKey} style={{ marginBottom: 24 }}>
            <Animated.View
              entering={FadeInDown.delay(40 + catIdx * 40).duration(350)}
              style={{ paddingHorizontal: 24, marginBottom: 18 }}
            >
              <Text
                style={{
                  color: theme.textTertiary,
                  fontSize: 13,
                  fontWeight: '600',
                  letterSpacing: 0.3,
                }}
              >
                {t(category.titleKey)}
              </Text>
              <View
                style={{
                  height: StyleSheet.hairlineWidth,
                  backgroundColor: theme.border,
                  marginTop: 10,
                }}
              />
            </Animated.View>

            <View style={styles.grid}>
              {category.items.map((item, itemIdx) => (
                <CircleButton
                  key={item.key}
                  item={item}
                  index={catIdx * 5 + itemIdx}
                  theme={theme}
                  colorScheme={colorScheme}
                  t={t}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  circleWrapper: {
    alignItems: 'center',
    width: 82,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 14,
  },
});
