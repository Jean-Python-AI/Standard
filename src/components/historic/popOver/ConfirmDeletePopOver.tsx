import CoinsIcon from '@/assets/icons/Coins.svg';
import { BorderRadius, Colors, IconSize, Opacity, Spacing, Typography } from '@/constants';
import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface ConfirmDeletePopOverProps {
  visible: boolean;
  habitName: string;
  refundAmount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeletePopOver({
  visible,
  habitName,
  refundAmount,
  onConfirm,
  onCancel,
}: ConfirmDeletePopOverProps) {
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
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable onPress={e => e.stopPropagation()}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.title}>Supprimer {habitName} ?</Text>

            <View style={styles.refundRow}>
              <Text style={styles.refundText}>pour récupérer {refundAmount}</Text>
              <CoinsIcon width={IconSize.xs} height={IconSize.xs} color={Colors.Black} />
            </View>

            <View style={styles.buttons}>
              <Pressable style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelText}>Annuler</Text>
              </Pressable>
              <Pressable style={styles.confirmButton} onPress={onConfirm}>
                <Text style={styles.confirmText}>Supprimer</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.White,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    width: '85%',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.h1,
    color: Colors.Black,
  },
  refundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  refundText: {
    ...Typography.bodySmall,
    color: Colors.inactive,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  cancelText: {
    ...Typography.h3,
    color: Colors.Black,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.destructive,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  confirmText: {
    ...Typography.h3,
    color: Colors.White,
  },
});
