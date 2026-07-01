import LoadingScreen from '@/components/Loading/LoadingScreen';
import LoadingSpinner from '@/components/Loading/LoadingSpinner';
import { db } from '@/db/clients';
import migrations from '@/db/migrations/migrations';
import { seedLast6Days } from '@/db/seed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Component, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants';

SplashScreen.preventAutoHideAsync();

const FORCE_ONBOARDING = true; // TODO: supprimer avant la mise en production
const LOADING_TIMEOUT_MS = 5000;

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (__DEV__) {
      console.error('Root layout error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function ErrorFallback() {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Une erreur est survenue</Text>
      <Text style={styles.errorMessage}>
        L&apos;application a rencontré un problème inattendu.
      </Text>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Rubik-Regular': require('@/assets/fonts/Rubik/static/Rubik-Regular.ttf'),
    'Rubik-Medium': require('@/assets/fonts/Rubik/static/Rubik-Medium.ttf'),
    'Rubik-Bold': require('@/assets/fonts/Rubik/static/Rubik-Bold.ttf'),
  });
  const { success, error } = useMigrations(db, migrations);
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (fontsLoaded && success) {
      SplashScreen.hideAsync();
      seedLast6Days().catch(e => console.error('[seed] Error:', e));
    }
  }, [fontsLoaded, success]);

  useEffect(() => {
    if (loadingFinished) {
      if (FORCE_ONBOARDING) {
        setOnboardingDone(false);
        return;
      }
      AsyncStorage.getItem('onboardingDone').then((value) => {
        setOnboardingDone(value === 'true');
      });
    }
  }, [loadingFinished]);

  useEffect(() => {
    if (!loadingFinished) {
      timeoutRef.current = setTimeout(() => {
        if (__DEV__) {
          console.warn('Loading timeout: forcing finish');
        }
        SplashScreen.hideAsync().catch(() => {});
        setLoadingFinished(true);
      }, LOADING_TIMEOUT_MS);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loadingFinished]);

  const handleLoadingFinish = useCallback(() => {
    setLoadingFinished(true);
  }, []);

  if (error) {
    if (__DEV__) {
      console.error('Migration error:', error);
    }
    if (!loadingFinished) {
      setLoadingFinished(true);
    }
  }

  const isReady = fontsLoaded && success;

  if (!loadingFinished) {
    return (
      <RootErrorBoundary fallback={<ErrorFallback />}>
        <LoadingScreen
          onReady={isReady}
          onFinish={handleLoadingFinish}
        />
      </RootErrorBoundary>
    );
  }

  if (onboardingDone === null) {
    return <LoadingSpinner />;
  }

  return (
    <RootErrorBoundary fallback={<ErrorFallback />}>
      <Stack screenOptions={{ headerShown: false }}>
        {onboardingDone ? (
          <Stack.Screen name="tabs" />
        ) : (
          <Stack.Screen name="onboarding" />
        )}
      </Stack>
    </RootErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: Spacing.md,
  },
  errorTitle: {
    ...Typography.h1,
    color: Colors.Black,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    ...Typography.body,
    color: Colors.inactive,
    textAlign: 'center',
  },
});
