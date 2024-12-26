// SettingsScreen.js
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomLoader from "../../../components/CustomLoader";
import { Switch } from "react-native-paper";
const SettingsScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await AsyncStorage.getItem('currentUser');
        const userData = JSON.parse(currentUser);
        setUser(userData); // Store user data in state
        console.log(userData)
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomLoader />
      </View>
    );
  }
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
          {user && user.user_image_url_mobile ? (
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
      <ScrollView style={styles.content}>
        {/* Privacy Section */}
        <View style={styles.privacySection}>
          <Ionicons name="lock-closed" size={32} color="#007AFF" />
          <Text style={styles.privacyTitle}>Your health. Your data.</Text>
          <Text style={styles.privacySubtitle}>Your privacy is our top priority.</Text>
          <TouchableOpacity>
            <Text style={styles.link}>Learn how we protect your privacy</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal information</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("MyProfilInformation")}
            style={styles.item}
          >
            <FontAwesome5 name="user-circle" size={24} color="#007AFF" />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>My profile</Text>
              <Text style={styles.itemSubtitle}>{user.lastname} {user.firstname.toUpperCase()}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#B0B0B0" style={styles.rightIcon} />
          </TouchableOpacity>
        </View>

        {/* Login Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentification </Text>
          <TouchableOpacity style={styles.item}>
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
            <Ionicons name="notifications-outline"  size={24} color="#007AFF" />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Notification Settings</Text>
              <Text style={styles.itemSubtitle}>
                {user.phone_number ? `+216${user.phone_number}` : "No phone number provided"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#B0B0B0" style={styles.rightIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("UpdatePhoneScreen")}
            style={styles.item}
          >
            <Ionicons name="call" size={24} color="#007AFF" />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Phone</Text>
              <Text style={styles.itemSubtitle}>
                {user.phone_number ? `+216${user.phone_number}` : "No phone number provided"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#B0B0B0" style={styles.rightIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <Ionicons name="lock-closed" size={24} color="#007AFF" />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Password</Text>
              <Text style={styles.itemSubtitle}>********</Text>
            </View>
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemContent: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  checkboxGroup: {
    marginTop: 10,
  },
  checkboxItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  privacySection: {
    backgroundColor: '#E6F7FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  privacySubtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  link: {
    color: '#007AFF',
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemContent: {
    marginLeft: 10,
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  verified: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 5,
  },
  safeArea: {
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
});

export default SettingsScreen;
