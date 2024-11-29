import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../../services/apiConfig";

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const goToDoctorMap = (doctor) => {
    navigation.navigate('Maps', { doctor }); // Pass the doctor object as a parameter
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await AsyncStorage.getItem('currentUser');
        const userData = JSON.parse(currentUser);
        setUser(userData); // Store user data in state
        const userId = await AsyncStorage.getItem('id');
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
            setConsultations(result);
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
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {/* Greeting and Question */}
          <View style={styles.textContainer}>
            <Text style={styles.headerGreeting}>Hi, {user.firstname} {user.lastname}!</Text>
            <Text style={styles.headerQuestion}>How are you today?</Text>
          </View>
          {/* Profile Image */}
          {user && user.user_image_url ? (
            <Image
              source={{ uri: user.user_image_url }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>No Image</Text>
            </View>
          )}
        </View>
      </SafeAreaView>

      {/* Recommendations */}
      <Text style={styles.sectionTitle}>Today's Consultations:</Text>
      <Text style={styles.sectionDate}>{todayDate}</Text>

      <Text style={[styles.doctorRating, styles.psText]}>
        PS: For online consultations, you should visit <Text style={styles.link}>docpro.tn</Text>
      </Text>

      <ScrollView>
        {consultations.length > 0 ? (
          consultations.map((consultation, index) => (
            <View key={index} style={styles.recommendationCard}>
              <Image
                source={{ uri: consultation.doctor.user_image_url_mobile || "https://via.placeholder.com/80" }}
                style={styles.doctorImage}
              />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>
                  Dr. {consultation.doctor.firstname} {consultation.doctor.lastname}
                </Text>
                <Text style={styles.doctorSpecialty}> at {new Date(consultation.appointment).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
                <Text style={styles.doctorSpecialty}> {consultation.appointment_type }</Text>
                <Text style={styles.doctorRating}>{consultation.doctor.address}</Text>
                <TouchableOpacity onPress={() => goToDoctorMap(consultation.doctor)}>
                  <Text>View on Map</Text>
                </TouchableOpacity>

              </View>
            </View>
          ))
        ) : (
          <View style={styles.recommendationCard}>
            <Text style={styles.noConsultationsText}>No consultations today.</Text>
          </View>)}
      </ScrollView>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5FE", // Light blue background for the whole page
  }, safeArea: {
    backgroundColor: "#0F9BAE", // Match the theme
  },
  header: {
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Space between text and image
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "#0F9BAE",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  textContainer: {
    flex: 1, // Take up available space for text
  },
  headerGreeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerQuestion: {
    fontSize: 18,
    color: "#E0F7FA",
    marginTop: 5,
  },
  profileImage: {
    width: 50, // Adjust size as needed
    height: 50, // Ensure square dimensions
    borderRadius: 25, // Make the image circular
    borderWidth: 2, // Optional: Add a border for styling
    borderColor: "#ffffff",
  }, bannerContainer: {
    marginTop: 20, // Space between header and banner
    paddingHorizontal: 20, // Side padding for the banner
  },
  banner: {
    flexDirection: 'row', // Align text and image side by side
    alignItems: 'center', // Vertically center items
    justifyContent: 'space-between', // Space out text and image
    backgroundColor: '#E1F6FB', // Match banner background color
    borderRadius: 30, // Rounded corners
    padding: 40, // Padding inside the banner
    shadowColor: '#000', // Optional: Add shadow for better aesthetics
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textContainer: {
    flex: 1, // Allow the text container to take up available space
    marginRight: 10, // Add spacing between text and image
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F9BAE', // Match theme color
    marginBottom: 10, // Space between text and button
  },
  bannerButton: {
    backgroundColor: '#0F9BAE', // Button background color
    borderRadius: 10, // Rounded corners for the button
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  bannerButtonText: {
    fontSize: 14,
    color: '#FFFFFF', // Button text color
    fontWeight: 'bold',
  },
  bannerImage: {
    width: 100, // Adjust image width
    height: 100, // Adjust image height
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 20,
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#004b8d", // Dark blue for titles
  },
  sectionDate: {
    marginHorizontal: 20,
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#004b8d", // Dark blue for titles
  },
  specialtyContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  specialtyCard: {
    alignItems: "center",
    marginRight: 20,
    backgroundColor: "#ffffff", // White card background
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  specialtyImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  specialtyText: {
    fontSize: 12,
    color: "#333",
  },
  recommendationCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff", // White card background
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  doctorInfo: {
    justifyContent: "center",
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#004b8d", // Dark blue for doctor name
  },
  doctorSpecialty: {
    color: "#555",
  },
  doctorRating: {
    color: "#f39c12", // Gold for rating stars
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff", // White bottom bar background
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  navItem: {
    alignItems: "center",
  },
  profileImageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noConsultationsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,  // Adds spacing to make it look more centered
  },
psText: {
  marginHorizontal: 20,
  fontSize: 18,
  marginBottom: 20,
  color: 'black', // Set the text color to black
  fontStyle: 'italic', // Optional: Make it italic like a "PS" note
  fontSize: 14, // Optional: Adjust the font size for emphasis
},
link: {
  color: 'blue', // Blue color to make the URL stand out as a link
  textDecorationLine: 'underline', // Add underline to make it look like a hyperlink
},
});

export default HomeScreen;
