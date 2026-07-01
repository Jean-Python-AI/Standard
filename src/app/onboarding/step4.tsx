import EditIcon from '@/assets/icons/edit.svg';
import HabitIconPicker from '@/components/onboarding/HabitIconPicker';
import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { BorderRadius, Colors, ColorsHabits, Fonts, IconSize, Spacing } from '@/constants';
import { useOnboarding } from '@/context/OnboardingContext';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Step4() {
  const { name, color, colorId, setColorId, icon, setIcon } = useOnboarding();
  const nbColors = ColorsHabits.length;

  return (
    <OnboardingStepLayout nextRoute="/onboarding/step5">
      <Text style={[styles.title, { fontSize: 25 }]}>Choice Color and Icon</Text>

      <View style={styles.colorSection}>
        <Text style={styles.label}>Color</Text>
        <Pressable
          style={[styles.colorButton, { backgroundColor: color }]}
          onPress={() => setColorId(((colorId + 1) % nbColors) as 0 | 1 | 2 | 3 | 4 | 5 | 6)}
        >
          <EditIcon width={IconSize.xs} height={IconSize.xs} color={Colors.White} />
          <Text style={{ color:Colors.White, fontFamily: Fonts.bold, fontSize: 15 }}>Change Color</Text>
        </Pressable>
      </View>

      <View style={styles.iconSection}>
        <Text style={styles.label}>Icon</Text>
        <HabitIconPicker selected={icon} onSelect={setIcon} />
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontFamily: Fonts.bold,
    marginBottom: Spacing.lg,
    marginTop: 50,
  },
  colorSection: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  colorButton: {
    padding: 8,
    gap: 10,
    height: 40,
    paddingHorizontal: 15,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: Colors.Black,
    flexDirection: 'row'
  },
  iconSection: {
    marginTop: Spacing.sm,
    alignItems: 'center',
    flexDirection: 'column',
    gap: Spacing.sm,
  },
});
