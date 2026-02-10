import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useActorData } from "../hooks/useActorData";
import { getPosterUrl } from "../service/tmdb.service";
import MovieGrid from "../components/MovieGrid";

interface Tab {
  id: string;
  label: string;
  data?: any[];
  count: number;
}

export default function PersonProfileScreen({ route, navigation }: any) {
  const { personId } = route.params;
  const { data: details, loading } = useActorData(personId);
  const [activeTab, setActiveTab] = useState<string>("bio");

  if (loading) return <ActivityIndicator color="#00D400" style={{ flex: 1 }} />;
  if (!details) return <Text>Error loading profile</Text>;

  const crewByDept = details.crew.reduce((acc: any, item: any) => {
    const dept = item.department;
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(item);
    return acc;
  }, {});

  const dynamicRoles = Object.keys(crewByDept).map((dept) => ({
    id: dept.toLowerCase(),
    label: dept,
    data: crewByDept[dept],
    count: crewByDept[dept].length,
  }));

  if (details.cast && details.cast.length > 0) {
    dynamicRoles.push({
      id: "acting",
      label: "Acting",
      data: details.cast,
      count: details.cast.length,
    });
  }

  const sortedRoles = dynamicRoles.sort((a, b) => b.count - a.count);

  const tabs: Tab[] = [
    { id: "bio", label: "Bio", data: [], count: 0 },
    ...sortedRoles,
  ];
  const handleMediaPress = (id: number, type: "movie" | "tv") => {
    navigation.navigate("MediaDetail", { mediaId: id, mediaType: type });
  };

  if (loading) return <ActivityIndicator color="#00D400" style={{ flex: 1 }} />;
  if (!details) return <Text>Error loading profile</Text>;
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: getPosterUrl(details.details.profile_path, 500) }}
          style={styles.profilePic}
        />
        <Text style={styles.name}>{details.details.name}</Text>
        <Text style={styles.subtext}>{details.details.place_of_birth}</Text>
      </View>

      {/* Dynamic Tab Bar */}
      <View style={{ backgroundColor: "#000" }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarScroll}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.id && styles.activeTabLabel,
                ]}
              >
                {tab.label.toUpperCase()}
                {tab.count > 0 && ` (${tab.count})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {activeTab === "bio" ? (
          <Text style={styles.bioText}>
            {details.details.biography || "No biography available."}
          </Text>
        ) : (
          <MovieGrid
            data={tabs.find((t) => t.id === activeTab)?.data || []}
            onPressMedia={handleMediaPress}
          />
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", marginTop: 40 },
  header: { alignItems: "center", padding: 24 },
  tabBarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#1F1F1F",
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#00D400",
    marginBottom: 16,
  },
  tabBarScroll: {
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1F1F1F",
  },
  name: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  subtext: { color: "#9CA3AF", fontSize: 14, marginTop: 4 },

  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1F1F1F",
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 8,
    alignItems: "center",
  },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "#00D400" },
  tabLabel: {
    color: "#6B7280",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
  activeTabLabel: { color: "#fff" },

  content: { paddingHorizontal: 16 },
  bioText: {
    color: "#D1D5DB",
    lineHeight: 22,
    fontSize: 16,
    marginVertical: 20,
  },
});
