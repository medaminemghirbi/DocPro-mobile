// DoctorDetailsScreen.js
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { API_BASE_URL } from "../../../services/apiConfig";
import CustomLoader from "../../../components/CustomLoader";

const { width } = Dimensions.get("window");

const DoctorDetailsScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [expandedServiceIndex, setExpandedServiceIndex] = useState(null);

  const doctorId = route.params?.doctorId;

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/mobile/doctor_details/${doctorId}`
        );
        setDoctorInfo(response.data || null);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  const getPersonalPhone = () => {
    return doctorInfo?.phone_numbers?.find(
      (phone) => phone.phone_type === "personal"
    );
  };

  const handleCall = () => {
    const personalPhone = getPersonalPhone();
    if (personalPhone?.number) {
      Linking.openURL(`tel:${personalPhone.number}`);
    } else {
      Alert.alert("Erreur", "Numéro de téléphone personnel non disponible.");
    }
  };

  const handleWhatsApp = () => {
    const personalPhone = getPersonalPhone();
    if (personalPhone?.number) {
      const phoneNumberInternational = personalPhone.number.replace(
        /[^\d]/g,
        ""
      );
      const url = `whatsapp://send?phone=${phoneNumberInternational}`;
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            "Erreur",
            "WhatsApp n’est pas installé sur cet appareil."
          );
        }
      });
    } else {
      Alert.alert("Erreur", "Numéro de téléphone personnel non disponible.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <CustomLoader />
      </View>
    );
  }

  if (!doctorInfo) {
    return (
      <View style={styles.centered}>
        <Text>Informations du médecin non disponibles.</Text>
      </View>
    );
  }
  function RatingStars({ rating }) {
    // Create an array of length rating, fill with anything (e.g. 0) and map over it
    return (
      <>
        {[...Array(rating)].map((_, i) => (
          <FontAwesome key={i} name="star" size={16} color="#FFD700" />
        ))}
      </>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}></View>

      <View style={styles.profileContainer}>
        <Image
          source={{
            uri:
              doctorInfo.user_image_url_mobile ||
              "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />

        <View style={styles.contactIcons}>
          <TouchableOpacity style={styles.iconCircle} onPress={handleCall}>
            <FontAwesome name="phone" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircleLight}
            onPress={handleWhatsApp}
          >
            <FontAwesome name="comment" size={18} color="#555" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>
          Dr. {doctorInfo.firstname} {doctorInfo.lastname}
        </Text>
        <Text style={styles.specialty}>
          {doctorInfo.specialization || "Spécialiste"}
        </Text>
        <Text style={styles.rating}>
          <FontAwesome name="star" size={16} color="#FFD700" />{" "}
          {doctorInfo.ratings && doctorInfo.ratings.length > 0
            ? (
                doctorInfo.ratings.reduce((sum, r) => sum + r.rating_value, 0) /
                doctorInfo.ratings.length
              ).toFixed(1)
            : "N/A"}{" "}
          ({doctorInfo.ratings?.length || 0}{" "}
          {doctorInfo.ratings?.length === 1 ? "review" : "reviews"})
        </Text>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            navigation.navigate("SelectDate", { doctorId: doctorInfo.id })
          }
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardSection}>
        <InfoCard
          title="Personal Information"
          icon="user"
          expanded={expandedCard === "personal"}
          onPress={() =>
            setExpandedCard(expandedCard === "personal" ? null : "personal")
          }
        >
          <View style={styles.expandedContent}>
            <Text>Gender: {doctorInfo.gender || "N/A"}</Text>
            <Text>Civil Status: {doctorInfo.civil_status || "N/A"}</Text>
            <Text>Birthday: {doctorInfo.birthday || "N/A"}</Text>
          </View>
        </InfoCard>

        <InfoCard
          title="Working Address"
          icon="map-marker"
          expanded={expandedCard === "address"}
          onPress={() =>
            setExpandedCard(expandedCard === "address" ? null : "address")
          }
        >
          <View style={styles.expandedContent}>
            <Text>{doctorInfo.address || "Non disponible"}</Text>
          </View>
        </InfoCard>

        {doctorInfo.merged_services &&
          doctorInfo.merged_services.length > 0 && (
            <InfoCard
              title="Services & Tarifs"
              icon="briefcase"
              expanded={expandedCard === "services"}
              onPress={() => {
                setExpandedCard(
                  expandedCard === "services" ? null : "services"
                );
                setExpandedServiceIndex(null); // close any open service desc
              }}
            >
              <View style={styles.tableWrapper}>
                <View style={styles.tableHeader}>
                  <Text
                    style={[{ flex: 2, fontWeight: "bold" }, styles.tableCell]}
                  >
                    Service
                  </Text>
                  <Text
                    style={[{ flex: 1, fontWeight: "bold" }, styles.tableCell]}
                  >
                    Tarif
                  </Text>
                  <Text style={{ width: 30 }}></Text>
                </View>

                {doctorInfo.merged_services.map((service, index) => {
                  const isServiceExpanded = expandedServiceIndex === index;

                  return (
                    <View key={service.id || index}>
                      <View style={styles.tableRow}>
                        <Text style={[{ flex: 2 }, styles.tableCell]}>
                          {service.name}
                        </Text>
                        <Text
                          style={[
                            { flex: 1, color: "#0F9BAE" },
                            styles.tableCell,
                          ]}
                        >
                          {service.price}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            setExpandedServiceIndex(
                              isServiceExpanded ? null : index
                            )
                          }
                        >
                          <FontAwesome
                            name={isServiceExpanded ? "eye-slash" : "eye"}
                            size={18}
                            color="#555"
                          />
                        </TouchableOpacity>
                      </View>
                      {isServiceExpanded && (
                        <View
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          <Text style={{ fontSize: 13, color: "#555" }}>
                            {service.description}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </InfoCard>
          )}
        {doctorInfo.ratings && doctorInfo.ratings.length > 0 ? (
          doctorInfo.ratings.map((r, index) => (
            <View
              key={r.id || index}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <Image
                source={{
                  uri:
                    r.consultation?.patient?.user_image_url_mobile ||
                    "https://via.placeholder.com/40x40.png?text=User",
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 10,
                  backgroundColor: "#eee",
                }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "bold" }}>
                  {r.consultation?.patient?.firstname || "Inconnu"}{" "}
                  {r.consultation?.patient?.lastname || ""}
                </Text>
                <Text style={{ color: "#555" }}>
                  <RatingStars rating={r.rating_value} />{" "}
                  {r.comment || "Aucun commentaire"}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ marginLeft: 10, fontStyle: "italic" }}>
            Aucun commentaire disponible.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const InfoCard = ({ title, icon, onPress, expanded, children }) => (
  <View style={styles.infoCardWrapper}>
    <TouchableOpacity style={styles.infoCard} onPress={onPress}>
      <View style={styles.infoCardLeft}>
        <FontAwesome name={icon} size={18} color="#0F9BAE" />
        <Text style={styles.infoCardText}>{title}</Text>
      </View>
      <FontAwesome
        name={expanded ? "angle-up" : "angle-down"}
        size={18}
        color="#aaa"
      />
    </TouchableOpacity>
    {expanded && <View style={styles.infoCardExpanded}>{children}</View>}
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#0F9BAE",
    height: 100,
    justifyContent: "flex-end",
    padding: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: "#000",
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
    textAlign: "center",
  },
  profileContainer: {
    alignItems: "center",
    padding: 20,
    marginTop: -40,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
  contactIcons: {
    flexDirection: "row",
    marginVertical: 10,
    gap: 20,
  },
  iconCircle: {
    backgroundColor: "#0F9BAE",
    borderRadius: 20,
    padding: 10,
  },
  iconCircleLight: {
    backgroundColor: "#eee",
    borderRadius: 20,
    padding: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: "#2C3E50",
  },
  specialty: {
    fontSize: 16,
    color: "#7F8C8D",
    marginTop: 5,
  },
  rating: {
    marginTop: 5,
    fontSize: 14,
    color: "#7F8C8D",
  },
  bookButton: {
    backgroundColor: "#0F9BAE",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cardSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 20,
  },
  infoCardWrapper: {
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  infoCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoCardText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2C3E50",
  },
  infoCardExpanded: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  expandedContent: {
    gap: 6,
  },
  tableWrapper: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 8,
    backgroundColor: "#fff",
  },
  tableCell: {
    paddingHorizontal: 4,
  },
});

export default DoctorDetailsScreen;
