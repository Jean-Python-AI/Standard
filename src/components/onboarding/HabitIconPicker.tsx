import BxBxsBabyCarriage from '@/assets/icons/Habits/BxBxsBabyCarriage.svg';
import BxBxsBookBookmark from '@/assets/icons/Habits/BxBxsBookBookmark.svg';
import BxBxsCamera from '@/assets/icons/Habits/BxBxsCamera.svg';
import BxBxsChart from '@/assets/icons/Habits/BxBxsChart.svg';
import BxBxsFilm from '@/assets/icons/Habits/BxBxsFilm.svg';
import BxBxsFlorist from '@/assets/icons/Habits/BxBxsFlorist.svg';
import BxBxsGraduation from '@/assets/icons/Habits/BxBxsGraduation.svg';
import BxBxsHotel from '@/assets/icons/Habits/BxBxsHotel.svg';
import BxBxsLemon from '@/assets/icons/Habits/BxBxsLemon.svg';
import BxBxsSchool from '@/assets/icons/Habits/BxBxsSchool.svg';
import BxBxsTimer from '@/assets/icons/Habits/BxBxsTimer.svg';
import BxBxsTrain from '@/assets/icons/Habits/BxBxsTrain.svg';
import BxRun from '@/assets/icons/Habits/BxRun.svg';
import FeCar from '@/assets/icons/Habits/FeCar.svg';
import FeCart from '@/assets/icons/Habits/FeCart.svg';
import FeRocket from '@/assets/icons/Habits/FeRocket.svg';
import Idea from '@/assets/icons/Habits/Idea.svg';
import TablerApple from '@/assets/icons/Habits/TablerApple.svg';
import TablerBackhoe from '@/assets/icons/Habits/TablerBackhoe.svg';
import TablerBarbell from '@/assets/icons/Habits/TablerBarbell.svg';
import TablerBeach from '@/assets/icons/Habits/TablerBeach.svg';
import TablerBottle from '@/assets/icons/Habits/TablerBottle.svg';
import TablerBrush from '@/assets/icons/Habits/TablerBrush.svg';
import TablerChartDots from '@/assets/icons/Habits/TablerChartDots.svg';
import TablerChess from '@/assets/icons/Habits/TablerChess.svg';
import TablerChristmasTree from '@/assets/icons/Habits/TablerChristmasTree.svg';
import TablerCoffee from '@/assets/icons/Habits/TablerCoffee.svg';
import { BorderRadius, Colors, IconSize, Spacing } from '@/constants';
import { Pressable, StyleSheet, View } from 'react-native';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  BxBxsBabyCarriage,
  BxBxsBookBookmark,
  BxBxsCamera,
  BxBxsChart,
  BxBxsFilm,
  BxBxsFlorist,
  BxBxsGraduation,
  BxBxsHotel,
  BxBxsLemon,
  BxBxsSchool,
  BxBxsTimer,
  BxBxsTrain,
  BxRun,
  FeCar,
  FeCart,
  FeRocket,
  Idea,
  TablerApple,
  TablerBackhoe,
  TablerBarbell,
  TablerBeach,
  TablerBottle,
  TablerBrush,
  TablerChartDots,
  TablerChess,
  TablerChristmasTree,
  TablerCoffee,
};

export { ICON_MAP };
export const ICON_NAMES = Object.keys(ICON_MAP);

interface HabitIconPickerProps {
  selected: string;
  onSelect: (name: string) => void;
}

export default function HabitIconPicker({ selected, onSelect }: HabitIconPickerProps) {
  return (
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
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    justifyContent: 'center',
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
