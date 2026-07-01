import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { Fonts } from '@/constants';
import { StyleSheet, Text } from 'react-native';

export default function Step1() {
  return (
    <OnboardingStepLayout nextRoute="/onboarding/step2">
      <Text style={styles.text}>1 simple action{'\n'}every days{'\n'}without exceptions</Text>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    fontFamily: Fonts.bold
  }
})