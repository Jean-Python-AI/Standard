import { ICON_MAP } from '@/components/onboarding/HabitIconPicker';
import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { BorderRadius, Colors, Fonts, IconSize, Spacing, Typography } from '@/constants';
import { useOnboarding } from '@/context/OnboardingContext';
import { useHabitActions } from '@/hooks/useHabitActions';
import { StyleSheet, Text, View } from 'react-native';

export default function Step5() {
  const { name, color, colorId, icon } = useOnboarding();
  const { create } = useHabitActions();
  const SelectedIcon = ICON_MAP[icon];

  const handleCreate = async () => {
    await create(name, icon, color, colorId, 0);
  };

  return (
    <OnboardingStepLayout nextRoute="/onboarding/signup" onNext={handleCreate}>
      <Text style={styles.title}>Your Standard is ready</Text>

      <View style={styles.preview}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          {SelectedIcon && (
            <SelectedIcon width={IconSize.xxl} height={IconSize.xxl} color={Colors.White} />
          )}
        </View>
        <Text style={styles.name}>{name}</Text>
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontFamily: Fonts.bold,
    marginBottom: Spacing.lg,
  },
  preview: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontFamily: Fonts.bold,
  },
});
