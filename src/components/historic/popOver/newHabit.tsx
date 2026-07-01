import CoinsIcon from '@/assets/icons/Coins.svg';
import EditIcon from '@/assets/icons/edit.svg';
import { BorderRadius, Colors, ColorsHabits, Fonts, IconSize, Spacing, Typography } from '@/constants';
import { useOverlay } from '@/contexts/OverlayContext';
import { useHabitActions } from '@/hooks/useHabitActions';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface NewHabitContentProps {
  onCreated?: () => void;
  price: number;
  coins: number;
  onDeduct: (amount: number) => Promise<boolean>;
}

export default function NewHabitContent({ onCreated, price, coins, onDeduct }: NewHabitContentProps) {
  const { close } = useOverlay();
  const [idColor, setIdColor] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const { create, isLoading } = useHabitActions();
  const bgColor = ColorsHabits[idColor] ?? ColorsHabits[0];

  const nbColors = ColorsHabits.length;
  const canAfford = coins >= price;

  const handleCreate = async () => {
    if (!name.trim()) return;
    if (price > 0) {
      const success = await onDeduct(price);
      if (!success) return;
    }
    const created = await create(name.trim(), 'idea', bgColor, idColor, price);
    if (created) {
      onCreated?.();
      close();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.todoSection}>
        <Text style={styles.text}>Create a new habit</Text>

        <Pressable
          style={[styles.colorButton, { backgroundColor: bgColor }]}
          onPress={() => setIdColor(prev => (prev + 1) % nbColors)}
        >
          <EditIcon width={IconSize.xs} height={IconSize.xs} color={Colors.White} />
        </Pressable>
      </View>

      <TextInput
        placeholder="Name of the habit"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Pressable
        style={({ pressed }) => [
          styles.createButton,
          {
            backgroundColor: pressed ? 'rgba(0,0,0,0.7)' : Colors.Black,
            opacity: canAfford ? 1 : 0.4,
          },
        ]}
        onPress={handleCreate}
        disabled={isLoading || !canAfford || !name.trim()}
      >
        <Text style={[styles.text, styles.createButtonText]}>Create for {price===0 ? 'Free' : price}</Text>
        {price !== 0 && <CoinsIcon width={30} height={30} color={Colors.White} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  todoSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    ...Typography.h2,
    fontFamily: Fonts.bold,
  },
  colorButton: {
    padding: 8,
    height: 40,
    width: 50,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: Colors.Black,
  },
  input: {
    width: '100%',
    ...Typography.body,
    fontFamily: Fonts.regular,
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  priceText: {
    ...Typography.body,
    fontFamily: Fonts.bold,
    color: Colors.Black,
  },
  priceInsufficient: {
    color: Colors.destructive,
  },
  createButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.xxs,
  },
  createButtonText: {
    color: Colors.White,
    ...Typography.h2,
  },
});
