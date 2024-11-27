import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons"; // Importing icons
import AppointmentsScreen from "./AppointmentsScreen";
import SettingsScreen from "./SettingsScreen";
import HomeScreen from "./HomeScreen";
import BlogScreen from "./BlogScreen";
import ChatScreen from "./ChatScreen";

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
          } else if (route.name === "Appointment") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "Forum") {
            iconName = focused ? "chatbubble" : "chatbubble-outline"; // Icon for Chat/Forum
          } else if (route.name === "Blogs") {
            iconName = focused ? "book" : "book-outline"; // Icon for Blogs
          }

          // Setting icon color to white
          return <Icon name={iconName} size={size} color="white" />;
        },
        tabBarActiveTintColor: "white", // Icon color when the tab is active
        tabBarInactiveTintColor: "gray",  // Icon color when the tab is inactive
        tabBarStyle: {
          height: 80, // Increased height of the bottom tab menu
          paddingBottom: 10, // Adding some padding to the bottom
          borderTopWidth: 0,  // Optional: Remove the top border
          backgroundColor: "#0F9BAE", // Set the background color of the tab bar to #0F9BAE
        },
        tabBarLabelStyle: {
          fontSize: 14, // Adjust the font size of labels
          marginBottom: 5, // Adds space below the label for better readability
          color: "black", // Set the label text color to black
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}  />
      <Tab.Screen name="Appointment" component={AppointmentsScreen}  options={{ headerShown: false }} />
      <Tab.Screen name="Forum" component={ChatScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Blogs" component={BlogScreen} options={{ headerShown: false }}  />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }}  />
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
