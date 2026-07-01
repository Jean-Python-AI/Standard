import { ICON_MAP } from '@/components/onboarding/HabitIconPicker';
import EditIcon from '@/assets/icons/edit.svg';
import { BorderRadius, Colors, ColorsHabits, Fonts, IconSize, Spacing, Typography } from '@/constants';
import type { ColorId } from '@/types/habit';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ProcessingState = { id: number; phase: 'loading' | 'exiting' } | null;

interface BlockHabitProps {
    idColor: ColorId;
    label?: string;
    id: number;
    icon: string;
    onEdit: (id: number, label: string) => void;
    processingState?: ProcessingState;
}

function BlockEditHabit({idColor, label, id, icon, onEdit, processingState}: BlockHabitProps) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const isProcessing = processingState?.id === id;
    const isExiting = isProcessing && processingState.phase === 'exiting';
    const [existing, setExisting] = useState(true);

    useEffect(() => {
        if (isExiting) {
            opacity.value = withTiming(0, { duration: 300 });
            const t = setTimeout(() => {
                setExisting(false);
            }, 300);
            return () => clearTimeout(t);
        }
    }, [isExiting, opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    if (!existing) return null;

    const Icon = ICON_MAP[icon] ?? ICON_MAP['Idea'];

    return (
        <AnimatedPressable
            style={[styles.container, animatedStyle]}
            onPress={() => onEdit(id, label===undefined ? '' : label)}
            onPressIn={() => { scale.value = withSpring(0.90, { mass: 0.3, stiffness: 300 }); }}
            onPressOut={() => { scale.value = withSpring(1, { mass: 0.5, stiffness: 300 }); }}
        >
            <View style={styles.componentsSection}>
                <View style={[styles.iconSection, {backgroundColor:ColorsHabits[idColor]}]}>
                    {isProcessing ? (
                        <LottieView
                            source={require('@/assets/lotties/loading.json')}
                            autoPlay
                            loop
                            style={{ width: IconSize.lg, height: IconSize.lg }}
                        />
                    ) : (
                        <Icon width={IconSize.lg} height={IconSize.lg} color={'white'} />
                    )}
                </View>
                <Text style={styles.text} numberOfLines={3} ellipsizeMode='tail'>
                    {label}
                </Text>
            </View>

            <EditIcon width={IconSize.lg} height={IconSize.lg} color={Colors.inactive} />
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width:'100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: BorderRadius.md,
        padding: Spacing.xs,
        paddingEnd: Spacing.md,
        backgroundColor: Colors.White,
    },
    text: {
        ...Typography.h2,
        fontFamily: Fonts.bold,
        alignSelf: 'center',
    },
    iconSection: {
        borderRadius: BorderRadius.sm,
        padding: Spacing.xxs,
        opacity: 0.9
    },
    componentsSection : {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    }
});

export default React.memo(BlockEditHabit);
