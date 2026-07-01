import { Colors, Fonts, Spacing } from '@/constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

const TIMING = {
  typeSpeed: 50,
  eraseSpeed: 30,
  pauseAfterType: 1500,
  pauseAfterErase: 300,
} as const;

interface TypewriterPlaceholderProps {
  examples: string[];
  visible: boolean;
}

export default function TypewriterPlaceholder({ examples, visible }: TypewriterPlaceholderProps) {
  const [displayedText, setDisplayedText] = useState('');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const runAnimation = useCallback(() => {
    if (!mountedRef.current || examples.length === 0) return;

    let exampleIndex = 0;

    const typeNext = () => {
      if (!mountedRef.current) return;
      const current = examples[exampleIndex % examples.length];
      let charIndex = 0;

      const typeChar = () => {
        if (!mountedRef.current) return;
        if (charIndex <= current.length) {
          setDisplayedText(current.slice(0, charIndex));
          charIndex++;
          animationRef.current = setTimeout(typeChar, TIMING.typeSpeed);
        } else {
          animationRef.current = setTimeout(eraseStart, TIMING.pauseAfterType);
        }
      };

      const eraseStart = () => {
        if (!mountedRef.current) return;
        let eraseIndex = current.length;

        const eraseChar = () => {
          if (!mountedRef.current) return;
          if (eraseIndex >= 0) {
            setDisplayedText(current.slice(0, eraseIndex));
            eraseIndex--;
            animationRef.current = setTimeout(eraseChar, TIMING.eraseSpeed);
          } else {
            exampleIndex++;
            animationRef.current = setTimeout(typeNext, TIMING.pauseAfterErase);
          }
        };

        eraseChar();
      };

      typeChar();
    };

    typeNext();
  }, [examples]);

  useEffect(() => {
    mountedRef.current = true;
    setDisplayedText('');
    if (visible) {
      runAnimation();
    }
    return () => {
      mountedRef.current = false;
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [visible, runAnimation]);

  if (!visible || !displayedText) return null;

  return (
    <Text
      style={styles.placeholder}
      pointerEvents="none"
      accessibilityRole="text"
      accessibilityLabel={displayedText}
    >
      {displayedText}
    </Text>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    fontSize: 20,
    left: Spacing.md,
    top: Spacing.md,
    fontFamily: Fonts.regular,
    color: Colors.inactive,
  },
});
