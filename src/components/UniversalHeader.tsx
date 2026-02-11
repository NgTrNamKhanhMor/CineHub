import React from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";

interface Props {
  title?: string;
  onBack?: () => void;
  scrollY?: any;
}

const UniversalHeader: React.FC<Props> = ({ title, onBack, scrollY }) => {
  // Smooth the animation by animating opacity over a wider input range
  const backButtonOpacity = scrollY
    ? scrollY.interpolate({
        inputRange: [80, 220],
        outputRange: [0.25, 1],
        extrapolate: "clamp",
      })
    : 1;

  // Make the header title fade in more gradually
  const headerOpacity = scrollY
    ? scrollY.interpolate({
        inputRange: [120, 260],
        outputRange: [0, 1],
        extrapolate: "clamp",
      })
    : 1;

  return (
    <>
      <Animated.View
        style={[
          styles.backContainer,
          { backgroundColor: "#111", opacity: backButtonOpacity },
        ]}
      >
        <TouchableOpacity
          onPress={onBack}
          style={styles.backTouchable}
          activeOpacity={0.7}
        >
          <ChevronLeft size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <View style={styles.stickyHeaderContent}>
          <View style={{ width: 50 }} />
          <Text style={styles.stickyTitle} numberOfLines={1}>
            {title}
          </Text>
          <View style={{ width: 50 }} />
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backContainer: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 110,
    borderRadius: 20,
    overflow: "hidden",
  },
  backTouchable: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#111",
    zIndex: 100,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  stickyHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    height: 40,
  },
  stickyTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
});

export default UniversalHeader;
