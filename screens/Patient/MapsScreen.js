import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps'; // Import Polyline
import Icon from "react-native-vector-icons/Ionicons"; // Importing icons
import * as Location from 'expo-location'; // Don't forget to import the Location API

const MapsScreen = ({ route, navigation }) => {
    const doctor = route?.params?.doctor;
    const [error, setError] = useState("");
    const [userLocation, setUserLocation] = useState(null);
    const [doctorLocation, setDoctorLocation] = useState(null);
    const [distance, setDistance] = useState(null); // State for storing the distance

    const GetMyCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setError("Permission not granted");
            return;
        }
        let { coords } = await Location.getCurrentPositionAsync();
        if (coords) {
            const { latitude, longitude } = coords;
            setUserLocation({ latitude, longitude });
        }
    };

    const [mapRegion, setMapRegion] = useState(null);

    useEffect(() => {
        GetMyCurrentLocation(); // Get current location on load
    }, []);

    useEffect(() => {
        if (doctor) {
            setDoctorLocation({
                latitude: parseFloat(doctor.latitude) || 0,
                longitude: parseFloat(doctor.longitude) || 0,
            });
            setMapRegion({
                latitude: parseFloat(doctor.latitude) || 0,
                longitude: parseFloat(doctor.longitude) || 0,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        }
    }, [doctor]);

    useEffect(() => {
        if (userLocation && doctorLocation) {
            // Calculate distance when both user and doctor locations are available
            const distance = getDistanceFromLatLonInKm(
                userLocation.latitude,
                userLocation.longitude,
                doctorLocation.latitude,
                doctorLocation.longitude
            );
            setDistance(distance);
        }
    }, [userLocation, doctorLocation]);

    // Haversine formula to calculate the distance between two points
    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
        const dLon = (lon2 - lon1) * (Math.PI / 180); 
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        const distance = R * c; // Distance in km
        return distance;
    };

    if (!doctor) {
        return (
            <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackText}>
                    No doctor selected. Please select a doctor to view their location on the map.
                </Text>
            </View>
        );
    }

    if (!mapRegion || !userLocation) {
        return (
            <View style={styles.centered}>
                <Text style={styles.loadingText}>Loading map...</Text>
            </View>
        );
    }

    const handleGoHome = () => {
        navigation.navigate('Patient'); // Navigates to the 'Home' screen
    };

    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={mapRegion}>
                {doctorLocation && (
                    <Marker
                        coordinate={doctorLocation}
                        title={`${doctor.firstname} ${doctor.lastname}`}
                        description={doctor.address || 'No address provided'}
                    />
                )}
                {userLocation && (
                    <Marker
                        coordinate={userLocation}
                        title="Your Location"
                        description="This is where you are"
                        pinColor="blue" // Change the color of the user's marker
                    />
                )}
                {userLocation && doctorLocation && (
                    <Polyline
                        coordinates={[userLocation, doctorLocation]} // Line from user to doctor
                        strokeColor="blue" // Color of the line
                        strokeWidth={4} // Width of the line
                    />
                )}
            </MapView>
            <TouchableOpacity style={styles.button} onPress={handleGoHome}>
                <Icon name="home" size={24} color="black" style={styles.icon} />
                <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>

            {distance && (
                <View style={styles.distanceContainer}>
                    <Text style={styles.distanceText}>Distance to Doctor: {distance.toFixed(2)} km</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    fallbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fallbackText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: 'blue',
    },
    button: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: '#3b82f6', // Blue background
        flexDirection: 'row', // Align icon and text in a row
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 30, // Rounded corners
        zIndex: 1, // Ensure the button is above the map
        shadowColor: '#000', // Add shadow for better visibility
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10, // Space between icon and text
    },
    icon: {
        marginRight: 10,
    },
    distanceContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        borderRadius: 10,
    },
    distanceText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MapsScreen;
