import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { BorderRadius, Colors, Fonts, Shadows, Spacing } from '@/constants';
import { useOnboarding } from '@/context/OnboardingContext';
import { useHabitActions } from '@/hooks/useHabitActions';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const GRAPH_WIDTH = 280;
const GRAPH_HEIGHT = 180;
const PADDING = 20;
const DRAW_WIDTH = GRAPH_WIDTH - 2 * PADDING;

const POINTS: [number, number][] = [
  [0.0, 140],
  [0.15, 150],
  [0.4, 120],
  [0.55, 130],
  [0.7, 80],
  [0.85, 77],
  [1.0, 0],
];

function catmullRom(p0: [number, number], p1: [number, number], p2: [number, number], p3: [number, number], t: number): [number, number] {
  const t2 = t * t;
  const t3 = t2 * t;
  const x = 0.5 * (
    (2 * p1[0]) +
    (-p0[0] + p2[0]) * t +
    (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
    (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3
  );
  const y = 0.5 * (
    (2 * p1[1]) +
    (-p0[1] + p2[1]) * t +
    (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
    (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3
  );
  return [x, y];
}

function buildSmoothCurve(): string {
  const scaled = POINTS.map(([t, y]): [number, number] => [
    PADDING + t * DRAW_WIDTH,
    PADDING + (y / 140) * (GRAPH_HEIGHT - 2 * PADDING),
  ]);

  const segments: string[] = [];
  segments.push(`M ${scaled[0][0].toFixed(1)} ${scaled[0][1].toFixed(1)}`);

  for (let i = 0; i < scaled.length - 1; i++) {
    const p0 = scaled[Math.max(i - 1, 0)];
    const p1 = scaled[i];
    const p2 = scaled[i + 1];
    const p3 = scaled[Math.min(i + 2, scaled.length - 1)];

    const STEPS_PER_SEGMENT = 10;
    for (let j = 1; j <= STEPS_PER_SEGMENT; j++) {
      const t = j / STEPS_PER_SEGMENT;
      const [cx, cy] = catmullRom(p0, p1, p2, p3, t);
      segments.push(`L ${cx.toFixed(1)} ${cy.toFixed(1)}`);
    }
  }

  return segments.join(' ');
}

const CURVE_PATH = buildSmoothCurve();

function ExponentialCurve() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1500 });
  }, [progress]);

  const revealStyle = useAnimatedStyle(() => ({
    width: PADDING + progress.value * DRAW_WIDTH,
  }));

  return (
    <View style={styles.graphContainer}>
      <View style={styles.graphCard}>
        <View style={styles.graphClip}>
          <Animated.View style={[styles.graphAnimated, revealStyle]}>
            <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
              {[0.25, 0.5, 0.75].map((ratio) => (
                <Path
                  key={ratio}
                  d={`M ${PADDING} ${GRAPH_HEIGHT - PADDING - ratio * (GRAPH_HEIGHT - 2 * PADDING)} L ${GRAPH_WIDTH - PADDING} ${GRAPH_HEIGHT - PADDING - ratio * (GRAPH_HEIGHT - 2 * PADDING)}`}
                  stroke={Colors.secondary}
                  strokeWidth={0.5}
                  strokeDasharray="4 4"
                />
              ))}

              <Path
                d={`M ${PADDING} ${PADDING} L ${PADDING} ${GRAPH_HEIGHT - PADDING} L ${GRAPH_WIDTH - PADDING} ${GRAPH_HEIGHT - PADDING}`}
                stroke={Colors.secondary}
                strokeWidth={1.5}
                fill="none"
              />

              <Path
                d={CURVE_PATH}
                stroke={Colors.Black}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Animated.View>
        </View>

        <View style={styles.graphLabels}>
          <Text style={styles.graphLabel}>Start</Text>
          <Text style={styles.graphLabel}>Exponential</Text>
        </View>
      </View>
    </View>
  );
}

export default function Step4() {
  const { name, color, colorId, icon, createdHabitId, setCreatedHabitId } = useOnboarding();
  const { create, remove } = useHabitActions();

  const handleCreate = async () => {
    if (createdHabitId !== null) {
      await remove(createdHabitId);
    }
    const newId = await create(name, icon, color, colorId, 0);
    if (typeof newId === 'number') {
      setCreatedHabitId(newId);
    }
  };

  return (
    <OnboardingStepLayout nextRoute="/onboarding/signup" onNext={handleCreate}>
      <Text style={styles.title}>Exponential results</Text>

      <ExponentialCurve />

      <Text style={styles.description}>
        The first few days seem insignificant, but the curve explodes over time.
      </Text>
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
  graphContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  graphCard: {
    backgroundColor: Colors.White,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.card,
  },
  graphClip: {
    width: GRAPH_WIDTH,
    height: GRAPH_HEIGHT,
    overflow: 'hidden',
  },
  graphAnimated: {
    width: GRAPH_WIDTH,
    height: GRAPH_HEIGHT,
  },
  graphLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xxs,
  },
  graphLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.inactive,
  },
  description: {
    fontSize: 18,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    color: Colors.inactive,
    lineHeight: 26,
  },
});
