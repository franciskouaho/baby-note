import React from 'react';
import { Stack } from 'expo-router/stack';
import { AppContext } from '@/lib/context';

export default function OnboardingLayout() {
  const { theme } = React.use(AppContext);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="searching" />
      <Stack.Screen name="backup" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
