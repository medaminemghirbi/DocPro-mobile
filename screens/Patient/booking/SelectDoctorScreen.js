import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../../services/apiConfig";
import CustomLoader from "../../../components/CustomLoader";

const { width, height } = Dimensions.get('window');

const SelectDoctorScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
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
      {/* Header Banner */}
      <View style={styles.bannerContainer}>
        <View style={styles.banner}>
          <View style={styles.textContainer}>
            <Text style={styles.bannerText}>
              Réservez avec le meilleur dermatologue à {user.location}
            </Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un docteur..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={18} color="#888" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Image
            source={require("../../../assets/images/doctor-1.png")}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Professionnels disponibles</Text>
        <Text style={styles.sectionDate}>{todayDate}</Text>

        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={styles.recommendationCard}
              onPress={() => goToDoctorMap(doctor)}
              activeOpacity={0.9}
            >
              <Image
              onPress={() => navigation.navigate("DoctorDetailsScreen", { doctorId: doctor.id })}
                source={{
                  uri: doctor?.user_image_url_mobile ||
                    "https://via.placeholder.com/80",
                }}
                style={styles.doctorImage}
              />
              <View style={styles.doctorInfo}>
                <View style={styles.nameVerificationContainer}>
                  <Text 
                  onPress={() => navigation.navigate("DoctorDetailsScreen", { doctorId: doctor.id })}
                  style={styles.doctorName}>
                    Dr. {doctor.firstname} {doctor.lastname}
                  </Text>
                  {!doctor.is_archived && (
                    <FontAwesome 
                      name="check-circle" 
                      size={16} 
                      color="#4CAF50" 
                      style={styles.verificationIcon} 
                    />
                  )}
                </View>
                
                <Text style={styles.doctorSpecialty}>
                  Dermatologue
                </Text>
                
                <View style={styles.addressContainer}>
                  <FontAwesome name="map-marker" size={14} color="#1a1a1a" />
                  <Text style={styles.address}>
                    {doctor.address
                      ? (() => {
                          const words = doctor.address.split(" ");
                          const firstLine = words.slice(0, 2).join(" ");
                          const secondLine = words.slice(2).join(" ");
                          return `${firstLine}\n${secondLine}`;
                        })()
                      : "Adresse non disponible"}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.mapButton}
                  onPress={() => goToDoctorMap(doctor)}
                >
                  <Text style={styles.mapText}>Voir sur la carte</Text>
                </TouchableOpacity>

                <View style={styles.statusContainer}>
                  <View style={styles.statusItem}>
                    <FontAwesome 
                      name="wifi" 
                      size={14} 
                      color={doctor.working_on_line ? "#4CAF50" : "#FF5252"} 
                    />
                    <Text style={[
                      styles.statusText,
                      { color: doctor.working_on_line ? "#4CAF50" : "#FF5252" }
                    ]}>
                      {doctor.working_on_line ? "Disponible en ligne" : "Non disponible en ligne"}
                    </Text>
                  </View>
                  
                  <View style={styles.statusItem}>
                    <FontAwesome 
                      name="calendar" 
                      size={14} 
                      color={doctor.working_saturday ? "#4CAF50" : "#FF5252"} 
                    />
                    <Text style={[
                      styles.statusText,
                      { color: doctor.working_saturday ? "#4CAF50" : "#FF5252" }
                    ]}>
                      {doctor.working_saturday ? "Ouvert le samedi" : "Fermé le samedi"}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => navigation.navigate("SelectDate", { doctorId: doctor.id })}
                >
                  <Text style={styles.selectButtonText}>Choisir ce médecin</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <FontAwesome name="search" size={40} color="#888" />
            <Text style={styles.noConsultationsText}>
              Aucun médecin trouvé pour votre recherche.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  bannerContainer: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1F6FB',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  bannerText: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#0F9BAE',
    marginBottom: 15,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  bannerImage: {
    width: width * 0.25,
    height: width * 0.25,
  },
  sectionTitle: {
    paddingHorizontal: width * 0.05,
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
  },
  sectionDate: {
    paddingHorizontal: width * 0.05,
    fontSize: 14,
    marginBottom: 15,
    color: "#7F8C8D",
  },
  recommendationCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: width * 0.05,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  doctorInfo: {
    flex: 1,
  },
  nameVerificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  verificationIcon: {
    marginLeft: 6,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  address: {
    fontSize: 13,
    color: "#555",
    marginLeft: 6,
    lineHeight: 18,
  },
  mapButton: {
    marginBottom: 8,
  },
  mapText: {
    fontSize: 13,
    color: "#0F9BAE",
    fontWeight: "500",
    textDecorationLine: 'underline',
  },
  statusContainer: {
    marginVertical: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  selectButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#0F9BAE",
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  selectButtonText: {
    color: "#0F9BAE",
    fontWeight: "600",
    fontSize: 14,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noConsultationsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#7F8C8D",
    marginTop: 15,
    lineHeight: 24,
  },
});

export default SelectDoctorScreen;