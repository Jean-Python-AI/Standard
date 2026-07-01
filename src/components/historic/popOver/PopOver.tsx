import { BorderRadius, Colors } from '@/constants';
import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface PopOverProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function PopOver({ visible, onClose, children }: PopOverProps) {
  const scale = useSharedValue(0.7);

  useEffect(() => {
    scale.value = withSpring(visible ? 1 : 0.7, {
      damping: 40,
      stiffness: 300,
    });
  }, [visible, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      style={StyleSheet.absoluteFill}
    >
      <Pressable
        style={[StyleSheet.absoluteFill, {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }]}
        onPress={onClose}
      >
        {/* Contenu — stopPropagation empêche la fermeture au clic intérieur */}
        <Pressable onPress={e => e.stopPropagation()}>
          <Animated.View
            style={[animatedStyle, {
              backgroundColor: Colors.White,
              borderRadius: BorderRadius.xl,
              padding: 24,
              width: 900,
              maxWidth: '85%',
            }]}
          >
            {children}
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}