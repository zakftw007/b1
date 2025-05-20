import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, ActivityIndicator } from 'react-native';
import DonutChart from '@/components/DonutChart';
import SmallDonutChart from '@/components/SmallDonutChart'
import { useFont } from '@shopify/react-native-skia';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { calculatePercentage } from '@/utils/calculatePercentage';
import RenderItem from '@/components/RenderItem';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define transaction category types
export type TransactionCategory = 'Food' | 'Transportation' | 'Shopping' | 'Utilities' | 'Entertainment';

// Define transaction interface
export interface Transaction {
  id: string;
  amount: number;
  date: string;
  category: TransactionCategory;
  description: string;
}

// Sample transaction data (replace with actual data from API or database)
const sampleTransactions: Transaction[] = [
  { id: '1', amount: 35.50, date: '2025-05-15', category: 'Food', description: 'Grocery shopping' },
  { id: '2', amount: 25.30, date: '2025-05-15', category: 'Transportation', description: 'Uber ride' },
  { id: '3', amount: 120.00, date: '2025-05-14', category: 'Shopping', description: 'New shoes' },
  { id: '4', amount: 85.20, date: '2025-05-13', category: 'Utilities', description: 'Electricity bill' },
  { id: '5', amount: 45.00, date: '2025-05-12', category: 'Entertainment', description: 'Movie tickets' },
  { id: '6', amount: 18.25, date: '2025-05-12', category: 'Food', description: 'Lunch' },
  { id: '7', amount: 32.40, date: '2025-05-11', category: 'Transportation', description: 'Gas' },
  { id: '8', amount: 65.30, date: '2025-05-10', category: 'Shopping', description: 'T-shirt' },
  { id: '9', amount: 75.00, date: '2025-05-09', category: 'Utilities', description: 'Internet bill' },
  { id: '10', amount: 22.50, date: '2025-05-08', category: 'Entertainment', description: 'Streaming subscription' },
];

const RADIUS = 160;
const STROKE_WIDTH = 30;
const OUTER_STROKE_WIDTH = 46;
const GAP = 0.04;

// Category configuration
const CATEGORIES: TransactionCategory[] = ['Food', 'Transportation', 'Shopping', 'Utilities', 'Entertainment'];
const COLORS = ['#fe769c', '#46a0f8', '#c3f439', '#88dabc', '#e43433'];

// Map categories to their index
const CATEGORY_INDEX: Record<TransactionCategory, number> = {
  'Food': 0,
  'Transportation': 1,
  'Shopping': 2,
  'Utilities': 3,
  'Entertainment': 4
};

export const Home = () => {
  // State for processed transaction data
  const [data, setData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  
  // Shared values for animations
  const totalValue = useSharedValue(0);
  const decimals = useSharedValue<number[]>([]);

  // Process transactions into category totals
  const processTransactionData = () => {
    // Initialize category totals
    const categoryTotals = CATEGORIES.map(() => 0);
    
    // Sum up transaction amounts by category
    transactions.forEach(transaction => {
      const categoryIndex = CATEGORY_INDEX[transaction.category];
      categoryTotals[categoryIndex] += transaction.amount;
    });
    
    // Calculate total spent
    const total = categoryTotals.reduce((acc, curr) => acc + curr, 0);
    
    // Calculate percentages
    const percentages = calculatePercentage(categoryTotals, total);
    const decimalValues = percentages.map(
      (number) => Number(number.toFixed(0)) / 100,
    );
    
    // Animate the total value
    totalValue.value = withTiming(total, { duration: 1000 });
    
    // Update decimals for animation
    decimals.value = [...decimalValues];
    
    // Create data objects for each category
    const categoryData = categoryTotals.map((value, index) => ({
      value,
      percentage: percentages[index],
      color: COLORS[index],
      category: CATEGORIES[index]
    }));
    
    setData(categoryData);
  };

  // Process data on initial load or when transactions change
  useEffect(() => {
    processTransactionData();
  }, [transactions]);

  // Function to fetch actual transaction data from your backend/database
  const fetchTransactions = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch('your-api-endpoint/transactions');
      // const data = await response.json();
      // setTransactions(data);
      
      // For now, we'll just use sample data
      setTransactions([...sampleTransactions]);
      processTransactionData();
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
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
            n={CATEGORIES.length}
            decimals={decimals}
            colors={COLORS}
          />
        </View>

        <Text style={{ color: "white", paddingBottom: 30, paddingTop: 20, fontFamily: 'Roboto-Bold', fontSize: 20 }}>Expense Breakdown</Text>

        {/* Render categories with their small donut charts */}
        {CATEGORIES.map((category, index) => (
          <React.Fragment key={category}>
            <Text style={{ color: "white", fontFamily: 'Roboto-Bold', fontSize: 20, paddingTop: index > 0 ? 20 : 0 }}>{category}</Text>
            <View style={{ width: '90%', height: 120, marginTop: 20 }}>
              <SmallDonutChart
                radius={60}
                gap={0.04}
                strokeWidth={11}
                outerStrokeWidth={25}
                font={smallFont}
                smallFont={smallFont}
                totalValue={totalValue}
                n={CATEGORIES.length}
                decimals={decimals}
                colors={COLORS}
                highlightIndex={index}
                label={""}
              />
            </View>
          </React.Fragment>
        ))}

        {/* Optionally display individual transactions */}
        {/* <Text style={{ color: "white", paddingBottom: 15, paddingTop: 30, fontFamily: 'Roboto-Bold', fontSize: 20 }}>Recent Transactions</Text>
        {transactions.slice(0, 5).map((transaction, index) => (
          <RenderItem 
            item={{
              value: transaction.amount,
              percentage: 0, // Not needed for transaction items
              color: COLORS[CATEGORY_INDEX[transaction.category]],
              description: transaction.description,
              date: transaction.date,
              category: transaction.category
            }} 
            key={transaction.id} 
            index={index} 
          />
        ))} */}

        <Pressable
          onPress={fetchTransactions}
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
          <Text style={{ color: '#F5F5F5', fontSize: 18, fontFamily: 'Roboto-Bold' }}>Refresh Data</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;