import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface Episode {
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  rating: number;
}

interface TVSeriesGridProps {
  episodes: Episode[];
}

const TVSeriesGrid: React.FC<TVSeriesGridProps> = ({ episodes }) => {
  // Group episodes into a 2D structure: [EpisodeRow][SeasonColumn]
  const gridData = useMemo(() => {
    const seasons = [...new Set(episodes.map(e => e.seasonNumber))].sort((a, b) => a - b);
    const maxEpisodes = Math.max(...episodes.map(e => e.episodeNumber));
    
    const rows = [];
    for (let eIdx = 1; eIdx <= maxEpisodes; eIdx++) {
      const row = seasons.map(sIdx => {
        return episodes.find(e => e.seasonNumber === sIdx && e.episodeNumber === eIdx);
      });
      rows.push({ episodeLabel: `E${eIdx}`, data: row });
    }

    return { seasons, rows };
  }, [episodes]);

const getRatingStyle = (rating: number | undefined) => {
  if (!rating) return { backgroundColor: 'transparent', color: 'transparent' };
  
  // Awesome (Dark Teal/Blue) - 9.0 to 10
  if (rating >= 9.0) return { backgroundColor: '#00a2ff', color: '#ffffff' }; 
  
  // Great (Green) - 8.0 to 8.9
  if (rating >= 8.0) return { backgroundColor: '#15803D', color: '#BBF7D0' }; 
  
  // Good (Yellow) - 7.5 to 7.9
  if (rating >= 7.5) return { backgroundColor: '#EAB308', color: '#422006' }; 
  
  // Regular (Orange) - 6.5 to 7.4
  if (rating >= 6.5) return { backgroundColor: '#D97706', color: '#FEF3C7' }; 
  
  // Bad (Red) - 5.0 to 6.4
  if (rating >= 5.0) return { backgroundColor: '#B91C1C', color: '#FEE2E2' }; 
  
  // Garbage (Purple) - Below 5.0
  return { backgroundColor: '#581C87', color: '#F5H3FF' }; 
};

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header Row: Seasons */}
          <View style={styles.row}>
            <View style={styles.labelCell} /> 
            {gridData.seasons.map(s => (
              <View key={`s-${s}`} style={styles.headerCell}>
                <Text style={styles.headerText}>S{s}</Text>
              </View>
            ))}
          </View>

          {/* Data Rows: Episodes */}
          {gridData.rows.map((row, rIdx) => (
            <View key={`r-${rIdx}`} style={styles.row}>
              <View style={styles.labelCell}>
                <Text style={styles.labelText}>{row.episodeLabel}</Text>
              </View>
              {row.data.map((ep, cIdx) => {
                const style = getRatingStyle(ep?.rating);
                return (
                  <View 
                    key={`c-${cIdx}`} 
                    style={[styles.cell, { backgroundColor: style.backgroundColor }]}
                  >
                    {ep && (
                      <Text style={[styles.ratingText, { color: style.color }]}>
                        {ep.rating.toFixed(1)}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Legend - Matches your reference image */}
     <View style={styles.legendContainer}>
        <LegendItem color="#00a2ff" label="Awesome" />
        <LegendItem color="#15803D" label="Great" />
        <LegendItem color="#EAB308" label="Good" />
        <LegendItem color="#D97706" label="Regular" />
        <LegendItem color="#B91C1C" label="Bad" />
        <LegendItem color="#581C87" label="Garbage" />
    </View>
    </View>
  );
};

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  labelCell: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerCell: {
    width: 45,
    alignItems: 'center',
    marginBottom: 8,
  },
  cell: {
    width: 45,
    height: 35,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  headerText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  labelText: {
    color: '#6B7280',
    fontSize: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    gap: 12,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLabel: {
    color: '#9CA3AF',
    fontSize: 11,
  },
});

export default TVSeriesGrid;