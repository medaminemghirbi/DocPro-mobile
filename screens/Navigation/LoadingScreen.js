import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Animated, StyleSheet, Image } from "react-native";

const LoadingScreen = ({ navigation }) => {
  const [rotateAnim] = useState(new Animated.Value(0));

  const checkUserAndNavigate = async () => {
    try {
      // Get the currentUser from AsyncStorage
      const user = await AsyncStorage.getItem('currentUser');

      if (!user) {
        // If no user is found, navigate to login
        navigation.replace('Login');
      } else {
        // If user exists, parse the user data and check the role
        const parsedUser = JSON.parse(user);
        const userRole = parsedUser.type;
        console.log()
        // Navigate based on the user role
        if (userRole === 'Doctor') {
          navigation.replace('DoctorDashboard');
        } else if (userRole === 'Patient') {
          navigation.replace('PatientDashboard');
        } else {
          navigation.replace('Login'); // Default route
        }
      }
    } catch (error) {
      console.error('Error checking user in AsyncStorage:', error);
      navigation.replace('Login'); // Redirect to login in case of error
    }
  };

  useEffect(() => {
    // Start the rotating animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();

    // Call the checkUserAndNavigate function after the animation duration
    setTimeout(() => {
      checkUserAndNavigate();
    }, 1500); // Matches the duration of the animation
  }, [navigation, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.loadingContainer}>
      <Image
        source={require("../../assets/images/logo-loading.png")}
        style={styles.loadingImage}
      />
      <Animated.View style={[styles.loader, { transform: [{ rotate }] }]} />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
