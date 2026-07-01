import { BorderRadius, Colors, Fonts, Spacing, Typography } from '@/constants';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface NoCheckProps {
  onPress?: () => void;
}

function NoEditHabit({ onPress }: NoCheckProps) {

    const scale = useSharedValue(1);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value}]
    }));

    return (
        <View style={styles.container}>
            <AnimatedPressable
                style={[styles.checkers, animatedStyles]}
                onPressIn={() => {scale.value = withSpring(0.95, { mass: 0.1, stiffness: 400 });}}
                onPressOut={() => {scale.value = withSpring(1, { mass: 1, stiffness: 400 });}}
                onPress={onPress}
            >
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>+</Text>
                </View>
                <Text style={styles.label}>New Habit</Text>
            </AnimatedPressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: Spacing.xs
    },
    checkers: {
        width:'100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: BorderRadius.md,
        padding: Spacing.xs,
        paddingEnd: Spacing.md,
        backgroundColor: Colors.White,borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: Colors.inactive,
    },
    iconContainer: {
        borderRadius: BorderRadius.sm,
        paddingHorizontal: 12,
        opacity: 0.9,
        backgroundColor: Colors.inactive
    },
    icon: {
        color: Colors.White,
        ...Typography.h1,
        fontFamily: Fonts.bold
    },
    label: {
        ...Typography.h3,
        fontFamily: Fonts.bold,
        flexDirection: 'row',
        width: '80%',
        alignSelf: 'center',
    }
});

export default NoEditHabit;