import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, Pressable, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Svg, { Path, Circle, Line, Rect, Ellipse, Polyline } from 'react-native-svg';
import { AppContext } from '@/lib/context';
import { formatEventTime, formatEventDate, formatDuration } from '@/lib/helpers';
import type { BabyEvent, EventType } from '@/lib/types';

/* ------------------------------------------------------------------ */
/*  Filter icon components                                             */
/* ------------------------------------------------------------------ */

function SleepFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BreastfeedingFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10" cy="7" r="3.5" stroke={color} strokeWidth={1.8} />
      <Path d="M6 12 Q6 17 10 18.5 Q14 17 14 12" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <Circle cx="18" cy="11" r="2.5" stroke={color} strokeWidth={1.5} />
      <Path d="M15.5 14.5 Q15.5 18 18 19 Q20.5 18 20.5 14.5" stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

function BottleFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="8" y="3" width="8" height="3" rx="1" stroke={color} strokeWidth={1.8} />
      <Path d="M7 6 L7 19 Q7 21 9 21 L15 21 Q17 21 17 19 L17 6" stroke={color} strokeWidth={1.8} fill="none" />
      <Line x1="7" y1="12" x2="17" y2="12" stroke={color} strokeWidth={1.2} opacity={0.5} />
    </Svg>
  );
}

function SolidsFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Ellipse cx="12" cy="16" rx="8" ry="4" stroke={color} strokeWidth={1.8} />
      <Path d="M4 16 Q4 12 12 12 Q20 12 20 16" stroke={color} strokeWidth={1.8} fill="none" />
      <Line x1="12" y1="4" x2="12" y2="10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="12" cy="10" r="2" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

function PumpedMilkFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="8" y="8" width="8" height="13" rx="2" stroke={color} strokeWidth={1.8} />
      <Path d="M8 12 L6 10 L6 6 L10 6 L10 8" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="8" y1="14" x2="16" y2="14" stroke={color} strokeWidth={1.2} opacity={0.5} />
    </Svg>
  );
}

function DiaperFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 7 L19 7 L21 12 Q21 19 12 21 Q3 19 3 12 Z" stroke={color} strokeWidth={1.8} fill="none" strokeLinejoin="round" />
      <Path d="M5 7 L3 10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M19 7 L21 10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function WalkFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="20" r="2" stroke={color} strokeWidth={1.8} />
      <Circle cx="18" cy="20" r="2" stroke={color} strokeWidth={1.8} />
      <Path d="M3 3h2l3 10h10l2-6H8" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BathFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12h16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M4 12 Q4 20 12 20 Q20 20 20 12" stroke={color} strokeWidth={1.8} fill="none" />
      <Path d="M7 12V5a2 2 0 012-2h0a2 2 0 012 2v1" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function DoctorFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.8} />
      <Path d="M4 20 Q4 14 12 14 Q20 14 20 20" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <Line x1="12" y1="6" x2="12" y2="10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="10" y1="8" x2="14" y2="8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function VaccineFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 3l3 3-8 8-3-3 8-8z" stroke={color} strokeWidth={1.8} fill="none" strokeLinejoin="round" />
      <Path d="M12 6l3-3 3 3-3 3" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 14l-2 2 4 4 2-2" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TemperatureFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" stroke={color} strokeWidth={1.8} fill="none" />
      <Circle cx="11.5" cy="17.5" r="2" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

function IllnessFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" stroke={color} strokeWidth={1.8} fill="none" strokeLinejoin="round" />
      <Line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="12" y1="8" x2="12" y2="16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function TreatmentFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="10" width="18" height="5" rx="2.5" stroke={color} strokeWidth={1.8} fill="none" transform="rotate(-30 12 12.5)" />
    </Svg>
  );
}

function MoodFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
      <Circle cx="9" cy="10" r="1.2" fill={color} />
      <Circle cx="15" cy="10" r="1.2" fill={color} />
      <Path d="M8 14.5 Q12 18.5 16 14.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function MilestoneFilterIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth={1.8} fill="none" strokeLinejoin="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter types and their styling                                     */
/* ------------------------------------------------------------------ */

interface FilterDef {
  type: EventType;
  labelKey: string;
  color: string;
  IconComponent: React.FC<{ color?: string; size?: number }>;
}

