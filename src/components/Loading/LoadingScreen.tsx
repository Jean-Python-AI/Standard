import CheckIcon from '@/assets/icons/check.svg';
import { Colors, IconSize } from '@/constants';
import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface LoadingScreenProps {
  onReady: boolean;
  onFinish: () => void;
}

export default function LoadingScreen({ onReady, onFinish }: LoadingScreenProps) {
  const fadeOpacity = useSharedValue(1);
  const hasFinished = useRef(false);

  useEffect(() => {
    if (onReady && !hasFinished.current) {
      hasFinished.current = true;
      fadeOpacity.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(onFinish)();
      });
    }
  }, [onReady, fadeOpacity, onFinish]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <CheckIcon width={IconSize.xxl} height={IconSize.xxl} color={Colors.Black} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.Black,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});
