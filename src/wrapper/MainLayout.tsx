import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import UniversalHeader from "../components/UniversalHeader";

interface Props {
  title?: string;
  headerProps?: any;
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ title, children, headerProps }) => {
  return (
    <View style={styles.container}>
      {title && <UniversalHeader title={title} {...headerProps} />}
      <View style={styles.content}>
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: headerProps.scrollY } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </Animated.ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { flex: 1 },
});

export default MainLayout;
