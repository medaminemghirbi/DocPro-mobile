import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import { API_BASE_URL } from "../../../services/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SelectDateScreen = ({ navigation, route }) => {
    const [weekDays, setWeekDays] = useState([]);
    const [loading, setLoading] = useState(true);
    const { doctorId } = route.params;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = await AsyncStorage.getItem('currentUser');
                const userData = JSON.parse(currentUser);
                const token = await AsyncStorage.getItem('authToken');

                if (token) {
                    const response = await fetch(
                        `${API_BASE_URL}/weeks/${doctorId}`,
                        {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const result = await response.json();
                    if (response.ok) {
                        setWeekDays(result); // Set the doctor schedule
                    } else {
                        console.error('Error fetching weekly schedule:', result.message);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data or weekly schedule:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [doctorId]);

    // Helper function to format date as dd-mm-yyyy
    const formatDateString = (dateString) => {
        const date = new Date(dateString);  // Convert to Date object
        const day = String(date.getDate()).padStart(2, '0');  // Get day with leading zero if necessary
        const month = String(date.getMonth() + 1).padStart(2, '0');  // Get month (0-indexed)
        const year = date.getFullYear();  // Get year
        
        return `${year}-${month}-${day}`;
    };
    // Navigate to the SelectTimeSlotScreen with doctorId and formatted date
    const handleDayPress = (day) => {
        const formattedDate = formatDateString(day.dateString);
        console.log(doctorId)
        navigation.navigate('SelectTimeSlotScreen', {
            doctorId: doctorId,
            selectedDate: formattedDate
        });

    };

    // Calendar marked days and event handler
    const markedDates = weekDays.reduce((acc, day) => {
        acc[day.date] = { marked: true, dotColor: 'blue' };
        return acc;
    }, {});

    return loading ? (
        <Text>Loading...</Text>
    ) : (
        <View style={styles.container}>
            <Calendar
                onDayPress={(day) => handleDayPress(day)}  // Navigate on day press
                markedDates={markedDates}
                markingType={'simple'}
                firstDay={1} // Start from Monday
                minDate={new Date().toISOString().split('T')[0]} // Disable past dates
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
});

export default SelectDateScreen;
