import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../services/apiConfig";
import CustomLoader from "../../components/CustomLoader";

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const goToDoctorMap = (doctor) => {
    navigation.navigate("Maps", { doctor });
  };

  const fetchUserData = async () => {
    try {
      const currentUser = await AsyncStorage.getItem("currentUser");
      const userData = JSON.parse(currentUser);
      console.log(userData)
      setUser(userData);
      const userId = await AsyncStorage.getItem("id");
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const response = await fetch(
          `${API_BASE_URL}/api/mobile/patient_consultations_today/${userId}`,
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
        }
      }
    } catch (error) {
      console.error("Error fetching user data or consultations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData();
  }, []);

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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.textContainer}>
            <Text style={styles.headerGreeting}>
              Hi, {user?.firstname} {user?.lastname}!
            </Text>
            <Text style={styles.headerQuestion}>How are you today?</Text>
          </View>
          {user?.user_image_url_mobile ? (
            <Image
              source={{ uri: user.user_image_url_mobile }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>No Image</Text>
            </View>
          )}
        </View>
      </SafeAreaView>

      <Text style={styles.sectionTitle}>Today's Consultations:</Text>
      <Text style={styles.sectionDate}>{todayDate}</Text>

      {consultations.length > 0 && (
        <Text style={[styles.doctorRating, styles.psText]}>
          PS: For online consultations, please visit{" "}
          <Text style={styles.link}>DermaPro.tn</Text>
        </Text>
      )}

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {consultations.length > 0 ? (
          consultations.map((consultation, index) => (
            <View key={index} style={styles.recommendationCard}>
              <Image
                source={{
                  uri:
                    consultation.doctor.user_image_url_mobile ||
                    "https://via.placeholder.com/80",
                }}
                style={styles.doctorImage}
              />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>
                  Dr. {consultation.doctor.firstname}{" "}
                  {consultation.doctor.lastname}
                </Text>
                <Text style={styles.doctorSpecialty}>
                  at{" "}
                  {new Date(consultation.appointment).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </Text>
                <Text style={styles.doctorSpecialty}>
                  {consultation.appointment_type}
                </Text>
                <Text style={styles.doctorRating}>
                  {consultation.doctor.address}
                </Text>
                <TouchableOpacity
                  onPress={() => goToDoctorMap(consultation.doctor)}
                >
                  <Text style={styles.mapLink}>View on Map</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.no_upcoming}>
            <Image
              source={require("../../assets/images/calendar.png")}
              style={styles.image}
            />
            <Text style={styles.title}>No upcoming appointments</Text>
            <Text style={styles.description}>
              Take charge of your skin health. Easily book your next appointment
              through DemraPro.
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
    backgroundColor: "#E8F5FE",
  },
  safeArea: {
    backgroundColor: "#0F9BAE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "#0F9BAE",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  textContainer: {
    flex: 1,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  profileImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageText: {
    color: "#fff",
    fontSize: 10,
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#004b8d",
  },
  sectionDate: {
    marginHorizontal: 20,
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#004b8d",
  },
  psText: {
    marginHorizontal: 20,
    fontSize: 12,
    color: "#0F9BAE",
    marginBottom: 10,
  },
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
  recommendationCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
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
    borderRadius: 40,
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: "center",
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F9BAE",
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  doctorRating: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  mapLink: {
    marginTop: 6,
    color: "#007bff",
    fontSize: 14,
    fontWeight: "600",
  },
  no_upcoming: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002147',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default HomeScreen;
