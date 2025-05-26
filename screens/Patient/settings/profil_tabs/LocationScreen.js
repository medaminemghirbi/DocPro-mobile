import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../../../services/apiConfig";

// Replace with your actual API base URL

const LocationScreen = () => {
  const [location, setLocation] = useState("");
  const [locationList, setLocationList] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("currentUser");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setLocation(userData.location || "");
        }

        const response = await axios.get(`${API_BASE_URL}/api/v1/all_locations`);
        setLocationList(response.data);
      } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert("Error", "Failed to load location data.");
      }
    };

    loadData();
  }, []);

  const handleSave = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("currentUser");

  
      if (storedUser) {
        const userData = JSON.parse(storedUser);
  
        const updatedUser = {
          ...userData,
          location,
        };
  
        await AsyncStorage.setItem("currentUser", JSON.stringify(updatedUser));
  
        const response = await axios.patch(
          `${API_BASE_URL}/api/mobile/update_settings`,
          {
            id: userData.id,
            location: location,
          }
        );
  
        Alert.alert("Success", "Location updated successfully.");
      } else {
        Alert.alert("Error", "Missing user data or token.");
      }
    } catch (error) {
      console.error("Error saving location:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to update location.");
    }
  };
  
  return (
    <View style={styles.tabContainer}>
      <Text style={styles.label}>Select Location:</Text>

      <Picker
        selectedValue={location}
        style={styles.picker}
        onValueChange={(itemValue) => setLocation(itemValue)}
      >
        {locationList.map((loc) => (
          <Picker.Item
            key={loc}
            label={loc.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            value={loc}
          />
        ))}
      </Picker>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  picker: {
    height: 50,
    marginBottom: 20,
    borderColor: "#CCC",
    borderWidth: 1,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#0F9BAE",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LocationScreen;
