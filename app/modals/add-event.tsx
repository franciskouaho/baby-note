import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppContext } from '@/lib/context';
import { v4 as uuidv4 } from 'uuid';
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
} from '@/lib/types';

const EVENT_COLORS: Record<EventType, string> = {
  sleep: '#8B7BF4',
  breastfeeding: '#4ECB71',
  diaper: '#F4C542',
  bottle: '#64B5F6',
  solids: '#FF8A65',
  pumped_milk: '#BA68C8',
};

const EVENT_ICONS: Record<EventType, string> = {
  sleep: '\u{1F31C}',
  breastfeeding: '\u{1F931}',
  diaper: '\u{1F9F7}',
  bottle: '\u{1F37C}',
  solids: '\u{1F34E}',
  pumped_milk: '\u{1F95B}',
};

export default function AddEventModal() {
  const { type } = useLocalSearchParams<{ type: EventType }>();
  const { t } = useTranslation();
  const { addEvent } = React.use(AppContext);

  const eventType = (type as EventType) || 'sleep';
  const color = EVENT_COLORS[eventType] || '#F4A683';
  const icon = EVENT_ICONS[eventType] || '';
  const now = new Date();

  const [startTime, setStartTime] = useState(format(now, 'HH:mm'));
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [side, setSide] = useState<'left' | 'right' | 'both'>('left');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [amountMl, setAmountMl] = useState('');
  const [amountGrams, setAmountGrams] = useState('');
  const [food, setFood] = useState('');
  const [diaperType, setDiaperType] = useState<'wet' | 'dirty' | 'mixed'>('wet');
  const [isSaving, setIsSaving] = useState(false);

  const titleKey = `tracking.${eventType === 'pumped_milk' ? 'pumpedMilk' : eventType}`;

  function parseTimeToISO(timeStr: string): string {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 0, minutes || 0, 0, 0);
    return date.toISOString();
  }

  async function handleSave() {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const id = uuidv4();
      const createdAt = new Date().toISOString();
      const startISO = parseTimeToISO(startTime);
      let event: BabyEvent;

      switch (eventType) {
        case 'sleep': {
          const sleepEvent: SleepEvent = {
            id,
            type: 'sleep',
            startTime: startISO,
            endTime: endTime ? parseTimeToISO(endTime) : undefined,
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

  function renderSideSelector() {
    const sides: { key: 'left' | 'right' | 'both'; label: string }[] = [
      { key: 'left', label: t('modal.left') },
      { key: 'right', label: t('modal.right') },
      { key: 'both', label: t('modal.both') },
    ];
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: '#8E8E93', fontSize: 13, marginBottom: 8, marginLeft: 4 }}>
          {t('modal.side')}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {sides.map((s) => (
            <Pressable
              key={s.key}
              onPress={() => setSide(s.key)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: side === s.key ? color : '#1C1C1E',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: side === s.key ? '#000000' : '#FFFFFF',
                  fontSize: 15,
                  fontWeight: side === s.key ? '600' : '400',
                }}
              >
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  function renderDiaperTypeSelector() {
    const types: { key: 'wet' | 'dirty' | 'mixed'; label: string }[] = [
      { key: 'wet', label: t('modal.wet') },
      { key: 'dirty', label: t('modal.dirty') },
      { key: 'mixed', label: t('modal.mixed') },
    ];
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: '#8E8E93', fontSize: 13, marginBottom: 8, marginLeft: 4 }}>
          {t('modal.type')}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {types.map((dt) => (
            <Pressable
              key={dt.key}
              onPress={() => setDiaperType(dt.key)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: diaperType === dt.key ? color : '#1C1C1E',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: diaperType === dt.key ? '#000000' : '#FFFFFF',
                  fontSize: 15,
                  fontWeight: diaperType === dt.key ? '600' : '400',
                }}
              >
                {dt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  function renderTimeField(label: string, value: string, onChange: (v: string) => void) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: '#8E8E93', fontSize: 13, marginBottom: 8, marginLeft: 4 }}>
          {label}
        </Text>
        <View
          style={{
            backgroundColor: '#1C1C1E',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 18, marginRight: 8 }}>{'\u{1F552}'}</Text>
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="HH:mm"
            placeholderTextColor="#636366"
            keyboardType="numbers-and-punctuation"
            style={{
              color: '#F4A683',
              fontSize: 17,
              fontWeight: '600',
              flex: 1,
            }}
          />
        </View>
      </View>
    );
  }

  function renderNumberField(
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder: string
  ) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: '#8E8E93', fontSize: 13, marginBottom: 8, marginLeft: 4 }}>
          {label}
        </Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#636366"
          keyboardType="numeric"
          style={{
            backgroundColor: '#1C1C1E',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: '#FFFFFF',
            fontSize: 16,
          }}
        />
      </View>
    );
  }

  function renderTextField(
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder: string
  ) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: '#8E8E93', fontSize: 13, marginBottom: 8, marginLeft: 4 }}>
          {label}
        </Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#636366"
          style={{
            backgroundColor: '#1C1C1E',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: '#FFFFFF',
            fontSize: 16,
          }}
        />
      </View>
    );
  }

  function renderNotesField() {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: '#8E8E93', fontSize: 13, marginBottom: 8, marginLeft: 4 }}>
          {t('modal.notes')}
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder={t('modal.notes')}
          placeholderTextColor="#636366"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          style={{
            backgroundColor: '#1C1C1E',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: '#FFFFFF',
            fontSize: 16,
            minHeight: 80,
          }}
        />
      </View>
    );
  }

  function renderFormFields() {
    switch (eventType) {
      case 'sleep':
        return (
          <>
            {renderTimeField(t('modal.startTime'), startTime, setStartTime)}
            {renderTimeField(t('modal.endTime'), endTime, setEndTime)}
            {renderNotesField()}
          </>
        );
      case 'breastfeeding':
        return (
          <>
            {renderSideSelector()}
            {renderNumberField(t('modal.duration'), durationMinutes, setDurationMinutes, '15')}
            {renderTimeField(t('modal.startTime'), startTime, setStartTime)}
            {renderNotesField()}
          </>
        );
      case 'bottle':
        return (
          <>
            {renderNumberField(t('modal.amount'), amountMl, setAmountMl, '120')}
            {renderTimeField(t('modal.startTime'), startTime, setStartTime)}
            {renderNotesField()}
          </>
        );
      case 'diaper':
        return (
          <>
            {renderDiaperTypeSelector()}
            {renderTimeField(t('modal.startTime'), startTime, setStartTime)}
            {renderNotesField()}
          </>
        );
      case 'solids':
        return (
          <>
            {renderTextField(t('modal.food'), food, setFood, t('modal.food'))}
            {renderNumberField(t('modal.amountGrams'), amountGrams, setAmountGrams, '50')}
            {renderTimeField(t('modal.startTime'), startTime, setStartTime)}
            {renderNotesField()}
          </>
        );
      case 'pumped_milk':
        return (
          <>
            {renderNumberField(t('modal.amount'), amountMl, setAmountMl, '100')}
            {renderTimeField(t('modal.startTime'), startTime, setStartTime)}
            {renderNotesField()}
          </>
        );
      default:
        return null;
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#000000' }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 28,
          }}
        >
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={{ color: '#8E8E93', fontSize: 17 }}>{t('modal.cancel')}</Text>
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: color + '20',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 16 }}>{icon}</Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700' }}>
              {t(titleKey)}
            </Text>
          </View>
          <View style={{ width: 60 }} />
        </View>

        {/* Form fields */}
        {renderFormFields()}

        {/* Save button */}
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#E8855C' : '#F4A683',
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            marginTop: 8,
            opacity: isSaving ? 0.6 : 1,
          })}
        >
          <Text style={{ color: '#000000', fontSize: 17, fontWeight: '700' }}>
            {t('modal.save')}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
