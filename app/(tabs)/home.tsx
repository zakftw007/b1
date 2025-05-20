import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, ActivityIndicator } from 'react-native';
import DonutChart from '@/components/DonutChart';
import SmallDonutChart from '@/components/SmallDonutChart'
import { useFont } from '@shopify/react-native-skia';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { calculatePercentage } from '@/utils/calculatePercentage';
import { generateRandomNumbers } from '@/utils/generateRandomNumbers';
import RenderItem from '@/components/RenderItem';
import { SafeAreaView } from 'react-native-safe-area-context';

const RADIUS = 160;
const STROKE_WIDTH = 30;
const OUTER_STROKE_WIDTH = 46;
const GAP = 0.04;

export const Home = () => {
  const n = 5;
  const [data, setData] = useState<any[]>([]); // Explicitly typing as an array of objects
  const totalValue = useSharedValue(0);
  const decimals = useSharedValue<number[]>([]); // Explicit type for SharedValue of number[]
  const colors = ['#fe769c', '#46a0f8', '#c3f439', '#88dabc', '#e43433'];

  const generateData = () => {
    const generateNumbers = generateRandomNumbers(n);
    const total = generateNumbers.reduce(
      (acc, currentValue) => acc + currentValue,
      0,
    );
    const generatePercentages = calculatePercentage(generateNumbers, total);
    const generateDecimals = generatePercentages.map(
      (number) => Number(number.toFixed(0)) / 100,
    );
    totalValue.value = withTiming(total, { duration: 1000 });
    decimals.value = [...generateDecimals];

    const arrayOfObjects = generateNumbers.map((value, index) => ({
      value,
      percentage: generatePercentages[index],
      color: colors[index],
    }));

    setData(arrayOfObjects);
  };

  // Loading fonts
  const font = useFont(require('@/assets/fonts/Roboto-Bold.ttf'), 60);
  const smallFont = useFont(require('@/assets/fonts/Roboto-Light.ttf'), 25);

  // Handle loading state
  if (!font || !smallFont) {
    return <ActivityIndicator color="#F5F5F5" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}>
        <View style={{ width: 320, height: 320, marginTop: 20 }}>
          <DonutChart
            radius={RADIUS}
            gap={GAP}
            strokeWidth={STROKE_WIDTH}
            outerStrokeWidth={OUTER_STROKE_WIDTH}
            font={font}
            smallFont={smallFont}
            totalValue={totalValue}
            n={n}
            decimals={decimals}
            colors={colors}
          />
        </View>

        <Text style={{ color: "white", paddingBottom: 30, paddingTop: 20, fontFamily: 'Roboto-Bold', fontSize: 20 }}>Expense Breakdown</Text>

        <Text style={{ color: "white", fontFamily: 'Roboto-Bold', fontSize: 20 }}>Food</Text>

        <View style={{ width: '90%', height: 120, marginTop: 20 }}>
          <SmallDonutChart
            radius={60}
            gap={0.04}
            strokeWidth={11}
            outerStrokeWidth={25}
            font={smallFont}
            smallFont={smallFont}
            totalValue={totalValue}
            n={n}
            decimals={decimals}
            colors={colors}
            highlightIndex={0}
            label={""}
          />
        </View>

        <Text style={{ color: "white", fontFamily: 'Roboto-Bold', fontSize: 20, paddingTop: 20 }}>Transportation</Text>

        <View style={{ width: '90%', height: 120, marginTop: 20 }}>
          <SmallDonutChart
            radius={60}
            gap={0.04}
            strokeWidth={11}
            outerStrokeWidth={25}
            font={smallFont}
            smallFont={smallFont}
            totalValue={totalValue}
            n={n}
            decimals={decimals}
            colors={colors}
            highlightIndex={1}
            label={""}
          />
        </View>

        <Text style={{ color: "white", fontFamily: 'Roboto-Bold', fontSize: 20, paddingTop: 20 }}>Shopping</Text>

        <View style={{ width: '90%', height: 120, marginTop: 20 }}>
          <SmallDonutChart
            radius={60}
            gap={0.04}
            strokeWidth={11}
            outerStrokeWidth={25}
            font={smallFont}
            smallFont={smallFont}
            totalValue={totalValue}
            n={n}
            decimals={decimals}
            colors={colors}
            highlightIndex={2}
            label={""}
          />
        </View>

        <Text style={{ color: "white", fontFamily: 'Roboto-Bold', fontSize: 20, paddingTop: 20 }}>Utilities</Text>

        <View style={{ width: '90%', height: 120, marginTop: 20 }}>
          <SmallDonutChart
            radius={60}
            gap={0.04}
            strokeWidth={11}
            outerStrokeWidth={25}
            font={smallFont}
            smallFont={smallFont}
            totalValue={totalValue}
            n={n}
            decimals={decimals}
            colors={colors}
            highlightIndex={3}
            label={""}
          />
        </View>

        <Text style={{ color: "white", fontFamily: 'Roboto-Bold', fontSize: 20, paddingTop: 20 }}>Entertainment</Text>

        <View style={{ width: '90%', height: 120, marginTop: 20 }}>
          <SmallDonutChart
            radius={60}
            gap={0.04}
            strokeWidth={11}
            outerStrokeWidth={25}
            font={smallFont}
            smallFont={smallFont}
            totalValue={totalValue}
            n={n}
            decimals={decimals}
            colors={colors}
            highlightIndex={4}
            label={""}
          />
        </View>
        {/* {data.map((item, index) => (
          <RenderItem item={item} key={index} index={index} />
        ))} */}
        <Pressable
          onPress={generateData}
          style={{
            backgroundColor: '#2E8C89',
            marginTop: 30,
            paddingVertical: 16,
            paddingHorizontal: 96,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            marginBottom: 30
          }}>
          <Text style={{ color: '#F5F5F5', fontSize: 18, fontFamily: 'Roboto-Bold' }}>Generate</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
