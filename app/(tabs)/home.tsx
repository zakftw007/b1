import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DonutChart from '@/components/DonutChart';
import SmallDonutChart from '@/components/SmallDonutChart';
import { useFont } from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  withTiming,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import { calculatePercentage } from '@/utils/calculatePercentage';
import { generateRandomNumbers } from '@/utils/generateRandomNumbers';
import { SafeAreaView } from 'react-native-safe-area-context';

const RADIUS = 160;
const STROKE_WIDTH = 30;
const OUTER_STROKE_WIDTH = 46;
const GAP = 0.04;

/**
 * AnimatedNumber: Animates from 0 → value,
 * then displays as "prefix + formattedValue".
 */
const AnimatedNumber = ({
  value,
  style,
  prefix = '$',
}: {
  value: number;
  style?: any;
  prefix?: string;
}) => {
  const animatedValue = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(prefix + '0');

  useEffect(() => {
    animatedValue.value = withTiming(value, { duration: 800 });
  }, [value]);

  useDerivedValue(() => {
    const val = prefix + Math.floor(animatedValue.value).toLocaleString();
    runOnJS(setDisplayValue)(val);
  });

  return <Text style={style}>{displayValue}</Text>;
};

export const Home = () => {
  const n = 5;
  const colors = ['#fe769c', '#46a0f8', '#c3f439', '#88dabc', '#e43433'];

  // Determine current month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const currentMonth = monthNames[new Date().getMonth()];

  // === STATE VARIABLES ===
  const [data, setData] = useState<any[]>([]);
  const [budgetGoals, setBudgetGoals] = useState<number[]>([
    1500, // Food
    800,  // Transportation
    1200, // Shopping
    600,  // Utilities
    500,  // Entertainment
  ]);
  // Monthly total budget is now stored separately
  const [monthlyTotalBudget, setMonthlyTotalBudget] = useState<number>(
    budgetGoals.reduce((acc, cur) => acc + cur, 0)
  );

  // Modal‐related state for editing all budgets at once
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBudgetValues, setEditingBudgetValues] = useState<string[]>([]);
  const [editingTotalValue, setEditingTotalValue] = useState<string>('');

  // Shared animated values for the charts
  const totalValue = useSharedValue(0);
  const decimals = useSharedValue<number[]>([]);
  const decimals2 = useSharedValue<number[]>([]);

  const font = useFont(require('@/assets/fonts/Roboto-Bold.ttf'), 60);
  const smallFont = useFont(require('@/assets/fonts/Roboto-Light.ttf'), 25);

  if (!font || !smallFont) {
    return <ActivityIndicator color="#F5F5F5" />;
  }

  const categories = ['Food', 'Transportation', 'Shopping', 'Utilities', 'Entertainment'];

  /**
   * Generate random "spent" data for each category
   * (Replace this with real data in production.)
   */
  const generateData = () => {
    const generateNumbers = generateRandomNumbers(n);
    const total = generateNumbers.reduce((acc, cur) => acc + cur, 0);
    const generatePercentages = calculatePercentage(generateNumbers, total);
    const generateDecimals = generatePercentages.map((num) => Number(num.toFixed(0)) / 100);
    const generateDecimals2 = [...generateNumbers];

    totalValue.value = withTiming(total, { duration: 800 });
    decimals.value = [...generateDecimals];
    decimals2.value = [...generateDecimals2];

    const arrayOfObjects = generateNumbers.map((value, index) => ({
      value,
      percentage: generatePercentages[index],
      color: colors[index],
    }));
    setData(arrayOfObjects);
  };

  // Open "edit all budgets" modal
  const openEditAllModal = () => {
    // Pre-fill editingBudgetValues with current budgetGoals as strings
    setEditingBudgetValues(budgetGoals.map((bg) => bg.toString()));
    // Pre-fill editingTotalValue with current monthly total
    setEditingTotalValue(monthlyTotalBudget.toString());
    setIsModalVisible(true);
  };

  // Calculate validation info for current editing values
  const getValidationInfo = () => {
    const totalNumeric = parseFloat(editingTotalValue) || 0;
    const categorySum = editingBudgetValues.reduce((sum, val) => {
      const num = parseFloat(val) || 0;
      return sum + num;
    }, 0);

    const difference = categorySum - totalNumeric;
    const isValid = totalNumeric > 0 && categorySum <= totalNumeric &&
      editingBudgetValues.every(val => parseFloat(val) > 0);

    return { totalNumeric, categorySum, difference, isValid };
  };

  // Save all budget changes (with validation)
  const saveAllBudgetChanges = () => {
    // Validate total first
    const totalNumeric = parseFloat(editingTotalValue);
    if (isNaN(totalNumeric) || totalNumeric <= 0) {
      Alert.alert('Invalid Input', 'Please enter a positive number for Total Budget');
      return;
    }

    // Validate each category
    const newValuesNumeric: number[] = [];
    for (let i = 0; i < editingBudgetValues.length; i++) {
      const numericValue = parseFloat(editingBudgetValues[i]);
      if (isNaN(numericValue) || numericValue <= 0) {
        Alert.alert(
          'Invalid Input',
          `Please enter a positive number for ${categories[i]}`
        );
        return;
      }
      newValuesNumeric.push(numericValue);
    }

    // Check if category sum exceeds total budget
    const categorySum = newValuesNumeric.reduce((sum, val) => sum + val, 0);
    if (categorySum > totalNumeric) {
      // This shouldn't happen due to UI validation, but just in case
      Alert.alert(
        'Budget Mismatch',
        `Your category budgets total $${categorySum.toLocaleString()}, which exceeds your total budget of $${totalNumeric.toLocaleString()}.`
      );
      return;
    }

    // Update state
    setMonthlyTotalBudget(totalNumeric);
    setBudgetGoals(newValuesNumeric);
    setIsModalVisible(false);
    setEditingBudgetValues([]);
    setEditingTotalValue('');
  };

  const cancelAllBudgetEdit = () => {
    setIsModalVisible(false);
    setEditingBudgetValues([]);
    setEditingTotalValue('');
  };

  // Compute totals for the "Total" summary card
  const totalBudget = monthlyTotalBudget;
  const totalSpent = decimals2.value.reduce((acc, cur) => acc + cur, 0);

  // Decide color/label for the total overview:
  const totalDiff = totalSpent - totalBudget;
  const totalColor = totalDiff <= 0 ? '#44ff44' : '#ff4444';
  const totalLabel = totalDiff <= 0 ? 'Under Total Budget' : 'Over Total Budget';

  // Get validation info for the modal
  const validationInfo = getValidationInfo();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        {/* ==== TOTAL SUMMARY CARD ==== */}
        <View
          style={{
            backgroundColor: '#1e1e1e',
            borderRadius: 12,
            padding: 16,
            marginTop: 20,
            width: '90%',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#F5F5F5',
              fontFamily: 'Roboto-Bold',
              fontSize: 18,
            }}
          >
            {currentMonth} Overview
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'baseline' }}>
            {/* AnimatedNumber colored by totalColor */}
            <AnimatedNumber
              style={{ color: totalColor, fontFamily: 'Roboto-Bold', fontSize: 32 }}
              value={totalSpent}
            />
            <Text
              style={{
                color: '#888',
                fontFamily: 'Roboto-Light',
                fontSize: 16,
                marginLeft: 4,
              }}
            >
              / ${totalBudget.toLocaleString()}
            </Text>
          </View>
          {/* Label colored by totalColor */}
          <Text
            style={{
              color: totalColor,
              fontFamily: 'Roboto-Light',
              fontSize: 14,
              marginTop: 4,
            }}
          >
            {totalLabel}
          </Text>
        </View>

        {/* ==== MAIN DONUT CHART ==== */}
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

        {/* ==== EDIT BUDGET GOALS BUTTON (Moved Here) ==== */}
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 10,
          }}
        >
          <Pressable
            onPress={openEditAllModal}
            style={{
              backgroundColor: '#2E8C89',
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#F5F5F5', fontSize: 14, fontFamily: 'Roboto-Bold' }}>
              Edit Budget Goals
            </Text>
          </Pressable>
        </View>

        {/* ==== PER‐CATEGORY CARDS (NO INDIVIDUAL EDIT BUTTONS) ==== */}
        {categories.map((category, index) => {
          const spentAmount = decimals2.value[index] || 0;
          const budgetAmount = budgetGoals[index];

          // Determine color/prefix/labelText in one pass:
          const difference = spentAmount - budgetAmount;
          let color = '#44ff44'; // under budget → green
          let prefix = '-$';
          let labelText = 'Under Budget';

          if (difference > 0) {
            const threshold = budgetAmount * 0.1; // 10% = "a bit over"
            prefix = '+$';
            if (difference <= threshold) {
              color = '#FFD700';        // a bit over → yellow
              labelText = 'A Bit Over';
            } else {
              color = '#ff4444';        // well over → red
              labelText = 'Over Budget';
            }
          }

          return (
            <React.Fragment key={category}>
              {/* Card Container */}
              <View
                style={{
                  width: '90%',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  marginTop: index === 0 ? 20 : 16, // space between cards
                }}
              >
                {/* Category Name + Budget Amount in One Row */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Roboto-Bold',
                      fontSize: 18,
                      letterSpacing: 0.5,
                    }}
                  >
                    {category}
                  </Text>
                  <Text
                    style={{
                      color: '#888',
                      fontFamily: 'Roboto-Light',
                      fontSize: 14,
                    }}
                  >
                    ${budgetAmount.toLocaleString()}
                  </Text>
                </View>

                {/* Donut + Difference */}
                <View style={{ flexDirection: 'row', marginTop: 12, height: 120 }}>
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
                    sideText1={
                      <AnimatedNumber
                        style={{
                          color: 'white',
                          fontFamily: 'Roboto-Bold',
                          fontSize: 32,
                        }}
                        value={spentAmount}
                      />
                    }
                    sideText2={
                      <View style={{ alignItems: 'center' }}>
                        {/* Difference number, colored the same */}
                        <AnimatedNumber
                          style={{
                            color,
                            fontFamily: 'Roboto-Bold',
                            fontSize: 18,
                          }}
                          value={Math.abs(difference)}
                          prefix={prefix}
                        />
                        {/* Label below, same color */}
                        <Text
                          style={{
                            color,
                            fontFamily: 'Roboto-Light',
                            fontSize: 12,
                            marginTop: 2,
                          }}
                        >
                          {labelText}
                        </Text>
                      </View>
                    }
                  />
                </View>
              </View>

              {/* Divider Line Between Cards */}
              {index < categories.length - 1 && (
                <View
                  style={{
                    width: '80%',
                    height: 1,
                    backgroundColor: '#333',
                    alignSelf: 'center',
                    marginTop: 8,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* ==== "Generate" Button ==== */}
        <Pressable
          onPress={generateData}
          style={{
            backgroundColor: '#2E8C89',
            marginTop: 28,
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
          <Text style={{ color: '#F5F5F5', fontSize: 18, fontFamily: 'Roboto-Bold' }}>
            Generate
          </Text>
        </Pressable>

        {/* ==== "Edit All Budgets" Modal ==== */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelAllBudgetEdit}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 20}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: '#1E1E1E',
                  borderRadius: 20,
                  width: '100%',
                  maxWidth: 400,
                  maxHeight: '80%',
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 22,
                    fontFamily: 'Roboto-Bold',
                    textAlign: 'center',
                    marginBottom: 10,
                  }}
                >
                  Edit Budget Goals for {currentMonth}
                </Text>

                {/* Wrap inputs in a ScrollView so content can scroll when keyboard appears */}
                <ScrollView
                  contentContainerStyle={{ paddingBottom: 20 }}
                  keyboardShouldPersistTaps="always"
                >
                  {/* ==== MONTHLY TOTAL BUDGET INPUT ==== */}
                  <View style={{ marginBottom: 15 }}>
                    <Text
                      style={{
                        color: '#888',
                        fontSize: 16,
                        fontFamily: 'Roboto-Light',
                        marginBottom: 5,
                      }}
                    >
                      Total Budget
                    </Text>
                    <View
                      style={{
                        backgroundColor: '#2A2A2A',
                        borderRadius: 12,
                        paddingHorizontal: 15,
                        paddingVertical: 8,
                      }}
                    >
                      <TextInput
                        value={editingTotalValue}
                        onChangeText={(text) => setEditingTotalValue(text)}
                        keyboardType="numeric"
                        placeholder="Enter total budget"
                        placeholderTextColor="#666"
                        style={{
                          color: 'white',
                          fontSize: 18,
                          fontFamily: 'Roboto-Bold',
                        }}
                      />
                    </View>
                  </View>

                  {/* ==== CATEGORY‐SPECIFIC INPUTS ==== */}
                  {categories.map((category, index) => (
                    <View key={category} style={{ marginBottom: 15 }}>
                      <Text
                        style={{
                          color: '#888',
                          fontSize: 16,
                          fontFamily: 'Roboto-Light',
                          marginBottom: 5,
                        }}
                      >
                        {category} Budget
                      </Text>
                      <View
                        style={{
                          backgroundColor: '#2A2A2A',
                          borderRadius: 12,
                          paddingHorizontal: 15,
                          paddingVertical: 8,
                        }}
                      >
                        <TextInput
                          value={editingBudgetValues[index]}
                          onChangeText={(text) => {
                            const updated = [...editingBudgetValues];
                            updated[index] = text;
                            setEditingBudgetValues(updated);
                          }}
                          keyboardType="numeric"
                          placeholder="Enter amount"
                          placeholderTextColor="#666"
                          style={{
                            color: 'white',
                            fontSize: 18,
                            fontFamily: 'Roboto-Bold',
                          }}
                        />
                      </View>
                    </View>
                  ))}

                  {/* ==== VALIDATION SUMMARY ==== */}
                  {validationInfo.totalNumeric > 0 && validationInfo.categorySum > 0 && (
                    <View
                      style={{
                        backgroundColor: validationInfo.isValid ? '#0A3A2A' : '#3A1A0A',
                        borderRadius: 12,
                        padding: 15,
                        marginBottom: 15,
                        borderWidth: 1,
                        borderColor: validationInfo.isValid ? '#2E8C89' : '#D4A574',
                      }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ color: '#888', fontSize: 14, fontFamily: 'Roboto-Light' }}>
                          Category Total:
                        </Text>
                        <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Roboto-Bold' }}>
                          ${validationInfo.categorySum.toLocaleString()}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ color: '#888', fontSize: 14, fontFamily: 'Roboto-Light' }}>
                          Total Budget:
                        </Text>
                        <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Roboto-Bold' }}>
                          ${validationInfo.totalNumeric.toLocaleString()}
                        </Text>
                      </View>

                      {validationInfo.difference > 0 && (
                        <>
                          <View style={{ height: 1, backgroundColor: '#444', marginVertical: 8 }} />
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: '#D4A574', fontSize: 14, fontFamily: 'Roboto-Light' }}>
                              Over by:
                            </Text>
                            <Text style={{ color: '#D4A574', fontSize: 16, fontFamily: 'Roboto-Bold' }}>
                              ${validationInfo.difference.toLocaleString()}
                            </Text>
                          </View>
                          <Text style={{
                            color: '#D4A574',
                            fontSize: 12,
                            fontFamily: 'Roboto-Light',
                            marginTop: 8,
                            textAlign: 'center'
                          }}>
                            Try adjusting your category budgets or increasing your total budget
                          </Text>
                        </>
                      )}

                      {validationInfo.isValid && (
                        <View style={{ alignItems: 'center', marginTop: 5 }}>
                          <Text style={{
                            color: '#2E8C89',
                            fontSize: 12,
                            fontFamily: 'Roboto-Light',
                            textAlign: 'center'
                          }}>
                            Everything looks good!
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}
                  >
                    <Pressable
                      onPress={cancelAllBudgetEdit}
                      style={{
                        flex: 1,
                        backgroundColor: '#444',
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: 'center',
                        marginRight: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: '#F5F5F5',
                          fontSize: 16,
                          fontFamily: 'Roboto-Bold',
                        }}
                      >
                        Cancel
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={saveAllBudgetChanges}
                      disabled={!validationInfo.isValid}
                      style={{
                        flex: 1,
                        backgroundColor: validationInfo.isValid ? '#2E8C89' : '#555',
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: 'center',
                        opacity: validationInfo.isValid ? 1 : 0.6,
                      }}
                    >
                      <Text
                        style={{
                          color: validationInfo.isValid ? '#F5F5F5' : '#999',
                          fontSize: 16,
                          fontFamily: 'Roboto-Bold',
                        }}
                      >
                        Save All
                      </Text>
                    </Pressable>
                  </View>
                </ScrollView>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;