import Back from '@/assets/icons/back.svg';
import GoogleIcon from '@/assets/icons/Google.svg';
import { BorderRadius, Colors, IconSize, Opacity, Spacing, Typography } from '@/constants';
import { usePressGuard } from '@/hooks/usePressGuard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const ROUTE_TABS = '/tabs';

export default function SignUp() {
  const router = useRouter();
  const { guard, isPressed } = usePressGuard();

  const handleNext = async () => {
    if (isPressed) return;
    await AsyncStorage.setItem('onboardingDone', 'true');
    router.replace(ROUTE_TABS);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, { opacity: pressed ? Opacity.pressed : 1 }]}
        >
          <Back width={IconSize.md} height={IconSize.md} color={Colors.Black} />
        </Pressable>
      </View>

      <View style={styles.content} />

      <View style={styles.bottom}>
        <Pressable
          style={({ pressed }) => [styles.button, { opacity: isPressed ? Opacity.disabled : pressed ? Opacity.pressed : 1 }]}
          onPress={() => guard(handleNext)}
        >
          <GoogleIcon width={IconSize.lg} height={IconSize.lg} color={Colors.White} />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  top: {
    width: '100%',
    paddingTop: Spacing.xl,
  },
  backButton: {
    backgroundColor: Colors.tertiary,
    padding: Spacing.xxs,
    paddingRight: Spacing.xs,
    borderRadius: BorderRadius.lg,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
  },
  bottom: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: Spacing.md,
  },
  button: {
    backgroundColor: Colors.Black,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    alignItems: 'center',
    width: '90%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: Colors.White,
    ...Typography.h3,
  },
});
