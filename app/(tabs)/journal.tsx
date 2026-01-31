import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Svg, { Path, Circle, Line, Rect, Ellipse } from 'react-native-svg';
import { AppContext } from '@/lib/context';
import { formatEventTime, formatEventDate, formatDuration } from '@/lib/helpers';
import type { BabyEvent, EventType } from '@/lib/types';

/* ------------------------------------------------------------------ */
/*  Filter icon components                                             */
/* ------------------------------------------------------------------ */

function SleepFilterIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="12" rx="2.5" stroke="#FFFFFF" strokeWidth={1.8} />
      <Line x1="6" y1="6" x2="6" y2="18" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.5} />
      <Line x1="10" y1="6" x2="10" y2="18" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.5} />
      <Line x1="14" y1="6" x2="14" y2="18" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.5} />
      <Line x1="18" y1="6" x2="18" y2="18" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.5} />
      <Path d="M18 2 Q20 4 18 6 Q21 5 20 2Z" fill="#FFFFFF" opacity={0.7} />
    </Svg>
  );
}

function BreastfeedingFilterIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10" cy="7" r="3.5" stroke="#FFFFFF" strokeWidth={1.8} />
      <Path d="M6 12 Q6 17 10 18.5 Q14 17 14 12" stroke="#FFFFFF" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <Circle cx="18" cy="11" r="2.5" stroke="#FFFFFF" strokeWidth={1.5} />
      <Path d="M15.5 14.5 Q15.5 18 18 19 Q20.5 18 20.5 14.5" stroke="#FFFFFF" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

function BottleFilterIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="8" y="3" width="8" height="3" rx="1" stroke="#FFFFFF" strokeWidth={1.8} />
      <Path d="M7 6 L7 19 Q7 21 9 21 L15 21 Q17 21 17 19 L17 6" stroke="#FFFFFF" strokeWidth={1.8} fill="none" />
      <Line x1="7" y1="12" x2="17" y2="12" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.5} />
      <Line x1="7" y1="15" x2="17" y2="15" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.3} />
    </Svg>
  );
}

function SolidsFilterIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Ellipse cx="12" cy="16" rx="8" ry="4" stroke="#FFFFFF" strokeWidth={1.8} />
      <Path d="M4 16 Q4 12 12 12 Q20 12 20 16" stroke="#FFFFFF" strokeWidth={1.8} fill="none" />
      <Line x1="12" y1="4" x2="12" y2="10" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="12" cy="10" r="2" stroke="#FFFFFF" strokeWidth={1.5} />
    </Svg>
  );
}

function PumpedMilkFilterIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="8" y="8" width="8" height="13" rx="2" stroke="#FFFFFF" strokeWidth={1.8} />
      <Path d="M8 12 L6 10 L6 6 L10 6 L10 8" stroke="#FFFFFF" strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="8" y1="14" x2="16" y2="14" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.5} />
      <Circle cx="12" cy="17" r="1" fill="#FFFFFF" opacity={0.4} />
    </Svg>
  );
}

function DiaperFilterIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 7 L19 7 L21 12 Q21 19 12 21 Q3 19 3 12 Z"
        stroke="#FFFFFF"
        strokeWidth={1.8}
        fill="none"
        strokeLinejoin="round"
      />
      <Path d="M5 7 L3 10" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M19 7 L21 10" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" />
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
  icon: React.ReactNode;
}

const FILTERS: FilterDef[] = [
  { type: 'sleep', labelKey: 'tracking.sleep', color: '#8B7BF4', icon: <SleepFilterIcon /> },
  { type: 'breastfeeding', labelKey: 'tracking.breastfeeding', color: '#4ECB71', icon: <BreastfeedingFilterIcon /> },
  { type: 'bottle', labelKey: 'tracking.bottle', color: '#64B5F6', icon: <BottleFilterIcon /> },
  { type: 'solids', labelKey: 'tracking.solids', color: '#FF8A65', icon: <SolidsFilterIcon /> },
  { type: 'pumped_milk', labelKey: 'tracking.pumpedMilk', color: '#BA68C8', icon: <PumpedMilkFilterIcon /> },
  { type: 'diaper', labelKey: 'tracking.diaper', color: '#F4C542', icon: <DiaperFilterIcon /> },
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
    default:
      return '';
  }
}

/* ------------------------------------------------------------------ */
/*  Journal Screen                                                     */
/* ------------------------------------------------------------------ */

export default function JournalScreen() {
  const { t } = useTranslation();
  const { events, removeEvent, theme } = React.use(AppContext);
  const [selectedFilter, setSelectedFilter] = useState<EventType>('sleep');

  const filteredEvents = events.filter((e) => e.type === selectedFilter);

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
    return FILTERS.find((f) => f.type === type)?.color ?? '#8E8E93';
  };

  const renderEvent = useCallback(
    ({ item, index }: { item: BabyEvent; index: number }) => {
      const color = getFilterColor(item.type);
      const date = formatEventDate(item.startTime);
      const time = formatEventTime(item.startTime);
      const detail = getEventDetail(item, t);

      return (
        <Animated.View entering={FadeInDown.delay(index * 60).duration(400)}>
          <Pressable
            onLongPress={() => handleDelete(item.id)}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#2C2C2E' : '#1C1C1E',
              borderRadius: 16,
              padding: 16,
              marginHorizontal: 16,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            })}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: color + '20',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: color,
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>
                {time}
              </Text>
              <Text
                style={{
                  color: '#8E8E93',
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                {detail}
              </Text>
            </View>
            <Text style={{ color: '#636366', fontSize: 11 }}>{date}</Text>
          </Pressable>
        </Animated.View>
      );
    },
    [handleDelete, t],
  );

  const keyExtractor = useCallback((item: BabyEvent) => item.id, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      {/* ---- Title ---- */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={{
          paddingTop: 60,
          paddingBottom: 16,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: theme.primary,
            fontSize: 20,
            fontWeight: '700',
            letterSpacing: 0.3,
          }}
        >
          {t('journal.title')}
        </Text>
      </Animated.View>

      {/* ---- Filter Chips ---- */}
      <View style={{ paddingBottom: 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 12,
          }}
        >
          {FILTERS.map((filter) => {
            const isSelected = selectedFilter === filter.type;
            return (
              <Pressable
                key={filter.type}
                onPress={() => setSelectedFilter(filter.type)}
                style={{
                  alignItems: 'center',
                  gap: 6,
                  width: 72,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: isSelected ? filter.color : '#2C2C2E',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {filter.icon}
                </View>
                <Text
                  style={{
                    color: isSelected ? '#FFFFFF' : '#8E8E93',
                    fontSize: 10,
                    fontWeight: isSelected ? '600' : '400',
                    textAlign: 'center',
                  }}
                  numberOfLines={2}
                >
                  {t(filter.labelKey)}
                </Text>
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
          paddingTop: 8,
          paddingBottom: 40,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 80,
            }}
          >
            <Text
              style={{
                color: '#636366',
                fontSize: 15,
                textAlign: 'center',
              }}
            >
              {t('journal.noEvents')}
            </Text>
          </View>
        }
      />
    </View>
  );
}
