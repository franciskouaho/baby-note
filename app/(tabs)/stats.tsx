import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Svg, { Path, Line, Text as SvgText, Circle, G, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { AppContext } from '@/lib/context';
import { router } from 'expo-router';

const { width: SCREEN_W } = Dimensions.get('window');

/* ------------------------------------------------------------------ */
/*  WHO growth reference curves                                        */
/* ------------------------------------------------------------------ */

const WHO_WEIGHT_BOYS = {
  p3: [2.5, 3.4, 4.4, 5.1, 5.6, 6.1, 6.4, 6.7, 7.0, 7.2, 7.5, 7.7, 7.8],
  p50: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6],
  p97: [4.3, 5.8, 7.1, 8.0, 8.7, 9.3, 9.8, 10.3, 10.7, 11.0, 11.4, 11.7, 12.0],
};
const WHO_WEIGHT_GIRLS = {
  p3: [2.4, 3.2, 4.0, 4.6, 5.1, 5.5, 5.8, 6.1, 6.3, 6.6, 6.8, 7.0, 7.1],
  p50: [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 8.0, 8.2, 8.5, 8.7, 8.9],
  p97: [4.2, 5.5, 6.6, 7.4, 8.1, 8.7, 9.2, 9.6, 10.0, 10.4, 10.7, 11.0, 11.3],
};
const WHO_HEIGHT_BOYS = {
  p3: [46.3, 51.1, 54.7, 57.6, 60.0, 62.0, 63.8, 65.4, 66.8, 68.2, 69.5, 70.7, 71.8],
  p50: [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7],
  p97: [53.4, 58.4, 62.2, 65.3, 67.8, 69.9, 71.6, 73.2, 74.7, 76.0, 77.3, 78.5, 79.7],
};
const WHO_HEIGHT_GIRLS = {
  p3: [45.6, 50.0, 53.2, 55.8, 58.0, 59.9, 61.5, 63.0, 64.3, 65.6, 66.8, 68.0, 69.1],
  p50: [49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8, 74.0],
  p97: [52.7, 57.4, 60.9, 63.8, 66.2, 68.1, 70.0, 71.6, 73.2, 74.7, 76.1, 77.5, 78.9],
};
const WHO_HEAD_BOYS = {
  p3: [32.1, 35.1, 37.0, 38.3, 39.4, 40.3, 41.0, 41.7, 42.2, 42.7, 43.2, 43.6, 44.0],
  p50: [34.5, 37.3, 39.1, 40.5, 41.6, 42.6, 43.3, 44.0, 44.5, 45.0, 45.4, 45.8, 46.1],
  p97: [36.9, 39.5, 41.3, 42.7, 43.9, 44.8, 45.6, 46.3, 46.9, 47.4, 47.8, 48.2, 48.5],
};
const WHO_HEAD_GIRLS = {
  p3: [31.7, 34.3, 36.0, 37.2, 38.2, 39.0, 39.7, 40.4, 40.9, 41.3, 41.7, 42.1, 42.4],
  p50: [33.9, 36.5, 38.3, 39.5, 40.6, 41.5, 42.2, 42.8, 43.4, 43.8, 44.2, 44.6, 44.9],
  p97: [36.1, 38.8, 40.5, 41.9, 43.0, 43.9, 44.7, 45.3, 45.9, 46.4, 46.8, 47.2, 47.5],
};

type GrowthMetric = 'weight' | 'height' | 'head';

/* ------------------------------------------------------------------ */
/*  SVG Growth Chart                                                   */
/* ------------------------------------------------------------------ */

const CHART_W = SCREEN_W - 48;
const CHART_H = 220;
const PADDING = { top: 20, right: 24, bottom: 30, left: 40 };
const PLOT_W = CHART_W - PADDING.left - PADDING.right;
const PLOT_H = CHART_H - PADDING.top - PADDING.bottom;

