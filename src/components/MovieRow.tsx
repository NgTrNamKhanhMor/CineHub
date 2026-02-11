// src/components/MovieRow.tsx
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getPosterUrl } from '../service/tmdb.service';
import { useNavigation } from '@react-navigation/native';
import { TMDbMovie } from '../types';

interface RowProps {
  title: string;
  data: TMDbMovie[];
}

const MovieRow = ({ title, data }: RowProps) => {
  const navigation = useNavigation<any>();

  const renderItem = ({ item }: { item: TMDbMovie }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('MediaDetail', { mediaId: item.id, mediaType: 'movie' })}
    >
      <Image 
        source={{ uri: getPosterUrl(item.poster_path, 500) }} 
        style={styles.poster} 
      />
      <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.rowTitle}>{title}</Text>
        <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 25 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    marginBottom: 12 
  },
  rowTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  seeAll: { color: '#00D400', fontSize: 14, fontWeight: '600' },
  listContent: { paddingLeft: 16, gap: 12 },
  card: { width: 130 },
  poster: { width: 130, height: 195, borderRadius: 10, backgroundColor: '#1A1A1A' },
  movieTitle: { color: '#E5E7EB', fontSize: 13, marginTop: 8, fontWeight: '500' },
});

export default MovieRow;