import { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    Pressable,
    Alert,
    RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-paper";
import { API_BASE_URL } from "../../../services/apiConfig";

const PendingScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [refusReason, setRefusReason] = useState("");
  const [showRefusInput, setShowRefusInput] = useState(false);

  const fetchAppointments = async () => {
    try {
      setRefreshing(true);
      const userId = await AsyncStorage.getItem("id");
      const token = await AsyncStorage.getItem("authToken");

      if (token) {
        const response = await fetch(
          `${API_BASE_URL}/api/mobile/doctor_appointments/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        const pendingAppointments = result.filter(
          (appointment) => appointment.status === "pending"
        );
        setAppointments(pendingAppointments);
        setError(null);
      }
    } catch (error) {
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = () => {
    fetchAppointments();
  };

  const openModal = (appointment) => {
    if (appointment.status === "pending") {
      setSelectedAppointment(appointment);
      setModalVisible(true);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!selectedAppointment) return;

    if (newStatus === "rejected" && !refusReason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection.");
      return;
    }

    setStatusUpdating(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(
        `${API_BASE_URL}/api/mobile/consultations/${selectedAppointment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            ...(newStatus === "rejected" && { refus_reason: refusReason }),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      setAppointments((prev) =>
        prev.filter((appt) => appt.id !== selectedAppointment.id)
      );

      setRefusReason("");
      setShowRefusInput(false);
      setModalVisible(false);
      Alert.alert("Success", `Appointment ${newStatus} successfully`);
    } catch (error) {
      Alert.alert("Error", "Could not update status. Please try again.");
    } finally {
      setStatusUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#4CAF50";
      case "rejected":
        return "#F44336";
      case "pending":
        return "#FFC107";
      default:
        return "#9E9E9E";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderAppointment = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openModal(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.patientName}>
          {item.patient.firstname} {item.patient.lastname}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text>{formatDate(item.appointment)} - {formatTime(item.appointment)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#3F51B5" />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAppointment}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Status</Text>
            <TextInput
              label="Refusal Reason"
              value={refusReason}
              onChangeText={setRefusReason}
              style={{ marginBottom: 10 }}
              multiline
            />
            <Pressable
              style={styles.rejectButton}
              onPress={() => updateStatus("rejected")}
              disabled={statusUpdating}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </Pressable>
            <Pressable
              style={styles.approveButton}
              onPress={() => updateStatus("approved")}
              disabled={statusUpdating}
            >
              <Text style={styles.buttonText}>Approve</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  patientName: { fontWeight: "bold", fontSize: 16 },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: { color: "#fff", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  rejectButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  buttonText: { color: "white", textAlign: "center" },
  cancelText: { textAlign: "center", marginTop: 10, color: "#3F51B5" },
});

export default PendingScreen;
