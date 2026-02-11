import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, View, Easing } from "react-native";

const AppLoader = ({ isDataReady, onFinish }: { isDataReady: boolean, onFinish: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fullCircleAnim = useRef(new Animated.Value(0)).current; // For the solid ring reveal
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const [animationMinTimeDone, setAnimationMinTimeDone] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 1. Initial Fade In
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();

    // 2. Continuous Rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => setAnimationMinTimeDone(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Trigger the "Completion" animation
    if (animationMinTimeDone && isDataReady && !isExiting) {
      setIsExiting(true);

      Animated.sequence([
        // Step A: Fade in the "Full Circle" solid ring
        Animated.timing(fullCircleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Step B: Hold the full circle for a split second, then scale and exit
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
        ])
      ]).start(() => onFinish());
    }
  }, [animationMinTimeDone, isDataReady, isExiting]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ 
        opacity: fadeAnim, 
        transform: [{ scale: scaleAnim }], 
        alignItems: "center" 
      }}>
        <View style={styles.outerCircle}>
          
          {/* 1. The Rotating Arc (Hidden when full circle is 100% visible) */}
          <Animated.View
            style={[styles.pinkRing, { transform: [{ rotate: spin }] }]}
          />

          {/* 2. The Solid Completion Ring (Fades in over the arc) */}
          <Animated.View 
            style={[styles.fullRing, { opacity: fullCircleAnim }]} 
          />

          <View style={styles.innerCircle}>
            <Image
              source={require("../../assets/app-icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  outerCircle: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  pinkRing: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#FF1493",
    borderTopColor: "transparent",
    borderLeftColor: "rgba(255, 20, 147, 0.3)",
  },
  fullRing: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#FF1493", // Pure solid pink
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  logoImage: {
    width: 32,
    height: 32,
  },
});

export default AppLoader;