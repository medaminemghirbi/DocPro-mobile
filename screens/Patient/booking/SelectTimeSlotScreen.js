import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from "../../../services/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SelectTimeSlotScreen = ({ route, navigation }) => {
    const { doctorId, selectedDate } = route.params;  // Access passed params
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    const response = await fetch(
                        `${API_BASE_URL}/api/v1/available_time_slots/${selectedDate}/${doctorId}`,
                        {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const result = await response.json();
                    if (response.ok) {
                        console.log(result.available_slots);
                        setAvailableSlots(result.available_slots); // Set available slots
                    } else {
                        console.error('Error fetching available slots:', result.message);
                    }
                }
            } catch (error) {
                console.error('Error fetching available slots:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableSlots();
    }, [doctorId, selectedDate]);

    // Render time slot item
    const renderTimeSlot = ({ item }) => (
        <TouchableOpacity
            style={styles.timeSlotContainer}
            onPress={() => navigation.navigate('Confirmation', {
                doctorId,
                selectedDate,
                selectedTime: item.time,  // Pass the selected time
            })}
        >
            <Text style={styles.timeSlot}>{item.time}</Text>
        </TouchableOpacity>
    );

    return loading ? (
        <Text>Loading...</Text>
    ) : (
        <View style={styles.container}>
            <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>
            <View style={styles.timeSlotsContainer}>
                {availableSlots.length > 0 ? (
                    <FlatList
                        data={availableSlots}
                        renderItem={renderTimeSlot}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}  // Display 2 columns
                        columnWrapperStyle={styles.columnWrapper}  // Style for the row (gap between items)
                    />
                ) : (
                    <Text>No available slots for this day.</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    selectedDateText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    timeSlotsContainer: {
        marginTop: 10,
    },
    timeSlotContainer: {
        flex: 1,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeSlot: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    columnWrapper: {
        justifyContent: 'space-between',  // Space out items in each row
        marginBottom: 10,  // Add some space between rows
    },
});

export default SelectTimeSlotScreen;
