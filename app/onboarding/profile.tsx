import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Platform, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Path, Rect, G, Polyline, Line } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { AppContext } from '@/lib/context';
import { themeColors } from '@/lib/theme';
import type { Gender, ThemeColor, BabyProfile } from '@/lib/types';

// --- SVG Icon Components ---

function GirlIcon({ size = 32, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Venus symbol */}
      <Circle cx="16" cy="12" r="8" stroke={color} strokeWidth="2.2" fill="none" />
      <Line x1="16" y1="20" x2="16" y2="30" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Line x1="12" y1="26" x2="20" y2="26" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function BoyIcon({ size = 32, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Mars symbol */}
      <Circle cx="14" cy="18" r="8" stroke={color} strokeWidth="2.2" fill="none" />
      <Line x1="20" y1="12" x2="28" y2="4" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Polyline points="22,4 28,4 28,10" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function CameraIcon({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 19C23 20.1 22.1 21 21 21H3C1.9 21 1 20.1 1 19V8C1 6.9 1.9 6 3 6H7L9 3H15L17 6H21C22.1 6 23 6.9 23 8V19Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  );
}

function CheckIcon({ size = 18, color = '#000000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Polyline
        points="3,9 7.5,13.5 15,4.5"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function BabyAvatarFace({ size = 100, gender }: { size?: number; gender: Gender }) {
  const faceColor = gender === 'girl' ? '#E8A0BF' : '#F4A683';
  const cheekColor = gender === 'girl' ? '#F0C0D4' : '#F7BFA3';
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Circle cx="50" cy="50" r="46" fill={faceColor} />
      {/* Cheeks */}
      <Circle cx="30" cy="56" r="7" fill={cheekColor} opacity={0.5} />
      <Circle cx="70" cy="56" r="7" fill={cheekColor} opacity={0.5} />
      {/* Eyes */}
      <Circle cx="37" cy="44" r="3.5" fill="#000000" />
      <Circle cx="38.5" cy="42.5" r="1.2" fill="#FFFFFF" />
      <Circle cx="63" cy="44" r="3.5" fill="#000000" />
      <Circle cx="64.5" cy="42.5" r="1.2" fill="#FFFFFF" />
      {/* Smile */}
      <Path d="M40 60C42 66 58 66 60 60" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

const COLOR_OPTIONS: { key: ThemeColor; color: string }[] = [
  { key: 'peach', color: themeColors.peach.primary },
  { key: 'pink', color: themeColors.pink.primary },
  { key: 'blue', color: themeColors.blue.primary },
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { setBaby, completeOnboarding, theme } = React.use(AppContext);

  const [gender, setGender] = useState<Gender>('boy');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<ThemeColor>('peach');
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('', t('profile.firstNamePlaceholder'));
      return;
    }

    setSaving(true);
    try {
      const profile: BabyProfile = {
        id: uuidv4(),
        name: name.trim(),
        gender,
        birthday: birthday.toISOString(),
        photoUri,
        themeColor: selectedColor,
        createdAt: new Date().toISOString(),
      };

      await setBaby(profile);
      await completeOnboarding();
      router.replace('/(tabs)');
    } catch {
      setSaving(false);
    }
  };

  const formattedDate = format(birthday, 'dd/MM/yyyy');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#000' }}
      contentContainerStyle={{
        paddingHorizontal: 32,
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Gender selector */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(500)}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
          marginBottom: 32,
        }}
      >
        {/* Girl option */}
        <Pressable
          onPress={() => setGender('girl')}
          style={{
            alignItems: 'center',
            gap: 8,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: gender === 'girl' ? themeColors.pink.primary : '#1C1C1E',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: gender === 'girl' ? 0 : 1,
              borderColor: '#2C2C2E',
            }}
          >
            <GirlIcon color={gender === 'girl' ? '#000000' : '#8E8E93'} />
          </View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: gender === 'girl' ? '#FFFFFF' : '#636366',
            }}
          >
            {t('profile.girl')}
          </Text>
        </Pressable>

        {/* Boy option */}
        <Pressable
          onPress={() => setGender('boy')}
          style={{
            alignItems: 'center',
            gap: 8,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: gender === 'boy' ? themeColors.peach.primary : '#1C1C1E',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: gender === 'boy' ? 0 : 1,
              borderColor: '#2C2C2E',
            }}
          >
            <BoyIcon color={gender === 'boy' ? '#000000' : '#8E8E93'} />
          </View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: gender === 'boy' ? '#FFFFFF' : '#636366',
            }}
          >
            {t('profile.boy')}
          </Text>
        </Pressable>
      </Animated.View>

      {/* Avatar with camera overlay */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(500)}
        style={{ alignItems: 'center', marginBottom: 36 }}
      >
        <Pressable onPress={pickImage} style={{ position: 'relative' }}>
          {photoUri ? (
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                overflow: 'hidden',
              }}
            >
              <Animated.Image
                source={{ uri: photoUri }}
                style={{ width: 120, height: 120 }}
                entering={FadeIn.duration(300)}
              />
            </View>
          ) : (
            <BabyAvatarFace size={120} gender={gender} />
          )}
          {/* Camera badge */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#1C1C1E',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: '#000000',
            }}
          >
            <CameraIcon size={18} color="#FFFFFF" />
          </View>
        </Pressable>
      </Animated.View>

      {/* First name input */}
      <Animated.View entering={FadeInDown.delay(300).duration(500)} style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#8E8E93',
            marginBottom: 8,
            marginLeft: 4,
          }}
        >
          {t('profile.firstName')}
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('profile.firstNamePlaceholder')}
          placeholderTextColor="#636366"
          autoCapitalize="words"
          autoCorrect={false}
          style={{
            backgroundColor: '#1C1C1E',
            borderRadius: 16,
            height: 52,
            paddingHorizontal: 18,
            fontSize: 16,
            color: '#FFFFFF',
          }}
        />
      </Animated.View>

      {/* Birthday selector */}
      <Animated.View entering={FadeInDown.delay(400).duration(500)} style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#8E8E93',
            marginBottom: 8,
            marginLeft: 4,
          }}
        >
          {t('profile.birthday')}
        </Text>
        <Pressable
          onPress={() => setShowDatePicker(!showDatePicker)}
          style={{
            backgroundColor: '#1C1C1E',
            borderRadius: 16,
            height: 52,
            paddingHorizontal: 18,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 16, color: '#FFFFFF' }}>{formattedDate}</Text>
        </Pressable>

        {showDatePicker && (
          <Animated.View entering={FadeIn.duration(200)} style={{ marginTop: 8 }}>
            <DateTimePicker
              value={birthday}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(2020, 0, 1)}
              themeVariant="dark"
              style={{ backgroundColor: '#1C1C1E', borderRadius: 12 }}
            />
            {Platform.OS === 'ios' && (
              <Pressable
                onPress={() => setShowDatePicker(false)}
                style={{
                  alignSelf: 'center',
                  marginTop: 8,
                  paddingHorizontal: 20,
                  paddingVertical: 8,
                  backgroundColor: '#2C2C2E',
                  borderRadius: 12,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>OK</Text>
              </Pressable>
            )}
          </Animated.View>
        )}
      </Animated.View>

      {/* Interface color selector */}
      <Animated.View entering={FadeInDown.delay(500).duration(500)} style={{ marginBottom: 40 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#8E8E93',
            marginBottom: 12,
            marginLeft: 4,
          }}
        >
          {t('profile.interfaceColor')}
        </Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          {COLOR_OPTIONS.map((option) => (
            <Pressable
              key={option.key}
              onPress={() => setSelectedColor(option.key)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: option.color,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: selectedColor === option.key ? 3 : 0,
                borderColor: '#FFFFFF',
              }}
            >
              {selectedColor === option.key && <CheckIcon size={18} color="#000000" />}
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {/* Continue button */}
      <Animated.View entering={FadeInDown.delay(600).duration(500)}>
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={({ pressed }) => ({
            backgroundColor: pressed || saving
              ? themeColors[selectedColor].primaryDark
              : themeColors[selectedColor].primary,
            borderRadius: 30,
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: saving ? 0.7 : 1,
          })}
        >
          <Text style={{ fontSize: 17, fontWeight: '600', color: '#000000' }}>
            {t('profile.continue')}
          </Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}
