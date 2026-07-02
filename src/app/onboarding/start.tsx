import { BorderRadius, Colors, Opacity, Spacing, Typography } from '@/constants';
import { usePressGuard } from '@/hooks/usePressGuard';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const ROUTE_STEP_1 = '/onboarding/step1';
const ROUTE_SIGNUP = '/onboarding/signup';

export default function Start() {
  const router = useRouter();
  const { guard } = usePressGuard();

  useEffect(() => {
    router.prefetch(ROUTE_STEP_1);
    router.prefetch(ROUTE_SIGNUP);
  }, [router]);

  const handleStart = () => guard(() => router.push(ROUTE_STEP_1));
  const handleLogin = () => guard(() => router.push(ROUTE_SIGNUP));

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.appName}>Standard</Text>
      </View>

      <View style={styles.content}>
        <LottieView
          source={require('@/assets/lotties/Fire.json')}
          autoPlay
          loop
          speed={1}
          style={{ width: 150, height: 150, backgroundColor: 'transparent' }}
        />
        <Text style={styles.heroText}>Your daily{'\n'}
          non-negotiables.{'\n'}
          Tracked.
        </Text>
      </View>

      <View style={styles.bottom}>
        <Pressable
          style={({ pressed }) => [styles.button, { opacity: pressed ? Opacity.pressed : 1 }]}
          onPress={handleStart}
        >
          <Text style={styles.buttonText}>Start</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: Spacing.lg,
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  button: {
    backgroundColor: Colors.Black,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    width: '60%',
  },
  buttonSecondary: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.White,
    ...Typography.h3,
  },
  buttonTextSecondary: {
    color: Colors.Black,
    ...Typography.h3,
  },
  appName: {
    ...Typography.h2,
    color: Colors.Black,
  },
  heroText: {
    ...Typography.heroText,
    color: Colors.Black,
    alignSelf: 'center',
    textAlign: 'center',
  },
  top: {
    width: '100%',
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
});
