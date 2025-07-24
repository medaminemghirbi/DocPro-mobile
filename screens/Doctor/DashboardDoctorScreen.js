import { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Animated,
  Image,
  Easing,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL } from "../../services/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TimelineDot = () => <View style={styles.timelineDot} />;

const TimelineLine = () => <View style={styles.timelineLine} />;

const RefreshingTriangle = ({ isRefreshing }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRefreshing) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.stopAnimation();
      rotateAnim.setValue(0);
    }
  }, [isRefreshing, rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.triangleIcon,
        { transform: [{ rotate: rotateInterpolate }] },
      ]}
    >
      <Ionicons
        name="play"
        size={28}
        color="#4A90E2"
        style={{ transform: [{ rotate: "90deg" }] }}
      />
    </Animated.View>
  );
};

const DashboardDoctorScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Helper to format date/time string from ISO to "HH:MM AM/PM"
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  // Helper to calculate age from birthday string "YYYY-MM-DD"
  const calculateAge = (birthdayStr) => {
    if (!birthdayStr) return "N/A";
    const birthDate = new Date(birthdayStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fetchConsultations = async () => {
    try {
      setRefreshing(true);
      const userId = await AsyncStorage.getItem("id");
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const response = await fetch(
          `${API_BASE_URL}/api/mobile/doctor_consultations_today/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (response.ok) {
          // Map API response to appointment items expected by UI
          const mappedAppointments = result.map((item) => ({
            id: item.id,
            patientName: `${item.patient.firstname} ${item.patient.lastname}`,
            time: formatTime(item.appointment),
            status: item.status === "approved" ? "Confirmed" : item.status,
            patientInfo: {
              age: calculateAge(item.patient.birthday),
              phone: item.patient.phone_number,
              notes: item.note || "No additional notes",
            },
          }));
          setAppointments(mappedAppointments);
        } else {
          console.error("Failed to fetch consultations:", result);
        }
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const currentUser = await AsyncStorage.getItem("currentUser");
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchConsultations();
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="menu" size={26} color="#0F9BAE" />
          </TouchableOpacity>
        ),
      });
    }, [navigation])
  );

  const openPatientModal = (patient) => {
    setSelectedPatient(patient);
    setModalVisible(true);
  };

  const closePatientModal = () => {
    setModalVisible(false);
    setSelectedPatient(null);
  };

  const onRefresh = () => {
    fetchConsultations();
  };

  const renderAppointment = ({ item, index }) => (
    <View style={styles.timelineItem}>
      <View style={styles.timelineTimeContainer}>
        <Text style={styles.appointmentTime}>{item.time}</Text>
      </View>

      <View style={styles.timelineDotContainer}>
        <TimelineDot />
        {index !== appointments.length - 1 && <TimelineLine />}
      </View>

      <View style={styles.appointmentDetails}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => openPatientModal(item.patientInfo)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#4A90E2"
          />
          <Text style={styles.infoButtonText}>Patient Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {user && (
          <Text style={styles.greetingText}>
            Hello Doctor {user.firstname} {user.lastname}
          </Text>
        )}

        {refreshing && <RefreshingTriangle isRefreshing={refreshing} />}
      </View>

      <Text style={styles.sectionTitle}>Today's Consultations</Text>

      {appointments.length === 0 ? (

        <Image
          source={require("../../assets/images/image copy.png")}
          style={styles.noAppointmentsImage}
        />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointment}
          contentContainerStyle={styles.timelineContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closePatientModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Patient Information</Text>
            {selectedPatient ? (
              <>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "700" }}>Age:</Text>{" "}
                  {selectedPatient.age}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "700" }}>Phone:</Text>{" "}
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(`tel:+216${selectedPatient.phone}`)
                    }
                  >
                    <Text
                      style={{
                        color: "#007AFF",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      +216 {selectedPatient.phone}
                    </Text>
                  </TouchableOpacity>
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "700" }}>Notes:</Text>{" "}
                  {selectedPatient.notes}
                </Text>
              </>
            ) : (
              <Text style={styles.modalText}>No patient info available.</Text>
            )}
            <Pressable style={styles.closeButton} onPress={closePatientModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 22,
    paddingTop: 35,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1d1061",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0a419a",
    marginBottom: 20,
  },
  noAppointmentsText: {
    fontSize: 17,
    color: "#0a419a",
    textAlign: "center",
    marginTop: 50,
    fontStyle: "italic",
  },
  timelineContainer: {
    paddingBottom: 40,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
  },
  timelineTimeContainer: {
    width: 85,
  },
  appointmentTime: {
    fontWeight: "700",
    color: "#34495E",
    fontSize: 17,
  },
  timelineDotContainer: {
    width: 40,
    alignItems: "center",
  },
  timelineDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "#4A90E2",
    backgroundColor: "#fff",
    marginVertical: 0,
  },
  timelineLine: {
    flex: 1,
    width: 3,
    backgroundColor: "#4A90E2",
    marginTop: 5,
  },
  appointmentDetails: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#34495E",
  },
  infoButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  infoButtonText: {
    color: "#4A90E2",
    marginLeft: 8,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#34495E",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  triangleIcon: {
    marginLeft: 10,
  },
  noAppointmentsImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 20,
  },
});

export default DashboardDoctorScreen;
