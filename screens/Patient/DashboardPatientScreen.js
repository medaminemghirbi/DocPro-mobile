import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "./HomeScreen";
import ChatScreen from "./ChatScreen";
import BookingStackNavigator from "./booking/BookingStackNavigator";
import SettingStackNavigator from "./settings/SettingStackNavigator";
import DictionaryStackNavigator from "./dictionary/DictionaryStackNavigator";
import { useSafeAreaInsets } from "react-native-safe-area-context";

var Tab = createBottomTabNavigator();

var DashboardPatientScreen = function DashboardPatientScreen(_ref) {
  const insets = useSafeAreaInsets(); // ⬅️ Automatically get bottom safe area

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Booking") iconName = focused ? "calendar" : "calendar-outline";
          else if (route.name === "Settings") iconName = focused ? "settings" : "settings-outline";
          else if (route.name === "IA") iconName = focused ? "book" : "book-outline";
          else if (route.name === "Forum") iconName = focused ? "chatbox-ellipses" : "chatbox-outline";

          return <Icon name={iconName} size={size} color="white" />;
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#B3E5F6",
        tabBarStyle: {
          height: 70 + insets.bottom, // ✅ Add bottom padding dynamically
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10, // Safe area or fallback
          paddingTop: 10,
          backgroundColor: "#0F9BAE",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginTop: -5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Booking" component={BookingStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="IA" component={DictionaryStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Forum" component={ChatScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingStackNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

var styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F9BAE",
  },
  logo: {
    width: 40, // Adjust based on your logo's size
    height: 40,
  },
});

export default DashboardPatientScreen;
