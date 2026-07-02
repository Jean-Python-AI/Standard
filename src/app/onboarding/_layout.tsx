import Back from '@/assets/icons/back.svg';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { IconSize } from '@/constants/iconSizes';
import { Opacity } from '@/constants/opacity';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useLayoutEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const ONBOARDING_STEPS = ['step1', 'step2', 'step3', 'step4'] as const;
const TOTAL_STEPS = ONBOARDING_STEPS.length;
const DOT_SIZE = 8;
const DOT_GAP = 8;
const DOT_STEP = DOT_SIZE + DOT_GAP;
const ANIMATION_DURATION_SLIDE = 300;
const ANIMATION_DURATION_PULSE = 150;

function OnboardingHeader({ currentStep }: { currentStep: number }) {
  const router = useRouter();
  const translateX = useSharedValue(0);
  const scaleX = useSharedValue(1);

  useLayoutEffect(() => {
    if (currentStep > 0) {
      cancelAnimation(translateX);
      cancelAnimation(scaleX);
      translateX.value = withTiming((currentStep - 1) * DOT_STEP, { duration: ANIMATION_DURATION_SLIDE });
      scaleX.value = withSequence(
        withTiming(2, { duration: ANIMATION_DURATION_PULSE }),
        withTiming(1, { duration: ANIMATION_DURATION_PULSE })
      );
    }
  }, [currentStep, translateX, scaleX]);

  const animatedDotStyle = useAnimatedStyle(() => ({
    width: scaleX.value * DOT_SIZE,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.top}>
      <Pressable
        onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, { opacity: pressed ? Opacity.pressed : 1 }]}
      >
          <Back width={IconSize.md} height={IconSize.md} color={Colors.Black} />
      </Pressable>

      <View style={styles.dotsContainer}>
        <View style={styles.dots}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <View key={i} style={styles.dot} />
          ))}
          <Animated.View style={[styles.dotActive, animatedDotStyle]} />
        </View>
      </View>
    </View>
  );
}

export default function OnboardingLayout() {
  const pathname = usePathname();
  const stepMatch = pathname.match(/\/onboarding\/step(\d+)$/);
  const currentStep = stepMatch ? parseInt(stepMatch[1], 10) : 0;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <OnboardingProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: Colors.primaryBackground },
            }}
          >
            <Stack.Screen name="start" />
            {ONBOARDING_STEPS.map((name) => (
              <Stack.Screen key={name} name={name} />
            ))}
            <Stack.Screen name="signup" />
          </Stack>
        </OnboardingProvider>
        {currentStep > 0 && <OnboardingHeader currentStep={currentStep} />}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBackground,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: Colors.tertiary,
    padding: Spacing.xxs,
    paddingRight: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },
  dotsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DOT_GAP,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: Colors.secondary,
  },
  dotActive: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: Colors.Black,
    left: 0,
  },
});
