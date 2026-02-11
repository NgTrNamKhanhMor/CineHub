import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeroSection from "../components/HeroSection";
import MovieRow from "../components/MovieRow";
import Skeleton from "../components/Skeleton";
import { useHomeData } from "../context/HomeDataContext";

const HomeScreen = () => {
  const { movies, heroMovie, isLoading, loadData } = useHomeData();
  const navigation = useNavigation<any>();

  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* Hero Skeleton - Matches HeroSection height */}
        <Skeleton width="100%" height={480} borderRadius={0} />

        {/* Row Title Skeleton */}
        <View style={{ padding: 16, marginTop: 20 }}>
          <Skeleton width={150} height={20} />

          {/* Movie Cards Skeleton Row */}
          <View style={{ flexDirection: "row", marginTop: 15, gap: 12 }}>
            <Skeleton width={130} height={195} />
            <Skeleton width={130} height={195} />
            <Skeleton width={130} height={195} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={loadData}
          tintColor="#00D400"
        />
      }
    >
      {heroMovie && (
        <HeroSection
          movie={heroMovie}
          onPress={() =>
            navigation.navigate("MediaDetail", {
              mediaId: heroMovie.id,
              mediaType: "movie",
            })
          }
        />
      )}

      <MovieRow title="Trending Movies" data={movies} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default HomeScreen;
