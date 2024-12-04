import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    Image,
} from "react-native";
import { API_BASE_URL } from "../../../services/apiConfig";

const ConfirmationScreen = ({ navigation, route }) => {
    const [isOnline, setIsOnline] = useState(false);
    const [addNote, setAddNote] = useState(false);
    const [note, setNote] = useState("");
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [isOnlineshow, setIsOnlineshow] = useState(false);
    const doctorId = route.params?.doctorId;
    const selectedDate = route.params?.selectedDate;
    const selectedTime = route.params?.selectedTime;

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
                    setIsOnlineshow(result.working_online);
                } else {
                    console.error("Error fetching doctor info:", result.message);
                }
            }
        } catch (error) {
            console.error("Error fetching doctor data:", error);
        }
    };

    if (!doctorInfo) {
        // Add a loading or placeholder UI while data is being fetched
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Loading Doctor Info...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Appointment Confirmation</Text>

            <View style={styles.card}>
                { <Image
                    source={{
                        uri: doctorInfo.user_image_url_mobile || "https://via.placeholder.com/80",
                    }}
                    style={styles.image}
                /> }
                <View style={styles.info}>
                    <Text style={styles.name}>
                        Dr. {doctorInfo.firstname} {doctorInfo.lastname}
                    </Text>
                    <Text style={styles.details}>Date: {selectedDate || "N/A"}</Text>
                    <Text style={styles.details}>Time: {selectedTime || "N/A"}</Text>
                </View>
            </View>

            {(doctorInfo.working_online) ?
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Online Appointment?</Text>
                    <Switch
                        value={isOnline}
                        onValueChange={(value) => setIsOnline(value)}
                    />
                </View>
                : null
            }

            <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Add Note To Doctor</Text>
                <Switch
                    value={addNote}
                    onValueChange={(value) => setAddNote(value)}
                />
            </View>

            {addNote && (
                <TextInput
                    style={styles.textArea}
                    placeholder="Add a note..."
                    value={note}
                    onChangeText={(text) => setNote(text)}
                    multiline
                />
            )}

            <Text style={styles.footerText}>
                Thank you for choosing our services. Please confirm your appointment with Dr.{" "}
                {doctorInfo.firstname} {doctorInfo.lastname || "Doctor"}.
            </Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => {
                        // Handle confirm action
                        navigation.navigate("Home");
                    }}
                >
                    <Text style={styles.buttonText}>Confirm Appointment</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.navigate("SelectDate")}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0F0F0",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#007BFF",
    },
    details: {
        fontSize: 16,
        color: "#555",
    },
    toggleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    toggleLabel: {
        fontSize: 16,
        color: "#333",
    },
    textArea: {
        height: 80,
        borderColor: "#E0E0E0",
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: "#F9F9F9",
    },
    footerText: {
        fontSize: 14,
        textAlign: "center",
        color: "#555",
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    confirmButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: "#F44336",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default ConfirmationScreen;
