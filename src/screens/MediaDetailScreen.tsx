import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import {
  Star,
  Bookmark,
  BookmarkCheck,
  User,
  StarHalf,
} from "lucide-react-native";
import VerticalScoreDistribution from "../components/VerticalScoreDistribution";
import TVSeriesGrid from "../components/TVSeriesGrid";
import { formatRuntime } from "../ultis/helper";
import { MediaData } from "../types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getPosterUrl } from "../service/tmdb.service";
import { RootStackParamList } from "../types/props";
import { LinearGradient } from "expo-linear-gradient";
import MainLayout from "../wrapper/MainLayout";
interface MediaDetailScreenProps {
  mediaData: MediaData;
  myLetterboxdStats: { rating: number | null; inWatchlist: boolean };
  onBack: () => void;
}

const MediaDetailScreen: React.FC<MediaDetailScreenProps> = ({
  mediaData,
  myLetterboxdStats,
  onBack,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeReviewTab, setActiveReviewTab] = useState<"imdb" | "letterboxd">(
    "imdb",
  );
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeChartTab, setActiveChartTab] = useState<"letterboxd" | "imdb">(
    mediaData.type === "tv" ? "imdb" : "letterboxd",
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

  const handlePressActor = (id: number) => {
    navigation.navigate("PersonProfile", { personId: id });
  };

  useEffect(() => {
    if (mediaData.type === "tv") {
      setActiveChartTab("imdb");
    }
  }, [mediaData.type]);

  return (
    <MainLayout title={mediaData.title} headerProps={{ onBack, scrollY }}>
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: mediaData.backdropUrl }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)", "#000000"]}
          style={styles.gradientOverlay}
        />
      </View>
      {/* Unified Header (poster + meta) */}
      <View style={styles.header}>
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: mediaData.posterUrl }}
            style={styles.poster}
            resizeMode="cover"
          />
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {mediaData.title}
          </Text>

          <Text style={styles.directorText} numberOfLines={1}>
            Directed by{" "}
            <Text
              style={styles.directorName}
              onPress={() => handlePressActor(mediaData.director?.id || 0)}
            >
              {mediaData.director?.name}
            </Text>
          </Text>

          <View style={styles.metadataContainer}>
            <Text style={styles.metadata}>{mediaData.releaseDate}</Text>
            <Text style={styles.metadataSeparator}> • </Text>
            <TouchableOpacity onPress={toggleRuntime}>
              <Text style={[styles.metadata, styles.metadataInteractive]}>
                {formatRuntime(mediaData.runtime, showHours)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.scoresContainer}>
            <View style={styles.scoreBox}>
              <View style={styles.scoreHeader}>
                <Star size={14} color="#F5C518" fill="#F5C518" />
                <Text style={styles.scoreLabel}>IMDb</Text>
              </View>
              <View style={styles.scoreValueContainer}>
                {mediaData.scores.imdb === 0 ? (
                  <Text style={styles.scoreValue}>N/A</Text>
                ) : (
                  <>
                    <Text style={styles.scoreValue}>
                      {mediaData.scores.imdb.toFixed(1)}
                    </Text>
                    <Text style={styles.scoreMax}>/10</Text>
                  </>
                )}
              </View>
            </View>

            {mediaData.type === "movie" && (
              <View style={styles.scoreBox}>
                <View style={styles.scoreHeader}>
                  <View style={styles.letterboxdDot} />
                  <Text style={styles.scoreLabel}>LB</Text>
                </View>
                <View style={styles.scoreValueContainer}>
                  {mediaData.scores.letterboxd === 0 ? (
                    <Text style={styles.scoreValue}>N/A</Text>
                  ) : (
                    <>
                      <Text style={styles.scoreValue}>
                        {mediaData.scores.letterboxd.toFixed(1)}
                      </Text>
                      <Text style={styles.scoreMax}>/5</Text>
                    </>
                  )}
                </View>
              </View>
            )}
            <TouchableOpacity
              style={[
                styles.watchListBox,
                isWatchlisted && styles.watchlistActiveBox,
              ]}
              onPress={toggleWatchlist}
              activeOpacity={0.7}
            >
              <View style={styles.watchListValueContainer}>
                {isWatchlisted ? (
                  <BookmarkCheck size={25} color="#00D400" fill="#00D400" />
                ) : (
                  <Bookmark size={25} color="#9CA3AF" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* NEW: Personal Activity Section (Letterboxd Style) */}
      {(myLetterboxdStats.rating || isWatchlisted) && (
        <View style={styles.personalSection}>
          <View style={styles.personalContent}>
            <View style={styles.personalLeft}>
              <User size={18} color="#00D400" />
              <Text style={styles.personalText}>Your Activity</Text>
            </View>
            <View style={styles.personalRight}>
              {myLetterboxdStats.rating && (
                <View style={styles.personalRatingContainer}>
                  {[...Array(5)].map((_, i) => {
                    const starNumber = i + 1;
                    const rating = myLetterboxdStats.rating || 0;

                    console.log(rating >= starNumber - 0.5);

                    if (rating >= starNumber) {
                      return (
                        <Star
                          key={i}
                          size={16}
                          color="#00D400"
                          fill="#00D400"
                        />
                      );
                    } else if (rating >= starNumber - 0.5) {
                      return (
                        <StarHalf
                          key={i}
                          size={16}
                          color="#00D400"
                          fill="#00D400"
                        />
                      );
                    } else {
                      // Empty Star
                      return (
                        <Star
                          key={i}
                          size={16}
                          color="#374151"
                          fill="transparent"
                        />
                      );
                    }
                  })}
                  <Text style={styles.personalRatingValue}>
                    {myLetterboxdStats.rating?.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
      {/* Summary */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => {
            if (mediaData.summary.length > 150) {
              setIsSummaryExpanded(!isSummaryExpanded);
            }
          }}
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
      {/* Cast Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Top Cast</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.castScroll}
        >
          {mediaData.cast.map((actor) => (
            <View key={actor.id} style={styles.castCard}>
              <TouchableOpacity onPress={() => handlePressActor(actor.id)}>
                <Image
                  source={{
                    uri: getPosterUrl(actor.profile_path, 185),
                  }}
                  style={styles.castImage}
                />
                <Text style={styles.actorName} numberOfLines={2}>
                  {actor.name}
                </Text>
                <Text style={styles.characterName} numberOfLines={1}>
                  {actor.character}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      {/* Letterboxd Score Distribution - Only for Movies */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Rating Distribution</Text>

          {/* 3. Only show the switcher if it is a MOVIE */}
          {mediaData.type === "movie" && (
            <View style={styles.miniSegmentedControl}>
              <TouchableOpacity
                style={[
                  styles.miniSegmentButton,
                  activeChartTab === "letterboxd" &&
                    styles.miniSegmentButtonActive,
                ]}
                onPress={() => setActiveChartTab("letterboxd")}
              >
                <Text
                  style={[
                    styles.miniSegmentText,
                    activeChartTab === "letterboxd" &&
                      styles.miniSegmentTextActive,
                  ]}
                >
                  LB
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.miniSegmentButton,
                  activeChartTab === "imdb" && styles.miniSegmentButtonActive,
                ]}
                onPress={() => setActiveChartTab("imdb")}
              >
                <Text
                  style={[
                    styles.miniSegmentText,
                    activeChartTab === "imdb" && styles.miniSegmentTextActive,
                  ]}
                >
                  IMDb
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 4. Subtitle logic based on the active tab */}
        <Text style={styles.sectionSubtitle}>
          {activeChartTab === "letterboxd"
            ? `${mediaData.letterboxdWeights.reduce((a, b) => a + b, 0).toLocaleString()} fans`
            : `IMDb community rating distribution`}
        </Text>

        {/* 5. Pass the correct weights to the vertical chart */}
        <VerticalScoreDistribution
          type={activeChartTab}
          data={
            activeChartTab === "letterboxd"
              ? mediaData.letterboxdWeights
              : mediaData.imdbWeights || []
          }
        />
      </View>

      {/* TV Series Graph - Only for TV Shows */}
      {mediaData.type === "tv" && mediaData.tvSeriesData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Episode Ratings</Text>
          <Text style={styles.sectionSubtitle}>
            Rating trend across all episodes
          </Text>
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
              activeReviewTab === "imdb" && styles.segmentButtonActive,
            ]}
            onPress={() => setActiveReviewTab("imdb")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                activeReviewTab === "imdb" && styles.segmentTextActive,
              ]}
            >
              IMDb Reviews
            </Text>
          </TouchableOpacity>

          {mediaData.type === "movie" && (
            <TouchableOpacity
              style={[
                styles.segmentButton,
                activeReviewTab === "letterboxd" && styles.segmentButtonActive,
              ]}
              onPress={() => setActiveReviewTab("letterboxd")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeReviewTab === "letterboxd" && styles.segmentTextActive,
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
            {activeReviewTab === "imdb" ? "IMDb" : "Letterboxd"} reviews will
            appear here
          </Text>
        </View>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: -80, // Adjust this so the Title sits nicely on the banner
    alignItems: "flex-end",
    marginBottom: 16,
    zIndex: 2,
  },
  posterContainer: {
    width: 120,
    height: 180, // Explicit height to match ratio
    marginRight: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1F1F1F",
  },
  poster: {
    flex: 1,
    width: "100%",
  },
  watchlistIconBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 6,
    borderRadius: 20,
  },
  watchlistIconBadgeActive: {
    backgroundColor: "#00D400",
  },
  headerInfo: {
    flex: 1,
    height: 180, // MUST match poster height exactly
    justifyContent: "flex-end", // Pushes all content to the bottom
  },
  directorText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 6,
  },
  directorName: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  title: {
    fontSize: 22, // Slightly smaller to keep the "Top Section" compact
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 26,
    marginBottom: 2,
  },
  metadata: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
    paddingVertical: 4,
  },
  scoresContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 0, // Let the Spacer handle the gap
  },
  watchListBox: {
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    height: 60,
    width: 65,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreBox: {
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    padding: 8,
    paddingTop: 20,
    paddingBottom: 15,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    height: 60,
    width: 65,
    justifyContent: "center",
  },
  watchlistActiveBox: {
    borderColor: "#00D400",
    backgroundColor: "rgba(0, 212, 0, 0.05)",
  },
  scoreHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  scoreLabel: {
    fontSize: 10, // Smaller label
    color: "#9CA3AF",
    marginLeft: 4,
    fontWeight: "600",
  },
  letterboxdDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00D400",
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scoreMax: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 1,
    paddingBottom: 2, // Fine-tune alignment with large number
  },
  watchlistButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F1F1F",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
  },
  watchlistButtonActive: {
    backgroundColor: "#00D40015",
    borderColor: "#00D400",
  },
  watchlistText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  watchlistTextActive: {
    color: "#00D400",
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#1F1F1F",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#D1D5DB",
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#1F1F1F",
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: "#374151",
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },
  reviewsPlaceholder: {
    backgroundColor: "#1F1F1F",
    padding: 32,
    borderRadius: 8,
    alignItems: "center",
  },
  placeholderText: {
    color: "#6B7280",
    fontSize: 14,
  },
  backButton: {
    position: "absolute",
    top: 50, // Adjust based on your status bar height
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 4,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  miniSegmentedControl: {
    flexDirection: "row",
    backgroundColor: "#1F1F1F",
    borderRadius: 6,
    padding: 2,
  },
  miniSegmentButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  miniSegmentButtonActive: {
    backgroundColor: "#374151",
  },
  miniSegmentText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#6B7280",
  },
  miniSegmentTextActive: {
    color: "#FFFFFF",
  },
  scoreValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  watchListValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metadataContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5, // Adjust this to control gap between text and score boxes
  },
  metadataSeparator: {
    fontSize: 14,
    color: "#4B5563",
    paddingBottom: 10,
  },
  metadataInteractive: {
    color: "#D1D5DB",
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
  },
  bannerContainer: {
    width: "100%",
    height: 300, // Slightly taller banner for better cinematic feel
    position: "relative",
    backgroundColor: "#000000",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  seeMoreText: {
    color: "#00D400",
    fontWeight: "600",
    marginTop: 4,
    fontSize: 14,
  },
  sectionContainer: {
    marginVertical: 24,
    paddingHorizontal: 16,
  },

  castScroll: {
    paddingRight: 16,
  },
  castCard: {
    width: 100,
    marginRight: 16,
    alignItems: "center",
  },
  castImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Makes the profile pictures circular
    marginBottom: 8,
    backgroundColor: "#1F1F1F",
  },
  actorName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  characterName: {
    width: 100,
    color: "#9CA3AF",
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  myScoreBox: { borderColor: "#00D400", backgroundColor: "#00D40010" },
  personalSection: {
    backgroundColor: "#111",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1F1F1F",
  },
  personalContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  personalLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  personalText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  personalRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  personalRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(0, 212, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  personalRatingValue: {
    color: "#00D400",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 6,
  },
});

export default MediaDetailScreen;
