import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppContext } from '@/lib/context';
import { randomUUID } from 'expo-crypto';
import { format } from 'date-fns';
import type {
  EventType,
  BabyEvent,
  SleepEvent,
  BreastfeedingEvent,
  BottleEvent,
  DiaperEvent,
  SolidsEvent,
  PumpedMilkEvent,
  WalkEvent,
  BathEvent,
  DoctorEvent,
  VaccineEvent,
  TemperatureEvent,
  IllnessEvent,
  TreatmentEvent,
  MoodEvent,
  MilestoneEvent,
  MoodType,
  MilestoneType,
} from '@/lib/types';

const EVENT_COLORS: Record<EventType, string> = {
  sleep: '#A599FF',
  breastfeeding: '#6BD68A',
  diaper: '#FFD166',
  bottle: '#7EC8F2',
  solids: '#FFB088',
  pumped_milk: '#C9A0E0',
  walk: '#5EC4B6',
  bath: '#9B8FE0',
  doctor: '#4DB8A4',
  vaccine: '#4DB8A4',
  temperature: '#4DB8A4',
  illness: '#4DB8A4',
  treatment: '#4DB8A4',
  mood: '#B580D1',
  milestone: '#C4A84D',
};

const EVENT_ICONS: Record<EventType, string> = {
  sleep: '\u{1F31C}',
  breastfeeding: '\u{1F931}',
  diaper: '\u{1F9F7}',
  bottle: '\u{1F37C}',
  solids: '\u{1F34E}',
  pumped_milk: '\u{1F95B}',
  walk: '\u{1F6B6}',
  bath: '\u{1F6C1}',
  doctor: '\u{1FA7A}',
  vaccine: '\u{1F489}',
  temperature: '\u{1F321}',
  illness: '\u{1F912}',
  treatment: '\u{1F48A}',
  mood: '\u{1F60A}',
  milestone: '\u{2B50}',
};

function CloseIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Line x1="3" y1="3" x2="13" y2="13" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1="13" y1="3" x2="3" y2="13" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default function AddEventModal() {
  const { type, subtype } = useLocalSearchParams<{ type: EventType; subtype?: string }>();
  const { t } = useTranslation();
  const { addEvent, theme, colorScheme } = React.use(AppContext);

  const eventType = (type as EventType) || 'sleep';
  const color = EVENT_COLORS[eventType] || '#F4A683';
  const icon = EVENT_ICONS[eventType] || '';
  const now = new Date();

  const [startDate, setStartDate] = useState(now);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [side, setSide] = useState<'left' | 'right' | 'both'>('left');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [amountMl, setAmountMl] = useState('');
  const [amountGrams, setAmountGrams] = useState('');
  const [food, setFood] = useState('');
  const [diaperType, setDiaperType] = useState<'wet' | 'dirty' | 'mixed'>('wet');
  const [isSaving, setIsSaving] = useState(false);

  // New event fields
  const [vaccineName, setVaccineName] = useState('');
  const [temperatureValue, setTemperatureValue] = useState('');
  const [description, setDescription] = useState('');
  const [treatmentName, setTreatmentName] = useState('');
  const [dosage, setDosage] = useState('');
  const [moodType, setMoodType] = useState<MoodType>((subtype as MoodType) || 'happy');
  const [milestoneType, setMilestoneType] = useState<MilestoneType>((subtype as MilestoneType) || 'first_steps');
  const [milestoneDescription, setMilestoneDescription] = useState('');

  const TRACKING_KEYS: Record<string, string> = {
    pumped_milk: 'pumpedMilk',
  };
  const titleKey = `tracking.${TRACKING_KEYS[eventType] || eventType}`;
  const activeTextColor = theme.activeButtonText;
  const headerTint = colorScheme === 'dark' ? color + '10' : color + '08';

  async function handleSave() {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const id = randomUUID();
      const createdAt = new Date().toISOString();
      const startISO = startDate.toISOString();
      let event: BabyEvent;

      switch (eventType) {
        case 'sleep': {
          const sleepEvent: SleepEvent = {
            id,
            type: 'sleep',
            startTime: startISO,
            endTime: endDate ? endDate.toISOString() : undefined,
            notes: notes || undefined,
            createdAt,
          };
          event = sleepEvent;
          break;
        }
        case 'breastfeeding': {
          const duration = parseInt(durationMinutes, 10);
          if (!duration || duration <= 0) {
            Alert.alert(t('modal.duration'));
            setIsSaving(false);
            return;
          }
          const bfEvent: BreastfeedingEvent = {
            id,
            type: 'breastfeeding',
            side,
            durationMinutes: duration,
            startTime: startISO,
            notes: notes || undefined,
            createdAt,
          };
          event = bfEvent;
          break;
        }
        case 'bottle': {
          const ml = parseInt(amountMl, 10);
          if (!ml || ml <= 0) {
            Alert.alert(t('modal.amount'));
            setIsSaving(false);
            return;
          }
          const bottleEvent: BottleEvent = {
            id,
            type: 'bottle',
            amountMl: ml,
            startTime: startISO,
            notes: notes || undefined,
            createdAt,
          };
          event = bottleEvent;
          break;
        }
        case 'diaper': {
          const diaperEvent: DiaperEvent = {
            id,
            type: 'diaper',
            diaperType,
            startTime: startISO,
            notes: notes || undefined,
            createdAt,
          };
          event = diaperEvent;
          break;
        }
        case 'solids': {
          if (!food.trim()) {
            Alert.alert(t('modal.food'));
            setIsSaving(false);
            return;
          }
          const solidsEvent: SolidsEvent = {
            id,
            type: 'solids',
            food: food.trim(),
            amountGrams: amountGrams ? parseInt(amountGrams, 10) : undefined,
            startTime: startISO,
            notes: notes || undefined,
            createdAt,
          };
          event = solidsEvent;
          break;
        }
        case 'pumped_milk': {
          const pml = parseInt(amountMl, 10);
          if (!pml || pml <= 0) {
            Alert.alert(t('modal.amount'));
            setIsSaving(false);
            return;
          }
          const pumpedEvent: PumpedMilkEvent = {
            id,
            type: 'pumped_milk',
            amountMl: pml,
            startTime: startISO,
            notes: notes || undefined,
            createdAt,
          };
          event = pumpedEvent;
          break;
        }
        case 'walk': {
          const walkEvent: WalkEvent = {
            id,
            type: 'walk',
            durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : undefined,
            startTime: startISO,
            notes: notes || undefined,
            createdAt,
          };
          event = walkEvent;
          break;
        }
        case 'bath': {
          const bathEvent: BathEvent = {
            id,
            type: 'bath',
            durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : undefined,
            startTime: startISO,
            notes: notes || undefined,
            createdAt,
          };
          event = bathEvent;
          break;
        }
        case 'doctor': {
          const doctorEvent: DoctorEvent = {
            id,
            type: 'doctor',
            startTime: startISO,
            notes: notes || undefined,
            createdAt,
          };
          event = doctorEvent;
          break;
        }
        case 'vaccine': {
          const vaccineEvent: VaccineEvent = {
            id,
            type: 'vaccine',
            vaccineName: vaccineName.trim() || undefined,
            startTime: startISO,
            notes: notes || undefined,
            createdAt,
          };
          event = vaccineEvent;
          break;
        }
        case 'temperature': {
          const temp = parseFloat(temperatureValue);
          if (!temp || temp <= 0) {
            Alert.alert(t('modal.temperatureValue'));
            setIsSaving(false);
            return;
          }
          const tempEvent: TemperatureEvent = {
            id,
            type: 'temperature',
            temperature: temp,
            startTime: startISO,
            notes: notes || undefined,
            createdAt,
          };
          event = tempEvent;
          break;
        }
        case 'illness': {
          const illnessEvent: IllnessEvent = {
            id,
            type: 'illness',
            description: description.trim() || undefined,
            startTime: startISO,
            notes: notes || undefined,
            createdAt,
          };
          event = illnessEvent;
          break;
        }
        case 'treatment': {
          const treatmentEvent: TreatmentEvent = {
            id,
            type: 'treatment',
            treatmentName: treatmentName.trim() || undefined,
            dosage: dosage.trim() || undefined,
            startTime: startISO,
            notes: notes || undefined,
            createdAt,
          };
          event = treatmentEvent;
          break;
        }
        case 'mood': {
          const moodEvent: MoodEvent = {
            id,
            type: 'mood',
            moodType,
            startTime: startISO,
            notes: notes || undefined,
            createdAt,
          };
          event = moodEvent;
          break;
        }
        case 'milestone': {
          const msEvent: MilestoneEvent = {
            id,
            type: 'milestone',
            milestoneType,
            description: milestoneType === 'custom' ? (milestoneDescription.trim() || undefined) : undefined,
            startTime: startISO,
            notes: notes || undefined,
            createdAt,
          };
          event = msEvent;
          break;
        }
        default:
          setIsSaving(false);
          return;
      }

      await addEvent(event);
      router.back();
    } catch {
      setIsSaving(false);
    }
  }

  function renderPillSelector<T extends string>(
    label: string,
    options: { key: T; label: string }[],
    selected: T,
    onSelect: (key: T) => void,
    delay: number,
  ) {
    return (
      <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={{ marginBottom: 24 }}>
        <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 10, marginLeft: 4 }}>
          {label}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {options.map((opt) => {
            const isActive = selected === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => onSelect(opt.key)}
                style={({ pressed }) => ({
                  flexGrow: 1,
                  flexBasis: options.length > 3 ? '28%' : 0,
                  paddingVertical: 13,
                  paddingHorizontal: 10,
                  borderRadius: 20,
                  backgroundColor: isActive ? color : (pressed ? theme.surfaceLight : theme.surface),
                  alignItems: 'center',
                  borderWidth: isActive ? 0 : 1,
                  borderColor: theme.border,
                })}
              >
                <Text
                  style={{
                    color: isActive ? activeTextColor : theme.text,
                    fontSize: options.length > 4 ? 13 : 15,
                    fontWeight: isActive ? '700' : '400',
                  }}
                  numberOfLines={1}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    );
  }

  function renderTimePickerModal(
    showPicker: boolean,
    setShowPicker: (v: boolean) => void,
    value: Date,
    onChange: (d: Date) => void,
  ) {
    if (Platform.OS === 'android') {
      if (!showPicker) return null;
      return (
        <DateTimePicker
          value={value}
          mode="time"
          display="default"
          onChange={(_event: any, selectedDate?: Date) => {
            setShowPicker(false);
            if (selectedDate) onChange(selectedDate);
          }}
          themeVariant={colorScheme}
        />
      );
    }

    return (
      <Modal visible={showPicker} transparent animationType="fade">
        <Pressable
          onPress={() => setShowPicker(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: theme.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingBottom: 34,
              paddingTop: 16,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border }} />
            </View>
            <DateTimePicker
              value={value}
              mode="time"
              display="spinner"
              onChange={(_event: any, selectedDate?: Date) => {
                if (selectedDate) onChange(selectedDate);
              }}
              themeVariant={colorScheme}
              style={{ backgroundColor: theme.background }}
            />
            <Pressable
              onPress={() => setShowPicker(false)}
              style={{
                alignSelf: 'center',
                marginTop: 8,
                paddingHorizontal: 32,
                paddingVertical: 12,
                backgroundColor: color,
                borderRadius: 20,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: activeTextColor }}>OK</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }

  function renderTimePicker(
    label: string,
    value: Date,
    onChange: (d: Date) => void,
    showPicker: boolean,
    setShowPicker: (v: boolean) => void,
    delay: number,
  ) {
    return (
      <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={{ marginBottom: 24 }}>
        <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 10, marginLeft: 4 }}>
          {label}
        </Text>
        <Pressable
          onPress={() => setShowPicker(true)}
          style={{
            backgroundColor: theme.surface,
            borderRadius: 20,
            paddingHorizontal: 18,
            height: 54,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Text style={{ fontSize: 18, marginRight: 10 }}>{'\u{1F552}'}</Text>
          <Text
            style={{
              color: color,
              fontSize: 18,
              fontWeight: '600',
              flex: 1,
            }}
          >
            {format(value, 'HH:mm')}
          </Text>
        </Pressable>
        {renderTimePickerModal(showPicker, setShowPicker, value, onChange)}
      </Animated.View>
    );
  }

  function renderOptionalTimePicker(
    label: string,
    value: Date | null,
    onChange: (d: Date | null) => void,
    showPicker: boolean,
    setShowPicker: (v: boolean) => void,
    delay: number,
  ) {
    return (
      <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={{ marginBottom: 24 }}>
        <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 10, marginLeft: 4 }}>
          {label}
        </Text>
        <Pressable
          onPress={() => {
            if (!value) {
              onChange(new Date());
            }
            setShowPicker(true);
          }}
          style={{
            backgroundColor: theme.surface,
            borderRadius: 20,
            paddingHorizontal: 18,
            height: 54,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Text style={{ fontSize: 18, marginRight: 10 }}>{'\u{1F552}'}</Text>
          <Text
            style={{
              color: value ? color : theme.textTertiary,
              fontSize: 18,
              fontWeight: '600',
              flex: 1,
            }}
          >
            {value ? format(value, 'HH:mm') : '--:--'}
          </Text>
        </Pressable>
        {value && renderTimePickerModal(showPicker, setShowPicker, value, (d) => onChange(d))}
      </Animated.View>
    );
  }

  function renderNumberField(
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder: string,
    unit: string | undefined,
    delay: number,
  ) {
    return (
      <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={{ marginBottom: 24 }}>
        <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 10, marginLeft: 4 }}>
          {label}
        </Text>
        <View
          style={{
            backgroundColor: theme.surface,
            borderRadius: 20,
            paddingHorizontal: 18,
            height: 54,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={theme.textTertiary}
            keyboardType="numeric"
            style={{
              color: theme.text,
              fontSize: 16,
              flex: 1,
            }}
          />
          {unit && (
            <Text style={{ color: theme.textTertiary, fontSize: 14, fontWeight: '500' }}>
              {unit}
            </Text>
          )}
        </View>
      </Animated.View>
    );
  }

  function renderTextField(
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder: string,
    delay: number,
  ) {
    return (
      <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={{ marginBottom: 24 }}>
        <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 10, marginLeft: 4 }}>
          {label}
        </Text>
        <View
          style={{
            backgroundColor: theme.surface,
            borderRadius: 20,
            paddingHorizontal: 18,
            height: 54,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={theme.textTertiary}
            style={{
              color: theme.text,
              fontSize: 16,
              flex: 1,
            }}
          />
        </View>
      </Animated.View>
    );
  }

  function renderNotesField(delay: number) {
    return (
      <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={{ marginBottom: 24 }}>
        <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 10, marginLeft: 4 }}>
          {t('modal.notes')}
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder={t('modal.notes')}
          placeholderTextColor={theme.textTertiary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          style={{
            backgroundColor: theme.surface,
            borderRadius: 20,
            paddingHorizontal: 18,
            paddingVertical: 14,
            color: theme.text,
            fontSize: 16,
            minHeight: 88,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        />
      </Animated.View>
    );
  }

  function renderFormFields() {
    switch (eventType) {
      case 'sleep':
        return (
          <>
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 200)}
            {renderOptionalTimePicker(t('modal.endTime'), endDate, setEndDate, showEndPicker, setShowEndPicker, 260)}
            {renderNotesField(320)}
          </>
        );
      case 'breastfeeding':
        return (
          <>
            {renderPillSelector(
              t('modal.side'),
              [
                { key: 'left', label: t('modal.left') },
                { key: 'right', label: t('modal.right') },
                { key: 'both', label: t('modal.both') },
              ],
              side,
              setSide,
              200,
            )}
            {renderNumberField(t('modal.duration'), durationMinutes, setDurationMinutes, '15', 'min', 260)}
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 320)}
            {renderNotesField(380)}
          </>
        );
      case 'bottle':
        return (
          <>
            {renderNumberField(t('modal.amount'), amountMl, setAmountMl, '120', 'ml', 200)}
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 260)}
            {renderNotesField(320)}
          </>
        );
      case 'diaper':
        return (
          <>
            {renderPillSelector(
              t('modal.type'),
              [
                { key: 'wet', label: t('modal.wet') },
                { key: 'dirty', label: t('modal.dirty') },
                { key: 'mixed', label: t('modal.mixed') },
              ],
              diaperType,
              setDiaperType,
              200,
            )}
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 260)}
            {renderNotesField(320)}
          </>
        );
      case 'solids':
        return (
          <>
            {renderTextField(t('modal.food'), food, setFood, t('modal.food'), 200)}
            {renderNumberField(t('modal.amountGrams'), amountGrams, setAmountGrams, '50', 'g', 260)}
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 320)}
            {renderNotesField(380)}
          </>
        );
      case 'pumped_milk':
        return (
          <>
            {renderNumberField(t('modal.amount'), amountMl, setAmountMl, '100', 'ml', 200)}
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 260)}
            {renderNotesField(320)}
          </>
        );
      case 'walk':
        return (
          <>
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 200)}
            {renderNumberField(t('modal.duration'), durationMinutes, setDurationMinutes, '30', 'min', 260)}
            {renderNotesField(320)}
          </>
        );
      case 'bath':
        return (
          <>
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 200)}
            {renderNumberField(t('modal.duration'), durationMinutes, setDurationMinutes, '15', 'min', 260)}
            {renderNotesField(320)}
          </>
        );
      case 'doctor':
        return (
          <>
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 200)}
            {renderNotesField(260)}
          </>
        );
      case 'vaccine':
        return (
          <>
            {renderTextField(t('modal.vaccineName'), vaccineName, setVaccineName, t('modal.vaccineName'), 200)}
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 260)}
            {renderNotesField(320)}
          </>
        );
      case 'temperature':
        return (
          <>
            {renderNumberField(t('modal.temperatureValue'), temperatureValue, setTemperatureValue, '37.5', '°C', 200)}
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 260)}
            {renderNotesField(320)}
          </>
        );
      case 'illness':
        return (
          <>
            {renderTextField(t('modal.description'), description, setDescription, t('modal.description'), 200)}
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 260)}
            {renderNotesField(320)}
          </>
        );
      case 'treatment':
        return (
          <>
            {renderTextField(t('modal.treatmentName'), treatmentName, setTreatmentName, t('modal.treatmentName'), 200)}
            {renderTextField(t('modal.dosage'), dosage, setDosage, t('modal.dosage'), 260)}
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 320)}
            {renderNotesField(380)}
          </>
        );
      case 'mood':
        return (
          <>
            {renderPillSelector(
              t('modal.moodType'),
              [
                { key: 'happy' as MoodType, label: t('modal.happy') },
                { key: 'good' as MoodType, label: t('modal.good') },
                { key: 'sad' as MoodType, label: t('modal.sad') },
                { key: 'crying' as MoodType, label: t('modal.crying') },
              ],
              moodType,
              setMoodType,
              200,
            )}
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 260)}
            {renderNotesField(320)}
          </>
        );
      case 'milestone':
        return (
          <>
            {renderPillSelector(
              t('modal.milestoneType'),
              [
                { key: 'first_steps' as MilestoneType, label: t('modal.first_steps') },
                { key: 'sat_up' as MilestoneType, label: t('modal.sat_up') },
                { key: 'first_word' as MilestoneType, label: t('modal.first_word') },
                { key: 'first_tooth' as MilestoneType, label: t('modal.first_tooth') },
                { key: 'custom' as MilestoneType, label: t('modal.custom') },
              ],
              milestoneType,
              setMilestoneType,
              200,
            )}
            {milestoneType === 'custom' && renderTextField(t('modal.milestoneDescription'), milestoneDescription, setMilestoneDescription, t('modal.milestoneDescription'), 260)}
            {renderTimePicker(t('modal.startTime'), startDate, setStartDate, showStartPicker, setShowStartPicker, 320)}
            {renderNotesField(380)}
          </>
        );
      default:
        return null;
    }
  }

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
      >
        {/* ---- Header with tinted background ---- */}
        <View
          style={{
            backgroundColor: headerTint,
            paddingTop: insets.top + 12,
            paddingBottom: 28,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            marginBottom: 28,
          }}
        >
          <Animated.View
            entering={FadeIn.duration(300)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <View style={{ width: 36 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  backgroundColor: color + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 19 }}>{icon}</Text>
              </View>
              <Text style={{ color: theme.text, fontSize: 22, fontWeight: '700', letterSpacing: 0.2 }}>
                {t(titleKey)}
              </Text>
            </View>
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: theme.surface,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <CloseIcon color={theme.textSecondary} size={14} />
            </Pressable>
          </Animated.View>

          {/* Colored accent bar */}
          <Animated.View
            entering={FadeIn.delay(100).duration(400)}
            style={{
              height: 3,
              borderRadius: 2,
              backgroundColor: color,
              opacity: 0.4,
              alignSelf: 'center',
              width: 60,
            }}
          />
        </View>

        {/* ---- Form fields ---- */}
        <View style={{ paddingHorizontal: 24 }}>
          {renderFormFields()}
        </View>

        {/* ---- Save button ---- */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={{ paddingHorizontal: 24 }}>
          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => ({
              backgroundColor: pressed ? color + 'CC' : color,
              borderRadius: 28,
              height: 56,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 4,
              opacity: isSaving ? 0.6 : 1,
              shadowColor: color,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            })}
          >
            <Text style={{ color: activeTextColor, fontSize: 17, fontWeight: '700', letterSpacing: 0.3 }}>
              {t('modal.save')}
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
