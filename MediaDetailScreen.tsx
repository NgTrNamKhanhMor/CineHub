import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Star, Bookmark, BookmarkCheck } from 'lucide-react-native';
import LetterboxdScoreDistribution from './components/LetterboxdScoreDistribution';
import TVSeriesGraph from './components/TVSeriesGraph';

const { width } = Dimensions.get('window');

interface MediaData {
  title: string;
  summary: string;
  releaseDate: string;
  runtime: number;
  type: 'movie' | 'tv';
  posterUrl: string;
  scores: {
    imdb: number;
    letterboxd: number;
  };
  letterboxdWeights: number[];
  tvSeriesData?: Array<{
    seasonNumber: number;
    episodeNumber: number;
    title: string;
    rating: number;
  }>;
}

interface MediaDetailScreenProps {
  mediaData: MediaData;
}

const MediaDetailScreen: React.FC<MediaDetailScreenProps> = ({ mediaData }) => {
  const [activeReviewTab, setActiveReviewTab] = useState<'imdb' | 'letterboxd'>('imdb');
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const toggleWatchlist = () => {
    setIsWatchlisted(!isWatchlisted);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Unified Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: mediaData.posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
        
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {mediaData.title}
          </Text>
          
          <Text style={styles.metadata}>
            {mediaData.releaseDate} • {mediaData.runtime} min
          </Text>

          {/* Scores Section */}
          <View style={styles.scoresContainer}>
            {/* IMDb Score */}
            <View style={styles.scoreBox}>
              <View style={styles.scoreHeader}>
                <Star size={16} color="#F5C518" fill="#F5C518" />
                <Text style={styles.scoreLabel}>IMDb</Text>
              </View>
              <Text style={styles.scoreValue}>{mediaData.scores.imdb.toFixed(1)}</Text>
              <Text style={styles.scoreMax}>/10</Text>
            </View>

            {/* Letterboxd Score - Only for Movies */}
            {mediaData.type === 'movie' && (
              <View style={styles.scoreBox}>
                <View style={styles.scoreHeader}>
                  <View style={styles.letterboxdDot} />
                  <Text style={styles.scoreLabel}>Letterboxd</Text>
                </View>
                <Text style={styles.scoreValue}>{mediaData.scores.letterboxd.toFixed(1)}</Text>
                <Text style={styles.scoreMax}>/5.0</Text>
              </View>
            )}
          </View>

          {/* Watchlist Toggle */}
          <TouchableOpacity
            style={[styles.watchlistButton, isWatchlisted && styles.watchlistButtonActive]}
            onPress={toggleWatchlist}
            activeOpacity={0.7}
          >
            {isWatchlisted ? (
              <BookmarkCheck size={20} color="#00D400" />
            ) : (
              <Bookmark size={20} color="#9CA3AF" />
            )}
            <Text style={[styles.watchlistText, isWatchlisted && styles.watchlistTextActive]}>
              {isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Synopsis</Text>
        <Text style={styles.summaryText}>{mediaData.summary}</Text>
      </View>

      {/* Letterboxd Score Distribution - Only for Movies */}
      {mediaData.type === 'movie' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rating Distribution</Text>
          <Text style={styles.sectionSubtitle}>
            {mediaData.letterboxdWeights.reduce((a, b) => a + b, 0).toLocaleString()} fans
          </Text>
          <LetterboxdScoreDistribution weights={mediaData.letterboxdWeights} />
        </View>
      )}

      {/* TV Series Graph - Only for TV Shows */}
      {mediaData.type === 'tv' && mediaData.tvSeriesData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Episode Ratings</Text>
          <Text style={styles.sectionSubtitle}>Rating trend across all episodes</Text>
          <TVSeriesGraph episodes={mediaData.tvSeriesData} />
        </View>
      )}

      {/* Review Switcher */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeReviewTab === 'imdb' && styles.segmentButtonActive,
            ]}
            onPress={() => setActiveReviewTab('imdb')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                activeReviewTab === 'imdb' && styles.segmentTextActive,
              ]}
            >
              IMDb Reviews
            </Text>
          </TouchableOpacity>

          {mediaData.type === 'movie' && (
            <TouchableOpacity
              style={[
                styles.segmentButton,
                activeReviewTab === 'letterboxd' && styles.segmentButtonActive,
              ]}
              onPress={() => setActiveReviewTab('letterboxd')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeReviewTab === 'letterboxd' && styles.segmentTextActive,
                ]}
              >
                Letterboxd Reviews
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Review Content Placeholder */}
        <View style={styles.reviewsPlaceholder}>
          <Text style={styles.placeholderText}>
            {activeReviewTab === 'imdb' ? 'IMDb' : 'Letterboxd'} reviews will appear here
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 60,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#1F1F1F',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  metadata: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  scoresContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  scoreBox: {
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    padding: 12,
    minWidth: 90,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 6,
    fontWeight: '600',
  },
  letterboxdDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00D400',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreMax: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: -4,
  },
  watchlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F1F1F',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  watchlistButtonActive: {
    backgroundColor: '#00D40015',
    borderColor: '#00D400',
  },
  watchlistText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  watchlistTextActive: {
    color: '#00D400',
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1F1F1F',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#D1D5DB',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: '#374151',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  reviewsPlaceholder: {
    backgroundColor: '#1F1F1F',
    padding: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeholderText: {
    color: '#6B7280',
    fontSize: 14,
  },
});

export default MediaDetailScreen;
