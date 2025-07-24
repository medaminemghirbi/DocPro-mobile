// SettingsScreen.js
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
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomLoader from "../../../components/CustomLoader";
import { API_BASE_URL } from "../../../services/apiConfig";
import axios from 'axios';

const SettingsScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const languageNames = {
    fr: "Français",
    ar: "العربية",
    en: "Anglais",
  };

  const fetchUserData = async () => {
    try {
      const currentUser = await AsyncStorage.getItem("currentUser");
      const token = await AsyncStorage.getItem("token");
      const userData = JSON.parse(currentUser);
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data", error);
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

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/sign_out`, {
        headers: {
          Authorization: `Bearer ${token}`,
      },
      });
  
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      console.error('Logout error:', e.response?.data || e.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomLoader />
      </View>
    );
  }

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

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal information</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("MyProfilInformationScreen")}
            style={styles.item}
          >
            <FontAwesome5 name="user-circle" size={24} color="#007AFF" />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>My profile</Text>
              <Text style={styles.itemSubtitle}>
                {user?.lastname} {user?.firstname?.toUpperCase?.() || ""}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#B0B0B0"
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Authentication Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentification</Text>
          <TouchableOpacity
            style={[styles.item, styles.locked]}
            disabled={true}
          >
            <MaterialIcons name="email" size={24} color="#007AFF" />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Email</Text>
              <Text style={styles.itemSubtitle}>{user.email}</Text>
              {user.email_confirmed && (
                <Text style={styles.verified}>Verified</Text>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("UpdateNotificationScreen")}
            style={styles.item}
          >
            <Ionicons name="notifications-outline" size={24} color="#007AFF" />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Notification Settings</Text>
              <Text style={styles.itemSubtitle}>
                Update Your Notifications System
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#B0B0B0"
              style={styles.rightIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}
          onPress={() => navigation.navigate("UpdatePasswordScreen")}
          >
            <Ionicons name="lock-closed" size={24} color="#007AFF" />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Password</Text>
              <Text style={styles.itemSubtitle}>********</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#B0B0B0"
              style={styles.rightIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemContent: {
    marginLeft: 10,
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#555",
  },
  verified: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
  safeArea: {
    backgroundColor: "#0F9BAE",
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
    color: "#555",
  },
  content: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    height: 40,
    width: "100%",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff3b30",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 15,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  
});

export default SettingsScreen;