const FILTERS: FilterDef[] = [
  { type: 'sleep', labelKey: 'tracking.sleep', color: '#A599FF', IconComponent: SleepFilterIcon },
  { type: 'breastfeeding', labelKey: 'tracking.breastfeeding', color: '#6BD68A', IconComponent: BreastfeedingFilterIcon },
  { type: 'bottle', labelKey: 'tracking.bottle', color: '#7EC8F2', IconComponent: BottleFilterIcon },
  { type: 'solids', labelKey: 'tracking.solids', color: '#FFB088', IconComponent: SolidsFilterIcon },
  { type: 'pumped_milk', labelKey: 'tracking.pumpedMilk', color: '#C9A0E0', IconComponent: PumpedMilkFilterIcon },
  { type: 'diaper', labelKey: 'tracking.diaper', color: '#FFD166', IconComponent: DiaperFilterIcon },
  { type: 'walk', labelKey: 'tracking.walk', color: '#5EC4B6', IconComponent: WalkFilterIcon },
  { type: 'bath', labelKey: 'tracking.bath', color: '#9B8FE0', IconComponent: BathFilterIcon },
  { type: 'doctor', labelKey: 'tracking.doctor', color: '#4DB8A4', IconComponent: DoctorFilterIcon },
  { type: 'vaccine', labelKey: 'tracking.vaccine', color: '#4DB8A4', IconComponent: VaccineFilterIcon },
  { type: 'temperature', labelKey: 'tracking.temperature', color: '#4DB8A4', IconComponent: TemperatureFilterIcon },
  { type: 'illness', labelKey: 'tracking.illness', color: '#4DB8A4', IconComponent: IllnessFilterIcon },
  { type: 'treatment', labelKey: 'tracking.treatment', color: '#4DB8A4', IconComponent: TreatmentFilterIcon },
  { type: 'mood', labelKey: 'tracking.mood', color: '#B580D1', IconComponent: MoodFilterIcon },
  { type: 'milestone', labelKey: 'tracking.milestone', color: '#C4A84D', IconComponent: MilestoneFilterIcon },
];

/* ------------------------------------------------------------------ */
/*  Event detail renderer                                              */
/* ------------------------------------------------------------------ */

function getEventDetail(event: BabyEvent, t: (key: string) => string): string {
  switch (event.type) {
    case 'sleep':
      if (event.endTime) {
        const start = new Date(event.startTime);
        const end = new Date(event.endTime);
        const mins = Math.round((end.getTime() - start.getTime()) / 60000);
        return formatDuration(mins);
      }
      return formatEventTime(event.startTime);
    case 'breastfeeding':
      return `${formatDuration(event.durationMinutes)} - ${t(`modal.${event.side}`)}`;
    case 'bottle':
      return `${event.amountMl} ml`;
    case 'diaper':
      return t(`modal.${event.diaperType}`);
    case 'solids':
      return event.food + (event.amountGrams ? ` - ${event.amountGrams}g` : '');
    case 'pumped_milk':
      return `${event.amountMl} ml`;
    case 'walk':
      return event.durationMinutes ? formatDuration(event.durationMinutes) : formatEventTime(event.startTime);
    case 'bath':
      return event.durationMinutes ? formatDuration(event.durationMinutes) : formatEventTime(event.startTime);
    case 'doctor':
      return event.notes || formatEventTime(event.startTime);
    case 'vaccine':
      return event.vaccineName || formatEventTime(event.startTime);
    case 'temperature':
      return `${event.temperature}°C`;
    case 'illness':
      return event.description || formatEventTime(event.startTime);
    case 'treatment': {
      const parts = [event.treatmentName, event.dosage].filter(Boolean);
      return parts.length > 0 ? parts.join(' - ') : formatEventTime(event.startTime);
    }
    case 'mood':
      return t(`modal.${event.moodType}`);
    case 'milestone':
      return event.milestoneType === 'custom'
        ? (event.description || t('modal.custom'))
        : t(`modal.${event.milestoneType}`);
    default:
      return '';
  }
}

/* ------------------------------------------------------------------ */
/*  Journal Screen                                                     */
/* ------------------------------------------------------------------ */

