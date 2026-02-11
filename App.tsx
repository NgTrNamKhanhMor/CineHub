import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Search, User } from "lucide-react-native";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import PersonProfileScreen from "./src/screens/PersonProfileScreen";
import MediaDetailWrapper from "./src/wrapper/MediaDetailWrapper";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#000" } }}>
      <HomeStack.Screen name="HomeBase" component={HomeScreen} />
      <HomeStack.Screen name="MediaDetail" component={MediaDetailWrapper} />
      <HomeStack.Screen name="PersonProfile" component={PersonProfileScreen} />
    </HomeStack.Navigator>
  );
}

function SearchStackScreen() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#000" } }}>
      <SearchStack.Screen name="SearchBase" component={SearchScreen} />
      <SearchStack.Screen name="MediaDetail" component={MediaDetailWrapper} />
      <HomeStack.Screen name="PersonProfile" component={PersonProfileScreen} />
    </SearchStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#000000",
            borderTopColor: "#1A1A1A",
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: "#00D400",
          tabBarInactiveTintColor: "#6B7280",
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStackScreen} 
          options={{
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tab.Screen 
          name="Search" 
          component={SearchStackScreen} 
          options={{
            tabBarIcon: ({ color }) => <Search size={24} color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}