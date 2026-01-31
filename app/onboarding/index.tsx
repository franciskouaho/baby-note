import React from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Rect, Path, Line, Ellipse, G } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppContext } from '@/lib/context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- SVG Icon Components ---

function CribIcon({ size = 44, color = '#636366' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      {/* Mattress base */}
      <Rect x="6" y="22" width="32" height="8" rx="3" stroke={color} strokeWidth="2" fill="none" />
      {/* Headboard */}
      <Path d="M8 22V12C8 10 10 8 14 8H30C34 8 36 10 36 12V22" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Rails */}
      <Line x1="14" y1="10" x2="14" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="22" y1="10" x2="22" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="30" y1="10" x2="30" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Legs */}
      <Line x1="10" y1="30" x2="10" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="34" y1="30" x2="34" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function BottleIcon({ size = 40, color = '#636366' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Nipple */}
      <Path d="M17 6C17 4 19 2 20 2C21 2 23 4 23 6V10H17V6Z" stroke={color} strokeWidth="1.8" fill="none" />
      {/* Cap ring */}
      <Rect x="15" y="10" width="10" height="3" rx="1" stroke={color} strokeWidth="1.8" fill="none" />
      {/* Body */}
      <Path d="M15 13H25V32C25 34.2 23.2 36 21 36H19C16.8 36 15 34.2 15 32V13Z" stroke={color} strokeWidth="2" fill="none" />
      {/* Measurement lines */}
      <Line x1="17" y1="20" x2="20" y2="20" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <Line x1="17" y1="25" x2="20" y2="25" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <Line x1="17" y1="30" x2="20" y2="30" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  );
}

function DiaperIcon({ size = 42, color = '#636366' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      {/* Main diaper shape */}
      <Path
        d="M8 14C8 12 10 10 14 10H28C32 10 34 12 34 14V22C34 28 28 32 21 32C14 32 8 28 8 22V14Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* Waistband */}
      <Path d="M10 14H32" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Tape tabs */}
      <Path d="M8 16L5 14L8 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M34 16L37 14L34 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Heart decoration */}
      <Path d="M19 20C19 18.5 20 18 21 19C22 18 23 18.5 23 20C23 21.5 21 23 21 23C21 23 19 21.5 19 20Z" stroke={color} strokeWidth="1.2" fill="none" />
    </Svg>
  );
}

function StrollerIcon({ size = 44, color = '#636366' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      {/* Handle */}
      <Path d="M32 8C32 8 34 8 34 10V18" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Carriage body */}
      <Path d="M10 18H34V28C34 30 32 32 30 32H14C12 32 10 30 10 28V18Z" stroke={color} strokeWidth="2" fill="none" />
      {/* Hood */}
      <Path d="M10 18C10 12 16 8 22 8" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Wheels */}
      <Circle cx="14" cy="36" r="3" stroke={color} strokeWidth="2" fill="none" />
      <Circle cx="30" cy="36" r="3" stroke={color} strokeWidth="2" fill="none" />
      {/* Axle */}
      <Line x1="14" y1="32" x2="14" y2="33" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="30" y1="32" x2="30" y2="33" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

