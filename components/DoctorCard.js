import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const DoctorCard = ({ doctor, navigation }) => {
    return (
        <View style={styles.card}>
            {/* Doctor's Image */}
            <Image
                source={{ uri: doctor.image }}
                style={styles.doctorImage}
            />

            {/* Doctor's Info */}
            <View style={styles.infoContainer}>
                <View style={styles.nameRow}>
                    <Text style={styles.name}>Dr. {doctor.name}</Text>
                    <FontAwesome name="check-circle" size={16} color="#4CAF50" />
                    <FontAwesome name="shield" size={16} color="#FFD700" style={styles.iconMargin} />
                </View>
                <Text style={styles.specialty}>{doctor.specialty}</Text>
                <Text style={styles.rating}>
                    <FontAwesome name="star" size={14} color="#FFD700" /> {doctor.rating} ({doctor.reviews})
                </Text>
                <Text style={styles.availability}>Available Online</Text>
                <Text style={styles.location}>
                    <FontAwesome name="map-marker" size={14} color="#777" /> {doctor.location}
                </Text>
            </View>

            {/* Select Doctor Button */}
            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => navigation.navigate("SelectDate", { doctorId: doctor.id })}
            >
                <Text style={styles.buttonText}>Select Doctor</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, // For Android shadow
    },
    doctorImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 8,
    },
    iconMargin: {
        marginLeft: 4,
    },
    specialty: {
        fontSize: 14,
        color: "#555",
        marginBottom: 8,
    },
    rating: {
        fontSize: 14,
        color: "#777",
        marginBottom: 8,
    },
    availability: {
        fontSize: 14,
        color: "#4CAF50",
        marginBottom: 8,
    },
    location: {
        fontSize: 14,
        color: "#777",
    },
    selectButton: {
        backgroundColor: "#F0F0F0",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#00C9A7",
    },
    buttonText: {
        color: "#00C9A7",
        fontWeight: "600",
    },
});

export default DoctorCard;
