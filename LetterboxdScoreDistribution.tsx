import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 32;

interface LetterboxdScoreDistributionProps {
  weights: number[]; // Array of 10 values (0.5 to 5.0 stars)
}

const LetterboxdScoreDistribution: React.FC<LetterboxdScoreDistributionProps> = ({
  weights,
}) => {
  // Find the maximum weight for scaling
  const maxWeight = Math.max(...weights);

  // Star ratings from 0.5 to 5.0
  const ratings = ['½', '★', '★½', '★★', '★★½', '★★★', '★★★½', '★★★★', '★★★★½', '★★★★★'];

  return (
    <View style={styles.container}>
      {weights.map((weight, index) => {
        // Calculate bar width as percentage of max weight
        const barWidth = maxWeight > 0 ? (weight / maxWeight) * (CHART_WIDTH - 80) : 0;
        const percentage = maxWeight > 0 ? ((weight / weights.reduce((a, b) => a + b, 0)) * 100) : 0;

        return (
          <View key={index} style={styles.row}>
            {/* Rating Label */}
            <View style={styles.labelContainer}>
              <Text style={styles.ratingLabel}>{ratings[index]}</Text>
            </View>

            {/* Bar Container */}
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    width: barWidth,
                    backgroundColor: getBarColor(index),
                  },
                ]}
              >
                {/* Show count if bar is wide enough */}
                {barWidth > 40 && (
                  <Text style={styles.barText}>{weight.toLocaleString()}</Text>
                )}
              </View>
              
              {/* Show count outside bar if bar is too narrow */}
              {barWidth <= 40 && weight > 0 && (
                <Text style={styles.externalCount}>{weight.toLocaleString()}</Text>
              )}
            </View>

            {/* Percentage */}
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageText}>{percentage.toFixed(1)}%</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

// Color gradient from red (low ratings) to green (high ratings)
const getBarColor = (index: number): string => {
  const colors = [
    '#DC2626', // 0.5 - Red
    '#EA580C', // 1.0 - Orange-Red
    '#F59E0B', // 1.5 - Orange
    '#EAB308', // 2.0 - Yellow-Orange
    '#84CC16', // 2.5 - Yellow-Green
    '#22C55E', // 3.0 - Green
    '#10B981', // 3.5 - Emerald
    '#14B8A6', // 4.0 - Teal
    '#06B6D4', // 4.5 - Cyan
    '#00D400', // 5.0 - Letterboxd Green
  ];
  return colors[index];
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A0A0A',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
  },
  labelContainer: {
    width: 60,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#F5C518',
    fontWeight: '600',
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  barText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
  },
  externalCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    marginLeft: 8,
  },
  percentageContainer: {
    width: 50,
    alignItems: 'flex-end',
  },
  percentageText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
});

export default LetterboxdScoreDistribution;
