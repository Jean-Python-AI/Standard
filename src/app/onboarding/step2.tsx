import CoinsIcon from '@/assets/icons/Coins.svg';
import { ICON_MAP } from '@/components/onboarding/HabitIconPicker';
import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { BorderRadius, Colors, Fonts, IconSize, Shadows, Spacing } from '@/constants';
import { useOnboarding } from '@/context/OnboardingContext';
import { StyleSheet, Text, View } from 'react-native';

const IdeaIcon = ICON_MAP['Idea'];

export default function Step2() {
  const { name, color, icon } = useOnboarding();
  const SelectedIcon = ICON_MAP[icon];

  return (
    <OnboardingStepLayout nextRoute="/onboarding/step3">
      <Text style={styles.title}>Unlocks new standards with coins</Text>

      <View style={styles.cardsContainer}>
        {/* New habit card */}
        <View style={styles.card}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
              {SelectedIcon && (
                <SelectedIcon width={IconSize.lg} height={IconSize.lg} color={Colors.White} />
              )}
            </View>
            <Text style={styles.cardLabel}>{name}</Text>
          </View>
          <Text style={styles.price}>Free</Text>
        </View>

        {/* 2e standard */}
        <View style={[styles.card, styles.cardLocked]}>
          <View style={styles.cardLeft}>
            <View style={styles.iconContainerLocked}>
              {IdeaIcon && (
                <IdeaIcon width={IconSize.lg} height={IconSize.lg} color={Colors.White} />
              )}
            </View>
            <Text style={styles.cardLabel}>2nd standard</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLocked}>10</Text>
            <CoinsIcon width={IconSize.sm} height={IconSize.sm} color={Colors.inactive} />
          </View>
        </View>

        {/* 3e standard */}
        <View style={[styles.card, styles.cardLocked, styles.cardLockedBottom]}>
          <View style={styles.cardLeft}>
            <View style={styles.iconContainerLocked}>
              {IdeaIcon && (
                <IdeaIcon width={IconSize.lg} height={IconSize.lg} color={Colors.White} />
              )}
            </View>
            <Text style={styles.cardLabel}>3rd standard</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLocked}>20</Text>
            <CoinsIcon width={IconSize.sm} height={IconSize.sm} color={Colors.inactive} />
          </View>
        </View>
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontFamily: Fonts.bold,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  cardsContainer: {
    width: '100%',
    gap: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.White,
    ...Shadows.card,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  price: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.Black,
  },
  cardLocked: {
    opacity: 0.8,
  },
  iconContainerLocked: {
    width: 45,
    height: 45,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceLocked: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.inactive,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  cardLockedBottom: {},
});