function RattleIcon({ size = 40, color = '#636366' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Top circle */}
      <Circle cx="20" cy="13" r="9" stroke={color} strokeWidth="2" fill="none" />
      {/* Decoration dots */}
      <Circle cx="17" cy="11" r="1.5" fill={color} />
      <Circle cx="23" cy="11" r="1.5" fill={color} />
      <Circle cx="20" cy="15" r="1.5" fill={color} />
      {/* Handle */}
      <Path d="M18 22H22V34C22 35.1 21.1 36 20 36C18.9 36 18 35.1 18 34V22Z" stroke={color} strokeWidth="2" fill="none" />
      {/* Handle ring */}
      <Rect x="16" y="21" width="8" height="3" rx="1.5" stroke={color} strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

function BabyFaceIcon({ size = 96 }: { size?: number }) {
  const faceColor = '#F4A683';
  const featureColor = '#000000';
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      {/* Face circle */}
      <Circle cx="48" cy="48" r="42" fill={faceColor} />
      {/* Cheeks */}
      <Circle cx="30" cy="54" r="6" fill="#F7BFA3" opacity={0.6} />
      <Circle cx="66" cy="54" r="6" fill="#F7BFA3" opacity={0.6} />
      {/* Left eye */}
      <Circle cx="36" cy="42" r="3.5" fill={featureColor} />
      <Circle cx="37.5" cy="40.5" r="1.2" fill="#FFFFFF" />
      {/* Right eye */}
      <Circle cx="60" cy="42" r="3.5" fill={featureColor} />
      <Circle cx="61.5" cy="40.5" r="1.2" fill="#FFFFFF" />
      {/* Smile */}
      <Path d="M38 56C40 62 56 62 58 56" stroke={featureColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Hair tuft */}
      <Path d="M42 8C44 14 48 10 50 6C52 12 56 10 54 8" stroke={faceColor} strokeWidth="3" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

// Icon positions arranged in a circle around center
const ICON_POSITIONS = [
  { x: -90, y: -100, rotate: -15 },   // top-left
  { x: 70, y: -110, rotate: 10 },     // top-right
  { x: -110, y: 20, rotate: -8 },     // middle-left
  { x: 100, y: 10, rotate: 12 },      // middle-right
  { x: -70, y: 110, rotate: -5 },     // bottom-left
  { x: 80, y: 100, rotate: 8 },       // bottom-right
];

const ICONS = [CribIcon, BottleIcon, DiaperIcon, StrollerIcon, RattleIcon];

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { theme } = React.use(AppContext);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Icons and baby face area */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 280, height: 300, justifyContent: 'center', alignItems: 'center' }}>
          {/* Scattered baby icons */}
          {ICONS.map((IconComponent, index) => {
            const pos = ICON_POSITIONS[index];
            return (
              <Animated.View
                key={index}
                entering={FadeIn.delay(300 + index * 150).duration(600)}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  marginLeft: pos.x - 22,
                  marginTop: pos.y - 22,
                  transform: [{ rotate: `${pos.rotate}deg` }],
                  opacity: 0.7,
                }}
              >
                <IconComponent />
              </Animated.View>
            );
          })}

          {/* Center baby face */}
          <Animated.View entering={FadeIn.delay(100).duration(800)}>
            <BabyFaceIcon size={96} />
          </Animated.View>
        </View>
      </View>

      {/* Bottom content */}
      <Animated.View
        entering={FadeIn.delay(600).duration(700)}
        style={{
          paddingHorizontal: 32,
          paddingBottom: insets.bottom + 16,
        }}
      >
        {/* Title */}
        <Text
          style={{
            fontSize: 34,
            fontWeight: '700',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          {t('welcome.title')}
        </Text>

        {/* Subtitle */}
        <Text
          style={{
            fontSize: 16,
            lineHeight: 22,
            color: '#8E8E93',
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          {t('welcome.subtitle')}
        </Text>

        {/* Continue button */}
        <Pressable
          onPress={() => router.push('/onboarding/profile')}
          style={({ pressed }) => ({
            backgroundColor: pressed ? theme.primaryDark : theme.primary,
            borderRadius: 30,
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          })}
        >
          <Text style={{ fontSize: 17, fontWeight: '600', color: '#000000' }}>
            {t('welcome.continue')}
          </Text>
        </Pressable>

        {/* Terms text */}
        <Text
          style={{
            fontSize: 12,
            lineHeight: 16,
            color: '#636366',
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          {t('welcome.terms')}{' '}
          <Text style={{ color: '#8E8E93', textDecorationLine: 'underline' }}>
            {t('welcome.termsLink')}
          </Text>{' '}
          {t('welcome.and')}{' '}
          <Text style={{ color: '#8E8E93', textDecorationLine: 'underline' }}>
            {t('welcome.privacyLink')}
          </Text>
        </Text>
      </Animated.View>
    </View>
  );
}
