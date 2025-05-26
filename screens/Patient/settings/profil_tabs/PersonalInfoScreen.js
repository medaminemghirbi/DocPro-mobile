import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../../../services/apiConfig";


const PersonalInfoScreen = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("currentUser");
        const storedToken = await AsyncStorage.getItem("authToken");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setFirstname(userData.firstname || "");
          setLastname(userData.lastname || "");
          setBirthday(userData.birthday || "");
        }
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  const updateBackend = async (key, value) => {
    if (!user || !token) return;
    try {
      await axios.patch(
        `${API_BASE_URL}/api/mobile/update_settings`,
        {
          id: user.id,
          [key]: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(`Error updating ${key} to backend:`, error);
    }
  };

  const handleSave = async () => {
    const updatedUser = {
      ...user,
      firstname,
      lastname,
      birthday,
    };

    try {
      await AsyncStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Update backend
      await updateBackend("firstname", firstname);
      await updateBackend("lastname", lastname);
      await updateBackend("birthday", birthday);

      alert("Personal information saved successfully.");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save user data.");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setBirthday(formattedDate);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="First Name"
        style={styles.input}
        value={firstname}
        onChangeText={setFirstname}
      />
      <TextInput
        placeholder="Last Name"
        style={styles.input}
        value={lastname}
        onChangeText={setLastname}
      />

      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.datePickerText}>
          {birthday || "Select Birthday"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={birthday ? new Date(birthday) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Personal Info</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  datePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: "center",
  },
  datePickerText: {
    fontSize: 16,
    color: "#333",
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

export default PersonalInfoScreen;
