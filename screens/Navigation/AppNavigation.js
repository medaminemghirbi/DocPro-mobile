import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoadingScreen from "./LoadingScreen";
import LoginScreen from "../LoginScreen.js";
import DashboardDoctorScreen from "../Doctor/DashboardDoctorScreen";
import DashboardPatientScreen from "../Patient/DashboardPatientScreen";
import Register from "../RegisterScreen";
import ConfirmationScreen from "../ConfirmationScreen";
import MapsScreen from "../Patient/MapsScreen";

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Doctor" component={DashboardDoctorScreen} />
        <Stack.Screen name="Patient" component={DashboardPatientScreen} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        <Stack.Screen name="Maps" component={MapsScreen} options={{ headerShown: false }} />


        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
