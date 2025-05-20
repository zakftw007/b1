import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React from 'react';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { TransactionCategory } from 'C:\\Users\\mouto\\OneDrive\\Desktop\\app1\\budget\\app\\(tabs)\\home2future.tsx'

interface Data {
  value: number;
  percentage?: number;
  color: string;
  description?: string;
  date?: string;
  category?: TransactionCategory;
}

type Props = {
  item: Data;
  index: number;
};

const RenderItem = ({ item, index }: Props) => {
  const { width } = useWindowDimensions();
  
  return (
    <Animated.View
      style={[styles.container, { width: width * 0.9 }]}
      entering={FadeInDown.delay(index * 200)}
      exiting={FadeOutDown}>
      <View style={styles.contentContainer}>
        <View style={styles.leftSection}>
          <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}
        </View>
        
        <View style={styles.rightSection}>
          {item.date && (
            <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
          )}
          <Text style={styles.amount}>${item.value.toFixed(2)}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default RenderItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    marginBottom: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
    flex: 1,
  },
  colorIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
  },
  description: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Roboto-Regular',
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: '#9E9E9E',
    fontFamily: 'Roboto-Light',
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
});