import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Modal,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../../services/apiConfig";
import CustomLoader from "../../../components/CustomLoader";
import { format } from "date-fns";
import axios from 'axios';
import { SelectCountry } from 'react-native-element-dropdown';
const AppointmentsScreen = ({ navigation }) => {
  const goToDoctorMap = (doctor) => {
    navigation.navigate('Maps', { doctor }); 
  };
  const local_data = [
    { 
      value: "all",
      label: "All",
      image: {
        uri: 'https://cdn-icons-png.flaticon.com/256/5129/5129670.png',
      }
    },
    { 
      value: "pending",
      label: "Pending",
      image: {
        uri: 'https://static-00.iconduck.com/assets.00/pending-icon-512x504-9zrlrc78.png',
      },
    },
    { value: "approved",
      label: "Accepted",
      image: {
        uri: 'https://cdn-icons-png.flaticon.com/512/2550/2550322.png',
      }
    },
    { value: "rejected",
      label: "Rejected", 
      image: {
        uri: 'https://png.pngtree.com/element_our/20200702/ourmid/pngtree-reject-icon-cartoon-vector-image_2291253.jpg',
      },
    }
    ];

  const [country, setCountry] = useState('0');
  const [user, setUser] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const handleDelete = (consultationId) => {
    Alert.alert(
      "Are you sure?",
      "Do you want to delete this Demande?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => deleteConsultation(consultationId),
        },
      ],
      { cancelable: true }
    );
  };
  const deleteConsultation = async (consultationId) => {
    try {
      // Set your token here
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.delete( `${API_BASE_URL}/api/mobile/archive_consultation/${consultationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        Alert.alert("Deleted!", "The consultation has been deleted.", [{ text: "OK" }]);
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting consultation:", error);
      // Show error message if the deletion fails
      Alert.alert("Error!", "Failed to delete consultation.", [{ text: "OK" }]);
    }
  };
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("id");
      const token = await AsyncStorage.getItem("authToken");
      console.log(token)
      if (token) {
        const response = await fetch(
          `${API_BASE_URL}/api/mobile/patient_appointments/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (response.ok) {
          setConsultations(result);
        } else {
          console.error("Error fetching consultations:", result.message);
        }
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setLoading(false);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConsultations();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUserData();
    fetchConsultations();
  }, []);

  useEffect(() => {
    let filtered = consultations;
  
    if (searchQuery) {
      filtered = filtered.filter((consultation) =>
        consultation.doctor.firstname
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        consultation.doctor.lastname
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
  
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (consultation) => consultation.status === selectedStatus
      );
    }
  
    setFilteredDoctors(filtered);
  }, [searchQuery, selectedStatus, consultations]);
  

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomLoader />
      </View>
    );
  }

  const formatAppointmentDate = (appointment) =>
    format(new Date(appointment), "EEEE dd MMM yyyy 'at' HH:mm");
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.textContainer}>
            <Text style={styles.headerGreeting}>
              Hi, {user?.firstname} {user?.lastname}!
            </Text>
            <Text style={styles.headerQuestion}>How are you today?</Text>
          </View>
          {user?.user_image_url ? (
            <Image source={{ uri: user.user_image_url }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>No Image</Text>
            </View>
          )}
        </View>
      </SafeAreaView>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TouchableOpacity
          style={styles.bannerButton}
          onPress={() => navigation.navigate("SelectDoctor")}
        >
          <Text style={styles.bannerButtonText}>Add New Demande</Text>
        </TouchableOpacity>

        <View style={styles.filterContainer}>
          <Text style={styles.psText}>
            All Consultation Demandes ({filteredDoctors.length})
          </Text>
          <SelectCountry
            style={styles.dropdown}
            selectedTextStyle={styles.selectedTextStyle}
            placeholderStyle={styles.placeholderStyle}
            value={country}
            data={local_data}
            valueField="value"
            imageField="image"
            labelField="label"
            placeholder="Select status"
            onChange={(e) => {
              setCountry(e.value);
              setSelectedStatus(e.value); // Update the status filter accordingly
            }}
          />


        </View>

        {filteredDoctors.map((consultation, index) => (
          <View style={styles.recommendationCard} key={index}>
            <Image
              source={{
                uri:
                  consultation.doctor?.user_image_url_mobile ||
                  "https://via.placeholder.com/80",
              }}
              style={styles.doctorImage}
            />
            <View style={styles.doctorInfo}>
              <Text style={styles.appointment}>
                {formatAppointmentDate(consultation.appointment)}
              </Text>
              <Text style={styles.doctorName}>
                Dr. {consultation.doctor?.firstname} {consultation.doctor?.lastname}
              </Text>
              <Text style={styles.doctorSpecialty}>
                {consultation.appointment_type}
              </Text>
              <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  {
                    backgroundColor:
                      consultation.status === "pending"
                        ? "#ffcc00"
                        : consultation.status === "approved"
                        ? "#00cc00"
                        : "#e60000",
                  },
                ]}
              >
                <Text style={styles.statusButtonText}>
                  {consultation.status === "pending"
                    ? "Pending"
                    : consultation.status === "approved"
                    ? "Accepted"
                    : "Rejected"}
                </Text>
                
              </TouchableOpacity>
              {consultation.status === "pending" && (
    <TouchableOpacity onPress={() => handleDelete(consultation.id)}>
      <Text style={styles.deleteButtonText}>Delete Now</Text>
    </TouchableOpacity>
  )}
              </View>
              <Text style={styles.doctorAddress}>
                Address: {consultation.doctor?.address || "No address available"}
              </Text>
              <TouchableOpacity onPress={() => goToDoctorMap(consultation?.doctor)}>
                  <Text style={styles.map}>View on Map</Text>
                </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    width: 150,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    paddingHorizontal: 8,
  },
  imageStyle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  deleteButtonText: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    backgroundColor: '#8E44AD', // A soft purple color
    color: 'white', // Text color for better contrast
  },  
  buttonContainer: {
    flexDirection: "row",  // Align items horizontally
    alignItems: "center",  // Vertically center the items
    justifyContent: "flex-start",  // Align items to the left (or change to 'space-between' for even distribution)
    gap: 10,  // Optional: Add space between buttons if needed
  },
  statusButton: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 120, // Adjust width as needed
  },

  statusButtonText: {
    color: "#000", // Text color, black for contrast
    fontWeight: "bold",
    fontSize: 14,
  },
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
  searchInput: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#0F9BAE',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E1F6FB',
    borderRadius: 30,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: 'relative', // Ensure the button is positioned relative to the banner
  },

  bannerButton: {
    backgroundColor: '#0F9BAE',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    position: 'absolute', // Position the button absolutely
    top: 10, // Adjust top distance from the banner
    right: 10, // Adjust right distance from the banner
  },

  bannerButtonText: {
    fontSize: 12, // Smaller text for the button
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  appointment: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#004b8d", // Dark blue for appointment dATE
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6b00b3", // Dark blue for doctor name
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
    marginBottom: 10,
    marginTop: 50,
    color: 'black', // Set the text color to black
    fontStyle: 'italic', // Optional: Make it italic like a "PS" note
    fontSize: 18, // Optional: Adjust the font size for emphasis
  },
  link: {
    color: 'blue', // Blue color to make the URL stand out as a link
    textDecorationLine: 'underline', // Add underline to make it look like a hyperlink
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 60,
  },
  textWithDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%", // Ensure enough space for both elements
  },
  psText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // You can customize this color
  },
  dropdownButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginLeft: 10, // Add some space between the text and button
  },
  dropdownButtonText: {
    fontSize: 12, // Smaller text for the button
    color: "#000000", // White text color
    fontWeight: "bold", // Make the text bold
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    width: 150,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  map: {
    fontSize: 14,
    color: "#a6a6a6",
    fontWeight: "bold",
    marginTop: 7,
    textAlign: "left",
  },
});

export default AppointmentsScreen;
