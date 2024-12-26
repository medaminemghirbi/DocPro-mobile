// BookingStackNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import Booking Flow Screens
import SelectDoctorScreen from "./SelectDoctorScreen";
import SelectDateScreen from "./SelectDateScreen";
import ConfirmationScreen from "./ConfirmationScreen";
import AppointmentsScreen from "./AppointmentsScreen";
import SelectTimeSlotScreen from "./SelectTimeSlotScreen";

const Stack = createNativeStackNavigator();

const BookingStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AppointmentList"
                component={AppointmentsScreen}
                options={{ headerShown: false }} 
            />
            <Stack.Screen
                name="SelectDoctor"
                component={SelectDoctorScreen}
                options={{ headerTitle: "Select a Doctor" }}
            />
            <Stack.Screen
                name="SelectDate"
                component={SelectDateScreen}
                options={{ headerTitle: "Select a Date" }}
            />
            <Stack.Screen
                name="SelectTimeSlotScreen"
                component={SelectTimeSlotScreen}
                options={{ headerTitle: "Select Time" }}
            />
            <Stack.Screen
                name="Confirmation"
                component={ConfirmationScreen}
                options={{ headerTitle: "Confirmation" }}
            />


        </Stack.Navigator>
    );
};

export default BookingStackNavigator;
