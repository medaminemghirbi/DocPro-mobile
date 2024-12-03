import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapsScreen = ({ route }) => {
    const doctor = route?.params?.doctor;
    const [mapRegion, setMapRegion] = useState(null);
    useEffect(() => {
        if (doctor) {
            setMapRegion({
                latitude: parseFloat(doctor.latitude) || 0, // Handle potential null/invalid values
                longitude: parseFloat(doctor.longitude) || 0,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        }
    }, [doctor]);
    if (!doctor) {
        return (
            <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackText}>
                    No doctor selected. Please select a doctor to view their location on the map.
                </Text>
            </View>
        );
    }
    if (!mapRegion) {
        return (
            <View style={styles.centered}>
                <Text style={styles.loadingText}>Loading map...</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={mapRegion}>
                <Marker
                    coordinate={{
                        latitude: mapRegion.latitude,
                        longitude: mapRegion.longitude,
                    }}
                    title={`${doctor.firstname} ${doctor.lastname}`}
                    description={doctor.address || 'No address provided'}
                />
            </MapView>
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
});

export default MapsScreen;
