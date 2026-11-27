import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { colors, sliceColors } from '@/constants/theme';
import { formatMoney } from '@/lib/format';

export function LineChart({
  values,
  positive = true,
}: {
  values: number[];
  positive?: boolean;
}) {
  const [width, setWidth] = useState(0);
  const height = 168;
  if (values.length < 2) {
    return <Text style={styles.note}>A line appears after Stak has saved at least two valuations in this range.</Text>;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const color = positive ? colors.positive : colors.negative;
  const coords =
    width === 0
      ? []
      : values.map((value, index) => {
          const x = 6 + (index / (values.length - 1)) * (width - 12);
          const y = 18 + (1 - (value - min) / span) * (height - 36);
          return { x, y };
        });
  const d = coords.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ');

  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <Text style={styles.range}>
        {formatMoney(min)} – {formatMoney(max)}
      </Text>
      {width > 0 ? (
        <Svg width={width} height={height}>
          <Path d={d} stroke={color} strokeWidth={2.5} fill="none" />
          <Circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r={4} fill={color} />
        </Svg>
      ) : (
        <View style={{ height }} />
      )}
    </View>
  );
}

export function AllocationChart({
  slices,
}: {
  slices: { label: string; weight: number }[];
}) {
  const size = 148;
  const radius = 52;
  const stroke = 16;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <View style={styles.allocation}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          {slices.map((slice, index) => {
            const length = circumference * slice.weight;
            const dashOffset = -offset;
            offset += length;
            return (
              <Circle
                key={slice.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={sliceColors[index % sliceColors.length]}
                strokeWidth={stroke}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={dashOffset}
                fill="none"
              />
            );
          })}
        </G>
      </Svg>
      <View style={{ flex: 1, gap: 6 }}>
        {slices.map((slice, index) => (
          <View key={slice.label} style={styles.legendRow}>
            <View style={[styles.swatch, { backgroundColor: sliceColors[index % sliceColors.length] }]} />
            <Text style={styles.legend}>{slice.label}</Text>
            <Text style={styles.legendValue}>{Math.round(slice.weight * 100)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  note: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  range: { color: colors.faint, fontSize: 12, fontVariant: ['tabular-nums'] },
  allocation: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  swatch: { width: 8, height: 8, borderRadius: 4 },
  legend: { color: colors.text, flex: 1, fontSize: 13 },
  legendValue: { color: colors.muted, fontVariant: ['tabular-nums'], fontSize: 13 },
});
