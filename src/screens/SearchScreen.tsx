import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Search, Film, Tv, User } from "lucide-react-native";
import { searchForMedia } from "../service/media.service";
import { useSearchHistory } from "../hooks/useSearchHistory";

interface SearchResult {
  id: number;
  title: string;
  year?: string;
  posterUrl: string;
}

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"movie" | "tv" | "person">("movie");
  const { history, addToHistory, clearHistory } = useSearchHistory(searchType as any);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false) 
      return;
    }

    setLoading(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const searchResults = await searchForMedia(query, searchType);
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchType]);

const handleSelectMedia = (item: SearchResult) => {
    addToHistory(item);
    if (searchType === "person") {
      navigation.navigate("PersonProfile", { personId: item.id });
      return;
    }

    navigation.navigate("MediaDetail", {
      mediaId: item.id,
      mediaType: searchType,
    });
  };

const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => handleSelectMedia(item)} 
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.posterUrl }} style={styles.poster} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.resultYear}>{item.year}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search CineSync</Text>
      </View>

      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            searchType === "movie" && styles.typeButtonActive,
          ]}
          onPress={() => setSearchType("movie")}
        >
          <Film
            size={20}
            color={searchType === "movie" ? "#00D400" : "#9CA3AF"}
          />
          <Text
            style={[
              styles.typeText,
              searchType === "movie" && styles.typeTextActive,
            ]}
          >
            Movies
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            searchType === "tv" && styles.typeButtonActive,
          ]}
          onPress={() => setSearchType("tv")}
        >
          <Tv size={20} color={searchType === "tv" ? "#00D400" : "#9CA3AF"} />
          <Text
            style={[
              styles.typeText,
              searchType === "tv" && styles.typeTextActive,
            ]}
          >
            TV Shows
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            searchType === "person" && styles.typeButtonActive,
          ]}
          onPress={() => setSearchType("person")}
        >
          <User size={20} color={searchType === "person" ? "#00D400" : "#9CA3AF"} />
          <Text
            style={[
              styles.typeText,
              searchType === "person" && styles.typeTextActive,
            ]}
          >
            People
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search for ${searchType === "movie" ? "movies" : searchType === "tv" ? "TV shows" : "people"}...`}
          placeholderTextColor="#6B7280"
          value={query}
          onChangeText={setQuery} // Typing here triggers the useEffect debounce
          autoFocus
        />
        {loading && (
          <ActivityIndicator
            size="small"
            color="#00D400"
            style={{ marginLeft: 8 }}
          />
        )}
      </View>

      {/* Results Section */}
      {query.length === 0 ? (
        <View style={{ flex: 1 }}>
          {history.length > 0 && (
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>
                Recent {searchType === "movie" ? "Movies" : searchType === "tv" ? "Shows" : "People"}
              </Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            data={history}
            renderItem={renderSearchResult} // We reuse the same card style
            keyExtractor={(item) => `history-${item.id}`}
            contentContainerStyle={styles.resultsList}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Search size={64} color="#374151" />
                <Text style={styles.emptyText}>
                  {searchType === "person" ? "Find profiles" : `Find your next favorite ${searchType === 'movie' ? 'film' : 'series'}`}
                </Text>
              </View>
            )}
          />
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.resultsList}
          ListEmptyComponent={() => !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No results found for "{query}"</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  typeToggle: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#1F1F1F",
    borderWidth: 1,
    borderColor: "#374151",
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: "#00D40015",
    borderColor: "#00D400",
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  typeTextActive: {
    color: "#00D400",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
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
    color: "#FFFFFF",
    fontSize: 16,
    paddingVertical: 12,
  },
  searchButton: {
    backgroundColor: "#00D400",
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resultsList: {
    padding: 16,
    paddingTop: 0,
  },
  resultCard: {
    flexDirection: "row",
    backgroundColor: "#1F1F1F",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  poster: {
    width: 80,
    height: 120,
    backgroundColor: "#374151",
  },
  resultInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  resultYear: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  historyTitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  clearText: {
    color: '#EF4444',
    fontSize: 14,
  },
});
