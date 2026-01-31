import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { AppContext } from '@/lib/context';

export default function Index() {
  const { isLoading, onboardingDone } = React.use(AppContext);

  useEffect(() => {
    if (!isLoading) {
      if (onboardingDone) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isLoading, onboardingDone]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#F4A683" />
    </View>
  );
}
