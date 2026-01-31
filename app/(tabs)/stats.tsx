import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Svg, { Path, Line, Text as SvgText, Circle, G, Rect } from 'react-native-svg';
import { AppContext } from '@/lib/context';
import { formatDuration } from '@/lib/helpers';

/* ------------------------------------------------------------------ */
/*  WHO growth reference curves (simplified 3rd, 50th, 97th percentiles) */
/* ------------------------------------------------------------------ */

const WHO_WEIGHT_BOYS = {
  p3:  [2.5, 3.4, 4.4, 5.1, 5.6, 6.1, 6.4, 6.7, 7.0, 7.2, 7.5, 7.7, 7.8],
  p50: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6],
  p97: [4.3, 5.8, 7.1, 8.0, 8.7, 9.3, 9.8, 10.3, 10.7, 11.0, 11.4, 11.7, 12.0],
};

const WHO_WEIGHT_GIRLS = {
  p3:  [2.4, 3.2, 4.0, 4.6, 5.1, 5.5, 5.8, 6.1, 6.3, 6.6, 6.8, 7.0, 7.1],
  p50: [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 8.0, 8.2, 8.5, 8.7, 8.9],
  p97: [4.2, 5.5, 6.6, 7.4, 8.1, 8.7, 9.2, 9.6, 10.0, 10.4, 10.7, 11.0, 11.3],
};

const WHO_HEIGHT_BOYS = {
  p3:  [46.3, 51.1, 54.7, 57.6, 60.0, 62.0, 63.8, 65.4, 66.8, 68.2, 69.5, 70.7, 71.8],
  p50: [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7],
  p97: [53.4, 58.4, 62.2, 65.3, 67.8, 69.9, 71.6, 73.2, 74.7, 76.0, 77.3, 78.5, 79.7],
};

const WHO_HEIGHT_GIRLS = {
  p3:  [45.6, 50.0, 53.2, 55.8, 58.0, 59.9, 61.5, 63.0, 64.3, 65.6, 66.8, 68.0, 69.1],
  p50: [49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8, 74.0],
  p97: [52.7, 57.4, 60.9, 63.8, 66.2, 68.1, 70.0, 71.6, 73.2, 74.7, 76.1, 77.5, 78.9],
};

const WHO_HEAD_BOYS = {
  p3:  [32.1, 35.1, 37.0, 38.3, 39.4, 40.3, 41.0, 41.7, 42.2, 42.7, 43.2, 43.6, 44.0],
  p50: [34.5, 37.3, 39.1, 40.5, 41.6, 42.6, 43.3, 44.0, 44.5, 45.0, 45.4, 45.8, 46.1],
  p97: [36.9, 39.5, 41.3, 42.7, 43.9, 44.8, 45.6, 46.3, 46.9, 47.4, 47.8, 48.2, 48.5],
};

const WHO_HEAD_GIRLS = {
  p3:  [31.7, 34.3, 36.0, 37.2, 38.2, 39.0, 39.7, 40.4, 40.9, 41.3, 41.7, 42.1, 42.4],
  p50: [33.9, 36.5, 38.3, 39.5, 40.6, 41.5, 42.2, 42.8, 43.4, 43.8, 44.2, 44.6, 44.9],
  p97: [36.1, 38.8, 40.5, 41.9, 43.0, 43.9, 44.7, 45.3, 45.9, 46.4, 46.8, 47.2, 47.5],
};

type GrowthMetric = 'weight' | 'height' | 'head';

/* ------------------------------------------------------------------ */
/*  SVG Growth Chart                                                   */
/* ------------------------------------------------------------------ */

const CHART_W = 320;
const CHART_H = 200;
const PADDING = { top: 20, right: 20, bottom: 30, left: 40 };
const PLOT_W = CHART_W - PADDING.left - PADDING.right;
const PLOT_H = CHART_H - PADDING.top - PADDING.bottom;

