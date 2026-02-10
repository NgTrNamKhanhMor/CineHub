import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { PersonCredit } from '../../types';
import { getPosterUrl } from '../../service/tmdb.service';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_WIDTH = (width - 48) / COLUMN_COUNT; 

interface MovieGridProps {
  data: PersonCredit[];
  onPressMedia: (id: number, type: 'movie' | 'tv') => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({ data, onPressMedia }) => {
  const renderItem = ({ item }: { item: PersonCredit }) => {
    const title = item.title || item.name;
    const role = item.character || item.job;
    const year = (item.release_date || item.first_air_date || '').split('-')[0];

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => onPressMedia(item.id, item.media_type)}
        activeOpacity={0.8}
      >
        <Image
          source={{ 
            uri: getPosterUrl(item.poster_path, 342, 513)
          }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.movieTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.roleText} numberOfLines={1}>
            {year ? `${year} • ` : ''}{role}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      numColumns={COLUMN_COUNT}
      scrollEnabled={false} // Since it's nested inside a ScrollView
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginVertical: 20,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  card: {
    width: ITEM_WIDTH,
  },
  poster: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.5,
    borderRadius: 6,
    backgroundColor: '#1F1F1F',
  },
  infoContainer: {
    marginTop: 6,
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  roleText: {
    color: '#9CA3AF',
    fontSize: 10,
    marginTop: 2,
  },
});

export default MovieGrid;