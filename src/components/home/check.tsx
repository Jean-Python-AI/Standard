import { ICON_MAP } from '@/components/onboarding/HabitIconPicker';
import { BorderRadius, Colors, Fonts, IconSize, Shadows, Spacing, SpringConfig, TimingConfig } from '@/constants';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CheckProps {
  label?: string;
  checked: boolean;
  color: string;
  icon: string;
  onChange?: () => void;
}

function Check({ label, color, checked, icon, onChange }: CheckProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, TimingConfig.fast, () => {
      shadowOpacity.value = withTiming(0.2, TimingConfig.fast);
    });
  }, [opacity, shadowOpacity]);

  useEffect(() => {
    if (checked) {
      scale.value = withSpring(0.95, SpringConfig.snappy);
    } else {
      scale.value = withSpring(1, { mass: 1, stiffness: 400 });
    }
  }, [checked]);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
    shadowOpacity: shadowOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  const Icon = ICON_MAP[icon] ?? ICON_MAP['Idea'];

  return (
    <AnimatedPressable
      style={[styles.checkerContainer, animatedStyles, { backgroundColor: Colors.White }]}
      onPress={() => {
        onChange && onChange();
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
        <View style={{ width: 45, height: 45, borderRadius: BorderRadius.sm, backgroundColor: checked ? Colors.Black : color, justifyContent: 'center', alignItems: 'center' }}>
          <Icon width={IconSize.lg} height={IconSize.lg} color={Colors.White} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  checkerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.card,
  },
  label: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    flexDirection: 'row',
    width: '80%',
    alignSelf: 'center',
  },
});

export default React.memo(Check);