export default function JournalScreen() {
  const { t } = useTranslation();
  const { events, removeEvent, theme, colorScheme } = React.use(AppContext);
  const [selectedFilter, setSelectedFilter] = useState<EventType>('sleep');

  const filteredEvents = events.filter((e) => e.type === selectedFilter);

  // Count events per type for badges
  const eventCounts = useMemo(() => {
    const counts: Partial<Record<EventType, number>> = {};
    for (const e of events) {
      counts[e.type] = (counts[e.type] ?? 0) + 1;
    }
    return counts;
  }, [events]);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(t('common.delete'), t('settings.deleteConfirm'), [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => removeEvent(id),
        },
      ]);
    },
    [removeEvent, t],
  );

  const getFilterColor = (type: EventType): string => {
    return FILTERS.find((f) => f.type === type)?.color ?? theme.textSecondary;
  };

  const renderEvent = useCallback(
    ({ item, index }: { item: BabyEvent; index: number }) => {
      const color = getFilterColor(item.type);
      const date = formatEventDate(item.startTime);
      const time = formatEventTime(item.startTime);
      const detail = getEventDetail(item, t);

      return (
        <Animated.View entering={FadeInDown.delay(index * 40).duration(350)}>
          <Pressable
            onLongPress={() => handleDelete(item.id)}
            style={({ pressed }) => ({
              backgroundColor: pressed
                ? (colorScheme === 'dark' ? color + '12' : color + '08')
                : theme.surface,
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 16,
              marginHorizontal: 16,
              marginBottom: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              borderWidth: colorScheme === 'light' ? 1 : 0,
              borderColor: theme.border,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            {/* Left color indicator */}
            <View
              style={{
                width: 3,
                height: 36,
                borderRadius: 2,
                backgroundColor: color,
                opacity: 0.8,
              }}
            />

            {/* Icon */}
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                backgroundColor: color + '12',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {FILTERS.find(f => f.type === item.type)?.IconComponent && (
                React.createElement(
                  FILTERS.find(f => f.type === item.type)!.IconComponent,
                  { color, size: 18 }
                )
              )}
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600', letterSpacing: 0.1 }}>
                {time}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 3, fontWeight: '500' }}>
                {detail}
              </Text>
            </View>

            {/* Date badge */}
            <View
              style={{
                backgroundColor: theme.surfaceElevated,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: theme.textTertiary, fontSize: 10, fontWeight: '600' }}>
                {date}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      );
    },
    [handleDelete, t, theme, colorScheme],
  );

  const keyExtractor = useCallback((item: BabyEvent) => item.id, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
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
          {t('journal.title')}
        </Text>
        <Text
          style={{
            color: theme.textTertiary,
            fontSize: 13,
            fontWeight: '500',
            marginTop: 4,
          }}
        >
          {filteredEvents.length} {filteredEvents.length === 1 ? 'entry' : 'entries'}
        </Text>
      </Animated.View>

      {/* ---- Filter Pills ---- */}
      <View style={{ paddingTop: 12, paddingBottom: 14 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {FILTERS.map((filter) => {
            const isSelected = selectedFilter === filter.type;
            const count = eventCounts[filter.type] ?? 0;
            const activeTextColor = theme.activeButtonText;
            return (
              <Pressable
                key={filter.type}
                onPress={() => setSelectedFilter(filter.type)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 16,
                  backgroundColor: isSelected ? filter.color : theme.surface,
                  borderWidth: isSelected ? 0 : 1,
                  borderColor: theme.border,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                })}
              >
                <filter.IconComponent
                  color={isSelected ? activeTextColor : theme.textSecondary}
                  size={14}
                />
                <Text
                  style={{
                    color: isSelected ? activeTextColor : theme.textSecondary,
                    fontSize: 12,
                    fontWeight: isSelected ? '700' : '500',
                  }}
                >
                  {t(filter.labelKey)}
                </Text>
                {count > 0 && (
                  <View
                    style={{
                      backgroundColor: isSelected ? (activeTextColor + '30') : filter.color + '20',
                      paddingHorizontal: 6,
                      paddingVertical: 1,
                      borderRadius: 8,
                      minWidth: 20,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? activeTextColor : filter.color,
                        fontSize: 10,
                        fontWeight: '700',
                      }}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ---- Events List ---- */}
      <FlatList
        data={filteredEvents}
        renderItem={renderEvent}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          paddingTop: 4,
          paddingBottom: 100,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 40 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 24,
                backgroundColor: theme.surfaceElevated,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              {FILTERS.find(f => f.type === selectedFilter)?.IconComponent && (
                React.createElement(
                  FILTERS.find(f => f.type === selectedFilter)!.IconComponent,
                  { color: theme.textTertiary, size: 28 }
                )
              )}
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 15, fontWeight: '600', textAlign: 'center', marginBottom: 4 }}>
              {t('journal.noEvents')}
            </Text>
            <Text style={{ color: theme.textTertiary, fontSize: 13, textAlign: 'center' }}>
              {t('journal.noEventsSubtitle', 'Les events apparaitront ici')}
            </Text>
          </View>
        }
      />
    </View>
  );
}
