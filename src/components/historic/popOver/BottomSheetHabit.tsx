import BinIcon from '@/assets/icons/bin.svg';
import CoinsIcon from '@/assets/icons/Coins.svg';
import { BorderRadius, Colors, Fonts, IconSize, Opacity, Spacing, Typography } from '@/constants';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, TextInput } from 'react-native-gesture-handler';
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SHEET_HEIGHT = 500;
const CLOSE_THRESHOLD = 150;

interface BottomSheetHabitProps {
  visible: boolean;
  onClose: () => void;
  id: number;
  label: string | undefined;
  price: number;
  onSave: (id: number, label: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function BottomSheetHabit({ visible, onClose, id, label, price, onSave, onDelete }: BottomSheetHabitProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(label ?? '');
  }, [label, visible]);

  const translateY = useSharedValue(SHEET_HEIGHT);

  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : SHEET_HEIGHT, {
      damping: 50,
      stiffness: 300,
    });
  }, [visible, translateY]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > CLOSE_THRESHOLD) {
        translateY.value = withSpring(SHEET_HEIGHT, {}, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(0);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, SHEET_HEIGHT], [Opacity.backdrop, 0]),
  }));

  const PressSave = async () => {
    if (!text.trim()) return;
    const habitId = id;
    const habitText = text.trim();
    onClose();
    await new Promise(r => setTimeout(r, 300));
    await onSave(habitId, habitText);
  };

  const handleDelete = async () => {
    const habitId = id;
    onClose();
    await new Promise(r => setTimeout(r, 300));
    await onDelete(habitId);
  };

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 1001 }]} pointerEvents={visible ? 'auto' : 'none'}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: Colors.Black }, backdropStyle]}
        onTouchEnd={onClose}
      />

      <Animated.View style={[styles.sheet, sheetStyle]}>
        <View style={styles.sheetContent}>
          <GestureDetector gesture={gesture}>
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
          </GestureDetector>

          <View style={styles.sheetBody}>
            <View style={styles.sheetBodyInner}>
              <TextInput
                placeholder="Entrez votre texte ici..."
                value={text}
                onChangeText={setText}
                style={[styles.input, label === undefined ? styles.inputPlaceholder : styles.inputActive]}
              />
              <View style={styles.divider} />
            </View>

            <View style={styles.sheetFooter}>
              <AnimatedPressable
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <BinIcon width={24} height={24} color="white" />
                <Text style={styles.textDelete}>Delete</Text>
              </AnimatedPressable>

              {price > 0 && (
                <View style={styles.refundRow}>
                  <CoinsIcon width={IconSize.xs} height={IconSize.xs} />
                  <Text style={styles.refundText}>+{price}</Text>
                </View>
              )}

              <AnimatedPressable
                style={styles.saveButton}
                onPress={PressSave}
              >
                <Text style={styles.saveText}>Save</Text>
              </AnimatedPressable>
            </View>
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
    paddingBottom: Spacing.lg,
  },
  sheetContent: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.White,
    borderRadius: BorderRadius.xl,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: Spacing.xxs,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.secondary,
  },
  sheetBody: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  sheetBodyInner: {
    flex: 1,
    gap: Spacing.xs,
  },
  input: {
    ...Typography.h1,
  },
  inputPlaceholder: {
    color: 'gray',
  },
  inputActive: {
    color: Colors.Black,
  },
  divider: {
    height: 2,
    backgroundColor: Colors.secondary,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 2,
  },
  sheetFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  deleteButton: {
    padding: 8,
    paddingRight: 12,
    gap: Spacing.xxs,
    backgroundColor: Colors.destructive,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textDelete: {
    color: Colors.White,
    ...Typography.h3,
  },
  saveButton: {
    backgroundColor: Colors.Black,
    padding: 12,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: Colors.White,
    ...Typography.h3,
  },
  refundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  refundText: {
    color: Colors.White,
    ...Typography.h3,
  },
});
