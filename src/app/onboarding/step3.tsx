import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import TypewriterPlaceholder from '@/components/onboarding/TypewriterPlaceholder';
import { Colors, Fonts } from '@/constants';
import { useOnboarding } from '@/context/OnboardingContext';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const EXAMPLES = [
  '10 push-ups',
  'read 2 pages',
  'meditate 5 min',
  'walk 10k steps',
  'no sugar today',
];

export default function Step3() {
  const { name, setName } = useOnboarding();

  return (
    <OnboardingStepLayout nextRoute="/onboarding/step4" disabled={!name.trim()}>
      <Text style={styles.text}>Your first Standard</Text>

      <View style={styles.inputContainer}>
        <TypewriterPlaceholder examples={EXAMPLES} visible={!name.trim()} />
        <TextInput
          style={styles.input}
          multiline={false}
          value={name}
          onChangeText={setName}
        />
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
    width: '90%',
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
  }
})
