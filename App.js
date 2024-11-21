import React, { useEffect, useState } from "react";
import { View, Animated, StyleSheet, Image} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import DashboardPatientScreen from "./screens/Patient/DashboardPatientScreen";
import DashboardDoctorScreen from "./screens/Doctor/DashboardDoctorScreen";

const Stack = createStackNavigator();

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
    setTimeout(() => {
      navigation.replace("Login");
    }, 1500);
  }, [navigation, rotateAnim]);
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <View style={styles.loadingContainer}>
          <Image
        source={require("./assets/images/logo-loading.png")}
        style={styles.loadingImage}
      />
      <Animated.View
        style={[styles.loader, { transform: [{ rotate }] }]}
      />
    </View>
  );
};
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Doctor" component={DashboardDoctorScreen} />
        <Stack.Screen name="Patient" component={DashboardPatientScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
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
