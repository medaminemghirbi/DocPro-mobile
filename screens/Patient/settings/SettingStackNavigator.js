// BookingStackNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import Booking Flow Screens
import SettingsScreen from "./SettingsScreen";
import MyProfilInformationScreen from "./MyProfilInformationScreen";
import UpdateNotificationScreen from "./UpdateNotificationScreen";
import UpdatePasswordScreen from "./UpdatePasswordScreen";

const Stack = createNativeStackNavigator();

const SettingStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{ headerShown: false }} 
            />
            <Stack.Screen
                name="MyProfilInformationScreen"
                component={MyProfilInformationScreen}
                options={{ headerTitle: "My Profil Informations" }}
            />
            <Stack.Screen
                name="UpdateNotificationScreen"
                component={UpdateNotificationScreen}
                options={{ headerTitle: "Update Informations Settings" }}
            />
            <Stack.Screen
                name="UpdatePasswordScreen"
                component={UpdatePasswordScreen}
                options={{ headerTitle: "Update Password" }}
            />
        </Stack.Navigator>
    );
};

export default SettingStackNavigator;
