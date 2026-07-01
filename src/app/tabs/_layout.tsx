import CheckIcon from '@/assets/icons/check.svg';
import TrackIcon from '@/assets/icons/track.svg';
import BottomSheetHabit from '@/components/historic/popOver/BottomSheetHabit';
import PopOver from '@/components/historic/popOver/PopOver';
import HomePopOver from '@/components/home/PopOver';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Colors } from '@/constants/Colors';
import { IconSize } from '@/constants/iconSizes';
import { BottomSheetProvider, useBottomSheet } from '@/contexts/BottomSheetContext';
import { OverlayProvider, useOverlay } from '@/contexts/OverlayContext';
import { useStreak } from '@/hooks/useStreak';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TABS = [
  { name: 'index',    href: '/tabs',          Icon: CheckIcon },
  { name: 'historic', href: '/tabs/historic',  Icon: TrackIcon },
] as const;

function TabButton({ href, Icon, active }: { href: typeof TABS[number]['href'], Icon: typeof TABS[number]['Icon'], active: boolean }) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => router.push(href)}
      style={[animatedStyle, {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }]}
      onPressIn={() => { scale.value = withSpring(0.9, { mass: 0.1, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { mass: 1, stiffness: 400 }); }}
    >
      <Icon width={IconSize.xl} height={IconSize.xl} color={active ? Colors.White : Colors.inactive} />
    </AnimatedPressable>
  );
}

function CenteredTabBar({ state }: { state: { index: number } }) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: Spacing.lg,
        left: 0,
        right: 0,
        alignItems: 'center',
        pointerEvents: 'box-none',
        zIndex: 100,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          width: '50%',
          height: 80,
          backgroundColor: Colors.navigationBackground,
          borderRadius: BorderRadius.xl,
          borderWidth: Spacing.xxs,
          borderColor: Colors.primaryBackground,
          overflow: 'hidden',
        }}
      >
        {TABS.map(({ name, href, Icon }, index) => (
          <TabButton
            key={name}
            href={href}
            Icon={Icon}
            active={state.index === index}
          />
        ))}
      </View>
    </View>
  );
}

function TabLayoutContent() {
  const { visible, close, habitId, label, price, onSave, onDelete } = useBottomSheet();
  const { visible: overlayVisible, close: closeOverlay, content } = useOverlay();
  const { streak, refresh: streakRefresh } = useStreak();
  const [tabIndex, setTabIndex] = useState(0);
  const lottieRef = useRef<LottieView>(null);
  const [showCoinsLottie, setShowCoinsLottie] = useState(false);

  useEffect(() => {
    if (overlayVisible) {
      streakRefresh();
    }
  }, [overlayVisible, streakRefresh]);

  return (
    <>
      <Tabs
        tabBar={() => null}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
        screenListeners={{
          state: (e) => {
            setTabIndex(e.data.state.index);
          },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="historic" options={{ title: 'Historic' }} />
      </Tabs>
      <CenteredTabBar state={{ index: tabIndex }} />
      <BottomSheetHabit
        visible={visible}
        onClose={close}
        id={habitId ?? 0}
        label={label}
        price={price}
        onSave={onSave}
        onDelete={onDelete}
      />
      {overlayVisible && !content && <HomePopOver visible onClose={closeOverlay} streak={streak} onCoinsEarned={() => setShowCoinsLottie(true)} />}
      {overlayVisible && content && <PopOver visible onClose={closeOverlay}>{content}</PopOver>}

      {/* Coins Lottie full screen */}
      {showCoinsLottie && (
        <View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000 }]} pointerEvents="none">
          <LottieView
            ref={lottieRef}
            source={require('@/assets/lotties/coins.json')}
            autoPlay
            loop={false}
            onAnimationFinish={() => setShowCoinsLottie(false)}
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      )}
    </>
  );
}

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetProvider>
        <OverlayProvider>
          <TabLayoutContent />
        </OverlayProvider>
      </BottomSheetProvider>
    </GestureHandlerRootView>
  );
}
