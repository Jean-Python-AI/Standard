import { Colors, Spacing } from '@/constants';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

export default function LoadingSpinner() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('@/assets/lotties/loading.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryBackground,
  },
  lottie: {
    width: Spacing.xl,
    height: Spacing.xl,
  },
});
