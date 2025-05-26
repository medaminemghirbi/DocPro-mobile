import { View, StyleSheet, Alert, Text } from "react-native";
import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import { API_BASE_URL } from "../../../services/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomLoader from "../../../components/CustomLoader";
import dayjs from 'dayjs'; // install this if not already

const SelectDateScreen = ({ navigation, route }) => {
    const [weekDays, setWeekDays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [doctorInfo, setDoctorInfo] = useState(null);

    const doctorId = route.params?.doctorId;

    useEffect(() => {
        fetchDoctorData();
    }, []);

    const fetchDoctorData = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (token) {
                const response = await fetch(
                    `${API_BASE_URL}/api/mobile/get_selected_doctor/${doctorId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const result = await response.json();
                if (response.ok) {
                    setDoctorInfo(result);
                } else {
                    console.error("Error fetching doctor info:", result.message);
                }
            }
        } catch (error) {
            console.error("Error fetching doctor data:", error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
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
                        setWeekDays(result);
                    } else {
                        console.error('Error fetching weekly schedule:', result.message);
                    }
                }
            } catch (error) {
                console.error('Error fetching weekly schedule:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [doctorId]);

    const formatDateString = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const handleDayPress = (day) => {
        const selectedDate = new Date(day.dateString);
        const isSunday = selectedDate.getDay() === 0;
        const isSaturday = selectedDate.getDay() === 6;

        if (isSunday) {
            Alert.alert("Holiday", "You can't select Sunday.");
        } else if (doctorInfo?.working_saturday === false && isSaturday) {
            Alert.alert("Saturday", "Doctor is closed on Saturday.");
        } else {
            const formattedDate = formatDateString(day.dateString);
            navigation.navigate('SelectTimeSlotScreen', {
                doctorId: doctorId,
                selectedDate: formattedDate
            });
        }
    };

    const markedDates = weekDays.reduce((acc, day) => {
        acc[day.date] = { marked: true, dotColor: 'blue' };
        return acc;
    }, {});

    const renderCustomHeader = (date) => {
        const formattedDate = dayjs(date).format('MMMM YYYY');
        return (
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{formattedDate}</Text>
            </View>
        );
    };

    return loading ? (
        <View style={styles.container}>
            <CustomLoader />
        </View>
    ) : (
        <View style={styles.container}>
            <Calendar
                renderHeader={renderCustomHeader}
                onDayPress={handleDayPress}
                markedDates={markedDates}
                markingType={'simple'}
                firstDay={1}
                minDate={new Date().toISOString().split('T')[0]}
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
    headerContainer: {
        alignItems: 'center',
        padding: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default SelectDateScreen;
