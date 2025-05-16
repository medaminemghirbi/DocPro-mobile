import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../../services/apiConfig";
import CustomLoader from "../../../components/CustomLoader";
import { FontAwesome } from "@expo/vector-icons";

const SelectDoctorScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const goToDoctorMap = (doctor) => {
    navigation.navigate('Maps', { doctor });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await AsyncStorage.getItem("currentUser");
        const userData = JSON.parse(currentUser);
        setUser(userData);
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const response = await fetch(
            `${API_BASE_URL}/api/mobile/doctor_list/${userData.location}`,
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
        console.error("Error fetching user data or consultations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = consultations.filter((doctor) =>
        doctor.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.lastname.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(consultations);
    }
  }, [searchQuery, consultations]);

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomLoader />
      </View>
    );
  }

  const todayDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <View style={styles.banner}>
          <View style={styles.textContainer}>
            <Text style={styles.bannerText}>
              Reserver Avec le meilleur dermatologue à {user.location}
            </Text>
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Text style={styles.bannerButtonText}>Trouver Un Docteur</Text>
            </TouchableOpacity>
            {isSearchVisible && (
              <TextInput
                style={styles.searchInput}
                placeholder="Search by doctor name"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            )}
          </View>
          <Image
            source={require("../../../assets/images/doctor-1.png")}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>
      </View>
      <ScrollView>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={styles.recommendationCard}
              onPress={() => goToDoctorMap(doctor)}
            >
              <Image
                source={{
                  uri: doctor?.user_image_url_mobile ||
                    "https://via.placeholder.com/80",
                }}
                style={styles.doctorImage}
              />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>
                  Dr. {doctor.firstname} {doctor.lastname}{" "}
                  {!(doctor.is_archived) ? <FontAwesome name="check-circle" size={16} color="#4CAF50" /> : null}

                </Text>
                <Text style={styles.doctorSpecialty}>
                  Med Doctor Dermalogoue, TN
                </Text>
                <Text style={styles.address}>
                <FontAwesome name="map-marker" size={16} color="#1a1a1a" />{" "}
                {doctor.address
                  ? (() => {
                      const words = doctor.address.split(" ");
                      const firstLine = words.slice(0, 2).join(" "); // First two words
                      const secondLine = words.slice(2).join(" ");  // Remaining words
                      return `${firstLine}\n${secondLine}`;
                    })()
                  : "N/A"}
              </Text>


              <TouchableOpacity onPress={() => goToDoctorMap(doctor)}>
                <Text style={styles.map}>View on Map</Text>
              </TouchableOpacity>

                <Text style={styles.online}>
                  {doctor.working_on_line ? (
                    <Text style={[{ color: "green" }]}>
                      <FontAwesome name="wifi" size={16} color="#4CAF50" />
                      Available Online</Text>
                  ) : (
                    <Text style={[{ color: "red" }]}>
                      <FontAwesome name="close" size={16} color="red" />
                      Not Available Online
                    </Text>
                  )}
                </Text>

                <Text style={styles.online}>
                  {doctor.working_saturday ? (
                    <Text style={[{ color: "green" }]}>
                      <FontAwesome name="calendar" size={16} color="#4CAF50" />
                      Working on saturday</Text>
                  ) : (
                    <Text style={[{ color: "red" }]}>
                      <FontAwesome name="close" size={16} color="red" />
                      Closed on saturday
                    </Text>
                  )}
                </Text>

                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => navigation.navigate("SelectDate", { doctorId: doctor.id })}
                >
                  <Text style={styles.buttonText}>Select Doctor</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noConsultationsText}>
            No doctors found matching your search.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  psText: {
    marginHorizontal: 20,
    fontSize: 18,
    marginBottom: 10,
    marginTop: 50,
    color: 'black', // Set the text color to black
    fontStyle: 'italic', // Optional: Make it italic like a "PS" note
    fontSize: 18, // Optional: Adjust the font size for emphasis
  },
  map: {
    fontSize: 14,
    color: "#a6a6a6",
    fontWeight: "bold",
    marginTop: 7,
    textAlign: "left",
  },
  online: {
    fontSize: 14,
    color: "#4da6ff",
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "left",
  },
  selectButton: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#00C9A7",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#ffffff", // White background for better readability
    borderRadius: 10, // Rounded corners for modern design
    marginVertical: 10, // Space between cards
    marginHorizontal: 20,
    padding: 15, // Space inside the card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  doctorImage: {
    width: 80, // Fixed size for uniformity
    height: 80,
    borderRadius: 40, // Circular image
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1, // Allow flexible width
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // Neutral color for contrast
    marginBottom: 5,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#666", // Lighter gray for secondary text
    marginBottom: 10,
  },
  address: {
    fontSize: 13,
    color: "#888", // Subtle color for less critical information
    marginBottom: 5,
    lineHeight: 18, // Improved readability for multiline text
  },
  noConsultationsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999", // Neutral color
    marginTop: 20,
  },
  buttonText: {
    color: "#00C9A7", // Match theme
    fontWeight: "bold",
  },
});



export default SelectDoctorScreen;