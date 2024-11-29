import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapsScreen = ({ route }) => {
    const doctor = route?.params?.doctor;
    const [googleMapStyle, setGoogleMapStyle] = useState([]);

    const [mapRegion, setMapRegion] = useState({
        latitude: doctor?.latitude,
        longitude: doctor?.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,

    })
    if (!doctor) {
        return (
            <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackText}>
                    No doctor selected. Please select a doctor to view their location on the map.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={mapRegion}>
                <Marker coordinate={mapRegion} title={doctor?.firstname + ' ' + doctor?.lastname} ></Marker>
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center'
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
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});

export default MapsScreen;
