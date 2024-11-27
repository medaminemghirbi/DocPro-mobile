import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "react-native-vector-icons"; // Importing Ionicons for the logout icon
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { API_BASE_URL } from "../../services/apiConfig";

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null); // State to store the user data
  const [consultations, setConsultations] = useState([]); // State to store consultations data
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Use effect to fetch the user data from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await AsyncStorage.getItem('currentUser');
        const userData = JSON.parse(currentUser);
        setUser(userData);
        const userId = await AsyncStorage.getItem('id');
        // Fetch consultations data from the API
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const response = await fetch(
            `${API_BASE_URL}/api/mobile/patient_consultations_today/${userId}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );

          const result = await response.json();
          if (response.ok) {
            console.log(result)
            setConsultations(result); // Set consultations data to state
          } else {
            console.error('Error fetching consultations:', result.message);
          }
        }
      } catch (error) {
        console.error("Error fetching user data or consultations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  const todayDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', // Get the full weekday name (e.g., "Monday")
    day: 'numeric',  // Get the day of the month (e.g., "27")
    month: 'short',  // Get the short month name (e.g., "Nov")
    year: 'numeric', // Get the full year (e.g., "2024")
  });
  return (
    <View style={styles.container}>
      {/* Header with logo and logout icon */}
      <View style={styles.header}>
        <Ionicons
          name="log-out-outline" // Using Ionicons log-out icon
          size={30} // Icon size
          color="white" // Icon color
          style={styles.logoutIcon}
          onPress={() => navigation.navigate("Login")} // Navigate to Login screen on press
        />
      </View>

      {/* Main screen content */}
      <View style={styles.screenContainer}>
        {/* Display consultations */}
        {consultations.length > 0 ? (
          <View>
        <Text style={styles.consultationsHeader}>Today's Consultations: </Text>
        <Text style={styles.dateText}>{todayDate}</Text> 
        {consultations.map((consultation, index) => {
              const appointmentDate = new Date(consultation.appointment);
              return (
                <View key={index} style={styles.consultationItem}>
                  {/* Appointment details */}
                  <Text style={styles.appointmentText}>
                    {appointmentDate.toLocaleTimeString()}
                  </Text>
                  <Text style={styles.appointmentText}>Type: {consultation.appointment_type}</Text>
                  <Text style={styles.appointmentText}>Doctor: {consultation.doctor.firstname} {consultation.doctor.lastname}</Text>
                  <Text style={styles.appointmentText}>Address: {consultation.doctor.address} </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.noConsultationsText}>No consultations today.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dateText: {
    fontSize: 18,
    fontWeight: "400", // Lighter font for the date
    color: "#555",
    marginBottom: 15, // Adds space before consultations
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 40, // Padding for top to avoid header overlap
  },
  header: {
    flexDirection: "row", // Aligns the logo, text, and icon horizontally
    justifyContent: "flex-end", // Move logout icon to the right
    alignItems: "center", // Vertically centers the content
    paddingLeft: 20, // Adds space from the left
    paddingRight: 20, // Adds space to the right for the logout icon
    paddingBottom: 20, // Padding at the bottom of header
    backgroundColor: "#0F9BAE", // Header background color
    height: 100, // Adjusted height for header
  },
  logoutIcon: {
    marginLeft: "auto", // Pushes the logout icon to the far right
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: 20, // Horizontal padding for better spacing
    marginTop: 20, // Adds space from the header
  },
  consultationsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15, // Adds space below the header
  },
  consultationItem: {
    marginBottom: 15, // Adds space between each consultation
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  appointmentText: {
    fontSize: 16,
    marginBottom: 8, // Adds space between text lines
  },
  appointmentDay: {
    fontWeight: "bold", // Makes the day name bold
    fontSize: 18,
  },
  noConsultationsText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center", // Centered text for the no consultations message
  },
});

export default HomeScreen;
