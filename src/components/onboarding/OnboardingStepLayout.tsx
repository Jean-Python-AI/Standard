import { BorderRadius, Colors, Opacity, Spacing, Typography } from '@/constants';
import { usePressGuard } from '@/hooks/usePressGuard';
import { useRouter, type Href } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface OnboardingStepLayoutProps {
  nextRoute: Href;
  nextLabel?: string;
  disabled?: boolean;
  onNext?: () => Promise<void> | void;
  children: React.ReactNode;
}

export default function OnboardingStepLayout({
  nextRoute,
  nextLabel = 'Next',
  disabled = false,
  onNext,
  children,
}: OnboardingStepLayoutProps) {
  const router = useRouter();
  const { guard, isPressed } = usePressGuard();

  useEffect(() => {
    router.prefetch(nextRoute);
  }, [nextRoute, router]);

  const handlePress = () => {
    if (disabled) return;
    guard(async () => {
      if (onNext) await onNext();
      router.push(nextRoute);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>

      <View style={styles.bottom}>
        <Pressable
          onPress={handlePress}
          disabled={disabled}
          style={({ pressed }) => [styles.button, { opacity: disabled || isPressed ? Opacity.disabled : pressed ? Opacity.pressed : 1 }]}
        >
          <Text style={styles.buttonText}>{nextLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: Colors.Black,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    width: '60%',
  },
  buttonText: {
    color: Colors.White,
    ...Typography.h3,
  },
});
