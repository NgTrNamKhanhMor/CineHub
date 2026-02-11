import { StatusBar, StyleSheet } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchScreen from "./src/screens/SearchScreen";
import PersonProfileScreen from "./src/screens/PersonProfileScreen";
import MediaDetailWrapper from "./src/wrapper/MediaDetailWrapper";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: "#000000" },
          headerShown: false,
        }}
      >
        <Stack.Screen name="Search" component={SearchScreen} />

        <Stack.Screen name="MediaDetail" component={MediaDetailWrapper} />

        <Stack.Screen name="PersonProfile" component={PersonProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
