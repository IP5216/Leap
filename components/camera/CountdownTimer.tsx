import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '@/constants';

interface Props {
  seconds: number;
  onComplete: () => void;
}

export function CountdownTimer({ seconds, onComplete }: Props) {
  const [count, setCount] = useState(seconds);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    Animated.sequence([
      Animated.timing(scale, { toValue: 1.5, duration: 150, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <View style={styles.overlay}>
      <Animated.Text style={[styles.number, { transform: [{ scale }] }]}>
        {count}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  number: {
    fontSize: 120,
    fontWeight: '900',
    color: COLORS.white,
  },
});
