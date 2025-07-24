import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import Booking Flow Screens
import SelectDoctorScreen from "./SelectDoctorScreen";
import SelectDateScreen from "./SelectDateScreen";
import ConfirmationScreen from "./ConfirmationScreen";
import AppointmentsScreen from "./AppointmentsScreen";
import SelectTimeSlotScreen from "./SelectTimeSlotScreen";
import DoctorDetailsScreen from "./DoctorDetailsScreen";

var Stack = createNativeStackNavigator();

var BookingStackNavigator = function BookingStackNavigator() {
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
                name="DoctorDetailsScreen" 
                component={DoctorDetailsScreen} 
                options={{ headerTitle: "Doctor Details" }}

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
