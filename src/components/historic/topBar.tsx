import { BorderRadius, Colors, Spacing, Typography } from '@/constants';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TopBarProps {
  onNewHabitPress: () => void;
}

function TopBar({ onNewHabitPress }: TopBarProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <View style={styles.container}>
        <Text style={styles.text}>Tracking habits</Text>

        <AnimatedPressable
            onPress={onNewHabitPress}
            onPressIn={() => { scale.value = withSpring(0.9, { mass: 0.3, stiffness: 300 }); }}
            onPressOut={() => {scale.value = withSpring(1, { mass: 0.5, stiffness: 300 }); }}
            style={[{padding:8, paddingHorizontal: 12, backgroundColor: Colors.Black, borderRadius: BorderRadius.lg}, animatedStyle]}
        >
            <Text style={[styles.text, {fontSize: 18, color: Colors.White}]}>+ habit</Text>
        </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:Spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    width: '100%',
  },
  text: {
    ...Typography.h1,
  },
});

export default React.memo(TopBar);