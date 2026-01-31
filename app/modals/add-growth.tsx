import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppContext } from '@/lib/context';
import { randomUUID } from 'expo-crypto';
import { format } from 'date-fns';
import type { GrowthEntry } from '@/lib/types';

function CloseIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Line x1="3" y1="3" x2="13" y2="13" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1="13" y1="3" x2="3" y2="13" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default function AddGrowthModal() {
  const { t } = useTranslation();
  const { addGrowthEntry, theme, colorScheme } = React.use(AppContext);

  const activeTextColor = theme.activeButtonText;
  const headerTint = colorScheme === 'dark' ? theme.primary + '10' : theme.primary + '08';

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  async function handleSave() {
    if (isSaving) return;

    const w = weight ? parseFloat(weight) : undefined;
    const h = height ? parseFloat(height) : undefined;
    const hc = headCircumference ? parseFloat(headCircumference) : undefined;

    if (w === undefined && h === undefined && hc === undefined) {
      Alert.alert(t('growth.title'), t('growth.weight'));
      return;
    }

    setIsSaving(true);

    try {
      const entry: GrowthEntry = {
        id: randomUUID(),
        date: format(date, 'yyyy-MM-dd'),
        weight: w,
        height: h,
        headCircumference: hc,
        createdAt: new Date().toISOString(),
      };

      await addGrowthEntry(entry);
      router.back();
    } catch {
      setIsSaving(false);
    }
  }

  function renderField(
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder: string,
    unit: string,
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
          <View
            style={{
              backgroundColor: theme.surfaceElevated,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600' }}>
              {unit}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
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
                  backgroundColor: theme.primary + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 19 }}>{'\u{1F4CF}'}</Text>
              </View>
              <Text style={{ color: theme.text, fontSize: 22, fontWeight: '700', letterSpacing: 0.2 }}>
                {t('growth.title')}
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
              backgroundColor: theme.primary,
              opacity: 0.4,
              alignSelf: 'center',
              width: 60,
            }}
          />
        </View>

        {/* ---- Form fields ---- */}
        <View style={{ paddingHorizontal: 24 }}>
          {/* Date field with native picker */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ marginBottom: 24 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 10, marginLeft: 4 }}>
              {t('growth.date')}
            </Text>
            <Pressable
              onPress={() => setShowDatePicker(!showDatePicker)}
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
              <Text style={{ fontSize: 18, marginRight: 10 }}>{'\u{1F4C5}'}</Text>
              <Text
                style={{
                  color: theme.primary,
                  fontSize: 18,
                  fontWeight: '600',
                  flex: 1,
                }}
              >
                {format(date, 'dd/MM/yyyy')}
              </Text>
            </Pressable>
            {showDatePicker && (
              <Animated.View entering={FadeIn.duration(200)} style={{ marginTop: 8 }}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  themeVariant={colorScheme}
                  style={{ backgroundColor: theme.surface, borderRadius: 12 }}
                />
                {Platform.OS === 'ios' && (
                  <Pressable
                    onPress={() => setShowDatePicker(false)}
                    style={{
                      alignSelf: 'center',
                      marginTop: 8,
                      paddingHorizontal: 20,
                      paddingVertical: 8,
                      backgroundColor: theme.surfaceLight,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text }}>OK</Text>
                  </Pressable>
                )}
              </Animated.View>
            )}
          </Animated.View>

          {renderField(
            t('growth.weight'),
            weight,
            setWeight,
            t('growth.weightPlaceholder'),
            'kg',
            260,
          )}

          {renderField(
            t('growth.height'),
            height,
            setHeight,
            t('growth.heightPlaceholder'),
            'cm',
            320,
          )}

          {renderField(
            t('growth.head'),
            headCircumference,
            setHeadCircumference,
            t('growth.headPlaceholder'),
            'cm',
            380,
          )}
        </View>

        {/* ---- Save button ---- */}
        <Animated.View entering={FadeInDown.delay(440).duration(500)} style={{ paddingHorizontal: 24 }}>
          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => ({
              backgroundColor: pressed ? theme.primaryDark : theme.primary,
              borderRadius: 28,
              height: 56,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 4,
              opacity: isSaving ? 0.6 : 1,
              shadowColor: theme.primary,
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
