import CoinsIcon from '@/assets/icons/Coins.svg';
import TrackIcon from '@/assets/icons/track.svg';
import { BorderRadius, Colors, Fonts, IconSize, Opacity, Shadows, Spacing, SpringConfig, Typography, STREAK_REWARD_THRESHOLD, COINS_REWARD_AMOUNT } from '@/constants';
import LottieView from 'lottie-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SHEET_VIEW_HEIGHT = 50;
const SHEET_HEIGHT = 460;

interface BottomSheetHabitProps {
  visible: boolean;
  onClose: () => void;
  streak: number;
  onCoinsEarned?: () => void;
}

export default function PopOver({ visible, onClose, streak, onCoinsEarned }: BottomSheetHabitProps) {
  const translateY = useSharedValue(SHEET_HEIGHT); // commence caché

  useEffect(() => {
    translateY.value = withSpring(visible ? SHEET_VIEW_HEIGHT : SHEET_HEIGHT, SpringConfig.gentle);
  }, [visible, translateY]);

  // Style animé du sheet
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Style animé du backdrop
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [SHEET_VIEW_HEIGHT, SHEET_HEIGHT], [Opacity.backdrop, 0]),
  }));

  const buttonscale = useSharedValue(1);
  const bounceY = useSharedValue(0);

  useEffect(() => {
    if (visible && streak >= STREAK_REWARD_THRESHOLD) {
      bounceY.value = 0;
      bounceY.value = withSequence(
        withSpring(-15, SpringConfig.bouncy),
        withSpring(0, SpringConfig.bouncy),
      );
    }
  }, [visible, streak, bounceY]);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceY.value }],
  }));

  const handlePress = () => {
    if (streak >= STREAK_REWARD_THRESHOLD) onCoinsEarned?.();
    onClose();
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      {/* Backdrop */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: Colors.Black }, backdropStyle]}
      />

      {/* Sheet */}
      <Animated.View style={[styles.sheet, sheetStyle]}>
        <View style={{ flex: 1, width:'100%', backgroundColor: 'transparent', borderRadius: BorderRadius.xl, gap: Spacing.lg }}>

            {/* Contenu */}
            <View style={{ flex:1, gap: Spacing.md, backgroundColor: Colors.primaryBackground, borderRadius: BorderRadius.xl, justifyContent: 'flex-end', alignItems: 'center', padding: Spacing.sm }}>
                <View style={{ width:'100%', backgroundColor: Colors.White, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', gap: Spacing.lg, padding: Spacing.sm, paddingTop: Spacing.lg }}>
                  <View style={{ width: 100, height: 100, position: 'absolute', top: -75, zIndex: 1000, backgroundColor: 'transparent' }}>
                    <LottieView
                      source={require('@/assets/lotties/Fire.json')}
                      autoPlay
                      loop
                      speed={1}
                      style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                    />
                  </View>
                  {/* Text */}
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.text}>{streak} Days Streak!</Text>
                    <Text style={[styles.subText, Typography.caption]}>You are on the right track</Text>
                  </View>
                  {/* Week */}
                  <View style={{ width: '100%', justifyContent: 'space-evenly', alignItems: 'center', flexDirection:'row'}}>
                    {[...Array(6)].map((_, index) => (
                      <View style={{alignItems: 'center', flexDirection:'column'}} key={index}>
                        <TrackIcon
                          width={IconSize.lg}
                          height={IconSize.lg}
                          style={{ opacity: index < streak ? 1 : Opacity.inactive }}
                        />
                      </View>
                    ))}
                    <Animated.View style={[bounceStyle, { alignItems: 'center' }]} key={6}>
                        <CoinsIcon
                          width={IconSize.lg}
                          height={IconSize.lg}
                          style={{ opacity: STREAK_REWARD_THRESHOLD - 1 < streak ? 1 : Opacity.disabled }}
                        />
                        <Text style={[styles.subText, { fontFamily: Fonts.bold, marginTop: -Spacing.xxs, color: STREAK_REWARD_THRESHOLD - 1 < streak ? Colors.Black : Colors.inactive }]}>+{COINS_REWARD_AMOUNT}</Text>
                      </Animated.View>
                  </View>
                </View>
            </View>

        </View>
        <View style={{ width: '100%', backgroundColor: Colors.primaryBackground, height: 170 }}>
            <View style={[{ backgroundColor: Colors.overlay, alignItems: 'center', padding: Spacing.md, height:170 }]}>
                <AnimatedPressable
                    onPress={handlePress}
                    style={styles.Button}
                    onPressIn={() => {buttonscale.value = withSpring(0.9, SpringConfig.snappy);}}
                    onPressOut={() => {buttonscale.value = withSpring(1, {mass: 1, stiffness: 400})}}
                >
                    <Text style={styles.textButton}>{STREAK_REWARD_THRESHOLD === streak ? `+${COINS_REWARD_AMOUNT}` : 'Check'}</Text>
                    {STREAK_REWARD_THRESHOLD === streak && (<CoinsIcon width={IconSize.md} height={IconSize.md} color={Colors.White} />)}
                </AnimatedPressable>
            </View>
        </View>
      </Animated.View>
    </View>
  );
}

  const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
    zIndex: 1000,
  },
  textButton: {
    color: Colors.White,
    ...Typography.h3,
  },
  text: {
    ...Typography.streakNumber,
  },
  subText: {
    ...Typography.captionSmall,
    color: Colors.inactive,
  },
  Button: {
    backgroundColor: Colors.Black,
    flexDirection: 'row',
    gap: Spacing.xxs,
    padding: Spacing.sm,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    height: 70,
    width: '80%',
    justifyContent: 'center',
    zIndex:1100,
    ...Shadows.popover,
  }
});
