import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoadingScreen from "./LoadingScreen";
import LoginScreen from "../LoginScreen.js";
import DashboardDoctorScreen from "../Doctor/DashboardDoctorScreen";
import DashboardPatientScreen from "../Patient/DashboardPatientScreen";
import Register from "../RegisterScreen";
//import DrawerNavigation from './DrawerNavigation';

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

        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
