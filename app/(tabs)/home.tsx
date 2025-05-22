import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, ActivityIndicator } from 'react-native';
import DonutChart from '@/components/DonutChart';
import SmallDonutChart from '@/components/SmallDonutChart';
import { useFont } from '@shopify/react-native-skia';
import Animated, { useSharedValue, withTiming, useDerivedValue, runOnJS } from 'react-native-reanimated';
import { calculatePercentage } from '@/utils/calculatePercentage';
import { generateRandomNumbers } from '@/utils/generateRandomNumbers';
import { SafeAreaView } from 'react-native-safe-area-context';

const RADIUS = 160;
const STROKE_WIDTH = 30;
const OUTER_STROKE_WIDTH = 46;
const GAP = 0.04;

export const Home = () => {
  const n = 5;
  const [data, setData] = useState<any[]>([]);
  const totalValue = useSharedValue(0);
  const decimals = useSharedValue<number[]>([]);
  const decimals2 = useSharedValue<number[]>([]);
  const colors = ['#fe769c', '#46a0f8', '#c3f439', '#88dabc', '#e43433'];

  const AnimatedText = Animated.createAnimatedComponent(Text);

  const AnimatedNumber = ({ value, style, prefix = '$' }: { value: number; style?: any; prefix?: string }) => {
    const animatedValue = useSharedValue(0);
    const [displayValue, setDisplayValue] = useState(prefix + '0');

    useEffect(() => {
      animatedValue.value = withTiming(value, { duration: 1000 });
    }, [value]);

    useDerivedValue(() => {
      const val = prefix + Math.floor(animatedValue.value).toLocaleString();
      runOnJS(setDisplayValue)(val);
    });

    return <Text style={style}>{displayValue}</Text>;
  };

  const generateData = () => {
    const generateNumbers = generateRandomNumbers(n);
    const total = generateNumbers.reduce((acc, cur) => acc + cur, 0);
    const generatePercentages = calculatePercentage(generateNumbers, total);
    const generateDecimals = generatePercentages.map(num => Number(num.toFixed(0)) / 100);
    const generateDecimals2 = [...generateNumbers];
    totalValue.value = withTiming(total, { duration: 1000 });
    decimals.value = [...generateDecimals];
    decimals2.value = [...generateDecimals2];

    const arrayOfObjects = generateNumbers.map((value, index) => ({
      value,
      percentage: generatePercentages[index],
      color: colors[index],
    }));

    setData(arrayOfObjects);
  };

  const font = useFont(require('@/assets/fonts/Roboto-Bold.ttf'), 60);
  const smallFont = useFont(require('@/assets/fonts/Roboto-Light.ttf'), 25);

  if (!font || !smallFont) {
    return <ActivityIndicator color="#F5F5F5" />;
  }

  const categories = [
    'Food',
    'Transportation',
    'Shopping',
    'Utilities',
    'Entertainment',
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
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

        <Text style={{ color: 'white', paddingBottom: 30, paddingTop: 20, fontFamily: 'Roboto-Bold', fontSize: 20, }}>
          Expense Breakdown
        </Text>

        {categories.map((category, index) => (
          <View key={index} style={{ width: '90%', alignItems: 'center' }}>

            <Text style={{ color: 'white', fontFamily: 'Roboto-Bold', fontSize: 20, paddingTop: index === 0 ? 0 : 20 }}>
              {category}
            </Text>

            <View style={{ width: '100%', marginTop: 20 }}>
              <View style={{ height: 120 }}>
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
                  highlightIndex={index}
                  label={''}
                  sideText1={<AnimatedNumber style={{ color: 'white', fontFamily: 'Roboto-Bold', fontSize: 35 }} value={decimals2.value[index] || 0}/>}
                  sideText2={<AnimatedNumber style={{ color: 'red', fontFamily: 'Roboto-Bold', fontSize: 20 }} value={decimals2.value[index] || 0}/>}
                />

              </View>
            </View>

          </View>
        ))}

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
            marginBottom: 30,
          }}
        >
          <Text style={{ color: '#F5F5F5', fontSize: 18, fontFamily: 'Roboto-Bold', }}>
            Generate
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
