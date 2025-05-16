import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  Switch,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../../services/apiConfig";
import { useNavigation } from "@react-navigation/native";

const UpdateNotificationScreen = () => {
  const [isSMSable, setIsSMSable] = useState(false);
  const [isEmailable, setIsEmailable] = useState(false);
  const [isNotifiable, setIsNotifiable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const navigation = useNavigation();

  const loadPreferences = async () => {
    try {
      const userString = await AsyncStorage.getItem("currentUser");
      if (userString) {
        const user = JSON.parse(userString);
        setIsSMSable(user.is_smsable);
        setIsEmailable(user.is_emailable);
        setIsNotifiable(user.is_notifiable);
      }
    } catch (error) {
      console.error("Error loading notification preferences:", error);
      Alert.alert("Error", "Failed to load notification preferences");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
        // Load phone number from AsyncStorage
        const fetchUserPhone = async () => {
          try {
            const userData = await AsyncStorage.getItem("currentUser");
            if (userData) {
              const user = JSON.parse(userData);
              if (user.phone_number) {
                setPhoneNumber(user.phone_number);
                setIsUpdating(true);
              }
            }
          } catch (error) {
            console.error("Error loading user data:", error);
          }
        };
    
    fetchUserPhone();
    loadPreferences();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadPreferences();
  };
  const handleSavePhoneNumber = async () => {
    if (phoneNumber.length !== 8) {
      Alert.alert("Error", "Please enter a valid 8-digit phone number.");
      return;
    }

    try {
      // Save phone number in AsyncStorage
      const userData = await AsyncStorage.getItem("currentUser");
      let user = userData ? JSON.parse(userData) : {};
      user.phone_number = phoneNumber;
      await AsyncStorage.setItem("currentUser", JSON.stringify(user));

      // API request to update the phone number
      const userId = user.id; // Assuming user.id is available
      const data = { phone_number: phoneNumber };
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}/update_phone_number`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();
      console.log(responseJson)
      if (responseJson) {
        // Update AsyncStorage with the updated user data from the API response
        await AsyncStorage.setItem("currentUser", JSON.stringify(responseJson)); // Assuming responseJson.user contains updated user data

        Alert.alert("Success", isUpdating ? "Phone number updated!" : "Phone number added!");
        navigation.navigate("SettingsScreen");

      } else {
        Alert.alert("Error", responseJson.message || "Failed to update phone number.");
      }
    } catch (error) {
      console.error("Error saving phone number:", error);
      Alert.alert("Error", "There was an issue updating the phone number.");
    }
  };
  const updatePreference = async (key, value, setLocalState) => {
    try {
      setLocalState(value); // Optimistic update
      const userString = await AsyncStorage.getItem("currentUser");
      if (!userString) return;
      const user = JSON.parse(userString);
      const token = await AsyncStorage.getItem("authToken");

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

      const updatedUser = {
        ...user,
        [key]: value,
      };
      await AsyncStorage.setItem("currentUser", JSON.stringify(updatedUser));
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
      setLocalState((prev) => !prev); // Revert
      Alert.alert("Error", `Failed to update ${key} setting`);
    }
  };

  const toggleSMS = (value) => {
    updatePreference("is_smsable", value, setIsSMSable);
  };

  const toggleEmail = (value) => {
    updatePreference("is_emailable", value, setIsEmailable);
  };

  const toggleSystem = (value) => {
    updatePreference("is_notifiable", value, setIsNotifiable);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#1E90FF"]}
          tintColor="#1E90FF"
        />
      }
    >
      <View style={styles.content}>
        <Text style={styles.itemTitle}>DermaPro Notifications</Text>

        {/* SMS Notifications */}
        <View style={styles.checkboxItem}>
          <Text style={styles.checkboxLabel}>Activer les Notifications par SMS</Text>
          <Switch value={isSMSable} onValueChange={toggleSMS} />
        </View>

        {/* Conditionally show phone management link */}
        {isSMSable && (
          <View style={styles.container}>
            <Text style={styles.title}>Phone Number Management</Text>
            <Text style={styles.subtitle}>
              {isUpdating ? "Update your phone number below." : "Add your phone number."}
            </Text>

            {/* Phone Number Input with +216 prefix and separator */}
            <View style={styles.inputContainer}>
              <Text style={styles.prefix}>+216</Text>
              <View style={styles.separator} />
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                maxLength={8}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.button} onPress={handleSavePhoneNumber}>
              <Text style={styles.buttonText}>{isUpdating ? "Update" : "Add New Phone Number"}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Email Notifications */}
        <View style={styles.checkboxItem}>
          <Text style={styles.checkboxLabel}>Activer les Notifications par Email</Text>
          <Switch value={isEmailable} onValueChange={toggleEmail} />
        </View>

        {/* System Notifications */}
        <View style={styles.checkboxItem}>
          <Text style={styles.checkboxLabel}>Activer les Notifications Système</Text>
          <Switch value={isNotifiable} onValueChange={toggleSystem} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F9BAE",
    marginBottom: 10,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 14,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    marginBottom: 20,
  },
  prefix: {
    fontSize: 18,
    color: "#0F9BAE",
    marginRight: 8,
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: "#DDD",
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#555",
  },
  button: {
    backgroundColor: "#0F9BAE",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "flex-start",
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  content: {
    padding: 15,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  checkboxItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
  },
  phoneManagementLink: {
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#e6f7ff",
    borderRadius: 8,
  },
  phoneManagementText: {
    color: "#0F9BAE",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default UpdateNotificationScreen;
