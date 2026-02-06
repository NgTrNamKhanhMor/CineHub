import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Star, Bookmark, BookmarkCheck, ChevronLeft } from 'lucide-react-native';
import LetterboxdScoreDistribution from '../components/LetterboxdScoreDistribution';
import TVSeriesGraph from '../components/TVSeriesGraph';
import VerticalScoreDistribution from '../components/VerticalScoreDistribution';
import TVSeriesGrid from '../components/TVSeriesGrid';
import { formatRuntime } from '../../ultis/helper';
import { MediaData } from '../../types';

const { width } = Dimensions.get('window');



interface MediaDetailScreenProps {
  mediaData: MediaData;
  onBack: () => void;
}

const MediaDetailScreen: React.FC<MediaDetailScreenProps> = ({ mediaData, onBack }) => {
  const [activeReviewTab, setActiveReviewTab] = useState<'imdb' | 'letterboxd'>('imdb');
  const [activeChartTab, setActiveChartTab] = useState<'letterboxd' | 'imdb'>(
  mediaData.type === 'tv' ? 'imdb' : 'letterboxd'
);
const [showHours, setShowHours] = useState(true);
const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const toggleWatchlist = () => {
    setIsWatchlisted(!isWatchlisted);
  };
const toggleRuntime = () => {
  setShowHours(!showHours);
};
  useEffect(() => {
  if (mediaData.type === 'tv') {
    setActiveChartTab('imdb');
  }
}, [mediaData.type]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.bannerContainer}>
      <Image
        source={{ uri: mediaData.backdropUrl }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
      
      {/* Dark overlay for better button/text visibility */}
      <View style={styles.bannerOverlay} />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={onBack}
      >
        <ChevronLeft size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={onBack}
        activeOpacity={0.7}
      >
        <ChevronLeft size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
          {mediaData.director && (
          <Text style={styles.directorText}>
            Directed by <Text style={styles.directorName}>{mediaData.director}</Text>
          </Text>
        )}
          
        <View style={styles.metadataContainer}>
          <Text style={styles.metadata}>
            {mediaData.releaseDate}
          </Text>
          
          <Text style={styles.metadataSeparator}> • </Text>

          {/* The Runtime is interactive */}
          <TouchableOpacity onPress={toggleRuntime} activeOpacity={0.6}>
            <Text style={[styles.metadata, styles.metadataInteractive]}>
              {formatRuntime(mediaData.runtime, showHours)}
            </Text>
          </TouchableOpacity>
        </View>

          <View style={styles.scoresContainer}>
          {/* IMDb Score */}
          <View style={styles.scoreBox}>
            <View style={styles.scoreHeader}>
              <Star size={16} color="#F5C518" fill="#F5C518" />
              <Text style={styles.scoreLabel}>IMDb</Text>
            </View>
            {/* Wrap value and max in a row container */}
            <View style={styles.scoreValueContainer}>
              <Text style={styles.scoreValue}>{mediaData.scores.imdb.toFixed(1)}</Text>
              <Text style={styles.scoreMax}>/10</Text>
            </View>
          </View>

          {/* Letterboxd Score - Only for Movies */}
          {mediaData.type === 'movie' && (
            <View style={styles.scoreBox}>
              <View style={styles.scoreHeader}>
                <View style={styles.letterboxdDot} />
                <Text style={styles.scoreLabel}>Letterboxd</Text>
              </View>
              {/* Same row container here */}
              <View style={styles.scoreValueContainer}>
                <Text style={styles.scoreValue}>{mediaData.scores.letterboxd.toFixed(1)}</Text>
                <Text style={styles.scoreMax}>/5.0</Text>
              </View>
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
  
  <TouchableOpacity 
    onPress={() => setIsSummaryExpanded(!isSummaryExpanded)}
    activeOpacity={0.7}
  >
    <Text 
      style={styles.summaryText}
      numberOfLines={isSummaryExpanded ? undefined : 4} 
    >
      {mediaData.summary}
    </Text>
    
    {!isSummaryExpanded && mediaData.summary.length > 150 && (
      <Text style={styles.seeMoreText}>See More</Text>
    )}
    
    {isSummaryExpanded && (
      <Text style={styles.seeMoreText}>See Less</Text>
    )}
  </TouchableOpacity>
</View>

      {/* Letterboxd Score Distribution - Only for Movies */}
      <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Rating Distribution</Text>
        
        {/* 3. Only show the switcher if it is a MOVIE */}
        {mediaData.type === 'movie' && (
          <View style={styles.miniSegmentedControl}>
            <TouchableOpacity
              style={[styles.miniSegmentButton, activeChartTab === 'letterboxd' && styles.miniSegmentButtonActive]}
              onPress={() => setActiveChartTab('letterboxd')}
            >
              <Text style={[styles.miniSegmentText, activeChartTab === 'letterboxd' && styles.miniSegmentTextActive]}>LB</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.miniSegmentButton, activeChartTab === 'imdb' && styles.miniSegmentButtonActive]}
              onPress={() => setActiveChartTab('imdb')}
            >
              <Text style={[styles.miniSegmentText, activeChartTab === 'imdb' && styles.miniSegmentTextActive]}>IMDb</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 4. Subtitle logic based on the active tab */}
      <Text style={styles.sectionSubtitle}>
        {activeChartTab === 'letterboxd' 
          ? `${mediaData.letterboxdWeights.reduce((a, b) => a + b, 0).toLocaleString()} fans`
          : `IMDb community rating distribution`}
      </Text>

      {/* 5. Pass the correct weights to the vertical chart */}
      <VerticalScoreDistribution 
        type={activeChartTab} 
        data={activeChartTab === 'letterboxd' ? mediaData.letterboxdWeights : (mediaData.imdbWeights || [])} 
      />
    </View>

      {/* TV Series Graph - Only for TV Shows */}
      {mediaData.type === 'tv' && mediaData.tvSeriesData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Episode Ratings</Text>
          <Text style={styles.sectionSubtitle}>Rating trend across all episodes</Text>
         <TVSeriesGrid episodes={mediaData.tvSeriesData} />
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
    paddingTop: 50,
    marginTop: -60,
  },
  poster: {
    width: 130,
    height: 190,
    borderRadius: 8,
    backgroundColor: '#1F1F1F',
    borderColor: '#000',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-start',
  },
  directorText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  directorName: {
    color: '#FFFFFF',
    fontWeight: '600',
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
    paddingVertical: 4,
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
    marginLeft: 2,
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
  backButton: {
    position: 'absolute',
    top: 50, // Adjust based on your status bar height
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  miniSegmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 6,
    padding: 2,
  },
  miniSegmentButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  miniSegmentButtonActive: {
    backgroundColor: '#374151',
  },
  miniSegmentText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  miniSegmentTextActive: {
    color: '#FFFFFF',
  },
  scoreValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline', // This aligns the bottom of the text strings
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  metadataSeparator: {
    fontSize: 14,
    color: '#4B5563', // Slightly dimmer color for the bullet
    paddingBottom: 10
  },
  metadataInteractive: {
    // Optional: make it slightly brighter or underlined to show it's a toggle
    color: '#D1D5DB', 
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  bannerContainer: {
    width: '100%',
    height: 250,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)', // Darken the banner slightly
  },
  seeMoreText: {
    color: '#00D400', // Matches your Letterboxd green
    fontWeight: '600',
    marginTop: 4,
    fontSize: 14,
  },
});

export default MediaDetailScreen;
