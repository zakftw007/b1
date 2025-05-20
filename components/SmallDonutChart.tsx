import { StyleSheet, View } from 'react-native';
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
    label?: string; // Customizable center label
    highlightIndex?: number; // Optional highlighted segment
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
        return radius + measurement.height / 3; // vertically center, tweak if needed
    }, [targetText]);

    return (
        <View style={styles.container}>
            <Canvas style={styles.container}>
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
                            ? colors[index] // full color
                            : `${colors[index]}55` // muted version
                        : colors[index]; // default: all full color

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
                <Text
                    x={textX}
                    y={textY}
                    text={targetText}
                    font={font}
                    color="white"
                />
            </Canvas>
        </View>
    );
};

export default SmallDonutChart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