function GrowthChart({
  metric,
  gender,
  dataPoints,
  primaryColor,
}: {
  metric: GrowthMetric;
  gender: 'girl' | 'boy';
  dataPoints: { month: number; value: number }[];
  primaryColor: string;
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

  const yTicks = 5;
  const yStep = range / yTicks;

  return (
    <Svg width={CHART_W} height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
      {/* Background */}
      <Rect x={0} y={0} width={CHART_W} height={CHART_H} fill="transparent" />

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
              stroke="#2C2C2E"
              strokeWidth={0.5}
            />
            <SvgText
              x={PADDING.left - 6}
              y={yPos + 3}
              fill="#636366"
              fontSize={9}
              textAnchor="end"
            >
              {Math.round(val)}
            </SvgText>
          </G>
        );
      })}

      {/* X-axis labels */}
      {Array.from({ length: maxMonths + 1 }).map((_, i) => {
        if (i % 2 !== 0) return null;
        return (
          <SvgText
            key={`x-${i}`}
            x={x(i)}
            y={CHART_H - 6}
            fill="#636366"
            fontSize={9}
            textAnchor="middle"
          >
            {i}
          </SvgText>
        );
      })}

      {/* WHO percentile curves */}
      <Path
        d={curvePath(curves.p97)}
        stroke="#3A3A3C"
        strokeWidth={1}
        strokeDasharray="4,4"
        fill="none"
      />
      <Path
        d={curvePath(curves.p50)}
        stroke="#636366"
        strokeWidth={1.2}
        strokeDasharray="6,3"
        fill="none"
      />
      <Path
        d={curvePath(curves.p3)}
        stroke="#3A3A3C"
        strokeWidth={1}
        strokeDasharray="4,4"
        fill="none"
      />

      {/* Percentile labels */}
      <SvgText x={CHART_W - PADDING.right + 2} y={y(curves.p97[12]) + 3} fill="#3A3A3C" fontSize={7}>
        97
      </SvgText>
      <SvgText x={CHART_W - PADDING.right + 2} y={y(curves.p50[12]) + 3} fill="#636366" fontSize={7}>
        50
      </SvgText>
      <SvgText x={CHART_W - PADDING.right + 2} y={y(curves.p3[12]) + 3} fill="#3A3A3C" fontSize={7}>
        3
      </SvgText>

      {/* User data line */}
      {dataPoints.length > 1 && (
        <Path
          d={dataPath()}
          stroke={primaryColor}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* User data points */}
      {dataPoints.map((p, i) => (
        <G key={`dp-${i}`}>
          <Circle cx={x(p.month)} cy={y(p.value)} r={5} fill={primaryColor} opacity={0.3} />
          <Circle cx={x(p.month)} cy={y(p.value)} r={3} fill={primaryColor} />
        </G>
      ))}
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Trend summary component                                            */
/* ------------------------------------------------------------------ */

function TrendCard({
  label,
  value,
  color,
  index,
}: {
  label: string;
  value: string;
  color: string;
  index: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(400)}
      style={{
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: color + '20',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: color,
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#8E8E93', fontSize: 12 }}>{label}</Text>
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginTop: 2 }}>
          {value}
        </Text>
      </View>
    </Animated.View>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats Screen                                                       */
/* ------------------------------------------------------------------ */

export default function StatsScreen() {
  const { t } = useTranslation();
  const { theme, baby, events, growthEntries } = React.use(AppContext);
  const [activeTab, setActiveTab] = useState<'trend' | 'growth'>('growth');
  const [selectedMetric, setSelectedMetric] = useState<GrowthMetric>('weight');

  /* Map growth entries to chart data points */
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

  /* Trend computations */
  const trendStats = useMemo(() => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayEvents = events.filter((e) => new Date(e.startTime) >= last24h);
    const weekEvents = events.filter((e) => new Date(e.startTime) >= last7d);

    const sleepToday = todayEvents.filter((e) => e.type === 'sleep');
    const feedToday = todayEvents.filter(
      (e) => e.type === 'breastfeeding' || e.type === 'bottle' || e.type === 'solids',
    );
    const diaperToday = todayEvents.filter((e) => e.type === 'diaper');

    const sleepWeek = weekEvents.filter((e) => e.type === 'sleep');
    const feedWeek = weekEvents.filter(
      (e) => e.type === 'breastfeeding' || e.type === 'bottle' || e.type === 'solids',
    );
    const diaperWeek = weekEvents.filter((e) => e.type === 'diaper');

    return {
      sleepToday: sleepToday.length,
      feedToday: feedToday.length,
      diaperToday: diaperToday.length,
      sleepWeekAvg: sleepWeek.length > 0 ? Math.round(sleepWeek.length / 7) : 0,
      feedWeekAvg: feedWeek.length > 0 ? Math.round(feedWeek.length / 7) : 0,
      diaperWeekAvg: diaperWeek.length > 0 ? Math.round(diaperWeek.length / 7) : 0,
    };
  }, [events]);

  const metricButtons: { key: GrowthMetric; label: string; color: string }[] = [
    { key: 'weight', label: t('stats.weight'), color: '#FF6B6B' },
    { key: 'height', label: t('stats.heightLabel'), color: '#8E8E93' },
    { key: 'head', label: t('stats.head'), color: '#8E8E93' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* ---- Title ---- */}
        <Animated.View
          entering={FadeIn.duration(400)}
          style={{
            paddingTop: 60,
            paddingBottom: 8,
            paddingHorizontal: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth={2}>
            <Path d="M18 20V10" strokeLinecap="round" />
            <Path d="M12 20V4" strokeLinecap="round" />
            <Path d="M6 20v-6" strokeLinecap="round" />
          </Svg>
          <Text
            style={{
              color: theme.primary,
              fontSize: 20,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
          >
            {t('stats.title')}
          </Text>
        </Animated.View>

        {/* ---- Tab Buttons ---- */}
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 24,
            marginTop: 16,
            marginBottom: 20,
            gap: 4,
          }}
        >
          <Pressable
            onPress={() => setActiveTab('trend')}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: 'center',
              borderBottomWidth: 2,
              borderBottomColor: activeTab === 'trend' ? theme.primary : 'transparent',
            }}
          >
            <Text
              style={{
                color: activeTab === 'trend' ? theme.primary : '#636366',
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              {t('stats.trend')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('growth')}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: 'center',
              borderBottomWidth: 2,
              borderBottomColor: activeTab === 'growth' ? theme.primary : 'transparent',
            }}
          >
            <Text
              style={{
                color: activeTab === 'growth' ? theme.primary : '#636366',
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              {t('stats.growth')}
            </Text>
          </Pressable>
        </View>

        {activeTab === 'growth' ? (
          <>
            {/* ---- Metric Selectors ---- */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 16,
                marginBottom: 24,
              }}
            >
              {metricButtons.map((btn) => {
                const isActive = selectedMetric === btn.key;
                return (
                  <Pressable
                    key={btn.key}
                    onPress={() => setSelectedMetric(btn.key)}
                    style={{ alignItems: 'center', gap: 6 }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: isActive ? '#FF6B6B' : '#2C2C2E',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontSize: 11,
                          fontWeight: '700',
                        }}
                      >
                        {btn.key === 'weight' ? 'kg' : 'cm'}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: isActive ? '#FFFFFF' : '#636366',
                        fontSize: 11,
                        fontWeight: isActive ? '600' : '400',
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
                backgroundColor: '#1C1C1E',
                borderRadius: 20,
                marginHorizontal: 16,
                padding: 16,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: '#8E8E93',
                  fontSize: 11,
                  marginBottom: 12,
                  alignSelf: 'flex-start',
                }}
              >
                {selectedMetric === 'weight'
                  ? t('stats.weightKg')
                  : selectedMetric === 'height'
                    ? t('stats.heightCm')
                    : t('stats.headCm')}
              </Text>

              <GrowthChart
                metric={selectedMetric}
                gender={baby?.gender ?? 'boy'}
                dataPoints={chartData}
                primaryColor={theme.primary}
              />

              <Text style={{ color: '#636366', fontSize: 10, marginTop: 8 }}>
                {t('stats.months')}
              </Text>
            </Animated.View>

            {/* Legend */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 20,
                marginTop: 16,
                paddingHorizontal: 24,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View
                  style={{
                    width: 16,
                    height: 2,
                    backgroundColor: '#636366',
                    borderStyle: 'dashed',
                  }}
                />
                <Text style={{ color: '#636366', fontSize: 10 }}>WHO 3-97%</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.primary,
                  }}
                />
                <Text style={{ color: '#8E8E93', fontSize: 10 }}>
                  {baby?.name ?? ''}
                </Text>
              </View>
            </View>
          </>
        ) : (
          /* ---- Trend Tab ---- */
          <View style={{ paddingHorizontal: 16 }}>
            <Text
              style={{
                color: '#8E8E93',
                fontSize: 12,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 12,
              }}
            >
              {t('common.today')}
            </Text>
            <TrendCard
              label={t('tracking.sleep')}
              value={`${trendStats.sleepToday}x`}
              color="#8B7BF4"
              index={0}
            />
            <TrendCard
              label={t('tracking.breastfeeding')}
              value={`${trendStats.feedToday}x`}
              color="#4ECB71"
              index={1}
            />
            <TrendCard
              label={t('tracking.diaper')}
              value={`${trendStats.diaperToday}x`}
              color="#F4C542"
              index={2}
            />

            <Text
              style={{
                color: '#8E8E93',
                fontSize: 12,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginTop: 20,
                marginBottom: 12,
              }}
            >
              {t('stats.trend')} (7d avg)
            </Text>
            <TrendCard
              label={t('tracking.sleep')}
              value={`${trendStats.sleepWeekAvg}x / ${t('common.today').toLowerCase()}`}
              color="#8B7BF4"
              index={3}
            />
            <TrendCard
              label={t('tracking.breastfeeding')}
              value={`${trendStats.feedWeekAvg}x / ${t('common.today').toLowerCase()}`}
              color="#4ECB71"
              index={4}
            />
            <TrendCard
              label={t('tracking.diaper')}
              value={`${trendStats.diaperWeekAvg}x / ${t('common.today').toLowerCase()}`}
              color="#F4C542"
              index={5}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