function GrowthChart({
  metric,
  gender,
  dataPoints,
  primaryColor,
  theme,
}: {
  metric: GrowthMetric;
  gender: 'girl' | 'boy';
  dataPoints: { month: number; value: number }[];
  primaryColor: string;
  theme: any;
}) {
  const curves = useMemo(() => {
    if (metric === 'weight') return gender === 'boy' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS;
    if (metric === 'height') return gender === 'boy' ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS;
    return gender === 'boy' ? WHO_HEAD_BOYS : WHO_HEAD_GIRLS;
  }, [metric, gender]);

  const maxMonths = 12;
  const allValues = [...curves.p3, ...curves.p97];
  const minVal = Math.floor(Math.min(...allValues) * 0.9);
  const maxVal = Math.ceil(Math.max(...allValues) * 1.05);
  const range = maxVal - minVal;

  function x(month: number) {
    return PADDING.left + (month / maxMonths) * PLOT_W;
  }

  function y(val: number) {
    return PADDING.top + PLOT_H - ((val - minVal) / range) * PLOT_H;
  }

  function curvePath(data: number[]): string {
    return data
      .map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
      .join(' ');
  }

  function dataPath(): string {
    if (dataPoints.length === 0) return '';
    return dataPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.month).toFixed(1)},${y(p.value).toFixed(1)}`)
      .join(' ');
  }

  // Fill path between p3 and p97
  function bandPath(): string {
    const top = curves.p97.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const bottom = [...curves.p3].reverse().map((v, i) => {
      const idx = curves.p3.length - 1 - i;
      return `L${x(idx).toFixed(1)},${y(v).toFixed(1)}`;
    }).join(' ');
    return `${top} ${bottom} Z`;
  }

  const yTicks = 5;
  const yStep = range / yTicks;

  return (
    <Svg width={CHART_W} height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
      <Defs>
        <LinearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={primaryColor} stopOpacity={0.06} />
          <Stop offset="1" stopColor={primaryColor} stopOpacity={0.02} />
        </LinearGradient>
        <LinearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={primaryColor} stopOpacity={0.8} />
          <Stop offset="1" stopColor={primaryColor} stopOpacity={1} />
        </LinearGradient>
      </Defs>

      {/* Grid lines */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const val = minVal + i * yStep;
        const yPos = y(val);
        return (
          <G key={`grid-${i}`}>
            <Line
              x1={PADDING.left}
              y1={yPos}
              x2={CHART_W - PADDING.right}
              y2={yPos}
              stroke={theme.border}
              strokeWidth={0.5}
              opacity={0.6}
            />
            <SvgText
              x={PADDING.left - 8}
              y={yPos + 3}
              fill={theme.textTertiary}
              fontSize={9}
              textAnchor="end"
              fontWeight="500"
            >
              {Math.round(val)}
            </SvgText>
          </G>
        );
      })}

      {/* X-axis labels */}
      {Array.from({ length: maxMonths + 1 }).map((_, i) => {
        if (i % 3 !== 0) return null;
        return (
          <SvgText
            key={`x-${i}`}
            x={x(i)}
            y={CHART_H - 6}
            fill={theme.textTertiary}
            fontSize={9}
            textAnchor="middle"
            fontWeight="500"
          >
            {i}m
          </SvgText>
        );
      })}

      {/* WHO band fill */}
      <Path d={bandPath()} fill="url(#bandGrad)" />

      {/* WHO percentile curves */}
      <Path d={curvePath(curves.p97)} stroke={theme.border} strokeWidth={1} strokeDasharray="4,4" fill="none" />
      <Path d={curvePath(curves.p50)} stroke={theme.textTertiary} strokeWidth={1} strokeDasharray="6,3" fill="none" opacity={0.6} />
      <Path d={curvePath(curves.p3)} stroke={theme.border} strokeWidth={1} strokeDasharray="4,4" fill="none" />

      {/* Percentile labels */}
      <SvgText x={CHART_W - PADDING.right + 4} y={y(curves.p97[12]) + 3} fill={theme.textTertiary} fontSize={7} opacity={0.6}>
        97
      </SvgText>
      <SvgText x={CHART_W - PADDING.right + 4} y={y(curves.p50[12]) + 3} fill={theme.textTertiary} fontSize={7} opacity={0.6}>
        50
      </SvgText>
      <SvgText x={CHART_W - PADDING.right + 4} y={y(curves.p3[12]) + 3} fill={theme.textTertiary} fontSize={7} opacity={0.6}>
        3
      </SvgText>

      {/* User data line */}
      {dataPoints.length > 1 && (
        <Path
          d={dataPath()}
          stroke="url(#lineGrad)"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* User data points */}
      {dataPoints.map((p, i) => (
        <G key={`dp-${i}`}>
          <Circle cx={x(p.month)} cy={y(p.value)} r={6} fill={primaryColor} opacity={0.15} />
          <Circle cx={x(p.month)} cy={y(p.value)} r={3.5} fill={primaryColor} />
          <Circle cx={x(p.month)} cy={y(p.value)} r={1.5} fill={theme.surface} />
        </G>
      ))}
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Trend Card                                                         */
/* ------------------------------------------------------------------ */

function TrendCard({
  label,
  todayValue,
  weekAvg,
  color,
  index,
  theme,
  colorScheme,
}: {
  label: string;
  todayValue: number;
  weekAvg: number;
  color: string;
  index: number;
  theme: any;
  colorScheme: 'dark' | 'light';
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(400)}
      style={{
        backgroundColor: theme.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 10,
        borderWidth: colorScheme === 'light' ? 1 : 0,
        borderColor: theme.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            backgroundColor: color + '15',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '500' }}>{label}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
            <Text style={{ color: theme.text, fontSize: 22, fontWeight: '700' }}>
              {todayValue}
            </Text>
            <Text style={{ color: theme.textTertiary, fontSize: 12, fontWeight: '500' }}>
              {'\u00B7'} avg {weekAvg}/j
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats Screen                                                       */
/* ------------------------------------------------------------------ */

export default function StatsScreen() {
  const { t } = useTranslation();
  const { theme, colorScheme, baby, events, growthEntries } = React.use(AppContext);
  const [activeTab, setActiveTab] = useState<'trend' | 'growth'>('growth');
  const [selectedMetric, setSelectedMetric] = useState<GrowthMetric>('weight');

  const chartData = useMemo(() => {
    if (!baby) return [];
    const birthDate = new Date(baby.birthday);
    return growthEntries
      .filter((e) => {
        if (selectedMetric === 'weight') return e.weight != null;
        if (selectedMetric === 'height') return e.height != null;
        return e.headCircumference != null;
      })
      .map((e) => {
        const entryDate = new Date(e.date);
        const diffMs = entryDate.getTime() - birthDate.getTime();
        const month = diffMs / (1000 * 60 * 60 * 24 * 30.44);
        let value = 0;
        if (selectedMetric === 'weight') value = e.weight!;
        else if (selectedMetric === 'height') value = e.height!;
        else value = e.headCircumference!;
        return { month: Math.max(0, month), value };
      })
      .sort((a, b) => a.month - b.month);
  }, [growthEntries, baby, selectedMetric]);

  const trendStats = useMemo(() => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayEvents = events.filter((e) => new Date(e.startTime) >= last24h);
    const weekEvents = events.filter((e) => new Date(e.startTime) >= last7d);

    const sleepToday = todayEvents.filter((e) => e.type === 'sleep').length;
    const feedToday = todayEvents.filter((e) => e.type === 'breastfeeding' || e.type === 'bottle' || e.type === 'solids').length;
    const diaperToday = todayEvents.filter((e) => e.type === 'diaper').length;

    const sleepWeek = weekEvents.filter((e) => e.type === 'sleep').length;
    const feedWeek = weekEvents.filter((e) => e.type === 'breastfeeding' || e.type === 'bottle' || e.type === 'solids').length;
    const diaperWeek = weekEvents.filter((e) => e.type === 'diaper').length;

    return {
      sleepToday,
      feedToday,
      diaperToday,
      sleepWeekAvg: sleepWeek > 0 ? Math.round(sleepWeek / 7) : 0,
      feedWeekAvg: feedWeek > 0 ? Math.round(feedWeek / 7) : 0,
      diaperWeekAvg: diaperWeek > 0 ? Math.round(diaperWeek / 7) : 0,
    };
  }, [events]);

  const metricButtons: { key: GrowthMetric; label: string; unit: string }[] = [
    { key: 'weight', label: t('stats.weight'), unit: 'kg' },
    { key: 'height', label: t('stats.heightLabel'), unit: 'cm' },
    { key: 'head', label: t('stats.head'), unit: 'cm' },
  ];

  const activeTextColor = theme.activeButtonText;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* ---- Header ---- */}
        <Animated.View
          entering={FadeIn.duration(400)}
          style={{
            paddingTop: 60,
            paddingBottom: 8,
            paddingHorizontal: 24,
          }}
        >
          <Text
            style={{
              color: theme.text,
              fontSize: 28,
              fontWeight: '800',
              letterSpacing: -0.3,
            }}
          >
            {t('stats.title')}
          </Text>
        </Animated.View>

        {/* ---- Segment Control ---- */}
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 24,
            marginTop: 16,
            marginBottom: 20,
            backgroundColor: theme.surface,
            borderRadius: 14,
            padding: 3,
            borderWidth: colorScheme === 'light' ? 1 : 0,
            borderColor: theme.border,
          }}
        >
          {(['trend', 'growth'] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                paddingVertical: 10,
                alignItems: 'center',
                borderRadius: 11,
                backgroundColor: activeTab === tab ? theme.primary : 'transparent',
              }}
            >
              <Text
                style={{
                  color: activeTab === tab ? activeTextColor : theme.textTertiary,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                {tab === 'trend' ? t('stats.trend') : t('stats.growth')}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeTab === 'growth' ? (
          <>
            {/* ---- Metric Pills ---- */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
              {metricButtons.map((btn) => {
                const isActive = selectedMetric === btn.key;
                return (
                  <Pressable
                    key={btn.key}
                    onPress={() => setSelectedMetric(btn.key)}
                    style={({ pressed }) => ({
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 12,
                      backgroundColor: isActive ? theme.primary + '18' : theme.surface,
                      borderWidth: 1.5,
                      borderColor: isActive ? theme.primary + '40' : theme.border,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                    })}
                  >
                    <Text
                      style={{
                        color: isActive ? theme.primary : theme.textSecondary,
                        fontSize: 13,
                        fontWeight: isActive ? '700' : '500',
                      }}
                    >
                      {btn.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* ---- Growth Chart ---- */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(500)}
              style={{
                backgroundColor: theme.surface,
                borderRadius: 24,
                marginHorizontal: 16,
                paddingVertical: 20,
                paddingHorizontal: 8,
                alignItems: 'center',
                borderWidth: colorScheme === 'light' ? 1 : 0,
                borderColor: theme.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 12, marginBottom: 16 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600' }}>
                  {selectedMetric === 'weight' ? t('stats.weightKg') : selectedMetric === 'height' ? t('stats.heightCm') : t('stats.headCm')}
                </Text>
                <Text style={{ color: theme.textTertiary, fontSize: 10 }}>
                  WHO {baby?.gender === 'girl' ? '\u2640' : '\u2642'}
                </Text>
              </View>

              <GrowthChart
                metric={selectedMetric}
                gender={baby?.gender ?? 'boy'}
                dataPoints={chartData}
                primaryColor={theme.primary}
                theme={theme}
              />
            </Animated.View>

            {/* Legend */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 14, paddingHorizontal: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 16, height: 1.5, backgroundColor: theme.textTertiary, borderRadius: 1 }} />
                <Text style={{ color: theme.textTertiary, fontSize: 10, fontWeight: '500' }}>P3-P97</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.primary }} />
                <Text style={{ color: theme.textSecondary, fontSize: 10, fontWeight: '500' }}>{baby?.name ?? ''}</Text>
              </View>
            </View>

            {/* Growth CTA */}
            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ paddingHorizontal: 24, marginTop: 20 }}>
              <Pressable
                onPress={() => router.push('/modals/add-growth')}
                style={({ pressed }) => ({
                  backgroundColor: theme.primary,
                  borderRadius: 16,
                  paddingVertical: 14,
                  alignItems: 'center',
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <Text style={{ color: activeTextColor, fontSize: 14, fontWeight: '700' }}>
                  + {t('growth.title', 'Ajouter mesure')}
                </Text>
              </Pressable>
            </Animated.View>
          </>
        ) : (
          /* ---- Trend Tab ---- */
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>
              {t('common.today')}
            </Text>
            <TrendCard label={t('tracking.sleep')} todayValue={trendStats.sleepToday} weekAvg={trendStats.sleepWeekAvg} color="#A599FF" index={0} theme={theme} colorScheme={colorScheme} />
            <TrendCard label={t('tracking.breastfeeding')} todayValue={trendStats.feedToday} weekAvg={trendStats.feedWeekAvg} color="#6BD68A" index={1} theme={theme} colorScheme={colorScheme} />
            <TrendCard label={t('tracking.diaper')} todayValue={trendStats.diaperToday} weekAvg={trendStats.diaperWeekAvg} color="#FFD166" index={2} theme={theme} colorScheme={colorScheme} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
