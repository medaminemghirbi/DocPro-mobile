// BookingStackNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import Booking Flow Screens
import SettingsScreen from "./SettingsScreen";
import UpdatePhoneScreen from "./UpdatePhoneScreen";
import MyProfilInformationScreen from "./MyProfilInformationScreen";
import UpdateNotificationScreen from "./UpdateNotificationScreen";

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
                name="UpdatePhoneScreen"
                component={UpdatePhoneScreen}
                options={{ headerTitle: "Update your Phone" }}
            />

            <Stack.Screen
                name="MyProfilInformationScreen"
                component={MyProfilInformationScreen}
                options={{ headerTitle: "My Profil Informations" }}
            />
            <Stack.Screen
                name="UpdateNotificationScreen"
                component={UpdateNotificationScreen}
                options={{ headerTitle: "My Profil Informations" }}
            />
        </Stack.Navigator>
    );
};

export default SettingStackNavigator;
