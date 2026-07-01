import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { Fonts } from '@/constants';
import { StyleSheet, Text } from 'react-native';

export default function Step2() {
  return (
    <OnboardingStepLayout nextRoute="/onboarding/step3">
      <Text style={styles.text}>Sustain over time for exponential results</Text>
    </OnboardingStepLayout>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    fontFamily: Fonts.bold
  }
});