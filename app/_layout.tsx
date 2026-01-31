import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { AppProvider, AppContext } from '@/lib/context';
import '@/lib/i18n';

SplashScreen.preventAutoHideAsync();

function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const { theme } = React.use(AppContext);
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    logoScale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.2)) });
    logoOpacity.value = withTiming(1, { duration: 500 });
    textOpacity.value = withDelay(350, withTiming(1, { duration: 400 }));
    containerOpacity.value = withDelay(
      1600,
      withTiming(0, { duration: 400, easing: Easing.in(Easing.ease) }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      }),
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.splashContainer,
        { backgroundColor: theme.background },
        containerStyle,
      ]}
    >
      <Animated.View style={[styles.logoWrapper, logoStyle]}>
        <Image source={require('@/assets/icon_sans_fond.png')} style={styles.logo} resizeMode="contain" />
      </Animated.View>
      <Animated.Text style={[styles.appName, { color: theme.primary }, textStyle]}>
        Baby Note
      </Animated.Text>
    </Animated.View>
  );
}

function RootStack() {
  const { theme, colorScheme } = React.use(AppContext);

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen
          name="modals/add"
          options={{
            presentation: 'modal',
            headerShown: false,
            contentStyle: { backgroundColor: theme.background },
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="modals/add-event"
          options={{
            presentation: 'modal',
            headerShown: false,
            contentStyle: { backgroundColor: theme.background },
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="modals/add-growth"
          options={{
            presentation: 'modal',
            headerShown: false,
            contentStyle: { backgroundColor: theme.background },
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  const onLayoutReady = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  const handleSplashFinish = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutReady}>
      <AppProvider>
        <RootStack />
        {!splashDone && <AnimatedSplash onFinish={handleSplashFinish} />}
      </AppProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  logoWrapper: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
  },
  appName: {
    marginTop: 24,
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 2,
  },
});
