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
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppContext } from '@/lib/context';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import type { GrowthEntry } from '@/lib/types';

export default function AddGrowthModal() {
  const { t } = useTranslation();
  const { addGrowthEntry } = React.use(AppContext);

  const today = format(new Date(), 'yyyy-MM-dd');

  const [date, setDate] = useState(today);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
        id: uuidv4(),
        date,
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
    keyboardType: 'numeric' | 'default' = 'numeric'
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
          keyboardType={keyboardType}
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
                backgroundColor: '#F4A68320',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 16 }}>{'\u{1F4CF}'}</Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700' }}>
              {t('growth.title')}
            </Text>
          </View>
          <View style={{ width: 60 }} />
        </View>

        {/* Date field */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: '#8E8E93', fontSize: 13, marginBottom: 8, marginLeft: 4 }}>
            {t('growth.date')}
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
            <Text style={{ fontSize: 18, marginRight: 8 }}>{'\u{1F4C5}'}</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#636366"
              style={{
                color: '#F4A683',
                fontSize: 17,
                fontWeight: '600',
                flex: 1,
              }}
            />
          </View>
        </View>

        {/* Weight */}
        {renderField(
          t('growth.weight'),
          weight,
          setWeight,
          t('growth.weightPlaceholder')
        )}

        {/* Height */}
        {renderField(
          t('growth.height'),
          height,
          setHeight,
          t('growth.heightPlaceholder')
        )}

        {/* Head circumference */}
        {renderField(
          t('growth.head'),
          headCircumference,
          setHeadCircumference,
          t('growth.headPlaceholder')
        )}

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
