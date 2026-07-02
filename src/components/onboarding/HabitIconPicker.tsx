import { ICON_MAP, ICON_NAMES } from '@/assets/icons/Habits';
import { BorderRadius, Colors, IconSize, Spacing } from '@/constants';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
export { ICON_MAP, ICON_NAMES };

interface HabitIconPickerProps {
  selected: string;
  onSelect: (name: string) => void;
}

export default function HabitIconPicker({ selected, onSelect }: HabitIconPickerProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.grid}>
        {ICON_NAMES.map((name) => {
          const Icon = ICON_MAP[name];
          const isSelected = name === selected;
          return (
            <Pressable
              key={name}
              style={[styles.iconButton, isSelected && styles.iconButtonSelected]}
              onPress={() => onSelect(name)}
            >
              <Icon
                key={name + (isSelected ? '-sel' : '')}
                width={IconSize.md}
                height={IconSize.md}
                color={isSelected ? Colors.White : Colors.Black}
              />
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 300,
    width: '100%',
    borderRadius: BorderRadius.lg,
  },
  content: {
    paddingHorizontal: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    gap: Spacing.xs,
    justifyContent: 'flex-start',
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.White,
  },
  iconButtonSelected: {
    backgroundColor: Colors.Black,
    borderColor: Colors.Black,
  },
});
