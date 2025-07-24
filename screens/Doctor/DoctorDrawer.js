// navigation/DoctorDrawer.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { createDrawerNavigator, DrawerItemList, DrawerItem, DrawerContentScrollView } from "@react-navigation/drawer";
import { doctorDrawerItems } from "./doctorDrawerItems";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../services/apiConfig";
const Drawer = createDrawerNavigator();

const profileImageUri = "https://randomuser.me/api/portraits/men/32.jpg"; // Replace with real uri or local image

const DoctorDrawer = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await AsyncStorage.getItem("currentUser");
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const getProfileImage = () => {
    if (user?.user_image_url_mobile && user.user_image_url_mobile !== "") {
      return { uri: user.user_image_url_mobile };
    }
    return require("../../assets/images/doctor-1.png");
  };
  const handleLogout = (navigation) => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              await axios.delete(`${API_BASE_URL}/api/sign_out`, {
                headers: { Authorization: `Bearer ${token}` },
              });
  
              await AsyncStorage.clear();
  
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (e) {
              console.error("Logout error:", e.response?.data || e.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: "#0F9BAE",
        drawerInactiveTintColor: "#555",
        drawerStyle: {
          width: 260,
        },
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 16,
        },
      }}
      drawerContent={(props) => (
        <View style={{ flex: 1 }}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image source={getProfileImage()} style={styles.profileImage} />
            <Text style={styles.profileName}>
            {user ? `${user.firstname} ${user.lastname}` : "Welcome Dr. App"}
            </Text>
            <Text style={styles.profileSubtitle}>www.DermaPro.com</Text>
          </View>

          {/* Drawer Items Scroll */}
          <DrawerContentScrollView {...props} style={{ marginTop: 0 }}>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Logout Button */}
          <DrawerItem
            label="Logout"
            icon={({ color, size }) => (
              <Feather name="log-out" size={size} color={color} />
            )}
            onPress={() => handleLogout(props.navigation)}
            style={{ marginBottom: 20 }}
          />
        </View>
      )}
    >
      {doctorDrawerItems.map((item, index) => (
        <Drawer.Screen
          key={index}
          name={item.name}
          component={item.component}
          options={{
            drawerIcon: ({ color, size }) => (
              <item.icon color={color} size={size} />
            ),
          }}
        />
      ))}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: "#FFF",
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileSubtitle: {
    fontSize: 12,
    color: "#555",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
  },
});

export default DoctorDrawer;
