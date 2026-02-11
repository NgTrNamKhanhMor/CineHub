import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getBackdropUrl } from "../service/tmdb.service";
import { TMDbMovie } from "../types";

interface HeroProps {
  movie: TMDbMovie;
  onPress: () => void;
}

const HeroSection = ({ movie, onPress }: HeroProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.container}
      onPress={onPress}
    >
      <Image
        source={{ uri: getBackdropUrl(movie.backdrop_path) }}
        style={styles.image}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.5)", "#000000"]}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <Text style={styles.label}>FEATURED TODAY</Text>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.subtitle}>
          {movie.vote_average ? `★ ${movie.vote_average?.toFixed(1)} •${" "}` : ''}
          {movie.release_date?.split("-")[0]}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", height: 480 },
  image: { width: "100%", height: "100%" },
  gradient: { ...StyleSheet.absoluteFillObject },
  content: { position: "absolute", bottom: 30, left: 20, right: 20 },
  label: {
    color: "#00D400",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: { color: "#fff", fontSize: 36, fontWeight: "bold", lineHeight: 40 },
  subtitle: { color: "#9CA3AF", fontSize: 16, marginTop: 8, fontWeight: "500" },
});

export default HeroSection;
