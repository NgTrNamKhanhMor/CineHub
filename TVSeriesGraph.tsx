import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle, Polyline, Text as SvgText, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 64;
const CHART_HEIGHT = 240;
const PADDING = 40;

interface Episode {
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  rating: number;
}

interface TVSeriesGraphProps {
  episodes: Episode[];
}

const TVSeriesGraph: React.FC<TVSeriesGraphProps> = ({ episodes }) => {
  const chartData = useMemo(() => {
    if (!episodes.length) return { points: [], minRating: 0, maxRating: 10 };

    // Calculate min and max ratings with padding
    const ratings = episodes.map(ep => ep.rating);
    const minRating = Math.max(0, Math.floor(Math.min(...ratings)) - 1);
    const maxRating = Math.min(10, Math.ceil(Math.max(...ratings)) + 1);

    // Calculate points for the line chart
    const points = episodes.map((episode, index) => {
      const x = PADDING + (index / (episodes.length - 1 || 1)) * (CHART_WIDTH - PADDING * 2);
      const y = CHART_HEIGHT - PADDING - 
                ((episode.rating - minRating) / (maxRating - minRating)) * (CHART_HEIGHT - PADDING * 2);
      return { x, y, episode, index };
    });

    return { points, minRating, maxRating };
  }, [episodes]);

  if (!episodes.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No episode data available</Text>
      </View>
    );
  }

  // Generate Y-axis labels
  const yAxisLabels = useMemo(() => {
    const { minRating, maxRating } = chartData;
    const step = (maxRating - minRating) / 5;
    return Array.from({ length: 6 }, (_, i) => ({
      value: (minRating + step * i).toFixed(1),
      y: CHART_HEIGHT - PADDING - (i / 5) * (CHART_HEIGHT - PADDING * 2),
    }));
  }, [chartData]);

  // Group episodes by season for X-axis labels
  const seasonMarkers = useMemo(() => {
    const seasons = new Map<number, number>();
    chartData.points.forEach(point => {
      if (!seasons.has(point.episode.seasonNumber)) {
        seasons.set(point.episode.seasonNumber, point.index);
      }
    });
    return Array.from(seasons.entries()).map(([season, firstIndex]) => ({
      season,
      x: chartData.points[firstIndex].x,
    }));
  }, [chartData.points]);

  // Create polyline points string
  const polylinePoints = chartData.points
    .map(p => `${p.x},${p.y}`)
    .join(' ');

  return (
    <View style={styles.container}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* Background */}
        <Rect x={0} y={0} width={CHART_WIDTH} height={CHART_HEIGHT} fill="#0A0A0A" />

        {/* Y-axis grid lines */}
        {yAxisLabels.map((label, index) => (
          <React.Fragment key={`y-${index}`}>
            <Line
              x1={PADDING}
              y1={label.y}
              x2={CHART_WIDTH - PADDING}
              y2={label.y}
              stroke="#1F1F1F"
              strokeWidth="1"
            />
            <SvgText
              x={PADDING - 8}
              y={label.y + 4}
              fontSize="10"
              fill="#6B7280"
              textAnchor="end"
            >
              {label.value}
            </SvgText>
          </React.Fragment>
        ))}

        {/* Season markers */}
        {seasonMarkers.map((marker, index) => (
          <SvgText
            key={`season-${index}`}
            x={marker.x}
            y={CHART_HEIGHT - 10}
            fontSize="10"
            fill="#6B7280"
            textAnchor="middle"
          >
            S{marker.season}
          </SvgText>
        ))}

        {/* Line connecting all points */}
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke="#00D400"
          strokeWidth="2.5"
        />

        {/* Data points */}
        {chartData.points.map((point, index) => {
          const rating = point.episode.rating;
          const color = getRatingColor(rating);
          
          return (
            <React.Fragment key={`point-${index}`}>
              {/* Outer circle (glow effect) */}
              <Circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill={color}
                opacity="0.3"
              />
              {/* Inner circle */}
              <Circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill={color}
                stroke="#0A0A0A"
                strokeWidth="1.5"
              />
            </React.Fragment>
          );
        })}
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#00D400' }]} />
          <Text style={styles.legendText}>Episode Rating Trend</Text>
        </View>
        <Text style={styles.legendSubtext}>
          {episodes.length} episodes • {new Set(episodes.map(e => e.seasonNumber)).size} seasons
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatBox
          label="Highest"
          value={Math.max(...episodes.map(e => e.rating)).toFixed(1)}
          color="#00D400"
        />
        <StatBox
          label="Average"
          value={(episodes.reduce((sum, e) => sum + e.rating, 0) / episodes.length).toFixed(1)}
          color="#F59E0B"
        />
        <StatBox
          label="Lowest"
          value={Math.min(...episodes.map(e => e.rating)).toFixed(1)}
          color="#DC2626"
        />
      </View>
    </View>
  );
};

// Helper component for stats
const StatBox: React.FC<{ label: string; value: string; color: string }> = ({
  label,
  value,
  color,
}) => (
  <View style={styles.statBox}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
  </View>
);

// Color based on rating
const getRatingColor = (rating: number): string => {
  if (rating >= 8.5) return '#00D400'; // Excellent - Green
  if (rating >= 7.0) return '#22C55E'; // Good - Light Green
  if (rating >= 6.0) return '#F59E0B'; // Average - Orange
  if (rating >= 4.0) return '#F97316'; // Below Average - Orange-Red
  return '#DC2626'; // Poor - Red
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    padding: 16,
  },
  emptyContainer: {
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
  legend: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1F1F1F',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  legendSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TVSeriesGraph;
