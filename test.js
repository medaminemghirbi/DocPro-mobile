import React, { useEffect, useState } from "react";
import { View, Animated, StyleSheet, Image, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingScreen = ({ navigation }) => {
  const [rotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();

    // Check AsyncStorage and handle expiration logic
    const checkUserSession = async () => {
      try {
        // Get stored user data and expiration timestamp
        const storedUser = await AsyncStorage.getItem("currentUser");
        const storedTimestamp = await AsyncStorage.getItem("currentUserTimestamp");

        // If no stored user or timestamp, navigate to login
        if (!storedUser || !storedTimestamp) {
          navigation.replace("Login");
          return;
        }

        const user = JSON.parse(storedUser);
        const currentTimestamp = new Date().getTime();
        const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        // Check if the session has expired
        if (currentTimestamp - parseInt(storedTimestamp) > expirationTime) {
          // Data expired, reset and navigate to login
          await AsyncStorage.removeItem("currentUser");
          await AsyncStorage.removeItem("currentUserTimestamp");
          Alert.alert("Session Expired", "Your session has expired. Please log in again.");
          navigation.replace("Login");
        } else {
          // Session is valid, navigate based on role
          const userRole = user.role; // Assuming 'role' is saved in user object
          if (userRole === "Doctor") {
            navigation.replace("DoctorDashboard");
          } else if (userRole === "Patient") {
            navigation.replace("PatientDashboard");
          } else {
            navigation.replace("Login");
          }
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        navigation.replace("Login");
      }
    };

    // Call the check session function
    checkUserSession();
  }, [rotateAnim, navigation]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.loadingContainer}>
      <Image source={require("../../assets/images/logo-loading.png")} style={styles.loadingImage} />
      <Animated.View style={[styles.loader, { transform: [{ rotate }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingImage: {
    width: 100,
    height: 100,
  },
  loader: {
    width: 50,
    height: 50,
    borderWidth: 10,
    borderRadius: 50,
    borderColor: "#0F9BAE",
    borderTopColor: "transparent",
    animationDuration: "1s",
    borderStyle: "solid",
  },
});

export default LoadingScreen;
