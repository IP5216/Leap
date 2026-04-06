import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, VERTICAL_MAX_HEIGHT } from '@/constants';

interface Props {
  pct: number; // 0–1
  height: number; // inches
}

const MARKERS = [24, 48, 72, 96, 120];

export function VerticalBar({ pct, height }: Props) {
  const animPct = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animPct, {
      toValue: pct,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();
  }, [pct]);

  return (
    <View style={styles.row}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              height: animPct.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <View style={styles.markerColumn}>
        {MARKERS.map((m) => (
          <View
            key={m}
            style={[
              styles.markerRow,
              { bottom: `${((m / VERTICAL_MAX_HEIGHT) * 100).toFixed(1)}%` as any },
            ]}
          >
            <View style={styles.markerLine} />
            <Text style={[styles.markerLabel, height >= m && styles.markerActive]}>
              {m}"
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.current}>{height}"</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, flex: 1 },
  track: {
    width: 36,
    flex: 1,
    backgroundColor: COLORS.gray[900],
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    borderRadius: 18,
  },
  markerColumn: {
    position: 'relative',
    flex: 1,
    alignSelf: 'stretch',
  },
  markerRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  markerLine: { width: 10, height: 1, backgroundColor: COLORS.gray[700] },
  markerLabel: { fontSize: 11, color: COLORS.gray[700] },
  markerActive: { color: COLORS.gray[300] },
  current: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
});
