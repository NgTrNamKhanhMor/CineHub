import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

interface Props {
  data: number[]; // 10 values
  type: 'letterboxd' | 'imdb';
}

const VerticalScoreDistribution: React.FC<Props> = ({ data, type }) => {
  const maxValue = Math.max(...data);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.barsRow}>
        {data.map((value, index) => {
          const heightPercent = (value / maxValue) * 100;
          return (
            <View key={index} style={styles.barWrapper}>
              {/* The actual colored bar */}
              <View style={styles.barBackground}>
                <View 
                  style={[
                    styles.barFill, 
                    { 
                      height: `${heightPercent}%`,
                      backgroundColor: type === 'letterboxd' ? '#00D400' : '#F5C518' 
                    }
                  ]} 
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    height: 100, // Fixed height for the chart
    width: '100%',
    paddingHorizontal: 8,
  },
  barsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
  },
  barWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barBackground: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    borderRadius: 2,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 2,
  },
});

export default VerticalScoreDistribution;