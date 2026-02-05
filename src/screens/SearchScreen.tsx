// screens/SearchScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Search, Film, Tv } from 'lucide-react-native';
import { searchForMedia } from '../../service/media.service';

interface SearchResult {
  id: number;
  title: string;
  year: string;
  posterUrl: string;
}

interface SearchScreenProps {
  onSelectMedia: (id: number, type: 'movie' | 'tv') => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onSelectMedia }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'movie' | 'tv'>('movie');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchResults = await searchForMedia(query, searchType);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => onSelectMedia(item.id, searchType)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.posterUrl }} style={styles.poster} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.resultYear}>{item.year}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search CineSync</Text>
      </View>

      {/* Type Toggle */}
      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[styles.typeButton, searchType === 'movie' && styles.typeButtonActive]}
          onPress={() => setSearchType('movie')}
          activeOpacity={0.7}
        >
          <Film size={20} color={searchType === 'movie' ? '#00D400' : '#9CA3AF'} />
          <Text style={[styles.typeText, searchType === 'movie' && styles.typeTextActive]}>
            Movies
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, searchType === 'tv' && styles.typeButtonActive]}
          onPress={() => setSearchType('tv')}
          activeOpacity={0.7}
        >
          <Tv size={20} color={searchType === 'tv' ? '#00D400' : '#9CA3AF'} />
          <Text style={[styles.typeText, searchType === 'tv' && styles.typeTextActive]}>
            TV Shows
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search for ${searchType === 'movie' ? 'movies' : 'TV shows'}...`}
          placeholderTextColor="#6B7280"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {/* Search Button */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearch}
        disabled={loading || !query.trim()}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.searchButtonText}>Search</Text>
        )}
      </TouchableOpacity>

      {/* Results */}
      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Search size={64} color="#374151" />
          <Text style={styles.emptyText}>
            {loading ? 'Searching...' : 'Search for movies or TV shows to get started'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  typeToggle: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1F1F1F',
    borderWidth: 1,
    borderColor: '#374151',
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#00D40015',
    borderColor: '#00D400',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  typeTextActive: {
    color: '#00D400',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 12,
  },
  searchButton: {
    backgroundColor: '#00D400',
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsList: {
    padding: 16,
    paddingTop: 0,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  poster: {
    width: 80,
    height: 120,
    backgroundColor: '#374151',
  },
  resultInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  resultYear: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});