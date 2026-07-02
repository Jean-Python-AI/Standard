import CoinsIcon from '@/assets/icons/Coins.svg';
import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { BorderRadius, Colors, Fonts, IconSize, Shadows, Spacing } from '@/constants';
import { COINS_REWARD_AMOUNT, STREAK_REWARD_THRESHOLD } from '@/constants/rewards';
import LottieView from 'lottie-react-native';
import { StyleSheet, Text, View } from 'react-native';

export default function Step3() {
  return (
    <OnboardingStepLayout nextRoute="/onboarding/step4">
      <Text style={styles.title}>Earn coins</Text>

      <View style={styles.rewardRow}>
        <View style={styles.iconBadge}>
          <Text style={styles.streakSeven}>7x</Text>
          <LottieView
            source={require('@/assets/lotties/Fire.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>

        <View style={styles.arrowContainer}>
          <Text style={styles.streakSeven}>=</Text>
        </View>

        <View style={styles.coinBadge}>
          <Text style={styles.streakSeven}>10</Text>
          <CoinsIcon width={IconSize.xl} height={IconSize.xl} />
        </View>
      </View>

      <Text style={styles.description}>
        Maintains a <Text style={styles.highlight}>{STREAK_REWARD_THRESHOLD} days</Text> streak and earns <Text style={styles.highlight}>{COINS_REWARD_AMOUNT} coins</Text>
      </Text>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontFamily: Fonts.bold,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  streakSeven: {
    fontSize: 30,
    fontFamily: Fonts.bold,
  },
  lottieContainer: {
    width: 150,
    height: 150,
    marginBottom: Spacing.md,
  },
  lottie: {
    width: 80,
    height: 80,
  },
  rewardCard: {
    width: '100%',
    backgroundColor: Colors.White,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.card,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    gap: Spacing.md,
  },
  iconBadge: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  arrowContainer: {
    width: 50,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.Black,
  },
  coinBadge: {
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakDots: {
    flexDirection: 'row',
    gap: Spacing.xxs,
  },
  description: {
    fontSize: 18,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    color: Colors.inactive,
    marginTop: Spacing.xl,
    lineHeight: 26,
  },
  highlight: {
    fontFamily: Fonts.bold,
    color: Colors.Black,
  },
});
