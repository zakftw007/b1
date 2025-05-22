import { StyleSheet, View, Text as RNText } from 'react-native';
import React from 'react';
import { SharedValue, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { Canvas, Path, SkFont, Skia, Text } from '@shopify/react-native-skia';
import DonutPath from './DonutPath';

type Props = {
  n: number;
  gap: number;
  radius: number;
  strokeWidth: number;
  outerStrokeWidth: number;
  decimals: SharedValue<number[]>;
  colors: string[];
  totalValue: SharedValue<number>;
  font: SkFont;
  smallFont: SkFont;
  label?: string; // Center label inside donut
  highlightIndex?: number;
  sideText1?: string | React.ReactNode; // First text next to donut
  sideText2?: string | React.ReactNode; // Second text next to donut
};

const SmallDonutChart = ({
  n,
  gap,
  decimals,
  colors,
  totalValue,
  strokeWidth,
  outerStrokeWidth,
  radius,
  font,
  smallFont,
  label = 'Total Spent',
  highlightIndex,
  sideText1,
  sideText2,
}: Props) => {
  const array = Array.from({ length: n });
  const innerRadius = radius - outerStrokeWidth / 2;

  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const animatedPercent = useSharedValue(0);

  useDerivedValue(() => {
    if (
      highlightIndex !== undefined &&
      highlightIndex !== null &&
      decimals.value.length > highlightIndex
    ) {
      const target = decimals.value[highlightIndex] * 100;
      animatedPercent.value = withTiming(target, { duration: 1000 });
    } else {
      animatedPercent.value = withTiming(0, { duration: 1000 });
    }
  }, [highlightIndex, decimals]);

  const targetText = useDerivedValue(() => {
    return `${Math.round(animatedPercent.value)}%`;
  });

  const textX = useDerivedValue(() => {
    const measurement = font.measureText(targetText.value);
    return radius - measurement.width / 2;
  }, [targetText]);

  const textY = useDerivedValue(() => {
    const measurement = font.measureText(targetText.value);
    return radius + measurement.height / 3;
  }, [targetText]);

  return (
    <View style={styles.rowContainer}>
      {/* Donut container: fixed width/height so text sits next to it */}
      <View style={{ width: radius * 2, height: radius * 2 }}>
        <Canvas style={{ flex: 1 }}>
          <Path
            path={path}
            color="#121212"
            style="stroke"
            strokeJoin="round"
            strokeWidth={outerStrokeWidth}
            strokeCap="round"
            start={0}
            end={1}
          />
          {array.map((_, index) => {
            const isHighlighting =
              highlightIndex !== undefined && highlightIndex !== null;
            const color = isHighlighting
              ? index === highlightIndex
                ? colors[index]
                : `${colors[index]}55`
              : colors[index];

            return (
              <DonutPath
                key={index}
                radius={radius}
                strokeWidth={strokeWidth}
                outerStrokeWidth={outerStrokeWidth}
                color={color}
                decimals={decimals}
                index={index}
                gap={gap}
              />
            );
          })}
          <Text x={textX} y={textY} text={targetText} font={font} color="white" />
        </Canvas>
      </View>

      {/* First side text */}
      {sideText1 && (
        <View style={styles.sideTextContainer}>
          {typeof sideText1 === 'string' ? (
            <RNText style={styles.sideText}>{sideText1}</RNText>
          ) : (
            sideText1
          )}
        </View>
      )}

      {/* Second side text */}
      {sideText2 && (
        <View style={styles.sideTextContainer2}>
          {typeof sideText2 === 'string' ? (
            <RNText style={styles.sideText2}>{sideText2}</RNText>
          ) : (
            sideText2
          )}
        </View>
      )}
    </View>
  );
};

export default SmallDonutChart;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideTextContainer: {
    marginLeft: 20,
  },
  sideTextContainer2: {
    marginLeft: 20,
  },
  sideText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sideText2: {
    fontSize: 50,
  },
});
