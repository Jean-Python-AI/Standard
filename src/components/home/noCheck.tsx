import { BorderRadius, Colors, Fonts, Shadows, Spacing, SpringConfig } from '@/constants';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface NoCheckProps {
  onPress?: () => void;
}

function NoCheck({ onPress }: NoCheckProps) {

    const scale = useSharedValue(1);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value}]
    }));

    return (
        <View style={styles.container}>
            <AnimatedPressable
                style={[styles.checkers, animatedStyles]}
                onPressIn={() => {scale.value = withSpring(0.95, SpringConfig.snappy);}}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        ...Shadows.card,
        backgroundColor: Colors.White,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: Colors.inactive,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: BorderRadius.sm,
        backgroundColor: Colors.inactive,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        color: Colors.White,
        fontSize:24,
        fontFamily: Fonts.bold
    },
    label: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        flexDirection: 'row',
        width: '80%',
        alignSelf: 'center',
    }
});

export default NoCheck;