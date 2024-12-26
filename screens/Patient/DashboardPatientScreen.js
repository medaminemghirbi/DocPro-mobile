import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons"; // Importing icons
//import AppointmentsScreen from "./AppointmentsScreen";
import SettingsScreen from "./settings/SettingsScreen";
import HomeScreen from "./HomeScreen";
import BlogScreen from "./BlogScreen";
import ChatScreen from "./ChatScreen";
import MapsScreen from "./MapsScreen";
import DictionaireScreen from "./DictionaireScreen";
import BookingStackNavigator from "./booking/BookingStackNavigator";
import SettingStackNavigator from "./settings/SettingStackNavigator";

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const DashboardPatientScreen = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Assigning icons to each tab
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Booking") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "Health") {
            iconName = focused ? "heart" : "heart-outline"; // Icon for Chat/Forum
          } else if (route.name === "Messages") {
            iconName = focused ? "mail" : "mail-outline"; // Icon for Blogs
          } else if (route.name === "Maps") {
            iconName = focused ? "map" : "map-outline"; // Icon for Blogs
          } else if (route.name === "Wikepedia") {
            iconName = focused ? "reader" : "reader-outline"; // Icon for Blogs
          }

          // Setting icon color to white
          return <Icon name={iconName} size={size} color="white" />;
        },
        tabBarActiveTintColor: "#ffffff", // Icon and label color when active
        tabBarInactiveTintColor: "#B3E5F6", // Icon and label color when inactive
        tabBarStyle: {
          height: 90, // Increase the height of the bottom bar
          paddingBottom: 10, // Space for better alignment
          paddingTop: 10, // Space at the top of the tab bar
          backgroundColor: "#0F9BAE", // Exact color from the image (#0F9BAE)
          borderTopLeftRadius: 20, // Rounded top corners
          borderTopRightRadius: 20, // Rounded top corners
          shadowColor: "#000", // Shadow for a modern touch
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12, // Slightly smaller font size for labels
          fontWeight: "bold", // Bold labels
          marginTop: -5, // Adjust label position closer to icons
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Booking" component={BookingStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Health" component={BlogScreen} options={{ headerShown: false }} />
      {/* <Tab.Screen name="Maps" component={MapsScreen} options={{ headerShown: false }}  /> */}
      {/* <Tab.Screen name="Blogs" component={BlogScreen} options={{ headerShown: false }}  /> */}
      <Tab.Screen name="Messages" component={ChatScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingStackNavigator} options={{ headerShown: false }} />

    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
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
