import EditIcon from '@/assets/icons/edit.svg';
import HabitIconPicker from '@/components/onboarding/HabitIconPicker';
import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import TypewriterPlaceholder from '@/components/onboarding/TypewriterPlaceholder';
import { BorderRadius, Colors, ColorsHabits, Fonts, IconSize, Spacing } from '@/constants';
import { useOnboarding } from '@/context/OnboardingContext';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const EXAMPLES = [
  '10 push-ups',
  'read 2 pages',
  'meditate 5 min',
  'walk 10k steps',
  'no sugar today',
];

export default function Step3() {
  const { name, setName, color, colorId, setColorId, icon, setIcon } = useOnboarding();
  const nbColors = ColorsHabits.length;

  return (
    <OnboardingStepLayout nextRoute="/onboarding/step2" disabled={!name.trim()}>
      <Text style={styles.text}>Your first Standard</Text>

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TypewriterPlaceholder examples={EXAMPLES} visible={!name.trim()} />
          <TextInput
            style={styles.input}
            multiline={false}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.containerColorsIcons}>
          <Pressable
            style={[styles.colorButton, { backgroundColor: color }]}
            onPress={() => setColorId(((colorId + 1) % nbColors) as 0 | 1 | 2 | 3 | 4 | 5 | 6)}
          >
            <EditIcon width={IconSize.xs} height={IconSize.xs} color={Colors.White} />
          </Pressable>
          <HabitIconPicker selected={icon} onSelect={setIcon} />
        </View>
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    fontFamily: Fonts.bold
  },
  inputContainer: {
    marginTop: 40,
    width: '100%',
    position: 'relative',
  },
  input: {
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: 12,
    fontSize: 20,
    fontFamily: Fonts.regular,
    color: '#111',
    textAlignVertical: 'top'
  },
  container: {
    width: '100%',
    flexDirection: 'column',
    gap: Spacing.md,
    alignItems: 'center',
  },
  containerColorsIcons: {
    width: '100%',
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  colorSection: {
    marginTop: Spacing.lg,
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
    height: 50,
    width: 50,
    paddingHorizontal: 15,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.White,
    flexDirection: 'row',
  },
  iconSection: {
    marginTop: Spacing.sm,
    alignItems: 'center',
    flexDirection: 'column',
    gap: Spacing.sm,
    width: '100%',
  },
});
